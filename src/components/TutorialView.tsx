import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  TrendingUp,
  Search,
  LayoutTemplate,
  Download,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Sliders,
  Play,
  Layers,
  HelpCircle,
  Clock,
  Flame,
  Award,
  ExternalLink,
  Film,
  GraduationCap
} from 'lucide-react';
import { MembersAcademyView } from './MembersAcademyView';
import { AuthUser } from '../types';

interface TutorialViewProps {
  onNavigateTo: (viewId: string) => void;
  onNewReview: () => void;
  currentUser?: AuthUser;
  isAdmin?: boolean;
}

export const TutorialView: React.FC<TutorialViewProps> = ({
  onNavigateTo,
  onNewReview,
  currentUser,
  isAdmin = false
}) => {
  const [activeTab, setActiveTab] = useState<string>('members');

  const tutorialTabs = [
    { id: 'members', label: '🎓 Área de Membros (Vídeos VIP)', icon: GraduationCap, badge: 'NOVO' },
    { id: 'quickstart', label: '⚡ Início Rápido (3 min)', icon: Zap },
    { id: 'generator', label: '🤖 Gerador com IA', icon: Sparkles },
    { id: 'templates', label: '🎨 Templates de Conversão', icon: LayoutTemplate },
    ...(isAdmin ? [{ id: 'monetization', label: '💰 Banners & Monetização', icon: DollarSign }] : []),
    { id: 'export', label: '🚀 Exportar & Hospedar', icon: Download }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300 pb-24">
      {/* Tutorial Navigation Bar */}
      <div className="flex items-center justify-between gap-4 p-2 bg-[#0C0F17] border border-[#1E293B] rounded-2xl overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {tutorialTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#F5C542] text-[#080808] shadow-md'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#131B2A]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase ${
                      isActive ? 'bg-[#080808] text-[#F5C542]' : 'bg-[#F5C542]/20 text-[#F5C542]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Members Academy directly when on 'members' tab */}
      {activeTab === 'members' ? (
        <MembersAcademyView
          onNavigateTo={onNavigateTo}
          onNewReview={onNewReview}
          onSwitchToGuide={() => setActiveTab('quickstart')}
          currentUser={currentUser}
        />
      ) : (
        <div className="space-y-6">
          {/* Hero Header for Written Guides */}
          <div className="bg-[#121212] border border-[#222222] rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5C542]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5C542]/10 border border-[#F5C542]/30 text-[#F5C542] text-xs font-bold uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>GUIA PASSO A PASSO EM TEXTO</span>
                </div>

                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-display">
                  Guia Rápido de Cada Módulo do Sistema
                </h1>

                <p className="text-xs md:text-sm text-[#A1A1A1] leading-relaxed">
                  Consulte os passos práticos em texto para acelerar a sua produção de reviews e dominar as integrações.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setActiveTab('members')}
                  className="flex items-center gap-2 bg-[#131B2A] hover:bg-[#1E293B] text-[#F5C542] border border-[#F5C542]/30 font-bold px-4 py-3 rounded-2xl text-xs transition-all cursor-pointer"
                >
                  <Film className="w-4 h-4" />
                  <span>Ver em Videoaulas VIP</span>
                </button>

                <button
                  onClick={onNewReview}
                  className="flex items-center gap-2 bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] font-black px-5 py-3 rounded-2xl text-xs shadow-xl shadow-[#F5C542]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Criar Review</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content Display for Written Guides */}
          <div className="bg-[#151515] border border-[#242424] rounded-3xl p-6 md:p-10 space-y-8 shadow-xl">
        {/* =========================================================================
            TAB 1: QUICKSTART
           ========================================================================= */}
        {activeTab === 'quickstart' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="border-b border-[#2A2A2A] pb-6">
              <span className="text-xs text-[#F5C542] font-black uppercase tracking-wider">
                PASSO A PASSO
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                Como Criar e Publicar uma Review Lucrativa em 3 Minutos
              </h2>
              <p className="text-sm text-[#A1A1A1] mt-1">
                O fluxo completo do zero à primeira página no ar com seu link de afiliado.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="bg-[#101010] border border-[#262626] rounded-2xl p-6 space-y-3 relative group hover:border-[#F5C542]/50 transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#F5C542]/10 border border-[#F5C542]/30 flex items-center justify-center text-[#F5C542] font-black text-base">
                  1
                </div>
                <h3 className="text-base font-bold text-white">Minere um Produto Campeão</h3>
                <p className="text-xs text-[#A1A1A1] leading-relaxed">
                  Acesse o <strong>Radar de Tendências</strong> para ver o que mais cresce no Mercado Livre e Shopee em tempo real, ou use o <strong>Planejador de Palavras</strong>.
                </p>
                <button
                  onClick={() => onNavigateTo('trends')}
                  className="text-xs text-[#F5C542] hover:underline font-bold flex items-center gap-1 pt-2 cursor-pointer"
                >
                  <span>Abrir Tendências Ao Vivo</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Step 2 */}
              <div className="bg-[#101010] border border-[#262626] rounded-2xl p-6 space-y-3 relative group hover:border-[#F5C542]/50 transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E] font-black text-base">
                  2
                </div>
                <h3 className="text-base font-bold text-white">Gere a Review com IA Gratuita</h3>
                <p className="text-xs text-[#A1A1A1] leading-relaxed">
                  Clique em <strong>"Criar Review"</strong>. A inteligência artificial gera headline, prós e contras, veredito sincero, notas de avaliação e perguntas frequentes.
                </p>
                <button
                  onClick={onNewReview}
                  className="text-xs text-[#22C55E] hover:underline font-bold flex items-center gap-1 pt-2 cursor-pointer"
                >
                  <span>Abrir Gerador de IA</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Step 3 */}
              <div className="bg-[#101010] border border-[#262626] rounded-2xl p-6 space-y-3 relative group hover:border-[#F5C542]/50 transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6] font-black text-base">
                  3
                </div>
                <h3 className="text-base font-bold text-white">Insira seu Link & Exporte</h3>
                <p className="text-xs text-[#A1A1A1] leading-relaxed">
                  Coloque seu link de afiliado nos botões CTA e faça o download do arquivo HTML limpo para publicar no seu site ou hospedagem gratuita.
                </p>
                <button
                  onClick={() => onNavigateTo('reviews')}
                  className="text-xs text-[#3B82F6] hover:underline font-bold flex items-center gap-1 pt-2 cursor-pointer"
                >
                  <span>Ver Minhas Reviews</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F5C542]/5 border border-[#F5C542]/20 flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-[#F5C542] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">Dica de Ouro para Afiliados</h4>
                <p className="text-xs text-[#A1A1A1] mt-1 leading-relaxed">
                  Páginas de review sincero convertem até <strong>4x mais</strong> do que páginas de vendas tradicionais porque quebram as objeções reais do comprador (prós e contras, se vale a pena, depoimentos reais e comparação de preço).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: GENERATOR WITH AI
           ========================================================================= */}
        {activeTab === 'generator' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-[#2A2A2A] pb-6">
              <span className="text-xs text-[#F5C542] font-black uppercase tracking-wider">
                INTELIGÊNCIA ARTIFICIAL GRATUITA
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                Gerador Inteligente de Reviews & Presell
              </h2>
              <p className="text-sm text-[#A1A1A1] mt-1">
                Conheça tudo o que a IA cria automaticamente para você em poucos segundos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-[#101010] border border-[#262626] rounded-2xl space-y-2">
                <div className="text-[#F5C542] font-bold text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Headlines Persuasivas & Preço</span>
                </div>
                <p className="text-xs text-[#8E8E8E] leading-relaxed">
                  Cria chamadas magnéticas focadas em busca orgânica ("Produto X Vale a Pena? Análise Completa 2026").
                </p>
              </div>

              <div className="p-5 bg-[#101010] border border-[#262626] rounded-2xl space-y-2">
                <div className="text-[#22C55E] font-bold text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Veredito Rápido & Anti-Persona</span>
                </div>
                <p className="text-xs text-[#8E8E8E] leading-relaxed">
                  Define com clareza para quem o produto é ideal e para quem NÃO é, gerando alta autoridade e confiança.
                </p>
              </div>

              <div className="p-5 bg-[#101010] border border-[#262626] rounded-2xl space-y-2">
                <div className="text-[#38BDF8] font-bold text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tabela de Critérios & Radar de Notas</span>
                </div>
                <p className="text-xs text-[#8E8E8E] leading-relaxed">
                  Avaliações numéricas automáticas de Custo-benefício, Durabilidade, Design, Praticidade e Experiência.
                </p>
              </div>

              <div className="p-5 bg-[#101010] border border-[#262626] rounded-2xl space-y-2">
                <div className="text-[#F59E0B] font-bold text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>FAQ & Elementos de Escassez</span>
                </div>
                <p className="text-xs text-[#8E8E8E] leading-relaxed">
                  Respostas para as dúvidas mais comuns de compra, cronômetros de oferta e barra de estoque disponível.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end">
              <button
                onClick={onNewReview}
                className="bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] font-bold px-6 py-3 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Experimentar o Gerador Agora</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: TRENDS RADAR
           ========================================================================= */}
        {activeTab === 'trends' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-[#2A2A2A] pb-6">
              <span className="text-xs text-[#F5C542] font-black uppercase tracking-wider">
                MINERAÇÃO AO VIVO
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                Radar Oficial de Tendências (Mercado Livre & Shopee)
              </h2>
              <p className="text-sm text-[#A1A1A1] mt-1">
                Conectado diretamente em tempo real com <code className="text-[#F5C542]">tendencias.mercadolivre.com.br</code>.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#101010] border border-[#262626] rounded-2xl flex items-start gap-3">
                <Flame className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs text-[#A1A1A1]">
                  <strong className="text-white text-sm block">1. Maior Crescimento de Buscas</strong>
                  Produtos e termos que dispararam nas últimas 24/48 horas no Brasil. Ideal para criar artigos e reviews antes dos concorrentes.
                </div>
              </div>

              <div className="p-4 bg-[#101010] border border-[#262626] rounded-2xl flex items-start gap-3">
                <Award className="w-5 h-5 text-[#F5C542] shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs text-[#A1A1A1]">
                  <strong className="text-white text-sm block">2. Mais Desejadas / Maior Volume</strong>
                  Itens campeões de faturamento com alto ticket e demanda constante no e-commerce brasileiro.
                </div>
              </div>

              <div className="p-4 bg-[#101010] border border-[#262626] rounded-2xl flex items-start gap-3">
                <Zap className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs text-[#A1A1A1]">
                  <strong className="text-white text-sm block">3. Botão "Criar Review" Instantâneo</strong>
                  Ao encontrar um produto interessante no radar, basta 1 clique para carregar título, fotos, preço e categoria no gerador.
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end">
              <button
                onClick={() => onNavigateTo('trends')}
                className="bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] font-bold px-6 py-3 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Acessar Radar de Tendências</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: KEYWORD PLANNER
           ========================================================================= */}
        {activeTab === 'keywords' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-[#2A2A2A] pb-6">
              <span className="text-xs text-[#F5C542] font-black uppercase tracking-wider">
                SEO & GOOGLE ADS
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                Planejador de Palavras-Chave & Intenção de Compra
              </h2>
              <p className="text-sm text-[#A1A1A1] mt-1">
                Descubra o volume real de buscas mensais, concorrência e CPC para posicionar suas reviews no topo do Google.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-[#101010] border border-[#262626] rounded-2xl text-center">
                <div className="text-2xl font-black text-[#F5C542]">Volume Real</div>
                <p className="text-xs text-[#8E8E8E] mt-1">
                  Média de buscas mensais com histórico de 12 meses
                </p>
              </div>

              <div className="p-4 bg-[#101010] border border-[#262626] rounded-2xl text-center">
                <div className="text-2xl font-black text-[#22C55E]">CPC Estimado</div>
                <p className="text-xs text-[#8E8E8E] mt-1">
                  Lance mínimo e máximo no leilão do Google Ads
                </p>
              </div>

              <div className="p-4 bg-[#101010] border border-[#262626] rounded-2xl text-center">
                <div className="text-2xl font-black text-[#38BDF8]">Fundo de Funil</div>
                <p className="text-xs text-[#8E8E8E] mt-1">
                  Termos como "comprar", "cupom", "vale a pena", "é confiável"
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end">
              <button
                onClick={() => onNavigateTo('keyword-planner')}
                className="bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] font-bold px-6 py-3 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Abrir Planejador de Palavras</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: TEMPLATES
           ========================================================================= */}
        {activeTab === 'templates' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-[#2A2A2A] pb-6">
              <span className="text-xs text-[#F5C542] font-black uppercase tracking-wider">
                DESIGN & LAYOUT
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                Templates Profissionais de Alta Conversão
              </h2>
              <p className="text-sm text-[#A1A1A1] mt-1">
                Escolha o estilo visual ideal para cada nicho de produto.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-[#101010] border border-[#262626] rounded-2xl space-y-2">
                <span className="text-xs font-bold text-[#F5C542] uppercase">1. Template Premium</span>
                <h4 className="text-white font-bold text-sm">Tema Escuro Tecnológico</h4>
                <p className="text-xs text-[#8E8E8E]">
                  Perfeito para eletrônicos, celulares, hardware, produtos de tecnologia e cursos online.
                </p>
              </div>

              <div className="p-5 bg-[#101010] border border-[#262626] rounded-2xl space-y-2">
                <span className="text-xs font-bold text-[#38BDF8] uppercase">2. Template Clean</span>
                <h4 className="text-white font-bold text-sm">Estilo Editorial & Revista</h4>
                <p className="text-xs text-[#8E8E8E]">
                  Ideal para saúde, skincare, moda, casa e cozinha com visual leve e tipografia sofisticada.
                </p>
              </div>

              <div className="p-5 bg-[#101010] border border-[#262626] rounded-2xl space-y-2">
                <span className="text-xs font-bold text-[#22C55E] uppercase">3. Template Conversion</span>
                <h4 className="text-white font-bold text-sm">Foco Total em Venda Rápida</h4>
                <p className="text-xs text-[#8E8E8E]">
                  Conta com contadores regressivos, barra de escassez de estoque e múltiplos botões CTA.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end">
              <button
                onClick={() => onNavigateTo('templates')}
                className="bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] font-bold px-6 py-3 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explorar Templates</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: MONETIZATION & BANNERS (Requested feature!)
           ========================================================================= */}
        {activeTab === 'monetization' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-[#2A2A2A] pb-6">
              <span className="text-xs text-[#F5C542] font-black uppercase tracking-wider">
                MONETIZAÇÃO DO APLICATIVO GRATUITO
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                Como Vender Produtos com o Carrossel de Banners em Slides
              </h2>
              <p className="text-sm text-[#A1A1A1] mt-1">
                Como você irá liberar o aplicativo gratuitamente, você pode monetizá-lo inserindo seus próprios produtos ou links de afiliado nos slides.
              </p>
            </div>

            {/* Spec Box */}
            <div className="bg-[#101010] border border-[#282828] rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#F5C542]" />
                <span>Especificações Exatas para Criar Seus Banners</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#A1A1A1]">
                <div className="p-4 bg-[#151515] rounded-xl border border-[#222]">
                  <strong className="text-white text-sm block mb-1">📐 Dimensão Desktop</strong>
                  <strong>1200 x 300 pixels</strong> (Proporção 4:1 ou 16:4). Perfeito para visualização nítida em telas de computadores e notebooks.
                </div>

                <div className="p-4 bg-[#151515] rounded-xl border border-[#222]">
                  <strong className="text-white text-sm block mb-1">📱 Dimensão Mobile</strong>
                  <strong>600 x 300 pixels</strong> (Proporção 2:1). O carrossel se adapta automaticamente para celulares.
                </div>
              </div>

              <div className="space-y-2 pt-2 text-xs text-[#A1A1A1]">
                <p>
                  <strong>Como configurar em Configurações:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Acesse o menu <strong>"Configurações" → aba "Banners em Slides"</strong>.</li>
                  <li>Insira o <strong>Nome do Produto</strong> e uma <strong>Descrição Persuasiva</strong>.</li>
                  <li>Cole seu <strong>Link de Afiliado</strong> (Hotmart, Monetizze, Braip, Mercado Livre, Shopee).</li>
                  <li>Defina o <strong>Texto do Botão (CTA)</strong> (ex: <em>"Garantir Desconto"</em>, <em>"Comprar Agora"</em>).</li>
                  <li>Adicione a <strong>Imagem do Banner</strong> (via upload direto ou URL).</li>
                  <li>Defina o tempo de transição dos slides (ex: 5 segundos) e ative a exibição no Dashboard.</li>
                </ul>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end">
              <button
                onClick={() => onNavigateTo('settings')}
                className="bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] font-bold px-6 py-3 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Configurar Banners em Configurações</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 7: EXPORT & HOSTING
           ========================================================================= */}
        {activeTab === 'export' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-[#2A2A2A] pb-6">
              <span className="text-xs text-[#F5C542] font-black uppercase tracking-wider">
                PUBLICAÇÃO & HOSPEDAGEM
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                Como Exportar e Publicar Seu Site em Menos de 2 Minutos
              </h2>
              <p className="text-sm text-[#A1A1A1] mt-1">
                Seus reviews são exportados como arquivos HTML puros e ultrarrápidos.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#101010] border border-[#262626] rounded-2xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#F5C542] text-[#080808] flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </span>
                <div className="text-xs text-[#A1A1A1]">
                  <strong className="text-white text-sm block">Exportação em 1 Clique</strong>
                  Na lista de reviews ou na tela de configuração, clique em <strong>"Exportar HTML"</strong> para baixar o arquivo completo pronto.
                </div>
              </div>

              <div className="p-4 bg-[#101010] border border-[#262626] rounded-2xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#22C55E] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </span>
                <div className="text-xs text-[#A1A1A1]">
                  <strong className="text-white text-sm block">Hospedagem 100% Gratuita</strong>
                  Você pode arrastar o arquivo HTML para plataformas gratuitas como:
                  <ul className="list-disc list-inside mt-1 pl-2 text-[#CCC]">
                    <li><strong>Vercel</strong> (vercel.com) - Ultra rápida com SSL grátis</li>
                    <li><strong>Netlify</strong> (netlify.com) - Basta arrastar a pasta</li>
                    <li><strong>GitHub Pages</strong> ou <strong>Cloudflare Pages</strong></li>
                    <li>Ou subir diretamente na sua hospedagem WordPress / cPanel</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end">
              <button
                onClick={() => onNavigateTo('reviews')}
                className="bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] font-bold px-6 py-3 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Ver Reviews para Exportar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
        </div>
      )}
    </div>
  );
};
