import { NextRequest, NextResponse } from "next/server";
import { authenticateAndAuthorize } from "../auth/authenticate";
import prisma from "../../../../prisma/prismaClient";

export async function GET(req: NextRequest) {
  // Authentication and Basic Authorization
  const { status, message, userAcct } = await authenticateAndAuthorize(req, prisma);

  if (status !== 200) {
    return NextResponse.json({ message }, { status });
  }

  // If you reach this point, userAcct should not be null or undefined.
  // However, you can still double-check if you'd like.
  if (!userAcct) {
    return NextResponse.json({ message: "User account is undefined" }, { status: 500 });
  }

  // Construct the user account with relations (if any)

  return NextResponse.json(
    {
      isAuthorized: userAcct,
    },
    {
      status: 200,
    }
  );
}
