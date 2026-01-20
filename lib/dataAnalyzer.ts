import { Product, CategorizedProduct, Category, Statistics } from '@/types';
import { getRecommendations } from './recommendations';

export function analyzeData(products: Product[]): {
  categorizedProducts: CategorizedProduct[];
  statistics: Statistics;
} {
  if (products.length === 0) {
    return { categorizedProducts: [], statistics: createEmptyStats() };
  }

  const statistics = calculateStatistics(products);
  const categorizedProducts = categorizeProducts(products, statistics);

  return { categorizedProducts, statistics };
}

function calculateRatio(favorites: number, cart: number, visitors: number): number {
  if (visitors === 0) return 0;
  return (favorites + cart) / visitors;
}

function calculateStatistics(products: Product[]): Statistics {
  const totalProducts = products.length;
  const avgVisitors = products.reduce((sum, p) => sum + p.visitors, 0) / totalProducts;
  const avgConversionRate = products.reduce((sum, p) => sum + p.conversionRate, 0) / totalProducts;
  const avgRatio = products.reduce((sum, p) => {
    return sum + calculateRatio(p.favorites, p.addToCart, p.visitors);
  }, 0) / totalProducts;
  const avgSearchClickRate = products.reduce((sum, p) => sum + p.searchClickRate, 0) / totalProducts;

  return {
    avgVisitors,
    avgConversionRate,
    avgRatio,
    avgSearchClickRate,
    totalProducts,
    categorizedCount: 0
  };
}

function categorizeProducts(products: Product[], stats: Statistics): CategorizedProduct[] {
  const categorized: CategorizedProduct[] = [];

  for (const product of products) {
    const category = determineCategory(product, stats);
    if (category) {
      categorized.push({
        productId: product.productId,
        category,
        recommendations: getRecommendations(category)
      });
    }
  }

  stats.categorizedCount = categorized.length;
  return categorized;
}

function determineCategory(product: Product, stats: Statistics): Category | null {
  const ratio = calculateRatio(product.favorites, product.addToCart, product.visitors);

  // Priority 1: 潜力商品 (Ratio > Avg_Ratio 且 搜索点击率 > 平均搜索点击率 且 Ratio > 10%)
  if (ratio > stats.avgRatio && product.searchClickRate > stats.avgSearchClickRate && ratio > 0.1) {
    return '潜力商品';
  }

  // Priority 2: 高转化低访客
  if (product.conversionRate > stats.avgConversionRate && product.visitors < stats.avgVisitors) {
    return '高转化低访客';
  }

  // Priority 3: 高访客低转化
  if (product.visitors > stats.avgVisitors && product.conversionRate < stats.avgConversionRate) {
    return '高访客低转化';
  }

  return null;
}

function createEmptyStats(): Statistics {
  return {
    avgVisitors: 0,
    avgConversionRate: 0,
    avgRatio: 0,
    avgSearchClickRate: 0,
    totalProducts: 0,
    categorizedCount: 0
  };
}
