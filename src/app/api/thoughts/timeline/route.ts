import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prismaClient";

export async function GET(req: NextRequest) {
  try {
    const timelineData = await prisma.thoughts.groupBy({
      by: ["createdAt"],
      _count: {
        thoughtId: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Transform the data into the desired format
    const formattedData = timelineData.map((entry) => {
      const date = new Date(entry.createdAt);
      return {
        year: date.getFullYear(),
        month: date.toLocaleString("default", { month: "long" }),
        count: entry._count.thoughtId,
      };
    });
    return NextResponse.json(
      {
        formattedData,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "There was an issue with loading timeline",
        error: error,
      },
      { status: 500 }
    );
  }
}
