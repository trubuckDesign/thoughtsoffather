"use client";
import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Grid, IconButton, Paper, Typography, styled, useMediaQuery, useTheme } from "@mui/material";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import GeneralStats from "@/components/analytics/statistics/generalStats";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TimerIcon from "@mui/icons-material/Timer";
import ArticleIcon from "@mui/icons-material/Article";
import UpdateIcon from "@mui/icons-material/Update";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";
import ShortTextIcon from "@mui/icons-material/ShortText";
import CalculateIcon from "@mui/icons-material/Calculate";
import { SentimentTimelineChart } from "@/components/analytics/charts/sentimentChart";
import { EmotionBreakdownBarChart } from "@/components/analytics/charts/emotionalChart";
import { SentimentData } from "@/components/analytics/sentimentDataType";
import moment from "moment";
import { BlobWithUrl } from "../admin/page";
import { ParallaxImages } from "@/components/analytics/backgroundImgs/backgroundImgs";
import { AnalyticsCard } from "@/components/analytics/card/analyticsCard";
import { DevelopmentStats } from "@/components/analytics/statistics/developmentStats";
import CommitChart from "@/components/analytics/charts/commitCharts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import BarChartIcon from "@mui/icons-material/BarChart";
import HomeIcon from "@mui/icons-material/Home";
import commitData from "@/components/analytics/statistics/devGithubInsights.json";
import { useRouter } from "next/navigation";

const generalStats = [
  { label: "# of posts", value: 122, icon: <ArticleIcon /> },
  { label: "Average time between posts", value: "7.10", icon: <UpdateIcon /> },
  { label: "Average number of characters", value: "4,608.60", icon: <TextFieldsIcon /> },
  { label: "Max characters", value: "17,469", icon: <TitleIcon /> },
  { label: "Max Words", value: "3,140", icon: <DescriptionIcon /> },
  { label: "Average Words", value: "832.37", icon: <ShortTextIcon /> },
  { label: "Total Words", value: "98,223", icon: <CalculateIcon /> },
];
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const totalActivity = commitData.reduce((sum, week) => sum + week.total, 0);
const weeklyAverage = totalActivity / commitData.length;
const mostActiveDayIndex = commitData.flatMap((week) => week.days).reduce((maxIndex, currentDay, currentIndex, days) => (currentDay > days[maxIndex] ? currentIndex : maxIndex), 0) % 7;
const weekWithHighestActivity = commitData.reduce((maxWeek, currentWeek) => (currentWeek.total > maxWeek.total ? currentWeek : maxWeek), commitData[0]);

const numberOfCommitDays = commitData.reduce((acc, week) => {
  // Count the number of days with non-zero commits in each week
  const daysWithCommits = week.days.filter((day) => day > 0).length;
  return acc + daysWithCommits;
}, 0);
// Convert UNIX timestamp to a readable date
const formatDate = (timestamp: number) => new Date(timestamp * 1000).toLocaleDateString("en-US");

const developmentStats = [
  { label: "Number of Lines Of Code", value: " 9,621", icon: <ShortTextIcon /> },
  { label: "Development Days", value: `${numberOfCommitDays}`, icon: <TimerIcon /> },
  { label: "Total Activity (Updates)", value: `${totalActivity}`, icon: <BarChartIcon /> },
  { label: "Weekly Average (Updates)", value: weeklyAverage.toFixed(2), icon: <TrendingUpIcon /> },
  { label: "Most Active Day", value: daysOfWeek[mostActiveDayIndex], icon: <CalendarTodayIcon /> },
  { label: "Week With Highest Activity", value: `${formatDate(weekWithHighestActivity.week)}`, icon: <EventBusyIcon /> },
  { label: "Total Time Compiling Posts", value: "9:01:06", icon: <AccessTimeIcon /> },
  { label: "Average Duration to format", value: "0:05:21", icon: <TimerIcon /> },

  // Add more stats as needed
];

