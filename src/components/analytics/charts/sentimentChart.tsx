import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Brush } from "recharts";
import { SentimentData } from "../sentimentDataType";
import { FC } from "react";
import moment from "moment";

interface sentimentProps {
  data: SentimentData[];
}

export const SentimentTimelineChart: FC<sentimentProps> = ({ data }) => {
  const customTooltip = (props: any) => {
    if (props.active && props.payload) {
      const payload = props.payload[0].payload;
      return (
        <div style={{ backgroundColor: "white", padding: "10px", border: "1px solid #ccc" }}>
          <p>Date: {moment(payload.createdAt).format("YYYY-MM-DD")}</p>
          <p>Sentiment Score: {payload.compound_score}</p>
          <p>positive:{payload.pos_score} </p>
          <p>positive:{payload.neg_score} </p>
          {/* Add more details if needed */}
        </div>
      );
    }

    return null;
  };

  return (
    <LineChart width={1000} height={1000} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="createdAt" tickFormatter={(value) => moment(value).format("YYYY-MM")} /> <YAxis />
      <Tooltip content={customTooltip} />
      <Legend formatter={(value) => (value === "compound_score" ? "Sentiment Score" : value)} />
      <Line type="monotone" dataKey="compound_score" stroke="#8884d8" />
      <Brush dataKey="createdAt" height={30} stroke="#8884d8" />
    </LineChart>
  );
};
