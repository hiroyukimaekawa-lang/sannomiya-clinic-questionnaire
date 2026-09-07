'use client';

interface ChoiceGroupProps {
  name: string;
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
}

export function ChoiceGroup({ name, label, options, value, onChange, hasError }: ChoiceGroupProps) {
  return (
    <div role="radiogroup" aria-label={label} aria-invalid={hasError || undefined} className="grid gap-2.5">
      {options.map((option, index) => {
        const selected = value === option;
        const id = `${name}-${index}`;
        return (
          <label
            key={option}
            htmlFor={id}
            className={`flex min-h-12 cursor-pointer items-center rounded-xl border px-4 py-3 text-[15px] font-medium transition focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${
              selected ? 'border-primary bg-primary-soft text-primary-dark' : 'border-slate-200 bg-white text-ink hover:border-primary/60'
            }`}
          >
            <input
              id={id}
              name={name}
              type="radio"
              value={option}
              checked={selected}
              onChange={() => onChange(option)}
              className="sr-only"
            />
            <span className={`mr-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${selected ? 'border-primary' : 'border-slate-300'}`}>
              {selected && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
            </span>
            <span className="jp-copy min-w-0">{option}</span>
          </label>
        );
      })}
    </div>
  );
}
