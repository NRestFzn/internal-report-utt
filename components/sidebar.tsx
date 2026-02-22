'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {usePathname} from 'next/navigation';
import {LucideIcon, ChevronDown, ChevronRight} from 'lucide-react';
import {cn} from '@/lib/classname';

export interface MenuItem {
  title: string;
  icon: LucideIcon;
  href: string;
  exact?: boolean;
  children?: MenuItem[];
}

interface SidebarProps {
  menuItems: MenuItem[];
}

export default function Sidebar({menuItems}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const parentWithActiveChild = menuItems.find((item) =>
      item.children?.some((child) => pathname === child.href),
    );

    if (parentWithActiveChild) {
      setOpenMenu(parentWithActiveChild.title);
    }
  }, [pathname, menuItems]);

  const handleMenuClick = (item: MenuItem) => {
    if (item.children) {
      if (isCollapsed) setIsCollapsed(false);
      setOpenMenu(openMenu === item.title ? null : item.title);
    }
  };

  return (
    <aside
      className={cn(
        'h-screen bg-[#9A9FFF] text-white transition-all duration-300 relative flex flex-col shadow-xl z-40 shrink-0',
        isCollapsed ? 'w-22.5' : 'w-[320px]',
      )}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          'absolute -right-14 top-2 p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all group z-50 cursor-pointer border border-white/10 shadow-lg',
          'w-12 h-12 flex items-center justify-center',
        )}
      >
        <div className="grid grid-cols-2 gap-1.5">
          <div className="w-1.75 h-1.75 rounded-full border-2 border-white/80 group-hover:border-white transition-colors"></div>
          <div className="w-1.75 h-1.75 rounded-full border-2 border-white/80 group-hover:border-white transition-colors"></div>
          <div className="w-1.75 h-1.75 rounded-full border-2 border-white/80 group-hover:border-white transition-colors"></div>
          <div className="w-1.75 h-1.75 rounded-full border-2 border-white/80 group-hover:border-white transition-colors"></div>
        </div>
      </button>

      <div className="p-6 flex flex-col relative border-b border-white/10 min-h-40 justify-center overflow-hidden">
        <div
          className={cn(
            'flex flex-col items-center justify-center transition-all duration-300',
            isCollapsed ? 'scale-90' : 'scale-100',
          )}
        >
          <div className="relative w-61.5 h-35 mb-4">
            <Image
              src="/utt-main-logo.svg"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>

          <h1
            className={cn(
              'font-bold text-sm text-center leading-tight tracking-wider uppercase drop-shadow-sm transition-opacity duration-300 whitespace-nowrap',
              isCollapsed
                ? 'opacity-0 w-0 h-0 hidden'
                : 'opacity-100 w-auto h-auto block',
            )}
          >
            United Transworld Trading
          </h1>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => {
          const isChildActive = !!item.children?.some(
            (child) => pathname === child.href,
          );
          const isOpen = openMenu === item.title || isChildActive;

          const isActive =
            !item.children &&
            (item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`));

          return (
            <div key={item.title} className="flex flex-col">
              <div
                onClick={() => handleMenuClick(item)}
                className={cn(
                  'relative',
                  item.children ? 'cursor-pointer' : '',
                )}
              >
                {item.children ? (
                  <div
                    className={cn(
                      'flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 group relative select-none',
                      isChildActive
                        ? 'bg-[#293038]! text-white! shadow-lg font-semibold'
                        : 'hover:bg-white/10 text-white!',
                    )}
                  >
                    <div className="flex items-center justify-center min-w-6">
                      <item.icon size={26} className="text-white" />
                    </div>

                    <span
                      className={cn(
                        'whitespace-nowrap overflow-hidden text-base transition-all duration-300 origin-left flex-1',
                        isCollapsed
                          ? 'w-0 opacity-0 scale-0'
                          : 'w-auto opacity-100 scale-100 ml-2',
                      )}
                    >
                      {item.title}
                    </span>

                    {!isCollapsed && (
                      <div className="transition-transform duration-200">
                        {isOpen ? (
                          <ChevronDown size={18} className="text-white" />
                        ) : (
                          <ChevronRight size={18} className="text-white" />
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 group relative',
                      isActive
                        ? 'bg-[#293038]! text-white! shadow-lg font-semibold'
                        : 'hover:bg-white/10 text-white!',
                    )}
                  >
                    <div className="flex items-center justify-center min-w-6">
                      <item.icon size={26} className="text-white" />
                    </div>

                    <span
                      className={cn(
                        'whitespace-nowrap overflow-hidden text-base transition-all duration-300 origin-left',
                        isCollapsed
                          ? 'w-0 opacity-0 scale-0'
                          : 'w-auto opacity-100 scale-100 ml-2',
                      )}
                    >
                      {item.title}
                    </span>
                  </Link>
                )}

                {isCollapsed && (
                  <div className="absolute left-17.5 top-1/2 -translate-y-1/2 bg-[#293038] text-white text-sm px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-xl font-medium border border-white/10 pointer-events-none">
                    {item.title}
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-[#293038]"></div>
                  </div>
                )}
              </div>

              {item.children && isOpen && !isCollapsed && (
                <div className="ml-12 mt-1 space-y-1 border-l-2 border-white/20 pl-3">
                  {item.children.map((child) => {
                    const isChildItemActive = pathname === child.href;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'block py-2 px-3 rounded-lg text-sm transition-colors',
                          isChildItemActive
                            ? 'bg-[#293038]! text-white! font-semibold shadow-md translate-x-1'
                            : 'text-white! hover:bg-white/10',
                        )}
                      >
                        {child.title}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="p-6 text-xs text-center text-white/60 font-manrope border-t border-white/10 mx-4">
          © 2026 UTT System
        </div>
      )}
    </aside>
  );
}
