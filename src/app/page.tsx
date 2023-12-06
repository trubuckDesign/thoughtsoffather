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
import { debounce } from "lodash";

const POSTS_PER_PAGE = 5;
const PRIOR_POST_COUNT = 3;

const LandingPage = () => {
  const [isOpen, setOpen] = useState(false);
  const [thoughts, setThoughts] = useState<Thoughts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const loaderRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisiblePostId, setLastVisiblePostId] = useState<number>(1);
  const [startPostId, setStartPostId] = useState(1);
  const [endPostId, setEndPostId] = useState(5);

  const handleBookClick = () => {
    setOpen(!isOpen);
  };

  // Debounced load more posts function
  const debounceLoadMorePosts = debounce((direction: string) => {
    setLastVisiblePostId((lastPostId) => lastPostId + POSTS_PER_PAGE);
  }, 300);

  const observerCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    console.log("Observer callback called", entries, observer);
    if (entries[0].isIntersecting && hasMore) {
      console.log("Loading more posts...");
      debounceLoadMorePosts("down");
    }
  };

  useEffect(() => {
    const lastReadThoughtIdString = localStorage.getItem("lastReadThoughtId") || "1";
    let lastReadThoughtId = parseInt(lastReadThoughtIdString);
    setLastVisiblePostId(lastReadThoughtId);

    const loadInitialPosts = async () => {
      console.log("Loading initial posts...");
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

    const observerCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      console.log("Observer callback called", entries, observer);
      if (entries[0].isIntersecting && hasMore) {
        console.log("Loading more posts...");
        loadMorePosts("down");
      }
    };

    const observerOptions = {
      root: null, // observing in relation to the viewport
      rootMargin: "0px",
      threshold: 0.1, // trigger when 10% of the loaderRef is visible
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (loaderRef.current) {
      console.log("Observing loaderRef");
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore]);

  const loadMorePosts = async (direction: string) => {
    console.log(`Loading more posts in direction: ${direction}`);
    setIsLoading(true);
    try {
      let url = `/api/thoughts?startId=${lastVisiblePostId}&thoughtCount=${POSTS_PER_PAGE}`;
      const response = await fetch(url);
      const data = await response.json();
      const newPosts: Thoughts[] = data.posts.filter(
        (post: Thoughts) => !thoughts.some((existingPost: Thoughts) => existingPost.thoughtId === post.thoughtId)
      );

      if (newPosts.length > 0) {
        const ids = newPosts.map((post: Thoughts) => post.thoughtId);
        const minId = Math.min(...ids);
        const maxId = Math.max(...ids);

        // Update startPostId and endPostId
        setStartPostId(minId);
        setEndPostId(maxId);
      }

      if (direction === "down") {
        setThoughts([...thoughts, ...data.posts]);
      } else {
        setThoughts([...data.posts, ...thoughts]);
      }
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Error loading more posts:", error);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    // Function to determine the direction based on the distance to start and end post IDs
    const determineDirection = () => {
      const distanceToStart = Math.abs(lastVisiblePostId - startPostId);
      const distanceToEnd = Math.abs(lastVisiblePostId - endPostId);
      return distanceToStart < distanceToEnd ? "down" : "up";
    };

    // Call loadMorePosts with the appropriate direction
    const direction = determineDirection();
    loadMorePosts(direction);
  }, [lastVisiblePostId, isOpen]);

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
