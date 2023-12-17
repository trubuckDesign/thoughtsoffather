"use client";
import React from "react";
import { Box } from "@mui/material";
import ChartComponent from "@/components/analytics/charts/charts";
import StatisticsComponent from "@/components/analytics/statistics/statistics";
import ParallaxScrolling from "@/components/analytics/parallax/parallax";

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

  return (
    <Box>
      <ParallaxScrolling imageUrls={imageUrls} />
      <StatisticsComponent />
      <ChartComponent />
    </Box>
  );
};

export default StatisticsPage;
