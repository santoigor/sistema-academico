'use client';

import { useData } from '@/lib/data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  GraduationCap,
  Users,
  UserPlus,
  TrendingUp,
  Calendar,
  FileText,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

export default function CoordenadorPainel() {
  const { turmas, alunos, instrutores, interessados, cursos } = useData();

  // Calculate metrics
  const turmasAtivas = turmas.filter(t => t.status === 'em_andamento').length;
  const turmasPlanejadas = turmas.filter(t => t.status === 'planejada').length;
  const turmasFinalizadas = turmas.filter(t => t.status === 'finalizada').length;

  const alunosAtivos = alunos.filter(a => a.status === 'ativo').length;
  const alunosConcluidos = alunos.filter(a => a.status === 'concluido').length;
  const alunosEvadidos = alunos.filter(a => a.status === 'evadido').length;

  const instrutoresAtivos = instrutores.filter(i => i.status === 'ativo').length;
  const totalInteressados = interessados.length;

  // Recent turmas
  const turmasRecentes = turmas
    .sort((a, b) => new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime())
    .slice(0, 5);

  // Status colors
  const statusColors = {
    planejada: 'default',
    em_andamento: 'accent',
    finalizada: 'success',
    cancelada: 'destructive',
  } as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Painel do Coordenador</h1>
        <p className="text-muted-foreground mt-1">Visão geral das atividades acadêmicas</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/coordenador/turmas/nova">
          <Card className="cursor-pointer hover:border-primary transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-sm font-medium">Nova Turma</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Cadastrar nova turma</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/coordenador/interessados/novo">
          <Card className="cursor-pointer hover:border-primary transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-sm font-medium">Novo Aluno</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Cadastrar novo aluno</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/coordenador/interessados/voluntarios/novo?cadastrarComoInstrutor=true">
          <Card className="cursor-pointer hover:border-primary transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-sm font-medium">Novo Instrutor</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Cadastrar novo instrutor</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/coordenador/relatorios">
          <Card className="cursor-pointer hover:border-primary transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <CardTitle className="text-sm font-medium">Relatórios</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Gerar relatórios PDF</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Turmas Metric */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Turmas</CardDescription>
            <CardTitle className="text-3xl font-semibold">{turmas.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Em andamento</span>
                <span className="font-medium text-accent">{turmasAtivas}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Planejadas</span>
                <span className="font-medium">{turmasPlanejadas}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Finalizadas</span>
                <span className="font-medium text-green-600">{turmasFinalizadas}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alunos Metric */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Alunos</CardDescription>
            <CardTitle className="text-3xl font-semibold">{alunos.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ativos</span>
                <span className="font-medium text-accent">{alunosAtivos}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Concluídos</span>
                <span className="font-medium text-green-600">{alunosConcluidos}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Evadidos</span>
                <span className="font-medium text-red-600">{alunosEvadidos}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instrutores Metric */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Instrutores</CardDescription>
            <CardTitle className="text-3xl font-semibold">{instrutores.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ativos</span>
                <span className="font-medium text-accent">{instrutoresAtivos}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Especialidades</span>
                <span className="font-medium">{cursos.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interessados Metric */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Interessados</CardDescription>
            <CardTitle className="text-3xl font-semibold">{totalInteressados}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-muted-foreground">Novos contatos</span>
              </div>
              <Link href="/coordenador/interessados">
                <Button variant="ghostPrimary" size="sm" className="w-full mt-2">
                  Ver lista completa
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Turmas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Turmas Recentes</CardTitle>
              <CardDescription>Últimas turmas cadastradas</CardDescription>
            </div>
            <Link href="/coordenador/turmas">
              <Button variant="ghost" size="sm">
                Ver todas
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {turmasRecentes.map((turma) => (
              <div
                key={turma.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{turma.codigo}</p>
                    <Badge variant={statusColors[turma.status]} className="text-xs">
                      {turma.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{turma.ementa}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {turma.dataInicio}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {turma.vagasOcupadas}/{turma.vagasTotal}
                    </span>
                  </div>
                </div>
                <Link href={`/coordenador/turmas/${turma.id}`}>
                  <Button variant="ghost" size="sm">
                    Detalhes
                  </Button>
                </Link>
              </div>
            ))}
            {turmasRecentes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <GraduationCap className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhuma turma cadastrada</p>
                <Link href="/coordenador/turmas/nova">
                  <Button variant="outlinePrimary" size="sm" className="mt-3">
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar primeira turma
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
