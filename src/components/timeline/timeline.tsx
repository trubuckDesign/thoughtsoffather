// components/TimelineBar.tsx
import React from "react";
import { Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent, TimelineOppositeContent } from "@mui/lab";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material";
import { GroupedData, GroupedThoughts } from "@/app/page";
import { Moment } from "moment";
import moment from "moment";

interface TimelineBarProps {
  data: GroupedData;
  currentVisibleDate: Date | Moment | undefined;
}

const TimelineBar: React.FC<TimelineBarProps> = ({ data, currentVisibleDate }) => {
  const currentMonthKey = moment(currentVisibleDate).format("YYYY-MMMM");

  return (
    <Timeline
      position="right"
      sx={{
        position: "fixed",
        left: "0px",
        top: "50%",
        transform: "translateY(-50%)",
        width: "auto",
      }}
    >
      {Object.entries(data).map(([key, { year, month, days }], index) => {
        const uniqueDays = Array.from(days); // Convert Set to Array

        const isCurrentMonth = key === currentMonthKey;
        const currentDate = moment(currentVisibleDate).date();

        return (
          <React.Fragment key={`${year}-${month}`}>
            <TimelineItem>
              <TimelineOppositeContent sx={{ display: "none" }}></TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
                {index < Object.entries(data).keys.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                {year} | {moment().month(month).format("MMM")} {/* Format month */}
              </TimelineContent>
            </TimelineItem>
            {isCurrentMonth &&
              uniqueDays.map(({ day, thought }) => (
                <TimelineItem key={thought.thoughtId}>
                  <TimelineContent
                    sx={{
                      typography: "body1",
                      transition: "transform 1s, font-size 1s",
                      transform: day === currentDate ? "scale(1.5)" : "scale(1)",
                      fontWeight: day === currentDate ? "bold" : "normal",
                      textDecoration: day === currentDate ? "underline" : "none",
                      fontSize: day === currentDate ? "larger" : "inherit",
                      "&:hover": {
                        transform: "scale(1.5)",
                      },
                    }}
                  >
                    {day}
                  </TimelineContent>
                </TimelineItem>
              ))}
          </React.Fragment>
        );
      })}
    </Timeline>
  );
};

export default TimelineBar;
