'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { LayoutDashboard, Users, GraduationCap, UserPlus, BookOpen, FileText, LogOut, Menu, ChevronDown, ChevronRight, Heart, UserCircle, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CoordenadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [interessadosOpen, setInteressadosOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else if (user.role !== 'coordenador' && user.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  // Auto-open Interessados submenu when on interessados pages
  useEffect(() => {
    if (pathname.startsWith('/coordenador/interessados')) {
      setInteressadosOpen(true);
    }
  }, [pathname]);

  if (!user || (user.role !== 'coordenador' && user.role !== 'admin')) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const menuItems = [
    {
      title: 'Painel',
      icon: LayoutDashboard,
      href: '/coordenador/painel',
    },
    {
      title: 'Turmas',
      icon: GraduationCap,
      href: '/coordenador/turmas',
    },
    {
      title: 'Alunos',
      icon: Users,
      href: '/coordenador/alunos',
    },
    {
      title: 'Instrutores',
      icon: UserPlus,
      href: '/coordenador/instrutores',
    },
    {
      title: 'Ementas',
      icon: BookOpen,
      href: '/coordenador/ementas',
    },
    {
      title: 'Métricas',
      icon: BarChart3,
      href: '/coordenador/metricas',
    },
    {
      title: 'Relatórios',
      icon: FileText,
      href: '/coordenador/relatorios',
    },
  ];

  const interessadosSubmenu = [
    {
      title: 'Voluntários',
      href: '/coordenador/interessados/voluntarios',
      icon: Heart,
    },
    {
      title: 'Alunos',
      href: '/coordenador/interessados/alunos',
      icon: UserCircle,
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 border-r bg-card overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-sm">Sistema Acadêmico</h2>
                <p className="text-xs text-muted-foreground">Coordenador</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {user.nome.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.nome}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 p-4">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${isActive ? 'bg-accent' : ''}`}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Button>
                  </Link>
                );
              })}

              {/* Interessados with submenu */}
              <div>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${pathname.startsWith('/coordenador/interessados') ? 'bg-accent' : ''}`}
                  onClick={() => setInteressadosOpen(!interessadosOpen)}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Interessados
                  {interessadosOpen ? (
                    <ChevronDown className="ml-auto h-4 w-4" />
                  ) : (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </Button>
                {interessadosOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    {interessadosSubmenu.map((subItem) => {
                      const isSubActive = pathname === subItem.href;
                      return (
                        <Link key={subItem.href} href={subItem.href}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`w-full justify-start ${isSubActive ? 'bg-accent' : ''}`}
                          >
                            <subItem.icon className="mr-2 h-4 w-4" />
                            {subItem.title}
                          </Button>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>
          </ScrollArea>

          <Separator />

          {/* Logout */}
          <div className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold">Coordenação Acadêmica</h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
