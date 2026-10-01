import { NextResponse } from "next/server";
import { UserService } from "@/lib/services/userService";
import { AuditService } from "@/lib/services/auditService";
import { getApiAdmin } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";

async function checkLastAdmin(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) {
    const adminCount = await prisma.user.count({
      where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } }
    });
    if (adminCount <= 1) {
      throw new Error("Cannot remove the last remaining admin account");
    }
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const body = await request.json();
    
    if (body.role) {
      const currentUserId = (session!.user as any).id;
      if (resolvedParams.id === currentUserId) {
        return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
      }

      const targetUser = await prisma.user.findUnique({ where: { id: resolvedParams.id } });
      if (!targetUser) {
         return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      if ((targetUser.role === 'ADMIN' || targetUser.role === 'SUPER_ADMIN') && (body.role !== 'ADMIN' && body.role !== 'SUPER_ADMIN')) {
        try {
          await checkLastAdmin(resolvedParams.id);
        } catch (err: any) {
          return NextResponse.json({ error: err.message }, { status: 400 });
        }
      }

      const user = await UserService.updateUserRole(resolvedParams.id, body.role);
      await AuditService.log({
        actor: (session!.user as any)?.email,
        action: 'USER_ROLE_CHANGED',
        resource: 'User',
        resourceId: resolvedParams.id,
        details: { newRole: body.role },
      });
      return NextResponse.json(user);
    }
    
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;

    const currentUserId = (session!.user as any).id;
    if (resolvedParams.id === currentUserId) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    try {
      await checkLastAdmin(resolvedParams.id);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    await prisma.user.delete({ where: { id: resolvedParams.id } });
    
    await AuditService.log({
      actor: (session!.user as any)?.email,
      action: 'USER_DELETED',
      resource: 'User',
      resourceId: resolvedParams.id,
      details: {},
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

