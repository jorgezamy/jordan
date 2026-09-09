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
  writeBatch,
} from "firebase/firestore";

import { db } from "../../../firebaseConfig";
import { AVISOS_LIMITE } from "./constants";
import { Aviso, ConfirmacionAviso, TipoProgramacion } from "./types";
import {
  calcularFinPorDefecto,
  fechaAInputValue,
  horaAInputValue,
  inputValueAFechaHora,
  ordenarPorPosicion,
} from "./utils";

export function useAvisosAdmin(mostrarMensaje: (mensaje: string) => void) {
  const [avisosRaw, setAvisosRaw] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [idEditando, setIdEditando] = useState<string | null>(null);
  const [confirmando, setConfirmando] = useState<ConfirmacionAviso | null>(null);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [importante, setImportante] = useState(false);
  const [fecha, setFechaState] = useState("");
  const [horaFecha, setHoraFechaState] = useState("");
  const [fechaFin, setFechaFinState] = useState("");
  const [horaFechaFin, setHoraFechaFinState] = useState("");
  const [tipoProgramacion, setTipoProgramacionState] = useState<TipoProgramacion>("expira");
  const [diasRecurrentes, setDiasRecurrentes] = useState<number[]>([]);
  // true mientras la fecha/hora de fin siguen siendo el default calculado
  // (no las ha tocado el admin) — así seguimos recalculándolas al cambiar
  // la fecha/hora de inicio, pero dejamos de tocarlas en cuanto las edita.
  const [fechaFinAuto, setFechaFinAuto] = useState(true);

  const aplicarFinPorDefecto = (fechaValor: string, horaValor: string) => {
    const def = calcularFinPorDefecto(fechaValor, horaValor);
    setFechaFinState(def.fecha);
    setHoraFechaFinState(def.hora);
  };

  const setFecha = (valor: string) => {
    setFechaState(valor);
    if (!valor) {
      setHoraFechaState("");
      setFechaFinState("");
      setHoraFechaFinState("");
      setDiasRecurrentes([]);
      setFechaFinAuto(true);
      return;
    }
    if (tipoProgramacion === "expira" && fechaFinAuto) {
      aplicarFinPorDefecto(valor, horaFecha);
    }
  };

  const setHoraFecha = (valor: string) => {
    setHoraFechaState(valor);
    if (fecha && tipoProgramacion === "expira" && fechaFinAuto) {
      aplicarFinPorDefecto(fecha, valor);
    }
  };

  const setFechaFin = (valor: string) => {
    setFechaFinState(valor);
    setFechaFinAuto(false);
    if (!valor) setHoraFechaFinState("");
  };

  const setHoraFechaFin = (valor: string) => {
    setHoraFechaFinState(valor);
    setFechaFinAuto(false);
  };

  const setTipoProgramacion = (valor: TipoProgramacion) => {
    setTipoProgramacionState(valor);

    if (valor === "expira") {
      if (fechaFinAuto && fecha) {
        aplicarFinPorDefecto(fecha, horaFecha);
      }
    } else {
      setFechaFinState("");
      setHoraFechaFinState("");
      setFechaFinAuto(true);
    }

    if (valor !== "recurrente") setDiasRecurrentes([]);
  };

  const toggleDiaRecurrente = (dia: number) => {
    setDiasRecurrentes((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia].sort((a, b) => a - b),
    );
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

        setAvisosRaw(docs);
        setLoading(false);
      },

      (error) => {
        console.error("❌ Firebase Error:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [avisosQuery]);

  const avisos = useMemo(() => ordenarPorPosicion(avisosRaw), [avisosRaw]);

  const limpiarFormulario = () => {
    setTitulo("");
    setDescripcion("");
    setBannerUrl("");
    setImportante(false);
    setFechaState("");
    setHoraFechaState("");
    setFechaFinState("");
    setHoraFechaFinState("");
    setTipoProgramacionState("expira");
    setDiasRecurrentes([]);
    setFechaFinAuto(true);
    setIdEditando(null);
  };

  const empezarEdicion = (aviso: Aviso) => {
    setIdEditando(aviso.id);
    setTitulo(aviso.titulo);
    setDescripcion(aviso.descripcion);
    setBannerUrl(aviso.bannerUrl ?? "");
    setImportante(aviso.importante);
    setFechaState(aviso.fecha ? fechaAInputValue(aviso.fecha.toDate()) : "");
    setHoraFechaState(aviso.fecha ? horaAInputValue(aviso.fecha.toDate()) : "");
    setFechaFinState(aviso.fechaFin ? fechaAInputValue(aviso.fechaFin.toDate()) : "");
    setHoraFechaFinState(aviso.fechaFin ? horaAInputValue(aviso.fechaFin.toDate()) : "");
    setTipoProgramacionState(aviso.tipoProgramacion ?? "expira");
    setDiasRecurrentes(aviso.diasRecurrentes ?? []);
    // Sin fechaFin guardada todavía se puede autocompletar; si ya existe una,
    // es una elección real del admin y no debe recalcularse sola.
    setFechaFinAuto(!aviso.fechaFin);
  };

  const ejecutarGuardado = async () => {
    try {
      setGuardando(true);

      const base = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        importante,
      };

      const guardaFechaFin = fecha && tipoProgramacion === "expira" && fechaFin;
      const guardaDiasRecurrentes = fecha && tipoProgramacion === "recurrente" && diasRecurrentes.length > 0;

      if (idEditando) {
        await updateDoc(doc(db, "avisos", idEditando), {
          ...base,
          fecha: fecha ? Timestamp.fromDate(inputValueAFechaHora(fecha, horaFecha)) : deleteField(),
          tipoProgramacion: fecha ? tipoProgramacion : deleteField(),
          fechaFin: guardaFechaFin
            ? Timestamp.fromDate(inputValueAFechaHora(fechaFin, horaFechaFin))
            : deleteField(),
          diasRecurrentes: guardaDiasRecurrentes ? diasRecurrentes : deleteField(),
          bannerUrl: bannerUrl.trim() ? bannerUrl.trim() : deleteField(),
        });
        mostrarMensaje("Aviso actualizado");
      } else {
        // Se publica al frente de la lista/carrusel: un orden menor a
        // cualquier existente. El admin puede arrastrarlo después si quiere
        // otra posición.
        const ordenActual = avisos.map((a) => a.orden).filter((o): o is number => o !== undefined);
        const nuevoOrden = ordenActual.length ? Math.min(...ordenActual) - 1 : 0;

        const newDocRef = await addDoc(collection(db, "avisos"), {
          ...base,
          orden: nuevoOrden,
          ...(fecha
            ? { fecha: Timestamp.fromDate(inputValueAFechaHora(fecha, horaFecha)), tipoProgramacion }
            : {}),
          ...(guardaFechaFin
            ? { fechaFin: Timestamp.fromDate(inputValueAFechaHora(fechaFin, horaFechaFin)) }
            : {}),
          ...(guardaDiasRecurrentes ? { diasRecurrentes } : {}),
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
    if (fecha && tipoProgramacion === "expira" && !fechaFin) {
      return alert("Indica la fecha en que debe quitarse el aviso, o elige otro tipo de programación.");
    }
    if (fecha && tipoProgramacion === "recurrente" && diasRecurrentes.length === 0) {
      return alert("Selecciona al menos un día de la semana en que se repite.");
    }

    if (idEditando) {
      setConfirmando({ accion: "guardar" });
    } else {
      ejecutarGuardado();
    }
  };

  // Persiste un nuevo orden de arrastre: solo escribe los avisos cuya
  // posición realmente cambió, no la lista completa en cada drop.
  const guardarOrden = async (nuevoOrden: Aviso[]) => {
    const batch = writeBatch(db);
    let huboCambios = false;

    nuevoOrden.forEach((a, index) => {
      if (a.orden !== index) {
        batch.update(doc(db, "avisos", a.id), { orden: index });
        huboCambios = true;
      }
    });

    if (!huboCambios) return;

    try {
      await batch.commit();
    } catch (error) {
      console.error("❌ Error guardando el orden:", error);
      alert("Ocurrió un error al guardar el nuevo orden.");
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
    tipoProgramacion,
    diasRecurrentes,
    setTitulo,
    setDescripcion,
    setBannerUrl,
    setImportante,
    setFecha,
    setHoraFecha,
    setFechaFin,
    setHoraFechaFin,
    setTipoProgramacion,
    toggleDiaRecurrente,
    empezarEdicion,
    cancelarEdicion: limpiarFormulario,
    guardarAviso,
    guardarOrden,
    pedirEliminar,
    cancelarConfirmacion,
    confirmarAccion,
  };
}
