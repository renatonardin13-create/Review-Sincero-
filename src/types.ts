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

export type QuizTemplateId = 'classic' | 'diagnostic';

export type QuizQuestionType =
  | 'single-select'
  | 'multi-select'
  | 'slider'
  | 'weight'
  | 'height'
  | 'number'
  | 'text';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[]; // Flexible options array (4 for classic, variable for diagnostic)
  correctAnswerIndex: number; // 0, 1, 2, 3
  explanation: string;
  type?: QuizQuestionType;
  description?: string;
  optionScores?: number[];
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
  sliderUnit?: string;
  sliderInitial?: number;
  required?: boolean;
}

export type QuizDifficulty = 'Fácil' | 'Médio' | 'Difícil' | 'Misto';

export interface QuizResultProfile {
  id: string;
  title: string;
  description: string;
  minScore: number;
  maxScore: number;
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export interface QuizLeadCaptureConfig {
  enabled: boolean;
  title?: string;
  subtitle?: string;
  fields: {
    name?: boolean;
    email?: boolean;
    phone?: boolean;
  };
  buttonText?: string;
}

export interface QuizOfferConfig {
  title?: string;
  subtitle?: string;
  productName?: string;
  oldPrice?: string;
  currentPrice?: string;
  benefits?: string[];
  guaranteeDays?: number;
  ctaText?: string;
  ctaUrl?: string;
  timerEnabled?: boolean;
  timerMinutes?: number;
}

export interface QuizThemeConfig {
  primaryColor?: string;
  secondaryColor?: string;
  bgColor?: string;
  cardBgColor?: string;
  borderColor?: string;
  textColor?: string;
  borderRadius?: string;
  contentMaxWidth?: string;
}

export interface QuizConfig {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  difficulty: QuizDifficulty;
  type: string;
  ctaText: string;
  ctaUrl: string;
  resultMessage?: string;
  questions: QuizQuestion[];
  selectedTemplate?: QuizTemplateId;
  introImage?: string;
  introTitle?: string;
  introSubtitle?: string;
  introCtaText?: string;
  processingEnabled?: boolean;
  processingTimeMs?: number;
  processingMessages?: string[];
  resultProfiles?: QuizResultProfile[];
  leadCapture?: QuizLeadCaptureConfig;
  offerConfig?: QuizOfferConfig;
  theme?: QuizThemeConfig;
  testimonials?: TestimonialItem[];
  faq?: FAQItem[];
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
  quizConfig?: QuizConfig;
  createdAt: string;
  updatedAt: string;
  status: 'Rascunho' | 'Publicado' | 'Arquivado';
  userId?: string;
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
  authorAvatarUrl?: string;
  authorBio?: string;
  defaultTemplate: TemplateType;
  socialLinks: {
    instagram?: string;
    youtube?: string;
    twitter?: string;
    telegram?: string;
  };
  contactEmail: string;
  exportWithSeoTags: boolean;
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
export type UserStatus = 'active' | 'blocked';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  provider: 'google' | 'email';
  createdAt: string;
  lastLoginAt: string;
}

export interface SystemUpdate {
  id: string;
  title: string;
  message: string;
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  version: string;
  published: boolean;
  createdAt: string;
  publishedAt?: string;
  createdBy: string;
}

export interface NotificationRead {
  readAt: string;
}

export interface AcademyModule {
  id: string;
  title: string;
  description?: string;
  order: number;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface AcademyLesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  videoUrl: string; // YouTube, Vimeo, etc.
  thumbnailUrl?: string;
  duration?: string; // ex: "15 min"
  order: number;
  status: 'published' | 'draft';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export type NotificationType = 'lesson' | 'module' | 'update' | 'general';

export interface SystemNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  targetView?: string;
  targetId?: string;
  ctaText?: string;
  published: boolean;
  createdAt: string;
  createdBy?: string;
}

export const APP_VERSION = '2.5.0';
export const ADMIN_EMAIL = 'renatonardin13@gmail.com';
