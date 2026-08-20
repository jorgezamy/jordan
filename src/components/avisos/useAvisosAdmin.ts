"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../../firebaseConfig";
import { AVISOS_LIMITE } from "./constants";
import { Aviso, ConfirmacionAviso } from "./types";
import { fechaAInputValue, horaAInputValue, inputValueAFechaHora } from "./utils";

export function useAvisosAdmin(mostrarMensaje: (mensaje: string) => void) {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [idEditando, setIdEditando] = useState<string | null>(null);
  const [confirmando, setConfirmando] = useState<ConfirmacionAviso | null>(null);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [importante, setImportante] = useState(false);
  const [fecha, setFechaState] = useState("");
  const [horaFecha, setHoraFecha] = useState("");
  const [fechaFin, setFechaFinState] = useState("");
  const [horaFechaFin, setHoraFechaFin] = useState("");

  const setFecha = (valor: string) => {
    setFechaState(valor);
    if (!valor) {
      setHoraFecha("");
      setFechaFinState("");
      setHoraFechaFin("");
    }
  };

  const setFechaFin = (valor: string) => {
    setFechaFinState(valor);
    if (!valor) setHoraFechaFin("");
  };

  const avisosQuery = useMemo(
    () =>
      query(
        collection(db, "avisos"),
        orderBy("fechaCreacion", "desc"),
        limit(AVISOS_LIMITE),
      ),
    [],
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(
      avisosQuery,

      (snapshot) => {
        const docs = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as Aviso[];

        setAvisos(docs);
        setLoading(false);
      },

      (error) => {
        console.error("❌ Firebase Error:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [avisosQuery]);

  const limpiarFormulario = () => {
    setTitulo("");
    setDescripcion("");
    setBannerUrl("");
    setImportante(false);
    setFechaState("");
    setHoraFecha("");
    setFechaFinState("");
    setHoraFechaFin("");
    setIdEditando(null);
  };

  const empezarEdicion = (aviso: Aviso) => {
    setIdEditando(aviso.id);
    setTitulo(aviso.titulo);
    setDescripcion(aviso.descripcion);
    setBannerUrl(aviso.bannerUrl ?? "");
    setImportante(aviso.importante);
    setFechaState(aviso.fecha ? fechaAInputValue(aviso.fecha.toDate()) : "");
    setHoraFecha(aviso.fecha ? horaAInputValue(aviso.fecha.toDate()) : "");
    setFechaFinState(aviso.fechaFin ? fechaAInputValue(aviso.fechaFin.toDate()) : "");
    setHoraFechaFin(aviso.fechaFin ? horaAInputValue(aviso.fechaFin.toDate()) : "");
  };

  const ejecutarGuardado = async () => {
    try {
      setGuardando(true);

      const base = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        importante,
      };

      if (idEditando) {
        await updateDoc(doc(db, "avisos", idEditando), {
          ...base,
          fecha: fecha ? Timestamp.fromDate(inputValueAFechaHora(fecha, horaFecha)) : deleteField(),
          fechaFin: fechaFin
            ? Timestamp.fromDate(inputValueAFechaHora(fechaFin, horaFechaFin))
            : deleteField(),
          bannerUrl: bannerUrl.trim() ? bannerUrl.trim() : deleteField(),
        });
        mostrarMensaje("Aviso actualizado");
      } else {
        const newDocRef = await addDoc(collection(db, "avisos"), {
          ...base,
          ...(fecha ? { fecha: Timestamp.fromDate(inputValueAFechaHora(fecha, horaFecha)) } : {}),
          ...(fechaFin
            ? { fechaFin: Timestamp.fromDate(inputValueAFechaHora(fechaFin, horaFechaFin)) }
            : {}),
          ...(bannerUrl.trim() ? { bannerUrl: bannerUrl.trim() } : {}),
          fechaCreacion: serverTimestamp(),
        });
        mostrarMensaje("Aviso publicado");

        fetch("/api/avisos/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: newDocRef.id }),
        }).catch((err) => console.error("❌ Error enviando notificación:", err));
      }

      limpiarFormulario();
    } catch (error) {
      console.error("❌ Error guardando aviso:", error);
      alert("Ocurrió un error al guardar.");
    } finally {
      setGuardando(false);
    }
  };

  const ejecutarEliminado = async (id: string) => {
    try {
      await deleteDoc(doc(db, "avisos", id));
      if (idEditando === id) limpiarFormulario();
      mostrarMensaje("Aviso eliminado");
    } catch (error) {
      console.error("❌ Error eliminando aviso:", error);
      alert("Ocurrió un error al eliminar.");
    }
  };

  const guardarAviso = () => {
    if (guardando) return;

    if (!titulo.trim()) {
      return alert("Debes escribir un título.");
    }
    if (!descripcion.trim() && !bannerUrl.trim()) {
      return alert("Debes escribir una descripción breve o adjuntar un banner.");
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
    avisos,
    loading,
    guardando,
    idEditando,
    confirmando,
    titulo,
    descripcion,
    bannerUrl,
    importante,
    fecha,
    horaFecha,
    fechaFin,
    horaFechaFin,
    setTitulo,
    setDescripcion,
    setBannerUrl,
    setImportante,
    setFecha,
    setHoraFecha,
    setFechaFin,
    setHoraFechaFin,
    empezarEdicion,
    cancelarEdicion: limpiarFormulario,
    guardarAviso,
    pedirEliminar,
    cancelarConfirmacion,
    confirmarAccion,
  };
}
