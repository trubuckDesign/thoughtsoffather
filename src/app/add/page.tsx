"use client";
import React, { useEffect, useState } from "react";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import BackgroundImageContainer from "@/components/background/background";
import PostEditor from "@/components/postEditor/postEditor";
import { GroupedData, Thought } from "../page";
import { Thoughts } from "@prisma/client";

const AddPostPage = () => {
  const [thoughtSummary, setThoughtSummary] = useState<Thought[]>([]);
  const [selectedThought, setSelectedThought] = useState<Thoughts | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchTimelineData = async () => {
      setIsLoading(true); // Start loading

      try {
        const response = await fetch("/api/thoughts/timeline");
        const { thoughtSummary }: { thoughtSummary: Thought[] } = await response.json();

        setThoughtSummary(thoughtSummary);
        // Log the data to check its structure
      } catch (error) {
        console.error("Error fetching timeline data:", error);
      } finally {
        setIsLoading(false); // Stop loading if an error occurs
      }
    };

    fetchTimelineData();
  }, []);
  const handleThoughtSelect = async (thoughtId: number) => {
    try {
      const response = await fetch(`/api/thoughts/${thoughtId}`);
      const thought: Thoughts = await response.json();
      setSelectedThought(thought);
    } catch (error) {
      console.error("Error fetching thought details:", error);
    }
  };
  const renderPostList = () => (
    <List>
      {thoughtSummary.map((thought) => (
        <ListItem key={thought.thoughtId} button onClick={() => handleThoughtSelect(thought.thoughtId)}>
          <ListItemText primary={thought.title} secondary={new Date(thought.createdAt).toLocaleDateString()} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <BackgroundImageContainer>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={1} sx={{ height: "100vh", overflow: "auto", marginRight: isMobile ? 2 : 0, marginLeft: isMobile ? 0 : 1 }}>
            <Grid item xs={12} sm={4}>
              {isMobile ? (
                <Accordion sx={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Existing Posts</Typography>
                  </AccordionSummary>
                  <AccordionDetails>{renderPostList()}</AccordionDetails>
                </Accordion>
              ) : (
                <>
                  <Typography
                    variant="h6"
                    sx={{ backgroundColor: "rgba(255, 255, 255, 0.8)", padding: 1.5, marginTop: 2, marginBottom: 1, color: "black" }}
                  >
                    Existing Posts
                  </Typography>
                  <Box sx={{ overflowY: "auto", height: "70vh", backgroundColor: "rgba(255, 255, 255, 0.8)", color: "black" }}>
                    {renderPostList()}
                  </Box>
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={7}>
              <PostEditor
                existingTitle={selectedThought?.title}
                existingContent={selectedThought?.content}
                existingThoughtId={selectedThought?.thoughtId}
                setSelectedThought={setSelectedThought}
              />
            </Grid>
            {/* Optionally hide the last column on smaller screens */}
            <Grid item xs={0} sm={1}>
              {/* Content for the last column */}
            </Grid>
          </Grid>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              width: "100%",
              position: "absolute",
              bottom: 10,
              padding: 1,
              color: "black",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          >
            To My Hero, I Love You. -Ryan
          </Typography>
        </>
      )}
    </BackgroundImageContainer>
  );
};

export default AddPostPage;
