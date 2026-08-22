import { NextRequest, NextResponse } from "next/server";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import { getAdminApp } from "../../../../lib/firebaseAdmin";
import { TOPICS } from "../../../../lib/fcm";
import { checkRateLimit } from "../../../../lib/rateLimit";

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
    const ref = db.doc(`avisos/${id}`);
    const snap = await ref.get();

    if (!snap.exists) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    const data = snap.data()!;
    const fechaCreacion = data.fechaCreacion as Timestamp | undefined;

    if (!fechaCreacion || Date.now() - fechaCreacion.toMillis() > MAX_AGE_MS) {
      return NextResponse.json({ error: "Aviso no es reciente" }, { status: 400 });
    }
    if (data.notificado === true) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    await getMessaging(getAdminApp()).send({
      topic: TOPICS.avisos,
      notification: {
        title: data.importante ? `⭐ ${data.titulo}` : data.titulo,
        body: data.descripcion,
      },
      data: { avisoId: id, link: "/" },
      webpush: { headers: { Urgency: "high" }, fcmOptions: { link: "/" } },
    });

    await ref.update({ notificado: true });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[avisos/notify]", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
