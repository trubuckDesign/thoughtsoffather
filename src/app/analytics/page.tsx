"use client";
import React from "react";
import { Box } from "@mui/material";
import ChartComponent from "@/components/analytics/charts/charts";
import StatisticsComponent from "@/components/analytics/statistics/statistics";
import ParallaxScrolling from "@/components/analytics/parallax/parallax";

const StatisticsPage: React.FC = () => {
  const imageUrls: string[] = [
    "/images/image1.jpg", // Replace with your actual image URLs
    "/images/image2.jpg",
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
