'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { LayoutDashboard, GraduationCap, Users, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function InstrutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else if (user.role !== 'instrutor') {
      router.push('/');
    }
  }, [user, router]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user || user.role !== 'instrutor') {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleMenuToggle = () => {
    if (window.innerWidth >= 1024) {
      // Desktop: toggle collapsed state
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      // Mobile: toggle open/close
      setSidebarOpen(!sidebarOpen);
    }
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/instrutor/painel',
    },
    {
      title: 'Minhas Turmas',
      icon: GraduationCap,
      href: '/instrutor/turmas',
    },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
        } fixed lg:relative lg:translate-x-0 z-50 w-64 h-full transition-all duration-300 border-r bg-card`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`p-6 border-b ${sidebarCollapsed ? 'lg:p-4' : ''}`}>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              {!sidebarCollapsed && (
                <div className="lg:block">
                  <h2 className="font-semibold text-sm">Sistema Acadêmico</h2>
                  <p className="text-xs text-muted-foreground">Instrutor</p>
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className={`p-4 border-b ${sidebarCollapsed ? 'lg:p-2' : ''}`}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-primary">
                  {user.nome.charAt(0)}
                </span>
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0 lg:block">
                  <p className="text-sm font-medium truncate">{user.nome}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className={`flex-1 ${sidebarCollapsed ? 'lg:p-2' : 'p-4'}`}>
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                return (
                  <Link key={item.href} href={item.href} onClick={() => {
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}>
                    <Button
                      variant="ghost"
                      className={`w-full mb-1 ${isActive ? 'bg-accent' : ''} ${
                        sidebarCollapsed ? 'lg:justify-center lg:px-2' : 'justify-start'
                      }`}
                      title={sidebarCollapsed ? item.title : undefined}
                    >
                      <item.icon className={`h-4 w-4 ${sidebarCollapsed ? 'lg:mr-0' : 'mr-2'}`} />
                      {!sidebarCollapsed && <span className="lg:inline">{item.title}</span>}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          <Separator />

          {/* Logout */}
          <div className={`p-4 ${sidebarCollapsed ? 'lg:p-2' : ''}`}>
            <Button
              variant="ghost"
              className={`w-full text-destructive hover:text-destructive hover:bg-destructive/10 ${
                sidebarCollapsed ? 'lg:justify-center lg:px-2' : 'justify-start'
              }`}
              onClick={handleLogout}
              title={sidebarCollapsed ? 'Sair' : undefined}
            >
              <LogOut className={`h-4 w-4 ${sidebarCollapsed ? 'lg:mr-0' : 'mr-2'}`} />
              {!sidebarCollapsed && <span className="lg:inline">Sair</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Content */}
        <main className="flex-1 overflow-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
