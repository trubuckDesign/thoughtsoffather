import { Card, Grid, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

export interface ImageTextProps {
  imageSrc: string;
  text: string;
}

export const ImageText: React.FC<ImageTextProps> = ({ imageSrc, text }) => (
  <Grid item xs={12} sm={6}>
    <Image src={imageSrc} alt="Story image" layout="responsive" width={100} height={100} />
    <Typography variant="body1">{text}</Typography>
  </Grid>
);
