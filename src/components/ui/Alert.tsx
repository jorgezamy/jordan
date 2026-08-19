import { ReactNode } from "react";

type AlertVariant = "success" | "danger";

interface AlertProps {
  variant: AlertVariant;
  className?: string;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  success: "bg-success-subtle border-success-border text-success-text",
  danger: "bg-danger-subtle border-danger-border text-danger-text",
};

export function Alert({ variant, className = "", children }: AlertProps) {
  return (
    <div className={`border rounded-lg text-sm ${VARIANT_CLASSES[variant]} ${className}`}>
      {children}
    </div>
  );
}
