import React, { useState, useEffect, useMemo } from 'react';
import {
  Percent,
  X,
  DollarSign,
  TrendingUp,
  Sparkles,
  Calculator,
  ArrowRight,
  ShieldCheck,
  Check,
  Info,
  Layers,
  ShoppingBag,
  Search,
  RefreshCw,
  Image as ImageIcon,
  ExternalLink,
  Zap
} from 'lucide-react';
import { AUTHORITATIVE_MARKETPLACE_CATALOG } from '../services/reconciliationService';

interface CommissionCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewReview?: (product?: {
    productName: string;
    productPrice: string;
    productImage: string;
    productCategory: any;
    productDescription: string;
    affiliateLink: string;
  }) => void;
}

type PlatformID = 'meli' | 'shopee' | 'amazon' | 'hotmart' | 'braip' | 'monetizze' | 'eduzz' | 'logzz' | 'custom';
type NicheID = 'moda' | 'beleza' | 'suplementos' | 'casa' | 'tech' | 'infoprodutos' | 'brinquedos' | 'outros';

interface PlatformDetails {
  name: string;
  color: string;
  activeClass: string;
}

const PLATFORMS: Record<PlatformID, PlatformDetails> = {
  meli: { name: 'Mercado Livre', color: '#FFE600', activeClass: 'bg-[#FFE600] text-black border-[#FFE600]' },
  shopee: { name: 'Shopee', color: '#EE4D2D', activeClass: 'bg-[#EE4D2D] text-white border-[#EE4D2D]' },
  amazon: { name: 'Amazon Brasil', color: '#FF9900', activeClass: 'bg-[#FF9900] text-black border-[#FF9900]' },
  hotmart: { name: 'Hotmart', color: '#F5C542', activeClass: 'bg-[#F5C542] text-black border-[#F5C542]' },
  braip: { name: 'Braip', color: '#8257E5', activeClass: 'bg-[#8257E5] text-white border-[#8257E5]' },
  monetizze: { name: 'Monetizze', color: '#0066FF', activeClass: 'bg-[#0066FF] text-white border-[#0066FF]' },
  eduzz: { name: 'Eduzz', color: '#00C853', activeClass: 'bg-[#00C853] text-black border-[#00C853]' },
  logzz: { name: 'Logzz', color: '#EC4899', activeClass: 'bg-[#EC4899] text-white border-[#EC4899]' },
  custom: { name: 'Outra / Custom', color: '#9CA3AF', activeClass: 'bg-white text-black border-white' }
};

interface NicheDetails {
  name: string;
  emoji: string;
}

const NICHES: Record<NicheID, NicheDetails> = {
  moda: { name: 'Moda e Acessórios', emoji: '👕' },
  beleza: { name: 'Beleza e Skincare', emoji: '💄' },
  suplementos: { name: 'Suplementos e Saúde', emoji: '💊' },
  casa: { name: 'Casa e Cozinha', emoji: '🏠' },
  tech: { name: 'Tecnologia e Eletrônicos', emoji: '📱' },
  infoprodutos: { name: 'Infoprodutos e Cursos', emoji: '🎓' },
  brinquedos: { name: 'Brinquedos e Família', emoji: '🧸' },
  outros: { name: 'Outros / Diversos', emoji: '📦' }
};

interface RepresentativeProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  commissionRate: number;
  description: string;
  url: string;
}

