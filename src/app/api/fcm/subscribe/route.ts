import { NextRequest, NextResponse } from "next/server";
import { getMessaging } from "firebase-admin/messaging";
import { getAdminApp } from "../../../../lib/firebaseAdmin";
import { esTopicValido } from "../../../../lib/fcm";
import { checkRateLimit } from "../../../../lib/rateLimit";

export async function POST(req: NextRequest) {
  const { token, topic } = await req.json();

  if (!token || typeof token !== "string" || token.length > 4096) {
    return NextResponse.json({ error: "token inválido" }, { status: 400 });
  }
  if (!esTopicValido(topic)) {
    return NextResponse.json({ error: "topic inválido" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await checkRateLimit(`fcm-sub:${ip}`, { max: 20, windowMs: 60_000 }))) {
    return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
  }

  try {
    await getMessaging(getAdminApp()).subscribeToTopic([token], topic);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[fcm/subscribe]", error);
    return NextResponse.json({ error: "No se pudo suscribir" }, { status: 400 });
  }
}
