import { ContentData } from "@/app/page";
import { Card, Grid, Typography, Box } from "@mui/material";
import Image from "next/image";
import React from "react";

export interface BookPageSectionProps {
  contents: ContentData;
  type: "single" | "double";
  onClick: (pageId: number | null) => void;
}

export const BookPageSection: React.FC<BookPageSectionProps> = ({ contents, onClick, type }) => {
  const { nextPage, imageSrc, text } = contents;
  return (
    <Grid
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
    >
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
          fontSize: "1.8rem", // Suitable font size for reading
          lineHeight: 1.5, // Optimal line height for readability
          textAlign: "justify", // Justified text for a clean look
          margin: "10px 0", // Margin for spacing
        }}
      >
        {text}
      </Typography>
    </Grid>
  );
};
