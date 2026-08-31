'use client';

const MAX_LENGTH = 1000;

interface TextAreaFieldProps {
  id: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export function TextAreaField({ id, value, placeholder, onChange }: TextAreaFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">ご意見・ご要望</label>
      <textarea
        id={id}
        value={value}
        maxLength={MAX_LENGTH}
        rows={6}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-base leading-7 text-ink outline-none placeholder:text-sm placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <p className="mt-1 text-right text-xs text-slate-500" aria-live="polite">
        {value.length} / {MAX_LENGTH}文字
      </p>
    </div>
  );
}
