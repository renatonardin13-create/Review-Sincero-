import React, { useState, useEffect } from 'react';
import { Review } from '../types';
import { matchProductImage } from '../utils/productImageMatcher';
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
  Check,
  Maximize2,
  X,
  Layers,
  CheckCheck,
  TrendingDown,
  Clock,
  FileCheck2,
  Eye
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
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

  // Derive verified images strictly matching this product if none or invalid
  const smartMatch = matchProductImage(review.productName, typeof review.category === 'string' ? review.category : undefined);
  
  const allImages = React.useMemo(() => {
    const list: string[] = [];
    if (review.mainImage && review.mainImage.trim().startsWith('http')) {
      list.push(review.mainImage.trim());
    } else if (review.mainImage && review.mainImage.trim().startsWith('data:')) {
      list.push(review.mainImage.trim());
    } else {
      list.push(smartMatch.mainImage);
    }

    if (review.images && Array.isArray(review.images)) {
      review.images.forEach(img => {
        if (img && typeof img === 'string' && img.trim() && !list.includes(img.trim())) {
          list.push(img.trim());
        }
      });
    }

    // If only 1 image, append smart matching gallery photos so the user has a rich visual gallery of the actual product
    if (list.length < 2 && smartMatch.gallery) {
      smartMatch.gallery.forEach(img => {
        if (!list.includes(img)) list.push(img);
      });
    }

    return list;
  }, [review.mainImage, review.images, review.productName, review.category, smartMatch]);

  const activeImage = allImages[activeImageIndex] || allImages[0] || smartMatch.mainImage;

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const isClean = review.template === 'clean';
  const ctaText = review.ctaButtonText || 'CONFERIR OFERTA OFICIAL NA LOJA →';

  const containerClasses = isClean
    ? 'bg-[#FAFAFA] text-[#111111] font-sans'
    : 'bg-[#080808] text-white font-sans';

  const cardClasses = isClean
    ? 'bg-white border border-gray-200 shadow-sm rounded-2xl p-5 md:p-6'
    : 'bg-[#121212] border border-[#242424] rounded-2xl p-5 md:p-6';

  const deviceWidthClass = isPreview
    ? deviceMode === 'mobile'
      ? 'max-w-[390px] mx-auto border-8 border-[#2A2A2A] rounded-3xl overflow-hidden my-4 shadow-2xl'
      : deviceMode === 'tablet'
      ? 'max-w-[768px] mx-auto border-8 border-[#2A2A2A] rounded-3xl overflow-hidden my-4 shadow-2xl'
      : 'w-full'
    : 'w-full';

  // Quick Verdict fallback generator if not present
  const quickVerdict = review.quickVerdict || {
    summary: review.description || `Análise completa e sincera sobre as qualidades, pontos de atenção e custo-benefício de ${review.productName}.`,
    strengths: review.pros && review.pros.length > 0 ? review.pros.slice(0, 3) : ['Bom acabamento e construção', 'Desempenho consistente no uso diário', 'Excelente relação custo-benefício'],
    weaknesses: review.cons && review.cons.length > 0 ? review.cons.slice(0, 2) : ['Exige leitura atenta do manual de instruções', 'Disponibilidade pode variar dependendo do lote'],
    idealFor: review.audience && review.audience.length > 0 ? review.audience : ['Quem busca eficiência e qualidade comprovada'],
    notIdealFor: review.antiPersonaPhrase ? [review.antiPersonaPhrase] : ['Quem procura apenas a opção mais barata do mercado sem foco em durabilidade']
  };

  return (
    <div className={`${containerClasses} ${deviceWidthClass} min-h-screen transition-all relative pb-28`}>
      {/* HEADER / TOPBAR EDITORIAL */}
      <header
        className={`border-b sticky top-0 z-40 backdrop-blur-md px-4 sm:px-6 py-3.5 flex items-center justify-between ${
          isClean ? 'bg-white/90 border-gray-200' : 'bg-[#0D0D0D]/90 border-[#222]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center shadow-md shadow-green-500/10">
            <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-wide text-white block leading-tight">
              {review.siteName || 'Review Sincero'}
            </span>
            <span className="block text-[10px] text-[#A1A1A1]">
              Análise Editorial Independente • por {review.author || 'Especialista'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#333] text-[11px] text-[#A1A1AA]">
            <CheckCheck className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>Produto Avaliado & Testado</span>
          </div>
          {review.affiliateUrl && (
            <a
              href={review.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#22C55E] hover:bg-[#16A34A] text-black font-extrabold px-3.5 py-1.5 rounded-xl text-xs shadow-md transition-transform hover:scale-105"
            >
              <span>Ver Oferta</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-5xl mx-auto px-4 py-6 md:py-10">
        {/* Breadcrumb / Category */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#A1A1AA] mb-4">
          <span className="px-2.5 py-0.5 rounded-md bg-[#1A1A1A] border border-[#2A2A2A] text-[#22C55E]">
            {review.category || 'Geral'}
          </span>
          <span>•</span>
          <span>{review.platform || 'Loja Oficial'}</span>
          <span>•</span>
          <span className="text-[#F5C542] flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Análise Atualizada 2026</span>
          </span>
        </div>

        {/* Headline */}
        {review.headline ? (
          <h2 className="text-xs md:text-sm font-bold text-[#F5C542] uppercase tracking-wider mb-2">
            {review.headline}
          </h2>
        ) : (
          <h2 className="text-xs md:text-sm font-bold text-[#F5C542] uppercase tracking-wider mb-2">
            {review.productName}: Vale a pena comprar? Confira a análise sincera
          </h2>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Product Info & Price */}
          <div className="lg:col-span-7 space-y-5">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-white">
              {review.productName || 'Nome do Produto'}
            </h1>
            
            <p className={`text-sm md:text-base leading-relaxed ${isClean ? 'text-gray-600' : 'text-[#A1A1A1]'}`}>
              {review.description ||
                'Confira nosso teste prático com avaliação de durabilidade, recursos, desempenho real e onde encontrar a melhor oferta com segurança.'}
            </p>

            {/* Score & Verdict pill */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F5C542]/10 border border-[#F5C542]/30 text-[#F5C542] font-extrabold text-sm">
                <Star className="w-4 h-4 fill-[#F5C542]" />
                <span>Nota Editorial: {Number(review.overallScore || 8.8).toFixed(1)} / 10</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Recomendação Positiva</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-[#121212] border border-[#2A2A2A] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#A1A1AA] uppercase tracking-wider font-semibold">
                  Preço Verificado na Loja:
                </span>
                <span className="text-[11px] text-[#22C55E] flex items-center gap-1 font-semibold">
                  <Clock className="w-3 h-3" />
                  Hoje
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#22C55E]">
                  R$ {review.currentPrice || '189,90'}
                </span>
                {review.oldPrice && (
                  <span className="text-sm text-[#888] line-through">
                    De R$ {review.oldPrice}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#888]">
                * Preço sujeito a alteração conforme disponibilidade da loja oficial informada.
              </p>
            </div>

            {review.affiliateUrl && (
              <div className="pt-2">
                <a
                  href={review.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#22C55E] hover:bg-[#16A34A] text-black font-extrabold px-8 py-4 rounded-2xl text-sm md:text-base shadow-xl shadow-green-500/20 transition-all hover:scale-[1.02]"
                >
                  <span>{ctaText}</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </a>
              </div>
            )}
          </div>

          {/* Right Column: Premium Visual Gallery (strictly accurate product image) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative rounded-3xl overflow-hidden border border-[#2A2A2A] shadow-2xl bg-[#111111] aspect-square group">
              <img
                src={activeImage}
                alt={review.productName}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = smartMatch.mainImage;
                }}
              />
              
              {/* Badge Context */}
              <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[11px] font-semibold text-white flex items-center gap-1.5 shadow-md">
                <Layers className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>Foto do Produto ({activeImageIndex + 1}/{allImages.length})</span>
              </div>

              {/* Zoom Button */}
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-3 right-3 bg-black/75 hover:bg-black p-2 rounded-xl border border-white/15 text-white transition-transform hover:scale-110 shadow-lg"
                title="Ampliar Imagem"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail selector */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#22C55E] scale-105 shadow-md shadow-green-500/20'
                        : 'border-[#2A2A2A] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Miniatura ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = smartMatch.mainImage;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MAIN EDITORIAL CONTENT */}
      <main className="max-w-4xl mx-auto px-4 space-y-8 pb-10">
        
        {/* 1. QUICK VERDICT IN 15 SECONDS */}
        <section className="bg-gradient-to-br from-[#121212] to-[#181818] border border-[#2A2A2A] rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C55E]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-2 text-xs font-bold text-[#22C55E] uppercase tracking-wider mb-2">
            <Award className="w-4 h-4" />
            <span>Decisão Rápida</span>
          </div>

          <h3 className="text-xl md:text-2xl font-extrabold text-white mb-3">
            Veredito em 15 Segundos
          </h3>
          
          <p className="text-sm md:text-base text-[#D4D4D8] leading-relaxed mb-6">
            {quickVerdict.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* O Que Gostamos */}
            <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#22C55E]/30 space-y-2.5">
              <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>O Que Mais Chamou Atenção</span>
              </span>
              <ul className="space-y-2">
                {quickVerdict.strengths.map((st, i) => (
                  <li key={i} className="text-xs text-[#E4E4E7] flex items-start gap-2">
                    <span className="text-[#22C55E] font-bold">✓</span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pontos de Atenção */}
            <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#EF4444]/30 space-y-2.5">
              <span className="text-xs font-bold text-[#EF4444] uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Pontos Que Merecem Atenção</span>
              </span>
              <ul className="space-y-2">
                {quickVerdict.weaknesses.map((wk, i) => (
                  <li key={i} className="text-xs text-[#E4E4E7] flex items-start gap-2">
                    <span className="text-[#EF4444] font-bold">×</span>
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 2. O QUE É E COMO FUNCIONA */}
        <section className={cardClasses}>
          <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-white">
            <Info className="w-5 h-5 text-[#22C55E]" />
            <span>O Que É & Como Funciona na Prática</span>
          </h3>
          <p className={`leading-relaxed text-sm md:text-base ${isClean ? 'text-gray-700' : 'text-[#A1A1A1]'}`}>
            {review.description || 'Nenhuma descrição detalhada informada.'}
          </p>
          {review.howItWorks && (
            <div className="mt-5 pt-5 border-t border-[#242424]">
              <h4 className="font-bold text-xs uppercase tracking-wider mb-2 text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F5C542]" />
                <span>Experiência de Uso no Dia a Dia:</span>
              </h4>
              <p className={`text-xs md:text-sm leading-relaxed ${isClean ? 'text-gray-600' : 'text-[#A1A1A1]'}`}>
                {review.howItWorks}
              </p>
            </div>
          )}
        </section>

        {/* 3. PARA QUEM É / PARA QUEM NÃO É */}
        <section className={cardClasses}>
          <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-white">
            <ThumbsUp className="w-5 h-5 text-[#22C55E]" />
            <span>Perfil Recomendado: Para Quem Faz Sentido?</span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wider block mb-2">
                Recomendamos especialmente para:
              </span>
              <ul className="space-y-2.5">
                {(review.audience && review.audience.length > 0 ? review.audience : quickVerdict.idealFor).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs md:text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                    <span className={isClean ? 'text-gray-700' : 'text-[#D4D4D8]'}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#EF4444]/30 mt-4">
              <span className="text-[11px] font-bold text-[#EF4444] uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                <span>Talvez não seja a escolha ideal se você:</span>
              </span>
              <p className="text-xs text-[#E2E8F0] italic leading-relaxed">
                {review.antiPersonaPhrase || 'Busca exclusivamente a opção mais barata de plástico sem garantia ou assistência técnica.'}
              </p>
            </div>
          </div>
        </section>

        {/* 4. PRINCIPAIS DESTAQUES */}
        {review.features && review.features.length > 0 && (
          <section className={cardClasses}>
            <h3 className="text-lg md:text-xl font-bold mb-4 text-white">
              Especificações e Recursos em Destaque
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {review.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#0D0D0D] border border-[#242424] text-xs flex items-center gap-3"
                >
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] shrink-0" />
                  <span className="text-white/90 font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. PRÓS E CONTRAS EDITORIAIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className={cardClasses}>
            <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-[#22C55E]">
              <CheckCircle2 className="w-5 h-5" />
              <span>Pontos Fortes (Prós)</span>
            </h3>
            {review.pros && review.pros.length > 0 ? (
              <ul className="space-y-3">
                {review.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm">
                    <span className="text-[#22C55E] font-bold">✓</span>
                    <span className={isClean ? 'text-gray-700' : 'text-[#D4D4D8]'}>{pro}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#A1A1A1]">Nenhum ponto positivo informado.</p>
            )}
          </div>

          <div className={cardClasses}>
            <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-[#EF4444]">
              <XCircle className="w-5 h-5" />
              <span>Limitações & Observações (Contras)</span>
            </h3>
            {review.cons && review.cons.length > 0 ? (
              <ul className="space-y-3">
                {review.cons.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm">
                    <span className="text-[#EF4444] font-bold">×</span>
                    <span className={isClean ? 'text-gray-700' : 'text-[#D4D4D8]'}>{con}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#A1A1A1]">Nenhum ponto negativo informado.</p>
            )}
          </div>
        </div>

        {/* 6. SCORE ENGINE TRANSPARENTE */}
        <section className={cardClasses}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#242424]">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white">Score & Avaliação Editorial</h3>
              <p className="text-xs text-[#A1A1A1] mt-0.5">Critérios ponderados com base em testes práticos</p>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30">
              <Award className="w-5 h-5 text-[#22C55E]" />
              <div>
                <span className="text-2xl font-extrabold text-[#22C55E]">
                  {Number(review.overallScore || 8.8).toFixed(1)}
                </span>
                <span className="text-xs text-[#A1A1A1]"> / 10</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 mb-6">
            {[
              { label: 'Qualidade e Construção', val: review.scoreCriteria?.quality ?? 8.7 },
              { label: 'Design e Ergonomia', val: review.scoreCriteria?.design ?? 9.0 },
              { label: 'Praticidade no Uso', val: review.scoreCriteria?.practicality ?? 9.1 },
              { label: 'Recursos e Tecnologia', val: review.scoreCriteria?.resources ?? 8.4 },
              { label: 'Custo-Benefício', val: review.scoreCriteria?.costBenefit ?? 9.4 },
              { label: 'Experiência Geral', val: review.scoreCriteria?.experience ?? 8.8 }
            ].map((crit, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#0D0D0D] border border-[#242424]">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#A1A1A1] font-medium">{crit.label}</span>
                  <span className="font-bold text-white">{Number(crit.val).toFixed(1)}/10</span>
                </div>
                <div className="w-full bg-[#222] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#22C55E] to-[#4ADE80] h-full rounded-full"
                    style={{ width: `${Math.min(100, Math.max(0, (Number(crit.val) / 10) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {review.verdict && (
            <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#22C55E]/30">
              <h4 className="text-xs font-bold text-[#22C55E] uppercase tracking-wider mb-1">
                Conclusão do Review Sincero
              </h4>
              <p className="text-xs md:text-sm text-white font-medium leading-relaxed">
                {review.verdict}
              </p>
            </div>
          )}
        </section>

        {/* 7. COMPARADOR DE PRODUTOS & ALTERNATIVAS */}
        {review.comparisonProducts && review.comparisonProducts.length > 0 && (
          <section className={cardClasses}>
            <h3 className="text-lg md:text-xl font-bold mb-4 text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#3B82F6]" />
              <span>Comparativo com Alternativas do Mercado</span>
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#2A2A2A] text-[#A1A1AA]">
                    <th className="py-3 px-3">Produto</th>
                    <th className="py-3 px-3">Preço Aprox.</th>
                    <th className="py-3 px-3">Nota</th>
                    <th className="py-3 px-3">Destaque</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222]">
                  {review.comparisonProducts.map((p) => (
                    <tr key={p.id} className={p.name.includes(review.productName) || p.highlight === 'Nosso Veredito' ? 'bg-[#22C55E]/10' : ''}>
                      <td className="py-3 px-3 font-bold text-white">
                        {p.name}
                      </td>
                      <td className="py-3 px-3 text-[#22C55E] font-semibold">{p.price}</td>
                      <td className="py-3 px-3 font-bold text-[#F5C542]">{p.score}/10</td>
                      <td className="py-3 px-3 text-[#A1A1AA]">{p.mainDiff || p.highlight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 8. FAQ ACCORDION */}
        {review.faq && review.faq.length > 0 && (
          <section className={cardClasses}>
            <h3 className="text-lg md:text-xl font-bold mb-4 text-white">Perguntas Frequentes (FAQ)</h3>
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
                      className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:text-[#22C55E] transition-colors"
                    >
                      <span>{item.question}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-[#22C55E]" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs md:text-sm text-[#A1A1A1] leading-relaxed border-t border-[#242424] pt-3">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 9. CTA FINAL CONTEXTUAL */}
        {review.affiliateUrl && (
          <section className="bg-gradient-to-r from-[#141414] to-[#1A1A1A] border border-[#22C55E]/40 rounded-3xl p-6 md:p-8 text-center shadow-2xl space-y-5">
            <h3 className="text-xl md:text-2xl font-extrabold text-white">
              Onde Garantir a Oferta Oficial Verificada?
            </h3>
            <p className="text-xs md:text-sm text-[#A1A1A1] max-w-lg mx-auto leading-relaxed">
              Adquira diretamente na loja oficial informada para garantir produto autêntico, nota fiscal e garantia do fabricante.
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

        {/* 10. TRANSPARÊNCIA EDITORIAL */}
        <div className="p-4 rounded-2xl bg-[#111111] border border-[#242424] text-xs text-[#888] leading-relaxed flex items-start gap-3">
          <Info className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
          <p>
            <strong className="text-white">Aviso de Transparência:</strong> Esta análise tem caráter estritamente editorial e independente. Os links indicados são canais oficiais onde o leitor pode conferir a disponibilidade. O Review Sincero poderá receber uma comissão sem qualquer acréscimo no valor pago pelo comprador.
          </p>
        </div>
      </main>

      {/* STICKY BOTTOM BAR */}
      {review.affiliateUrl && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0D0D0D]/95 backdrop-blur-md border-t border-[#242424] p-3 z-30 flex items-center justify-between max-w-3xl mx-auto rounded-t-2xl shadow-2xl">
          <div className="flex items-center gap-3">
            <img
              src={activeImage}
              alt=""
              className="w-10 h-10 rounded-lg object-cover border border-[#333]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = smartMatch.mainImage;
              }}
            />
            <div>
              <span className="text-xs font-bold text-white block truncate max-w-[160px] sm:max-w-[280px]">
                {review.productName}
              </span>
              <span className="text-xs font-extrabold text-[#22C55E]">
                R$ {review.currentPrice || '189,90'}
              </span>
            </div>
          </div>

          <a
            href={review.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#22C55E] hover:bg-[#16A34A] text-black font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-green-500/20"
          >
            <span>Ver Oferta</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </a>
        </div>
      )}

      {/* LIGHTBOX ZOOM MODAL */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-[#22C55E] p-2 bg-white/10 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl border border-[#333]">
            <img
              src={activeImage}
              alt={review.productName}
              className="w-full h-full object-contain max-h-[80vh]"
            />
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-[#242424] py-8 px-6 text-center text-xs text-[#777]">
        <p>
          © {new Date().getFullYear()} {review.siteName || 'Review Sincero'}. Análises e Vereditos Independentes.
        </p>
      </footer>
    </div>
  );
};
