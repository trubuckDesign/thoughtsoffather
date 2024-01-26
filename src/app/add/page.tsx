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
  Button,
  IconButton,
  ListItemSecondaryAction,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
import DeleteIcon from "@mui/icons-material/Delete";

import BackgroundImageContainer from "@/components/background/background";
import PostEditor from "@/components/postEditor/postEditor";
import { Thoughts } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Thought } from "@/components/landingPage";
import ShareIcon from "@mui/icons-material/Share";
import ShareDialog from "@/components/dialogs/shareDialog";

const AddPostPage = () => {
  const [thoughtSummary, setThoughtSummary] = useState<Thought[]>([]);
  const [selectedThought, setSelectedThought] = useState<Thoughts | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPostLoading, setIsPostLoading] = useState<boolean>(false);

  const { data: session, status } = useSession();
  const sessionLoading = status === "loading";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const [selectedShareThought, setSelectedShareThought] = useState<Thought | null>(null);
  const [openShareDialog, setOpenShareDialog] = useState(false);

  const handleShareThought = (thought: Thought) => {
    setSelectedShareThought(thought);
    setOpenShareDialog(true);
  };

  useEffect(() => {
    if (sessionLoading) return;

    if (!session) {
      // Not signed in
      router.replace("/signin");
    } else if (!session.isAuthorized) {
      // Signed in but not authorized
      router.replace("/");
    } else {
      // Signed in and authorized
      setIsLoading(false);
      // Fetch data or perform other actions for authorized user
    }
  }, [session, sessionLoading, router]);

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
    setIsPostLoading(true);
    try {
      const response = await fetch(`/api/thoughts/${thoughtId}`);
      const thought: Thoughts = await response.json();
      setSelectedThought(thought);
    } catch (error) {
      console.error("Error fetching thought details:", error);
    } finally {
      setIsPostLoading(false);
    }
  };
  const navigateHome = () => {
    router.push("/"); // Navigates to the home page
  };
  const handleDeleteThought = async (thoughtId: number) => {
    if (!confirm("Are you sure you want to delete this thought?")) {
      return; // Do nothing if the user cancels the confirmation dialog
    }

    try {
      const response = await fetch(`/api/thoughts/${thoughtId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Update the list of thoughts after deletion
      const updatedThoughts = thoughtSummary.filter((thought) => thought.thoughtId !== thoughtId);
      setThoughtSummary(updatedThoughts);
      alert("Thought deleted successfully");
    } catch (error) {
      console.error("Failed to delete thought", error);
      alert("There was an error deleting the thought");
    }
  };

  const renderPostList = () => (
    <List>
      {thoughtSummary.map((thought) => (
        <ListItem key={thought.thoughtId} button onClick={() => handleThoughtSelect(thought.thoughtId)}>
          <ListItemText primary={thought.title} secondary={new Date(thought.createdAt).toLocaleDateString()} />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="share" onClick={() => handleShareThought(thought)}>
              <ShareIcon />
            </IconButton>
            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteThought(thought.thoughtId)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
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
          <Box
            sx={{
              position: "fixed",
              top: 16, // Adjusts the distance from the top
              right: 16, // Adjusts the distance from the right
              zIndex: 1500, // Ensures the button is above everything else
            }}
          >
            <Button variant="contained" color="primary" onClick={navigateHome} startIcon={<HomeIcon />}>
              Home
            </Button>
          </Box>
          <Grid
            container
            spacing={1}
            sx={{ height: "100vh", overflow: "auto", marginRight: isMobile ? 2 : 0, marginLeft: isMobile ? 0 : 1, marginTop: 5 }}
          >
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
              {isPostLoading && (
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
              )}
              <PostEditor
                existingTitle={selectedThought?.title}
                existingContent={selectedThought?.content}
                existingThoughtId={selectedThought?.thoughtId}
                existingCreatedAt={selectedThought?.createdAt}
                setThoughtSummary={setThoughtSummary}
                setSelectedThought={setSelectedThought}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{
                  textAlign: "center",
                  width: "100%",
                  padding: 1,
                  marginBottom: 5,
                  color: "black",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                }}
              >
                To My Hero, I Love You. -Ryan
              </Typography>
            </Grid>
            {/* Optionally hide the last column on smaller screens */}
            <Grid item xs={0} sm={1}>
              {/* Content for the last column */}
            </Grid>
          </Grid>
        </>
      )}
      {selectedShareThought && (
        <ShareDialog
          open={openShareDialog}
          onClose={() => setOpenShareDialog(false)}
          shareUrl={`${window.location.origin}/posts/${selectedShareThought.thoughtId}`}
          thoughtTitle={selectedShareThought.title}
        />
      )}
    </BackgroundImageContainer>
  );
};

export default AddPostPage;
