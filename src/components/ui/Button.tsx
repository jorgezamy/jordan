import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "success" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-dark dark:bg-primary-accent dark:hover:bg-primary-accent-hover",
  secondary:
    "bg-gray-100 dark:bg-white/10 dark:border dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 hover:dark:bg-white/20",
  success: "bg-success text-white hover:bg-success-hover",
  danger: "bg-danger text-white hover:bg-danger-hover",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`transition disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
