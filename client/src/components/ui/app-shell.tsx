import * as React from "react";

import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
  /** Defaults to true; `Navbar` renders null when unauthenticated. */
  showNav?: boolean;
  className?: string;
  mainClassName?: string;
};

export function AppShell({ children, showNav = true, className, mainClassName }: AppShellProps) {
  return (
    <div className={cn("min-h-screen bg-background text-foreground", className)}>
      {showNav ? <Navbar /> : null}
      <main className={cn("page-container py-6 sm:py-8", mainClassName)}>{children}</main>
    </div>
  );
}

