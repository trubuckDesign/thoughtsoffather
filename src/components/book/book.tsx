import { Card, Grid, Typography, Box } from "@mui/material";
import Image from "next/image";
import React from "react";
import { BookPageProps, BookPage } from "../page/bookPage";

interface BookProps {
  leftPage: BookPageProps;
  rightPage: BookPageProps;
}

const Book: React.FC<BookProps> = ({ leftPage, rightPage }) => (
  <Card
    sx={{
      width: "70vw",
      height: "80vh",
      margin: "auto",
      overflow: "auto",
      position: "relative",
      backgroundColor: "#fdf8e1", // Off-white paper color
      background: "linear-gradient(to bottom, #fdf8e1, #f1e4c6)", // Subtle gradient
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
    }}
  >
    <Grid container sx={{ height: "100%" }}>
      <Grid
        item
        xs={6}
        sx={{
          position: "relative",
          background: "url(/white_paper_texture_set.png)", // Paper texture background
          padding: "20px", // Padding to simulate page margin
        }}
      >
        <BookPage {...leftPage} />
        <Box
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "6px",
            borderRight: "1px solid black",
            boxShadow: "16px 0 30px rgba(0, 0, 0, 0.5)", // Adjusted shadow opacity
          }}
        />
      </Grid>
      <Grid
        item
        xs={6}
        sx={{
          position: "relative",
          background: "url(/white_paper_texture_set.png)", // Paper texture background
          padding: "20px", // Padding to simulate page margin
        }}
      >
        <BookPage {...rightPage} />
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "6px",
            borderLeft: "1px solid black",
            boxShadow: "-16px 0 30px rgba(0, 0, 0, 0.5)", // Adjusted shadow opacity
          }}
        />
      </Grid>
    </Grid>
  </Card>
);

export default Book;
