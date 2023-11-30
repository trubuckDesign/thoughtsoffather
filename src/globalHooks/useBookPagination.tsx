// useBookPagination.js
import { useState, useEffect } from "react";
import usePageNavigation from "./usePageNavigation";
import { Thought } from "@/app/page";
import { BookPageProps } from "@/components/page/bookPage";

function paginateContent(content: string, charsPerPage: number): BookPageProps[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const body = doc.body;
  const pages: BookPageProps[] = [];
  let accumulatedHTML = "";

  // Function to add a page if there's content
  const addPage = () => {
    if (accumulatedHTML.trim()) {
      pages.push({
        pageId: pages.length,
        contents: { text: accumulatedHTML.trim(), nextPage: null },
      });
      accumulatedHTML = "";
    }
  };

  // Iterate over child nodes
  Array.from(body.childNodes).forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;

      // If the element is an <img>, add current content and the image as new pages
      if (element.tagName === "IMG") {
        addPage(); // Add accumulated content as a page
        pages.push({
          pageId: pages.length,
          contents: { text: element.outerHTML, nextPage: null },
        });
        accumulatedHTML = ""; // Reset accumulated content
      } else {
        accumulatedHTML += element.outerHTML;
        if (accumulatedHTML.length >= charsPerPage) {
          addPage();
        }
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      const textContent = node.textContent || "";
      if (textContent.trim()) {
        accumulatedHTML += textContent;
        if (accumulatedHTML.length >= charsPerPage) {
          addPage();
        }
      }
    }
  });

  // Add remaining content as the last page
  addPage();

  // Add an empty page if the total number of pages is odd
  if (pages.length % 2 !== 0) {
    pages.push({
      pageId: pages.length,
      contents: { text: "", nextPage: null },
    });
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
