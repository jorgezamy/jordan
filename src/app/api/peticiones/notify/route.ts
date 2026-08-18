import { NextRequest, NextResponse } from "next/server";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import { getAdminApp } from "../../../../lib/firebaseAdmin";
import { checkRateLimit } from "../../../../lib/rateLimit";

const NOTIFY_TOPIC = "nuevas-peticiones";
const MAX_AGE_MS = 30_000;

export async function POST(req: NextRequest) {
  const { id } = await req.json();

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "id requerido" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await checkRateLimit(`notify:${ip}`, { max: 10, windowMs: 60_000 }))) {
    return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
  }

  try {
    const db = getFirestore(getAdminApp());
    const ref = db.doc(`peticiones/${id}`);
    const snap = await ref.get();

    if (!snap.exists) {
      return NextResponse.json({ error: "No encontrada" }, { status: 404 });
    }

    const data = snap.data()!;
    const fechaCreacion = data.fechaCreacion as Timestamp | undefined;

    if (!fechaCreacion || Date.now() - fechaCreacion.toMillis() > MAX_AGE_MS) {
      return NextResponse.json({ error: "Petición no es reciente" }, { status: 400 });
    }
    if (data.estado !== "pendiente") {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }
    if (data.notificado === true) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    await getMessaging(getAdminApp()).send({
      topic: NOTIFY_TOPIC,
      notification: {
        title: "Nueva petición de oración",
        body: data.nombre ? `${data.nombre} envió una petición nueva.` : "Se envió una petición nueva.",
      },
      data: { peticionId: id, link: "/peticiones" },
      webpush: { fcmOptions: { link: "/peticiones" } },
    });

    await ref.update({ notificado: true });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[peticiones/notify]", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
