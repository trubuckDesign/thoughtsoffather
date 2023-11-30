"use client";
import React, { useEffect, useState } from "react";
import { Container, Box, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import TwoPageBook from "@/components/book/twoPageBook";
import { BookFrame } from "@/components/frame/frame";
import { BookPageProps } from "@/components/page/bookPage";
import Fab from "@mui/material/Fab";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import BookSinglePageView from "@/components/book/singlePageBook";
import usePageNavigation from "@/globalHooks/usePageNavigation";
import useTouchNavigation from "@/globalHooks/useTouchNavigation";
import useMouseMove from "@/globalHooks/useMouseMove";
import { Thought } from "@/app/page";
import { useBookPagination } from "@/globalHooks/useBookPagination";

export interface ContentData {
  text: string;
  nextPage: number | null;
}

interface bookProps {
  thoughts: Thought[];
}

export const BookContainer: React.FC<bookProps> = ({ thoughts }) => {
  const theme = useTheme();
  const minSwipeDistance = 50;
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { nextPage, prevPage } = usePageNavigation(0);

  const [leftPageData, setLeftPageData] = useState<BookPageProps | null>(null);
  const [rightPageData, setRightPageData] = useState<BookPageProps | null>(null);
  const [visible, setVisible] = useState(true);

  const { paginatedThoughts, currentPageId, goToPage } = useBookPagination(thoughts, 600); // Use the custom hook

  const isPageNavButtonDisabled = (buttonName: string) => {
    const step = isSmallScreen ? 1 : 2;
    if (buttonName === "previous") {
      return currentPageId === 0;
    } else {
      // "next" button
      const maxPageIndex = paginatedThoughts.length - (isSmallScreen ? 1 : 2);
      return currentPageId >= maxPageIndex;
    }
  };

  const handlePrevPage = () => {
    const step = isSmallScreen ? 1 : 2; // Step back 1 page for small screens, 2 for larger screens
    const newPageIndex = Math.max(currentPageId - step, 0); // Ensure the new page index doesn't go below 0
    goToPage(newPageIndex);
  };

  const handleNextPage = () => {
    const step = isSmallScreen ? 1 : 2; // Step forward 1 page for small screens, 2 for larger screens
    const maxPageIndex = paginatedThoughts.length - 1;
    const newPageIndex = isSmallScreen ? Math.min(currentPageId + step, maxPageIndex) : Math.min(currentPageId + step, maxPageIndex - 1); // Adjust for two-page view
    goToPage(newPageIndex);
  };

  const renderBookView = () => {
    const currentLeftPage = paginatedThoughts[currentPageId];
    const currentRightPage = isSmallScreen ? null : paginatedThoughts[currentPageId + 1];

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
      </Container>
    </>
  );
};
