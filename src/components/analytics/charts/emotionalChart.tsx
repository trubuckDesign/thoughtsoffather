import React, { useState, useMemo, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import { SentimentData } from "../sentimentDataType";
import moment from "moment";
import { Box, List, ListItem } from "@mui/material";

interface EmotionsProp {
  data: SentimentData[];
}

export const EmotionBreakdownBarChart: React.FC<EmotionsProp> = ({ data }) => {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const chartHeightPercentage = 0.45;
  const [chartHeight, setChartHeight] = useState<number>(window.innerHeight * chartHeightPercentage); // 25% of viewport height

  useEffect(() => {
    const handleResize = () => {
      setChartHeight(window.innerHeight * chartHeightPercentage); // Update height on resize
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const months = useMemo(() => {
    const uniqueMonths = new Set(data.map((d) => moment(d.createdAt).format("YYYY-MM")));
    return Array.from(uniqueMonths);
  }, [data]);

  const filteredData = useMemo(() => {
    return selectedMonth ? data.filter((d) => moment(d.createdAt).format("YYYY-MM") === selectedMonth) : data;
  }, [data, selectedMonth]);

  // Tooltip formatter
  const renderTooltip = (props: any) => {
    if (props.active && props.payload) {
      const payload = props.payload[0].payload;
      return (
        <Box sx={{ backgroundColor: "white", padding: "10px", border: "1px solid #ccc" }}>
          <p>{moment(payload.createdAt).format("MMMM YYYY")}</p>
          {/* Add more details here */}
        </Box>
      );
    }

    return null;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row", height: "50vh" }}>
      <List sx={{ width: "200px", overflowY: "auto", maxHeight: "100%", marginRight: "16px", border: "1px solid #ccc" }}>
        {months.map((month) => (
          <ListItem key={month} onMouseEnter={() => setSelectedMonth(month)} sx={{ cursor: "pointer" }}>
            {month}
          </ListItem>
        ))}
      </List>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="createdAt" tickFormatter={(tickItem) => moment(tickItem).format("YYYY-MM")} />
          <YAxis />
          <Tooltip content={renderTooltip} />
          <Legend />
          <Bar dataKey="anger" fill="#e53935" />
          <Bar dataKey="anticipation" fill="#ffb300" />
          <Bar dataKey="disgust" fill="#7cb342" />
          <Bar dataKey="fear" fill="#6a1b9a" />
          <Bar dataKey="joy" fill="#ffd600" />
          <Bar dataKey="sadness" fill="#1e88e5" />
          <Bar dataKey="surprise" fill="#ec407a" />
          <Bar dataKey="trust" fill="#43a047" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};
