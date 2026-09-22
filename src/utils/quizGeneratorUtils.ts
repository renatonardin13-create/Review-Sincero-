import { QuizConfig, QuizQuestion, QuizDifficulty, QuizTemplateId, Review } from '../types';
import {
  getRecommendedThemeForCategory,
  themePresetToConfig
} from './quizThemePresets';
import {
  generateDefaultDiagnosticConfig,
  generateDiagnosticPRD,
  generateDiagnosticPrompt,
  generateDiagnosticStandaloneHtml
} from './quizDiagnosticUtils';

/**
 * Escapes HTML characters for safe rendering in HTML templates
 */
export function escapeHtml(unsafe?: string | null): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generates an AI-crafted quiz based on product and review details
 */
export function generateQuizFromProduct(
  reviewData: Partial<Review>,
  questionCount: number = 5,
  difficulty: QuizDifficulty = 'Misto',
  quizType: string = 'Conhecimento & Diagnóstico de Compra',
  templateId: QuizTemplateId = 'classic'
): QuizConfig {
  const pName = reviewData.productName?.trim() || 'Produto';
  const price = reviewData.currentPrice ? `R$ ${reviewData.currentPrice}` : 'Preço Promocional';
  const guarantee = reviewData.guaranteeDays || 30;
  const features = reviewData.features || [];
  const pros = reviewData.pros || [];
  const faq = reviewData.faq || [];
  const siteName = reviewData.siteName || 'ReviewFísico';

  const defaultQuestions: QuizQuestion[] = [
    {
      id: 'q1',
      question: `Qual é o principal objetivo e indicação de uso do ${pName}?`,
      options: [
        features[0] || `Entregar alta performance, praticidade e durabilidade no dia a dia`,
        `Apenas para decoração sem nenhuma utilidade prática`,
        `Apenas para colecionadores de itens antigos`,
        `Uso exclusivo em ambientes corporativos de grande porte`
      ],
      correctAnswerIndex: 0,
      explanation: `O ${pName} foi projetado especificamente para entregar alta performance e praticidade, superando a maioria dos concorrentes da categoria.`
    },
    {
      id: 'q2',
      question: `Qual é a garantia incondicional oferecida ao adquirir o ${pName} pelo link oficial?`,
      options: [
        `Garantia de ${guarantee} dias com devolução 100% gratuita caso não goste`,
        `Não possui nenhuma garantia ou suporte`,
        `Apenas 24 horas após o recebimento`,
        `Garantia válida somente para compras com valor acima de R$ 2.000`
      ],
      correctAnswerIndex: 0,
      explanation: `Ao adquirir o ${pName} pelo canal oficial indicado pelo ${siteName}, você tem garantia incondicional de ${guarantee} dias para testar sem riscos.`
    },
    {
      id: 'q3',
      question: `Em termos de custo-benefício, qual é o diferencial destacado do ${pName}?`,
      options: [
        pros[0] || `Preço promocional justo (${price}) comparado a concorrentes da mesma categoria`,
        `Custo extremamente elevado sem nenhum diferencial`,
        `Necessidade de pagar mensalidades adicionais para usar`,
        `É vendido apenas em leilões internacionais`
      ],
      correctAnswerIndex: 0,
      explanation: `O teste do especialista comprovou que pelo valor de ${price}, o ${pName} entrega uma relação custo-benefício imbatível.`
    },
    {
      id: 'q4',
      question: `O que os compradores verificados mais elogiam no ${pName}?`,
      options: [
        pros[1] || `A excelente qualidade de construção, durabilidade e rapidez na entrega`,
        `O fato de ser um produto descartável`,
        `A embalagem ser maior que o próprio produto`,
        `A necessidade de montagem por especialistas credenciados`
      ],
      correctAnswerIndex: 0,
      explanation: `Nas avaliações verificadas de compradores reais, os pontos mais elogiados foram a durabilidade e o acabamento de primeira linha.`
    },
    {
      id: 'q5',
      question: faq[0]?.question || `O ${pName} possui nota fiscal e suporte oficial no Brasil?`,
      options: [
        faq[0]?.answer ? `Sim: ${faq[0].answer}` : `Sim, 100% original com garantia, nota fiscal e rastreio de entrega.`,
        `Não, o produto vem sem nota fiscal e sem suporte`,
        `Somente se comprado de vendedores não autorizados`,
        `O suporte responde apenas em inglês`
      ],
      correctAnswerIndex: 0,
      explanation: `Comprar pela loja oficial recomendada garante suporte em português, nota fiscal e código de rastreamento no WhatsApp.`
    },
    {
      id: 'q6',
      question: `Como funciona a entrega do ${pName} após a confirmação do pedido?`,
      options: [
        `Envio rápido com código de rastreamento para acompanhar cada etapa do transporte`,
        `O produto precisa ser retirado presencialmente na fábrica`,
        `A entrega leva até 6 meses para ser enviada`,
        `Não há confirmação nem código de rastreio`
      ],
      correctAnswerIndex: 0,
      explanation: `Todas as compras oficiais contam com acompanhamento em tempo real do código de rastreio no WhatsApp e e-mail.`
    },
    {
      id: 'q7',
      question: `Por que é fundamental comprar o ${pName} somente pelo link oficial do fabricante?`,
      options: [
        `Para garantir produto 100% original, suporte oficial, cupom promocional e garantia de ${guarantee} dias`,
        `Para pagar taxas alfandegárias adicionais`,
        `Para receber uma versão inferior sem acessórios`,
        `Não faz nenhuma diferença de onde comprar`
      ],
      correctAnswerIndex: 0,
      explanation: `Links de sites terceiros desatualizados podem vender réplicas sem garantia. O link oficial do ${siteName} direciona para a loja com desconto real.`
    },
    {
      id: 'q8',
      question: `Qual é a recomendação final do especialista sobre o ${pName}?`,
      options: [
        `Aprovado e recomendado pela excelente nota editorial e satisfação dos compradores`,
        `Não recomendado sob nenhuma hipótese`,
        `Recomendado apenas para quem não busca resultados`,
        `Produto descontinuado pelo fabricante`
      ],
      correctAnswerIndex: 0,
      explanation: `Após testes extensivos e análise de centenas de compradores, o ${pName} recebeu recomendação máxima do portal.`
    },
    {
      id: 'q9',
      question: `Qual é o valor promocional atual do ${pName}?`,
      options: [
        `${price} (com desconto especial de lote restrito)`,
        `Gratuito sem taxa de envio`,
        `Mais de R$ 5.000,00 sem desconto`,
        `O preço altera a cada minuto aleatoriamente`
      ],
      correctAnswerIndex: 0,
      explanation: `O lote atual está sendo comercializado na oferta de lançamento/oferta promocional por ${price}.`
    },
    {
      id: 'q10',
      question: `Como solicitar a garantia de ${guarantee} dias se não ficar 100% satisfeito?`,
      options: [
        `Basta entrar em contato com o suporte da loja oficial informado no e-mail de confirmação`,
        `Precisa enviar uma carta registrada para o exterior`,
        `Não há canal de atendimento`,
        `A garantia só é acionada mediante pagamento de taxa`
      ],
      correctAnswerIndex: 0,
      explanation: `O suporte ao cliente oficial realiza o reembolso do valor integral de forma simples e desburocratizada dentro do prazo de ${guarantee} dias.`
    }
  ];

  const selectedQuestions = defaultQuestions.slice(0, Math.min(questionCount, defaultQuestions.length));

  const recommendedThemePreset = getRecommendedThemeForCategory(reviewData.category);

  const baseConfig: QuizConfig = {
    id: 'quiz-' + Date.now(),
    title: `Quiz do ${pName}: Teste Seu Conhecimento`,
    description: `Descubra se o ${pName} é ideal para a sua rotina e tire todas as suas dúvidas antes de comprar na oferta oficial.`,
    questionCount: selectedQuestions.length,
    difficulty,
    type: quizType,
    ctaText: reviewData.ctaButtonText || `VER OFERTA OFICIAL E COMPRAR (${price})`,
    ctaUrl: reviewData.affiliateUrl || (reviewData.slug ? `/review/${reviewData.slug}` : 'https://www.mercadolivre.com.br/'),
    resultMessage: `Parabéns! Você concluiu o quiz sobre o ${pName}. Com base nas suas respostas, este produto é 100% recomendado para você.`,
    questions: selectedQuestions,
    selectedTemplate: templateId,
    theme: themePresetToConfig(recommendedThemePreset)
  };

  if (templateId === 'diagnostic') {
    const diagConfig = generateDefaultDiagnosticConfig(reviewData, selectedQuestions);
    return {
      ...baseConfig,
      ...diagConfig
    };
  }

  return baseConfig;
}

