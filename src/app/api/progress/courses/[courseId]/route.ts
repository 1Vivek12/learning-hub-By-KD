import { NextResponse } from "next/server";
import { ProgressService } from "@/lib/services/progressService";
import { getApiSession } from "@/lib/auth/utils";

export async function GET(request: Request, { params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = await params;
  try {
    const { session, errorResponse } = await getApiSession();
    if (errorResponse) return errorResponse;

    const progress = await ProgressService.getCourseProgress((session!.user as any).id, resolvedParams.courseId);
    return NextResponse.json(progress);
  } catch (error: any) {
    console.error("Error fetching course progress:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
