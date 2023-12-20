import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import commitData from "@/components/analytics/statistics/devGithubInsights.json";
// A utility function to convert UNIX timestamp to a date string
const formatDate = (timestamp: number) => new Date(timestamp * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" });

const CommitChart = () => {
  // Transform the data here if needed
  const chartHeightPercentage = 0.45;
  const [chartHeight, setChartHeight] = useState<number>(window.innerHeight * chartHeightPercentage); // 25% of viewport height

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    const handleResize = () => {
      setChartHeight(window.innerHeight * chartHeightPercentage); // Update height on resize
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart data={commitData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" tickFormatter={formatDate} />
        <YAxis />
        <Tooltip />
        <Legend />
        {commitData.length > 0 &&
          commitData[0].days.map((_, index) => (
            <Bar key={`bar-${index}`} dataKey={`days[${index}]`} fill={index % 2 === 0 ? "#8884d8" : "#82ca9d"} name={`${daysOfWeek[index]}`} />
          ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CommitChart;
