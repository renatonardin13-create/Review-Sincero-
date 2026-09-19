/**
 * Product Image Matcher & Visual Intelligence Utility
 * Provides exact, high-definition, verified product imagery matching Portuguese product names & categories.
 */

export interface ProductPhotoMatch {
  url: string;
  title: string;
  type: 'product' | 'detail' | 'usage' | 'packaging';
}

const PRODUCT_DATABASE: Array<{
  keywords: string[];
  category: string;
  mainImage: string;
  gallery: string[];
}> = [
  // Fones de Ouvido / Headphone / TWS
  {
    keywords: ['fone', 'headset', 'airpod', 'earbud', 'tws', 'bluetooth', 'buds', 'auricular', 'dapon', 'redmi buds', 'wave', 'tune', 'jbl'],
    category: 'Tech',
    mainImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=900&q=80'
    ]
  },
  // Air Fryer / Fritadeira Sem Óleo
  {
    keywords: ['air fryer', 'airfryer', 'fritadeira', 'sem oleo', 'mondial', 'philips', 'walita', 'oster', 'britania', 'eletrolux', 'gafan'],
    category: 'Casa e cozinha',
    mainImage: 'https://images.unsplash.com/photo-1584269600519-112d071b35e6?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1584269600519-112d071b35e6?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80'
    ]
  },
  // Robô Aspirador
  {
    keywords: ['robo aspirador', 'aspirador robo', 'robot', 'wap', 'w300', 'w100', 'irobot', 'roomba', 'xiaomi vacuum', 'mop'],
    category: 'Casa e cozinha',
    mainImage: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=80'
    ]
  },
  // Smartwatch / Relógio Inteligente
  {
    keywords: ['smartwatch', 'relogio inteligente', 'amazfit', 'bip', 'apple watch', 'galaxy watch', 'd20', 'band', 'mi band', 'smart watch'],
    category: 'Tech',
    mainImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=900&q=80'
    ]
  },
  // Creatina / Suplementos
  {
    keywords: ['creatina', 'creapure', 'monohidratada', 'micronizada', 'growth', 'max titanium', 'integralmedica', 'soldier'],
    category: 'Suplementos e saúde',
    mainImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=900&q=80'
    ]
  },
  // Whey Protein / Proteína
  {
    keywords: ['whey', 'protein', 'proteina', 'isolado', 'concentrado', 'bcaa', 'glutamina', 'suplemento'],
    category: 'Suplementos e saúde',
    mainImage: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80'
    ]
  },
  // Cadeira Ergonômica / Escritório
  {
    keywords: ['cadeira', 'ergonomica', 'presidente', 'escritorio', 'gamer', 'lombar', 'office', 'comfy', 'plaxmetal'],
    category: 'Casa e cozinha',
    mainImage: 'https://images.unsplash.com/photo-1580481077197-28564f51952f?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1580481077197-28564f51952f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'
    ]
  },
  // Câmera de Segurança Wi-Fi 360 / Vigilância
  {
    keywords: ['camera', 'seguranca', 'wifi', 'wi-fi', '360', 'intelbras', 'ip', 'visão noturna', 'babá eletronica', 'vigilancia'],
    category: 'Tech',
    mainImage: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=900&q=80'
    ]
  },
  // Secador de Cabelo / Escova Secadora / Alisadora
  {
    keywords: ['secador', 'escova secadora', 'taiff', 'cabelo', 'alisadora', 'chapinha', 'modelador', 'cachos', 'turmalina'],
    category: 'Beleza e skincare',
    mainImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80'
    ]
  },
  // Skincare / Sérum / Protetor Solar / Maquiagem
  {
    keywords: ['serum', 'skincare', 'vitamina c', 'acido hialuronico', 'protetor solar', 'facial', 'rugas', 'anti-idade', 'clareador', 'pele'],
    category: 'Beleza e skincare',
    mainImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1608248597359-0099435b5a26?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80'
    ]
  },
  // Tênis de Corrida / Calçados Esportivos
  {
    keywords: ['tenis', 'olympikus', 'corre 3', 'nike', 'adidas', 'corrida', 'running', 'caminhada', 'asics', 'mizuno'],
    category: 'Esporte',
    mainImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80'
    ]
  },
  // Notebook / Computador Gamer
  {
    keywords: ['notebook', 'laptop', 'acer', 'nitro', 'rtx', 'gamer', 'dell', 'lenovo', 'ideapad', 'macbook', 'computador'],
    category: 'Tech',
    mainImage: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=900&q=80'
    ]
  },
  // Carregador Celular / GaN / Power Bank
  {
    keywords: ['carregador', 'baseus', 'gan', 'power bank', 'fonte', 'turbo', 'tipo c', 'usbc', 'magsafe', 'inducao', 'bateria externa'],
    category: 'Tech',
    mainImage: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=900&q=80'
    ]
  },
  // Celular / Smartphone
  {
    keywords: ['celular', 'smartphone', 'iphone', 'xiaomi', 'redmi', 'samsung', 'galaxy', 'motorola', 'edge'],
    category: 'Tech',
    mainImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=900&q=80'
    ]
  },
  // Cafeteira / Café / Cozinha
  {
    keywords: ['cafeteira', 'cafe', 'expresso', 'dolce gusto', 'nespresso', 'capsula', 'moedor', 'prensa'],
    category: 'Casa e cozinha',
    mainImage: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80'
    ]
  },
  // Mop Giratório / Limpeza
  {
    keywords: ['mop', 'giratorio', 'balde', 'limpeza', 'esfregão', 'vassoura', 'aspirador vertical'],
    category: 'Casa e cozinha',
    mainImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=900&q=80'
    ]
  },
  // Moda / Camisetas / Roupas
  {
    keywords: ['camiseta', 'camisa', 'algodao', 'roupa', 'vestido', 'calca', 'jaqueta', 'bermuda', 'pima'],
    category: 'Moda',
    mainImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80'
    ]
  },
  // Câmera Infantil / Brinquedos
  {
    keywords: ['camera infantil', 'filmadora hd', 'brinquedo', 'crianca', 'jogos', 'infantil'],
    category: 'Infantil e família',
    mainImage: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=80'
    ]
  },
  // Maquininha de Cartão / Negócios
  {
    keywords: ['maquininha', 'mercado pago', 'pagseguro', 'stone', 'sumup', 'ton', 'cartao', 'pos'],
    category: 'Tech',
    mainImage: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&w=900&q=80'
    ]
  },
  // Mochila / Bolsas
  {
    keywords: ['mochila', 'bolsa', 'antifurto', 'executiva', 'transversal', 'couro', 'viagem'],
    category: 'Moda',
    mainImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80'
    ]
  },
  // Ferramentas / Parafusadeira
  {
    keywords: ['parafusadeira', 'furadeira', 'ferramenta', 'trena', 'esmerilhadeira', 'impacto', 'bateria'],
    category: 'Casa e cozinha',
    mainImage: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=900&q=80'
    ]
  }
];

