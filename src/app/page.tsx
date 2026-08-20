import { FaWhatsapp } from "react-icons/fa";
import { AvisosCarousel } from "../components/avisos/AvisosCarousel";
import { CitaBiblicaCard } from "../components/citaBiblica/CitaBiblicaCard";
import { SOCIAL_LINKS } from "./constants";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-12 px-8 py-12 sm:px-20 sm:py-16 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full max-w-2xl flex flex-col items-center gap-4">
        <CitaBiblicaCard />
        <AvisosCarousel />
      </div>

      <p className="text-sm sm:text-2xl text-gray-600 dark:text-gray-400 text-center max-w-[92vw] sm:max-w-none">
        Estamos trabajando para el reino de los cielos.
      </p>

      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl border border-accent-subtle dark:border-white/10 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-sm shadow-[0_10px_40px_rgba(20,184,166,0.12)] p-6 sm:p-8">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/15 dark:bg-accent/10 rounded-full blur-3xl" />

          <div className="relative z-10 text-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Síguenos</h2>

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              No te pierdas las reflexiones, mensajes y contenido exclusivo.
            </p>

            <div className="mt-5 flex justify-center gap-5 text-2xl text-gray-500 dark:text-gray-400">
              {SOCIAL_LINKS.map(({ href, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  <Icon />
                </a>
              ))}
            </div>

            <a
              href="https://whatsapp.com/channel/0029Var39AA6WaKpedjRDJ1Y"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-2 sm:gap-3 whitespace-nowrap rounded-2xl bg-accent px-4 sm:px-6 py-3.5 text-white text-sm sm:text-base font-medium shadow-lg shadow-accent/30 transition-all duration-300 hover:scale-[1.02] hover:bg-accent-hover"
            >
              <FaWhatsapp className="text-lg sm:text-xl shrink-0 transition-transform duration-300 group-hover:rotate-12" />
              <span>Seguir canal de WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
