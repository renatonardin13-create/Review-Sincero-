import { KeywordPlannerResponse, RealKeywordMetric, KeywordSuggestion } from '../types';

/**
 * Centered Business Service for Keyword Planning & Synchronization
 * Used by both KeywordPlannerView and CreateReviewWizard to ensure a single source of truth.
 */
export const keywordService = {
  /**
   * Performs real keyword discovery via the Express backend proxying Google Ads API.
   * If the Google Ads API is not configured on the server, it reports the exact error code
   * without masking it, allowing the frontend to degrade gracefully.
   */
  async fetchKeywords(
    keywords: string,
    location: string = 'Brasil',
    language: string = 'Português',
    includeIdeas: boolean = true,
    useFreeAiMode: boolean = false
  ): Promise<KeywordPlannerResponse> {
    try {
      const response = await fetch('/api/keyword-planner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          keywords,
          location,
          language,
          includeIdeas,
          useFreeAiMode
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          code: errorData.code || 'UNKNOWN_ERROR',
          step: errorData.step || 'server_api_route',
          message: errorData.message || 'Erro de rede ao consultar o servidor.',
          details: errorData.details || `Código de status HTTP: ${response.status}`,
          diagnostics: errorData.diagnostics
        };
      }

      const data: KeywordPlannerResponse = await response.json();
      return data;
    } catch (err: any) {
      return {
        success: false,
        code: 'UNKNOWN_ERROR',
        step: 'network_fetch',
        message: 'Não foi possível conectar ao servidor de palavras-chave.',
        details: err.message || 'Exceção inesperada de rede no frontend.'
      };
    }
  },

  /**
   * Fetches server configuration and diagnostics for Google Ads
   */
  async fetchDiagnostics(): Promise<any> {
    try {
      const response = await fetch('/api/keyword-planner/diagnostics');
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (e) {
      console.warn('[keywordService] Erro ao buscar diagnósticos:', e);
      return null;
    }
  },

  /**
   * Helper utility to format a raw RealKeywordMetric list into a UI-ready KeywordSuggestion format.
   * Ensures that we explicitly flag whether the data is from real Google Ads or estimated fallback.
   */
  formatToSuggestions(
    metrics: RealKeywordMetric[],
    isRealConfigured: boolean
  ): KeywordSuggestion[] {
    const isRealSuffix = isRealConfigured ? '' : ' (Estimado)';
    return metrics.map((item, index) => {
      const searchesStr = item.avgMonthlySearches !== undefined
        ? `${item.avgMonthlySearches.toLocaleString('pt-BR')} buscas/mês${isRealSuffix}`
        : 'N/A';
      
      const cpcStr = item.lowTopPageBid !== undefined && item.highTopPageBid !== undefined
        ? `CPC ${isRealConfigured ? 'Real' : 'Est.'}: R$ ${item.lowTopPageBid.toFixed(2)} - R$ ${item.highTopPageBid.toFixed(2)}`
        : 'CPC N/A';

      const difficultyMap: Record<string, 'Alta' | 'Média' | 'Baixa'> = {
        'ALTA': 'Alta',
        'MÉDIA': 'Média',
        'BAIXA': 'Baixa',
        'DESCONHECIDA': 'Baixa'
      };

      return {
        id: `k-service-${Date.now()}-${index}`,
        term: item.keyword,
        searches: searchesStr,
        cpc: cpcStr,
        difficulty: difficultyMap[item.competition || 'MÉDIA'] || 'Média',
        selected: index < 3 // auto-select top 3 by default
      };
    });
  }
};
