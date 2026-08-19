"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getFirebaseError } from "./authErrors";

export type AuthTab = "login" | "register" | "forgot";

export function useAuthModal(onClose: () => void, defaultTab: AuthTab = "login") {
  const { login, register, resetPassword } = useAuth();
  const [tab, setTab] = useState<AuthTab>(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secretWord, setSecretWord] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const switchTab = (t: AuthTab) => {
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

  return {
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
  };
}
