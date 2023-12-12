import { useEffect, useState } from "react";

interface UseInfiniteScrollProps {
  rootMargin?: string;
  threshold?: number | number[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}
export const useInfiniteScroll = ({ isLoading, hasMore, onLoadMore, threshold = [0, 0.25, 0.5, 0.75, 1] }: UseInfiniteScrollProps) => {
  const [target, setTarget] = useState<Element | null>(null);

  useEffect(() => {
    console.log(`isLoading: ${isLoading}, hasMore: ${hasMore}, threshhold:${threshold}`);

    if (isLoading) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log(`Entry for ${entry.target.id}: isIntersecting = ${entry.isIntersecting}, intersectionRatio = ${entry.intersectionRatio}`);
        });
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      },
      {
        rootMargin: "0px",
        threshold: threshold,
      }
    );

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [target, isLoading, hasMore, onLoadMore, threshold]);

  return { setTarget, target };
};
