export interface AffiliatePlatform {
  id: string;
  name: string;
  country: string;
  currency: string;
  commissionType: 'porcentagem' | 'fixo' | 'variavel';
  commissionRate: number; // default value
  commissionSource: 'REAL' | 'CONFIGURADA' | 'ESTIMADA' | 'NAO_INFORMADA';
  sourceDetails: string;
}

export const affiliatePlatforms: AffiliatePlatform[] = [
  {
    id: 'meli',
    name: 'Mercado Livre',
    country: 'Brasil',
    currency: 'BRL',
    commissionType: 'variavel',
    commissionRate: 11,
    commissionSource: 'REAL',
    sourceDetails: 'Tabela oficial do Programa de Afiliados Mercado Livre'
  },
  {
    id: 'shopee',
    name: 'Shopee',
    country: 'Brasil',
    currency: 'BRL',
    commissionType: 'variavel',
    commissionRate: 14,
    commissionSource: 'REAL',
    sourceDetails: 'Regulamento oficial de comissões da Shopee Brasil'
  },
  {
    id: 'amazon',
    name: 'Amazon Brasil',
    country: 'Brasil',
    currency: 'BRL',
    commissionType: 'variavel',
    commissionRate: 10,
    commissionSource: 'REAL',
    sourceDetails: 'Tabela oficial de associados da Amazon Brasil'
  },
  {
    id: 'hotmart',
    name: 'Hotmart',
    country: 'Brasil/Global',
    currency: 'BRL/USD',
    commissionType: 'variavel',
    commissionRate: 50,
    commissionSource: 'CONFIGURADA',
    sourceDetails: 'Média de mercado: 40% a 80%'
  },
  {
    id: 'braip',
    name: 'Braip',
    country: 'Brasil',
    currency: 'BRL',
    commissionType: 'variavel',
    commissionRate: 45,
    commissionSource: 'CONFIGURADA',
    sourceDetails: 'Configurada pelo produtor'
  },
  {
    id: 'monetizze',
    name: 'Monetizze',
    country: 'Brasil',
    currency: 'BRL',
    commissionType: 'variavel',
    commissionRate: 50,
    commissionSource: 'CONFIGURADA',
    sourceDetails: 'Configurada pelo produtor'
  },
  {
    id: 'eduzz',
    name: 'Eduzz',
    country: 'Brasil',
    currency: 'BRL',
    commissionType: 'variavel',
    commissionRate: 45,
    commissionSource: 'CONFIGURADA',
    sourceDetails: 'Configurada pelo produtor'
  },
  {
    id: 'logzz',
    name: 'Logzz',
    country: 'Brasil',
    currency: 'BRL',
    commissionType: 'variavel',
    commissionRate: 35,
    commissionSource: 'CONFIGURADA',
    sourceDetails: 'Média de mercado para dropshipping nacional'
  },
  {
    id: 'clickbank',
    name: 'ClickBank',
    country: 'Global',
    currency: 'USD',
    commissionType: 'variavel',
    commissionRate: 65,
    commissionSource: 'ESTIMADA',
    sourceDetails: 'Estimativa baseada em ofertas globais de infoprodutos'
  },
  {
    id: 'banggood',
    name: 'Banggood',
    country: 'China/Global',
    currency: 'USD',
    commissionType: 'variavel',
    commissionRate: 8,
    commissionSource: 'REAL',
    sourceDetails: 'Tabela oficial do programa de afiliados Banggood'
  },
  {
    id: 'custom',
    name: 'Outra / Custom',
    country: 'Qualquer',
    currency: 'BRL',
    commissionType: 'variavel',
    commissionRate: 10,
    commissionSource: 'NAO_INFORMADA',
    sourceDetails: 'Taxa não informada pelo sistema'
  }
];

export function getPlatformCommissionSourceLabel(source: 'REAL' | 'CONFIGURADA' | 'ESTIMADA' | 'NAO_INFORMADA'): string {
  switch (source) {
    case 'REAL':
      return 'Taxa Real (Fonte oficial)';
    case 'CONFIGURADA':
      return 'Taxa Configurada pelo Produtor';
    case 'ESTIMADA':
      return 'Taxa Estimada (Médias)';
    case 'NAO_INFORMADA':
    default:
      return 'Taxa Não Informada';
  }
}
