import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, Grid, Button } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import EmailIcon from "@mui/icons-material/Email";
import TextsmsIcon from "@mui/icons-material/Textsms";

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  shareUrl: string;
  thoughtTitle: string;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ open, onClose, shareUrl, thoughtTitle }) => {
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const emailShareUrl = `mailto:?subject=${encodeURIComponent(thoughtTitle)}&body=${encodeURIComponent(shareUrl)}`;
  const textShareUrl = `sms:?&body=${encodeURIComponent(thoughtTitle + " " + shareUrl)}`;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Share this Post</DialogTitle>
      <DialogContent>
        <DialogContentText>Copy the link below to share:</DialogContentText>
        <TextField autoFocus fullWidth variant="outlined" value={shareUrl} InputProps={{ readOnly: true }} />
        <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 2 }}>
          <Grid item>
            <Button startIcon={<TwitterIcon />} variant="outlined" href={twitterShareUrl} target="_blank">
              Twitter
            </Button>
          </Grid>
          <Grid item>
            <Button startIcon={<FacebookIcon />} variant="outlined" href={facebookShareUrl} target="_blank">
              Facebook
            </Button>
          </Grid>
          <Grid item>
            <Button startIcon={<EmailIcon />} variant="outlined" href={emailShareUrl} target="_blank">
              Email
            </Button>
          </Grid>
          <Grid item>
            <Button startIcon={<TextsmsIcon />} variant="outlined" href={textShareUrl} target="_blank">
              Text
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
