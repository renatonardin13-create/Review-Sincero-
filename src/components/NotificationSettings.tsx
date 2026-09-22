import React from 'react';
import { Bell, Sliders, ShieldCheck, Clock, Layers, Sparkles } from 'lucide-react';
import { ReviewNotificationConfig } from '../types';

interface NotificationSettingsProps {
  config: ReviewNotificationConfig;
  onChange: (updated: ReviewNotificationConfig) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  config,
  onChange
}) => {
  return (
    <div className="bg-[#121214] border border-[#27272a] rounded-3xl p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-[#27272a]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F5C542]/10 border border-[#F5C542]/20 flex items-center justify-center text-[#F5C542]">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Automação de Notificações da Review</h3>
            <p className="text-xs text-[#A1A1A1]">Configure os avisos de promoção ou compras confirmadas para os leitores</p>
          </div>
        </div>

        {/* Toggle Enabled */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => onChange({ ...config, enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-[#27272a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F5C542]" />
        </label>
      </div>

      {config.enabled && (
        <div className="space-y-6 animate-in fade-in">
          {/* Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              Modo de Notificação *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => onChange({ ...config, mode: 'product_promotion' })}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  config.mode === 'product_promotion'
                    ? 'bg-[#1C1809] border-[#F5C542] text-white shadow-md'
                    : 'bg-[#18181b] border-[#27272a] text-gray-400 hover:text-white hover:border-[#3f3f46]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-[#F5C542]">Promoção de Produto</span>
                  <span className="text-[10px] bg-sky-500/10 text-sky-400 font-bold px-1.5 py-0.5 rounded">
                    Recomendado
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-tight">
                  Exibe avisos promocionais de destaque do produto sem simular compra real.
                </p>
              </button>

              <button
                type="button"
                onClick={() => onChange({ ...config, mode: 'purchase_confirmed' })}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  config.mode === 'purchase_confirmed'
                    ? 'bg-[#1C1809] border-[#F5C542] text-white shadow-md'
                    : 'bg-[#18181b] border-[#27272a] text-gray-400 hover:text-white hover:border-[#3f3f46]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-[#10B981]">Compra Confirmada</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-1.5 py-0.5 rounded">
                    Real Event
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-tight">
                  Exibe unicamente notificações baseadas em eventos reais de compra confirmada.
                </p>
              </button>

              <button
                type="button"
                onClick={() => onChange({ ...config, mode: 'demo' })}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  config.mode === 'demo'
                    ? 'bg-[#1C1809] border-[#F5C542] text-white shadow-md'
                    : 'bg-[#18181b] border-[#27272a] text-gray-400 hover:text-white hover:border-[#3f3f46]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-[#F5C542]">Demonstração</span>
                  <span className="text-[10px] bg-[#F5C542]/10 text-[#F5C542] font-bold px-1.5 py-0.5 rounded">
                    Teste
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-tight">
                  Para testes em rascunho ou preview visual antes da publicação oficial.
                </p>
              </button>
            </div>
          </div>

          {/* Position & Timers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                Posição na Tela
              </label>
              <select
                value={config.position}
                onChange={(e) => onChange({ ...config, position: e.target.value as any })}
                className="w-full bg-[#18181b] border border-[#27272a] text-white rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#F5C542]"
              >
                <option value="bottom-left">Inferior Esquerda (Padrão)</option>
                <option value="bottom-right">Inferior Direita</option>
                <option value="bottom-center">Inferior Centro</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                Duração de Exibição
              </label>
              <select
                value={config.durationMs}
                onChange={(e) => onChange({ ...config, durationMs: Number(e.target.value) })}
                className="w-full bg-[#18181b] border border-[#27272a] text-white rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#F5C542]"
              >
                <option value={5000}>5 Segundos</option>
                <option value={7000}>7 Segundos (Padrão)</option>
                <option value={10000}>10 Segundos</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                Intervalo entre Avisos
              </label>
              <select
                value={config.intervalMs}
                onChange={(e) => onChange({ ...config, intervalMs: Number(e.target.value) })}
                className="w-full bg-[#18181b] border border-[#27272a] text-white rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#F5C542]"
              >
                <option value={15000}>15 Segundos</option>
                <option value={30000}>30 Segundos (Padrão)</option>
                <option value={60000}>1 Minuto</option>
              </select>
            </div>
          </div>

          {/* Visibility Switches */}
          <div className="pt-3 border-t border-[#27272a] grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium text-gray-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.showImage}
                onChange={(e) => onChange({ ...config, showImage: e.target.checked })}
                className="rounded border-[#27272a] text-[#F5C542] focus:ring-0"
              />
              <span>Mostrar imagem</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.showTimeAgo}
                onChange={(e) => onChange({ ...config, showTimeAgo: e.target.checked })}
                className="rounded border-[#27272a] text-[#F5C542] focus:ring-0"
              />
              <span>Mostrar tempo</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.showProductName}
                onChange={(e) => onChange({ ...config, showProductName: e.target.checked })}
                className="rounded border-[#27272a] text-[#F5C542] focus:ring-0"
              />
              <span>Mostrar nome</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.onlyConfirmedPurchases}
                onChange={(e) => onChange({ ...config, onlyConfirmedPurchases: e.target.checked })}
                className="rounded border-[#27272a] text-[#F5C542] focus:ring-0"
              />
              <span>Apenas confirmações reais</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
