"use client";
import React, { useEffect, useState } from "react";
import { Container, Box, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import TwoPageBook from "@/components/book/twoPageBook";
import Image from "next/image";
import { BookFrame } from "@/components/frame/frame";
import { BookPageProps } from "@/components/page/bookPage";
import storyData from "../../app/story.json";
import Fab from "@mui/material/Fab";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import BookSinglePageView from "@/components/book/singlePageBook";
import usePageNavigation from "@/globalHooks/usePageNavigation";
import useTouchNavigation from "@/globalHooks/useTouchNavigation";
import useMouseMove from "@/globalHooks/useMouseMove";
import { Thought } from "@/app/page";

type MousePosition = {
  scale: number;
};

export interface ContentData {
  text: string;
  nextPage: number | null;
}

interface bookProps {
  thoughts: Thought[];
}
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
      onClick: () => {}, // Implement or pass appropriate function
    });

    currentIndex = endIndex;
  }

  return pages;
}

export const BookContainer: React.FC<bookProps> = ({ thoughts }) => {
  const theme = useTheme();
  const minSwipeDistance = 50;
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { currentPageId, goToPage, nextPage, prevPage } = usePageNavigation(0);
  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useTouchNavigation(minSwipeDistance, nextPage, prevPage);
  const { mousePosition, handleMouseMove } = useMouseMove();

  const [leftPageData, setLeftPageData] = useState<BookPageProps | null>(null);
  const [rightPageData, setRightPageData] = useState<BookPageProps | null>(null);
  const [visible, setVisible] = useState(true);

  const [paginatedThoughts, setPaginatedThoughts] = useState<BookPageProps[]>([]);
  const charsPerPage = 600; // Adjust based on your layout

  useEffect(() => {
    if (thoughts.length > 0) {
      // Assuming currentPageId is zero-based index
      console.log("thoughts:", currentPageId, thoughts, thoughts[currentPageId]);
      const currentThought = thoughts[currentPageId];
      if (currentThought) {
        const pages = paginateContent(currentThought.content, charsPerPage);
        setPaginatedThoughts(pages);
      }
    }
  }, [currentPageId, thoughts]);

  const isPageNavButtonDisabled = (buttonName: string) => {
    let isDisabled: boolean = false;

    if (isSmallScreen) {
      if (leftPageData) {
        if (buttonName === "previous") {
          isDisabled = leftPageData.pageId % 2 === 0 || leftPageData.pageId % 2 === 0;
        } else {
          isDisabled = leftPageData.pageId % 2 !== 0 || leftPageData.pageId % 2 === 0;
        }
      }
    } else {
      if (rightPageData && leftPageData) {
        if (buttonName === "previous") {
          isDisabled = leftPageData.pageId % 2 === 0 || leftPageData.pageId % 2 === 0;
        } else {
          isDisabled = rightPageData.pageId % 2 !== 0 || rightPageData.pageId % 2 === 0;
        }
      }
    }

    return !isDisabled;
  };

  const handlePrevPage = () => {
    if (isSmallScreen) {
      goToPage(currentPageId - 1);
    } else if (!isSmallScreen && rightPageData) {
      {
        goToPage(currentPageId - 1);
      }
    }
  };
  const handleNextPage = () => {
    if (isSmallScreen) {
      if (leftPageData?.contents.nextPage) goToPage(currentPageId + 1);
    } else if (!isSmallScreen && rightPageData) {
      goToPage(rightPageData.contents.nextPage);
    }
  };

  const renderBookView = () => {
    const currentLeftPage = paginatedThoughts[0]; // Adjust index based on your navigation logic
    const currentRightPage = paginatedThoughts[1]; // For two-page view

    if (isSmallScreen) {
      return <BookSinglePageView pageData={currentLeftPage} visible={visible} />;
    } else {
      return (
        <BookFrame>
          <TwoPageBook visible={visible} leftPage={currentLeftPage} rightPage={currentRightPage} onClick={goToPage} />
        </BookFrame>
      );
    }
  };

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "center",
          transform: "perspective(1500px) rotateY(0deg) rotateX(15deg) skewY(0deg)",
          transition: "transform 1.2s",
          "&:hover": {
            transform: "perspective(900px) rotateY(0deg) rotateX(0deg) skewY(0deg)",
          },
        }}
      >
        {renderBookView()}
      </Container>
      <Box
        sx={{
          position: "absolute",
          bottom: 5, // Adjust as needed for positioning
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 5,
        }}
      >
        <Fab color="primary" aria-label="previous" onClick={handlePrevPage} disabled={isPageNavButtonDisabled("previous")}>
          <UndoIcon />
        </Fab>
        <Fab color="secondary" aria-label="next" onClick={handleNextPage} disabled={isPageNavButtonDisabled("next")}>
          <RedoIcon />
        </Fab>
      </Box>
    </>
  );
};
