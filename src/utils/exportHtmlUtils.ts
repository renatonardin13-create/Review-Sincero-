import { Review } from '../types';

export function generateStandaloneReviewHtml(review: Partial<Review>): string {
  const title = review.productName || 'Review Sincero';
  const headline = review.headline || review.productName || 'Análise Completa e Sincera';
  const siteName = review.siteName || 'Review Sincero';
  const author = review.author || 'Especialista em Reviews';
  const oldPrice = review.oldPrice ? `R$ ${review.oldPrice}` : '';
  const currentPrice = review.currentPrice ? `R$ ${review.currentPrice}` : '';
  const affiliateUrl = review.affiliateUrl || '#';
  const ctaText = review.ctaButtonText || 'GARANTIR COM DESCONTO AGORA →';
  const mainImage = review.mainImage || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=80';
  const score = review.overallScore || 9.4;
  const verdict = review.description || 'Produto aprovado nos testes práticos com excelente relação custo-benefício.';
  const pros = review.pros || ['Alta qualidade e durabilidade comprovada', 'Excelente custo-benefício', 'Fácil de usar e intuitivo'];
  const cons = review.cons || ['Estoque com unidades limitadas', 'Entrega pode variar conforme região'];
  const faqs = review.faq || [
    { question: 'O produto é original?', answer: 'Sim, recomendamos adquirir exclusivamente pelo link do site oficial indicado neste review.' },
    { question: 'Possui garantia de satisfação?', answer: 'Sim, o fabricante oferece garantia contra defeitos e prazo legal de devolução incondicional.' }
  ];

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | Review Sincero</title>
  <meta name="description" content="${review.seoSettings?.metaDescription || headline}" />
  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #08080A; color: #F3F4F6; }
    .gold-gradient { background: linear-gradient(135deg, #F5C542 0%, #E5A812 100%); }
    .gold-border { border-color: rgba(245, 197, 66, 0.3); }
  </style>
</head>
<body class="min-h-screen antialiased selection:bg-[#F5C542] selection:text-black">
  <!-- Top Trust Bar -->
  <header class="sticky top-0 z-40 bg-[#0E0E12]/95 backdrop-blur-md border-b border-[#22222A] px-4 py-3">
    <div class="max-w-5xl mx-auto flex items-center justify-between text-xs">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="font-extrabold text-white tracking-tight">${siteName}</span>
        <span class="text-gray-400 hidden sm:inline">| Análise Independente e Transparente</span>
      </div>
      <div class="text-gray-400 text-[11px]">
        Por <strong class="text-white">${author}</strong>
      </div>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-4 py-10 space-y-12">
    <!-- Hero Article Title & Badge -->
    <div class="space-y-4 text-center">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5C542]/10 border gold-border text-[#F5C542] text-xs font-black uppercase tracking-wider">
        <span>★ REVIEW SINCERO VERIFICADO 2026</span>
      </div>
      <h1 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
        ${headline}
      </h1>
      <p class="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
        Testamos o produto na prática e avaliamos pontos fortes, defeitos, custo-benefício e onde adquirir com total segurança.
      </p>
    </div>

    <!-- Main Showcase Card -->
    <div class="bg-[#121216] border border-[#22222A] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <!-- Image with Badge -->
        <div class="md:col-span-6 relative group">
          <div class="aspect-square rounded-2xl overflow-hidden bg-[#1A1A22] border border-[#2A2A35]">
            <img src="${mainImage}" alt="${title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div class="absolute top-3 left-3 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-xs font-bold text-[#F5C542]">
            Nota: ${score} / 10
          </div>
        </div>

        <!-- Product Verdict & CTA -->
        <div class="md:col-span-6 space-y-6">
          <div class="space-y-2">
            <span class="text-xs font-black text-[#F5C542] uppercase tracking-wider">VEREDITO DO ESPECIALISTA</span>
            <p class="text-sm sm:text-base text-gray-300 leading-relaxed">
              "${verdict}"
            </p>
          </div>

          <!-- Pricing Box -->
          <div class="p-5 rounded-2xl bg-[#181820] border border-[#262632] space-y-2">
            <span class="text-xs text-gray-400 font-medium">Preço com Desconto Especial Verificado:</span>
            <div class="flex items-baseline gap-3">
              ${oldPrice ? `<span class="text-sm text-gray-500 line-through">${oldPrice}</span>` : ''}
              <span class="text-3xl font-extrabold text-white">${currentPrice || 'Oferta Promocional'}</span>
            </div>
            <p class="text-[11px] text-emerald-400 font-semibold">
              ✓ Garantia oficial de satisfação inclusa
            </p>
          </div>

          <!-- CTA Button -->
          <a href="${affiliateUrl}" target="_blank" rel="noopener noreferrer" class="block w-full text-center py-4 px-6 rounded-2xl gold-gradient text-black font-black text-sm tracking-wide uppercase shadow-lg shadow-[#F5C542]/20 hover:opacity-95 transition-all transform hover:-translate-y-0.5">
            ${ctaText}
          </a>
          <p class="text-[10px] text-gray-500 text-center">
            Link direto e verificado para a loja/distribuidor oficial.
          </p>
        </div>
      </div>

      <!-- Pros & Cons Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[#22222A]">
        <div class="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
          <h3 class="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>✓ Pontos Fortes (Prós)</span>
          </h3>
          <ul class="space-y-2 text-xs text-gray-300">
            ${pros.map((p: string) => `<li class="flex items-start gap-2"><span class="text-emerald-400">✔</span><span>${p}</span></li>`).join('\n')}
          </ul>
        </div>

        <div class="p-5 rounded-2xl bg-red-950/20 border border-red-500/20 space-y-3">
          <h3 class="text-xs font-black text-red-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>⚠ Pontos de Atenção (Contras)</span>
          </h3>
          <ul class="space-y-2 text-xs text-gray-300">
            ${cons.map((c: string) => `<li class="flex items-start gap-2"><span class="text-red-400">✖</span><span>${c}</span></li>`).join('\n')}
          </ul>
        </div>
      </div>
    </div>

    <!-- FAQ Accordion -->
    <div class="bg-[#121216] border border-[#22222A] rounded-3xl p-6 sm:p-8 space-y-6">
      <div class="text-center space-y-1">
        <h2 class="text-xl font-extrabold text-white">Dúvidas Frequentes</h2>
        <p class="text-xs text-gray-400">Respostas diretas sobre o produto e segurança da compra.</p>
      </div>

      <div class="space-y-3">
        ${faqs.map((f: any, i: number) => `
          <div class="border border-[#22222C] rounded-xl overflow-hidden bg-[#181820]">
            <button onclick="toggleFaq(${i})" class="w-full p-4 text-left flex justify-between items-center text-xs font-bold text-white hover:text-[#F5C542] transition-colors">
              <span>${f.question}</span>
              <span id="faq-icon-${i}" class="text-base text-gray-400 font-mono">+</span>
            </button>
            <div id="faq-ans-${i}" class="hidden px-4 pb-4 text-xs text-gray-300 leading-relaxed border-t border-[#22222C] pt-3">
              ${f.answer}
            </div>
          </div>
        `).join('\n')}
      </div>
    </div>

    <!-- Secondary Sticky Floating CTA -->
    <div class="p-6 rounded-3xl bg-gradient-to-r from-[#181822] via-[#121218] to-[#181822] border gold-border text-center space-y-4">
      <h3 class="text-lg font-extrabold text-white">Pronto para tomar sua decisão com segurança?</h3>
      <p class="text-xs text-gray-400 max-w-lg mx-auto">
        Aproveite a garantia e as condições especiais diretamente pelo canal oficial.
      </p>
      <div class="max-w-md mx-auto">
        <a href="${affiliateUrl}" target="_blank" rel="noopener noreferrer" class="block w-full py-3.5 px-6 rounded-xl gold-gradient text-black font-extrabold text-xs uppercase shadow-md hover:opacity-95 transition-all">
          ${ctaText}
        </a>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="border-t border-[#1C1C24] py-8 text-center text-xs text-gray-500 space-y-2">
    <p>© ${new Date().getFullYear()} ${siteName}. Todos os direitos reservados.</p>
    <p class="text-[10px] text-gray-600 max-w-xl mx-auto px-4">
      Aviso de Transparência: Este review é independente e imparcial. Podemos receber comissão de afiliados caso você realize a compra através dos links indicados, sem nenhum custo adicional para você.
    </p>
  </footer>

  <script>
    function toggleFaq(index) {
      var ans = document.getElementById('faq-ans-' + index);
      var icon = document.getElementById('faq-icon-' + index);
      if (ans.classList.contains('hidden')) {
        ans.classList.remove('hidden');
        icon.innerText = '−';
      } else {
        ans.classList.add('hidden');
        icon.innerText = '+';
      }
    }
  </script>
</body>
</html>`;
}
