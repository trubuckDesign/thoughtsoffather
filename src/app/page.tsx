"use client";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import useMouseMove from "@/globalHooks/useMouseMove";
import JournalButton from "@/components/buttons/journalButton";
import { BookContainer } from "@/components/book/bookContainer";
import { CSSTransition } from "react-transition-group";
import "../css/transitions.css";
import BackgroundImageContainer from "@/components/background/background";

export interface Thought {
  title: string;
  content: string;
  createdOn: Date;
}

const LandingPage = () => {
  const [isOpen, setOpen] = useState(false);
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const { mousePosition, handleMouseMove } = useMouseMove();

  const handleBookClick = () => {
    setOpen(!isOpen);
  };

  useEffect(() => {
    const fetchThoughts = async () => {
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

      <CSSTransition in={isOpen} timeout={1900} classNames="fade" unmountOnExit>
        <Box sx={{ position: "absolute" }}>
          <BookContainer thoughts={thoughts} />
        </Box>
      </CSSTransition>
    </BackgroundImageContainer>
  );
};

export default LandingPage;
