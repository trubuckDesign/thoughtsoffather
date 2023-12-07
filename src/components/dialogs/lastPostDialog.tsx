// LandingPage.tsx
import React, { FC, useEffect, useState } from "react";
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";

interface continueProp {
  showContinuePrompt: boolean;
  setShowContinuePrompt: React.Dispatch<React.SetStateAction<boolean>>;
  startFromBeginning: () => void;
  continueFromLastRead: () => Promise<void>;
}

const ContinueReadingDialog: FC<continueProp> = ({ showContinuePrompt, setShowContinuePrompt, startFromBeginning, continueFromLastRead }) => {
  return (
    <Dialog open={showContinuePrompt} onClose={() => setShowContinuePrompt(false)}>
      <DialogTitle>Continue Reading</DialogTitle>
      <DialogContent>
        <DialogContentText>Do you want to continue from where you left off?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={startFromBeginning} color="primary">
          Start from Beginning
        </Button>
        <Button onClick={continueFromLastRead} color="primary" autoFocus>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContinueReadingDialog;
