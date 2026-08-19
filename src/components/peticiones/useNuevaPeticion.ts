"use client";

import { useState } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../../firebaseConfig";

export function useNuevaPeticion(mostrarMensaje: (mensaje: string) => void) {
  const [nombre, setNombre] = useState("");
  const [anonimo, setAnonimo] = useState(false);
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [guardando, setGuardando] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],

    immediatelyRender: false,

    content: "",

    editorProps: {
      attributes: {
        class:
          "min-h-[100px] outline-none p-2 text-gray-700 dark:text-gray-300 prose prose-sm max-w-none",
      },
    },
  });

  const elegirEsMi = () => {
    setAnonimo(false);
    setNombre("");
  };

  const elegirAnonimo = () => {
    setAnonimo(true);
    setNombre("Anónimo");
  };

  const guardarPeticion = async () => {
    if (!editor || guardando) return;

    const textoPlano = editor.getText().trim();

    if (!anonimo && !nombre.trim()) {
      return alert("Debes escribir el nombre.");
    }

    if (!textoPlano) {
      return alert("Debes escribir una petición.");
    }

    if (textoPlano.length > 1000) {
      return alert("Máximo 1000 caracteres.");
    }

    try {
      setGuardando(true);

      const newDocRef = doc(collection(db, "peticiones"));
      const counterRef = doc(db, "metadata", "counters");

      await runTransaction(db, async (transaction) => {
        const counterSnap = await transaction.get(counterRef);
        const current = counterSnap.exists()
          ? (counterSnap.data().peticionesCount ?? 0)
          : 0;
        const next = current + 1;

        transaction.set(counterRef, { peticionesCount: next }, { merge: true });
        transaction.set(newDocRef, {
          numero: next,
          nombre: anonimo ? "Anónimo" : nombre.trim(),
          texto: editor.getHTML(),
          estado: "pendiente",
          fechaCreacion: serverTimestamp(),
          ...(telefono.trim() ? { telefono: telefono.trim() } : {}),
          ...(correo.trim() ? { correo: correo.trim() } : {}),
        });
      });

      mostrarMensaje("✅ Petición creada exitosamente");

      fetch("/api/peticiones/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: newDocRef.id }),
      }).catch((err) => console.error("❌ Error enviando notificación:", err));

      setNombre("");
      setAnonimo(false);
      setTelefono("");
      setCorreo("");
      editor.commands.clearContent();
    } catch (error) {
      console.error("❌ Error guardando:", error);
      alert("Ocurrió un error al guardar.");
    } finally {
      setGuardando(false);
    }
  };

  return {
    nombre,
    anonimo,
    telefono,
    correo,
    guardando,
    editor,
    setNombre,
    setTelefono,
    setCorreo,
    elegirEsMi,
    elegirAnonimo,
    guardarPeticion,
  };
}
