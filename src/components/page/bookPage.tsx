import { Card, Divider, Grid } from "@mui/material";
import React from "react";

import { EndPage } from "./lastPage";
import LetterCard from "./pageSection/paperPage";
import { ContentData } from "../book/bookContainer";

export interface BookPageProps {
  pageId: number;
  contents: ContentData;
  onClick: (pageId: number | null) => void;
}

export const BookPage: React.FC<BookPageProps> = ({ contents, onClick, pageId }) => {
  return (
    <Grid container spacing={2} sx={{ margin: 1 }}>
      <>
        <LetterCard contentChunk={contents.text} />
      </>
    </Grid>
  );
};
