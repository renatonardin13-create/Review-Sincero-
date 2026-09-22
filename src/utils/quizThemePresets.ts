import { QuizThemeConfig } from '../types';

export interface QuizNicheTheme {
  id: string;
  name: string;
  niche: string;
  categoryMatch: string[];
  description: string;
  badge: string;
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  cardBgColor: string;
  borderColor: string;
  textColor: string;
  accentColor: string;
  borderRadius: string;
}

export const QUIZ_NICHE_THEMES: QuizNicheTheme[] = [
  {
    id: 'beleza_skincare',
    name: 'Glow Rose Beauty',
    niche: 'Beleza & Skincare',
    categoryMatch: ['Beleza e skincare', 'Estética'],
    description: 'Design sofisticado e delicado com tons rosé e magenta ideal para dermocosméticos e skincare.',
    badge: '💄 Beleza & Skincare',
    primaryColor: '#E11D48',
    secondaryColor: '#FB7185',
    bgColor: '#170E12',
    cardBgColor: '#24141B',
    borderColor: '#3D1C2A',
    textColor: '#FFFFFF',
    accentColor: '#F43F5E',
    borderRadius: '20px'
  },
  {
    id: 'emagrecimento_saude',
    name: 'Emerald Health & Detox',
    niche: 'Emagrecimento & Saúde',
    categoryMatch: ['Emagrecimento', 'Suplementos e saúde', 'Bem-estar e qualidade de vida'],
    description: 'Design verde esmeralda focado em vida saudável, chá detox, encapsulados e perda de peso.',
    badge: '🌿 Emagrecimento & Saúde',
    primaryColor: '#059669',
    secondaryColor: '#10B981',
    bgColor: '#081C15',
    cardBgColor: '#112A21',
    borderColor: '#1B4D3E',
    textColor: '#FFFFFF',
    accentColor: '#34D399',
    borderRadius: '16px'
  },
  {
    id: 'fitness_suplementos',
    name: 'Volt High Performance',
    niche: 'Fitness & Suplementos',
    categoryMatch: ['Fitness e performance', 'Suplementos e saúde', 'Esporte'],
    description: 'Design escuro com amarelo volt vibrante de alta energia para creatina, whey e treinos.',
    badge: '⚡ Fitness & Treino',
    primaryColor: '#EAB308',
    secondaryColor: '#FACC15',
    bgColor: '#0F0F12',
    cardBgColor: '#1A1A22',
    borderColor: '#2A2A36',
    textColor: '#FFFFFF',
    accentColor: '#FDE047',
    borderRadius: '12px'
  },
  {
    id: 'tech_eletronicos',
    name: 'Cyber Cyan Tech',
    niche: 'Tech & Eletrônicos',
    categoryMatch: ['Tech', 'Gadgets', 'Eletrônicos'],
    description: 'Estilo futurista azul ciano e neon focado em gadgets, fones, smartwatches e tecnologia.',
    badge: '💻 Tech & Inovação',
    primaryColor: '#06B6D4',
    secondaryColor: '#38BDF8',
    bgColor: '#0A111E',
    cardBgColor: '#121E33',
    borderColor: '#1E3254',
    textColor: '#FFFFFF',
    accentColor: '#22D3EE',
    borderRadius: '14px'
  },
  {
    id: 'casa_cozinha',
    name: 'Warm Amber Cozy',
    niche: 'Casa & Cozinha',
    categoryMatch: ['Casa e cozinha', 'Eletrodomésticos'],
    description: 'Tons acolhedores terrosos e âmbar para Air Fryers, panelas, robôs aspiradores e lar.',
    badge: '🍳 Casa & Culinária',
    primaryColor: '#EA580C',
    secondaryColor: '#FB923C',
    bgColor: '#17110E',
    cardBgColor: '#261B16',
    borderColor: '#3D2A22',
    textColor: '#FFFFFF',
    accentColor: '#F97316',
    borderRadius: '18px'
  },
  {
    id: 'cabelos_unhas',
    name: 'Glam Magenta Hair',
    niche: 'Cabelos & Unhas',
    categoryMatch: ['Cabelos e unhas', 'Beleza e skincare'],
    description: 'Estilo vibrante em pink e violeta para escovas secadoras, tônicos capilares e unhas.',
    badge: '💇‍♀️ Cabelos & Unhas',
    primaryColor: '#EC4899',
    secondaryColor: '#F472B6',
    bgColor: '#1A0E18',
    cardBgColor: '#291426',
    borderColor: '#421E3E',
    textColor: '#FFFFFF',
    accentColor: '#F472B6',
    borderRadius: '18px'
  },
  {
    id: 'moda_acessorios',
    name: 'Luxury Bronze & Gold',
    niche: 'Moda & Acessórios',
    categoryMatch: ['Moda', 'Acessórios', 'Masculino'],
    description: 'Aparência premium de luxo com bronze e dourado focado em roupas, relógios e calçados.',
    badge: '💎 Moda & Estilo',
    primaryColor: '#D97706',
    secondaryColor: '#F59E0B',
    bgColor: '#141210',
    cardBgColor: '#211D1A',
    borderColor: '#38322B',
    textColor: '#FFFFFF',
    accentColor: '#FBBF24',
    borderRadius: '10px'
  },
  {
    id: 'infantil_familia',
    name: 'Playful Violet Kids',
    niche: 'Infantil & Família',
    categoryMatch: ['Infantil e família', 'Brinquedos'],
    description: 'Cores alegres e acolhedoras em violeta e roxo suave para brinquedos e bebês.',
    badge: '🧸 Infantil & Família',
    primaryColor: '#8B5CF6',
    secondaryColor: '#A78BFA',
    bgColor: '#141021',
    cardBgColor: '#201A33',
    borderColor: '#342B52',
    textColor: '#FFFFFF',
    accentColor: '#C084FC',
    borderRadius: '24px'
  },
  {
    id: 'masculino_barba',
    name: 'Titanium Steel Grooming',
    niche: 'Masculino & Barba',
    categoryMatch: ['Masculino', 'Tech', 'Esporte'],
    description: 'Estilo sóbrio azul titânio e aço escovado para aparadores, suplementos masculinos e barba.',
    badge: '🧔 Masculino & Grooming',
    primaryColor: '#64748B',
    secondaryColor: '#94A3B8',
    bgColor: '#0F172A',
    cardBgColor: '#1E293B',
    borderColor: '#334155',
    textColor: '#FFFFFF',
    accentColor: '#38BDF8',
    borderRadius: '10px'
  },
  {
    id: 'financas_renda',
    name: 'Golden Success Navy',
    niche: 'Finanças & Renda Extra',
    categoryMatch: ['Outros', 'Cursos'],
    description: 'Fundo azul marinho profundo com detalhes dourados para negócios e infoprodutos.',
    badge: '💰 Renda & Negócios',
    primaryColor: '#10B981',
    secondaryColor: '#F59E0B',
    bgColor: '#0A1512',
    cardBgColor: '#11241F',
    borderColor: '#1D3D35',
    textColor: '#FFFFFF',
    accentColor: '#F5C542',
    borderRadius: '12px'
  },
  {
    id: 'bem_estar_mente',
    name: 'Serene Teal Relax',
    niche: 'Bem-estar & Mente',
    categoryMatch: ['Bem-estar e qualidade de vida', 'Saúde'],
    description: 'Tons de azul turquesa sereno inspirados em meditação, sono reparador e calma.',
    badge: '🧘‍♂️ Bem-Estar & Mente',
    primaryColor: '#14B8A6',
    secondaryColor: '#2DD4BF',
    bgColor: '#0D1A18',
    cardBgColor: '#152B28',
    borderColor: '#22423D',
    textColor: '#FFFFFF',
    accentColor: '#5EEAD4',
    borderRadius: '18px'
  },
  {
    id: 'dark_gold_premium',
    name: 'Dark Gold Premium (Padrão)',
    niche: 'Geral / Alta Conversão',
    categoryMatch: ['Outros', 'Tech', 'Todos'],
    description: 'Tema clássico de alta conversão em fundo escuro com botões e detalhes em dourado.',
    badge: '✦ Dark Gold Oficial',
    primaryColor: '#F5C542',
    secondaryColor: '#FFD95A',
    bgColor: '#0D0D0D',
    cardBgColor: '#151515',
    borderColor: '#2A2A2A',
    textColor: '#FFFFFF',
    accentColor: '#F5C542',
    borderRadius: '16px'
  },
  {
    id: 'light_clean_cobalt',
    name: 'Light Clean Cobalt',
    niche: 'Geral / Clean Claro',
    categoryMatch: ['Outros', 'Todos'],
    description: 'Tema claro de altíssima legibilidade com fundo branco e destaques em azul cobalto.',
    badge: '☀️ Light Clean',
    primaryColor: '#2563EB',
    secondaryColor: '#3B82F6',
    bgColor: '#F8FAFC',
    cardBgColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    textColor: '#0F172A',
    accentColor: '#1D4ED8',
    borderRadius: '16px'
  }
];

/**
 * Returns the recommended theme preset based on product category
 */
export function getRecommendedThemeForCategory(category?: string): QuizNicheTheme {
  if (!category) return QUIZ_NICHE_THEMES.find(t => t.id === 'dark_gold_premium')!;

  const catLower = category.toLowerCase().trim();
  
  const found = QUIZ_NICHE_THEMES.find(t =>
    t.categoryMatch.some(m => catLower.includes(m.toLowerCase().trim()))
  );

  return found || QUIZ_NICHE_THEMES.find(t => t.id === 'dark_gold_premium')!;
}

/**
 * Converts QuizNicheTheme into a QuizThemeConfig object
 */
export function themePresetToConfig(preset: QuizNicheTheme): QuizThemeConfig {
  return {
    primaryColor: preset.primaryColor,
    secondaryColor: preset.secondaryColor,
    bgColor: preset.bgColor,
    cardBgColor: preset.cardBgColor,
    borderColor: preset.borderColor,
    textColor: preset.textColor,
    borderRadius: preset.borderRadius
  };
}
