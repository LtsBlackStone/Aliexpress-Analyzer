'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface KeywordSearchProps {
  onSearch: (params: {
    keyword: string;
    period: number;
    pages: number;
    sort: 'relevance' | 'time';
    mode: 'all' | 'title';
  }) => void;
  isSearching: boolean;
}

export default function KeywordSearch({ onSearch, isSearching }: KeywordSearchProps) {
  const [keyword, setKeyword] = useState('');
  const [period, setPeriod] = useState(7);
  const [pages, setPages] = useState(3);
  const [sort, setSort] = useState<'relevance' | 'time'>('time');
  const [mode, setMode] = useState<'all' | 'title'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    onSearch({ keyword: keyword.trim(), period, pages, sort, mode });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-6">
          <Search className="mx-auto h-12 w-12 text-blue-500 mb-3" />
          <h2 className="text-xl font-semibold text-gray-900">微信公众号关键词搜索</h2>
          <p className="text-gray-500 text-sm mt-1">输入关键词，搜索并分析最近的公众号文章</p>
        </div>

        {/* 关键词输入 */}
        <div className="mb-5">
          <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
            搜索关键词
          </label>
          <input
            id="keyword"
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="例如：AI应用、Claude、人工智能"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            disabled={isSearching}
          />
        </div>

        {/* 参数设置 */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
              时间范围（天）
            </label>
            <select
              id="period"
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              disabled={isSearching}
            >
              <option value={1}>最近1天</option>
              <option value={3}>最近3天</option>
              <option value={7}>最近7天</option>
              <option value={14}>最近14天</option>
              <option value={30}>最近30天</option>
            </select>
          </div>

          <div>
            <label htmlFor="pages" className="block text-sm font-medium text-gray-700 mb-1">
              获取页数
            </label>
            <select
              id="pages"
              value={pages}
              onChange={(e) => setPages(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              disabled={isSearching}
            >
              <option value={1}>1页（约10篇）</option>
              <option value={2}>2页（约20篇）</option>
              <option value={3}>3页（约30篇）</option>
              <option value={5}>5页（约50篇）</option>
            </select>
          </div>

          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
              排序方式
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as 'relevance' | 'time')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              disabled={isSearching}
            >
              <option value="time">按时间排序</option>
              <option value="relevance">按相关性排序</option>
            </select>
          </div>

          <div>
            <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-1">
              搜索范围
            </label>
            <select
              id="mode"
              value={mode}
              onChange={(e) => setMode(e.target.value as 'all' | 'title')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              disabled={isSearching}
            >
              <option value="all">标题+正文</option>
              <option value="title">仅标题</option>
            </select>
          </div>
        </div>

        {/* 搜索按钮 */}
        <button
          type="submit"
          disabled={!keyword.trim() || isSearching}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSearching ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              搜索中...
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
              搜索并分析
            </>
          )}
        </button>
      </div>
    </form>
  );
}
