import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const language = searchParams.get('language');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const status = searchParams.get('status') || 'PUBLISHED';
    
    const where: any = { status };
    
    if (q) {
      where.OR = [
        { titleEn: { contains: q, mode: 'insensitive' } },
        { descShortEn: { contains: q, mode: 'insensitive' } },
        { descLongEn: { contains: q, mode: 'insensitive' } },
      ];
    }
    
    if (category) {
      where.category = { name: category };
    }
    
    if (level) {
      where.level = level;
    }
    
    if (language) {
      where.language = { contains: language, mode: 'insensitive' };
    }
    
    if (minPrice) {
      where.price = { ...where.price, gte: parseFloat(minPrice) };
    }
    
    if (maxPrice) {
      where.price = { ...where.price, lte: parseFloat(maxPrice) };
    }
    
    const courses = await prisma.course.findMany({
      where,
      include: {
        instructor: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Search failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
