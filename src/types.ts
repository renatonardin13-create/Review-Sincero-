export type CategoryType =
  | 'Tech'
  | 'Casa e cozinha'
  | 'Esporte'
  | 'Beleza e skincare'
  | 'Infantil e família'
  | 'Moda'
  | 'Suplementos e saúde'
  | 'Emagrecimento'
  | 'Cabelos e unhas'
  | 'Bem-estar e qualidade de vida'
  | 'Fitness e performance'
  | 'Masculino'
  | 'Outros';

export type PlatformType =
  | 'Logzz'
  | 'Monetizze'
  | 'Hotmart (produto físico)'
  | 'Hotmart'
  | 'Eduzz'
  | 'Braip'
  | 'Mercado Livre'
  | 'Shopee'
  | 'Amazon'
  | 'Outra plataforma';

export type TemplateType = 'clean' | 'premium' | 'conversion';

export interface TestimonialItem {
  id: string;
  name: string;
  text: string;
  photo?: string;
  rating: number;
  origin: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ScoreCriteria {
  quality: number; // 0-10
  design: number;
  practicality: number;
  resources: number;
  costBenefit: number;
  experience: number;
}

export interface MonthlySearchVolume {
  month: string;
  year: number;
  searches: number;
}

export interface RealKeywordMetric {
  keyword: string;
  avgMonthlySearches?: number;
  competition?: 'BAIXA' | 'MÉDIA' | 'ALTA' | 'DESCONHECIDA';
  competitionIndex?: number;
  monthlySearchVolumes?: MonthlySearchVolume[];
  lowTopPageBid?: number;
  highTopPageBid?: number;
  currency?: string;
  isIdea?: boolean;
}

export type KeywordPlannerErrorCode =
  | 'GOOGLE_ADS_NOT_CONFIGURED'
  | 'GOOGLE_ADS_AUTH_ERROR'
  | 'GOOGLE_ADS_PERMISSION_ERROR'
  | 'GOOGLE_ADS_CUSTOMER_ERROR'
  | 'GOOGLE_ADS_DEVELOPER_TOKEN_ERROR'
  | 'GOOGLE_ADS_API_ERROR'
  | 'METHOD_NOT_ALLOWED'
  | 'UNKNOWN_ERROR';

export interface EnvVarDiagnosticItem {
  configured: boolean;
  status: 'configured' | 'missing';
  length: number;
  preview: string;
  formatValid: boolean;
  formatNote?: string;
}

export interface KeywordPlannerDiagnostics {
  success?: boolean;
  timestamp?: string;
  allRequiredConfigured?: boolean;
  missingRequired?: string[];
  systemStatus?: string;
  googleAds: {
    clientId: 'configured' | 'missing';
    clientSecret: 'configured' | 'missing';
    refreshToken: 'configured' | 'missing';
    developerToken: 'configured' | 'missing';
    customerId: 'configured' | 'missing';
    loginCustomerId: 'configured' | 'missing';
  };
  envDetails?: {
    GOOGLE_ADS_CLIENT_ID: EnvVarDiagnosticItem;
    GOOGLE_ADS_CLIENT_SECRET: EnvVarDiagnosticItem;
    GOOGLE_ADS_REFRESH_TOKEN: EnvVarDiagnosticItem;
    GOOGLE_ADS_DEVELOPER_TOKEN: EnvVarDiagnosticItem;
    GOOGLE_ADS_CUSTOMER_ID: EnvVarDiagnosticItem;
    GOOGLE_ADS_LOGIN_CUSTOMER_ID?: EnvVarDiagnosticItem;
    GEMINI_API_KEY?: EnvVarDiagnosticItem;
  };
}

export interface KeywordPlannerResponse {
  success: boolean;
  ok?: boolean;
  code?: KeywordPlannerErrorCode;
  step?: string;
  source?: 'google_ads_api' | 'google_suggest_real' | 'cache' | 'gemini_ai_free';
  isRealApiConfigured?: boolean;
  queryKeywords?: string[];
  location?: string;
  language?: string;
  results?: RealKeywordMetric[];
  cached?: boolean;
  message?: string;
  details?: string;
  error?: string;
  requestId?: string;
  diagnostics?: KeywordPlannerDiagnostics;
}

export interface KeywordSuggestion {
  id: string;
  term: string;
  searches: string;
  cpc: string;
  difficulty: 'Alta' | 'Média' | 'Baixa';
  selected: boolean;
}

export interface KeywordPlannerData {
  mainKeyword: string;
  highIntentTerms: string[];
  suggestions: KeywordSuggestion[];
}

export interface SocialCommunityData {
  whatsappGroupUrl?: string;
  whatsappVipText?: string;
  instagramUrl?: string;
  telegramUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
}

export interface SeoSettingsData {
  metaTitle: string;
  metaDescription: string;
}

export interface UrgencySettingsData {
  enableTimer?: boolean;
  timerMinutes?: number;
  enableScarcityBar?: boolean;
  stockRemaining?: number;
  enableFakeAlerts?: boolean;
  urgencyMode?: 'none' | 'verified_offer' | 'verified_deadline' | 'verified_stock';
  verifiedSource?: string;
  expiresAt?: string;
}

export interface QuickVerdictData {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  idealFor: string[];
  notIdealFor: string[];
}

export interface ComparisonProductItem {
  id: string;
  name: string;
  price: string;
  score: number;
  batteryOrPower?: string;
  mainDiff?: string;
  highlight?: string;
}

export interface PriceHistoryItem {
  date: string;
  price: number;
  source: string;
}

export interface ReviewFactItem {
  id: string;
  text: string;
  verification: 'verified' | 'claimed' | 'editorial' | 'unverified';
  source?: string;
}

export interface Review {
  id: string;
  siteName: string;
  author: string;
  productName: string;
  headline?: string;
  ctaButtonText?: string;
  slug?: string;
  currentPrice: string;
  oldPrice: string;
  affiliateUrl: string;
  category: CategoryType | string;
  platform: PlatformType | string;
  customPlatform?: string;
  description: string;
  features: string[];
  mainImage: string;
  images: string[];
  testimonialImages?: string[];
  pros: string[];
  cons: string[];
  audience: string[];
  antiPersonaPhrase?: string;
  guaranteeDays?: number;
  verifiedReviewsCount?: number;
  experience: string;
  howItWorks: string;
  faq: FAQItem[];
  scoreCriteria: ScoreCriteria;
  overallScore: number;
  verdict: string;
  testimonials: TestimonialItem[];
  template: TemplateType;
  quickVerdict?: QuickVerdictData;
  comparisonProducts?: ComparisonProductItem[];
  priceHistory?: PriceHistoryItem[];
  facts?: ReviewFactItem[];
  transparencyNotice?: string;
  keywordPlanner?: KeywordPlannerData;
  socialCommunity?: SocialCommunityData;
  seoSettings?: SeoSettingsData;
  urgencySettings?: UrgencySettingsData;
  createdAt: string;
  updatedAt: string;
  status: 'Rascunho' | 'Publicado' | 'Arquivado';
  userId?: string;
}

export interface PromoBannerSlide {
  id: string;
  title: string;
  description: string;
  imageUrl: string; // Imagem principal Desktop (1200 x 300 px)
  desktopImageUrl?: string; // Imagem Desktop (1200 x 300 px)
  mobileImageUrl?: string; // Imagem Mobile / Tablet (600 x 300 px)
  affiliateUrl: string;
  ctaText: string;
  badgeText?: string;
  badgeColor?: 'gold' | 'red' | 'green' | 'blue' | 'purple';
  active: boolean;
  targetBlank?: boolean;
}

export interface ProductNotification {
  id: string;
  name: string;
  imageUrl: string;
  url: string;
  ctaText?: string;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface AppSettings {
  siteName: string;
  logoUrl: string;
  authorName: string;
  defaultTemplate: TemplateType;
  socialLinks: {
    instagram?: string;
    youtube?: string;
    twitter?: string;
    telegram?: string;
  };
  contactEmail: string;
  exportWithSeoTags: boolean;
  promoBanners?: PromoBannerSlide[];
  bannerAutoplaySpeed?: number; // em segundos (ex: 5)
  enableBannerCarousel?: boolean; // exibir carrossel no dashboard
  enableQuickLoginShortcuts?: boolean; // exibir atalhos de login rápido na tela de login
  productNotificationIntervalMinutes?: number; // 2, 5, 10, 15 (default 5)
  usageLimits?: {
    freeReviewLimit: number;
    premiumReviewLimit: number;
  };
  loginMedia?: {
    backgroundImageUrl?: string;
    youtubeVideoUrl?: string;
    youtubeEnabled?: boolean;
  };
}

export interface TrendBadge {
  label: string;
  type: 'hot' | 'ticket' | 'opportunity' | 'rising' | 'demand';
}

export interface LessonSupportMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'code' | 'prompt' | 'download';
  url?: string;
  content?: string;
}

export interface LessonItem {
  id: string;
  moduleId: string;
  title: string;
  duration: string;
  youtubeUrlOrId: string;
  youtubeId: string;
  description: string;
  keyTakeaways?: string[];
  materials?: LessonSupportMaterial[];
  promptTemplate?: string;
  order: number;
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  order: number;
  badge?: string;
}

export interface MemberAcademyData {
  modules: CourseModule[];
  lessons: LessonItem[];
  completedLessonIds: string[];
  userNotesByLesson: Record<string, string>;
  activeLessonId?: string;
}

export interface TrendItem {
  id: string;
  rank: number;
  title: string;
  searchTerm: string;
  searchQueryDisplay?: string;
  badges?: TrendBadge[];
  subtitleMetrics?: string;
  category: CategoryType | string;
  indicator: string;
  suggestedPrice: string;
  suggestedDescription: string;
  platform?: string;
  thumbnail?: string;
  realUrl?: string;
}

export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  provider: 'google' | 'email';
  createdAt: string;
  lastLoginAt: string;
}

export const ADMIN_EMAIL = 'renatonardin13@gmail.com';
