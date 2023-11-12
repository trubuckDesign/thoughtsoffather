"use client";
import React, { useState } from "react";
import { Container, Typography, Box, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Book from "@/components/book/book";
import Image from "next/image";

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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "20px auto",
            padding: "20px",
            backgroundColor: "#8c7b75",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
            borderRadius: "10px",
            width: "calc(70vw + 40px)", // Adjust width to fit the book plus padding
            height: "86vh", // This height will control the scaling of the pages too
            position: "relative",
            border: "5px solid black", // This border scales correctly
            maxWidth: "none",
            zIndex: 0,
          }}
        >
          {[...Array(5)].map((_, index) => (
            <Box
              key={index}
              sx={{
                position: "absolute",
                top: 0, // Align with the top of the container
                right: 0, // Align with the right of the container
                bottom: 0, // Align with the bottom of the container
                left: 0, // Align with the left of the container
                margin: `${index * 5}px`, // Create the stacked effect, adjust the multiplier as needed
                background: "linear-gradient(to bottom, #fdfdfd, #f5f5f5)",
                zIndex: 1,
                width: `calc(100% - ${index * 10}px)`, // Scale width based on the book's border
                height: `calc(100% - ${index * 10}px + 0px)`, // Scale height based on the book's border
                border: "1px solid #bbb",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease", // Smooth the transition on resizing
                "&:after": {
                  // Pseudo-element for the line
                  content: '""',
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: "50%", // Center the line
                  width: "1px", // Line width
                  backgroundColor: "#000", // Line color
                  zIndex: 2, // Above the extra pages
                },
              }}
            />
          ))}
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
        </Box>
      </Container>
    </Box>
  );
}
