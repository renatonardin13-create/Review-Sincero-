import React, { useState, useEffect } from 'react';
import { QuizConfig, Review } from '../../types';
import { Monitor, Smartphone, Maximize2, RotateCcw, Check, ArrowRight, Clock, Star, ShieldCheck } from 'lucide-react';

interface QuizDiagnosticPreviewProps {
  quizConfig: QuizConfig;
  reviewData: Partial<Review>;
}

export const QuizDiagnosticPreview: React.FC<QuizDiagnosticPreviewProps> = ({
  quizConfig,
  reviewData
}) => {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');
  const [currentStep, setCurrentStep] = useState<'intro' | 'question' | 'processing' | 'lead' | 'result'>('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [selectedMultiIndices, setSelectedMultiIndices] = useState<number[]>([]);
  const [sliderVal, setSliderVal] = useState(5);
  const [processingProgress, setProcessingProgress] = useState(25);
  const [processingMsgIndex, setProcessingMsgIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(14 * 60 + 59);

  // Lead Form State
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');

  const questions = quizConfig.questions || [];
  const currentQ = questions[questionIndex];
  const totalQ = questions.length;

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format timer
  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleStartQuiz = () => {
    setCurrentStep('question');
    setQuestionIndex(0);
    setTotalScore(0);
    setSelectedMultiIndices([]);
  };

  const handleSingleSelect = (optionIndex: number) => {
    const scores = currentQ?.optionScores || [25, 20, 15, 10];
    const addScore = scores[optionIndex] ?? 15;
    setTotalScore((prev) => prev + addScore);
    nextQuestion();
  };

  const handleToggleMulti = (optIndex: number) => {
    if (selectedMultiIndices.includes(optIndex)) {
      setSelectedMultiIndices(selectedMultiIndices.filter((i) => i !== optIndex));
    } else {
      setSelectedMultiIndices([...selectedMultiIndices, optIndex]);
    }
  };

  const handleConfirmMulti = () => {
    const scores = currentQ?.optionScores || [10, 10, 10, 10];
    let add = 0;
    selectedMultiIndices.forEach((idx) => {
      add += scores[idx] ?? 10;
    });
    setTotalScore((prev) => prev + (add || 15));
    setSelectedMultiIndices([]);
    nextQuestion();
  };

  const handleConfirmSlider = () => {
    setTotalScore((prev) => prev + 20);
    nextQuestion();
  };

  const nextQuestion = () => {
    if (questionIndex + 1 < totalQ) {
      setQuestionIndex((prev) => prev + 1);
    } else {
      startProcessing();
    }
  };

  const startProcessing = () => {
    if (quizConfig.processingEnabled !== false) {
      setCurrentStep('processing');
      setProcessingProgress(25);
      setProcessingMsgIndex(0);

      const msgs = quizConfig.processingMessages || [
        'Analisando suas respostas...',
        'Identificando seu perfil de uso...',
        'Calculando grau de compatibilidade...',
        'Preparando seu diagnóstico final...'
      ];

      const interval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              if (quizConfig.leadCapture?.enabled !== false) {
                setCurrentStep('lead');
              } else {
                setCurrentStep('result');
              }
            }, 300);
            return 100;
          }
          return prev + 25;
        });

        setProcessingMsgIndex((prev) => (prev + 1 < msgs.length ? prev + 1 : prev));
      }, 600);
    } else if (quizConfig.leadCapture?.enabled !== false) {
      setCurrentStep('lead');
    } else {
      setCurrentStep('result');
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('result');
  };

  const handleReset = () => {
    setCurrentStep('intro');
    setQuestionIndex(0);
    setTotalScore(0);
  };

  // Resolve Profile based on score
  const profiles = quizConfig.resultProfiles || [];
  const matchedProfile =
    profiles.find((p) => totalScore >= p.minScore && totalScore <= p.maxScore) ||
    profiles[0] || {
      title: 'Diagnóstico de Compatibilidade',
      description: 'Seu perfil atende aos critérios recomendados para uso do produto.'
    };

  const themeBg = quizConfig.theme?.bgColor || '#F2F9F4';
  const themeCard = quizConfig.theme?.cardBgColor || '#FFFFFF';
  const themePrimary = quizConfig.theme?.primaryColor || '#16A34A';

  return (
    <div className="bg-[#0D1117] border border-[#1E293B] rounded-2xl p-6 space-y-4">
      {/* Top Header / Viewport Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F2937] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-sm font-extrabold text-white">Visualização Interativa do Quiz Diagnóstico</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Teste em tempo real como seu cliente navegará pelo funil mobile-first.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#161B22] p-1 rounded-xl border border-[#26354A]">
          <button
            type="button"
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              deviceMode === 'mobile'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile (390px)</span>
          </button>

          <button
            type="button"
            onClick={() => setDeviceMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              deviceMode === 'desktop'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            title="Reiniciar Quiz"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Simulator Container */}
      <div className="flex justify-center bg-[#070A0E] p-4 sm:p-8 rounded-2xl border border-[#161E2E] overflow-x-auto min-h-[520px]">
        <div
          style={{ backgroundColor: themeBg }}
          className={`transition-all duration-300 rounded-3xl border-4 border-[#1E293B] shadow-2xl overflow-hidden p-4 sm:p-6 text-[#133E2B] ${
            deviceMode === 'mobile' ? 'w-[390px] min-h-[580px]' : 'w-full max-w-[580px] min-h-[520px]'
          }`}
        >
          {/* STEP 1: INTRO */}
          {currentStep === 'intro' && (
            <div className="text-center space-y-5 my-auto py-6">
              <span className="inline-block px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-800 font-extrabold text-[10px] uppercase rounded-full tracking-wider">
                DIAGNÓSTICO OFICIAL DE PERFIL
              </span>

              <h2 className="text-xl font-extrabold text-[#133E2B] leading-tight">
                {quizConfig.introTitle || quizConfig.title}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed px-2">
                {quizConfig.introSubtitle || quizConfig.description}
              </p>

              <button
                type="button"
                onClick={handleStartQuiz}
                style={{ backgroundColor: themePrimary }}
                className="w-full py-4 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-600/30 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <span>{quizConfig.introCtaText || 'INICIAR DIAGNÓSTICO AGORA →'}</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium pt-2">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tempo estimado: 1 minuto</span>
              </div>
            </div>
          )}

          {/* STEP 2: QUESTIONS */}
          {currentStep === 'question' && currentQ && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                <span>Pergunta {questionIndex + 1} de {totalQ}</span>
                <span>{Math.round(((questionIndex + 1) / totalQ) * 100)}% Concluído</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${((questionIndex + 1) / totalQ) * 100}%` }}
                ></div>
              </div>

              <div style={{ backgroundColor: themeCard }} className="rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-[#133E2B] leading-snug">
                    {currentQ.question}
                  </h3>
                  {currentQ.description && (
                    <p className="text-xs text-slate-500 mt-1">{currentQ.description}</p>
                  )}
                </div>

                {/* Question Types Rendering */}
                {(!currentQ.type || currentQ.type === 'single-select') && (
                  <div className="space-y-2">
                    {(currentQ.options || []).map((opt, optIndex) => (
                      <button
                        key={optIndex}
                        type="button"
                        onClick={() => handleSingleSelect(optIndex)}
                        className="w-full text-left bg-white border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-xl p-3.5 text-xs font-semibold text-slate-800 transition-all cursor-pointer flex items-center justify-between active:scale-98"
                      >
                        <span>{opt}</span>
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400">
                          {String.fromCharCode(65 + optIndex)}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {currentQ.type === 'multi-select' && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      {(currentQ.options || []).map((opt, optIndex) => {
                        const isSelected = selectedMultiIndices.includes(optIndex);
                        return (
                          <button
                            key={optIndex}
                            type="button"
                            onClick={() => handleToggleMulti(optIndex)}
                            className={`w-full text-left border-2 rounded-xl p-3.5 text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                                : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                            }`}
                          >
                            <span>{opt}</span>
                            <div
                              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center text-[10px] font-bold ${
                                isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                              }`}
                            >
                              {isSelected ? '✓' : ''}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={handleConfirmMulti}
                      style={{ backgroundColor: themePrimary }}
                      className="w-full py-3 text-white font-extrabold text-xs rounded-xl shadow hover:opacity-90 transition-all cursor-pointer mt-3"
                    >
                      CONTINUAR →
                    </button>
                  </div>
                )}

                {(currentQ.type === 'slider' || currentQ.type === 'weight' || currentQ.type === 'height') && (
                  <div className="space-y-4 text-center py-2">
                    <div className="text-3xl font-black text-emerald-600">
                      {sliderVal} {currentQ.sliderUnit || (currentQ.type === 'weight' ? 'kg' : currentQ.type === 'height' ? 'cm' : '')}
                    </div>

                    <input
                      type="range"
                      min={currentQ.sliderMin || 1}
                      max={currentQ.sliderMax || 10}
                      step={currentQ.sliderStep || 1}
                      value={sliderVal}
                      onChange={(e) => setSliderVal(parseInt(e.target.value) || 1)}
                      className="w-full h-2 bg-slate-200 rounded-lg accent-emerald-600 cursor-pointer"
                    />

                    <button
                      type="button"
                      onClick={handleConfirmSlider}
                      style={{ backgroundColor: themePrimary }}
                      className="w-full py-3 text-white font-extrabold text-xs rounded-xl shadow hover:opacity-90 transition-all cursor-pointer"
                    >
                      CONFIRMAR VALOR →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: PROCESSING */}
          {currentStep === 'processing' && (
            <div style={{ backgroundColor: themeCard }} className="rounded-2xl p-6 border border-slate-200 shadow-sm text-center my-auto space-y-4">
              <h3 className="text-base font-extrabold text-[#133E2B]">ANALISANDO SEU DIAGNÓSTICO</h3>

              <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin mx-auto my-4"></div>

              <p className="text-xs font-extrabold text-emerald-600 min-h-[20px]">
                {(quizConfig.processingMessages || [
                  'Analisando suas respostas...',
                  'Identificando seu perfil de uso...',
                  'Calculando grau de compatibilidade...',
                  'Preparando seu diagnóstico final...'
                ])[processingMsgIndex]}
              </p>

              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 transition-all duration-300" style={{ width: `${processingProgress}%` }}></div>
              </div>
            </div>
          )}

          {/* STEP 4: LEAD CAPTURE */}
          {currentStep === 'lead' && (
            <div style={{ backgroundColor: themeCard }} className="rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 my-auto">
              <div className="text-center">
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 font-extrabold text-[10px] uppercase rounded-full">
                  QUASE PRONTO!
                </span>
                <h3 className="text-base font-extrabold text-[#133E2B] mt-2">
                  {quizConfig.leadCapture?.title || 'Onde devemos enviar seu diagnóstico?'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Preencha para liberar seu resultado completo e cupom:</p>
              </div>

              <form onSubmit={handleLeadSubmit} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Seu Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="Digite seu nome..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Seu Melhor E-mail</label>
                  <input
                    type="email"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <button
                  type="submit"
                  style={{ backgroundColor: themePrimary }}
                  className="w-full py-3.5 text-white font-extrabold text-xs rounded-xl shadow-lg hover:opacity-95 transition-all cursor-pointer mt-2"
                >
                  {quizConfig.leadCapture?.buttonText || 'LIBERAR MEU DIAGNÓSTICO AGORA →'}
                </button>
              </form>
            </div>
          )}

          {/* STEP 5: RESULT + OFFER */}
          {currentStep === 'result' && (
            <div className="space-y-4">
              {/* Profile Card */}
              <div style={{ backgroundColor: themeCard }} className="rounded-2xl p-5 border border-slate-200 shadow-sm text-center space-y-2">
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] uppercase rounded-full">
                  DIAGNÓSTICO CONCLUÍDO
                </span>
                <h3 className="text-lg font-black text-[#133E2B]">
                  {matchedProfile.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {matchedProfile.description}
                </p>
              </div>

              {/* Offer Card */}
              <div className="bg-gradient-to-b from-white to-emerald-50/80 border-2 border-emerald-500 rounded-2xl p-5 text-center space-y-3 shadow-md">
                <div className="inline-flex items-center gap-1.5 bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-extrabold px-3 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Oferta Válida por {formatTimer(timerSeconds)} min</span>
                </div>

                <div>
                  <h4 className="text-base font-black text-[#133E2B]">
                    {quizConfig.offerConfig?.title || `Oferta Oficial do ${reviewData.productName || 'Produto'}`}
                  </h4>
                  <div className="text-2xl font-black text-emerald-600 mt-1">
                    {reviewData.currentPrice ? `R$ ${reviewData.currentPrice}` : 'Preço Promocional'}
                  </div>
                </div>

                <div className="text-left space-y-1.5 text-xs text-slate-700 py-1">
                  {(reviewData.features || ['Produto 100% Original', 'Garantia de Satisfação']).slice(0, 3).map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={quizConfig.ctaUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ backgroundColor: themePrimary }}
                  className="w-full py-4 text-white font-black text-xs rounded-xl shadow-lg hover:opacity-95 transition-all block text-center uppercase"
                >
                  {quizConfig.ctaText}
                </a>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Garantia de {quizConfig.offerConfig?.guaranteeDays || 30} dias • Compra Segura</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
