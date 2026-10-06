import { NextResponse } from "next/server";
import { CategoryService } from "@/lib/services/categoryService";
import { AuditService } from "@/lib/services/auditService";
import { getApiAdmin } from "@/lib/auth/utils";

export async function GET() {
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const categories = await CategoryService.getAllCategories();
    return NextResponse.json(categories);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const body = await request.json();
    
    if (!body.name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }
    
    const safeData = {
      name: body.name,
      description: body.description,
    };
    
    const category = await CategoryService.createCategory(safeData);
    await AuditService.log({
      actor: session!.user?.email ?? undefined,
      action: 'CATEGORY_CREATED',
      resource: 'Category',
      resourceId: category.id,
      details: { name: body.name },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
