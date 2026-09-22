import { Review, FAQItem, ComparisonProductItem, TestimonialItem } from '../types';
import { matchProductImage } from './productImageMatcher';
import { generatePurchaseNotificationRuntimeScript } from './purchaseNotificationRuntime';

function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function generateStandaloneReviewHtml(review: Partial<Review>): string {
  const productName = review.productName || 'Review Sincero';
  const headline = review.headline || `${productName}: Vale a pena comprar? Confira a análise sincera`;
  const siteName = review.siteName || 'Review Sincero';
  const author = review.author || 'Especialista em Reviews';
  const category = review.category || 'Geral';
  const platform = review.platform || 'Loja Oficial';
  const description = review.description || 'Confira nosso teste prático com avaliação de durabilidade, recursos, desempenho real e onde encontrar a melhor oferta com segurança.';
  const howItWorks = review.howItWorks || '';
  const currentPrice = review.currentPrice || '189,90';
  const oldPrice = review.oldPrice || '';
  const affiliateUrl = review.affiliateUrl || '#';
  const ctaText = review.ctaButtonText || 'CONFERIR OFERTA OFICIAL NA LOJA →';
  const overallScore = Number(review.overallScore || 8.8).toFixed(1);
  const verdict = review.verdict || 'Pelo preço promocional e benefícios entregues, é uma escolha com excelente relação custo-benefício. Aprovado nos testes práticos.';
  const antiPersona = review.antiPersonaPhrase || 'Busca exclusivamente a opção mais barata de plástico sem garantia ou assistência técnica.';
  
  // Smart Match para imagens verificadas idênticas ao ReviewRenderer
  const smartMatch = matchProductImage(productName, typeof category === 'string' ? category : undefined);
  
  // Compila lista de imagens da galeria
  const imagesList: string[] = [];
  if (review.mainImage && (review.mainImage.startsWith('http') || review.mainImage.startsWith('data:'))) {
    imagesList.push(review.mainImage.trim());
  } else {
    imagesList.push(smartMatch.mainImage);
  }

  if (review.images && Array.isArray(review.images)) {
    review.images.forEach((img) => {
      if (img && typeof img === 'string' && img.trim() && !imagesList.includes(img.trim())) {
        imagesList.push(img.trim());
      }
    });
  }

  if (imagesList.length < 2 && smartMatch.gallery) {
    smartMatch.gallery.forEach((img) => {
      if (img && img.trim() && !imagesList.includes(img.trim())) {
        imagesList.push(img.trim());
      }
    });
  }

  const activeMainImage = imagesList[0] || smartMatch.mainImage;

  // Prós e Contras
  const pros = review.pros && review.pros.length > 0
    ? review.pros
    : ['Excelente acabamento e durabilidade comprovada', 'Ótima relação custo-benefício na faixa de preço', 'Fácil de usar e intuitivo no dia a dia'];
  
  const cons = review.cons && review.cons.length > 0
    ? review.cons
    : ['Alta procura pode gerar oscilação no estoque promocional', 'Manual requer leitura atenta para configuração inicial'];

  // Público Alvo / Ideal Para
  const audience = review.audience && review.audience.length > 0
    ? review.audience
    : ['Quem busca eficiência e qualidade comprovada', 'Quem pesquisa antes de comprar para evitar frustrações', 'Quem valoriza garantia oficial e nota fiscal'];

  // Destaques / Features
  const features = review.features && review.features.length > 0 ? review.features : [];

  // Critérios de Pontuação (Score Engine)
  const criteria = [
    { label: 'Qualidade e Construção', val: Number(review.scoreCriteria?.quality ?? 8.7).toFixed(1) },
    { label: 'Design e Ergonomia', val: Number(review.scoreCriteria?.design ?? 9.0).toFixed(1) },
    { label: 'Praticidade no Uso', val: Number(review.scoreCriteria?.practicality ?? 9.1).toFixed(1) },
    { label: 'Recursos e Tecnologia', val: Number(review.scoreCriteria?.resources ?? 8.4).toFixed(1) },
    { label: 'Custo-Benefício', val: Number(review.scoreCriteria?.costBenefit ?? 9.4).toFixed(1) },
    { label: 'Experiência Geral', val: Number(review.scoreCriteria?.experience ?? 8.8).toFixed(1) }
  ];

  // FAQ
  const faqList: FAQItem[] = review.faq && review.faq.length > 0
    ? review.faq
    : [
        {
          id: 'faq-1',
          question: 'O produto é original e vem com garantia?',
          answer: 'Sim, comprando pelo link da loja oficial indicada nesta análise, você tem garantia integral do fabricante e nota fiscal.'
        },
        {
          id: 'faq-2',
          question: 'Qual é o prazo de entrega aproximado?',
          answer: 'O envio costuma ser despachado rapidamente com código de rastreamento oficial. O tempo médio varia de 2 a 7 dias úteis.'
        },
        {
          id: 'faq-3',
          question: 'Possui política de troca ou devolução?',
          answer: 'Sim, o Código de Defesa do Consumidor garante 7 dias para arrependimento e devolução gratuita com reembolso total.'
        }
      ];

  // Depoimentos
  const testimonials: TestimonialItem[] = review.testimonials && review.testimonials.length > 0
    ? review.testimonials
    : [];

  // Tabela Comparativa
  const comparisonProducts: ComparisonProductItem[] = review.comparisonProducts && review.comparisonProducts.length > 0
    ? review.comparisonProducts
    : [];

  return `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(productName)} | Análise & Veredito Editorial Sincero</title>
  <meta name="description" content="${escapeHtml(review.seoSettings?.metaDescription || description)}" />
  
  <!-- Tailwind CSS via CDN Oficial -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: '#22C55E',
            gold: '#F5C542',
            danger: '#EF4444',
            darkbg: '#080808',
            darkcard: '#121212',
            darkborder: '#242424'
          }
        }
      }
    }
  </script>

  <!-- Google Fonts: Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #080808;
      color: #FFFFFF;
      overflow-x: hidden;
    }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  </style>
</head>
<body class="min-h-screen bg-[#080808] text-white antialiased selection:bg-[#22C55E] selection:text-black pb-28">

  <!-- =========================================================================
       1. HEADER EDITORIAL DE TRANSPARÊNCIA E CONFIANÇA
       ========================================================================= -->
  <header class="sticky top-0 z-40 bg-[#0E0E0E]/95 backdrop-blur-md border-b border-[#242424] px-4 py-3">
    <div class="max-w-5xl mx-auto flex items-center justify-between text-xs">
      <div class="flex items-center gap-2.5">
        <span class="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse"></span>
        <span class="font-extrabold text-white tracking-tight">${escapeHtml(siteName)}</span>
        <span class="text-[#71717A] hidden sm:inline">•</span>
        <span class="text-[#A1A1AA] hidden sm:inline">Análise Independente & Transparente</span>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-[#A1A1AA] hidden md:inline text-[11px]">
          Por <strong class="text-white">${escapeHtml(author)}</strong>
        </span>
        ${affiliateUrl && affiliateUrl !== '#' ? `
          <a
            href="${escapeHtml(affiliateUrl)}"
            target="_blank"
            rel="noopener noreferrer"
            class="bg-[#22C55E] hover:bg-[#16A34A] text-black font-extrabold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-green-500/20 transition-all hover:scale-105"
          >
            <span>Ver Oferta</span>
            <svg class="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        ` : ''}
      </div>
    </div>
  </header>

  <!-- =========================================================================
       2. HERO SECTION
       ========================================================================= -->
  <section class="max-w-5xl mx-auto px-4 py-6 md:py-10">
    <!-- Breadcrumb / Category -->
    <div class="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#A1A1AA] mb-4">
      <span class="px-2.5 py-0.5 rounded-md bg-[#1A1A1A] border border-[#2A2A2A] text-[#22C55E]">
        ${escapeHtml(category)}
      </span>
      <span>•</span>
      <span>${escapeHtml(platform)}</span>
      <span>•</span>
      <span class="text-[#F5C542] flex items-center gap-1">
        <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z"/>
        </svg>
        <span>Análise Atualizada 2026</span>
      </span>
    </div>

    <!-- Headline -->
    <h2 class="text-xs md:text-sm font-bold text-[#F5C542] uppercase tracking-wider mb-2">
      ${escapeHtml(headline)}
    </h2>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left Column: Product Info & Price -->
      <div class="lg:col-span-7 space-y-5">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-white">
          ${escapeHtml(productName)}
        </h1>
        
        <p class="text-sm md:text-base leading-relaxed text-[#A1A1A1]">
          ${escapeHtml(description)}
        </p>

        <!-- Score & Verdict pill -->
        <div class="flex flex-wrap items-center gap-3 pt-1">
          <div class="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F5C542]/10 border border-[#F5C542]/30 text-[#F5C542] font-extrabold text-sm">
            <svg class="w-4 h-4 fill-[#F5C542]" viewBox="0 0 24 24">
              <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z"/>
            </svg>
            <span>Nota Editorial: ${overallScore} / 10</span>
          </div>
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-xs font-bold">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Recomendação Positiva</span>
          </div>
        </div>

        <!-- Price Box -->
        <div class="p-4 rounded-2xl bg-[#121212] border border-[#2A2A2A] space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs text-[#A1A1AA] uppercase tracking-wider font-semibold">
              Preço Verificado na Loja Oficial:
            </span>
            <span class="text-[11px] text-[#22C55E] flex items-center gap-1 font-semibold">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke-width="2"/>
                <polyline points="12 6 12 12 16 14" stroke-width="2"/>
              </svg>
              Hoje
            </span>
          </div>

          <div class="flex items-baseline gap-3">
            <span class="text-3xl sm:text-4xl font-extrabold text-[#22C55E]">
              R$ ${escapeHtml(currentPrice)}
            </span>
            ${oldPrice ? `
              <span class="text-sm text-[#888] line-through">
                De R$ ${escapeHtml(oldPrice)}
              </span>
            ` : ''}
          </div>
          <p class="text-[11px] text-[#888]">
            * Preço sujeito a alteração conforme disponibilidade da loja oficial informada.
          </p>
        </div>

        <!-- CTA Principal -->
        ${affiliateUrl && affiliateUrl !== '#' ? `
          <div class="pt-2">
            <a
              href="${escapeHtml(affiliateUrl)}"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#22C55E] hover:bg-[#16A34A] text-black font-extrabold px-8 py-4 rounded-2xl text-sm md:text-base shadow-xl shadow-green-500/20 transition-all hover:scale-[1.02]"
            >
              <span>${escapeHtml(ctaText)}</span>
              <svg class="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        ` : ''}
      </div>

      <!-- Right Column: Galeria de Fotos Reais com Troca Instantânea -->
      <div class="lg:col-span-5 space-y-3">
        <div class="relative rounded-3xl overflow-hidden border border-[#2A2A2A] shadow-2xl bg-[#111111] aspect-square group">
          <img
            id="main-product-img"
            src="${escapeHtml(activeMainImage)}"
            alt="${escapeHtml(productName)}"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          <!-- Badge Context -->
          <div class="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[11px] font-semibold text-white flex items-center gap-1.5 shadow-md">
            <svg class="w-3.5 h-3.5 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span id="gallery-badge-text">Foto do Produto (1/${imagesList.length})</span>
          </div>
        </div>

        <!-- Miniaturas clicáveis -->
        ${imagesList.length > 1 ? `
          <div class="flex items-center gap-2 overflow-x-auto pb-1">
            ${imagesList.map((img, idx) => `
              <button
                type="button"
                onclick="changeGalleryImage('${escapeHtml(img)}', ${idx + 1}, ${imagesList.length}, this)"
                class="gallery-thumb relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${idx === 0 ? 'border-[#22C55E] scale-105 shadow-md shadow-green-500/20' : 'border-[#2A2A2A] opacity-60 hover:opacity-100'}"
              >
                <img
                  src="${escapeHtml(img)}"
                  alt="Miniatura ${idx + 1}"
                  class="w-full h-full object-cover"
                />
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  </section>

  <!-- =========================================================================
       3. CONTEÚDO EDITORIAL PRINCIPAL
       ========================================================================= -->
  <main class="max-w-4xl mx-auto px-4 space-y-8 pb-10">

    <!-- 1. DECISÃO RÁPIDA: VEREDITO EM 15 SEGUNDOS -->
    <section class="bg-gradient-to-br from-[#121212] to-[#181818] border border-[#2A2A2A] rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      <div class="flex items-center gap-2 text-xs font-bold text-[#22C55E] uppercase tracking-wider mb-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="7" stroke-width="2"/>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" stroke-width="2"/>
        </svg>
        <span>Decisão Rápida</span>
      </div>

      <h3 class="text-xl md:text-2xl font-extrabold text-white mb-3">
        Veredito em 15 Segundos
      </h3>
      
      <p class="text-sm md:text-base text-[#D4D4D8] leading-relaxed mb-6">
        ${escapeHtml(description)}
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <!-- O Que Mais Chamou Atenção -->
        <div class="p-4 rounded-2xl bg-[#0D0D0D] border border-[#22C55E]/30 space-y-2.5">
          <span class="text-xs font-bold text-[#22C55E] uppercase tracking-wider flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>O Que Mais Chamou Atenção</span>
          </span>
          <ul class="space-y-2">
            ${pros.slice(0, 3).map((st) => `
              <li class="text-xs text-[#E4E4E7] flex items-start gap-2">
                <span class="text-[#22C55E] font-bold">✓</span>
                <span>${escapeHtml(st)}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Pontos Que Merecem Atenção -->
        <div class="p-4 rounded-2xl bg-[#0D0D0D] border border-[#EF4444]/30 space-y-2.5">
          <span class="text-xs font-bold text-[#EF4444] uppercase tracking-wider flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Pontos Que Merecem Atenção</span>
          </span>
          <ul class="space-y-2">
            ${cons.slice(0, 2).map((wk) => `
              <li class="text-xs text-[#E4E4E7] flex items-start gap-2">
                <span class="text-[#EF4444] font-bold">×</span>
                <span>${escapeHtml(wk)}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    </section>

    <!-- 2. O QUE É E COMO FUNCIONA NA PRÁTICA -->
    <section class="bg-[#121212] border border-[#242424] rounded-2xl p-5 md:p-6">
      <h3 class="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-white">
        <svg class="w-5 h-5 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke-width="2"/>
          <line x1="12" y1="16" x2="12" y2="12" stroke-width="2"/>
          <line x1="12" y1="8" x2="12.01" y2="8" stroke-width="2"/>
        </svg>
        <span>O Que É & Como Funciona na Prática</span>
      </h3>
      <p class="leading-relaxed text-sm md:text-base text-[#A1A1A1]">
        ${escapeHtml(description)}
      </p>
      ${howItWorks ? `
        <div class="mt-5 pt-5 border-t border-[#242424]">
          <h4 class="font-bold text-xs uppercase tracking-wider mb-2 text-white flex items-center gap-1.5">
            <span class="text-[#F5C542]">★</span>
            <span>Experiência de Uso no Dia a Dia:</span>
          </h4>
          <p class="text-xs md:text-sm leading-relaxed text-[#A1A1A1]">
            ${escapeHtml(howItWorks)}
          </p>
        </div>
      ` : ''}
    </section>

    <!-- 3. PARA QUEM É / PARA QUEM NÃO É -->
    <section class="bg-[#121212] border border-[#242424] rounded-2xl p-5 md:p-6">
      <h3 class="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-white">
        <svg class="w-5 h-5 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
        <span>Perfil Recomendado: Para Quem Faz Sentido?</span>
      </h3>
      
      <div class="space-y-4">
        <div>
          <span class="text-xs font-bold text-[#22C55E] uppercase tracking-wider block mb-2">
            Recomendamos especialmente para:
          </span>
          <ul class="space-y-2.5">
            ${audience.map((item) => `
              <li class="flex items-start gap-3 text-xs md:text-sm">
                <svg class="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-[#D4D4D8]">${escapeHtml(item)}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="p-4 rounded-xl bg-[#0D0D0D] border border-[#EF4444]/30 mt-4">
          <span class="text-[11px] font-bold text-[#EF4444] uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke-width="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke-width="2"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke-width="2"/>
            </svg>
            <span>Talvez não seja a escolha ideal se você:</span>
          </span>
          <p class="text-xs text-[#E2E8F0] italic leading-relaxed">
            "${escapeHtml(antiPersona)}"
          </p>
        </div>
      </div>
    </section>

    <!-- 4. PRINCIPAIS DESTAQUES E ESPECIFICAÇÕES -->
    ${features.length > 0 ? `
      <section class="bg-[#121212] border border-[#242424] rounded-2xl p-5 md:p-6">
        <h3 class="text-lg md:text-xl font-bold mb-4 text-white">
          Especificações e Recursos em Destaque
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${features.map((feat) => `
            <div class="p-3.5 rounded-xl bg-[#0D0D0D] border border-[#242424] text-xs flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-[#22C55E] shrink-0"></span>
              <span class="text-white/90 font-medium">${escapeHtml(feat)}</span>
            </div>
          `).join('')}
        </div>
      </section>
    ` : ''}

    <!-- 5. PRÓS E CONTRAS EDITORIAIS -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div class="bg-[#121212] border border-[#242424] rounded-2xl p-5 md:p-6">
        <h3 class="text-base font-bold mb-4 flex items-center gap-2 text-[#22C55E]">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Pontos Fortes (Prós)</span>
        </h3>
        <ul class="space-y-3">
          ${pros.map((pro) => `
            <li class="flex items-start gap-2.5 text-xs md:text-sm">
              <span class="text-[#22C55E] font-bold">✓</span>
              <span class="text-[#D4D4D8]">${escapeHtml(pro)}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div class="bg-[#121212] border border-[#242424] rounded-2xl p-5 md:p-6">
        <h3 class="text-base font-bold mb-4 flex items-center gap-2 text-[#EF4444]">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke-width="2"/>
            <line x1="15" y1="9" x2="9" y2="15" stroke-width="2"/>
            <line x1="9" y1="9" x2="15" y2="15" stroke-width="2"/>
          </svg>
          <span>Limitações & Observações (Contras)</span>
        </h3>
        <ul class="space-y-3">
          ${cons.map((con) => `
            <li class="flex items-start gap-2.5 text-xs md:text-sm">
              <span class="text-[#EF4444] font-bold">×</span>
              <span class="text-[#D4D4D8]">${escapeHtml(con)}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>

    <!-- 6. SCORE ENGINE TRANSPARENTE -->
    <section class="bg-[#121212] border border-[#242424] rounded-2xl p-5 md:p-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#242424]">
        <div>
          <h3 class="text-lg md:text-xl font-bold text-white">Score & Avaliação Editorial</h3>
          <p class="text-xs text-[#A1A1A1] mt-0.5">Critérios ponderados com base em testes práticos</p>
        </div>
        <div class="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30">
          <svg class="w-5 h-5 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="7" stroke-width="2"/>
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" stroke-width="2"/>
          </svg>
          <div>
            <span class="text-2xl font-extrabold text-[#22C55E]">${overallScore}</span>
            <span class="text-xs text-[#A1A1A1]"> / 10</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 mb-6">
        ${criteria.map((crit) => {
          const numVal = parseFloat(crit.val);
          const percent = Math.min(100, Math.max(0, (numVal / 10) * 100));
          return `
            <div class="p-3.5 rounded-xl bg-[#0D0D0D] border border-[#242424]">
              <div class="flex items-center justify-between text-xs mb-2">
                <span class="text-[#A1A1A1] font-medium">${escapeHtml(crit.label)}</span>
                <span class="font-bold text-white">${crit.val}/10</span>
              </div>
              <div class="w-full bg-[#222] h-2 rounded-full overflow-hidden">
                <div
                  class="bg-gradient-to-r from-[#22C55E] to-[#4ADE80] h-full rounded-full"
                  style="width: ${percent}%"
                ></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      ${verdict ? `
        <div class="p-4 rounded-xl bg-[#0D0D0D] border border-[#22C55E]/30">
          <h4 class="text-xs font-bold text-[#22C55E] uppercase tracking-wider mb-1">
            Conclusão do Review Sincero
          </h4>
          <p class="text-xs md:text-sm text-white font-medium leading-relaxed">
            "${escapeHtml(verdict)}"
          </p>
        </div>
      ` : ''}
    </section>

    <!-- 7. COMPARADOR DE PRODUTOS & ALTERNATIVAS (QUANDO HOUVER) -->
    ${comparisonProducts.length > 0 ? `
      <section class="bg-[#121212] border border-[#242424] rounded-2xl p-5 md:p-6">
        <h3 class="text-lg md:text-xl font-bold mb-4 text-white flex items-center gap-2">
          <svg class="w-5 h-5 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <polygon points="12 2 2 7 12 12 22 7 12 2" stroke-width="2"/>
            <polyline points="2 17 12 22 22 17" stroke-width="2"/>
            <polyline points="2 12 12 17 22 12" stroke-width="2"/>
          </svg>
          <span>Comparativo com Alternativas do Mercado</span>
        </h3>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-[#2A2A2A] text-[#A1A1AA]">
                <th class="py-3 px-3">Produto</th>
                <th class="py-3 px-3">Preço Aprox.</th>
                <th class="py-3 px-3">Nota</th>
                <th class="py-3 px-3">Destaque</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#222]">
              ${comparisonProducts.map((p) => {
                const isCurrent = p.name.includes(productName) || p.highlight === 'Nosso Veredito';
                return `
                  <tr class="${isCurrent ? 'bg-[#22C55E]/10' : ''}">
                    <td class="py-3 px-3 font-bold text-white">${escapeHtml(p.name)}</td>
                    <td class="py-3 px-3 text-[#22C55E] font-semibold">${escapeHtml(p.price)}</td>
                    <td class="py-3 px-3 font-bold text-[#F5C542]">${escapeHtml(p.score)}/10</td>
                    <td class="py-3 px-3 text-[#A1A1AA]">${escapeHtml(p.mainDiff || p.highlight)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </section>
    ` : ''}

    <!-- 8. AVALIAÇÕES & DEPOIMENTOS REAIS DE COMPRADORES (QUANDO HOUVER) -->
    ${testimonials.length > 0 ? `
      <section class="bg-[#121212] border border-[#242424] rounded-2xl p-5 md:p-6 space-y-4">
        <h3 class="text-lg md:text-xl font-bold text-white flex items-center gap-2">
          <svg class="w-5 h-5 text-[#F5C542] fill-current" viewBox="0 0 24 24">
            <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z"/>
          </svg>
          <span>Avaliações & Fotos Reais de Compradores</span>
        </h3>
        <p class="text-xs text-[#A1A1A1]">
          Comentários verificados de pessoas reais que adquiriram e testaram o produto.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          ${testimonials.map((t) => `
            <div class="p-4 rounded-xl bg-[#0D0D0D] border border-[#242424] space-y-3">
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs text-white">${escapeHtml(t.name || 'Comprador Verificado')}</span>
                <span class="text-xs text-[#F5C542]">
                  ${'★'.repeat(t.rating || 5)}${'☆'.repeat(5 - (t.rating || 5))}
                </span>
              </div>
              <p class="text-xs text-[#D4D4D4] leading-relaxed italic">
                "${escapeHtml(t.text)}"
              </p>
              ${t.photo && t.photo.trim().startsWith('http') ? `
                <div class="w-full h-36 rounded-lg overflow-hidden border border-[#222]">
                  <img src="${escapeHtml(t.photo.trim())}" alt="Foto de unboxing" class="w-full h-full object-cover" />
                </div>
              ` : ''}
              <div class="text-[10px] text-[#22C55E] flex items-center gap-1 font-semibold pt-1">
                <span>✓</span>
                <span>${escapeHtml(t.origin || 'Compra Verificada')}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    ` : ''}

    <!-- 9. FAQ ACCORDION -->
    <section class="bg-[#121212] border border-[#242424] rounded-2xl p-5 md:p-6">
      <h3 class="text-lg md:text-xl font-bold mb-4 text-white">Perguntas Frequentes (FAQ)</h3>
      <div class="space-y-2.5">
        ${faqList.map((item, idx) => `
          <div class="border border-[#242424] rounded-xl bg-[#0D0D0D] overflow-hidden">
            <button
              type="button"
              onclick="toggleFaqAccordion('faq-ans-${idx}', 'faq-icon-${idx}')"
              class="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:text-[#22C55E] transition-colors cursor-pointer"
            >
              <span>${escapeHtml(item.question)}</span>
              <svg id="faq-icon-${idx}" class="w-4 h-4 text-[#22C55E] transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div id="faq-ans-${idx}" class="hidden px-4 pb-4 text-xs md:text-sm text-[#A1A1A1] leading-relaxed border-t border-[#242424] pt-3">
              ${escapeHtml(item.answer)}
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- 10. CTA FINAL CONTEXTUAL -->
    ${affiliateUrl && affiliateUrl !== '#' ? `
      <section class="bg-gradient-to-r from-[#141414] to-[#1A1A1A] border border-[#22C55E]/40 rounded-3xl p-6 md:p-8 text-center shadow-2xl space-y-5">
        <h3 class="text-xl md:text-2xl font-extrabold text-white">
          Onde Garantir a Oferta Oficial Verificada?
        </h3>
        <p class="text-xs md:text-sm text-[#A1A1A1] max-w-lg mx-auto leading-relaxed">
          Adquira diretamente na loja oficial informada para garantir produto autêntico, nota fiscal e garantia do fabricante.
        </p>
        <div>
          <a
            href="${escapeHtml(affiliateUrl)}"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-3 bg-[#22C55E] hover:bg-[#16A34A] text-black font-extrabold px-8 py-4 rounded-2xl text-sm md:text-base shadow-xl shadow-green-500/20 transition-transform hover:scale-105"
          >
            <span>${escapeHtml(ctaText)}</span>
            <svg class="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </section>
    ` : ''}

    <!-- 11. TRANSPARÊNCIA EDITORIAL -->
    <div class="p-4 rounded-2xl bg-[#111111] border border-[#242424] text-xs text-[#888] leading-relaxed flex items-start gap-3">
      <svg class="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke-width="2"/>
        <line x1="12" y1="16" x2="12" y2="12" stroke-width="2"/>
        <line x1="12" y1="8" x2="12.01" y2="8" stroke-width="2"/>
      </svg>
      <p>
        <strong class="text-white">Aviso de Transparência:</strong> Esta análise tem caráter estritamente editorial e independente. Os links indicados são canais oficiais onde o leitor pode conferir a disponibilidade. O Review Sincero poderá receber uma comissão sem qualquer acréscimo no valor pago pelo comprador.
      </p>
    </div>
  </main>

  <!-- =========================================================================
       4. STICKY BOTTOM BAR (BARRA FIXA NO RODAPÉ)
       ========================================================================= -->
  ${affiliateUrl && affiliateUrl !== '#' ? `
    <div class="fixed bottom-0 left-0 right-0 bg-[#0D0D0D]/95 backdrop-blur-md border-t border-[#242424] p-3 z-30 flex items-center justify-between max-w-3xl mx-auto rounded-t-2xl shadow-2xl">
      <div class="flex items-center gap-3">
        <img
          id="sticky-product-img"
          src="${escapeHtml(activeMainImage)}"
          alt=""
          class="w-10 h-10 rounded-lg object-cover border border-[#333]"
        />
        <div>
          <span class="text-xs font-bold text-white block truncate max-w-[160px] sm:max-w-[280px]">
            ${escapeHtml(productName)}
          </span>
          <span class="text-xs font-extrabold text-[#22C55E]">
            R$ ${escapeHtml(currentPrice)}
          </span>
        </div>
      </div>

      <a
        href="${escapeHtml(affiliateUrl)}"
        target="_blank"
        rel="noopener noreferrer"
        class="bg-[#22C55E] hover:bg-[#16A34A] text-black font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-green-500/20"
      >
        <span>Ver Oferta</span>
        <svg class="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </a>
    </div>
  ` : ''}

  <!-- =========================================================================
       5. FOOTER
       ========================================================================= -->
  <footer class="border-t border-[#242424] py-8 px-6 text-center text-xs text-[#777]">
    <p>
      © ${new Date().getFullYear()} ${escapeHtml(siteName)}. Análises e Vereditos Independentes.
    </p>
  </footer>

  <!-- =========================================================================
       6. SCRIPTS VANILLA (INTERATIVIDADE LEVE & SEM FRAMEWORKS)
       ========================================================================= -->
  <script>
    function changeGalleryImage(src, currentIdx, total, btnElement) {
      var mainImg = document.getElementById('main-product-img');
      var stickyImg = document.getElementById('sticky-product-img');
      var badgeText = document.getElementById('gallery-badge-text');
      if (mainImg) mainImg.src = src;
      if (stickyImg) stickyImg.src = src;
      if (badgeText) badgeText.innerText = 'Foto do Produto (' + currentIdx + '/' + total + ')';

      var allThumbs = document.querySelectorAll('.gallery-thumb');
      allThumbs.forEach(function(t) {
        t.classList.remove('border-[#22C55E]', 'scale-105', 'shadow-md', 'shadow-green-500/20');
        t.classList.add('border-[#2A2A2A]', 'opacity-60');
      });
      if (btnElement) {
        btnElement.classList.add('border-[#22C55E]', 'scale-105', 'shadow-md', 'shadow-green-500/20');
        btnElement.classList.remove('border-[#2A2A2A]', 'opacity-60');
      }
    }

    function toggleFaqAccordion(ansId, iconId) {
      var ans = document.getElementById(ansId);
      var icon = document.getElementById(iconId);
      if (!ans) return;
      if (ans.classList.contains('hidden')) {
        ans.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      } else {
        ans.classList.add('hidden');
        if (icon) icon.style.transform = 'rotate(0deg)';
      }
    }
  </script>
  ${generatePurchaseNotificationRuntimeScript(review as Review)}
</body>
</html>`;
}
