import React from "react";
import Box from "@mui/material/Box";
import ParallaxImage from "./parallaxImage";

interface ParallaxScrollingProps {
  imageUrls: string[];
}

const ParallaxScrolling: React.FC<ParallaxScrollingProps> = ({ imageUrls }) => {
  return (
    <Box sx={{ overflow: "hidden" }}>
      {imageUrls.map((url, index) => (
        <ParallaxImage key={index} src={url} />
      ))}
    </Box>
  );
};

export default ParallaxScrolling;
