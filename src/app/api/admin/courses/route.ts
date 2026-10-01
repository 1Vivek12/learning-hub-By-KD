import { NextResponse } from "next/server";
import { CourseService } from "@/lib/services/courseService";
import { AuditService } from "@/lib/services/auditService";
import { getApiAdmin } from "@/lib/auth/utils";

export async function GET() {
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const courses = await CourseService.getAllCoursesAdmin();
    return NextResponse.json(courses);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const body = await request.json();

    if (!body.titleEn || !body.slug) {
      return NextResponse.json({ error: "titleEn and slug are required" }, { status: 400 });
    }

    const course = await CourseService.createCourse(body);

    await AuditService.log({
      actor: (session!.user as any)?.email,
      action: 'COURSE_CREATED',
      resource: 'Course',
      resourceId: course.id,
      details: { titleEn: body.titleEn, slug: body.slug },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error: any) {
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "A course with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
