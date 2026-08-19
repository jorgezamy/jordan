"use client";

import { Alert } from "../ui/Alert";
import { Button } from "../ui/Button";
import { FieldLabel } from "../ui/FieldLabel";
import { LockIcon } from "../ui/LockIcon";
import { PasswordInput } from "../ui/PasswordInput";
import { TextInput } from "../ui/TextInput";
import { AuthTab, useAuthModal } from "./useAuthModal";

interface AuthModalProps {
  onClose: () => void;
  defaultTab?: AuthTab;
}

export default function AuthModal({
  onClose,
  defaultTab = "login",
}: AuthModalProps) {
  const {
    tab,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    secretWord,
    setSecretWord,
    error,
    success,
    loading,
    switchTab,
    handleLogin,
    handleRegister,
    handleForgot,
  } = useAuthModal(onClose, defaultTab);

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
