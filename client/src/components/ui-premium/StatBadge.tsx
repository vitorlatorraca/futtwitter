import * as React from "react";
import { cn } from "@/lib/utils";

export type StatBadgeVariant =
  | "W" | "D" | "L"
  | "success" | "warning" | "danger" | "info"
  | "finished" | "live" | "upcoming"
  | "rumor" | "negociacao" | "fechado";

export interface StatBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant: StatBadgeVariant;
  label?: string;
  size?: "sm" | "md";
}

const variantClasses: Record<StatBadgeVariant, string> = {
  W: "badge-success",
  D: "badge-warning",
  L: "badge-danger",
  success: "badge-success",
  warning: "badge-warning",
  danger: "badge-danger",
  info: "badge-info",
  finished: "badge-info",
  live: "badge-danger",
  upcoming: "badge-warning",
  rumor: "badge-warning",
  negociacao: "badge-info",
  fechado: "badge-success",
};

const defaultLabels: Record<StatBadgeVariant, string> = {
  W: "W",
  D: "D",
  L: "L",
  success: "Sucesso",
  warning: "Atenção",
  danger: "Erro",
  info: "Info",
  finished: "Finalizado",
  live: "Ao vivo",
  upcoming: "Em breve",
  rumor: "Rumor",
  negociacao: "Em negociação",
  fechado: "Fechado",
};

const sizeClasses = {
  sm: "text-[10px] px-1.5 py-0.5 min-w-[1.25rem]",
  md: "text-xs px-2 py-1 min-w-[1.5rem]",
};

export function StatBadge({
  variant,
  label,
  size = "md",
  className,
  ...props
}: StatBadgeProps) {
  const displayLabel = label ?? defaultLabels[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded font-bold",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {displayLabel}
    </span>
  );
}
