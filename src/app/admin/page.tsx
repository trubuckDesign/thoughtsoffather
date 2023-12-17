"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Box, Button, List, ListItem, TextField } from "@mui/material";

type BlobWithUrl = {
  url: string;
  size: number;
};

const BlobList = () => {
  const [blobs, setBlobs] = useState<BlobWithUrl[]>([]);
  const [selectedImage, setSelectedImage] = useState<BlobWithUrl | null>(null);

  useEffect(() => {
    const fetchBlobs = async () => {
      try {
        const response = await fetch("/api/blobs");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: BlobWithUrl[] = await response.json();
        data.sort((a, b) => a.size - b.size); // Sorting by size
        setBlobs(data);
      } catch (error) {
        console.error("Error fetching blobs:", error);
      }
    };

    fetchBlobs();
  }, []);

  return (
    <div>
      {selectedImage && (
        <Box position="fixed" top={0} left={0} zIndex="modal" bgcolor="background.paper" p={2} border={1} borderColor="grey.300">
          <Image src={selectedImage.url} alt="Selected Blob" width={500} height={300} />
          <Button variant="contained" color="primary" onClick={() => setSelectedImage(null)}>
            Close
          </Button>
        </Box>
      )}

      <List>
        {blobs.map((blob) => (
          <ListItem key={blob.url} onClick={() => setSelectedImage(blob)}>
            <TextField
              fullWidth
              label="URL"
              value={blob.url}
              InputProps={{
                readOnly: true,
                sx: { bgcolor: "background.paper" }, // Set the background color
              }}
              variant="outlined"
              margin="dense"
            />
            <TextField
              fullWidth
              label="Size"
              value={`${blob.size} bytes`}
              InputProps={{
                readOnly: true,
                sx: { bgcolor: "background.paper" }, // Set the background color
              }}
              variant="outlined"
              margin="dense"
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default BlobList;
