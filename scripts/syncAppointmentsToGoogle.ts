import "dotenv/config";

import { google } from "googleapis";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("Starting Google Calendar sync...");

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const calendar = google.calendar({
    version: "v3",
    auth: oauth2Client,
  });

  const appointments = await prisma.appointment.findMany({
    orderBy: [
      { date: "asc" },
      { time: "asc" },
    ],
    include: {
      customer: true,
    },
  });

  console.log(`Found ${appointments.length} appointments.`);

  for (const appointment of appointments) {
    const timeMatch = appointment.time.match(
      /^(\d{1,2}):(\d{2})\s*(am|pm)$/i
    );

    if (timeMatch === null) {
      console.log(
        `Skipping ${appointment.customer.name} — invalid time: ${appointment.time}`
      );
      continue;
    }

    const hoursString = timeMatch[1];
    const minutesString = timeMatch[2];
    const period = timeMatch[3].toLowerCase();

    let hours = Number(hoursString);
    const minutes = Number(minutesString);

    if (period === "pm" && hours !== 12) {
      hours += 12;
    }

    if (period === "am" && hours === 12) {
      hours = 0;
    }

    const year = appointment.date.getUTCFullYear();
    const month = String(appointment.date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(appointment.date.getUTCDate()).padStart(2, "0");

    const startDateTime = `${year}-${month}-${day}T${String(hours).padStart(
      2,
      "0"
    )}:${String(minutes).padStart(2, "0")}:00`;

    let endHours = hours + 2;
let endMinutes = minutes + 30;

if (endMinutes >= 60) {
  endHours += 1;
  endMinutes -= 60;
}

const endDateTime = `${year}-${month}-${day}T${String(endHours).padStart(
  2,
  "0"
)}:${String(endMinutes).padStart(2, "0")}:00`;

    const eventData = {
      summary: `Aggie Nails - ${appointment.customer.name}`,
      description: [
        `Customer: ${appointment.customer.name}`,
        `Email: ${appointment.customer.email}`,
        `Phone: ${appointment.customer.phone ?? "N/A"}`,
        `Service: ${appointment.service}`,
        `Appointment Type: ${appointment.AppointmentType}`,
        `Removal: ${appointment.removalType}`,
      ].join("\n"),
      start: {
        dateTime: startDateTime,
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: endDateTime,
        timeZone: "America/Los_Angeles",
      },
    };

    if (appointment.googleEventId) {
      console.log(
        `Updating event for ${appointment.customer.name} on ${appointment.date.toLocaleDateString()} at ${appointment.time}...`
      );

      await calendar.events.update({
        calendarId: "primary",
        eventId: appointment.googleEventId,
        requestBody: eventData,
      });

      console.log(`✓ Updated ${appointment.customer.name}`);
    } else {
      console.log(
        `Creating event for ${appointment.customer.name} on ${appointment.date.toLocaleDateString()} at ${appointment.time}...`
      );

      const event = await calendar.events.insert({
        calendarId: "primary",
        requestBody: eventData,
      });

      if (!event.data.id) {
        console.log(
          `Failed to create Google event for ${appointment.customer.name}`
        );
        continue;
      }

      await prisma.appointment.update({
        where: { id: appointment.id },
        data: {
          googleEventId: event.data.id,
        },
      });

      console.log(`✓ Created ${appointment.customer.name}`);
    }
  }

  console.log("Google Calendar sync complete.");
}

main()
  .catch((error) => {
    console.error("SYNC ERROR:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });