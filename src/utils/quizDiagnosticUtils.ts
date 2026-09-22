import { QuizConfig, QuizQuestion, QuizResultProfile, QuizLeadCaptureConfig, QuizOfferConfig, QuizThemeConfig, Review } from '../types';
import { escapeHtml } from './quizGeneratorUtils';

/**
 * Default Theme for Quiz Diagnóstico (Soft Green Mobile-First UX)
 */
export const DEFAULT_DIAGNOSTIC_THEME: QuizThemeConfig = {
  primaryColor: '#16A34A', // Vibrant Emerald
  secondaryColor: '#15803D',
  bgColor: '#F2F9F4',      // Soft Light Green
  cardBgColor: '#FFFFFF',  // Pure White Cards
  borderColor: '#E2E8F0',  // Gentle Border
  textColor: '#133E2B',    // Dark Forest Green Text
  borderRadius: '16px',
  contentMaxWidth: '480px'
};

/**
 * Creates default Diagnostic / Funnel settings from Product / Review data
 */
export function generateDefaultDiagnosticConfig(
  reviewData: Partial<Review>,
  existingQuestions: QuizQuestion[] = []
): Partial<QuizConfig> {
  const pName = reviewData.productName?.trim() || 'Produto';
  const price = reviewData.currentPrice ? `R$ ${reviewData.currentPrice}` : 'Oferta Especial';
  const oldPrice = reviewData.oldPrice ? `R$ ${reviewData.oldPrice}` : '';
  const guarantee = reviewData.guaranteeDays || 30;
  const features = reviewData.features || [];
  const pros = reviewData.pros || [];
  const ctaUrl = reviewData.affiliateUrl || (reviewData.slug ? `/review/${reviewData.slug}` : '#');

  // Convert or create diagnostic questions
  const diagnosticQuestions: QuizQuestion[] = [
    {
      id: 'diag-q1',
      question: `Qual é o seu principal objetivo com o ${pName}?`,
      description: 'Selecione a opção que melhor descreve sua necessidade atual:',
      type: 'single-select',
      options: [
        `Conquistar ${features[0] || 'resultados rápidos com máxima eficiência'}`,
        `Economizar tempo e evitar insatisfações no dia a dia`,
        `Substituir soluções antigas que não trazem o desempenho esperado`,
        `Apenas entender se o ${pName} realmente vale o investimento`
      ],
      correctAnswerIndex: 0,
      explanation: `O ${pName} foi projetado especificamente para atender seu objetivo com alta performance.`,
      optionScores: [30, 25, 20, 15]
    },
    {
      id: 'diag-q2',
      question: 'Quais dificuldades você enfrenta atualmente na sua rotina?',
      description: 'Selecione todas as opções que se aplicam a você:',
      type: 'multi-select',
      options: [
        'Falta de praticidade e complicações com produtos convencionais',
        'Custo elevado de soluções alternativas no mercado',
        'Insegurança sobre a durabilidade e garantia do produto',
        'Dificuldade para encontrar o produto 100% original com suporte'
      ],
      correctAnswerIndex: 0,
      explanation: 'Identificamos que o produto ataca diretamente esses pontos críticos.',
      optionScores: [10, 10, 10, 10]
    },
    {
      id: 'diag-q3',
      question: 'Qual é o seu nível de urgência para obter resultados com a compra?',
      description: 'Arraste o indicador para selecionar:',
      type: 'slider',
      options: ['Urgência Baixa', 'Urgência Média', 'Urgência Alta', 'Urgência Máxima'],
      correctAnswerIndex: 0,
      explanation: 'Quanto maior a urgência, mais recomendado é aproveitar o lote promocional.',
      sliderMin: 1,
      sliderMax: 10,
      sliderStep: 1,
      sliderUnit: 'nível',
      sliderInitial: 8,
      optionScores: [5, 10, 20, 30]
    },
    {
      id: 'diag-q4',
      question: 'Qual é a sua faixa etária ou perfil de uso?',
      description: 'Selecione para personalizarmos seu diagnóstico:',
      type: 'single-select',
      options: [
        'Uso Pessoal / Rotina Individual',
        'Uso Familiar / Compartilhado',
        'Uso Profissional / Alta Exigência',
        'Iniciante buscando praticidade'
      ],
      correctAnswerIndex: 0,
      explanation: 'O produto possui suporte e ergonomia adaptada para seu perfil.',
      optionScores: [20, 25, 30, 15]
    },
    {
      id: 'diag-q5',
      question: `Você já tentou outras marcas ou alternativas antes de conhecer o ${pName}?`,
      description: 'Escolha uma alternativa:',
      type: 'single-select',
      options: [
        'Sim, mas não fiquei 100% satisfeito com o resultado',
        'Sim, mas durou pouco tempo ou não tinha garantia',
        'Não, esta é a primeira vez que procuro essa solução',
        'Já conheço o produto e quero garantir o melhor preço'
      ],
      correctAnswerIndex: 0,
      explanation: 'Compradores que migraram relatam índice de satisfação superior a 98%.',
      optionScores: [25, 20, 15, 30]
    }
  ];

  const resultProfiles: QuizResultProfile[] = [
    {
      id: 'res-a',
      title: 'Perfil Ideal — Recomendação Máxima (100% Compatível)',
      description: `Com base no seu diagnóstico, o ${pName} atende 100% das suas necessidades. Suas respostas indicam alta compatibilidade com as características de ${features[0] || 'alta durabilidade e performance'}.`,
      minScore: 60,
      maxScore: 100,
      ctaText: `GARANTIR ${pName.toUpperCase()} NA OFERTA OFICIAL (${price})`,
      ctaUrl: ctaUrl
    },
    {
      id: 'res-b',
      title: 'Perfil Altamente Recomendado (85% Compatível)',
      description: `Seu perfil tem forte recomendação para o uso do ${pName}. Você obterá excelentes resultados e praticidade na sua rotina diária.`,
      minScore: 30,
      maxScore: 59,
      ctaText: `VER DESCONTO EXCLUSIVO E GARANTIA DE ${guarantee} DIAS`,
      ctaUrl: ctaUrl
    },
    {
      id: 'res-c',
      title: 'Perfil Moderado — Teste sem Riscos',
      description: `O ${pName} pode ajudar na sua rotina. Recomendamos utilizar a garantia incondicional de ${guarantee} dias para testar o produto com tranquilidade.`,
      minScore: 0,
      maxScore: 29,
      ctaText: `VER DETALHES DO PRODUTO E GARANTIA`,
      ctaUrl: ctaUrl
    }
  ];

  const leadCapture: QuizLeadCaptureConfig = {
    enabled: true,
    title: 'Receba seu Diagnóstico Personalizado',
    subtitle: 'Preencha os campos abaixo para liberar seu resultado completo e cupom exclusivo:',
    fields: {
      name: true,
      email: true,
      phone: true
    },
    buttonText: 'LIBERAR MEU DIAGNÓSTICO AGORA →'
  };

  const offerConfig: QuizOfferConfig = {
    title: `Oferta Oficial do ${pName}`,
    subtitle: `Aproveite o preço promocional com envio prioritário e garantia de ${guarantee} dias.`,
    productName: pName,
    oldPrice: oldPrice,
    currentPrice: price,
    benefits: [
      `Garantia incondicional de ${guarantee} dias de satisfação`,
      `Produto 100% original com nota fiscal e código de rastreamento`,
      `Entrega rápida e suporte humanizado via WhatsApp`,
      pros[0] || 'Excelente relação custo-benefício comparado a concorrentes'
    ],
    guaranteeDays: guarantee,
    ctaText: reviewData.ctaButtonText || `COMPRAR COM DESCONTO OFICIAL (${price})`,
    ctaUrl: ctaUrl,
    timerEnabled: true,
    timerMinutes: 15
  };

  return {
    selectedTemplate: 'diagnostic',
    introTitle: `Diagnóstico Personalizado: O ${pName} é ideal para você?`,
    introSubtitle: `Responda a este quiz rápido de 1 minuto para descobrir o grau de compatibilidade com o seu perfil e liberar um cupom exclusivo.`,
    introCtaText: 'INICIAR DIAGNÓSTICO AGORA →',
    processingEnabled: true,
    processingTimeMs: 2500,
    processingMessages: [
      'Analisando suas respostas...',
      'Identificando seu perfil de uso...',
      'Calculando grau de compatibilidade...',
      'Preparando seu diagnóstico e recomendação...'
    ],
    questions: diagnosticQuestions,
    resultProfiles: resultProfiles,
    leadCapture: leadCapture,
    offerConfig: offerConfig,
    theme: DEFAULT_DIAGNOSTIC_THEME,
    testimonials: reviewData.testimonials || [],
    faq: reviewData.faq || []
  };
}

