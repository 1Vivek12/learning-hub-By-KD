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
      const validRoles = ['STUDENT', 'INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN'];
      if (!validRoles.includes(body.role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }

      const currentUserId = session!.user.id;
      const currentUserRole = session!.user.role;
      if (resolvedParams.id === currentUserId) {
        return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
      }

      const targetUser = await prisma.user.findUnique({ where: { id: resolvedParams.id } });
      if (!targetUser) {
         return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Security Fix: Prevent ADMIN from assigning SUPER_ADMIN
      if (body.role === 'SUPER_ADMIN' && currentUserRole !== 'SUPER_ADMIN') {
        // Optional: We can log this unauthorized escalation attempt
        await AuditService.log({
          actor: session!.user?.email ?? undefined,
          action: 'UNAUTHORIZED_ROLE_ESCALATION_ATTEMPT',
          resource: 'User',
          resourceId: resolvedParams.id,
          details: { attemptedRole: body.role },
        });
        return NextResponse.json({ error: "Only SUPER_ADMIN can assign SUPER_ADMIN role" }, { status: 403 });
      }

      // Security Fix: Prevent ADMIN from demoting/modifying an existing SUPER_ADMIN
      if (targetUser.role === 'SUPER_ADMIN' && currentUserRole !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: "Cannot modify a SUPER_ADMIN" }, { status: 403 });
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
        actor: session!.user?.email ?? undefined,
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

    const currentUserId = session!.user.id;
    const currentUserRole = session!.user.role;
    if (resolvedParams.id === currentUserId) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id: resolvedParams.id } });
    if (!targetUser) {
       return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Security Fix: Prevent ADMIN from deleting an existing SUPER_ADMIN
    if (targetUser.role === 'SUPER_ADMIN' && currentUserRole !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: "Cannot delete a SUPER_ADMIN" }, { status: 403 });
    }

    try {
      await checkLastAdmin(resolvedParams.id);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    await prisma.user.delete({ where: { id: resolvedParams.id } });
    
    await AuditService.log({
      actor: session!.user?.email ?? undefined,
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

