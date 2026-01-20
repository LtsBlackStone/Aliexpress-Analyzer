'use client';

import { RotateCcw } from 'lucide-react';

interface ResetButtonProps {
  onReset: () => void;
}

export default function ResetButton({ onReset }: ResetButtonProps) {
  return (
    <button
      onClick={onReset}
      className="fixed bottom-8 right-8 flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
    >
      <RotateCcw className="h-5 w-5" />
      清空数据并重新开始
    </button>
  );
}
