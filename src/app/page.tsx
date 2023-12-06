"use client";
import React, { useEffect, useState, useRef } from "react";
import { Box } from "@mui/material";
import JournalButton from "@/components/buttons/journalButton";
import { CSSTransition } from "react-transition-group";
import "../css/transitions.css";
import BackgroundImageContainer from "@/components/background/background";
import HandwritingSpinner from "@/components/loadingSpinner/writingSpinner";
import ThoughtPage from "@/components/page/thoughtPage";
import { Thoughts } from "@prisma/client";

const POSTS_PER_PAGE = 5;
const PRIOR_POST_COUNT = 3;

const LandingPage = () => {
  const [isOpen, setOpen] = useState(false);
  const [thoughts, setThoughts] = useState<Thoughts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const loaderRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisiblePostId, setLastVisiblePostId] = useState<number>(1);

  const handleBookClick = () => {
    setOpen(!isOpen);
  };

  useEffect(() => {
    const lastReadThoughtIdString = localStorage.getItem("lastReadThoughtId") || "1";
    let lastReadThoughtId = parseInt(lastReadThoughtIdString);
    setLastVisiblePostId(lastReadThoughtId);

    const loadInitialPosts = async () => {
      setIsLoading(true);
      try {
        let url = `/api/thoughts?startId=${lastReadThoughtId}&thoughtCount=${POSTS_PER_PAGE}`;
        const response = await fetch(url);
        const data = await response.json();
        setThoughts(data.posts);
        setHasMore(data.hasMore);
      } catch (error) {
        console.error("Error loading initial posts:", error);
      }
      setIsLoading(false);
    };

    loadInitialPosts();

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        console.log("Observer triggered", firstEntry.isIntersecting);
        if (firstEntry.isIntersecting && hasMore) {
          loadMorePosts("down");
        }
      },
      { threshold: 0.1, rootMargin: "100px" } // Adjust rootMargin as needed
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore]);

  const loadMorePosts = async (direction: string) => {
    setIsLoading(true);
    try {
      let url = `/api/thoughts?direction=${direction}&startId=${lastVisiblePostId}&thoughtCount=${POSTS_PER_PAGE}`;
      const response = await fetch(url);
      const data = await response.json();
      const newPosts: Thoughts[] = data.posts.filter(
        (post: Thoughts) => !thoughts.some((existingPost: Thoughts) => existingPost.thoughtId === post.thoughtId)
      );

      // Sort newPosts by createdAt date
      newPosts.sort((a: Thoughts, b: Thoughts) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      if (direction === "down") {
        setThoughts((prevThoughts) => [...prevThoughts, ...newPosts]);
      } else {
        setThoughts((prevThoughts) => [...newPosts, ...prevThoughts]);
      }
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Error loading more posts:", error);
    }
    setIsLoading(false);
  };

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
          <>
            <Box
              id="pageBoxContainer"
              sx={{ display: "flex", flexDirection: "column", alignItems: "center", overflowY: "auto", maxHeight: "95vh", width: "100vw" }}
            >
              {thoughts.map((thought, index) => (
                <Box key={index}>
                  <ThoughtPage thought={thought} setLastVisiblePostId={setLastVisiblePostId} />
                </Box>
              ))}
            </Box>
            <div ref={loaderRef} style={{ height: "20px", margin: "10px", backgroundColor: "red" }}></div>
          </>
        </CSSTransition>
      )}
    </BackgroundImageContainer>
  );
};

export default LandingPage;
