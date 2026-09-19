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
  Check
} from 'lucide-react';

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
}

const PRESET_COMPARISONS: { title: string; category: string; products: ProductToCompare[] }[] = [
  {
    title: 'Air Fryer Mondial Family 5L vs Philips Walita Conectada 4.1L',
    category: 'Casa e cozinha',
    products: [
      {
        id: 'comp-1',
        name: 'Fritadeira Sem Óleo Mondial Family 5 Litros AFN-50-BI',
        price: 'R$ 299,90',
        platform: 'Mercado Livre',
        rating: 4.8,
        salesCount: '+50.000 vendidos',
        image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://mercadolivre.com.br',
        pros: ['Excelente custo-benefício', 'Cesto espaçoso de 5L ideal para família', 'Fácil de limpar com antiaderente'],
        cons: ['Não tem conectividade Wi-Fi', 'Painel analógico mais básico'],
        highlight: '🏆 Campeã em Custo-Benefício',
        badge: 'Custo-Benefício',
        scores: { costBenefit: 9.8, quality: 8.7, popularity: 9.9, durability: 8.8 }
      },
      {
        id: 'comp-2',
        name: 'Fritadeira Philips Walita Viva Conectada 4.1 Litros RapidAir',
        price: 'R$ 649,00',
        platform: 'Mercado Livre',
        rating: 4.9,
        salesCount: '+15.000 vendidos',
        image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://mercadolivre.com.br',
        pros: ['Tecnologia RapidAir patenteada assa mais uniforme', 'Painel digital touch e integração com App', 'Acabamento premium'],
        cons: ['Preço mais de 2x superior à média', 'Capacidade menor (4.1L)'],
        highlight: '⭐ Campeã em Tecnologia e Acabamento',
        badge: 'Alta Performance',
        scores: { costBenefit: 7.8, quality: 9.7, popularity: 8.9, durability: 9.6 }
      }
    ]
  },
  {
    title: 'Escova Secadora Mondial Golden Rose vs Britânia Soft BEC02',
    category: 'Beleza e skincare',
    products: [
      {
        id: 'comp-3',
        name: 'Escova Secadora Mondial Golden Rose ES-02 1200W',
        price: 'R$ 119,90',
        platform: 'Mercado Livre',
        rating: 4.7,
        salesCount: '+80.000 vendidos',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://mercadolivre.com.br',
        pros: ['Secagem rápida com 1200W de potência', 'Cerdas mistas macias e pontas arredondadas', 'Leve e ergonômica'],
        cons: ['Cabo gira 360° mas pode esquentar o bocal', 'Ruído moderado na velocidade 3'],
        highlight: '🏆 Mais Vendida do Brasil',
        badge: 'Top 1 Vendas',
        scores: { costBenefit: 9.6, quality: 8.9, popularity: 10.0, durability: 8.6 }
      },
      {
        id: 'comp-4',
        name: 'Escova Secadora Britânia Soft BEC02 Íons Tourmaline 1300W',
        price: 'R$ 139,90',
        platform: 'Shopee',
        rating: 4.8,
        salesCount: '+45.000 vendidos',
        image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://shopee.com.br',
        pros: ['1300W de potência extra', 'Revestimento em cerâmica com tourmaline reduz frizz', '3 opções de temperatura'],
        cons: ['Corpo ligeiramente mais pesado', 'Secagem de cabelos muito longos exige mechas menores'],
        highlight: '⚡ Maior Potência e Menos Frizz',
        badge: 'Anti-Frizz',
        scores: { costBenefit: 9.3, quality: 9.2, popularity: 9.4, durability: 8.9 }
      }
    ]
  },
  {
    title: 'Creatina Max Titanium 300g 100% Pura vs Dark Lab 100% Monohidratada 300g',
    category: 'Suplementos e saúde',
    products: [
      {
        id: 'comp-5',
        name: 'Creatina Max Titanium 100% Pura Monohidratada 300g',
        price: 'R$ 84,90',
        platform: 'Mercado Livre',
        rating: 4.9,
        salesCount: '+120.000 vendidos',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://mercadolivre.com.br',
        pros: ['Marca líder nacional aprovada em todos os laudos', 'Dissolução fácil na água', 'Excelente rendimento (100 doses de 3g)'],
        cons: ['Não acompanha selo Creapure importado', 'Preço flutua conforme estoque'],
        highlight: '🏆 Marca Mais Tradicional',
        badge: 'Líder em Confiança',
        scores: { costBenefit: 9.5, quality: 9.6, popularity: 9.9, durability: 9.5 }
      },
      {
        id: 'comp-6',
        name: 'Creatina Dark Lab 100% Pura Micronizada 300g Original',
        price: 'R$ 72,90',
        platform: 'Shopee',
        rating: 4.8,
        salesCount: '+90.000 vendidos',
        image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://shopee.com.br',
        pros: ['Preço por dose mais agressivo e econômico', 'Micronização ultrafina dissolve rápido', '100% aprovada em laudos da Abenutri'],
        cons: ['Embalagem em sachê ou pote mais simples', 'Menos presença em farmácias físicas'],
        highlight: '💰 Melhor Preço por Grama Pura',
        badge: 'Super Econômica',
        scores: { costBenefit: 9.9, quality: 9.4, popularity: 9.5, durability: 9.3 }
      }
    ]
  }
];

