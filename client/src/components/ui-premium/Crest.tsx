import { useState, useCallback } from "react";
import { getTeamCrest } from "@/lib/teamCrests";
import { cn } from "@/lib/utils";

const DEFAULT_CREST = "/assets/crests/default.png";

export interface CrestProps {
  /** Team slug (corinthians, palmeiras, etc). Corinthians ALWAYS uses corinthians.png. */
  slug: string | null | undefined;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  /** Ring/border around crest */
  ring?: boolean;
}

const sizeClasses = {
  xs: "w-5 h-5",
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

export function Crest({
  slug,
  alt = "Escudo",
  size = "md",
  className,
  ring = false,
}: CrestProps) {
  const crestUrl = getTeamCrest(slug);
  const [errored, setErrored] = useState(false);
  const src = errored ? DEFAULT_CREST : crestUrl;

  const handleError = useCallback(() => setErrored(true), []);

  return (
    <div
      className={cn(
        "flex-shrink-0 rounded-full overflow-hidden flex items-center justify-center",
        ring && "ring-2 ring-border-subtle",
        sizeClasses[size],
        className
      )}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-contain p-0.5"
        onError={handleError}
      />
    </div>
  );
}
