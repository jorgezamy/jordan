"use client";
import { useState, useEffect } from "react";
import { db } from "../../../firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
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

function formatFecha(timestamp?: Timestamp) {
  if (!timestamp) return "";
  const date = timestamp.toDate();
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function Peticiones() {
  const [nombre, setNombre] = useState<string>("");
  const [anonimo, setAnonimo] = useState<boolean>(false); // por defecto "Es para mí"
  const [peticiones, setPeticiones] = useState<Peticion[]>([]);

  const peticionesRef = collection(db, "peticiones");

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    immediatelyRender: false,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(peticionesRef, (snapshot) => {
      const docs = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Peticion[];

      docs.sort((a, b) => {
        const fechaA =
          a.fechaResuelta?.seconds ?? a.fechaCreacion?.seconds ?? 0;
        const fechaB =
          b.fechaResuelta?.seconds ?? b.fechaCreacion?.seconds ?? 0;
        return fechaB - fechaA;
      });

      setPeticiones(docs);
    });
    return () => unsubscribe();
  }, []);

  const guardarPeticion = async () => {
    if (!editor) return;
    await addDoc(peticionesRef, {
      nombre: anonimo ? "Anónimo" : nombre,
      texto: editor.getHTML(),
      estado: "pendiente",
      fechaCreacion: serverTimestamp(),
    });
    setNombre("");
    setAnonimo(false);
    editor.commands.setContent("");
  };

  const pedirPassword = (): boolean => {
    const pass = prompt("Ingresa la contraseña:");
    return pass === "12345";
  };

  const marcarResuelta = async (id: string) => {
    if (!pedirPassword()) return alert("Contraseña incorrecta");
    const docRef = doc(db, "peticiones", id);
    await updateDoc(docRef, {
      estado: "resuelto",
      fechaResuelta: serverTimestamp(),
    });
  };

  const eliminarPeticion = async (id: string) => {
    if (!pedirPassword()) return alert("Contraseña incorrecta");
    const docRef = doc(db, "peticiones", id);
    await updateDoc(docRef, {
      estado: "eliminada",
      fechaEliminada: serverTimestamp(),
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📌 Peticiones</h2>

      <div className="mb-6">
        {/* Radios primero */}
        <div className="flex gap-4 text-sm text-gray-600 mb-3">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              checked={!anonimo}
              onChange={() => {
                setAnonimo(false);
                setNombre(""); // limpiar para que el usuario escriba
              }}
            />
            Es para mí
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              checked={anonimo}
              onChange={() => {
                setAnonimo(true);
                setNombre("Anónimo"); // asignar automáticamente
              }}
            />
            Anónimo
          </label>
        </div>

        <label className="block text-sm font-medium text-gray-700">
          Nombre
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          disabled={anonimo}
          placeholder={anonimo ? "Anónimo" : "Escribe aquí tu nombre..."}
          className="mt-1 w-full rounded-lg border border-gray-400 bg-gray-50 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-200"
        />
      </div>

      <label className="block text-sm font-medium text-gray-700">
        Escribe aquí tu petición
      </label>
      <div className="border rounded-lg p-3 mb-4">
        <EditorContent editor={editor} />
      </div>

      <button
        onClick={guardarPeticion}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        Guardar
      </button>

      <h3 className="text-xl font-semibold text-gray-700 mt-8 mb-4">
        Lista de Peticiones
      </h3>
      <ul className="space-y-4">
        {peticiones.map((p) => (
          <li key={p.id} className="p-4 rounded-lg shadow-md border bg-white">
            <div className="flex justify-between items-center">
              <strong className="text-lg text-gray-900">{p.nombre}</strong>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${
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
              className="text-gray-700 text-sm mt-2"
              dangerouslySetInnerHTML={{ __html: p.texto }}
            />

            <div className="text-xs text-gray-500 mt-2">
              {p.estado === "pendiente" && p.fechaCreacion && (
                <span>Creada: {formatFecha(p.fechaCreacion)}</span>
              )}
              {p.estado === "resuelto" && p.fechaResuelta && (
                <span>Resuelta: {formatFecha(p.fechaResuelta)}</span>
              )}
              {p.estado === "eliminada" && p.fechaEliminada && (
                <span>Eliminada: {formatFecha(p.fechaEliminada)}</span>
              )}
            </div>

            {p.estado === "pendiente" && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => marcarResuelta(p.id)}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Marcar como Resuelto
                </button>
                <button
                  onClick={() => eliminarPeticion(p.id)}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium"
                >
                  Eliminar
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
