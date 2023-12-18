"use client";
import React, { CSSProperties } from "react";
import { Box } from "@mui/material";
import ChartComponent from "@/components/analytics/charts/charts";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import Image from "next/image";
import GeneralStats from "@/components/analytics/statistics/statistics";

const LargeTextComponent = () => {
  return (
    <Box sx={{ height: 900, width: 500 }}>
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

  return (
    <Parallax pages={imageUrls.length + 1}>
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

      <ParallaxLayer offset={0} speed={0.85} factor={imageUrls.length + 1}>
        <GeneralStats wordCount={0} averageLength={0} />
        <LargeTextComponent />

        <ChartComponent />
      </ParallaxLayer>
    </Parallax>
  );
};

export default StatisticsPage;
