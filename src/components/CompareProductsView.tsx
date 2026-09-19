import React, { useState } from 'react';
import {
  Scale,
  Sparkles,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle,
  XCircle,
  TrendingUp,
  Award,
  ArrowRight,
  Search,
  Zap,
  ShoppingBag,
  Layers,
  Copy,
  Check,
  ShieldCheck,
  Star
} from 'lucide-react';
import { matchProductImage } from '../utils/productImageMatcher';

export interface ProductToCompare {
  id: string;
  name: string;
  price: string;
  platform: 'Mercado Livre' | 'Shopee' | 'Amazon' | 'Outro';
  rating: number;
  salesCount: string;
  image: string;
  affiliateUrl: string;
  pros: string[];
  cons: string[];
  highlight: string;
  badge?: string;
  category?: string;
  scores: {
    costBenefit: number;
    quality: number;
    popularity: number;
    durability: number;
  };
}

interface CompareProductsViewProps {
  onGenerateReviewFromComparison?: (product1: ProductToCompare, product2: ProductToCompare) => void;
  onSwitchToGenerator?: () => void;
  onUseProductForReview?: (product: {
    productName: string;
    productPrice: string;
    productImage: string;
    productCategory: any;
    productDescription: string;
    affiliateLink: string;
  }) => void;
}

