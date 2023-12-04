import React from "react";
import { Typography, Box, Paper } from "@mui/material";
import { styled } from "@mui/system";

const PaperPageContainer = styled(Paper)({
  width: "min(100%, 600px)", // Adjust width as needed
  margin: "20px auto", // Centers the component with margin
  boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)", // Shadow for depth
  overflow: "hidden", // Optional, to trim any overflowing content
  position: "relative", // Relative position for internal absolute elements
});
const PaperOverlay = styled(Paper)({
  //position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  backgroundColor: "#f8f8f8", // Base color for paper
  // background: `
  //   linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)),
  //   repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 0, 0, 0.02) 1px, rgba(0, 0, 0, 0.02) 2px)`, // Subtle noise texture
  backgroundBlendMode: "overlay",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
  border: "1px solid #e0e0e0", // Light border for paper edges
});

const ContentBox = styled(Box)({
  width: "min(100%, 600px)", // Adjust width as needed
  minHeight: "100vh", // Adjust height as needed
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  margin: "auto",
  position: "relative", // Make this a positioned container
  overflow: "hidden", // Hide overflow to contain the overlay
});

const StyledCard = styled(Box)({
  paddingleft: "10px",
  paddingRight: "10px",
  maxHeight: "100%",
  color: "#000",
  maxWidth: "600px",
  backgroundColor: "transparent", // Optional, depending on desired effect
  boxSizing: "border-box",
});

interface PaperPageProps {
  contentChunk: string;
}

const PaperPage: React.FC<PaperPageProps> = ({ contentChunk }) => {
  return (
    <>
      <PaperPageContainer id="paperPageContainer">
        <PaperOverlay id="paperOverlay" />
        <ContentBox id="contentBox">
          <StyledCard id="styledCard">
            <Typography variant="body1">
              <Box id="contentBoxInner" dangerouslySetInnerHTML={{ __html: contentChunk }} />
            </Typography>
          </StyledCard>
        </ContentBox>
      </PaperPageContainer>
    </>
  );
};

export default PaperPage;
