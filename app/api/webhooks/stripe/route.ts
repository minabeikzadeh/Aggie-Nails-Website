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
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const metadata = session.metadata;
      
        console.log("STRIPE PAYMENT RECEIVED:", session.id);
        console.log("BOOKING METADATA:", metadata);
      
        if (!metadata) {
          return new Response("Missing booking information", { status: 400 });
        }
      
        try {
          const existingAppointment = await prisma.appointment.findUnique({
            where: {
              stripeSessionId: session.id,
            },
          });
      
          if (existingAppointment) {
            console.log("DUPLICATE EVENT - APPOINTMENT ALREADY EXISTS");
            return new Response("Already processed", { status: 200 });
          }
      
          const customer = await prisma.customer.create({
            data: {
              name: metadata.customerName,
              email: metadata.customerEmail,
              phone: metadata.customerTel,
            },
          });
      
          console.log("CUSTOMER CREATED:", customer.id);
      
          const appointment = await prisma.appointment.create({
            data: {
              stripeSessionId: session.id,
              date: new Date(metadata.selectedDate),
              time: metadata.selectedTime,
              service: metadata.selectedService,
      
              AppointmentType:
                metadata.appointmentType === "New"
                  ? "NEW"
                  : metadata.appointmentType === "Fill"
                  ? "FILL"
                  : "NATURAL",
      
              removalType:
                metadata.removalType === "LocalRemoval"
                  ? "LOCAL"
                  : metadata.removalType === "foreignRemoval"
                  ? "FOREIGN"
                  : "NONE",
      
              customerId: customer.id,
            },
          });
      
          console.log("APPOINTMENT CREATED:", appointment.id);
      
        } catch (error) {
          console.error("WEBHOOK DATABASE ERROR:", error);
          return new Response("Database error", { status: 500 });
        }
      }
  }

  return new Response("OK", { status: 200 });
}