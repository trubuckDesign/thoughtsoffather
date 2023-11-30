// useBookPagination.js
import { useState, useEffect } from "react";
import usePageNavigation from "./usePageNavigation";
import { Thought } from "@/app/page";
import { BookPageProps } from "@/components/page/bookPage";

function paginateContent(content: string, charsPerPage: number): BookPageProps[] {
  const pages: BookPageProps[] = [];
  let currentIndex = 0;
  let pageId = 0;

  while (currentIndex < content.length) {
    let endIndex = currentIndex + charsPerPage;

    // Adjust endIndex to avoid cutting words or HTML tags in the middle
    if (endIndex < content.length) {
      // Move endIndex to the nearest space to avoid cutting words
      while (endIndex > currentIndex && content[endIndex] !== " " && content[endIndex] !== "<") {
        endIndex--;
      }
      // Optionally, you can add more logic here to handle closing HTML tags
    }

    pages.push({
      pageId: pageId++,
      contents: { text: content.substring(currentIndex, endIndex).trim(), nextPage: null }, // contents should be an array
    });

    currentIndex = endIndex;
  }

  return pages;
}

export function useBookPagination(thoughts: Thought[], charsPerPage: number) {
  const { currentPageId, goToPage } = usePageNavigation(0);
  const [paginatedThoughts, setPaginatedThoughts] = useState<BookPageProps[]>([]);

  useEffect(() => {
    if (thoughts.length > 0) {
      const currentThought = thoughts[currentPageId];
      if (currentThought) {
        const pages = paginateContent(currentThought.content, charsPerPage);
        setPaginatedThoughts(pages);
      }
    }
  }, [currentPageId, thoughts]);

  return { paginatedThoughts, currentPageId, goToPage };
}
