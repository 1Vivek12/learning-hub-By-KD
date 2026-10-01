import { NextResponse } from "next/server";
import { CourseService } from "@/lib/services/courseService";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  try {
    const course = await CourseService.getCourseBySlug(resolvedParams.slug);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json(course);
  } catch (error) {
    console.error("Failed to fetch course:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
