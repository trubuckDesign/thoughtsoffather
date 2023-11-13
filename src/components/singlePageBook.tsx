import React, { useEffect, useState } from "react";
import { Card, Grid, Button } from "@mui/material";
import { BookPageProps, BookPage } from "./page/bookPage";

interface BookSinglePageViewProps {
  pageData: BookPageProps | null;
  visible: boolean;
}

const BookSinglePageView: React.FC<BookSinglePageViewProps> = ({ pageData, visible }) => {
  if (!pageData) {
    return null;
  } else {
  }

  return (
    <Card
      sx={{
        width: "70vw",
        height: "80vh",
        margin: "auto",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#fdf8e1", // Off-white paper color
        background: "linear-gradient(to bottom, #fdf8e1, #f1e4c6)", // Subtle gradient
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
        zIndex: 2,
      }}
    >
      <Grid container sx={{ height: "100%" }}>
        <Grid
          item
          xs={12}
          sx={{
            position: "relative",
            background: "url(/white_paper_texture_set.png)", // Paper texture background
            padding: "20px", // Padding to simulate page margin
            opacity: visible ? 1 : 0,
            transition: "opacity 1.0s ease",
          }}
        >
          {pageData && <BookPage {...pageData} />}
        </Grid>
      </Grid>
    </Card>
  );
};

export default BookSinglePageView;
