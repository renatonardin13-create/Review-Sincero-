import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  PlusCircle,
  Edit3,
  Trash2,
  Check,
  X,
  Play,
  Clock,
  Layers,
  Sparkles,
  AlertCircle,
  Eye,
  Send,
  Video
} from 'lucide-react';
import { AcademyModule, AcademyLesson, AuthUser, ADMIN_EMAIL } from '../types';
import {
  subscribeAcademyModules,
  subscribeAcademyLessons,
  saveAcademyModule,
  deleteAcademyModule,
  saveAcademyLesson,
  deleteAcademyLesson
} from '../services/academyService';

interface AcademyManagerProps {
  currentUser: AuthUser;
}

export const AcademyManager: React.FC<AcademyManagerProps> = ({ currentUser }) => {
  const isAdmin = currentUser?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();

  const [modules, setModules] = useState<AcademyModule[]>([]);
  const [lessons, setLessons] = useState<AcademyLesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Module modal state
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Partial<AcademyModule> | null>(null);

  // Lesson modal state
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Partial<AcademyLesson> | null>(null);

  useEffect(() => {
    const unsubMods = subscribeAcademyModules(setModules);
    const unsubLess = subscribeAcademyLessons(setLessons);
    return () => {
      unsubMods();
      unsubLess();
    };
  }, []);

  const openNewModule = () => {
    setEditingModule({
      title: '',
      description: '',
      order: modules.length + 1,
      status: 'published'
    });
    setIsModuleModalOpen(true);
  };

  const openEditModule = (mod: AcademyModule) => {
    setEditingModule({ ...mod });
    setIsModuleModalOpen(true);
  };

  const openNewLesson = (defaultModuleId?: string) => {
    const targetModId = defaultModuleId || (modules[0]?.id ?? '');
    const currentLessonsInMod = lessons.filter((l) => l.moduleId === targetModId);

    setEditingLesson({
      moduleId: targetModId,
      title: '',
      description: '',
      videoUrl: '',
      thumbnailUrl: '',
      duration: '15 min',
      order: currentLessonsInMod.length + 1,
      status: 'published'
    });
    setIsLessonModalOpen(true);
  };

  const openEditLesson = (les: AcademyLesson) => {
    setEditingLesson({ ...les });
    setIsLessonModalOpen(true);
  };

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule) return;
    setLoading(true);
    setMessage(null);

    const res = await saveAcademyModule(editingModule, currentUser);
    setLoading(false);
    if (res.success) {
      setIsModuleModalOpen(false);
      setMessage({ type: 'success', text: 'Módulo salvo com sucesso!' });
    } else {
      setMessage({ type: 'error', text: res.error || 'Erro ao salvar módulo.' });
    }
  };

  const handleDeleteModule = async (moduleId: string, title: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o módulo "${title}"? As aulas dele deverão ser reatribuídas.`)) {
      return;
    }
    setLoading(true);
    const res = await deleteAcademyModule(moduleId, currentUser);
    setLoading(false);
    if (res.success) {
      setMessage({ type: 'success', text: 'Módulo excluído com sucesso.' });
    } else {
      setMessage({ type: 'error', text: res.error || 'Erro ao excluir módulo.' });
    }
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;
    setLoading(true);
    setMessage(null);

    const res = await saveAcademyLesson(editingLesson, currentUser);
    setLoading(false);
    if (res.success) {
      setIsLessonModalOpen(false);
      setMessage({
        type: 'success',
        text: editingLesson.status === 'published'
          ? 'Aula salva e publicada! Notificação automática enviada aos usuários.'
          : 'Aula salva como rascunho.'
      });
    } else {
      setMessage({ type: 'error', text: res.error || 'Erro ao salvar aula.' });
    }
  };

  const handleDeleteLesson = async (lessonId: string, title: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir a aula "${title}"?`)) {
      return;
    }
    setLoading(true);
    const res = await deleteAcademyLesson(lessonId, currentUser);
    setLoading(false);
    if (res.success) {
      setMessage({ type: 'success', text: 'Aula excluída com sucesso.' });
    } else {
      setMessage({ type: 'error', text: res.error || 'Erro ao excluir aula.' });
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-8 text-center text-red-400 bg-red-950/20 border border-red-800/30 rounded-2xl">
        Acesso restrito ao Administrador Master.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141418] border border-[#26262E] p-6 rounded-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-[#F5C542] text-xs font-black uppercase">
            <GraduationCap className="w-4 h-4" />
            <span>GESTÃO DA ACADEMIA REVIEW SINCERO</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">Módulos e Aulas em Vídeo</h2>
          <p className="text-xs text-gray-400">
            Publique aulas práticas. Ao publicar uma aula ou módulo, uma notificação automática é disparada instantaneamente para os usuários.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openNewModule}
            className="px-4 py-2.5 rounded-xl bg-[#22222A] hover:bg-[#2C2C36] border border-[#3C3C48] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#F5C542]" />
            <span>+ NOVO MÓDULO</span>
          </button>

          <button
            onClick={() => openNewLesson()}
            disabled={modules.length === 0}
            className="px-4 py-2.5 rounded-xl bg-[#F5C542] hover:bg-[#FFD95A] text-black text-xs font-extrabold flex items-center gap-2 transition-all shadow-md shadow-[#F5C542]/20 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>+ NOVA AULA</span>
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-medium border flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          {message.type === 'success' ? (
            <Sparkles className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Modules List Container */}
      <div className="space-y-6">
        {modules.length === 0 ? (
          <div className="text-center py-12 bg-[#121215] border border-[#222] rounded-2xl p-6">
            <Layers className="w-10 h-10 text-gray-500 mx-auto mb-3" />
            <p className="text-white font-bold text-sm">Nenhum módulo criado ainda.</p>
            <p className="text-xs text-gray-400 mt-1 mb-4">
              Crie o primeiro módulo para organizar as aulas da Academia.
            </p>
            <button
              onClick={openNewModule}
              className="px-4 py-2 rounded-xl bg-[#F5C542] text-black font-bold text-xs"
            >
              Criar Primeiro Módulo
            </button>
          </div>
        ) : (
          modules.map((mod, modIdx) => {
            const modLessons = lessons.filter((l) => l.moduleId === mod.id);

            return (
              <div
                key={mod.id}
                className="bg-[#121216] border border-[#24242C] rounded-2xl overflow-hidden shadow-lg"
              >
                {/* Module Bar */}
                <div className="p-4 bg-[#181820] border-b border-[#24242C] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#F5C542]/10 border border-[#F5C542]/30 text-[#F5C542] font-black text-xs flex items-center justify-center">
                      {mod.order || modIdx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-white text-sm">{mod.title}</h3>
                        <span
                          className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                            mod.status === 'published'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {mod.status === 'published' ? 'Publicado' : 'Rascunho'}
                        </span>
                      </div>
                      {mod.description && (
                        <p className="text-[11px] text-gray-400 mt-0.5 max-w-xl">
                          {mod.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openNewLesson(mod.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#22222C] hover:bg-[#2C2C38] text-xs font-bold text-[#F5C542] flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Adicionar Aula a este Módulo"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Nova Aula</span>
                    </button>

                    <button
                      onClick={() => openEditModule(mod)}
                      className="p-1.5 rounded-lg bg-[#1F1F26] hover:bg-[#282832] text-gray-300 hover:text-white transition-colors cursor-pointer"
                      title="Editar Módulo"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteModule(mod.id, mod.title)}
                      className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 transition-colors cursor-pointer"
                      title="Excluir Módulo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Lessons in this module */}
                <div className="p-4 space-y-2">
                  {modLessons.length === 0 ? (
                    <div className="py-6 text-center text-xs text-gray-500 border border-dashed border-[#262630] rounded-xl">
                      Nenhuma aula cadastrada neste módulo. Clique em "+ Nova Aula" acima para cadastrar.
                    </div>
                  ) : (
                    modLessons.map((les, lIdx) => (
                      <div
                        key={les.id}
                        className="p-3 rounded-xl bg-[#0D0D10] border border-[#1E1E26] hover:border-[#2E2E3C] flex flex-wrap items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#191922] text-[#F5C542] flex items-center justify-center shrink-0">
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-white truncate">
                                {les.title}
                              </span>
                              <span
                                className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                  les.status === 'published'
                                    ? 'bg-emerald-500/15 text-emerald-400'
                                    : 'bg-amber-500/15 text-amber-400'
                                }`}
                              >
                                {les.status === 'published' ? 'Publicada' : 'Rascunho'}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-0.5">
                              {les.duration && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{les.duration}</span>
                                </span>
                              )}
                              <span className="truncate max-w-xs">{les.videoUrl}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditLesson(les)}
                            className="px-2 py-1 rounded-lg bg-[#1C1C24] hover:bg-[#282834] text-gray-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Editar</span>
                          </button>

                          <button
                            onClick={() => handleDeleteLesson(les.id, les.title)}
                            className="p-1 rounded-lg bg-red-950/20 hover:bg-red-900/40 text-red-400 transition-colors cursor-pointer"
                            title="Excluir Aula"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Module Edit/Create Modal */}
      {isModuleModalOpen && editingModule && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#141418] border border-[#282834] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#242430]">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#F5C542]" />
                <span>{editingModule.id ? 'Editar Módulo' : 'Novo Módulo'}</span>
              </h3>
              <button
                onClick={() => setIsModuleModalOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModule} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 uppercase">Título do Módulo</label>
                <input
                  type="text"
                  required
                  value={editingModule.title || ''}
                  onChange={(e) => setEditingModule({ ...editingModule, title: e.target.value })}
                  placeholder="Ex: MÓDULO 01: Primeiros Passos"
                  className="w-full bg-[#1A1A22] border border-[#2A2A38] text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#F5C542]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 uppercase">Descrição (opcional)</label>
                <textarea
                  rows={2}
                  value={editingModule.description || ''}
                  onChange={(e) => setEditingModule({ ...editingModule, description: e.target.value })}
                  placeholder="Breve resumo do que o aluno vai aprender..."
                  className="w-full bg-[#1A1A22] border border-[#2A2A38] text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#F5C542]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300 uppercase">Ordem de Exibição</label>
                  <input
                    type="number"
                    value={editingModule.order || 1}
                    onChange={(e) =>
                      setEditingModule({ ...editingModule, order: parseInt(e.target.value) || 1 })
                    }
                    className="w-full bg-[#1A1A22] border border-[#2A2A38] text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#F5C542]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300 uppercase">Status</label>
                  <select
                    value={editingModule.status || 'published'}
                    onChange={(e) =>
                      setEditingModule({
                        ...editingModule,
                        status: e.target.value as 'published' | 'draft'
                      })
                    }
                    className="w-full bg-[#1A1A22] border border-[#2A2A38] text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#F5C542]"
                  >
                    <option value="published">Publicado</option>
                    <option value="draft">Rascunho</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#242430]">
                <button
                  type="button"
                  onClick={() => setIsModuleModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-[#F5C542] hover:bg-[#FFD95A] text-black font-extrabold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : 'Salvar Módulo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lesson Edit/Create Modal */}
      {isLessonModalOpen && editingLesson && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#141418] border border-[#282834] rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#242430]">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-[#F5C542]" />
                <span>{editingLesson.id ? 'Editar Aula' : 'Nova Aula'}</span>
              </h3>
              <button
                onClick={() => setIsLessonModalOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 uppercase">Módulo Pertencente</label>
                <select
                  required
                  value={editingLesson.moduleId || ''}
                  onChange={(e) => setEditingLesson({ ...editingLesson, moduleId: e.target.value })}
                  className="w-full bg-[#1A1A22] border border-[#2A2A38] text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#F5C542]"
                >
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 uppercase">Título da Aula</label>
                <input
                  type="text"
                  required
                  value={editingLesson.title || ''}
                  onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                  placeholder="Ex: Aula 01: Introdução ao Review Sincero"
                  className="w-full bg-[#1A1A22] border border-[#2A2A38] text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#F5C542]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 uppercase">URL do Vídeo (YouTube, Vimeo ou Embed)</label>
                <input
                  type="url"
                  required
                  value={editingLesson.videoUrl || ''}
                  onChange={(e) => setEditingLesson({ ...editingLesson, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-[#1A1A22] border border-[#2A2A38] text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#F5C542]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300 uppercase">Duração (Ex: 15 min)</label>
                  <input
                    type="text"
                    value={editingLesson.duration || ''}
                    onChange={(e) => setEditingLesson({ ...editingLesson, duration: e.target.value })}
                    placeholder="12 min"
                    className="w-full bg-[#1A1A22] border border-[#2A2A38] text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#F5C542]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300 uppercase">Ordem no Módulo</label>
                  <input
                    type="number"
                    value={editingLesson.order || 1}
                    onChange={(e) =>
                      setEditingLesson({ ...editingLesson, order: parseInt(e.target.value) || 1 })
                    }
                    className="w-full bg-[#1A1A22] border border-[#2A2A38] text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#F5C542]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 uppercase">Descrição da Aula</label>
                <textarea
                  rows={3}
                  value={editingLesson.description || ''}
                  onChange={(e) => setEditingLesson({ ...editingLesson, description: e.target.value })}
                  placeholder="Explique o que é abordado nesta aula e forneça orientações..."
                  className="w-full bg-[#1A1A22] border border-[#2A2A38] text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#F5C542]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 uppercase">Status da Aula</label>
                <select
                  value={editingLesson.status || 'published'}
                  onChange={(e) =>
                    setEditingLesson({
                      ...editingLesson,
                      status: e.target.value as 'published' | 'draft'
                    })
                  }
                  className="w-full bg-[#1A1A22] border border-[#2A2A38] text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#F5C542]"
                >
                  <option value="published">Publicada (Gera notificação aos alunos)</option>
                  <option value="draft">Rascunho (Visível apenas para o Admin)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-[#F5C542]/5 border border-[#F5C542]/20 text-[11px] text-[#F5C542]">
                💡 Ao marcar como <strong>Publicada</strong>, uma notificação será criada automaticamente para todos os usuários da plataforma.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#242430]">
                <button
                  type="button"
                  onClick={() => setIsLessonModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-[#F5C542] hover:bg-[#FFD95A] text-black font-extrabold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : 'Salvar Aula'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
