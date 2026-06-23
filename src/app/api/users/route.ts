import { NextResponse } from "next/server";
import { hashPassword, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireAdmin();

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        _count: { select: { carnets: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      users.map((user) => ({
        id: user.id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        carnetsCount: user._count.carnets,
      }))
    );
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ errorKey: "errors.forbidden" }, { status: 403 });
    }
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ errorKey: "errors.unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { errorKey: "errors.fetchUsers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { errorKey: "errors.requiredFields" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { errorKey: "errors.passwordTooShort" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json(
        { errorKey: "errors.duplicateUsername" },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        username,
        password: await hashPassword(password),
        role: "USER",
      },
      select: { id: true, username: true, role: true, createdAt: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ errorKey: "errors.forbidden" }, { status: 403 });
    }
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ errorKey: "errors.unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { errorKey: "errors.createUser" },
      { status: 500 }
    );
  }
}
