"use client";
// pages/[thoughtId].tsx
import React, { useEffect, useState } from "react";
import LandingPage from "@/components/landingPage";
import { Thoughts } from "@prisma/client";
import { Box, CircularProgress } from "@mui/material";

export default function Page({ params }: { params: { thoughtId: string } }) {
  const [post, setPost] = useState<Thoughts | null>(null);

  async function fetchPostById(id: string): Promise<Thoughts | null> {
    try {
      const response = await fetch(`/api/thoughts/${params.thoughtId}`); // Adjust the URL to match your API endpoint
      if (!response.ok) {
        throw new Error("Post not found");
      }
      const post: Thoughts = await response.json();
      return post;
    } catch (error) {
      console.error("Error fetching post:", error);
      return null;
    }
  }

  useEffect(() => {
    if (params.thoughtId) {
      fetchPostById(params.thoughtId as string).then(setPost);
    }
  }, [params.thoughtId]);

  if (!post) {
    return (
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
    );
  }

  return <LandingPage initialPosts={[post]} skipInitialSteps={true} />;
}
