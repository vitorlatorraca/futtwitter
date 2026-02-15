"use client";

interface CompetitionDividerProps {
  name: string;
}

export function CompetitionDivider({ name }: CompetitionDividerProps) {
  return (
    <div className="py-2 px-4 mt-4 first:mt-0">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {name}
      </h4>
    </div>
  );
}
