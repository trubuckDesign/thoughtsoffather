import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  // Check for a secret token to secure the endpoint
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.NEXT_PUBLIC_MY_SECRET_TOKEN) {
    return new NextResponse(JSON.stringify({ message: "Invalid token" }), { status: 401 });
  }

  try {
    // Trigger a revalidation of the homepage
    await revalidatePath("/");
    return new NextResponse(JSON.stringify({ revalidated: true }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "Error revalidating", error }), { status: 500 });
  }
}
