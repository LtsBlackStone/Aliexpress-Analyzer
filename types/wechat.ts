export interface WeChatArticle {
  title: string;
  digest: string;
  content_url: string;
  cover: string;
  datetime: string;
  nickname: string;
  read_num: number;
  like_num: number;
  comment_num: number;
}

export interface SearchParams {
  keyword: string;
  period: number;
  pages: number;
  sort: 'relevance' | 'time';
  mode: 'all' | 'title';
}

export interface SearchResult {
  keyword: string;
  period: number;
  collected_at: string;
  total: number;
  articles: WeChatArticle[];
}

export interface TitleAnalysis {
  avgLength: number;
  lengthDistribution: { range: string; count: number; avgReads: number }[];
  hasNumberRate: number;
  hasQuestionRate: number;
  hasEmotionRate: number;
  avgReadsWithNumber: number;
  avgReadsWithoutNumber: number;
  avgReadsWithQuestion: number;
  avgReadsWithoutQuestion: number;
}

export interface TopicCategory {
  name: string;
  count: number;
  percentage: number;
  avgReads: number;
  articles: WeChatArticle[];
}

export interface InteractionStats {
  totalArticles: number;
  readRange: { min: number; max: number };
  avgReads: number;
  medianReads: number;
  avgLikeRate: number;
  avgCommentRate: number;
  excellentLikeRate: number;
  goodLikeRate: number;
  normalLikeRate: number;
}

export interface AnalysisResult {
  keyword: string;
  period: number;
  totalArticles: number;
  uniqueAccounts: number;
  totalReads: number;
  titleAnalysis: TitleAnalysis;
  topicCategories: TopicCategory[];
  interactionStats: InteractionStats;
  topArticles: WeChatArticle[];
}
