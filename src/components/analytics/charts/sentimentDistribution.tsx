import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";
import { SentimentData } from "../sentimentDataType";
import { FC } from "react";

interface sentimentDistProps {
  data: SentimentData[];
}

export const SentimentDistributionPieChart: FC<sentimentDistProps> = ({ data }) => {
  // Define a color mapping for each sentiment name
  const colorMapping: { [key: string]: string } = {
    neg_score: "#ff6347", // tomato
    neu_score: "#ffd700", // gold
    pos_score: "#90ee90", // lightgreen
    compound_score: "#6a5acd", // slateblue
    // Add more mappings for other entries if necessary
  };

  // Transform data into suitable format for PieChart
  // Assuming each data point is an object with 'name' and 'value' fields
  const transformedData = data.map((entry) => ({
    name: entry.title, // or other field that represents 'name'
    value: entry.neg_score, // or other field that represents 'value'
    // Adjust according to your data structure
  }));

  return (
    <PieChart width={400} height={400}>
      <Pie data={transformedData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
        {transformedData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colorMapping[entry.name] || "#8884d8"} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};
