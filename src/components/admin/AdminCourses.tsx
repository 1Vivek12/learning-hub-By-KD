// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useSession } from 'next-auth/react';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Video,
  Clock,
  X,
  Save,
  Layers,
  Loader2,
  AlertCircle,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

// DB-shaped types matching Prisma schema
interface DBLesson {
  id: string;
  titleEn: string;
  titleHi?: string;
  titleHinglish?: string;
  slug: string;
  descriptionEn?: string;
  type: string;
  durationMinutes: number;
  videoUrl?: string;
  isFreePreview: boolean;
  order: number;
  moduleId: string;
}

interface DBModule {
  id: string;
  titleEn: string;
  titleHi?: string;
  titleHinglish?: string;
  order: number;
  courseId: string;
  lessons: DBLesson[];
}

interface DBCourse {
  id: string;
  slug: string;
  titleEn: string;
  titleHi?: string;
  titleHinglish?: string;
  descShortEn: string;
  descLongEn: string;
  level: string;
  language: string;
  durationHours: number;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  thumbnail?: string;
  status: string;
  isFeatured: boolean;
  instructorId: string;
  categoryId?: string;
  instructor?: { id: string; name: string };
  category?: { id: string; name: string };
  modules: DBModule[];
  _count?: { enrollments: number };
}

