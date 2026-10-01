import { NextResponse } from "next/server";
import { InstructorService } from "@/lib/services/instructorService";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const instructor = await InstructorService.getInstructorById(resolvedParams.id);
    if (!instructor) {
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 });
    }
    return NextResponse.json(instructor);
  } catch (error) {
    console.error("Failed to fetch instructor:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
