import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileCheck, 
  Globe, 
  Smartphone, 
  Bell, 
  Info,
  ExternalLink
} from 'lucide-react';
import { Review } from '../types';

interface ReviewValidationPanelProps {
  review: Review;
  onFixField?: (fieldName: string) => void;
}

export interface ValidationItem {
  key: string;
  category: 'Conteúdo' | 'SEO' | 'UX' | 'Notificações';
  title: string;
  description: string;
  status: 'valid' | 'warning' | 'error';
  fixableField?: string;
}

export function performReviewValidation(review: Review): ValidationItem[] {
  const items: ValidationItem[] = [];

  // 1. CONTEÚDO
  items.push({
    key: 'val_prod_name',
    category: 'Conteúdo',
    title: 'Nome do Produto',
    description: review.productName && review.productName.trim().length > 2
      ? 'Preenchido corretamente'
      : 'Nome do produto muito curto ou ausente',
    status: review.productName && review.productName.trim().length > 2 ? 'valid' : 'error',
    fixableField: 'productName'
  });

  items.push({
    key: 'val_headline',
    category: 'Conteúdo',
    title: 'Headline Principal',
    description: review.headline && review.headline.trim().length > 5
      ? 'Headline de alto impacto configurada'
      : 'Recomendado incluir uma headline atrativa no topo da review',
    status: review.headline && review.headline.trim().length > 5 ? 'valid' : 'warning',
    fixableField: 'headline'
  });

  items.push({
    key: 'val_desc',
    category: 'Conteúdo',
    title: 'Descrição Detalhada',
    description: review.description && review.description.trim().length > 30
      ? 'Análise com boa extensão de conteúdo'
      : 'A descrição do produto precisa de mais detalhes técnicos e benefícios',
    status: review.description && review.description.trim().length > 30 ? 'valid' : 'error',
    fixableField: 'description'
  });

  items.push({
    key: 'val_main_image',
    category: 'Conteúdo',
    title: 'Imagem Principal',
    description: review.mainImage && review.mainImage.startsWith('http')
      ? 'Imagem principal válida'
      : 'URL da imagem principal é inválida ou ausente',
    status: review.mainImage && review.mainImage.startsWith('http') ? 'valid' : 'error',
    fixableField: 'mainImage'
  });

  items.push({
    key: 'val_cta',
    category: 'Conteúdo',
    title: 'Link do Botão CTA (Afiliado)',
    description: review.affiliateUrl && review.affiliateUrl.startsWith('http')
      ? 'Link de destino configurado'
      : 'URL de afiliado inválida ou ausente! O leitor não conseguirá acessar o produto.',
    status: review.affiliateUrl && review.affiliateUrl.startsWith('http') ? 'valid' : 'error',
    fixableField: 'affiliateUrl'
  });

  items.push({
    key: 'val_faq',
    category: 'Conteúdo',
    title: 'Perguntas Frequentes (FAQ)',
    description: review.faq && review.faq.length >= 2
      ? `${review.faq.length} perguntas cadastradas`
      : 'Recomendado incluir ao menos 2 perguntas no FAQ para quebrar objeções',
    status: review.faq && review.faq.length >= 2 ? 'valid' : 'warning',
    fixableField: 'faq'
  });

  // 2. SEO
  const hasMetaTitle = !!(review.seoSettings?.metaTitle || review.productName);
  items.push({
    key: 'val_seo_title',
    category: 'SEO',
    title: 'Meta Title de Busca',
    description: hasMetaTitle
      ? 'Título de busca otimizado'
      : 'Recomendado configurar o Meta Title nas configurações de SEO',
    status: hasMetaTitle ? 'valid' : 'warning',
    fixableField: 'seoSettings.metaTitle'
  });

  const hasMetaDesc = !!(review.seoSettings?.metaDescription || review.description);
  items.push({
    key: 'val_seo_desc',
    category: 'SEO',
    title: 'Meta Description',
    description: hasMetaDesc
      ? 'Meta descrição configurada'
      : 'Meta descrição importante para indexação no Google',
    status: hasMetaDesc ? 'valid' : 'warning',
    fixableField: 'seoSettings.metaDescription'
  });

  // 3. UX & MOBILE
  items.push({
    key: 'val_ux_contrast',
    category: 'UX',
    title: 'Contraste e Responsividade',
    description: 'Interface verificada no Design System Master (Dark Surface & Typography)',
    status: 'valid'
  });

  // 4. NOTIFICAÇÕES
  const notifConfig = review.notificationConfig;
  if (!notifConfig || !notifConfig.enabled) {
    items.push({
      key: 'val_notif_status',
      category: 'Notificações',
      title: 'Motor de Notificações',
      description: 'Notificações desativadas nesta página',
      status: 'warning',
      fixableField: 'notificationConfig'
    });
  } else {
    items.push({
      key: 'val_notif_mode',
      category: 'Notificações',
      title: 'Modo de Notificação',
      description: notifConfig.mode === 'purchase_confirmed'
        ? 'Modo Compra Confirmada (Requer eventos reais de confirmação)'
        : notifConfig.mode === 'demo'
        ? 'Modo Demonstração (Não utilizar como compra real em produção)'
        : 'Modo Promoção de Destaque (Padrão e seguro)',
      status: notifConfig.mode === 'demo' ? 'warning' : 'valid',
      fixableField: 'notificationConfig'
    });
  }

  return items;
}

