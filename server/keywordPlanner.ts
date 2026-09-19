/**
 * Backend Service for Real Keyword Planning (Planejador de Palavras-chave)
 * Integrates directly with Google Ads API (generateKeywordHistoricalMetrics & generateKeywordIdeas)
 * 
 * STRICT AUDIT & COMPLIANCE RULES:
 * - NO mock numbers, random numbers, or Gemini hallucinations for search volumes.
 * - Granular 10-step exception diagnosis with exact error codes.
 * - NEVER log or return access tokens, refresh tokens, client secrets, developer tokens, or credentials.
 * - Return only CONFIGURED / MISSING status in diagnostic info.
 */

import { KeywordPlannerResponse, KeywordPlannerErrorCode, RealKeywordMetric, MonthlySearchVolume } from '../src/types';

interface CacheEntry {
  timestamp: number;
  data: KeywordPlannerResponse;
}

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache for successful queries
const searchCache = new Map<string, CacheEntry>();

// Rate limiter: Max 30 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60 * 1000 });
    return true;
  }

  if (entry.count >= 30) {
    return false;
  }

  entry.count += 1;
  return true;
}

// Geo target mapping for Google Ads API (Geo Target Constants)
export const GEO_TARGET_MAP: Record<string, string> = {
  'br': 'geoTargetConstants/2076',       // Brasil
  'brasil': 'geoTargetConstants/2076',
  'brazil': 'geoTargetConstants/2076',
  'pt': 'geoTargetConstants/2620',       // Portugal
  'portugal': 'geoTargetConstants/2620',
  'us': 'geoTargetConstants/2840',       // USA
  'estados unidos': 'geoTargetConstants/2840',
  'eua': 'geoTargetConstants/2840',
  'es': 'geoTargetConstants/2724',       // Spain
  'espanha': 'geoTargetConstants/2724',
  'uk': 'geoTargetConstants/2826',       // UK
  'reino unido': 'geoTargetConstants/2826',
  'ar': 'geoTargetConstants/2032',       // Argentina
  'argentina': 'geoTargetConstants/2032',
  'mx': 'geoTargetConstants/2484',       // Mexico
  'mexico': 'geoTargetConstants/2484'
};

// Language mapping for Google Ads API (Language Constants)
export const LANGUAGE_TARGET_MAP: Record<string, string> = {
  'pt': 'languageConstants/1014',        // Português
  'portugues': 'languageConstants/1014',
  'português': 'languageConstants/1014',
  'en': 'languageConstants/1000',        // English
  'ingles': 'languageConstants/1000',
  'inglês': 'languageConstants/1000',
  'es': 'languageConstants/1003',        // Spanish
  'espanhol': 'languageConstants/1003',
  'fr': 'languageConstants/1002',        // French
  'frances': 'languageConstants/1002',
  'de': 'languageConstants/1001',        // German
  'alemao': 'languageConstants/1001'
};

// Token cache in memory
let cachedAccessToken: { token: string; expiresAt: number } | null = null;

/**
 * Diagnostic helper: Returns only 'configured' or 'missing' status.
 * NEVER returns values, tokens, or credentials.
 */
export function getKeywordPlannerDiagnostics() {
  return {
    googleAds: {
      clientId: Boolean(process.env.GOOGLE_ADS_CLIENT_ID?.trim()) ? 'configured' as const : 'missing' as const,
      clientSecret: Boolean(process.env.GOOGLE_ADS_CLIENT_SECRET?.trim()) ? 'configured' as const : 'missing' as const,
      refreshToken: Boolean(process.env.GOOGLE_ADS_REFRESH_TOKEN?.trim()) ? 'configured' as const : 'missing' as const,
      developerToken: Boolean(process.env.GOOGLE_ADS_DEVELOPER_TOKEN?.trim()) ? 'configured' as const : 'missing' as const,
      customerId: Boolean(process.env.GOOGLE_ADS_CUSTOMER_ID?.trim()) ? 'configured' as const : 'missing' as const,
      loginCustomerId: Boolean(process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID?.trim()) ? 'configured' as const : 'missing' as const
    }
  };
}

