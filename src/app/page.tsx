"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Box, Button, Drawer, Grid, IconButton, useMediaQuery, useTheme } from "@mui/material";
import JournalButton from "@/components/buttons/journalButton";
import { CSSTransition } from "react-transition-group";
import "../css/transitions.css";
import BackgroundImageContainer from "@/components/background/background";
import { LoadingOverlay } from "@/components/loadingSpinner/writingSpinner";
import ThoughtPage from "@/components/thoughtPage/thoughtPage";
import { Thoughts } from "@prisma/client";
import { useInfiniteScroll } from "@/components/infiniteScroll/infiniteScroll";
import ContinueReadingDialog from "@/components/dialogs/lastPostDialog";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import TimelineBar from "@/components/timeline/timeline";
import { Moment } from "moment";
import AboutDialog from "@/components/dialogs/aboutDialog";
import AnimatedAboutButton from "@/components/buttons/floatAboutButton";
import { useRouter } from "next/navigation";
import moment from "moment";
import { AnimatedAnalyticsButton } from "@/components/buttons/floatAnalyticsButton";

const POSTS_PER_PAGE = 3;
interface batchDateRange {
  startDate: Date;
  endDate: Date;
}
function getBatchOfPosts(thoughts: Thought[], batchSize: number, isInitialLoad: boolean, lastEndDate?: Date): batchDateRange {
  // Sort the thoughts by createdAt in descending order
  const sortedThoughts = [...thoughts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  let startIndex: number;

  if (lastEndDate) {
    if (isInitialLoad) {
      // For the initial load, include the post that matches the lastEndDate
      startIndex = sortedThoughts.findIndex((thought) => new Date(thought.createdAt).getTime() <= new Date(lastEndDate).getTime());
    } else {
      // For subsequent loads, start after the lastEndDate
      startIndex = sortedThoughts.findIndex((thought) => new Date(thought.createdAt).getTime() < new Date(lastEndDate).getTime());
    }
    // Adjust the start index if it's not the first element and a matching element is found
    if (startIndex > 0) {
      startIndex + 1;
    } else if (startIndex === -1) {
      // If no match is found, start from the beginning of the sorted array
      startIndex = 0;
    }
  } else {
    // If no lastEndDate is provided, start from the beginning
    startIndex = 0;
  }

  // Slice the array to get the batch
  const batch = sortedThoughts.slice(startIndex, startIndex + batchSize);
  if (batch.length === 0) {
    // Handle case where there are no posts in the batch
    return { startDate: new Date(), endDate: new Date() };
  }

  // Determine startDate and endDate
  const startDate = new Date(batch[0].createdAt);
  const endDate = new Date(batch[batch.length - 1].createdAt);

  return { startDate, endDate };
}

export interface Thought {
  thoughtId: number;
  createdAt: string;
  title: string;
}

interface DayThought {
  day: number;
  thought: Thought;
}

export interface GroupedThoughts {
  year: number;
  month: string;
  days: DayThought[];
}

export interface GroupedData {
  [key: string]: GroupedThoughts;
}

const LandingPage = () => {
  const [isOpen, setOpen] = useState(false);
  const [thoughts, setThoughts] = useState<Thoughts[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showContinuePrompt, setShowContinuePrompt] = useState(false);
  const [showStartFromBeginningButton, setShowStartFromBeginningButton] = useState(false);
  const [skipStartingPost, setSkipStartingPost] = useState(true);

  const [hasMore, setHasMore] = useState(true);
  const [lastVisibleCreatedDate, setLastVisibleCreatedDate] = useState<Date | null>(null);
  const [timelineData, setTimelineData] = useState<GroupedData>({});
  const [thoughtSummary, setThoughtSummary] = useState<Thought[]>([]);
  const [isTimelineDataLoaded, setIsTimelineDataLoaded] = useState(false);

  const [currentVisibleDate, setCurrentVisibleDate] = useState<Date | Moment | undefined>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isLargOrMedium = useMediaQuery(theme.breakpoints.between("sm", "lg"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const router = useRouter();
  const startDate = new Date();
  const isPostListEmpty = thoughts.length === 0;

  const handleMonthToggle = (monthKey: string) => {
    setExpandedMonth(expandedMonth === monthKey ? null : monthKey);
  };

  const toggleAboutDialog = () => {
    setIsAboutOpen(!isAboutOpen);
  };
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleBookClick = () => {
    setOpen(!isOpen);
  };

  const openAnalytics = () => {
    router.push("/analytics");
  };

  const navigateToSignIn = () => {
    router.push("/add"); // Navigates to the sign-in page
  };
  const getLastPostDate = () => {
    if (thoughts.length === 0) return "";

    // Assuming 'thoughts' is an array of your post objects and they have a 'createdAt' property
    return thoughts[thoughts.length - 1].createdAt;
  };
  const navigateToDate = (date: Date) => {
    setThoughts([]);
    setSkipStartingPost(true); // this ensures that the getBatchofPosts will not start on the wrong index of posts.
    setShowStartFromBeginningButton(true);
    setSelectedDate(date);
  };
  const continueFromLastRead = async () => {
    setShowContinuePrompt(false);
    const lastReadPostDateStr: string = localStorage.getItem("lastReadDate") || "";
    const lastReadPostDate: Date = lastReadPostDateStr === "" ? startDate : new Date(lastReadPostDateStr);
    setLastVisibleCreatedDate(lastReadPostDate);
    setShowStartFromBeginningButton(true); // Show the button when continuing

    fetchMoreData(lastReadPostDate);
  };
  const startFromBeginning = async () => {
    setShowContinuePrompt(false);
    localStorage.removeItem("lastReadDate");
    setHasMore(true); // Reset hasMore state
    setThoughts([]); // Clear current posts
    const resetDate: Date = startDate;
    setLastVisibleCreatedDate(resetDate);
    setShowStartFromBeginningButton(false);
    await fetchMoreData(resetDate);
  };
  const resetAndFetchFromStart = async () => {
    setShowStartFromBeginningButton(false);
    setThoughts([]); // Clear current posts
    setHasMore(true); // Reset hasMore state
    const resetDate: Date = startDate;
    setLastVisibleCreatedDate(resetDate);
    await fetchMoreData(resetDate); // Fetch from the first post
  };

  const fetchMoreData = async (lastReadPostDate?: Date) => {
    if (!hasMore || isLoading || !isTimelineDataLoaded) return;

    setIsLoading(true);
    let fetchStartDate: Date;
    // Use lastVisibleCreatedDate if available
    if (lastReadPostDate) {
      fetchStartDate = lastReadPostDate;
    } else {
      fetchStartDate = lastVisibleCreatedDate ?? startDate;
    }
    try {
      const batchDates: batchDateRange = getBatchOfPosts(thoughtSummary, POSTS_PER_PAGE, skipStartingPost, fetchStartDate);
      setSkipStartingPost(false); // this ensures that the getBatchofPosts will not start on the wrong index of posts.

      const urlSafeStartDate = encodeURIComponent(batchDates.startDate.toISOString());
      const urlSafeEndDate = encodeURIComponent(batchDates.endDate.toISOString());
      const response = await fetch(`/api/thoughts?startDate=${urlSafeStartDate}&endDate=${urlSafeEndDate}&postPerPage=${POSTS_PER_PAGE}`);
      const data = await response.json();
      const newThoughts = data.posts;
      setThoughts((prev) => [...prev, ...newThoughts]);
      setHasMore(data.posts.length === POSTS_PER_PAGE);
      setLastVisibleCreatedDate(newThoughts.length > 0 ? new Date(newThoughts[newThoughts.length - 1].createdAt) : startDate);
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const { setTarget, target } = useInfiniteScroll({
    isLoading,
    hasMore,
    onLoadMore: fetchMoreData,
    getLastPostDate: getLastPostDate,
    threshold: [0, 0.25, 0.5, 0.75, 1], // Your desired threshold values
  });
  useEffect(() => {
    if (selectedDate) {
      const thoughtForDate = thoughtSummary.find((thought) => new Date(thought.createdAt).toDateString() === selectedDate.toDateString());

      if (thoughtForDate) {
        const tempDate: Date = new Date(thoughtForDate.createdAt);
        setLastVisibleCreatedDate(tempDate);
        fetchMoreData(tempDate);
      }
    }
  }, [selectedDate]);

  useEffect(() => {
    if (isTimelineDataLoaded) {
      if (thoughtSummary.length > 0) {
        const getInitialLoad = async () => {
          const lastReadPostDateStr: string = localStorage.getItem("lastReadDate") || "";
          let lastReadPostDate: Date;
          let isLocalStorageUsed: boolean = false;
          if (lastReadPostDateStr !== "") {
            isLocalStorageUsed = true;
            lastReadPostDate = new Date(lastReadPostDateStr);
            setLastVisibleCreatedDate(lastReadPostDate);
          } else {
            lastReadPostDate = new Date(thoughtSummary[0].createdAt);
          }

          if (isLocalStorageUsed) {
            setShowContinuePrompt(true); // Show prompt if there's a last read post ID
          } else {
            await fetchMoreData(lastReadPostDate); // Initial data load
          }
        };
        getInitialLoad();
      }
    }
  }, [isTimelineDataLoaded]);
  useEffect(() => {
    if (thoughtSummary && lastVisibleCreatedDate) {
      console.log("insidePage:", lastVisibleCreatedDate, currentVisibleDate);
      const visibleThought = thoughtSummary.find((thought) => new Date(thought.createdAt) === lastVisibleCreatedDate);
      if (visibleThought) {
        const visibleDate = new Date(visibleThought.createdAt);
        setCurrentVisibleDate(visibleDate);
      }
    }
  }, [lastVisibleCreatedDate, thoughtSummary]);

  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        const response = await fetch("/api/thoughts/timeline");
        const { thoughtSummary }: { thoughtSummary: Thought[] } = await response.json();

        setThoughtSummary(thoughtSummary);
        setIsTimelineDataLoaded(true); // Set to true when data is loaded

        // Log the data to check its structure
        const groupThoughtsByDate = (thoughts: Thought[]): GroupedData => {
          return thoughts.reduce<GroupedData>((acc, thought) => {
            const createdAt = new Date(thought.createdAt);
            const year = createdAt.getFullYear();
            const month = createdAt.toLocaleString("default", { month: "long" });
            const day = createdAt.getDate();
            const key = `${year}-${month}`;

            if (!acc[key]) {
              acc[key] = { year, month, days: [{ day, thought }] };
            } else {
              // Check if the day already exists in the array
              if (!acc[key].days.some((d) => d.day === day)) {
                acc[key].days.push({ day, thought });
              }
            }

            return acc;
          }, {});
        };

        const formattedData = groupThoughtsByDate(thoughtSummary);

        setTimelineData(formattedData);
      } catch (error) {
        console.error("Error fetching timeline data:", error);
      }
    };

    fetchTimelineData();
  }, []);

  return (
    <BackgroundImageContainer>
      <Box
        sx={{
          position: "fixed",
          top: -10, // Adjusts the distance from the top
          right: -10, // Adjusts the distance from the right
          zIndex: 1500, // Ensures the button is above everything else
        }}
      >
        <Button variant="text" sx={{ color: "white" }} onClick={navigateToSignIn}>
          π
        </Button>
      </Box>
      <Box id="main-layout-box" sx={{ display: "flex", marginLeft: isMobile ? 0 : isLargOrMedium ? 23 : 9 }}>
        {isMobile && (
          <Drawer
            id="timeline-drawer"
            anchor="left"
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            sx={{
              width: "200px",
              "& .MuiDrawer-paper": {
                id: "drawer-paper",
                width: "200px",
                zIndex: 1300,
              },
            }}
          >
            <TimelineBar
              data={timelineData}
              currentVisibleDate={lastVisibleCreatedDate ?? currentVisibleDate}
              onDateSelect={navigateToDate}
              expandedMonth={expandedMonth}
              onMonthToggle={handleMonthToggle}
            />
          </Drawer>
        )}

        {!isMobile && isOpen && (
          <TimelineBar
            data={timelineData}
            currentVisibleDate={lastVisibleCreatedDate ?? currentVisibleDate}
            onDateSelect={navigateToDate}
            expandedMonth={expandedMonth}
            onMonthToggle={handleMonthToggle}
          />
        )}
        <Box
          id="content-area"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 1,
            width: "100%", // Take full width
          }}
        >
          <CSSTransition in={!isOpen} timeout={1500} classNames="fade" unmountOnExit>
            <Box id="journal-button-box" sx={{ marginTop: "25vh" }}>
              <JournalButton handleClick={handleBookClick} />
            </Box>
          </CSSTransition>
          <CSSTransition in={isOpen} timeout={1900} classNames="fade" unmountOnExit>
            <>
              {isLoading && <LoadingOverlay />}

              <Box id="posts-container" sx={{ overflowY: "auto", maxHeight: "95vh", width: "100vw", padding: "20px 0" }}>
                {showStartFromBeginningButton && (
                  <Box sx={{ position: "relative", marginLeft: "auto", display: "flex", justifyContent: "center" }}>
                    <Button variant="contained" onClick={resetAndFetchFromStart}>
                      Start from Beginning
                    </Button>
                  </Box>
                )}
                {isMobile && isOpen && (
                  <IconButton
                    id="toggle-timeline-button"
                    sx={{
                      backgroundColor: theme.palette.primary.main, // Theme primary color
                      color: theme.palette.primary.contrastText, // Contrast text color for the primary color
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark, // Darker shade for hover state
                      },
                      marginTop: 0,
                      marginLeft: 1,
                    }}
                    onClick={toggleDrawer}
                    size="large"
                  >
                    {isDrawerOpen ? <KeyboardDoubleArrowLeftIcon /> : <KeyboardDoubleArrowRightIcon />}
                  </IconButton>
                )}
                {thoughts.map((thought, index) => (
                  <Box key={index}>
                    <ThoughtPage thought={thought} setLastVisibleCreatedDate={setLastVisibleCreatedDate} />
                  </Box>
                ))}
                {hasMore && <div ref={(el) => setTarget(el)}></div>}
              </Box>
            </>
          </CSSTransition>
          <ContinueReadingDialog
            continueFromLastRead={continueFromLastRead}
            setShowContinuePrompt={setShowContinuePrompt}
            showContinuePrompt={showContinuePrompt}
            startFromBeginning={startFromBeginning}
          />
          <AnimatedAnalyticsButton onClick={openAnalytics} />
          <AnimatedAboutButton onClick={toggleAboutDialog} />
          <AboutDialog setShowAbout={setIsAboutOpen} showAbout={isAboutOpen} />
        </Box>
      </Box>
    </BackgroundImageContainer>
  );
};

export default LandingPage;
