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

const tabClassName = (activo: boolean) =>
  `flex flex-col items-center gap-1 text-[10px] font-semibold transition ${
    activo ? "text-white" : "text-white/55"
  }`;

export function BottomNav({ user, cuentaActiva, onCuentaClick }: BottomNavProps) {
  const pathname = usePathname();
  const initial = user?.email?.[0]?.toUpperCase();

  return (
    <nav
      className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-primary-darker border-t border-white/10"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-start justify-around pt-2 pb-1.5">
        <Link href="/" className={tabClassName(pathname === "/")}>
          <HomeIcon className="w-[22px] h-[22px]" />
          Inicio
        </Link>

        <Link href="/biblia" className={tabClassName(pathname === "/biblia")}>
          <BookIcon className="w-[22px] h-[22px]" />
          Biblia
        </Link>

        <Link
          href="/peticiones"
          className="flex flex-col items-center gap-1 text-white relative -top-4"
        >
          <div className="w-[52px] h-[52px] rounded-full bg-accent shadow-lg shadow-accent/40 flex items-center justify-center border-4 border-primary-darker">
            <HeartIcon className="w-[22px] h-[22px]" strokeWidth={2.2} />
          </div>
          <span className="text-[10px] font-bold -mt-1">Peticiones</span>
        </Link>

        <Link href="/configuracion" className={tabClassName(pathname === "/configuracion")}>
          <GearIcon className="w-[22px] h-[22px]" />
          Configuración
        </Link>

        <button onClick={onCuentaClick} className={tabClassName(cuentaActiva)} aria-label="Cuenta">
          {user ? (
            <div className="w-[22px] h-[22px] rounded-full bg-white/25 text-white text-[10px] font-bold flex items-center justify-center">
              {initial}
            </div>
          ) : (
            <LockIcon className="w-[22px] h-[22px]" />
          )}
          Cuenta
        </button>
      </div>
    </nav>
  );
}
