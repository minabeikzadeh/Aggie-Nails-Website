import { NextRequest } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  // Make sure only Vercel Cron can trigger this
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const now = new Date();

    // Look for appointments roughly 24 hours from now.
    const reminderWindowStart = new Date(
      now.getTime() + 23 * 60 * 60 * 1000
    );

    const reminderWindowEnd = new Date(
      now.getTime() + 25 * 60 * 60 * 1000
    );

    const appointments = await prisma.appointment.findMany({
      where: {
        reminderSentAt: null,
        date: {
          gte: reminderWindowStart,
          lte: reminderWindowEnd,
        },
      },
      include: {
        customer: true,
      },
    });

    console.log(
      `Found ${appointments.length} appointments needing reminders.`
    );

    for (const appointment of appointments) {
      const emailResult = await resend.emails.send({
        from: "Aggie Nails <hello@aggienails.com>",
        to: appointment.customer.email,
        subject: "Reminder: Your Aggie Nails appointment is tomorrow 💅",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h1>Your appointment is tomorrow! 💅</h1>

            <p>Hi ${appointment.customer.name},</p>

            <p>
              Just a reminder that you have an appointment with
              <strong>Aggie Nails</strong> tomorrow.
            </p>

            <h2>Appointment Details</h2>

            <p>
              <strong>Service:</strong> ${appointment.service}<br>
              <strong>Date:</strong> ${appointment.date.toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }
              )}<br>
              <strong>Time:</strong> ${appointment.time}<br>
              <strong>Address:</strong> 880 Alvarado Ave #207, Davis, CA 95616
            </p>

            <p>
              Please remember that there is a
              <strong>10-minute grace period</strong> for your appointment.
            </p>

            <p>
              Can't wait to see you! 💗
            </p>

            <p>
              — Mina from Aggie Nails
            </p>
          </div>
        `,
      });

      if (emailResult.error) {
        console.error(
          `Failed to send reminder to ${appointment.customer.email}:`,
          emailResult.error
        );
        continue;
      }

      // Only mark it as sent AFTER Resend succeeds.
      await prisma.appointment.update({
        where: {
          id: appointment.id,
        },
        data: {
          reminderSentAt: new Date(),
        },
      });

      console.log(
        `✓ Reminder sent to ${appointment.customer.email}`
      );
    }

    return Response.json({
      success: true,
      remindersSent: appointments.length,
    });
  } catch (error) {
    console.error("REMINDER CRON ERROR:", error);

    return new Response("Reminder job failed", {
      status: 500,
    });
  }
}