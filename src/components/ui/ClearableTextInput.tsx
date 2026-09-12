import { InputHTMLAttributes } from "react";
import { CloseIcon } from "./CloseIcon";
import { TextInput } from "./TextInput";

interface ClearableTextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "modal" | "form";
  onClear: () => void;
  clearAriaLabel?: string;
}

export function ClearableTextInput({
  value,
  onClear,
  clearAriaLabel = "Borrar",
  className = "",
  disabled,
  ...props
}: ClearableTextInputProps) {
  const tieneValor = typeof value === "string" && value.length > 0 && !disabled;

  return (
    <div className="relative">
      <TextInput
        value={value}
        disabled={disabled}
        className={`${tieneValor ? "pr-9" : ""} ${className}`}
        {...props}
      />
      {tieneValor && (
        <button
          type="button"
          onClick={onClear}
          aria-label={clearAriaLabel}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-white/10 transition"
        >
          <CloseIcon className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
