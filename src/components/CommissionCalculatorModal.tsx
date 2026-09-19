import React, { useState } from 'react';
import {
  Percent,
  X,
  DollarSign,
  TrendingUp,
  Sparkles,
  Calculator,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

interface CommissionCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewReview?: () => void;
}

export const CommissionCalculatorModal: React.FC<CommissionCalculatorModalProps> = ({
  isOpen,
  onClose,
  onNewReview
}) => {
  if (!isOpen) return null;

  const [platform, setPlatform] = useState<'meli' | 'shopee' | 'amazon' | 'hotmart' | 'custom'>('meli');
  const [productPrice, setProductPrice] = useState<number>(199.90);
  const [commissionRate, setCommissionRate] = useState<number>(12); // %
  const [dailyVisitors, setDailyVisitors] = useState<number>(150);
  const [conversionRate, setConversionRate] = useState<number>(3.5); // %

  const handlePlatformChange = (p: 'meli' | 'shopee' | 'amazon' | 'hotmart' | 'custom') => {
    setPlatform(p);
    if (p === 'meli') {
      setCommissionRate(11);
      setProductPrice(220);
    } else if (p === 'shopee') {
      setCommissionRate(14);
      setProductPrice(99);
    } else if (p === 'amazon') {
      setCommissionRate(9);
      setProductPrice(250);
    } else if (p === 'hotmart') {
      setCommissionRate(50);
      setProductPrice(197);
    }
  };

  const commissionPerSale = (productPrice * commissionRate) / 100;
  const salesPerDay = (dailyVisitors * conversionRate) / 100;
  const dailyEarnings = salesPerDay * commissionPerSale;
  const monthlyEarnings = dailyEarnings * 30;
  const monthlySales = salesPerDay * 30;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#121212] border border-[#2E2E2E] rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Calculadora de Lucro de Afiliado</h2>
              <p className="text-xs text-[#8E8E8E]">Simule seus ganhos mensais por cada página de review criada</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#777] hover:text-white hover:bg-[#222] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Presets */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#A1A1A1] uppercase tracking-wider">
            Escolha a Plataforma:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => handlePlatformChange('meli')}
              className={`p-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                platform === 'meli'
                  ? 'bg-[#FFE600] text-black border-[#FFE600]'
                  : 'bg-[#181818] text-[#999] border-[#2A2A2A] hover:text-white'
              }`}
            >
              Mercado Livre (10-14%)
            </button>

            <button
              onClick={() => handlePlatformChange('shopee')}
              className={`p-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                platform === 'shopee'
                  ? 'bg-[#EE4D2D] text-white border-[#EE4D2D]'
                  : 'bg-[#181818] text-[#999] border-[#2A2A2A] hover:text-white'
              }`}
            >
              Shopee (até 14%)
            </button>

            <button
              onClick={() => handlePlatformChange('amazon')}
              className={`p-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                platform === 'amazon'
                  ? 'bg-[#FF9900] text-black border-[#FF9900]'
                  : 'bg-[#181818] text-[#999] border-[#2A2A2A] hover:text-white'
              }`}
            >
              Amazon (7-15%)
            </button>

            <button
              onClick={() => handlePlatformChange('hotmart')}
              className={`p-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                platform === 'hotmart'
                  ? 'bg-[#F5C542] text-black border-[#F5C542]'
                  : 'bg-[#181818] text-[#999] border-[#2A2A2A] hover:text-white'
              }`}
            >
              Infoprodutos (40-60%)
            </button>
          </div>
        </div>

        {/* Sliders and Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#181818] border border-[#262626] rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-xs font-bold text-[#E0E0E0]">
              <span>Preço Médio do Produto:</span>
              <span className="text-[#F5C542]">R$ {productPrice.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="20"
              max="2000"
              step="10"
              value={productPrice}
              onChange={(e) => setProductPrice(Number(e.target.value))}
              className="w-full accent-[#F5C542] cursor-pointer"
            />
          </div>

          <div className="bg-[#181818] border border-[#262626] rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-xs font-bold text-[#E0E0E0]">
              <span>Taxa de Comissão:</span>
              <span className="text-[#22C55E]">{commissionRate}%</span>
            </div>
            <input
              type="range"
              min="3"
              max="70"
              step="1"
              value={commissionRate}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
              className="w-full accent-[#22C55E] cursor-pointer"
            />
          </div>

          <div className="bg-[#181818] border border-[#262626] rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-xs font-bold text-[#E0E0E0]">
              <span>Visitantes Diários no Review:</span>
              <span className="text-white">{dailyVisitors} visitas/dia</span>
            </div>
            <input
              type="range"
              min="20"
              max="2000"
              step="10"
              value={dailyVisitors}
              onChange={(e) => setDailyVisitors(Number(e.target.value))}
              className="w-full accent-[#38BDF8] cursor-pointer"
            />
          </div>

          <div className="bg-[#181818] border border-[#262626] rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-xs font-bold text-[#E0E0E0]">
              <span>Taxa de Conversão da Página:</span>
              <span className="text-white">{conversionRate}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="15"
              step="0.5"
              value={conversionRate}
              onChange={(e) => setConversionRate(Number(e.target.value))}
              className="w-full accent-[#F5C542] cursor-pointer"
            />
          </div>
        </div>

        {/* Results Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#142314] via-[#121E12] to-[#0D150D] border border-[#2E5A2E] p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-xl bg-black/40 border border-[#2E5A2E]/50">
              <span className="text-[11px] text-[#A1A1A1] block font-bold uppercase">Comissão por Venda</span>
              <span className="text-xl font-black text-white">
                R$ {commissionPerSale.toFixed(2)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-[#2E5A2E]/50">
              <span className="text-[11px] text-[#A1A1A1] block font-bold uppercase">Vendas Estimadas / Mês</span>
              <span className="text-xl font-black text-[#38BDF8]">
                {Math.round(monthlySales)} pedidos
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-[#2E5A2E]/50">
              <span className="text-[11px] text-[#22C55E] block font-bold uppercase">Lucro Estimado Mensal</span>
              <span className="text-2xl font-black text-[#22C55E]">
                R$ {monthlyEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#222] text-[#A1A1A1] hover:text-white text-xs font-bold transition-all cursor-pointer"
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
              <span>Criar Página de Review Agora</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
