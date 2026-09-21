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
  const [hours, minutes] = time.split(":").map(Number);

  const start = new Date(date);
  start.setHours(hours, minutes, 0, 0);

  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 120);

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
        dateTime: start.toISOString(),
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: "America/Los_Angeles",
      },
    },
  });

  return event.data.id;
}