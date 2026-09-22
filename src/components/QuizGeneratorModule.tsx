import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  CheckCircle2,
  Eye,
  FileCode,
  Download,
  ExternalLink,
  RefreshCw,
  X,
  Code2,
  FileText,
  Layers,
  Check,
  ArrowRight,
  AlertCircle,
  Palette
} from 'lucide-react';
import { Review, QuizConfig, QuizQuestion, QuizDifficulty, QuizTemplateId, QuizThemeConfig } from '../types';
import {
  generateQuizFromProduct,
  generateQuizPRD,
  generateQuizPrompt,
  generateStandaloneQuizHtml
} from '../utils/quizGeneratorUtils';
import { generateDefaultDiagnosticConfig } from '../utils/quizDiagnosticUtils';
import { QuizTemplateSelector } from './quiz/QuizTemplateSelector';
import { QuizDiagnosticEditor } from './quiz/QuizDiagnosticEditor';
import { QuizDiagnosticPreview } from './quiz/QuizDiagnosticPreview';
import { QuizThemeSelectorModal } from './quiz/QuizThemeSelectorModal';

interface QuizGeneratorModuleProps {
  review: Partial<Review>;
  onUpdateQuizConfig?: (config: QuizConfig) => void;
  setActionToast: (toast: { message: string; type: 'success' | 'error' | 'info' }) => void;
}

