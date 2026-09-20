import React from 'react';
import { Review, AppSettings, AuthUser, ADMIN_EMAIL } from '../types';
import { DEFAULT_PROMO_BANNERS } from '../data/initialData';
import {
  Plus,
  FileText,
  Package,
  Globe,
  TrendingUp,
  Eye,
  Edit3,
  Copy,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  BookOpen,
  DollarSign,
  Crown,
  User,
  Zap,
  Lock
} from 'lucide-react';
import { PromoBannerCarousel } from './PromoBannerCarousel';

interface DashboardProps {
  reviews: Review[];
  settings?: AppSettings;
  currentUser?: AuthUser;
  onOpenAuthModal?: () => void;
  onNewReview: () => void;
  onEditReview: (review: Review) => void;
  onViewReview: (review: Review) => void;
  onDuplicateReview: (review: Review) => void;
  onDeleteReview: (id: string) => void;
  setCurrentView: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  reviews,
  settings,
  currentUser,
  onOpenAuthModal,
  onNewReview,
  onEditReview,
  onViewReview,
  onDuplicateReview,
  onDeleteReview,
  setCurrentView
}) => {
  const totalReviews = reviews.length;
  const publishedReviews = reviews.filter((r) => r.status === 'Publicado').length;
  const currentMonthReviews = reviews.filter((r) => {
    const d = new Date(r.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const isAdmin =
    currentUser?.role === 'admin' ||
    currentUser?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* User Access Profile Status Card */}
      <div
        className={`p-4 md:p-5 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all shadow-xl ${
          isAdmin
            ? 'bg-gradient-to-r from-[#1C1809] via-[#151307] to-[#0D0D0D] border-[#F5C542]/40 shadow-[#F5C542]/5'
            : 'bg-gradient-to-r from-[#0F172A] via-[#0B1120] to-[#0D0D0D] border-[#2563EB]/40 shadow-[#2563EB]/5'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 shadow-lg ${
              isAdmin
                ? 'bg-[#F5C542] text-black shadow-[#F5C542]/20'
                : 'bg-[#2563EB] text-white shadow-[#2563EB]/20'
            }`}
          >
            {isAdmin ? <Crown className="w-6 h-6" /> : <User className="w-6 h-6" />}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Perfil Ativo:
              </span>
              <span
                className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase border ${
                  isAdmin
                    ? 'bg-[#F5C542]/20 text-[#F5C542] border-[#F5C542]/40'
                    : 'bg-[#2563EB]/20 text-[#38BDF8] border-[#2563EB]/40'
                }`}
              >
                {isAdmin ? '👑 Administrador Master (Acesso Total)' : '👤 Usuário Comum (Plano Gratuito)'}
              </span>
            </div>
            <p className="text-xs text-[#A1A1A1] mt-1">
              {isAdmin
                ? `Olá ${currentUser?.name || 'Renato Nardin'}, você possui privilégios totais de gestão e controle administrativo.`
                : `Olá ${currentUser?.name || 'Aluno'}, você tem acesso gratuito aos geradores e recursos essenciais.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {isAdmin ? (
            <button
              type="button"
              onClick={() => setCurrentView('admin')}
              className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-[#F5C542] hover:bg-[#F5C542]/90 text-black font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#F5C542]/20 transition-transform active:scale-95"
            >
              <Crown className="w-4 h-4" />
              <span>Abrir Painel Admin</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#38BDF8]/30 text-[#38BDF8] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Zap className="w-4 h-4 text-[#F5C542]" />
              <span>Alternar Perfil / Login</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          PROMOTIONAL BANNER SLIDES CAROUSEL (Requested for monetization)
         ========================================================================= */}
      {settings?.enableBannerCarousel !== false && (
        <PromoBannerCarousel
          banners={settings?.promoBanners && settings.promoBanners.length > 0 ? settings.promoBanners : DEFAULT_PROMO_BANNERS}
          autoplaySpeed={settings?.bannerAutoplaySpeed || 6}
          enabled={true}
          onManageClick={currentUser?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim() ? () => setCurrentView('settings-banners') : undefined}
        />
      )}

      {/* Hero Banner inside Dashboard - Matching PageAI (Screenshot 7) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#121212] via-[#0E0E0E] to-[#080808] border border-[#222222] p-8 md:p-14 text-center space-y-8 shadow-2xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F5C542]/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181818] border border-[#2A2A2A] text-xs font-semibold text-[#A1A1A1] uppercase tracking-wider">
          <span className="text-[#F5C542]">✦</span>
          <span>POWERED BY IA · GRATUITO · PARA AFILIADOS</span>
        </div>

        {/* Big Review Sincero Title */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight flex items-center justify-center gap-2 font-display">
            <span className="text-white">Review</span>
            <span className="text-[#F5C542]">Sincero</span>
          </h1>
          
          <p className="text-[#A1A1A1] text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Gere páginas de review profissionais com <strong className="text-white font-semibold">IA gratuita</strong> e descubra os produtos em alta agora. Mercado Livre, Shopee e muito mais.
          </p>
        </div>

        {/* 4 Fast Metrics / Selling Points */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-2">
          <div className="bg-[#141414] border border-[#222222] rounded-2xl p-4 text-center">
            <div className="text-2xl md:text-3xl font-black text-white">100%</div>
            <div className="text-xs text-[#8E8E8E] mt-0.5">Gratuito</div>
          </div>
          <div className="bg-[#141414] border border-[#222222] rounded-2xl p-4 text-center">
            <div className="text-2xl md:text-3xl font-black text-white">2 min</div>
            <div className="text-xs text-[#8E8E8E] mt-0.5">Para gerar</div>
          </div>
          <div className="bg-[#141414] border border-[#222222] rounded-2xl p-4 text-center">
            <div className="text-2xl md:text-3xl font-black text-[#F5C542]">IA</div>
            <div className="text-xs text-[#8E8E8E] mt-0.5">Inteligência Real</div>
          </div>
          <div className="bg-[#141414] border border-[#222222] rounded-2xl p-4 text-center">
            <div className="text-2xl md:text-3xl font-black text-white">∞</div>
            <div className="text-xs text-[#8E8E8E] mt-0.5">Produtos</div>
          </div>
        </div>

        {/* Platform Selector Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onNewReview}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold bg-[#F5C542] text-[#080808] shadow-lg shadow-[#F5C542]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span className="text-sm">⚡</span>
            <span>Gerador com IA</span>
          </button>

          <button
            onClick={() => setCurrentView('campeoes')}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-[#1C180C] text-[#F5C542] border border-[#F5C542]/40 hover:bg-[#F5C542]/10 transition-all cursor-pointer"
          >
            <span className="text-sm">🏆</span>
            <span>Produtos Campeões</span>
          </button>



          <button
            onClick={() => setCurrentView('trends')}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-[#151515] text-[#A1A1A1] border border-[#2A2A2A] hover:text-white hover:border-[#F5C542]/40 transition-all cursor-pointer"
          >
            <span className="text-sm">🔥</span>
            <span>Meli & Shopee Trends</span>
          </button>

          <button
            onClick={() => setCurrentView('tutorial')}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-[#1C1C1C] text-[#22C55E] border border-[#22C55E]/30 hover:bg-[#22C55E]/10 transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>Tutorial & Como Usar</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setCurrentView('settings-banners')}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-[#151515] text-[#A1A1A1] border border-[#2A2A2A] hover:text-white transition-all cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5 text-[#F5C542]" />
              <span>Banners em Slides</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#151515] border border-[#2A2A2A] rounded-2xl p-6 transition-all hover:border-[#F5C542]/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A1A1A1] uppercase tracking-wider">Reviews Criadas</span>
            <div className="p-2.5 rounded-xl bg-[#0D0D0D] border border-[#2A2A2A] text-[#F5C542]">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{totalReviews}</span>
            <span className="text-xs text-[#22C55E] font-medium">+100% real</span>
          </div>
        </div>

        <div className="bg-[#151515] border border-[#2A2A2A] rounded-2xl p-6 transition-all hover:border-[#F5C542]/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A1A1A1] uppercase tracking-wider">Produtos Cadastrados</span>
            <div className="p-2.5 rounded-xl bg-[#0D0D0D] border border-[#2A2A2A] text-[#F5C542]">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{totalReviews}</span>
            <span className="text-xs text-[#A1A1A1]">Ativos</span>
          </div>
        </div>

        <div className="bg-[#151515] border border-[#2A2A2A] rounded-2xl p-6 transition-all hover:border-[#F5C542]/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A1A1A1] uppercase tracking-wider">Páginas Geradas</span>
            <div className="p-2.5 rounded-xl bg-[#0D0D0D] border border-[#2A2A2A] text-[#22C55E]">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{publishedReviews}</span>
            <span className="text-xs text-[#22C55E] font-medium">Prontas p/ publicar</span>
          </div>
        </div>

        <div className="bg-[#151515] border border-[#2A2A2A] rounded-2xl p-6 transition-all hover:border-[#F5C542]/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A1A1A1] uppercase tracking-wider">Reviews Este Mês</span>
            <div className="p-2.5 rounded-xl bg-[#0D0D0D] border border-[#2A2A2A] text-[#F59E0B]">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{currentMonthReviews}</span>
            <span className="text-xs text-[#A1A1A1]">Neste período</span>
          </div>
        </div>
      </div>

      {/* Recent Reviews Section */}
      <div className="bg-[#151515] border border-[#2A2A2A] rounded-3xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#2A2A2A]">
          <div>
            <h3 className="text-lg font-bold text-white">Reviews Recentes</h3>
            <p className="text-xs text-[#A1A1A1] mt-0.5">Gerencie, edite ou visualize suas páginas criadas</p>
          </div>
          <button
            onClick={() => setCurrentView('reviews')}
            className="text-xs font-semibold text-[#F5C542] hover:text-[#FFD95A] transition-colors self-start sm:self-auto"
          >
            Ver todas ({reviews.length}) →
          </button>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0D0D0D] border border-[#2A2A2A] flex items-center justify-center mx-auto mb-4 text-[#A1A1A1]">
              <FileText className="w-8 h-8" />
            </div>
            <h4 className="text-white font-semibold text-base">Nenhuma review criada ainda</h4>
            <p className="text-sm text-[#A1A1A1] max-w-sm mx-auto mt-1 mb-6">
              Comece agora criando sua primeira página profissional de review com dados reais e alta conversão.
            </p>
            <button
              onClick={onNewReview}
              className="inline-flex items-center gap-2 bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Criar Primeira Review</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2A2A2A] text-xs font-semibold text-[#A1A1A1] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Produto</th>
                  <th className="pb-3 font-semibold">Categoria</th>
                  <th className="pb-3 font-semibold">Plataforma</th>
                  <th className="pb-3 font-semibold">Data</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]/50 text-sm">
                {reviews.slice(0, 5).map((rev) => (
                  <tr key={rev.id} className="group hover:bg-[#1C1C1C]/55 transition-colors">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.mainImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&q=80'}
                          alt={rev.productName}
                          className="w-11 h-11 rounded-xl object-cover border border-[#2A2A2A] bg-[#0D0D0D]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&q=80';
                          }}
                        />
                        <div>
                          <p className="font-semibold text-white group-hover:text-[#F5C542] transition-colors line-clamp-1">
                            {rev.productName || 'Produto sem nome'}
                          </p>
                          <p className="text-xs text-[#A1A1A1]">{rev.currentPrice || 'Preço não informado'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-[#A1A1A1]">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-xs font-medium text-white">
                        {rev.category}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-[#A1A1A1]">
                      <span className="text-xs font-medium text-white/80">{rev.platform}</span>
                    </td>
                    <td className="py-4 pr-4 text-xs text-[#A1A1A1]">
                      {new Date(rev.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          rev.status === 'Publicado'
                            ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20'
                            : 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${rev.status === 'Publicado' ? 'bg-[#22C55E]' : 'bg-[#F59E0B]'}`} />
                        {rev.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewReview(rev)}
                          className="p-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-[#A1A1A1] hover:text-[#F5C542] hover:border-[#F5C542]/40 transition-colors"
                          title="Visualizar página"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditReview(rev)}
                          className="p-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-[#A1A1A1] hover:text-white hover:border-[#2A2A2A] transition-colors"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDuplicateReview(rev)}
                          className="p-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-[#A1A1A1] hover:text-white hover:border-[#2A2A2A] transition-colors"
                          title="Duplicar"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteReview(rev.id)}
                          className="p-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-[#A1A1A1] hover:text-[#EF4444] hover:border-[#EF4444]/40 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