/**
 * Generates a PRD document for Quiz Diagnóstico
 */
export function generateDiagnosticPRD(quiz: QuizConfig, reviewData: Partial<Review>): string {
  const pName = reviewData.productName || 'Produto';
  const ctaUrl = quiz.ctaUrl || reviewData.affiliateUrl || '#';

  return `========================================================================
DOCUMENTO DE REQUISITOS DE PRODUTO (PRD) — QUIZ DIAGNÓSTICO / FUNIL
========================================================================

1. VISÃO GERAL
- Template: Quiz Diagnóstico (Funnel UX)
- Produto Relacionado: ${pName}
- Título do Quiz: ${quiz.introTitle || quiz.title}
- Total de Perguntas: ${quiz.questions.length}
- Estilo Visual: Soft Green Mobile-First (#F2F9F4, cards brancos, tipografia limpa)

2. OBJETIVO
Qualificar o lead por meio de perguntas de perfil, calculando um índice de compatibilidade com o ${pName}, capturando dados de contato e apresentando a oferta oficial com alto grau de persuasão.

3. PÚBLICO-ALVO
Visitantes e potenciais compradores interessados no ${pName} que respondem a funis interativos no celular.

4. ESTRUTURA DO FUNIL
1. INTRODUÇÃO: Banner/Header, Título, Subtítulo e botão "Iniciar Diagnóstico".
2. PERGUNTAS INTERATIVAS: Cards verticais com animação de progresso (Suporte a Single Select, Multi Select, Slider, Peso, Altura).
3. TELA DE PROCESSAMENTO: Animação de carregamento ("Analisando respostas...") com progresso visual em tempo real.
4. CAPTURA DE LEAD: Formulário de conversão (Nome, E-mail, WhatsApp) antes da exibição do diagnóstico.
5. DIAGNÓSTICO DE COMPATIBILIDADE: Resultado personalizado com base na pontuação acumulada (Perfil A, B ou C).
6. PROVA SOCIAL: Lista/Carrossel de depoimentos de compradores reais.
7. OFERTA ESPECIAL: Card do produto, benefícios, cronômetro de urgência, garantia de ${quiz.offerConfig?.guaranteeDays || 30} dias e CTA final.
8. FAQ ACCORDION: Respostas sanando objeções.

5. ENGINE DE PONTUAÇÃO (SCORING ENGINE)
- Cada alternativa/faixa possui pontuação acumulativa.
- Pontuação Máxima Possível: 100 pontos.
- Perfis de Resultado:
  * 60–100 pts: Perfil Ideal — Recomendação Máxima.
  * 30–59 pts: Perfil Altamente Recomendado.
  * 0–29 pts: Perfil Moderado com Garantia sem riscos.

6. DESIGN SYSTEM DIAGNÓSTICO
- Fundo Tela: Soft Light Green (#F2F9F4).
- Cards: Branco Puro (#FFFFFF) com bordas suaves (#E2E8F0) e sombra sutil.
- Destaques / CTAs: Verde Esmeralda (#16A34A / #15803D).
- Opções: Bordas com destaque ao selecionar.
- Responsividade: Mobile-First estrito com suporte a telas de 360px a 480px em smartphone e cartão responsivo no desktop.

7. TELA INICIAL
- Título: "${quiz.introTitle || quiz.title}".
- Subtítulo: "${quiz.introSubtitle || quiz.description}".
- Botão: "${quiz.introCtaText || 'INICIAR DIAGNÓSTICO AGORA →'}".

8. PERGUNTAS E NAVEGAÇÃO
- Transição suave entre perguntas.
- Indicador de avanço percentual e etapa (ex: "Pergunta 2 de 5").
- Suporte a seleção simples com avanço automático ou seleção múltipla com botão "Continuar".

9. CAPTURA DE LEADS
- Campos: Nome (obrigatório), E-mail (obrigatório), WhatsApp/Telefone.
- Botão: "LIBERAR MEU DIAGNÓSTICO AGORA →".

10. RESULTADO PERSONALIZADO
- Exibição de perfil com título, descrição explicativa e badge de compatibilidade.

11. PROVA SOCIAL & DEPOIMENTOS
- Depoimentos reais de compradores do ${pName} fornecidos pelo usuário.

12. OFERTA & URGÊNCIA
- Card contendo Preço Atual (${quiz.offerConfig?.currentPrice || 'Preço Oficial'}), Preço Anterior (${quiz.offerConfig?.oldPrice || ''}), lista de benefícios, selo de garantia de ${quiz.offerConfig?.guaranteeDays || 30} dias e cronômetro regressivo.

13. CTA FINAL
- Botão verde grande com efeito de pulso/sombra: "${quiz.offerConfig?.ctaText || quiz.ctaText}".
- Link de Destino: "${ctaUrl}".

14. RESPONSIVIDADE MOBILE
- Margens de 16px, touch targets superiores a 48px, zero scroll horizontal.

15. ACESSIBILIDADE
- Contraste elevado de texto verde escuro sobre fundo claro (WCAG AA).

16. REQUISITOS TÉCNICOS
- Documento HTML5 estático único com CSS3 e Vanilla JavaScript embutidos.
- Sem bibliotecas externas pesadas ou dependências de React no servidor.

17. ESTRUTURA DE DADOS
- JSON estruturado para perguntas, opções, pontuações, resultados, captura de lead e detalhes da oferta.

18. SEGURANÇA E PRIVACIDADE
- Sem uso de eval() ou injeções de script perigosas. Sanitização estrita de textos do usuário.

19. SEO
- Meta tags otimizadas para o diagnóstico do produto ${pName}.

20. CRITÉRIOS DE ACEITAÇÃO
- Fluxo completo executável sem falhas.
- Pontuação acumulada corretamente.
- Captura de lead validando campos.
- Redirecionamento funcional do CTA final.
- Funcionamento offline verificado no navegador.`;
}

