import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";

interface ParallaxImageProps {
  src: string;
}

const ParallaxImage: React.FC<ParallaxImageProps> = ({ src }) => {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <Box
      ref={imgRef}
      sx={{
        height: "100vh",
        position: "relative",
        // Add more styles for Polaroid effect here
      }}
    >
      {isVisible && <Image src={src} alt="Parallax Background" layout="fill" objectFit="cover" quality={65} />}
    </Box>
  );
};

export default ParallaxImage;
