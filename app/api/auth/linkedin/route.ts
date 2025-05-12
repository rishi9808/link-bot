// app/api/auth/linkedin/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.LINKEDIN_CLIENT_ID!;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI!;
  const state = 'foobar'; // Replace with a secure, random string in production

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=openid%20profile%20email&state=${state}`;

  return NextResponse.json({ authUrl });
}
