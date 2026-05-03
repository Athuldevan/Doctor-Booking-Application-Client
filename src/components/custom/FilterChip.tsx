// components/common/FilterChips.tsx
interface FilterOption {
  value: string;
  label: string;
}

interface FilterChipsProps {
  options: FilterOption[];
  selected: string;
  onChange: (value: string) => void;
}

export default function FilterChips({
  options,
  selected,
  onChange,
}: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
            selected === opt.value
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-primary/10"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}