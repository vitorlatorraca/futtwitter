import * as React from "react";

import { cn } from "@/lib/utils";

export function Page({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("page-container", className)} {...props} />;
}

type PageHeaderProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("page-header", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="page-title">{title}</div>
          {description ? <div className="page-subtitle">{description}</div> : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </div>
  );
}

