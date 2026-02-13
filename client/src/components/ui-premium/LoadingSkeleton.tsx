import * as React from "react";
import { cn } from "@/lib/utils";

export interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Variante: card (padrão), list, row, text */
  variant?: "card" | "list" | "row" | "text";
}

export function LoadingSkeleton({
  className,
  variant = "card",
  ...props
}: LoadingSkeletonProps) {
  const base = "animate-pulse rounded-lg bg-muted/60";

  if (variant === "card") {
    return (
      <div
        className={cn(base, "h-64 rounded-2xl", className)}
        {...props}
      />
    );
  }

  if (variant === "list") {
    return (
      <div className={cn("space-y-2", className)} {...props}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn(base, "h-14 w-full rounded-xl")}
          />
        ))}
      </div>
    );
  }

  if (variant === "row") {
    return (
      <div className={cn("flex items-center gap-3 py-3 px-2", className)} {...props}>
        <div className={cn(base, "h-10 w-10 rounded-full shrink-0")} />
        <div className="flex-1 space-y-2">
          <div className={cn(base, "h-4 w-32")} />
          <div className={cn(base, "h-3 w-24")} />
        </div>
        <div className={cn(base, "h-5 w-20 shrink-0")} />
      </div>
    );
  }

  if (variant === "text") {
    return (
      <div className={cn("space-y-2", className)} {...props}>
        <div className={cn(base, "h-4 w-full")} />
        <div className={cn(base, "h-4 w-5/6")} />
        <div className={cn(base, "h-4 w-4/6")} />
      </div>
    );
  }

  return <div className={cn(base, className)} {...props} />;
}
