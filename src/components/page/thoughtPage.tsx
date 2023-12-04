import React from "react";
import { Box, Card, Paper, Typography, styled } from "@mui/material";
import { Thought } from "@/app/page";

interface ThoughtPageProps {
  thought: Thought;
}

const ThoughtPage: React.FC<ThoughtPageProps> = ({ thought }) => {
  return (
    <Card
      elevation={3}
      sx={{
        width: "65%",
        margin: "30px auto",
        boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",

        backgroundColor: "#faf7f4", // Solid off-white color, no transparency
        border: "1px solid #ddd",

        background: `
          repeating-linear-gradient(0deg, #fdfdfd, #fdfdfd 1px, rgba(0, 0, 0, 0.02) 1px, rgba(0, 0, 0, 0.02) 2px)`, // Subtle texture with no transparency
        "&:before": {
          // Inset shadow for curled edge effect
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.05)",
        },
      }}
      id="CardThoughtPage"
    >
      <Box
        dangerouslySetInnerHTML={{ __html: thought.content }}
        id="BoxWithContent"
        sx={{
          backgroundColor: "#faf7f4",
          typography: "body1",
          "& img": {
            maxWidth: "100%",
            height: "auto",
          },
          "& a": {
            textDecoration: "none",
            color: "black",
          },
        }}
      />
    </Card>
  );
};

export default ThoughtPage;