/**
 * Safe structured logger for server diagnostics.
 * NEVER logs tokens, secrets, or credential values.
 */
function logServerDiagnostic(params: {
  step: string;
  httpStatus: number;
  errorCode?: string;
  message: string;
  requestId?: string;
}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    endpoint: 'POST /api/keyword-planner',
    step: params.step,
    httpStatus: params.httpStatus,
    googleAdsErrorCode: params.errorCode || 'NONE',
    message: params.message,
    requestId: params.requestId || 'N/A'
  };

  console.error(`[Google Ads Diagnostic Log]\n${JSON.stringify(logEntry, null, 2)}`);
}

function parseCompetition(rawComp?: string): 'BAIXA' | 'MÉDIA' | 'ALTA' | 'DESCONHECIDA' {
  if (!rawComp) return 'DESCONHECIDA';
  const c = rawComp.toUpperCase();
  if (c === 'LOW') return 'BAIXA';
  if (c === 'MEDIUM') return 'MÉDIA';
  if (c === 'HIGH') return 'ALTA';
  return 'DESCONHECIDA';
}

function parseMonthName(monthNum: number | string): string {
  const m = Number(monthNum);
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  if (m >= 1 && m <= 12) return months[m - 1];
  return String(monthNum);
}

/**
 * Main Controller Handler for Keyword Planning with 10-step diagnostic pipeline
 */
