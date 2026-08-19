"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Alert } from "../ui/Alert";
import { Button } from "../ui/Button";
import { LockIcon } from "../ui/LockIcon";
import { TextInput } from "../ui/TextInput";

interface AuthModalProps {
  onClose: () => void;
  defaultTab?: "login" | "register" | "forgot";
}

function getFirebaseError(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "Este correo ya está registrado.";
    case "auth/invalid-email":
      return "Correo electrónico inválido.";
    case "auth/weak-password":
      return "La contraseña debe tener al menos 6 caracteres.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Correo o contraseña incorrectos.";
    default:
      return "Ocurrió un error. Intenta de nuevo.";
  }
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

function PasswordInput({ value, onChange, placeholder = "••••••", required }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <TextInput
        variant="modal"
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg px-3 py-2.5 pr-10"
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 hover:dark:text-gray-400 transition"
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        <EyeIcon open={visible} />
      </button>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
      {children}
    </label>
  );
}

export default function AuthModal({
  onClose,
  defaultTab = "login",
}: AuthModalProps) {
  const { login, register, resetPassword } = useAuth();
  const [tab, setTab] = useState<"login" | "register" | "forgot">(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secretWord, setSecretWord] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const switchTab = (t: "login" | "register" | "forgot") => {
    setTab(t);
    setError("");
    setSuccess("");
    setPassword("");
    setConfirmPassword("");
    setSecretWord("");
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess("Si ese correo está registrado, recibirás un enlace en breve.");
    } catch {
      setError("Ocurrió un error. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      onClose();
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      setError(getFirebaseError(code));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await register(email, password, secretWord);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ocurrió un error. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div className="relative bg-white dark:bg-surface-dark rounded-2xl shadow-2xl w-full max-w-sm">

        {/* Encabezado */}
        <div className="px-8 pt-8 pb-5 text-center">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-primary/10 dark:bg-white/10 mb-4">
            <LockIcon className="w-5 h-5 text-primary dark:text-white" />
          </div>
          <h2 className="text-lg font-semibold text-primary dark:text-white">Área de miembros</h2>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 dark:border dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-200 hover:dark:bg-white/20 hover:text-gray-900 hover:dark:text-white transition"
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Tabs */}
        {tab !== "forgot" && (
          <div className="flex px-8 border-b border-gray-100 dark:border-white/5">
            <button
              onClick={() => switchTab("login")}
              className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === "login"
                  ? "text-primary dark:text-white border-primary dark:border-white"
                  : "text-gray-400 dark:text-gray-500 border-transparent hover:text-gray-600 hover:dark:text-gray-400"
              }`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => switchTab("register")}
              className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === "register"
                  ? "text-primary dark:text-white border-primary dark:border-white"
                  : "text-gray-400 dark:text-gray-500 border-transparent hover:text-gray-600 hover:dark:text-gray-400"
              }`}
            >
              Registrarse
            </button>
          </div>
        )}

        <div className="px-8 py-6">
          {/* Formulario de recuperar contraseña */}
          {tab === "forgot" && (
            <div className="space-y-4">
              <div className="text-center pb-1">
                <h3 className="text-base font-semibold text-primary dark:text-white">Restablecer contraseña</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Te enviaremos un enlace a tu correo.</p>
              </div>
              {success ? (
                <div className="space-y-4">
                  <Alert variant="success" className="px-3 py-2 text-center">
                    {success}
                  </Alert>
                  <Button onClick={() => switchTab("login")} className="w-full py-2.5 rounded-lg font-medium">
                    Volver al inicio de sesión
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleForgot} className="space-y-4">
                  <div>
                    <FieldLabel>Correo electrónico</FieldLabel>
                    <TextInput
                      variant="modal"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-lg px-3 py-2.5"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  {error && (
                    <Alert variant="danger" className="px-3 py-2">
                      {error}
                    </Alert>
                  )}
                  <Button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg font-medium">
                    {loading ? "Enviando..." : "Enviar enlace"}
                  </Button>
                  <button
                    type="button"
                    onClick={() => switchTab("login")}
                    className="w-full text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 hover:dark:text-gray-400 transition"
                  >
                    Volver al inicio de sesión
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Formulario de login */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <FieldLabel>Correo electrónico</FieldLabel>
                <TextInput
                  variant="modal"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg px-3 py-2.5"
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div>
                <FieldLabel>Contraseña</FieldLabel>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <Alert variant="danger" className="px-3 py-2">
                  {error}
                </Alert>
              )}
              <Button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg font-medium">
                {loading ? "Entrando..." : "Entrar"}
              </Button>
              <button
                type="button"
                onClick={() => switchTab("forgot")}
                className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:dark:text-white transition"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </form>
          )}

          {/* Formulario de registro */}
          {tab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <FieldLabel>Correo electrónico</FieldLabel>
                <TextInput
                  variant="modal"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg px-3 py-2.5"
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div>
                <FieldLabel>Contraseña</FieldLabel>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>
              <div>
                <FieldLabel>Confirmar contraseña</FieldLabel>
                <PasswordInput
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <FieldLabel>Palabra secreta</FieldLabel>
                <PasswordInput
                  value={secretWord}
                  onChange={(e) => setSecretWord(e.target.value)}
                  placeholder="Ingresa la palabra secreta"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                  Solo miembros con la palabra secreta pueden registrarse.
                </p>
              </div>
              {error && (
                <Alert variant="danger" className="px-3 py-2">
                  {error}
                </Alert>
              )}
              <Button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg font-medium">
                {loading ? "Registrando..." : "Crear cuenta"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
