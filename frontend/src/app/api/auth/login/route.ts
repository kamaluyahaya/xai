import { NextResponse } from 'next/server';
import {
  createSessionToken,
  getAdminPassword,
  getAuthSecret,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from '@/lib/auth';

export async function POST(request: Request) {
  let password = '';

  try {
    const body = await request.json();
    if (typeof body?.password === 'string') {
      password = body.password;
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!password || password !== getAdminPassword()) {
    return NextResponse.json(
      { error: 'Incorrect administrator password.' },
      { status: 401 }
    );
  }

  const token = await createSessionToken(getAdminPassword(), getAuthSecret());
  const response = NextResponse.json({ success: true });

  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });

  return response;
}
