# ARCHITECTURE REFERENCE DOCUMENTATION
## VERSION STABLE — REVIEW + QUIZ TEMPLATES
**Status**: VERSION STABLE APPROVED
**Date**: September 2026

---

## 1. ESTRUTURA DE ARQUIVOS ATUAL

```
/
├── index.html                       # Entrypoint principal do navegador (Tailwind via CDN)
├── metadata.json                    # Configuração de nome e capacidades do applet
├── package.json                     # Dependências do projeto (React, Lucide, Vite, Express, esbuild, tsx)
├── vite.config.ts                   # Configuração do Vite com base: './'
├── server.ts                        # Servidor Express com middleware Vite em dev e estático em prod
├── src/
│   ├── main.tsx                     # Ponto de entrada React (ReactDOM.createRoot)
│   ├── App.tsx                      # Componente raiz, gerenciamento de estado global e navegação entre Review e Quiz
│   ├── index.css                    # Estilos globais e utilitários Tailwind
│   ├── types.ts                     # Interfaces TypeScript (Review, QuizConfig, QuizQuestion, QuizTemplateId, etc.)
│   ├── components/
│   │   ├── ReviewGeneratorModule.tsx # Módulo Gerador de Página de Review (5 passos, SEO, Galeria, FAQ, PRD, HTML)
│   │   ├── QuizGeneratorModule.tsx   # Módulo Gerador de Quiz do Produto com seletor e gerenciamento de estado
│   │   └── quiz/
│   │       ├── QuizTemplateSelector.tsx  # Cards visuais para escolha de templates (Classic / Diagnostic)
│   │       ├── QuizDiagnosticEditor.tsx  # Editor especializado para o Quiz Diagnóstico (Aba por aba)
│   │       └── QuizDiagnosticPreview.tsx # Visualizador e simulador interativo em tempo real
│   └── utils/
│       ├── quizGeneratorUtils.ts         # Engine do Quiz, rotas de exportação e suporte ao Template Classic
│       └── quizDiagnosticUtils.ts        # Engine e geradores de PRD, Prompt e HTML Standalone do Template Diagnostic
```

---

## 2. COMPONENTES DO GERADOR DE REVIEW

- **ReviewGeneratorModule.tsx**: Gerencia os 5 passos do fluxo da Review:
  - **Passo 1**: Cadastro dos dados do Produto (Nome, Categoria, Preço, Benefícios, FAQ, Imagens).
  - **Passo 2**: Definição da Linha Editorial e Ângulo de Vendas.
  - **Passo 3**: Estrutura e Seções do Review.
  - **Passo 4**: Análise Crítica e Tabela Prós & Contras.
  - **Passo 5**: Entregáveis (PRD, Prompt e HTML Standalone do Review).
- **Módulos acoplados**: Gerenciador de Galeria, Editor de Depoimentos, Central SEO (Palavras-chave + Termos de Intenção) e Exportador de Arquivos (`review-[slug].html`).

---

## 3. COMPONENTES DO GERADOR DE QUIZ

- **QuizGeneratorModule.tsx**: Hub central do Gerador de Quiz. Integra o seletor de templates, os editores específicos, a simulação interativa e a central de exportação entregável.
- **QuizTemplateSelector.tsx**: Exibe os cards visuais dos modelos disponíveis (`classic` e `diagnostic`) com miniaturas, badges e botão de troca de modelo.
- **QuizDiagnosticEditor.tsx**: Painel de edição modular dividido em abas (Perguntas, Introdução, Tela de Processamento, Perfis de Resultado, Captura de Lead, Oferta & Cronômetro, Personalização Visual).
- **QuizDiagnosticPreview.tsx**: Simulador interativo mobile-first e desktop que permite ao usuário testar todo o funil do Quiz Diagnóstico em tempo real.

---

## 4. ESTRUTURA QUIZ DATA

A camada de dados do Quiz é representada pelo tipo `QuizConfig` em `src/types.ts`. Contém os dados estruturados do quiz, independentemente do template visual selecionado:
- Identificadores e textos base (`id`, `title`, `description`, `type`, `difficulty`).
- Chamadas de ação (`ctaText`, `ctaUrl`, `resultMessage`).
- Coleção de perguntas (`questions: QuizQuestion[]`).
- Identificador do modelo ativo (`selectedTemplate?: QuizTemplateId`).
- Configurações do funil diagnóstico (`introTitle`, `introSubtitle`, `processingMessages`, `resultProfiles`, `leadCapture`, `offerConfig`, `theme`).

---

## 5. QUIZ ENGINE

A engine de lógica e processamento do Quiz é dividida entre dois módulos utilitários principais:
1. `src/utils/quizGeneratorUtils.ts`:
   - Geração inicial do quiz baseado no produto (`generateQuizFromProduct`).
   - Gerenciamento do Template Clássico.
   - Ponto de roteamento de PRD, Prompt e HTML conforme o `selectedTemplate`.
2. `src/utils/quizDiagnosticUtils.ts`:
   - Configurações padrão do Quiz Diagnóstico (`generateDefaultDiagnosticConfig`).
   - Geradores de PRD (`generateDiagnosticPRD`), Prompt (`generateDiagnosticPrompt`) e HTML Standalone (`generateDiagnosticStandaloneHtml`).

