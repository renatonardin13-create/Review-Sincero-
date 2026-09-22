import React, { useState } from 'react';
import { Review, ReviewNotificationConfig } from '../types';
import { ReviewStatusBar } from './ReviewStatusBar';
import { ReviewValidationPanel, performReviewValidation } from './ReviewValidationPanel';
import { ReviewPublishPanel } from './ReviewPublishPanel';
import { NotificationSettings } from './NotificationSettings';
import { PurchaseNotificationPreview } from './PurchaseNotificationPreview';
import { ReviewRenderer } from './ReviewRenderer';
import { generateStandaloneReviewHtml } from '../utils/exportHtmlUtils';
import { DEFAULT_NOTIFICATION_CONFIG } from '../data/initialData';
import { Sliders, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

interface ReviewPageProps {
  review: Review;
  onSaveReview: (updatedReview: Review) => void;
  onRegenerateAi?: (review: Review) => void;
  onBack: () => void;
  onEditReview?: (review: Review) => void;
}

export const ReviewPage: React.FC<ReviewPageProps> = ({
  review: initialReview,
  onSaveReview,
  onRegenerateAi,
  onBack,
  onEditReview
}) => {
  const [review, setReview] = useState<Review>(() => {
    return {
      ...initialReview,
      notificationConfig: initialReview.notificationConfig || DEFAULT_NOTIFICATION_CONFIG,
      status: initialReview.status || 'Rascunho'
    };
  });

  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'preview' | 'validation' | 'notifications' | 'publish'>('preview');

  const validations = performReviewValidation(review);
  const errors = validations.filter(v => v.status === 'error');
  const isValidated = errors.length === 0;

  const handleUpdateNotificationConfig = (updatedConfig: ReviewNotificationConfig) => {
    const updated = {
      ...review,
      notificationConfig: updatedConfig,
      updatedAt: new Date().toISOString()
    };
    setReview(updated);
    onSaveReview(updated);
  };

  const handleStatusChange = (newStatus: Review['status']) => {
    const updated = {
      ...review,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };
    setReview(updated);
    onSaveReview(updated);
  };

  const handleSave = () => {
    onSaveReview(review);
    alert('Review salva com sucesso!');
  };

  const handlePublish = () => {
    if (!isValidated) {
      setActiveTab('validation');
      alert('Atenção: Corrija os itens pendentes na aba de Validação para publicar.');
      return;
    }
    const updated = {
      ...review,
      status: 'Publicado' as const,
      updatedAt: new Date().toISOString()
    };
    setReview(updated);
    onSaveReview(updated);
    setActiveTab('publish');
  };

  const handleDownloadHtml = () => {
    const htmlContent = generateStandaloneReviewHtml(review);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `review-${review.slug || review.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper viewport width styling
  const getViewportContainerClass = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-[390px] mx-auto rounded-3xl border-4 border-[#27272a] shadow-2xl overflow-hidden my-6';
      case 'tablet':
        return 'max-w-[768px] mx-auto rounded-3xl border-4 border-[#27272a] shadow-2xl overflow-hidden my-6';
      case 'desktop':
      default:
        return 'w-full max-w-7xl mx-auto rounded-3xl border border-[#27272a] shadow-2xl overflow-hidden my-6';
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col">
      {/* Top Workflow Status Bar */}
      <ReviewStatusBar
        review={review}
        viewport={viewport}
        onViewportChange={setViewport}
        onSave={handleSave}
        onRegenerateWithAi={onRegenerateAi ? () => onRegenerateAi(review) : undefined}
        onPublish={handlePublish}
        onBack={onBack}
        isValidated={isValidated}
      />

      {/* Tabs Navigation Bar */}
      <div className="bg-[#121214] border-b border-[#27272a] px-4 md:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-[#F5C542] text-[#080808] shadow-md'
                  : 'bg-[#18181b] text-gray-400 hover:text-white border border-[#27272a]'
              }`}
            >
              👁️ Visualizar Preview
            </button>

            <button
              onClick={() => setActiveTab('validation')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'validation'
                  ? 'bg-[#F5C542] text-[#080808] shadow-md'
                  : 'bg-[#18181b] text-gray-400 hover:text-white border border-[#27272a]'
              }`}
            >
              <span>Checklist de Validação</span>
              {errors.length > 0 ? (
                <span className="bg-red-500 text-white font-black text-[10px] px-1.5 py-0.2 rounded-full">
                  {errors.length}
                </span>
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-[#F5C542] text-[#080808] shadow-md'
                  : 'bg-[#18181b] text-gray-400 hover:text-white border border-[#27272a]'
              }`}
            >
              🔔 Automação de Notificações
            </button>

            <button
              onClick={() => setActiveTab('publish')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'publish'
                  ? 'bg-[#F5C542] text-[#080808] shadow-md'
                  : 'bg-[#18181b] text-gray-400 hover:text-white border border-[#27272a]'
              }`}
            >
              🚀 Publicar & Exportar HTML
            </button>
          </div>

          {onEditReview && (
            <button
              onClick={() => onEditReview(review)}
              className="px-4 py-2 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-bold transition-all cursor-pointer shrink-0"
            >
              ✏️ Editar Campos
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Viewport Container */}
      <div className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {activeTab === 'preview' && (
          <div className="space-y-6 animate-in fade-in">
            <div className={getViewportContainerClass()}>
              <ReviewRenderer
                review={review}
                isPreview={false}
                deviceMode={viewport}
              />
            </div>
          </div>
        )}

        {activeTab === 'validation' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in py-4">
            <ReviewValidationPanel
              review={review}
              onFixField={(field) => {
                if (onEditReview) {
                  onEditReview(review);
                }
              }}
            />
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in py-4">
            <NotificationSettings
              config={review.notificationConfig || DEFAULT_NOTIFICATION_CONFIG}
              onChange={handleUpdateNotificationConfig}
            />

            <PurchaseNotificationPreview
              review={review}
              configOverride={review.notificationConfig || DEFAULT_NOTIFICATION_CONFIG}
            />
          </div>
        )}

        {activeTab === 'publish' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in py-4">
            <ReviewPublishPanel
              review={review}
              onStatusChange={handleStatusChange}
              onDownloadHtml={handleDownloadHtml}
              onPreviewPublic={() => setActiveTab('preview')}
              isValidToPublish={isValidated}
            />
          </div>
        )}
      </div>
    </div>
  );
};
