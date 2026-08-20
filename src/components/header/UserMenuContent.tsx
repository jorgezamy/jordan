import Link from "next/link";
import { BellIcon } from "../ui/BellIcon";
import { BookIcon } from "../ui/BookIcon";
import { LogoutIcon } from "../ui/LogoutIcon";

interface UserMenuContentProps {
  email: string;
  onLogout: () => void;
  onNavigate: () => void;
}

export const UserMenuContent = ({ email, onLogout, onNavigate }: UserMenuContentProps) => {
  const initial = email[0]?.toUpperCase();

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 px-2 pb-3">
        <div className="w-9 h-9 shrink-0 rounded-full bg-white/15 text-white text-sm font-bold flex items-center justify-center">
          {initial}
        </div>
        <span className="text-white text-xs break-all leading-relaxed">{email}</span>
      </div>

      <div className="h-px bg-white/10" />

      <nav className="flex flex-col gap-0.5 py-2">
        <Link
          href="/avisos"
          onClick={onNavigate}
          className="flex items-center gap-2.5 text-white text-sm rounded-lg px-2.5 py-2 hover:bg-white/10 transition"
        >
          <BellIcon className="w-4 h-4 text-white/60" />
          Gestionar avisos
        </Link>

        <Link
          href="/citas"
          onClick={onNavigate}
          className="flex items-center gap-2.5 text-white text-sm rounded-lg px-2.5 py-2 hover:bg-white/10 transition"
        >
          <BookIcon className="w-4 h-4 text-white/60" />
          Gestionar citas
        </Link>
      </nav>

      <div className="h-px bg-white/10" />

      <button
        onClick={onLogout}
        className="flex items-center gap-2.5 text-white/80 text-sm rounded-lg px-2.5 py-2 mt-2 hover:bg-white/10 hover:text-white transition text-left"
      >
        <LogoutIcon className="w-4 h-4" />
        Cerrar sesión
      </button>
    </div>
  );
};
