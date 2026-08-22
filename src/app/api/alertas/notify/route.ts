import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getMessaging } from "firebase-admin/messaging";
import { getAdminApp } from "../../../../lib/firebaseAdmin";
import { TOPICS } from "../../../../lib/fcm";
import { checkRateLimit } from "../../../../lib/rateLimit";

const MENSAJE_MAX_LEN = 500;

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const idToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!idToken) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let decoded;
  try {
    decoded = await getAuth(getAdminApp()).verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (decoded.admin !== true) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { mensaje } = await req.json();

  if (!mensaje || typeof mensaje !== "string" || !mensaje.trim()) {
    return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 });
  }
  if (mensaje.length > MENSAJE_MAX_LEN) {
    return NextResponse.json({ error: "Mensaje demasiado largo" }, { status: 400 });
  }

  if (!(await checkRateLimit(`alertas:${decoded.uid}`, { max: 10, windowMs: 60_000 }))) {
    return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
  }

  try {
    const messaging = getMessaging(getAdminApp());

    await Promise.all(
      Object.values(TOPICS).map((topic) =>
        messaging.send({
          topic,
          notification: { title: "Notificación", body: mensaje.trim() },
          data: { link: "/" },
          webpush: { headers: { Urgency: "high" }, fcmOptions: { link: "/" } },
        }),
      ),
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[alertas/notify]", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
