"use client";

import { EditorContent } from "@tiptap/react";

import { Alert } from "../ui/Alert";
import { Button } from "../ui/Button";
import { TextInput } from "../ui/TextInput";
import { useNuevaPeticion } from "./useNuevaPeticion";

interface NuevaPeticionFormProps {
  form: ReturnType<typeof useNuevaPeticion>;
  mensajeExito: string;
}

export function NuevaPeticionForm({ form, mensajeExito }: NuevaPeticionFormProps) {
  const {
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
  } = form;

  return (
    <>
      <h2 className="text-sm font-semibold text-primary/70 dark:text-white/70 uppercase tracking-wide mb-3">
        Nueva petición
      </h2>

      {/* ========================= */}
      {/* TIPO */}
      {/* ========================= */}

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={!anonimo} onChange={elegirEsMi} />
          Es para mi / alguien más
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={anonimo} onChange={elegirAnonimo} />
          Anónimo
        </label>
      </div>

      {/* ========================= */}
      {/* NOMBRE */}
      {/* ========================= */}

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nombre
        </label>

        <TextInput
          type="text"
          value={nombre}
          disabled={anonimo}
          maxLength={80}
          onChange={(e) => setNombre(e.target.value)}
          placeholder={anonimo ? "Anónimo" : "Escribe aquí el nombre..."}
          className="w-full rounded-lg px-3 py-2"
        />
      </div>

      {/* ========================= */}
      {/* EDITOR */}
      {/* ========================= */}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Escribe aquí la necesidad
        </label>

        <div className="border-2 border-primary/40 dark:border-white/40 rounded-lg p-3 bg-gray-50 dark:bg-white/5">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* ========================= */}
      {/* CONTACTO OPCIONAL */}
      {/* ========================= */}

      <div className="mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Teléfono{" "}
              <span className="text-gray-400 dark:text-gray-500 font-normal">(opcional)</span>
            </label>
            <TextInput
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              maxLength={20}
              placeholder="Ej. 55 1234 5678"
              className="w-full rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Correo electrónico{" "}
              <span className="text-gray-400 dark:text-gray-500 font-normal">(opcional)</span>
            </label>
            <TextInput
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              maxLength={80}
              placeholder="Ej. nombre@correo.com"
              className="w-full rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-gray-800 dark:text-yellow-400 mt-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-3 h-3 shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
              clipRule="evenodd"
            />
          </svg>
          Opcional — solo lo ve el equipo pastoral, para darte seguimiento personal.
        </p>
      </div>

      {/* ========================= */}
      {/* BOTÓN */}
      {/* ========================= */}

      <Button
        onClick={guardarPeticion}
        disabled={guardando}
        className="w-full py-2 rounded-lg font-medium"
      >
        {guardando ? "AGREGANDO..." : "AGREGAR PETICIÓN"}
      </Button>

      {/* ========================= */}
      {/* MENSAJE */}
      {/* ========================= */}

      {mensajeExito && (
        <Alert variant="success" className="mt-4 px-4 py-3 text-center animate-pulse">
          {mensajeExito}
        </Alert>
      )}
    </>
  );
}
