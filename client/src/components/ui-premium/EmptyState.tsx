import * as React from "react";
import { cn } from "@/lib/utils";
import { typography } from "@/lib/ui";
import { Panel } from "./Panel";
import { Button } from "@/components/ui/button";

export interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <Panel
      padding="none"
      className={cn(
        "p-10 sm:p-12 text-center flex flex-col items-center gap-3",
        className
      )}
    >
      {Icon ? (
        <div className="rounded-full border border-border bg-muted/60 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      ) : null}
      <div className="space-y-1">
        <div className={cn(typography.headingMD, "text-foreground")}>{title}</div>
        {description ? (
          <div className={typography.bodyMuted}>{description}</div>
        ) : null}
      </div>
      {actionLabel && onAction ? (
        <Button onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      ) : null}
    </Panel>
  );
}
