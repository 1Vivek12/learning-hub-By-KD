"use client";
/**
 * authService.tsx — Client-side UI auth context
 *
 * PURPOSE: This context provides UI-level state for:
 *   - Displaying user name/avatar in Navbar
 *   - Tracking client-side enrolled course IDs (for "Enroll" button state)
 *   - Tracking completed lesson IDs (for progress indicators)
 *   - A localStorage-based role-switch for LOCAL DEVELOPMENT ONLY
 *
 * SECURITY: This context is NOT used for any authorization decision in
 *   production. All authorization is enforced server-side via NextAuth:
 *   - Admin page (/admin) is guarded by useSession() — JWT cookie
 *   - All /api/admin/* routes require ADMIN session via getApiAdmin()
 *   - All /api/* student routes require a valid session via getApiSession()
 *
 * The localStorage role-switching (loginAsAdmin/loginAsStudent) is isolated
 *   behind a development-only guard and cannot grant real server access.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { StorageService } from './storageService';

const IS_DEV = process.env.NODE_ENV === 'development';

interface AuthContextType {
  user: User;
  // isAdmin is kept for legacy display-only consumers (e.g. Navbar avatar label)
  // It MUST NOT be used for any access control. Use useSession() instead.
  isAdmin: boolean;
  /** Dev-only: resets localStorage user to student persona. No-op in production. */
  loginAsStudent: () => void;
  /** Dev-only: switches localStorage user to admin persona. No-op in production. */
  loginAsAdmin: () => void;
  logout: () => void;
  isEnrolled: (courseId: string) => boolean;
  enrollInCourse: (courseId: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  toggleLesson: (courseId: string, lessonId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => StorageService.getCurrentUser());

  // Sync enrolled course IDs from the real database (for UI enrollment state)
  useEffect(() => {
    fetch('/api/enrollments')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const courseIds = data.map((e: any) => e.courseId);
          setUser(prev => ({ ...prev, enrolledCourseIds: courseIds }));
        }
      })
      .catch(() => {
        // Silently fail — user may not be authenticated, API returns 401
      });
  }, []);

  /**
   * DEV-ONLY: Reset to student persona.
   * In production this is a no-op to prevent client-side role manipulation.
   */
  const loginAsStudent = () => {
    if (!IS_DEV) return;
    const studentUser: User = {
      id: 'usr-student-1',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      enrolledCourseIds: user.enrolledCourseIds || [],
      completedLessonIds: user.completedLessonIds || [],
      createdAt: '2026-08-01',
    };
    setUser(studentUser);
    StorageService.saveCurrentUser(studentUser);
  };

  /**
   * DEV-ONLY: Switch to admin persona for UI development.
   * In production this is a no-op. It CANNOT grant real API or /admin access.
   * Admin page uses useSession() which reads from the server-signed JWT cookie.
   */
  const loginAsAdmin = () => {
    if (!IS_DEV) return;
    const adminUser: User = {
      id: 'usr-admin-super',
      name: 'Dev Admin (Local Only)',
      email: 'dev-admin@localhost',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      enrolledCourseIds: [],
      completedLessonIds: [],
      createdAt: '2026-01-01',
    };
    setUser(adminUser);
    StorageService.saveCurrentUser(adminUser);
  };

  const logout = () => {
    if (IS_DEV) loginAsStudent();
  };

  const isEnrolled = (courseId: string): boolean => {
    return user.enrolledCourseIds.includes(courseId);
  };

  const enrollInCourse = async (courseId: string) => {
    if (!user.enrolledCourseIds.includes(courseId)) {
      try {
        await fetch('/api/enrollments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseId }),
        });
        const updated = {
          ...user,
          enrolledCourseIds: [...user.enrolledCourseIds, courseId],
        };
        setUser(updated);
        StorageService.saveCurrentUser(updated);
      } catch (e) {
        console.error('Enrollment failed', e);
      }
    }
  };

  const isLessonCompleted = (lessonId: string): boolean => {
    return user.completedLessonIds.includes(lessonId);
  };

  const toggleLesson = (courseId: string, lessonId: string) => {
    StorageService.toggleLessonComplete(courseId, lessonId);
    setUser(StorageService.getCurrentUser());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        // NOTE: isAdmin here reflects localStorage state only (for dev mode UI)
        // Do NOT use this for any gate-keeping. Use useSession() for real auth checks.
        isAdmin: IS_DEV && user.role === 'admin',
        loginAsStudent,
        loginAsAdmin,
        logout,
        isEnrolled,
        enrollInCourse,
        isLessonCompleted,
        toggleLesson,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
