import { NextRequest, NextResponse } from "next/server";
import { getMessaging } from "firebase-admin/messaging";
import { getAdminApp } from "../../../../lib/firebaseAdmin";
import { TOPICS, NOTIFICATION_ICON_URL, NOTIFICATION_BADGE_URL } from "../../../../lib/fcm";

// Recordatorio temporal para el equipo de closed testing de Play Store — deja de enviarse
// automáticamente después de esta fecha para no seguir llegando a la congregación real
// (este cron manda al topic "avisos", compartido con los suscriptores del sitio web).
const RECORDATORIO_TESTER_HASTA = new Date("2026-09-30T00:00:00-06:00");

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (new Date() > RECORDATORIO_TESTER_HASTA) {
    return NextResponse.json({ ok: true, skipped: "periodo de testing finalizado" });
  }

  try {
    await getMessaging(getAdminApp()).send({
      topic: TOPICS.avisos,
      notification: {
        title: "Es hora de revisar la aplicación",
        body: "Eres Tester",
      },
      data: { link: "/" },
      webpush: {
        headers: { Urgency: "high" },
        notification: { icon: NOTIFICATION_ICON_URL, badge: NOTIFICATION_BADGE_URL },
        fcmOptions: { link: "/" },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[cron/notificacion-diaria]", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
