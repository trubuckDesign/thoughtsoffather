import { Card, Grid, Typography, Box } from "@mui/material";
import Image from "next/image";
import React from "react";
import { BookPageProps, BookPage } from "../page/bookPage";

// ... [ImageText and BookPage components as before]

interface BookProps {
  leftPage: BookPageProps;
  rightPage: BookPageProps;
}

const Book: React.FC<BookProps> = ({ leftPage, rightPage }) => (
  <Card sx={{ width: "70vw", height: "80vh", margin: "auto", overflow: "auto", position: "relative" }}>
    <Grid container sx={{ height: "100%" }}>
      <Grid item xs={6} sx={{ position: "relative" }}>
        <BookPage {...leftPage} />
        <Box
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "6px",
            borderRight: "1px solid black",
            boxShadow: "16px 0 30px rgba(0, 0, 0, 2)",
          }}
        />
      </Grid>
      <Grid item xs={6} sx={{ position: "relative" }}>
        <BookPage {...rightPage} />
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "6px",
            borderLeft: "1px solid black",
            boxShadow: "-16px 0 30px rgba(0, 0, 0, 2)",
          }}
        />
      </Grid>
    </Grid>
  </Card>
);

export default Book;
