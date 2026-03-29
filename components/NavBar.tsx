'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Search } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: '速卖通数据分析', icon: BarChart3 },
  { href: '/wechat', label: '公众号关键词分析', icon: Search },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-14 gap-8">
          <span className="text-lg font-bold text-gray-900 shrink-0">数据分析工具集</span>
          <div className="flex gap-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
