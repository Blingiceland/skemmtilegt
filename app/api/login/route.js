import { NextResponse } from 'next/server';

const PASSWORD = 'leidinlegt.is';

export async function POST(req) {
  let password = '';
  try {
    const body = await req.json();
    password = body?.password || '';
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (password === PASSWORD) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set('gate', 'ok', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
    return res;
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