/**
 * Generates AI Prompt for Quiz Diagnóstico
 */
export function generateDiagnosticPrompt(quiz: QuizConfig, reviewData: Partial<Review>): string {
  const pName = reviewData.productName || 'Produto';
  const prd = generateDiagnosticPRD(quiz, reviewData);

  return `Você é um desenvolvedor frontend expert em funis de alta conversão para celulares e gamificação de vendas.
Crie um Quiz Diagnóstico / Funil completo para o produto "${pName}" com base no PRD detalhado a seguir:

${prd}

INSTRUÇÕES DE EXECUÇÃO:
1. Desenvolva uma aplicação web responsiva mobile-first com o design system Soft Green (#F2F9F4 canvas, cards brancos, botões verde esmeralda #16A34A).
2. Implemente a estrutura completa: Introdução -> Perguntas com score -> Tela de Processamento Animada -> Captura de Lead -> Resultado do Diagnóstico -> Depoimentos de Prova Social -> Card da Oferta com Cronômetro -> CTA Final (${quiz.ctaUrl}).
3. Suporte aos tipos de pergunta configurados (single-select, multi-select, slider, weight, height).
4. Garanta que o arquivo final seja 100% funcional em qualquer dispositivo móvel ou desktop.`;
}

/**
 * Generates a 100% Standalone HTML5 file for Quiz Diagnóstico (quiz-[slug]-diagnostico.html)
 */
