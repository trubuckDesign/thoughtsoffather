"use client";
import React, { FC, ReactNode, useState } from "react";
import { Box } from "@mui/material";
import Image from "next/image";
import useMouseMove from "@/globalHooks/useMouseMove";

interface backgroundProps {
  children: ReactNode;
}
const BackgroundImageContainer: FC<backgroundProps> = ({ children }) => {
  const { mousePosition, handleMouseMove } = useMouseMove();

  return (
    <Box
      id="BackgroundImageContainer"
      sx={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        // display: "flex",
      }}
      onMouseMove={(e) => handleMouseMove(e as unknown as MouseEvent)}
    >
      <Box
        id="backgroundImagebox"
        sx={{
          position: "absolute",
          height: "100vh",
          width: "100vw",
          top: 0,
          left: 0,
          zIndex: -20,
          transition: "transform 0.9s ease-out",
          transform: `scale(${mousePosition.scale})`,
        }}
      >
        <Image
          src="/background-evening.jpg" // Replace with your background image path
          alt="Background"
          layout="fill"
          objectFit="cover"
        />
      </Box>
      {children}
    </Box>
  );
};

export default BackgroundImageContainer;
