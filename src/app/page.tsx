"use client";
import React, { useState } from "react";
import { Container, Typography, Box, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Book from "@/components/book/book";
import Image from "next/image";
import { BookFrame } from "@/components/frame/frame";

type MousePosition = {
  scale: number;
};

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ scale: 1 });
  const theme = useTheme();
  const isLgDown = useMediaQuery(theme.breakpoints.down("lg"));

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = event;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const distanceX = Math.abs(clientX - width / 2);
    const distanceY = Math.abs(clientY - height / 2);
    const scale = 1 + (distanceX / width + distanceY / height) * 0.2;
    setMousePosition({ scale });
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
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
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Typography variant="h2" gutterBottom component="h1">
          Welcome to Our Park
        </Typography>
        <BookFrame>
          <Book
            leftPage={{
              contents: [
                {
                  imageSrc: "/story/boy 3.png",
                  isSingleImage: true,
                  text: "The boy just missed the bus now he has to walk and he might be late to school now. what shall he do??",
                },
              ],
            }}
            rightPage={{
              contents: [
                { imageSrc: "/story/boy 1.png", isSingleImage: false, text: "Text for Image 2" },
                { imageSrc: "/story/boy 2.png", isSingleImage: false, text: "Text for Image 3" },
              ],
            }}
          />
        </BookFrame>
      </Container>
    </Box>
  );
}