export const CompareProductsView: React.FC<CompareProductsViewProps> = ({
  onGenerateReviewFromComparison,
  onSwitchToGenerator
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
    const newProduct: ProductToCompare = {
      id: `comp-custom-${Date.now()}`,
      name: item.title,
      price: item.suggestedPrice || 'R$ 149,90',
      platform: 'Mercado Livre',
      rating: 4.8,
      salesCount: item.subtitleMetrics || '+1.000 vendidos',
      image: item.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      affiliateUrl: item.realUrl || 'https://mercadolivre.com.br',
      pros: ['Alta procura e validação de compradores', 'Entrega rápida oficial', 'Boa avaliação de usuários'],
      cons: ['Estoque limitado em períodos promocionais'],
      highlight: '⭐ Produto em Alta',
      badge: 'Em Alta',
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

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#141414] via-[#0F0F0F] to-[#0A0A0A] border border-[#262626] p-6 md:p-10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5C542]/10 border border-[#F5C542]/30 text-xs font-bold text-[#F5C542] uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5" />
              <span>FERRAMENTA DE AFILIADO · DUELO DE PRODUTOS</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
              Comparador de <span className="text-[#F5C542]">Produtos Lado a Lado</span>
            </h1>
            <p className="text-sm text-[#A1A1A1] leading-relaxed">
              Reviews comparativos geram até <strong>3x mais cliques em links de afiliados</strong> porque o comprador já está na fase final de decisão de compra. Compare preços, notas, prós/contras e gere o review com 1 clique.
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
        <div className="mt-8 pt-6 border-t border-[#222]">
          <span className="text-xs font-bold text-[#888] uppercase tracking-wider block mb-3">
            Comparações Populares Rápidas:
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
              placeholder="Pesquisar produto no Mercado Livre para adicionar à comparação (ex: Fone JBL, Air Fryer, Robô Aspirador)..."
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
                  <img src={item.thumbnail} alt={item.title} className="w-12 h-12 object-contain rounded-lg bg-white p-1" />
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
              idx === 0 ? 'border-[#F5C542]/40 shadow-lg shadow-[#F5C542]/5' : 'border-[#262626]'
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

            {/* Product Image & Title */}
            <div className="space-y-4">
              <div className="w-full h-48 rounded-2xl bg-white/5 border border-[#222] flex items-center justify-center p-4 overflow-hidden relative group">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-white font-mono">
                  {prod.platform}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white line-clamp-2 leading-snug">{prod.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xl font-black text-[#F5C542]">{prod.price}</span>
                  <span className="text-xs text-[#777]">• {prod.salesCount}</span>
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

            {/* CTA Button */}
            <a
              href={prod.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1A1A1A] hover:bg-[#F5C542] text-white hover:text-black font-bold text-xs transition-all border border-[#333] hover:border-[#F5C542]"
            >
              <span>Ver no {prod.platform}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>

      {/* AI Comparative Verdict Box */}
      <div className="rounded-3xl bg-gradient-to-r from-[#141414] via-[#161616] to-[#121212] border border-[#2E2E2E] p-6 md:p-8 space-y-4">
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
              ⭐ Para quem busca Durabilidade e Alto Ticket:
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
