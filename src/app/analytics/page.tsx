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

const LargeTextComponent = () => {
  return (
    <Box sx={{ width: 500 }}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
      anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
      reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
      officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
      et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
      irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
      sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
      aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet,
      consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
      dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
      anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
      reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
      officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
      et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
      irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
      sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
      aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet,
      consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
      dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      {/* Repeat the paragraph or add more lorem ipsum text as needed */}
    </Box>
  );
};

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

const getRandomStyle = (): CSSProperties => {
  const rotation = Math.random() * 10.5 - 5;
  const left = 10 + Math.random() * 50; // Random left position between 20% and 80%
  const margin = Math.random() * 20; // Random margin up to 50px
  return {
    position: "absolute",
    transform: `rotate(${rotation}deg)`,
    padding: "10px",
    backgroundColor: "white",
    border: "1px solid #ddd",
    boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.5)",
    display: "inline-block",
    maxWidth: "600px",
    minWidth: "100px",
    width: `100%`,
    left: `${left}%`,
    marginBottom: `${margin}px`,
    marginTop: `${margin}px`,
  };
};
const StatisticsPage: React.FC = () => {
  const imageUrls: string[] = [
    "https://aoswchlkodefxg8r.public.blob.vercel-storage.com/()=%3Ee-dPwJ4viuAZd7fIPPRBCvfCBGrJjDzk", // Replace with your actual image URLs
    "https://aoswchlkodefxg8r.public.blob.vercel-storage.com/()=%3Ee-sEpwlVqK4BrGstWdZexGmjP79haNdK",
    "https://aoswchlkodefxg8r.public.blob.vercel-storage.com/()=%3Ee-V7pzz09LYrqTCAykLfbSKHsdqtn4I9",
    "https://aoswchlkodefxg8r.public.blob.vercel-storage.com/()=%3Ee-e4dMn2AE4Mj413SjA2nVLBAdTXsaLo",
    "https://aoswchlkodefxg8r.public.blob.vercel-storage.com/()=%3Ee-ICKcI76mUbFQnSDxHJag5xaT5jBECw",
    "https://aoswchlkodefxg8r.public.blob.vercel-storage.com/()=%3Ee-bWSJVW8Eg45ZPA1bDiSls2dYmutRaJ",
    "https://aoswchlkodefxg8r.public.blob.vercel-storage.com/()=%3Ee-Ntk1NNaPw1F1TxqkaTlqyo3mdXA8NH",
    "https://aoswchlkodefxg8r.public.blob.vercel-storage.com/()=%3Ee-rWMz6hqWoWIdJcoHxmukphBisW0FyG",
    "https://aoswchlkodefxg8r.public.blob.vercel-storage.com/()=%3Ee-dPwJ4viuAZd7fIPPRBCvfCBGrJjDzk",
    // ... more images
  ];

  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [aggSentimentData, setAggSentimentData] = useState<SentimentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Parallax id="ParallaxMain" pages={imageUrls.length + 1}>
      {imageUrls.map((src, index) => (
        <ParallaxLayer
          id="parallaxBackground"
          key={index}
          offset={index}
          factor={0.5}
          speed={Math.random() * 2.5}
          style={{ position: "relative", display: "flex", justifyContent: "center", height: "auto" }}
        >
          <Image
            src={src}
            alt={`Background ${index}`}
            width={600} // Maximum width
            height={400} // Set an appropriate height
            objectFit="cover"
            style={getRandomStyle()}
          />
        </ParallaxLayer>
      ))}

      <ParallaxLayer id="parallaxContent" offset={0} speed={0.85} factor={0.1}>
        <Grid id="contentGrid" container spacing={2} style={{ padding: 20, height: "100%" }}>
          <Grid item xs={12} md={6}>
            <GeneralStats stats={stats} />
          </Grid>
          <Grid item xs={12} md={6}>
            <EmotionBreakdownBarChart data={sentimentData} />
          </Grid>
          <Grid item xs={12} md={6}>
            <SentimentTimelineChart data={aggSentimentData} />
          </Grid>
          <Grid item xs={12} md={6}>
            <SentimentDistributionPieChart data={sentimentData} />
          </Grid>
        </Grid>
      </ParallaxLayer>
    </Parallax>
  );
};

export default StatisticsPage;
