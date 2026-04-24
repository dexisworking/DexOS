import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    shippedProjects: 12,
    userReviews: 48,
    visitsToday: 142,
  });
}
