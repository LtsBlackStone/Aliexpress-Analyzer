'use client';

import { CategorizedProduct, Statistics } from '@/types';
import { Download } from 'lucide-react';
import { exportToExcel } from '@/lib/exportExcel';

interface ResultsTableProps {
  products: CategorizedProduct[];
  statistics: Statistics;
}

export default function ResultsTable({ products, statistics }: ResultsTableProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case '潜力商品': return 'text-green-600 bg-green-50';
      case '高转化低访客': return 'text-blue-600 bg-blue-50';
      case '高访客低转化': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleExport = () => {
    exportToExcel(products, statistics);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div className="text-center flex-1">
          <h2 className="text-2xl font-bold mb-2">分析结果</h2>
          <p className="text-gray-600">
            共分析 {statistics.totalProducts} 个商品，其中 {statistics.categorizedCount} 个符合分类条件
          </p>
        </div>
        {products.length > 0 && (
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
          >
            <Download className="h-5 w-5" />
            导出结果
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-600">没有符合分类条件的商品</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">商品 ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">商品分类</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">运营建议</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{product.productId}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(product.category)}`}>
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-2xl whitespace-pre-line">
                    {product.recommendations}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
