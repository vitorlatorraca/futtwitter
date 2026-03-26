import React from "react";

export default function PostSkeleton() {
  return (
    <article className="px-4 py-3 border-b border-x-border">
      <div className="flex">
        <div className="w-10 h-10 rounded-full bg-[rgba(101,119,134,0.2)] animate-pulse flex-shrink-0" />
        <div className="flex-1 ml-3 min-w-0 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-24 bg-[rgba(101,119,134,0.2)] rounded animate-pulse" />
            <div className="h-4 w-16 bg-[rgba(101,119,134,0.2)] rounded animate-pulse" />
            <div className="h-4 w-12 bg-[rgba(101,119,134,0.2)] rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-[rgba(101,119,134,0.2)] rounded animate-pulse" />
            <div className="h-4 w-4/5 bg-[rgba(101,119,134,0.2)] rounded animate-pulse" />
            <div className="h-4 w-3/5 bg-[rgba(101,119,134,0.2)] rounded animate-pulse" />
          </div>
          <div className="h-48 w-full bg-[rgba(101,119,134,0.2)] rounded-xl animate-pulse" />
          <div className="flex gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 w-8 bg-[rgba(101,119,134,0.2)] rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
