import React, { useState } from 'react';
import { AppSettings, TemplateType, PromoBannerSlide } from '../types';
import { Settings, Save, CheckCircle, Sliders, Image as ImageIcon, User, DollarSign, Sparkles } from 'lucide-react';
import { PromoBannerManager } from './PromoBannerManager';
import { DEFAULT_PROMO_BANNERS } from '../data/initialData';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
  initialTab?: 'general' | 'banners';
  isAdmin?: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  initialTab = 'general',
  isAdmin = false
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'banners'>(isAdmin ? initialTab : 'general');
  const [form, setForm] = useState<AppSettings>({
    ...settings,
    promoBanners: settings.promoBanners || DEFAULT_PROMO_BANNERS,
    bannerAutoplaySpeed: settings.bannerAutoplaySpeed || 6,
    enableBannerCarousel: settings.enableBannerCarousel !== false
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleUpdateBanners = (updatedBanners: PromoBannerSlide[]) => {
    const updatedForm = { ...form, promoBanners: updatedBanners };
    setForm(updatedForm);
    onSaveSettings(updatedForm);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleUpdateSpeed = (speed: number) => {
    const updatedForm = { ...form, bannerAutoplaySpeed: speed };
    setForm(updatedForm);
    onSaveSettings(updatedForm);
  };

  const handleUpdateEnabled = (enabled: boolean) => {
    const updatedForm = { ...form, enableBannerCarousel: enabled };
    setForm(updatedForm);
    onSaveSettings(updatedForm);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-300 pb-20">
      <div>
        <h2 className="text-2xl font-extrabold text-white">Configurações & Perfil</h2>
        <p className="text-sm text-[#A1A1A1] mt-1">
          {isAdmin 
            ? "Gerencie os dados do seu site de reviews e configure os banners promocionais em slides para vender produtos como afiliado ou produtor."
            : "Gerencie as configurações gerais da sua conta e preferências do sistema."}
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] flex items-center gap-3 animate-in fade-in">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold">Configurações salvas e aplicadas com sucesso!</span>
        </div>
      )}

      {/* Tabs (Admin Only) */}
      {isAdmin && (
        <div className="flex items-center gap-2 p-1.5 bg-[#121212] border border-[#222] rounded-2xl max-w-md">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'general'
                ? 'bg-[#F5C542] text-[#080808] shadow-md'
                : 'text-[#A1A1A1] hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Geral & Perfil</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('banners')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
              activeTab === 'banners'
                ? 'bg-[#F5C542] text-[#080808] shadow-md'
                : 'text-[#A1A1A1] hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Banners em Slides</span>
            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-full bg-[#22C55E]/20 text-[#22C55E] font-black">
              Vendas
            </span>
          </button>
        </div>
      )}

      {/* General Tab */}
      {activeTab === 'general' && (
        <form onSubmit={handleSubmit} className="bg-[#151515] border border-[#2A2A2A] rounded-3xl p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#A1A1A1] uppercase tracking-wider mb-2">
                Nome do Site / Canal
              </label>
              <input
                type="text"
                value={form.siteName}
                onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F5C542]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1A1] uppercase tracking-wider mb-2">
                Seu Nome / Autor Principal
              </label>
              <input
                type="text"
                value={form.authorName}
                onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F5C542]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#A1A1A1] uppercase tracking-wider mb-2">
                Template Padrão
              </label>
              <select
                value={form.defaultTemplate}
                onChange={(e) => setForm({ ...form, defaultTemplate: e.target.value as TemplateType })}
                className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F5C542]"
              >
                <option value="premium">Template Premium (Dark Tecnológico)</option>
                <option value="clean">Template Clean (Editorial / Revista)</option>
                <option value="conversion">Template Conversion (Alta Conversão com Escassez)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1A1] uppercase tracking-wider mb-2">
                E-mail de Contato
              </label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F5C542]"
              />
            </div>
          </div>

           <div className="border-t border-[#2A2A2A] pt-6">
            <h4 className="text-sm font-bold text-white mb-4">Limites de Uso (Plano)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] uppercase tracking-wider mb-2">
                  Limite de Reviews (Gratuito)
                </label>
                <input
                  type="number"
                  value={form.usageLimits?.freeReviewLimit || 3}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      usageLimits: {
                        freeReviewLimit: Number(e.target.value),
                        premiumReviewLimit: form.usageLimits?.premiumReviewLimit || 999
                      }
                    })
                  }
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F5C542]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] uppercase tracking-wider mb-2">
                  Limite de Reviews (Premium)
                </label>
                <input
                  type="number"
                  value={form.usageLimits?.premiumReviewLimit || 999}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      usageLimits: {
                        freeReviewLimit: form.usageLimits?.freeReviewLimit || 3,
                        premiumReviewLimit: Number(e.target.value)
                      }
                    })
                  }
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F5C542]"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-[#2A2A2A] pt-6 flex items-center justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-[#F5C542]/10 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Configurações</span>
            </button>
          </div>
        </form>
      )}

      {/* Banners & Monetization Tab */}
      {activeTab === 'banners' && (
        <PromoBannerManager
          banners={form.promoBanners || DEFAULT_PROMO_BANNERS}
          onUpdateBanners={handleUpdateBanners}
          autoplaySpeed={form.bannerAutoplaySpeed || 6}
          onUpdateAutoplaySpeed={handleUpdateSpeed}
          carouselEnabled={form.enableBannerCarousel !== false}
          onUpdateCarouselEnabled={handleUpdateEnabled}
        />
      )}
    </div>
  );
};