---

## 6. SISTEMA DE TEMPLATES

Arquitetura desacoplada que separa **Conteúdo/Lógica (Quiz Data + Engine)** da **Apresentação (Template)**:
- O usuário seleciona o template ativo no `QuizTemplateSelector`.
- A troca de modelo apenas atualiza o atributo `selectedTemplate` no `QuizConfig` e mescla valores padrão adicionais caso necessário.
- As perguntas e alternativas **permanecem preservadas** ao alternar entre os modelos.

---

## 7. TEMPLATE CLASSIC (`classic`)

- **Proposta**: Quiz tradicional de conhecimento e quebra de objeções.
- **Estrutura Visual**: Layout escuro/neutro, focado em perguntas sequenciais de 4 alternativas.
- **Funcionalidades**:
  - Feedback imediato (correto/incorreto).
  - Explicação pedagógica.
  - Indicador de porcentagem de progresso e placar de acertos.
  - Tela de resultado final com mensagem explicativa e botão de CTA.

---

## 8. TEMPLATE DIAGNOSTIC (`diagnostic`)

- **Proposta**: Funil de vendas e qualificação em formato de diagnóstico mobile-first.
- **Estrutura Visual**: Design system verde suave (`#F2F9F4`), cards brancos, botões verdes (`#16A34A`), tipografia limpa e espaçamentos otimizados para celulares (360px–480px).
- **Fluxo do Funil**:
  `INTRO` → `PERGUNTAS (Single, Multi, Slider, Peso, Altura)` → `PROCESSAMENTO ANIMADO` → `CAPTURA DE LEAD` → `RESULTADO DO DIAGNÓSTICO` → `PROVA SOCIAL` → `CARD DA OFERTA & CRONÔMETRO` → `FAQ` → `CTA FINAL`

---

## 9. ESTRUTURA DE `quizConfig`

```typescript
export interface QuizConfig {
  id: string;
  title: string;
  description: string;
  difficulty: QuizDifficulty;
  type: string;
  ctaText: string;
  ctaUrl: string;
  resultMessage?: string;
  questions: QuizQuestion[];
  selectedTemplate?: QuizTemplateId; // 'classic' | 'diagnostic'
  introImage?: string;
  introTitle?: string;
  introSubtitle?: string;
  introCtaText?: string;
  processingEnabled?: boolean;
  processingTimeMs?: number;
  processingMessages?: string[];
  resultProfiles?: QuizResultProfile[];
  leadCapture?: QuizLeadCaptureConfig;
  offerConfig?: QuizOfferConfig;
  theme?: QuizThemeConfig;
  testimonials?: TestimonialItem[];
  faq?: FAQItem[];
}
```

---

## 10. ESTRUTURA DE PERGUNTAS (`QuizQuestion`)

```typescript
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[]; // 4 alternativas para o modelo clássico, N alternativas para o diagnóstico
  correctAnswerIndex: number; // 0, 1, 2, 3...
  explanation: string;
  type?: QuizQuestionType; // 'single-select' | 'multi-select' | 'slider' | 'weight' | 'height' | 'number' | 'text'
  description?: string;
  optionScores?: number[]; // Pontuação individual por opção (ex: [25, 20, 15, 10])
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
  sliderUnit?: string;
  sliderInitial?: number;
  required?: boolean;
}
```

---

## 11. ESTRUTURA DE SCORING (MOTOR DE PONTUAÇÃO)

- **Quiz Clássico**: Contagem de respostas certas (`correctAnswerIndex`) em relação ao total de perguntas, gerando um percentual `(acertos / total) * 100`.
- **Quiz Diagnóstico**:
  - Cada alternativa possui uma pontuação configurada em `optionScores`.
  - Para `single-select`, soma-se a pontuação da opção escolhida.
  - Para `multi-select`, somam-se as pontuações de todas as opções marcadas.
  - Para `slider`/`weight`/`height`, utiliza-se o valor/regra correspondente.
  - O score acumulado é comparado com as faixas `minScore` e `maxScore` dos `resultProfiles`.

---

## 12. ESTRUTURA DE RESULTADOS (`QuizResultProfile`)

```typescript
export interface QuizResultProfile {
  id: string;
  title: string;
  description: string;
  minScore: number;
  maxScore: number;
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
}
```

---

## 13. ESTRUTURA DE CAPTURA (`QuizLeadCaptureConfig`)

```typescript
export interface QuizLeadCaptureConfig {
  enabled: boolean;
  title?: string;
  subtitle?: string;
  fields: {
    name?: boolean;
    email?: boolean;
    phone?: boolean;
  };
  buttonText?: string;
}
```

---

## 14. ESTRUTURA DE OFERTA (`QuizOfferConfig`)

```typescript
export interface QuizOfferConfig {
  title?: string;
  subtitle?: string;
  productName?: string;
  oldPrice?: string;
  currentPrice?: string;
  benefits?: string[];
  guaranteeDays?: number;
  ctaText?: string;
  ctaUrl?: string;
  timerEnabled?: boolean;
  timerMinutes?: number;
}
```

