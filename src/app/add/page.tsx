"use client";
import React, { useState } from "react";

import { Box } from "@mui/material";

import BackgroundImageContainer from "@/components/background/background";
import PostEditor from "@/components/postEditor/postEditor";

const AddPostPage = () => {
  return (
    <BackgroundImageContainer>
      <Box
        sx={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PostEditor />
      </Box>
    </BackgroundImageContainer>
  );
};

export default AddPostPage;
