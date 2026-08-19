interface UserAvatarButtonProps {
  initial?: string;
  onClick: () => void;
  className?: string;
}

export const UserAvatarButton = ({ initial, onClick, className = "" }: UserAvatarButtonProps) => (
  <button
    onClick={onClick}
    className={`w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center justify-center transition ${className}`}
    aria-label="Menú de usuario"
  >
    {initial}
  </button>
);
