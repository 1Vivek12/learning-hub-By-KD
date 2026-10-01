import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Course } from '@/types';
import { Search, X, BookOpen, User, Star, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCourse: (slug: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectCourse }) => {
  const { t, l } = useLanguage();
  const [query, setQuery] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/courses')
        .then(r => r.json())
        .then(setCourses)
        .catch(console.error);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = courses.filter((c) => {
    const q = query.toLowerCase();
    const title = (c.title.en + ' ' + c.title.hinglish + ' ' + c.title.hi).toLowerCase();
    const desc = (c.shortDescription.en + ' ' + c.shortDescription.hinglish).toLowerCase();
    const cat = c.category.toLowerCase();
    const skills = c.skills.join(' ').toLowerCase();
    return title.includes(q) || desc.includes(q) || cat.includes(q) || skills.includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl rounded-2xl border border-white/15 bg-[#0e1424] shadow-2xl overflow-hidden transition-all dark:bg-[#0e1424] dark:border-white/15 light:bg-white light:border-slate-300">
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 dark:border-white/10 light:border-slate-200">
          <Search className="w-5 h-5 text-sky-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('nav.searchPlaceholder')}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-100 dark:text-slate-100 light:text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-white mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <BookOpen className="w-8 h-8 mx-auto text-slate-500 mb-2 opacity-60" />
              <p className="text-sm font-medium">{t('course.noResults')}</p>
            </div>
          ) : (
            filtered.map((course) => (
              <div
                key={course.id}
                onClick={() => {
                  onSelectCourse(course.slug);
                  onClose();
                }}
                className="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-sky-500/30 hover:bg-sky-500/10 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={course.thumbnail}
                    alt={course.title.en}
                    className="w-14 h-14 rounded-lg object-cover border border-white/10"
                  />
                  <div>
                    <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">
                      {course.category}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-100 group-hover:text-sky-300 transition-colors dark:text-slate-100 light:text-slate-900">
                      {l(course.title)}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {course.rating}
                      </span>
                      <span>•</span>
                      <span>{course.durationHours} hrs</span>
                      <span>•</span>
                      <span className="font-semibold text-emerald-400">₹{course.price}</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
