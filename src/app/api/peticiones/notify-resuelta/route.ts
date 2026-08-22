import { NextRequest, NextResponse } from "next/server";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import { getAdminApp } from "../../../../lib/firebaseAdmin";
import { TOPICS, NOTIFICATION_ICON_URL, NOTIFICATION_BADGE_URL } from "../../../../lib/fcm";
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
    const ref = db.doc(`peticiones/${id}`);
    const snap = await ref.get();

    if (!snap.exists) {
      return NextResponse.json({ error: "No encontrada" }, { status: 404 });
    }

    const data = snap.data()!;

    if (data.estado !== "resuelto") {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }

    const fechaResuelta = data.fechaResuelta as Timestamp | undefined;
    if (!fechaResuelta || Date.now() - fechaResuelta.toMillis() > MAX_AGE_MS) {
      return NextResponse.json({ error: "Resolución no es reciente" }, { status: 400 });
    }
    if (data.notificadoResuelta === true) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    await getMessaging(getAdminApp()).send({
      topic: TOPICS.peticiones,
      notification: {
        title: "✅ Petición Resuelta",
        body: "Una petición de oración fue marcada como resuelta.",
      },
      data: { peticionId: id, link: "/peticiones" },
      webpush: {
        headers: { Urgency: "high" },
        notification: { icon: NOTIFICATION_ICON_URL, badge: NOTIFICATION_BADGE_URL },
        fcmOptions: { link: "/peticiones" },
      },
    });

    await ref.update({ notificadoResuelta: true });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[peticiones/notify-resuelta]", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