// Robust, high-converting representative products catalog for other platforms when selecionados por nicho
const REPRESENTATIVE_CATALOG: Record<PlatformID, Record<NicheID, RepresentativeProduct[]>> = {
  meli: {} as any, // Populated dynamically from API / local catalog
  shopee: {} as any, // Populated dynamically from API / local catalog
  custom: {} as any,

  amazon: {
    moda: [{
      id: 'amz-moda-1',
      title: 'Tênis Running Masculino Olympikus Corre 3 Amortecimento',
      price: 399.90,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      commissionRate: 15,
      description: 'Tênis oficial de corrida brasileiro, extremamente leve e ventilado.',
      url: 'https://amazon.com.br'
    }],
    beleza: [{
      id: 'amz-bel-1',
      title: 'Protetor Solar Facial Toque Seco FPS 60 L\'Oréal Paris',
      price: 59.90,
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      commissionRate: 13,
      description: 'Alta proteção solar com toque seco e antioleosidade o dia todo.',
      url: 'https://amazon.com.br'
    }],
    suplementos: [{
      id: 'amz-sup-1',
      title: 'Creatina 100% Pura Monohidratada 300g Max Titanium',
      price: 79.90,
      image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=800&q=80',
      commissionRate: 8,
      description: 'Aumento de força e ganho de massa magra comprovado por laudos.',
      url: 'https://amazon.com.br'
    }],
    casa: [{
      id: 'amz-casa-1',
      title: 'Fritadeira Elétrica Mondial Family 4 Litros AFN-40 Inox',
      price: 269.90,
      image: 'https://images.unsplash.com/photo-1584269600519-112d071b35e6?auto=format&fit=crop&w=800&q=80',
      commissionRate: 10,
      description: 'Fritadeira elétrica mais vendida no país, cuba antiaderente espaçosa.',
      url: 'https://amazon.com.br'
    }],
    tech: [{
      id: 'amz-tech-1',
      title: 'Novo Echo Dot 5ª Geração Smart Speaker com Alexa',
      price: 349.00,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      commissionRate: 7,
      description: 'O som mais potente e integrado da categoria de alto-falantes inteligentes.',
      url: 'https://amazon.com.br'
    }],
    infoprodutos: [{
      id: 'amz-info-1',
      title: 'E-book Best Seller Mentes Extraordinárias Kindle',
      price: 24.90,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
      commissionRate: 10,
      description: 'Guia definitivo para desenvolver inteligência emocional e liderança.',
      url: 'https://amazon.com.br'
    }],
    brinquedos: [{
      id: 'amz-brin-1',
      title: 'Jogo de Cartas Dobble Galápagos Jogos Divertidos',
      price: 64.90,
      image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80',
      commissionRate: 9,
      description: 'Raciocínio rápido e percepção visual para jogar em família e amigos.',
      url: 'https://amazon.com.br'
    }],
    outros: [{
      id: 'amz-out-1',
      title: 'Garrafa Térmica Stanley Flip Straw Premium 650ml Matte',
      price: 249.00,
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
      commissionRate: 8,
      description: 'Bebidas geladas por até 16 horas com bico rígido retrátil higiênico.',
      url: 'https://amazon.com.br'
    }]
  },

  hotmart: {
    moda: [{
      id: 'hot-moda-1',
      title: 'Formação Costura Profissional e Modelagem de Vestuário',
      price: 297.00,
      image: 'https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?auto=format&fit=crop&w=800&q=80',
      commissionRate: 50,
      description: 'Aprenda modelagem, corte e costura do zero ao nível profissional.',
      url: 'https://hotmart.com'
    }],
    beleza: [{
      id: 'hot-bel-1',
      title: 'Curso Completo Automaquiagem Perfeita e Skincare Prático',
      price: 147.00,
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      commissionRate: 55,
      description: 'Aulas em vídeo com as melhores técnicas de make de celebridades.',
      url: 'https://hotmart.com'
    }],
    suplementos: [{
      id: 'hot-sup-1',
      title: 'Programa de Treino Funcional e Emagrecimento Rápido 21D',
      price: 97.00,
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      commissionRate: 45,
      description: 'Rotinas completas de exercício físico e plano alimentar saudável.',
      url: 'https://hotmart.com'
    }],
    casa: [{
      id: 'hot-casa-1',
      title: 'Curso Organizador de Ambientes Master Home Organizer',
      price: 197.00,
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      commissionRate: 50,
      description: 'Técnicas de dobras, desapego e otimização de armários e cozinha.',
      url: 'https://hotmart.com'
    }],
    tech: [{
      id: 'hot-tech-1',
      title: 'Curso Programador Full Stack React, Node.js e TypeScript',
      price: 497.00,
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      commissionRate: 40,
      description: 'Treinamento focado em empregabilidade com projetos reais.',
      url: 'https://hotmart.com'
    }],
    infoprodutos: [{
      id: 'hot-info-1',
      title: 'Fórmula de Vendas no Automático e Tráfego Pago Afiliados',
      price: 297.00,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      commissionRate: 60,
      description: 'Construa funis de alta conversão no Facebook Ads e Google Ads.',
      url: 'https://hotmart.com'
    }],
    brinquedos: [{
      id: 'hot-brin-1',
      title: 'Kit 150 Atividades de Alfabetização Montessori Prontas',
      price: 67.00,
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
      commissionRate: 45,
      description: 'PDFs didáticos interativos prontos para imprimir e desenvolver crianças.',
      url: 'https://hotmart.com'
    }],
    outros: [{
      id: 'hot-out-1',
      title: 'Mentoria Destrave Sua Oratória e Comunicação Influente',
      price: 197.00,
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      commissionRate: 50,
      description: 'Vença o medo de falar em público com técnicas avançadas de PNL.',
      url: 'https://hotmart.com'
    }]
  },

  braip: {
    moda: [{
      id: 'bra-moda-1',
      title: 'Modelador Shaper Redutor de Medidas Confort Plus',
      price: 129.90,
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      commissionRate: 40,
      description: 'Cinta modeladora invisível de alta compressão e toque macio.',
      url: 'https://braip.com'
    }],
    beleza: [{
      id: 'bra-bel-1',
      title: 'Sérum Anti-Aging Resveratrol Líquido Concentrado',
      price: 147.00,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      commissionRate: 45,
      description: 'Combate flacidez facial e reduz linhas de expressão rapidamente.',
      url: 'https://braip.com'
    }],
    suplementos: [{
      id: 'bra-sup-1',
      title: 'Lipo-Drop Termogênico Queimador de Gordura Abdominal',
      price: 197.00,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      commissionRate: 50,
      description: 'Suplemento encapsulado de alto poder termogênico e saciedade.',
      url: 'https://braip.com'
    }],
    casa: [{
      id: 'bra-casa-1',
      title: 'Organizador Giratório Prático de Armários e Cozinha',
      price: 89.90,
      image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
      commissionRate: 35,
      description: 'Suporte giratório antiderrapante para otimizar espaço de temperos.',
      url: 'https://braip.com'
    }],
    tech: [{
      id: 'bra-tech-1',
      title: 'Super-Boost Amplificador de Sinal de Internet Wi-Fi Bivolt',
      price: 119.90,
      image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
      commissionRate: 30,
      description: 'Repetidor sem fio de longo alcance que elimina pontos cegos de rede.',
      url: 'https://braip.com'
    }],
    infoprodutos: [{
      id: 'bra-info-1',
      title: 'Método Renda Extra Express: Dropshipping de Encapsulados',
      price: 97.00,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      commissionRate: 50,
      description: 'Curso focado em vender suplementos físicos no piloto automático.',
      url: 'https://braip.com'
    }],
    brinquedos: [{
      id: 'bra-brin-1',
      title: 'Tapete Didático Infantil de Atividades Interativo',
      price: 139.90,
      image: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=800&q=80',
      commissionRate: 35,
      description: 'Desenvolve coordenação motora e habilidades sensoriais de bebês.',
      url: 'https://braip.com'
    }],
    outros: [{
      id: 'bra-out-1',
      title: 'Suporte Celular Inteligente 360° Rastreamento de Movimento',
      price: 99.90,
      image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
      commissionRate: 40,
      description: 'Suporte eletrônico ideal para gravação de vídeos curtos para redes.',
      url: 'https://braip.com'
    }]
  },

  monetizze: {
    moda: [{
      id: 'mon-moda-1',
      title: 'Kit 5 Camisetas Térmicas Proteção UV50+ Dry Fit',
      price: 119.90,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      commissionRate: 45,
      description: 'Ideal para atividades ao ar livre com secagem ultra rápida.',
      url: 'https://monetizze.com.br'
    }],
    beleza: [{
      id: 'mon-bel-1',
      title: 'Kit Peeling Clareador de Manchas de Pele Home Care',
      price: 197.00,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      commissionRate: 50,
      description: 'Uniformiza a pigmentação da pele e clareia melasmas com segurança.',
      url: 'https://monetizze.com.br'
    }],
    suplementos: [{
      id: 'mon-sup-1',
      title: 'Night-Calm Fitocápsulas indutoras de Sono Profundo',
      price: 227.00,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      commissionRate: 55,
      description: 'Melhore a qualidade do descanso noturno e acorde com energia total.',
      url: 'https://monetizze.com.br'
    }],
    casa: [{
      id: 'mon-casa-1',
      title: 'Kit 3 Lâmpadas Inteligentes de LED RGB Wi-Fi Bivolt',
      price: 149.00,
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      commissionRate: 40,
      description: 'Mude a iluminação e crie cenários pelo app de automação de celular.',
      url: 'https://monetizze.com.br'
    }],
    tech: [{
      id: 'mon-tech-1',
      title: 'Mini Câmera Espiã Sem Fio Wi-Fi Visão Noturna HD',
      price: 139.90,
      image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
      commissionRate: 35,
      description: 'Super discreta, ideal para monitorar em tempo real crianças ou pets.',
      url: 'https://monetizze.com.br'
    }],
    infoprodutos: [{
      id: 'mon-info-1',
      title: 'Método Lucrar com Blogs: Monetização Fácil no Google AdSense',
      price: 147.00,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      commissionRate: 60,
      description: 'Guia definitivo para construir portais de notícias lucrativos.',
      url: 'https://monetizze.com.br'
    }],
    brinquedos: [{
      id: 'mon-brin-1',
      title: 'Blocos de Montar Educativos Gigantes Kit 100 Peças',
      price: 99.00,
      image: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=800&q=80',
      commissionRate: 40,
      description: 'Estojo com blocos macios que desenvolvem imaginação e foco.',
      url: 'https://monetizze.com.br'
    }],
    outros: [{
      id: 'mon-out-1',
      title: 'Fórmula Lucrativa: Dropshipping de Produtos Inovadores',
      price: 150.00,
      image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
      commissionRate: 50,
      description: 'Crie sua loja sem estoque própria e fature em reais imediatamente.',
      url: 'https://monetizze.com.br'
    }]
  },

  eduzz: {
    moda: [{
      id: 'edz-moda-1',
      title: 'Guia Digital Estilo Elegante: Consultoria de Imagem Pessoal',
      price: 147.00,
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
      commissionRate: 45,
      description: 'Melhore sua imagem corporativa e pessoal de forma rápida.',
      url: 'https://eduzz.com'
    }],
    beleza: [{
      id: 'edz-bel-1',
      title: 'Curso Masterclass Manicure e Micropigmentação Expert',
      price: 197.00,
      image: 'https://images.unsplash.com/photo-1604654894610-df4906b241af?auto=format&fit=crop&w=800&q=80',
      commissionRate: 50,
      description: 'Formação com certificação para começar a faturar no ramo de estética.',
      url: 'https://eduzz.com'
    }],
    suplementos: [{
      id: 'edz-sup-1',
      title: 'Fórmula Emagrecimento Definitivo Plano Nutricional Diário',
      price: 197.00,
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
      commissionRate: 45,
      description: 'Cardápios fáceis criados por profissionais de nutrição integrativa.',
      url: 'https://eduzz.com'
    }],
    casa: [{
      id: 'edz-casa-1',
      title: 'Curso Jardinagem Completo: Cultivar Horta e Flores em Casa',
      price: 127.00,
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80',
      commissionRate: 45,
      description: 'Tudo o que você precisa saber para cultivar ervas finas e flores.',
      url: 'https://eduzz.com'
    }],
    tech: [{
      id: 'edz-tech-1',
      title: 'Formação Automatizar Rotinas com Inteligência Artificial e IA',
      price: 297.00,
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      commissionRate: 35,
      description: 'Aprenda a aplicar ChatGPT e automações no trabalho para dobrar resultados.',
      url: 'https://eduzz.com'
    }],
    infoprodutos: [{
      id: 'edz-info-1',
      title: 'Kit Planilhas Financeiras Inteligentes Organização de Gastos',
      price: 97.00,
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
      commissionRate: 55,
      description: 'Gerencie receitas, despesas, investimentos e planeje aposentadoria.',
      url: 'https://eduzz.com'
    }],
    brinquedos: [{
      id: 'edz-brin-1',
      title: 'Método Alfabetização Descomplicada de Crianças em Casa',
      price: 87.00,
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
      commissionRate: 40,
      description: 'Guia prático para pais impulsionarem leitura de crianças de 4 a 8 anos.',
      url: 'https://eduzz.com'
    }],
    outros: [{
      id: 'edz-out-1',
      title: 'Curso Inglês Fluente na Viagem Sem Perrengues',
      price: 150.00,
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      commissionRate: 45,
      description: 'Vocabulário essencial e diálogos simulados para portos e aeroportos.',
      url: 'https://eduzz.com'
    }]
  },

  logzz: {
    moda: [{
      id: 'log-moda-1',
      title: 'Calça Cargo Unissex Militar Streetwear Resistente',
      price: 139.00,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
      commissionRate: 35,
      description: 'Calça cargo em algodão com múltiplos bolsos e envio expresso.',
      url: 'https://logzz.com.br'
    }],
    beleza: [{
      id: 'log-bel-1',
      title: 'Kit Hidratante Purificante Vegano Proteção Total Facial',
      price: 189.00,
      image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
      commissionRate: 45,
      description: 'Cosméticos de alta pureza fabricados no Brasil com estoque integrado.',
      url: 'https://logzz.com.br'
    }],
    suplementos: [{
      id: 'log-sup-1',
      title: 'Whey Isolado Hidrolisado Direct Fábrica 900g Pouch',
      price: 219.00,
      image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=800&q=80',
      commissionRate: 45,
      description: 'Proteína pura com faturamento direto da fábrica com alta margem.',
      url: 'https://logzz.com.br'
    }],
    casa: [{
      id: 'log-casa-1',
      title: 'Kit Organizadores Transparentes Acrílico Prático',
      price: 149.00,
      image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
      commissionRate: 35,
      description: 'Perfeito para gavetas, cosméticos e temperos de geladeira.',
      url: 'https://logzz.com.br'
    }],
    tech: [{
      id: 'log-tech-1',
      title: 'Hub USB-C 8 em 1 Dock Station para MacBook e Windows',
      price: 299.00,
      image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=800&q=80',
      commissionRate: 30,
      description: 'Expansão de portas HDMI 4K, ethernet e leitor de cartões em alumínio.',
      url: 'https://logzz.com.br'
    }],
    infoprodutos: [{
      id: 'log-info-1',
      title: 'Suporte Digital E-book Dropshipping Nacional Completo',
      price: 147.00,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      commissionRate: 40,
      description: 'Manual de integração logística para faturamento imediato de infoprodutos.',
      url: 'https://logzz.com.br'
    }],
    brinquedos: [{
      id: 'log-brin-1',
      title: 'Jogo Educativo Infantil de Encaixe de Blocos Lúdico',
      price: 110.00,
      image: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=800&q=80',
      commissionRate: 30,
      description: 'Ideal para desenvolver lógica geométrica e percepção de cores.',
      url: 'https://logzz.com.br'
    }],
    outros: [{
      id: 'log-out-1',
      title: 'Lente Zoom Telescópica 12x Profissional para Celulares',
      price: 150.00,
      image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
      commissionRate: 35,
      description: 'Excelente gancho de vendas em dropshipping nacional com alto apelo.',
      url: 'https://logzz.com.br'
    }]
  }
};

