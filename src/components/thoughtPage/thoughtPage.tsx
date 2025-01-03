import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Thoughts } from "@prisma/client";
import { useOnScreen } from "@/globalHooks/useOnScreen";
import { debounce } from "lodash";
import ShareIcon from "@mui/icons-material/Share";
import EmailIcon from "@mui/icons-material/Email";
import TextsmsIcon from "@mui/icons-material/Textsms";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import ShareDialog from "../dialogs/shareDialog";

interface ThoughtPageProps {
  thought: Thoughts;
  setLastVisibleCreatedDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

const areEqual = (prevProps: ThoughtPageProps, nextProps: ThoughtPageProps) => {
  return prevProps.thought.thoughtId === nextProps.thought.thoughtId;
};
const ThoughtPage: React.FC<ThoughtPageProps> = React.memo(({ thought, setLastVisibleCreatedDate }) => {
  const [ref, isIntersecting] = useOnScreen({ threshold: [0, 0.25, 1], rootMargin: "0px" });

  useEffect(() => {
    const debounceSaveLastRead = debounce((createdAt) => {
      localStorage.setItem("lastReadDate", createdAt);
      setLastVisibleCreatedDate(createdAt);
    }, 500); // Adjust debounce timing as needed

    if (isIntersecting) {
      debounceSaveLastRead(thought.createdAt);
    }
  }, [isIntersecting, thought.thoughtId]);

  const modifyHTMLContent = (htmlContent: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const images = doc.getElementsByTagName("img");
    for (const img of Array.from(images)) {
      const rotation = Math.random() * 10.5 - 5;
      img.style.transform = `rotate(${rotation}deg)`;
      img.style.padding = "10px";
      img.style.backgroundColor = "white";
      img.style.border = "1px solid #ddd";
      img.style.boxShadow = "5px 5px 15px rgba(0, 0, 0, 0.5)";
      img.style.marginBottom = "25px";
      img.style.marginTop = "25px";
      img.style.display = "inline-block";
      // Add other styles as needed
    }

    return doc.body.innerHTML;
  };

  const modifiedContent = useMemo(() => modifyHTMLContent(thought.content), [thought.content]);

  const [openShareDialog, setOpenShareDialog] = useState(false);
  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/${thought.thoughtId}`;

  return (
    <>
      <Card
        ref={ref} // Attach the ref here
        elevation={3}
        sx={{
          width: "80%",
          margin: "50px auto",
          boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
          backgroundColor: "#faf7f4",
          border: "1px solid #ddd",
          background: `
          repeating-linear-gradient(0deg, #fdfdfd, #fdfdfd 1px, rgba(0, 0, 0, 0.02) 1px, rgba(0, 0, 0, 0.02) 2px)`,
          "&:before": {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.05)",
          },
        }}
        id="CardThoughtPage"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px",
            backgroundColor: "#faf7f4",
            fontFamily: "'NothingYouCouldDo', Arial, sans-serif",
          }}
        >
          <IconButton onClick={() => setOpenShareDialog(true)}>
            <ShareIcon />
          </IconButton>
          <Box sx={{ backgroundColor: "#faf7f4", flex: 1, textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", fontFamily: "'NothingYouCouldDo', Arial, sans-serif" }}>
              {thought.title}
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ flexShrink: 0, fontFamily: "'NothingYouCouldDo', Arial, sans-serif" }}>
            {new Date(thought.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Typography>
        </Box>
        <Box
          dangerouslySetInnerHTML={{ __html: modifiedContent }}
          id="BoxWithContent"
          sx={{
            backgroundColor: "#faf7f4",
            typography: "body1",
            fontFamily: "'NothingYouCouldDo', Arial, sans-serif",
            "& img": {
              maxWidth: "100%",
              height: "auto",
            },
            "& a": {
              textDecoration: "underline",
              fontWeight: "bold",
              color: "black",
            },
            padding: "20px",
          }}
        />
        <ShareDialog open={openShareDialog} onClose={() => setOpenShareDialog(false)} shareUrl={shareUrl} thoughtTitle={thought.title} />
      </Card>
    </>
  );
}, areEqual);

ThoughtPage.displayName = "ThoughtPage";

export default ThoughtPage;
