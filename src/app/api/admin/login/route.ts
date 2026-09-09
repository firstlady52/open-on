import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD || 'open1234';

  if (password === adminPassword) {
    const res = NextResponse.json({ success: true });
    res.cookies.set('admin_session', 'authenticated', {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 8, // 8시간 세션 유지
    });
    return res;
  }

  return NextResponse.json({ error: '비밀번호 불일치' }, { status: 401 });
}
