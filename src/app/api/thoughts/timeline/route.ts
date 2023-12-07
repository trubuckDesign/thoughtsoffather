import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prismaClient";

interface GroupedData {
  [key: string]: {
    year: number;
    month: string;
    count: number;
  };
}

export async function GET(req: NextRequest) {
  try {
    const thoughts = await prisma.thoughts.findMany({
      select: {
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // Group and count thoughts by year and month
    const groupedData = thoughts.reduce<GroupedData>((acc, { createdAt }) => {
      const year = createdAt.getFullYear();
      const month = createdAt.toLocaleString("default", { month: "long" });
      const key = `${year}-${month}`;

      if (!acc[key]) {
        acc[key] = { year, month, count: 1 };
      } else {
        acc[key].count++;
      }

      return acc;
    }, {});

    const formattedData = Object.values(groupedData);
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
