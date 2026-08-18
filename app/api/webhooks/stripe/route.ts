import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing Stripe signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const metadata = session.metadata;

    if (!metadata) {
      return new Response("Missing booking information", { status: 400 });
    }

    const customer = await prisma.customer.create({
      data: {
        name: metadata.customerName,
        email: metadata.customerEmail,
        phone: metadata.customerTel,
      },
    });

    await prisma.appointment.create({
      data: {
        date: new Date(metadata.selectedDate),
        time: metadata.selectedTime,
        service: metadata.selectedService,
        extensions:
          metadata.appointmentType === "New" ||
          metadata.appointmentType === "Fill",
        removal: metadata.removalType !== "noRemoval",
        customerId: customer.id,
      },
    });
  }

  return new Response("OK", { status: 200 });
}