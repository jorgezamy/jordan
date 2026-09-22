"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "firebase/auth";

import { BookIcon } from "../ui/BookIcon";
import { GearIcon } from "../ui/GearIcon";
import { HeartIcon } from "../ui/HeartIcon";
import { HomeIcon } from "../ui/HomeIcon";
import { LockIcon } from "../ui/LockIcon";

interface BottomNavProps {
  user: User | null;
  cuentaActiva: boolean;
  onCuentaClick: () => void;
}

// Tab activo: icono elevado en un círculo verde, "salta" sobre el nav.
// Tab inactivo: icono plano, atenuado, en línea con el resto.
function NavTabContent({ icon, label, activo }: { icon: React.ReactNode; label: string; activo: boolean }) {
  if (activo) {
    return (
      <div className="flex flex-col items-center gap-1 text-[10px] font-bold text-white relative -top-4">
        <div className="w-[52px] h-[52px] rounded-full bg-accent shadow-lg shadow-accent/40 flex items-center justify-center border-4 border-primary-darker transition">
          {icon}
        </div>
        <span className="-mt-1">{label}</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-1 text-[10px] font-semibold text-white/55 transition">
      {icon}
      {label}
    </div>
  );
}

export function BottomNav({ user, cuentaActiva, onCuentaClick }: BottomNavProps) {
  const pathname = usePathname();
  const initial = user?.email?.[0]?.toUpperCase();
  // Con la hoja de cuenta abierta, esa es la única pestaña activa —
  // ninguna ruta se marca como seleccionada mientras tanto.
  const rutaActiva = (ruta: string) => !cuentaActiva && pathname === ruta;

  return (
    <nav
      className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-primary-darker border-t border-white/10"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-start pt-2 pb-1.5">
        <Link href="/" className="flex-1 flex justify-center">
          <NavTabContent icon={<HomeIcon className="w-[22px] h-[22px]" />} label="Inicio" activo={rutaActiva("/")} />
        </Link>

        <Link href="/biblia" className="flex-1 flex justify-center">
          <NavTabContent icon={<BookIcon className="w-[22px] h-[22px]" />} label="Biblia" activo={rutaActiva("/biblia")} />
        </Link>

        <Link href="/peticiones" className="flex-1 flex justify-center">
          <NavTabContent
            icon={<HeartIcon className="w-[22px] h-[22px]" strokeWidth={2.2} />}
            label="Peticiones"
            activo={rutaActiva("/peticiones")}
          />
        </Link>

        <Link href="/configuracion" className="flex-1 flex justify-center">
          <NavTabContent
            icon={<GearIcon className="w-[22px] h-[22px]" />}
            label="Configuración"
            activo={rutaActiva("/configuracion")}
          />
        </Link>

        <button onClick={onCuentaClick} className="flex-1 flex justify-center" aria-label="Cuenta">
          <NavTabContent
            icon={
              user ? (
                <div className="w-[22px] h-[22px] rounded-full bg-white/25 text-white text-[10px] font-bold flex items-center justify-center">
                  {initial}
                </div>
              ) : (
                <LockIcon className="w-[22px] h-[22px]" />
              )
            }
            label="Cuenta"
            activo={cuentaActiva}
          />
        </button>
      </div>
    </nav>
  );
}
