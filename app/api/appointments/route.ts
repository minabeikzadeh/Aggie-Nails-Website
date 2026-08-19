import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Appointments must be created through Stripe checkout.",
    },
    { status: 400 }
  );
}