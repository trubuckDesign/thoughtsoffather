"use client";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import useMouseMove from "@/globalHooks/useMouseMove";
import JournalButton from "@/components/buttons/journalButton";
import { BookContainer } from "@/components/book/bookContainer";
import { CSSTransition } from "react-transition-group";
import "../css/transitions.css";
import BackgroundImageContainer from "@/components/background/background";
import HandwritingSpinner from "@/components/loadingSpinner/writingSpinner";
import ThoughtPage from "@/components/page/thoughtPage";
import { Thoughts } from "@prisma/client";

const LandingPage = () => {
  const [isOpen, setOpen] = useState(false);
  const [thoughts, setThoughts] = useState<Thoughts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { mousePosition, handleMouseMove } = useMouseMove();

  const handleBookClick = () => {
    setOpen(!isOpen);
  };

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
      <CSSTransition in={!isOpen} timeout={1500} classNames="fade" unmountOnExit>
        <Box sx={{ position: "absolute" }}>
          <JournalButton handleClick={handleBookClick} />
        </Box>
      </CSSTransition>

      {isLoading ? (
        <HandwritingSpinner />
      ) : (
        <CSSTransition in={isOpen} timeout={1900} classNames="fade" unmountOnExit>
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
        </CSSTransition>
      )}
    </BackgroundImageContainer>
  );
};

export default LandingPage;
