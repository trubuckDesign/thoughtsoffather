"use client";
import React, { useEffect, useState } from "react";
import { Container, Typography, Box, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Book from "@/components/book/book";
import Image from "next/image";
import { BookFrame } from "@/components/frame/frame";
import storyData from "./story.json";
import { BookPageSectionProps } from "@/components/page/pageSection/bookPageSection";
import { BookPageProps } from "@/components/page/bookPage";
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
  const [currentPageId, setCurrentPageId] = useState(1);
  const [leftPageData, setLeftPageData] = useState<BookPageProps | null>(null);
  const [rightPageData, setRightPageData] = useState<BookPageProps | null>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = event;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const distanceX = Math.abs(clientX - width / 2);
    const distanceY = Math.abs(clientY - height / 2);
    const scale = 1 + (distanceX / width + distanceY / height) * 0.2;
    setMousePosition({ scale });
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

  useEffect(() => {
    const leftPage = storyData.find((page) => page.pageId === currentPageId);
    const rightPage = storyData.find((page) => page.pageId === currentPageId + 1);

    setLeftPageData(leftPage ? parsePageData(leftPage) : null);
    setRightPageData(rightPage ? parsePageData(rightPage) : null);
  }, [currentPageId]);

  const goToPage = (pageId: number | null) => {
    if (pageId) {
      setCurrentPageId(pageId);
    }
  };

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
        <Image src="/park.png" alt="Park" layout="fill" objectFit="cover" quality={75} />
      </Box>
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "center" }}>
        <BookFrame>
          <Book leftPage={leftPageData} rightPage={rightPageData} onClick={goToPage} />
        </BookFrame>
      </Container>
    </Box>
  );
}
