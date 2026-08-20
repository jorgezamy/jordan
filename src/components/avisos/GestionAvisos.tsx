"use client";

import { useAuth } from "../../context/AuthContext";
import { useMensajeTemporal } from "../../hooks/useMensajeTemporal";
import { Alert } from "../ui/Alert";

import { AvisoForm } from "./AvisoForm";
import { ListaAvisosAdmin } from "./ListaAvisosAdmin";
import { useAvisosAdmin } from "./useAvisosAdmin";

export default function GestionAvisos() {
  const { user } = useAuth();
  const { mensaje: mensajeExito, mostrarMensaje } = useMensajeTemporal();
  const admin = useAvisosAdmin(mostrarMensaje);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <Alert variant="danger" className="p-4">
          Esta sección es solo para administradores.
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white dark:bg-surface-dark shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Gestionar Avisos
      </h1>

      <AvisoForm admin={admin} mensajeExito={mensajeExito} />

      <ListaAvisosAdmin admin={admin} />
    </div>
  );
}
