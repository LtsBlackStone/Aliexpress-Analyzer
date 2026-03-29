'use client';

import { useState } from 'react';
import KeywordSearch from '@/components/KeywordSearch';
import ArticleAnalysis from '@/components/ArticleAnalysis';
import { analyzeArticles } from '@/lib/wechatAnalyzer';
import { WeChatArticle, AnalysisResult } from '@/types/wechat';

export default function WeChatPage() {
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleSearch = async (params: {
    keyword: string;
    period: number;
    pages: number;
    sort: 'relevance' | 'time';
    mode: 'all' | 'title';
  }) => {
    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch('/api/search-articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '搜索请求失败');
      }

      const articles: WeChatArticle[] = data.articles || [];

      if (articles.length === 0) {
        setError('未找到相关文章，请尝试其他关键词');
        return;
      }

      const result = analyzeArticles(articles, params.keyword, params.period);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '搜索请求失败');
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {!analysisResult ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <KeywordSearch onSearch={handleSearch} isSearching={isSearching} />
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 max-w-2xl w-full text-center">
                {error}
              </div>
            )}
          </div>
        ) : (
          <ArticleAnalysis result={analysisResult} onReset={handleReset} />
        )}
      </div>
    </main>
  );
}
