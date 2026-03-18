import { useCallback, useEffect, useEffectEvent, useRef } from "react";
import type { RefCallback } from "react";

type UseInfiniteScrollOptions = {
  disabled?: boolean;
  onIntersect: () => void;
  rootMargin?: string;
};

export const useInfiniteScroll = <T extends Element>({
  disabled = false,
  onIntersect,
  rootMargin = "0px",
}: UseInfiniteScrollOptions): RefCallback<T> => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const handleIntersect = useEffectEvent((entries: IntersectionObserverEntry[]) => {
    if (entries[0]?.isIntersecting) {
      onIntersect();
    }
  });

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  return useCallback(
    (node: T | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;

      if (!node || disabled) {
        return;
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          handleIntersect(entries);
        },
        { rootMargin },
      );

      observerRef.current.observe(node);
    },
    [disabled, rootMargin],
  );
};
