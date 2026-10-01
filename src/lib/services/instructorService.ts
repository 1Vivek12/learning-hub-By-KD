import { prisma } from '@/lib/db/prisma';

export class InstructorService {
  static async getAllInstructors() {
    return prisma.instructor.findMany();
  }

  static async getInstructorById(id: string) {
    return prisma.instructor.findUnique({ where: { id } });
  }
}
