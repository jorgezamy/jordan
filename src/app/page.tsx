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
            href="https://whatsapp.com/channel/0029Var39AA6WaKpedjRDJ1Y"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-500"
          >
            <FaWhatsapp />
          </a>
        </div>
      </div>
    </div>
  );
}
