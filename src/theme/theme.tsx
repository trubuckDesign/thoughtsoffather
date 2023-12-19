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
      fontSize: "2.8rem", // Large header for large screens
    },
    h2: {
      fontSize: "1.8rem", // Secondary header for large screens
    },
    body1: {
      fontSize: "1.40rem", // Body text for large screens
    },
    // Add other typography variants as needed
  },
  palette: {
    mode: "light",
    primary: {
      main: "#556cd6", // Example primary color
    },
    secondary: {
      main: "#19857b", // Example secondary color
    },
    error: {
      main: "#ff1744", // Example error color
    },
    warning: {
      main: "#ff9800", // Example warning color
    },
    info: {
      main: "#2196f3", // Example info color
    },
    success: {
      main: "#4caf50", // Example success color
    },
    background: {
      default: "#f0f0f0", // Your desired background color
      paper: "#ffffff", // Color for paper elements
    },
    text: {
      primary: "#333333", // Primary text color
      secondary: "#555555", // Secondary text color
      disabled: "#aaaaaa", // Disabled text color
    },
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
        body {
          background: linear-gradient(to bottom, transparent, #f0f0f0) #f0f0f0 !important;
          color: #333 !important; // Set a default text color if needed
        }
        html {
          font-size: 100%;
        }

        @media (max-width: ${breakpoints.values.md}px) {
          html {
            font-size: 90%;
          }
         
        }

        @media (max-width: ${breakpoints.values.sm}px) {
          html {
            font-size: 80%;
          }
        
        }
      `,
    },
  },
});

export default theme;
