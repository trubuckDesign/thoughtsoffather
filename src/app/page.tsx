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
import ContinueReadingDialog from "@/components/dialogs/lastPostDialog";

const POSTS_PER_PAGE = 5;
const PRIOR_POST_COUNT = 3;

const LandingPage = () => {
  const [isOpen, setOpen] = useState(false);
  const [thoughts, setThoughts] = useState<Thoughts[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showContinuePrompt, setShowContinuePrompt] = useState(false);

  const [hasMore, setHasMore] = useState(true);
  const [lastVisiblePostId, setLastVisiblePostId] = useState<number>(1);

  const continueFromLastRead = async () => {
    setShowContinuePrompt(false);
    const lastReadPostId = parseInt(localStorage.getItem("lastReadThoughtId") || "0");
    setLastVisiblePostId(lastReadPostId);
    // Modify your fetching logic to start from lastReadPostId
    // You may need to adjust your API or fetching logic to accommodate this
    fetchMoreData(lastReadPostId);
  };
  const startFromBeginning = () => {
    setShowContinuePrompt(false);
    localStorage.removeItem("lastReadThoughtId");
    setLastVisiblePostId(1);
    fetchMoreData();
  };

  useEffect(() => {
    const lastReadPostId = parseInt(localStorage.getItem("lastReadThoughtId") || "0");
    setLastVisiblePostId(lastReadPostId);
    if (lastReadPostId) {
      setShowContinuePrompt(true); // Show prompt if there's a last read post ID
    } else {
      fetchMoreData(); // Initial data load
    }
  }, []);

  const handleBookClick = () => {
    setOpen(!isOpen);
  };

  const fetchMoreData = async (lastReadPostId?: number) => {
    if (!hasMore) return;
    setIsLoading(true); // Set isLoading to true at the beginning of data fetch
    let lastPostId = 0;
    // Using the ID of the last post to determine the start of the next fetch
    if (lastReadPostId) {
      lastPostId = lastVisiblePostId;
    } else {
      lastPostId = thoughts.length > 0 ? thoughts[thoughts.length - 1].thoughtId : 0;
    }

    try {
      console.log("loading posts startId:", lastPostId, lastReadPostId, lastVisiblePostId);
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
      <ContinueReadingDialog
        continueFromLastRead={continueFromLastRead}
        setShowContinuePrompt={setShowContinuePrompt}
        showContinuePrompt={showContinuePrompt}
        startFromBeginning={startFromBeginning}
      />
    </BackgroundImageContainer>
  );
};

export default LandingPage;
