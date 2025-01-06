import Image from "next/image";
import Link from "next/link";

export const HeaderPage = () => {
  return (
    <>
      <header className="bg-[#003241] flex justify-between items-center py-3 px-5">
        {/* Logo */}
        <div className="flex items-center pl-8">
          <Link href="/">
            <Image
              src="/logo-08-web.png"
              width={150}
              height={100}
              alt="Logo"
              className="h-12" // Ajusta el tamaño del logo
            />
          </Link>
        </div>

        {/* Navegación */}
        <nav className="flex gap-8">
          {/*<Link
            href="/groups"
            className="text-white text-lg font-bold hover:text-gray-300 transition-colors"
          >
            Próximamente
          </Link>
           <Link
            href="/groups"
            className="text-white text-lg font-bold hover:text-gray-300 transition-colors"
          >
            Grupos
          </Link>
          <Link
            href="/contact"
            className="text-white text-lg font-bold hover:text-gray-300 transition-colors"
          >
            Contáctanos
          </Link> */}
        </nav>
      </header>
    </>
  );
};