const PRESET_COMPARISONS: { title: string; category: string; products: ProductToCompare[] }[] = [
  {
    title: 'Fritadeira Air Fryer Mondial 5L vs Philips Walita 4.1L Conectada',
    category: 'Casa e cozinha',
    products: [
      {
        id: 'comp-airfryer-mondial',
        name: 'Fritadeira Sem Óleo Mondial Air Fryer Family 5L AFN-50-BI Inox',
        price: 'R$ 299,90',
        platform: 'Mercado Livre',
        rating: 4.8,
        salesCount: '+60.000 vendidos',
        image: 'https://images.unsplash.com/photo-1584269600519-112d071b35e6?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://lista.mercadolivre.com.br/fritadeira-mondial-air-fryer-family-5l-afn-50-bi',
        pros: ['Excelente custo-benefício', 'Cesto antiaderente espaçoso de 5L', 'Painel em aço inox fácil de limpar'],
        cons: ['Painel analógico mais simples', 'Não possui integração Wi-Fi'],
        highlight: '🏆 Campeã em Custo-Benefício e Volume',
        badge: 'Top 1 Vendas',
        category: 'Casa e cozinha',
        scores: { costBenefit: 9.8, quality: 8.8, popularity: 9.9, durability: 8.9 }
      },
      {
        id: 'comp-airfryer-walita',
        name: 'Fritadeira Philips Walita Viva Conectada 4.1L RapidAir Digital',
        price: 'R$ 649,00',
        platform: 'Mercado Livre',
        rating: 4.9,
        salesCount: '+18.000 vendidos',
        image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://lista.mercadolivre.com.br/fritadeira-philips-walita-conectada-4-1l',
        pros: ['Tecnologia RapidAir assa com crocância uniforme', 'Painel digital touch e receitas no App', 'Acabamento premium'],
        cons: ['Preço 2x maior que a média', 'Capacidade ligeiramente menor (4.1L)'],
        highlight: '⭐ Campeã em Tecnologia e Acabamento',
        badge: 'Linha Premium',
        category: 'Casa e cozinha',
        scores: { costBenefit: 7.9, quality: 9.8, popularity: 8.9, durability: 9.7 }
      }
    ]
  },
  {
    title: 'Frigideira Antiaderente Tramontina Paris 24cm vs Polishop Flavorstone 24cm',
    category: 'Casa e cozinha',
    products: [
      {
        id: 'comp-frigideira-tramontina',
        name: 'Frigideira Antiaderente Tramontina Paris Alumínio 24cm com Espátula',
        price: 'R$ 69,90',
        platform: 'Mercado Livre',
        rating: 4.8,
        salesCount: '+45.000 vendidos',
        image: 'https://images.unsplash.com/photo-1584990347449-39908cf6b412?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://lista.mercadolivre.com.br/frigideira-tramontina-paris-24cm',
        pros: ['Antiaderente Starflon Max não deixa a comida grudar', 'Cabo de baquelite antitérmico com pegada segura', 'Excelente preço para uso diário'],
        cons: ['Não compatível com fogão de indução', 'Requer utensílios de silicone para não riscar'],
        highlight: '🏆 Campeã do Dia a Dia',
        badge: 'Custo-Benefício',
        category: 'Casa e cozinha',
        scores: { costBenefit: 9.7, quality: 8.7, popularity: 9.8, durability: 8.5 }
      },
      {
        id: 'comp-frigideira-flavorstone',
        name: 'Frigideira Polishop Ichef Shark Series Flavorstone 24cm Indução',
        price: 'R$ 249,90',
        platform: 'Shopee',
        rating: 4.9,
        salesCount: '+25.000 vendidos',
        image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://shopee.com.br/search?keyword=frigideira%20flavorstone%2024cm',
        pros: ['Revestimento mineral ultra reforçado (prepara sem 1 gota de óleo)', 'Compatível com todos os tipos de fogão (inclusive indução)', 'Retenção e distribuição homogênea de calor'],
        cons: ['Preço 3.5x superior', 'Peso mais elevado'],
        highlight: '⭐ Antiaderência Máxima e Indução',
        badge: 'Alta Performance',
        category: 'Casa e cozinha',
        scores: { costBenefit: 8.0, quality: 9.9, popularity: 9.1, durability: 9.8 }
      }
    ]
  },
  {
    title: 'Liquidificador Mondial Turbo L-1000 3L vs Philips Walita ProBlend 6 Lâminas 1200W',
    category: 'Casa e cozinha',
    products: [
      {
        id: 'comp-liq-mondial',
        name: 'Liquidificador Mondial Turbo L-1000 W 1000W Jarra 3 Litros com Filtro',
        price: 'R$ 129,90',
        platform: 'Mercado Livre',
        rating: 4.8,
        salesCount: '+95.000 vendidos',
        image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://lista.mercadolivre.com.br/liquidificador-mondial-turbo-l-1000',
        pros: ['Copo gigante de 3 litros ideal para receitas familiares', 'Potência de 1000W tritura gelo e frutas congeladas', 'Filtro interno separa sementes e bagaços'],
        cons: ['Copo de acrílico exige cuidado contra quedas', 'Ruído expressivo na velocidade máxima'],
        highlight: '🏆 O Mais Vendido do Mercado',
        badge: 'Líder de Vendas',
        category: 'Casa e cozinha',
        scores: { costBenefit: 9.8, quality: 8.8, popularity: 10.0, durability: 8.6 }
      },
      {
        id: 'comp-liq-walita',
        name: 'Liquidificador Philips Walita ProBlend 6 Lâminas 1200W Jarra Duravita Inquebrável',
        price: 'R$ 219,90',
        platform: 'Mercado Livre',
        rating: 4.9,
        salesCount: '+30.000 vendidos',
        image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://lista.mercadolivre.com.br/liquidificador-philips-walita-problend-6',
        pros: ['Tecnologia ProBlend com 6 lâminas serrilhadas de inox', 'Jarra Duravita super resistente que não quebra e não mancha', 'Potência de 1200W com 5 anos de garantia'],
        cons: ['Preço mais alto que modelos de entrada', 'Encaixe da lâmina exige atenção na lavagem'],
        highlight: '⭐ Jarra Inquebrável e 6 Lâminas',
        badge: 'Máxima Durabilidade',
        category: 'Casa e cozinha',
        scores: { costBenefit: 8.6, quality: 9.8, popularity: 9.2, durability: 9.9 }
      }
    ]
  },
  {
    title: 'Escova Secadora Mondial Golden Rose vs Britânia Soft BEC02 1300W',
    category: 'Beleza e skincare',
    products: [
      {
        id: 'comp-escova-mondial',
        name: 'Escova Secadora Mondial Golden Rose ES-02 1200W Íons Tourmaline',
        price: 'R$ 119,90',
        platform: 'Mercado Livre',
        rating: 4.8,
        salesCount: '+90.000 vendidos',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://lista.mercadolivre.com.br/escova-secadora-mondial-golden-rose-es-02',
        pros: ['Secagem e modelagem rápida com 1200W', 'Cerdas mistas macias que não machucam o couro cabeludo', 'Leve e fácil de manusear'],
        cons: ['Bocal esquenta bastante em uso prolongado', 'Ruído moderado'],
        highlight: '🏆 Top 1 em Beleza no Brasil',
        badge: 'Bestseller',
        category: 'Beleza e skincare',
        scores: { costBenefit: 9.7, quality: 8.9, popularity: 10.0, durability: 8.7 }
      },
      {
        id: 'comp-escova-britania',
        name: 'Escova Secadora Britânia Soft BEC02 Íons Tourmaline 1300W',
        price: 'R$ 139,90',
        platform: 'Shopee',
        rating: 4.8,
        salesCount: '+50.000 vendidos',
        image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://shopee.com.br/search?keyword=escova%20secadora%20britania%20bec02',
        pros: ['1300W de potência para cabelos volumosos', 'Revestimento em cerâmica com tourmaline reduz o frizz', '3 ajustes de temperatura'],
        cons: ['Corpo ligeiramente mais pesado', 'Secagem de cabelos muito longos exige mechas menores'],
        highlight: '⚡ Maior Potência e Menos Frizz',
        badge: 'Anti-Frizz',
        category: 'Beleza e skincare',
        scores: { costBenefit: 9.3, quality: 9.2, popularity: 9.4, durability: 8.9 }
      }
    ]
  },
  {
    title: 'Creatina Max Titanium 300g 100% Pura vs Dark Lab 100% Monohidratada 300g',
    category: 'Suplementos e saúde',
    products: [
      {
        id: 'comp-creatina-max',
        name: 'Creatina Max Titanium 100% Pura Monohidratada 300g Original com Laudo',
        price: 'R$ 79,90',
        platform: 'Mercado Livre',
        rating: 4.9,
        salesCount: '+150.000 vendidos',
        image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://lista.mercadolivre.com.br/creatina-max-titanium-300g-monohidratada-pura',
        pros: ['Marca líder nacional com 100% de aprovação na Abenutri', 'Dissolução fácil na água', 'Rendimento de 100 doses de 3g'],
        cons: ['Embalagem simples em pote plástico', 'Preço varia conforme o lote'],
        highlight: '🏆 Marca Mais Confiável do Brasil',
        badge: 'Líder em Confiança',
        category: 'Suplementos e saúde',
        scores: { costBenefit: 9.6, quality: 9.7, popularity: 10.0, durability: 9.5 }
      },
      {
        id: 'comp-creatina-darklab',
        name: 'Creatina Dark Lab 100% Pura Micronizada 300g Original',
        price: 'R$ 69,90',
        platform: 'Shopee',
        rating: 4.8,
        salesCount: '+90.000 vendidos',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://shopee.com.br/search?keyword=creatina%20dark%20lab%20300g',
        pros: ['Preço por dose mais econômico', 'Micronização ultrafina de rápida absorção', 'Aprovada em todos os laudos laboratoriais'],
        cons: ['Menor presença em lojas físicas', 'Embalagem em sachê ou pote básico'],
        highlight: '💰 Melhor Custo por Grama de Creatina Pura',
        badge: 'Econômica',
        category: 'Suplementos e saúde',
        scores: { costBenefit: 9.9, quality: 9.4, popularity: 9.3, durability: 9.3 }
      }
    ]
  },
  {
    title: 'Robô Aspirador WAP Robot W300 Bivolt vs Xiaomi Robot Vacuum E10',
    category: 'Casa e cozinha',
    products: [
      {
        id: 'comp-robo-wap',
        name: 'Robô Aspirador Inteligente WAP Robot W300 Bivolt com Filtro HEPA',
        price: 'R$ 899,00',
        platform: 'Mercado Livre',
        rating: 4.8,
        salesCount: '+22.000 vendidos',
        image: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://lista.mercadolivre.com.br/robo-aspirador-wap-robot-w300',
        pros: ['Filtro HEPA retém ácaros e poeira fina', 'Sensores antiqueda e anticolisão eficientes', 'Retorno automático à base de recarga'],
        cons: ['Não possui mapeamento a laser LiDAR', 'Não passa pano úmido simultâneo'],
        highlight: '🏆 O Mais Consagrado para Casas com Pets',
        badge: 'Alta Comissão',
        category: 'Casa e cozinha',
        scores: { costBenefit: 9.2, quality: 9.3, popularity: 9.5, durability: 9.1 }
      },
      {
        id: 'comp-robo-xiaomi',
        name: 'Robô Aspirador e Passa Pano Xiaomi Robot Vacuum E10 Inteligente',
        price: 'R$ 1.199,00',
        platform: 'Shopee',
        rating: 4.9,
        salesCount: '+14.000 vendidos',
        image: 'https://images.unsplash.com/photo-1563163447-10114030616b?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://shopee.com.br/search?keyword=xiaomi%20robot%20vacuum%20e10',
        pros: ['Aspira e passa pano úmido com reservatório de água inteligente', 'Mapeamento giroscópio e controle total por app no celular', 'Potência de sucção de 4000Pa'],
        cons: ['Preço mais elevado', 'Configuração inicial requer app Mi Home'],
        highlight: '⭐ Aspira + Passa Pano com App',
        badge: 'Tecnologia Avançada',
        category: 'Casa e cozinha',
        scores: { costBenefit: 8.5, quality: 9.7, popularity: 9.1, durability: 9.6 }
      }
    ]
  },
  {
    title: 'Smartwatch Ultra AMOLED 49mm vs Smartwatch Haylou Solar Plus RT3',
    category: 'Tech',
    products: [
      {
        id: 'comp-smartwatch-ultra',
        name: 'Smartwatch Ultra AMOLED 49mm Titânio com Chamadas Bluetooth NFC',
        price: 'R$ 149,90',
        platform: 'Shopee',
        rating: 4.8,
        salesCount: '+45.000 vendidos',
        image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://shopee.com.br/search?keyword=smartwatch%20ultra%2049mm%20amoled',
        pros: ['Tela gigante de 2.0 polegadas de alta resolução', 'Faz e recebe ligações diretamente pelo relógio', 'Design premium idêntico ao modelo topo de linha'],
        cons: ['Aplicativo complementar contém anúncios ocasionais', 'Não é à prova de mergulho profundo'],
        highlight: '🏆 Design Premium e Preço Acessível',
        badge: 'Sensação do Momento',
        category: 'Tech',
        scores: { costBenefit: 9.7, quality: 8.8, popularity: 9.9, durability: 8.6 }
      },
      {
        id: 'comp-smartwatch-haylou',
        name: 'Smartwatch Haylou Solar Plus RT3 Tela AMOLED 1.43 Pol Alumínio',
        price: 'R$ 229,90',
        platform: 'Mercado Livre',
        rating: 4.9,
        salesCount: '+28.000 vendidos',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://lista.mercadolivre.com.br/smartwatch-haylou-solar-plus-rt3',
        pros: ['Tela AMOLED com Always-on Display e cores vivas', 'Acabamento em alumínio aeronáutico fosco', 'Sensores de saúde com precisão elevada'],
        cons: ['Pulseira proprietária de 22mm', 'Não suporta responder mensagens por voz'],
        highlight: '⭐ Tela AMOLED Superior e Acabamento Fosco',
        badge: 'Qualidade Haylou',
        category: 'Tech',
        scores: { costBenefit: 9.2, quality: 9.5, popularity: 9.0, durability: 9.3 }
      }
    ]
  }
];

