// LandingPage.tsx
import React, { FC, useEffect, useState } from "react";
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";

interface continueProp {
  showAbout: boolean;
  setShowAbout: React.Dispatch<React.SetStateAction<boolean>>;
}

const AboutDialog: FC<continueProp> = ({ showAbout, setShowAbout }) => {
  return (
    <Dialog open={showAbout} onClose={() => setShowAbout(false)}>
      <DialogContent>
        <DialogContentText>
          <Box>
            This gift is a heartfelt homage to the man who is both my father and so much more - my dad. To me, the term 'father' doesn't quite capture
            the depth of his influence and the special bond we share. He's the one I've always looked up to, the one I've sought to emulate in so many
            ways. My dad is not just a parent; he's my confidant, my best friend. I am endlessly grateful for the joy and privilege of calling him my
            dad.
          </Box>
          <Box sx={{ marginTop: 4 }}>
            My dad's passion for writing and his profound respect for the past are aspects of his character that I deeply admire. To celebrate this,
            I've created a space to safeguard his musings, his life experiences, and his reflections on days gone by. It's a legacy I hope to preserve
            and share, a way for my children and their children to discover and appreciate the rich and meaningful narratives of our family's journey,
            all penned and pondered by him.
          </Box>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default AboutDialog;
