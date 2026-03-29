'use client';

import { AnalysisResult } from '@/types/wechat';
import { generateReportMarkdown } from '@/lib/wechatAnalyzer';
import { Download, RotateCcw } from 'lucide-react';

interface ArticleAnalysisProps {
  result: AnalysisResult;
  onReset: () => void;
}

export default function ArticleAnalysis({ result, onReset }: ArticleAnalysisProps) {
  const { titleAnalysis, topicCategories, interactionStats, topArticles } = result;

  const handleDownloadReport = () => {
    const markdown = generateReportMarkdown(result);
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.keyword}_关键词分析报告.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* 操作栏 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          「{result.keyword}」分析报告
        </h2>
        <div className="flex gap-3">
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4" />
            下载报告
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
          >
            <RotateCcw className="h-4 w-4" />
            重新搜索
          </button>
        </div>
      </div>

      {/* 数据概览 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">数据概览</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="分析文章数" value={`${result.totalArticles} 篇`} />
          <StatCard label="涉及公众号" value={`${result.uniqueAccounts} 个`} />
          <StatCard label="平均阅读量" value={interactionStats.avgReads.toLocaleString()} />
          <StatCard label="中位数阅读量" value={interactionStats.medianReads.toLocaleString()} />
          <StatCard label="最高阅读量" value={interactionStats.readRange.max.toLocaleString()} />
          <StatCard label="总阅读量" value={result.totalReads.toLocaleString()} />
          <StatCard label="平均点赞率" value={`${interactionStats.avgLikeRate}%`} />
          <StatCard label="时间范围" value={`最近 ${result.period} 天`} />
        </div>
      </div>

      {/* 标题分析 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">一、标题分析</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="平均标题长度" value={`${titleAnalysis.avgLength} 字`} />
          <StatCard label="含数字标题" value={`${titleAnalysis.hasNumberRate}%`} />
          <StatCard label="问句式标题" value={`${titleAnalysis.hasQuestionRate}%`} />
          <StatCard label="含情绪词标题" value={`${titleAnalysis.hasEmotionRate}%`} />
        </div>

        {/* 数字标题对比 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">含数字标题平均阅读</p>
            <p className="text-xl font-bold text-blue-600">
              {titleAnalysis.avgReadsWithNumber.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">不含数字标题平均阅读</p>
            <p className="text-xl font-bold text-gray-700">
              {titleAnalysis.avgReadsWithoutNumber.toLocaleString()}
            </p>
          </div>
        </div>

        {/* 长度分布 */}
        {titleAnalysis.lengthDistribution.some((d) => d.count > 0) && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">长度范围</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">文章数</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">平均阅读量</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {titleAnalysis.lengthDistribution
                  .filter((d) => d.count > 0)
                  .map((d) => (
                    <tr key={d.range}>
                      <td className="px-4 py-2 text-gray-900">{d.range}</td>
                      <td className="px-4 py-2 text-gray-600">{d.count}</td>
                      <td className="px-4 py-2 text-gray-600">{d.avgReads.toLocaleString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 话题归类 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">二、话题归类</h3>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">话题类型</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">文章数</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">占比</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">平均阅读</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topicCategories.map((cat) => (
                <tr key={cat.name}>
                  <td className="px-4 py-2 font-medium text-gray-900">{cat.name}</td>
                  <td className="px-4 py-2 text-gray-600">{cat.count}</td>
                  <td className="px-4 py-2 text-gray-600">{cat.percentage}%</td>
                  <td className="px-4 py-2 text-gray-600">{cat.avgReads.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 热门话题代表文章 */}
        {topicCategories.slice(0, 3).map((cat) => (
          <div key={cat.name} className="mb-4 last:mb-0">
            <h4 className="font-medium text-gray-800 mb-2">
              {cat.name}
              <span className="text-sm text-gray-500 ml-2">
                ({cat.count}篇，平均阅读 {cat.avgReads.toLocaleString()})
              </span>
            </h4>
            <ul className="space-y-1 pl-4">
              {cat.articles.slice(0, 2).map((a, i) => (
                <li key={i} className="text-sm">
                  <a
                    href={a.content_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {a.title}
                  </a>
                  <span className="text-gray-500 ml-2">
                    - 阅读 {(a.read_num || 0).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 互动数据 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">三、互动数据洞察</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            label="阅读量范围"
            value={`${interactionStats.readRange.min.toLocaleString()} - ${interactionStats.readRange.max.toLocaleString()}`}
          />
          <StatCard label="平均评论率" value={`${interactionStats.avgCommentRate}%`} />
          <StatCard label="平均点赞率" value={`${interactionStats.avgLikeRate}%`} />
        </div>

        <h4 className="font-medium text-gray-800 mb-3">点赞率分布</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{interactionStats.excellentLikeRate}%</p>
            <p className="text-sm text-gray-600 mt-1">优秀（&gt;1%）</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{interactionStats.goodLikeRate}%</p>
            <p className="text-sm text-gray-600 mt-1">良好（0.5-1%）</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-600">{interactionStats.normalLikeRate}%</p>
            <p className="text-sm text-gray-600 mt-1">一般（&lt;0.5%）</p>
          </div>
        </div>
      </div>

      {/* Top 文章列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top {topArticles.length} 高阅读量文章
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">排名</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">标题</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">公众号</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">阅读</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">点赞</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">点赞率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topArticles.map((a, i) => {
                const likeRate =
                  (a.read_num || 0) > 0
                    ? (((a.like_num || 0) / a.read_num) * 100).toFixed(1)
                    : '0.0';
                return (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-900 font-medium">{i + 1}</td>
                    <td className="px-4 py-2 max-w-xs">
                      <a
                        href={a.content_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline line-clamp-2"
                      >
                        {a.title}
                      </a>
                    </td>
                    <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{a.nickname}</td>
                    <td className="px-4 py-2 text-gray-600 whitespace-nowrap">
                      {(a.read_num || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-gray-600 whitespace-nowrap">
                      {(a.like_num || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{likeRate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}
