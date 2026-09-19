import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Flame,
  DollarSign,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Star,
  CheckCircle,
  ShoppingBag,
  Zap,
  Tag,
  RefreshCw
} from 'lucide-react';
import { CategoryType } from '../types';

interface TopProductsViewProps {
  onUseProductForReview: (product: {
    productName: string;
    productPrice: string;
    productImage: string;
    productCategory: CategoryType;
    productDescription: string;
    affiliateLink: string;
  }) => void;
  onSwitchToComparator?: (productTitle: string) => void;
}

export interface ChampionProduct {
  id: string;
  rank: number;
  title: string;
  category: CategoryType;
  platform: 'Mercado Livre' | 'Shopee';
  price: string;
  rawPrice: number;
  estimatedCommission: string;
  commissionRate: string;
  soldQuantity: string;
  rating: number;
  reviewsCount: number;
  image: string;
  affiliateUrl: string;
  demandBadge: '🔥 Top 1 Bestseller' | '⚡ Explosão de Buscas' | '💰 Alta Comissão' | '⭐ Mais Bem Avaliado' | '🎯 Alta Conversão';
  conversionReason: string;
  isHighTicket: boolean;
}

const CHAMPION_PRODUCTS: ChampionProduct[] = [
  {
    id: 'champ-1',
    rank: 1,
    title: 'Fritadeira Sem Óleo Mondial Family 5 Litros Digital Touch 1500W',
    category: 'Casa e cozinha',
    platform: 'Mercado Livre',
    price: 'R$ 299,90',
    rawPrice: 299.90,
    estimatedCommission: 'R$ 29,99 a R$ 41,98',
    commissionRate: '10% a 14%',
    soldQuantity: '+50.000 vendidos',
    rating: 4.9,
    reviewsCount: 14820,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    affiliateUrl: 'https://mercadolivre.com.br',
    demandBadge: '🔥 Top 1 Bestseller',
    conversionReason: 'Campeã absoluta de buscas diárias no Brasil. Excelente para vídeos curtos e reviews comparativos.',
    isHighTicket: false
  },
  {
    id: 'champ-2',
    rank: 2,
    title: 'Creatina Max Titanium 100% Pura Monohidratada 300g Original Laudo',
    category: 'Suplementos e saúde',
    platform: 'Mercado Livre',
    price: 'R$ 84,90',
    rawPrice: 84.90,
    estimatedCommission: 'R$ 8,49 a R$ 11,88',
    commissionRate: '10% a 14%',
    soldQuantity: '+120.000 vendidos',
    rating: 4.9,
    reviewsCount: 22400,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    affiliateUrl: 'https://mercadolivre.com.br',
    demandBadge: '⚡ Explosão de Buscas',
    conversionReason: 'Produto de recompra mensal frequente. Público fitness compra com facilidade por ser marca de referência.',
    isHighTicket: false
  },
  {
    id: 'champ-3',
    rank: 3,
    title: 'Escova Secadora Mondial Golden Rose ES-02 1200W Cerdas Mistas',
    category: 'Beleza e skincare',
    platform: 'Mercado Livre',
    price: 'R$ 119,90',
    rawPrice: 119.90,
    estimatedCommission: 'R$ 11,99 a R$ 16,78',
    commissionRate: '10% a 14%',
    soldQuantity: '+80.000 vendidos',
    rating: 4.8,
    reviewsCount: 19300,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    affiliateUrl: 'https://mercadolivre.com.br',
    demandBadge: '🎯 Alta Conversão',
    conversionReason: 'Altíssimo apelo visual de "antes e depois". Review com fotos de resultados vende diariamente no piloto automático.',
    isHighTicket: false
  },
  {
    id: 'champ-4',
    rank: 4,
    title: 'Smartwatch Ultra AMOLED 49mm com Chamadas Bluetooth e Oxímetro',
    category: 'Tech',
    platform: 'Shopee',
    price: 'R$ 169,90',
    rawPrice: 169.90,
    estimatedCommission: 'R$ 16,99 a R$ 23,78',
    commissionRate: '10% a 14%',
    soldQuantity: '+35.000 vendidos',
    rating: 4.8,
    reviewsCount: 8940,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    affiliateUrl: 'https://shopee.com.br',
    demandBadge: '⚡ Explosão de Buscas',
    conversionReason: 'Visual premium de relógio topo de linha com preço extremamente acessível. Conversão rápida por impulso.',
    isHighTicket: false
  },
  {
    id: 'champ-5',
    rank: 5,
    title: 'Robô Aspirador Inteligente WAP Robot W300 Bivolt com Filtro HEPA',
    category: 'Casa e cozinha',
    platform: 'Mercado Livre',
    price: 'R$ 899,00',
    rawPrice: 899.00,
    estimatedCommission: 'R$ 89,90 a R$ 125,86',
    commissionRate: '10% a 14%',
    soldQuantity: '+18.000 vendidos',
    rating: 4.8,
    reviewsCount: 4210,
    image: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=800&q=80',
    affiliateUrl: 'https://mercadolivre.com.br',
    demandBadge: '💰 Alta Comissão',
    conversionReason: 'Ticket alto com comissão expressiva por venda (> R$ 90/venda). Compradores pesquisam reviews antes de comprar.',
    isHighTicket: true
  },
  {
    id: 'champ-6',
    rank: 6,
    title: 'Fone Bluetooth Pro ANC com Cancelamento Ativo de Ruído TWS',
    category: 'Tech',
    platform: 'Shopee',
    price: 'R$ 98,90',
    rawPrice: 98.90,
    estimatedCommission: 'R$ 9,89 a R$ 13,84',
    commissionRate: '10% a 14%',
    soldQuantity: '+65.000 vendidos',
    rating: 4.7,
    reviewsCount: 15200,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    affiliateUrl: 'https://shopee.com.br',
    demandBadge: '🔥 Top 1 Bestseller',
    conversionReason: 'Excelente custo-benefício. Todo usuário que busca áudio sem fio é atraído pelo cancelamento de ruído.',
    isHighTicket: false
  },
  {
    id: 'champ-7',
    rank: 7,
    title: 'Sérum Facial Vitamina C 10% Ácido Hialurônico Concentrado Antioleosidade',
    category: 'Beleza e skincare',
    platform: 'Shopee',
    price: 'R$ 49,90',
    rawPrice: 49.90,
    estimatedCommission: 'R$ 4,99 a R$ 6,98',
    commissionRate: '10% a 14%',
    soldQuantity: '+95.000 vendidos',
    rating: 4.9,
    reviewsCount: 31000,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    affiliateUrl: 'https://shopee.com.br',
    demandBadge: '🎯 Alta Conversão',
    conversionReason: 'Preço baixo que permite compra impulsiva. Ótimo para complementar carrinhos e gerar alto volume de comissão.',
    isHighTicket: false
  },
  {
    id: 'champ-8',
    rank: 8,
    title: 'Câmera de Segurança Wi-Fi 360° Visão Noturna Áudio Bidirecional Full HD',
    category: 'Tech',
    platform: 'Mercado Livre',
    price: 'R$ 139,90',
    rawPrice: 139.90,
    estimatedCommission: 'R$ 13,99 a R$ 19,58',
    commissionRate: '10% a 14%',
    soldQuantity: '+40.000 vendidos',
    rating: 4.8,
    reviewsCount: 7800,
    image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=800&q=80',
    affiliateUrl: 'https://mercadolivre.com.br',
    demandBadge: '⚡ Explosão de Buscas',
    conversionReason: 'Segurança residencial é uma das maiores dores do público. Páginas de review geram taxa de conversão acima de 8%.',
    isHighTicket: false
  }
];

