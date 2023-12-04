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
          overflow: "hidden",
          padding: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Slightly transparent white background
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Drop shadow with slight transparency
          borderRadius: "4px", // Optional: adds rounded corners
        }}
      >
        <PostEditor />
      </Box>
    </BackgroundImageContainer>
  );
};

export default AddPostPage;
