interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
}

export function Switch({ checked, onChange, disabled, loading, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-busy={loading}
      aria-label={label}
      disabled={disabled || loading}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed ${
        checked ? "bg-primary dark:bg-primary-accent" : "bg-gray-300 dark:bg-white/20"
      }`}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="h-3.5 w-3.5 rounded-full border-2 border-white/80 border-t-transparent animate-spin" />
        </span>
      )}
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        } ${loading ? "opacity-0" : ""}`}
      />
    </button>
  );
}
