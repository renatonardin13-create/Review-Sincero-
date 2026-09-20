import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  CheckCircle2,
  Circle,
  BookOpen,
  Sparkles,
  PlusCircle,
  Edit3,
  Trash2,
  FolderPlus,
  Download,
  Copy,
  Check,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Tv,
  Award,
  Clock,
  RotateCcw,
  Sliders,
  FileText,
  ShieldCheck,
  Layers,
  Film,
  Bookmark,
  Share2,
  X,
  ExternalLink,
  HelpCircle,
  Maximize2,
  Lightbulb,
  Zap,
  Flame,
  UserCheck,
  FileSpreadsheet,
  Home,
  LayoutTemplate,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import {
  CourseModule,
  LessonItem,
  MemberAcademyData,
  LessonSupportMaterial,
  AuthUser,
  ADMIN_EMAIL
} from '../types';
import {
  getStoredAcademyData,
  saveStoredAcademyData,
  resetStoredAcademyData,
  INITIAL_MODULES,
  INITIAL_LESSONS
} from '../data/academyData';
import {
  subscribeToAcademy,
  saveAcademyLessonToFirestore,
  deleteAcademyLessonFromFirestore
} from '../services/academyService';
import {
  extractYouTubeId,
  buildWhiteLabelEmbedUrl,
  getYouTubeThumbnail
} from '../utils/youtubeHelper';
import { CustomVideoPlayer } from './CustomVideoPlayer';

interface MembersAcademyViewProps {
  onNavigateTo?: (viewId: string) => void;
  onNewReview?: () => void;
  onSwitchToGuide?: () => void;
  currentUser?: AuthUser;
}

