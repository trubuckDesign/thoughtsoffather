export const revalidate = 0;
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/prismaClient";

export async function GET(req: NextRequest) {
  const endDate = new Date(req.nextUrl.searchParams.get("endDate") as string) || new Date();
  const startDate = new Date(req.nextUrl.searchParams.get("startDate") as string) || new Date();
  const limitCount: number = parseInt(req.nextUrl.searchParams.get("postPerPage") as string) || 3;
  try {
    const posts = await prisma.thoughts.findMany({
      take: limitCount,
      where: { isExpired: false, createdAt: { lte: startDate } },
      orderBy: {
        createdAt: "desc",
      },
    });
    const response = NextResponse.json(
      {
        posts,
      },
      { status: 200 }
    );
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
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
