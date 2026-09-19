import React, { useState, useMemo, useEffect } from 'react';
import {
  RealKeywordMetric,
  KeywordPlannerResponse,
  KeywordPlannerErrorCode,
  KeywordPlannerDiagnostics
} from '../types';
import { keywordService } from '../services/keywordService';
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
  FileSpreadsheet,
  Server,
  KeyRound,
  CheckCircle2,
  XCircle,
  Terminal
} from 'lucide-react';

interface KeywordPlannerViewProps {
  onUseKeywordForReview: (keyword: string) => void;
}

const ERROR_TRANSLATIONS: Record<KeywordPlannerErrorCode, { title: string; friendlyMessage: string; hint: string }> = {
  'GOOGLE_ADS_NOT_CONFIGURED': {
    title: 'Integração Google Ads Não Configurada',
    friendlyMessage: 'Google Ads não configurado',
    hint: 'Adicione as variáveis GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_CUSTOMER_ID, GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET e GOOGLE_ADS_REFRESH_TOKEN no ambiente.'
  },
  'GOOGLE_ADS_AUTH_ERROR': {
    title: 'Falha de Autenticação OAuth',
    friendlyMessage: 'Falha de autenticação Google Ads',
    hint: 'Verifique se o GOOGLE_ADS_REFRESH_TOKEN, CLIENT_ID e CLIENT_SECRET são válidos e se o escopo https://www.googleapis.com/auth/adwords foi concedido.'
  },
  'GOOGLE_ADS_PERMISSION_ERROR': {
    title: 'Permissão Insuficiente',
    friendlyMessage: 'A conta autorizada não possui acesso à conta Google Ads.',
    hint: 'Verifique se o e-mail autenticado no OAuth possui permissão de leitura na conta Google Ads especificada.'
  },
  'GOOGLE_ADS_CUSTOMER_ERROR': {
    title: 'Customer ID Não Encontrado',
    friendlyMessage: 'A conta Google Ads configurada não foi encontrada.',
    hint: 'Verifique se o GOOGLE_ADS_CUSTOMER_ID possui 10 dígitos numéricos (sem hífens) e pertence a uma conta ativa do Google Ads.'
  },
  'GOOGLE_ADS_DEVELOPER_TOKEN_ERROR': {
    title: 'Developer Token Não Autorizado',
    friendlyMessage: 'O Developer Token do Google Ads não está autorizado para esta conta.',
    hint: 'Verifique o status do seu Developer Token no Google Ads API Center (Test Account vs Basic/Standard Access).'
  },
  'GOOGLE_ADS_API_ERROR': {
    title: 'Recusa da Google Ads API',
    friendlyMessage: 'Google Ads retornou um erro',
    hint: 'A requisição foi recusada pela API do Google Ads. Verifique os logs do servidor para inspecionar os detalhes retornados.'
  },
  'METHOD_NOT_ALLOWED': {
    title: 'Método Não Permitido',
    friendlyMessage: 'Erro de configuração da rota do servidor',
    hint: 'A rota de Palavras-chave só aceita requisições via POST. Verifique as configurações de rede ou servidor.'
  },
  'UNKNOWN_ERROR': {
    title: 'Erro na Consulta',
    friendlyMessage: 'Não foi possível consultar os dados. Consulte os logs do servidor para identificar a causa.',
    hint: 'Ocorreu uma falha inesperada durante o processamento da consulta.'
  }
};

