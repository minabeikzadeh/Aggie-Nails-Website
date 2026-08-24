import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const selectedDate = new Date(body.selectedDate);
    const dateString = selectedDate.toISOString().split("T")[0];

    // Check if this date/time is already booked
    const existingAppointment = await prisma.appointment.findUnique({
      where: {
        date_time: {
          date: new Date(`${dateString}T00:00:00.000Z`),
          time: body.selectedTime,
        },
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: "That appointment time is already booked." },
        { status: 409 }
      );
    }

    // Only create Stripe checkout if the time is available
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Aggy Nails Deposit",
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],

      customer_email: body.customerEmail,

      success_url: `${request.headers.get("origin")}/booking-success`,
      cancel_url: `${request.headers.get("origin")}/book`,

      metadata: {
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerTel: body.customerTel,
        selectedService: body.selectedService,
        appointmentType: body.appointmentType,
        removalType: body.removalType,
        selectedDate: dateString,
        selectedTime: body.selectedTime,
      },
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Could not create checkout session" },
      { status: 500 }
    );
  }
}