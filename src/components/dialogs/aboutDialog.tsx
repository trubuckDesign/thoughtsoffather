import React, { FC } from "react";
import { Box, Dialog, DialogContent, DialogContentText } from "@mui/material";

interface ContinueProp {
  showAbout: boolean;
  setShowAbout: React.Dispatch<React.SetStateAction<boolean>>;
}

const AboutDialog: FC<ContinueProp> = ({ showAbout, setShowAbout }) => {
  return (
    <Dialog open={showAbout} onClose={() => setShowAbout(false)}>
      <DialogContent>
        <DialogContentText>
          <Box>
            This gift is a heartfelt homage to the man who is both my father and so much more - my dad. To me, the term &apos;father&apos;
            doesn&apos;t quite capture the depth of his influence and the special bond we share. He&apos;s the one I&apos;ve always looked up to, the
            one I&apos;ve sought to emulate in so many ways. My dad is not just a parent; he&apos;s my confidant, my best friend. I am endlessly
            grateful for the joy and privilege of calling him my dad.
          </Box>
          <Box sx={{ marginTop: 4 }}>
            My dad&apos;s passion for writing and his profound respect for the past are aspects of his character that I deeply admire. To celebrate
            this, I&apos;ve created a space to safeguard his musings, his life experiences, and his reflections on days gone by. It&apos;s a legacy I
            hope to preserve and share, a way for my children and their children to discover and appreciate the rich and meaningful narratives of our
            family&apos;s journey, all penned and pondered by him.
          </Box>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default AboutDialog;
