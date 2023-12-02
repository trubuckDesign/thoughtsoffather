import { Grid } from "@mui/material";
import React from "react";

import PaperPage from "./pageSection/paperPage";
import { ContentData } from "../book/bookContainer";

export interface BookPageProps {
  contents: ContentData;
}

export const BookPage: React.FC<BookPageProps> = ({ contents }) => {
  return (
    <Grid container id="bookPageGrid" spacing={2} sx={{ margin: 1, width: "100%", height: "100%" }}>
      <PaperPage contentChunk={contents.text} />
    </Grid>
  );
};
