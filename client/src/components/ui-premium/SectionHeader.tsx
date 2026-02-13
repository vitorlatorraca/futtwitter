import * as React from "react";
import { cn } from "@/lib/utils";
import { typography } from "@/lib/ui";

export interface SectionHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, action, className }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2",
        className
      )}
    >
      <div className="min-w-0">
        <h2 className={cn(typography.headingMD, "mb-0.5")}>{title}</h2>
        {subtitle ? (
          <p className={typography.caption}>{subtitle}</p>
        ) : null}
      </div>
      {action ? (
        <div className="shrink-0">{action}</div>
      ) : null}
    </div>
  );
}
