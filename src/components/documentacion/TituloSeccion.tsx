interface TituloSeccionProps {
  titulo: string;
  children: React.ReactNode;
}

export function TituloSeccion({ titulo, children }: TituloSeccionProps) {
  return (
    <div className="mb-4">
      <h2 className="text-xs font-bold uppercase tracking-widest text-accent">{titulo}</h2>
      <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{children}</p>
    </div>
  );
}
