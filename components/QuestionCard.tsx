import type { ReactNode } from 'react';

interface QuestionCardProps {
  title: string;
  required: boolean;
  error?: string;
  children: ReactNode;
}

export function QuestionCard({ title, required, error, children }: QuestionCardProps) {
  return (
    <section className="rounded-2xl border border-primary/15 bg-white p-5 shadow-card sm:p-6">
      <div className="mb-5 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
        <h2 className="jp-heading min-w-0 text-[15px] font-bold leading-7 text-ink sm:text-base">{title}</h2>
        {required ? (
          <span className="shrink-0 whitespace-nowrap text-xs font-bold text-error">※必須</span>
        ) : (
          <span className="shrink-0 whitespace-nowrap text-xs font-medium text-slate-500">任意</span>
        )}
      </div>
      {children}
      {error && (
        <p className="jp-copy mt-3 text-sm font-bold text-error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
