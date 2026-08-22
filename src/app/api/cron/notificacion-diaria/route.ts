import { NextRequest, NextResponse } from "next/server";
import { getMessaging } from "firebase-admin/messaging";
import { getAdminApp } from "../../../../lib/firebaseAdmin";
import { TOPICS } from "../../../../lib/fcm";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    await getMessaging(getAdminApp()).send({
      topic: TOPICS.avisos,
      notification: {
        title: "Es hora de revisar la aplicación",
        body: "Eres Tester",
      },
      data: { link: "/" },
      webpush: { headers: { Urgency: "high" }, fcmOptions: { link: "/" } },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[cron/notificacion-diaria]", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
