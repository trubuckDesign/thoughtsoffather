"use client";
import React, { useState } from "react";
import { Collapse, IconButton, Paper, Typography } from "@mui/material";
import { Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent } from "@mui/lab";
import { GroupedData } from "@/app/page";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface TimelineComponentProps {
  groupedData: GroupedData;
}

const TimelineComponent: React.FC<TimelineComponentProps> = ({ groupedData }) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleExpandClick = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const keys = Object.keys(groupedData).sort();

  return (
    <Paper elevation={3} style={{ padding: "20px", margin: "20px" }}>
      <Typography variant="h6">Thoughts Timeline</Typography>
      <Timeline position="alternate" sx={{ width: "auto", height: "100vh", overflow: "auto" }}>
        {keys.map((key) => {
          const groupedThoughts = groupedData[key];
          const id = `${groupedThoughts.year}-${groupedThoughts.month}`;
          return (
            <React.Fragment key={id}>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <IconButton onClick={() => handleExpandClick(id)} aria-expanded={expanded === id}>
                    <ExpandMoreIcon />
                  </IconButton>
                  <Typography variant="body1">
                    {groupedThoughts.month} {groupedThoughts.year}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
              <Collapse in={expanded === id} timeout="auto" unmountOnExit>
                {groupedThoughts.days.map(({ day, thought }) => (
                  <TimelineItem key={thought.thoughtId}>
                    <TimelineSeparator>
                      <TimelineDot variant="outlined" />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="body2">
                        {day} - {thought.title}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Collapse>
            </React.Fragment>
          );
        })}
      </Timeline>
    </Paper>
  );
};

export default TimelineComponent;
