'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function WeChatModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 浮动按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-8 flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors z-40"
        title="速卖通纯卖家交流群"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* 弹窗遮罩 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          {/* 弹窗内容 */}
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* 标题 */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">速卖通纯卖家交流群</h3>
              <p className="text-gray-600 text-sm">扫码加入，与优秀卖家一起交流</p>
            </div>

            {/* 二维码 */}
            <div className="flex justify-center mb-6">
              <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src="/erweima.jpg"
                  alt="速卖通纯卖家交流群二维码"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,' + encodeURIComponent(`
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                        <text x="50" y="55" font-size="12" text-anchor="middle" fill="#666">
                          二维码图片
                        </text>
                        <text x="50" y="70" font-size="8" text-anchor="middle" fill="#999">
                          请放置 erweima.jpg
                        </text>
                      </svg>
                    `);
                  }}
                />
              </div>
            </div>

            {/* 提示文字 */}
            <p className="text-center text-gray-500 text-xs">
              微信扫描上方二维码即可加入群聊
            </p>
          </div>
        </div>
      )}

      {/* 添加淡入动画 */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
