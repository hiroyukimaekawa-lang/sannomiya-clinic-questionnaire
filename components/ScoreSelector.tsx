'use client';

const scores = Array.from({ length: 10 }, (_, index) => index + 1);

interface ScoreSelectorProps {
  name: string;
  label: string;
  value: number | null;
  onChange: (score: number) => void;
  hasError?: boolean;
}

export function ScoreSelector({ name, label, value, onChange, hasError }: ScoreSelectorProps) {
  return (
    <div role="radiogroup" aria-label={`${label}。1は非常に不満、10は非常に満足`} aria-invalid={hasError || undefined}>
      <div className="-mx-4 grid grid-cols-10 gap-px">
        {scores.map((score) => {
          const selected = score === value;
          return (
            <button
              key={score}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${score}点`}
              onClick={() => onChange(score)}
              className={`aspect-square min-w-0 rounded-full border text-[11px] font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-[390px]:text-xs ${
                selected ? 'border-primary bg-primary text-white shadow-sm' : 'border-slate-300 bg-white text-primary-dark hover:border-primary hover:bg-primary-soft'
              }`}
              name={name}
            >
              {score}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-2" aria-hidden="true">
        <span className="h-px flex-1 bg-gradient-to-r from-slate-200 to-primary/60" />
        <span className="text-xs text-primary">→</span>
      </div>
      <div className="jp-copy mt-1.5 flex justify-between gap-3 text-xs font-medium text-slate-600">
        <span className="whitespace-nowrap">非常に不満</span>
        <span className="whitespace-nowrap">非常に満足</span>
      </div>
    </div>
  );
}
