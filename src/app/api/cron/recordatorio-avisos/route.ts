import { NextRequest, NextResponse } from "next/server";
import { DocumentReference, getFirestore, Timestamp, WriteResult } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import { getAdminApp } from "../../../../lib/firebaseAdmin";
import { TOPICS, NOTIFICATION_ICON_URL, NOTIFICATION_BADGE_URL } from "../../../../lib/fcm";

const UNA_HORA_MS = 60 * 60 * 1000;
// America/Mexico_City está fija en UTC-6 (sin DST) — ver la misma nota en
// notificacion-diaria/route.ts. Re-revisar si eso llega a cambiar.
const MX_OFFSET_MS = 6 * 60 * 60 * 1000;

// Este endpoint se dispara desde fuera de Vercel (GitHub Actions, cada ~15
// min) en vez de Vercel Cron: Hobby limita los cron jobs a una vez al día,
// insuficiente para detectar la ventana de "1 hora antes" de cada aviso.
// Ver .github/workflows/recordatorio-avisos.yml y la nota en CLAUDE.md.

// Convierte un instante UTC real a un Date "desplazado" cuyos getUTC*
// devuelven los componentes de hora local de Ciudad de México, y viceversa.
function aMexico(fechaUtc: Date): Date {
  return new Date(fechaUtc.getTime() - MX_OFFSET_MS);
}

function deMexicoAUtc(fechaMx: Date): Date {
  return new Date(fechaMx.getTime() + MX_OFFSET_MS);
}

function claveFechaMx(fechaMx: Date): string {
  const y = fechaMx.getUTCFullYear();
  const m = String(fechaMx.getUTCMonth() + 1).padStart(2, "0");
  const d = String(fechaMx.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// El cron corre cada ~15 min (ver nota arriba), así que el envío real puede
// caer en cualquier punto de la ventana de 1 hora, no justo a los 60 min.
function formatTiempoRestante(minutos: number): string {
  if (minutos >= 60) return "Comienza en menos de 1 hora.";
  if (minutos <= 1) return "Comienza en menos de 1 minuto.";
  return `Comienza en aproximadamente ${minutos} minutos.`;
}

interface RecordatorioPendiente {
  ref: DocumentReference;
  titulo: string;
  minutosRestantes: number;
  marcarEnviado: () => Promise<WriteResult>;
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const db = getFirestore(getAdminApp());
    const snapshot = await db.collection("avisos").get();

    const ahoraUtc = new Date();
    const ahoraMx = aMexico(ahoraUtc);

    const pendientes: RecordatorioPendiente[] = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const fecha = data.fecha as Timestamp | undefined;
      if (!fecha) continue;

      const fechaMx = aMexico(fecha.toDate());
      const horaEventoMx = fechaMx.getUTCHours();
      const minEventoMx = fechaMx.getUTCMinutes();
      // Sin hora específica ("todo el día") no hay un momento de "1 hora antes".
      if (horaEventoMx === 0 && minEventoMx === 0) continue;

      if (data.tipoProgramacion === "recurrente") {
        const dias = (data.diasRecurrentes as number[] | undefined) ?? [];
        if (!dias.includes(ahoraMx.getUTCDay())) continue;

        const ocurrenciaMx = new Date(
          Date.UTC(
            ahoraMx.getUTCFullYear(),
            ahoraMx.getUTCMonth(),
            ahoraMx.getUTCDate(),
            horaEventoMx,
            minEventoMx,
          ),
        );
        const msRestantes = deMexicoAUtc(ocurrenciaMx).getTime() - ahoraUtc.getTime();
        const claveHoy = claveFechaMx(ahoraMx);

        if (msRestantes > 0 && msRestantes <= UNA_HORA_MS && data.recordatorioFecha !== claveHoy) {
          pendientes.push({
            ref: docSnap.ref,
            titulo: data.titulo,
            minutosRestantes: Math.round(msRestantes / 60000),
            marcarEnviado: () => docSnap.ref.update({ recordatorioFecha: claveHoy }),
          });
        }
      } else {
        // "expira" / "permanente" / avisos previos a esta función (sin tipoProgramacion): una sola ocurrencia.
        const msRestantes = fecha.toDate().getTime() - ahoraUtc.getTime();

        if (msRestantes > 0 && msRestantes <= UNA_HORA_MS && data.recordatorioEnviado !== true) {
          pendientes.push({
            ref: docSnap.ref,
            titulo: data.titulo,
            minutosRestantes: Math.round(msRestantes / 60000),
            marcarEnviado: () => docSnap.ref.update({ recordatorioEnviado: true }),
          });
        }
      }
    }

    let enviados = 0;
    for (const item of pendientes) {
      try {
        await getMessaging(getAdminApp()).send({
          topic: TOPICS.avisos,
          notification: {
            title: `Recordatorio: ${item.titulo}`,
            body: formatTiempoRestante(item.minutosRestantes),
          },
          data: { avisoId: item.ref.id, link: "/" },
          webpush: {
            headers: { Urgency: "high" },
            notification: { icon: NOTIFICATION_ICON_URL, badge: NOTIFICATION_BADGE_URL },
            fcmOptions: { link: "/" },
          },
        });
        await item.marcarEnviado();
        enviados++;
      } catch (error) {
        console.error(`[cron/recordatorio-avisos] fallo con ${item.ref.id}`, error);
      }
    }

    return NextResponse.json({ ok: true, enviados });
  } catch (error) {
    console.error("[cron/recordatorio-avisos]", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