export const QuizGeneratorModule: React.FC<QuizGeneratorModuleProps> = ({
  review,
  onUpdateQuizConfig,
  setActionToast
}) => {
  // Quiz State
  const [quizConfig, setQuizConfig] = useState<QuizConfig>(() => {
    if (review.quizConfig) return review.quizConfig;
    return generateQuizFromProduct(review, 5, 'Misto', 'Conhecimento & Diagnóstico de Compra', 'classic');
  });

  const selectedTemplate = quizConfig.selectedTemplate || 'classic';

  const [questionCount, setQuestionCount] = useState<number>(quizConfig.questions.length || 5);
  const [difficulty, setDifficulty] = useState<QuizDifficulty>(quizConfig.difficulty || 'Misto');
  const [quizType, setQuizType] = useState<string>(quizConfig.type || 'Conhecimento & Diagnóstico de Compra');

  // Modals & Preview States
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [showPrdModal, setShowPrdModal] = useState<boolean>(false);
  const [showPromptModal, setShowPromptModal] = useState<boolean>(false);
  const [showHtmlModal, setShowHtmlModal] = useState<boolean>(false);
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);

  // Preview Interactive State
  const [previewStep, setPreviewStep] = useState<'start' | 'question' | 'result'>('start');
  const [currentQIdx, setCurrentQIdx] = useState<number>(0);
  const [selectedOptIdx, setSelectedOptIdx] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);

  // Template Switcher Handler
  const handleSelectTemplate = (templateId: QuizTemplateId) => {
    if (selectedTemplate === templateId) return;

    if (templateId === 'diagnostic') {
      const diagDefaults = generateDefaultDiagnosticConfig(review, quizConfig.questions);
      const updatedConfig: QuizConfig = {
        ...quizConfig,
        ...diagDefaults,
        selectedTemplate: 'diagnostic'
      };
      setQuizConfig(updatedConfig);
      if (onUpdateQuizConfig) onUpdateQuizConfig(updatedConfig);
      setActionToast({ message: 'Modelo de Quiz alterado para "Quiz Diagnóstico"!', type: 'success' });
    } else {
      const updatedConfig: QuizConfig = {
        ...quizConfig,
        selectedTemplate: 'classic'
      };
      setQuizConfig(updatedConfig);
      if (onUpdateQuizConfig) onUpdateQuizConfig(updatedConfig);
      setActionToast({ message: 'Modelo de Quiz alterado para "Quiz Clássico"!', type: 'success' });
    }
  };

  // Helper function for resilient clipboard copying
  const safeCopyToClipboard = async (text: string): Promise<boolean> => {
    if (!text) return false;
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (err) {
      console.warn('Clipboard API error, fallback to execCommand:', err);
    }
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      console.error('Fallback copy failed:', err);
      return false;
    }
  };

  // Generate or Regenerate Quiz via IA
  const handleGenerateAiQuiz = () => {
    const newConfig = generateQuizFromProduct(review, questionCount, difficulty, quizType);
    setQuizConfig(newConfig);
    if (onUpdateQuizConfig) onUpdateQuizConfig(newConfig);
    setActionToast({
      message: `✨ Quiz com ${newConfig.questions.length} perguntas gerado para "${review.productName || 'Produto'}"!`,
      type: 'success'
    });
  };

  // Question editing handlers
  const handleUpdateQuestion = (qIdx: number, updatedFields: Partial<QuizQuestion>) => {
    const updated = [...quizConfig.questions];
    updated[qIdx] = { ...updated[qIdx], ...updatedFields };
    const newConfig = { ...quizConfig, questions: updated, questionCount: updated.length };
    setQuizConfig(newConfig);
    if (onUpdateQuizConfig) onUpdateQuizConfig(newConfig);
  };

  const handleUpdateOption = (qIdx: number, optIdx: number, val: string) => {
    const q = quizConfig.questions[qIdx];
    const newOpts = [...q.options] as [string, string, string, string];
    newOpts[optIdx] = val;
    handleUpdateQuestion(qIdx, { options: newOpts });
  };

  const handleAddQuestion = () => {
    const newQ: QuizQuestion = {
      id: 'q-' + Date.now(),
      question: `Nova pergunta sobre o ${review.productName || 'Produto'}?`,
      options: [
        'Opção A (Resposta Correta)',
        'Opção B (Incorreta)',
        'Opção C (Incorreta)',
        'Opção D (Incorreta)'
      ],
      correctAnswerIndex: 0,
      explanation: 'Explicação detalhada do motivo desta opção estar correta.'
    };
    const updated = [...quizConfig.questions, newQ];
    const newConfig = { ...quizConfig, questions: updated, questionCount: updated.length };
    setQuizConfig(newConfig);
    if (onUpdateQuizConfig) onUpdateQuizConfig(newConfig);
    setActionToast({ message: 'Nova pergunta adicionada ao Quiz!', type: 'success' });
  };

  const handleDuplicateQuestion = (qIdx: number) => {
    const target = quizConfig.questions[qIdx];
    const dup: QuizQuestion = {
      ...target,
      id: 'q-' + Date.now(),
      question: `${target.question} (Cópia)`
    };
    const updated = [...quizConfig.questions];
    updated.splice(qIdx + 1, 0, dup);
    const newConfig = { ...quizConfig, questions: updated, questionCount: updated.length };
    setQuizConfig(newConfig);
    if (onUpdateQuizConfig) onUpdateQuizConfig(newConfig);
    setActionToast({ message: 'Pergunta duplicada com sucesso!', type: 'success' });
  };

  const handleDeleteQuestion = (qIdx: number) => {
    if (quizConfig.questions.length <= 1) {
      setActionToast({ message: 'O Quiz precisa ter pelo menos 1 pergunta.', type: 'error' });
      return;
    }
    const updated = quizConfig.questions.filter((_, idx) => idx !== qIdx);
    const newConfig = { ...quizConfig, questions: updated, questionCount: updated.length };
    setQuizConfig(newConfig);
    if (onUpdateQuizConfig) onUpdateQuizConfig(newConfig);
    setActionToast({ message: 'Pergunta removida.', type: 'info' });
  };

  // Preview Reset
  const handleStartPreview = () => {
    setPreviewStep('question');
    setCurrentQIdx(0);
    setScore(0);
    setHasAnswered(false);
    setSelectedOptIdx(null);
  };

  const handleSelectOptionPreview = (optIdx: number) => {
    if (hasAnswered) return;
    setHasAnswered(true);
    setSelectedOptIdx(optIdx);

    const currentQ = quizConfig.questions[currentQIdx];
    if (optIdx === currentQ.correctAnswerIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestionPreview = () => {
    if (currentQIdx + 1 < quizConfig.questions.length) {
      setCurrentQIdx((prev) => prev + 1);
      setHasAnswered(false);
      setSelectedOptIdx(null);
    } else {
      setPreviewStep('result');
    }
  };

  // Export HTML Handlers
  const generatedHtml = generateStandaloneQuizHtml(quizConfig, review);
  const generatedPrd = generateQuizPRD(quizConfig, review);
  const generatedPrompt = generateQuizPrompt(quizConfig, review);

  const handleCopyHtml = async () => {
    const success = await safeCopyToClipboard(generatedHtml);
    if (success) {
      setActionToast({ message: 'HTML do Quiz copiado.', type: 'success' });
    } else {
      setActionToast({ message: 'Erro ao copiar HTML do Quiz.', type: 'error' });
    }
  };

  const handleDownloadHtml = () => {
    const slug = review.slug || 'produto';
    const blob = new Blob([generatedHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-${slug}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setActionToast({ message: `Download iniciado: quiz-${slug}.html`, type: 'success' });
  };

  const handleOpenLovable = async () => {
    await safeCopyToClipboard(generatedPrompt);
    const lovableUrl = `https://lovable.dev/?prompt=${encodeURIComponent(generatedPrompt)}`;
    window.open(lovableUrl, '_blank', 'noopener,noreferrer');
    setActionToast({ message: 'Prompt copiado! Abrindo o Lovable...', type: 'success' });
  };

  const handleOpenAiStudio = async () => {
    await safeCopyToClipboard(generatedPrompt);
    const aiStudioUrl = `https://ai.studio/build?prompt=${encodeURIComponent(generatedPrompt)}`;
    window.open(aiStudioUrl, '_blank', 'noopener,noreferrer');
    setActionToast({ message: 'Prompt copiado! Abrindo o Google AI Studio...', type: 'success' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. SELETOR DE TEMPLATES DO QUIZ */}
      <QuizTemplateSelector
        selectedTemplate={selectedTemplate}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* 2. ÁREA DE CONFIGURAÇÃO E EDIÇÃO CONFORME O TEMPLATE SELECIONADO */}
      {selectedTemplate === 'diagnostic' ? (
        <div className="space-y-6">
          <QuizDiagnosticEditor
            quizConfig={quizConfig}
            onChange={(updated) => {
              setQuizConfig(updated);
              if (onUpdateQuizConfig) onUpdateQuizConfig(updated);
            }}
            onGenerateAI={handleGenerateAiQuiz}
            isGeneratingAI={false}
          />

          <QuizDiagnosticPreview
            quizConfig={quizConfig}
            reviewData={review}
          />
        </div>
      ) : (
        /* TEMPLATE 01: CLÁSSICO */
        <div className="space-y-6">
          {/* HEADER DO MÓDULO QUIZ */}
          <div className="bg-[#0D1117] border border-[#1E293B] rounded-2xl p-5 md:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[#60A5FA]">
                  <HelpCircle className="w-5 h-5 text-[#60A5FA]" />
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Gerador de Quiz Clássico do Produto
                  </h2>
                </div>
            <p className="text-xs text-[#8E8E8E] mt-1">
              Crie um Quiz interativo para engajar compradores, quebrar objeções e direcionar tráfego qualificado para a sua oferta oficial.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowThemeModal(true)}
              className="flex items-center gap-2 bg-[#1C1912] border border-[#F5C542]/40 hover:border-[#F5C542] text-[#F5C542] hover:text-white font-bold px-3.5 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              <Palette className="w-4 h-4 text-[#F5C542]" />
              <span>Temas por Nicho</span>
            </button>
            <button
              type="button"
              onClick={handleGenerateAiQuiz}
              className="flex items-center gap-2 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-blue-500/20 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>Gerar Quiz com IA</span>
            </button>
            <button
              type="button"
              onClick={() => {
                handleStartPreview();
                setShowPreviewModal(true);
              }}
              className="flex items-center gap-1.5 bg-[#141414] hover:bg-[#1E1E1E] text-[#D4D4D4] hover:text-white border border-[#2E2E2E] font-semibold px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#22C55E]" />
              <span>Visualizar Quiz</span>
            </button>
          </div>
        </div>

        {/* CONFIGURAÇÃO DO QUIZ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t border-[#1E293B]">
          {/* Título do Quiz */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider">
              NOME / TÍTULO DO QUIZ
            </label>
            <input
              type="text"
              value={quizConfig.title}
              onChange={(e) => {
                const updated = { ...quizConfig, title: e.target.value };
                setQuizConfig(updated);
                if (onUpdateQuizConfig) onUpdateQuizConfig(updated);
              }}
              className="w-full bg-[#080B10] border border-[#1E293B] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              placeholder="Ex: Quiz do Produto: Teste Seu Conhecimento"
            />
          </div>

          {/* Quantidade de Perguntas */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider">
              QUANTIDADE DE PERGUNTA(S)
            </label>
            <select
              value={questionCount}
              onChange={(e) => {
                const cnt = parseInt(e.target.value, 10);
                setQuestionCount(cnt);
                const newConfig = generateQuizFromProduct(review, cnt, difficulty, quizType);
                setQuizConfig(newConfig);
                if (onUpdateQuizConfig) onUpdateQuizConfig(newConfig);
              }}
              className="w-full bg-[#080B10] border border-[#1E293B] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
            >
              <option value={3}>3 Perguntas</option>
              <option value={5}>5 Perguntas</option>
              <option value={7}>7 Perguntas</option>
              <option value={10}>10 Perguntas</option>
            </select>
          </div>

          {/* Dificuldade */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider">
              DIFICULDADE
            </label>
            <select
              value={difficulty}
              onChange={(e) => {
                const diff = e.target.value as QuizDifficulty;
                setDifficulty(diff);
                const updated = { ...quizConfig, difficulty: diff };
                setQuizConfig(updated);
                if (onUpdateQuizConfig) onUpdateQuizConfig(updated);
              }}
              className="w-full bg-[#080B10] border border-[#1E293B] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
            >
              <option value="Fácil">Fácil</option>
              <option value="Médio">Médio</option>
              <option value="Difícil">Difícil</option>
              <option value="Misto">Misto</option>
            </select>
          </div>

          {/* Tipo de Quiz */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider">
              TIPO DE QUIZ
            </label>
            <input
              type="text"
              value={quizType}
              onChange={(e) => {
                setQuizType(e.target.value);
                const updated = { ...quizConfig, type: e.target.value };
                setQuizConfig(updated);
                if (onUpdateQuizConfig) onUpdateQuizConfig(updated);
              }}
              className="w-full bg-[#080B10] border border-[#1E293B] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              placeholder="Ex: Conhecimento & Diagnóstico"
            />
          </div>

          {/* Texto CTA Final */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider">
              CTA FINAL DO QUIZ (TEXTO)
            </label>
            <input
              type="text"
              value={quizConfig.ctaText}
              onChange={(e) => {
                const updated = { ...quizConfig, ctaText: e.target.value };
                setQuizConfig(updated);
                if (onUpdateQuizConfig) onUpdateQuizConfig(updated);
              }}
              className="w-full bg-[#080B10] border border-[#1E293B] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              placeholder="Ex: VER OFERTA OFICIAL E COMPRAR"
            />
          </div>

          {/* URL do CTA */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider">
              URL DO CTA FINAL
            </label>
            <input
              type="text"
              value={quizConfig.ctaUrl}
              onChange={(e) => {
                const updated = { ...quizConfig, ctaUrl: e.target.value };
                setQuizConfig(updated);
                if (onUpdateQuizConfig) onUpdateQuizConfig(updated);
              }}
              className="w-full bg-[#080B10] border border-[#1E293B] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              placeholder="Ex: https://sualojaoficial.com/produto"
            />
          </div>
        </div>
      </div>

      {/* EDITOR DE PERGUNTAS DO QUIZ */}
      <div className="bg-[#0D1117] border border-[#1E293B] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#60A5FA]">
            <Layers className="w-4 h-4 text-[#60A5FA]" />
            <h3 className="text-sm font-bold text-white">
              Perguntas do Quiz ({quizConfig.questions.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={handleAddQuestion}
            className="flex items-center gap-1.5 bg-[#1E293B] hover:bg-[#2B394A] text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Adicionar Pergunta</span>
          </button>
        </div>

        <div className="space-y-4">
          {quizConfig.questions.map((q, qIdx) => (
            <div
              key={q.id || qIdx}
              className="bg-[#080B10] border border-[#1E293B] rounded-xl p-4 space-y-3.5"
            >
              <div className="flex items-center justify-between gap-2 border-b border-[#1E293B] pb-2.5">
                <span className="text-xs font-extrabold text-[#60A5FA] bg-[#1E293B] px-2.5 py-1 rounded-md">
                  Pergunta #{qIdx + 1}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDuplicateQuestion(qIdx)}
                    className="p-1.5 text-[#A1A1A1] hover:text-white hover:bg-[#1E293B] rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    title="Duplicar pergunta"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Duplicar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(qIdx)}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    title="Excluir pergunta"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Excluir</span>
                  </button>
                </div>
              </div>

              {/* Pergunta Text Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#8E8E8E] uppercase">
                  ENUNCIADO DA PERGUNTA
                </label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => handleUpdateQuestion(qIdx, { question: e.target.value })}
                  className="w-full bg-[#0D1117] border border-[#263142] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              {/* 4 Alternativas A, B, C, D */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8E8E8E] uppercase">
                  ALTERNATIVAS (SELECIONE A RESPOSTA CORRETA)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {['A', 'B', 'C', 'D'].map((letter, optIdx) => {
                    const isCorrect = q.correctAnswerIndex === optIdx;
                    return (
                      <div
                        key={optIdx}
                        className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                          isCorrect
                            ? 'bg-[#162B20] border-[#22C55E]/60'
                            : 'bg-[#0D1117] border-[#1E293B]'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleUpdateQuestion(qIdx, { correctAnswerIndex: optIdx })}
                          className={`w-6 h-6 rounded-md font-bold text-xs shrink-0 flex items-center justify-center cursor-pointer transition-colors ${
                            isCorrect
                              ? 'bg-[#22C55E] text-white'
                              : 'bg-[#1E293B] text-[#94A3B8] hover:bg-[#2D3748]'
                          }`}
                          title={isCorrect ? 'Resposta Correta' : 'Marcar como Correta'}
                        >
                          {letter}
                        </button>

                        <input
                          type="text"
                          value={q.options[optIdx] || ''}
                          onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                          className="w-full bg-transparent border-none text-xs text-white focus:outline-none"
                          placeholder={`Opção ${letter}`}
                        />

                        {isCorrect && (
                          <span className="text-[10px] font-bold text-[#4ADE80] shrink-0 bg-[#22C55E]/20 px-1.5 py-0.5 rounded">
                            CORRETA
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Explicação */}
              <div className="space-y-1 pt-1">
                <label className="text-[10px] font-bold text-[#8E8E8E] uppercase">
                  EXPLICAÇÃO DIDÁTICA DA RESPOSTA
                </label>
                <input
                  type="text"
                  value={q.explanation}
                  onChange={(e) => handleUpdateQuestion(qIdx, { explanation: e.target.value })}
                  className="w-full bg-[#0D1117] border border-[#263142] rounded-lg px-3 py-2 text-xs text-[#93C5FD] focus:outline-none focus:border-[#3B82F6]"
                  placeholder="Por que esta alternativa está correta..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
      )}

      {/* CENTRAL DE EXPORTAÇÃO E ENTREGÁVEIS DO QUIZ */}
      <div className="bg-[#0D1117] border border-[#1E293B] rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-[#60A5FA]">
          <FileCode className="w-5 h-5 text-[#60A5FA]" />
          <h3 className="text-sm font-bold text-white">
            Saídas e Entregáveis do Gerador de Quiz
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* PRD do Quiz */}
          <button
            type="button"
            onClick={() => setShowPrdModal(true)}
            className="flex flex-col items-start gap-1.5 p-3.5 bg-[#161E2E] hover:bg-[#1E293B] border border-[#263142] rounded-xl text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2 text-[#60A5FA] group-hover:text-white font-bold text-xs">
              <FileText className="w-4 h-4 text-[#60A5FA]" />
              <span>Gerar PRD do Quiz</span>
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              Documento completo de 20 seções especificando a lógica do Quiz.
            </p>
          </button>

          {/* Prompt do Quiz */}
          <button
            type="button"
            onClick={() => setShowPromptModal(true)}
            className="flex flex-col items-start gap-1.5 p-3.5 bg-[#161E2E] hover:bg-[#1E293B] border border-[#263142] rounded-xl text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2 text-[#A855F7] group-hover:text-white font-bold text-xs">
              <Sparkles className="w-4 h-4 text-[#A855F7]" />
              <span>Gerar Prompt do Quiz</span>
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              Prompt derivado do PRD para Lovable e Google AI Studio.
            </p>
          </button>

          {/* Copiar HTML */}
          <button
            type="button"
            onClick={handleCopyHtml}
            className="flex flex-col items-start gap-1.5 p-3.5 bg-[#161E2E] hover:bg-[#1E293B] border border-[#263142] rounded-xl text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2 text-[#38BDF8] group-hover:text-white font-bold text-xs">
              <Copy className="w-4 h-4 text-[#38BDF8]" />
              <span>Copiar HTML do Quiz</span>
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              Copia o código HTML5 estático com JS/CSS direto para a área de transferência.
            </p>
          </button>

          {/* Baixar HTML */}
          <button
            type="button"
            onClick={handleDownloadHtml}
            className="flex flex-col items-start gap-1.5 p-3.5 bg-[#161E2E] hover:bg-[#1E293B] border border-[#22C55E]/40 rounded-xl text-left transition-all cursor-pointer group bg-gradient-to-br from-[#162B20] to-[#0D1117]"
          >
            <div className="flex items-center gap-2 text-[#4ADE80] group-hover:text-white font-bold text-xs">
              <Download className="w-4 h-4 text-[#4ADE80]" />
              <span>Baixar HTML do Quiz</span>
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              Arquivo standalone quiz-{review.slug || 'produto'}.html pronto para hospedagem.
            </p>
          </button>
        </div>
      </div>

      {/* MODAL PREVIEW DO QUIZ INTERATIVO */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0D1117] border border-[#1E293B] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-0 relative animate-in zoom-in-95 duration-150">
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-4 border-b border-[#1E293B] bg-[#161E2E]">
              <div className="flex items-center gap-2 text-[#60A5FA]">
                <Eye className="w-4 h-4 text-[#22C55E]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Visualizar Quiz Interativo
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="text-[#94A3B8] hover:text-white p-1 rounded-lg hover:bg-[#1E293B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corpo do Quiz Preview */}
            <div className="p-6 space-y-5">
              {previewStep === 'start' && (
                <div className="text-center space-y-4">
                  <span className="inline-block px-3 py-1 bg-[#3B82F6]/15 border border-[#3B82F6]/30 text-[#60A5FA] text-[11px] font-extrabold uppercase rounded-full">
                    {quizConfig.type}
                  </span>
                  <h3 className="text-lg font-extrabold text-white">{quizConfig.title}</h3>
                  <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
                    {quizConfig.description}
                  </p>
                  <button
                    type="button"
                    onClick={handleStartPreview}
                    className="w-full bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white font-extrabold py-3.5 px-4 rounded-xl text-xs shadow-lg shadow-green-500/20 transition-all cursor-pointer"
                  >
                    INICIAR QUIZ AGORA
                  </button>
                </div>
              )}

              {previewStep === 'question' && (
                <div className="space-y-4">
                  <div className="flex justify-between text-[11px] font-semibold text-[#64748B]">
                    <span>
                      Pergunta {currentQIdx + 1} de {quizConfig.questions.length}
                    </span>
                    <span>
                      {Math.round(((currentQIdx + 1) / quizConfig.questions.length) * 100)}%
                    </span>
                  </div>

                  <div className="w-full h-2 bg-[#1E293B] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#3B82F6] to-[#22C55E] transition-all duration-300"
                      style={{
                        width: `${((currentQIdx + 1) / quizConfig.questions.length) * 100}%`
                      }}
                    />
                  </div>

                  <h4 className="text-sm font-bold text-white">
                    {quizConfig.questions[currentQIdx]?.question}
                  </h4>

                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((letter, optIdx) => {
                      const q = quizConfig.questions[currentQIdx];
                      const isSelected = selectedOptIdx === optIdx;
                      const isCorrect = q.correctAnswerIndex === optIdx;

                      let btnStyle = 'bg-[#161E2E] border-[#1E293B] text-[#CBD5E1] hover:border-[#3B82F6]';
                      if (hasAnswered) {
                        if (isCorrect) {
                          btnStyle = 'bg-[#22C55E]/15 border-[#22C55E] text-[#4ADE80] font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-[#EF4444]/15 border-[#EF4444] text-[#F87171] font-bold';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={hasAnswered}
                          onClick={() => handleSelectOptionPreview(optIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs flex items-center gap-3 transition-all cursor-pointer ${btnStyle}`}
                        >
                          <span className="w-6 h-6 rounded-md bg-[#0D1117] border border-[#334155] flex items-center justify-center font-bold text-[11px] shrink-0">
                            {letter}
                          </span>
                          <span>{q.options[optIdx]}</span>
                        </button>
                      );
                    })}
                  </div>

                  {hasAnswered && (
                    <div className="bg-[#0F172A] border-l-4 border-[#3B82F6] p-3 rounded-r-xl text-xs text-[#CBD5E1] space-y-1">
                      <span className="font-bold text-[#60A5FA]">Explicação: </span>
                      <span>{quizConfig.questions[currentQIdx]?.explanation}</span>
                    </div>
                  )}

                  {hasAnswered && (
                    <button
                      type="button"
                      onClick={handleNextQuestionPreview}
                      className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold py-3 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      {currentQIdx + 1 < quizConfig.questions.length ? 'PRÓXIMA PERGUNTA →' : 'VER DIAGNÓSTICO E RESULTADO'}
                    </button>
                  )}
                </div>
              )}

              {previewStep === 'result' && (
                <div className="text-center space-y-4">
                  <span className="inline-block px-3 py-1 bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#4ADE80] text-[11px] font-extrabold uppercase rounded-full">
                    DIAGNÓSTICO CONCLUÍDO
                  </span>
                  <div className="text-4xl font-black text-[#22C55E]">
                    {score} / {quizConfig.questions.length}
                  </div>
                  <p className="text-xs font-bold text-[#60A5FA]">
                    {Math.round((score / quizConfig.questions.length) * 100)}% de Aproveitamento
                  </p>
                  <p className="text-xs text-[#CBD5E1] max-w-md mx-auto">
                    {quizConfig.resultMessage}
                  </p>

                  <a
                    href={quizConfig.ctaUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white font-extrabold py-3.5 px-4 rounded-xl text-xs shadow-lg shadow-green-500/20 transition-all text-center no-underline"
                  >
                    {quizConfig.ctaText}
                  </a>

                  <button
                    type="button"
                    onClick={handleStartPreview}
                    className="text-xs text-[#64748B] hover:text-white underline bg-transparent border-none cursor-pointer"
                  >
                    Refazer Quiz
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL PRD DO QUIZ */}
      {showPrdModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0D1117] border border-[#1E293B] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-0 relative">
            <div className="flex items-center justify-between p-4 border-b border-[#1E293B] bg-[#161E2E]">
              <div className="flex items-center gap-2 text-[#60A5FA]">
                <FileText className="w-4 h-4 text-[#60A5FA]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  PRD do Quiz Interativo (20 Seções)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPrdModal(false)}
                className="text-[#94A3B8] hover:text-white p-1 rounded-lg hover:bg-[#1E293B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <pre className="bg-[#080B10] border border-[#1E293B] rounded-xl p-4 text-[11px] text-[#A1A1A1] font-mono overflow-x-auto max-h-[60vh] whitespace-pre-wrap leading-relaxed">
                {generatedPrd}
              </pre>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={async () => {
                    await safeCopyToClipboard(generatedPrd);
                    setActionToast({ message: 'PRD do Quiz copiado!', type: 'success' });
                  }}
                  className="flex items-center gap-1.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar PRD do Quiz</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PROMPT DO QUIZ */}
      {showPromptModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0D1117] border border-[#1E293B] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-0 relative">
            <div className="flex items-center justify-between p-4 border-b border-[#1E293B] bg-[#161E2E]">
              <div className="flex items-center gap-2 text-[#A855F7]">
                <Sparkles className="w-4 h-4 text-[#A855F7]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Prompt do Quiz para Lovable / Google AI Studio
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPromptModal(false)}
                className="text-[#94A3B8] hover:text-white p-1 rounded-lg hover:bg-[#1E293B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <pre className="bg-[#080B10] border border-[#1E293B] rounded-xl p-4 text-[11px] text-[#A1A1A1] font-mono overflow-x-auto max-h-[55vh] whitespace-pre-wrap leading-relaxed">
                {generatedPrompt}
              </pre>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={handleOpenLovable}
                  className="flex items-center gap-1.5 bg-[#A855F7] hover:bg-[#9333EA] text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Lovable</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenAiStudio}
                  className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google Studio IA</span>
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await safeCopyToClipboard(generatedPrompt);
                    setActionToast({ message: 'Prompt do Quiz copiado!', type: 'success' });
                  }}
                  className="flex items-center gap-1.5 bg-[#1E293B] hover:bg-[#2D3748] text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Prompt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 3. MODAL SELETOR DE TEMAS POR NICHO */}
      <QuizThemeSelectorModal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        quizConfig={quizConfig}
        review={review}
        onApplyTheme={(themeConfig: QuizThemeConfig) => {
          const updated = { ...quizConfig, theme: themeConfig };
          setQuizConfig(updated);
          if (onUpdateQuizConfig) onUpdateQuizConfig(updated);
          setActionToast({ message: 'Tema visual aplicado com sucesso ao Quiz!', type: 'success' });
        }}
      />
    </div>
  );
};
