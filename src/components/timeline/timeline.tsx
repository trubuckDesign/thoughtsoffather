// components/TimelineBar.tsx
"use client";
import React, { useRef } from "react";
import { Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent, TimelineOppositeContent } from "@mui/lab";

import { GroupedData } from "@/app/page";
import { Moment } from "moment";
import moment from "moment";

interface TimelineBarProps {
  data: GroupedData;
  currentVisibleDate: Date | Moment | undefined;
  onDateSelect: (date: Date) => void;
  expandedMonth: string | null;
  onMonthToggle: (monthKey: string) => void;
}

const TimelineBar: React.FC<TimelineBarProps> = ({ data, currentVisibleDate, onDateSelect, expandedMonth, onMonthToggle }) => {
  const currentMonthKey = moment(currentVisibleDate).format("YYYY-MMMM");
  const timelineRef = useRef<HTMLUListElement>(null); // Updated ref type

  return (
    <Timeline
      position="right"
      ref={timelineRef}
      sx={{
        position: "fixed",
        left: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        width: "auto",
        zIndex: 1000,
        overflowY: "auto",
        height: "100vh",
        // Custom styles to hide the scrollbar
        "&::-webkit-scrollbar": {
          display: "none",
        },
        msOverflowStyle: "none", // IE and Edge
        scrollbarWidth: "none", // Firefox
      }}
    >
      {Object.entries(data).map(([key, { year, month, days }], index) => {
        const uniqueDays = Array.from(days); // Convert Set to Array

        const isCurrentMonth = key === currentMonthKey;
        const currentDate = moment(currentVisibleDate).date();

        const isExpanded = key === expandedMonth || key === currentMonthKey;

        return (
          <React.Fragment key={`${year}-${month}`}>
            <TimelineItem
              onClick={() => onMonthToggle(key)}
              sx={{
                marginBottom: "8px", // Regular margin
                transition: "transform 0.18s ease-in-out",
                cursor: "pointer", // Change cursor to pointer
                "&:hover": {
                  transform: "scale(1.3)", // Scale up on hover
                },
              }}
            >
              <TimelineOppositeContent sx={{ display: "none" }}></TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
                {index < Object.entries(data).keys.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent
                sx={{
                  fontSize: "1.5rem",
                }}
              >
                {year} | {moment().month(month).format("MMM")} {/* Format month */}
              </TimelineContent>
            </TimelineItem>
            {isExpanded &&
              uniqueDays.map(({ day, thought }) => (
                <TimelineItem key={thought.thoughtId} onClick={() => onDateSelect(new Date(thought.createdAt))}>
                  <TimelineContent
                    sx={{
                      typography: "body1",
                      transition: "transform .18s, font-size 1s",
                      transform: day === currentDate ? "scale(1.3)" : "scale(1)",
                      fontWeight: day === currentDate ? "bold" : "normal",
                      textDecoration: day === currentDate ? "underline" : "none",
                      fontSize: day === currentDate ? "larger" : "inherit",
                      cursor: "pointer",
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

//to do
// finish the toggle month view, make it so that if the user scrolls it will collapse any months that are not in view
