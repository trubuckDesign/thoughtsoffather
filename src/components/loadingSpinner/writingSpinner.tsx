import { Avatar, Box, Card, CardHeader, IconButton, Skeleton } from "@mui/material";
import React from "react";
import { useSpring, animated } from "react-spring";

const HandwritingSpinner = () => {
  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardHeader
        title={<Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />}
        subheader={<Skeleton animation="wave" height={10} width="40%" />}
      />
    </Card>
  );
};

export default HandwritingSpinner;
