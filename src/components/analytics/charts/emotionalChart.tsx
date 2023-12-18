import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { SentimentData } from "../sentimentDataType";
import { FC } from "react";

interface emotionsProp {
  data: SentimentData[];
}

export const EmotionBreakdownBarChart: FC<emotionsProp> = ({ data }) => (
  <BarChart width={600} height={300} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="thoughtid" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="positive" fill="#82ca9d" />
    <Bar dataKey="negative" fill="#8884d8" />
    {/* Add bars for other emotions */}
  </BarChart>
);
