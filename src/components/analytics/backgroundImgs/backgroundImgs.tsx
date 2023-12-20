import React, { CSSProperties, FC } from "react";
import Image from "next/image";
import { ParallaxLayer } from "@react-spring/parallax";
import { Box, Grid, Paper } from "@mui/material";

interface BackgroundImageContainerProps {
  imageUrls: string[]; // Array of image URLs
  layerOffset: number; // The offset for the ParallaxLayer
  layerFactor: number; // The factor for the ParallaxLayer
}

const baseSpeed = 2;

const getRandomSpeed = () => {
  const randomSpeed = Math.random() * baseSpeed + 1;
  return randomSpeed;
};

const getRandomStyle = (): CSSProperties => {
  const rotation = Math.random() * 50 - 15; // Rotation range: -15 to 15 degrees
  const marginTop = 20 + Math.random() * 40; // Vertical margin range: 20px to 60px
  const marginRight = 20 + Math.random() * 100;
  return {
    transform: `rotate(${rotation}deg)`,
    marginTop: `${marginTop}px`,
    marginRight: `${marginRight}px`,
  };
};

export const ParallaxImages: FC<BackgroundImageContainerProps> = ({ imageUrls, layerOffset, layerFactor }) => {
  return (
    <ParallaxLayer offset={layerOffset} speed={getRandomSpeed()} factor={layerFactor} style={{ position: "relative", width: "100%" }}>
      {imageUrls.map((url, index) => (
        <Grid item xs={12} key={index} style={{ width: "100%" }}>
          <Box style={{ textAlign: "right", marginTop: "200px" }}>
            <Image
              src={url}
              alt={`Image ${index}`}
              width={300} // Adjust width as needed
              height={200} // Adjust height as needed
              objectFit="cover"
              style={getRandomStyle()}
            />
          </Box>
        </Grid>
      ))}
    </ParallaxLayer>
  );
};
