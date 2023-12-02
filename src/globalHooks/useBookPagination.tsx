// useBookPagination.js
import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import usePageNavigation from "./usePageNavigation";
import { Thought } from "@/app/page";
import { BookPageProps } from "@/components/page/bookPage";
import ReactDOM from "react-dom";
import { MeasuredContent } from "@/components/measureContent/measureContent";
import { debounce } from "lodash";

export function useBookPagination(thoughts: Thought[], setThoughts: React.Dispatch<React.SetStateAction<Thought[]>>) {
  const { currentPageId, goToPage } = usePageNavigation(0);
  const [containerHeight, setContainerHeight] = useState(500);
  const [paginatedThoughts, setPaginatedThoughts] = useState<BookPageProps[]>([]);
  const [measuredContent, setMeasuredContent] = useState<ReactNode | null>(null);
  const [isMeasuring, setIsMeasuring] = useState(false);

  const paginateContent = useCallback(
    async (
      content: string,
      containerHeight: number,
      setPages: React.Dispatch<React.SetStateAction<BookPageProps[]>>,
      setContainerHeight: React.Dispatch<React.SetStateAction<number>>
    ) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      let accumulatedHeight = 0;
      let accumulatedNodes: ChildNode[] = [];
      const padding = 0.2;

      console.log("Container Height:", containerHeight, padding, containerHeight * padding);
      setPages([]);

      const finalizePage = () => {
        if (accumulatedNodes.length > 0) {
          const pageContent = accumulatedNodes
            .map((node) => (node.nodeType === Node.ELEMENT_NODE ? (node as Element).outerHTML : node.textContent || ""))
            .join("");
          setPages((prevPages) => [
            ...prevPages,
            { pageId: prevPages.length, contents: { text: pageContent }, setContainerHeight: setContainerHeight },
          ]);
        }
        accumulatedNodes = [];
        accumulatedHeight = 0;
      };

      const processNode = async (node: ChildNode, isChild = false) => {
        console.log("Processing node:", node);

        if (!node.textContent || node.textContent.trim() === "" || node.textContent === "\u00A0") {
          if (node.nextSibling && !isChild) {
            await processNode(node.nextSibling);
          }
          return;
        }

        let htmlContent = node.nodeType === Node.ELEMENT_NODE ? (node as Element).outerHTML : node.textContent || "";
        setMeasuredContent(htmlContent);
        setIsMeasuring(true);

        const tempContainer = document.createElement("div");
        tempContainer.style.visibility = "hidden";
        document.body.appendChild(tempContainer);

        const nodeHeight = await new Promise<number>((resolve) => {
          ReactDOM.render(<MeasuredContent htmlContent={htmlContent} onMeasure={(height) => resolve(height)} />, tempContainer);
        });

        console.log("Node height:", nodeHeight);

        ReactDOM.unmountComponentAtNode(tempContainer);
        document.body.removeChild(tempContainer);

        if (nodeHeight > containerHeight) {
          if (node.nodeType === Node.ELEMENT_NODE && node.hasChildNodes()) {
            // Process child nodes individually
            const children = Array.from(node.childNodes);
            for (const child of children) {
              await processNode(child, true);
            }
          } else {
            // Node is too large and cannot be broken down further, create a new page
            finalizePage();
            accumulatedNodes.push(node);
            accumulatedHeight = nodeHeight;
          }
        } else {
          if (accumulatedHeight + nodeHeight <= containerHeight - containerHeight * padding) {
            accumulatedNodes.push(node);
            accumulatedHeight += nodeHeight;
          } else {
            finalizePage();
            accumulatedNodes.push(node);
            accumulatedHeight = nodeHeight;
          }
        }

        if (node.nextSibling && !isChild) {
          await processNode(node.nextSibling);
        }
      };

      if (doc.body.firstChild) {
        console.log("Starting with first child:", doc.body.firstChild);
        await processNode(doc.body.firstChild);
      } else {
        console.log("No first child found in parsed content.");
      }
      finalizePage(); // Finalize last page
      // Check if the number of pages is odd, and if so, add an empty page
      setPages((prevPages) => {
        if (prevPages.length % 2 !== 0) {
          return [...prevPages, { pageId: prevPages.length, contents: { text: "" }, setContainerHeight: setContainerHeight }];
        }
        return prevPages;
      });
    },
    [containerHeight, setContainerHeight]
  );

  const debouncedPaginateContent = useCallback(
    debounce((currentContent) => {
      if (currentContent) {
        paginateContent(currentContent, containerHeight, setPaginatedThoughts, setContainerHeight);
      }
    }, 300),
    [containerHeight, setPaginatedThoughts, setContainerHeight]
  );

  useEffect(() => {
    if (thoughts.length > 0) {
      console.log("USEEFFECT", JSON.stringify(debouncedPaginateContent));
      const currentThought = thoughts[currentPageId];
      debouncedPaginateContent(currentThought?.content);
    }

    // Cleanup function
    return () => debouncedPaginateContent.cancel();
  }, [debouncedPaginateContent, currentPageId, thoughts]);

  return {
    paginatedThoughts,
    currentPageId,
    goToPage,
    setContainerHeight,
    measuredContent,
    setMeasuredContent,
    isMeasuring,
    setIsMeasuring,
    setThoughts,
    thoughts,
  };
}