export const KeywordPlannerView: React.FC<KeywordPlannerViewProps> = ({
  onUseKeywordForReview
}) => {
  // Search inputs
  const [keywordInput, setKeywordInput] = useState<string>('escova secadora');
  const [location, setLocation] = useState<string>('Brasil');
  const [language, setLanguage] = useState<string>('Português');
  const [includeIdeas, setIncludeIdeas] = useState<boolean>(true);

  // Request State
  const [status, setStatus] = useState<'default' | 'loading' | 'success' | 'empty' | 'error'>('default');
  const [responseMeta, setResponseMeta] = useState<KeywordPlannerResponse | null>(null);
  const [results, setResults] = useState<RealKeywordMetric[]>([]);
  
  // Detailed Error & Diagnostic State
  const [errorCode, setErrorCode] = useState<KeywordPlannerErrorCode | null>(null);
  const [errorStep, setErrorStep] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [errorRequestId, setErrorRequestId] = useState<string | null>(null);
  const [diagnostics, setDiagnostics] = useState<KeywordPlannerDiagnostics | null>(null);
  const [showDiagnosticsPanel, setShowDiagnosticsPanel] = useState<boolean>(false);
  const [diagnosticsLoading, setDiagnosticsLoading] = useState<boolean>(false);

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
    'escova secadora',
    'air fryer',
    'creatina 100 pura',
    'smartwatch',
    'fone bluetooth',
    'aspirador robo',
    'colageno tipo 2'
  ];

  const fetchDiagnostics = async () => {
    setDiagnosticsLoading(true);
    try {
      const data = await keywordService.fetchDiagnostics();
      if (data) {
        setDiagnostics(data);
      }
    } catch (e) {
      console.warn('[KeywordPlannerView] Erro ao consultar diagnósticos:', e);
    } finally {
      setDiagnosticsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
    // Auto-search on initial load so user immediately sees live metrics
    handleSearch('escova secadora');
  }, []);

  const handleSearch = async (overrideKeywords?: string) => {
    const rawKeywords = overrideKeywords !== undefined ? overrideKeywords : keywordInput;
    const cleanKw = rawKeywords.trim();

    if (!cleanKw) {
      setStatus('error');
      setErrorCode('UNKNOWN_ERROR');
      setErrorStep('0_input_validation');
      setErrorMessage('Informe ao menos uma palavra-chave para realizar a pesquisa.');
      setErrorDetails('O campo de busca não pode estar vazio.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    setErrorDetails(null);
    setErrorCode(null);
    setErrorStep(null);
    setErrorRequestId(null);
    setExpandedTrendKw(null);

    try {
      const data = await keywordService.fetchKeywords(cleanKw, location, language, includeIdeas);

      setResponseMeta(data);

      if (data.diagnostics) {
        setDiagnostics(data.diagnostics);
      }

      if (!data.success) {
        setStatus('error');
        const code = (data.code as KeywordPlannerErrorCode) || 'UNKNOWN_ERROR';
        setErrorCode(code);
        setErrorStep(data.step || null);
        setErrorRequestId(data.requestId || null);
        setErrorDetails(data.details || null);

        const translation = ERROR_TRANSLATIONS[code] || ERROR_TRANSLATIONS['UNKNOWN_ERROR'];
        setErrorMessage(data.message || translation.friendlyMessage);
        return;
      }

      if (!data.results || data.results.length === 0) {
        setResults([]);
        setStatus('empty');
      } else {
        setResults(data.results);
        setStatus('success');
      }
    } catch (err: any) {
      console.error('[KeywordPlannerView] Search network exception:', err);
      setStatus('error');
      setErrorCode('UNKNOWN_ERROR');
      setErrorStep('network_fetch');
      setErrorMessage('Não foi possível consultar os dados. Verifique a conexão com o servidor e tente novamente.');
      setErrorDetails(err.message || 'Erro de rede ao disparar requisição via keywordService');
      fetchDiagnostics();
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKw(text);
    setTimeout(() => setCopiedKw(null), 2000);
  };

  const handleExportCSV = () => {
    if (results.length === 0) return;

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
              Consulte dados reais de pesquisas mensais, índice de concorrência, histórico de buscas e estimativas de leilão do Google Ads para estruturar seus reviews sinceros.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setShowDiagnosticsPanel(!showDiagnosticsPanel);
                if (!diagnostics) fetchDiagnostics();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131B2A] hover:bg-[#1E293B] border border-[#24334A] text-xs font-semibold text-[#CBD5E1] hover:text-white transition-colors cursor-pointer"
            >
              <Server className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Status da Integração</span>
              <ChevronDown className={`w-3 h-3 text-[#777] transition-transform ${showDiagnosticsPanel ? 'rotate-180' : ''}`} />
            </button>

            {responseMeta && responseMeta.success && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131B2A] border border-[#24334A] text-xs">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                <span className="text-[#E2E8F0] font-medium">
                  {responseMeta.source === 'google_ads_api'
                    ? 'Google Ads API Conectada'
                    : 'Inteligência de Mercado & Busca Sincronizada'}
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

        {/* DIAGNOSTICS SLIDE-DOWN PANEL */}
        {showDiagnosticsPanel && (
          <div className="mt-6 pt-5 border-t border-[#1E293B] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                <KeyRound className="w-4 h-4 text-[#F5C542]" />
                <span>Diagnóstico das Variáveis de Ambiente (Google Ads API)</span>
              </div>
              <button
                type="button"
                onClick={fetchDiagnostics}
                disabled={diagnosticsLoading}
                className="flex items-center gap-1.5 text-xs text-[#38BDF8] hover:underline disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${diagnosticsLoading ? 'animate-spin' : ''}`} />
                <span>Atualizar status</span>
              </button>
            </div>

            <p className="text-xs text-[#94A3B8]">
              Por motivos de segurança, os valores das credenciais nunca são expostos. Apenas a presença das variáveis é verificada no servidor.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { 
                  name: 'GOOGLE_ADS_CLIENT_ID', 
                  label: 'Client ID (OAuth)', 
                  status: diagnostics?.googleAds.clientId, 
                  detail: diagnostics?.envDetails?.GOOGLE_ADS_CLIENT_ID,
                  required: true 
                },
                { 
                  name: 'GOOGLE_ADS_CLIENT_SECRET', 
                  label: 'Client Secret (OAuth)', 
                  status: diagnostics?.googleAds.clientSecret, 
                  detail: diagnostics?.envDetails?.GOOGLE_ADS_CLIENT_SECRET,
                  required: true 
                },
                { 
                  name: 'GOOGLE_ADS_REFRESH_TOKEN', 
                  label: 'Refresh Token (OAuth)', 
                  status: diagnostics?.googleAds.refreshToken, 
                  detail: diagnostics?.envDetails?.GOOGLE_ADS_REFRESH_TOKEN,
                  required: true 
                },
                { 
                  name: 'GOOGLE_ADS_DEVELOPER_TOKEN', 
                  label: 'Developer Token', 
                  status: diagnostics?.googleAds.developerToken, 
                  detail: diagnostics?.envDetails?.GOOGLE_ADS_DEVELOPER_TOKEN,
                  required: true 
                },
                { 
                  name: 'GOOGLE_ADS_CUSTOMER_ID', 
                  label: 'Customer ID (10 dígitos)', 
                  status: diagnostics?.googleAds.customerId, 
                  detail: diagnostics?.envDetails?.GOOGLE_ADS_CUSTOMER_ID,
                  required: true 
                },
                { 
                  name: 'GOOGLE_ADS_LOGIN_CUSTOMER_ID', 
                  label: 'Login Customer ID (MCC)', 
                  status: diagnostics?.googleAds.loginCustomerId, 
                  detail: diagnostics?.envDetails?.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
                  required: false 
                }
              ].map((item, idx) => {
                const isConfigured = item.status === 'configured';
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex flex-col justify-between gap-2 ${
                      isConfigured
                        ? 'bg-[#0E1A16] border-[#10B981]/30'
                        : item.required
                        ? 'bg-[#1F1212] border-[#EF4444]/30'
                        : 'bg-[#131B2A] border-[#24334A]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-mono font-bold text-white block">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-[#94A3B8] block">
                          {item.label} {!item.required && '(opcional)'}
                        </span>
                      </div>
                      <div>
                        {isConfigured ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40 shrink-0">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>CONFIGURADO</span>
                          </span>
                        ) : (
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                            item.required
                              ? 'bg-[#EF4444]/20 text-[#F87171] border border-[#EF4444]/40'
                              : 'bg-[#334155]/30 text-[#94A3B8] border border-[#475569]'
                          }`}>
                            <XCircle className="w-3 h-3" />
                            <span>{item.required ? 'AUSENTE' : 'NÃO CONFIGURADO'}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    {item.detail && item.detail.preview && (
                      <div className="pt-1.5 border-t border-white/5 text-[10px] flex items-center justify-between font-mono text-[#94A3B8]">
                        <span className="truncate max-w-[170px]">{item.detail.preview}</span>
                        {item.detail.formatValid ? (
                          <span className="text-[#34D399] text-[9px] font-sans font-semibold">Formato OK</span>
                        ) : (
                          <span className="text-[#F87171] text-[9px] font-sans font-semibold">Verificar</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
                placeholder="Ex: escova secadora, air fryer, creatina 100 pura"
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
              <span>Gerar ideias e termos relacionados (Google Ads API)</span>
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
                <span>Consultando Google Ads API...</span>
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
              Consulte métricas oficiais de volume de buscas mensais, histórico e índice de leilão diretamente da Google Ads API para a sua palavra-chave.
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
            <h3 className="text-base font-bold text-white">Consultando Google Ads API...</h3>
            <p className="text-xs text-[#94A3B8]">
              Executando chamada oficial na Google Ads API para <strong className="text-white">{keywordInput}</strong>...
            </p>
          </div>
        </div>
      )}

      {/* STATE: ERROR WITH DETAILED DIAGNOSTIC */}
      {status === 'error' && (
        <div className="bg-[#140A0A] border border-[#7F1D1D]/70 rounded-2xl p-6 md:p-8 space-y-5 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-[#EF4444] shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base md:text-lg font-bold text-white">
                    {errorCode && ERROR_TRANSLATIONS[errorCode]?.title
                      ? ERROR_TRANSLATIONS[errorCode].title
                      : 'Falha na Consulta do Google Ads'}
                  </h3>
                  {errorCode && (
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-red-950/80 border border-red-800/60 text-red-300">
                      {errorCode}
                    </span>
                  )}
                </div>
                <p className="text-xs md:text-sm text-[#FCA5A5] font-medium leading-relaxed">
                  {errorMessage || 'Não foi possível consultar os dados.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSearch()}
                className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Tentar Novamente</span>
              </button>
            </div>
          </div>

          {/* Granular Diagnostic Info */}
          <div className="bg-[#0A0505] border border-[#450A0A] rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#F87171] uppercase tracking-wider">
              <Terminal className="w-3.5 h-3.5" />
              <span>Detalhes Técnicos do Diagnóstico</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {errorStep && (
                <div className="bg-[#120707] p-2.5 rounded-lg border border-[#300E0E]">
                  <span className="text-[#999] text-[10px] uppercase block">Etapa da Operação:</span>
                  <span className="font-mono font-bold text-white">{errorStep}</span>
                </div>
              )}

              {errorRequestId && (
                <div className="bg-[#120707] p-2.5 rounded-lg border border-[#300E0E]">
                  <span className="text-[#999] text-[10px] uppercase block">Google Ads Request ID:</span>
                  <span className="font-mono text-white text-[11px] break-all">{errorRequestId}</span>
                </div>
              )}

              {errorDetails && (
                <div className="md:col-span-2 bg-[#120707] p-2.5 rounded-lg border border-[#300E0E]">
                  <span className="text-[#999] text-[10px] uppercase block">Mensagem do Servidor:</span>
                  <span className="text-[#FCA5A5] leading-relaxed">{errorDetails}</span>
                </div>
              )}
            </div>

            {errorCode && ERROR_TRANSLATIONS[errorCode]?.hint && (
              <div className="pt-2 text-xs text-[#E2E8F0] bg-blue-950/20 border border-blue-900/30 rounded-lg p-3">
                <strong className="text-[#60A5FA]">Recomendação: </strong>
                <span>{ERROR_TRANSLATIONS[errorCode].hint}</span>
              </div>
            )}
          </div>

          {/* Quick Environment Variables Check in Error Box */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold text-[#AAA] uppercase tracking-wider block">
              Status das Variáveis de Ambiente no Servidor:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {[
                { name: 'CLIENT_ID', val: diagnostics?.googleAds.clientId },
                { name: 'CLIENT_SECRET', val: diagnostics?.googleAds.clientSecret },
                { name: 'REFRESH_TOKEN', val: diagnostics?.googleAds.refreshToken },
                { name: 'DEVELOPER_TOKEN', val: diagnostics?.googleAds.developerToken },
                { name: 'CUSTOMER_ID', val: diagnostics?.googleAds.customerId }
              ].map((v, i) => {
                const isOk = v.val === 'configured';
                return (
                  <div
                    key={i}
                    className={`px-2.5 py-1.5 rounded-lg border text-[10px] flex items-center justify-between ${
                      isOk ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300' : 'bg-red-950/40 border-red-800/50 text-red-300'
                    }`}
                  >
                    <span className="font-mono font-bold">{v.name}</span>
                    <span className="font-bold">{isOk ? '✓ OK' : '✗ AUSENTE'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Guia de Ajuda - Variáveis de Ambiente do Google Ads */}
          {errorCode === 'GOOGLE_ADS_NOT_CONFIGURED' && (
            <div className="mt-4 border-t border-[#300E0E] pt-4 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <KeyRound className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>Guia de Configuração: Como Ativar o Planejador</span>
              </div>
              
              <p className="text-xs text-[#AAA] leading-relaxed">
                Para consultar volumes de busca e previsões reais do Google Ads, você precisa adicionar as seguintes variáveis de ambiente no painel de configurações (<strong>Settings</strong>) do seu projeto ou no arquivo <code className="font-mono text-amber-400 bg-amber-950/30 px-1 py-0.5 rounded text-[10px]">.env</code>:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#0D0707] border border-[#2D1414] rounded-xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#F87171]">GOOGLE_ADS_DEVELOPER_TOKEN</span>
                    <span className="text-[9px] text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-900/60 uppercase">Obrigatório</span>
                  </div>
                  <p className="text-[#94A3B8] text-[11px] leading-normal">
                    Token de desenvolvedor obtido na Central de APIs do console Google Ads.
                  </p>
                </div>

                <div className="bg-[#0D0707] border border-[#2D1414] rounded-xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#F87171]">CUSTOMER_ID</span>
                    <span className="text-[9px] text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-900/60 uppercase">Obrigatório</span>
                  </div>
                  <p className="text-[#94A3B8] text-[11px] leading-normal">
                    ID da sua conta de cliente do Google Ads (também aceita <code className="font-mono text-[10px] text-amber-300">GOOGLE_ADS_CUSTOMER_ID</code>). Deve conter exatamente 10 dígitos numéricos.
                  </p>
                </div>

                <div className="bg-[#0D0707] border border-[#2D1414] rounded-xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#F87171]">GOOGLE_ADS_CLIENT_ID</span>
                    <span className="text-[9px] text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-900/60 uppercase">Obrigatório</span>
                  </div>
                  <p className="text-[#94A3B8] text-[11px] leading-normal">
                    ID de cliente OAuth da console de nuvem do Google (Google Cloud Console).
                  </p>
                </div>

                <div className="bg-[#0D0707] border border-[#2D1414] rounded-xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#F87171]">GOOGLE_ADS_CLIENT_SECRET</span>
                    <span className="text-[9px] text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-900/60 uppercase">Obrigatório</span>
                  </div>
                  <p className="text-[#94A3B8] text-[11px] leading-normal">
                    Segredo de cliente OAuth correspondente gerado no Google Cloud Console.
                  </p>
                </div>

                <div className="bg-[#0D0707] border border-[#2D1414] rounded-xl p-3.5 space-y-1 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#F87171]">GOOGLE_ADS_REFRESH_TOKEN</span>
                    <span className="text-[9px] text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-900/60 uppercase">Obrigatório</span>
                  </div>
                  <p className="text-[#94A3B8] text-[11px] leading-normal">
                    Token de atualização de longa duração gerado após autorização da conta com escopo de publicidade do Google Ads.
                  </p>
                </div>
              </div>
            </div>
          )}
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
            A Google Ads API não retornou dados de volume para este termo específico. Tente termos com grafia alternativa ou mais abrangentes.
          </p>
        </div>
      )}

      {/* STATE: SUCCESS WITH RESULTS TABLE */}
      {status === 'success' && (
        <div className="space-y-4">
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
