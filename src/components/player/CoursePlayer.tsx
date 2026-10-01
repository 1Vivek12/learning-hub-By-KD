import React, { useState, useRef, useEffect } from 'react';
import { Course, Lesson } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/services/authService';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  BookOpen,
  ArrowLeft,
  Save,
  Award,
} from 'lucide-react';

interface CoursePlayerProps {
  course: Course;
  initialLessonId?: string;
  onBackToCourse: () => void;
  onClaimCertificate?: () => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  course,
  initialLessonId,
  onBackToCourse,
  onClaimCertificate,
}) => {
  const { t, l } = useLanguage();
  const { isLessonCompleted, toggleLesson } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Flatten lessons for linear navigation
  const allLessons = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleTitle: m.title }))
  );

  const [activeLessonId, setActiveLessonId] = useState<string>(
    initialLessonId || allLessons[0]?.id || ''
  );

  const activeLesson = allLessons.find((l) => l.id === activeLessonId) || allLessons[0];
  const activeIndex = allLessons.findIndex((l) => l.id === activeLessonId);

  // Video Player Controls State
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'notes'>('overview');

  // Notes state
  const noteKey = `skillforge_notes_${course.id}_${activeLessonId}`;
  const [notes, setNotes] = useState(() => localStorage.getItem(noteKey) || '');
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);

  useEffect(() => {
    setNotes(localStorage.getItem(noteKey) || '');
  }, [noteKey]);

  const handleSaveNotes = () => {
    localStorage.setItem(noteKey, notes);
    setNoteSavedFeedback(true);
    setTimeout(() => setNoteSavedFeedback(false), 3000);
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      videoRef.current.playbackRate = playbackSpeed;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const playerEl = document.getElementById('lms-video-container');
    if (!playerEl) return;
    if (!document.fullscreenElement) {
      playerEl.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const goToNextLesson = () => {
    if (activeIndex < allLessons.length - 1) {
      setActiveLessonId(allLessons[activeIndex + 1].id);
    }
  };

  const goToPrevLesson = () => {
    if (activeIndex > 0) {
      setActiveLessonId(allLessons[activeIndex - 1].id);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Progress metrics
  const completedCount = allLessons.filter((l) => isLessonCompleted(l.id)).length;
  const progressPercent = Math.round((completedCount / allLessons.length) * 100);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      {/* Top Bar */}
      <div className="h-16 px-4 sm:px-6 border-b border-white/10 bg-[#0b0f19] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCourse}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t('player.backToDashboard')}</span>
          </button>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-sm font-bold text-slate-200 truncate max-w-md">
            {l(course.title)}
          </span>
        </div>

        {/* Progress pill & Certificate claim */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-slate-400">Course Progress:</span>
            <div className="w-28 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">{progressPercent}%</span>
          </div>

          {progressPercent >= 100 && onClaimCertificate && (
            <button
              onClick={onClaimCertificate}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-300 to-amber-400 hover:opacity-95 shadow-md shadow-amber-500/20 animate-pulse"
            >
              <Award className="w-4 h-4" />
              <span>{t('player.getCertificate')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main LMS Stage: Video + Sidebar */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left 8-9 Cols: Video Player & Tabs */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col bg-black overflow-y-auto">
          {/* Video Container */}
          <div
            id="lms-video-container"
            className="relative w-full aspect-video bg-black flex items-center justify-center group overflow-hidden"
          >
            <video
              ref={videoRef}
              src={activeLesson?.videoUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              autoPlay
              playsInline
              className="w-full h-full object-contain cursor-pointer"
              onClick={handlePlayPause}
            />

            {/* Custom Control Bar Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
              {/* Progress / Seek Bar */}
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />

              <div className="flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-3">
                  <button onClick={handlePlayPause} className="hover:text-sky-400 transition-colors">
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                  </button>

                  {/* Volume */}
                  <div className="flex items-center gap-1.5">
                    <button onClick={toggleMute} className="hover:text-sky-400">
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1 bg-white/20 rounded accent-sky-400 cursor-pointer hidden sm:block"
                    />
                  </div>

                  {/* Time display */}
                  <span className="font-mono text-[11px] text-slate-300">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Speed Selector */}
                  <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded text-[11px] font-mono">
                    {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSpeedChange(s)}
                        className={`px-1 rounded ${playbackSpeed === s ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-white'}`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>

                  {/* Fullscreen */}
                  <button onClick={toggleFullscreen} className="hover:text-sky-400">
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Header & Complete / Navigation Action Bar */}
          <div className="p-6 bg-[#0b0f19] border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-mono text-sky-400">
                Lesson {activeIndex + 1} of {allLessons.length}
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                {l(activeLesson?.title)}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => activeLesson && toggleLesson(course.id, activeLesson.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isLessonCompleted(activeLesson?.id || '')
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isLessonCompleted(activeLesson?.id || '')
                    ? t('player.completed')
                    : t('player.markComplete')}
                </span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={goToPrevLesson}
                  disabled={activeIndex === 0}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
                  title={t('player.prevLesson')}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={goToNextLesson}
                  disabled={activeIndex === allLessons.length - 1}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
                  title={t('player.nextLesson')}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Tabs: Overview, Resources, Notes */}
          <div className="p-6 bg-[#0b0f19] flex-1">
            <div className="flex items-center gap-4 border-b border-white/10 pb-3">
              <button
                onClick={() => setActiveTab('overview')}
                className={`text-xs font-semibold pb-2 border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-sky-400 text-sky-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                {t('player.overview')}
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`text-xs font-semibold pb-2 border-b-2 transition-colors ${
                  activeTab === 'resources'
                    ? 'border-sky-400 text-sky-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                {t('player.resources')} ({activeLesson?.resources?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`text-xs font-semibold pb-2 border-b-2 transition-colors ${
                  activeTab === 'notes'
                    ? 'border-sky-400 text-sky-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                {t('player.notes')}
              </button>
            </div>

            <div className="pt-4">
              {activeTab === 'overview' && (
                <div className="space-y-3 max-w-2xl text-xs text-slate-300 leading-relaxed">
                  <p>{l(activeLesson?.description)}</p>
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-2">
                    <h4 className="font-bold text-slate-200">Key Analytical Takeaways:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-400">
                      <li>Understand runtime execution difference between subqueries and CTEs.</li>
                      <li>Inspect memory allocation using EXPLAIN (ANALYZE, BUFFERS).</li>
                      <li>Avoid N+1 client side roundtrips through consolidated window partitions.</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-3">
                  {activeLesson?.resources && activeLesson.resources.length > 0 ? (
                    activeLesson.resources.map((res, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-white/10 max-w-md"
                      >
                        <div className="flex items-center gap-3 text-xs">
                          <FileText className="w-4 h-4 text-sky-400" />
                          <span className="text-slate-200 font-medium">{res.name}</span>
                        </div>
                        <button
                          onClick={() => alert(`Downloading ${res.name}...`)}
                          className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500/20"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500">No external downloads for this lesson.</p>
                  )}
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-3 max-w-2xl">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Write your private notes, formula snippets, or timestamps here..."
                    rows={6}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-400 font-mono"
                  />
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleSaveNotes}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-white transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{t('player.saveNote')}</span>
                    </button>
                    {noteSavedFeedback && (
                      <span className="text-xs text-emerald-400 animate-fadeIn">
                        {t('player.noteSaved')}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 3-4 Cols: Course Curriculum Playlist Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3 bg-[#0d1322] border-l border-white/10 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <div className="p-4 border-b border-white/10 sticky top-0 bg-[#0d1322]/95 backdrop-blur-md z-10">
            <h3 className="text-sm font-bold text-white">Course Syllabus</h3>
            <span className="text-[11px] text-slate-400">
              {completedCount} of {allLessons.length} lessons completed
            </span>
          </div>

          <div className="p-2 space-y-4">
            {course.modules.map((mod, modIdx) => (
              <div key={mod.id} className="space-y-1">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Module {modIdx + 1}: {l(mod.title)}
                </div>
                <div className="space-y-1">
                  {mod.lessons.map((lesson) => {
                    const isActive = lesson.id === activeLessonId;
                    const isCompleted = isLessonCompleted(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLessonId(lesson.id)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start justify-between gap-3 ${
                          isActive
                            ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLesson(course.id, lesson.id);
                            }}
                            className="mt-0.5"
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-500 hover:text-white" />
                            )}
                          </span>
                          <span className="font-medium line-clamp-2">{l(lesson.title)}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0">
                          {lesson.durationMinutes}m
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
