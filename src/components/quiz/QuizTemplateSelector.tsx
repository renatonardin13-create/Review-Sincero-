import React from 'react';
import { QuizTemplateId } from '../../types';
import { HelpCircle, Stethoscope, Check, Sparkles, LayoutGrid } from 'lucide-react';

interface QuizTemplateSelectorProps {
  selectedTemplate: QuizTemplateId;
  onSelectTemplate: (templateId: QuizTemplateId) => void;
}

export const QuizTemplateSelector: React.FC<QuizTemplateSelectorProps> = ({
  selectedTemplate,
  onSelectTemplate
}) => {
  return (
    <div className="bg-[#0D1117] border border-[#1E293B] rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider mb-1">
            <LayoutGrid className="w-4 h-4" />
            <span>Sistema de Templates</span>
          </div>
          <h2 className="text-xl font-black text-white">ESCOLHA O MODELO DO SEU QUIZ</h2>
          <p className="text-xs text-slate-400 mt-1">
            Selecione a estrutura visual e o fluxo de engajamento ideal para o seu produto. Você pode trocar de modelo a qualquer momento sem perder suas perguntas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* TEMPLATE 01: QUIZ CLÁSSICO */}
        <div
          onClick={() => onSelectTemplate('classic')}
          className={`relative rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between group ${
            selectedTemplate === 'classic'
              ? 'bg-[#161B22] border-blue-500 shadow-lg shadow-blue-500/10'
              : 'bg-[#090D14] border-[#1F2937] hover:border-slate-700 hover:bg-[#111622]'
          }`}
        >
          {selectedTemplate === 'classic' && (
            <div className="absolute -top-3 right-4 bg-blue-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow flex items-center gap-1">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>Modelo Ativo</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Thumbnail Mockup */}
            <div className="w-full h-32 bg-[#0A0D12] rounded-xl border border-[#1E293B] p-3 flex flex-col justify-between overflow-hidden relative group-hover:scale-[1.01] transition-transform">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-2 py-0.5 rounded">
                  Quiz de Conhecimento
                </span>
                <span className="text-[10px] font-mono text-slate-500">Pergunta 1/5</span>
              </div>
              <div className="space-y-1.5 my-2">
                <div className="h-2 w-3/4 bg-slate-700 rounded"></div>
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <div className="h-5 bg-blue-500/20 border border-blue-500/40 rounded flex items-center px-2 text-[9px] text-blue-300">
                    A) Opção 1
                  </div>
                  <div className="h-5 bg-[#161E2E] border border-slate-800 rounded flex items-center px-2 text-[9px] text-slate-400">
                    B) Opção 2
                  </div>
                </div>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-blue-500"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-extrabold text-white">Quiz Clássico</h3>
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Perguntas e respostas tradicionais com feedback imediato, pontuação percentual de acertos, explicação pedagógica e botão de CTA.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] bg-slate-800/80 text-slate-300 font-bold px-2 py-1 rounded-md">
                Feedback Imediato
              </span>
              <span className="text-[10px] bg-slate-800/80 text-slate-300 font-bold px-2 py-1 rounded-md">
                Placar %
              </span>
              <span className="text-[10px] bg-slate-800/80 text-slate-300 font-bold px-2 py-1 rounded-md">
                Gabarito Explicativo
              </span>
              <span className="text-[10px] bg-slate-800/80 text-slate-300 font-bold px-2 py-1 rounded-md">
                Dark Mode
              </span>
            </div>
          </div>

          <button
            type="button"
            className={`w-full mt-5 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              selectedTemplate === 'classic'
                ? 'bg-blue-600 text-white cursor-default'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            {selectedTemplate === 'classic' ? (
              <span>USANDO O MODELO CLÁSSICO</span>
            ) : (
              <span>USAR ESTE MODELO →</span>
            )}
          </button>
        </div>

        {/* TEMPLATE 02: QUIZ DIAGNÓSTICO / FUNIL */}
        <div
          onClick={() => onSelectTemplate('diagnostic')}
          className={`relative rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between group ${
            selectedTemplate === 'diagnostic'
              ? 'bg-[#0E1F17] border-emerald-500 shadow-lg shadow-emerald-500/10'
              : 'bg-[#090D14] border-[#1F2937] hover:border-slate-700 hover:bg-[#111622]'
          }`}
        >
          {selectedTemplate === 'diagnostic' && (
            <div className="absolute -top-3 right-4 bg-emerald-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow flex items-center gap-1">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>Modelo Ativo</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Thumbnail Mockup */}
            <div className="w-full h-32 bg-[#E8F5EB] rounded-xl border border-emerald-300/50 p-3 flex flex-col justify-between overflow-hidden relative group-hover:scale-[1.01] transition-transform">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-200/60 px-2 py-0.5 rounded">
                  Diagnóstico / Funil
                </span>
                <span className="text-[10px] font-mono text-emerald-700">Passo 2/5</span>
              </div>
              <div className="space-y-1.5 my-1">
                <div className="h-2 w-2/3 bg-emerald-900/80 rounded"></div>
                <div className="space-y-1">
                  <div className="h-4 bg-white border border-emerald-400 rounded flex items-center px-2 text-[8px] text-emerald-900 font-bold justify-between">
                    <span>Opção Selecionada</span>
                    <span className="text-emerald-600 font-extrabold">✓</span>
                  </div>
                  <div className="h-4 bg-white border border-emerald-200 rounded flex items-center px-2 text-[8px] text-emerald-700">
                    Opção 2
                  </div>
                </div>
              </div>
              <div className="h-1.5 w-full bg-emerald-200 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-emerald-600"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-extrabold text-white">Quiz Diagnóstico</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Novo
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Funil em formato de diagnóstico mobile-first com perguntas de perfil, tela de processamento animada, captura de leads e oferta do produto.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 font-bold px-2 py-1 rounded-md">
                Mobile-First Green
              </span>
              <span className="text-[10px] bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 font-bold px-2 py-1 rounded-md">
                Multi-tipos
              </span>
              <span className="text-[10px] bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 font-bold px-2 py-1 rounded-md">
                Captura de Leads
              </span>
              <span className="text-[10px] bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 font-bold px-2 py-1 rounded-md">
                Oferta & Cronômetro
              </span>
            </div>
          </div>

          <button
            type="button"
            className={`w-full mt-5 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              selectedTemplate === 'diagnostic'
                ? 'bg-emerald-600 text-white cursor-default shadow-lg shadow-emerald-600/20'
                : 'bg-emerald-950/50 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/60'
            }`}
          >
            {selectedTemplate === 'diagnostic' ? (
              <span>USANDO O MODELO DIAGNÓSTICO</span>
            ) : (
              <span>USAR ESTE MODELO →</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