export const AdminCourses: React.FC = () => {
  const { l } = useLanguage();
  const { data: session } = useSession();
  const user = session?.user;

  const [courses, setCourses] = useState<DBCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Active course being edited
  const [editingCourse, setEditingCourse] = useState<DBCourse | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'curriculum'>('curriculum');
  const [feedback, setFeedback] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  // Fetch courses from backend
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/courses');
      if (!res.ok) throw new Error('Failed to fetch courses');
      const data = await res.json();
      setCourses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Load full course with modules/lessons for editing
  const handleEditCourse = async (courseId: string) => {
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`);
      if (!res.ok) throw new Error('Failed to load course');
      const data = await res.json();
      setEditingCourse(data);
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Publish / Unpublish
  const handleTogglePublish = async (course: DBCourse) => {
    try {
      const endpoint = course.status === 'PUBLISHED'
        ? `/api/admin/courses/${course.id}/unpublish`
        : `/api/admin/courses/${course.id}/publish`;
      const res = await fetch(endpoint, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to toggle publish status');
      await fetchCourses();
      showToast(`Course is now ${course.status === 'PUBLISHED' ? 'Draft' : 'Published'}!`);
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Delete course (safe - server checks enrollments)
  const handleDeleteCourse = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete course "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
      if (res.status === 409) {
        showToast('Cannot delete: course has active enrollments.');
        return;
      }
      if (!res.ok) throw new Error('Failed to delete course');
      await fetchCourses();
      showToast('Course deleted successfully.');
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Create new course
  const handleCreateNewCourse = async () => {
    try {
      const slug = `new-course-${Date.now().toString().slice(-6)}`;
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          titleEn: 'New Course',
          descShortEn: 'Course short description',
          descLongEn: 'Course long description',
          level: 'Beginner',
          language: 'English',
          durationHours: 1,
          price: 0,
          instructorId: courses[0]?.instructorId || '',
          status: 'DRAFT',
        }),
      });
      if (!res.ok) throw new Error('Failed to create course');
      const created = await res.json();
      await fetchCourses();
      handleEditCourse(created.id);
      showToast('New course created!');
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Save course details
  const handleSaveCourseDetails = async () => {
    if (!editingCourse) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/courses/${editingCourse.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleEn: editingCourse.titleEn,
          titleHi: editingCourse.titleHi,
          titleHinglish: editingCourse.titleHinglish,
          descShortEn: editingCourse.descShortEn,
          descLongEn: editingCourse.descLongEn,
          price: editingCourse.price,
          originalPrice: editingCourse.originalPrice,
          durationHours: editingCourse.durationHours,
          thumbnail: editingCourse.thumbnail,
          slug: editingCourse.slug,
        }),
      });
      if (!res.ok) throw new Error('Failed to save course');
      await fetchCourses();
      showToast('Course details saved!');
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // ===== Module CRUD =====
  const handleAddModule = async () => {
    if (!editingCourse) return;
    try {
      const res = await fetch('/api/admin/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: editingCourse.id,
          titleEn: 'New Module',
        }),
      });
      if (!res.ok) throw new Error('Failed to create module');
      // Reload course
      await handleEditCourse(editingCourse.id);
      showToast('Module added!');
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleUpdateModule = async (moduleId: string, data: Partial<DBModule>) => {
    try {
      const res = await fetch(`/api/admin/modules/${moduleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update module');
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!editingCourse) return;
    if (!confirm('Delete this module and all its lessons?')) return;
    try {
      const res = await fetch(`/api/admin/modules/${moduleId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete module');
      await handleEditCourse(editingCourse.id);
      showToast('Module deleted!');
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleReorderModules = async (courseId: string, orderedIds: string[]) => {
    try {
      const res = await fetch('/api/admin/modules/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, orderedIds }),
      });
      if (!res.ok) throw new Error('Failed to reorder modules');
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  // ===== Lesson CRUD =====
  const handleAddLesson = async (moduleId: string) => {
    if (!editingCourse) return;
    try {
      const slug = `lesson-${Date.now().toString().slice(-6)}`;
      const res = await fetch('/api/admin/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId,
          titleEn: 'New Lesson',
          slug,
          durationMinutes: 10,
          type: 'VIDEO',
          isFreePreview: false,
        }),
      });
      if (!res.ok) throw new Error('Failed to create lesson');
      await handleEditCourse(editingCourse.id);
      showToast('Lesson added!');
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleUpdateLesson = async (lessonId: string, data: Partial<DBLesson>) => {
    try {
      const res = await fetch(`/api/admin/lessons/${lessonId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update lesson');
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!editingCourse) return;
    try {
      const res = await fetch(`/api/admin/lessons/${lessonId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete lesson');
      await handleEditCourse(editingCourse.id);
      showToast('Lesson deleted!');
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleReorderLessons = async (moduleId: string, orderedIds: string[]) => {
    try {
      const res = await fetch('/api/admin/lessons/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId, orderedIds }),
      });
      if (!res.ok) throw new Error('Failed to reorder lessons');
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Move module up/down
  const moveModule = async (moduleId: string, direction: 'up' | 'down') => {
    if (!editingCourse) return;
    const modules = [...editingCourse.modules].sort((a, b) => a.order - b.order);
    const idx = modules.findIndex(m => m.id === moduleId);
    if (direction === 'up' && idx > 0) {
      [modules[idx], modules[idx - 1]] = [modules[idx - 1], modules[idx]];
    } else if (direction === 'down' && idx < modules.length - 1) {
      [modules[idx], modules[idx + 1]] = [modules[idx + 1], modules[idx]];
    }
    const orderedIds = modules.map(m => m.id);
    await handleReorderModules(editingCourse.id, orderedIds);
    await handleEditCourse(editingCourse.id);
  };

  // Move lesson up/down within module
  const moveLesson = async (moduleId: string, lessonId: string, direction: 'up' | 'down') => {
    if (!editingCourse) return;
    const mod = editingCourse.modules.find(m => m.id === moduleId);
    if (!mod) return;
    const lessons = [...mod.lessons].sort((a, b) => a.order - b.order);
    const idx = lessons.findIndex(le => le.id === lessonId);
    if (direction === 'up' && idx > 0) {
      [lessons[idx], lessons[idx - 1]] = [lessons[idx - 1], lessons[idx]];
    } else if (direction === 'down' && idx < lessons.length - 1) {
      [lessons[idx], lessons[idx + 1]] = [lessons[idx + 1], lessons[idx]];
    }
    const orderedIds = lessons.map(le => le.id);
    await handleReorderLessons(moduleId, orderedIds);
    await handleEditCourse(editingCourse.id);
  };

  // Compute lesson count
  const getLessonCount = (course: DBCourse) => {
    return course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3">
        <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
        <span className="text-sm text-slate-400">Loading courses…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <AlertCircle className="w-8 h-8 text-rose-400" />
        <p className="text-sm text-slate-400">{error}</p>
        <button onClick={fetchCourses} className="px-4 py-2 rounded-lg bg-sky-500 text-xs font-bold text-slate-950">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl animate-bounce">
          {feedback}
        </div>
      )}

      {/* Courses List Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white dark:text-white light:text-slate-900">
            Course Management & Curricula
          </h2>
          <p className="text-xs text-slate-400">
            Publish courses, edit syllabus modules, video streams, and pricing tiers.
          </p>
        </div>

        <button
          onClick={handleCreateNewCourse}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-sky-400 to-teal-300 hover:opacity-95 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Course</span>
        </button>
      </div>

      {/* Courses Table */}
      <div className="rounded-2xl border bg-slate-900/60 border-white/10 overflow-hidden dark:bg-slate-900/60 light:bg-white light:border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 bg-slate-950/40">
                <th className="p-4 font-semibold">Course</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Modules / Lessons</th>
                <th className="p-4 font-semibold">Enrollments</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {course.thumbnail && (
                        <img
                          src={course.thumbnail}
                          alt={course.titleEn}
                          className="w-12 h-12 rounded-lg object-cover border border-white/10"
                        />
                      )}
                      <div>
                        <h4 className="font-bold text-slate-200 dark:text-slate-200 light:text-slate-900 line-clamp-1">
                          {course.titleEn}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono">
                          /{course.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-semibold text-[10px]">
                      {course.category?.name || '—'}
                    </span>
                  </td>

                  <td className="p-4 font-mono text-slate-300">
                    {course.modules?.length || 0} modules • {getLessonCount(course)} lessons
                  </td>

                  <td className="p-4 font-mono text-slate-300">
                    {course._count?.enrollments || 0}
                  </td>

                  <td className="p-4 font-mono font-bold text-white dark:text-white light:text-slate-900">
                    ₹{course.price?.toLocaleString() || 0}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => handleTogglePublish(course)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                        course.status === 'PUBLISHED'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {course.status === 'PUBLISHED' ? (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleEditCourse(course.id)}
                        className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500/20"
                        title="Edit Course & Curriculum"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id, course.titleEn)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                        title="Delete Course"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {courses.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 text-xs">
                    No courses yet. Create your first course to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course Edit & Curriculum Builder Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl border border-white/15 bg-[#0e1424] shadow-2xl overflow-hidden flex flex-col text-slate-100 dark:bg-[#0e1424] light:bg-white light:border-slate-300 light:text-slate-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 dark:border-white/10 light:border-slate-200">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-sky-400" />
                <div>
                  <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900">
                    Course Editor & Curriculum Builder
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    ID: {editingCourse.id}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex rounded-lg bg-slate-900 p-0.5 border border-white/10 text-xs">
                  <button
                    onClick={() => setActiveTab('curriculum')}
                    className={`px-3 py-1 rounded-md font-semibold ${
                      activeTab === 'curriculum'
                        ? 'bg-sky-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Curriculum Builder
                  </button>
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`px-3 py-1 rounded-md font-semibold ${
                      activeTab === 'details'
                        ? 'bg-sky-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Course Details & Pricing
                  </button>
                </div>

                <button
                  onClick={() => setEditingCourse(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: CURRICULUM BUILDER */}
              {activeTab === 'curriculum' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900">
                        Syllabus Modules & Lessons
                      </h4>
                      <p className="text-xs text-slate-400">
                        Add structured learning modules, video assets, and free preview trailers.
                      </p>
                    </div>
                    <button
                      onClick={handleAddModule}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-500 text-slate-950 hover:bg-sky-400"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Module</span>
                    </button>
                  </div>

                  {editingCourse.modules.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl text-slate-400 text-xs">
                      No modules created yet. Click "Add Module" to start structuring your course.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {[...editingCourse.modules]
                        .sort((a, b) => a.order - b.order)
                        .map((module, modIdx) => (
                        <div
                          key={module.id}
                          className="rounded-xl border border-white/10 bg-slate-950/60 p-4 space-y-4 dark:bg-slate-950/60 light:bg-slate-50 light:border-slate-200"
                        >
                          {/* Module Header */}
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-xs font-mono font-bold text-sky-400">
                                M{modIdx + 1}:
                              </span>
                              <input
                                type="text"
                                defaultValue={module.titleEn}
                                onBlur={(e) => {
                                  if (e.target.value !== module.titleEn) {
                                    handleUpdateModule(module.id, { titleEn: e.target.value });
                                  }
                                }}
                                placeholder="Module Title"
                                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-white font-semibold focus:outline-none focus:border-sky-400"
                              />
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Reorder buttons */}
                              <button
                                onClick={() => moveModule(module.id, 'up')}
                                disabled={modIdx === 0}
                                className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-30"
                                title="Move up"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => moveModule(module.id, 'down')}
                                disabled={modIdx === editingCourse.modules.length - 1}
                                className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-30"
                                title="Move down"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleAddLesson(module.id)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 text-xs font-semibold"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Lesson</span>
                              </button>
                              <button
                                onClick={() => handleDeleteModule(module.id)}
                                className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/10"
                                title="Delete Module"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Lessons in this Module */}
                          <div className="pl-6 space-y-2 border-l border-white/10">
                            {[...module.lessons]
                              .sort((a, b) => a.order - b.order)
                              .map((lesson, lesIdx) => (
                              <div
                                key={lesson.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-slate-900/80 border border-white/5 text-xs"
                              >
                                <div className="flex items-center gap-2 flex-1">
                                  <Video className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                                  <input
                                    type="text"
                                    defaultValue={lesson.titleEn}
                                    onBlur={(e) => {
                                      if (e.target.value !== lesson.titleEn) {
                                        handleUpdateLesson(lesson.id, { titleEn: e.target.value });
                                      }
                                    }}
                                    className="flex-1 px-2 py-1 rounded bg-slate-950 border border-white/10 text-xs text-slate-200"
                                    placeholder="Lesson Title"
                                  />
                                </div>

                                <div className="flex items-center gap-3">
                                  {/* Reorder */}
                                  <button
                                    onClick={() => moveLesson(module.id, lesson.id, 'up')}
                                    disabled={lesIdx === 0}
                                    className="p-0.5 rounded text-slate-400 hover:text-white disabled:opacity-30"
                                  >
                                    <ChevronUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => moveLesson(module.id, lesson.id, 'down')}
                                    disabled={lesIdx === module.lessons.length - 1}
                                    className="p-0.5 rounded text-slate-400 hover:text-white disabled:opacity-30"
                                  >
                                    <ChevronDown className="w-3 h-3" />
                                  </button>

                                  <div className="flex items-center gap-1 text-slate-400">
                                    <Clock className="w-3 h-3" />
                                    <input
                                      type="number"
                                      defaultValue={lesson.durationMinutes}
                                      onBlur={(e) => {
                                        const dur = parseInt(e.target.value) || 0;
                                        if (dur !== lesson.durationMinutes) {
                                          handleUpdateLesson(lesson.id, { durationMinutes: dur });
                                        }
                                      }}
                                      className="w-12 px-1 py-0.5 rounded bg-slate-950 border border-white/10 text-center text-xs text-white"
                                    />
                                    <span>min</span>
                                  </div>

                                  <label className="flex items-center gap-1 text-[11px] text-slate-400 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      defaultChecked={lesson.isFreePreview}
                                      onChange={(e) => {
                                        handleUpdateLesson(lesson.id, { isFreePreview: e.target.checked });
                                      }}
                                      className="rounded accent-sky-400"
                                    />
                                    <span>Free Preview</span>
                                  </label>

                                  <button
                                    onClick={() => handleDeleteLesson(lesson.id)}
                                    className="p-1 rounded text-rose-400 hover:bg-rose-500/10"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: COURSE DETAILS & PRICING */}
              {activeTab === 'details' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 mb-1">Course Title (English)</label>
                      <input
                        type="text"
                        value={editingCourse.titleEn}
                        onChange={(e) =>
                          setEditingCourse({ ...editingCourse, titleEn: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Course Title (Hinglish)</label>
                      <input
                        type="text"
                        value={editingCourse.titleHinglish || ''}
                        onChange={(e) =>
                          setEditingCourse({ ...editingCourse, titleHinglish: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Slug</label>
                    <input
                      type="text"
                      value={editingCourse.slug}
                      onChange={(e) =>
                        setEditingCourse({ ...editingCourse, slug: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Short Description</label>
                    <input
                      type="text"
                      value={editingCourse.descShortEn}
                      onChange={(e) =>
                        setEditingCourse({ ...editingCourse, descShortEn: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-400 mb-1">Selling Price (₹)</label>
                      <input
                        type="number"
                        value={editingCourse.price}
                        onChange={(e) =>
                          setEditingCourse({
                            ...editingCourse,
                            price: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Original Price (₹)</label>
                      <input
                        type="number"
                        value={editingCourse.originalPrice || 0}
                        onChange={(e) =>
                          setEditingCourse({
                            ...editingCourse,
                            originalPrice: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Duration (Hours)</label>
                      <input
                        type="number"
                        value={editingCourse.durationHours}
                        onChange={(e) =>
                          setEditingCourse({
                            ...editingCourse,
                            durationHours: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Thumbnail Image URL</label>
                    <input
                      type="text"
                      value={editingCourse.thumbnail || ''}
                      onChange={(e) =>
                        setEditingCourse({ ...editingCourse, thumbnail: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-[11px]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 flex items-center justify-between bg-slate-900/50">
              <button
                onClick={() => setEditingCourse(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveCourseDetails}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-sky-400 to-teal-300 hover:opacity-95 shadow-md disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Course Details</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
