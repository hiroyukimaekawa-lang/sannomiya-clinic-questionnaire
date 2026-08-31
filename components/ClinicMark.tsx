export function ClinicMark({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="23" fill="#EAF3F3" />
      <path d="M24 11v26M11 24h26" stroke="#5E969E" strokeWidth="5" strokeLinecap="round" />
      <path d="M31.5 30.5c4.3-2.5 5.4-7.3 3.1-10.3" stroke="#3E747C" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
