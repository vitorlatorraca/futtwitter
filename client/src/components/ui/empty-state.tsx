import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "glass-card p-10 sm:p-12 text-center flex flex-col items-center gap-3",
        className
      )}
    >
      {Icon ? (
        <div className="rounded-full border border-border-subtle bg-surface-elevated p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      ) : null}
      <div className="space-y-1">
        <div className="font-display font-bold text-lg text-foreground">{title}</div>
        {description ? <div className="text-sm text-foreground-secondary">{description}</div> : null}
      </div>
      {actionLabel && onAction ? (
        <Button onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

