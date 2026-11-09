# Aggie Nails 💅

A full-stack booking and payment platform for Aggie Nails, a student-run nail business serving UC Davis. It's live in production and processed **48 deposits ($960) in its first month**.

🔗 **Live:** https://www.aggienails.com

## Tech stack
Next.js · React · TypeScript · PostgreSQL · Prisma · Stripe · Resend · Google Calendar API · Vercel

## Features

### 📅 Appointment booking
Customers browse services, pick a date and time, choose the appointment type (new set, fill or natural) and removal option, and enter their contact details.

### 🔒 No double bookings
A unique constraint on `(date, time)` in PostgreSQL means two customers can never hold the same slot, even if they check out at the same moment.

### 💳 Stripe deposits
Customers pay a deposit through Stripe Checkout. The appointment is created only when the Stripe webhook reports `checkout.session.completed`, so unpaid bookings never block the calendar. The webhook verifies Stripe's signature and is idempotent: each appointment stores its Stripe session ID, so a retried event never creates a duplicate booking.

### 📧 Confirmations and reminders
Resend sends a confirmation email as soon as payment succeeds. A Vercel Cron job sends a reminder about 24 hours before each appointment and records when it went out, so nobody gets reminded twice.

### 🗓️ Google Calendar sync
Every paid booking is added to the business's Google Calendar automatically. A backfill script (`npm run sync:calendar`) syncs any appointments that are missing.

## Data model
- **Customer:** name, email, phone
- **Appointment:** date, time, service, appointment type, removal type, Stripe session ID, Google Calendar event ID, reminder timestamp

## Running locally
```bash
npm install
# create .env with: DATABASE_URL, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
# RESEND_API_KEY, CRON_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,
# GOOGLE_REDIRECT_URI, GOOGLE_REFRESH_TOKEN
npx prisma migrate dev
npm run dev
```

## What I learned
- Building and shipping a full-stack Next.js app for real, paying customers
- Designing a relational schema with Prisma and PostgreSQL
- Handling asynchronous payment confirmation safely with Stripe webhooks
- Scheduling background jobs with Vercel Cron
- Integrating the Google Calendar API with OAuth
