"use client";
import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import useMouseMove from "@/globalHooks/useMouseMove";
import JournalButton from "@/components/buttons/journalButton";
import { CSSTransition } from "react-transition-group";
import "../css/transitions.css";
import BackgroundImageContainer from "@/components/background/background";
import HandwritingSpinner from "@/components/loadingSpinner/writingSpinner";
import ThoughtPage from "@/components/page/thoughtPage";
import { Thoughts } from "@prisma/client";

const POSTS_PER_PAGE = 5;

const LandingPage = () => {
  const [isOpen, setOpen] = useState(false);
  const [thoughts, setThoughts] = useState<Thoughts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { mousePosition, handleMouseMove } = useMouseMove();
  const [page, setPage] = useState(1); // Pagination control
  const loaderRef = useRef(null); // Reference for the observer element
  const [loadingMore, setLoadingMore] = useState(false); // State to track loading of additional posts
  const [hasMore, setHasMore] = useState(true);

  const handleBookClick = () => {
    setOpen(!isOpen);
  };

  // Add to the LandingPage component
  useEffect(() => {
    const savedPosition = localStorage.getItem("readingPosition");
    if (savedPosition) {
      // Logic to scroll to the saved position
    }
  }, []);

  const handleScroll = () => {
    const position = window.scrollY;
    localStorage.setItem("readingPosition", position.toString());
  };

  // Add an event listener for scroll
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  //---initial load

  useEffect(() => {
    // Function to check if the loader is visible and load more posts
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        rootMargin: "200px", // Load more before reaching the bottom
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Function to fetch more thoughts when the page number changes
    const fetchMoreThoughts = async () => {
      if (!hasMore) return;
      setIsLoading(true);
      try {
        const response = await fetch(`/api/thoughts?page=${page}&pageCount=${POSTS_PER_PAGE}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setThoughts((prevThoughts) => [...prevThoughts, ...data.posts]);
      } catch (error) {
        console.error("Failed to fetch thoughts", error);
      }
      setIsLoading(false);
    };
    console.log("pageHasMore", page, hasMore);
    if (page > 0) {
      fetchMoreThoughts();
    }
  }, [page]);

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