function aggregateDataByMonth(data: SentimentData[]): SentimentData[] {
  const grouped = data.reduce((acc, record) => {
    const monthYear = moment(record.createdAt).format("YYYY-MM");
    if (!acc[monthYear]) {
      acc[monthYear] = {
        ...record,
        neg_score: parseFloat(record.neg_score.toString()) || 0,
        neu_score: parseFloat(record.neu_score.toString()) || 0,
        pos_score: parseFloat(record.pos_score.toString()) || 0,
        compound_score: parseFloat(record.compound_score.toString()) || 0,
        count: 1,
        positive: record.positive,
        negative: record.negative,
        anger: record.anger,
        anticipation: record.anticipation,
        disgust: record.disgust,
        fear: record.fear,
        joy: record.joy,
        sadness: record.sadness,
        surprise: record.surprise,
        trust: record.trust,
      };
    } else {
      acc[monthYear].neg_score += parseFloat(record.neg_score.toString()) || 0;
      acc[monthYear].neu_score += parseFloat(record.neu_score.toString()) || 0;
      acc[monthYear].pos_score += parseFloat(record.pos_score.toString()) || 0;
      acc[monthYear].compound_score += parseFloat(record.compound_score.toString()) || 0;
      acc[monthYear].count += 1;
      acc[monthYear].positive += record.positive;
      acc[monthYear].negative += record.negative;
      acc[monthYear].anger += record.anger;
      acc[monthYear].anticipation += record.anticipation;
      acc[monthYear].disgust += record.disgust;
      acc[monthYear].fear += record.fear;
      acc[monthYear].joy += record.joy;
      acc[monthYear].sadness += record.sadness;
      acc[monthYear].surprise += record.surprise;
      acc[monthYear].trust += record.trust;
    }
    return acc;
  }, {} as Record<string, SentimentData & { count: number }>);

  const aggregatedData = Object.values(grouped).map(({ count, ...item }) => {
    item.neg_score = Math.round((item.neg_score / count) * 100) / 100;
    item.neu_score = Math.round((item.neu_score / count) * 100) / 100;
    item.pos_score = Math.round((item.pos_score / count) * 100) / 100;
    item.compound_score = Math.round((item.compound_score / count) * 100) / 100;
    item.positive = Math.round((item.positive / count) * 100) / 100;
    item.negative = Math.round((item.negative / count) * 100) / 100;
    item.anger = Math.round((item.anger / count) * 100) / 100;
    item.anticipation = Math.round((item.anticipation / count) * 100) / 100;
    item.disgust = Math.round((item.disgust / count) * 100) / 100;
    item.fear = Math.round((item.fear / count) * 100) / 100;
    item.joy = Math.round((item.joy / count) * 100) / 100;
    item.sadness = Math.round((item.sadness / count) * 100) / 100;
    item.surprise = Math.round((item.surprise / count) * 100) / 100;
    item.trust = Math.round((item.trust / count) * 100) / 100;
    item.postCount = count;
    return item as SentimentData;
  });

  // Sort the aggregated data by createdAt in ascending order
  aggregatedData.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  console.log("aggData:", aggregatedData);
  return aggregatedData;
}

