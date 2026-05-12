"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { MatchFilter } from "./types";

interface MatchesFiltersProps {
  value: MatchFilter;
  onChange: (value: MatchFilter) => void;
}

export function MatchesFilters({ value, onChange }: MatchesFiltersProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as MatchFilter)}
      className="justify-start"
      variant="outline"
      size="sm"
    >
      <ToggleGroupItem value="all" aria-label="Todos">
        Todos
      </ToggleGroupItem>
      <ToggleGroupItem value="upcoming" aria-label="Próximos">
        Próximos
      </ToggleGroupItem>
      <ToggleGroupItem value="recent" aria-label="Resultados">
        Resultados
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
