"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { StorageService } from './storageService';

interface AuthContextType {
  user: User;
  isAdmin: boolean;
  loginAsStudent: () => void;
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

  // In Phase 2, sync the mock user's enrollments with the real database
  useEffect(() => {
    fetch('/api/enrollments')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const courseIds = data.map((e: any) => e.courseId);
          setUser(prev => ({ ...prev, enrolledCourseIds: courseIds }));
        }
      })
      .catch(console.error);
  }, []);

  const loginAsStudent = () => {
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

  const loginAsAdmin = () => {
    const adminUser: User = {
      id: 'usr-admin-super',
      name: 'Victoria Vance (Super Admin)',
      email: 'admin@learninghub.io',
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
    loginAsStudent();
  };

  const isEnrolled = (courseId: string): boolean => {
    if (user.role === 'admin') return true;
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
        isAdmin: user.role === 'admin',
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
