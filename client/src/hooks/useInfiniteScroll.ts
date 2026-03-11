import { useEffect, useRef, useCallback, useState } from "react";

export function useInfiniteScroll(onLoadMore: () => void) {
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const setSentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (node) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting && !loading) {
              setLoading(true);
              setTimeout(() => {
                onLoadMore();
                setLoading(false);
              }, 800);
            }
          },
          { threshold: 0.1 }
        );
        observerRef.current.observe(node);
      }

      sentinelRef.current = node;
    },
    [onLoadMore, loading]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { sentinelRef: setSentinelRef, loading };
}