export const TopProductsView: React.FC<TopProductsViewProps> = ({
  onUseProductForReview,
  onSwitchToComparator
}) => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'meli' | 'shopee' | 'highticket'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const categories = [
    { id: 'all', label: 'Todas as Categorias' },
    { id: 'Tech', label: 'Tech & Eletrônicos' },
    { id: 'Casa e cozinha', label: 'Casa & Cozinha' },
    { id: 'Beleza e skincare', label: 'Beleza & Skincare' },
    { id: 'Suplementos e saúde', label: 'Suplementos & Saúde' }
  ];

  const filteredProducts = CHAMPION_PRODUCTS.filter((prod) => {
    if (selectedTab === 'meli' && prod.platform !== 'Mercado Livre') return false;
    if (selectedTab === 'shopee' && prod.platform !== 'Shopee') return false;
    if (selectedTab === 'highticket' && !prod.isHighTicket && prod.rawPrice < 250) return false;
    if (selectedCategory !== 'all' && prod.category !== selectedCategory) return false;
    if (searchFilter.trim() && !prod.title.toLowerCase().includes(searchFilter.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#181508] via-[#121212] to-[#0A0A0A] border border-[#332A15] p-6 md:p-10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5C542]/10 border border-[#F5C542]/30 text-xs font-bold text-[#F5C542] uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" />
              <span>RADAR DE LUCRATIVIDADE · PRODUTOS CAMPEÕES DE VENDA</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
              Produtos <span className="text-[#F5C542]">Campeões de Vendas</span>
            </h1>
            <p className="text-sm text-[#A1A1A1] leading-relaxed">
              Estes são os produtos com o maior volume comprovado de vendas e maior taxa de conversão no Brasil. Escolha qualquer produto abaixo e crie sua página de review com IA com apenas 1 clique.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4">
            <div className="text-center px-3 border-r border-[#222]">
              <span className="text-2xl font-black text-[#F5C542]">8+</span>
              <span className="block text-[10px] text-[#777] uppercase font-bold">Campeões Ativos</span>
            </div>
            <div className="text-center px-3">
              <span className="text-2xl font-black text-[#22C55E]">100%</span>
              <span className="block text-[10px] text-[#777] uppercase font-bold">Validados</span>
            </div>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-[#242424]">
          <button
            onClick={() => setSelectedTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedTab === 'all'
                ? 'bg-[#F5C542] text-black shadow-md'
                : 'bg-[#181818] text-[#9A9A9A] hover:text-white border border-[#2A2A2A]'
            }`}
          >
            🔥 Todos os Campeões
          </button>

          <button
            onClick={() => setSelectedTab('meli')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedTab === 'meli'
                ? 'bg-[#FFE600] text-black shadow-md'
                : 'bg-[#181818] text-[#9A9A9A] hover:text-white border border-[#2A2A2A]'
            }`}
          >
            🟡 Mercado Livre Full
          </button>

          <button
            onClick={() => setSelectedTab('shopee')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedTab === 'shopee'
                ? 'bg-[#EE4D2D] text-white shadow-md'
                : 'bg-[#181818] text-[#9A9A9A] hover:text-white border border-[#2A2A2A]'
            }`}
          >
            🟠 Shopee Mais Vendidos
          </button>

          <button
            onClick={() => setSelectedTab('highticket')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedTab === 'highticket'
                ? 'bg-[#22C55E] text-black shadow-md'
                : 'bg-[#181818] text-[#9A9A9A] hover:text-white border border-[#2A2A2A]'
            }`}
          >
            💰 Alto Ticket (Comissão Acima de R$ 30)
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777]" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filtrar produtos campeões..."
            className="w-full bg-[#121212] border border-[#262626] focus:border-[#F5C542] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-[#666] outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                selectedCategory === cat.id
                  ? 'bg-[#262626] text-white border-[#F5C542]'
                  : 'bg-[#121212] text-[#888] border-[#222] hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Champion Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="group relative rounded-3xl bg-[#121212] border border-[#242424] hover:border-[#F5C542]/50 p-5 space-y-4 flex flex-col justify-between transition-all duration-200 shadow-lg hover:shadow-[#F5C542]/5"
          >
            {/* Top Rank Badge */}
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5C542] text-black text-[11px] font-black uppercase">
                <Trophy className="w-3 h-3" />
                <span>#{prod.rank} Campeão</span>
              </span>

              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                prod.platform === 'Mercado Livre' ? 'bg-[#FFE600]/20 text-[#FFE600]' : 'bg-[#EE4D2D]/20 text-[#EE4D2D]'
              }`}>
                {prod.platform}
              </span>
            </div>

            {/* Image */}
            <div className="w-full h-44 rounded-2xl bg-white/5 border border-[#222] flex items-center justify-center p-3 overflow-hidden relative">
              <img
                src={prod.image}
                alt={prod.title}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-bold text-[#F5C542] border border-[#333]">
                {prod.demandBadge}
              </span>
            </div>

            {/* Title & Stats */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-[#F5C542] transition-colors">
                {prod.title}
              </h3>

              <div className="flex items-center justify-between pt-1">
                <span className="text-lg font-black text-white">{prod.price}</span>
                <div className="flex items-center gap-1 text-[#F5C542] text-xs font-bold">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{prod.rating}</span>
                  <span className="text-[#666] text-[10px]">({prod.soldQuantity})</span>
                </div>
              </div>
            </div>

            {/* Commission Estimate Box */}
            <div className="p-3 rounded-xl bg-[#181818] border border-[#282828] space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#8E8E8E] font-medium flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-[#22C55E]" /> Lucro por Venda:
                </span>
                <span className="text-[#22C55E] font-black">{prod.estimatedCommission}</span>
              </div>
              <p className="text-[10px] text-[#777] line-clamp-2 leading-tight">
                {prod.conversionReason}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() =>
                  onUseProductForReview({
                    productName: prod.title,
                    productPrice: prod.price,
                    productImage: prod.image,
                    productCategory: prod.category,
                    productDescription: prod.conversionReason,
                    affiliateLink: prod.affiliateUrl
                  })
                }
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5C542] hover:bg-[#e5b738] text-black font-black text-xs transition-all shadow-md shadow-[#F5C542]/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Criar Review com IA</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={prod.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#222] text-[#AAA] hover:text-white border border-[#2A2A2A] text-[11px] font-bold transition-all"
                >
                  <span>Ver Oferta</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {onSwitchToComparator && (
                  <button
                    onClick={() => onSwitchToComparator(prod.title)}
                    className="px-3 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#222] text-[#AAA] hover:text-white border border-[#2A2A2A] text-[11px] font-bold transition-all cursor-pointer"
                    title="Comparar com outro produto"
                  >
                    Comparar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
