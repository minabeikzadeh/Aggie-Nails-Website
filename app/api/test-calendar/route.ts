import { NextResponse } from "next/server";
import { createGoogleCalendarEvent } from "@/lib/googleCalendar";

export async function GET() {
  try {
    const eventId = await createGoogleCalendarEvent({
      customerName: "Test Customer",
      customerEmail: "test@example.com",
      service: "Gel-X",
      date: new Date("2026-09-22"),
      time: "13:00",
    });

    return NextResponse.json({
      success: true,
      eventId,
    });
  } catch (error) {
    console.error("GOOGLE CALENDAR TEST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create Google Calendar event",
      },
      { status: 500 }
    );
  }
}