interface UserMenuContentProps {
  email: string;
  onLogout: () => void;
}

export const UserMenuContent = ({ email, onLogout }: UserMenuContentProps) => (
  <>
    <span className="text-white text-xs break-all leading-relaxed">{email}</span>
    <button
      onClick={onLogout}
      className="text-white text-xs font-medium border border-white/70 rounded-md px-3 py-1.5 hover:bg-white/10 transition"
    >
      Cerrar sesión
    </button>
  </>
);
