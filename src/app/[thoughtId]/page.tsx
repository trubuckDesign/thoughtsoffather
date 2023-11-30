"use client";
import React, { useState } from "react";

import { Box } from "@mui/material";
import { BookContainer } from "@/components/book/bookContainer";

const AddPostPage = () => {
  return (
    <Box sx={{}}>
      <BookContainer thoughts={[]} />
    </Box>
  );
};

export default AddPostPage;
