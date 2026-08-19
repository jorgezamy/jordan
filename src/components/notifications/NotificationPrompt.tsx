"use client";

import { useEffect, useState } from "react";
import { useFcm } from "../../hooks/useFcm";
import { Button } from "../ui/Button";

const DISMISS_KEY = "notificaciones-descartadas";

export default function NotificationPrompt() {
  const { status, subscribe } = useFcm();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(window.localStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  if (status === "unsupported" || status === "subscribed" || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/20 dark:border-white/20 bg-primary/5 dark:bg-white/5 px-4 py-3 mb-6">
      <p className="text-sm text-primary/80 dark:text-white/80">
        Activa las notificaciones para enterarte cuando se suba una petición de oración nueva.
      </p>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          type="button"
          onClick={subscribe}
          disabled={status === "subscribing"}
          className="text-sm px-4 py-2 rounded-lg font-medium"
        >
          {status === "subscribing" ? "Activando..." : "Activar notificaciones"}
        </Button>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 hover:dark:text-white transition px-2"
        >
          Ahora no
        </button>
      </div>
    </div>
  );
}
