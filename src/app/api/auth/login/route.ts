import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { errorKey: "errors.loginRequired" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json(
        { errorKey: "errors.invalidCredentials" },
        { status: 401 }
      );
    }

    await createSession(user.id, user.username);

    return NextResponse.json({ success: true, username: user.username });
  } catch {
    return NextResponse.json(
      { errorKey: "errors.loginFailed" },
      { status: 500 }
    );
  }
}
