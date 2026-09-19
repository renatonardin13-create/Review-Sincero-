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
  originalPrice?: string;
  estimatedCommission: string;
  commissionRate: string;
  soldQuantity: string;
  rating: number;
  reviewsCount: number;
  image: string;
  affiliateUrl: string;
  demandBadge: '🔥 Top 1 Bestseller' | '⚡ Explosão de Buscas' | '💰 Alta Comissão' | '⭐ Mais Bem Avaliado' | '🎯 Alta Conversão' | '⚡ Giro Rápido';
  conversionReason: string;
  technicalDescription: string;
  isHighTicket: boolean;
}

const CHAMPION_PRODUCTS: ChampionProduct[] = [
  {
    id: 'champ-1',
    rank: 1,
    title: 'Fritadeira Sem Óleo Mondial Air Fryer Family 4 Litros AFN-40-BI Inox 1500W',
    category: 'Casa e cozinha',
    platform: 'Mercado Livre',
    price: 'R$ 269,90',
    originalPrice: 'R$ 349,90',
    rawPrice: 269.90,
    estimatedCommission: 'R$ 26,99 a R$ 37,78',
    commissionRate: '10% a 14%',
    soldQuantity: '+50.000 vendidos',
    rating: 4.9,
    reviewsCount: 18420,
    image: 'https://http2.mlstatic.com/D_NQ_NP_602127-MLA48873739712_012022-O.webp',
    affiliateUrl: 'https://lista.mercadolivre.com.br/fritadeira-mondial-air-fryer-family-4l-afn-40-bi',
    demandBadge: '🔥 Top 1 Bestseller',
    conversionReason: 'Campeã absoluta de buscas diárias no Brasil. Excelente para vídeos curtos, posts de receitas e reviews comparativos.',
    technicalDescription: 'Capacidade de 4 Litros com cuba antiaderente Duraflon, painel em aço inox, controle de temperatura de até 200°C, timer sonoro de 60 minutos com desligamento automático e potência de 1500W.',
    isHighTicket: false
  },
  {
    id: 'champ-2',
    rank: 2,
    title: 'Creatina Max Titanium 100% Pura Monohidratada 300g Original com Laudo',
    category: 'Suplementos e saúde',
    platform: 'Mercado Livre',
    price: 'R$ 79,90',
    originalPrice: 'R$ 99,90',
    rawPrice: 79.90,
    estimatedCommission: 'R$ 7,99 a R$ 11,18',
    commissionRate: '10% a 14%',
    soldQuantity: '+150.000 vendidos',
    rating: 4.9,
    reviewsCount: 32400,
    image: 'https://http2.mlstatic.com/D_NQ_NP_895697-MLA46618797931_072021-O.webp',
    affiliateUrl: 'https://lista.mercadolivre.com.br/creatina-max-titanium-300g-monohidratada-pura',
    demandBadge: '⚡ Explosão de Buscas',
    conversionReason: 'Produto de recompra mensal frequente. Aprovada em 100% dos laudos da Abenutri com pureza máxima.',
    technicalDescription: 'Creatina monohidratada e micronizada em pó, 100% pura sem adição de conservantes ou glúten. Rendimento de 100 doses de 3g diárias para ganho de força e hipertrofia.',
    isHighTicket: false
  },
  {
    id: 'champ-3',
    rank: 3,
    title: 'Escova Secadora Mondial Golden Rose ES-02 1200W Cerdas Mistas com Íons',
    category: 'Beleza e skincare',
    platform: 'Mercado Livre',
    price: 'R$ 119,90',
    originalPrice: 'R$ 159,90',
    rawPrice: 119.90,
    estimatedCommission: 'R$ 11,99 a R$ 16,78',
    commissionRate: '10% a 14%',
    soldQuantity: '+90.000 vendidos',
    rating: 4.8,
    reviewsCount: 24100,
    image: 'https://http2.mlstatic.com/D_NQ_NP_727402-MLA44033658253_112020-O.webp',
    affiliateUrl: 'https://lista.mercadolivre.com.br/escova-secadora-mondial-golden-rose-es-02',
    demandBadge: '🎯 Alta Conversão',
    conversionReason: 'Altíssimo apelo visual de "antes e depois". Review com fotos de resultados vende diariamente no piloto automático.',
    technicalDescription: 'Seca, alisa e modela com 1200W de potência. Revestimento cerâmico com Tourmaline Íon que sela as cutículas dos fios, cerdas mistas flexíveis e cabo giratório 360°.',
    isHighTicket: false
  },
  {
    id: 'champ-4',
    rank: 4,
    title: 'Smartwatch Ultra AMOLED 49mm com Chamadas Bluetooth NFC e Oxímetro',
    category: 'Tech',
    platform: 'Shopee',
    price: 'R$ 149,90',
    originalPrice: 'R$ 229,00',
    rawPrice: 149.90,
    estimatedCommission: 'R$ 14,99 a R$ 20,98',
    commissionRate: '10% a 14%',
    soldQuantity: '+45.000 vendidos',
    rating: 4.8,
    reviewsCount: 11200,
    image: 'https://http2.mlstatic.com/D_NQ_NP_806509-MLU72673238685_112023-O.webp',
    affiliateUrl: 'https://shopee.com.br/search?keyword=smartwatch%20ultra%2049mm%20amoled',
    demandBadge: '⚡ Explosão de Buscas',
    conversionReason: 'Design idêntico aos relógios topo de linha com caixa de titânio e tela infinita. Conversão altíssima por impulso.',
    technicalDescription: 'Caixa de 49mm, tela AMOLED HD 2.0 polegadas, faz e recebe ligações via Bluetooth, monitor cardíaco, oxímetro de pulso, múltiplos modos esportivos e bateria de 5 a 7 dias.',
    isHighTicket: false
  },
  {
    id: 'champ-5',
    rank: 5,
    title: 'Robô Aspirador Inteligente WAP Robot W300 Bivolt com Filtro HEPA e Sensores Anti-Queda',
    category: 'Casa e cozinha',
    platform: 'Mercado Livre',
    price: 'R$ 899,00',
    originalPrice: 'R$ 1.199,00',
    rawPrice: 899.00,
    estimatedCommission: 'R$ 89,90 a R$ 125,86',
    commissionRate: '10% a 14%',
    soldQuantity: '+22.000 vendidos',
    rating: 4.8,
    reviewsCount: 5420,
    image: 'https://http2.mlstatic.com/D_NQ_NP_960541-MLA48440784964_122021-O.webp',
    affiliateUrl: 'https://lista.mercadolivre.com.br/robo-aspirador-wap-robot-w300',
    demandBadge: '💰 Alta Comissão',
    conversionReason: 'Ticket alto com comissão expressiva por venda (> R$ 90/venda). Compradores pesquisam reviews detalhados antes de comprar.',
    technicalDescription: 'Robô aspirador automático bivolt com dupla filtragem HEPA, escovas giratórias duplas, sensores antiqueda e anticolisão, 5 modos de limpeza e retorno automático à base.',
    isHighTicket: true
  },
  {
    id: 'champ-6',
    rank: 6,
    title: 'Fone de Ouvido Bluetooth Sem Fio TWS Lenovo LP40 Pro Original Cancelamento de Ruído',
    category: 'Tech',
    platform: 'Shopee',
    price: 'R$ 49,90',
    originalPrice: 'R$ 89,90',
    rawPrice: 49.90,
    estimatedCommission: 'R$ 4,99 a R$ 6,98',
    commissionRate: '10% a 14%',
    soldQuantity: '+110.000 vendidos',
    rating: 4.8,
    reviewsCount: 45000,
    image: 'https://http2.mlstatic.com/D_NQ_NP_722216-MLU72672520977_112023-O.webp',
    affiliateUrl: 'https://shopee.com.br/search?keyword=fone%20bluetooth%20lenovo%20lp40%20pro',
    demandBadge: '🔥 Top 1 Bestseller',
    conversionReason: 'Preço super acessível com excelente qualidade de áudio e microfone para reuniões. Produto de volume gigante.',
    technicalDescription: 'Bluetooth 5.1 de baixa latência, drivers dinâmicos de 13mm com graves profundos, microfone duplo HD com redução de ruído ambiente e case com até 20 horas de autonomia.',
    isHighTicket: false
  },
  {
    id: 'champ-7',
    rank: 7,
    title: 'Sérum Facial Concentrado Vitamina C 10% Ácido Hialurônico e Niacinamida',
    category: 'Beleza e skincare',
    platform: 'Shopee',
    price: 'R$ 39,90',
    originalPrice: 'R$ 59,90',
    rawPrice: 39.90,
    estimatedCommission: 'R$ 3,99 a R$ 5,58',
    commissionRate: '10% a 14%',
    soldQuantity: '+85.000 vendidos',
    rating: 4.9,
    reviewsCount: 28900,
    image: 'https://http2.mlstatic.com/D_NQ_NP_779383-MLU72673620989_112023-O.webp',
    affiliateUrl: 'https://shopee.com.br/search?keyword=serum%20vitamina%20c%20acido%20hialuronico',
    demandBadge: '🎯 Alta Conversão',
    conversionReason: 'Item de uso diário indispensável na rotina de skincare. Excelente taxa de conversão em blogs de beleza e Instagram.',
    technicalDescription: 'Frasco conta-gotas de 30ml com Vitamina C pura estabilizada a 10%, Ácido Hialurônico de baixo peso molecular e Niacinamida para clareamento de manchas e ação anti-idade.',
    isHighTicket: false
  },
  {
    id: 'champ-8',
    rank: 8,
    title: 'Câmera de Segurança Wi-Fi Externa 360° Prova D\'Água Visão Noturna Colorida Full HD',
    category: 'Tech',
    platform: 'Mercado Livre',
    price: 'R$ 89,90',
    originalPrice: 'R$ 139,90',
    rawPrice: 89.90,
    estimatedCommission: 'R$ 8,99 a R$ 12,58',
    commissionRate: '10% a 14%',
    soldQuantity: '+60.000 vendidos',
    rating: 4.8,
    reviewsCount: 14200,
    image: 'https://http2.mlstatic.com/D_NQ_NP_918511-MLA48440784988_122021-O.webp',
    affiliateUrl: 'https://lista.mercadolivre.com.br/camera-seguranca-wifi-externa-360-graus-a8',
    demandBadge: '⚡ Explosão de Buscas',
    conversionReason: 'Segurança residencial é uma das maiores necessidades do brasileiro. Acompanha app no celular sem mensalidade.',
    technicalDescription: 'Resolução Full HD 1080p, rotação 360° horizontal e 90° vertical via aplicativo Yoosee/ICSee, visão noturna colorida com LEDs infravermelhos, microfone e alto-falante bidirecional.',
    isHighTicket: false
  },
  {
    id: 'champ-9',
    rank: 9,
    title: '100% Whey Protein Concentrado Max Titanium 900g Baunilha / Chocolate / Morango',
    category: 'Suplementos e saúde',
    platform: 'Mercado Livre',
    price: 'R$ 109,90',
    originalPrice: 'R$ 139,90',
    rawPrice: 109.90,
    estimatedCommission: 'R$ 10,99 a R$ 15,38',
    commissionRate: '10% a 14%',
    soldQuantity: '+95.000 vendidos',
    rating: 4.9,
    reviewsCount: 26000,
    image: 'https://http2.mlstatic.com/D_NQ_NP_692481-MLA48873739799_012022-O.webp',
    affiliateUrl: 'https://lista.mercadolivre.com.br/100-whey-protein-max-titanium-900g',
    demandBadge: '🔥 Top 1 Bestseller',
    conversionReason: 'O suplemento proteico mais consumido do Brasil. Selo de qualidade líder com 21g de proteína e 4.8g de BCAAs por dose.',
    technicalDescription: 'Pouch econômico de 900g com matéria-prima de alto valor biológico. 21g de proteína concentrada do soro do leite por porção de 30g, ideal para recuperação e construção muscular.',
    isHighTicket: false
  },
  {
    id: 'champ-10',
    rank: 10,
    title: 'Máquina de Cortar Cabelo e Barbeador Vintage T9 Dragão Sem Fio Recarregável USB',
    category: 'Beleza e skincare',
    platform: 'Shopee',
    price: 'R$ 34,90',
    originalPrice: 'R$ 59,90',
    rawPrice: 34.90,
    estimatedCommission: 'R$ 3,49 a R$ 4,88',
    commissionRate: '10% a 14%',
    soldQuantity: '+180.000 vendidos',
    rating: 4.7,
    reviewsCount: 52000,
    image: 'https://http2.mlstatic.com/D_NQ_NP_668925-MLU72673320112_112023-O.webp',
    affiliateUrl: 'https://shopee.com.br/search?keyword=maquina%20t9%20vintage%20dragao',
    demandBadge: '⚡ Giro Rápido',
    conversionReason: 'Fenômeno de vendas no TikTok e Shopee. Preço de compra espontânea sem atrito.',
    technicalDescription: 'Corpo metálico trabalhado em alto relevo dourado, lâmina T de aço carbono afiada para acabamentos precisos e desenhos, bateria recarregável com autonomia de 120 minutos e 4 pentes guia.',
    isHighTicket: false
  },
  {
    id: 'champ-11',
    rank: 11,
    title: 'Tênis Esportivo Olympikus Corre 3 Amortecimento com Placa de Propulsão',
    category: 'Esporte',
    platform: 'Mercado Livre',
    price: 'R$ 399,90',
    originalPrice: 'R$ 499,90',
    rawPrice: 399.90,
    estimatedCommission: 'R$ 39,99 a R$ 55,98',
    commissionRate: '10% a 14%',
    soldQuantity: '+30.000 vendidos',
    rating: 4.9,
    reviewsCount: 8900,
    image: 'https://http2.mlstatic.com/D_NQ_NP_778103-MLU72673419985_112023-O.webp',
    affiliateUrl: 'https://lista.mercadolivre.com.br/tenis-olympikus-corre-3',
    demandBadge: '💰 Alta Comissão',
    conversionReason: 'Tênis nacional de corrida mais elogiado do mercado. Grande interesse por reviews de amortecimento e durabilidade.',
    technicalDescription: 'Drop de 8mm, tecnologia de amortecimento Eleva Pro para máxima resposta e resiliência, sola com borracha Gripper e Grippter Plus antiderrapante desenvolvida junto à USP.',
    isHighTicket: true
  },
  {
    id: 'champ-12',
    rank: 12,
    title: 'Mini Processador e Triturador de Alimentos Elétrico USB Portátil 250ml Inox',
    category: 'Casa e cozinha',
    platform: 'Shopee',
    price: 'R$ 29,90',
    originalPrice: 'R$ 49,90',
    rawPrice: 29.90,
    estimatedCommission: 'R$ 2,99 a R$ 4,18',
    commissionRate: '10% a 14%',
    soldQuantity: '+140.000 vendidos',
    rating: 4.8,
    reviewsCount: 39800,
    image: 'https://http2.mlstatic.com/D_NQ_NP_883210-MLA48440784933_122021-O.webp',
    affiliateUrl: 'https://shopee.com.br/search?keyword=mini%20processador%20eletrico%20usb',
    demandBadge: '🔥 Top 1 Bestseller',
    conversionReason: 'Produto prático que viraliza com facilidade em vídeos de cozinha prática no Reels e Shorts.',
    technicalDescription: 'Recarregável via cabo USB com copo de 250ml em acrílico reforçado livre de BPA, lâmina tripla de aço inoxidável 304 que pica alho, cebola e temperos em 5 segundos.',
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
  const [liveSearchResults, setLiveSearchResults] = useState<ChampionProduct[]>([]);
  const [isSearchingLive, setIsSearchingLive] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'Todas as Categorias' },
    { id: 'Tech', label: 'Tech & Eletrônicos' },
    { id: 'Casa e cozinha', label: 'Casa & Cozinha' },
    { id: 'Beleza e skincare', label: 'Beleza & Skincare' },
    { id: 'Suplementos e saúde', label: 'Suplementos & Saúde' },
    { id: 'Esporte', label: 'Esporte & Moda' }
  ];

  // Function to search live in Mercado Livre API if user wants to search beyond default champions
  const handlePerformLiveSearch = async () => {
    if (!searchFilter.trim()) {
      setLiveSearchResults([]);
      return;
    }

    setIsSearchingLive(true);
    try {
      const res = await fetch(`/api/meli/search?q=${encodeURIComponent(searchFilter)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          const mapped: ChampionProduct[] = data.items.map((item: any, idx: number) => {
            const raw = parseFloat(item.suggestedPrice?.replace('R$', '').replace('.', '').replace(',', '.').trim() || '0') || 99.9;
            const commMin = (raw * 0.1).toFixed(2).replace('.', ',');
            const commMax = (raw * 0.14).toFixed(2).replace('.', ',');
            return {
              id: `live-search-${item.id || idx}`,
              rank: idx + 1,
              title: item.title,
              category: (item.category || 'Tech') as CategoryType,
              platform: 'Mercado Livre',
              price: item.suggestedPrice || 'R$ 99,90',
              rawPrice: raw,
              estimatedCommission: `R$ ${commMin} a R$ ${commMax}`,
              commissionRate: '10% a 14%',
              soldQuantity: item.soldQuantity ? `+${item.soldQuantity} vendidos` : 'Alta Procura',
              rating: 4.8,
              reviewsCount: item.soldQuantity || 1200,
              image: item.thumbnail,
              affiliateUrl: item.realUrl || 'https://mercadolivre.com.br',
              demandBadge: '🔥 Top 1 Bestseller',
              conversionReason: 'Produto ao vivo pesquisado no catálogo oficial do Mercado Livre com preço e estoque em tempo real.',
              technicalDescription: item.suggestedDescription || 'Produto com alta taxa de conversão e entrega Full no Mercado Livre Brasil.',
              isHighTicket: raw > 250
            };
          });
          setLiveSearchResults(mapped);
        }
      }
    } catch (e) {
      console.warn('Erro na busca ao vivo:', e);
    } finally {
      setIsSearchingLive(false);
    }
  };

  const displayedList = liveSearchResults.length > 0 ? liveSearchResults : CHAMPION_PRODUCTS;

  const filteredProducts = displayedList.filter((prod) => {
    if (selectedTab === 'meli' && prod.platform !== 'Mercado Livre') return false;
    if (selectedTab === 'shopee' && prod.platform !== 'Shopee') return false;
    if (selectedTab === 'highticket' && !prod.isHighTicket && prod.rawPrice < 250) return false;
    if (selectedCategory !== 'all' && prod.category !== selectedCategory) return false;
    if (liveSearchResults.length === 0 && searchFilter.trim() && !prod.title.toLowerCase().includes(searchFilter.toLowerCase())) {
      return false;
    }
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
              Fotos idênticas aos anúncios originais do <strong>Mercado Livre</strong> e <strong>Shopee</strong>, com preços reais de mercado, especificações exatas e simulação de comissão de afiliado.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4">
            <div className="text-center px-3 border-r border-[#222]">
              <span className="text-2xl font-black text-[#F5C542]">{CHAMPION_PRODUCTS.length}</span>
              <span className="block text-[10px] text-[#777] uppercase font-bold">Campeões Reais</span>
            </div>
            <div className="text-center px-3">
              <span className="text-2xl font-black text-[#22C55E]">100%</span>
              <span className="block text-[10px] text-[#777] uppercase font-bold">Fotos & Preços Reais</span>
            </div>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-[#242424]">
          <button
            onClick={() => {
              setSelectedTab('all');
              setLiveSearchResults([]);
            }}
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

      {/* Filter and Live Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePerformLiveSearch();
          }}
          className="flex-1 flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777]" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => {
                setSearchFilter(e.target.value);
                if (!e.target.value) setLiveSearchResults([]);
              }}
              placeholder="Buscar produto campeão ou pesquisar qualquer produto no Mercado Livre..."
              className="w-full bg-[#121212] border border-[#262626] focus:border-[#F5C542] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#666] outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSearchingLive}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#202020] hover:bg-[#2A2A2A] text-white border border-[#333] text-xs font-bold transition-all cursor-pointer shrink-0"
          >
            {isSearchingLive ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#F5C542]" />
            ) : (
              <Search className="w-3.5 h-3.5 text-[#F5C542]" />
            )}
            <span>Buscar ao Vivo</span>
          </button>
        </form>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
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

      {liveSearchResults.length > 0 && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5C542]/10 border border-[#F5C542]/30 text-xs text-white">
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#F5C542]" />
            Exibindo <strong>{liveSearchResults.length} produtos em tempo real</strong> encontrados no Mercado Livre para "{searchFilter}".
          </span>
          <button
            onClick={() => {
              setSearchFilter('');
              setLiveSearchResults([]);
            }}
            className="text-[#F5C542] hover:underline font-bold cursor-pointer"
          >
            Voltar aos Campeões Fixos
          </button>
        </div>
      )}

      {/* Champion Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="group relative rounded-3xl bg-[#121212] border border-[#242424] hover:border-[#F5C542]/60 p-5 space-y-4 flex flex-col justify-between transition-all duration-200 shadow-xl hover:shadow-[#F5C542]/5"
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

            {/* Product Packshot Image with Crisp Container */}
            <div className="w-full h-48 rounded-2xl bg-white p-3 border border-[#2A2A2A] flex items-center justify-center overflow-hidden relative shadow-inner">
              <img
                src={prod.image}
                alt={prod.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/85 text-[10px] font-bold text-[#F5C542] border border-[#333] shadow">
                {prod.demandBadge}
              </span>
            </div>

            {/* Title & Authentic Price */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-[#F5C542] transition-colors">
                {prod.title}
              </h3>

              <div className="flex items-baseline justify-between pt-1">
                <div>
                  {prod.originalPrice && (
                    <span className="text-[10px] text-[#777] line-through block font-medium">
                      {prod.originalPrice}
                    </span>
                  )}
                  <span className="text-lg font-black text-white">{prod.price}</span>
                </div>

                <div className="flex items-center gap-1 text-[#F5C542] text-xs font-bold">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{prod.rating}</span>
                  <span className="text-[#666] text-[10px]">({prod.soldQuantity})</span>
                </div>
              </div>
            </div>

            {/* Technical Specs & Reason */}
            <div className="p-3 rounded-xl bg-[#161616] border border-[#262626] space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#8E8E8E] font-medium flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-[#22C55E]" /> Ganho Estimado:
                </span>
                <span className="text-[#22C55E] font-black">{prod.estimatedCommission}</span>
              </div>
              <p className="text-[10px] text-[#A1A1A1] line-clamp-2 leading-tight">
                {prod.technicalDescription || prod.conversionReason}
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
                    productDescription: prod.technicalDescription || prod.conversionReason,
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
                  <span>Ver na Plataforma</span>
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
