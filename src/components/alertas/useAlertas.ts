import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export function useAlertas(mostrarMensaje: (texto: string) => void) {
  const { user } = useAuth();
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const enviar = async () => {
    if (!user || !mensaje.trim()) return;

    setEnviando(true);
    setError("");

    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/alertas/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ mensaje: mensaje.trim() }),
      });

      if (!res.ok) throw new Error();

      setMensaje("");
      mostrarMensaje("Notificación enviada");
    } catch {
      setError("No se pudo enviar la notificación");
    } finally {
      setEnviando(false);
    }
  };

  return { mensaje, setMensaje, enviando, error, enviar };
}
