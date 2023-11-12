"use client";
import Book from "@/components/book/book";
import { Container, Typography, Box } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

type MousePosition = {
  scale: number;
};

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ scale: 1 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = event;
    const width = window.innerWidth;
    const height = window.innerHeight;
    // Calculate the distance from the center of the screen
    const distanceX = Math.abs(clientX - width / 2);
    const distanceY = Math.abs(clientY - height / 2);
    // Calculate the scale based on the distance from the center, with some limits
    const scale = 1 + (distanceX / width + distanceY / height) * 0.2; // Adjust the multiplier for sensitivity
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
          transition: "transform 0.9s ease-out", // Smooth the scaling transition
          transform: `scale(${mousePosition.scale})`, // Apply scale transformation here
        }}
      >
        <Image src="/park.png" alt="Park" layout="fill" objectFit="cover" quality={75} />
      </Box>
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Typography variant="h2" gutterBottom component="h1">
          Welcome to Our Park
        </Typography>
        {/* ... other content ... */}
        <Box
          sx={{
            display: "flex", // Flexbox to center the book
            justifyContent: "center", // Center horizontally
            alignItems: "center", // Center vertically
            margin: "20px auto",
            padding: "20px",
            backgroundColor: "#8c7b75", // Color for book cover
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)", // Shadow for depth
            borderRadius: "10px", // Rounded corners for the cover
            width: "calc(70vw + 40px)", // Adjust width to fit the book plus padding
            maxWidth: "none", // Override max-width from Container
            zIndex: 0,
          }}
        >
          {[...Array(5)].map((_, index) => (
            <Box
              key={index}
              sx={{
                position: "absolute",
                top: `calc(100px + ${index * 2}px)`,
                right: `calc(30px + ${index * 2}px)`,
                bottom: `calc(30px + ${index * 2}px)`,
                left: `calc(48px - ${index * 2}px)`,
                background: "linear-gradient(to bottom, #fdfdfd, #f5f5f5)", // Lighter gradient closer to white
                zIndex: 1,
                width: `calc(70vw + 12px - ${index * 1}px)`, // Adjusting width to prevent extending too far to the right
                height: `calc(82.5vh  - ${index * 3}px)`, // Reducing height by 40px
                border: "1px solid #bbb",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
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
