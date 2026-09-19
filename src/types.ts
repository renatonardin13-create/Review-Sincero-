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
  enableTimer: boolean;
  timerMinutes: number;
  enableScarcityBar: boolean;
  stockRemaining: number;
  enableFakeAlerts: boolean;
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
  keywordPlanner?: KeywordPlannerData;
  socialCommunity?: SocialCommunityData;
  seoSettings?: SeoSettingsData;
  urgencySettings?: UrgencySettingsData;
  createdAt: string;
  updatedAt: string;
  status: 'Rascunho' | 'Publicado' | 'Arquivado';
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
