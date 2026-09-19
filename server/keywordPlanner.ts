/**
 * Backend Service for Real Keyword Planning (Planejador de Palavras-chave)
 * Integrates with Google Ads API (generateKeywordHistoricalMetrics & generateKeywordIdeas)
 * and authentic search queries for real query discovery.
 * 
 * STRICT RULES:
 * - NO mock numbers or Gemini hallucinations for search volumes.
 * - NO artificial random numbers.
 * - Never leak developer tokens or client secrets to frontend.
 */

interface CacheEntry {
  timestamp: number;
  data: any;
}

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour cache
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

// Geo target mapping for Google Ads API
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

// Language mapping for Google Ads API
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

// Google OAuth Access Token Cache
let cachedAccessToken: { token: string; expiresAt: number } | null = null;

async function getGoogleAdsAccessToken(): Promise<string | null> {
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  // Check cached token
  if (cachedAccessToken && Date.now() < cachedAccessToken.expiresAt - 60000) {
    return cachedAccessToken.token;
  }

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[Google Ads OAuth] Failed to refresh token:', errText);
      return null;
    }

    const data = (await response.json()) as { access_token: string; expires_in: number };
    cachedAccessToken = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in || 3600) * 1000
    };

    return cachedAccessToken.token;
  } catch (err) {
    console.error('[Google Ads OAuth] Error refreshing token:', err);
    return null;
  }
}

/**
 * Fetch real autocomplete search query ideas from Google Search
 */
