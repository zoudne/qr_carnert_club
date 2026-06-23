import { NextResponse } from "next/server";
import { hashPassword, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/lib/permissions";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    const { id } = await context.params;
    const userId = parseInt(id, 10);

    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      return NextResponse.json(
        { errorKey: "errors.userNotFound" },
        { status: 404 }
      );
    }

    const { username, password, role } = await request.json();

    if (!username) {
      return NextResponse.json(
        { errorKey: "errors.requiredFields" },
        { status: 400 }
      );
    }

    if (password && password.length < 6) {
      return NextResponse.json(
        { errorKey: "errors.passwordTooShort" },
        { status: 400 }
      );
    }

    const newRole = (role as UserRole) || existing.role;
    if (newRole !== "ADMIN" && newRole !== "USER") {
      return NextResponse.json(
        { errorKey: "errors.requiredFields" },
        { status: 400 }
      );
    }

    if (
      existing.role === "ADMIN" &&
      newRole === "USER" &&
      session.userId === userId
    ) {
      const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
      if (adminCount <= 1) {
        return NextResponse.json(
          { errorKey: "errors.cannotDemoteLastAdmin" },
          { status: 400 }
        );
      }
    }

    if (username !== existing.username) {
      const duplicate = await prisma.user.findUnique({ where: { username } });
      if (duplicate) {
        return NextResponse.json(
          { errorKey: "errors.duplicateUsername" },
          { status: 409 }
        );
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        role: newRole,
        ...(password ? { password: await hashPassword(password) } : {}),
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        _count: { select: { carnets: true } },
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        carnetsCount: user._count.carnets,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ errorKey: "errors.forbidden" }, { status: 403 });
    }
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ errorKey: "errors.unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { errorKey: "errors.updateUser" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    const { id } = await context.params;
    const userId = parseInt(id, 10);

    if (session.userId === userId) {
      return NextResponse.json(
        { errorKey: "errors.cannotDeleteSelf" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      return NextResponse.json(
        { errorKey: "errors.userNotFound" },
        { status: 404 }
      );
    }

    if (existing.role === "ADMIN") {
      return NextResponse.json(
        { errorKey: "errors.cannotDeleteAdmin" },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.carnet.updateMany({
        where: { createdById: userId },
        data: { createdById: null },
      }),
      prisma.user.delete({ where: { id: userId } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ errorKey: "errors.forbidden" }, { status: 403 });
    }
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ errorKey: "errors.unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { errorKey: "errors.deleteUser" },
      { status: 500 }
    );
  }
}