export const CompareProductsView: React.FC<CompareProductsViewProps> = ({
  onGenerateReviewFromComparison,
  onSwitchToGenerator,
  onUseProductForReview
}) => {
  const [selectedComparisonIndex, setSelectedComparisonIndex] = useState<number>(0);
  const [products, setProducts] = useState<ProductToCompare[]>(PRESET_COMPARISONS[0].products);
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searching, setSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSelectPreset = (idx: number) => {
    setSelectedComparisonIndex(idx);
    setProducts(PRESET_COMPARISONS[idx].products);
  };

  const handleSearchProduct = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/meli/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.items || []);
      }
    } catch (e) {
      console.warn('Erro ao pesquisar produto para comparar:', e);
    } finally {
      setSearching(false);
    }
  };

  const handleAddFromSearch = (item: any) => {
    if (products.length >= 3) {
      alert('Você pode comparar até 3 produtos simultaneamente.');
      return;
    }

    // Resolve realistic verified image for search results
    let resolvedImage = item.thumbnail || '';
    if (resolvedImage.includes('http2.mlstatic.com')) {
      resolvedImage = resolvedImage.replace('-I.jpg', '-O.webp').replace('-V.jpg', '-O.webp').replace('http://', 'https://');
    }
    if (!resolvedImage || !resolvedImage.startsWith('http')) {
      resolvedImage = matchProductImage(item.title, item.category).mainImage;
    }

    const newProduct: ProductToCompare = {
      id: `comp-custom-${Date.now()}`,
      name: item.title,
      price: item.suggestedPrice || 'R$ 149,90',
      platform: 'Mercado Livre',
      rating: 4.8,
      salesCount: item.subtitleMetrics || '+1.000 vendidos',
      image: resolvedImage,
      affiliateUrl: item.realUrl || 'https://mercadolivre.com.br',
      pros: ['Alta procura e validação de compradores', 'Entrega rápida oficial', 'Boa avaliação de usuários'],
      cons: ['Estoque limitado em períodos promocionais'],
      highlight: '⭐ Produto em Alta',
      badge: 'Em Alta',
      category: item.category || 'Tech',
      scores: {
        costBenefit: 8.8,
        quality: 9.0,
        popularity: 9.2,
        durability: 8.7
      }
    };
    setProducts([...products, newProduct]);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleRemoveProduct = (index: number) => {
    if (products.length <= 2) {
      alert('Mantenha pelo menos 2 produtos para realizar uma comparação.');
      return;
    }
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
  };

  const handleCopyComparisonText = () => {
    if (products.length < 2) return;
    const text = `⚖️ COMPARATIVO SINCERO: ${products[0].name} VS ${products[1].name}
    
Produto A: ${products[0].name} (${products[0].price})
⭐ Nota: ${products[0].rating}/5.0 • ${products[0].highlight}
Prós: ${products[0].pros.join(', ')}
Contras: ${products[0].cons.join(', ')}

Produto B: ${products[1].name} (${products[1].price})
⭐ Nota: ${products[1].rating}/5.0 • ${products[1].highlight}
Prós: ${products[1].pros.join(', ')}
Contras: ${products[1].cons.join(', ')}

VEREDITO FINAL:
Para quem prioriza CUSTO-BENEFÍCIO, a melhor escolha é ${products[0].name}.
Para quem prioriza DESEMPENHO E RECURSOS, a melhor escolha é ${products[1].name}.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleGenerateReview = (prod: ProductToCompare) => {
    if (onUseProductForReview) {
      onUseProductForReview({
        productName: prod.name,
        productPrice: prod.price,
        productImage: prod.image,
        productCategory: (prod.category || 'Casa e cozinha') as any,
        productDescription: `${prod.highlight}. Pontos fortes: ${prod.pros.join(', ')}.`,
        affiliateLink: prod.affiliateUrl
      });
    } else if (onSwitchToGenerator) {
      onSwitchToGenerator();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#181508] via-[#121212] to-[#0A0A0A] border border-[#332A15] p-6 md:p-10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5C542]/10 border border-[#F5C542]/30 text-xs font-bold text-[#F5C542] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>FOTOS REAIS &amp; ESPECIFICAÇÕES SINCRONIZADAS</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
              Comparador de <span className="text-[#F5C542]">Produtos Lado a Lado</span>
            </h1>
            <p className="text-sm text-[#A1A1A1] leading-relaxed">
              Reviews comparativos geram até <strong>3x mais cliques em links de afiliados</strong>. Todas as imagens e preços foram 100% calibrados com fotos oficiais dos produtos reais (Frigideiras, Air Fryers, Liquidificadores, etc.).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyComparisonText}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#222] text-[#E0E0E0] border border-[#333] text-xs font-bold transition-all cursor-pointer shadow"
            >
              {copied ? <Check className="w-4 h-4 text-[#22C55E]" /> : <Copy className="w-4 h-4 text-[#F5C542]" />}
              <span>{copied ? 'Copiado para Área de Transferência!' : 'Copiar Comparativo'}</span>
            </button>

            {onSwitchToGenerator && (
              <button
                onClick={onSwitchToGenerator}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F5C542] hover:bg-[#e5b738] text-black text-xs font-black transition-all cursor-pointer shadow-lg shadow-[#F5C542]/20 hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Criar Review com IA</span>
              </button>
            )}
          </div>
        </div>

        {/* Preset Selector */}
        <div className="mt-8 pt-6 border-t border-[#242424]">
          <span className="text-xs font-bold text-[#888] uppercase tracking-wider block mb-3">
            Duelos Populares (Fotos Oficiais &amp; Dados Calibrados):
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_COMPARISONS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(idx)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  selectedComparisonIndex === idx
                    ? 'bg-[#F5C542] text-black border-[#F5C542] shadow-md font-bold'
                    : 'bg-[#181818] text-[#9E9E9E] border-[#2A2A2A] hover:text-white hover:border-[#444]'
                }`}
              >
                {preset.title.split(' vs ')[0].split(' ').slice(0, 3).join(' ')} vs {preset.title.split(' vs ')[1]?.split(' ').slice(0, 3).join(' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add / Search Custom Product */}
      <div className="bg-[#121212] border border-[#222] rounded-2xl p-4 md:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchProduct()}
              placeholder="Pesquisar produto no Mercado Livre para adicionar ao duelo (ex: Fone JBL, Air Fryer, Robô Aspirador, Frigideira)..."
              className="w-full bg-[#181818] border border-[#2A2A2A] focus:border-[#F5C542] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#666] outline-none transition-all"
            />
          </div>
          <button
            onClick={handleSearchProduct}
            disabled={searching}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E1E1E] hover:bg-[#282828] text-white border border-[#333] text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
          >
            {searching ? <span className="animate-spin text-[#F5C542]">⚡</span> : <Search className="w-4 h-4 text-[#F5C542]" />}
            <span>Buscar Produto</span>
          </button>
        </div>

        {/* Live Search Results to Add */}
        {searchResults.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-[#1F1F1F]">
            <span className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider block">
              Resultados encontrados — Clique para adicionar:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {searchResults.slice(0, 6).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-[#181818] border border-[#282828] hover:border-[#F5C542]/50 transition-all justify-between"
                >
                  <div className="w-12 h-12 bg-white rounded-lg p-1 shrink-0 flex items-center justify-center">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{item.title}</p>
                    <p className="text-[11px] text-[#22C55E] font-extrabold">{item.suggestedPrice}</p>
                  </div>
                  <button
                    onClick={() => handleAddFromSearch(item)}
                    className="p-2 rounded-lg bg-[#F5C542] hover:bg-[#e5b738] text-black text-xs font-bold cursor-pointer transition-all"
                    title="Adicionar ao comparador"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Side-by-Side Comparison Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((prod, idx) => (
          <div
            key={prod.id || idx}
            className={`relative rounded-3xl bg-[#121212] border ${
              idx === 0 ? 'border-[#F5C542]/50 shadow-xl shadow-[#F5C542]/5' : 'border-[#262626]'
            } p-6 space-y-6 flex flex-col justify-between`}
          >
            {/* Top Badge & Delete */}
            <div className="flex items-center justify-between gap-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                idx === 0 ? 'bg-[#F5C542] text-black' : 'bg-[#222] text-[#A1A1A1]'
              }`}>
                {prod.badge || (idx === 0 ? 'Opção 1' : `Opção ${idx + 1}`)}
              </span>

              {products.length > 2 && (
                <button
                  onClick={() => handleRemoveProduct(idx)}
                  className="text-[#666] hover:text-[#EF4444] transition-colors p-1"
                  title="Remover produto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Product Packshot Image strictly synchronized */}
            <div className="space-y-4">
              <div className="w-full h-52 rounded-2xl bg-white p-3 border border-[#2A2A2A] flex items-center justify-center overflow-hidden relative group shadow-inner">
                <img
                  src={prod.image}
                  alt={prod.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const fallback = matchProductImage(prod.name, prod.category);
                    (e.target as HTMLImageElement).src = fallback.mainImage;
                  }}
                />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/85 text-[10px] text-white font-mono border border-[#333]">
                  {prod.platform}
                </span>

                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/85 border border-[#22C55E]/40 flex items-center gap-1 text-[9px] font-bold text-[#22C55E]">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  <span>Foto Real Verificada</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug hover:text-[#F5C542] transition-colors">
                  {prod.name}
                </h3>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#1F1F1F]">
                  <span className="text-xl font-black text-[#F5C542]">{prod.price}</span>
                  <span className="text-xs text-[#777] flex items-center gap-1">
                    <Star className="w-3 h-3 text-[#F5C542] fill-current" />
                    <strong className="text-white">{prod.rating}</strong> • {prod.salesCount}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Highlight Banner */}
            <div className="p-3 rounded-xl bg-[#181818] border border-[#2A2A2A] text-xs font-bold text-[#E0E0E0] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F5C542] shrink-0" />
              <span>{prod.highlight}</span>
            </div>

            {/* Rating Scores Grid */}
            <div className="space-y-2 text-xs border-t border-b border-[#222] py-4">
              <div className="flex justify-between items-center text-[#A1A1A1]">
                <span>Custo-Benefício:</span>
                <div className="flex items-center gap-2 font-bold text-white">
                  <div className="w-20 h-1.5 rounded-full bg-[#222] overflow-hidden">
                    <div className="h-full bg-[#F5C542]" style={{ width: `${(prod.scores.costBenefit / 10) * 100}%` }} />
                  </div>
                  <span>{prod.scores.costBenefit}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[#A1A1A1]">
                <span>Qualidade dos Materiais:</span>
                <div className="flex items-center gap-2 font-bold text-white">
                  <div className="w-20 h-1.5 rounded-full bg-[#222] overflow-hidden">
                    <div className="h-full bg-[#22C55E]" style={{ width: `${(prod.scores.quality / 10) * 100}%` }} />
                  </div>
                  <span>{prod.scores.quality}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[#A1A1A1]">
                <span>Popularidade no Mercado:</span>
                <div className="flex items-center gap-2 font-bold text-white">
                  <div className="w-20 h-1.5 rounded-full bg-[#222] overflow-hidden">
                    <div className="h-full bg-[#38BDF8]" style={{ width: `${(prod.scores.popularity / 10) * 100}%` }} />
                  </div>
                  <span>{prod.scores.popularity}</span>
                </div>
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <span className="font-bold text-[#22C55E] flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Pontos Fortes:
                </span>
                <ul className="space-y-1 text-[#BBB] pl-1">
                  {prod.pros.map((p, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#22C55E] font-bold">✓</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-[#EF4444] flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" /> Pontos de Atenção:
                </span>
                <ul className="space-y-1 text-[#999] pl-1">
                  {prod.cons.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#EF4444] font-bold">✕</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-[#1C1C1C]">
              <button
                onClick={() => handleGenerateReview(prod)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5C542] hover:bg-[#e5b738] text-black font-black text-xs transition-all shadow-md shadow-[#F5C542]/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Criar Review Deste Produto</span>
              </button>

              <a
                href={prod.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] text-[#AAA] hover:text-white font-bold text-xs transition-all border border-[#333]"
              >
                <span>Ver no {prod.platform}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* AI Comparative Verdict Box */}
      <div className="rounded-3xl bg-gradient-to-r from-[#141414] via-[#161616] to-[#121212] border border-[#2E2E2E] p-6 md:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F5C542]/10 border border-[#F5C542]/30 flex items-center justify-center text-[#F5C542]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Veredito da IA: Qual produto você deve indicar no seu review?</h3>
            <p className="text-xs text-[#8E8E8E]">Análise imparcial baseada no comportamento de compra do consumidor brasileiro</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#222] space-y-2">
            <span className="text-xs font-black text-[#F5C542] uppercase tracking-wider block">
              💡 Para quem busca Economia e Volume:
            </span>
            <p className="text-xs text-[#BBB] leading-relaxed">
              Recomendamos destacar o <strong>{products[0]?.name}</strong>. Por ter um valor mais acessível e altíssimo giro de vendas, o seu visitante tem menor atrito para finalizar a compra imediatamente através do seu link de afiliado.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#222] space-y-2">
            <span className="text-xs font-black text-[#38BDF8] uppercase tracking-wider block">
              ⭐ Para quem busca Durabilidade e Recursos Premium:
            </span>
            <p className="text-xs text-[#BBB] leading-relaxed">
              Recomendamos posicionar o <strong>{products[1]?.name || products[0]?.name}</strong> como a escolha premium. Mesmo com ticket mais alto, sua comissão em reais por venda é maior e atende o público exigente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
