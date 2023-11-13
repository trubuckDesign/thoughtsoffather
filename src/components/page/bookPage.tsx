import { Card, Divider, Grid, Typography } from "@mui/material";
import Image from "next/legacy/image";
import React from "react";
import { BookPageSection, BookPageSectionProps } from "./pageSection/bookPageSection";
import { ContentData } from "@/app/page";

export interface BookPageProps {
  pageId: number;
  contents: ContentData[];
  type: "single" | "double";
  onClick: (pageId: number | null) => void;
}

export const BookPage: React.FC<BookPageProps> = ({ contents, type, onClick, pageId }) => (
  <Grid container spacing={2} sx={{ margin: 1 }}>
    {contents.map((content, index) => (
      <>
        <Grid item xs={type === "single" ? 11 : 5.5}>
          <BookPageSection contents={content} type={type} onClick={onClick} key={index} {...content} pageId={pageId} />
        </Grid>
        {type === "double" && content.nextPage && content.nextPage % 2 !== 0 && (
          <Grid
            item
            xs={0.1} // Adjust the width to account for the divider
          >
            <Divider orientation="vertical" />
          </Grid>
        )}
      </>
    ))}
  </Grid>
);
