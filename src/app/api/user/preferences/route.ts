import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getApiSession } from "@/lib/auth/utils";

export async function GET() {
  try {
    const { session, errorResponse } = await getApiSession();
    if (errorResponse) return errorResponse;
    const userId = session!.user.id;
    
    // We use SiteSetting model to store user preferences to avoid schema changes
    // Key format: user_prefs_${userId}
    const setting = await prisma.siteSetting.findUnique({
      where: { key: `user_prefs_${userId}` }
    });

    const defaultPrefs = {
      emailMarketing: false,
      emailCourseUpdates: true,
      emailLiveClasses: true,
      emailCertificates: true,
      emailSecurity: true // Security is always true and disabled in UI
    };

    return NextResponse.json(setting ? setting.value : defaultPrefs);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { session, errorResponse } = await getApiSession();
    if (errorResponse) return errorResponse;
    const userId = session!.user.id;
    const body = await request.json();
    
    // Ensure security cannot be turned off
    const preferences = {
      ...body,
      emailSecurity: true
    };

    const setting = await prisma.siteSetting.upsert({
      where: { key: `user_prefs_${userId}` },
      update: { value: preferences },
      create: { key: `user_prefs_${userId}`, value: preferences }
    });

    return NextResponse.json(setting.value);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
