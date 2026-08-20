import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "Date is required" },
        { status: 400 }
      );
    }

    const start = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(`${date}T00:00:00.000Z`);
    end.setUTCDate(end.getUTCDate() + 1);

    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: start,
          lt: end,
        },
      },
      select: {
        time: true,
      },
    });

    return NextResponse.json({
      bookedTimes: appointments.map((appointment) => appointment.time),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Could not load availability" },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { error: "Appointments must be created through Stripe checkout." },
    { status: 400 }
  );
}