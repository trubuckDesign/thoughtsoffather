import { Box, CircularProgress } from "@mui/material";

export const LoadingOverlay = () => (
  <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
      zIndex: 2000, // Make sure this is above other content
    }}
  >
    <CircularProgress />
  </Box>
);
