import { AlertCircle } from "lucide-react";

import { AppShell } from "@/components/ui/app-shell";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <AppShell>
      <EmptyState
        icon={AlertCircle}
        title="Página não encontrada"
        description="Esse caminho não existe. Use a navegação para voltar ao feed."
        className="max-w-xl mx-auto"
      />
    </AppShell>
  );
}
