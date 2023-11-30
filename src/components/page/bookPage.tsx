import { Grid } from "@mui/material";
import React from "react";

import LetterCard from "./pageSection/paperPage";
import { ContentData } from "../book/bookContainer";

export interface BookPageProps {
  pageId: number;
  contents: ContentData;
}

export const BookPage: React.FC<BookPageProps> = ({ contents, pageId }) => {
  return (
    <Grid container spacing={2} sx={{ margin: 1 }}>
      <>
        <LetterCard contentChunk={contents.text} />
      </>
    </Grid>
  );
};
