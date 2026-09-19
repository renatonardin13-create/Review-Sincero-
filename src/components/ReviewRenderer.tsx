import React, { useState, useEffect } from 'react';
import { Review } from '../types';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Star,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info,
  ArrowRight,
  Sparkles,
  Award,
  ThumbsUp,
  AlertTriangle,
  Timer,
  Flame,
  MessageCircle,
  Share2,
  Instagram,
  Send,
  Youtube,
  Video,
  Check
} from 'lucide-react';

interface ReviewRendererProps {
  review: Review;
  isPreview?: boolean;
  deviceMode?: 'desktop' | 'tablet' | 'mobile';
}

export const ReviewRenderer: React.FC<ReviewRendererProps> = ({
  review,
  isPreview = false,
  deviceMode = 'desktop'
}) => {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number }>({
    minutes: review.urgencySettings?.timerMinutes || 14,
    seconds: 59
  });
  const [showRecentBuyer, setShowRecentBuyer] = useState<boolean>(true);

  useEffect(() => {
    if (!review.urgencySettings?.enableTimer) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          return { minutes: 14, seconds: 59 };
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [review.urgencySettings?.enableTimer]);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const isClean = review.template === 'clean';
  const ctaText = review.ctaButtonText || 'ACESSAR OFERTA OFICIAL COM SEGURANÇA →';

  const containerClasses = isClean
    ? 'bg-[#FAFAFA] text-[#111111] font-sans'
    : 'bg-[#080808] text-white font-sans';

  const cardClasses = isClean
    ? 'bg-white border border-gray-200 shadow-sm rounded-2xl p-6'
    : 'bg-[#121212] border border-[#242424] rounded-2xl p-6';

  const deviceWidthClass = isPreview
    ? deviceMode === 'mobile'
      ? 'max-w-[390px] mx-auto border-8 border-[#2A2A2A] rounded-3xl overflow-hidden my-4 shadow-2xl'
      : deviceMode === 'tablet'
      ? 'max-w-[768px] mx-auto border-8 border-[#2A2A2A] rounded-3xl overflow-hidden my-4 shadow-2xl'
      : 'w-full'
    : 'w-full';

  return (
    <div className={`${containerClasses} ${deviceWidthClass} min-h-screen transition-all relative pb-20`}>
      {/* URGENCY TOP BAR BANNER */}
      {review.urgencySettings?.enableTimer && (
        <div className="bg-gradient-to-r from-[#B91C1C] via-[#DC2626] to-[#B91C1C] text-white text-xs font-bold py-2.5 px-4 text-center sticky top-0 z-50 shadow-md flex items-center justify-center gap-2">
          <Timer className="w-4 h-4 animate-pulse" />
          <span>OFERTA RELÂMPAGO POR TEMPO LIMITADO:</span>
          <span className="font-mono bg-black/40 px-2 py-0.5 rounded text-white tracking-widest">
            {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="hidden sm:inline">• Garanta o desconto oficial antes que expire</span>
        </div>
      )}

      {/* HEADER / TOPBAR */}
      <header
        className={`border-b sticky ${
          review.urgencySettings?.enableTimer ? 'top-[37px]' : 'top-0'
        } z-40 backdrop-blur-md px-6 py-4 flex items-center justify-between ${
          isClean ? 'bg-white/90 border-gray-200' : 'bg-[#0D0D0D]/90 border-[#222]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center shadow-md shadow-green-500/10">
            <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-wide text-white">
              {review.siteName || 'Review Sincero'}
            </span>
            <span className="block text-[10px] text-[#A1A1A1]">
              Análise transparente por {review.author || 'Especialista'}
            </span>
          </div>
        </div>

        {review.affiliateUrl && (
          <a
            href={review.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-black font-extrabold px-4 py-2 rounded-xl text-xs shadow-md transition-transform hover:scale-105"
          >
            <span>Ver Oferta</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {review.platform} • {review.category} • ANÁLISE 100% SINCERA
          </span>
        </div>

        {/* Headline */}
        {review.headline && (
          <h2 className="text-sm md:text-base font-bold text-[#F5C542] mb-3 leading-snug">
            {review.headline}
          </h2>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight text-white">
              {review.productName || 'Nome do Produto'}
            </h1>
            <p className={`text-sm md:text-base leading-relaxed ${isClean ? 'text-gray-600' : 'text-[#A1A1A1]'}`}>
              {review.description ||
                'Resumo objetivo e transparente do produto avaliado com base em testes reais.'}
            </p>

            {/* Price & Scarcity */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center gap-4">
                {review.currentPrice && (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-[#22C55E]">
                      R$ {review.currentPrice}
                    </span>
                    {review.oldPrice && (
                      <span className="text-sm text-[#888] line-through">
                        De R$ {review.oldPrice}
                      </span>
                    )}
                  </div>
                )}

                {review.overallScore > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5C542]/10 border border-[#F5C542]/20 text-[#F5C542] font-bold text-xs">
                    <Star className="w-4 h-4 fill-[#F5C542]" />
                    <span>{review.overallScore.toFixed(1)}/10 Veredito</span>
                  </div>
                )}
              </div>

              {/* Scarcity Bar */}
              {review.urgencySettings?.enableScarcityBar && (
                <div className="p-3 bg-[#1A1A1A] border border-[#333] rounded-xl space-y-1.5 max-w-md">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#EF4444] font-bold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-[#EF4444]" />
                      <span>Restam apenas {review.urgencySettings?.stockRemaining ?? 3} unidades</span>
                    </span>
                    <span className="text-[#888]">Alta Procura</span>
                  </div>
                  <div className="w-full bg-[#2A2A2A] h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#EF4444] to-[#F59E0B] w-[88%] h-full rounded-full animate-pulse" />
                  </div>
                </div>
              )}
            </div>

            {review.affiliateUrl && (
              <div className="pt-2">
                <a
                  href={review.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-[#22C55E] hover:bg-[#16A34A] text-black font-extrabold px-8 py-4 rounded-2xl text-sm md:text-base shadow-xl shadow-green-500/20 transition-all hover:scale-[1.02]"
                >
                  <span>{ctaText}</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </a>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-[#2A2A2A] shadow-2xl bg-[#0D0D0D] aspect-square">
              <img
                src={
                  review.mainImage ||
                  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
                }
                alt={review.productName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* VIP WHATSAPP COMMUNITY BANNER (IF CONFIGURED) */}
      {review.socialCommunity?.whatsappGroupUrl && (
        <div className="max-w-4xl mx-auto px-4 mb-10">
          <div className="bg-gradient-to-r from-[#064E3B] to-[#047857] border border-[#10B981]/50 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm">Canal VIP de Ofertas no WhatsApp</h4>
                <p className="text-xs text-emerald-100 mt-0.5">
                  {review.socialCommunity.whatsappVipText ||
                    'Entre no nosso grupo VIP para receber promoções e cupons em primeira mão!'}
                </p>
              </div>
            </div>

            <a
              href={review.socialCommunity.whatsappGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#064E3B] hover:bg-emerald-50 font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shrink-0 transition-all shadow-md"
            >
              <span>Entrar no Grupo VIP</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* MAIN CONTENT CONTAINER */}
      <main className="max-w-4xl mx-auto px-4 space-y-10 pb-16">
        {/* RESUMO: O QUE É? */}
        <section className={cardClasses}>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
            <Info className="w-5 h-5 text-[#22C55E]" />
            <span>O Que É? (Resumo Objetivo)</span>
          </h3>
          <p className={`leading-relaxed text-sm ${isClean ? 'text-gray-700' : 'text-[#A1A1A1]'}`}>
            {review.description || 'Nenhuma descrição detalhada informada.'}
          </p>
          {review.howItWorks && (
            <div className="mt-5 pt-5 border-t border-[#242424]">
              <h4 className="font-semibold text-xs uppercase tracking-wider mb-2 text-white">
                Como Funciona na Prática:
              </h4>
              <p className={`text-xs md:text-sm leading-relaxed ${isClean ? 'text-gray-600' : 'text-[#A1A1A1]'}`}>
                {review.howItWorks}
              </p>
            </div>
          )}
        </section>

        {/* PARA QUEM FAZ SENTIDO */}
        {review.audience && review.audience.length > 0 && (
          <section className={cardClasses}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <ThumbsUp className="w-5 h-5 text-[#22C55E]" />
              <span>Para Quem Esse Produto Faz Sentido?</span>
            </h3>
            <ul className="space-y-2.5">
              {review.audience.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs md:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <span className={isClean ? 'text-gray-700' : 'text-[#A1A1A1]'}>{item}</span>
                </li>
              ))}
            </ul>
            {review.antiPersonaPhrase && (
              <div className="mt-4 p-3.5 rounded-xl bg-[#0D0D0D] border border-[#EF4444]/30">
                <span className="text-[10px] font-bold text-[#EF4444] uppercase tracking-wider block mb-1">
                  Pra quem NÃO é indicado:
                </span>
                <p className="text-xs text-[#E2E8F0] italic">{review.antiPersonaPhrase}</p>
              </div>
            )}
          </section>
        )}

        {/* CARACTERÍSTICAS */}
        {review.features && review.features.length > 0 && (
          <section className={cardClasses}>
            <h3 className="text-lg font-bold mb-4 text-white">Principais Destaques</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {review.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#0D0D0D] border border-[#242424] text-xs flex items-center gap-2.5"
                >
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  <span className="text-white/90">{feat}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PONTOS POSITIVOS E NEGATIVOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className={cardClasses}>
            <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-[#22C55E]">
              <CheckCircle2 className="w-4 h-4" />
              <span>O Que Gostamos (Prós)</span>
            </h3>
            {review.pros && review.pros.length > 0 ? (
              <ul className="space-y-2.5">
                {review.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs">
                    <span className="text-[#22C55E] font-bold">✓</span>
                    <span className={isClean ? 'text-gray-700' : 'text-[#A1A1A1]'}>{pro}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#A1A1A1]">Nenhum ponto positivo informado.</p>
            )}
          </div>

          <div className={cardClasses}>
            <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-[#EF4444]">
              <XCircle className="w-4 h-4" />
              <span>O Que Merece Atenção (Contras)</span>
            </h3>
            {review.cons && review.cons.length > 0 ? (
              <ul className="space-y-2.5">
                {review.cons.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs">
                    <span className="text-[#EF4444] font-bold">×</span>
                    <span className={isClean ? 'text-gray-700' : 'text-[#A1A1A1]'}>{con}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#A1A1A1]">Nenhum ponto negativo informado.</p>
            )}
          </div>
        </div>

        {/* AVALIAÇÃO & CRITÉRIOS */}
        <section className={cardClasses}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#242424]">
            <div>
              <h3 className="text-lg font-bold text-white">Avaliação & Veredito</h3>
              <p className="text-xs text-[#A1A1A1] mt-0.5">Notas calculadas por critérios objetivos</p>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30">
              <Award className="w-5 h-5 text-[#22C55E]" />
              <div>
                <span className="text-2xl font-extrabold text-[#22C55E]">
                  {review.overallScore.toFixed(1)}
                </span>
                <span className="text-xs text-[#A1A1A1]">/10</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Qualidade', val: review.scoreCriteria.quality },
              { label: 'Design', val: review.scoreCriteria.design },
              { label: 'Praticidade', val: review.scoreCriteria.practicality },
              { label: 'Recursos', val: review.scoreCriteria.resources },
              { label: 'Custo-Benefício', val: review.scoreCriteria.costBenefit },
              { label: 'Experiência', val: review.scoreCriteria.experience }
            ].map((crit, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#0D0D0D] border border-[#242424]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[#A1A1A1] font-medium">{crit.label}</span>
                  <span className="font-bold text-white">{crit.val}/10</span>
                </div>
                <div className="w-full bg-[#222] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#22C55E] h-full rounded-full"
                    style={{ width: `${(crit.val / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {review.verdict && (
            <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#22C55E]/30">
              <h4 className="text-xs font-semibold text-[#22C55E] uppercase tracking-wider mb-1">
                Veredito do Review Sincero
              </h4>
              <p className="text-xs md:text-sm text-white font-medium leading-relaxed">
                {review.verdict}
              </p>
            </div>
          )}
        </section>

        {/* DEPOIMENTOS E PROVA SOCIAL */}
        {review.testimonials && review.testimonials.length > 0 && (
          <section className={cardClasses}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#242424]">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                  <Sparkles className="w-4 h-4 text-[#F5C542]" />
                  <span>Depoimentos & Fotos Reais de Clientes</span>
                </h3>
                <p className="text-xs text-[#A1A1A1] mt-0.5">
                  Avaliações verificadas de quem comprou e testou o produto
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Compradores Reais</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {review.testimonials.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#242424] space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] flex items-center justify-center text-white font-extrabold text-xs">
                          {t.name?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-white block">{t.name}</span>
                          <span className="text-[10px] text-[#22C55E] font-medium flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>{t.origin || 'Comprador Verificado'}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 text-[#F5C542]">
                        {Array.from({ length: t.rating || 5 }).map((_, rIdx) => (
                          <Star key={rIdx} className="w-3.5 h-3.5 fill-[#F5C542]" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-[#D4D4D4] leading-relaxed italic">"{t.text}"</p>
                  </div>

                  {t.photo && (
                    <div className="pt-2 border-t border-[#1F1F1F] flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#333] shrink-0 bg-[#050505]">
                        <img
                          src={t.photo}
                          alt={`Foto enviada por ${t.name}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="text-[11px] text-[#A1A1A1]">
                        <span className="text-white font-semibold block">Foto Real Anexada</span>
                        <span>Produto recebido e avaliado pelo comprador</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ (ACCORDION) */}
        {review.faq && review.faq.length > 0 && (
          <section className={cardClasses}>
            <h3 className="text-lg font-bold mb-4 text-white">Perguntas Frequentes (FAQ)</h3>
            <div className="space-y-2.5">
              {review.faq.map((item) => {
                const isOpen = openFaq === item.id;
                return (
                  <div
                    key={item.id}
                    className="border border-[#242424] rounded-xl bg-[#0D0D0D] overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(item.id)}
                      className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-white hover:text-[#22C55E] transition-colors"
                    >
                      <span>{item.question}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-[#A1A1A1] leading-relaxed border-t border-[#242424] pt-3">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* WIDGET ME SIGA NAS REDES SOCIAIS */}
        {review.socialCommunity &&
          (review.socialCommunity.instagramUrl ||
            review.socialCommunity.telegramUrl ||
            review.socialCommunity.youtubeUrl ||
            review.socialCommunity.tiktokUrl) && (
            <section className={cardClasses}>
              <div className="flex items-center gap-2 mb-3">
                <Share2 className="w-4 h-4 text-[#3B82F6]" />
                <h3 className="text-sm font-bold text-white">Siga Nossos Canais & Redes</h3>
              </div>
              <p className="text-xs text-[#8E8E8E] mb-4">
                Acompanhe unboxings, reviews em vídeo e testes de novos lançamentos em nossas redes
                oficiais.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                {review.socialCommunity.instagramUrl && (
                  <a
                    href={review.socialCommunity.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#222] border border-[#333] text-xs text-white transition-all"
                  >
                    <Instagram className="w-3.5 h-3.5 text-pink-400" />
                    <span>Instagram</span>
                  </a>
                )}
                {review.socialCommunity.telegramUrl && (
                  <a
                    href={review.socialCommunity.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#222] border border-[#333] text-xs text-white transition-all"
                  >
                    <Send className="w-3.5 h-3.5 text-sky-400" />
                    <span>Telegram</span>
                  </a>
                )}
                {review.socialCommunity.youtubeUrl && (
                  <a
                    href={review.socialCommunity.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#222] border border-[#333] text-xs text-white transition-all"
                  >
                    <Youtube className="w-3.5 h-3.5 text-red-500" />
                    <span>YouTube</span>
                  </a>
                )}
                {review.socialCommunity.tiktokUrl && (
                  <a
                    href={review.socialCommunity.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#222] border border-[#333] text-xs text-white transition-all"
                  >
                    <Video className="w-3.5 h-3.5 text-cyan-400" />
                    <span>TikTok</span>
                  </a>
                )}
              </div>
            </section>
          )}

        {/* OFERTA FINAL & CTA */}
        {review.affiliateUrl && (
          <section className="bg-gradient-to-r from-[#141414] to-[#1A1A1A] border border-[#22C55E]/40 rounded-3xl p-8 text-center shadow-2xl space-y-6">
            <h3 className="text-xl md:text-2xl font-extrabold text-white">
              Pronto para Garantir o Melhor Preço?
            </h3>
            <p className="text-xs md:text-sm text-[#A1A1A1] max-w-lg mx-auto leading-relaxed">
              Adquira através do link oficial abaixo com frete seguro, garantia de devolução e menor
              preço verificado.
            </p>
            <div>
              <a
                href={review.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#22C55E] hover:bg-[#16A34A] text-black font-extrabold px-8 py-4 rounded-2xl text-sm md:text-base shadow-xl shadow-green-500/20 transition-transform hover:scale-105"
              >
                <span>{ctaText}</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </section>
        )}

        {/* AVISO DE TRANSPARÊNCIA */}
        <div className="p-4 rounded-2xl bg-[#121212] border border-[#242424] text-xs text-[#888] leading-relaxed flex items-start gap-3">
          <Info className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
          <p>
            <strong className="text-white">Aviso de Transparência:</strong> Esta página pode conter
            links de afiliado. Ao comprar através de nossos links oficiais, você apoia nosso trabalho
            sem nenhum custo extra.
          </p>
        </div>
      </main>

      {/* STICKY BOTTOM BUY BAR */}
      {review.affiliateUrl && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0D0D0D]/95 backdrop-blur-md border-t border-[#242424] p-3 z-30 flex items-center justify-between max-w-3xl mx-auto rounded-t-2xl shadow-2xl">
          <div className="flex items-center gap-3">
            <img
              src={review.mainImage}
              alt=""
              className="w-10 h-10 rounded-lg object-cover border border-[#333]"
            />
            <div>
              <span className="text-xs font-bold text-white block truncate max-w-[180px] sm:max-w-[280px]">
                {review.productName}
              </span>
              <span className="text-xs font-extrabold text-[#22C55E]">
                R$ {review.currentPrice}
              </span>
            </div>
          </div>

          <a
            href={review.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#22C55E] hover:bg-[#16A34A] text-black font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-green-500/20"
          >
            <span>Quero Oferta</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </a>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-[#242424] py-8 px-6 text-center text-xs text-[#777]">
        <p>
          © {new Date().getFullYear()} {review.siteName || 'Review Sincero'}. Todos os direitos
          reservados.
        </p>
      </footer>
    </div>
  );
};
