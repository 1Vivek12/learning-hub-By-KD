// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, Search, Loader2, AlertCircle, XCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';

export const AdminQuizzes: React.FC = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]); // simplified for this demo, would normally fetch lessons specifically
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    lessonId: '',
    instructions: '',
    passingScore: 80,
    questions: [{ text: '', points: 10, options: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }] }]
  });

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [qzRes, csRes] = await Promise.all([
        fetch('/api/admin/quizzes'),
        fetch('/api/admin/courses') // just to get a list of lessons from courses, simplifying here
      ]);
      if (qzRes.ok) setQuizzes(await qzRes.json());
      if (csRes.ok) {
        const courses = await csRes.json();
        const allLessons = [];
        courses.forEach(c => {
          c.modules?.forEach(m => {
            m.lessons?.forEach(l => allLessons.push(l));
          })
        });
        setLessons(allLessons);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;
    try {
      const res = await fetch(`/api/admin/quizzes/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete quiz');
      }
      showToast('Quiz deleted');
      fetchData();
    } catch (err: any) {
      showToast(err.message);
    }
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuiz.lessonId || !newQuiz.title) {
      showToast("Title and Lesson are required.");
      return;
    }
    
    try {
      const res = await fetch('/api/admin/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuiz),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create quiz');
      }
      showToast("Quiz created successfully!");
      setIsCreating(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message);
    }
  };

  const filtered = quizzes.filter(q => q.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3">
        <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
        <span className="text-sm text-slate-400">Loading quizzes…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl animate-bounce">
          {feedback}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            <span>Quiz & Assessment Management</span>
          </h2>
          <p className="text-xs text-slate-400">Manage lesson quizzes, questions, and passing rules.</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-indigo-400 to-purple-400 hover:opacity-95 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Create Quiz</span>
        </button>
      </div>

      {isCreating && (
        <div className="p-6 rounded-2xl border bg-slate-900 border-indigo-500/30 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white">Create New Quiz</h3>
          <form onSubmit={handleCreateQuiz} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Quiz Title</label>
                <input
                  type="text"
                  value={newQuiz.title}
                  onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Lesson</label>
                <select
                  value={newQuiz.lessonId}
                  onChange={(e) => setNewQuiz({ ...newQuiz, lessonId: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                >
                  <option value="">Select Lesson...</option>
                  {lessons.map(l => (
                    <option key={l.id} value={l.id}>{l.titleEn}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold">
                Save Quiz
              </button>
              <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 rounded-xl bg-white/10 text-slate-300">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-2xl border bg-slate-900/60 border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 bg-slate-950/40">
                <th className="p-4 font-semibold">Quiz Title</th>
                <th className="p-4 font-semibold">Lesson</th>
                <th className="p-4 font-semibold">Questions</th>
                <th className="p-4 font-semibold">Attempts</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((quiz) => (
                <tr key={quiz.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-indigo-400">{quiz.title}</td>
                  <td className="p-4 text-slate-200">{quiz.lesson?.titleEn || 'Unknown'}</td>
                  <td className="p-4 text-slate-300">{quiz._count?.questions || 0}</td>
                  <td className="p-4 text-slate-300">{quiz._count?.attempts || 0}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(quiz.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                      title="Delete Quiz"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No quizzes found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
