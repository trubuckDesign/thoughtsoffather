import { useEffect, useState } from "react";

interface UseInfiniteScrollProps {
  rootMargin?: string;
  threshold?: number | number[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}
export const useInfiniteScroll = ({ isLoading, hasMore, onLoadMore }: UseInfiniteScrollProps) => {
  const [target, setTarget] = useState<Element | null>(null);

  useEffect(() => {
    if (isLoading) {
      console.log("Loading in progress, observer not set");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("Bottom reached, calling onLoadMore");
          onLoadMore();
        }
      },
      {
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    if (target) {
      console.log("Observing target");
      observer.observe(target);
    }

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [target, isLoading, hasMore, onLoadMore]);

  return { setTarget };
};
