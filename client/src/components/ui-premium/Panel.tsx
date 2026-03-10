import * as React from "react";
import { cn } from "@/lib/utils";

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Padding responsivo: sm (padrão), md, lg, none */
  padding?: "sm" | "md" | "lg" | "none";
}

const paddingClasses = {
  sm: "p-4 sm:p-5",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
  none: "p-0",
};

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className, padding = "md", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-border bg-surface-card",
        paddingClasses[padding],
        className
      )}
      {...props}
    />
  )
);
Panel.displayName = "Panel";
