"use client";
import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
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
import { SentimentDistributionPieChart } from "@/components/analytics/charts/sentimentDistribution";
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
import commitData from "@/components/analytics/statistics/devGithubInsights.json";

const generalStats = [
  { label: "# of posts", value: 122, icon: <ArticleIcon /> },
  { label: "Average time between posts", value: "7.10", icon: <UpdateIcon /> },
  { label: "Average number of characters", value: "4608.60", icon: <TextFieldsIcon /> },
  { label: "Max characters", value: 17469, icon: <TitleIcon /> },
  { label: "Max Words", value: 3140, icon: <DescriptionIcon /> },
  { label: "Average Words", value: "832.37", icon: <ShortTextIcon /> },
  { label: "Total Words", value: "98,223", icon: <CalculateIcon /> },
];
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const totalActivity = commitData.reduce((sum, week) => sum + week.total, 0);
const weeklyAverage = totalActivity / commitData.length;
const mostActiveDayIndex =
  commitData
    .flatMap((week) => week.days)
    .reduce((maxIndex, currentDay, currentIndex, days) => (currentDay > days[maxIndex] ? currentIndex : maxIndex), 0) % 7;
const weekWithHighestActivity = commitData.reduce(
  (maxWeek, currentWeek) => (currentWeek.total > maxWeek.total ? currentWeek : maxWeek),
  commitData[0]
);

const numberOfCommitDays = commitData.reduce((acc, week) => {
  // Count the number of days with non-zero commits in each week
  const daysWithCommits = week.days.filter((day) => day > 0).length;
  return acc + daysWithCommits;
}, 0);
// Convert UNIX timestamp to a readable date
const formatDate = (timestamp: number) => new Date(timestamp * 1000).toLocaleDateString("en-US");

