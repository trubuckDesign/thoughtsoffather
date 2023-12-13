"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Box, Button, Drawer, Grid, IconButton, useMediaQuery, useTheme } from "@mui/material";
import JournalButton from "@/components/buttons/journalButton";
import { CSSTransition } from "react-transition-group";
import "../css/transitions.css";
import BackgroundImageContainer from "@/components/background/background";
import HandwritingSpinner from "@/components/loadingSpinner/writingSpinner";
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

const POSTS_PER_PAGE = 3;

interface TimelineData {
  year: number;
  month: string;
  count: number;
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
  const [isTimelineDataLoaded, setIsTimelineDataLoaded] = useState(false);

  const [hasMore, setHasMore] = useState(true);
  const [lastVisiblePostId, setLastVisiblePostId] = useState<number>(1);
  const [timelineData, setTimelineData] = useState<GroupedData>({});
  const [thoughtSummary, setThoughtSummary] = useState<Thought[]>([]);
  const [currentVisibleDate, setCurrentVisibleDate] = useState<Date | Moment | undefined>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isLargOrMedium = useMediaQuery(theme.breakpoints.down("lg"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const router = useRouter();

  const handleMonthToggle = (monthKey: string) => {
    console.log(monthKey);
    setExpandedMonth(expandedMonth === monthKey ? null : monthKey);
  };

  const toggleAboutDialog = () => {
    setIsAboutOpen(!isAboutOpen);
  };
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

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

  const fetchMoreData = useCallback(
    async (getById?: number) => {
      console.log("thoughtSummary", thoughtSummary, thoughts, getById);
      if (!hasMore || isLoading || !isTimelineDataLoaded) return;
      if (thoughtSummary.length <= 0) return;

      setIsLoading(true);

      try {
        const lastPostId = thoughts.length > 0 ? thoughts[thoughts.length - 1].thoughtId : thoughtSummary[0].thoughtId;
        const response = await fetch(`/api/thoughts?lastPostId=${lastPostId}&postPerPage=${POSTS_PER_PAGE}`);
        const data = await response.json();

        setThoughts((prev) => [...prev, ...data.posts]);
        setHasMore(data.posts.length === POSTS_PER_PAGE);
      } catch (error) {
        console.error("Error loading more posts:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [hasMore, isLoading, isTimelineDataLoaded, thoughts]
  );

  const { setTarget } = useInfiniteScroll({
    isLoading,
    hasMore,
    onLoadMore: fetchMoreData,
  });
  useEffect(() => {
    if (selectedDate) {
      const thoughtForDate = thoughtSummary.find((thought) => new Date(thought.createdAt).toDateString() === selectedDate.toDateString());

      if (thoughtForDate) {
        setLastVisiblePostId(thoughtForDate.thoughtId);
        fetchMoreData(thoughtForDate.thoughtId);
      }
    }
  }, [selectedDate]);

  const navigateToDate = (date: Date) => {
    setThoughts([]);
    setSelectedDate(date);
    console.log("date selected", date);
  };
  useEffect(() => {
    if (isTimelineDataLoaded) {
      const getInitialData = async () => {
        const lastReadPostId = parseInt(localStorage.getItem("lastReadThoughtId") || "0");
        setLastVisiblePostId(lastReadPostId);
        if (lastReadPostId) {
          setShowContinuePrompt(true); // Show prompt if there's a last read post ID
        } else {
          await fetchMoreData(); // Initial data load
        }
      };
      console.log("initialData RAN", thoughtSummary, thoughtSummary.length, thoughtSummary.length > 0);
      if (thoughtSummary.length > 0) {
        console.log("thoughtSummaryLengthIniital", thoughtSummary.length);
        getInitialData();
      }
    }
  }, [isTimelineDataLoaded]);
  useEffect(() => {
    if (thoughtSummary && lastVisiblePostId) {
      const visibleThought = thoughtSummary.find((thought) => thought.thoughtId === lastVisiblePostId);
      if (visibleThought) {
        const visibleDate = new Date(visibleThought.createdAt);
        setCurrentVisibleDate(visibleDate);
      }
    }
  }, [lastVisiblePostId, thoughtSummary]);

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
        console.log("formattedData", formattedData);

        setTimelineData(formattedData);
      } catch (error) {
        console.error("Error fetching timeline data:", error);
      }
    };

    fetchTimelineData();
  }, []);
  const navigateToSignIn = () => {
    router.push("/add"); // Navigates to the sign-in page
  };
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
      <Box id="main-layout-box" sx={{ display: "flex", marginLeft: isLargOrMedium ? 23 : 9 }}>
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
              currentVisibleDate={currentVisibleDate}
              onDateSelect={navigateToDate}
              expandedMonth={expandedMonth}
              onMonthToggle={handleMonthToggle}
            />
          </Drawer>
        )}

        {!isMobile && isOpen && (
          <TimelineBar
            data={timelineData}
            currentVisibleDate={currentVisibleDate}
            onDateSelect={navigateToDate}
            expandedMonth={expandedMonth}
            onMonthToggle={handleMonthToggle}
          />
        )}
        {/* <Box id="content-area" sx={{ flexGrow: 1, paddingLeft: showTimeline ? "160px" : "0px" }}> */}
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
              {isMobile && isOpen && (
                <IconButton
                  id="toggle-timeline-button"
                  sx={{
                    backgroundColor: theme.palette.primary.main, // Theme primary color
                    color: theme.palette.primary.contrastText, // Contrast text color for the primary color
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark, // Darker shade for hover state
                    },
                    marginTop: 2,
                    marginLeft: -8,
                  }}
                  onClick={toggleDrawer}
                  size="large"
                >
                  {isDrawerOpen ? <KeyboardDoubleArrowLeftIcon /> : <KeyboardDoubleArrowRightIcon />}
                </IconButton>
              )}
              <Box id="posts-container" sx={{ overflowY: "auto", maxHeight: "95vh", width: "100vw", padding: "20px 0" }}>
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
                  <div ref={setTarget}>
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
          <AnimatedAboutButton onClick={toggleAboutDialog} />
          <AboutDialog setShowAbout={setIsAboutOpen} showAbout={isAboutOpen} />
        </Box>
      </Box>
    </BackgroundImageContainer>
  );
};

export default LandingPage;
