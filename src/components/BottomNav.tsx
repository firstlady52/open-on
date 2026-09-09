'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const menus = [
    { label: '홈', path: '/' },
    { label: '캘린더', path: '/calendar' },
    { label: '과업', path: '/projects' },
    { label: '강사', path: '/instructors' },
    { label: '더보기', path: '/more' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50">
      <div className="max-w-md mx-auto flex justify-around py-2.5">
        {menus.map((menu) => {
          const active = pathname === menu.path;
          return (
            <Link
              key={menu.path}
              href={menu.path}
              className={`flex flex-col items-center text-xs transition-colors ${
                active ? 'text-teal-700 font-bold' : 'text-slate-400 font-normal'
              }`}
            >
              <span className={`w-1 h-1 rounded-full mb-1 ${active ? 'bg-teal-700' : 'bg-transparent'}`} />
              {menu.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
