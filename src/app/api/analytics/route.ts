// pages/api/analytics.js

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";

async function fetchDataForTopWords() {
  const topWords = await prisma.$queryRaw`select * from analytics."topWords" tw `;
  console.log(topWords);

  return topWords;
}

async function fetchDataForSentiment() {
  const sentiment =
    await prisma.$queryRaw`select cd.title ,cd."createdAt" ,s.* from  analytics."cleanData" cd inner join analytics.sentiment s on s.thoughtid =cd."thoughtId"`;

  return sentiment;
}

export async function GET(req: NextRequest) {
  try {
    // Parse query parameters
    const requestType = req.nextUrl.searchParams.get("requestType") || "";
    let data;

    // Use a switch case to handle different request types
    switch (requestType) {
      case "TopWords":
        data = await fetchDataForTopWords();
        break;
      case "sentiment":
        data = await fetchDataForSentiment();
        break;
      default:
        return NextResponse.json(
          {
            message: "Invalid requestType",
          },
          { status: 400 }
        );
    }

    return NextResponse.json(
      {
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "There was an issue with loading the analytical data",
        error: error,
      },
      { status: 500 }
    );
  }
}
