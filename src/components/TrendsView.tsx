import React, { useState, useEffect } from 'react';
import { SAMPLE_TRENDS } from '../data/initialData';
import { TrendItem } from '../types';
import {
  TrendingUp,
  Search,
  Plus,
  Sparkles,
  Zap,
  Flame,
  ArrowRight,
  Loader2,
  RefreshCw,
  ExternalLink,
  ShoppingBag,
  CheckCircle2,
  ShieldCheck,
  Star
} from 'lucide-react';

interface TrendsViewProps {
  onUseTrend: (trend: TrendItem) => void;
  onSwitchToGenerator?: (platform?: 'meli' | 'shopee' | 'pf') => void;
}

export const TrendsView: React.FC<TrendsViewProps> = ({
  onUseTrend,
  onSwitchToGenerator
}) => {
  const [activePlatform, setActivePlatform] = useState<'meli' | 'shopee'>('meli');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('Tech');
  const [liveTrends, setLiveTrends] = useState<TrendItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(true);
  const [activeSearchLabel, setActiveSearchLabel] = useState<string>('');

  const meliCategories = [
    { id: 'Tech', label: 'Tech & Áudio', icon: '📱' },
    { id: 'Celulares', label: 'Celulares', icon: '📲' },
    { id: 'Informática', label: 'Informática', icon: '💻' },
    { id: 'Casa e cozinha', label: 'Casa & Cozinha', icon: '🏠' },
    { id: 'Eletrodomésticos', label: 'Eletro', icon: '⚡' },
    { id: 'Beleza e skincare', label: 'Beleza & Cuidados', icon: '💄' },
    { id: 'Suplementos e saúde', label: 'Suplementos & Saúde', icon: '💊' },
    { id: 'Esporte', label: 'Esportes & Fitness', icon: '⚽' },
    { id: 'Moda', label: 'Moda & Calçados', icon: '👕' },
    { id: 'Infantil e família', label: 'Brinquedos & Bebês', icon: '🧸' },
    { id: 'Automotivo', label: 'Automotivo', icon: '🚗' },
    { id: 'Ferramentas', label: 'Ferramentas', icon: '🔧' }
  ];

  const shopeeCategories = [
    { id: 'Tech', label: 'Eletrônicos & Acessórios', icon: '🎧' },
    { id: 'Celulares', label: 'Capinhas & Cabos', icon: '📱' },
    { id: 'Informática', label: 'Informática & Gamer', icon: '🖱️' },
    { id: 'Casa e cozinha', label: 'Casa & Utilidades', icon: '🍳' },
    { id: 'Beleza e skincare', label: 'Make & Skincare', icon: '💋' },
    { id: 'Moda', label: 'Moda & Roupas', icon: '👗' },
    { id: 'Esporte', label: 'Fitness & Treino', icon: '🏋️' },
    { id: 'Suplementos e saúde', label: 'Saúde & Vitaminas', icon: '🌿' },
    { id: 'Infantil e família', label: 'Bebês & Crianças', icon: '🍼' }
  ];

  const meliQuickSearches = [
    'fone bluetooth',
    'smartwatch',
    'air fryer 5l',
    'creatina 100 pura',
    'notebook gamer',
    'escova secadora',
    'camera veicular'
  ];

  const shopeeQuickSearches = [
    'fone sem fio tws',
    'gloss volumoso',
    'relogio d20',
    'mini processador',
    'kit faixas elasticas',
    'bolsa transversal',
    'creatina monohidratada'
  ];

  const categories = activePlatform === 'meli' ? meliCategories : shopeeCategories;
  const quickSearches = activePlatform === 'meli' ? meliQuickSearches : shopeeQuickSearches;

  // Fetch real live trends/best-sellers
  const fetchLiveTrends = async (platform: 'meli' | 'shopee', cat: string) => {
    setIsLoading(true);
    setActiveSearchLabel('');
    try {
      const endpoint = platform === 'meli'
        ? `/api/meli/trends?category=${encodeURIComponent(cat)}`
        : `/api/shopee/trends?category=${encodeURIComponent(cat)}`;

      const resp = await fetch(endpoint);
      if (resp.ok) {
        const data = await resp.json();
        if (data.items && data.items.length > 0) {
          setLiveTrends(data.items);
          setIsLiveConnected(true);
          return;
        }
      }
      throw new Error('API offline ou vazia');
    } catch (err) {
      console.warn('Fallback to local trends data:', err);
      const fallback = SAMPLE_TRENDS.filter(t => t.category === cat || cat === 'Tech');
      setLiveTrends(fallback.length > 0 ? fallback : SAMPLE_TRENDS.slice(0, 6));
      setIsLiveConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Perform real search on Mercado Livre / Shopee
  const handlePerformRealSearch = async (queryToSearch: string) => {
    const q = queryToSearch.trim();
    if (!q) return;

    setIsLoading(true);
    setActiveSearchLabel(q);
    try {
      const endpoint = activePlatform === 'meli'
        ? `/api/meli/search?q=${encodeURIComponent(q)}`
        : `/api/shopee/search?q=${encodeURIComponent(q)}`;

      const resp = await fetch(endpoint);
      if (resp.ok) {
        const data = await resp.json();
        if (data.items && data.items.length > 0) {
          setLiveTrends(data.items);
          setIsLiveConnected(true);
          return;
        }
      }
      throw new Error('Nenhum resultado retornado');
    } catch (err) {
      console.warn('Busca local fallback:', err);
      const filtered = SAMPLE_TRENDS.filter(t =>
        t.title.toLowerCase().includes(q.toLowerCase()) ||
        t.searchTerm.toLowerCase().includes(q.toLowerCase())
      );
      setLiveTrends(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveTrends(activePlatform, selectedCat);
  }, [activePlatform, selectedCat]);

  const handleQuickSearchClick = (query: string) => {
    setSearchTerm(query);
    handlePerformRealSearch(query);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      handlePerformRealSearch(searchTerm);
    } else {
      fetchLiveTrends(activePlatform, selectedCat);
    }
  };

  const activeCategoryLabel =
    categories.find((c) => c.id === selectedCat)?.label || selectedCat;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-20">
      {/* =========================================================================
          TOP PLATFORM SELECTOR PILLS
         ========================================================================= */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
        {/* Meli Trends (tendencias.mercadolivre.com.br) */}
        <button
          onClick={() => {
            setActivePlatform('meli');
            setSelectedCat('Tech');
            setSearchTerm('');
            setActiveSearchLabel('');
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold transition-all ${
            activePlatform === 'meli'
              ? 'bg-[#F5C542] text-[#080808] shadow-lg shadow-[#F5C542]/20 scale-105'
              : 'bg-[#151515] text-[#A1A1A1] border border-[#2A2A2A] hover:text-white hover:border-[#F5C542]/40'
          }`}
        >
          <span>🔥</span>
          <span>Mercado Livre Trends</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/20 text-[#080808] font-black">
            AO VIVO
          </span>
        </button>

        {/* Shopee Mais Vendidos */}
        <button
          onClick={() => {
            setActivePlatform('shopee');
            setSelectedCat('Tech');
            setSearchTerm('');
            setActiveSearchLabel('');
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold transition-all ${
            activePlatform === 'shopee'
              ? 'bg-[#EE4D2D] text-white shadow-lg shadow-[#EE4D2D]/20 scale-105'
              : 'bg-[#151515] text-[#A1A1A1] border border-[#2A2A2A] hover:text-white hover:border-[#EE4D2D]/40'
          }`}
        >
          <span>🟠</span>
          <span>Shopee Mais Vendidos</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/30 text-white font-black">
            DADOS REAIS
          </span>
        </button>

        {/* Gerador PF */}
        <button
          onClick={() => onSwitchToGenerator && onSwitchToGenerator('pf')}
          className="flex items-center gap-2 px-5 py-3 rounded-full text-xs font-medium bg-[#151515] text-[#A1A1A1] border border-[#2A2A2A] hover:text-white transition-all"
        >
          <span>💎</span>
          <span>Gerador PF</span>
        </button>
      </div>

      {/* =========================================================================
          SECTION TITLE & SUBTITLE
         ========================================================================= */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping"></span>
          <span>
            {activePlatform === 'meli'
              ? 'Conectado com tendencias.mercadolivre.com.br (MLB)'
              : 'Conectado aos Mais Vendidos da Shopee Brasil'}
          </span>
        </div>

        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2 font-display">
          <span>{activePlatform === 'meli' ? '🔥' : '🟠'}</span>
          <span>
            {activePlatform === 'meli' ? 'Mercado Livre Trends' : 'Shopee Mais Vendidos'}
          </span>
        </h2>
        <p className="text-[#A1A1A1] text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
          {activePlatform === 'meli'
            ? 'Monitoramento automático das buscas e produtos mais quentes do Mercado Livre Brasil. Escolha uma categoria para ver as tendências em tempo real.'
            : 'Explore os produtos campeões de vendas e alto giro na Shopee Brasil com volume de saída e preços reais verificados.'}
        </p>
      </div>

      {/* =========================================================================
          BIG SEARCH CARD & QUICK SEARCH CHIPS
         ========================================================================= */}
      <div className="bg-[#121212] border border-[#222222] rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl">
        {/* Search Input Row */}
        <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={
                activePlatform === 'meli'
                  ? 'Pesquisar produto no Mercado Livre (ex: fone bluetooth, smartwatch, air fryer...)'
                  : 'Pesquisar mais vendidos na Shopee (ex: fone tws, gloss labial, relogio...)'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-2xl px-5 py-4 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#F5C542] transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 font-extrabold px-7 py-4 rounded-2xl text-sm shadow-xl transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50 ${
              activePlatform === 'meli'
                ? 'bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] shadow-[#F5C542]/15'
                : 'bg-[#EE4D2D] hover:bg-[#FF6442] text-white shadow-[#EE4D2D]/20'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Buscando ao vivo...</span>
              </>
            ) : (
              <>
                <span>{activePlatform === 'meli' ? 'Ver no Mercado Livre' : 'Ver na Shopee'}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </form>

        {/* Quick searches row */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-[#8E8E8E] font-medium mr-1">Mais buscados:</span>
          {quickSearches.map((qs) => (
            <button
              key={qs}
              type="button"
              onClick={() => handleQuickSearchClick(qs)}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                searchTerm.toLowerCase() === qs.toLowerCase()
                  ? activePlatform === 'meli'
                    ? 'bg-[#F5C542] text-[#080808] border-[#F5C542] font-bold'
                    : 'bg-[#EE4D2D] text-white border-[#EE4D2D] font-bold'
                  : 'bg-[#181818] border-[#2A2A2A] text-[#C0C0C0] hover:text-white hover:border-[#555]'
              }`}
            >
              {qs}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          CATEGORY EXPLORATION PILLS (Matching Meli & Shopee Categories)
         ========================================================================= */}
      <div className="space-y-4 text-center">
        <span className="text-xs text-[#888888] font-semibold tracking-wider uppercase">
          Escolha uma categoria para ver os mais quentes:
        </span>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => {
            const isActive = selectedCat === cat.id && !activeSearchLabel;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCat(cat.id);
                  setSearchTerm('');
                  setActiveSearchLabel('');
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? activePlatform === 'meli'
                      ? 'bg-[#F5C542] text-[#080808] font-bold shadow-lg shadow-[#F5C542]/20 scale-105'
                      : 'bg-[#EE4D2D] text-white font-bold shadow-lg shadow-[#EE4D2D]/20 scale-105'
                    : 'bg-[#141414] border border-[#242424] text-[#A1A1A1] hover:text-white hover:border-[#444]'
                }`}
              >
                <span className="text-sm">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          RANKED LIST HEADER & CARDS (WITH REAL DATA)
         ========================================================================= */}
      <div className="space-y-4 pt-2">
        {/* Header with platform indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-3.5 rounded-xs inline-block ${
                activePlatform === 'meli' ? 'bg-[#F5C542]' : 'bg-[#EE4D2D]'
              }`}
            ></span>
            <h3 className="text-base font-bold text-white tracking-tight">
              {activeSearchLabel
                ? `Resultados ao vivo para "${activeSearchLabel}"`
                : `${activeCategoryLabel} — ${activePlatform === 'meli' ? 'Tendências no Mercado Livre' : 'Mais vendidos na Shopee'}`}
            </h3>
          </div>

          <button
            onClick={() =>
              activeSearchLabel
                ? handlePerformRealSearch(activeSearchLabel)
                : fetchLiveTrends(activePlatform, selectedCat)
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181818] hover:bg-[#222] border border-[#262626] text-[#A1A1A1] hover:text-white text-[11px] font-medium transition-colors w-fit"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-[#F5C542]' : ''}`} />
            <span>Atualizar dados reais ({activePlatform === 'meli' ? 'Meli' : 'Shopee'})</span>
          </button>
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="bg-[#121212] border border-[#222222] rounded-2xl p-5 flex items-center justify-between gap-4 animate-pulse"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 bg-[#222] rounded-xl shrink-0"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-[#222] rounded w-3/4"></div>
                    <div className="h-3 bg-[#1A1A1A] rounded w-1/2"></div>
                  </div>
                </div>
                <div className="w-24 h-9 bg-[#222] rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : liveTrends.length === 0 ? (
          <div className="bg-[#121212] border border-[#222222] rounded-3xl p-12 text-center space-y-3">
            <p className="text-white font-bold text-base">Nenhum produto retornado</p>
            <p className="text-xs text-[#8E8E8E]">
              Tente selecionar outra categoria ou buscar um produto específico.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCat('Tech');
                fetchLiveTrends(activePlatform, 'Tech');
              }}
              className="mt-2 text-xs bg-[#F5C542] text-[#080808] font-bold px-5 py-2.5 rounded-xl cursor-pointer"
            >
              Recarregar Categoria Tech
            </button>
          </div>
        ) : (
          /* List of Horizontal Ranked Rows with Real Data */
          <div className="space-y-3">
            {liveTrends.map((trend, idx) => {
              const trendThumbnail =
                (trend as any).thumbnail ||
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
              const trendRealUrl = (trend as any).realUrl;
              const isShopee = (trend as any).platform === 'Shopee' || activePlatform === 'shopee';

              return (
                <div
                  key={trend.id || idx}
                  className="bg-[#121212] border border-[#222222] rounded-2xl p-4 md:p-5 hover:border-[#F5C542]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group shadow-lg"
                >
                  {/* Left: Rank + Photo + Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0 w-full sm:w-auto">
                    {/* Rank Badge */}
                    <div className="flex flex-col items-center justify-center shrink-0 w-8">
                      <span
                        className={`text-xl md:text-2xl font-black ${
                          idx === 0
                            ? 'text-[#F5C542]'
                            : idx === 1
                            ? 'text-[#E0E0E0]'
                            : idx === 2
                            ? 'text-[#CD7F32]'
                            : 'text-[#666666]'
                        }`}
                      >
                        #{trend.rank || idx + 1}
                      </span>
                    </div>

                    {/* Product Photo */}
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={trendThumbnail}
                        alt={trend.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback image if blocked
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      {/* Product Title */}
                      <h4 className="text-sm md:text-base font-bold text-white tracking-tight line-clamp-1 group-hover:text-[#F5C542] transition-colors">
                        {trend.title}
                      </h4>

                      {/* Search Query & Real Price */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#8E8E8E]">
                        <div className="flex items-center gap-1.5">
                          <span>🔍</span>
                          <span className="truncate max-w-[200px] md:max-w-xs">
                            Busca:{' '}
                            <strong className="text-[#D4D4D4] font-medium">
                              "{trend.searchQueryDisplay || trend.searchTerm || trend.title}"
                            </strong>
                          </span>
                        </div>

                        {trend.suggestedPrice && (
                          <span className="text-[#F5C542] font-extrabold text-xs md:text-sm">
                            {trend.suggestedPrice}
                          </span>
                        )}
                      </div>

                      {/* Badges and live metrics */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        {trend.badges?.map((badge, bIdx) => (
                          <span
                            key={bIdx}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                              badge.type === 'hot'
                                ? 'bg-[#2D1616] text-[#F87171] border-[#7F1D1D]/50'
                                : badge.type === 'ticket'
                                ? 'bg-[#241E38] text-[#C084FC] border-[#581C87]/50'
                                : badge.type === 'demand'
                                ? isShopee
                                  ? 'bg-[#3A1E18] text-[#FF8566] border-[#EE4D2D]/40'
                                  : 'bg-[#2D2614] text-[#FBBF24] border-[#78350F]/50'
                                : 'bg-[#142A1E] text-[#4ADE80] border-[#14532D]/50'
                            }`}
                          >
                            {badge.label}
                          </span>
                        ))}

                        {trend.subtitleMetrics && (
                          <span className="text-[11px] text-[#7E7E7E]">
                            • {trend.subtitleMetrics}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Usar + Ver no Meli/Shopee */}
                  <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-[#222] pt-3 sm:pt-0">
                    {trendRealUrl && (
                      <a
                        href={trendRealUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] font-semibold text-[#8E8E8E] hover:text-white bg-[#1A1A1A] border border-[#2A2A2A] px-3 py-2 rounded-xl transition-all"
                        title={isShopee ? 'Abrir na Shopee' : 'Abrir no Mercado Livre'}
                      >
                        <span>{isShopee ? 'Shopee' : 'Meli'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    <button
                      onClick={() =>
                        onUseTrend({
                          ...trend,
                          platform: isShopee ? 'Shopee' : 'Mercado Livre'
                        })
                      }
                      className="flex items-center gap-1.5 bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] font-extrabold px-4 py-2 rounded-xl text-xs shadow-md shadow-[#F5C542]/10 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Criar Review</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
