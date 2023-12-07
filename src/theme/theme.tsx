"use client";
import { createTheme } from "@mui/material/styles";

// Define the breakpoints separately
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
};

// Use the breakpoints in the theme creation
const theme = createTheme({
  breakpoints: breakpoints,
  typography: {
    fontFamily: ["Roboto", "Arial", "sans-serif"].join(","),
    fontSize: 16, // Base font size for large screens
    h1: {
      fontSize: "4.5rem", // Large header for large screens
    },
    h2: {
      fontSize: "3rem", // Secondary header for large screens
    },
    body1: {
      fontSize: "2rem", // Body text for large screens
    },
    // Add other typography variants as needed
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'NothingYouCouldDo';
          src: url('/font/NothingYouCouldDo.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }

        html {
          font-size: 100%;
        }

        @media (max-width: ${breakpoints.values.md}px) {
          html {
            font-size: 90%;
          }
          .MuiTypography-h1 {
            font-size: 2.25rem;
          }
          .MuiTypography-h2 {
            font-size: 1.75rem;
          }
          .MuiTypography-body1 {
            font-size: 0.9rem;
          }
        }

        @media (max-width: ${breakpoints.values.sm}px) {
          html {
            font-size: 80%;
          }
          .MuiTypography-h1 {
            font-size: 2rem;
          }
          .MuiTypography-h2 {
            font-size: 1.5rem;
          }
          .MuiTypography-body1 {
            font-size: 0.8rem;
          }
        }
      `,
    },
  },
});

export default theme;
