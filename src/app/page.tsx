import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";

export default function Home() {
  return (
    <div className="grid grid-rows-[1fr_auto_1fr] items-center justify-items-center h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="text-center">
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-800 mb-4">
          ¡Próximamente!
        </h1>
        <p className="text-lg sm:text-2xl text-gray-600 mb-6">
          Estamos trabajando para el reino de los cielos, ¡vuelve pronto!
        </p>
        <div className="flex justify-center">
          <div className="w-32 h-1 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 rounded-full"></div>
        </div>
        <div className="mt-6 text-sm text-gray-500">
          <p>¡Síguenos en nuestras redes sociales para actualizaciones!</p>
        </div>
        <div className="mt-8 flex justify-center space-x-8 text-3xl text-gray-700">
          <a
            href="https://www.tiktok.com/@ccristianojordan"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-500"
          >
            <FaTiktok />
          </a>
          <a
            href="https://www.instagram.com/ccristianojordan/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-500"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.facebook.com/ccristianojordan"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-500"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://wa.me/524425813349?text=¡Hola,%20buen%20día!%20😊"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-500 transition-colors duration-300"
          >
            <FaWhatsapp />
          </a>
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl border border-teal-100 bg-white/80 backdrop-blur-sm shadow-[0_10px_40px_rgba(20,184,166,0.15)] p-6">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-100 rounded-full blur-3xl opacity-60"></div>

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-500 text-white text-2xl shadow-lg mb-4">
              <FaWhatsapp />
            </div>

            <h2 className="text-xl font-semibold text-gray-800">
              Mientras tanto...
            </h2>

            <p className="mt-2 text-gray-600 leading-relaxed">
              No te pierdas las reflexiones, mensajes y contenido exclusivo.
              Únete a nuestro canal oficial de WhatsApp.
            </p>

            <a
              href="https://whatsapp.com/channel/0029Var39AA6WaKpedjRDJ1Y"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-3 rounded-2xl bg-teal-500 px-6 py-4 text-white font-medium shadow-lg shadow-teal-500/30 transition-all duration-300 hover:scale-[1.03] hover:bg-teal-600"
            >
              <FaWhatsapp className="text-xl transition-transform duration-300 group-hover:rotate-12" />

              <span>Seguir canal de WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
