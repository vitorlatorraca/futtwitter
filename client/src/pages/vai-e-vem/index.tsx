'use client';

import { AppShell } from '@/components/ui/app-shell';
import { TransfersBoard } from '@/features/transfers';
import { typography } from '@/lib/ui';
import { cn } from '@/lib/utils';
import { ArrowLeftRight } from 'lucide-react';

export default function VaiEVemPage() {
  return (
    <AppShell mainClassName="py-4 sm:py-6 md:py-8 px-3 sm:px-4 max-w-4xl mx-auto">
      <div className="space-y-6">
        <header className="space-y-1">
          <h1 className={cn(typography.headingLG, "flex items-center gap-2")}>
            <ArrowLeftRight className="h-7 w-7 text-primary" />
            Vai e Vem
          </h1>
          <p className={typography.bodyMuted}>
            Mercado, rumores e transferências — em tempo real (demo).
          </p>
        </header>

        <TransfersBoard scope="all" hideHeader />
      </div>
    </AppShell>
  );
}
