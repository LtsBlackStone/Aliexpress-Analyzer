export interface Product {
  productId: string;
  visitors: number;
  conversionRate: number;
  addToCart: number;
  favorites: number;
  searchClickRate: number;
}

export type Category = '潜力商品' | '高转化低访客' | '高访客低转化';

export interface CategorizedProduct {
  productId: string;
  category: Category;
  recommendations: string;
}

export interface Statistics {
  avgVisitors: number;
  avgConversionRate: number;
  avgRatio: number;
  avgSearchClickRate: number;
  totalProducts: number;
  categorizedCount: number;
}

export const COLUMN_MAPPING = {
  PRODUCT_ID: '商品ID',
  VISITORS: '访客数',
  CONVERSION_RATE: '支付转化率',
  ADD_TO_CART: '商品加购人数',
  FAVORITES: '商品收藏人数',
  SEARCH_CLICK_RATE: '搜索点击率'
} as const;
