import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

// Utility function to buffer the request body
async function bufferRequestBody(request: Request) {
  const requestBodyBuffer = await request.arrayBuffer();
  return Buffer.from(requestBodyBuffer);
}

// Function to optimize image with Tinify
async function optimizeImageWithTinify(imageBuffer: Buffer) {
  const tinifyUrl = "https://api.tinify.com/shrink";
  const authHeader = "Basic " + Buffer.from(`api:${process.env.TINIFY_API_KEY}`).toString("base64");

  const tinifyResponse = await fetch(tinifyUrl, {
    method: "POST",
    headers: { Authorization: authHeader, "Content-Type": "application/octet-stream" },
    body: imageBuffer,
  });

  if (!tinifyResponse.ok) {
    throw new Error(`Tinify API responded with status: ${tinifyResponse.status}`);
  }

  return tinifyResponse.json();
}

// Function to download the optimized image
async function downloadOptimizedImage(url: string) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer);
}

// Function to upload image to Vercel Blob
async function uploadToVercelBlob(filename: string, imageBuffer: Buffer) {
  return put(filename, imageBuffer, { access: "public" });
}

// Utility function to fetch and encode image
async function fetchAndEncodeImage(url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return `data:${response.headers.get("content-type")};base64,${Buffer.from(arrayBuffer).toString("base64")}`;
}
//-----------------------------------ROUTES --------------------------------------
export async function GET(request: NextRequest): Promise<NextResponse> {
  const url: string | null = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ message: "No url" }, { status: 500 });
  }

  try {
    const base64Image = await fetchAndEncodeImage(url);
    return new NextResponse(base64Image, { status: 200 });
  } catch (error) {
    console.log("IMG Error:", error);
    return NextResponse.json({ message: "Error processing the image request", error: error }, { status: 500 });
  }
}
// Refactored POST function
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename") ?? "optimized_image.png";

    if (request.body && filename) {
      const imageBuffer = await bufferRequestBody(request);
      const tinifyData = await optimizeImageWithTinify(imageBuffer);
      console.log(tinifyData.output);
      const optimizedImageBuffer = await downloadOptimizedImage(tinifyData.output.url);
      const optimizedBlob = await uploadToVercelBlob(filename, optimizedImageBuffer);

      return NextResponse.json(optimizedBlob);
    }

    return NextResponse.json({ message: "nothing there" }, { status: 404 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error with uploading and optimizing Image" }, { status: 500 });
  }
}