/**
 * Generates a 20-Section Product Requirements Document (PRD) for the Quiz
 */
export function generateQuizPRD(quiz: QuizConfig, reviewData: Partial<Review>): string {
  if (quiz.selectedTemplate === 'diagnostic') {
    return generateDiagnosticPRD(quiz, reviewData);
  }

  const pName = reviewData.productName || 'Produto';
  const ctaUrl = quiz.ctaUrl || reviewData.affiliateUrl || '#';

  return `========================================================================
DOCUMENTO DE REQUISITOS DE PRODUTO (PRD) — GERADOR DE QUIZ INTERATIVO
========================================================================

1. VISÃO GERAL
- Nome do Quiz: ${quiz.title}
- Produto Relacionado: ${pName}
- Tipo de Quiz: ${quiz.type}
- Nível de Dificuldade: ${quiz.difficulty}
- Total de Perguntas: ${quiz.questions.length}

2. OBJETIVO
Engajar o comprador potencial por meio de um quiz de conhecimento e diagnóstico sobre o ${pName}, educando sobre recursos, garantia e custo-benefício antes de direcionar para o checkout/review oficial.

3. PÚBLICO-ALVO
Compradores em fase de consideração de compra do ${pName} que buscam confirmação sobre a originalidade, custo-benefício, facilidade de uso e garantias antes de fechar a compra.

4. ESTRUTURA DO QUIZ
- Tela Inicial: Título, Descrição, Botão "Iniciar Quiz" e indicador de ${quiz.questions.length} perguntas.
- Tela de Perguntas: Pergunta atual, 4 alternativas de múltipla escolha, barra de progresso.
- Tela de Feedback Instantâneo: Explicação didática apontando por que a resposta está correta.
- Tela de Resultado: Placar de acertos (X/${quiz.questions.length}), percentual de aproveitamento, mensagem de diagnóstico e botão de CTA Final.

5. FLUXO DO USUÁRIO
Início -> Pergunta 1/N -> Seleção de Alternativa -> Feedback -> Próxima Pergunta -> ... -> Tela Final com Diagnóstico -> Clique no CTA (${quiz.ctaText}) -> Redirecionamento para ${ctaUrl}.

6. DESIGN SYSTEM
- Theme: Dark Mode refinado (#080B10 Canvas, #0D1117 Cards, #1E293B Borders).
- Destaques: Azul (#3B82F6), Verde Destaque (#22C55E) para acertos e respostas corretas.
- Tipografia: Sans-Serif moderna (Inter / Plus Jakarta Sans / System UI).

7. LAYOUT
Centralizado no desktop (max-width 640px / 28rem), responsivo e expansível no mobile com touch targets de no mínimo 48px.

8. TELA INICIAL
- Header com badge "${quiz.type}".
- Título do Quiz: "${quiz.title}".
- Subtítulo explicativo: "${quiz.description}".
- Botão "Começar Quiz Agora".

9. TELA DE PERGUNTAS
- Contador de pergunta (Ex: "Pergunta 2 de ${quiz.questions.length}").
- Barra de progresso percentual (Ex: 40%).
- Texto da pergunta em destaque.
- 4 alternativas com letras (A, B, C, D) estilizadas como botões clicáveis.

10. ESTADOS
- Estado Neutro: Opções aguardando clique.
- Estado Selecionado: Animação e borda destacada ao escolher.
- Estado Respondido: Verde para opção correta, Vermelho com indicação verde para opção incorreta.

11. FEEDBACK
- Caixa explicativa logo abaixo das opções após a resposta, informando o porquê do resultado com base nos dados do ${pName}.

12. RESULTADO
- Placar de acertos (ex: 5 de 5 corretas - 100%).
- Mensagem personalizada: "${quiz.resultMessage || 'Você demonstra ser um comprador consciente e exigente!'}"

13. CTA FINAL
- Texto: "${quiz.ctaText}".
- Destino: "${ctaUrl}".
- Botão grande verde reluzente com ícone de seta/carrinho.

14. RESPONSIVIDADE
- Mobile First: 100% otimizado para celulares sem scroll horizontal.
- Desktop: Cartão elevado com sombra sutil e padding proporcional.

15. ACESSIBILIDADE
- Contraste WCAG AA.
- Teclado transitável com Tab e Enter.
- Leitores de tela suportados via atributos ARIA básicos.

16. REQUISITOS TÉCNICOS
- Arquivo único HTML5 estático com CSS e JavaScript embarcados.
- Zero dependências de servidores ou bibliotecas de terceiros (Vanilla JS).

17. ESTRUTURA DE DADOS
Array de objetos JSON contendo id, question, options (length 4), correctAnswerIndex (0..3) e explanation.

18. SEGURANÇA
- Sem eval() ou inserção de innerHTML arbitrário sem escape de caracteres.

19. SEO
- Meta tags de título, descrição e OpenGraph otimizadas para o produto ${pName}.

20. CRITÉRIOS DE ACEITAÇÃO
- Permite responder até a última pergunta.
- Calcula a pontuação corretamente.
- Redireciona para o link oficial ao clicar no CTA.
- Funciona 100% offline em qualquer navegador moderno.`;
}

