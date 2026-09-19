import React, { useState, useMemo } from 'react';
import { RealKeywordMetric, KeywordPlannerResponse } from '../types';
import {
  Search,
  Sparkles,
  TrendingUp,
  Download,
  Copy,
  Check,
  Filter,
  ArrowUpDown,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  BarChart3,
  PlusCircle,
  Globe,
  Languages,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Info,
  Layers,
  FileSpreadsheet
} from 'lucide-react';

interface KeywordPlannerViewProps {
  onUseKeywordForReview: (keyword: string) => void;
}

export const KeywordPlannerView: React.FC<KeywordPlannerViewProps> = ({
  onUseKeywordForReview
}) => {
  // Search inputs
  const [keywordInput, setKeywordInput] = useState<string>('air fryer');
  const [location, setLocation] = useState<string>('Brasil');
  const [language, setLanguage] = useState<string>('Português');
  const [includeIdeas, setIncludeIdeas] = useState<boolean>(true);

  // Request State
  const [status, setStatus] = useState<'default' | 'loading' | 'success' | 'empty' | 'error'>('default');
  const [responseMeta, setResponseMeta] = useState<KeywordPlannerResponse | null>(null);
  const [results, setResults] = useState<RealKeywordMetric[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [copiedKw, setCopiedKw] = useState<string | null>(null);

  // Filters & Sorting in Table
  const [filterText, setFilterText] = useState<string>('');
  const [competitionFilter, setCompetitionFilter] = useState<string>('all');
  const [minVolumeFilter, setMinVolumeFilter] = useState<string>('');
  const [sortField, setSortField] = useState<'keyword' | 'avgMonthlySearches' | 'competitionIndex'>('avgMonthlySearches');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedTrendKw, setExpandedTrendKw] = useState<string | null>(null);

  const locationsList = [
    { id: 'Brasil', label: 'Brasil 🇧🇷' },
    { id: 'Portugal', label: 'Portugal 🇵🇹' },
    { id: 'Estados Unidos', label: 'Estados Unidos 🇺🇸' },
    { id: 'Espanha', label: 'Espanha 🇪🇸' },
    { id: 'Reino Unido', label: 'Reino Unido 🇬🇧' },
    { id: 'Argentina', label: 'Argentina 🇦🇷' },
    { id: 'Mexico', label: 'México 🇲🇽' }
  ];

  const languagesList = [
    { id: 'Português', label: 'Português' },
    { id: 'Inglês', label: 'Inglês' },
    { id: 'Espanhol', label: 'Espanhol' }
  ];

  const quickExamples = [
    'air fryer',
    'creatina 100 pura',
    'smartwatch',
    'fone bluetooth',
    'escova secadora',
    'aspirador robo',
    'colageno tipo 2'
  ];

  const handleSearch = async (overrideKeywords?: string) => {
    const rawKeywords = overrideKeywords !== undefined ? overrideKeywords : keywordInput;
    const cleanKw = rawKeywords.trim();

    if (!cleanKw) {
      setStatus('error');
      setErrorMessage('Informe ao menos uma palavra-chave para realizar a pesquisa.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    setExpandedTrendKw(null);

    try {
      const response = await fetch('/api/keyword-planner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          keywords: cleanKw,
          location,
          language,
          includeIdeas
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || errData.details || 'Não foi possível consultar os dados. Verifique a configuração da integração e tente novamente.');
      }

      const data: KeywordPlannerResponse = await response.json();
      setResponseMeta(data);

      if (!data.results || data.results.length === 0) {
        setResults([]);
        setStatus('empty');
      } else {
        setResults(data.results);
        setStatus('success');
      }
    } catch (err: any) {
      console.error('[KeywordPlannerView] Search error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Não foi possível consultar os dados. Verifique a configuração da integração e tente novamente.');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKw(text);
    setTimeout(() => setCopiedKw(null), 2000);
  };

  const handleExportCSV = () => {
    if (results.length === 0) return;

    // Header strictly containing real fields
    const headers = [
      'keyword',
      'average_monthly_searches',
      'competition',
      'competition_index',
      'low_bid',
      'high_bid',
      'currency'
    ];

    const rows = filteredResults.map((r) => {
      return [
        `"${(r.keyword || '').replace(/"/g, '""')}"`,
        r.avgMonthlySearches !== undefined ? r.avgMonthlySearches : '',
        r.competition || '',
        r.competitionIndex !== undefined ? r.competitionIndex : '',
        r.lowTopPageBid !== undefined ? r.lowTopPageBid.toFixed(2) : '',
        r.highTopPageBid !== undefined ? r.highTopPageBid.toFixed(2) : '',
        r.currency || 'BRL'
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `palavras_chave_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (field: 'keyword' | 'avgMonthlySearches' | 'competitionIndex') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter and sort computation
  const filteredResults = useMemo(() => {
    let list = [...results];

    if (filterText.trim()) {
      const q = filterText.toLowerCase();
      list = list.filter((r) => r.keyword.toLowerCase().includes(q));
    }

    if (competitionFilter !== 'all') {
      list = list.filter((r) => r.competition === competitionFilter);
    }

    if (minVolumeFilter && !isNaN(Number(minVolumeFilter))) {
      const minV = Number(minVolumeFilter);
      list = list.filter((r) => r.avgMonthlySearches !== undefined && r.avgMonthlySearches >= minV);
    }

    list.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'keyword') {
        aVal = a.keyword.toLowerCase();
        bVal = b.keyword.toLowerCase();
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      aVal = aVal !== undefined ? aVal : -1;
      bVal = bVal !== undefined ? bVal : -1;

      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return list;
  }, [results, filterText, competitionFilter, minVolumeFilter, sortField, sortDirection]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* HEADER CARD */}
      <div className="bg-[#0D111A] border border-[#1E293B] rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#F5C542]/15 border border-[#F5C542]/30 flex items-center justify-center shadow-lg shadow-[#F5C542]/10">
                <Search className="w-4 h-4 text-[#F5C542]" />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Planejador de Palavras-chave
              </h2>
            </div>
            <p className="text-xs md:text-sm text-[#94A3B8] leading-relaxed">
              Consulte dados reais de pesquisas mensais, índice de concorrência, tendências de busca e estimativas de CPC para otimizar seus reviews e conversões.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {responseMeta && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131B2A] border border-[#24334A] text-xs">
                <span className={`w-2 h-2 rounded-full ${responseMeta.isRealApiConfigured ? 'bg-[#22C55E]' : 'bg-[#F5C542]'} animate-pulse`} />
                <span className="text-[#E2E8F0] font-medium">
                  {responseMeta.isRealApiConfigured ? 'Google Ads API Conectada' : 'Google Search Discovery'}
                </span>
                {responseMeta.cached && (
                  <span className="text-[10px] bg-[#1E293B] text-[#94A3B8] px-1.5 py-0.5 rounded font-mono">
                    cache
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEARCH FORM CARD */}
      <div className="bg-[#0D111A] border border-[#1E293B] rounded-2xl p-5 md:p-6 space-y-5 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Keyword Input */}
          <div className="md:col-span-6 space-y-1.5">
            <label className="text-[10px] font-bold text-[#A1A1A1] uppercase tracking-wider block">
              Palavra-chave ou Múltiplas (separadas por vírgula ou linha) *
            </label>
            <div className="relative">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
                placeholder="Ex: air fryer, air fryer barata, melhor air fryer"
                className="w-full bg-[#07090F] border border-[#1E293B] rounded-xl pl-10 pr-4 py-3 text-xs md:text-sm font-semibold text-white placeholder-[#555] focus:outline-none focus:border-[#3B82F6] transition-colors"
              />
              <Search className="w-4 h-4 text-[#777] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Location */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-[10px] font-bold text-[#A1A1A1] uppercase tracking-wider block">
              Localização
            </label>
            <div className="relative">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#07090F] border border-[#1E293B] rounded-xl pl-9 pr-4 py-3 text-xs md:text-sm font-medium text-white focus:outline-none focus:border-[#3B82F6] appearance-none cursor-pointer"
              >
                {locationsList.map((loc) => (
                  <option key={loc.id} value={loc.id} className="bg-[#0D111A] text-white">
                    {loc.label}
                  </option>
                ))}
              </select>
              <Globe className="w-4 h-4 text-[#777] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Language */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-[10px] font-bold text-[#A1A1A1] uppercase tracking-wider block">
              Idioma
            </label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-[#07090F] border border-[#1E293B] rounded-xl pl-9 pr-4 py-3 text-xs md:text-sm font-medium text-white focus:outline-none focus:border-[#3B82F6] appearance-none cursor-pointer"
              >
                {languagesList.map((lang) => (
                  <option key={lang.id} value={lang.id} className="bg-[#0D111A] text-white">
                    {lang.label}
                  </option>
                ))}
              </select>
              <Languages className="w-4 h-4 text-[#777] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Options & Action Row */}
        <div className="pt-2 border-t border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-[#CBD5E1] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeIdeas}
                onChange={(e) => setIncludeIdeas(e.target.checked)}
                className="w-4 h-4 rounded bg-[#07090F] border-[#1E293B] text-[#2563EB] focus:ring-0 cursor-pointer"
              />
              <span>Gerar ideias e termos relacionados reais</span>
            </label>
          </div>

          <button
            type="button"
            onClick={() => handleSearch()}
            disabled={status === 'loading'}
            className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-extrabold px-6 py-3 rounded-xl text-xs md:text-sm shadow-lg shadow-blue-500/20 transition-all cursor-pointer hover:scale-[1.01] active:scale-95"
          >
            {status === 'loading' ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Consultando dados de palavras-chave...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Pesquisar palavras-chave</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Suggestions Chips */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold text-[#666] uppercase tracking-wider">
            Sugestões Rápidas:
          </span>
          {quickExamples.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setKeywordInput(ex);
                handleSearch(ex);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-[#141A26] hover:bg-[#1E293B] text-[#94A3B8] hover:text-white border border-[#24334A] transition-colors cursor-pointer"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* STATE: DEFAULT / WELCOME */}
      {status === 'default' && (
        <div className="bg-[#0A0D14] border border-[#1E293B] rounded-2xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#1E293B] border border-[#334155] flex items-center justify-center mx-auto text-[#60A5FA]">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-white">Planeje seus Reviews com Dados Reais</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Digite uma palavra-chave acima para descobrir termos de alta intenção de compra, concorrência no Google e criar páginas focadas em conversão real.
            </p>
          </div>
        </div>
      )}

      {/* STATE: LOADING */}
      {status === 'loading' && (
        <div className="bg-[#0A0D14] border border-[#1E293B] rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto">
            <RefreshCw className="w-6 h-6 text-[#38BDF8] animate-spin" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Consultando dados de palavras-chave...</h3>
            <p className="text-xs text-[#94A3B8]">
              Consultando métricas e ideias relacionadas para <strong className="text-white">{keywordInput}</strong>...
            </p>
          </div>
        </div>
      )}

      {/* STATE: ERROR */}
      {status === 'error' && (
        <div className="bg-[#1A0C0C] border border-[#7F1D1D]/60 rounded-2xl p-6 md:p-8 space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-[#EF4444]">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-white">
              Não foi possível consultar os dados
            </h3>
            <p className="text-xs text-[#F87171] leading-relaxed">
              {errorMessage || 'Verifique a configuração da integração e tente novamente.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleSearch()}
            className="inline-flex items-center gap-2 bg-[#1E293B] hover:bg-[#334155] text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Tentar Novamente</span>
          </button>
        </div>
      )}

      {/* STATE: EMPTY */}
      {status === 'empty' && (
        <div className="bg-[#0A0D14] border border-[#1E293B] rounded-2xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#1E293B] flex items-center justify-center mx-auto text-[#94A3B8]">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Nenhuma palavra-chave encontrada.</h3>
          <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
            Tente buscar por termos mais amplos ou variar a localização e idioma.
          </p>
        </div>
      )}

      {/* STATE: SUCCESS WITH RESULTS TABLE */}
      {status === 'success' && (
        <div className="space-y-4">
          {/* Informative source / config notice */}
          {responseMeta?.message && (
            <div className="bg-[#0B1324] border border-[#1E3A8A]/50 rounded-2xl p-4 flex items-start gap-3">
              <Info className="w-4 h-4 text-[#60A5FA] shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs text-[#CBD5E1]">
                <strong className="text-white font-semibold">Fonte dos Dados: </strong>
                <span>{responseMeta.message}</span>
              </div>
            </div>
          )}

          {/* FILTERS & STATS BAR */}
          <div className="bg-[#0D111A] border border-[#1E293B] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Filter by keyword text */}
              <div className="relative min-w-[200px]">
                <input
                  type="text"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  placeholder="Filtrar resultados..."
                  className="w-full bg-[#07090F] border border-[#1E293B] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#3B82F6]"
                />
                <Filter className="w-3.5 h-3.5 text-[#666] absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* Filter by competition */}
              <select
                value={competitionFilter}
                onChange={(e) => setCompetitionFilter(e.target.value)}
                className="bg-[#07090F] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-[#CBD5E1] focus:outline-none focus:border-[#3B82F6] cursor-pointer"
              >
                <option value="all">Todas as Concorrências</option>
                <option value="BAIXA">Baixa Concorrência</option>
                <option value="MÉDIA">Média Concorrência</option>
                <option value="ALTA">Alta Concorrência</option>
              </select>

              {/* Filter by min volume */}
              <input
                type="number"
                value={minVolumeFilter}
                onChange={(e) => setMinVolumeFilter(e.target.value)}
                placeholder="Volume mín."
                className="w-28 bg-[#07090F] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#3B82F6]"
              />

              <span className="text-xs text-[#94A3B8]">
                Exibindo <strong className="text-white">{filteredResults.length}</strong> de {results.length} palavras
              </span>
            </div>

            {/* Export CSV Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-[#131B2A] hover:bg-[#1E293B] text-[#38BDF8] border border-[#24334A] font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-sm hover:scale-[1.01]"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Exportar CSV</span>
              </button>
            </div>
          </div>

          {/* RESULTS TABLE */}
          <div className="bg-[#0D111A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1E293B] bg-[#0A0D14] text-[10px] font-bold text-[#A1A1A1] uppercase tracking-wider">
                    <th
                      className="p-4 cursor-pointer hover:text-white transition-colors select-none"
                      onClick={() => handleSort('keyword')}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Palavra-chave</span>
                        <ArrowUpDown className="w-3 h-3 text-[#555]" />
                      </div>
                    </th>
                    <th
                      className="p-4 cursor-pointer hover:text-white transition-colors select-none"
                      onClick={() => handleSort('avgMonthlySearches')}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Média de pesquisas/mês</span>
                        <ArrowUpDown className="w-3 h-3 text-[#555]" />
                      </div>
                    </th>
                    <th
                      className="p-4 cursor-pointer hover:text-white transition-colors select-none"
                      onClick={() => handleSort('competitionIndex')}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Concorrência</span>
                        <ArrowUpDown className="w-3 h-3 text-[#555]" />
                      </div>
                    </th>
                    <th className="p-4">Índice</th>
                    <th className="p-4">Tendência</th>
                    <th className="p-4">CPC Baixo</th>
                    <th className="p-4">CPC Alto</th>
                    <th className="p-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B]/50 text-xs">
                  {filteredResults.map((item, idx) => {
                    const hasVolumes = item.monthlySearchVolumes && item.monthlySearchVolumes.length > 0;
                    const isExpanded = expandedTrendKw === item.keyword;

                    let compBadgeColor = 'bg-gray-500/10 text-gray-400 border-gray-500/20';
                    if (item.competition === 'BAIXA') compBadgeColor = 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20';
                    if (item.competition === 'MÉDIA') compBadgeColor = 'bg-[#F5C542]/10 text-[#F5C542] border-[#F5C542]/20';
                    if (item.competition === 'ALTA') compBadgeColor = 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20';

                    return (
                      <React.Fragment key={idx}>
                        <tr className="hover:bg-[#121826] transition-colors group">
                          {/* Keyword */}
                          <td className="p-4 font-semibold text-white">
                            <div className="flex items-center gap-2">
                              <span>{item.keyword}</span>
                              {item.isIdea && (
                                <span className="text-[9px] bg-[#1E293B] text-[#60A5FA] px-1.5 py-0.5 rounded font-mono">
                                  ideia
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => handleCopy(item.keyword)}
                                className="opacity-0 group-hover:opacity-100 text-[#777] hover:text-white transition-opacity p-1"
                                title="Copiar palavra-chave"
                              >
                                {copiedKw === item.keyword ? (
                                  <Check className="w-3 h-3 text-[#22C55E]" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Avg Monthly Searches */}
                          <td className="p-4 font-bold text-[#38BDF8] font-mono">
                            {item.avgMonthlySearches !== undefined
                              ? item.avgMonthlySearches.toLocaleString('pt-BR')
                              : <span className="text-[#666] font-normal text-[11px]">—</span>}
                          </td>

                          {/* Competition */}
                          <td className="p-4">
                            {item.competition ? (
                              <span className={`inline-block px-2 py-0.5 rounded-md border text-[10px] font-bold ${compBadgeColor}`}>
                                {item.competition}
                              </span>
                            ) : (
                              <span className="text-[#666] text-[11px]">—</span>
                            )}
                          </td>

                          {/* Competition Index (0-100) */}
                          <td className="p-4">
                            {item.competitionIndex !== undefined ? (
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-white text-[11px]">
                                  {item.competitionIndex}
                                </span>
                                <div className="w-12 h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{ width: `${Math.min(100, Math.max(0, item.competitionIndex))}%` }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <span className="text-[#666] text-[11px]">—</span>
                            )}
                          </td>

                          {/* Trend */}
                          <td className="p-4">
                            {hasVolumes ? (
                              <button
                                type="button"
                                onClick={() => setExpandedTrendKw(isExpanded ? null : item.keyword)}
                                className="flex items-center gap-1 text-[11px] text-[#38BDF8] hover:underline font-medium cursor-pointer"
                              >
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span>Ver gráfico</span>
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>
                            ) : (
                              <span className="text-[#666] text-[11px]">—</span>
                            )}
                          </td>

                          {/* Low CPC Bid */}
                          <td className="p-4 font-mono text-[#A1A1A1]">
                            {item.lowTopPageBid !== undefined
                              ? `R$ ${item.lowTopPageBid.toFixed(2)}`
                              : <span className="text-[#666] text-[11px]">—</span>}
                          </td>

                          {/* High CPC Bid */}
                          <td className="p-4 font-mono text-[#A1A1A1]">
                            {item.highTopPageBid !== undefined
                              ? `R$ ${item.highTopPageBid.toFixed(2)}`
                              : <span className="text-[#666] text-[11px]">—</span>}
                          </td>

                          {/* Action Button */}
                          <td className="p-4 text-right">
                            <button
                              type="button"
                              onClick={() => onUseKeywordForReview(item.keyword)}
                              className="inline-flex items-center gap-1.5 bg-[#131B2A] hover:bg-[#2563EB] text-[#E2E8F0] hover:text-white border border-[#24334A] hover:border-transparent px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer"
                            >
                              <PlusCircle className="w-3 h-3 text-[#F5C542]" />
                              <span>Criar Review</span>
                            </button>
                          </td>
                        </tr>

                        {/* EXPANDED MONTHLY TREND GRAPH */}
                        {isExpanded && item.monthlySearchVolumes && (
                          <tr className="bg-[#07090F]">
                            <td colSpan={8} className="p-4 border-b border-[#1E293B]">
                              <div className="bg-[#0B0E17] border border-[#1E293B] rounded-xl p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-white flex items-center gap-2">
                                    <BarChart3 className="w-3.5 h-3.5 text-[#38BDF8]" />
                                    <span>Histórico Mensal de Buscas: {item.keyword}</span>
                                  </span>
                                  <span className="text-[10px] text-[#94A3B8]">
                                    Últimos {item.monthlySearchVolumes.length} meses registrados
                                  </span>
                                </div>

                                {/* Sparkline Bar Representation of Real Monthly Volumes */}
                                <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 pt-2 items-end h-28">
                                  {(() => {
                                    const maxVal = Math.max(...item.monthlySearchVolumes.map((m) => m.searches), 1);
                                    return item.monthlySearchVolumes.map((m, mIdx) => {
                                      const pct = Math.max(10, Math.round((m.searches / maxVal) * 100));
                                      return (
                                        <div key={mIdx} className="flex flex-col items-center gap-1 h-full justify-end">
                                          <span className="text-[9px] font-mono text-[#94A3B8]">
                                            {m.searches.toLocaleString('pt-BR')}
                                          </span>
                                          <div
                                            className="w-full bg-[#1E3A8A] hover:bg-[#38BDF8] rounded-t transition-all cursor-pointer"
                                            style={{ height: `${pct}%` }}
                                            title={`${m.month}/${m.year}: ${m.searches.toLocaleString('pt-BR')} pesquisas`}
                                          />
                                          <span className="text-[9px] font-medium text-[#777]">
                                            {m.month}
                                          </span>
                                        </div>
                                      );
                                    });
                                  })()}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
