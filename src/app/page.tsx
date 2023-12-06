"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Box } from "@mui/material";
import JournalButton from "@/components/buttons/journalButton";
import { CSSTransition } from "react-transition-group";
import "../css/transitions.css";
import BackgroundImageContainer from "@/components/background/background";
import HandwritingSpinner from "@/components/loadingSpinner/writingSpinner";
import ThoughtPage from "@/components/page/thoughtPage";
import { Thoughts } from "@prisma/client";
import { useInfiniteScroll } from "@/components/infiniteScroll/infiniteScroll";

const POSTS_PER_PAGE = 5;
const PRIOR_POST_COUNT = 3;

const LandingPage = () => {
  const [isOpen, setOpen] = useState(false);
  const [thoughts, setThoughts] = useState<Thoughts[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisiblePostId, setLastVisiblePostId] = useState<number>(1);
  const [startPostId, setStartPostId] = useState(1);
  const [endPostId, setEndPostId] = useState(5);

  const handleBookClick = () => {
    setOpen(!isOpen);
  };

  const fetchMoreData = async () => {
    console.log("hasMore", hasMore);
    if (!hasMore) return;
    setIsLoading(true); // Set isLoading to true at the beginning of data fetch

    // Using the ID of the last post to determine the start of the next fetch
    const lastPostId = thoughts.length > 0 ? thoughts[thoughts.length - 1].thoughtId : 0;
    console.log("lastPostId", lastPostId);
    try {
      const response = await fetch(`/api/thoughts?startId=${lastPostId}&thoughtCount=${POSTS_PER_PAGE}`);
      const data = await response.json();
      setThoughts(thoughts.concat(data.posts));
      setHasMore(data.posts.length === POSTS_PER_PAGE);
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setIsLoading(false); // Set isLoading to true at the beginning of data fetch
    }
  };

  const { setTarget } = useInfiniteScroll({
    isLoading,
    hasMore,
    onLoadMore: fetchMoreData,
  });

  useEffect(() => {
    console.log("InitialData:");
    fetchMoreData(); // Initial data load
  }, []);

  return (
    <BackgroundImageContainer>
      <CSSTransition in={!isOpen} timeout={1500} classNames="fade" unmountOnExit>
        <Box sx={{ position: "absolute" }}>
          <JournalButton handleClick={handleBookClick} />
        </Box>
      </CSSTransition>

      <CSSTransition in={isOpen} timeout={1900} classNames="fade" unmountOnExit>
        <Box sx={{ overflowY: "auto", maxHeight: "95vh", width: "100vw", padding: "20px 0" }}>
          {thoughts.map((thought, index) => (
            <Box key={index}>
              <ThoughtPage thought={thought} setLastVisiblePostId={setLastVisiblePostId} />
            </Box>
          ))}
          {hasMore && (
            <div ref={(el) => setTarget(el)}>
              <HandwritingSpinner />
            </div>
          )}
        </Box>
      </CSSTransition>
    </BackgroundImageContainer>
  );
};

export default LandingPage;
