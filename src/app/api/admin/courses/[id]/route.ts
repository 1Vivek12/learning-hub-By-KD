import { NextResponse } from "next/server";
import { CourseService } from "@/lib/services/courseService";
import { getApiAdmin } from "@/lib/auth/utils";
import { AuditService } from "@/lib/services/auditService";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const course = await CourseService.getCourseById(resolvedParams.id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json(course);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const body = await request.json();
    const safeData: any = {};
    const allowedFields = [
      'titleEn', 'titleHi', 'titleHinglish',
      'descShortEn', 'descShortHi', 'descShortHinglish',
      'descLongEn', 'descLongHi', 'descLongHinglish',
      'slug', 'level', 'language', 'durationHours',
      'price', 'originalPrice', 'discountPercent',
      'thumbnail', 'heroBanner', 'trailerUrl',
      'skills', 'learningOutcomes', 'requirements',
      'isFeatured', 'isPopular', 'categoryId', 'instructorId'
    ];
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        safeData[field] = body[field];
      }
    }

    const course = await CourseService.updateCourse(resolvedParams.id, safeData);

    await AuditService.log({
      actor: session!.user?.email ?? undefined,
      action: 'COURSE_UPDATED',
      resource: 'Course',
      resourceId: resolvedParams.id,
    });

    return NextResponse.json(course);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    await CourseService.deleteCourse(resolvedParams.id);

    await AuditService.log({
      actor: session!.user?.email ?? undefined,
      action: 'COURSE_DELETED',
      resource: 'Course',
      resourceId: resolvedParams.id,
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    
    if (error.message === 'COURSE_HAS_ENROLLMENTS') {
      return NextResponse.json({ error: "Cannot delete a course with active enrollments" }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
