import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, FileText, CheckCircle2, ShoppingBag, Globe, X } from 'lucide-react';

interface ActivityItem {
  id: string;
  name: string;
  city: string;
  action: string;
  product: string;
  type: 'review' | 'quiz' | 'html' | 'search';
  timeAgo: string;
}

const CITIES = [
  'São Paulo, SP',
  'Rio de Janeiro, RJ',
  'Belo Horizonte, MG',
  'Curitiba, PR',
  'Porto Alegre, RS',
  'Florianópolis, SC',
  'Salvador, BA',
  'Recife, PE',
  'Fortaleza, CE',
  'Brasília, DF',
  'Goiânia, GO',
  'Campinas, SP',
  'Niterói, RJ',
  'Uberlândia, MG'
];

const NAMES = [
  'Lucas S.',
  'Matheus M.',
  'Juliana R.',
  'Beatriz K.',
  'Gabriel P.',
  'Amanda T.',
  'Felipe H.',
  'Mariana C.',
  'Rafael O.',
  'Fernanda L.',
  'Carlos E.',
  'Camila G.',
  'Rodrigo F.',
  'Jéssica V.',
  'Vinicius A.'
];

const PRODUCTS = [
  'Air Fryer Digital 4L',
  'Creatina Monohidratada 300g',
  'Smartwatch AMOLED Ultra',
  'Escova Secadora Modeladora',
  'Fone Bluetooth TWS Noise Cancelling',
  'Robô Aspirador Inteligente',
  'Sérum Facial Vitamina C',
  'Tênis Esportivo Ultra Light',
  'Kit Panelas Antiaderente Ceramic',
  'Protetor Solar Facial FPS 70'
];

const ACTIONS = [
  { action: 'acabou de gerar uma Review com IA', type: 'review' as const },
  { action: 'gerou um Quiz Diagnóstico de Vendas', type: 'quiz' as const },
  { action: 'exportou o código HTML do produto', type: 'html' as const },
  { action: 'criou um Quiz Clássico do Produto', type: 'quiz' as const },
  { action: 'analisou tendências do Mercado Livre', type: 'search' as const },
  { action: 'gerou um Review de Alta Conversão', type: 'review' as const },
  { action: 'baixou a página de Review otimizada', type: 'html' as const }
];

export const LiveUserActivityToast: React.FC = () => {
  const [currentActivity, setCurrentActivity] = useState<ActivityItem | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const generateNewActivity = () => {
      const name = NAMES[Math.floor(Math.random() * NAMES.length)];
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];
      const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      const actObj = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];

      const item: ActivityItem = {
        id: 'act_' + Date.now(),
        name,
        city,
        action: actObj.action,
        product,
        type: actObj.type,
        timeAgo: 'agora mesmo'
      };

      setCurrentActivity(item);
      setVisible(true);

      // Hide toast after 5.5 seconds
      setTimeout(() => {
        setVisible(false);
      }, 5500);
    };

    // First activity appears after 4 seconds
    const initialTimer = setTimeout(generateNewActivity, 4000);

    // Subsequent activities every 14 to 22 seconds
    const interval = setInterval(() => {
      generateNewActivity();
    }, 18000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [dismissed]);

  if (!currentActivity || dismissed) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'review':
        return <FileText className="w-4 h-4 text-[#F5C542]" />;
      case 'quiz':
        return <Zap className="w-4 h-4 text-emerald-400" />;
      case 'html':
        return <Globe className="w-4 h-4 text-sky-400" />;
      default:
        return <ShoppingBag className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div
      className={`fixed bottom-5 left-5 z-40 max-w-sm w-full transition-all duration-500 transform ${
        visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-6 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="relative overflow-hidden rounded-2xl bg-[#141414]/95 backdrop-blur-md border border-[#2A2A2A] p-3.5 shadow-2xl shadow-black/80 flex items-start gap-3 group">
        {/* Decorative subtle ambient glow */}
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-[#F5C542]/10 rounded-full blur-xl pointer-events-none" />

        {/* Icon Container */}
        <div className="p-2.5 rounded-xl bg-[#1C1C1C] border border-[#2A2A2A] shrink-0 mt-0.5">
          {getTypeIcon(currentActivity.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-1.5 text-xs text-white">
            <span className="font-bold text-white truncate">{currentActivity.name}</span>
            <span className="text-[10px] text-[#A1A1A1]">({currentActivity.city})</span>
          </div>

          <p className="text-xs text-[#CCCCCC] mt-0.5 leading-snug">
            {currentActivity.action} <span className="font-semibold text-white">"{currentActivity.product}"</span>
          </p>

          <div className="mt-1.5 flex items-center gap-2 text-[10px] text-[#A1A1A1]">
            <span className="flex items-center gap-1 text-[#22C55E] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping" />
              {currentActivity.timeAgo}
            </span>
            <span>•</span>
            <span className="text-[#A1A1A1]">Sincronizado ao vivo</span>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => setDismissed(true)}
          className="text-[#888888] hover:text-white transition-colors p-1 rounded-lg hover:bg-[#222222] shrink-0"
          title="Fechar notificações"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
