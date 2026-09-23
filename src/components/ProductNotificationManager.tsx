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
  Image as ImageIcon
} from 'lucide-react';
import { ProductNotification, AuthUser, AppSettings } from '../types';
import { 
  fetchProductNotifications, 
  saveProductNotification, 
  deleteProductNotification, 
  validateProductUrl, 
  subscribeToProductNotifications 
} from '../services/productNotificationService';

interface ProductNotificationManagerProps {
  currentUser: AuthUser;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
}

export const ProductNotificationManager: React.FC<ProductNotificationManagerProps> = ({
  currentUser,
  settings,
  onSaveSettings
}) => {
  const [notifications, setNotifications] = useState<ProductNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [intervalMinutes, setIntervalMinutes] = useState<number>(settings.productNotificationIntervalMinutes || 5);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState<string>('');
  const [formImageUrl, setFormImageUrl] = useState<string>('');
  const [formUrl, setFormUrl] = useState<string>('');
  const [formCtaText, setFormCtaText] = useState<string>('Ver produto');
  const [formActive, setFormActive] = useState<boolean>(true);
  const [formOrder, setFormOrder] = useState<number>(1);

  useEffect(() => {
    let unsubscribe = () => {};
    fetchProductNotifications().then(items => {
      setNotifications(items);
      setLoading(false);
    });

    unsubscribe = subscribeToProductNotifications((items) => {
      setNotifications(items);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (settings.productNotificationIntervalMinutes) {
      setIntervalMinutes(settings.productNotificationIntervalMinutes);
    }
  }, [settings.productNotificationIntervalMinutes]);

  const handleSaveInterval = () => {
    onSaveSettings({
      ...settings,
      productNotificationIntervalMinutes: intervalMinutes
    });
    setSuccessMsg('Intervalo de notificação salvo com sucesso!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleTestNotification = (index?: number) => {
    window.dispatchEvent(new CustomEvent('trigger_product_notification_test', { detail: { index } }));
    setSuccessMsg('🔔 Notificação flutuante exibida na tela!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormName('');
    setFormImageUrl('');
    setFormUrl('');
    setFormCtaText('Ver produto');
    setFormActive(true);
    setFormOrder(notifications.length > 0 ? Math.max(...notifications.map(n => n.order)) + 1 : 1);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ProductNotification) => {
    setEditingId(item.id);
    setFormName(item.name);
    setFormImageUrl(item.imageUrl || '');
    setFormUrl(item.url);
    setFormCtaText(item.ctaText || 'Ver produto');
    setFormActive(item.active);
    setFormOrder(item.order);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formName.trim()) {
      setErrorMsg('O nome do produto é obrigatório.');
      return;
    }

    const imgVal = validateProductUrl(formImageUrl);
    if (!imgVal.valid) {
      setErrorMsg(imgVal.error || 'A foto do produto (URL da imagem) é obrigatória e deve iniciar com http:// ou https://.');
      return;
    }

    const val = validateProductUrl(formUrl);
    if (!val.valid) {
      setErrorMsg(val.error || 'URL inválida.');
      return;
    }

    const payload: Partial<ProductNotification> = {
      id: editingId || undefined,
      name: formName.trim(),
      imageUrl: formImageUrl.trim(),
      url: formUrl.trim(),
      ctaText: formCtaText.trim() || 'Ver produto',
      active: formActive,
      order: Number(formOrder) || 1
    };

    const res = await saveProductNotification(payload, currentUser, notifications);
    if (res.success) {
      setIsModalOpen(false);
      setSuccessMsg(editingId ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!');
      setTimeout(() => setSuccessMsg(''), 3000);
      const updated = await fetchProductNotifications();
      setNotifications(updated);
    } else {
      setErrorMsg(res.error || 'Erro ao salvar produto.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta notificação de produto?')) return;
    const res = await deleteProductNotification(id, currentUser, notifications);
    if (res.success) {
      setSuccessMsg('Produto excluído com sucesso!');
      setTimeout(() => setSuccessMsg(''), 3000);
      const updated = await fetchProductNotifications();
      setNotifications(updated);
    } else {
      alert(res.error || 'Erro ao excluir produto.');
    }
  };

  const handleToggleActive = async (item: ProductNotification) => {
    const res = await saveProductNotification({
      ...item,
      active: !item.active
    }, currentUser, notifications);
    if (res.success) {
      const updated = await fetchProductNotifications();
      setNotifications(updated);
    } else {
      alert(res.error || 'Erro ao alterar status.');
    }
  };

  const handleMoveOrder = async (item: ProductNotification, direction: 'up' | 'down') => {
    const sorted = [...notifications].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex(n => n.id === item.id);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const targetItem = sorted[targetIndex];
    const tempOrder = item.order;
    item.order = targetItem.order;
    targetItem.order = tempOrder;

    await saveProductNotification(item, currentUser, notifications);
    await saveProductNotification(targetItem, currentUser, notifications);

    const updated = await fetchProductNotifications();
    setNotifications(updated);
  };

  // Preview item for live preview widget
  const previewNotification: ProductNotification = {
    id: 'preview-id',
    name: formName.trim() || 'Nome do produto em destaque',
    imageUrl: formImageUrl.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80',
    url: formUrl.trim() || 'https://example.com',
    ctaText: formCtaText.trim() || 'Ver produto',
    active: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: currentUser.email
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header & Interval Config */}
      <div className="bg-[#121214] border border-[#27272a] rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5C542]/10 border border-[#F5C542]/20 text-[#F5C542] text-xs font-bold uppercase tracking-wider mb-2">
              <Bell className="w-3.5 h-3.5" />
              <span>Central de Notificações</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white">Notificações Flutuantes de Produtos com Foto</h2>
            <p className="text-sm text-[#A1A1A1]">
              Cadastre produtos afiliados com imagem e CTA personalizado para exibição em rotação contínua.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
            <button
              onClick={() => handleTestNotification()}
              className="flex items-center gap-2 px-4 py-3 bg-[#1e1e24] hover:bg-[#27272a] text-[#F5C542] border border-[#F5C542]/30 font-bold rounded-xl transition-all shadow-md cursor-pointer"
              title="Disparar notificação na tela imediatamente para testar"
            >
              <Bell className="w-4 h-4 animate-bounce" />
              <span>Testar Notificação Agora</span>
            </button>
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-5 py-3 bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] font-bold rounded-xl transition-all shadow-lg shadow-[#F5C542]/10 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Novo Produto</span>
            </button>
          </div>
        </div>

        {/* Global Interval Bar */}
        <div className="pt-6 border-t border-[#27272a] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1e1e24] border border-[#3f3f46] flex items-center justify-center text-[#F5C542]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Intervalo de Exibição Rotativa</h4>
              <p className="text-xs text-[#A1A1A1]">Tempo entre o aparecimento de cada notificação flutuante</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={intervalMinutes}
              onChange={(e) => setIntervalMinutes(Number(e.target.value))}
              className="bg-[#18181b] border border-[#3f3f46] text-white rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-[#F5C542] w-full md:w-56"
            >
              <option value={0.25}>15 segundos (Teste Rápido)</option>
              <option value={0.5}>30 segundos</option>
              <option value={1}>1 minuto</option>
              <option value={2}>2 minutos</option>
              <option value={5}>5 minutos (Padrão)</option>
              <option value={10}>10 minutos</option>
              <option value={15}>15 minutos</option>
            </select>
            <button
              onClick={handleSaveInterval}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#27272a] hover:bg-[#3f3f46] text-white font-semibold rounded-xl transition-all text-sm cursor-pointer whitespace-nowrap"
            >
              <Save className="w-4 h-4 text-[#F5C542]" />
              <span>Salvar Intervalo</span>
            </button>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-[#121214] border border-[#27272a] rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-[#27272a] flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-2">
            <span>Produtos Cadastrados</span>
            <span className="px-2 py-0.5 rounded-full bg-[#27272a] text-[#F5C542] text-xs font-mono">
              {notifications.length}
            </span>
          </h3>
          <span className="text-xs text-[#A1A1A1]">Ordem sequencial A → B → C</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">Carregando notificações...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#1e1e24] flex items-center justify-center text-gray-500 mx-auto">
              <Bell className="w-6 h-6" />
            </div>
            <p className="text-gray-400 text-sm">Nenhum produto cadastrado para notificações.</p>
            <button
              onClick={handleOpenAdd}
              className="text-xs font-bold text-[#F5C542] hover:underline"
            >
              Cadastrar primeiro produto
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#27272a]">
            {notifications.map((item, index) => (
              <div key={item.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#18181b]/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#27272a] text-[#F5C542] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    #{item.order}
                  </div>
                  {item.imageUrl && item.imageUrl.trim() ? (
                    <img 
                      src={item.imageUrl.trim()} 
                      alt={item.name} 
                      className="w-12 h-12 rounded-xl object-cover border border-[#27272a] bg-[#18181b] shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[#1e1e24] flex items-center justify-center text-gray-500 shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base">{item.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${item.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {item.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#A1A1A1]">
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-[#F5C542] flex items-center gap-1 truncate max-w-xs font-mono"
                      >
                        <span>{item.url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                      <span className="px-2 py-0.5 rounded bg-[#1e1e24] text-[#F5C542] font-medium">
                        CTA: {item.ctaText || 'Ver produto'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <div className="flex items-center bg-[#18181b] border border-[#27272a] rounded-xl p-1">
                    <button
                      onClick={() => handleMoveOrder(item, 'up')}
                      disabled={index === 0}
                      className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Subir ordem"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveOrder(item, 'down')}
                      disabled={index === notifications.length - 1}
                      className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Descer ordem"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleTestNotification(index)}
                    className="px-2.5 py-2 rounded-xl text-xs font-bold bg-[#1e1e24] hover:bg-[#27272a] text-[#F5C542] border border-[#F5C542]/20 transition-all cursor-pointer flex items-center gap-1"
                    title="Disparar este produto na tela agora"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Testar</span>
                  </button>

                  <button
                    onClick={() => handleToggleActive(item)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${item.active ? 'bg-[#27272a] hover:bg-[#3f3f46] text-amber-400' : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'}`}
                  >
                    {item.active ? 'Desativar' : 'Ativar'}
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

      {/* Modal Create / Edit with Live Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-[#121214] border border-[#27272a] rounded-3xl p-6 md:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F5C542]" />
                <span>{editingId ? 'Editar Produto' : 'Novo Produto em Destaque'}</span>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form onSubmit={handleSubmitForm} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Foto do Produto (URL da Imagem) *</label>
                  <input
                    type="text"
                    required
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="https://exemplo.com/foto.webp"
                    className="w-full bg-[#18181b] border border-[#3f3f46] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5C542]"
                  />
                  <p className="text-[11px] text-gray-500">Deve iniciar com http:// ou https:// (suporta .webp, .jpg, .png, etc.)</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Nome do Produto *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Fone Bluetooth Pro 5.0"
                    className="w-full bg-[#18181b] border border-[#3f3f46] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5C542]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Link do Produto (URL) *</label>
                  <input
                    type="text"
                    required
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="https://exemplo.com/produto-afiliado"
                    className="w-full bg-[#18181b] border border-[#3f3f46] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5C542]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Texto do CTA (Botão)</label>
                  <input
                    type="text"
                    value={formCtaText}
                    onChange={(e) => setFormCtaText(e.target.value)}
                    placeholder="Ver produto"
                    className="w-full bg-[#18181b] border border-[#3f3f46] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5C542]"
                  />
                  <p className="text-[11px] text-gray-500">Padrão: "Ver produto"</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Ordem</label>
                    <input
                      type="number"
                      value={formOrder}
                      onChange={(e) => setFormOrder(Number(e.target.value))}
                      className="w-full bg-[#18181b] border border-[#3f3f46] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5C542]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Status</label>
                    <select
                      value={formActive ? 'true' : 'false'}
                      onChange={(e) => setFormActive(e.target.value === 'true')}
                      className="w-full bg-[#18181b] border border-[#3f3f46] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5C542]"
                    >
                      <option value="true">Ativo</option>
                      <option value="false">Inativo</option>
                    </select>
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
                    className="px-6 py-2.5 rounded-xl bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] font-bold text-sm transition-all shadow-lg shadow-[#F5C542]/10 cursor-pointer"
                  >
                    {editingId ? 'Salvar Alterações' : 'Cadastrar Produto'}
                  </button>
                </div>
              </form>

              {/* Live Preview Column */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-[#F5C542] uppercase tracking-wider block mb-3">
                    👁️ Preview em Tempo Real (Widget do Usuário)
                  </span>
                  <p className="text-xs text-gray-400 mb-4">
                    Esta é exatamente a aparência que o usuário visualizará no canto inferior da tela.
                  </p>
                </div>
                <div className="py-6 flex items-center justify-center">
                  <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-3.5 shadow-xl w-full max-w-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-[#F5C542] text-[11px] font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Produto em destaque</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {previewNotification.imageUrl ? (
                        <img 
                          src={previewNotification.imageUrl} 
                          alt={previewNotification.name} 
                          className="w-14 h-14 rounded-xl object-cover border border-[#27272a] shrink-0 bg-[#18181b]"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-[#1e1e24] border border-[#27272a] shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-xs line-clamp-2 leading-tight mb-1.5">
                          {previewNotification.name}
                        </h4>
                        <div className="py-1 px-2 rounded-lg bg-[#F5C542] text-[#080808] text-[11px] font-bold text-center">
                          {previewNotification.ctaText}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-gray-500 text-center">
                  O botão fechar (×) e o CTA funcionam interativamente.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
