import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Play,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Video
} from 'lucide-react';
import { AcademyModule, AcademyLesson, AuthUser } from '../types';
import { subscribeAcademyModules, subscribeAcademyLessons } from '../services/academyService';
import { extractYoutubeId } from '../utils/urlUtils';

interface AcademyViewProps {
  currentUser?: AuthUser | null;
  onBack?: () => void;
  onNavigateBack?: () => void;
  initialLessonId?: string;
}

export const AcademyView: React.FC<AcademyViewProps> = ({
  currentUser,
  onBack,
  onNavigateBack,
  initialLessonId
}) => {
  const handleBack = onBack || onNavigateBack;
  const [modules, setModules] = useState<AcademyModule[]>([]);
  const [lessons, setLessons] = useState<AcademyLesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<AcademyLesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [completedLessonIds, setCompletedLessonIds] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem('review_sincero_completed_lessons');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const unsubModules = subscribeAcademyModules((mods) => {
      const published = mods.filter((m) => m.status === 'published');
      setModules(published);
      // Auto-expand all modules initially
      const expandMap: Record<string, boolean> = {};
      published.forEach((m) => {
        expandMap[m.id] = true;
      });
      setExpandedModules(expandMap);
    });

    const unsubLessons = subscribeAcademyLessons((less) => {
      const published = less.filter((l) => l.status === 'published');
      setLessons(published);

      // Select initial lesson
      if (initialLessonId) {
        const found = published.find((l) => l.id === initialLessonId);
        if (found) setActiveLesson(found);
      } else if (published.length > 0) {
        setActiveLesson((prev) => prev || published[0]);
      }
    });

    return () => {
      unsubModules();
      unsubLessons();
    };
  }, [initialLessonId]);

  const toggleModuleExpand = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleSelectLesson = (lesson: AcademyLesson) => {
    setActiveLesson(lesson);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleCompleteLesson = (lessonId: string) => {
    setCompletedLessonIds((prev) => {
      const next = { ...prev, [lessonId]: !prev[lessonId] };
      try {
        localStorage.setItem('review_sincero_completed_lessons', JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  // Helper to render video embed cleanly
  const renderVideoPlayer = (lesson: AcademyLesson) => {
    const youtubeId = extractYoutubeId(lesson.videoUrl);

    if (youtubeId) {
      return (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-[#222] shadow-2xl">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={lesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      );
    }

    // Generic iframe fallback (Vimeo, custom host)
    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-[#222] shadow-2xl">
        <iframe
          src={lesson.videoUrl}
          title={lesson.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    );
  };

  const activeModule = modules.find((m) => m.id === activeLesson?.moduleId);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A1608] via-[#0F0F12] to-[#0A0A0C] border border-[#F5C542]/20 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5C542]/10 border border-[#F5C542]/30 text-[#F5C542] text-xs font-black uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>ACADEMIA REVIEW SINCERO</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Aprenda a Criar Reviews de Alta Conversão com IA
            </h1>
            <p className="text-sm text-[#A1A1A1] max-w-2xl">
              Aulas práticas em vídeo cobrindo desde a psicologia das vendas sinceras até a exportação do PRD perfeito para Lovable, Google AI Studio e ChatGPT.
            </p>
          </div>

          {handleBack && (
            <button
              onClick={handleBack}
              className="self-start md:self-center flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181818] hover:bg-[#222] border border-[#333] text-gray-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao App</span>
            </button>
          )}
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5C542]/5 blur-3xl rounded-full pointer-events-none" />
      </div>

      {/* Main Grid: Player + Curriculum */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Active Lesson Player (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activeLesson ? (
            <div className="space-y-4">
              {/* Responsive Video Player (loads only when lesson is selected) */}
              {renderVideoPlayer(activeLesson)}

              {/* Lesson Details */}
              <div className="bg-[#121215] border border-[#222] rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-[#F5C542]/15 text-[#F5C542] text-xs font-bold border border-[#F5C542]/30">
                      {activeModule?.title || 'Módulo'}
                    </span>
                    {activeLesson.duration && (
                      <span className="inline-flex items-center gap-1 text-xs text-[#888]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{activeLesson.duration}</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleCompleteLesson(activeLesson.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      completedLessonIds[activeLesson.id]
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                        : 'bg-[#1C1C22] border border-[#333] text-gray-300 hover:text-white hover:border-[#F5C542]/50'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {completedLessonIds[activeLesson.id] ? 'Aula Concluída' : 'Marcar como Concluída'}
                    </span>
                  </button>
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  {activeLesson.title}
                </h2>

                {activeLesson.description && (
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line border-t border-[#1F1F24] pt-4">
                    {activeLesson.description}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="h-96 rounded-3xl bg-[#121215] border border-[#222] flex flex-col items-center justify-center p-8 text-center space-y-3">
              <Video className="w-12 h-12 text-gray-500" />
              <p className="text-white font-bold text-lg">Nenhuma aula selecionada</p>
              <p className="text-xs text-gray-400 max-w-sm">
                Selecione uma aula no menu lateral ao lado para iniciar o aprendizado.
              </p>
            </div>
          )}
        </div>

        {/* Right / Modules & Lessons Curriculum (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#121215] border border-[#222] rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#222]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#F5C542]" />
                <h3 className="font-extrabold text-white text-base">Conteúdo do Curso</h3>
              </div>
              <span className="text-xs text-[#888] font-bold">
                {lessons.length} {lessons.length === 1 ? 'aula' : 'aulas'}
              </span>
            </div>

            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
              {modules.map((mod, idx) => {
                const moduleLessons = lessons.filter((l) => l.moduleId === mod.id);
                const isExpanded = expandedModules[mod.id] !== false;

                return (
                  <div
                    key={mod.id}
                    className="border border-[#1E1E24] rounded-2xl bg-[#0F0F12] overflow-hidden"
                  >
                    {/* Module Accordion Header */}
                    <button
                      type="button"
                      onClick={() => toggleModuleExpand(mod.id)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-[#16161B] transition-colors cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#F5C542]">
                          Módulo {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h4 className="text-sm font-bold text-white">{mod.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <span className="text-[11px]">
                          {moduleLessons.length} {moduleLessons.length === 1 ? 'aula' : 'aulas'}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {/* Lessons list */}
                    {isExpanded && (
                      <div className="p-2 space-y-1.5 border-t border-[#1C1C22] bg-[#0A0A0D]">
                        {moduleLessons.length === 0 ? (
                          <p className="text-xs text-gray-500 p-3 text-center">
                            Nenhuma aula neste módulo ainda.
                          </p>
                        ) : (
                          moduleLessons.map((lesson) => {
                            const isSelected = activeLesson?.id === lesson.id;
                            const isCompleted = completedLessonIds[lesson.id];

                            return (
                              <button
                                key={lesson.id}
                                onClick={() => handleSelectLesson(lesson)}
                                className={`w-full p-3 rounded-xl flex items-start gap-3 text-left transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#F5C542]/15 border border-[#F5C542]/40 text-white shadow-md shadow-[#F5C542]/5'
                                    : 'hover:bg-[#15151A] border border-transparent text-gray-300'
                                }`}
                              >
                                <div
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                                    isSelected
                                      ? 'bg-[#F5C542] text-black font-black'
                                      : isCompleted
                                      ? 'bg-emerald-500/20 text-emerald-400'
                                      : 'bg-[#1E1E24] text-gray-400'
                                  }`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                  ) : (
                                    <Play className="w-3 h-3 fill-current ml-0.5" />
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`text-xs font-bold truncate ${
                                      isSelected ? 'text-[#F5C542]' : 'text-white'
                                    }`}
                                  >
                                    {lesson.title}
                                  </p>
                                  {lesson.duration && (
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                                      <Clock className="w-3 h-3" />
                                      <span>{lesson.duration}</span>
                                    </div>
                                  )}
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
