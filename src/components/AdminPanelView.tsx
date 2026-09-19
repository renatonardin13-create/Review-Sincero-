import React, { useState } from 'react';
import {
  ShieldCheck,
  Crown,
  Film,
  DollarSign,
  Users,
  Key,
  BarChart3,
  PlusCircle,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Lock,
  Search,
  Save,
  Check,
  RotateCcw
} from 'lucide-react';
import { AuthUser, AppSettings, MemberAcademyData, ADMIN_EMAIL } from '../types';
import { getStoredAcademyData, saveStoredAcademyData, resetStoredAcademyData } from '../data/academyData';
import { getRegisteredUsersList } from '../services/authService';

interface AdminPanelViewProps {
  currentUser: AuthUser;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onOpenVideoManager: () => void;
  onNavigateTo: (viewId: string) => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  currentUser,
  settings,
  onSaveSettings,
  onOpenVideoManager,
  onNavigateTo
}) => {
  const isAdmin =
    currentUser.role === 'admin' ||
    currentUser.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
  const [activeTab, setActiveTab] = useState<'overview' | 'academy' | 'banners' | 'users' | 'apis'>('overview');
  const [academyData, setAcademyData] = useState<MemberAcademyData>(getStoredAcademyData);
  const [registeredUsers, setRegisteredUsers] = useState<AuthUser[]>(getRegisteredUsersList);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Quick form for banners settings in admin
  const [adminBannerSpeed, setAdminBannerSpeed] = useState<number>(settings.bannerAutoplaySpeed || 5);
  const [adminEnableBanners, setAdminEnableBanners] = useState<boolean>(settings.enableBannerCarousel !== false);
  const [adminEnableQuickLogin, setAdminEnableQuickLogin] = useState<boolean>(settings.enableQuickLoginShortcuts !== false);

  const handleSaveBannerConfig = () => {
    onSaveSettings({
      ...settings,
      bannerAutoplaySpeed: adminBannerSpeed,
      enableBannerCarousel: adminEnableBanners,
      enableQuickLoginShortcuts: adminEnableQuickLogin
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center space-y-6 animate-in fade-in">
        <div className="w-20 h-20 rounded-3xl bg-[#2D1616] border border-[#7F1D1D] flex items-center justify-center text-[#EF4444] mx-auto shadow-2xl">
          <Lock className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">Área Administrativa Restrita</h2>
          <p className="text-sm text-[#A1A1A1] max-w-md mx-auto">
            Este painel é exclusivo para o administrador master do sistema ({ADMIN_EMAIL}).
          </p>
        </div>
        <div className="p-4 bg-[#151515] border border-[#262626] rounded-2xl max-w-md mx-auto text-xs text-[#8E8E8E]">
          Você está conectado como: <strong className="text-white">{currentUser.email}</strong> (Usuário Comum).
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 pb-24">
      {/* Admin Hero Header */}
      <div className="bg-gradient-to-r from-[#171408] via-[#141005] to-[#0A0A0A] border border-[#F5C542]/40 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5C542]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5C542]/20 border border-[#F5C542]/40 text-[#F5C542] text-xs font-black uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5" />
              <span>PAINEL DO ADMINISTRADOR MASTER</span>
              <span className="text-[#A1A1A1]">•</span>
              <span className="text-white font-mono">{ADMIN_EMAIL}</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight font-display flex items-center gap-3">
              <span>Controle Administrativo Geral</span>
            </h1>

            <p className="text-xs md:text-sm text-[#D4D4D4] leading-relaxed">
              Gerencie todas as videoaulas do curso, controle os banners de monetização do app gratuito, monitore os alunos cadastrados e ajuste as chaves de integração.
            </p>
          </div>

          {/* Quick Action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenVideoManager}
              className="flex items-center gap-2 bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] font-black px-5 py-3 rounded-2xl text-xs shadow-xl shadow-[#F5C542]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Subir Nova Videoaula</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-[#2E2812]">
          <div className="bg-[#100D04] border border-[#3E3416] rounded-2xl p-3.5">
            <span className="text-[11px] text-[#A1A1A1] font-medium block">🎬 Total de Aulas</span>
            <span className="text-xl font-black text-white mt-1 block">
              {academyData.lessons.length} Videoaulas
            </span>
          </div>

          <div className="bg-[#100D04] border border-[#3E3416] rounded-2xl p-3.5">
            <span className="text-[11px] text-[#A1A1A1] font-medium block">📚 Módulos VIP</span>
            <span className="text-xl font-black text-[#F5C542] mt-1 block">
              {academyData.modules.length} Módulos
            </span>
          </div>

          <div className="bg-[#100D04] border border-[#3E3416] rounded-2xl p-3.5">
            <span className="text-[11px] text-[#A1A1A1] font-medium block">👥 Alunos / Logins</span>
            <span className="text-xl font-black text-[#22C55E] mt-1 block">
              {registeredUsers.length} Cadastrados
            </span>
          </div>

          <div className="bg-[#100D04] border border-[#3E3416] rounded-2xl p-3.5">
            <span className="text-[11px] text-[#A1A1A1] font-medium block">💰 Banners em Slides</span>
            <span className="text-xl font-black text-[#38BDF8] mt-1 block">
              {settings.promoBanners?.filter((b) => b.active).length || 0} Ativos
            </span>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#121212] border border-[#242424] rounded-2xl overflow-x-auto">
        {[
          { id: 'overview', label: '📊 Visão Geral', icon: BarChart3 },
          { id: 'academy', label: '🎓 Gerenciar Videoaulas & Curso', icon: Film },
          { id: 'banners', label: '⚙️ Ajustes & Monetização Global', icon: DollarSign },
          { id: 'users', label: '👥 Alunos & Usuários', icon: Users },
          { id: 'apis', label: '🔑 Chaves & Integrações de APIs', icon: Key }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#F5C542] text-[#080808] shadow-md'
                  : 'text-[#A1A1A1] hover:text-white hover:bg-[#181818]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
          {/* Quick Access Card */}
          <div className="bg-[#121212] border border-[#222] rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-[#F5C542]" />
              <span>Gestão Rápida da Área de Membros</span>
            </h3>
            <p className="text-xs text-[#A1A1A1] leading-relaxed">
              Todas as videoaulas hospedadas no YouTube aparecem no player integrado sem logo ou links externos para os alunos.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={onOpenVideoManager}
                className="bg-[#1C1809] hover:bg-[#2A230B] border border-[#F5C542]/40 text-[#F5C542] font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Adicionar Aula</span>
              </button>

              <button
                onClick={() => onNavigateTo('tutorial')}
                className="bg-[#181818] hover:bg-[#222] border border-[#2E2E2E] text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Ver Área de Membros como Aluno</span>
              </button>
            </div>
          </div>

          {/* Banner Monetization Card */}
          <div className="bg-[#121212] border border-[#222] rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#22C55E]" />
              <span>Monetização do App Gratuito</span>
            </h3>
            <p className="text-xs text-[#A1A1A1] leading-relaxed">
              Insira seus banners de produtos afiliados (Hotmart, Shopee, Mercado Livre). Todos os usuários gratuitos verão seus slides no topo do Dashboard.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => onNavigateTo('settings-banners')}
                className="bg-[#102416] hover:bg-[#183621] border border-[#22C55E]/40 text-[#22C55E] font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Configurar Banners em Slides</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Academy Management */}
      {activeTab === 'academy' && (
        <div className="bg-[#121212] border border-[#222] rounded-3xl p-6 md:p-8 space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-5">
            <div>
              <h3 className="text-lg font-black text-white">Videoaulas Cadastradas na Área de Membros</h3>
              <p className="text-xs text-[#8E8E8E]">
                Edite, exclua ou organize as aulas exibidas para os alunos.
              </p>
            </div>

            <button
              onClick={onOpenVideoManager}
              className="bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] font-black px-5 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nova Videoaula</span>
            </button>
          </div>

          <div className="space-y-3">
            {academyData.lessons.map((lesson) => {
              const mod = academyData.modules.find((m) => m.id === lesson.moduleId);
              return (
                <div
                  key={lesson.id}
                  className="p-4 bg-[#181818] border border-[#282828] rounded-2xl flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#F5C542] px-2 py-0.5 rounded bg-[#252008] border border-[#F5C542]/20">
                        {mod ? mod.title.split(':')[0] : 'MÓDULO'}
                      </span>
                      <span className="text-[11px] text-[#8E8E8E]">Duração: {lesson.duration}</span>
                      <span className="text-[11px] text-[#38BDF8]">YouTube ID: {lesson.youtubeId}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white truncate">{lesson.title}</h4>
                    {lesson.description && (
                      <p className="text-xs text-[#8E8E8E] line-clamp-1">{lesson.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={onOpenVideoManager}
                      className="p-2 bg-[#202020] hover:bg-[#282828] text-[#38BDF8] border border-[#333] rounded-xl text-xs transition-colors cursor-pointer"
                      title="Editar vídeo"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Banners */}
      {activeTab === 'banners' && (
        <div className="bg-[#121212] border border-[#222] rounded-3xl p-6 md:p-8 space-y-6 animate-in fade-in">
          <div className="border-b border-[#222] pb-5">
            <h3 className="text-lg font-black text-white">Configuração Global dos Banners em Slides</h3>
            <p className="text-xs text-[#8E8E8E]">
              Defina como os slides promocionais são exibidos para todos os usuários gratuitos no Dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#181818] border border-[#282828] rounded-2xl space-y-2">
              <label className="text-xs font-bold text-white block">
                Exibir Carrossel no Topo do Dashboard:
              </label>
              <select
                value={adminEnableBanners ? 'true' : 'false'}
                onChange={(e) => setAdminEnableBanners(e.target.value === 'true')}
                className="w-full bg-[#101010] border border-[#333] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#F5C542] cursor-pointer"
              >
                <option value="true">✅ Ativado (Exibir para todos os usuários)</option>
                <option value="false">❌ Desativado</option>
              </select>
            </div>

            <div className="p-4 bg-[#181818] border border-[#282828] rounded-2xl space-y-2">
              <label className="text-xs font-bold text-white block">
                Tempo de Transição Automática dos Slides:
              </label>
              <select
                value={adminBannerSpeed}
                onChange={(e) => setAdminBannerSpeed(Number(e.target.value))}
                className="w-full bg-[#101010] border border-[#333] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#F5C542] cursor-pointer"
              >
                <option value={3}>3 Segundos (Rápido)</option>
                <option value={5}>5 Segundos (Recomendado)</option>
                <option value={8}>8 Segundos (Lento)</option>
                <option value={10}>10 Segundos</option>
              </select>
            </div>

            {/* Quick Login Shortcuts Toggle */}
            <div className="p-4 bg-[#181818] border border-[#282828] rounded-2xl space-y-2 sm:col-span-2">
              <label className="text-xs font-bold text-white block">
                Atalhos de Teste Rápido (Preencher Admin / Preencher Comum) na Tela de Login:
              </label>
              <select
                value={adminEnableQuickLogin ? 'true' : 'false'}
                onChange={(e) => setAdminEnableQuickLogin(e.target.value === 'true')}
                className="w-full bg-[#101010] border border-[#333] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#F5C542] cursor-pointer"
              >
                <option value="true">✅ Exibir os botões de atalho rápidos para preenchimento de teste</option>
                <option value="false">❌ Ocultar os botões de atalho rápidos para produção</option>
              </select>
              <p className="text-[10px] text-[#8E8E8E] leading-normal">
                Nota: Quando desativado, os usuários comuns não verão os botões de atalho rápidos ao carregar a tela de acesso.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => onNavigateTo('settings-banners')}
              className="text-xs text-[#F5C542] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Gerenciar Imagens & Links dos Slides →</span>
            </button>

            <button
              onClick={handleSaveBannerConfig}
              className="bg-[#22C55E] hover:bg-[#1fa851] text-black font-black px-6 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#22C55E]/15"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Configurações Salvas!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Configuração</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Users */}
      {activeTab === 'users' && (
        <div className="bg-[#121212] border border-[#222] rounded-3xl p-6 md:p-8 space-y-6 animate-in fade-in">
          <div className="border-b border-[#222] pb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-white">Usuários & Logins Registrados</h3>
              <p className="text-xs text-[#8E8E8E]">
                Lista de usuários que acessaram o aplicativo com suas contas Google ou e-mails.
              </p>
            </div>
            <span className="text-xs text-[#F5C542] font-mono font-bold bg-[#F5C542]/10 px-3 py-1 rounded-full border border-[#F5C542]/20">
              {registeredUsers.length} usuários
            </span>
          </div>

          <div className="space-y-3">
            {registeredUsers.map((user, idx) => {
              const userIsAdmin = user.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
              return (
                <div
                  key={idx}
                  className="p-4 bg-[#181818] border border-[#282828] rounded-2xl flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        userIsAdmin
                          ? 'bg-[#F5C542] text-black shadow-md'
                          : 'bg-[#2563EB] text-white'
                      }`}
                    >
                      {userIsAdmin ? '👑' : '👤'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{user.name}</h4>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                            userIsAdmin
                              ? 'bg-[#F5C542]/20 text-[#F5C542]'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}
                        >
                          {userIsAdmin ? 'Administrador Master' : 'Usuário Gratuito'}
                        </span>
                      </div>
                      <p className="text-xs text-[#8E8E8E]">{user.email}</p>
                    </div>
                  </div>

                  <div className="text-right text-[11px] text-[#666]">
                    <span>Último Acesso:</span>
                    <p className="text-[#A1A1A1] font-mono">
                      {new Date(user.lastLoginAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 5: APIs */}
      {activeTab === 'apis' && (
        <div className="bg-[#121212] border border-[#222] rounded-3xl p-6 md:p-8 space-y-6 animate-in fade-in">
          <div className="border-b border-[#222] pb-5">
            <h3 className="text-lg font-black text-white">Status das Integrações de APIs Oficiais</h3>
            <p className="text-xs text-[#8E8E8E]">
              Verificação dos serviços de dados reais conectados ao Review Sincero.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-[#181818] border border-[#282828] rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Google Ads API</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                  Conectado
                </span>
              </div>
              <p className="text-xs text-[#8E8E8E]">
                Consulta volumes mensais reais, CPC e intenção de compra de palavras-chave.
              </p>
            </div>

            <div className="p-5 bg-[#181818] border border-[#282828] rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Mercado Livre Trends</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                  Ao Vivo
                </span>
              </div>
              <p className="text-xs text-[#8E8E8E]">
                Sincronização em tempo real com tendencias.mercadolivre.com.br.
              </p>
            </div>

            <div className="p-5 bg-[#181818] border border-[#282828] rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Shopee Mais Vendidos</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                  Ao Vivo
                </span>
              </div>
              <p className="text-xs text-[#8E8E8E]">
                Mapeamento das tendências de alto giro e maiores pedidos na Shopee Brasil.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
