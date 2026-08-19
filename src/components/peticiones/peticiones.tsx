"use client";

import { useAuth } from "../../context/AuthContext";
import { useMensajeTemporal } from "../../hooks/useMensajeTemporal";
import NotificationPrompt from "../notifications/NotificationPrompt";

import { FiltrosPeticiones } from "./FiltrosPeticiones";
import { ListaPeticiones } from "./ListaPeticiones";
import { NuevaPeticionForm } from "./NuevaPeticionForm";
import { useNuevaPeticion } from "./useNuevaPeticion";
import { usePeticionesData } from "./usePeticionesData";
import { usePeticionesFiltro } from "./usePeticionesFiltro";

export default function Peticiones() {
  const { user } = useAuth();
  const { mensaje: mensajeExito, mostrarMensaje } = useMensajeTemporal();

  const form = useNuevaPeticion(mostrarMensaje);
  const data = usePeticionesData(user, mostrarMensaje);
  const filtro = usePeticionesFiltro(data.peticiones, user);

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white dark:bg-surface-dark shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        📌 Peticiones de Oración
      </h1>

      <NotificationPrompt />

      <NuevaPeticionForm form={form} mensajeExito={mensajeExito} />

      <FiltrosPeticiones filtro={filtro} user={user} />

      <ListaPeticiones data={data} filtro={filtro} user={user} />
    </div>
  );
}
