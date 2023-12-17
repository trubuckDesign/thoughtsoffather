"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

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
        <div>
          <Image src={selectedImage.url} alt="Selected Blob" width={500} height={300} />
          <button onClick={() => setSelectedImage(null)}>Close</button>
        </div>
      )}

      <ul>
        {blobs.map((blob) => (
          <li key={blob.url} onClick={() => setSelectedImage(blob)}>
            URL: {blob.url}, Size: {blob.size} bytes
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlobList;
