import { cn } from '@/lib/utils';
import { FORMATIONS, type FormationKey } from './LineupLayout';

interface FormationSelectorProps {
  value: string;
  onChange: (formation: FormationKey) => void;
  className?: string;
}

export function FormationSelector({ value, onChange, className }: FormationSelectorProps) {
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)} role="group" aria-label="Selecionar formação">
      {FORMATIONS.map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => onChange(f)}
          className={cn(
            'rounded-full px-3 py-1.5 text-sm font-bold transition-all duration-200',
            'border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent',
            value === f
              ? 'border-primary bg-primary text-primary-foreground shadow-glow-primary'
              : 'border-white/10 bg-white/5 text-foreground-secondary hover:bg-white/10 hover:text-foreground hover:border-white/20'
          )}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
