import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  Save, 
  ArrowUp, 
  ArrowDown, 
  AlertCircle,
  Sparkles,
  Image as ImageIcon,
  Send
} from 'lucide-react';
import { SystemUpdate, AuthUser, AppSettings } from '../types';
import { 
  fetchSystemUpdates, 
  saveSystemUpdate, 
  deleteSystemUpdate, 
  subscribeSystemUpdates as subscribeToSystemUpdates 
} from '../services/systemUpdateService';
import { validateProductUrl } from '../services/productNotificationService';

interface SystemUpdateManagerProps {
  currentUser: AuthUser;
}

export const SystemUpdateManager: React.FC<SystemUpdateManagerProps> = ({
  currentUser
}) => {
  const [updates, setUpdates] = useState<SystemUpdate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState<string>('');
  const [formMessage, setFormMessage] = useState<string>('');
  const [formImageUrl, setFormImageUrl] = useState<string>('');
  const [formCtaText, setFormCtaText] = useState<string>('Saiba mais');
  const [formCtaUrl, setFormCtaUrl] = useState<string>('');
  const [formVersion, setFormVersion] = useState<string>('v1.0.0');
  const [formPublished, setFormPublished] = useState<boolean>(true);

  useEffect(() => {
    let unsubscribe = () => {};
    fetchSystemUpdates().then(items => {
      setUpdates(items);
      setLoading(false);
    });

    unsubscribe = subscribeToSystemUpdates((items) => {
      setUpdates(items);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormTitle('');
    setFormMessage('');
    setFormImageUrl('');
    setFormCtaText('Saiba mais');
    setFormCtaUrl('');
    setFormVersion('v1.0.' + (updates.length + 1));
    setFormPublished(true);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: SystemUpdate) => {
    setEditingId(item.id);
    setFormTitle(item.title);
    setFormMessage(item.message);
    setFormImageUrl(item.imageUrl || '');
    setFormCtaText(item.ctaText || 'Saiba mais');
    setFormCtaUrl(item.ctaUrl || '');
    setFormVersion(item.version || 'v1.0');
    setFormPublished(item.published);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formTitle.trim()) {
      setErrorMsg('O título da atualização é obrigatório.');
      return;
    }
    if (!formMessage.trim()) {
      setErrorMsg('A mensagem da atualização é obrigatória.');
      return;
    }

    if (formImageUrl.trim()) {
      const imgVal = validateProductUrl(formImageUrl);
      if (!imgVal.valid) {
        setErrorMsg('A URL da imagem deve iniciar com http:// ou https://.');
        return;
      }
    }

    if (formCtaUrl.trim()) {
      const urlVal = validateProductUrl(formCtaUrl);
      if (!urlVal.valid) {
        setErrorMsg('A URL do CTA deve iniciar com http:// ou https://.');
        return;
      }
    }

    const payload: Partial<SystemUpdate> = {
      id: editingId || undefined,
      title: formTitle.trim(),
      message: formMessage.trim(),
      imageUrl: formImageUrl.trim(),
      ctaText: formCtaText.trim() || 'Saiba mais',
      ctaUrl: formCtaUrl.trim(),
      version: formVersion.trim() || 'v1.0',
      published: formPublished
    };

    const res = await saveSystemUpdate(payload, currentUser);
    if (res.success) {
      setIsModalOpen(false);
      setSuccessMsg(editingId ? 'Atualização editada com sucesso!' : 'Atualização criada e publicada com sucesso!');
      setTimeout(() => setSuccessMsg(''), 3000);
      const updated = await fetchSystemUpdates();
      setUpdates(updated);
    } else {
      setErrorMsg(res.error || 'Erro ao salvar atualização.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta atualização do sistema?')) return;
    const res = await deleteSystemUpdate(id, currentUser);
    if (res.success) {
      setSuccessMsg('Atualização excluída com sucesso!');
      setTimeout(() => setSuccessMsg(''), 3000);
      const updated = await fetchSystemUpdates();
      setUpdates(updated);
    } else {
      alert(res.error || 'Erro ao excluir.');
    }
  };

  const handleTogglePublish = async (item: SystemUpdate) => {
    const res = await saveSystemUpdate({
      ...item,
      published: !item.published
    }, currentUser);
    if (res.success) {
      const updated = await fetchSystemUpdates();
      setUpdates(updated);
    } else {
      alert(res.error || 'Erro ao alterar status.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="bg-[#121214] border border-[#27272a] rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5C542]/10 border border-[#F5C542]/20 text-[#F5C542] text-xs font-bold uppercase tracking-wider mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>Anúncios & Versões</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white">Atualizações do Sistema</h2>
          <p className="text-sm text-[#A1A1A1]">
            Publique notas de versão, avisos e novidades em tempo real para todos os usuários conectados.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-3 bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] font-bold rounded-xl transition-all shadow-lg shadow-[#F5C542]/10 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Atualização</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* List */}
      <div className="bg-[#121214] border border-[#27272a] rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-[#27272a] flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-2">
            <span>Atualizações Publicadas</span>
            <span className="px-2 py-0.5 rounded-full bg-[#27272a] text-[#F5C542] text-xs font-mono">
              {updates.length}
            </span>
          </h3>
          <span className="text-xs text-[#A1A1A1]">Sincronização em tempo real via Firestore</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">Carregando atualizações...</div>
        ) : updates.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#1e1e24] flex items-center justify-center text-gray-500 mx-auto">
              <Bell className="w-6 h-6" />
            </div>
            <p className="text-gray-400 text-sm">Nenhuma atualização cadastrada.</p>
            <button
              onClick={handleOpenAdd}
              className="text-xs font-bold text-[#F5C542] hover:underline"
            >
              Criar primeira atualização
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#27272a]">
            {updates.map((item) => (
              <div key={item.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#18181b]/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#27272a] text-[#F5C542] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 font-mono">
                    {item.version}
                  </div>
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-14 h-14 rounded-xl object-cover border border-[#27272a] bg-[#18181b] shrink-0"
                    />
                  ) : null}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base">{item.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${item.published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                        {item.published ? 'Publicado' : 'Rascunho'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2">{item.message}</p>
                    <div className="flex items-center gap-3 text-xs text-[#A1A1A1]">
                      <span>Criado em: {new Date(item.createdAt).toLocaleDateString('pt-BR')}</span>
                      {item.ctaUrl && (
                        <a href={item.ctaUrl} target="_blank" rel="noopener noreferrer" className="text-[#F5C542] flex items-center gap-1 hover:underline">
                          <span>CTA: {item.ctaText}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <button
                    onClick={() => handleTogglePublish(item)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${item.published ? 'bg-[#27272a] hover:bg-[#3f3f46] text-amber-400' : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'}`}
                  >
                    {item.published ? 'Despublicar' : 'Publicar'}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2.5 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-xl transition-all cursor-pointer"
                    title="Editar"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all cursor-pointer"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-[#121214] border border-[#27272a] rounded-3xl p-6 md:p-8 max-w-xl w-full space-y-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F5C542]" />
                <span>{editingId ? 'Editar Atualização' : 'Nova Atualização do Sistema'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white p-2"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Versão *</label>
                  <input
                    type="text"
                    required
                    value={formVersion}
                    onChange={(e) => setFormVersion(e.target.value)}
                    placeholder="v1.2.0"
                    className="w-full bg-[#18181b] border border-[#3f3f46] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5C542]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Status</label>
                  <select
                    value={formPublished ? 'true' : 'false'}
                    onChange={(e) => setFormPublished(e.target.value === 'true')}
                    className="w-full bg-[#18181b] border border-[#3f3f46] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5C542]"
                  >
                    <option value="true">Publicado (Visível a todos)</option>
                    <option value="false">Rascunho</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Título da Atualização *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ex: Nova Central de Inteligência de Produtos"
                  className="w-full bg-[#18181b] border border-[#3f3f46] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5C542]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Mensagem / Notas de Versão *</label>
                <textarea
                  required
                  rows={4}
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Descreva as melhorias, novos recursos e correções..."
                  className="w-full bg-[#18181b] border border-[#3f3f46] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5C542]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">URL da Imagem (Opcional)</label>
                <input
                  type="text"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://exemplo.com/banner.webp"
                  className="w-full bg-[#18181b] border border-[#3f3f46] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5C542]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Texto do CTA</label>
                  <input
                    type="text"
                    value={formCtaText}
                    onChange={(e) => setFormCtaText(e.target.value)}
                    placeholder="Saiba mais"
                    className="w-full bg-[#18181b] border border-[#3f3f46] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5C542]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">URL do CTA (Opcional)</label>
                  <input
                    type="text"
                    value={formCtaUrl}
                    onChange={(e) => setFormCtaUrl(e.target.value)}
                    placeholder="https://exemplo.com/link.webp"
                    className="w-full bg-[#18181b] border border-[#3f3f46] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5C542]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#27272a]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-white font-semibold text-sm transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] font-bold text-sm transition-all shadow-lg shadow-[#F5C542]/10 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{editingId ? 'Salvar Alterações' : 'Publicar Atualização'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
