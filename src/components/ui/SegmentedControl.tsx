interface SegmentedControlOption<T extends string> {
  key: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (key: T) => void;
  className?: string;
  optionClassName?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = "",
  optionClassName = "",
}: SegmentedControlProps<T>) {
  return (
    <div
      className={`rounded-lg border border-primary/30 dark:border-white/30 bg-gray-50 dark:bg-white/5 p-0.5 ${className}`}
    >
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={`text-center font-medium rounded-md transition ${
            value === opt.key
              ? "bg-primary text-white dark:bg-primary-accent"
              : "text-primary/70 dark:text-white/70 hover:bg-primary/10 hover:dark:bg-white/10"
          } ${optionClassName}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
