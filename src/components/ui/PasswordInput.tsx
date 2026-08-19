import { useState } from "react";
import { EyeIcon } from "./EyeIcon";
import { TextInput } from "./TextInput";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

export function PasswordInput({
  value,
  onChange,
  placeholder = "••••••",
  required,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <TextInput
        variant="modal"
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg px-3 py-2.5 pr-10"
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 hover:dark:text-gray-400 transition"
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        <EyeIcon open={visible} />
      </button>
    </div>
  );
}
