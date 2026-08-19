import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { Resend } from "resend";
import { getAdminApp } from "../../../lib/firebaseAdmin";
import { buildResetPasswordEmail } from "../../../lib/emails/resetPasswordEmail";
import { checkRateLimit } from "../../../lib/rateLimit";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email requerido" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await checkRateLimit(`reset-password:${ip}`, { max: 5, windowMs: 60 * 60 * 1000 }))) {
    return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
  }

  try {
    const resetLink = await getAuth(getAdminApp()).generatePasswordResetLink(email);

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Restablece tu contraseña — Centro Cristiano Jordán",
      html: buildResetPasswordEmail(resetLink),
    });

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const code =
      (error as { errorInfo?: { code?: string } }).errorInfo?.code ?? "";

    // Don't reveal whether the email exists (prevents enumeration)
    if (
      code === "auth/user-not-found" ||
      code === "auth/email-not-found" ||
      code === "auth/invalid-email"
    ) {
      return NextResponse.json({ ok: true });
    }

    console.error("[reset-password]", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
