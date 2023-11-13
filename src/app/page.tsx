"use client";
import React, { useEffect, useState } from "react";
import { Container, Typography, Box, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import TwoPageBook from "@/components/book/twoPageBook";
import Image from "next/image";
import { BookFrame } from "@/components/frame/frame";
import storyData from "./story.json";
import { BookPageProps } from "@/components/page/bookPage";
import BookSinglePageView from "@/components/singlePageBook";
import Fab from "@mui/material/Fab";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";

type MousePosition = {
  scale: number;
};

export interface ContentData {
  imageSrc: string;
  text: string;
  nextPage: number | null;
}

interface PageDataJson {
  pageId: number;
  type: "single" | "double";
  contents: ContentData[];
}

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ scale: 1 });
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [currentPageId, setCurrentPageId] = useState(1);
  const [leftPageData, setLeftPageData] = useState<BookPageProps | null>(null);
  const [rightPageData, setRightPageData] = useState<BookPageProps | null>(null);
  const [visible, setVisible] = useState(true);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = event;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const distanceX = Math.abs(clientX - width / 2);
    const distanceY = Math.abs(clientY - height / 2);
    const scale = 1 + (distanceX / width + distanceY / height) * 0.2;
    setMousePosition({ scale });
  };

  const goToPage = (pageId: number | null) => {
    console.log("goto:", pageId);
    if (pageId) {
      setVisible(false); // Start fade-out
      setTimeout(() => {
        setCurrentPageId(pageId);
        setVisible(true); // Fade back in after page change
      }, 1000); // Transition duration
    }
  };

  const isPageNavButtonDisabled = (buttonName: string) => {
    let isDisabled: boolean = false;

    if (isSmallScreen) {
      if (leftPageData) {
        if (buttonName === "previous") {
          isDisabled = leftPageData.pageId % 2 === 0 || (leftPageData.type === "single" && leftPageData.pageId % 2 === 0);
        } else {
          isDisabled = leftPageData.pageId % 2 !== 0 || (leftPageData.type === "single" && leftPageData.pageId % 2 === 0);
        }
      }
    } else {
      if (rightPageData && leftPageData) {
        if (buttonName === "previous") {
          isDisabled = leftPageData.pageId % 2 === 0 || (leftPageData.type === "single" && leftPageData.pageId % 2 === 0);
        } else {
          isDisabled = rightPageData.pageId % 2 !== 0 || (rightPageData.type === "single" && rightPageData.pageId % 2 === 0);
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
      if (leftPageData?.contents[0].nextPage) goToPage(currentPageId + 1);
    } else if (!isSmallScreen && rightPageData) {
      goToPage(rightPageData.contents[0].nextPage);
    }
  };

  const parsePageData = (pageData: any): BookPageProps => {
    const validatedPageData = pageData as PageDataJson; // Type assertion here

    return {
      contents: validatedPageData.contents,
      type: validatedPageData.type,
      pageId: validatedPageData.pageId,
      onClick: (nextPage: number | null) => goToPage(nextPage),
    };
  };
  const renderBookView = () => {
    if (isSmallScreen) {
      return <BookSinglePageView pageData={leftPageData} visible={visible} />;
    } else {
      return (
        <BookFrame>
          <TwoPageBook visible={visible} leftPage={leftPageData} rightPage={rightPageData} onClick={goToPage} />
        </BookFrame>
      );
    }
  };

  useEffect(() => {
    const leftPage = storyData.find((page) => page.pageId === currentPageId);
    const rightPage = storyData.find((page) => page.pageId === currentPageId + 1);

    setLeftPageData(leftPage ? parsePageData(leftPage) : null);
    setRightPageData(rightPage ? parsePageData(rightPage) : null);
  }, [currentPageId]);

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center", // Center vertically
        justifyContent: "center", // Center horizontally
      }}
      onMouseMove={handleMouseMove}
    >
      <Box
        sx={{
          position: "absolute",
          height: "100vh",
          width: "100vw",
          top: 0,
          left: 0,
          zIndex: -1,
          transition: "transform 0.9s ease-out",
          transform: `scale(${mousePosition.scale})`,
        }}
      >
        <Image
          src="/park.png"
          alt="Park"
          quality={75}
          fill
          sizes="100vw"
          style={{
            objectFit: "cover",
          }}
        />
      </Box>
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "center" }}>
        {renderBookView()}
      </Container>
      <Box
        sx={{
          position: "absolute",
          bottom: 5, // Adjust as needed for positioning
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 5, // Space between buttons
        }}
      >
        <Fab color="primary" aria-label="previous" onClick={handlePrevPage} disabled={isPageNavButtonDisabled("previous")}>
          <UndoIcon />
        </Fab>
        <Fab color="secondary" aria-label="next" onClick={handleNextPage} disabled={isPageNavButtonDisabled("next")}>
          <RedoIcon />
        </Fab>
      </Box>
    </Box>
  );
}
