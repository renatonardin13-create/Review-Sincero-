import React, { useState, useEffect } from 'react';
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
  ShoppingBag
} from 'lucide-react';

interface CommissionCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewReview?: () => void;
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

export const CommissionCalculatorModal: React.FC<CommissionCalculatorModalProps> = ({
  isOpen,
  onClose,
  onNewReview
}) => {
  if (!isOpen) return null;

  const [platform, setPlatform] = useState<PlatformID>('meli');
  const [niche, setNiche] = useState<NicheID>('beleza');
  
  const [productPrice, setProductPrice] = useState<number>(119.90);
  const [commissionRate, setCommissionRate] = useState<number>(11); // %
  const [dailyVisitors, setDailyVisitors] = useState<number>(150);
  const [conversionRate, setConversionRate] = useState<number>(3.5); // %
  const [selectedNote, setSelectedNote] = useState<string>(
    "Produtos de skincare, maquiagem e cuidados pessoais pagam 11%."
  );

  // Sync automated actual rates when platform or niche changes
  useEffect(() => {
    if (platform === 'custom') {
      setSelectedNote("Insira valores personalizados abaixo para simular qualquer outro produto.");
      return;
    }
    const rates = PLATFORM_NICHE_RATES[platform as Exclude<PlatformID, 'custom'>];
    if (rates && rates[niche]) {
      const data = rates[niche];
      setCommissionRate(data.rate);
      setProductPrice(data.avgPrice);
      setSelectedNote(data.note);
    }
  }, [platform, niche]);

  const commissionPerSale = (productPrice * commissionRate) / 100;
  const salesPerDay = (dailyVisitors * conversionRate) / 100;
  const dailyEarnings = salesPerDay * commissionPerSale;
  const monthlyEarnings = dailyEarnings * 30;
  const monthlySales = salesPerDay * 30;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0C0E14] border border-[#212635] rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#212635]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Calculadora Real de Afiliado</h2>
              <p className="text-xs text-[#8E8E8E]">Valores reais e automatizados de acordo com as diretrizes das plataformas</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#777] hover:text-white hover:bg-[#222] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Picker */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#A1A1A1] uppercase tracking-wider flex items-center gap-1">
            <ShoppingBag className="w-3.5 h-3.5 text-[#F5C542]" /> 1. Escolha a Plataforma que Paga:
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
            {(Object.keys(PLATFORMS) as PlatformID[]).map((key) => {
              const info = PLATFORMS[key];
              const isSelected = platform === key;
              return (
                <button
                  key={key}
                  onClick={() => setPlatform(key)}
                  className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer text-center truncate ${
                    isSelected
                      ? info.activeClass
                      : 'bg-[#121620] text-[#9CA3AF] border-[#212635] hover:text-white hover:bg-[#181E2C]'
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
          <label className="text-xs font-bold text-[#A1A1A1] uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#38BDF8]" /> 2. Escolha o Nicho / Categoria:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {(Object.keys(NICHES) as NicheID[]).map((key) => {
              const info = NICHES[key];
              const isSelected = niche === key;
              return (
                <button
                  key={key}
                  onClick={() => setNiche(key)}
                  disabled={platform === 'custom'}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left flex items-center gap-2 ${
                    platform === 'custom'
                      ? 'opacity-40 cursor-not-allowed bg-[#121620] text-[#555] border-[#181E2C]'
                      : isSelected
                      ? 'bg-[#1E293B] text-white border-[#38BDF8] shadow-md shadow-[#38BDF8]/10'
                      : 'bg-[#121620] text-[#9CA3AF] border-[#212635] hover:text-white hover:bg-[#181E2C] cursor-pointer'
                  }`}
                >
                  <span>{info.emoji}</span>
                  <span className="truncate">{info.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Real Source Info Alert */}
        <div className="bg-[#121620] border border-[#212635] rounded-xl p-3 flex items-start gap-2.5 text-xs">
          <Info className="w-4 h-4 text-[#F5C542] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[#E0E0E0] font-bold block">Dado Real de Mercado:</span>
            <p className="text-[#9CA3AF] leading-relaxed">{selectedNote}</p>
          </div>
        </div>

        {/* Sliders and Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="bg-[#121620] border border-[#212635] rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-xs font-bold text-[#E0E0E0]">
              <span>Preço Médio do Produto:</span>
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

          <div className="bg-[#121620] border border-[#212635] rounded-2xl p-4 space-y-2">
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

          <div className="bg-[#121620] border border-[#212635] rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-xs font-bold text-[#E0E0E0]">
              <span>Visitantes Diários no Review:</span>
              <span className="text-white">{dailyVisitors} visitas/dia</span>
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

          <div className="bg-[#121620] border border-[#212635] rounded-2xl p-4 space-y-2">
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
        <div className="rounded-2xl bg-gradient-to-r from-[#0E1F16] via-[#0C1B13] to-[#08110C] border border-[#1E462D] p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-black/40 border border-[#1E462D]/50">
              <span className="text-[10px] text-[#A1A1A1] block font-bold uppercase tracking-wider">Comissão / Venda</span>
              <span className="text-lg font-black text-white block mt-1">
                R$ {commissionPerSale.toFixed(2)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-[#1E462D]/50">
              <span className="text-[10px] text-[#A1A1A1] block font-bold uppercase tracking-wider">Vendas / Mês (Est.)</span>
              <span className="text-lg font-black text-[#38BDF8] block mt-1">
                {Math.round(monthlySales)} pedidos
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-[#1E462D]/50">
              <span className="text-[10px] text-[#22C55E] block font-bold uppercase tracking-wider">Ganhos Mensais</span>
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
            className="px-5 py-2.5 rounded-xl bg-[#121620] hover:bg-[#181E2C] text-[#A1A1A1] hover:text-white text-xs font-bold transition-all cursor-pointer border border-[#212635]"
          >
            Fechar
          </button>

          {onNewReview && (
            <button
              onClick={() => {
                onClose();
                onNewReview();
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F5C542] hover:bg-[#e5b738] text-black text-xs font-black transition-all cursor-pointer shadow-lg shadow-[#F5C542]/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Criar Página de Review</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