---

## 15. ESTRUTURA DE PRD

- **Clássico**: Documento em 20 seções descrevendo o quiz tradicional de múltipla escolha com gabarito pedagógico.
- **Diagnóstico**: Documento em 20 seções gerado por `generateDiagnosticPRD()`, detalhando as 8 etapas do funil, matriz de pontuação, perfil de leads, segurança e critérios de aceitação.

---

## 16. ESTRUTURA DE PROMPT

- Prompts otimizados para IA (Google AI Studio / Lovable / Claude) derivados diretamente do PRD correspondente.
- Informam: Template escolhido, Design System, Componentes, Tipos de pergunta, Regras de Scoring, Captura de Leads e CTA final.

---

## 17. GERAÇÃO DE HTML (STANDALONE HTML5)

- **Funções Exportadoras**:
  - `generateStandaloneQuizHtml()` para o Template Clássico.
  - `generateDiagnosticStandaloneHtml()` para o Template Diagnóstico.
- **Atributos Técnicos**:
  - Arquivo HTML5 estático único (`quiz-[slug]-classic.html` ou `quiz-[slug]-diagnostico.html`).
  - CSS interno totalmente estilizado e responsivo.
  - JavaScript Vanilla embutido, 100% livre de dependências externa ou React.
  - Sanitização de strings via `escapeHtml()` prevenindo injeções XSS.

---

## 18. SISTEMA DE FALLBACK

- Se `quizConfig.selectedTemplate` for `undefined` ou `null` (como em quizzes legados), a aplicação assume o valor `'classic'` automaticamente.
- Se funções de escape receberem valores indefinidos, retornam string vazia sem lançar exceções.

---

## 19. PERSISTÊNCIA

- O estado do Quiz e do Review é mantido no React State (`App.tsx`) e propagado entre as abas.
- Ao atualizar o produto ou o quiz, as alterações são mantidas em `review.quizConfig`.

---

## 20. DEPENDÊNCIAS IMPORTANTES

- **React 18** & **TypeScript 5+**.
- **Lucide React**: Biblioteca de ícones padrão para a interface.
- **Tailwind CSS (via CDN em `index.html`)**: Estilização através de classes utilitárias.
- **Vite** & **Express** (`server.ts`): Ambiente de execução e build com suporte a `base: './'`.

---

## 21. THEME SYSTEM (SISTEMA DE TEMAS POR NICHO)

- **Módulos / Arquivos**:
  - `src/utils/quizThemePresets.ts`: Registro de 12+ presets visuais (Glow Rose Beauty, Emerald Health & Detox, Volt High Performance, Cyber Cyan Tech, Warm Amber Cozy, Glam Magenta Hair, Luxury Bronze & Gold, Playful Violet Kids, Titanium Steel Grooming, Golden Success Navy, Serene Teal Relax, Dark Gold Oficial, Light Clean) e funções utilitárias (`getRecommendedThemeForCategory`, `themePresetToConfig`).
  - `src/components/quiz/QuizThemeSelectorModal.tsx`: Seletor interativo de temas por categoria com sugestão automática de 1 clique, preview ao vivo e controle de cores manuais.
  - `src/types.ts`: Interface `QuizThemeConfig` integrada em `QuizConfig.theme`.
- **Arquitetura Desacoplada**:
  ```
  QuizConfig (Data) -> Quiz Engine (Logic) -> Template (Structure) -> Theme (Visual) -> Preview / HTML
  ```
- **Princípio da Camada Independente**:
  - O tema altera **estritamente e exclusivamente** a camada visual (`primaryColor`, `secondaryColor`, `bgColor`, `cardBgColor`, `borderColor`, `textColor`, `borderRadius`).
  - A seleção ou troca de tema **nunca** altera perguntas, alternativas, respostas corretas, scoring, resultados, captura de leads, ofertas, FAQs, CTAs, produtos ou dados da Review.
- **Recomendação Automática por Categoria**:
  - O sistema analisa a categoria do produto e sugere o preset de nicho mais adequado como recomendação, permitindo livre escolha manual sem sobrescrever a decisão do usuário.
- **Personalização & Fallback**:
  - Permite ajuste fino de cada parâmetro visual no editor de quiz.
  - Quizzes legados sem tema sob medida utilizam o tema padrão sem perda de dados nem erros de renderização.
- **Injeção Dinâmica em Entregáveis**:
  - O PRD, o Prompt e a exportação HTML Standalone (`quiz-[slug]-classic.html` e `quiz-[slug]-diagnostico.html`) utilizam e injetam dinamicamente as cores e propriedades do tema selecionado.

---

### 🛡️ MARCAÇÃO DE SEGURANÇA DA ARQUITETURA
**STATUS**: `VERSION STABLE — REVIEW + QUIZ TEMPLATES + NICHE THEMES`
Esta arquitetura serve como ponto de ancoragem e referência para qualquer evolução futura. Nenhuma API ou interface descrita neste documento deve ser alterada de forma destrutiva.