export async function handleKeywordPlannerRequest(reqBody: {
  keywords?: string | string[];
  location?: string;
  language?: string;
  includeIdeas?: boolean;
}): Promise<KeywordPlannerResponse> {
  const { location = 'Brasil', language = 'Português', includeIdeas = true } = reqBody;

  // =========================================================================
  // STEP 0: Parse & validate user keywords input
  // =========================================================================
  let keywordList: string[] = [];
  if (Array.isArray(reqBody.keywords)) {
    keywordList = reqBody.keywords
      .map(k => String(k).trim())
      .filter(k => k.length > 0 && k.length <= 100);
  } else if (typeof reqBody.keywords === 'string') {
    keywordList = reqBody.keywords
      .split(/[,\n]/)
      .map(k => k.trim())
      .filter(k => k.length > 0 && k.length <= 100);
  }

  if (keywordList.length === 0) {
    logServerDiagnostic({
      step: '0_input_validation',
      httpStatus: 400,
      errorCode: 'INVALID_INPUT',
      message: 'Nenhuma palavra-chave informada para a consulta.'
    });

    return {
      success: false,
      code: 'UNKNOWN_ERROR',
      step: '0_input_validation',
      message: 'Informe ao menos uma palavra-chave válida para consulta.',
      details: 'O parâmetro keywords está vazio ou não contém termos válidos.',
      diagnostics: getKeywordPlannerDiagnostics()
    };
  }

  if (keywordList.length > 20) {
    keywordList = keywordList.slice(0, 20);
  }

  // Check cache for identical query
  const cacheKey = `kw_${keywordList.slice().sort().join('|')}_${location.toLowerCase()}_${language.toLowerCase()}_${includeIdeas}`;
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return {
      ...cached.data,
      cached: true
    };
  }

  // Resolve Geo & Language constants
  const locKey = location.toLowerCase().trim();
  const geoTarget = GEO_TARGET_MAP[locKey] || 'geoTargetConstants/2076';

  const langKey = language.toLowerCase().trim();
  const langTarget = LANGUAGE_TARGET_MAP[langKey] || 'languageConstants/1014';

  // =========================================================================
  // STEP 1: Reading environment variables
  // =========================================================================
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET?.trim();
  const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN?.trim();
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN?.trim();
  const rawCustomerId = process.env.GOOGLE_ADS_CUSTOMER_ID?.trim();
  const rawLoginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID?.trim();

  const missingEnvVars: string[] = [];
  if (!clientId) missingEnvVars.push('GOOGLE_ADS_CLIENT_ID');
  if (!clientSecret) missingEnvVars.push('GOOGLE_ADS_CLIENT_SECRET');
  if (!refreshToken) missingEnvVars.push('GOOGLE_ADS_REFRESH_TOKEN');
  if (!developerToken) missingEnvVars.push('GOOGLE_ADS_DEVELOPER_TOKEN');
  if (!rawCustomerId) missingEnvVars.push('GOOGLE_ADS_CUSTOMER_ID');

  if (missingEnvVars.length > 0) {
    logServerDiagnostic({
      step: '1_env_vars_check',
      httpStatus: 500,
      errorCode: 'ENV_VARS_MISSING',
      message: `Variáveis de ambiente do Google Ads não configuradas no servidor: ${missingEnvVars.join(', ')}`
    });

    return {
      success: false,
      code: 'GOOGLE_ADS_NOT_CONFIGURED',
      step: '1_env_vars_check',
      message: 'Google Ads ainda não está configurado no servidor.',
      details: `Variáveis ausentes no servidor: ${missingEnvVars.join(', ')}. Configure-as no arquivo de ambiente (.env).`,
      diagnostics: getKeywordPlannerDiagnostics()
    };
  }

  // =========================================================================
  // STEP 2: Customer ID validation (10 digits without hyphens)
  // =========================================================================
  const cleanCustomerId = (rawCustomerId || '').replace(/\D/g, '');
  if (cleanCustomerId.length !== 10) {
    logServerDiagnostic({
      step: '2_customer_id_validation',
      httpStatus: 400,
      errorCode: 'INVALID_CUSTOMER_ID_FORMAT',
      message: `GOOGLE_ADS_CUSTOMER_ID possui formato inválido. Deve conter 10 dígitos numéricos (recebido: ${cleanCustomerId.length} dígitos).`
    });

    return {
      success: false,
      code: 'GOOGLE_ADS_CUSTOMER_ERROR',
      step: '2_customer_id_validation',
      message: 'A conta Google Ads configurada não foi encontrada.',
      details: `O GOOGLE_ADS_CUSTOMER_ID deve conter exatamente 10 dígitos numéricos (recebido: ${cleanCustomerId.length} dígitos). Remova caracteres especiais e verifique o ID da conta.`,
      diagnostics: getKeywordPlannerDiagnostics()
    };
  }

  // =========================================================================
  // STEP 3: Login Customer ID sanitation (if configured for manager account)
  // =========================================================================
  let cleanLoginCustomerId: string | undefined = undefined;
  if (rawLoginCustomerId) {
    const sanitized = rawLoginCustomerId.replace(/\D/g, '');
    if (sanitized.length === 10) {
      cleanLoginCustomerId = sanitized;
    } else {
      logServerDiagnostic({
        step: '3_login_customer_id_validation',
        httpStatus: 400,
        errorCode: 'INVALID_LOGIN_CUSTOMER_ID',
        message: `GOOGLE_ADS_LOGIN_CUSTOMER_ID possui formato inválido (${sanitized.length} dígitos em vez de 10). Ignorando header.`
      });
    }
  }

  // =========================================================================
  // STEP 4: OAuth authentication & token refresh
  // =========================================================================
  let accessToken = '';
  if (cachedAccessToken && Date.now() < cachedAccessToken.expiresAt - 60000) {
    accessToken = cachedAccessToken.token;
  } else {
    try {
      const oauthResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: clientId!,
          client_secret: clientSecret!,
          refresh_token: refreshToken!
        })
      });

      const oauthData = await oauthResponse.json().catch(() => ({}));

      if (!oauthResponse.ok) {
        const oauthErrCode = oauthData?.error || `HTTP_${oauthResponse.status}`;
        const oauthErrDesc = oauthData?.error_description || 'Falha ao autenticar via OAuth com o Google.';

        logServerDiagnostic({
          step: '4_oauth_token_refresh',
          httpStatus: oauthResponse.status,
          errorCode: oauthErrCode,
          message: `Erro na autenticação OAuth do Google Ads: ${oauthErrDesc}`
        });

        return {
          success: false,
          code: 'GOOGLE_ADS_AUTH_ERROR',
          step: '4_oauth_token_refresh',
          message: 'Não foi possível autenticar com o Google Ads.',
          details: `Falha OAuth (${oauthErrCode}): ${oauthErrDesc}. Verifique GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET e GOOGLE_ADS_REFRESH_TOKEN.`,
          diagnostics: getKeywordPlannerDiagnostics()
        };
      }

      // =======================================================================
      // STEP 5: Access token extraction & verification
      // =======================================================================
      if (!oauthData?.access_token) {
        logServerDiagnostic({
          step: '5_access_token_validation',
          httpStatus: 500,
          errorCode: 'NO_ACCESS_TOKEN_RETURNED',
          message: 'OAuth endpoint retornou resposta OK, mas sem access_token.'
        });

        return {
          success: false,
          code: 'GOOGLE_ADS_AUTH_ERROR',
          step: '5_access_token_validation',
          message: 'Não foi possível autenticar com o Google Ads.',
          details: 'O provedor OAuth não retornou um access_token válido.',
          diagnostics: getKeywordPlannerDiagnostics()
        };
      }

      accessToken = oauthData.access_token;
      cachedAccessToken = {
        token: accessToken,
        expiresAt: Date.now() + (Number(oauthData.expires_in) || 3600) * 1000
      };
    } catch (networkErr: any) {
      logServerDiagnostic({
        step: '4_oauth_token_refresh',
        httpStatus: 503,
        errorCode: 'OAUTH_NETWORK_ERROR',
        message: `Falha de rede ao conectar no endpoint OAuth do Google: ${networkErr.message}`
      });

      return {
        success: false,
        code: 'GOOGLE_ADS_AUTH_ERROR',
        step: '4_oauth_token_refresh',
        message: 'Não foi possível autenticar com o Google Ads.',
        details: `Erro de rede no OAuth: ${networkErr.message}`,
        diagnostics: getKeywordPlannerDiagnostics()
      };
    }
  }

  // =========================================================================
  // STEP 6: Connection & Request Setup to Google Ads API
  // =========================================================================
  const googleAdsHeaders: Record<string, string> = {
    'Authorization': `Bearer ${accessToken}`,
    'developer-token': developerToken!,
    'Content-Type': 'application/json'
  };

  if (cleanLoginCustomerId) {
    googleAdsHeaders['login-customer-id'] = cleanLoginCustomerId;
  }

  const results: RealKeywordMetric[] = [];
  let googleAdsRequestId = '';

  // =========================================================================
  // STEP 7 & 8: Account authorization & GenerateKeywordHistoricalMetrics
  // =========================================================================
  try {
    const historicalUrl = `https://googleads.googleapis.com/v18/customers/${cleanCustomerId}:generateKeywordHistoricalMetrics`;
    const historicalBody = {
      keywords: keywordList.slice(0, 20),
      geoTargetConstants: [geoTarget],
      keywordPlanNetwork: 'GOOGLE_SEARCH',
      language: langTarget,
      includeAdultKeywords: false
    };

    const historicalResp = await fetch(historicalUrl, {
      method: 'POST',
      headers: googleAdsHeaders,
      body: JSON.stringify(historicalBody)
    });

    googleAdsRequestId = historicalResp.headers.get('google-ads-request-id') || '';

    if (!historicalResp.ok) {
      const errJson = await historicalResp.json().catch(() => ({}));
      const googleAdsErrors = errJson?.error?.details?.[0]?.errors || [];
      const primaryError = googleAdsErrors[0] || {};
      const errorCategory = Object.keys(primaryError.errorCode || {})[0] || '';
      const specificErrorCode = primaryError.errorCode?.[errorCategory] || errJson?.error?.status || `HTTP_${historicalResp.status}`;
      const errorMessage = primaryError.message || errJson?.error?.message || `Google Ads API retornou status ${historicalResp.status}`;
      
      if (!googleAdsRequestId) {
        googleAdsRequestId = errJson?.error?.details?.[0]?.requestId || '';
      }

      // Map to exact functional error code
      let appErrorCode: KeywordPlannerErrorCode = 'GOOGLE_ADS_API_ERROR';
      let userFriendlyMessage = 'A Google Ads API recusou a consulta.';
      let failureStep = '8_generate_keyword_historical_metrics';

      const upperCode = String(specificErrorCode).toUpperCase();
      const upperMsg = String(errorMessage).toUpperCase();

      if (upperCode.includes('DEVELOPER_TOKEN') || upperMsg.includes('DEVELOPER TOKEN') || upperMsg.includes('DEVELOPER_TOKEN')) {
        appErrorCode = 'GOOGLE_ADS_DEVELOPER_TOKEN_ERROR';
        userFriendlyMessage = 'O Developer Token do Google Ads não está autorizado para esta conta.';
        failureStep = '6_developer_token_validation';
      } else if (
        upperCode.includes('PERMISSION_DENIED') ||
        upperCode.includes('USER_PERMISSION_DENIED') ||
        upperCode.includes('NOT_ADS_USER') ||
        upperCode.includes('AUTHORIZATION_ERROR') ||
        upperMsg.includes('PERMISSION') ||
        upperMsg.includes('NOT AUTHORIZED')
      ) {
        appErrorCode = 'GOOGLE_ADS_PERMISSION_ERROR';
        userFriendlyMessage = 'A conta autorizada não possui acesso à conta Google Ads.';
        failureStep = '7_account_authorization';
      } else if (
        upperCode.includes('CUSTOMER_NOT_FOUND') ||
        upperCode.includes('INVALID_CUSTOMER_ID') ||
        upperCode.includes('CUSTOMER_NOT_ENABLED') ||
        upperMsg.includes('CUSTOMER')
      ) {
        appErrorCode = 'GOOGLE_ADS_CUSTOMER_ERROR';
        userFriendlyMessage = 'A conta Google Ads configurada não foi encontrada.';
        failureStep = '7_account_authorization';
      } else if (
        upperCode.includes('AUTHENTICATION_ERROR') ||
        upperCode.includes('UNAUTHENTICATED') ||
        upperCode.includes('OAUTH_TOKEN')
      ) {
        appErrorCode = 'GOOGLE_ADS_AUTH_ERROR';
        userFriendlyMessage = 'Não foi possível autenticar com o Google Ads.';
        failureStep = '4_oauth_token_refresh';
      }

      logServerDiagnostic({
        step: failureStep,
        httpStatus: historicalResp.status,
        errorCode: specificErrorCode,
        message: errorMessage,
        requestId: googleAdsRequestId
      });

      return {
        success: false,
        code: appErrorCode,
        step: failureStep,
        message: userFriendlyMessage,
        details: `[${specificErrorCode}] ${errorMessage}`,
        requestId: googleAdsRequestId || undefined,
        diagnostics: getKeywordPlannerDiagnostics()
      };
    }

    const historicalData = await historicalResp.json();

    // =======================================================================
    // STEP 9: Optional GenerateKeywordIdeas
    // =======================================================================
    if (historicalData && Array.isArray(historicalData.results)) {
      for (const res of historicalData.results) {
        const metrics = res.keywordMetrics;
        const monthlyVolumes: MonthlySearchVolume[] = metrics?.monthlySearchVolumes?.map((mv: any) => ({
          month: parseMonthName(mv.month),
          year: Number(mv.year),
          searches: Number(mv.monthlySearches || 0)
        })) || [];

        results.push({
          keyword: res.text || res.keyword,
          avgMonthlySearches: metrics?.avgMonthlySearches ? Number(metrics.avgMonthlySearches) : undefined,
          competition: parseCompetition(metrics?.competition),
          competitionIndex: metrics?.competitionIndex !== undefined ? Number(metrics.competitionIndex) : undefined,
          monthlySearchVolumes: monthlyVolumes.length > 0 ? monthlyVolumes : undefined,
          lowTopPageBid: metrics?.lowTopOfPageBidMicros ? Number(metrics.lowTopOfPageBidMicros) / 1000000 : undefined,
          highTopPageBid: metrics?.highTopOfPageBidMicros ? Number(metrics.highTopOfPageBidMicros) / 1000000 : undefined,
          currency: 'BRL',
          isIdea: false
        });
      }
    }

    if (includeIdeas && keywordList.length > 0) {
      try {
        const ideasUrl = `https://googleads.googleapis.com/v18/customers/${cleanCustomerId}:generateKeywordIdeas`;
        const ideasBody = {
          keywordSeed: {
            keywords: keywordList.slice(0, 5)
          },
          geoTargetConstants: [geoTarget],
          keywordPlanNetwork: 'GOOGLE_SEARCH',
          language: langTarget,
          includeAdultKeywords: false
        };

        const ideasResp = await fetch(ideasUrl, {
          method: 'POST',
          headers: googleAdsHeaders,
          body: JSON.stringify(ideasBody)
        });

        if (ideasResp.ok) {
          const ideasData = await ideasResp.json();
          if (ideasData && Array.isArray(ideasData.results)) {
            for (const res of ideasData.results) {
              const kwText = res.text || res.keyword;
              if (!kwText || results.some(r => r.keyword.toLowerCase() === kwText.toLowerCase())) continue;

              const metrics = res.keywordMetrics;
              const monthlyVolumes: MonthlySearchVolume[] = metrics?.monthlySearchVolumes?.map((mv: any) => ({
                month: parseMonthName(mv.month),
                year: Number(mv.year),
                searches: Number(mv.monthlySearches || 0)
              })) || [];

              results.push({
                keyword: kwText,
                avgMonthlySearches: metrics?.avgMonthlySearches ? Number(metrics.avgMonthlySearches) : undefined,
                competition: parseCompetition(metrics?.competition),
                competitionIndex: metrics?.competitionIndex !== undefined ? Number(metrics.competitionIndex) : undefined,
                monthlySearchVolumes: monthlyVolumes.length > 0 ? monthlyVolumes : undefined,
                lowTopPageBid: metrics?.lowTopOfPageBidMicros ? Number(metrics.lowTopOfPageBidMicros) / 1000000 : undefined,
                highTopPageBid: metrics?.highTopOfPageBidMicros ? Number(metrics.highTopOfPageBidMicros) / 1000000 : undefined,
                currency: 'BRL',
                isIdea: true
              });
            }
          }
        } else {
          const ideasErrJson = await ideasResp.json().catch(() => ({}));
          logServerDiagnostic({
            step: '9_generate_keyword_ideas',
            httpStatus: ideasResp.status,
            errorCode: ideasErrJson?.error?.status || `HTTP_${ideasResp.status}`,
            message: `Optional generateKeywordIdeas failed: ${ideasErrJson?.error?.message || ideasResp.statusText}`,
            requestId: ideasResp.headers.get('google-ads-request-id') || ''
          });
        }
      } catch (ideaErr: any) {
        logServerDiagnostic({
          step: '9_generate_keyword_ideas',
          httpStatus: 500,
          errorCode: 'IDEAS_EXCEPTION',
          message: `Exceção em generateKeywordIdeas: ${ideaErr.message}`
        });
      }
    }

    // =======================================================================
    // STEP 10: Response Normalization & Delivery
    // =======================================================================
    const responsePayload: KeywordPlannerResponse = {
      success: true,
      source: 'google_ads_api',
      isRealApiConfigured: true,
      queryKeywords: keywordList,
      location,
      language,
      results,
      requestId: googleAdsRequestId || undefined,
      diagnostics: getKeywordPlannerDiagnostics()
    };

    searchCache.set(cacheKey, { timestamp: Date.now(), data: responsePayload });
    return responsePayload;

  } catch (apiException: any) {
    logServerDiagnostic({
      step: '8_generate_keyword_historical_metrics',
      httpStatus: 500,
      errorCode: 'API_CONNECTION_EXCEPTION',
      message: `Exceção ao comunicar com a Google Ads API: ${apiException.message}`,
      requestId: googleAdsRequestId
    });

    return {
      success: false,
      code: 'GOOGLE_ADS_API_ERROR',
      step: '8_generate_keyword_historical_metrics',
      message: 'A Google Ads API recusou a consulta.',
      details: `Falha de conexão com a API do Google Ads: ${apiException.message}`,
      requestId: googleAdsRequestId || undefined,
      diagnostics: getKeywordPlannerDiagnostics()
    };
  }
}