const developmentStats = [
  { label: "Total Time Compiling Posts", value: "9:01:06", icon: <AccessTimeIcon /> },
  { label: "Average Duration to format", value: "0:05:21", icon: <TimerIcon /> },
  { label: "Development Days", value: `${numberOfCommitDays}`, icon: <TimerIcon /> },
  { label: "Total Activity (Updates)", value: `${totalActivity}`, icon: <BarChartIcon /> },
  { label: "Weekly Average (Updates)", value: weeklyAverage.toFixed(2), icon: <TrendingUpIcon /> },
  { label: "Most Active Day", value: daysOfWeek[mostActiveDayIndex], icon: <CalendarTodayIcon /> },
  { label: "Week With Highest Activity", value: `${formatDate(weekWithHighestActivity.week)}`, icon: <EventBusyIcon /> },
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
  const numImagesToPull = 12;
  const numImagesPerLayer = 3;
  const layers = Math.ceil(blobs.length / numImagesPerLayer);
  const overlapAmount = 0.5; // The amount by which each layer will overlap the previous one
  const gridMedCols = 8;
  const gridSmallCols = 12;
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

  return isLoading === true || isImgLoading === true ? (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <CircularProgress />
    </Box>
  ) : (
    <Parallax id="ParallaxMain" pages={3}>
      <Grid container justifyContent="flex-end">
        {[...Array(layers)].map((_, layerIndex) => (
          <ParallaxImages
            key={layerIndex}
            imageUrls={blobs.slice(layerIndex * numImagesPerLayer, (layerIndex + 1) * numImagesPerLayer).map((blob) => blob.url)}
            layerOffset={layerIndex - layerIndex * overlapAmount}
            layerFactor={1}
          />
        ))}
      </Grid>
      <ParallaxLayer id="parallaxContent" offset={0} speed={0.85} factor={0.1}>
        <Grid id="contentGrid" container spacing={2} style={{ padding: 20, height: "100%" }}>
          <Grid item xs={gridSmallCols} md={gridMedCols}>
            <Typography variant="h1" sx={{ textAlign: "center", fontWeight: "bold" }} gutterBottom>
              Analytics
            </Typography>
            <Typography>
              My father loves statistics, he loves data. As long as I could remember, my dad would love to see how long it would take to get from
              point A to point B. He would track his spending, his walking distances, and find interesting facts about the world as a whole. I
              thankfully inherited this fascination with data and finding patterns or interesting facts. As I finished this site, I realized I could
              probably find some interesting facts about all of his posts, and so I started digging into what I could find.
            </Typography>
            <Typography variant="h5" sx={{ textAlign: "center", marginTop: 3 }} gutterBottom>
              Development Journey
            </Typography>
            <Typography>
              I started with some statistics of the development process and the process of compiling all of the posts that he made over time. I have
              been developing websites for the past 15 years (as of 2023), and though I haven't been as efficient in coding (and I'm not the best
              developer out there) I typically could create websites, that weren't too complicated, fairly quickly. This time around I wanted to try
              something different, as of 2022, ChatGPT became a thing. I wanted to see how quickly I could put it together with the help of ChatGPT.
              As I did not go to school for web design or any sort of computer engineering, I usually would learn through other people's code or
              viewing examples from the various sources and taylor it to my needs. I learned over time how to write more efficient, clean, and
              maintainable code but I still found to save time, writing snippets that I can reuse later. There are some that are worried that ChatGPT
              will replace their jobs as software engineers, but I can tell you that in it's current state, it is at least a few years off. Even then,
              I don't think it will replace us, it will only change how we do our work. Still though, it is a very helpful tool. It took me based on
              my update history, 17 days to complete, and I honestly think it would have taken me at a minimum 3 times that to do it without ChatGPT.
              It was good that I had it because I had a deadline to meet. I wanted to give this site as a Christmas gift and I started it on Nov 27th,
              so time was ticking. I believe I probably could have gotten some of it done but I for sure could not have gotten the entire thing done
              and been able to build out the analyitics page. I think ChatGPT is a gamechanger for software development along with every other
              industry that has to do with creative arts, software, and many others.
            </Typography>
            <Typography variant="h5" sx={{ textAlign: "center", marginTop: 1 }} gutterBottom>
              Content Journey
            </Typography>
            <Typography>
              Once I had finished the coding of the site, I needed to focus on finding the content for the site. I found that most of the time spent
              was just going through his [numerous] posts on Facebook to find the ones I was looking for. The frequency of posting for this site is
              about 1 for every 10 other posts he made, and so I think that took the most time. Then it was going through and formatting the posts,
              and the way Facebook handles pictures in posts is that it keeps them separate. So another part of the time was spent finding where each
              picture should go within each post, to find the context behind the pictures and make sure it matched up with the section I placed it in.
            </Typography>
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
            <Typography variant="h5" sx={{ textAlign: "center" }} gutterBottom>
              Overview of Statistics
            </Typography>
            <Typography>
              The statistics provide insights into the application's usage patterns and development progress. They reflect the dedication and hard
              work that went into the project, showcasing periods of intense productivity and creative problem-solving. The metrics have been
              carefully curated to present a transparent view of both the triumphs and challenges faced during the development lifecycle.
            </Typography>
          </Grid>
          <Grid item xs={gridSmallCols} md={gridMedCols}>
            <AnalyticsCard>
              <GeneralStats stats={generalStats} />
            </AnalyticsCard>
          </Grid>
          <Grid item xs={0} md={gridMedCols}></Grid>
          <Grid item xs={gridSmallCols} md={gridMedCols}>
            <AnalyticsCard>
              <EmotionBreakdownBarChart data={aggSentimentData} />
            </AnalyticsCard>
          </Grid>
          <Grid item xs={0} md={gridMedCols}></Grid>
          <Grid item xs={gridSmallCols} md={gridMedCols}>
            <AnalyticsCard>
              <SentimentTimelineChart data={aggSentimentData} />
            </AnalyticsCard>
          </Grid>
          <Grid item xs={0} md={gridMedCols}></Grid>
          <Grid item xs={gridSmallCols} md={gridMedCols}>
            <AnalyticsCard>
              <SentimentDistributionPieChart data={aggSentimentData} />
            </AnalyticsCard>
          </Grid>
        </Grid>
      </ParallaxLayer>
    </Parallax>
  );
};

export default StatisticsPage;
