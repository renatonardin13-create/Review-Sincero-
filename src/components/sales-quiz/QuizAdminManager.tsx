import React, { useState, useEffect } from 'react';
import { AuthUser, QuizQuestion, QuizProduct, QuizResult, QuizSettings } from '../../types';
import { fetchQuestions, fetchProducts, fetchResults, fetchSettings } from '../../services/salesQuizService';
import { PlusCircle, Target, Trophy, Settings as SettingsIcon, LayoutTemplate } from 'lucide-react';
import { FunnelDashboard } from '../sales-funnel/FunnelDashboard';

interface QuizAdminManagerProps {
  currentUser: AuthUser;
}

export const QuizAdminManager: React.FC<QuizAdminManagerProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'perguntas' | 'resultados' | 'produtos' | 'config' | 'funis'>('perguntas');
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [products, setProducts] = useState<QuizProduct[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [settings, setSettings] = useState<QuizSettings | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [q, p, r, s] = await Promise.all([fetchQuestions(), fetchProducts(), fetchResults(), fetchSettings()]);
      setQuestions(q);
      setProducts(p);
      setResults(r);
      setSettings(s);
      setLoading(false);
    };
    loadData();
  }, []);

  const tabs = [
    { id: 'perguntas', label: 'Perguntas', icon: Target },
    { id: 'resultados', label: 'Resultados', icon: Trophy },
    { id: 'produtos', label: 'Produtos', icon: Trophy },
    { id: 'config', label: 'Configurações', icon: SettingsIcon },
    { id: 'funis', label: 'Funis', icon: LayoutTemplate },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'funis':
        return <FunnelDashboard />;
      case 'perguntas':
        return (
          <div className="space-y-4">
            <button className="flex items-center gap-2 bg-[#F5C542] text-black px-4 py-2 rounded-xl text-xs font-bold">
              <PlusCircle className="w-4 h-4" /> Nova Pergunta
            </button>
            {questions.map((q: any) => (
              <div key={q.id} className="p-4 bg-[#181818] border border-[#282828] rounded-xl text-xs text-white">
                {q.question}
              </div>
            ))}
          </div>
        );
      default:
        return <p className="text-xs text-[#8E8E8E]">Interface administrativa para {activeTab} em desenvolvimento.</p>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-[#181818] border border-[#282828] rounded-xl overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === tab.id ? 'bg-[#F5C542] text-black' : 'text-[#A1A1A1] hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-[#121212] border border-[#222] rounded-3xl p-6 min-h-[400px]">
        {loading ? (
          <p className="text-sm text-[#8E8E8E]">Carregando dados...</p>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
};
