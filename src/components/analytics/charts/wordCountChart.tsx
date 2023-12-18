import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface WordCountGraphProps {
  data: { date: string; wordCount: number }[];
}

const WordCountGraph: React.FC<WordCountGraphProps> = ({ data }) => {
  return (
    <BarChart width={500} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="wordCount" fill="#82ca9d" />
    </BarChart>
  );
};

export default WordCountGraph;
