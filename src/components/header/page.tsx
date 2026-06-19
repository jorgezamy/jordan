"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AuthModal from "../auth/AuthModal";

export const HeaderPage = () => {
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

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
              className="h-12 w-auto"
            />
          </Link>
        </div>

        {/* Navegación */}
        <nav className="flex gap-6 items-center">
          <Link
            href="/peticiones"
            className="text-white text-lg font-bold hover:text-gray-300 transition-colors"
          >
            Peticiones
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-300 text-sm hidden sm:block truncate max-w-[180px]">
                {user.email}
              </span>
              <button
                onClick={logout}
                className="text-white text-sm border border-white/30 rounded-lg px-3 py-1.5 hover:bg-white/10 transition whitespace-nowrap"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="text-white text-sm border border-white/30 rounded-lg px-3 py-1.5 hover:bg-white/10 transition whitespace-nowrap"
            >
              Iniciar sesión
            </button>
          )}
        </nav>
      </header>

      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </>
  );
};
