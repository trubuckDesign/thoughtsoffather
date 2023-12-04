// useBookPagination.js
import { useState, useEffect, useCallback, ReactNode } from "react";
import usePageNavigation from "./usePageNavigation";
import { Thought } from "@/app/page";
import { BookPageProps } from "@/components/page/bookPage";
import { MeasuredContent } from "@/components/measureContent/measureContent";
import { debounce } from "lodash";
import { Root, createRoot } from "react-dom/client";

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
  const contentStyle = {
    fontSize: "16px", // Adjust as per your main component's style
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Example font family
  };
  // const createTempContainer = (): HTMLDivElement => {
  //   const tempContainer = document.createElement("div");
  //   tempContainer.style.visibility = "hidden";
  //   tempContainer.style.fontSize = contentStyle.fontSize;
  //   tempContainer.style.fontFamily = contentStyle.fontFamily;
  //   document.body.appendChild(tempContainer);
  //   return tempContainer;
  // };
  const createTempContainer = (): HTMLDivElement => {
    //visible container
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "fixed";
    tempContainer.style.top = "10px"; // Adjust as needed
    tempContainer.style.left = "10px"; // Adjust as needed
    tempContainer.style.border = "1px solid red"; // For visibility
    tempContainer.style.backgroundColor = "lightgrey"; // For visibility
    tempContainer.style.maxWidth = "500px"; // Limit size
    tempContainer.style.zIndex = "1000"; // To ensure it's on top
    document.body.appendChild(tempContainer);
    return tempContainer;
  };

  const createAndRenderRoot = (container: HTMLDivElement, jsxElement: JSX.Element) => {
    try {
      const root = createRoot(container);
      root.render(jsxElement);
      return root;
    } catch (error) {
      console.error("Failed to create root:", error);
      return null;
    }
  };

  const measureNodeHeight = async (content: string, tempContainer: HTMLDivElement): Promise<number> => {
    return new Promise((resolve, reject) => {
      const root = createAndRenderRoot(tempContainer, <MeasuredContent htmlContent={content} onMeasure={resolve} />);
      if (!root) {
        reject("Root creation failed");
      }
    });
  };
  function splitHTMLContent(htmlContent: string, splitIndex: number): [string, string] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const body = doc.body;

    const traverseAndSplit = (node: ChildNode, currentIndex: number): [number, boolean] => {
      if (node.nodeType === Node.TEXT_NODE) {
        const textContent = node.textContent || "";
        const length = textContent.length;

        if (currentIndex + length > splitIndex && currentIndex <= splitIndex) {
          // Split point found within this text node
          const splitPoint = splitIndex - currentIndex;
          const part1 = textContent.substring(0, splitPoint);
          const part2 = textContent.substring(splitPoint);

          node.textContent = part1;
          const newNode = document.createTextNode(part2);
          if (node.nextSibling) {
            node.parentNode?.insertBefore(newNode, node.nextSibling);
          } else {
            node.parentNode?.appendChild(newNode);
          }

          return [currentIndex + length, true];
        }

        return [currentIndex + length, false];
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const children = Array.from(node.childNodes);
        for (const child of children) {
          const [newIndex, splitOccurred] = traverseAndSplit(child, currentIndex);
          currentIndex = newIndex;
          if (splitOccurred) {
            // Split the element node
            const clonedNode = (node as Element).cloneNode(false); // clone without children
            while (child.nextSibling) {
              clonedNode.appendChild(child.nextSibling);
            }
            node.parentNode?.insertBefore(clonedNode, node.nextSibling);
            return [currentIndex, true];
          }
        }
      }

      return [currentIndex, false];
    };

    traverseAndSplit(body, 0);

    return [body.innerHTML, body.nextSibling instanceof Element ? body.nextSibling.outerHTML : ""];
  }

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
        accumulatedHeight = 0;
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

      let accumulatedHeight = 0;
      let accumulatedNodes: ChildNode[] = [];
      const padding = 0.25;
      const tempContainer = createTempContainer();

      try {
        const measuredHeight = await new Promise<number>((resolve, reject) => {
          const root = createAndRenderRoot(tempContainer, <MeasuredContent htmlContent={content} onMeasure={resolve} />);
          if (!root) {
            reject("Root creation failed");
          }
        });

        setPages([]); // Reset pages

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
            node = node.nextSibling;
          }
        }

        finalizePage(accumulatedNodes, setPages, setContainerHeight, accumulatedHeight);
      } catch (error) {
        console.error("Error during pagination:", error);
      } finally {
        if (tempContainer.parentNode) {
          document.body.removeChild(tempContainer);
        }
      }

      // Check if the number of pages is odd, and if so, add an empty page
      setPages((prevPages) => {
        if (prevPages.length % 2 !== 0) {
          return [...prevPages, { pageId: prevPages.length, contents: { text: "" } }];
        }
        return prevPages;
      });
      console.log("Pagination complete. Total pages:", paginatedThoughts.length);
    },
    [containerHeight, setPaginatedThoughts]
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
