"use client";

import { useState, useEffect, useMemo, useCallback } from "react";

import { db } from "../../../firebaseConfig";

import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface Peticion {
  id: string;
  nombre: string;
  texto: string;
  estado: "pendiente" | "resuelto" | "eliminada";
  fechaCreacion: Timestamp;
  fechaResuelta?: Timestamp;
  fechaEliminada?: Timestamp;
}

const ESTADO_ORDEN = {
  pendiente: 1,
  resuelto: 2,
  eliminada: 3,
};

const PASSWORD_ADMIN = "12345";

function formatFecha(timestamp?: Timestamp) {
  if (!timestamp) return "";

  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(timestamp.toDate());
}

export default function Peticiones() {
  const [nombre, setNombre] = useState("");
  const [anonimo, setAnonimo] = useState(false);
  const [peticiones, setPeticiones] = useState<Peticion[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

  /**
   * ✅ Query memoizada
   */
  const peticionesQuery = useMemo(
    () =>
      query(
        collection(db, "peticiones"),
        orderBy("fechaCreacion", "desc"),
        limit(50),
      ),
    [],
  );

  /**
   * ✅ TipTap optimizado
   */
  const editor = useEditor({
    extensions: [StarterKit],

    immediatelyRender: false,

    content: "",

    editorProps: {
      attributes: {
        class:
          "min-h-[100px] outline-none p-2 text-gray-700 prose prose-sm max-w-none",
      },
    },
  });

  /**
   * ✅ Listener realtime
   */
  useEffect(() => {
    const unsubscribe = onSnapshot(
      peticionesQuery,

      (snapshot) => {
        const docs = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as Peticion[];

        const ahora = new Date();

        const docsFiltrados = docs.filter((p) => {
          /**
           * ✅ Pendientes nunca desaparecen
           */
          if (p.estado === "pendiente") {
            return true;
          }

          /**
           * ✅ Resueltas duran 1 mes
           */
          if (p.estado === "resuelto" && p.fechaResuelta) {
            const fechaResuelta = p.fechaResuelta.toDate();

            const unMesDespues = new Date(fechaResuelta);

            unMesDespues.setMonth(unMesDespues.getMonth() + 1);

            return ahora <= unMesDespues;
          }

          /**
           * ✅ Eliminadas duran 2 semanas
           */
          if (p.estado === "eliminada" && p.fechaEliminada) {
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

        console.log("📌 Peticiones visibles:", docsFiltrados.length);

        setPeticiones(docsFiltrados);
        setLoading(false);
      },

      (error) => {
        console.error("❌ Firebase Error:", error);

        setLoading(false);
      },
    );

    return () => {
      console.log("🧹 Listener limpiado");
      unsubscribe();
    };
  }, [peticionesQuery]);

  /**
   * ✅ Validación password
   */
  const validarPassword = useCallback(() => {
    const pass = prompt("Ingresa la contraseña:");

    return pass === PASSWORD_ADMIN;
  }, []);

  /**
   * ✅ Guardar petición
   */
  const guardarPeticion = async () => {
    if (!editor || guardando) return;

    const textoPlano = editor.getText().trim();

    if (!anonimo && !nombre.trim()) {
      return alert("Debes escribir tu nombre.");
    }

    if (!textoPlano) {
      return alert("Debes escribir una petición.");
    }

    if (textoPlano.length > 1000) {
      return alert("Máximo 1000 caracteres.");
    }

    try {
      setGuardando(true);

      await addDoc(collection(db, "peticiones"), {
        nombre: anonimo ? "Anónimo" : nombre.trim(),
        texto: editor.getHTML(),
        estado: "pendiente",
        fechaCreacion: serverTimestamp(),
      });

      console.log("✅ Petición guardada");

      setMensajeExito("✅ Petición creada exitosamente");

      setTimeout(() => {
        setMensajeExito("");
      }, 3000);

      setNombre("");
      setAnonimo(false);

      editor.commands.clearContent();
    } catch (error) {
      console.error("❌ Error guardando:", error);

      alert("Ocurrió un error al guardar.");
    } finally {
      setGuardando(false);
    }
  };

  /**
   * ✅ Cambiar estado
   */
  const actualizarEstado = async (
    id: string,
    estado: "resuelto" | "eliminada",
  ) => {
    if (!validarPassword()) {
      return alert("Contraseña incorrecta");
    }

    try {
      const docRef = doc(db, "peticiones", id);

      await updateDoc(docRef, {
        estado,
        ...(estado === "resuelto"
          ? {
              fechaResuelta: serverTimestamp(),
            }
          : {
              fechaEliminada: serverTimestamp(),
            }),
      });

      const mensaje =
        estado === "resuelto"
          ? "✅ Petición marcada como resuelta"
          : "🗑️ Petición eliminada";

      setMensajeExito(mensaje);

      setTimeout(() => {
        setMensajeExito("");
      }, 3000);

      console.log(`✅ Estado actualizado: ${estado}`);
    } catch (error) {
      console.error("❌ Error actualizando:", error);

      alert("Ocurrió un error.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        📌 Peticiones de Oración
      </h1>

      {/* ========================= */}
      {/* TIPO */}
      {/* ========================= */}

      <div className="flex gap-4 text-sm text-gray-600 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={!anonimo}
            onChange={() => {
              setAnonimo(false);
              setNombre("");
            }}
          />
          Es para mi / alguien más
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={anonimo}
            onChange={() => {
              setAnonimo(true);
              setNombre("Anónimo");
            }}
          />
          Anónimo
        </label>
      </div>

      {/* ========================= */}
      {/* NOMBRE */}
      {/* ========================= */}

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre
        </label>

        <input
          type="text"
          value={nombre}
          disabled={anonimo}
          maxLength={80}
          onChange={(e) => setNombre(e.target.value)}
          placeholder={anonimo ? "Anónimo" : "Escribe aquí el nombre..."}
          className="w-full rounded-lg border-2 border-indigo-400 bg-gray-50 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-200"
        />
      </div>

      {/* ========================= */}
      {/* EDITOR */}
      {/* ========================= */}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Escribe aquí la necesidad
        </label>

        <div className="border-2 border-indigo-400 rounded-lg p-3 bg-gray-50">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* ========================= */}
      {/* BOTÓN */}
      {/* ========================= */}

      <button
        onClick={guardarPeticion}
        disabled={guardando}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {guardando ? "Creando..." : "Crear"}
      </button>

      {/* ========================= */}
      {/* MENSAJE */}
      {/* ========================= */}

      {mensajeExito && (
        <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm text-center animate-pulse">
          {mensajeExito}
        </div>
      )}

      {/* ========================= */}
      {/* LISTA */}
      {/* ========================= */}

      <h2 className="text-xl font-semibold text-gray-700 mt-10 mb-4">
        Lista de Peticiones
      </h2>

      {loading ? (
        <p className="text-gray-500">Cargando peticiones...</p>
      ) : peticiones.length === 0 ? (
        <p className="text-gray-500">No hay peticiones todavía.</p>
      ) : (
        <ul className="space-y-4">
          {peticiones.map((p) => (
            <li key={p.id} className="p-4 rounded-lg border shadow-sm bg-white">
              <div className="flex justify-between items-center gap-3">
                <strong className="text-lg text-gray-900">{p.nombre}</strong>

                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full whitespace-nowrap ${
                    p.estado === "resuelto"
                      ? "bg-green-500 text-white"
                      : p.estado === "pendiente"
                        ? "bg-yellow-400 text-gray-900"
                        : "bg-red-500 text-white"
                  }`}
                >
                  {p.estado === "resuelto"
                    ? "✅ Resuelto"
                    : p.estado === "pendiente"
                      ? "⏳ Pendiente"
                      : "🗑️ Eliminada"}
                </span>
              </div>

              <div
                className="text-gray-700 text-sm mt-3 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: p.texto,
                }}
              />

              <div className="text-xs text-gray-500 mt-3">
                {p.estado === "pendiente" && (
                  <span>Creada: {formatFecha(p.fechaCreacion)}</span>
                )}

                {p.estado === "resuelto" && (
                  <span>Resuelta: {formatFecha(p.fechaResuelta)}</span>
                )}

                {p.estado === "eliminada" && (
                  <span>Eliminada: {formatFecha(p.fechaEliminada)}</span>
                )}
              </div>

              {p.estado === "pendiente" && (
                <div className="flex gap-2 mt-4 justify-center">
                  <button
                    onClick={() => actualizarEstado(p.id, "resuelto")}
                    className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 transition"
                  >
                    ✔
                  </button>

                  <button
                    onClick={() => actualizarEstado(p.id, "eliminada")}
                    className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition"
                  >
                    🗑
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
