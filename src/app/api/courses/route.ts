import { NextResponse } from "next/server";
import { CourseService } from "@/lib/services/courseService";

export async function GET() {
  try {
    const courses = await CourseService.getPublishedCourses();
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
