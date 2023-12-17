import { list } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Ensure the token is set in environment variables
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      throw new Error("Missing BLOB_READ_WRITE_TOKEN");
    }

    const { blobs } = await list({ token });

    // Optionally, filter or modify the blobs data as needed
    const blobData = blobs.map((blob) => ({
      url: blob.url,
      size: blob.size,
    }));

    return NextResponse.json(blobData);
  } catch (error) {
    console.error("Error listing blobs:", error);
    return NextResponse.json({ message: "Error listing blobs", error: error }, { status: 500 });
  }
}
