import React, { CSSProperties, FC } from "react";
import Image from "next/image";
import { ParallaxLayer } from "@react-spring/parallax";

interface BackgroundImageContainerProps {
  imageUrls: string[]; // Array of image URLs
  layerOffset: number; // The offset for the ParallaxLayer
  layerFactor: number; // The factor for the ParallaxLayer
}

const baseTop = 10;
const baseLeft = 10;
const baseSpeed = 2;
const variationRange = 15;

const getRandomSpeed = () => {
  const randomSpeed = Math.random() * baseSpeed + 1;
  return randomSpeed;
};

const getRandomStyle = (index: number, totalImages: number): CSSProperties => {
  const rotation = Math.random() * 15.5 - 5;
  const margin = Math.random() * 20; // Random margin up to 50px
  const marginTop = Math.random() * 80;
  // Base percentages for positioning

  // Increment values for each iteration
  const topIncrement = 100 / Math.ceil(totalImages / 2); // Divide the vertical space into parts
  const leftIncrement = totalImages > 1 ? 80 / (totalImages / 2 - 1) : 0; // Increment for the left position, adjusted for the number of images

  // Function to add random variation
  const addRandomVariation = (value: number) => {
    const variation = Math.random() * variationRange * 2 - variationRange; // Random value between -variationRange and +variationRange
    return Math.max(0, Math.min(100, value + variation)); // Ensure the final value is between 0% and 100%
  };

  // Calculate the top and left positions
  const top = addRandomVariation((baseTop + (index % 2) * (index * topIncrement)) % 100); // Every other iteration increases top
  const left = addRandomVariation(baseLeft + ((Math.floor(index / 2) * leftIncrement) % 100)); // Increment left position on every other iteration

  return {
    position: "absolute",
    transform: `rotate(${rotation}deg)`,
    left: `${left}%`,
    top: `${top}%`,
    padding: "10px",
    backgroundColor: "white",
    border: "1px solid #ddd",
    boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.5)",
    display: "inline-block",
    maxWidth: "600px",
    minWidth: "100px",
    // width: `100%`,
    marginBottom: `${margin}px`,
    marginTop: `${marginTop}px`,
    zIndex: Math.floor(Math.random() * 10), // Random z-index to allow images to overlap naturally
  };
};
const usedPositions = new Set<string>();
export const ParallaxImages: FC<BackgroundImageContainerProps> = ({ imageUrls, layerOffset, layerFactor }) => {
  return (
    <ParallaxLayer offset={layerOffset} speed={getRandomSpeed()} factor={layerFactor} style={{ position: "relative" }}>
      {imageUrls.map((url, index) => (
        <Image
          key={index}
          src={url}
          alt={`Background ${index}`}
          width={300} // Adjust width as needed
          height={200} // Adjust height as needed
          objectFit="cover"
          style={getRandomStyle(index, imageUrls.length)}
        />
      ))}
    </ParallaxLayer>
  );
};
