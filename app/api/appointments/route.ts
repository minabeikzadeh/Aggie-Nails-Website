import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const customer = await prisma.customer.create({
      data: {
        name: body.customerName,
        email: body.customerEmail,
        phone: body.customerTel,
      },
    });

    const appointment = await prisma.appointment.create({
        data: {
          date: new Date(body.selectedDate),
          time: body.selectedTime,
          service: body.selectedService,
          extensions:
            body.appointmentType === "New" ||
            body.appointmentType === "Fill",
          removal: body.removalType !== "noRemoval",
          customerId: customer.id,
        },
      });

    return NextResponse.json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Could not create appointment" },
      { status: 500 }
    );
  }
}