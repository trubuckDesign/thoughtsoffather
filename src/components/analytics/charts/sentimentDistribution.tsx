import React from "react";
import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";

// Assuming SentimentData type is appropriate for your data structure
import { SentimentData } from "../sentimentDataType";

interface SentimentDistProps {
  data: SentimentData[];
}

export const SentimentDistributionPieChart: React.FC<SentimentDistProps> = ({ data }) => {
  // Colors for each sentiment score
  const colors = {
    neg_score: "#ef5350", // red for negative
    neu_score: "#ffee58", // yellow for neutral
    pos_score: "#66bb6a", // green for positive
    compound_score: "#42a5f5", // blue for compound
    // Add more colors if needed
  };

  // Calculate the total for each sentiment score
  const sentimentTotals = data.reduce(
    (totals, entry) => {
      totals.neg_score += entry.neg_score;
      totals.neu_score += entry.neu_score;
      totals.pos_score += entry.pos_score;
      totals.compound_score += entry.compound_score;
      // Add other sentiments if needed
      return totals;
    },
    {
      neg_score: 0,
      neu_score: 0,
      pos_score: 0,
      compound_score: 0,
      // Initialize other sentiments to 0 if needed
    }
  );

  // Transform totals into an array for the PieChart
  const pieData = Object.keys(sentimentTotals).map((key) => ({
    name: key,
    value: sentimentTotals[key as keyof typeof sentimentTotals],
  }));

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={pieData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={120}
        fill="#8884d8"
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
      >
        {pieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[entry.name as keyof typeof colors]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};
