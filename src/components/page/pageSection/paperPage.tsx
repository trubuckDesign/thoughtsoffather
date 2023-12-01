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
  mixBlendMode: "multiply",
  backgroundRepeat: "repeat",
  pointerEvents: "none",
  backgroundImage: 'url("data:image/jpeg;base64,/9j/4AAQSkZ...")', // Add the full data URL here
  zIndex: -1, // Ensure it's behind the content
});

const ContentBox = styled(Box)({
  width: "min(100%, 600px)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  margin: "auto",
  position: "relative",
});

const StyledCard = styled(Box)({
  fontFamily: '"Libre Baskerville", serif',
  padding: "20px",
  color: "#000",
  maxWidth: "600px",
  backgroundColor: "transparent", // Optional, depending on desired effect
});

interface PaperPageProps {
  contentChunk: string;
}
const PaperPage: React.FC<PaperPageProps> = ({ contentChunk }) => {
  const { setContainerHeight, setIsMeasuring } = useBookPaginationContext();

  return (
    <>
      <PaperOverlay />
      <Measure
        bounds
        key="measureComp"
        onResize={(contentRect) => {
          setContainerHeight(contentRect.bounds?.height || 100);
          setIsMeasuring(false);
        }}
      >
        {({ measureRef }) => (
          <div id="measureDiv" ref={measureRef}>
            <ContentBox>
              <StyledCard>
                <Typography variant="body1">
                  <Box dangerouslySetInnerHTML={{ __html: contentChunk }} />
                </Typography>
              </StyledCard>
            </ContentBox>
          </div>
        )}
      </Measure>
    </>
  );
};

export default PaperPage;
