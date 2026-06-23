import { NextResponse } from "next/server";
import { getSession, hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ errorKey: "errors.unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword, confirmPassword } =
      await request.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { errorKey: "errors.requiredFields" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { errorKey: "errors.passwordMismatch" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { errorKey: "errors.passwordTooShort" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user || !(await verifyPassword(currentPassword, user.password))) {
      return NextResponse.json(
        { errorKey: "errors.invalidCurrentPassword" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { password: await hashPassword(newPassword) },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { errorKey: "errors.passwordChangeFailed" },
      { status: 500 }
    );
  }
}
