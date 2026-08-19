import { ReactNode } from "react";

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
      {children}
    </label>
  );
}
