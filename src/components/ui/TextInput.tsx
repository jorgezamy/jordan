import { forwardRef, InputHTMLAttributes } from "react";

type TextInputVariant = "modal" | "form";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: TextInputVariant;
}

const VARIANT_CLASSES: Record<TextInputVariant, string> = {
  modal:
    "border border-gray-200 dark:border-white/25 bg-white dark:bg-surface-dark text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary focus:dark:border-white focus:ring-2 focus:ring-primary/20 focus:dark:ring-white/20",
  form:
    "border-2 border-primary/40 dark:border-white/40 bg-gray-50 dark:bg-white/5 shadow-sm focus:border-primary focus:dark:border-white focus:ring-2 focus:ring-primary focus:dark:ring-white disabled:bg-gray-200 disabled:dark:bg-white/10",
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ variant = "form", className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`outline-none transition-colors ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  ),
);

TextInput.displayName = "TextInput";
