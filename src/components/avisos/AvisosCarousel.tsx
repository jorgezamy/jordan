"use client";

import { useEffect, useState } from "react";

import { useAvisos } from "./useAvisos";
import { formatRangoFecha } from "./utils";

const AUTOPLAY_MS = 6000;

export function AvisosCarousel() {
  const { avisos, loading } = useAvisos();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [bannerError, setBannerError] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setIndex(0);
  }, [avisos.length]);

  useEffect(() => {
    if (paused || avisos.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % avisos.length);
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [paused, avisos.length]);

  if (loading || avisos.length === 0) return null;

  const aviso = avisos[index];
  const mostrarBanner = Boolean(aviso.bannerUrl) && !bannerError[aviso.id];
  const anterior = () => setIndex((i) => (i - 1 + avisos.length) % avisos.length);
  const siguiente = () => setIndex((i) => (i + 1) % avisos.length);

  return (
    <div
      className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-accent-subtle dark:border-white/10 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-sm shadow-[0_10px_30px_rgba(20,184,166,0.10)] px-6 py-5 sm:px-8 sm:py-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">Avisos</span>
        </div>

        {avisos.length > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={anterior}
              aria-label="Aviso anterior"
              className="w-6 h-6 flex items-center justify-center rounded-full text-gray-500 dark:text-white/70 hover:bg-accent/10 transition"
            >
              ‹
            </button>
            <button
              onClick={siguiente}
              aria-label="Aviso siguiente"
              className="w-6 h-6 flex items-center justify-center rounded-full text-gray-500 dark:text-white/70 hover:bg-accent/10 transition"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {mostrarBanner ? (
        <div
          key={aviso.id}
          className="relative rounded-2xl overflow-hidden aspect-video motion-safe:animate-[fade-in_0.35s_ease-out]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={aviso.bannerUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setBannerError((prev) => ({ ...prev, [aviso.id]: true }))}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="flex items-center gap-2 flex-wrap">
              {aviso.importante && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-primary-accent text-white">
                  Importante
                </span>
              )}
              <h3 className="text-lg font-bold text-white drop-shadow-sm">{aviso.titulo}</h3>
            </div>

            {aviso.descripcion && (
              <p className="mt-1 text-sm text-white/90 leading-relaxed">{aviso.descripcion}</p>
            )}

            {aviso.fecha && (
              <p className="mt-1.5 text-xs font-medium text-white/80">
                {formatRangoFecha(aviso.fecha, aviso.fechaFin)}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div key={aviso.id} className="min-h-[5rem] motion-safe:animate-[fade-in_0.35s_ease-out]">
          <div className="flex items-center gap-2 flex-wrap">
            {aviso.importante && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-primary-accent text-white">
                Importante
              </span>
            )}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{aviso.titulo}</h3>
          </div>

          {aviso.descripcion && (
            <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {aviso.descripcion}
            </p>
          )}

          {aviso.fecha && (
            <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent-hover dark:text-accent">
              {formatRangoFecha(aviso.fecha, aviso.fechaFin)}
            </p>
          )}
        </div>
      )}

      {avisos.length > 1 && (
        <div className="mt-4 flex gap-1">
          {avisos.map((a, i) => (
            <button
              key={a.id}
              onClick={() => setIndex(i)}
              aria-label={`Ir al aviso ${i + 1}`}
              className="h-1 flex-1 rounded-full bg-accent/15 overflow-hidden"
            >
              <div
                className="h-full bg-accent rounded-full"
                style={
                  i < index
                    ? { width: "100%" }
                    : i > index
                      ? { width: "0%" }
                      : {
                        width: "100%",
                        animation: `progress-bar ${AUTOPLAY_MS}ms linear`,
                        animationPlayState: paused ? "paused" : "running",
                      }
                }
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
