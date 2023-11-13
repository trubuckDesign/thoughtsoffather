import React from "react";
import { Card, Grid, Button } from "@mui/material";
import { BookPageProps, BookPage } from "./page/bookPage";

interface BookSinglePageViewProps {
  pageData: BookPageProps | null;
  goToNextPage: () => void;
  goToPrevPage: () => void;
}

const BookSinglePageView: React.FC<BookSinglePageViewProps> = ({ pageData, goToNextPage, goToPrevPage }) => {
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
          }}
        >
          {pageData && <BookPage {...pageData} />}
        </Grid>

        <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", padding: 2, background: "url(/white_paper_texture_set.png)" }}>
          <Button onClick={goToPrevPage}>Previous</Button>
          <Button onClick={goToNextPage}>Next</Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default BookSinglePageView;
