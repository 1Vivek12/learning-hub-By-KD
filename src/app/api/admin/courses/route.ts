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

    const safeData = {
      titleEn: body.titleEn,
      titleHi: body.titleHi,
      titleHinglish: body.titleHinglish,
      descShortEn: body.descShortEn,
      descShortHi: body.descShortHi,
      descShortHinglish: body.descShortHinglish,
      descLongEn: body.descLongEn,
      descLongHi: body.descLongHi,
      descLongHinglish: body.descLongHinglish,
      slug: body.slug,
      level: body.level,
      language: body.language,
      durationHours: typeof body.durationHours === 'number' ? body.durationHours : 0,
      price: typeof body.price === 'number' ? body.price : 0,
      originalPrice: typeof body.originalPrice === 'number' ? body.originalPrice : null,
      discountPercent: typeof body.discountPercent === 'number' ? body.discountPercent : null,
      thumbnail: body.thumbnail,
      heroBanner: body.heroBanner,
      trailerUrl: body.trailerUrl,
      skills: Array.isArray(body.skills) ? body.skills : [],
      learningOutcomes: body.learningOutcomes,
      requirements: body.requirements,
      isFeatured: typeof body.isFeatured === 'boolean' ? body.isFeatured : false,
      isPopular: typeof body.isPopular === 'boolean' ? body.isPopular : false,
      categoryId: body.categoryId,
      instructorId: body.instructorId,
    };

    const course = await CourseService.createCourse(safeData);

    await AuditService.log({
      actor: session!.user?.email ?? undefined,
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