/**
 * Generates an AI Prompt derived from the Quiz PRD for AI Studio / Lovable / Claude
 */
export function generateQuizPrompt(quiz: QuizConfig, reviewData: Partial<Review>): string {
  if (quiz.selectedTemplate === 'diagnostic') {
    return generateDiagnosticPrompt(quiz, reviewData);
  }

  const pName = reviewData.productName || 'Produto';
  const prd = generateQuizPRD(quiz, reviewData);

  return `Você é um desenvolvedor frontend especialista em gamificação e landing pages de alta conversão.
Crie um aplicativo de Quiz Interativo standalone sobre o produto "${pName}" com base no PRD detalhado a seguir:

${prd}

INSTRUÇÕES DE EXECUÇÃO:
1. Desenvolva o Quiz como uma aplicação web moderna, responsiva e fluida.
2. Utilize Tailwind CSS e suporte a tema dark mode.
3. Garanta que todas as ${quiz.questions.length} perguntas estejam presentes com suas 4 alternativas e explicações.
4. Inclua feedback visual imediato para cada resposta e tela de resultado com pontuação final.
5. Adicione um botão CTA destacado para o link de compra: "${quiz.ctaUrl}".`;
}

/**
 * Generates a 100% standalone, self-contained HTML5 file for the Quiz
 */