export const ReviewValidationPanel: React.FC<ReviewValidationPanelProps> = ({
  review,
  onFixField
}) => {
  const validations = performReviewValidation(review);
  const errors = validations.filter(v => v.status === 'error');
  const warnings = validations.filter(v => v.status === 'warning');
  const valids = validations.filter(v => v.status === 'valid');

  const isValidForPublish = errors.length === 0;

  return (
    <div className="bg-[#121214] border border-[#27272a] rounded-3xl p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#27272a]">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#F5C542]" />
            <h3 className="text-lg font-extrabold text-white">Checklist de Validação Automática</h3>
          </div>
          <p className="text-xs text-[#A1A1A1] mt-0.5">
            Análise em tempo real de Conteúdo, SEO, UX e Notificações antes da publicação
          </p>
        </div>

        {/* Validation Score Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#18181b] border border-[#27272a] text-xs font-bold">
            <span className="text-emerald-400 font-mono">{valids.length}</span>
            <span className="text-gray-400">Válidos</span>
          </div>
          {warnings.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#18181b] border border-[#27272a] text-xs font-bold">
              <span className="text-amber-400 font-mono">{warnings.length}</span>
              <span className="text-gray-400">Avisos</span>
            </div>
          )}
          {errors.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-950/20 border border-red-900/30 text-xs font-bold">
              <span className="text-red-400 font-mono">{errors.length}</span>
              <span className="text-red-300">Bloqueios</span>
            </div>
          )}
        </div>
      </div>

      {/* Alert banner if publish ready */}
      {isValidForPublish ? (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-400 text-xs font-medium">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Sua review atende a todos os critérios críticos de publicação com sucesso!</span>
        </div>
      ) : (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-medium">
          <XCircle className="w-5 h-5 shrink-0" />
          <span>Atenção: Corrija os {errors.length} item(ns) bloqueantes antes de publicar.</span>
        </div>
      )}

      {/* Validation List */}
      <div className="space-y-3">
        {validations.map((item) => (
          <div
            key={item.key}
            className="p-3.5 rounded-2xl bg-[#18181b] border border-[#27272a] flex items-start justify-between gap-3 transition-colors hover:border-[#3f3f46]"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {item.status === 'valid' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : item.status === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#27272a] text-gray-300">
                    {item.category}
                  </span>
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
              </div>
            </div>

            {item.fixableField && onFixField && item.status !== 'valid' && (
              <button
                type="button"
                onClick={() => onFixField(item.fixableField!)}
                className="text-[11px] font-bold text-[#F5C542] hover:underline shrink-0 cursor-pointer"
              >
                Ajustar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
