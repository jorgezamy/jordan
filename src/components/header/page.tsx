"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

export const HeaderPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

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

        {/* Icono para el menú móvil */}
        <div className="md:hidden flex items-center">
          <button
            className="text-white text-2xl focus:outline-none"
            onClick={toggleMenu}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Navegación */}
        <nav
          className={`${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } fixed top-0 left-0 w-2/3 h-full bg-[#003241] md:static md:w-auto md:h-auto md:flex md:translate-x-0 md:gap-8 transition-transform duration-300 ease-in-out z-50`}
        >
          <Link
            href="/groups"
            className="block text-white text-lg font-bold hover:text-gray-300 transition-colors py-4 px-6 md:py-0 md:px-0"
          >
            Conócenos
          </Link>
          <Link
            href="/groups"
            className="block text-white text-lg font-bold hover:text-gray-300 transition-colors py-4 px-6 md:py-0 md:px-0"
          >
            Actividades
          </Link>
          <Link
            href="/groups"
            className="block text-white text-lg font-bold hover:text-gray-300 transition-colors py-4 px-6 md:py-0 md:px-0"
          >
            Conexión
          </Link>
          <Link
            href="/contact"
            className="block text-white text-lg font-bold hover:text-gray-300 transition-colors py-4 px-6 md:py-0 md:px-0"
          >
            Contacto
          </Link>
        </nav>
      </header>

      {/* Fondo oscuro detrás del menú móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={toggleMenu} // Cerrar el menú al hacer clic fuera
        ></div>
      )}
    </>
  );
};
