import React, { useState, useEffect } from 'react';
import { fetchQuestions, fetchSettings, fetchProducts, fetchResults } from '../../services/salesQuizService';
import { QuizQuestion, QuizSettings, QuizResult, QuizProduct } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

export const SalesQuiz: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [settings, setSettings] = useState<QuizSettings | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ result: QuizResult; product: QuizProduct } | null>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const [q, s] = await Promise.all([fetchQuestions(), fetchSettings()]);
      setQuestions(q.filter(q => q.status === 'published'));
      setSettings(s);
      setLoading(false);
    };
    init();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleSelect = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionIndex }));
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      await calculateResult();
    }
  };

  const calculateResult = async () => {
    setIsAnalyzing(true);
    // 1. Fetch data
    const [allResults, allProducts] = await Promise.all([fetchResults(), fetchProducts()]);
    
    // 2. Logic: Sum scores and tags
    let totalScore = 0;
    const tagScores: Record<string, number> = {};
    
    Object.entries(answers).forEach(([qId, optIdx]) => {
      const q = questions.find(q => q.id === qId);
      const opt = q?.options[optIdx];
      if (opt) {
        totalScore += (opt.score || 0);
        opt.tags?.forEach(tag => {
          tagScores[tag] = (tagScores[tag] || 0) + (opt.score || 0);
        });
      }
    });

    // 3. Find best result (simplified rule: highest tag score)
    let bestTag = '';
    let maxTagScore = 0;
    Object.entries(tagScores).forEach(([tag, score]) => {
      if (score > maxTagScore) {
        maxTagScore = score;
        bestTag = tag;
      }
    });

    const bestResult = allResults.find(r => 
        r.tagsCondition.some(tc => tc.tag === bestTag && totalScore >= tc.minScore)
    ) || allResults[0];
    const product = allProducts.find(p => p.id === bestResult?.productId);

    if (bestResult && product) {
        setResult({ result: bestResult, product });
    }
    
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setResult(null);
    setIsStarted(false);
  };

  if (loading) return <div className="p-8 text-center text-white">Carregando...</div>;
  if (!settings || settings.status === 'inactive') return <div className="p-8 text-center text-white">Quiz temporariamente indisponível.</div>;
  if (questions.length === 0) return <div className="p-8 text-center text-white">Este quiz ainda está sendo preparado.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-12">
      <AnimatePresence mode="wait">
        {!isStarted ? (
          <motion.div 
            key="start"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-6"
          >
            <h1 className="text-3xl font-bold text-white">🎯 {settings.title}</h1>
            <p className="text-[#A1A1A1]">{settings.description}</p>
            <button 
              onClick={() => setIsStarted(true)}
              className="bg-[#F5C542] text-black font-black px-8 py-4 rounded-2xl hover:scale-105 transition-transform"
            >
              COMEÇAR QUIZ
            </button>
          </motion.div>
        ) : isAnalyzing ? (
            <motion.div key="analyzing" className="text-center text-white p-12">🎯 ANALISANDO SUAS RESPOSTAS...</motion.div>
        ) : result ? (
            <motion.div key="result" className="text-white space-y-6 text-center">
                <h2 className="text-2xl font-bold">{result.result.title}</h2>
                <img src={result.product.productImage} alt={result.product.productName} className="w-full rounded-2xl" loading="lazy" />
                <h3 className="text-xl font-bold">{result.product.productName}</h3>
                <p className="text-[#A1A1A1]">{result.result.description}</p>
                <div className="text-2xl font-black">{result.product.productPrice}</div>
                <a href={result.product.affiliateLink} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#22C55E] text-black font-black p-4 rounded-2xl">
                    {result.product.cta || 'VER OFERTA'}
                </a>
                <button onClick={handleReset} className="text-[#A1A1A1] underline">🔄 FAZER O QUIZ NOVAMENTE</button>
            </motion.div>
        ) : (
          <motion.div 
            key="quiz-body"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-[#A1A1A1]">
                <span>Pergunta {currentQuestionIndex + 1} de {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-[#222] rounded-full overflow-hidden">
                <motion.div className="h-full bg-[#F5C542]" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white">{currentQuestion.question}</h2>
            <div className="space-y-3">
              {currentQuestion.options.map((opt, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full p-4 rounded-xl text-left border transition-all ${
                    answers[currentQuestion.id] === idx 
                      ? 'bg-[#F5C542]/20 border-[#F5C542] text-[#F5C542]' 
                      : 'bg-[#121212] border-[#222] text-white hover:border-[#444]'
                  }`}
                >
                  {opt.text}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="flex-1 p-4 rounded-xl border border-[#222] text-[#A1A1A1] disabled:opacity-50"
              >
                VOLTAR
              </button>
              <button 
                onClick={handleNext}
                disabled={answers[currentQuestion.id] === undefined}
                className="flex-1 bg-[#F5C542] text-black font-black p-4 rounded-xl disabled:opacity-50"
              >
                {currentQuestionIndex === questions.length - 1 ? 'FINALIZAR' : 'CONTINUAR'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
