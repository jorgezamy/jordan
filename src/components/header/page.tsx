"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AuthModal from "../auth/AuthModal";
import { ThemeToggle } from "../theme/ThemeToggle";
import { LockIcon } from "../ui/LockIcon";
import { UserAvatarButton } from "./UserAvatarButton";
import { UserMenuContent } from "./UserMenuContent";

export const HeaderPage = () => {
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const initial = user?.email?.[0]?.toUpperCase();
  const handleLogout = () => { logout(); setMenuOpen(false); };

  return (
    <>
      <header className="bg-primary shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo-08-web.png"
              width={150}
              height={100}
              alt="Logo Centro Cristiano Jordán"
              className="h-10 w-auto"
            />
          </Link>

          {/* Derecha */}
          <div className="flex items-center gap-3">

            {/* Peticiones — siempre visible, es el CTA principal */}
            <Link
              href="/peticiones"
              className="bg-white text-primary font-bold text-sm rounded-full px-5 py-2 shadow hover:bg-white/90 active:scale-95 transition-all"
            >
              Peticiones
            </Link>

            <ThemeToggle />

            {/* Auth desktop */}
            {user ? (
              <div className="hidden sm:block relative">
                <UserAvatarButton initial={initial} onClick={() => setMenuOpen((v) => !v)} />
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-primary-darker border border-white/10 rounded-xl shadow-2xl p-4 flex flex-col gap-3 min-w-[200px] z-50">
                    <UserMenuContent email={user.email!} onLogout={handleLogout} />
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="hidden sm:block text-white text-xs font-medium border border-white/70 rounded-md px-3 py-1.5 hover:bg-white/10 transition"
              >
                Iniciar sesión
              </button>
            )}

            {/* Auth móvil */}
            <div className="sm:hidden">
              {user ? (
                <UserAvatarButton initial={initial} onClick={() => setMenuOpen((v) => !v)} />
              ) : (
                <button
                  onClick={() => setShowModal(true)}
                  className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition"
                  aria-label="Iniciar sesión"
                >
                  <LockIcon strokeWidth={2.8} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dropdown móvil */}
        {menuOpen && user && (
          <div className="sm:hidden bg-primary-darker border-t border-white/10 px-5 py-4 flex flex-col gap-3">
            <UserMenuContent email={user.email!} onLogout={handleLogout} />
          </div>
        )}
      </header>

      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </>
  );
};
