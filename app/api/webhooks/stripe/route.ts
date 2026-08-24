import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY);


//Stripe process
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

           // Send confirmation email
        const emailResult = await resend.emails.send({
      from: "Aggie Nails <hello@aggienails.com>",
      to: metadata.customerEmail,
      subject: "Your Aggie Nails appointment is confirmed 💅",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h1>Your appointment is confirmed! 💅</h1>
    
          <p>Hi ${metadata.customerName},</p>
    
          <p>
            Thank you for booking with Aggy Nails!
            Your appointment has been confirmed.
          </p>
    
          <h2>Appointment Details</h2>
    
          <p>
            <strong>Service:</strong> ${metadata.selectedService}<br>
            <strong>Date:</strong> ${metadata.selectedDate}<br>
            <strong>Time:</strong> ${metadata.selectedTime}
            <strong>Address:</strong> 880 Alvarado Ave #207, Davis, CA 95616
          </p>
    
          <p>
            <strong>Arrival:</strong> Please note that there is a 10-minute grace period for your appointment.
        </p>

          <h2>Payment</h2>
          <p>
            <strong>$20 deposit:</strong> Paid<br>
            <strong>Remaining Balance:</strong> Due at your appointment<br>

            The $20 deposit will be applied toward your total service price.
          </p>
    
          <p>Can't wait to see you! 💗</p>
    
          <p>— Mina from Aggie Nails</p>
        </div>
      `,
    });
    
    console.log("RESEND ERROR:", emailResult.error);
    console.log("RESEND DATA:", emailResult.data);

    } catch (error) {
      console.error("WEBHOOK DATABASE/EMAIL ERROR:", error);
      return new Response("Database or email error", { status: 500 });
    }
  }


  return new Response("OK", { status: 200 });
}