export const MembersAcademyView: React.FC<MembersAcademyViewProps> = ({
  onNavigateTo,
  onNewReview,
  onSwitchToGuide,
  currentUser
}) => {
  const isAdmin =
    currentUser?.role === 'admin' ||
    currentUser?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();

  const [academyData, setAcademyData] = useState<MemberAcademyData>(getStoredAcademyData);
  const [activeLessonId, setActiveLessonId] = useState<string>(() => {
    const data = getStoredAcademyData();
    return data.activeLessonId || data.lessons[0]?.id || '';
  });

  const [lessonActiveTab, setLessonActiveTab] = useState<'overview' | 'materials' | 'notes' | 'faq'>('overview');
  const [lessonSearchQuery, setLessonSearchQuery] = useState<string>('');
  const [collapsedModules, setCollapsedModules] = useState<Record<string, boolean>>({});
  const [isCinemaMode, setIsCinemaMode] = useState<boolean>(false);
  const [activeNoteText, setActiveNoteText] = useState<string>('');
  const [noteSaveStatus, setNoteSaveStatus] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const [isManageModalOpen, setIsManageModalOpen] = useState<boolean>(false);
  const [manageTab, setManageTab] = useState<'add_lesson' | 'manage_lessons' | 'modules'>('add_lesson');
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

  const [formLessonTitle, setFormLessonTitle] = useState<string>('');
  const [formLessonModuleId, setFormLessonModuleId] = useState<string>('');
  const [formLessonYoutubeUrl, setFormLessonYoutubeUrl] = useState<string>('');
  const [formLessonDuration, setFormLessonDuration] = useState<string>('10:00');
  const [formLessonDescription, setFormLessonDescription] = useState<string>('');
  const [formLessonKeyTakeaways, setFormLessonKeyTakeaways] = useState<string>('');
  const [formLessonPromptTemplate, setFormLessonPromptTemplate] = useState<string>('');
  const [formLessonMaterials, setFormLessonMaterials] = useState<LessonSupportMaterial[]>([]);
  const [formNewMaterialTitle, setFormNewMaterialTitle] = useState<string>('');
  const [formNewMaterialUrl, setFormNewMaterialUrl] = useState<string>('');
  const [formNewMaterialType, setFormNewMaterialType] = useState<'pdf' | 'link' | 'download' | 'prompt'>('pdf');

  const [formNewModuleTitle, setFormNewModuleTitle] = useState<string>('');
  const [formNewModuleDescription, setFormNewModuleDescription] = useState<string>('');
  const [formNewModuleBadge, setFormNewModuleBadge] = useState<string>('NOVO MÓDULO');

  const [savingLesson, setSavingLesson] = useState(false);
  const [saveLessonError, setSaveLessonError] = useState<string | null>(null);

  useEffect(() => {
    saveStoredAcademyData({
      ...academyData,
      activeLessonId
    });
  }, [academyData, activeLessonId]);

  useEffect(() => {
    const unsubscribe = subscribeToAcademy(({ modules, lessons }) => {
      setAcademyData((prev) => ({
        ...prev,
        modules,
        lessons
      }));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (activeLessonId) {
      setActiveNoteText(academyData.userNotesByLesson[activeLessonId] || '');
    }
  }, [activeLessonId, academyData.userNotesByLesson]);

  const activeLesson: LessonItem | undefined = useMemo(() => {
    return (
      academyData.lessons.find((l) => l.id === activeLessonId) ||
      academyData.lessons[0]
    );
  }, [academyData.lessons, activeLessonId]);

  const activeModule: CourseModule | undefined = useMemo(() => {
    if (!activeLesson) return undefined;
    return academyData.modules.find((m) => m.id === activeLesson.moduleId);
  }, [academyData.modules, activeLesson]);

  const totalLessonsCount = academyData.lessons.length;
  const completedLessonsCount = academyData.completedLessonIds.length;
  const progressPercentage =
    totalLessonsCount > 0
      ? Math.round((completedLessonsCount / totalLessonsCount) * 100)
      : 0;

  const handleToggleCompleted = (lessonId: string) => {
    setAcademyData((prev) => {
      const isAlready = prev.completedLessonIds.includes(lessonId);
      const updated = isAlready
        ? prev.completedLessonIds.filter((id) => id !== lessonId)
        : [...prev.completedLessonIds, lessonId];
      return {
        ...prev,
        completedLessonIds: updated
      };
    });
  };

  const handleNextLesson = () => {
    const currentIndex = academyData.lessons.findIndex((l) => l.id === activeLessonId);
    if (currentIndex !== -1 && currentIndex < academyData.lessons.length - 1) {
      const nextLesson = academyData.lessons[currentIndex + 1];
      setActiveLessonId(nextLesson.id);
    }
  };

  const handlePrevLesson = () => {
    const currentIndex = academyData.lessons.findIndex((l) => l.id === activeLessonId);
    if (currentIndex > 0) {
      const prevLesson = academyData.lessons[currentIndex - 1];
      setActiveLessonId(prevLesson.id);
    }
  };

  const handleSaveNote = () => {
    if (!activeLessonId) return;
    setAcademyData((prev) => ({
      ...prev,
      userNotesByLesson: {
        ...prev.userNotesByLesson,
        [activeLessonId]: activeNoteText
      }
    }));
    setNoteSaveStatus(true);
    setTimeout(() => setNoteSaveStatus(false), 2000);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const toggleModuleCollapse = (moduleId: string) => {
    setCollapsedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const resetLessonForm = () => {
    setEditingLessonId(null);
    setFormLessonTitle('');
    setFormLessonModuleId(academyData.modules[0]?.id || '');
    setFormLessonYoutubeUrl('');
    setFormLessonDuration('10:00');
    setFormLessonDescription('');
    setFormLessonKeyTakeaways('');
    setFormLessonPromptTemplate('');
    setFormLessonMaterials([]);
    setFormNewMaterialTitle('');
    setFormNewMaterialUrl('');
  };

  const handleStartEditLesson = (lesson: LessonItem) => {
    setEditingLessonId(lesson.id);
    setFormLessonTitle(lesson.title);
    setFormLessonModuleId(lesson.moduleId);
    setFormLessonYoutubeUrl(lesson.youtubeUrlOrId || lesson.youtubeId || '');
    setFormLessonDuration(lesson.duration || '10:00');
    setFormLessonDescription(lesson.description || '');
    setFormLessonKeyTakeaways((lesson.keyTakeaways || []).join('\n'));
    setFormLessonPromptTemplate(lesson.promptTemplate || '');
    setFormLessonMaterials(lesson.materials || []);
    setManageTab('add_lesson');
    setIsManageModalOpen(true);
  };

  const handleAddMaterialToForm = () => {
    if (!formNewMaterialTitle.trim()) return;
    const newMat: LessonSupportMaterial = {
      id: 'mat-' + Date.now(),
      title: formNewMaterialTitle.trim(),
      url: formNewMaterialUrl.trim() || '#',
      type: formNewMaterialType
    };
    setFormLessonMaterials([...formLessonMaterials, newMat]);
    setFormNewMaterialTitle('');
    setFormNewMaterialUrl('');
  };

  const handleRemoveMaterialFromForm = (matId: string) => {
    setFormLessonMaterials(formLessonMaterials.filter((m) => m.id !== matId));
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLessonError(null);
    setSavingLesson(true);

    try {
      const cleanId = extractYouTubeId(formLessonYoutubeUrl);

      if (!cleanId) {
        throw new Error('Por favor, informe um link ou ID válido do YouTube.');
      }

      if (!formLessonTitle.trim()) {
        throw new Error('Informe o título da videoaula.');
      }

      const takeawaysArray = formLessonKeyTakeaways
        .split('\n')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      let lessonToSave: LessonItem;

      if (editingLessonId) {
        const existing = academyData.lessons.find((l) => l.id === editingLessonId);
        lessonToSave = {
          id: editingLessonId,
          title: formLessonTitle.trim(),
          moduleId: formLessonModuleId || academyData.modules[0]?.id || 'mod-1',
          youtubeUrlOrId: formLessonYoutubeUrl.trim(),
          youtubeId: cleanId,
          duration: formLessonDuration.trim() || '10:00',
          description: formLessonDescription.trim(),
          keyTakeaways: takeawaysArray,
          promptTemplate: formLessonPromptTemplate.trim(),
          materials: formLessonMaterials,
          order: existing?.order || academyData.lessons.length + 1,
          published: true,
          createdAt: existing?.createdAt || new Date().toISOString()
        };
      } else {
        lessonToSave = {
          id: 'les-' + Date.now(),
          moduleId: formLessonModuleId || academyData.modules[0]?.id || 'mod-1',
          title: formLessonTitle.trim(),
          duration: formLessonDuration.trim() || '10:00',
          youtubeUrlOrId: formLessonYoutubeUrl.trim(),
          youtubeId: cleanId,
          description: formLessonDescription.trim(),
          keyTakeaways: takeawaysArray,
          promptTemplate: formLessonPromptTemplate.trim(),
          materials: formLessonMaterials,
          order: academyData.lessons.length + 1,
          published: true,
          createdAt: new Date().toISOString()
        };
      }

      await saveAcademyLessonToFirestore(lessonToSave);

      alert('✅ Aula salva com sucesso! Os alunos já conseguem ver.');

      resetLessonForm();
      setIsManageModalOpen(false);
      setEditingLessonId(null);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
      setSaveLessonError(errorMsg);
      alert(`❌ Erro ao salvar aula:\n${errorMsg}`);
    } finally {
      setSavingLesson(false);
    }
  };

  const handleDeleteLesson = (lessonId: string) => {
    if (confirm('Tem certeza que deseja excluir esta videoaula da sua área de membros?')) {
      deleteAcademyLessonFromFirestore(lessonId).catch((err) =>
        console.error('[Academy] Error deleting lesson:', err)
      );
    }
  };

  const handleCreateModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNewModuleTitle.trim()) return;

    const newMod: CourseModule = {
      id: 'mod-' + Date.now(),
      title: formNewModuleTitle.trim(),
      description: formNewModuleDescription.trim(),
      order: academyData.modules.length + 1,
      badge: formNewModuleBadge.trim() || 'MÓDULO VIP'
    };

    setAcademyData((prev) => ({
      ...prev,
      modules: [...prev.modules, newMod]
    }));

    setFormNewModuleTitle('');
    setFormNewModuleDescription('');
    setFormNewModuleBadge('MÓDULO VIP');
  };

  const handleDeleteModule = (moduleId: string) => {
    if (academyData.modules.length <= 1) {
      alert('Você deve manter pelo menos um módulo no curso.');
      return;
    }
    if (confirm('Excluir este módulo? As aulas vinculadas a ele serão movidas para o primeiro módulo.')) {
      const targetModId = academyData.modules.find((m) => m.id !== moduleId)?.id || 'mod-1';
      setAcademyData((prev) => ({
        ...prev,
        modules: prev.modules.filter((m) => m.id !== moduleId),
        lessons: prev.lessons.map((l) => (l.moduleId === moduleId ? { ...l, moduleId: targetModId } : l))
      }));
    }
  };

  const handleResetCourse = () => {
    if (confirm('Deseja restaurar a grade de aulas original da Academia? Todas as alterações personalizadas serão redefinidas.')) {
      const res = resetStoredAcademyData();
      setAcademyData(res);
      setActiveLessonId(res.lessons[0]?.id || '');
      setIsManageModalOpen(false);
    }
  };

  const filteredModulesWithLessons = useMemo(() => {
    return academyData.modules.map((mod) => {
      let modLessons = academyData.lessons.filter((l) => {
        if (!isAdmin && l.published === false) return false;
        return l.moduleId === mod.id;
      });
      if (lessonSearchQuery.trim()) {
        const q = lessonSearchQuery.toLowerCase();
        modLessons = modLessons.filter(
          (l) =>
            l.title.toLowerCase().includes(q) ||
            (l.description && l.description.toLowerCase().includes(q))
        );
      }
      return {
        module: mod,
        lessons: modLessons
      };
    });
  }, [academyData.modules, academyData.lessons, lessonSearchQuery, isAdmin]);

  const activeLessonIsCompleted = activeLesson
    ? academyData.completedLessonIds.includes(activeLesson.id)
    : false;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      {isCinemaMode && (
        <div
          className="fixed inset-0 bg-black/90 z-40 transition-opacity duration-300 backdrop-blur-md"
          onClick={() => setIsCinemaMode(false)}
        />
      )}

      {/* TOP HEADER */}
      <div className="bg-[#0C0F17] border border-[#1E293B] rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5C542]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5C542]/15 border border-[#F5C542]/30 text-[#F5C542] text-[11px] font-black uppercase tracking-wider shadow-sm">
                <Film className="w-3.5 h-3.5" />
                <span>Área de Membros VIP • Videoaulas Exclusivas</span>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3" />
                <span>Player Integrado White-Label</span>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Academia de Reviews & Conversão Sincera
            </h1>

            <p className="text-xs md:text-sm text-[#94A3B8] leading-relaxed">
              Assista às videoaulas completas, baixe materiais de apoio, copie prompts prontos e domine todas as estratégias de mineração, geração com IA e monetização.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4 shrink-0">
            <div className="bg-[#131B2A] border border-[#24334A] rounded-2xl p-3.5 w-full sm:w-64 space-y-2 shadow-inner">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#94A3B8] font-medium flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#F5C542]" />
                  <span>Seu Progresso:</span>
                </span>
                <span className="font-mono font-bold text-white">
                  {completedLessonsCount}/{totalLessonsCount} ({progressPercentage}%)
                </span>
              </div>

              <div className="w-full h-2 bg-[#0A0E17] rounded-full overflow-hidden p-0.5 border border-[#1E293B]">
                <div
                  className="h-full bg-gradient-to-r from-[#F5C542] to-[#22C55E] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#64748B]">
                <span>Status: {progressPercentage === 100 ? '🎉 Concluído' : 'Em Andamento'}</span>
                <span>Acesso Vitalício</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {onSwitchToGuide && (
                <button
                  type="button"
                  onClick={onSwitchToGuide}
                  className="flex items-center gap-1.5 bg-[#131B2A] hover:bg-[#1E293B] text-[#94A3B8] hover:text-white px-3 py-2 rounded-xl text-xs font-bold border border-[#24334A] transition-colors cursor-pointer"
                  title="Ver guias escritos em texto"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Guias em Texto</span>
                </button>
              )}

              {isAdmin ? (
                <button
                  type="button"
                  onClick={() => {
                    resetLessonForm();
                    setManageTab('add_lesson');
                    setIsManageModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] font-black px-4 py-2 rounded-xl text-xs shadow-lg shadow-[#F5C542]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Subir / Gerenciar Videoaulas</span>
                </button>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Acesso VIP Gratuito Ativo</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* QUICK SHORTCUTS TOOLBAR */}
      <div className="bg-[#0C0F17] border border-[#1E293B] rounded-2xl p-3 shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-[#F5C542]" />
            <span>Atalhos Rápidos do Aplicativo</span>
          </span>
          <span className="text-[10px] text-[#64748B]">Navegação instantânea</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2">
          <button
            type="button"
            onClick={() => onNavigateTo?.('dashboard')}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#131B2A] hover:bg-[#1E293B] text-white border border-[#24334A] hover:border-[#F5C542]/40 transition-all group cursor-pointer"
          >
            <Home className="w-4 h-4 text-[#F5C542] group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[11px] font-bold truncate">Início</span>
          </button>

          <button
            type="button"
            onClick={() => onSwitchToGuide ? onSwitchToGuide() : onNavigateTo?.('tutorial')}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#131B2A] hover:bg-[#1E293B] text-white border border-[#24334A] hover:border-[#38BDF8]/40 transition-all group cursor-pointer"
          >
            <Zap className="w-4 h-4 text-[#38BDF8] group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[11px] font-bold truncate">Início Rápido</span>
          </button>

          <button
            type="button"
            onClick={() => onNewReview?.()}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#131B2A] hover:bg-[#1E293B] text-white border border-[#24334A] hover:border-[#F5C542]/40 transition-all group cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#F5C542] group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[11px] font-bold truncate">Gerador</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTo?.('templates')}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#131B2A] hover:bg-[#1E293B] text-white border border-[#24334A] hover:border-purple-400/40 transition-all group cursor-pointer"
          >
            <LayoutTemplate className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[11px] font-bold truncate">Templates</span>
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={() => onNavigateTo?.('settings-banners')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#131B2A] hover:bg-[#1E293B] text-white border border-[#24334A] hover:border-emerald-400/40 transition-all group cursor-pointer"
            >
              <DollarSign className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[11px] font-bold truncate">Banners</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onNavigateTo?.('campeoes')}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#131B2A] hover:bg-[#1E293B] text-white border border-[#24334A] hover:border-[#F5C542]/40 transition-all group cursor-pointer"
          >
            <Award className="w-4 h-4 text-[#F5C542] group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[11px] font-bold truncate">Campeões</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: PLAYER & DETAILS */}
        <div className={`lg:col-span-8 space-y-5 ${isCinemaMode ? 'relative z-50' : ''}`}>
          {activeLesson ? (
            <div className="space-y-4">
              <div className="bg-[#0A0D14] border border-[#1E293B] rounded-3xl overflow-hidden shadow-2xl relative">
                <div className="bg-[#0D111A] border-b border-[#1E293B] px-4 py-2.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="w-2 h-2 rounded-full bg-[#F5C542] animate-pulse shrink-0" />
                    <span className="text-[11px] font-bold text-[#F5C542] uppercase tracking-wider shrink-0">
                      {activeModule ? activeModule.title.split(':')[0] : 'AULA'}
                    </span>
                    <span className="text-xs text-[#64748B] shrink-0">•</span>
                    <span className="text-xs font-semibold text-white truncate">
                      {activeLesson.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#131B2A] text-[#38BDF8] border border-[#24334A]">
                      1080p HD
                    </span>

                    <button
                      type="button"
                      onClick={() => setIsCinemaMode(!isCinemaMode)}
                      className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                        isCinemaMode
                          ? 'bg-[#F5C542] text-black border-[#F5C542]'
                          : 'bg-[#131B2A] text-[#94A3B8] hover:text-white border-[#24334A]'
                      }`}
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold hidden sm:inline">
                        {isCinemaMode ? 'Luzes ON' : 'Modo Cinema'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="relative w-full">
                  <CustomVideoPlayer
                    videoUrlOrId={activeLesson.youtubeId || ''}
                    title={activeLesson.title}
                    moduleName={activeModule?.title}
                    duration={activeLesson.duration}
                    hasNextLesson={academyData.lessons.findIndex((l) => l.id === activeLessonId) < academyData.lessons.length - 1}
                    onNextLesson={handleNextLesson}
                    onMarkCompleted={() => {
                      if (!activeLessonIsCompleted) {
                        handleToggleCompleted(activeLesson.id);
                      }
                    }}
                    isCompleted={activeLessonIsCompleted}
                  />
                </div>

                <div className="bg-[#0D111A] border-t border-[#1E293B] p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleCompleted(activeLesson.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm ${
                        activeLessonIsCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-[#1E293B] hover:bg-[#334155] text-white border border-[#334155]'
                      }`}
                    >
                      {activeLessonIsCompleted ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Aula Concluída</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4 text-[#94A3B8]" />
                          <span>Marcar como Concluída</span>
                        </>
                      )}
                    </button>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleStartEditLesson(activeLesson)}
                        className="flex items-center gap-1.5 bg-[#131B2A] hover:bg-[#1E293B] text-[#94A3B8] hover:text-white px-3 py-2 rounded-xl text-xs font-semibold border border-[#24334A] transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#38BDF8]" />
                        <span className="hidden sm:inline">Editar Vídeo</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrevLesson}
                      disabled={academyData.lessons.findIndex((l) => l.id === activeLessonId) <= 0}
                      className="flex items-center gap-1.5 bg-[#131B2A] hover:bg-[#1E293B] disabled:opacity-40 disabled:pointer-events-none text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-[#24334A] transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Anterior</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextLesson}
                      disabled={
                        academyData.lessons.findIndex((l) => l.id === activeLessonId) >=
                        academyData.lessons.length - 1
                      }
                      className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 disabled:pointer-events-none text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                    >
                      <span>Próxima Aula</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* LESSON DETAILS & TABS */}
              <div className="bg-[#0D111A] border border-[#1E293B] rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
                <div className="space-y-2 border-b border-[#1E293B] pb-5">
                  <div className="flex flex-wrap items-center gap-2">
                    {activeModule && (
                      <span className="text-xs font-bold text-[#F5C542] uppercase tracking-wider">
                        {activeModule.title}
                      </span>
                    )}
                    <span className="text-xs text-[#64748B]">•</span>
                    <span className="text-xs text-[#94A3B8] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#64748B]" />
                      <span>Duração: {activeLesson.duration}</span>
                    </span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                    {activeLesson.title}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-b border-[#1E293B] pb-3">
                  {[
                    { id: 'overview', label: 'Visão Geral & Conteúdo', icon: FileText },
                    {
                      id: 'materials',
                      label: `Materiais & Prompts (${(activeLesson.materials?.length || 0) + (activeLesson.promptTemplate ? 1 : 0)})`,
                      icon: Download
                    },
                    { id: 'notes', label: 'Minhas Anotações', icon: Bookmark },
                    { id: 'faq', label: 'Dúvidas Frequentes', icon: HelpCircle }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = lessonActiveTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setLessonActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#F5C542] text-[#080808] shadow-md'
                            : 'text-[#94A3B8] hover:text-white hover:bg-[#131B2A]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {lessonActiveTab === 'overview' && (
                  <div className="space-y-6 animate-in fade-in">
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-[#A1A1A1] uppercase tracking-wider">
                        Resumo da Aula
                      </h4>
                      <p className="text-xs md:text-sm text-[#CBD5E1] leading-relaxed">
                        {activeLesson.description ||
                          'Assista ao vídeo acima para acompanhar todo o passo a passo demonstrado na prática.'}
                      </p>
                    </div>

                    {activeLesson.keyTakeaways && activeLesson.keyTakeaways.length > 0 && (
                      <div className="bg-[#080B11] border border-[#1E293B] rounded-2xl p-5 space-y-3">
                        <h4 className="text-xs font-bold text-white flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#F5C542]" />
                          <span>O que você vai aprender nesta aula:</span>
                        </h4>
                        <ul className="space-y-2.5">
                          {activeLesson.keyTakeaways.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs text-[#94A3B8]">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {lessonActiveTab === 'materials' && (
                  <div className="space-y-5 animate-in fade-in">
                    {activeLesson.promptTemplate && (
                      <div className="bg-[#080B11] border border-[#1E293B] rounded-2xl p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#F5C542]" />
                            <span>Prompt Oficial Recomendado para Esta Aula</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(activeLesson.promptTemplate!)}
                            className="flex items-center gap-1 text-xs text-[#F5C542] hover:underline font-bold cursor-pointer"
                          >
                            {copiedText === activeLesson.promptTemplate ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copiar Prompt</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="bg-[#05070A] p-3.5 rounded-xl border border-[#1A2233] text-xs font-mono text-[#E2E8F0] leading-relaxed">
                          {activeLesson.promptTemplate}
                        </div>
                      </div>
                    )}

                    {activeLesson.materials && activeLesson.materials.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-[#A1A1A1] uppercase tracking-wider">
                          Arquivos de Apoio & Links Complementares
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {activeLesson.materials.map((mat) => (
                            <div
                              key={mat.id}
                              className="p-4 bg-[#080B11] border border-[#1E293B] rounded-xl flex items-center justify-between gap-3 hover:border-[#38BDF8]/40 transition-colors group"
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-9 h-9 rounded-lg bg-[#131B2A] border border-[#24334A] flex items-center justify-center text-[#38BDF8] shrink-0">
                                  {mat.type === 'pdf' ? (
                                    <FileText className="w-4 h-4" />
                                  ) : (
                                    <Download className="w-4 h-4" />
                                  )}
                                </div>
                                <div className="overflow-hidden">
                                  <span className="text-xs font-bold text-white block truncate group-hover:text-[#38BDF8] transition-colors">
                                    {mat.title}
                                  </span>
                                  <span className="text-[10px] text-[#64748B] uppercase">
                                    {mat.type.toUpperCase()} • DOWNLOAD DISPONÍVEL
                                  </span>
                                </div>
                              </div>

                              <a
                                href={mat.url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-[#131B2A] hover:bg-[#2563EB] text-[#E2E8F0] hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0"
                              >
                                Baixar
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {lessonActiveTab === 'notes' && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-white flex items-center gap-2">
                          <Bookmark className="w-4 h-4 text-[#F5C542]" />
                          <span>Meu Bloco de Notas Pessoal da Aula</span>
                        </h4>
                        <p className="text-[11px] text-[#94A3B8]">
                          Suas anotações são salvas automaticamente no seu navegador.
                        </p>
                      </div>

                      {noteSaveStatus && (
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Salvo com sucesso!</span>
                        </span>
                      )}
                    </div>

                    <textarea
                      value={activeNoteText}
                      onChange={(e) => setActiveNoteText(e.target.value)}
                      placeholder="Anote aqui seus insights, produtos minerados, ideias de review ou termos da aula..."
                      rows={6}
                      className="w-full bg-[#07090F] border border-[#1E293B] rounded-2xl p-4 text-xs md:text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#3B82F6] transition-colors leading-relaxed resize-y"
                    />

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleSaveNote}
                        className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue-500/20"
                      >
                        Salvar Anotações
                      </button>
                    </div>
                  </div>
                )}

                {lessonActiveTab === 'faq' && (
                  <div className="space-y-3 animate-in fade-in">
                    <div className="p-4 bg-[#080B11] border border-[#1E293B] rounded-2xl space-y-1.5">
                      <strong className="text-xs text-white block">
                        Como faço para assistir novamente a esta aula?
                      </strong>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">
                        Você pode navegar pelo menu lateral a qualquer momento e rever quantas vezes quiser. Seu progresso permanece salvo.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#0A0D14] border border-[#1E293B] rounded-3xl p-12 text-center space-y-3">
              <Tv className="w-12 h-12 text-[#94A3B8] mx-auto opacity-40" />
              <h3 className="text-base font-bold text-white">Nenhuma aula cadastrada ainda.</h3>
            </div>
          )}
        </div>

        {/* RIGHT: PLAYLIST SIDEBAR */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#0D111A] border border-[#1E293B] rounded-3xl p-5 md:p-6 space-y-4 shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#F5C542]" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Grade de Aulas
                  </h3>
                </div>
                <span className="text-xs text-[#94A3B8] font-mono">
                  {totalLessonsCount} aulas
                </span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={lessonSearchQuery}
                  onChange={(e) => setLessonSearchQuery(e.target.value)}
                  placeholder="Pesquisar aula..."
                  className="w-full bg-[#07090F] border border-[#1E293B] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#3B82F6]"
                />
                <Search className="w-3.5 h-3.5 text-[#666] absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
              {filteredModulesWithLessons.map(({ module: mod, lessons }) => {
                const isCollapsed = collapsedModules[mod.id] || false;
                const completedInModule = lessons.filter((l) =>
                  academyData.completedLessonIds.includes(l.id)
                ).length;

                return (
                  <div
                    key={mod.id}
                    className="bg-[#080B11] border border-[#1E293B] rounded-2xl overflow-hidden shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => toggleModuleCollapse(mod.id)}
                      className="w-full p-3.5 text-left flex items-center justify-between gap-2 hover:bg-[#121826] transition-colors cursor-pointer"
                    >
                      <div className="space-y-0.5 overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#131B2A] text-[#F5C542] border border-[#F5C542]/20">
                            {mod.badge || `MÓDULO ${mod.order}`}
                          </span>
                          <span className="text-[10px] text-[#64748B]">
                            {completedInModule}/{lessons.length}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-white block truncate">
                          {mod.title}
                        </span>
                      </div>

                      <div className="shrink-0 text-[#777]">
                        {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </div>
                    </button>

                    {!isCollapsed && (
                      <div className="border-t border-[#1E293B]/60 divide-y divide-[#1E293B]/40">
                        {lessons.map((lesson) => {
                          const isActive = lesson.id === activeLessonId;
                          const isDone = academyData.completedLessonIds.includes(lesson.id);

                          return (
                            <button
                              key={lesson.id}
                              type="button"
                              onClick={() => setActiveLessonId(lesson.id)}
                              className={`w-full p-3 text-left flex items-start gap-3 transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-[#151D2E] border-l-4 border-l-[#F5C542]'
                                  : 'hover:bg-[#0E131F]'
                              }`}
                            >
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleCompleted(lesson.id);
                                }}
                                className="mt-0.5 shrink-0 text-[#777] hover:text-white cursor-pointer"
                              >
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                ) : isActive ? (
                                  <Play className="w-4 h-4 text-[#F5C542] fill-current animate-pulse" />
                                ) : (
                                  <Circle className="w-4 h-4 text-[#475569]" />
                                )}
                              </div>

                              <div className="space-y-1 overflow-hidden flex-1">
                                <span
                                  className={`text-xs font-semibold block leading-tight truncate ${
                                    isActive
                                      ? 'text-[#F5C542] font-bold'
                                      : isDone
                                      ? 'text-[#94A3B8]'
                                      : 'text-[#CBD5E1]'
                                  }`}
                                >
                                  {lesson.title}
                                </span>

                                <div className="flex items-center gap-2 text-[10px] text-[#64748B]">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{lesson.duration}</span>
                                  </span>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {isAdmin && (
              <div className="pt-2 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => {
                    resetLessonForm();
                    setManageTab('add_lesson');
                    setIsManageModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-[#131B2A] hover:bg-[#1E293B] text-[#CBD5E1] hover:text-white rounded-xl text-xs font-bold border border-[#24334A] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#F5C542]" />
                  <span>Adicionar Nova Videoaula</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MANAGE MODAL */}
      {isManageModalOpen && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0D111A] border border-[#1E293B] rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl my-8">
            <div className="bg-[#0A0D14] border-b border-[#1E293B] p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F5C542]/15 border border-[#F5C542]/30 flex items-center justify-center text-[#F5C542]">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingLessonId ? 'Editar Videoaula' : 'Gerenciar Videoaulas & Módulos'}
                  </h3>
                  <p className="text-[11px] text-[#94A3B8]">
                    Adicione ou edite videoaulas pelo YouTube no formato White-Label VIP.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  resetLessonForm();
                  setIsManageModalOpen(false);
                }}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 px-6 pt-4 border-b border-[#1E293B]">
              {[
                { id: 'add_lesson', label: editingLessonId ? 'Editar Aula' : 'Nova Aula' },
                { id: 'manage_lessons', label: 'Gerenciar Aulas' },
                { id: 'modules', label: 'Gerenciar Módulos' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setManageTab(tab.id as any)}
                  className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                    manageTab === tab.id
                      ? 'border-[#F5C542] text-[#F5C542]'
                      : 'border-transparent text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
              {manageTab === 'add_lesson' && (
                <form onSubmit={handleSaveLesson} className="space-y-4">
                  {saveLessonError && (
                    <div className="p-3 bg-[#EF4444]/20 border border-[#EF4444] rounded-lg text-[#EF4444] text-xs font-mono">
                      <div className="font-bold mb-1">❌ Erro ao Salvar:</div>
                      <div>{saveLessonError}</div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white">Título da Videoaula *</label>
                      <input
                        type="text"
                        required
                        value={formLessonTitle}
                        onChange={(e) => setFormLessonTitle(e.target.value)}
                        placeholder="Ex: Como minerar produtos ocultos"
                        className="w-full bg-[#07090F] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white">Módulo do Curso *</label>
                      <select
                        value={formLessonModuleId}
                        onChange={(e) => setFormLessonModuleId(e.target.value)}
                        className="w-full bg-[#07090F] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-white"
                      >
                        {academyData.modules.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white">Link ou ID do YouTube *</label>
                      <input
                        type="text"
                        required
                        value={formLessonYoutubeUrl}
                        onChange={(e) => setFormLessonYoutubeUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full bg-[#07090F] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white">Duração Estimada</label>
                      <input
                        type="text"
                        value={formLessonDuration}
                        onChange={(e) => setFormLessonDuration(e.target.value)}
                        placeholder="Ex: 15:30"
                        className="w-full bg-[#07090F] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white">Descrição da Aula</label>
                    <textarea
                      rows={3}
                      value={formLessonDescription}
                      onChange={(e) => setFormLessonDescription(e.target.value)}
                      placeholder="Resumo prático do que será abordado..."
                      className="w-full bg-[#07090F] border border-[#1E293B] rounded-xl p-3.5 text-xs text-white"
                    />
                  </div>

                  <div className="pt-4 border-t border-[#1E293B] flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsManageModalOpen(false)}
                      className="px-4 py-2.5 bg-[#131B2A] text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={savingLesson}
                      className="px-6 py-2.5 bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] rounded-xl text-xs font-black cursor-pointer shadow-lg shadow-[#F5C542]/20"
                    >
                      {savingLesson ? '⏳ Salvando no Firestore...' : editingLessonId ? 'Salvar Alterações' : '✅ Cadastrar Videoaula'}
                    </button>
                  </div>
                </form>
              )}

              {manageTab === 'manage_lessons' && (
                <div className="space-y-3">
                  <div className="text-xs text-[#94A3B8] mb-2">
                    Lista completa de aulas cadastradas no Firestore. Você pode editá-las ou excluí-las.
                  </div>
                  {academyData.lessons.map((les) => (
                    <div
                      key={les.id}
                      className="p-3.5 bg-[#080B11] border border-[#1E293B] rounded-2xl flex items-center justify-between gap-3"
                    >
                      <div className="overflow-hidden">
                        <span className="text-xs font-bold text-white block truncate">{les.title}</span>
                        <span className="text-[10px] text-[#64748B]">Duração: {les.duration}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEditLesson(les)}
                          className="px-3 py-1.5 bg-[#131B2A] hover:bg-[#1E293B] text-[#38BDF8] rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLesson(les.id)}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {manageTab === 'modules' && (
                <div className="space-y-4">
                  <form onSubmit={handleCreateModule} className="p-4 bg-[#080B11] border border-[#1E293B] rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-white">Criar Novo Módulo</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={formNewModuleTitle}
                        onChange={(e) => setFormNewModuleTitle(e.target.value)}
                        placeholder="Título do Módulo"
                        className="bg-[#07090F] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={formNewModuleBadge}
                        onChange={(e) => setFormNewModuleBadge(e.target.value)}
                        placeholder="Badge (Ex: MÓDULO VIP)"
                        className="bg-[#07090F] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#F5C542] text-[#080808] rounded-xl text-xs font-black cursor-pointer"
                    >
                      Adicionar Módulo
                    </button>
                  </form>

                  <div className="space-y-3">
                    {academyData.modules.map((mod) => (
                      <div
                        key={mod.id}
                        className="p-3.5 bg-[#080B11] border border-[#1E293B] rounded-2xl flex items-center justify-between gap-3"
                      >
                        <div className="overflow-hidden">
                          <span className="text-xs font-bold text-white block truncate">{mod.title}</span>
                          <span className="text-[10px] text-[#F5C542]">{mod.badge}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteModule(mod.id)}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Excluir Módulo
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
