import React from "react";
import { Box } from "@mui/material";
import { LineChart, Line } from "recharts";

const ChartComponent: React.FC = () => {
  const data: any = [
    // Your chart data
  ];

  return (
    <Box>
      {/* <LineChart width={400} height={400} data={data}>
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart> */}
    </Box>
  );
};

export default ChartComponent;
