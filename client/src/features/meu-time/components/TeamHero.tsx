import type { ClubTheme } from '../types';

interface TeamHeroProps {
  theme: ClubTheme;
  children: React.ReactNode;
  className?: string;
}

/** Wrapper for header area: gradient + optional texture background */
export function TeamHero({ theme, children, className = '' }: TeamHeroProps) {
  const gradient =
    theme.gradient ??
    `linear-gradient(${theme.gradientDeg ?? 135}deg, ${theme.primary}15 0%, ${theme.secondary}12 100%)`;

  return (
    <div
      className={`relative overflow-hidden rounded-soft ${className}`}
      style={{ background: gradient }}
    >
      <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" aria-hidden />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
