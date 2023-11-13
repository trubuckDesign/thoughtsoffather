import { ContentData } from "@/app/page";
import { Card, Grid, Typography, Box, Divider } from "@mui/material";
import Image from "next/legacy/image";
import React from "react";

export interface BookPageSectionProps {
  contents: ContentData;
  pageId: number;
  type: "single" | "double";
  onClick: (pageId: number | null) => void;
}

export const BookPageSection: React.FC<BookPageSectionProps> = ({ contents, onClick, type, pageId }) => {
  const { nextPage, imageSrc, text } = contents;
  const hoverStyle =
    type === "double"
      ? {
          "&:hover": {
            transform: "scale(1.05)", // Slightly grow the size
            transition: "transform 0.3s ease-in-out", // Smooth transition for the transformation
            cursor: "pointer", // Change cursor to indicate it's clickable
          },
        }
      : {};

  return (
    <>
      {/* <Grid
        item
        xs={12}
        sm={type === "single" ? 12 : 6}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: type === "single" ? "auto" : "50%", // Adjusted height for two-image layout
        }}
      > */}
      <Box
        component={nextPage ? "button" : "div"}
        onClick={() => onClick(nextPage)}
        sx={{
          width: "100%",
          height: "auto",
          position: "relative",
          minHeight: type === "single" ? "40vh" : "30vh",
          border: "2px solid black", // Add a single pixel black border
          boxSizing: "border-box", // Ensure the border is included in the width/height calculations
          ...hoverStyle,
        }}
      >
        <Image
          src={imageSrc}
          alt="Story image"
          layout="fill"
          objectFit={type === "single" ? "contain" : "cover"} // 'cover' for two-image layout
        />
      </Box>
      <Typography
        variant="body1"
        sx={{
          fontFamily: '"Times New Roman", Times, serif', // Traditional book font
          fontSize: {
            xs: "1rem", // smaller font size on extra-small screens
            sm: "1.1rem", // medium font size on small screens
            md: "1.2rem", // larger font size on medium screens
            lg: "1.4rem", // even larger font size on large screens
          }, // Suitable font size for reading
          lineHeight: 1.5, // Optimal line height for readability
          textAlign: "justify", // Justified text for a clean look
          margin: "10px 0", // Margin for spacing
        }}
      >
        {text}
      </Typography>
    </>
  );
};