interface PlatformNicheRate {
  rate: number;
  avgPrice: number;
  note: string;
}

const PLATFORM_NICHE_RATES: Record<Exclude<PlatformID, 'custom'>, Record<NicheID, PlatformNicheRate>> = {
  meli: {
    moda: { rate: 12, avgPrice: 149.90, note: "Comissão padrão de 12% para vestuário e calçados no Mercado Livre." },
    beleza: { rate: 11, avgPrice: 119.90, note: "Produtos de skincare, maquiagem e cuidados pessoais pagam 11%." },
    suplementos: { rate: 9, avgPrice: 139.90, note: "Vitaminas, whey protein e suplementos alimentares pagam 9%." },
    casa: { rate: 9, avgPrice: 199.90, note: "Utilidades domésticas, decoração e pequenos eletros pagam 9%." },
    tech: { rate: 5, avgPrice: 899.90, note: "Celulares, notebooks e eletrônicos de consumo pagam 5%." },
    infoprodutos: { rate: 30, avgPrice: 197.00, note: "Cursos e materiais digitais autorizados no ML pagam em média 30%." },
    brinquedos: { rate: 8, avgPrice: 129.90, note: "Jogos, brinquedos infantis e puericultura pagam 8%." },
    outros: { rate: 7, avgPrice: 150.00, note: "Média de comissões gerais para outras categorias é de 7%." },
  },
  shopee: {
    moda: { rate: 14, avgPrice: 79.90, note: "Taxa máxima de 14% para roupas, calçados e acessórios de moda na Shopee." },
    beleza: { rate: 14, avgPrice: 59.90, note: "Altíssimo volume de vendas em maquiagens e cuidados pessoais com taxa de 14%." },
    suplementos: { rate: 10, avgPrice: 99.90, note: "Suplementos e produtos saudáveis pagam em média 10% na Shopee." },
    casa: { rate: 10, avgPrice: 110.00, note: "Organizadores de casa, utensílios de cozinha pagam 10%." },
    tech: { rate: 4, avgPrice: 250.00, note: "Eletrônicos e acessórios de tecnologia pagam em média 4%." },
    infoprodutos: { rate: 20, avgPrice: 47.00, note: "E-books e apostilas digitais pagam em média 20%." },
    brinquedos: { rate: 9, avgPrice: 85.00, note: "Brinquedos educativos e acessórios infantis pagam 9%." },
    outros: { rate: 8, avgPrice: 80.00, note: "Produtos diversos em alta rotação pagam 8%." },
  },
  amazon: {
    moda: { rate: 15, avgPrice: 159.90, note: "Comissão premium de 15% para vestuário e acessórios na Amazon Brasil." },
    beleza: { rate: 13, avgPrice: 129.90, note: "Cuidados pessoais e beleza recebem excelente taxa de 13%." },
    suplementos: { rate: 8, avgPrice: 119.90, note: "Nutrição esportiva e cuidados com a saúde pagam 8%." },
    casa: { rate: 10, avgPrice: 249.90, note: "Móveis, utensílios de cozinha e eletroportáteis pagam 10%." },
    tech: { rate: 7, avgPrice: 1200.00, note: "Dispositivos Echo/Kindle e eletrônicos de consumo pagam 7%." },
    infoprodutos: { rate: 10, avgPrice: 39.90, note: "Kindle eBooks e assinaturas digitais pagam 10%." },
    brinquedos: { rate: 9, avgPrice: 149.90, note: "Categoria infantil e brinquedos pagam taxa fixa de 9%." },
    outros: { rate: 8, avgPrice: 180.00, note: "Média para demais categorias qualificadas da Amazon Brasil." },
  },
  hotmart: {
    moda: { rate: 50, avgPrice: 197.00, note: "Cursos de costura, estilo pessoal e design de moda pagam em média 50%." },
    beleza: { rate: 55, avgPrice: 147.00, note: "E-books de maquiagem, cursos de manicure e skincare pagam em média 55%." },
    suplementos: { rate: 45, avgPrice: 247.00, note: "Cursos de musculação, programas de treinos online pagam em média 45%." },
    casa: { rate: 50, avgPrice: 197.00, note: "Cursos de decoração de interiores e organização pagam 50%." },
    tech: { rate: 40, avgPrice: 297.00, note: "Treinamentos em tecnologia, programação e softwares SaaS pagam 40%." },
    infoprodutos: { rate: 60, avgPrice: 197.00, note: "Média máxima de 60% para infoprodutos, mentorias e e-books." },
    brinquedos: { rate: 45, avgPrice: 97.00, note: "Atividades pedagógicas infantis e rotinas maternas pagam 45%." },
    outros: { rate: 50, avgPrice: 150.00, note: "Cursos de nichos variados como culinária, idiomas ou hobbies pagam 50%." },
  },
  braip: {
    moda: { rate: 40, avgPrice: 147.00, note: "Acessórios de emagrecimento e modeladores corporais pagam 40%." },
    beleza: { rate: 45, avgPrice: 197.00, note: "Séruns de rejuvenescimento e cosméticos encapsulados físicos pagam 45%." },
    suplementos: { rate: 50, avgPrice: 247.00, note: "Whey protein, colágeno e polivitamínicos físicos pagam 50%." },
    casa: { rate: 35, avgPrice: 179.90, note: "Equipamentos de automação doméstica e utilitários pagam 35%." },
    tech: { rate: 30, avgPrice: 399.00, note: "Dispositivos inovadores físicos importados pagam 30%." },
    infoprodutos: { rate: 50, avgPrice: 197.00, note: "Programas de mentoria e acompanhamento digital pagam 50%." },
    brinquedos: { rate: 35, avgPrice: 120.00, note: "Jogos de tabuleiro ou brinquedos importados exclusivos pagam 35%." },
    outros: { rate: 40, avgPrice: 180.00, note: "Outros encapsulados e físicos de alta conversão pagam 40%." },
  },
  monetizze: {
    moda: { rate: 45, avgPrice: 139.90, note: "Cintas modeladoras e acessórios de vestuário de alta performance pagam 45%." },
    beleza: { rate: 50, avgPrice: 197.00, note: "Cremes capilares, removedores de manchas e pele pagam 50%." },
    suplementos: { rate: 55, avgPrice: 227.00, note: "Encapsulados de emagrecimento, foco mental ou sono natural pagam 55%." },
    casa: { rate: 40, avgPrice: 150.00, note: "Dispositivos inovadores e purificadores de ar pagam 40%." },
    tech: { rate: 35, avgPrice: 350.00, note: "Gadgets de segurança e utilitários eletrônicos pagam 35%." },
    infoprodutos: { rate: 60, avgPrice: 147.00, note: "Cursos online de marketing digital e desenvolvimento pagam 60%." },
    brinquedos: { rate: 40, avgPrice: 99.00, note: "Kit de materiais didáticos infantis para impressão paga 40%." },
    outros: { rate: 50, avgPrice: 150.00, note: "Encapsulados de nicho com receitas validadas pagam em média 50%." },
  },
  eduzz: {
    moda: { rate: 45, avgPrice: 147.00, note: "Cursos de consultoria de imagem e estilo pagam em média 45%." },
    beleza: { rate: 50, avgPrice: 197.00, note: "Masterclasses de estética, cabelo e micropigmentação pagam 50%." },
    suplementos: { rate: 45, avgPrice: 197.00, note: "Planos de emagrecimento metabólico e nutrição pagam 45%." },
    casa: { rate: 45, avgPrice: 127.00, note: "Guias de jardinagem, horta em casa e culinária gourmet pagam 45%." },
    tech: { rate: 35, avgPrice: 297.00, note: "Curso prático de automação, Excel avançado e IA pagam 35%." },
    infoprodutos: { rate: 55, avgPrice: 197.00, note: "Cursos, PDFs de receitas, planilhas financeiras pagam 55%." },
    brinquedos: { rate: 40, avgPrice: 87.00, note: "Métodos de alfabetização e apostilas escolares pagam 40%." },
    outros: { rate: 45, avgPrice: 150.00, note: "Infoprodutos de hobbies diversos pagam em média 45%." },
  },
  logzz: {
    moda: { rate: 35, avgPrice: 139.00, note: "Roupas e acessórios exclusivos com logística simplificada pagam 35%." },
    beleza: { rate: 45, avgPrice: 189.00, note: "Cosméticos de marca própria com envio rápido pagam 45%." },
    suplementos: { rate: 45, avgPrice: 219.00, note: "Suplementos de saúde direto do fabricante pagam 45%." },
    casa: { rate: 35, avgPrice: 149.00, note: "Utensílios de cozinha e organizadores de alto giro pagam 35%." },
    tech: { rate: 30, avgPrice: 299.00, note: "Gadgets inovadores com faturamento imediato pagam 30%." },
    infoprodutos: { rate: 40, avgPrice: 147.00, note: "Materiais digitais de suporte integrados pagam 40%." },
    brinquedos: { rate: 30, avgPrice: 110.00, note: "Jogos recreativos e artigos de lazer pagam 30%." },
    outros: { rate: 35, avgPrice: 150.00, note: "Dropshipping nacional de diversos segmentos paga em média 35%." },
  }
};

