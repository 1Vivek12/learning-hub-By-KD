import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '@/lib/db/prisma';
import { LiveClassService } from '@/lib/services/liveClassService';

// Mock Prisma
vi.mock('@/lib/db/prisma', () => ({
  prisma: {
    liveClass: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    course: {
      findUnique: vi.fn(),
    }
  }
}));

describe('Instructor Ownership Security', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Instructor A can update their own Live Class', async () => {
    vi.mocked(prisma.liveClass.findUnique).mockResolvedValue({ id: 'class-1', courseId: 'course-1' } as any);
    vi.mocked(prisma.course.findUnique).mockResolvedValue({ id: 'course-1', instructor: { userId: 'inst-1' } } as any);
    vi.mocked(prisma.liveClass.update).mockResolvedValue({ id: 'class-1' } as any);
    
    // Should not throw
    await expect(
      LiveClassService.updateClass('inst-1', 'INSTRUCTOR', 'class-1', {})
    ).resolves.not.toThrow();
  });

  it('Instructor B CANNOT update Instructor A Live Class', async () => {
    vi.mocked(prisma.liveClass.findUnique).mockResolvedValue({ id: 'class-1', courseId: 'course-1' } as any);
    vi.mocked(prisma.course.findUnique).mockResolvedValue({ id: 'course-1', instructor: { userId: 'inst-1' } } as any);

    await expect(
      LiveClassService.updateClass('inst-2', 'INSTRUCTOR', 'class-1', {})
    ).rejects.toThrow('UNAUTHORIZED_INSTRUCTOR_ACCESS');
  });
  
  it('ADMIN can update any Live Class', async () => {
    vi.mocked(prisma.liveClass.findUnique).mockResolvedValue({ id: 'class-1', courseId: 'course-1' } as any);
    vi.mocked(prisma.course.findUnique).mockResolvedValue({ id: 'course-1', instructor: { userId: 'inst-1' } } as any);
    vi.mocked(prisma.liveClass.update).mockResolvedValue({ id: 'class-1' } as any);

    await expect(
      LiveClassService.updateClass('admin-1', 'ADMIN', 'class-1', {})
    ).resolves.not.toThrow();
  });
});

