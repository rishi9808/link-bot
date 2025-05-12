// app/api/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID!;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET!;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI!;

  try {
    // Exchange authorization code for access token
    const tokenRes = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token } = tokenRes.data;
    console.log('Access Token:', access_token);

    // Fetch user's profile
    const profileRes = await axios.get('https://api.linkedin.com/v2/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // // Fetch user's email
    // const emailRes = await axios.get(
    //   'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
    //   {
    //     headers: {
    //       Authorization: `Bearer ${access_token}`,
    //     },
    //   }
    // );

    const user = {
      id: profileRes.data.id,
      firstName: profileRes.data.localizedFirstName,
      lastName: profileRes.data.localizedLastName,
      // email: emailRes.data.elements[0]['handle~'].emailAddress,
    };

    // Return user data
    return NextResponse.json({ user });
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('LinkedIn OAuth error:', error.response.data);
    } else if (error instanceof Error) {
      console.error('LinkedIn OAuth error:', error.message);
    } else {
      console.error('LinkedIn OAuth error:', error);
    }
    return NextResponse.json({ error: 'OAuth failed' }, { status: 500 });
  }
}
