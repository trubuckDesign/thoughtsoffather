import React, { CSSProperties, FC } from "react";
import Image from "next/image";
import { ParallaxLayer } from "@react-spring/parallax";

interface BackgroundImageContainerProps {
  imageUrls: string[]; // Array of image URLs
  layerOffset: number; // The offset for the ParallaxLayer
  layerFactor: number; // The factor for the ParallaxLayer
}

const getRandomSpeed = () => {
  const randomSpeed = Math.random() * 4 + 1;
  return randomSpeed;
};

const getRandomStyle = (usedPositions: Set<string>): CSSProperties => {
  const rotation = Math.random() * 10.5 - 5;
  const margin = Math.random() * 20; // Random margin up to 50px
  const marginTop = Math.random() * 80;

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
          style={getRandomStyle(usedPositions)}
        />
      ))}
    </ParallaxLayer>
  );
};
