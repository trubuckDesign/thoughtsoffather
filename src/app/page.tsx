"use client";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import useMouseMove from "@/globalHooks/useMouseMove";
import "../css/transitions.css";
import BackgroundImageContainer from "@/components/background/background";
import HandwritingSpinner from "@/components/loadingSpinner/writingSpinner";
import PaperPage from "@/components/page/pageSection/paperPage";
import ThoughtPage from "@/components/page/thoughtPage";

export interface Thought {
  title: string;
  content: string;
  createdOn: Date;
}

const LandingPage = () => {
  const [isOpen, setOpen] = useState(false);
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { mousePosition, handleMouseMove } = useMouseMove();

  useEffect(() => {
    const fetchThoughts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/thoughts?page=0", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setThoughts(data.posts);
      } catch (error) {
        console.error("Failed to fetch thoughts", error);
      }
      setIsLoading(false);
    };

    fetchThoughts();
  }, []);

  return (
    <BackgroundImageContainer>
      {isLoading ? (
        <HandwritingSpinner />
      ) : (
        <Box
          id="pageBoxContainer"
          sx={{ display: "flex", flexDirection: "column", alignItems: "center", overflowY: "auto", maxHeight: "95vh", width: "100vw" }}
        >
          <Box>
            {thoughts.map((thought, index) => (
              <ThoughtPage key={index} thought={thought} />
            ))}
          </Box>
        </Box>
      )}
    </BackgroundImageContainer>
  );
};

export default LandingPage;
