import { Card, Grid, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import { BookPageSection, BookPageSectionProps } from "./pageSection/bookPageSection";
import { ContentData } from "@/app/page";

export interface BookPageProps {
  contents: ContentData[];
  type: "single" | "double";
  onClick: (pageId: number | null) => void;
}

export const BookPage: React.FC<BookPageProps> = ({ contents, type, onClick }) => (
  <Grid container spacing={2} sx={{ padding: 4 }}>
    {contents.map((content, index) => (
      <BookPageSection contents={content} type={type} onClick={onClick} key={index} {...content} />
    ))}
  </Grid>
);
