import React from "react";
import { Typography, Box } from "@mui/material";
import { styled } from "@mui/system";
import Measure from "react-measure";
import { useBookPaginationContext } from "@/store/BookStore";

const PaperOverlay = styled(Box)({
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  maxHeight: "100%",
  mixBlendMode: "multiply",
  backgroundRepeat: "repeat",
  pointerEvents: "none",
  backgroundImage: 'url("data:image/jpeg;base64,/9j/4AAQSkZ...")', // Add the full data URL here
  zIndex: -1, // Ensure it's behind the content
});

const ContentBox = styled(Box)({
  width: "min(100%, 600px)",
  maxHeight: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  margin: "auto",
  position: "relative",
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
const MeasureContainer = styled("div")({
  width: "100%",
  height: "100%", // Ensures it takes up all available space
});
const PaperPage: React.FC<PaperPageProps> = ({ contentChunk }) => {
  const { setContainerHeight, setIsMeasuring } = useBookPaginationContext();

  return (
    <>
      <PaperOverlay id="paperOverlay" />
      <Measure
        bounds
        key="measureComp"
        onResize={(contentRect) => {
          setContainerHeight(contentRect.bounds?.height || 100);
          setIsMeasuring(false);
        }}
      >
        {({ measureRef }) => (
          <MeasureContainer id="measureContainer" ref={measureRef}>
            <ContentBox id="contentBox">
              <StyledCard id="styledCard">
                <Typography variant="body1">
                  <Box id="contentBoxInner" dangerouslySetInnerHTML={{ __html: contentChunk }} />
                </Typography>
              </StyledCard>
            </ContentBox>
          </MeasureContainer>
        )}
      </Measure>
    </>
  );
};

export default PaperPage;
