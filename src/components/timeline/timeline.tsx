// components/TimelineBar.tsx
"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent, TimelineOppositeContent } from "@mui/lab";

import { GroupedData } from "@/app/page";
import { Moment } from "moment";
import moment from "moment";
import { Box } from "@mui/material";

interface TimelineBarProps {
  data: GroupedData;
  currentVisibleDate: Date | Moment | undefined;
  onDateSelect: (date: Date) => void;
  expandedMonth: string | null;
  onMonthToggle: (monthKey: string) => void;
}
const defaultCollapseHeight = 75;

const CustomConnector: React.FC<{ height: number }> = ({ height }) => {
  return (
    <Box
      id="customConnector"
      style={{
        height: `${height + defaultCollapseHeight}px`,
        width: "3px",
        backgroundColor: "white",
        marginLeft: "-8px",
        marginTop: "15px",
      }}
    ></Box>
  );
};

const TimelineBar: React.FC<TimelineBarProps> = ({ data, currentVisibleDate, onDateSelect, expandedMonth, onMonthToggle }) => {
  const currentMonthKey = moment(currentVisibleDate).format("YYYY-MMMM");
  const timelineRef = useRef<HTMLUListElement>(null); // Updated ref type

  const [expandedHeights, setExpandedHeights] = useState<{ [key: string]: number }>({});
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const updateHeight = useCallback((key: string, isExpanded: boolean) => {
    // If the month is expanded, calculate its content height
    if (isExpanded && itemRefs.current[key]) {
      const newHeight = itemRefs.current[key]?.clientHeight || 0;
      console.log("Expanded newHeight", newHeight);
      setExpandedHeights((prev) => ({
        ...prev,
        [key]: newHeight,
      }));
    } else {
      // If the month is collapsed, set the height to a default collapsed value
      console.log("Collapsed height set to default for key:", key);
      setExpandedHeights((prev) => ({
        ...prev,
        [key]: defaultCollapseHeight, // Default collapsed height
      }));
    }
  }, []);
  useEffect(() => {
    if (currentMonthKey) {
      // This ensures that when the current month is first identified, its height is set properly
      updateHeight(currentMonthKey, true);
    }
  }, [currentMonthKey, updateHeight]);

  useEffect(() => {
    if (expandedMonth) {
      // Expanded month through user interaction
      updateHeight(expandedMonth, true);
    } else {
      // If no month is user-expanded, still keep the current month expanded
      if (currentMonthKey) {
        updateHeight(currentMonthKey, true);
      }
      // Reset all other months to collapsed height
      Object.keys(expandedHeights).forEach((key) => {
        if (key !== currentMonthKey) {
          updateHeight(key, false);
        }
      });
    }
  }, [expandedMonth, currentMonthKey, updateHeight]);

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
      {Object.entries(data).map(([key, { year, month, days }], index, arr) => {
        const uniqueDays = Array.from(days); // Convert Set to Array
        const currentDate = moment(currentVisibleDate).date();
        const isExpanded = key === expandedMonth || key === currentMonthKey;

        return (
          <React.Fragment key={`${year}-${month}`}>
            <TimelineItem
              onClick={() => onMonthToggle(key)}
              sx={{
                marginBottom: "8px", // Regular margin
              }}
            >
              <TimelineOppositeContent sx={{ display: "none" }}></TimelineOppositeContent>
              <TimelineSeparator sx={{ height: "auto" }}>
                <TimelineDot sx={{ backgroundColor: "white" }} />
              </TimelineSeparator>
              {index !== arr.length - 1 && (
                <CustomConnector key={key} height={key === expandedMonth || key === currentMonthKey ? expandedHeights[key] : defaultCollapseHeight} />
              )}
              <TimelineContent
                sx={{
                  fontSize: "1.5rem",
                  marginLeft: 1,
                  transition: "transform 0.2s ease-in-out",
                  cursor: "pointer", // Change cursor to pointer
                  "&:hover": {
                    transform: "scale(1.3)", // Scale up on hover
                  },
                }}
              >
                {year} | {moment().month(month).format("MMM")} {/* Format month */}
              </TimelineContent>
            </TimelineItem>
            <div ref={(el) => (itemRefs.current[key] = el)}>
              {isExpanded &&
                uniqueDays.map(({ day, thought }, index, arr) => (
                  <TimelineItem key={thought.thoughtId} onClick={() => onDateSelect(new Date(thought.createdAt))}>
                    <TimelineSeparator>
                      <TimelineDot sx={{ backgroundColor: "white" }} />
                      {index !== arr.length - 1 && <TimelineConnector sx={{ backgroundColor: "white" }} />}
                    </TimelineSeparator>
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
            </div>
          </React.Fragment>
        );
      })}
    </Timeline>
  );
};

export default TimelineBar;
