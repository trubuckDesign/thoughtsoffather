import { Box, Button } from "@mui/material";
import React from "react";
import ReplayIcon from "@mui/icons-material/Replay";
import { useRouter } from "next/navigation";
import { BookPageProps } from "./bookPage";

export const EndPage: React.FC<BookPageProps> = () => {
  const router = useRouter();

  const handleRestartClick = () => {
    router.push("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "75vh",
      }}
    >
      <Button variant="outlined" startIcon={<ReplayIcon />} onClick={handleRestartClick}>
        Restart
      </Button>
    </Box>
  );
};