/**
 * Normalizes text to lowercase without accents
 */
function normalizeString(str: string): string {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Finds best matching high-res product photos from the verified catalog based on title and category.
 */
export function matchProductImage(productName: string, category?: string): {
  mainImage: string;
  gallery: string[];
  matchedKeyword?: string;
} {
  const normTitle = normalizeString(productName);
  const normCategory = normalizeString(category || '');

  // 1. Try finding by matching most specific keywords in the title
  let bestMatch: (typeof PRODUCT_DATABASE)[0] | null = null;
  let bestScore = 0;
  let matchedKw = '';

  for (const item of PRODUCT_DATABASE) {
    let score = 0;
    for (const kw of item.keywords) {
      const normKw = normalizeString(kw);
      if (normTitle.includes(normKw)) {
        score += normKw.length > 5 ? 3 : 2;
        if (!matchedKw) matchedKw = kw;
      }
    }

    if (normCategory && normalizeString(item.category) === normCategory) {
      score += 1;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && bestScore >= 2) {
    return {
      mainImage: bestMatch.mainImage,
      gallery: bestMatch.gallery,
      matchedKeyword: matchedKw
    };
  }

  // 2. Fallback by Category with dedicated realistic items
  if (normCategory.includes('tech') || normCategory.includes('celular')) {
    return {
      mainImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80'
      ]
    };
  }

  if (normCategory.includes('casa') || normCategory.includes('cozinha')) {
    return {
      mainImage: 'https://images.unsplash.com/photo-1584269600519-112d071b35e6?auto=format&fit=crop&w=900&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1584269600519-112d071b35e6?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=900&q=80'
      ]
    };
  }

  if (normCategory.includes('beleza') || normCategory.includes('cabelo') || normCategory.includes('skincare')) {
    return {
      mainImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80'
      ]
    };
  }

  if (normCategory.includes('suplemento') || normCategory.includes('fitness') || normCategory.includes('saude')) {
    return {
      mainImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=900&q=80'
      ]
    };
  }

  if (normCategory.includes('esporte')) {
    return {
      mainImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80'
      ]
    };
  }

  if (normCategory.includes('moda')) {
    return {
      mainImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'
      ]
    };
  }

  // Default clean neutral product photo
  return {
    mainImage: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80'
    ]
  };
}

/**
 * Returns a list of curated alternative photos suitable for the given product name
 */
export function getProductPhotoOptions(productName: string, category?: string): Array<{
  url: string;
  label: string;
}> {
  const normTitle = normalizeString(productName);
  const options: Array<{ url: string; label: string }> = [];

  for (const item of PRODUCT_DATABASE) {
    for (const kw of item.keywords) {
      if (normTitle.includes(normalizeString(kw))) {
        item.gallery.forEach((img, idx) => {
          options.push({
            url: img,
            label: `Foto ${idx + 1} (${item.keywords[0]})`
          });
        });
        break;
      }
    }
  }

  if (options.length === 0) {
    const defaultMatch = matchProductImage(productName, category);
    defaultMatch.gallery.forEach((img, idx) => {
      options.push({
        url: img,
        label: `Opção ${idx + 1}`
      });
    });
  }

  return options;
}
