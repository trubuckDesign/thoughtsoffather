"use client";
import React, { CSSProperties, useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
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

const sampleData: SentimentData[] = [
  {
    title: "TBT - 1975 Version",
    createdAt: "2021-06-17T21:53:16.370Z",
    thoughtid: 104,
    neg_score: 0.0,
    neu_score: 0.645,
    pos_score: 0.355,
    compound_score: 0.765,
    positive: 0,
    negative: 0,
    anger: 0,
    anticipation: 0,
    disgust: 0,
    fear: 0,
    joy: 0,
    sadness: 0,
    surprise: 0,
    trust: 0,
  },
  {
    title: "Happy Mother's Day - miss you.",
    createdAt: "2021-05-09T21:57:17.431Z",
    thoughtid: 105,
    neg_score: 0.0,
    neu_score: 0.0,
    pos_score: 0.0,
    compound_score: 0.0,
    positive: 0,
    negative: 0,
    anger: 0,
    anticipation: 0,
    disgust: 0,
    fear: 0,
    joy: 0,
    sadness: 0,
    surprise: 0,
    trust: 0,
  },
  {
    title: "A Day Late",
    createdAt: "2021-02-05T22:25:55.881Z",
    thoughtid: 114,
    neg_score: 0.0,
    neu_score: 0.933,
    pos_score: 0.067,
    compound_score: 0.3612,
    positive: 1,
    negative: 2,
    anger: 1,
    anticipation: 1,
    disgust: 0,
    fear: 1,
    joy: 0,
    sadness: 1,
    surprise: 1,
    trust: 0,
  },
  {
    title: "Throwback Thursday",
    createdAt: "2020-11-10T23:51:37.265Z",
    thoughtid: 120,
    neg_score: 0.0,
    neu_score: 0.957,
    pos_score: 0.043,
    compound_score: 0.6361,
    positive: 3,
    negative: 3,
    anger: 0,
    anticipation: 0,
    disgust: 0,
    fear: 0,
    joy: 0,
    sadness: 0,
    surprise: 1,
    trust: 2,
  },
  {
    title: "Snark",
    createdAt: "2021-04-01T22:04:36.280Z",
    thoughtid: 107,
    neg_score: 0.042,
    neu_score: 0.873,
    pos_score: 0.086,
    compound_score: 0.4045,
    positive: 2,
    negative: 3,
    anger: 2,
    anticipation: 4,
    disgust: 0,
    fear: 3,
    joy: 1,
    sadness: 1,
    surprise: 1,
    trust: 3,
  },
  {
    title: "The Soundtrack of My Life, Pt 3",
    createdAt: "2023-06-02T06:49:46.226Z",
    thoughtid: 70,
    neg_score: 0.01,
    neu_score: 0.825,
    pos_score: 0.165,
    compound_score: 0.9547,
    positive: 4,
    negative: 4,
    anger: 3,
    anticipation: 3,
    disgust: 1,
    fear: 3,
    joy: 3,
    sadness: 1,
    surprise: 1,
    trust: 3,
  },
  {
    title: "A Question",
    createdAt: "2023-01-02T10:05:46.716Z",
    thoughtid: 77,
    neg_score: 0.085,
    neu_score: 0.816,
    pos_score: 0.099,
    compound_score: 0.4927,
    positive: 6,
    negative: 7,
    anger: 2,
    anticipation: 7,
    disgust: 2,
    fear: 2,
    joy: 5,
    sadness: 4,
    surprise: 3,
    trust: 5,
  },
  {
    title: "Online Ads",
    createdAt: "2021-03-25T22:06:14.925Z",
    thoughtid: 108,
    neg_score: 0.069,
    neu_score: 0.894,
    pos_score: 0.037,
    compound_score: -0.5647,
    positive: 3,
    negative: 9,
    anger: 1,
    anticipation: 4,
    disgust: 1,
    fear: 1,
    joy: 0,
    sadness: 1,
    surprise: 4,
    trust: 1,
  },
  {
    title: "A blast from the past, aka throw-back Thursday.",
    createdAt: "2021-10-07T21:35:32.890Z",
    thoughtid: 100,
    neg_score: 0.0,
    neu_score: 0.0,
    pos_score: 0.0,
    compound_score: 0.0,
    positive: 0,
    negative: 0,
    anger: 0,
    anticipation: 0,
    disgust: 0,
    fear: 0,
    joy: 0,
    sadness: 0,
    surprise: 0,
    trust: 0,
  },
  {
    title: "Passing Of Years",
    createdAt: "2020-12-20T22:57:01.527Z",
    thoughtid: 117,
    neg_score: 0.195,
    neu_score: 0.629,
    pos_score: 0.175,
    compound_score: -0.1655,
    positive: 3,
    negative: 5,
    anger: 3,
    anticipation: 2,
    disgust: 2,
    fear: 3,
    joy: 2,
    sadness: 4,
    surprise: 2,
    trust: 3,
  },
  {
    title: "Old Slides",
    createdAt: "2020-12-19T23:21:01.092Z",
    thoughtid: 118,
    neg_score: 0.047,
    neu_score: 0.875,
    pos_score: 0.078,
    compound_score: 0.2458,
    positive: 0,
    negative: 0,
    anger: 0,
    anticipation: 0,
    disgust: 0,
    fear: 0,
    joy: 0,
    sadness: 0,
    surprise: 0,
    trust: 1,
  },
  {
    title: "A 42nd anniversary",
    createdAt: "2022-10-04T09:23:22.174Z",
    thoughtid: 79,
    neg_score: 0.073,
    neu_score: 0.807,
    pos_score: 0.12,
    compound_score: 0.8858,
    positive: 9,
    negative: 7,
    anger: 1,
    anticipation: 8,
    disgust: 0,
    fear: 4,
    joy: 5,
    sadness: 4,
    surprise: 2,
    trust: 6,
  },
  {
    title: "Getting Noticed",
    createdAt: "2023-06-19T06:43:56.574Z",
    thoughtid: 67,
    neg_score: 0.026,
    neu_score: 0.873,
    pos_score: 0.101,
    compound_score: 0.9902,
    positive: 29,
    negative: 9,
    anger: 3,
    anticipation: 18,
    disgust: 4,
    fear: 4,
    joy: 8,
    sadness: 2,
    surprise: 3,
    trust: 14,
  },
  {
    title: "Lackland Air Force Base",
    createdAt: "2023-06-01T06:52:22.625Z",
    thoughtid: 71,
    neg_score: 0.065,
    neu_score: 0.877,
    pos_score: 0.058,
    compound_score: -0.7967,
    positive: 29,
    negative: 19,
    anger: 7,
    anticipation: 13,
    disgust: 5,
    fear: 12,
    joy: 10,
    sadness: 8,
    surprise: 1,
    trust: 19,
  },
  {
    title: "My (brief) Career as a Terrorist",
    createdAt: "2021-02-20T23:10:22.487Z",
    thoughtid: 109,
    neg_score: 0.054,
    neu_score: 0.856,
    pos_score: 0.09,
    compound_score: 0.9945,
    positive: 66,
    negative: 24,
    anger: 8,
    anticipation: 19,
    disgust: 10,
    fear: 18,
    joy: 22,
    sadness: 13,
    surprise: 16,
    trust: 36,
  },
];

interface AggregatedData {
  monthYear: string;
  averageCompoundScore: number;
}

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

  return (
    <Parallax id="ParallaxMain" pages={imageUrls.length + 1}>
      {imageUrls.map((src, index) => (
        <ParallaxLayer
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

      <ParallaxLayer id="parallaxContent" offset={0} speed={0.85} factor={1}>
        <Grid id="contentGrid" container spacing={2} style={{ padding: 20, height: "100%" }}>
          {/* Adjust the grid layout as needed */}
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
          <Grid item xs={12}>
            <LargeTextComponent />
          </Grid>
        </Grid>
      </ParallaxLayer>
    </Parallax>
  );
};

export default StatisticsPage;
