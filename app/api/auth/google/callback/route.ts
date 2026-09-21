import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return new Response("Missing authorization code", { status: 400 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);

    console.log("GOOGLE REFRESH TOKEN:");
    console.log(tokens.refresh_token);

    return NextResponse.json({
      message: "Google Calendar authorization successful!",
    });
  } catch (error) {
    console.error("GOOGLE AUTH ERROR:", error);
    return new Response("Google authorization failed", { status: 500 });
  }
}