import React, { useState } from 'react';
import { QuizConfig, QuizQuestion, QuizResultProfile, QuizQuestionType } from '../../types';
import {
  QUIZ_NICHE_THEMES,
  QuizNicheTheme,
  themePresetToConfig
} from '../../utils/quizThemePresets';
import {
  Plus,
  Trash2,
  Copy,
  Sliders,
  Settings,
  Users,
  Tag,
  Palette,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ListFilter
} from 'lucide-react';

interface QuizDiagnosticEditorProps {
  quizConfig: QuizConfig;
  onChange: (updated: QuizConfig) => void;
  onGenerateAI: () => void;
  isGeneratingAI: boolean;
}

export const QuizDiagnosticEditor: React.FC<QuizDiagnosticEditorProps> = ({
  quizConfig,
  onChange,
  onGenerateAI,
  isGeneratingAI
}) => {
  const [activeTab, setActiveTab] = useState<'questions' | 'intro' | 'processing' | 'results' | 'lead' | 'offer' | 'theme'>('questions');

  // Handle question fields change
  const handleUpdateQuestion = (index: number, updatedField: Partial<QuizQuestion>) => {
    const updatedQuestions = [...quizConfig.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      ...updatedField
    };
    onChange({
      ...quizConfig,
      questions: updatedQuestions
    });
  };

  // Add question
  const handleAddQuestion = () => {
    const newQ: QuizQuestion = {
      id: 'diag-q-' + Date.now(),
      question: 'Nova pergunta do diagnóstico?',
      description: 'Selecione uma opção:',
      type: 'single-select',
      options: ['Opção A', 'Opção B', 'Opção C', 'Opção D'],
      correctAnswerIndex: 0,
      explanation: 'Explicação pedagógica da opção recomendada.',
      optionScores: [25, 20, 15, 10]
    };
    onChange({
      ...quizConfig,
      questions: [...quizConfig.questions, newQ]
    });
  };

  // Duplicate question
  const handleDuplicateQuestion = (index: number) => {
    const q = quizConfig.questions[index];
    const duplicated: QuizQuestion = {
      ...q,
      id: 'diag-q-' + Date.now(),
      question: `${q.question} (Cópia)`
    };
    const updated = [...quizConfig.questions];
    updated.splice(index + 1, 0, duplicated);
    onChange({
      ...quizConfig,
      questions: updated
    });
  };

  // Delete question
  const handleDeleteQuestion = (index: number) => {
    if (quizConfig.questions.length <= 1) return;
    const updated = quizConfig.questions.filter((_, i) => i !== index);
    onChange({
      ...quizConfig,
      questions: updated
    });
  };

  // Handle Profile Update
  const handleUpdateProfile = (pIndex: number, field: Partial<QuizResultProfile>) => {
    const profiles = quizConfig.resultProfiles ? [...quizConfig.resultProfiles] : [];
    if (profiles[pIndex]) {
      profiles[pIndex] = { ...profiles[pIndex], ...field };
      onChange({
        ...quizConfig,
        resultProfiles: profiles
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tabs for Customizing Diagnostic Components */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#1F2937] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'questions'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-[#0D1117] text-slate-400 hover:text-white hover:bg-[#161B22]'
          }`}
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span>Perguntas ({quizConfig.questions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('intro')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'intro'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-[#0D1117] text-slate-400 hover:text-white hover:bg-[#161B22]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Introdução</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('processing')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'processing'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-[#0D1117] text-slate-400 hover:text-white hover:bg-[#161B22]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Tela de Processamento</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('results')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'results'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-[#0D1117] text-slate-400 hover:text-white hover:bg-[#161B22]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Perfis de Diagnóstico</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('lead')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'lead'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-[#0D1117] text-slate-400 hover:text-white hover:bg-[#161B22]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Captura de Lead</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('offer')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'offer'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-[#0D1117] text-slate-400 hover:text-white hover:bg-[#161B22]'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Oferta & Cronômetro</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('theme')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'theme'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-[#0D1117] text-slate-400 hover:text-white hover:bg-[#161B22]'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Personalizar Cores</span>
        </button>
      </div>

      {/* TAB 1: PERGUNTAS */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D1117] border border-[#1E293B] p-4 rounded-xl">
            <div>
              <h3 className="text-sm font-extrabold text-white">Perguntas do Diagnóstico</h3>
              <p className="text-xs text-slate-400">
                Configure os tipos de pergunta (Seleção Única, Múltipla, Slider, Peso, Altura) e pontuação de cada alternativa.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onGenerateAI}
                disabled={isGeneratingAI}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGeneratingAI ? 'Gerando...' : '🪄 Re-gerar com IA'}</span>
              </button>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Pergunta</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {quizConfig.questions.map((q, qIndex) => (
              <div
                key={q.id || `q-${qIndex}`}
                className="bg-[#0D1117] border border-[#1E293B] hover:border-slate-700 rounded-2xl p-5 space-y-4 transition-all"
              >
                <div className="flex items-center justify-between gap-2 border-b border-[#1F2937] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black flex items-center justify-center">
                      {qIndex + 1}
                    </span>
                    <span className="text-xs font-extrabold text-white">
                      Pergunta {qIndex + 1}
                    </span>
                  </div>

                  {/* Type selector */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-[#161B22] border border-[#26354A] px-2.5 py-1 rounded-lg">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Tipo:</span>
                      <select
                        value={q.type || 'single-select'}
                        onChange={(e) =>
                          handleUpdateQuestion(qIndex, {
                            type: e.target.value as QuizQuestionType
                          })
                        }
                        className="bg-transparent text-xs font-bold text-emerald-400 focus:outline-none cursor-pointer"
                      >
                        <option value="single-select" className="bg-[#0D1117] text-white">Seleção Única</option>
                        <option value="multi-select" className="bg-[#0D1117] text-white">Múltipla Seleção</option>
                        <option value="slider" className="bg-[#0D1117] text-white">Slider / Ajuste</option>
                        <option value="weight" className="bg-[#0D1117] text-white">Peso (kg)</option>
                        <option value="height" className="bg-[#0D1117] text-white">Altura (cm)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleDuplicateQuestion(qIndex)}
                        title="Duplicar Pergunta"
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-all cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {quizConfig.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(qIndex)}
                          title="Excluir Pergunta"
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Question Input & Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                      Enunciado da Pergunta
                    </label>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => handleUpdateQuestion(qIndex, { question: e.target.value })}
                      className="w-full bg-[#161B22] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                      Subtítulo / Instrução Opcional
                    </label>
                    <input
                      type="text"
                      value={q.description || ''}
                      onChange={(e) => handleUpdateQuestion(qIndex, { description: e.target.value })}
                      placeholder="Ex: Selecione a opção que melhor descreve..."
                      className="w-full bg-[#161B22] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Options List */}
                {(!q.type || q.type === 'single-select' || q.type === 'multi-select') && (
                  <div className="space-y-2 pt-2">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase">
                      Opções de Resposta e Pontuação
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {(q.options || []).map((opt, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2 bg-[#161B22] p-2 rounded-xl border border-[#1F2937]">
                          <span className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 font-extrabold text-[11px] flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...q.options];
                              newOpts[optIndex] = e.target.value;
                              handleUpdateQuestion(qIndex, { options: newOpts });
                            }}
                            className="flex-1 bg-transparent border-0 text-xs text-white focus:outline-none"
                          />
                          <div className="flex items-center gap-1 bg-[#0D1117] px-2 py-1 rounded-lg border border-[#26354A] shrink-0">
                            <span className="text-[10px] text-slate-400 font-bold">Pontos:</span>
                            <input
                              type="number"
                              value={q.optionScores?.[optIndex] ?? (optIndex === 0 ? 25 : 15)}
                              onChange={(e) => {
                                const newScores = q.optionScores ? [...q.optionScores] : [25, 20, 15, 10];
                                newScores[optIndex] = parseInt(e.target.value) || 0;
                                handleUpdateQuestion(qIndex, { optionScores: newScores });
                              }}
                              className="w-12 bg-transparent text-xs text-emerald-400 font-bold text-center focus:outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Slider settings */}
                {(q.type === 'slider' || q.type === 'weight' || q.type === 'height') && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#161B22] p-3 rounded-xl border border-[#1F2937]">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Mínimo</label>
                      <input
                        type="number"
                        value={q.sliderMin ?? 1}
                        onChange={(e) => handleUpdateQuestion(qIndex, { sliderMin: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#0D1117] border border-[#26354A] rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Máximo</label>
                      <input
                        type="number"
                        value={q.sliderMax ?? 10}
                        onChange={(e) => handleUpdateQuestion(qIndex, { sliderMax: parseInt(e.target.value) || 100 })}
                        className="w-full bg-[#0D1117] border border-[#26354A] rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Passo (Step)</label>
                      <input
                        type="number"
                        value={q.sliderStep ?? 1}
                        onChange={(e) => handleUpdateQuestion(qIndex, { sliderStep: parseInt(e.target.value) || 1 })}
                        className="w-full bg-[#0D1117] border border-[#26354A] rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Unidade</label>
                      <input
                        type="text"
                        value={q.sliderUnit ?? (q.type === 'weight' ? 'kg' : q.type === 'height' ? 'cm' : '')}
                        onChange={(e) => handleUpdateQuestion(qIndex, { sliderUnit: e.target.value })}
                        placeholder="ex: kg, cm"
                        className="w-full bg-[#0D1117] border border-[#26354A] rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TELA DE INTRODUÇÃO */}
      {activeTab === 'intro' && (
        <div className="bg-[#0D1117] border border-[#1E293B] p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-extrabold text-white">Configuração da Tela de Introdução</h3>
          <p className="text-xs text-slate-400">
            Personalize o cabeçalho, os títulos e a chamada inicial do seu Quiz Diagnóstico.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Título Principal da Intro</label>
              <input
                type="text"
                value={quizConfig.introTitle || quizConfig.title}
                onChange={(e) => onChange({ ...quizConfig, introTitle: e.target.value })}
                className="w-full bg-[#161B22] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Subtítulo Explicativo</label>
              <textarea
                value={quizConfig.introSubtitle || quizConfig.description}
                onChange={(e) => onChange({ ...quizConfig, introSubtitle: e.target.value })}
                rows={2}
                className="w-full bg-[#161B22] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Texto do Botão Inicial</label>
              <input
                type="text"
                value={quizConfig.introCtaText || 'INICIAR DIAGNÓSTICO AGORA →'}
                onChange={(e) => onChange({ ...quizConfig, introCtaText: e.target.value })}
                className="w-full bg-[#161B22] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TELA DE PROCESSAMENTO */}
      {activeTab === 'processing' && (
        <div className="bg-[#0D1117] border border-[#1E293B] p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-white">Tela Intermediária de Processamento</h3>
              <p className="text-xs text-slate-400">
                Aumenta a percepção de valor com uma animação simulando a análise do perfil antes de exibir o resultado.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={quizConfig.processingEnabled ?? true}
                onChange={(e) => onChange({ ...quizConfig, processingEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {(quizConfig.processingEnabled ?? true) && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Duração da Animação (Milissegundos)</label>
                <input
                  type="number"
                  value={quizConfig.processingTimeMs ?? 2500}
                  onChange={(e) => onChange({ ...quizConfig, processingTimeMs: parseInt(e.target.value) || 2000 })}
                  className="w-full bg-[#161B22] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Mensagens Sequenciais
                </label>
                <p className="text-[11px] text-slate-500 mb-2">Uma frase por linha:</p>
                <textarea
                  value={(quizConfig.processingMessages || [
                    'Analisando suas respostas...',
                    'Identificando seu perfil de uso...',
                    'Calculando grau de compatibilidade...',
                    'Preparando seu diagnóstico final...'
                  ]).join('\n')}
                  onChange={(e) =>
                    onChange({
                      ...quizConfig,
                      processingMessages: e.target.value.split('\n').filter((m) => m.trim())
                    })
                  }
                  rows={4}
                  className="w-full bg-[#161B22] border border-[#1F2937] rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PERFIS DE DIAGNÓSTICO */}
      {activeTab === 'results' && (
        <div className="bg-[#0D1117] border border-[#1E293B] p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-extrabold text-white">Perfis de Diagnóstico por Pontuação</h3>
          <p className="text-xs text-slate-400">
            Define quais títulos, textos e chamadas serão exibidos de acordo com a faixa de pontos acumulada pelo usuário.
          </p>

          <div className="space-y-4">
            {(quizConfig.resultProfiles || []).map((prof, pIndex) => (
              <div key={prof.id || pIndex} className="bg-[#161B22] border border-[#1F2937] p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-[#1F2937] pb-2">
                  <span className="text-xs font-black text-emerald-400">Perfil {pIndex + 1}</span>
                  <div className="flex items-center gap-2 bg-[#0D1117] px-2 py-1 rounded-lg border border-[#26354A]">
                    <span className="text-[10px] text-slate-400 font-bold">Faixa de Pontos:</span>
                    <input
                      type="number"
                      value={prof.minScore}
                      onChange={(e) => handleUpdateProfile(pIndex, { minScore: parseInt(e.target.value) || 0 })}
                      className="w-10 bg-transparent text-xs text-white font-bold text-center"
                    />
                    <span className="text-xs text-slate-500">até</span>
                    <input
                      type="number"
                      value={prof.maxScore}
                      onChange={(e) => handleUpdateProfile(pIndex, { maxScore: parseInt(e.target.value) || 100 })}
                      className="w-10 bg-transparent text-xs text-white font-bold text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Título do Perfil</label>
                  <input
                    type="text"
                    value={prof.title}
                    onChange={(e) => handleUpdateProfile(pIndex, { title: e.target.value })}
                    className="w-full bg-[#0D1117] border border-[#26354A] rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Descrição Explicativa do Diagnóstico</label>
                  <textarea
                    value={prof.description}
                    onChange={(e) => handleUpdateProfile(pIndex, { description: e.target.value })}
                    rows={2}
                    className="w-full bg-[#0D1117] border border-[#26354A] rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CAPTURA DE LEAD */}
      {activeTab === 'lead' && (
        <div className="bg-[#0D1117] border border-[#1E293B] p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-white">Etapa de Captura de Lead</h3>
              <p className="text-xs text-slate-400">
                Coleta Nome, E-mail e WhatsApp antes da exibição do resultado e cupom de oferta.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={quizConfig.leadCapture?.enabled ?? true}
                onChange={(e) =>
                  onChange({
                    ...quizConfig,
                    leadCapture: {
                      ...(quizConfig.leadCapture || {
                        enabled: true,
                        fields: { name: true, email: true, phone: true }
                      }),
                      enabled: e.target.checked
                    }
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {(quizConfig.leadCapture?.enabled ?? true) && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Título do Formulário</label>
                <input
                  type="text"
                  value={quizConfig.leadCapture?.title || 'Onde devemos enviar seu diagnóstico?'}
                  onChange={(e) =>
                    onChange({
                      ...quizConfig,
                      leadCapture: {
                        ...(quizConfig.leadCapture || { enabled: true, fields: { name: true, email: true, phone: true } }),
                        title: e.target.value
                      }
                    })
                  }
                  className="w-full bg-[#161B22] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Texto do Botão de Envio</label>
                <input
                  type="text"
                  value={quizConfig.leadCapture?.buttonText || 'LIBERAR MEU DIAGNÓSTICO AGORA →'}
                  onChange={(e) =>
                    onChange({
                      ...quizConfig,
                      leadCapture: {
                        ...(quizConfig.leadCapture || { enabled: true, fields: { name: true, email: true, phone: true } }),
                        buttonText: e.target.value
                      }
                    })
                  }
                  className="w-full bg-[#161B22] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: OFERTA & CRONÔMETRO */}
      {activeTab === 'offer' && (
        <div className="bg-[#0D1117] border border-[#1E293B] p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-extrabold text-white">Configuração da Oferta Final</h3>
          <p className="text-xs text-slate-400">
            Personalize o preço, prazos de garantia e botão de compra exibido após o resultado do Quiz.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Título do Card da Oferta</label>
              <input
                type="text"
                value={quizConfig.offerConfig?.title || 'Oferta Oficial do Produto'}
                onChange={(e) =>
                  onChange({
                    ...quizConfig,
                    offerConfig: {
                      ...(quizConfig.offerConfig || {}),
                      title: e.target.value
                    }
                  })
                }
                className="w-full bg-[#161B22] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Texto do Botão CTA</label>
              <input
                type="text"
                value={quizConfig.ctaText}
                onChange={(e) => onChange({ ...quizConfig, ctaText: e.target.value })}
                className="w-full bg-[#161B22] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">URL de Destino do CTA</label>
              <input
                type="text"
                value={quizConfig.ctaUrl}
                onChange={(e) => onChange({ ...quizConfig, ctaUrl: e.target.value })}
                className="w-full bg-[#161B22] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Garantia (Dias)</label>
              <input
                type="number"
                value={quizConfig.offerConfig?.guaranteeDays || 30}
                onChange={(e) =>
                  onChange({
                    ...quizConfig,
                    offerConfig: {
                      ...(quizConfig.offerConfig || {}),
                      guaranteeDays: parseInt(e.target.value) || 30
                    }
                  })
                }
                className="w-full bg-[#161B22] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: THEME COLORS & NICHE PRESETS */}
      {activeTab === 'theme' && (
        <div className="bg-[#0D1117] border border-[#1E293B] p-5 md:p-6 rounded-2xl space-y-6">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#F5C542]" />
              <span>Temas Visuais de Quiz por Nicho (12+ Opções)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Selecione o tema ideal para a categoria do seu produto ou personalize as cores manualmente:
            </p>
          </div>

          {/* Grid of Niche Themes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {QUIZ_NICHE_THEMES.map((preset) => {
              const isSelected =
                quizConfig.theme?.primaryColor?.toLowerCase() === preset.primaryColor.toLowerCase();

              return (
                <div
                  key={preset.id}
                  onClick={() => {
                    const themeConfig = themePresetToConfig(preset);
                    onChange({
                      ...quizConfig,
                      theme: themeConfig
                    });
                  }}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all flex flex-col justify-between space-y-2.5 ${
                    isSelected
                      ? 'border-[#F5C542] bg-[#1A1811] shadow-lg shadow-[#F5C542]/10 ring-1 ring-[#F5C542]'
                      : 'border-[#1E293B] bg-[#111622] hover:border-slate-600 hover:bg-[#161D2B]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1C2433] text-white">
                      {preset.badge}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-extrabold text-[#F5C542]">✓ Ativo</span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-white">{preset.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      {preset.description}
                    </p>
                  </div>

                  {/* Sample button */}
                  <div
                    className="p-2 rounded-lg font-bold text-[11px] text-center border text-white transition-transform"
                    style={{
                      backgroundColor: preset.primaryColor,
                      borderColor: preset.secondaryColor
                    }}
                  >
                    CORES DO NICHO
                  </div>
                </div>
              );
            })}
          </div>

          {/* Manual Color Adjustments */}
          <div className="pt-4 border-t border-[#1E293B] space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Ajuste Manual de Cores</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Cor Principal (CTA/Highlight)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={quizConfig.theme?.primaryColor || '#16A34A'}
                    onChange={(e) =>
                      onChange({
                        ...quizConfig,
                        theme: { ...(quizConfig.theme || {}), primaryColor: e.target.value }
                      })
                    }
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={quizConfig.theme?.primaryColor || '#16A34A'}
                    onChange={(e) =>
                      onChange({
                        ...quizConfig,
                        theme: { ...(quizConfig.theme || {}), primaryColor: e.target.value }
                      })
                    }
                    className="w-full bg-[#161B22] border border-[#1F2937] rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Cor de Fundo do Canvas</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={quizConfig.theme?.bgColor || '#0D1117'}
                    onChange={(e) =>
                      onChange({
                        ...quizConfig,
                        theme: { ...(quizConfig.theme || {}), bgColor: e.target.value }
                      })
                    }
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={quizConfig.theme?.bgColor || '#0D1117'}
                    onChange={(e) =>
                      onChange({
                        ...quizConfig,
                        theme: { ...(quizConfig.theme || {}), bgColor: e.target.value }
                      })
                    }
                    className="w-full bg-[#161B22] border border-[#1F2937] rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Cor do Card do Conteúdo</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={quizConfig.theme?.cardBgColor || '#FFFFFF'}
                    onChange={(e) =>
                      onChange({
                        ...quizConfig,
                        theme: { ...(quizConfig.theme || {}), cardBgColor: e.target.value }
                      })
                    }
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={quizConfig.theme?.cardBgColor || '#FFFFFF'}
                    onChange={(e) =>
                      onChange({
                        ...quizConfig,
                        theme: { ...(quizConfig.theme || {}), cardBgColor: e.target.value }
                      })
                    }
                    className="w-full bg-[#161B22] border border-[#1F2937] rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
