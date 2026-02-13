import * as React from "react";
import { cn } from "@/lib/utils";

export interface CompactRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Clickable */
  as?: "div" | "button" | "a";
  href?: string;
}

export const CompactRow = React.forwardRef<HTMLDivElement, CompactRowProps>(
  ({ className, as: Component = "div", ...props }, ref) => {
    const base = "flex items-center gap-3 py-3 px-2 rounded-xl transition-colors";
    const interactive = "hover:bg-muted/60 hover:border-white/5 cursor-pointer";
    return (
      <Component
        ref={ref as any}
        className={cn(
          base,
          (Component === "button" || Component === "a") && interactive,
          className
        )}
        {...(props as any)}
      />
    );
  }
);
CompactRow.displayName = "CompactRow";
