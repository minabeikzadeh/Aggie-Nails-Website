import { google } from "googleapis";

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

export async function createGoogleCalendarEvent({
  customerName,
  customerEmail,
  service,
  date,
  time,
}: {
  customerName: string;
  customerEmail: string;
  service: string;
  date: Date;
  time: string;
}) {
  const timeMatch = time.match(
    /^(\d{1,2}):(\d{2})\s*(am|pm)$/i
  );

  if (timeMatch === null) {
    throw new Error(`Invalid appointment time: ${time}`);
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

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  const startDateTime = `${year}-${month}-${day}T${String(
    hours
  ).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;

  // 2 hours and 30 minutes
  let endHours = hours + 2;
  let endMinutes = minutes + 30;

  if (endMinutes >= 60) {
    endHours += 1;
    endMinutes -= 60;
  }

  const endDateTime = `${year}-${month}-${day}T${String(
    endHours
  ).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}:00`;

  const event = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: `💅 ${service} — ${customerName}`,

      description: `
Customer: ${customerName}
Email: ${customerEmail}
Service: ${service}
Booked through Aggie Nails.
      `.trim(),

      location: "880 Alvarado Ave #207, Davis, CA 95616",

      start: {
        dateTime: startDateTime,
        timeZone: "America/Los_Angeles",
      },

      end: {
        dateTime: endDateTime,
        timeZone: "America/Los_Angeles",
      },
    },
  });

  if (!event.data.id) {
    throw new Error("Google Calendar event was created without an event ID.");
  }

  return event.data.id;
}