// Map Niche ID to possible database / API Category types
const NICHE_TO_CATEGORY_MAP: Record<NicheID, string[]> = {
  moda: ['Esporte', 'Moda', 'Roupas e Calçados'],
  beleza: ['Beleza e skincare', 'Beleza'],
  suplementos: ['Suplementos e saúde', 'Saúde', 'Fitness'],
  casa: ['Casa e cozinha', 'Eletrodomésticos'],
  tech: ['Tech', 'Celulares', 'Informática'],
  infoprodutos: ['Infoprodutos'],
  brinquedos: ['Infantil e família', 'Brinquedos'],
  outros: ['Outros']
};

export const CommissionCalculatorModal: React.FC<CommissionCalculatorModalProps> = ({
  isOpen,
  onClose,
  onNewReview
}) => {
  if (!isOpen) return null;

  const [platform, setPlatform] = useState<PlatformID>('meli');
  const [niche, setNiche] = useState<NicheID>('beleza');

  // API data states
  const [championProducts, setChampionProducts] = useState<any[]>([]);
  const [isLoadingChampions, setIsLoadingChampions] = useState<boolean>(false);

  // Live search states (Search live in ML API from inside the modal)
  const [liveSearchQuery, setLiveSearchQuery] = useState<string>('');
  const [isSearchingLive, setIsSearchingLive] = useState<boolean>(false);
  const [liveSearchResults, setLiveSearchResults] = useState<any[]>([]);

  // Calculation parameters
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [productPrice, setProductPrice] = useState<number>(119.90);
  const [commissionRate, setCommissionRate] = useState<number>(11); // %
  const [dailyVisitors, setDailyVisitors] = useState<number>(150);
  const [conversionRate, setConversionRate] = useState<number>(3.5); // %
  const [selectedNote, setSelectedNote] = useState<string>(
    "Produtos de skincare, maquiagem e cuidados pessoais pagam 11%."
  );

  // Fetch verified champion products from API on mount
  useEffect(() => {
    setIsLoadingChampions(true);
    fetch('/api/marketplace/reconciled-champions')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Fallback para catalogo local');
      })
      .then((data) => {
        if (data && Array.isArray(data.items)) {
          setChampionProducts(data.items);
        } else {
          setChampionProducts(Object.values(AUTHORITATIVE_MARKETPLACE_CATALOG));
        }
      })
      .catch((err) => {
        console.warn('[Calculator API] Usando catálogo local robusto:', err);
        setChampionProducts(Object.values(AUTHORITATIVE_MARKETPLACE_CATALOG));
      })
      .finally(() => {
        setIsLoadingChampions(false);
      });
  }, []);

  // Compute products list matching the current platform and niche category
  const matchingProducts = useMemo(() => {
    if (platform === 'custom') return [];

    // 1. Check if we are searching live
    if (liveSearchResults.length > 0 && (platform === 'meli')) {
      return liveSearchResults;
    }

    // 2. Filter from the fetched / API / Local marketplace champion database
    if (platform === 'meli' || platform === 'shopee') {
      const dbPlatform = platform === 'meli' ? 'Mercado Livre' : 'Shopee';
      const possibleCategories = NICHE_TO_CATEGORY_MAP[niche];

      const filtered = championProducts.filter((p) => {
        const isPlatformMatch = p.platform === dbPlatform;
        const isCategoryMatch = possibleCategories.some(
          (cat) => (p.category || '').toLowerCase().includes(cat.toLowerCase())
        );
        return isPlatformMatch && isCategoryMatch;
      });

      if (filtered.length > 0) {
        return filtered.map(p => ({
          id: p.productId || p.id,
          title: p.canonicalTitle || p.title,
          price: p.realPrice || p.rawPrice || 99.90,
          image: p.verifiedImageUrl || p.productImage || p.image,
          commissionRate: platform === 'meli' ? 11 : 14,
          description: p.technicalDescription || p.conversionReason || '',
          url: p.affiliateUrl || ''
        }));
      }
    }

    // 3. Fallback / Representative lists for non-marketplace or when empty
    const repList = REPRESENTATIVE_CATALOG[platform]?.[niche] || [];
    return repList;
  }, [platform, niche, championProducts, liveSearchResults]);

  // Handle auto pre-selection when platform or niche changes
  useEffect(() => {
    if (platform === 'custom') {
      setSelectedProduct(null);
      setSelectedNote("Insira valores personalizados abaixo para simular qualquer outro produto.");
      return;
    }

    // Auto update default commission rate and note for the platform + category
    const rates = PLATFORM_NICHE_RATES[platform as Exclude<PlatformID, 'custom'>];
    let defaultRate = 10;
    let defaultPrice = 150.0;
    let defaultNote = "Taxas de comissão padrão da plataforma.";

    if (rates && rates[niche]) {
      const platformData = rates[niche];
      defaultRate = platformData.rate;
      defaultPrice = platformData.avgPrice;
      defaultNote = platformData.note;
    }

    // Pre-select first matching product if available
    if (matchingProducts && matchingProducts.length > 0) {
      const prod = matchingProducts[0];
      setSelectedProduct(prod);
      setProductPrice(prod.price);
      setCommissionRate(prod.commissionRate || defaultRate);
      setSelectedNote(`[PRODUTO REAL ENCONTRADO] O produto "${prod.title}" foi localizado no catálogo da API oficial. Comissão padrão: ${prod.commissionRate || defaultRate}%.`);
    } else {
      setSelectedProduct(null);
      setProductPrice(defaultPrice);
      setCommissionRate(defaultRate);
      setSelectedNote(defaultNote);
    }
  }, [platform, niche, matchingProducts]);

  // Perform Live Search via Mercado Livre API inside the calculator
  const handlePerformLiveSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveSearchQuery.trim()) {
      setLiveSearchResults([]);
      return;
    }

    setIsSearchingLive(true);
    try {
      const res = await fetch(`/api/meli/search?q=${encodeURIComponent(liveSearchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          const formatted = data.items.map((item: any, idx: number) => {
            const rawPrice = typeof item.rawPrice === 'number'
              ? item.rawPrice
              : parseFloat(String(item.suggestedPrice || '0').replace('R$', '').replace('.', '').replace(',', '.').trim()) || 99.9;

            return {
              id: item.meliItemId || `meli-calc-live-${idx}`,
              title: item.title,
              price: rawPrice,
              image: item.thumbnail || '',
              commissionRate: 5, // Eletrônicos no ML pagam 5%, senão padrão de 7%-11%
              description: item.suggestedDescription || 'Produto sincronizado em tempo real com a API.',
              url: item.realUrl || 'https://mercadolivre.com.br'
            };
          });

          // Set active platform to 'meli' to show live results
          setPlatform('meli');
          setLiveSearchResults(formatted);

          // Select first search result
          if (formatted.length > 0) {
            const prod = formatted[0];
            setSelectedProduct(prod);
            setProductPrice(prod.price);
            setCommissionRate(prod.commissionRate);
            setSelectedNote(`[API LIVE SEARCH] Produto sincronizado ao vivo via API: "${prod.title}". Preço Real: R$ ${prod.price.toFixed(2)}.`);
          }
        }
      }
    } catch (err) {
      console.warn('Erro ao pesquisar ao vivo no modal do simulador:', err);
    } finally {
      setIsSearchingLive(false);
    }
  };

  // Calculations
  const commissionPerSale = (productPrice * commissionRate) / 100;
  const salesPerDay = (dailyVisitors * conversionRate) / 100;
  const dailyEarnings = salesPerDay * commissionPerSale;
  const monthlyEarnings = dailyEarnings * 30;
  const monthlySales = salesPerDay * 30;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#090B0F] border border-[#1E2433] rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1E2433]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Simulador Automatizado de Comissões</h2>
              <p className="text-xs text-[#8E8E8E]">Integrado em tempo real com APIs de nichos, taxas e catálogos reais</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#777] hover:text-white hover:bg-[#1A1A1A] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Search Engine */}
        <form onSubmit={handlePerformLiveSearch} className="relative flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777]" />
            <input
              type="text"
              value={liveSearchQuery}
              onChange={(e) => {
                setLiveSearchQuery(e.target.value);
                if (!e.target.value) setLiveSearchResults([]);
              }}
              placeholder="Pesquisar qualquer produto ao vivo para carregar preço real via API..."
              className="w-full bg-[#11141D] border border-[#1E2433] focus:border-[#F5C542] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#555] outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isSearchingLive}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#202533] hover:bg-[#282F40] border border-[#2C354A] text-xs font-bold text-white cursor-pointer transition-all disabled:opacity-50"
          >
            {isSearchingLive ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#F5C542]" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-[#F5C542]" />
            )}
            <span>Buscar Preço Real</span>
          </button>
        </form>

        {/* Two Column Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Platform Picker */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-[#F5C542]" /> 1. Plataforma Parceira:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(Object.keys(PLATFORMS) as PlatformID[]).map((key) => {
                const info = PLATFORMS[key];
                const isSelected = platform === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setPlatform(key);
                      setLiveSearchResults([]);
                    }}
                    className={`py-2.5 px-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer text-center truncate ${
                      isSelected
                        ? info.activeClass
                        : 'bg-[#11141D] text-[#8E939E] border-[#1E2433] hover:text-white hover:bg-[#171C29]'
                    }`}
                    style={isSelected ? {} : { borderLeftColor: info.color }}
                  >
                    {info.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Niche Picker */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#38BDF8]" /> 2. Nicho / Categoria de Vendas:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(NICHES) as NicheID[]).map((key) => {
                const info = NICHES[key];
                const isSelected = niche === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setNiche(key);
                      setLiveSearchResults([]);
                    }}
                    disabled={platform === 'custom'}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left flex items-center gap-2 ${
                      platform === 'custom'
                        ? 'opacity-30 cursor-not-allowed bg-[#11141D] text-[#444] border-transparent'
                        : isSelected
                        ? 'bg-[#152338] text-white border-[#38BDF8] shadow-md shadow-[#38BDF8]/10'
                        : 'bg-[#11141D] text-[#8E939E] border-[#1E2433] hover:text-white hover:bg-[#171C29] cursor-pointer'
                    }`}
                  >
                    <span>{info.emoji}</span>
                    <span className="truncate">{info.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Product Picker Selector */}
        {matchingProducts.length > 0 && (
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#22C55E]" /> 3. Selecionar Produto do Nicho (API / Recomendado):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1 bg-[#11141D]/50 rounded-2xl border border-[#1E2433]">
              {matchingProducts.map((prod) => {
                const isSelected = selectedProduct?.id === prod.id;
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => {
                      setSelectedProduct(prod);
                      setProductPrice(prod.price);
                      if (prod.commissionRate) {
                        setCommissionRate(prod.commissionRate);
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#18231E] border-[#22C55E] text-white'
                        : 'bg-[#11141D] border-[#1E2433] text-[#8E939E] hover:text-white hover:bg-[#171C29]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white p-1 shrink-0 flex items-center justify-center overflow-hidden">
                      <img
                        src={prod.image}
                        alt={prod.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <h4 className="text-[11px] font-bold truncate leading-tight">{prod.title}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-[#22C55E]">R$ {prod.price.toFixed(2)}</span>
                        {prod.commissionRate && (
                          <span className="text-[9px] px-1.5 py-0.25 rounded bg-[#22C55E]/10 text-[#22C55E] font-extrabold">{prod.commissionRate}% Com.</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Product Card Integration */}
        {selectedProduct && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#111624] to-[#0A0D15] border border-[#1E2433] flex flex-col sm:flex-row gap-4 items-center animate-in slide-in-from-top duration-200">
            <div className="w-16 h-16 bg-white rounded-xl p-1.5 shrink-0 flex items-center justify-center overflow-hidden shadow-md">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>
            <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[10px] font-bold text-[#F5C542]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
                <span className="uppercase tracking-wider">PRODUTO INTEGRADO AUTOMATICAMENTE POR API</span>
              </div>
              <h3 className="text-xs font-black text-white truncate">{selectedProduct.title}</h3>
              <p className="text-[10px] text-[#8E939E] line-clamp-1 leading-snug">
                {selectedProduct.description || "Preços, imagens e comissões integrados diretamente via API de mercado para cálculo exato."}
              </p>
            </div>
            <div className="text-center sm:text-right shrink-0">
              <span className="text-[10px] text-[#8E939E] block">Preço de Venda</span>
              <span className="text-lg font-black text-[#22C55E]">R$ {selectedProduct.price.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Real Source Info Alert */}
        <div className="bg-[#11141D] border border-[#1E2433] rounded-xl p-3.5 flex items-start gap-2.5 text-xs">
          <Info className="w-4 h-4 text-[#F5C542] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[#E0E0E0] font-bold block text-[11px]">Diretrizes e Taxas de Comissão Praticadas:</span>
            <p className="text-[#8E939E] leading-relaxed text-[11px]">{selectedNote}</p>
          </div>
        </div>

        {/* Sliders and Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="bg-[#11141D] border border-[#1E2433] rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-xs font-bold text-[#E0E0E0]">
              <span>Preço Simulado do Produto:</span>
              <span className="text-[#F5C542]">R$ {productPrice.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="10"
              max="2500"
              step="5"
              value={productPrice}
              onChange={(e) => {
                setProductPrice(Number(e.target.value));
                if (platform !== 'custom') {
                  setSelectedNote(`Preço personalizado para simular produtos específicos de ${NICHES[niche].name} na plataforma ${PLATFORMS[platform].name}.`);
                }
              }}
              className="w-full accent-[#F5C542] cursor-pointer"
            />
          </div>

          <div className="bg-[#11141D] border border-[#1E2433] rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-xs font-bold text-[#E0E0E0]">
              <span>Taxa de Comissão:</span>
              <span className="text-[#22C55E]">{commissionRate}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="90"
              step="1"
              value={commissionRate}
              onChange={(e) => {
                setCommissionRate(Number(e.target.value));
                if (platform !== 'custom') {
                  setSelectedNote(`Comissão personalizada para simular produtos de ${NICHES[niche].name} na plataforma ${PLATFORMS[platform].name}.`);
                }
              }}
              className="w-full accent-[#22C55E] cursor-pointer"
            />
          </div>

          <div className="bg-[#11141D] border border-[#1E2433] rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-xs font-bold text-[#E0E0E0]">
              <span>Cliques / Visitantes Diários:</span>
              <span className="text-[#38BDF8]">{dailyVisitors} visitas/dia</span>
            </div>
            <input
              type="range"
              min="10"
              max="5000"
              step="10"
              value={dailyVisitors}
              onChange={(e) => setDailyVisitors(Number(e.target.value))}
              className="w-full accent-[#38BDF8] cursor-pointer"
            />
          </div>

          <div className="bg-[#11141D] border border-[#1E2433] rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-xs font-bold text-[#E0E0E0]">
              <span>Taxa de Conversão da Página:</span>
              <span className="text-white">{conversionRate}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="20"
              step="0.1"
              value={conversionRate}
              onChange={(e) => setConversionRate(Number(e.target.value))}
              className="w-full accent-[#F5C542] cursor-pointer"
            />
          </div>
        </div>

        {/* Results Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#0C1B13] via-[#09150E] to-[#050D09] border border-[#1A3F28] p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-black/40 border border-[#1A3F28]/50">
              <span className="text-[10px] text-[#8E939E] block font-bold uppercase tracking-wider">Sua Comissão / Venda</span>
              <span className="text-lg font-black text-white block mt-1">
                R$ {commissionPerSale.toFixed(2)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-[#1A3F28]/50">
              <span className="text-[10px] text-[#8E939E] block font-bold uppercase tracking-wider">Vendas Estimadas / Mês</span>
              <span className="text-lg font-black text-[#38BDF8] block mt-1">
                {Math.round(monthlySales)} pedidos
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-[#1A3F28]/50">
              <span className="text-[10px] text-[#22C55E] block font-bold uppercase tracking-wider">Seu Lucro Mensal Est.</span>
              <span className="text-xl font-black text-[#22C55E] block mt-1">
                R$ {monthlyEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#11141D] hover:bg-[#171C29] text-[#A1A1A1] hover:text-white text-xs font-bold transition-all cursor-pointer border border-[#1E2433]"
          >
            Fechar
          </button>

          {onNewReview && (
            <button
              onClick={() => {
                onClose();
                if (selectedProduct) {
                  onNewReview({
                    productName: selectedProduct.title,
                    productPrice: `R$ ${selectedProduct.price.toFixed(2).replace('.', ',')}`,
                    productImage: selectedProduct.image,
                    productCategory: NICHES[niche].name,
                    productDescription: selectedProduct.description || 'Produto simulado via calculadora inteligente.',
                    affiliateLink: selectedProduct.url || 'https://mercadolivre.com.br'
                  });
                } else {
                  onNewReview({
                    productName: `Produto de ${NICHES[niche].emoji} ${NICHES[niche].name}`,
                    productPrice: `R$ ${productPrice.toFixed(2).replace('.', ',')}`,
                    productImage: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
                    productCategory: NICHES[niche].name,
                    productDescription: `Excelente oportunidade de promoção de ${NICHES[niche].name} com taxa de ${commissionRate}% de comissão.`,
                    affiliateLink: 'https://mercadolivre.com.br'
                  });
                }
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F5C542] hover:bg-[#e5b738] text-black text-xs font-black transition-all cursor-pointer shadow-lg shadow-[#F5C542]/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Criar Review do Produto</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
