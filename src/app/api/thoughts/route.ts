import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/prismaClient";

export async function GET(req: NextRequest) {
  const pageCount = parseInt(req.nextUrl.searchParams.get("thoughtCount") as string) || 0;
  const startId = parseInt(req.nextUrl.searchParams.get("startId") as string) || 0;
  console.log("pageCount/startId:", pageCount, startId);
  try {
    const posts = await prisma.thoughts.findMany({
      take: pageCount,
      where: { isExpired: false, thoughtId: { gte: startId } },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(
      {
        posts,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "There was an issue with loading the thoughts",
        error: error,
      },
      { status: 500 }
    );
  }
}
export async function POST(req: NextRequest) {
  try {
    const { title, content } = await req.json();

    // Validate input
    if (!title || !content) {
      return NextResponse.json({ message: "Missing Fields" }, { status: 400 });
    }

    try {
      const newThought = await prisma.thoughts.create({
        data: {
          title,
          content,
        },
      });
      return NextResponse.json({ message: "Success", newThought }, { status: 200 });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ message: "Server Error with uploading thought" }, { status: 500 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server Error with uploading thought" }, { status: 500 });
  }
}