export function generateStandaloneQuizHtml(quiz: QuizConfig, reviewData: Partial<Review>): string {
  if (quiz.selectedTemplate === 'diagnostic') {
    return generateDiagnosticStandaloneHtml(quiz, reviewData);
  }

  const pName = escapeHtml(reviewData.productName || 'Produto');
  const siteName = escapeHtml(reviewData.siteName || 'ReviewFísico');
  const ctaUrl = escapeHtml(quiz.ctaUrl || reviewData.affiliateUrl || '#');
  const ctaText = escapeHtml(quiz.ctaText || 'VER OFERTA OFICIAL E COMPRAR');
  const quizTitle = escapeHtml(quiz.title || `Quiz do ${pName}`);
  const quizDesc = escapeHtml(quiz.description || `Testes de conhecimento sobre ${pName}`);
  const resultMsg = escapeHtml(quiz.resultMessage || `Parabéns! O ${pName} é o produto ideal para o seu perfil.`);

  const safeQuestionsJson = JSON.stringify(quiz.questions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options,
    correctAnswerIndex: q.correctAnswerIndex,
    explanation: q.explanation
  })));

  const theme = quiz.theme || {};
  const primaryColor = theme.primaryColor || '#22C55E';
  const secondaryColor = theme.secondaryColor || '#16A34A';
  const bgColor = theme.bgColor || '#080B10';
  const cardBgColor = theme.cardBgColor || '#0D1117';
  const borderColor = theme.borderColor || '#1E293B';
  const textColor = theme.textColor || '#F1F5F9';
  const borderRadius = theme.borderRadius || '20px';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${quizTitle} — ${siteName}</title>
  <meta name="description" content="${quizDesc}">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: ${bgColor}; color: ${textColor}; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 16px; }
    .quiz-container { width: 100%; max-width: 540px; background-color: ${cardBgColor}; border: 1px solid ${borderColor}; border-radius: ${borderRadius}; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
    .quiz-header { text-align: center; margin-bottom: 24px; }
    .quiz-badge { display: inline-block; padding: 4px 12px; background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); color: ${primaryColor}; font-size: 11px; font-weight: 700; text-transform: uppercase; border-radius: 9999px; margin-bottom: 12px; }
    .quiz-title { font-size: 20px; font-weight: 800; color: #FFFFFF; line-height: 1.3; margin-bottom: 8px; }
    .quiz-subtitle { font-size: 13px; color: #94A3B8; line-height: 1.5; }
    
    /* Progress Bar */
    .progress-bar-bg { width: 100%; height: 8px; background-color: ${borderColor}; border-radius: 9999px; overflow: hidden; margin: 16px 0 20px 0; }
    .progress-bar-fill { height: 100%; background: linear-gradient(90deg, ${primaryColor}, ${secondaryColor}); width: 0%; transition: width 0.3s ease; }
    .step-info { display: flex; justify-content: space-between; font-size: 11px; color: #64748B; font-weight: 600; margin-bottom: 12px; }

    /* Question & Answers */
    .question-title { font-size: 16px; font-weight: 700; color: #F8FAFC; margin-bottom: 16px; line-height: 1.4; }
    .options-grid { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
    .option-btn { width: 100%; text-align: left; background-color: rgba(255, 255, 255, 0.05); border: 1px solid ${borderColor}; border-radius: 12px; padding: 14px 16px; color: ${textColor}; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 12px; }
    .option-btn:hover:not(:disabled) { background-color: rgba(255, 255, 255, 0.1); border-color: ${primaryColor}; color: #FFFFFF; }
    .option-letter { width: 26px; height: 26px; border-radius: 6px; background-color: ${bgColor}; border: 1px solid ${borderColor}; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #94A3B8; shrink: 0; }
    
    /* Answer feedback states */
    .option-btn.correct { background-color: rgba(34, 197, 94, 0.15) !important; border-color: #22C55E !important; color: #4ADE80 !important; }
    .option-btn.correct .option-letter { background-color: #22C55E; color: #FFFFFF; border-color: #22C55E; }
    .option-btn.incorrect { background-color: rgba(239, 68, 68, 0.15) !important; border-color: #EF4444 !important; color: #F87171 !important; }
    .option-btn.incorrect .option-letter { background-color: #EF4444; color: #FFFFFF; border-color: #EF4444; }

    /* Explanation Box */
    .explanation-box { background-color: rgba(0, 0, 0, 0.3); border: 1px solid ${borderColor}; border-left: 4px solid ${primaryColor}; border-radius: 10px; padding: 14px; font-size: 12px; color: #CBD5E1; line-height: 1.5; margin-bottom: 20px; display: none; }
    .explanation-box strong { color: ${primaryColor}; }

    /* Action Buttons */
    .btn-primary { width: 100%; background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}); color: #FFFFFF; font-size: 14px; font-weight: 800; padding: 16px; border: none; border-radius: 12px; cursor: pointer; text-align: center; text-decoration: none; display: inline-block; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3); transition: transform 0.2s, background 0.2s; }
    .btn-primary:hover { transform: translateY(-1px); filter: brightness(1.1); }
    .btn-next { width: 100%; background-color: ${primaryColor}; color: #FFFFFF; font-size: 13px; font-weight: 700; padding: 14px; border: none; border-radius: 12px; cursor: pointer; display: none; }
    .btn-next:hover { filter: brightness(1.1); }

    /* Result Screen */
    .result-score { font-size: 42px; font-weight: 900; color: ${primaryColor}; margin: 12px 0 4px 0; }
    .result-text { font-size: 13px; color: #CBD5E1; margin-bottom: 24px; line-height: 1.5; }

    .hidden { display: none !important; }
  </style>
</head>
<body>

  <div class="quiz-container">
    <!-- TELA INICIAL -->
    <div id="start-screen">
      <div class="quiz-header">
        <span class="quiz-badge">${escapeHtml(quiz.type)}</span>
        <h1 class="quiz-title">${quizTitle}</h1>
        <p class="quiz-subtitle">${quizDesc}</p>
      </div>
      <button class="btn-primary" onclick="startQuiz()">INICIAR QUIZ AGORA</button>
    </div>

    <!-- TELA DE PERGUNTAS -->
    <div id="question-screen" class="hidden">
      <div class="step-info">
        <span id="question-count-text">Pergunta 1 de 5</span>
        <span id="percentage-text">20%</span>
      </div>
      <div class="progress-bar-bg">
        <div id="progress-bar" class="progress-bar-fill"></div>
      </div>

      <h2 id="question-title" class="question-title"></h2>
      <div id="options-grid" class="options-grid"></div>

      <div id="explanation-box" class="explanation-box"></div>
      <button id="next-btn" class="btn-next" onclick="nextQuestion()">PRÓXIMA PERGUNTA →</button>
    </div>

    <!-- TELA DE RESULTADO -->
    <div id="result-screen" class="hidden" style="text-align: center;">
      <span class="quiz-badge">DIAGNÓSTICO CONCLUÍDO</span>
      <div id="score-display" class="result-score">5/5</div>
      <p id="percentage-result" style="font-size: 14px; font-weight: 700; color: #60A5FA; margin-bottom: 12px;">100% de Acertos</p>
      <p class="result-text">${resultMsg}</p>
      
      <a href="${ctaUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary">
        ${ctaText}
      </a>
      
      <p style="margin-top: 16px;">
        <button onclick="resetQuiz()" style="background: none; border: none; color: #64748B; font-size: 12px; cursor: pointer; text-decoration: underline;">
          Refazer Quiz
        </button>
      </p>
    </div>
  </div>

  <script>
    const questions = ${safeQuestionsJson};
    let currentIdx = 0;
    let score = 0;
    let answered = false;

    function startQuiz() {
      document.getElementById('start-screen').classList.add('hidden');
      document.getElementById('question-screen').classList.remove('hidden');
      document.getElementById('result-screen').classList.add('hidden');
      currentIdx = 0;
      score = 0;
      renderQuestion();
    }

    function renderQuestion() {
      answered = false;
      const q = questions[currentIdx];
      const total = questions.length;
      const pct = Math.round(((currentIdx + 1) / total) * 100);

      document.getElementById('question-count-text').innerText = 'Pergunta ' + (currentIdx + 1) + ' de ' + total;
      document.getElementById('percentage-text').innerText = pct + '%';
      document.getElementById('progress-bar').style.width = pct + '%';
      document.getElementById('question-title').innerText = q.question;
      
      const expBox = document.getElementById('explanation-box');
      expBox.style.display = 'none';
      expBox.innerHTML = '';

      const nextBtn = document.getElementById('next-btn');
      nextBtn.style.display = 'none';

      const grid = document.getElementById('options-grid');
      grid.innerHTML = '';

      const letters = ['A', 'B', 'C', 'D'];
      q.options.forEach((optText, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.onclick = () => selectAnswer(i);
        btn.innerHTML = '<span class="option-letter">' + letters[i] + '</span><span>' + escapeHtmlStr(optText) + '</span>';
        grid.appendChild(btn);
      });
    }

    function selectAnswer(selectedIdx) {
      if (answered) return;
      answered = true;

      const q = questions[currentIdx];
      const grid = document.getElementById('options-grid');
      const buttons = grid.getElementsByClassName('option-btn');

      if (selectedIdx === q.correctAnswerIndex) {
        score++;
        buttons[selectedIdx].classList.add('correct');
      } else {
        buttons[selectedIdx].classList.add('incorrect');
        buttons[q.correctAnswerIndex].classList.add('correct');
      }

      // Desabilitar todas as opções
      for (let btn of buttons) {
        btn.disabled = true;
      }

      // Mostrar Explicação
      const expBox = document.getElementById('explanation-box');
      expBox.innerHTML = '<strong>Explicação:</strong> ' + escapeHtmlStr(q.explanation);
      expBox.style.display = 'block';

      // Mostrar botão próxima pergunta
      const nextBtn = document.getElementById('next-btn');
      nextBtn.style.display = 'block';
    }

    function nextQuestion() {
      currentIdx++;
      if (currentIdx < questions.length) {
        renderQuestion();
      } else {
        showResult();
      }
    }

    function showResult() {
      document.getElementById('question-screen').classList.add('hidden');
      document.getElementById('result-screen').classList.remove('hidden');

      const total = questions.length;
      const pct = Math.round((score / total) * 100);

      document.getElementById('score-display').innerText = score + ' / ' + total;
      document.getElementById('percentage-result').innerText = pct + '% de Aproveitamento';
    }

    function resetQuiz() {
      startQuiz();
    }

    function escapeHtmlStr(str) {
      if (!str) return '';
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
  </script>
</body>
</html>`;
}
