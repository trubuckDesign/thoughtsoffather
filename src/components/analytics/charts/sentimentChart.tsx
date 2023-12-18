import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface SentimentGraphProps {
  data: { date: string; sentiment: number }[];
}

const SentimentGraph: React.FC<SentimentGraphProps> = ({ data }) => {
  return (
    <LineChart width={500} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="sentiment" stroke="#8884d8" />
    </LineChart>
  );
};

export default SentimentGraph;
