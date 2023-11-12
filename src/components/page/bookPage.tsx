import { Card, Grid, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import { ImageText, ImageTextProps } from "../pageSection/bookPageSection";

export interface BookPageProps {
  contents: ImageTextProps[];
}

export const BookPage: React.FC<BookPageProps> = ({ contents }) => (
  <Grid container spacing={2} sx={{ padding: 4 }}>
    {contents.map((content, index) => (
      <ImageText key={index} {...content} />
    ))}
  </Grid>
);
