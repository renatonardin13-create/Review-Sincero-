import React, { useState } from 'react';
import { AppSettings, TemplateType } from '../types';
import { Settings, Save, CheckCircle } from 'lucide-react';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onSaveSettings }) => {
  const [form, setForm] = useState<AppSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-extrabold text-white">Configurações do Sistema</h2>
        <p className="text-sm text-[#A1A1A1] mt-1">
          Configure as informações padrão para o seu site de reviews, autor e preferências de exportação.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] flex items-center gap-3 animate-in fade-in">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">Configurações salvas com sucesso!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#151515] border border-[#2A2A2A] rounded-3xl p-8 space-y-6">
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
              <option value="premium">Template Premium (Dark)</option>
              <option value="clean">Template Clean (Editorial)</option>
              <option value="conversion">Template Conversion (Alta Conversão)</option>
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
          <h4 className="text-sm font-bold text-white mb-4">Redes Sociais & Contato</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#A1A1A1] uppercase tracking-wider mb-2">
                Instagram
              </label>
              <input
                type="text"
                value={form.socialLinks.instagram || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    socialLinks: { ...form.socialLinks, instagram: e.target.value }
                  })
                }
                placeholder="@seuperfil"
                className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F5C542]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1A1] uppercase tracking-wider mb-2">
                YouTube / Canal
              </label>
              <input
                type="text"
                value={form.socialLinks.youtube || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    socialLinks: { ...form.socialLinks, youtube: e.target.value }
                  })
                }
                placeholder="Nome do canal"
                className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F5C542]"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-[#2A2A2A] pt-6 flex items-center justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-[#F5C542]/10"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Configurações</span>
          </button>
        </div>
      </form>
    </div>
  );
};
