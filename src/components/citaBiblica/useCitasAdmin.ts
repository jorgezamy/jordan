"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
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

import { db } from "../../../firebaseConfig";
import { CITAS_LIMITE, VERSIONES_BIBLICAS } from "./constants";
import { Cita, ConfirmacionCita } from "./types";

export function useCitasAdmin(mostrarMensaje: (mensaje: string) => void) {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [idEditando, setIdEditando] = useState<string | null>(null);
  const [confirmando, setConfirmando] = useState<ConfirmacionCita | null>(null);

  const [texto, setTexto] = useState("");
  const [referencia, setReferencia] = useState("");
  const [version, setVersion] = useState<string>(VERSIONES_BIBLICAS[0]);

  const citasQuery = useMemo(
    () =>
      query(
        collection(db, "citas"),
        orderBy("fechaCreacion", "desc"),
        limit(CITAS_LIMITE),
      ),
    [],
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(
      citasQuery,

      (snapshot) => {
        const docs = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as Cita[];

        setCitas(docs);
        setLoading(false);
      },

      (error) => {
        console.error("❌ Firebase Error:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [citasQuery]);

  const limpiarFormulario = () => {
    setTexto("");
    setReferencia("");
    setVersion(VERSIONES_BIBLICAS[0]);
    setIdEditando(null);
  };

  const empezarEdicion = (cita: Cita) => {
    setIdEditando(cita.id);
    setTexto(cita.texto);
    setReferencia(cita.referencia);
    setVersion(cita.version);
  };

  const ejecutarGuardado = async () => {
    try {
      setGuardando(true);

      if (idEditando) {
        await updateDoc(doc(db, "citas", idEditando), {
          texto: texto.trim(),
          referencia: referencia.trim(),
          version,
        });
        mostrarMensaje("Cita actualizada");
      } else {
        const newDocRef = await addDoc(collection(db, "citas"), {
          texto: texto.trim(),
          referencia: referencia.trim(),
          version,
          fechaCreacion: serverTimestamp(),
        });
        mostrarMensaje("Cita publicada");

        fetch("/api/citas/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: newDocRef.id }),
        }).catch((err) => console.error("❌ Error enviando notificación:", err));
      }

      limpiarFormulario();
    } catch (error) {
      console.error("❌ Error guardando cita:", error);
      alert("Ocurrió un error al guardar.");
    } finally {
      setGuardando(false);
    }
  };

  const ejecutarEliminado = async (id: string) => {
    try {
      await deleteDoc(doc(db, "citas", id));
      if (idEditando === id) limpiarFormulario();
      mostrarMensaje("Cita eliminada");
    } catch (error) {
      console.error("❌ Error eliminando cita:", error);
      alert("Ocurrió un error al eliminar.");
    }
  };

  const guardarCita = () => {
    if (guardando) return;

    if (!texto.trim()) {
      return alert("Debes escribir el texto de la cita.");
    }
    if (!referencia.trim()) {
      return alert("Debes escribir la referencia (ej. Juan 3:16).");
    }

    if (idEditando) {
      setConfirmando({ accion: "guardar" });
    } else {
      ejecutarGuardado();
    }
  };

  const pedirEliminar = (id: string) => setConfirmando({ accion: "eliminar", id });
  const cancelarConfirmacion = () => setConfirmando(null);

  const confirmarAccion = async () => {
    if (!confirmando) return;

    if (confirmando.accion === "guardar") {
      await ejecutarGuardado();
    } else if (confirmando.id) {
      await ejecutarEliminado(confirmando.id);
    }

    setConfirmando(null);
  };

  return {
    citas,
    loading,
    guardando,
    idEditando,
    confirmando,
    texto,
    referencia,
    version,
    setTexto,
    setReferencia,
    setVersion,
    empezarEdicion,
    cancelarEdicion: limpiarFormulario,
    guardarCita,
    pedirEliminar,
    cancelarConfirmacion,
    confirmarAccion,
  };
}
