'use client';

import { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import ResultsTable from '@/components/ResultsTable';
import ResetButton from '@/components/ResetButton';
import WeChatModal from '@/components/WeChatModal';
import { processFile } from '@/lib/fileProcessor';
import { analyzeData } from '@/lib/dataAnalyzer';
import { CategorizedProduct, Statistics } from '@/types';

export default function Home() {
  const [currentView, setCurrentView] = useState<'upload' | 'results'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categorizedProducts, setCategorizedProducts] = useState<CategorizedProduct[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    avgVisitors: 0,
    avgConversionRate: 0,
    avgRatio: 0,
    avgSearchClickRate: 0,
    totalProducts: 0,
    categorizedCount: 0
  });

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      const products = await processFile(file);
      const result = analyzeData(products);

      setCategorizedProducts(result.categorizedProducts);
      setStatistics(result.statistics);
      setCurrentView('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : '文件处理失败');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setCurrentView('upload');
    setCategorizedProducts([]);
    setStatistics({
      avgVisitors: 0,
      avgConversionRate: 0,
      avgRatio: 0,
      avgSearchClickRate: 0,
      totalProducts: 0,
      categorizedCount: 0
    });
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">速卖通商品数据分析工具</h1>
          <p className="text-gray-600">上传您的商品数据，获取智能分类和运营建议</p>
        </header>

        {currentView === 'upload' ? (
          <FileUploader
            onFileSelect={handleFileSelect}
            isProcessing={isProcessing}
            error={error}
          />
        ) : (
          <>
            <ResultsTable
              products={categorizedProducts}
              statistics={statistics}
            />
            <ResetButton onReset={handleReset} />
          </>
        )}
      </div>

      {/* 微信二维码弹窗 */}
      <WeChatModal />
    </main>
  );
}
