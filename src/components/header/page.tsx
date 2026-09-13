"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAutoSolicitarNotificaciones } from "../../hooks/useAutoSolicitarNotificaciones";
import { useFcmForeground } from "../../hooks/useFcmForeground";
import AuthModal from "../auth/AuthModal";
import { CloseIcon } from "../ui/CloseIcon";
import { GearIcon } from "../ui/GearIcon";
import { BottomNav } from "./BottomNav";
import { UserAvatarButton } from "./UserAvatarButton";
import { UserMenuContent } from "./UserMenuContent";

const navLinkClassName = (activo: boolean) =>
  `text-sm font-semibold transition ${activo ? "text-white" : "text-white/70 hover:text-white"}`;

export const HeaderPage = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useFcmForeground();
  useAutoSolicitarNotificaciones();

  const initial = user?.email?.[0]?.toUpperCase();
  const handleLogout = () => { logout(); setMenuOpen(false); };
  const handleNavigate = () => setMenuOpen(false);
  const handleCuentaClick = () => (user ? setMenuOpen((v) => !v) : setShowModal(true));

  return (
    <>
      <header className="bg-primary shadow-lg">
        <div className="relative z-50 max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-center sm:justify-between h-16">

          <div className="flex items-center gap-8">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo-08-web.png"
                width={150}
                height={100}
                alt="Logo Centro Cristiano Jordán"
                className="h-10 w-auto"
              />
            </Link>

            {/* Nav con etiquetas — solo desktop, en móvil vive en el nav inferior */}
            <nav className="hidden sm:flex items-center gap-6">
              <Link href="/" className={navLinkClassName(pathname === "/")}>
                Inicio
              </Link>
              <Link href="/biblia" className={navLinkClassName(pathname === "/biblia")}>
                Biblia
              </Link>
            </nav>
          </div>

          {/* Derecha — solo desktop; en móvil todo esto vive en el nav inferior */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/peticiones"
              className="bg-accent text-white font-bold text-sm rounded-full px-5 py-2 shadow hover:bg-accent-hover active:scale-95 transition-all"
            >
              Peticiones
            </Link>

            <Link
              href="/configuracion"
              className="w-8 h-8 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
              aria-label="Configuración"
              title="Configuración"
            >
              <GearIcon strokeWidth={2.2} />
            </Link>

            {user ? (
              <div className="relative">
                <UserAvatarButton initial={initial} onClick={() => setMenuOpen((v) => !v)} />
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-primary-darker border border-white/10 rounded-xl shadow-2xl p-3 pt-4 min-w-[220px] z-50">
                    <UserMenuContent email={user.email!} onLogout={handleLogout} onNavigate={handleNavigate} />
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="text-white text-xs font-medium border border-white/70 rounded-md px-3 py-1.5 hover:bg-white/10 transition"
              >
                Iniciar sesión
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hoja de cuenta móvil — se abre desde el tab "Cuenta" del nav inferior */}
      {menuOpen && user && (
        <div className="sm:hidden">
          <div
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm motion-safe:animate-[fade-in_0.2s_ease-out]"
          />
          <div
            className="fixed bottom-16 inset-x-0 z-40 bg-primary-darker rounded-t-2xl shadow-2xl px-4 pt-3 pb-4 motion-safe:animate-[modal-in_0.25s_ease-out]"
            style={{ marginBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="flex justify-end mb-1">
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Cerrar menú"
                className="w-8 h-8 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition"
              >
                <CloseIcon />
              </button>
            </div>
            <UserMenuContent email={user.email!} onLogout={handleLogout} onNavigate={handleNavigate} />
          </div>
        </div>
      )}

      <BottomNav user={user} cuentaActiva={menuOpen} onCuentaClick={handleCuentaClick} />

      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </>
  );
};
