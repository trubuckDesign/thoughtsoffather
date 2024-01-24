import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prismaClient";

export async function GET(req: NextRequest) {
  try {
    const thoughts = await prisma.thoughts.findMany({
      select: {
        thoughtId: true,
        createdAt: true,
        title: true,
      },
      where: { isExpired: false },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      {
        thoughtSummary: thoughts,
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
