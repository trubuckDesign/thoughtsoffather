// components/TimelineBar.tsx
import React from "react";
import { Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent, TimelineOppositeContent } from "@mui/lab";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material";

interface TimelineData {
  year: number;
  month: string;
  count: number;
}

interface TimelineBarProps {
  data: TimelineData[];
}

const StyledTimelineItem = styled(TimelineItem)(({ theme }) => ({
  display: "block",
  alignItems: "center",
}));

const TimelineBar: React.FC<TimelineBarProps> = ({ data }) => {
  const totalCount = data.reduce((total, item) => total + item.count, 0);

  return (
    <Timeline
      position="right"
      sx={{
        position: "fixed",
        left: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        width: "auto",
      }}
    >
      {data.map((item, index) => {
        const maxMargin = 100 / data.length; // For example, for 10 items, maxMargin would be 10%
        const spacingPercentage = Math.min((item.count / totalCount) * 100, maxMargin);
        const spacingPixel = (spacingPercentage / 100) * window.innerHeight; // Convert percentage to pixels
        console.log(spacingPixel);
        return (
          <TimelineItem sx={{ marginTop: `${spacingPercentage}%` }}>
            <TimelineOppositeContent sx={{ display: "none" }}></TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              {index < data.length - 1 && <TimelineConnector sx={{ height: `${spacingPixel}px` }} />}
            </TimelineSeparator>
            <TimelineContent>
              {item.year} | {item.month}
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
};

export default TimelineBar;
