export interface UrlResolverOptions {
  platform: 'Mercado Livre' | 'Shopee';
  productUrl?: string;
  searchTerm: string;
  productId?: string;
  shopId?: string;
}

export function resolveOfficialProductUrl(options: UrlResolverOptions): string | null {
  const { platform, productUrl, searchTerm, productId, shopId } = options;

  // Basic Validation
  if (!searchTerm && !productUrl) return null;

  // Clean and check URL
  const cleanUrl = (url: string | undefined) => {
    if (!url) return null;
    const trimmed = url.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) return null;
    if (trimmed.includes('javascript:') || trimmed.includes('data:')) return null;
    return trimmed;
  };

  // Mercado Livre Logic
  if (platform === 'Mercado Livre') {
    const validUrl = cleanUrl(productUrl);
    if (validUrl) {
      return validUrl;
    }
    return `https://lista.mercadolivre.com.br/${encodeURIComponent(searchTerm)}`;
  }

  // Shopee Logic
  if (platform === 'Shopee') {
    if (shopId && productId) {
        return `https://shopee.com.br/product/${shopId}/${productId}`;
    }
    return `https://shopee.com.br/search?keyword=${encodeURIComponent(searchTerm)}`;
  }

  return null;
}
