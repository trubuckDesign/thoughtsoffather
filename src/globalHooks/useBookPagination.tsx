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

  const parseHTMLContent = (content: string): Document => {
    const parser = new DOMParser();
    return parser.parseFromString(content, "text/html");
  };
  const createTempContainer = (): HTMLDivElement => {
    const tempContainer = document.createElement("div");
    tempContainer.style.visibility = "hidden";
    document.body.appendChild(tempContainer);
    return tempContainer;
  };
  const measureNodeHeight = async (htmlContent: string, tempContainer: HTMLDivElement): Promise<number> => {
    return new Promise<number>((resolve) => {
      ReactDOM.render(
        <MeasuredContent
          htmlContent={htmlContent}
          onMeasure={(height) => {
            console.log("Measured node height:", height);
            resolve(height);
          }}
        />,
        tempContainer
      );
    });
  };
  const finalizePage = (
    accumulatedNodes: ChildNode[],
    setPages: React.Dispatch<React.SetStateAction<BookPageProps[]>>,
    setContainerHeight: React.Dispatch<React.SetStateAction<number>>,
    accumulatedHeight: number
  ): void => {
    console.log("Finalizing page", { accumulatedNodesLength: accumulatedNodes.length, accumulatedHeight });
    console.log("Number of nodes on this page:", accumulatedNodes.length);

    if (accumulatedNodes.length > 0) {
      const pageContent = accumulatedNodes
        .map((node) => (node.nodeType === Node.ELEMENT_NODE ? (node as Element).outerHTML : node.textContent || ""))
        .join("");
      setPages((prevPages) => [...prevPages, { pageId: prevPages.length, contents: { text: pageContent }, setContainerHeight: setContainerHeight }]);
    }
    accumulatedNodes = [];
    accumulatedHeight = 0;
    console.log("Page finalized", { newAccumulatedNodesLength: 0, newAccumulatedHeight: 0 });
  };

  const processNode = async (
    node: ChildNode,
    accumulatedNodes: ChildNode[],
    accumulatedHeight: number,
    containerHeight: number,
    padding: number,
    setPages: React.Dispatch<React.SetStateAction<BookPageProps[]>>,
    setMeasuredContent: React.Dispatch<React.SetStateAction<React.ReactNode>>,
    setIsMeasuring: React.Dispatch<React.SetStateAction<boolean>>,
    tempContainer: HTMLDivElement
  ): Promise<{ accumulatedNodes: ChildNode[]; accumulatedHeight: number }> => {
    console.log("Start processing node", { node, accumulatedHeight });
    console.log("Current accumulatedHeight before node:", accumulatedHeight);

    // Skip empty text nodes or whitespace
    if (!node.textContent || node.textContent.trim() === "" || node.textContent === "\u00A0") {
      return { accumulatedNodes, accumulatedHeight };
    }

    let htmlContent = node.nodeType === Node.ELEMENT_NODE ? (node as Element).outerHTML : node.textContent || "";
    setMeasuredContent(htmlContent);
    setIsMeasuring(true);

    const nodeHeight = await measureNodeHeight(htmlContent, tempContainer);
    console.log("Node height after measurement:", nodeHeight);
    console.log("Updated accumulatedHeight:", accumulatedHeight);
    if (nodeHeight > containerHeight) {
      // If node is too large, process child nodes individually if it's an element with children
      if (node.nodeType === Node.ELEMENT_NODE && node.hasChildNodes()) {
        const children = Array.from(node.childNodes);
        for (const child of children) {
          const result = await processNode(
            child,
            accumulatedNodes,
            accumulatedHeight,
            containerHeight,
            padding,
            setPages,
            setMeasuredContent,
            setIsMeasuring,
            tempContainer
          );
          accumulatedNodes = result.accumulatedNodes;
          accumulatedHeight = result.accumulatedHeight;
        }
      } else {
        // Node cannot be broken down further, create a new page
        finalizePage(accumulatedNodes, setPages, setContainerHeight, accumulatedHeight);
        accumulatedNodes = [node];
        accumulatedHeight = nodeHeight;
      }
    } else {
      // Add node to the current page if it fits
      if (accumulatedHeight + nodeHeight <= containerHeight - containerHeight * padding) {
        accumulatedNodes.push(node);
        accumulatedHeight += nodeHeight;
      } else {
        // Node doesn't fit, finalize current page and start a new one
        finalizePage(accumulatedNodes, setPages, setContainerHeight, accumulatedHeight);
        accumulatedNodes = [node];
        accumulatedHeight = nodeHeight;
      }
    }
    console.log("End processing node", { node, accumulatedHeight });
    return { accumulatedNodes, accumulatedHeight };
  };

  const paginateContent = useCallback(
    async (
      content: string,
      containerHeight: number,
      setPages: React.Dispatch<React.SetStateAction<BookPageProps[]>>,
      setContainerHeight: React.Dispatch<React.SetStateAction<number>>
    ) => {
      console.log("Start pagination", { containerHeight });
      const doc = parseHTMLContent(content);
      const tempContainer = createTempContainer();
      let accumulatedHeight = 0;
      let accumulatedNodes: ChildNode[] = [];
      const padding = 0.2;

      // Reset pages
      setPages([]);

      if (doc.body.firstChild) {
        let node: ChildNode | null = doc.body.firstChild;
        while (node) {
          const result = await processNode(
            node,
            accumulatedNodes,
            accumulatedHeight,
            containerHeight,
            padding,
            setPages,
            setMeasuredContent,
            setIsMeasuring,
            tempContainer
          );
          accumulatedNodes = result.accumulatedNodes;
          accumulatedHeight = result.accumulatedHeight;
          if (node.nextSibling) {
            node = node.nextSibling;
          } else {
            node = null;
          }
        }
      }

      finalizePage(accumulatedNodes, setPages, setContainerHeight, accumulatedHeight);
      ReactDOM.unmountComponentAtNode(tempContainer);
      document.body.removeChild(tempContainer);

      // Check if the number of pages is odd, and if so, add an empty page
      setPages((prevPages) => {
        if (prevPages.length % 2 !== 0) {
          return [...prevPages, { pageId: prevPages.length, contents: { text: "" }, setContainerHeight: setContainerHeight }];
        }
        return prevPages;
      });
      console.log("Pagination complete. Total pages:", paginatedThoughts.length);
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
