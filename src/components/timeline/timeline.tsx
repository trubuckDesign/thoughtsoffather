// components/TimelineBar.tsx
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

interface TimelineData {
  year: number;
  month: string;
  count: number;
}

interface TimelineBarProps {
  data: TimelineData[];
}

// Styled component for the timeline item
const TimelineItem = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  position: "relative",
  paddingLeft: theme.spacing(3),
}));

// Styled component for the line
const Line = styled("div")(({ theme }) => ({
  height: "100%",
  borderLeft: `2px solid ${theme.palette.primary.main}`,
  position: "absolute",
  left: 0,
}));

const TimelineBar: React.FC<TimelineBarProps> = ({ data }) => {
  const totalCount = data.reduce((acc, item) => acc + item.count, 0);

  return (
    <Box sx={{ position: "fixed", left: 0, top: 0, bottom: 0, width: "100px" }}>
      {data.map((item, index) => {
        const spacing = (item.count / totalCount) * 100;

        return (
          <TimelineItem key={index} sx={{ marginBottom: `${spacing}%` }}>
            <Typography variant="body1">
              {item.year} {item.month}
            </Typography>
            <Line />
          </TimelineItem>
        );
      })}
    </Box>
  );
};

export default TimelineBar;
