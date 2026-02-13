import * as React from "react";

import { Check, ChevronDown } from "lucide-react";

import { TEAMS_DATA, type TeamData } from "@/lib/team-data";
import { cn } from "@/lib/utils";
import { Crest } from "@/components/ui-premium";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type TeamPickerProps = {
  value?: string;
  onValueChange: (teamId: string) => void;
  className?: string;
};

export function TeamPicker({ value, onValueChange, className }: TeamPickerProps) {
  const [open, setOpen] = React.useState(false);

  const selected = value ? TEAMS_DATA.find((t: TeamData) => t.id === value) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn("justify-between gap-2 min-w-[10rem]", className)}
          aria-label="Selecionar time"
        >
          <span className="truncate">{selected ? selected.shortName : "Times"}</span>
          <ChevronDown className="h-4 w-4 text-foreground-secondary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2 bg-popover/90 backdrop-blur-md border-card-border" align="start">
        <Command>
          <CommandInput placeholder="Buscar time..." />
          <CommandList>
            <CommandEmpty>Nenhum time encontrado.</CommandEmpty>
            <CommandGroup heading="Brasileirão">
              {TEAMS_DATA.map((team: TeamData) => (
                <CommandItem
                  key={team.id}
                  value={`${team.name} ${team.shortName}`}
                  data-testid={`filter-team-${team.id}`}
                  onSelect={() => {
                    onValueChange(team.id);
                    setOpen(false);
                  }}
                  className="gap-2"
                >
                  <Crest slug={team.id} alt={team.name} size="xs" />
                  <span className="flex-1 truncate">{team.name}</span>
                  <Check className={cn("h-4 w-4", value === team.id ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

