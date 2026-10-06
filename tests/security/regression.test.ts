import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '@/lib/db/prisma';

// Mocks
vi.mock('@/lib/db/prisma', () => ({
  prisma: {
    notification: { findUnique: vi.fn(), update: vi.fn() },
    lesson: { findUnique: vi.fn() },
    certificate: { findFirst: vi.fn(), create: vi.fn() },
    order: { findUnique: vi.fn(), update: vi.fn() },
    liveClassParticipant: { create: vi.fn(), findUnique: vi.fn() },
    liveClass: { updateMany: vi.fn() },
    course: { findUnique: vi.fn() },
    enrollment: { findUnique: vi.fn() }
  }
}));

vi.mock('razorpay', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      payments: {
        refund: vi.fn().mockRejectedValue(new Error('Gateway error'))
      }
    }))
  };
});

import { NotificationService } from '@/lib/services/notificationService';
import { ProgressService } from '@/lib/services/progressService';
import { CertificateService } from '@/lib/services/certificateService';

import { LiveClassService } from '@/lib/services/liveClassService';
import { CourseAccessService } from '@/lib/services/courseAccessService';

describe('Security Regression Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TASK 9: Draft Exposure - draft course public access rejected', async () => {
    vi.mocked(prisma.enrollment.findUnique).mockResolvedValue({
      id: 'enr-1',
      status: 'ACTIVE',
      course: { status: 'DRAFT' }
    } as any);
    
    const hasAccess = await CourseAccessService.hasActiveEnrollment('user-1', 'course-1');
    expect(hasAccess).toBe(false);
  });
});
