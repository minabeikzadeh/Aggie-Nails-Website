import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Aggie Nails Deposit",
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
        selectedDate: body.selectedDate,
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