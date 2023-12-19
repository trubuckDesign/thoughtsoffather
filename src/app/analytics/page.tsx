"use client";
import React, { CSSProperties, useEffect, useState } from "react";
import { Box, CircularProgress, Grid } from "@mui/material";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import Image from "next/image";
import GeneralStats from "@/components/analytics/statistics/statistics";
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
import BackgroundImageContainer from "@/components/background/background";
import { ParallaxImages } from "@/components/analytics/backgroundImgs/backgroundImgs";
import { AnalyticsCard } from "@/components/analytics/card/analyticsCard";

const stats = [
  { label: "Total time spent extracting", value: "9:01:06", icon: <AccessTimeIcon /> },
  { label: "Average Duration to format", value: "0:05:21", icon: <TimerIcon /> },
  { label: "# of posts", value: 122, icon: <ArticleIcon /> },
  { label: "Average time between posts", value: "7.10", icon: <UpdateIcon /> },
  { label: "Average number of characters", value: "4608.60", icon: <TextFieldsIcon /> },
  { label: "Max characters", value: 17469, icon: <TitleIcon /> },
  { label: "Max Words", value: 3140, icon: <DescriptionIcon /> },
  { label: "Average Words", value: "832.37", icon: <ShortTextIcon /> },
  { label: "Total Words", value: "98,223", icon: <CalculateIcon /> },
];

function aggregateDataByMonth(data: SentimentData[]): SentimentData[] {
  const grouped = data.reduce((acc, record) => {
    const monthYear = moment(record.createdAt).format("YYYY-MM");
    if (!acc[monthYear]) {
      acc[monthYear] = { ...record, count: 1 };
      acc[monthYear].createdAt = monthYear; // Set createdAt to the aggregated month/year
    } else {
      // Aggregate numeric properties
      acc[monthYear].neg_score += record.neg_score;
      acc[monthYear].neu_score += record.neu_score;
      acc[monthYear].pos_score += record.pos_score;
      acc[monthYear].compound_score += record.compound_score;
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
      acc[monthYear].count += 1;
    }
    return acc;
  }, {} as Record<string, SentimentData & { count: number }>);

  return Object.values(grouped).map(({ count, ...item }) => {
    // Calculate average for each numeric property
    item.postCount = count;
    item.neg_score /= count;
    item.neu_score /= count;
    item.pos_score /= count;
    item.compound_score /= count;
    item.positive /= count;
    item.negative /= count;
    item.anger /= count;
    item.anticipation /= count;
    item.disgust /= count;
    item.fear /= count;
    item.joy /= count;
    item.sadness /= count;
    item.surprise /= count;
    item.trust /= count;

    return item as SentimentData;
  });
}

const StatisticsPage: React.FC = () => {
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [aggSentimentData, setAggSentimentData] = useState<SentimentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImgLoading, setIsImgLoading] = useState(true);
  const [blobs, setBlobs] = useState<BlobWithUrl[]>([]);
  const numImagesToPull = 12;
  const numImagesPerLayer = 6;
  const layers = Math.ceil(blobs.length / numImagesPerLayer);
  const overlapAmount = 0.5; // The amount by which each layer will overlap the previous one

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
    <Parallax id="ParallaxMain" pages={layers}>
      {[...Array(layers)].map((_, layerIndex) => (
        <ParallaxImages
          key={layerIndex}
          imageUrls={blobs.slice(layerIndex * numImagesPerLayer, (layerIndex + 1) * numImagesPerLayer).map((blob) => blob.url)}
          layerOffset={layerIndex - layerIndex * overlapAmount}
          layerFactor={1}
        />
      ))}

      <ParallaxLayer id="parallaxContent" offset={0} speed={0.85} factor={0.1}>
        <Grid id="contentGrid" container spacing={2} style={{ padding: 20, height: "100%" }}>
          <Grid item xs={12} md={6}>
            <AnalyticsCard>
              <GeneralStats stats={stats} />
            </AnalyticsCard>
          </Grid>
          <Grid item xs={0} md={6}></Grid>
          <Grid item xs={12} md={6}>
            <AnalyticsCard>
              <EmotionBreakdownBarChart data={sentimentData} />
            </AnalyticsCard>
          </Grid>
          <Grid item xs={0} md={6}></Grid>
          <Grid item xs={12} md={6}>
            <AnalyticsCard>
              <SentimentTimelineChart data={aggSentimentData} />
            </AnalyticsCard>
          </Grid>
          <Grid item xs={0} md={6}></Grid>
          <Grid item xs={12} md={6}>
            <AnalyticsCard>
              <SentimentDistributionPieChart data={sentimentData} />
            </AnalyticsCard>
          </Grid>
        </Grid>
      </ParallaxLayer>
    </Parallax>
  );
};

export default StatisticsPage;
