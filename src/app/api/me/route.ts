import { NextResponse } from "next/server";
import { getApiSession } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const { session, errorResponse } = await getApiSession();
    if (errorResponse) return errorResponse;
    const user = await prisma.user.findUnique({
      where: { id: session!.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
      }
    });
    return NextResponse.json(user);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { session, errorResponse } = await getApiSession();
    if (errorResponse) return errorResponse;
    const body = await request.json();
    const { name, avatar } = body;
    
    const user = await prisma.user.update({
      where: { id: session!.user.id },
      data: {
        ...(name && { name }),
        ...(avatar !== undefined && { avatar }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
      }
    });
    
    return NextResponse.json(user);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
