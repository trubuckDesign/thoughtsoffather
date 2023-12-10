import { NextRequest, NextResponse } from "next/server";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../prisma/prismaClient";

export async function GET(req: NextRequest, { params }: { params: { thoughtId: number } }) {
  try {
    const post = await prisma.thoughts.findUnique({
      where: { thoughtId: Number(params.thoughtId) },
    });

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ message: "Unable to fetch messages", error }, { status: 500 });
  }
}
export async function PUT(req: NextRequest, { params }: { params: { thoughtId: number } }) {
  const { title, content } = await req.json();

  // Validate input
  if (!params.thoughtId || !title || !content) {
    return NextResponse.json({ message: "Missing Fields" }, { status: 400 });
  }

  try {
    const updatedThought = await prisma.thoughts.update({
      where: {
        thoughtId: Number(params.thoughtId),
      },
      data: {
        title,
        content,
      },
    });

    return NextResponse.json(updatedThought, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to fetch messages", error }, { status: 500 });
  }
}
