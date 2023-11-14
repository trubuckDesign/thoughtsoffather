import React from "react";
import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";

const LandingPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh", // Full viewport height
        textAlign: "center",
      }}
    >
      <Link href="/story" passHref>
        <a style={{ textDecoration: "none" }}>
          <Box
            sx={{
              position: "relative",
              width: 300, // Adjust as needed
              height: 400, // Adjust as needed
              marginBottom: 2,
              cursor: "pointer",
            }}
          >
            <Image
              src="/path/to/book-cover-image.jpg" // Replace with your book cover image path
              alt="Book Cover"
              layout="fill"
              objectFit="cover"
            />
          </Box>
          <Typography variant="h4" color="primary">
            Click to Start the Adventure!
          </Typography>
        </a>
      </Link>
    </Box>
  );
};

export default LandingPage;