export function generateDiagnosticStandaloneHtml(quiz: QuizConfig, reviewData: Partial<Review>): string {
  const pName = escapeHtml(reviewData.productName || 'Produto');
  const siteName = escapeHtml(reviewData.siteName || 'ReviewFísico');
  const ctaUrl = escapeHtml(quiz.ctaUrl || reviewData.affiliateUrl || '#');
  const ctaText = escapeHtml(quiz.ctaText || 'VER OFERTA OFICIAL E COMPRAR');
  const quizTitle = escapeHtml(quiz.introTitle || quiz.title || `Diagnóstico do ${pName}`);
  const quizSubtitle = escapeHtml(quiz.introSubtitle || quiz.description || `Descubra se o ${pName} é ideal para você.`);
  const introCtaText = escapeHtml(quiz.introCtaText || 'INICIAR DIAGNÓSTICO AGORA →');

  const offer = quiz.offerConfig || {
    title: `Oferta Oficial do ${pName}`,
    subtitle: `Preço promocional e garantia de satisfação.`,
    currentPrice: reviewData.currentPrice ? `R$ ${reviewData.currentPrice}` : 'Preço Promocional',
    oldPrice: reviewData.oldPrice ? `R$ ${reviewData.oldPrice}` : '',
    guaranteeDays: reviewData.guaranteeDays || 30,
    ctaText: ctaText,
    ctaUrl: ctaUrl,
    timerEnabled: true,
    timerMinutes: 15,
    benefits: reviewData.features || ['Produto 100% Original', 'Garantia de Satisfação', 'Entrega Rápida com Rastreio']
  };

  const safeQuestionsJson = JSON.stringify(
    quiz.questions.map((q) => ({
      id: q.id,
      question: q.question,
      description: q.description || '',
      type: q.type || 'single-select',
      options: q.options || [],
      optionScores: q.optionScores || (q.options || []).map((_, i) => (i === q.correctAnswerIndex ? 20 : 10)),
      explanation: q.explanation || '',
      sliderMin: q.sliderMin || 1,
      sliderMax: q.sliderMax || 10,
      sliderStep: q.sliderStep || 1,
      sliderUnit: q.sliderUnit || '',
      sliderInitial: q.sliderInitial || 5
    }))
  );

  const safeProfilesJson = JSON.stringify(
    quiz.resultProfiles || [
      {
        id: 'res-a',
        title: 'Perfil 100% Compatível',
        description: `O ${pName} é altamente recomendado para a sua rotina!`,
        minScore: 50,
        maxScore: 100,
        ctaText: offer.ctaText,
        ctaUrl: offer.ctaUrl
      },
      {
        id: 'res-b',
        title: 'Perfil Recomendado',
        description: `O ${pName} irá trazer excelentes resultados para o seu dia a dia.`,
        minScore: 0,
        maxScore: 49,
        ctaText: offer.ctaText,
        ctaUrl: offer.ctaUrl
      }
    ]
  );

  const safeTestimonialsJson = JSON.stringify(
    (reviewData.testimonials || []).map((t) => ({
      name: t.name,
      text: t.text,
      rating: t.rating || 5,
      date: t.origin || 'Compra Verificada'
    }))
  );

  const safeFaqJson = JSON.stringify(
    (reviewData.faq || []).map((f) => ({
      question: f.question,
      answer: f.answer
    }))
  );

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${quizTitle} — ${siteName}</title>
  <meta name="description" content="${quizSubtitle}">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", "Segoe UI", Roboto, sans-serif; -webkit-tap-highlight-color: transparent; }
    body { background-color: #F2F9F4; color: #133E2B; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 12px; }
    
    .funnel-container { width: 100%; max-width: 480px; margin: 0 auto; padding-bottom: 32px; }
    .card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 20px; padding: 24px; box-shadow: 0 10px 25px -5px rgba(19, 62, 43, 0.05); margin-bottom: 16px; }
    
    /* Header & Progress */
    .funnel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; font-size: 12px; font-weight: 700; color: #16A34A; }
    .progress-bar-bg { width: 100%; height: 8px; background-color: #E2E8F0; border-radius: 9999px; overflow: hidden; margin-bottom: 20px; }
    .progress-bar-fill { height: 100%; background: linear-gradient(90deg, #22C55E, #15803D); width: 0%; transition: width 0.3s ease; }
    
    /* Typography */
    .title-primary { font-size: 20px; font-weight: 800; color: #133E2B; line-height: 1.3; margin-bottom: 8px; text-align: center; }
    .subtitle-secondary { font-size: 13px; color: #4A6B5D; line-height: 1.5; margin-bottom: 20px; text-align: center; }
    .q-title { font-size: 17px; font-weight: 800; color: #133E2B; line-height: 1.35; margin-bottom: 6px; }
    .q-desc { font-size: 12px; color: #64748B; margin-bottom: 16px; }

    /* Interactive Options */
    .options-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
    .opt-btn { width: 100%; min-height: 52px; text-align: left; background-color: #FFFFFF; border: 2px solid #E2E8F0; border-radius: 14px; padding: 14px 16px; color: #1E293B; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: space-between; }
    .opt-btn:active, .opt-btn.selected { border-color: #16A34A; background-color: #F0FDF4; color: #15803D; }
    .opt-check { width: 20px; height: 20px; border-radius: 50%; border: 2px solid #CBD5E1; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; color: #FFFFFF; shrink: 0; }
    .opt-btn.selected .opt-check { background-color: #16A34A; border-color: #16A34A; }

    /* Slider / Input Controls */
    .slider-box { text-align: center; margin: 20px 0; }
    .slider-val { font-size: 32px; font-weight: 900; color: #16A34A; margin-bottom: 12px; }
    .range-input { width: 100%; height: 10px; border-radius: 5px; accent-color: #16A34A; cursor: pointer; }

    /* Buttons */
    .btn-green { width: 100%; min-height: 54px; background: linear-gradient(135deg, #16A34A, #15803D); color: #FFFFFF; font-size: 15px; font-weight: 800; border: none; border-radius: 16px; cursor: pointer; text-align: center; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 8px 20px rgba(22, 163, 74, 0.25); transition: transform 0.15s ease; }
    .btn-green:active { transform: scale(0.98); }

    /* Processing Screen */
    .spinner { width: 48px; height: 48px; border: 5px solid #E2E8F0; border-top-color: #16A34A; border-radius: 50%; animation: spin 1s linear infinite; margin: 20px auto; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Lead Form */
    .form-group { margin-bottom: 12px; text-align: left; }
    .form-group label { display: block; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 4px; }
    .form-input { width: 100%; height: 46px; background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 0 14px; font-size: 13px; color: #0F172A; }
    .form-input:focus { border-color: #16A34A; outline: none; background: #FFFFFF; }

    /* Offer & Timer */
    .offer-card { background: linear-gradient(180deg, #FFFFFF, #F0FDF4); border: 2px solid #22C55E; border-radius: 20px; padding: 20px; text-align: center; }
    .timer-badge { display: inline-flex; items-center; gap: 6px; background: #FEF2F2; border: 1px solid #FECACA; color: #DC2626; font-size: 12px; font-weight: 800; padding: 6px 14px; border-radius: 9999px; margin-bottom: 12px; }
    .price-old { text-decoration: line-through; color: #94A3B8; font-size: 14px; }
    .price-current { font-size: 32px; font-weight: 900; color: #16A34A; margin: 4px 0 16px 0; }
    .benefit-list { text-align: left; font-size: 12px; color: #334155; margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px; }
    .benefit-item { display: flex; items-center; gap: 8px; }

    /* Testimonials Carousel */
    .testi-card { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 14px; font-size: 12px; color: #334155; margin-bottom: 10px; }
    .testi-header { display: flex; justify-content: space-between; font-weight: 700; color: #0F172A; margin-bottom: 6px; }

    /* FAQ Accordion */
    .faq-item { border-bottom: 1px solid #E2E8F0; padding: 12px 0; }
    .faq-q { font-size: 13px; font-weight: 700; color: #0F172A; cursor: pointer; display: flex; justify-content: space-between; }
    .faq-a { font-size: 12px; color: #64748B; margin-top: 6px; display: none; line-height: 1.5; }

    .hidden { display: none !important; }
  </style>
</head>
<body>

  <div class="funnel-container">
    <!-- TELA 1: INTRODUÇÃO -->
    <div id="step-intro" class="card" style="text-align: center;">
      <span style="display:inline-block; padding:4px 12px; background:#DCFCE7; color:#15803D; font-size:11px; font-weight:800; border-radius:9999px; margin-bottom:12px; text-transform:uppercase;">
        DIAGNÓSTICO OFICIAL DE PERFIL
      </span>
      <h1 class="title-primary">${quizTitle}</h1>
      <p class="subtitle-secondary">${quizSubtitle}</p>

      <button class="btn-green" onclick="startDiagnostic()">
        <span>${introCtaText}</span>
      </button>
    </div>

    <!-- TELA 2: PERGUNTAS -->
    <div id="step-question" class="card hidden">
      <div class="funnel-header">
        <span id="q-step-text">Pergunta 1 de 5</span>
        <span id="q-pct-text">20% Concluído</span>
      </div>
      <div class="progress-bar-bg">
        <div id="progress-bar" class="progress-bar-fill"></div>
      </div>

      <h2 id="question-title" class="q-title"></h2>
      <p id="question-desc" class="q-desc"></p>

      <div id="options-container"></div>

      <button id="btn-continue-multi" class="btn-green hidden" onclick="confirmMultiSelect()" style="margin-top: 16px;">
        CONTINUAR →
      </button>
    </div>

    <!-- TELA 3: PROCESSAMENTO ANIMADO -->
    <div id="step-processing" class="card hidden" style="text-align: center;">
      <h2 class="title-primary" style="font-size: 18px;">PROCESSANDO SEU DIAGNÓSTICO</h2>
      <div class="spinner"></div>
      <p id="processing-msg" style="font-size: 13px; font-weight: 700; color: #16A34A; margin-bottom: 12px;">Analisando suas respostas...</p>
      <div class="progress-bar-bg">
        <div id="processing-bar" class="progress-bar-fill"></div>
      </div>
    </div>

    <!-- TELA 4: CAPTURA DE LEAD -->
    <div id="step-lead" class="card hidden" style="text-align: center;">
      <span style="display:inline-block; padding:4px 12px; background:#FEF3C7; color:#B45309; font-size:11px; font-weight:800; border-radius:9999px; margin-bottom:12px;">
        QUASE PRONTO!
      </span>
      <h2 class="title-primary" style="font-size: 18px;">Onde devemos enviar seu diagnóstico?</h2>
      <p class="subtitle-secondary" style="margin-bottom: 16px;">Preencha para liberar seu resultado completo e desconto de hoje:</p>

      <form onsubmit="submitLead(event)">
        <div class="form-group">
          <label>Seu Nome Completo</label>
          <input type="text" id="lead-name" class="form-input" placeholder="Digite seu nome..." required>
        </div>
        <div class="form-group">
          <label>Seu Melhor E-mail</label>
          <input type="email" id="lead-email" class="form-input" placeholder="seuemail@exemplo.com" required>
        </div>
        <div class="form-group">
          <label>WhatsApp / Telefone</label>
          <input type="tel" id="lead-phone" class="form-input" placeholder="(00) 90000-0000">
        </div>
        <button type="submit" class="btn-green" style="margin-top: 16px;">
          <span>LIBERAR MEU RESULTADO E CUPOM →</span>
        </button>
      </form>
    </div>

    <!-- TELA 5: RESULTADO + PROVA SOCIAL + OFERTA + FAQ -->
    <div id="step-result" class="hidden">
      <!-- Card Resultado -->
      <div class="card" style="text-align: center;">
        <span style="display:inline-block; padding:4px 12px; background:#DCFCE7; color:#15803D; font-size:11px; font-weight:800; border-radius:9999px; margin-bottom:12px;">
          SEU DIAGNÓSTICO FINAL
        </span>
        <h2 id="res-title" class="title-primary"></h2>
        <p id="res-desc" class="subtitle-secondary"></p>
      </div>

      <!-- Card Prova Social -->
      <div id="social-proof-section" class="card hidden">
        <h3 style="font-size: 14px; font-weight: 800; color: #133E2B; margin-bottom: 12px;">
          ⭐ Avaliações de Quem Já Usou o ${pName}
        </h3>
        <div id="testimonials-list"></div>
      </div>

      <!-- Card Oferta -->
      <div class="offer-card card">
        <div class="timer-badge">
          <span>⏰</span> <span id="timer-display">Oferta Válida por 14:59 min</span>
        </div>
        <h2 style="font-size: 20px; font-weight: 900; color: #133E2B; margin-bottom: 4px;">
          ${escapeHtml(offer.title)}
        </h2>
        <p style="font-size: 12px; color: #475569; margin-bottom: 12px;">${escapeHtml(offer.subtitle)}</p>

        <div class="price-old">${escapeHtml(offer.oldPrice)}</div>
        <div class="price-current">${escapeHtml(offer.currentPrice)}</div>

        <div id="offer-benefits" class="benefit-list"></div>

        <a id="res-cta-btn" href="${ctaUrl}" target="_blank" rel="noopener noreferrer" class="btn-green">
          <span>${escapeHtml(offer.ctaText)}</span>
        </a>

        <p style="font-size: 11px; color: #64748B; margin-top: 10px;">
          🔒 Compra 100% Segura • Garantia de ${offer.guaranteeDays} Dias • Envio Prioritário
        </p>
      </div>

      <!-- Card FAQ Accordion -->
      <div id="faq-section" class="card hidden">
        <h3 style="font-size: 14px; font-weight: 800; color: #133E2B; margin-bottom: 12px;">
          ❓ Dúvidas Frequentes
        </h3>
        <div id="faq-list"></div>
      </div>
    </div>
  </div>

  <script>
    const questions = ${safeQuestionsJson};
    const profiles = ${safeProfilesJson};
    const testimonials = ${safeTestimonialsJson};
    const faqs = ${safeFaqJson};

    let currentIdx = 0;
    let totalScore = 0;
    let selectedMultiIndices = [];

    function startDiagnostic() {
      document.getElementById('step-intro').classList.add('hidden');
      document.getElementById('step-question').classList.remove('hidden');
      currentIdx = 0;
      totalScore = 0;
      renderQuestion();
    }

    function renderQuestion() {
      selectedMultiIndices = [];
      const q = questions[currentIdx];
      const total = questions.length;
      const pct = Math.round(((currentIdx + 1) / total) * 100);

      document.getElementById('q-step-text').innerText = 'Pergunta ' + (currentIdx + 1) + ' de ' + total;
      document.getElementById('q-pct-text').innerText = pct + '% Concluído';
      document.getElementById('progress-bar').style.width = pct + '%';

      document.getElementById('question-title').innerText = q.question;
      document.getElementById('question-desc').innerText = q.description || '';

      const container = document.getElementById('options-container');
      container.innerHTML = '';

      const multiBtn = document.getElementById('btn-continue-multi');
      multiBtn.classList.add('hidden');

      if (q.type === 'slider' || q.type === 'weight' || q.type === 'height') {
        const min = q.sliderMin || 1;
        const max = q.sliderMax || 10;
        const step = q.sliderStep || 1;
        const initial = q.sliderInitial || Math.round((min + max) / 2);
        const unit = q.sliderUnit ? ' ' + q.sliderUnit : '';

        const box = document.createElement('div');
        box.className = 'slider-box';
        box.innerHTML = '<div id="s-val" class="slider-val">' + initial + unit + '</div>' +
          '<input type="range" class="range-input" min="' + min + '" max="' + max + '" step="' + step + '" value="' + initial + '" oninput="updateSliderVal(this.value, \'' + unit + '\')">' +
          '<button class="btn-green" style="margin-top:20px;" onclick="confirmSlider(' + initial + ')">CONFIRMAR →</button>';
        container.appendChild(box);
      } else {
        const list = document.createElement('div');
        list.className = 'options-list';

        q.options.forEach((optText, i) => {
          const btn = document.createElement('button');
          btn.className = 'opt-btn';
          btn.innerHTML = '<span>' + escapeHtmlStr(optText) + '</span><span class="opt-check">✓</span>';
          btn.onclick = () => {
            if (q.type === 'multi-select') {
              toggleMulti(btn, i);
            } else {
              selectSingle(i);
            }
          };
          list.appendChild(btn);
        });
        container.appendChild(list);

        if (q.type === 'multi-select') {
          multiBtn.classList.remove('hidden');
        }
      }
    }

    function updateSliderVal(v, unit) {
      document.getElementById('s-val').innerText = v + unit;
    }

    function confirmSlider(initialVal) {
      const q = questions[currentIdx];
      const score = (q.optionScores && q.optionScores[0]) ? q.optionScores[0] : 15;
      totalScore += score;
      nextStep();
    }

    function selectSingle(optIdx) {
      const q = questions[currentIdx];
      const score = (q.optionScores && q.optionScores[optIdx] !== undefined) ? q.optionScores[optIdx] : 15;
      totalScore += score;
      nextStep();
    }

    function toggleMulti(btn, optIdx) {
      if (selectedMultiIndices.includes(optIdx)) {
        selectedMultiIndices = selectedMultiIndices.filter(i => i !== optIdx);
        btn.classList.remove('selected');
      } else {
        selectedMultiIndices.push(optIdx);
        btn.classList.add('selected');
      }
    }

    function confirmMultiSelect() {
      const q = questions[currentIdx];
      let addScore = 0;
      selectedMultiIndices.forEach(idx => {
        addScore += (q.optionScores && q.optionScores[idx] !== undefined) ? q.optionScores[idx] : 10;
      });
      totalScore += (addScore || 15);
      nextStep();
    }

    function nextStep() {
      currentIdx++;
      if (currentIdx < questions.length) {
        renderQuestion();
      } else {
        startProcessing();
      }
    }

    function startProcessing() {
      document.getElementById('step-question').classList.add('hidden');
      document.getElementById('step-processing').classList.remove('hidden');

      const messages = [
        'Analisando suas respostas...',
        'Identificando seu perfil de uso...',
        'Calculando grau de compatibilidade...',
        'Preparando seu diagnóstico final...'
      ];
      let mIdx = 0;

      const interval = setInterval(() => {
        mIdx++;
        if (mIdx < messages.length) {
          document.getElementById('processing-msg').innerText = messages[mIdx];
          document.getElementById('processing-bar').style.width = ((mIdx + 1) / messages.length * 100) + '%';
        } else {
          clearInterval(interval);
          setTimeout(() => {
            document.getElementById('step-processing').classList.add('hidden');
            document.getElementById('step-lead').classList.remove('hidden');
          }, 400);
        }
      }, 600);
    }

    function submitLead(e) {
      e.preventDefault();
      document.getElementById('step-lead').classList.add('hidden');
      showResult();
    }

    function showResult() {
      document.getElementById('step-result').classList.remove('hidden');

      // Resolve profile by score
      let matched = profiles[profiles.length - 1];
      for (let p of profiles) {
        if (totalScore >= p.minScore && totalScore <= p.maxScore) {
          matched = p;
          break;
        }
      }

      document.getElementById('res-title').innerText = matched.title || 'Seu Resultado de Compatibilidade';
      document.getElementById('res-desc').innerText = matched.description || 'Com base no seu diagnóstico, o produto é recomendado para você.';

      if (matched.ctaText) document.getElementById('res-cta-btn').innerText = matched.ctaText;
      if (matched.ctaUrl) document.getElementById('res-cta-btn').href = matched.ctaUrl;

      // Render Benefits
      const offerBenefits = document.getElementById('offer-benefits');
      offerBenefits.innerHTML = '';
      const defaultBenefits = ${JSON.stringify(offer.benefits || [])};
      defaultBenefits.forEach(b => {
        const item = document.createElement('div');
        item.className = 'benefit-item';
        item.innerHTML = '<span style="color:#16A34A; font-weight:800;">✓</span><span>' + escapeHtmlStr(b) + '</span>';
        offerBenefits.appendChild(item);
      });

      // Render Testimonials if present
      if (testimonials && testimonials.length > 0) {
        const tSec = document.getElementById('social-proof-section');
        tSec.classList.remove('hidden');
        const tList = document.getElementById('testimonials-list');
        tList.innerHTML = '';
        testimonials.forEach(t => {
          const card = document.createElement('div');
          card.className = 'testi-card';
          card.innerHTML = '<div class="testi-header"><span>' + escapeHtmlStr(t.name) + '</span><span style="color:#EAB308;">★★★★★</span></div><div>"' + escapeHtmlStr(t.text) + '"</div>';
          tList.appendChild(card);
        });
      }

      // Render FAQ if present
      if (faqs && faqs.length > 0) {
        const fSec = document.getElementById('faq-section');
        fSec.classList.remove('hidden');
        const fList = document.getElementById('faq-list');
        fList.innerHTML = '';
        faqs.forEach((f, idx) => {
          const item = document.createElement('div');
          item.className = 'faq-item';
          item.innerHTML = '<div class="faq-q" onclick="toggleFaq(' + idx + ')"><span>' + escapeHtmlStr(f.question) + '</span><span>+</span></div><div id="faq-a-' + idx + '" class="faq-a">' + escapeHtmlStr(f.answer) + '</div>';
          fList.appendChild(item);
        });
      }

      startTimer();
    }

    function toggleFaq(idx) {
      const el = document.getElementById('faq-a-' + idx);
      if (el.style.display === 'block') {
        el.style.display = 'none';
      } else {
        el.style.display = 'block';
      }
    }

    function startTimer() {
      let duration = 15 * 60;
      const display = document.getElementById('timer-display');
      setInterval(() => {
        let mins = Math.floor(duration / 60);
        let secs = duration % 60;
        display.innerText = 'Oferta Válida por ' + (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs + ' min';
        if (duration > 0) duration--;
      }, 1000);
    }

    function escapeHtmlStr(str) {
      if (!str) return '';
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
  </script>
</body>
</html>`;
}
