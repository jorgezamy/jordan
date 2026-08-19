"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { User } from "firebase/auth";

import { db } from "../../../firebaseConfig";
import { ESTADO_ORDEN } from "./constants";
import { AccionPeticion, Confirmacion, Peticion } from "./types";

export function usePeticionesData(
  user: User | null,
  mostrarMensaje: (mensaje: string) => void,
) {
  const [peticionesRaw, setPeticionesRaw] = useState<Peticion[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmando, setConfirmando] = useState<Confirmacion | null>(null);

  const peticionesQuery = useMemo(
    () =>
      query(
        collection(db, "peticiones"),
        orderBy("fechaCreacion", "desc"),
        limit(50),
      ),
    [],
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(
      peticionesQuery,

      (snapshot) => {
        const docs = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as Peticion[];

        setPeticionesRaw(docs);
        setLoading(false);
      },

      (error) => {
        console.error("❌ Firebase Error:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [peticionesQuery]);

  const peticiones = useMemo(() => {
    const ahora = new Date();

    const docsFiltrados = peticionesRaw.filter((p) => {
      if (p.estado === "pendiente") {
        return true;
      }

      if (p.estado === "resuelto" && p.fechaResuelta) {
        const fechaResuelta = p.fechaResuelta.toDate();
        const unMesDespues = new Date(fechaResuelta);
        unMesDespues.setMonth(unMesDespues.getMonth() + 1);
        return ahora <= unMesDespues;
      }

      if (p.estado === "eliminada") {
        // Las peticiones eliminadas solo son visibles para usuarios con sesión iniciada.
        if (!user || !p.fechaEliminada) return false;
        const fechaEliminada = p.fechaEliminada.toDate();
        const dosSemanasDespues = new Date(fechaEliminada);
        dosSemanasDespues.setDate(dosSemanasDespues.getDate() + 14);
        return ahora <= dosSemanasDespues;
      }

      return false;
    });

    docsFiltrados.sort(
      (a, b) => ESTADO_ORDEN[a.estado] - ESTADO_ORDEN[b.estado],
    );

    return docsFiltrados;
  }, [peticionesRaw, user]);

  const pedirConfirmacion = (id: string, accion: AccionPeticion) => {
    setConfirmando({ id, accion });
  };

  const cancelarConfirmacion = () => setConfirmando(null);

  const ejecutarAccion = async (id: string, accion: AccionPeticion) => {
    setConfirmando(null);
    try {
      const docRef = doc(db, "peticiones", id);
      let mensaje = "";

      if (accion === "eliminar_permanente") {
        await deleteDoc(docRef);
        mensaje = "🗑️ Petición eliminada permanentemente";
      } else if (accion === "restaurar") {
        await updateDoc(docRef, { estado: "pendiente" });
        mensaje = "↩️ Petición devuelta a pendientes";
      } else {
        await updateDoc(docRef, {
          estado: accion,
          ...(accion === "resuelto"
            ? { fechaResuelta: serverTimestamp() }
            : { fechaEliminada: serverTimestamp() }),
        });
        mensaje =
          accion === "resuelto"
            ? "✅ Petición marcada como resuelta"
            : "🚫 Petición cancelada";
      }

      mostrarMensaje(mensaje);
    } catch (error) {
      console.error("❌ Error actualizando:", error);
      alert("Ocurrió un error.");
    }
  };

  return {
    peticiones,
    loading,
    confirmando,
    pedirConfirmacion,
    cancelarConfirmacion,
    ejecutarAccion,
  };
}
