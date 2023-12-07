"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Box, Button, Grid } from "@mui/material";
import JournalButton from "@/components/buttons/journalButton";
import { CSSTransition } from "react-transition-group";
import "../css/transitions.css";
import BackgroundImageContainer from "@/components/background/background";
import HandwritingSpinner from "@/components/loadingSpinner/writingSpinner";
import ThoughtPage from "@/components/thoughtPage/thoughtPage";
import { Thoughts } from "@prisma/client";
import { useInfiniteScroll } from "@/components/infiniteScroll/infiniteScroll";
import ContinueReadingDialog from "@/components/dialogs/lastPostDialog";
import axios from "axios";
import TimelineBar from "@/components/timeline/timeline";

const POSTS_PER_PAGE = 5;
const PRIOR_POST_COUNT = 3;

interface TimelineData {
  year: number;
  month: string;
  count: number;
}

const LandingPage = () => {
  const [isOpen, setOpen] = useState(false);
  const [thoughts, setThoughts] = useState<Thoughts[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showContinuePrompt, setShowContinuePrompt] = useState(false);
  const [showStartFromBeginningButton, setShowStartFromBeginningButton] = useState(false);

  const [hasMore, setHasMore] = useState(true);
  const [lastVisiblePostId, setLastVisiblePostId] = useState<number>(1);
  const [timelineData, setTimelineData] = useState<TimelineData[]>([]);

  const continueFromLastRead = async () => {
    setShowContinuePrompt(false);
    const lastReadPostId = parseInt(localStorage.getItem("lastReadThoughtId") || "0");
    setLastVisiblePostId(lastReadPostId);
    setShowStartFromBeginningButton(true); // Show the button when continuing

    fetchMoreData(lastReadPostId);
  };
  const startFromBeginning = () => {
    setShowContinuePrompt(false);
    localStorage.removeItem("lastReadThoughtId");
    setLastVisiblePostId(1);
    setShowStartFromBeginningButton(false);
    fetchMoreData(1);
  };
  const resetAndFetchFromStart = async () => {
    setShowStartFromBeginningButton(false);
    setThoughts([]); // Clear current posts
    setHasMore(true); // Reset hasMore state
    setLastVisiblePostId(1); // Reset last visible post ID
    await fetchMoreData(1); // Fetch from the first post
  };

  const handleBookClick = () => {
    setOpen(!isOpen);
  };

  const fetchMoreData = async (startId?: number) => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);

    // Use startId if provided, otherwise calculate based on the current posts
    let fetchStartId = startId ?? (thoughts.length > 0 ? thoughts[thoughts.length - 1].thoughtId + 1 : 0);

    try {
      const response = await fetch(`/api/thoughts?startId=${fetchStartId}&thoughtCount=${POSTS_PER_PAGE}`);
      const data = await response.json();

      // If starting fresh, replace thoughts, otherwise append
      const newThoughts = startId === 1 ? data.posts : [...thoughts, ...data.posts];
      setThoughts(newThoughts);
      setHasMore(data.posts.length === POSTS_PER_PAGE);
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const { setTarget } = useInfiniteScroll({
    isLoading,
    hasMore,
    onLoadMore: fetchMoreData,
  });

  useEffect(() => {
    const lastReadPostId = parseInt(localStorage.getItem("lastReadThoughtId") || "0");
    setLastVisiblePostId(lastReadPostId);
    if (lastReadPostId) {
      setShowContinuePrompt(true); // Show prompt if there's a last read post ID
    } else {
      fetchMoreData(); // Initial data load
    }
  }, []);

  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        const response = await fetch("/api/thoughts/timeline");
        const data = await response.json();

        // Log the data to check its structure
        console.log(data.formattedData);

        if (Array.isArray(data.formattedData)) {
          setTimelineData(data.formattedData);
        } else {
          // Handle the case where data is not an array
          console.error("Timeline data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching timeline data:", error);
      }
    };

    fetchTimelineData();
  }, []);

  return (
    <BackgroundImageContainer>
      <TimelineBar data={timelineData} />
      <CSSTransition in={!isOpen} timeout={1500} classNames="fade" unmountOnExit>
        <Box sx={{ position: "absolute" }}>
          <JournalButton handleClick={handleBookClick} />
        </Box>
      </CSSTransition>

      <CSSTransition in={isOpen} timeout={1900} classNames="fade" unmountOnExit>
        <>
          <Box sx={{ overflowY: "auto", maxHeight: "95vh", width: "100vw", padding: "20px 0" }}>
            {showStartFromBeginningButton && (
              <Box sx={{ position: "relative", marginLeft: "auto", display: "flex", justifyContent: "center" }}>
                <Button variant="contained" onClick={resetAndFetchFromStart}>
                  Start from Beginning
                </Button>
              </Box>
            )}
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
        </>
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
