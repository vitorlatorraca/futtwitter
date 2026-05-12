import * as React from "react";
import { cn } from "@/lib/utils";

export interface CompactListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Dividir itens com linhas */
  divided?: boolean;
}

export function CompactList({
  className,
  divided = true,
  ...props
}: CompactListProps) {
  return (
    <div
      className={cn(
        "flex flex-col",
        divided && "divide-y divide-border/60",
        className
      )}
      {...props}
    />
  );
}
