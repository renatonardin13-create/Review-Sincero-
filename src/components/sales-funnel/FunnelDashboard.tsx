import React, { useState, useEffect } from 'react';
import { fetchFunnels, saveFunnel } from '../../services/salesFunnelService';
import { Funnel } from '../../types';
import { PlusCircle, Edit3, Trash2, LayoutTemplate } from 'lucide-react';

export const FunnelDashboard: React.FC = () => {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFunnels();
  }, []);

  const loadFunnels = async () => {
    setLoading(true);
    const data = await fetchFunnels();
    setFunnels(data);
    setLoading(false);
  };

  const handleCreate = async () => {
    const newFunnel: Partial<Funnel> = {
      name: 'Novo Funil',
      title: 'Novo Funil de Vendas',
      description: 'Descrição do novo funil',
      slug: `funil-${Date.now()}`,
      status: 'draft'
    };
    await saveFunnel(newFunnel);
    loadFunnels();
  };

  if (loading) return <p className="text-sm text-[#8E8E8E]">Carregando funis...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-white">Meus Funis</h2>
        <button onClick={handleCreate} className="flex items-center gap-2 bg-[#F5C542] text-black px-4 py-2 rounded-xl text-xs font-bold">
          <PlusCircle className="w-4 h-4" /> Novo Funil
        </button>
      </div>

      <div className="grid gap-4">
        {funnels.map(funnel => (
          <div key={funnel.id} className="p-4 bg-[#181818] border border-[#282828] rounded-xl flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-white">{funnel.name}</h3>
              <p className="text-xs text-[#A1A1A1]">{funnel.description} | {funnel.status}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-white hover:text-[#F5C542]"><Edit3 className="w-4 h-4" /></button>
              <button className="p-2 text-white hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
