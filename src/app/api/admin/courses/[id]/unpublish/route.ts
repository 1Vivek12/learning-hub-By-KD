import { NextResponse } from "next/server";
import { CourseService } from "@/lib/services/courseService";
import { getApiAdmin } from "@/lib/auth/utils";
import { AuditService } from "@/lib/services/auditService";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const course = await CourseService.unpublishCourse(resolvedParams.id);

    await AuditService.log({
      actor: session!.user?.email ?? undefined,
      action: 'COURSE_UNPUBLISHED',
      resource: 'Course',
      resourceId: resolvedParams.id,
    });

    return NextResponse.json(course);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
