import { prisma } from '@/lib/db/prisma';

export class CategoryService {
  static async getAllCategories() {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  static async createCategory(data: any) {
    return prisma.category.create({ data });
  }
}
