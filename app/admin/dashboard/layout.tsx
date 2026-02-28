'use client';

import Sidebar, {MenuItem} from '@/components/sidebar';
import Header from '../../../components/header';
import {
  LayoutDashboard,
  Users,
  Database,
  Calendar,
  ClipboardCheck,
  History,
  Settings,
  FileText,
  Tags,
} from 'lucide-react';

const adminMenuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin/dashboard',
    exact: true,
  },
  {
    title: 'User Management',
    icon: Users,
    href: '/admin/dashboard/user',
  },
  {
    title: 'Master Data',
    icon: Database,
    href: '#',
    children: [
      {
        title: 'Role',
        icon: Tags,
        href: '/admin/dashboard/master/role',
      },
      {
        title: 'Category',
        icon: Tags,
        href: '/admin/dashboard/master/category',
      },
      {
        title: 'MOP Documents',
        icon: FileText,
        href: '/admin/dashboard/master/mop',
      },
    ],
  },
  {
    title: 'Task Schedule',
    icon: Calendar,
    href: '/admin/dashboard/schedule',
  },
  {
    title: 'Monitoring',
    icon: ClipboardCheck,
    href: '/admin/dashboard/monitoring',
  },
  {
    title: 'Report History',
    icon: History,
    href: '/admin/dashboard/history',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/admin/dashboard/settings',
  },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-brand-gradient overflow-hidden">
      <Sidebar menuItems={adminMenuItems} />

      <div className="flex-1 flex flex-col h-full min-w-0">
        <div className="shrink-0 z-10">
          <Header logoutRedirectUri="/admin/login" />
        </div>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 pt-2 scroll-smooth w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
