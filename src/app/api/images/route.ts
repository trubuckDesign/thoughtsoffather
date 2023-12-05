import { put } from "@vercel/blob";
import { PageConfig } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename") ?? "optimized_image.png";

    if (request.body && filename) {
      // Buffer the request body
      const requestBodyBuffer = await request.arrayBuffer();
      const imageBuffer = Buffer.from(requestBodyBuffer);

      // Send to Tinify for optimization
      const tinifyUrl = "https://api.tinify.com/shrink";
      const authHeader = "Basic " + Buffer.from(`api:${process.env.TINIFY_API_KEY}`).toString("base64");

      const tinifyResponse = await fetch(tinifyUrl, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/octet-stream",
        },
        body: imageBuffer,
      });

      if (!tinifyResponse.ok) {
        throw new Error(`Tinify API responded with status: ${tinifyResponse.status}`);
      }

      const tinifyData = await tinifyResponse.json();
      console.log(tinifyData);
      // Download the optimized image
      const optimizedImageResponse = await fetch(tinifyData.output.url);
      const optimizedImageBuffer = await optimizedImageResponse.arrayBuffer();

      // Upload the optimized image to Vercel Blob
      const optimizedBlob = await put(filename, Buffer.from(optimizedImageBuffer), {
        access: "public",
      });

      return NextResponse.json(optimizedBlob);
    }

    return NextResponse.json({ message: "nothing there" }, { status: 404 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error with uploading and optimizing Image" }, { status: 500 });
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const url: string | null = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ message: "No url" }, { status: 500 });
  }

  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    return new NextResponse(`data:${response.headers.get("content-type")};base64,${base64Image}`, { status: 200 });
  } catch (error) {
    console.log("IMG Error:", error);
    return NextResponse.json({ message: "Error processing the image request", error: error }, { status: 500 });
  }
}
