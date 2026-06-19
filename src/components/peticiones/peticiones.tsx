"use client";

import { useState, useEffect, useMemo } from "react";

import { db } from "../../../firebaseConfig";
import { useAuth } from "../../context/AuthContext";

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
  telefono?: string;
  correo?: string;
}

const ESTADO_ORDEN = {
  pendiente: 1,
  resuelto: 2,
  eliminada: 3,
};

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
  const { user } = useAuth();
  const [confirmando, setConfirmando] = useState<{
    id: string;
    accion: "resuelto" | "eliminada";
  } | null>(null);
  const [nombre, setNombre] = useState("");
  const [anonimo, setAnonimo] = useState(false);
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [peticiones, setPeticiones] = useState<Peticion[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

  const peticionesQuery = useMemo(
    () =>
      query(
        collection(db, "peticiones"),
        orderBy("fechaCreacion", "desc"),
        limit(50),
      ),
    [],
  );

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
          if (p.estado === "pendiente") {
            return true;
          }

          if (p.estado === "resuelto" && p.fechaResuelta) {
            const fechaResuelta = p.fechaResuelta.toDate();
            const unMesDespues = new Date(fechaResuelta);
            unMesDespues.setMonth(unMesDespues.getMonth() + 1);
            return ahora <= unMesDespues;
          }

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

        setPeticiones(docsFiltrados);
        setLoading(false);
      },

      (error) => {
        console.error("❌ Firebase Error:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [peticionesQuery]);

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

      await addDoc(collection(db, "peticiones"), {
        nombre: anonimo ? "Anónimo" : nombre.trim(),
        texto: editor.getHTML(),
        estado: "pendiente",
        fechaCreacion: serverTimestamp(),
        ...(telefono.trim() ? { telefono: telefono.trim() } : {}),
        ...(correo.trim() ? { correo: correo.trim() } : {}),
      });

      setMensajeExito("✅ Petición creada exitosamente");
      setTimeout(() => setMensajeExito(""), 3000);

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

  const pedirConfirmacion = (id: string, accion: "resuelto" | "eliminada") => {
    setConfirmando({ id, accion });
  };

  const cancelarConfirmacion = () => setConfirmando(null);

  const actualizarEstado = async (
    id: string,
    estado: "resuelto" | "eliminada",
  ) => {
    setConfirmando(null);
    try {
      const docRef = doc(db, "peticiones", id);

      await updateDoc(docRef, {
        estado,
        ...(estado === "resuelto"
          ? { fechaResuelta: serverTimestamp() }
          : { fechaEliminada: serverTimestamp() }),
      });

      const mensaje =
        estado === "resuelto"
          ? "✅ Petición marcada como resuelta"
          : "🗑️ Petición eliminada";

      setMensajeExito(mensaje);
      setTimeout(() => setMensajeExito(""), 3000);
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
          className="w-full rounded-lg border-2 border-primary/40 bg-gray-50 px-3 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary disabled:bg-gray-200"
        />
      </div>

      {/* ========================= */}
      {/* EDITOR */}
      {/* ========================= */}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Escribe aquí la necesidad
        </label>

        <div className="border-2 border-primary/40 rounded-lg p-3 bg-gray-50">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* ========================= */}
      {/* CONTACTO OPCIONAL */}
      {/* ========================= */}

      <div className="mb-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2 mb-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 text-primary shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-semibold text-primary">
              Información de contacto para seguimiento
            </span>
          </div>
          <p className="text-xs text-primary/70 mb-4 leading-relaxed">
            Estos datos son <strong>completamente opcionales</strong> y{" "}
            <strong>solo serán visibles para los pastores</strong>. Nos permiten
            dar un seguimiento personalizado a esta petición.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-primary mb-1">
                Teléfono{" "}
                <span className="text-primary/50 font-normal">(opcional)</span>
              </label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                maxLength={20}
                placeholder="Ej. 55 1234 5678"
                className="w-full rounded-lg border border-primary/30 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-primary mb-1">
                Correo electrónico{" "}
                <span className="text-primary/50 font-normal">(opcional)</span>
              </label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                maxLength={80}
                placeholder="Ej. nombre@correo.com"
                className="w-full rounded-lg border border-primary/30 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

      {/* ========================= */}
      {/* BOTÓN */}
      {/* ========================= */}

      <button
        onClick={guardarPeticion}
        disabled={guardando}
        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {guardando ? "AGREGANDO..." : "AGREGAR PETICIÓN"}
      </button>

      {/* ========================= */}
      {/* MENSAJE */}
      {/* ========================= */}

      {mensajeExito && (
        <div className="mt-4 bg-success-subtle border border-success-border text-success-text px-4 py-3 rounded-lg text-sm text-center animate-pulse">
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
                      ? "bg-success text-white"
                      : p.estado === "pendiente"
                        ? "bg-yellow-400 text-gray-900"
                        : "bg-danger text-white"
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
                dangerouslySetInnerHTML={{ __html: p.texto }}
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

              {user && (p.telefono || p.correo) && (
                <div className="mt-3 flex flex-wrap gap-3 rounded-lg bg-primary/5 border border-primary/15 px-3 py-2">
                  <span className="flex items-center gap-1 text-xs text-primary/60 font-medium shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-3 h-3"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Contacto:
                  </span>
                  {p.telefono && (
                    <a
                      href={`tel:${p.telefono}`}
                      className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-3.5 h-3.5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {p.telefono}
                    </a>
                  )}
                  {p.correo && (
                    <a
                      href={`mailto:${p.correo}`}
                      className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-3.5 h-3.5"
                      >
                        <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                        <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                      </svg>
                      {p.correo}
                    </a>
                  )}
                </div>
              )}

              {user && p.estado === "pendiente" && (
                <div className="mt-4">
                  {confirmando?.id === p.id ? (
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-sm text-gray-600 font-medium">
                        {confirmando.accion === "resuelto"
                          ? "¿Marcar esta petición como resuelta?"
                          : "¿Eliminar esta petición?"}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            actualizarEstado(p.id, confirmando.accion)
                          }
                          className={`px-4 py-1.5 rounded-md text-sm text-white font-medium transition ${
                            confirmando.accion === "resuelto"
                              ? "bg-success hover:bg-success-hover"
                              : "bg-danger hover:bg-danger-hover"
                          }`}
                        >
                          Sí, confirmar
                        </button>
                        <button
                          onClick={cancelarConfirmacion}
                          className="px-4 py-1.5 rounded-md text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => pedirConfirmacion(p.id, "resuelto")}
                        className="bg-success text-white px-3 py-1 rounded-md text-sm hover:bg-success-hover transition"
                        title="Marcar como resuelta"
                      >
                        ✔
                      </button>
                      <button
                        onClick={() => pedirConfirmacion(p.id, "eliminada")}
                        className="bg-danger text-white px-3 py-1 rounded-md text-sm hover:bg-danger-hover transition"
                        title="Eliminar petición"
                      >
                        🗑
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
