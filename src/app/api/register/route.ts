import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getAdminApp } from "../../../lib/firebaseAdmin";
import { checkRateLimit } from "../../../lib/rateLimit";

export async function POST(req: NextRequest) {
  const { email, password, secretWord } = await req.json();

  if (!email || typeof email !== "string" || !password || typeof password !== "string") {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "La contraseña debe tener al menos 6 caracteres." },
      { status: 400 }
    );
  }
  if (secretWord !== process.env.REGISTRATION_SECRET_WORD) {
    return NextResponse.json({ error: "Palabra secreta incorrecta." }, { status: 403 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await checkRateLimit(`register:${ip}`, { max: 5, windowMs: 60 * 60 * 1000 }))) {
    return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
  }

  try {
    const auth = getAuth(getAdminApp());
    const userRecord = await auth.createUser({ email, password });
    await auth.setCustomUserClaims(userRecord.uid, { admin: true });

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const code = (error as { code?: string }).code ?? "";

    if (code === "auth/email-already-exists") {
      return NextResponse.json({ error: "Este correo ya está registrado." }, { status: 409 });
    }
    if (code === "auth/invalid-password") {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres." },
        { status: 400 }
      );
    }
    if (code === "auth/invalid-email") {
      return NextResponse.json({ error: "Correo electrónico inválido." }, { status: 400 });
    }

    console.error("[register]", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
