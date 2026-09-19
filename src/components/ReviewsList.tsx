import React, { useState, useMemo } from 'react';
import { Review, CategoryType } from '../types';
import { CATEGORIES } from '../data/initialData';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit3,
  Copy,
  Trash2,
  FileText,
  Calendar,
  Layers
} from 'lucide-react';

interface ReviewsListProps {
  reviews: Review[];
  onNewReview: () => void;
  onEditReview: (review: Review) => void;
  onViewReview: (review: Review) => void;
  onDuplicateReview: (review: Review) => void;
  onDeleteReview: (id: string) => void;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  onNewReview,
  onEditReview,
  onViewReview,
  onDuplicateReview,
  onDeleteReview
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');

  const filteredReviews = useMemo(() => {
    return reviews.filter((rev) => {
      const matchSearch =
        rev.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rev.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rev.siteName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCategory = selectedCategory === 'Todas' || rev.category === selectedCategory;
      const matchStatus = selectedStatus === 'Todos' || rev.status === selectedStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [reviews, searchTerm, selectedCategory, selectedStatus]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Meus Reviews</h2>
          <p className="text-sm text-[#A1A1A1] mt-1">
            Gerencie todas as suas páginas de review criadas ({reviews.length} no total).
          </p>
        </div>
        <button
          onClick={onNewReview}
          className="flex items-center gap-2 bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] font-bold px-5 py-3 rounded-xl text-sm shadow-lg shadow-[#F5C542]/10 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Nova Review</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#151515] border border-[#2A2A2A] rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1A1]" />
          <input
            type="text"
            placeholder="Buscar por nome ou produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-[#A1A1A1] focus:outline-none focus:border-[#F5C542]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#A1A1A1] font-medium">Categoria:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F5C542]"
            >
              <option value="Todas">Todas</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#A1A1A1] font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F5C542]"
            >
              <option value="Todos">Todos</option>
              <option value="Publicado">Publicado</option>
              <option value="Rascunho">Rascunho</option>
              <option value="Arquivado">Arquivado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Grid / Table */}
      {filteredReviews.length === 0 ? (
        <div className="bg-[#151515] border border-[#2A2A2A] rounded-3xl p-16 text-center">
          <FileText className="w-12 h-12 text-[#A1A1A1] mx-auto mb-4 opacity-50" />
          <h4 className="text-white font-semibold text-base">Nenhum review encontrado</h4>
          <p className="text-sm text-[#A1A1A1] mt-1 mb-6">
            Tente alterar os termos da busca ou filtros selecionados.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('Todas');
              setSelectedStatus('Todos');
            }}
            className="px-4 py-2 rounded-xl bg-[#0D0D0D] border border-[#2A2A2A] text-xs font-semibold text-white hover:border-[#F5C542]"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#151515] border border-[#2A2A2A] rounded-2xl overflow-hidden flex flex-col transition-all hover:border-[#F5C542]/40 group shadow-lg"
            >
              <div className="relative h-48 bg-[#0D0D0D] overflow-hidden">
                <img
                  src={rev.mainImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
                  alt={rev.productName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#080808]/80 backdrop-blur-md text-[11px] font-semibold text-white border border-[#2A2A2A]">
                    {rev.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md border ${
                      rev.status === 'Publicado'
                        ? 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/40'
                        : 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40'
                    }`}
                  >
                    {rev.status}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#A1A1A1] mb-2">
                    <span>Plataforma: <strong className="text-white">{rev.platform}</strong></span>
                    <span>{new Date(rev.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <h4 className="font-bold text-white text-base line-clamp-1 group-hover:text-[#F5C542] transition-colors">
                    {rev.productName}
                  </h4>
                  <p className="text-xs text-[#A1A1A1] mt-2 line-clamp-2 leading-relaxed">
                    {rev.description || 'Sem descrição informada.'}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#2A2A2A] flex items-center justify-between">
                  <span className="text-sm font-extrabold text-[#F5C542]">{rev.currentPrice || 'Sob consulta'}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onViewReview(rev)}
                      className="p-2 rounded-xl bg-[#0D0D0D] border border-[#2A2A2A] text-[#A1A1A1] hover:text-[#F5C542] hover:border-[#F5C542]/40 transition-colors"
                      title="Visualizar"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditReview(rev)}
                      className="p-2 rounded-xl bg-[#0D0D0D] border border-[#2A2A2A] text-[#A1A1A1] hover:text-white hover:border-[#2A2A2A] transition-colors"
                      title="Editar"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDuplicateReview(rev)}
                      className="p-2 rounded-xl bg-[#0D0D0D] border border-[#2A2A2A] text-[#A1A1A1] hover:text-white hover:border-[#2A2A2A] transition-colors"
                      title="Duplicar"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteReview(rev.id)}
                      className="p-2 rounded-xl bg-[#0D0D0D] border border-[#2A2A2A] text-[#A1A1A1] hover:text-[#EF4444] hover:border-[#EF4444]/40 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
