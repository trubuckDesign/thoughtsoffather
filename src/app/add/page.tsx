"use client";
import React, { useEffect, useState } from "react";

import { Box, Grid } from "@mui/material";

import BackgroundImageContainer from "@/components/background/background";
import PostEditor from "@/components/postEditor/postEditor";
import { GroupedData, Thought } from "../page";

const AddPostPage = () => {
  const [thoughtSummary, setThoughtSummary] = useState<Thought[]>([]);

  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        const response = await fetch("/api/thoughts/timeline");
        const { thoughtSummary }: { thoughtSummary: Thought[] } = await response.json();

        setThoughtSummary(thoughtSummary);
        // Log the data to check its structure
      } catch (error) {
        console.error("Error fetching timeline data:", error);
      }
    };

    fetchTimelineData();
  }, []);

  return (
    <BackgroundImageContainer>
      <Box
        sx={{
          display: "flex",
          height: "100vh", // Full viewport height
          alignItems: "center", // Vertical center alignment
          justifyContent: "center", // Horizontal center alignment
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={4}>
            {/* Content for the first column */}
          </Grid>
          <Grid item xs={7}>
            <Box
              sx={{
                overflow: "hidden",
                padding: "50px",

                backgroundColor: "rgba(255, 255, 255, 0.8)", // Slightly transparent white background
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Drop shadow with slight transparency
                borderRadius: "4px", // Optional: adds rounded corners
              }}
            >
              <PostEditor />
            </Box>
          </Grid>
          <Grid item xs={1}>
            {/* Content for the last column */}
          </Grid>
        </Grid>
      </Box>
    </BackgroundImageContainer>
  );
};

export default AddPostPage;