const StatisticsPage: React.FC = () => {
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [aggSentimentData, setAggSentimentData] = useState<SentimentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImgLoading, setIsImgLoading] = useState(true);
  const [blobs, setBlobs] = useState<BlobWithUrl[]>([]);
  const router = useRouter();
  const numImagesToPull = 6;
  const numImagesPerLayer = 1;
  const layers = Math.ceil(blobs.length / numImagesPerLayer);
  const overlapAmount = 0; // The amount by which each layer will overlap the previous one
  const gridMedCols = 8;
  const gridSmallCols = 12;
  const isMobile = useMediaQuery("(max-width: 600px)"); // Adjust the breakpoint as needed
  const [numPages, setNumPages] = useState(3);
  const theme = useTheme();

  useEffect(() => {
    // Update the number of pages based on screen size
    if (isMobile) {
      setNumPages(9); // Adjust the number of pages for smaller screens
    } else {
      setNumPages(3); // Default number of pages for larger screens
    }
  }, [isMobile]);
  useEffect(() => {
    const fetchBlobs = async () => {
      setIsImgLoading(true);
      try {
        const response = await fetch("/api/blobs");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: BlobWithUrl[] = await response.json();

        // Filter blobs to include only those with size less than 80KB
        const filteredData = data.filter((blob) => blob.size < 80000 && blob.size > 25000); // 80KB in bytes
        const topBlobs = filteredData.slice(0, numImagesToPull); // Replace 'x' with the number of items you want
        setBlobs(topBlobs);
        setIsImgLoading(false);
      } catch (error) {
        setIsImgLoading(false);
        console.error("Error fetching blobs:", error);
      }
    };

    fetchBlobs();
  }, []);

  useEffect(() => {
    // Define the URL for your API endpoint with the required query parameters
    const apiUrl = "/api/analytics?requestType=sentiment";
    setIsLoading(true);
    // Make a GET request to the API endpoint
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const aggregatedData = aggregateDataByMonth(data.data);

        setAggSentimentData(aggregatedData);
        setSentimentData(data.data);
      })
      .catch((error) => {
        console.error("Error fetching sentiment data:", error);
      });
    setIsLoading(false);
  }, []);

  const onClick = () => {
    router.push("/");
  };

  return isLoading === true || isImgLoading === true ? (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <CircularProgress />
    </Box>
  ) : (
    <>
      <Parallax id="ParallaxMain" pages={numPages}>
        <IconButton color="primary" onClick={onClick} sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, margin: 2 }}>
          <HomeIcon />
        </IconButton>
        <Grid container justifyContent="flex-end">
          {[...Array(layers)].map((_, layerIndex) => (
            <ParallaxImages
              key={layerIndex}
              imageUrls={blobs.slice(layerIndex * numImagesPerLayer, (layerIndex + 1) * numImagesPerLayer).map((blob) => blob.url)}
              layerOffset={layerIndex * overlapAmount}
              layerFactor={1}
            />
          ))}
        </Grid>
        <ParallaxLayer id="parallaxContent" offset={0} speed={0.85} factor={0.1}>
          <Grid id="contentGrid" container spacing={2} style={{ padding: 20, height: "100%" }}>
            <Grid item xs={gridSmallCols} md={gridMedCols}>
              <Paper sx={{ padding: 2, backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
                <Typography variant="h1" sx={{ textAlign: "center", fontWeight: "bold" }} gutterBottom>
                  Analytics
                </Typography>
                <Typography>
                  My father has always loved statistics and data. For as long as I can remember, he was fascinated by measuring time intervals between points A and B, tracking his spending, and
                  exploring various interesting facts about the world. I am thankful to have inherited this fascination with data, always seeking patterns and intriguing insights. As I was completing
                  this site, I realized that I could uncover some fascinating facts about all of his posts. This realization led me to delve into the data more deeply.
                </Typography>
                <Typography variant="h5" sx={{ textAlign: "center", marginTop: 3 }} gutterBottom>
                  Development Journey
                </Typography>
                <Typography>
                  For the past 15 years, I&apos;ve been developing websites, and as of 2023, I&apos;ve had quite a journey. Admittedly, I&apos;m not the most efficient coder out there, but I can
                  quickly put together uncomplicated websites. This project, however, was different. With the advent of ChatGPT in 2022, I was curious to see how it could aid my development process.
                  My education didn&apos;t formally cover web design or computer engineering; instead, I learned by studying other people&apos;s code and adapting various examples to my needs. Over
                  time, I&apos;ve honed my skills in writing efficient, clean, and maintainable code, often creating reusable snippets to save time.
                </Typography>
                <Typography sx={{ marginTop: 1 }}>
                  While some fear that tools like ChatGPT might replace software engineers, I believe they will rather transform our work methods. ChatGPT was invaluable in this project, helping me
                  complete it in just 17 days - a task that would have likely taken thrice as long without it. This efficiency was crucial, as I had set a deadline to present this site as a Christmas
                  gift. Starting on November 27th, the clock was ticking. ChatGPT proved to be a game-changer, not just in software development but across various creative and technical industries.
                </Typography>
                <Typography variant="h5" sx={{ textAlign: "center", marginTop: 1 }} gutterBottom>
                  Content Journey
                </Typography>
                <Typography>
                  After completing the coding, I shifted focus to content curation. Most of my time was spent sifting through his numerous Facebook posts to find relevant ones. Roughly, one out of
                  every ten posts made it to this site. The challenge was in formatting these posts and aligning them with the corresponding pictures, as Facebook stores images separately from text.
                  My task was to match each picture with its context and ensure it fit seamlessly into the narrative of each post.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={gridSmallCols} md={gridMedCols}>
              <AnalyticsCard>
                <DevelopmentStats stats={developmentStats} />
              </AnalyticsCard>
            </Grid>
            <Grid item xs={0} md={gridMedCols}></Grid>
            <Grid item xs={gridSmallCols} md={gridMedCols}>
              <AnalyticsCard>
                <CommitChart />
              </AnalyticsCard>
            </Grid>
            <Grid item xs={0} md={gridMedCols}></Grid>
            <Grid item xs={gridSmallCols} md={gridMedCols}>
              <Paper sx={{ padding: 2, backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
                <Typography variant="h5" sx={{ textAlign: "center" }} gutterBottom>
                  My Dad&apos;s Stats
                </Typography>
                <Typography>
                  I went through and put together some general stats on his posts that I found interesting, and I think the one that stands out the most to me is that on average his posts are 832
                  words long, but the longest post has over 3,000 words! That would be 7 pages single spaced and would have taken me two weeks to write in highschool/college.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={gridSmallCols} md={gridMedCols}>
              <AnalyticsCard>
                <GeneralStats stats={generalStats} />
              </AnalyticsCard>
            </Grid>
            <Grid item xs={0} md={gridMedCols}></Grid>
            <Grid item xs={gridSmallCols} md={gridMedCols}>
              <Paper sx={{ padding: 2, backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
                <Typography variant="h5" sx={{ textAlign: "center" }} gutterBottom>
                  Emotions
                </Typography>
                <Typography>
                  Part of what I wanted to do with this project as well was learn a few new technologies, so I turned to Machine Learning (ML) and Natural Language Processing (NLP) to see what kind of
                  interesting info I might find. I was hoping I would find some interesting patterns or some correlations to events, but unfortunately there weren&apos;t any patterns I could see in
                  the data. However, it is still interesting to see what information can be extracted from a relatively small amount of text.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={gridSmallCols} md={gridMedCols}>
              <AnalyticsCard>
                <EmotionBreakdownBarChart data={aggSentimentData} />
              </AnalyticsCard>
            </Grid>
            <Grid item xs={0} md={gridMedCols}></Grid>
            <Grid item xs={gridSmallCols} md={gridMedCols}>
              <Paper sx={{ padding: 2, backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
                <Typography variant="h5" sx={{ textAlign: "center" }} gutterBottom>
                  Sentiment
                </Typography>
                <Typography>
                  As with the emotions from the posts, I couldn&apos;t really find too many insights from the sentiments in the posts, but it&apos;s kinda interesting to read through the posts and see
                  how the NLP was able to come up with some of the sentiment values (positive, negative, neutral)
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={gridSmallCols} md={gridMedCols}>
              <AnalyticsCard>
                <SentimentTimelineChart data={aggSentimentData} />
              </AnalyticsCard>
            </Grid>
          </Grid>
        </ParallaxLayer>
      </Parallax>
    </>
  );
};

export default StatisticsPage;