export async function fetchGoogleRealQuerySuggestions(
  query: string,
  lang: string = 'pt',
  country: string = 'br'
): Promise<string[]> {
  try {
    const langCode = lang.toLowerCase().includes('en') || lang.toLowerCase().includes('ingl') ? 'en' : 'pt-BR';
    const countryCode = country.toLowerCase().includes('us') || country.toLowerCase().includes('eua') ? 'us' : 'br';
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=${langCode}&gl=${countryCode}&q=${encodeURIComponent(query)}`;

    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data) && Array.isArray(data[1])) {
        return data[1]
          .map((s: any) => String(s).trim())
          .filter((s: string) => s.length > 0 && s.toLowerCase() !== query.toLowerCase());
      }
    }
  } catch (e) {
    console.warn('[Real Suggestions] Error fetching search query ideas:', e);
  }
  return [];
}

/**
 * Calls Google Ads API generateKeywordHistoricalMetrics
 */
async function callGoogleAdsHistoricalMetrics(
  customerId: string,
  developerToken: string,
  accessToken: string,
  loginCustomerId: string | undefined,
  keywords: string[],
  geoTarget: string,
  language: string
) {
  // Format customerId (must be digits only)
  const cleanCustomerId = customerId.replace(/-/g, '');
  const url = `https://googleads.googleapis.com/v18/customers/${cleanCustomerId}:generateKeywordHistoricalMetrics`;

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${accessToken}`,
    'developer-token': developerToken,
    'Content-Type': 'application/json'
  };

  if (loginCustomerId) {
    headers['login-customer-id'] = loginCustomerId.replace(/-/g, '');
  }

  const body = {
    keywords: keywords.slice(0, 20),
    geoTargetConstants: [geoTarget],
    keywordPlanNetwork: 'GOOGLE_SEARCH',
    language: language,
    includeAdultKeywords: false
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    const errorBody = await resp.text();
    console.error('[Google Ads API Error] generateKeywordHistoricalMetrics:', resp.status, errorBody);
    throw new Error(`Google Ads API error ${resp.status}: ${errorBody}`);
  }

  return await resp.json();
}

/**
 * Calls Google Ads API generateKeywordIdeas
 */
async function callGoogleAdsKeywordIdeas(
  customerId: string,
  developerToken: string,
  accessToken: string,
  loginCustomerId: string | undefined,
  seedKeywords: string[],
  geoTarget: string,
  language: string
) {
  const cleanCustomerId = customerId.replace(/-/g, '');
  const url = `https://googleads.googleapis.com/v18/customers/${cleanCustomerId}:generateKeywordIdeas`;

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${accessToken}`,
    'developer-token': developerToken,
    'Content-Type': 'application/json'
  };

  if (loginCustomerId) {
    headers['login-customer-id'] = loginCustomerId.replace(/-/g, '');
  }

  const body = {
    keywordSeed: {
      keywords: seedKeywords.slice(0, 10)
    },
    geoTargetConstants: [geoTarget],
    keywordPlanNetwork: 'GOOGLE_SEARCH',
    language: language,
    includeAdultKeywords: false
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    const errorBody = await resp.text();
    console.error('[Google Ads API Error] generateKeywordIdeas:', resp.status, errorBody);
    throw new Error(`Google Ads API error ${resp.status}: ${errorBody}`);
  }

  return await resp.json();
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
 * Main Controller Handler for Keyword Planning
 */
export async function handleKeywordPlannerRequest(reqBody: {
  keywords?: string | string[];
  location?: string;
  language?: string;
  includeIdeas?: boolean;
}) {
  const { location = 'Brasil', language = 'Português', includeIdeas = true } = reqBody;

  // 1. Parse and sanitize keywords
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
    throw new Error('Informe ao menos uma palavra-chave para realizar a pesquisa.');
  }

  if (keywordList.length > 20) {
    keywordList = keywordList.slice(0, 20);
  }

  // 2. Check Cache
  const cacheKey = `kw_${keywordList.slice().sort().join('|')}_${location.toLowerCase()}_${language.toLowerCase()}_${includeIdeas}`;
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return {
      ...cached.data,
      cached: true
    };
  }

  // 3. Resolve geo and language targets
  const locKey = location.toLowerCase().trim();
  const geoTarget = GEO_TARGET_MAP[locKey] || 'geoTargetConstants/2076';

  const langKey = language.toLowerCase().trim();
  const langTarget = LANGUAGE_TARGET_MAP[langKey] || 'languageConstants/1014';

  // 4. Check Google Ads API credentials
  const devToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID;
  const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID;

  const isConfigured = Boolean(devToken && customerId);

  let googleAccessToken: string | null = null;
  if (isConfigured) {
    googleAccessToken = await getGoogleAdsAccessToken();
  }

  const results: any[] = [];

  // Case A: Full Google Ads API available with credentials and valid OAuth token
  if (isConfigured && googleAccessToken && customerId && devToken) {
    try {
      // Fetch historical metrics for primary keywords
      const historicalData = await callGoogleAdsHistoricalMetrics(
        customerId,
        devToken,
        googleAccessToken,
        loginCustomerId,
        keywordList,
        geoTarget,
        langTarget
      );

      if (historicalData && Array.isArray(historicalData.results)) {
        for (const res of historicalData.results) {
          const metrics = res.keywordMetrics;
          const monthlyVolumes = metrics?.monthlySearchVolumes?.map((mv: any) => ({
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

      // Fetch related keyword ideas if requested
      if (includeIdeas && keywordList.length > 0) {
        try {
          const ideasData = await callGoogleAdsKeywordIdeas(
            customerId,
            devToken,
            googleAccessToken,
            loginCustomerId,
            keywordList.slice(0, 5),
            geoTarget,
            langTarget
          );

          if (ideasData && Array.isArray(ideasData.results)) {
            for (const res of ideasData.results) {
              const kwText = res.text || res.keyword;
              // Avoid duplicates
              if (results.some(r => r.keyword.toLowerCase() === kwText.toLowerCase())) continue;

              const metrics = res.keywordMetrics;
              const monthlyVolumes = metrics?.monthlySearchVolumes?.map((mv: any) => ({
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
        } catch (ideaErr) {
          console.warn('[Google Ads API Ideas] Optional ideas failed:', ideaErr);
        }
      }

      const responsePayload = {
        success: true,
        source: 'google_ads_api',
        isRealApiConfigured: true,
        queryKeywords: keywordList,
        location,
        language,
        results
      };

      searchCache.set(cacheKey, { timestamp: Date.now(), data: responsePayload });
      return responsePayload;
    } catch (apiErr: any) {
      console.error('[Google Ads API Execution Error]:', apiErr.message);
      // Fall through to real search suggestions discovery with explicit notification
    }
  }

  // Case B: Google Ads credentials not yet configured or pending activation.
  // We query Google's real search engine autocomplete suggestions to discover real queries that actual users search for.
  // We NEVER invent or hallucinate fake numbers for avgMonthlySearches or CPC.
  const discoveredTerms = new Set<string>();

  for (const kw of keywordList) {
    discoveredTerms.add(kw);
    if (includeIdeas) {
      const realIdeas = await fetchGoogleRealQuerySuggestions(kw, language, location);
      for (const idea of realIdeas) {
        discoveredTerms.add(idea);
      }
    }
  }

  const realList = Array.from(discoveredTerms);

  const realQueryResults = realList.map((term, index) => {
    const isOriginalSeed = keywordList.some(k => k.toLowerCase() === term.toLowerCase());
    return {
      keyword: term,
      // We do NOT fabricate numbers. Only real fields are populated.
      isIdea: !isOriginalSeed
    };
  });

  const responsePayload = {
    success: true,
    source: 'google_suggest_real',
    isRealApiConfigured: false,
    queryKeywords: keywordList,
    location,
    language,
    results: realQueryResults,
    message: isConfigured
      ? 'Credenciais do Google Ads não puderam autenticar na API. As palavras-chave reais foram extraídas via Google Search.'
      : 'Para carregar as métricas numéricas exatas de volume de impressões e lances de leilão do Google Ads, configure GOOGLE_ADS_DEVELOPER_TOKEN e GOOGLE_ADS_CUSTOMER_ID no ambiente. Todas as ideias e termos exibidos abaixo são consultas reais de pesquisa.'
  };

  searchCache.set(cacheKey, { timestamp: Date.now(), data: responsePayload });
  return responsePayload;
}
