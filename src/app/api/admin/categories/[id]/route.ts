import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { AuditService } from "@/lib/services/auditService";
import { getApiAdmin } from "@/lib/auth/utils";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const body = await request.json();
    const category = await prisma.category.update({ where: { id: resolvedParams.id }, data: body });
    await AuditService.log({
      actor: (session!.user as any)?.email,
      action: 'CATEGORY_UPDATED',
      resource: 'Category',
      resourceId: resolvedParams.id,
    });
    return NextResponse.json(category);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    await prisma.category.delete({ where: { id: resolvedParams.id } });
    await AuditService.log({
      actor: (session!.user as any)?.email,
      action: 'CATEGORY_DELETED',
      resource: 'Category',
      resourceId: resolvedParams.id,
    });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
