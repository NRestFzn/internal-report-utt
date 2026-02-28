'use client';

import Header from '@/components/header';
import Sidebar, {MenuItem} from '@/components/sidebar';
import {LayoutDashboard, FileText, Monitor, Settings} from 'lucide-react';

const userMenuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    exact: true,
  },
  {
    title: 'Reports',
    icon: FileText,
    href: '/dashboard/reports',
  },
  {
    title: 'Monitoring',
    icon: Monitor,
    href: '/dashboard/monitoring',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
  },
];

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-brand-gradient overflow-hidden">
      <Sidebar menuItems={userMenuItems} />

      <div className="flex-1 flex flex-col h-full min-w-0">
        <div className="shrink-0 z-10">
          <Header logoutRedirectUri="/login" />
        </div>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 pt-2 scroll-smooth w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
