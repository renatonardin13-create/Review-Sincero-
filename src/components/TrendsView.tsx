import React, { useState, useEffect, useCallback } from 'react';
import { resolveOfficialProductUrl } from '../utils/urlResolver';
import { TrendItem } from '../types';
import {
  TrendingUp,
  Search,
  Plus,
  Zap,
  Flame,
  ArrowRight,
  Loader2,
  RefreshCw,
  ExternalLink,
  ShoppingBag,
  Check,
  Copy,
  Radio,
  Sparkles,
  BarChart3,
  Award,
  Globe2,
  SlidersHorizontal
} from 'lucide-react';

interface TrendsViewProps {
  onUseTrend: (trend: TrendItem) => void;
  onSwitchToGenerator?: (platform?: 'meli' | 'shopee' | 'pf') => void;
}

type MeliTrendType = 'all' | 'growth' | 'revenue' | 'popular';

export const TrendsView: React.FC<TrendsViewProps> = ({
  onUseTrend,
  onSwitchToGenerator
}) => {
  const [activePlatform, setActivePlatform] = useState<'meli' | 'shopee' | 'all'>('meli');
  const [meliFilterType, setMeliFilterType] = useState<MeliTrendType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('Tech');
  const [liveTrends, setLiveTrends] = useState<TrendItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [totalCount, setTotalCount] = useState<number>(0);
  const [meliStats, setMeliStats] = useState<{ growth: number; revenue: number; popular: number; total: number }>({
    growth: 0,
    revenue: 0,
    popular: 0,
    total: 0
  });
  const [activeSearchLabel, setActiveSearchLabel] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const meliCategories = [
    { id: 'Tech', label: 'Tech & Áudio', icon: '📱' },
    { id: 'Celulares', label: 'Celulares & Smartphones', icon: '📲' },
    { id: 'Informática', label: 'Informática & Gamer', icon: '💻' },
    { id: 'Casa e cozinha', label: 'Casa & Móveis', icon: '🏠' },
    { id: 'Eletrodomésticos', label: 'Eletrodomésticos', icon: '⚡' },
    { id: 'Beleza e skincare', label: 'Beleza & Cuidados', icon: '💄' },
    { id: 'Suplementos e saúde', label: 'Saúde & Suplementos', icon: '💊' },
    { id: 'Esporte', label: 'Esportes & Fitness', icon: '⚽' },
    { id: 'Moda', label: 'Moda & Calçados', icon: '👕' },
    { id: 'Infantil e família', label: 'Brinquedos & Bebês', icon: '🧸' },
    { id: 'Automotivo', label: 'Acessórios Automotivos', icon: '🚗' },
    { id: 'Ferramentas', label: 'Ferramentas & Construção', icon: '🔧' }
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
    'starlink mini',
    'cadeira gamer',
    'creatina monohidratada',
    'poco x5 pro',
    'ar condicionado inverter',
    'fone de ouvido bluetooth',
    'geladeira frost free',
    'apple watch',
    'notebook gamer'
  ];

  const shopeeQuickSearches = [
    'fone bluetooth tws',
    'smartwatch d20 ultra',
    'mini processador alimentos',
    'gloss volumoso',
    'garrafa termica 2l',
    'kit mini bands',
    'escova secadora 3 em 1'
  ];

  const categories = activePlatform === 'shopee' ? shopeeCategories : meliCategories;
  const quickSearches = activePlatform === 'shopee' ? shopeeQuickSearches : meliQuickSearches;

  // Fetch real live trends directly from backend live hub
  const fetchLiveTrendsData = useCallback(async (
    platform: 'meli' | 'shopee' | 'all',
    type: MeliTrendType,
    cat: string,
    forceRefresh = false
  ) => {
    setIsLoading(true);
    setActiveSearchLabel('');
    try {
      const queryParams = new URLSearchParams({
        platform,
        type,
        category: cat,
        refresh: forceRefresh ? 'true' : 'false'
      });

      const resp = await fetch(`/api/trends/live?${queryParams.toString()}`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const data = await resp.json();
      if (data.items && Array.isArray(data.items)) {
        setLiveTrends(data.items);
        setTotalCount(data.total || data.items.length);
        if (data.meliCounts) {
          setMeliStats(data.meliCounts);
        }
        const now = new Date();
        setLastSyncTime(now.toLocaleTimeString('pt-BR'));
        return;
      }
      throw new Error('Nenhum dado retornado');
    } catch (err) {
      console.warn('[TrendsView] Live fetch warning:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Perform live search query across Mercado Livre / Shopee
  const handlePerformRealSearch = async (queryToSearch: string) => {
    const q = queryToSearch.trim();
    if (!q) return;

    setIsLoading(true);
    setActiveSearchLabel(q);
    try {
      const endpoint = activePlatform === 'shopee'
        ? `/api/shopee/search?q=${encodeURIComponent(q)}`
        : `/api/meli/search?q=${encodeURIComponent(q)}`;

      const resp = await fetch(endpoint);
      if (resp.ok) {
        const data = await resp.json();
        if (data.items && Array.isArray(data.items)) {
          setLiveTrends(data.items);
          setTotalCount(data.items.length);
          const now = new Date();
          setLastSyncTime(now.toLocaleTimeString('pt-BR'));
          return;
        }
      }
      throw new Error('Busca retornou vazio');
    } catch (err) {
      console.warn('[TrendsView] Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveTrendsData(activePlatform, meliFilterType, selectedCat, false);
  }, [activePlatform, meliFilterType, selectedCat, fetchLiveTrendsData]);

  const handleQuickSearchClick = (query: string) => {
    setSearchTerm(query);
    handlePerformRealSearch(query);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      handlePerformRealSearch(searchTerm);
    } else {
      fetchLiveTrendsData(activePlatform, meliFilterType, selectedCat, false);
    }
  };

  const handleCopyTerm = (term: string, id: string) => {
    navigator.clipboard.writeText(term);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeCategoryLabel =
    categories.find((c) => c.id === selectedCat)?.label || selectedCat;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300 pb-24">
      {/* =========================================================================
          LIVE CONNECTION HERO BANNER
         ========================================================================= */}
      <div className="bg-[#101010] border border-[#222222] rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5C542]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            {/* Live Indicator Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
              </span>
              <span className="tracking-wide">CONEXÃO AO VIVO</span>
              <span className="text-[#A1A1A1]">•</span>
              <span className="text-[#D4D4D4] font-medium">
                {lastSyncTime ? `Sincronizado às ${lastSyncTime}` : 'Conectando ao site...'}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-display flex items-center gap-3">
              <span>Radar de Tendências Ao Vivo</span>
            </h1>

            <p className="text-xs md:text-sm text-[#A1A1A1] leading-relaxed">
              Integração direta e em tempo real com{' '}
              <a
                href="https://tendencias.mercadolivre.com.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F5C542] hover:underline font-semibold inline-flex items-center gap-1"
              >
                tendencias.mercadolivre.com.br
                <ExternalLink className="w-3 h-3" />
              </a>{' '}
              e os produtos campeões de vendas da Shopee Brasil.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
            <button
              onClick={() => fetchLiveTrendsData(activePlatform, meliFilterType, selectedCat, true)}
              disabled={isLoading}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#252525] border border-[#333333] text-white px-4 py-3 rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Buscar dados mais recentes diretamente dos sites"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#F5C542]' : 'text-[#F5C542]'}`} />
              <span>Atualizar Ao Vivo</span>
            </button>

            <a
              href="https://tendencias.mercadolivre.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 bg-[#F5C542]/10 hover:bg-[#F5C542]/20 border border-[#F5C542]/30 text-[#F5C542] px-4 py-3 rounded-2xl text-xs font-bold transition-all"
            >
              <span>Abrir Site Oficial</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Real-time stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-[#202020]">
          <div className="bg-[#151515] border border-[#262626] rounded-2xl p-3.5">
            <div className="text-[11px] text-[#8E8E8E] font-medium flex items-center gap-1">
              <span>📈 Maior Crescimento</span>
            </div>
            <div className="text-xl font-black text-white mt-1">
              {meliStats.growth > 0 ? `${meliStats.growth} termos` : '10+ termos'}
            </div>
          </div>

          <div className="bg-[#151515] border border-[#262626] rounded-2xl p-3.5">
            <div className="text-[11px] text-[#8E8E8E] font-medium flex items-center gap-1">
              <span>⭐ Mais Desejadas</span>
            </div>
            <div className="text-xl font-black text-[#F5C542] mt-1">
              {meliStats.revenue > 0 ? `${meliStats.revenue} termos` : '20+ termos'}
            </div>
          </div>

          <div className="bg-[#151515] border border-[#262626] rounded-2xl p-3.5">
            <div className="text-[11px] text-[#8E8E8E] font-medium flex items-center gap-1">
              <span>🔥 Mais Populares</span>
            </div>
            <div className="text-xl font-black text-white mt-1">
              {meliStats.popular > 0 ? `${meliStats.popular} termos` : '20+ termos'}
            </div>
          </div>

          <div className="bg-[#151515] border border-[#262626] rounded-2xl p-3.5">
            <div className="text-[11px] text-[#8E8E8E] font-medium flex items-center gap-1">
              <span>🌐 Total em Alta</span>
            </div>
            <div className="text-xl font-black text-[#22C55E] mt-1">
              {totalCount > 0 ? `${totalCount} itens` : '50+ itens'}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PLATFORM SELECTOR PILLS
         ========================================================================= */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Mercado Livre Trends */}
        <button
          onClick={() => {
            setActivePlatform('meli');
            setSearchTerm('');
            setActiveSearchLabel('');
          }}
          className={`flex items-center gap-2.5 px-6 py-3.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activePlatform === 'meli'
              ? 'bg-[#F5C542] text-[#080808] shadow-xl shadow-[#F5C542]/25 scale-105'
              : 'bg-[#151515] text-[#A1A1A1] border border-[#2A2A2A] hover:text-white hover:border-[#F5C542]/40'
          }`}
        >
          <span className="text-sm">🔥</span>
          <span>Mercado Livre Trends</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/20 text-[#080808] font-black uppercase">
            Ao Vivo
          </span>
        </button>

        {/* Shopee Mais Vendidos */}
        <button
          onClick={() => {
            setActivePlatform('shopee');
            setSearchTerm('');
            setActiveSearchLabel('');
          }}
          className={`flex items-center gap-2.5 px-6 py-3.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activePlatform === 'shopee'
              ? 'bg-[#EE4D2D] text-white shadow-xl shadow-[#EE4D2D]/25 scale-105'
              : 'bg-[#151515] text-[#A1A1A1] border border-[#2A2A2A] hover:text-white hover:border-[#EE4D2D]/40'
          }`}
        >
          <span className="text-sm">🟠</span>
          <span>Shopee Mais Vendidos</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/30 text-white font-black uppercase">
            Top Vendas
          </span>
        </button>

        {/* Mix Ao Vivo */}
        <button
          onClick={() => {
            setActivePlatform('all');
            setSearchTerm('');
            setActiveSearchLabel('');
          }}
          className={`flex items-center gap-2.5 px-6 py-3.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activePlatform === 'all'
              ? 'bg-[#3B82F6] text-white shadow-xl shadow-[#3B82F6]/25 scale-105'
              : 'bg-[#151515] text-[#A1A1A1] border border-[#2A2A2A] hover:text-white hover:border-[#3B82F6]/40'
          }`}
        >
          <span className="text-sm">⚡</span>
          <span>Mix Ao Vivo (Meli + Shopee)</span>
        </button>

        {/* Gerador PF shortcut */}
        {onSwitchToGenerator && (
          <button
            onClick={() => onSwitchToGenerator('pf')}
            className="flex items-center gap-2 px-5 py-3.5 rounded-full text-xs font-medium bg-[#151515] text-[#A1A1A1] border border-[#2A2A2A] hover:text-white transition-all cursor-pointer"
          >
            <span>💎</span>
            <span>Gerador PF</span>
          </button>
        )}
      </div>

      {/* =========================================================================
          SUB-FILTERS (WHEN MELI OR MIX IS SELECTED)
         ========================================================================= */}
      {(activePlatform === 'meli' || activePlatform === 'all') && !activeSearchLabel && (
        <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-[#121212] border border-[#222222] rounded-2xl max-w-2xl mx-auto">
          <button
            onClick={() => setMeliFilterType('all')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              meliFilterType === 'all'
                ? 'bg-[#F5C542] text-[#080808] shadow-md'
                : 'text-[#A1A1A1] hover:text-white hover:bg-[#1A1A1A]'
            }`}
          >
            🌟 Todas ({meliStats.total || '50+'})
          </button>

          <button
            onClick={() => setMeliFilterType('growth')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              meliFilterType === 'growth'
                ? 'bg-[#F5C542] text-[#080808] shadow-md'
                : 'text-[#A1A1A1] hover:text-white hover:bg-[#1A1A1A]'
            }`}
          >
            📈 Maior Crescimento
          </button>

          <button
            onClick={() => setMeliFilterType('revenue')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              meliFilterType === 'revenue'
                ? 'bg-[#F5C542] text-[#080808] shadow-md'
                : 'text-[#A1A1A1] hover:text-white hover:bg-[#1A1A1A]'
            }`}
          >
            💰 Mais Desejadas
          </button>

          <button
            onClick={() => setMeliFilterType('popular')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              meliFilterType === 'popular'
                ? 'bg-[#F5C542] text-[#080808] shadow-md'
                : 'text-[#A1A1A1] hover:text-white hover:bg-[#1A1A1A]'
            }`}
          >
            🔥 Mais Populares
          </button>
        </div>
      )}

      {/* =========================================================================
          SEARCH & QUICK SEARCH CHIPS
         ========================================================================= */}
      <div className="bg-[#121212] border border-[#222222] rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl">
        <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#666]" />
            <input
              type="text"
              placeholder={
                activePlatform === 'shopee'
                  ? 'Pesquisar produtos mais vendidos na Shopee (ex: fone tws, gloss, smartwatch...)'
                  : 'Pesquisar tendências no Mercado Livre (ex: starlink mini, cadeira gamer, creatina...)'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#282828] rounded-2xl pl-12 pr-5 py-4 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#F5C542] transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 font-extrabold px-8 py-4 rounded-2xl text-sm shadow-xl transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50 ${
              activePlatform === 'shopee'
                ? 'bg-[#EE4D2D] hover:bg-[#FF6442] text-white shadow-[#EE4D2D]/20'
                : 'bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] shadow-[#F5C542]/15'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Consultando...</span>
              </>
            ) : (
              <>
                <span>Buscar Ao Vivo</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </form>

        {/* Quick searches chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-[#8E8E8E] font-medium mr-1 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-[#F5C542]" />
            Em alta no momento:
          </span>
          {quickSearches.map((qs) => (
            <button
              key={qs}
              type="button"
              onClick={() => handleQuickSearchClick(qs)}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                searchTerm.toLowerCase() === qs.toLowerCase()
                  ? activePlatform === 'shopee'
                    ? 'bg-[#EE4D2D] text-white border-[#EE4D2D] font-bold'
                    : 'bg-[#F5C542] text-[#080808] border-[#F5C542] font-bold'
                  : 'bg-[#181818] border-[#2A2A2A] text-[#C0C0C0] hover:text-white hover:border-[#555]'
              }`}
            >
              {qs}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          CATEGORY EXPLORATION PILLS
         ========================================================================= */}
      <div className="space-y-4 text-center">
        <span className="text-xs text-[#888888] font-semibold tracking-wider uppercase">
          Filtrar por Categoria:
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
                    ? activePlatform === 'shopee'
                      ? 'bg-[#EE4D2D] text-white font-bold shadow-lg shadow-[#EE4D2D]/20 scale-105'
                      : 'bg-[#F5C542] text-[#080808] font-bold shadow-lg shadow-[#F5C542]/20 scale-105'
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
          RANKED LIST OF LIVE TRENDS
         ========================================================================= */}
      <div className="space-y-4 pt-2">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-3.5 rounded-xs inline-block ${
                activePlatform === 'shopee'
                  ? 'bg-[#EE4D2D]'
                  : activePlatform === 'all'
                  ? 'bg-[#3B82F6]'
                  : 'bg-[#F5C542]'
              }`}
            ></span>
            <h2 className="text-base font-bold text-white tracking-tight">
              {activeSearchLabel
                ? `Resultados ao vivo para "${activeSearchLabel}"`
                : `${activeCategoryLabel} — ${
                    activePlatform === 'shopee'
                      ? 'Mais Vendidos na Shopee'
                      : activePlatform === 'all'
                      ? 'Tendências Combinadas (Meli + Shopee)'
                      : meliFilterType === 'growth'
                      ? 'Tendências que Mais Cresceram'
                      : meliFilterType === 'revenue'
                      ? 'Tendências Mais Desejadas / Maior Volume'
                      : meliFilterType === 'popular'
                      ? 'Tendências Mais Populares'
                      : 'Tendências Oficiais Mercado Livre'
                  }`}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8E8E8E] bg-[#161616] border border-[#242424] px-3 py-1.5 rounded-full font-medium">
              {liveTrends.length} produtos / termos ao vivo
            </span>
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
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
                <div className="w-28 h-10 bg-[#222] rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : liveTrends.length === 0 ? (
          <div className="bg-[#121212] border border-[#222222] rounded-3xl p-12 text-center space-y-3">
            <p className="text-white font-bold text-base">Nenhum produto retornado no momento</p>
            <p className="text-xs text-[#8E8E8E]">
              Clique no botão abaixo para forçar a sincronização ao vivo com os sites oficiais.
            </p>
            <button
              onClick={() => fetchLiveTrendsData(activePlatform, meliFilterType, selectedCat, true)}
              className="mt-2 text-xs bg-[#F5C542] text-[#080808] font-bold px-6 py-3 rounded-xl cursor-pointer hover:bg-[#FFD95A] transition-all"
            >
              Sincronizar Ao Vivo Novamente
            </button>
          </div>
        ) : (
          /* List of Horizontal Ranked Cards */
          <div className="space-y-3">
            {liveTrends.map((trend, idx) => {
              const isShopee = trend.platform === 'Shopee' || (trend as any).platform === 'Shopee';
              const trendThumbnail =
                trend.thumbnail ||
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
              
              const resolvedUrl = resolveOfficialProductUrl({
                  platform: isShopee ? 'Shopee' : 'Mercado Livre',
                  productUrl: (trend as any).realUrl,
                  searchTerm: trend.searchTerm || trend.title
              });

              const isProduct = isShopee 
                  ? resolvedUrl?.includes('/product/') 
                  : resolvedUrl?.includes('/p/') || resolvedUrl?.includes('produto.');

              const isCopied = copiedId === (trend.id || `${idx}`);

              return (
                <div
                  key={trend.id || idx}
                  className="bg-[#121212] border border-[#222222] rounded-2xl p-4 md:p-5 hover:border-[#F5C542]/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group shadow-lg"
                >
                  {/* Left: Rank + Photo + Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0 w-full sm:w-auto">
                    {/* Rank Number */}
                    <div className="flex flex-col items-center justify-center shrink-0 w-9">
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
                      <span className="text-[9px] text-[#777] uppercase font-bold">
                        {isShopee ? 'Shopee' : 'Meli'}
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
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      {/* Product Title */}
                      <h3 className="text-sm md:text-base font-bold text-white tracking-tight line-clamp-1 group-hover:text-[#F5C542] transition-colors">
                        {trend.title}
                      </h3>

                      {/* Search Query & Real Price */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#8E8E8E]">
                        <div className="flex items-center gap-1.5">
                          <span>🔍</span>
                          <span className="truncate max-w-[220px] md:max-w-xs">
                            Termo:{' '}
                            <strong className="text-[#D4D4D4] font-medium">
                              "{trend.searchTerm || trend.title}"
                            </strong>
                          </span>
                        </div>

                        {trend.suggestedPrice && (
                          <span className="text-[#F5C542] font-black text-xs md:text-sm">
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

                  {/* Right Actions: Usar + Ver no Site + Copiar */}
                  <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-[#222] pt-3 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => handleCopyTerm(trend.searchTerm || trend.title, trend.id || `${idx}`)}
                      className="p-2.5 rounded-xl bg-[#181818] hover:bg-[#252525] border border-[#2A2A2A] text-[#8E8E8E] hover:text-white transition-all cursor-pointer"
                      title="Copiar termo de busca"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {resolvedUrl && (
                      <a
                        href={resolvedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8E8E8E] hover:text-white bg-[#1A1A1A] hover:bg-[#252525] border border-[#2A2A2A] px-3.5 py-2.5 rounded-xl transition-all"
                        title={isShopee ? (isProduct ? 'Ver na Shopee' : 'Pesquisar na Shopee') : (isProduct ? 'Ver no Mercado Livre' : 'Pesquisar no Mercado Livre')}
                      >
                        <span>{isShopee ? (isProduct ? 'Ver na Shopee' : 'Pesquisar na Shopee') : (isProduct ? 'Ver no Mercado Livre' : 'Pesquisar no Mercado Livre')}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        onUseTrend({
                          ...trend,
                          platform: isShopee ? 'Shopee' : 'Mercado Livre',
                          thumbnail: trendThumbnail
                        })
                      }
                      className="flex items-center gap-1.5 bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-[#F5C542]/10 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
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
