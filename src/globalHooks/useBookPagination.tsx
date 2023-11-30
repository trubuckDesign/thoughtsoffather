// useBookPagination.js
import { useState, useEffect } from "react";
import usePageNavigation from "./usePageNavigation";
import { Thought } from "@/app/page";
import { BookPageProps } from "@/components/page/bookPage";
import ReactDOM from "react-dom";
import { MeasuredContent } from "@/components/measureContent/measureContent";

const paginateContent = (content: string, containerHeight: number, setPages: React.Dispatch<React.SetStateAction<BookPageProps[]>>): void => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  let accumulatedHeight = 0;
  let accumulatedNodes: ChildNode[] = [];

  const finalizePage = (): void => {
    if (accumulatedNodes.length > 0) {
      const pageContent = accumulatedNodes
        .map((node) => (node.nodeType === Node.ELEMENT_NODE ? (node as Element).outerHTML : node.textContent || ""))
        .join("");
      setPages((prevPages) => [...prevPages, { pageId: prevPages.length, contents: { text: pageContent } }]);
    }
    accumulatedNodes = [];
    accumulatedHeight = 0;
  };

  const processNode = async (node: ChildNode): Promise<void> => {
    let htmlContent = node.nodeType === Node.ELEMENT_NODE ? (node as Element).outerHTML : node.textContent || "";

    // Create a temporary container for measurement
    const tempContainer = document.createElement("div");
    tempContainer.style.visibility = "hidden";
    document.body.appendChild(tempContainer);

    const nodeHeight = await new Promise<number>((resolve) => {
      ReactDOM.render(
        <MeasuredContent
          htmlContent={htmlContent}
          onMeasure={(height) => {
            resolve(height);
          }}
        />,
        tempContainer
      );
    });

    // Clean up
    ReactDOM.unmountComponentAtNode(tempContainer);
    document.body.removeChild(tempContainer);

    if (accumulatedHeight + nodeHeight > containerHeight) {
      finalizePage();
    }

    accumulatedNodes.push(node);
    accumulatedHeight += nodeHeight;

    if (node.nextSibling) {
      await processNode(node.nextSibling);
    } else {
      finalizePage();
    }
  };

  if (doc.body.firstChild) {
    processNode(doc.body.firstChild);
  }
};

export function useBookPagination(thoughts: Thought[]) {
  const { currentPageId, goToPage } = usePageNavigation(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [paginatedThoughts, setPaginatedThoughts] = useState<BookPageProps[]>([]);

  useEffect(() => {
    if (thoughts.length > 0) {
      const currentThought = thoughts[currentPageId];
      if (currentThought) {
        paginateContent(currentThought.content, containerHeight, setPaginatedThoughts);
      }
    }
  }, [currentPageId, thoughts, containerHeight]);

  return { paginatedThoughts, currentPageId, goToPage, setContainerHeight };
}
