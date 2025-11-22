'use client';

import { useAuth } from '@/lib/auth-context';
import { useData } from '@/lib/data-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TurmaCard } from '@/components/instrutor/TurmaCard';
import { GraduationCap, Users, FileText, TrendingUp, Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Instrutor, Turma } from '@/lib/types';

export default function InstrutorPainelPage() {
  const { user } = useAuth();
  const { turmas, ementas, alunos, diarios } = useData();

  if (!user || user.role !== 'instrutor') {
    return null;
  }

  const instrutor = user as Instrutor;

  // Verificar se o instrutor tem turmas alocadas
  if (!instrutor.turmasAlocadas || instrutor.turmasAlocadas.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Bem-vindo, {instrutor.nome.split(' ')[0]}!
          </h2>
          <p className="text-muted-foreground mt-1">
            Aqui está um resumo das suas turmas e atividades
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Você não está alocado em nenhuma turma no momento</p>
            <p className="text-sm text-muted-foreground mt-2">
              Entre em contato com a coordenação para receber suas turmas
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filtrar turmas alocadas ao instrutor
  const minhasTurmas = turmas.filter((t) =>
    instrutor.turmasAlocadas?.includes(t.id) && t.status !== 'cancelada'
  );

  const turmasAtivas = minhasTurmas.filter((t) => t.status === 'em_andamento');

  // Calcular total de alunos
  const totalAlunos = minhasTurmas.reduce((sum, t) => sum + t.vagasOcupadas, 0);

  // Calcular diários lançados este mês
  const mesAtual = new Date().toISOString().slice(0, 7); // YYYY-MM
  const diariosDoMes = diarios.filter(
    (d) => d.instrutorId === instrutor.id && d.data.startsWith(mesAtual)
  ).length;

  // Calcular taxa média de presença
  const meusDiarios = diarios.filter((d) => d.instrutorId === instrutor.id);
  let totalPresencas = 0;
  let totalRegistros = 0;

  meusDiarios.forEach((diario) => {
    diario.presencas.forEach((presenca) => {
      totalRegistros++;
      if (presenca.status === 'presente') {
        totalPresencas++;
      }
    });
  });

  const taxaPresenca = totalRegistros > 0 ? Math.round((totalPresencas / totalRegistros) * 100) : 0;

  // Verificar se há aula agendada para hoje
  const hoje = new Date();
  const diaDaSemana = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'][hoje.getDay()];

  const turmaComAulaHoje = minhasTurmas.find((turma) => {
    // Verificar se hoje é um dia de aula da turma
    const temAulaHoje = turma.diasSemana.some(dia =>
      dia.toLowerCase().includes(diaDaSemana)
    );

    if (!temAulaHoje) return false;

    // Verificar se a turma está em andamento
    if (turma.status !== 'em_andamento') return false;

    // Verificar se não há diário já lançado hoje
    const dataHoje = hoje.toISOString().split('T')[0];
    const jaTemDiarioHoje = diarios.some(
      d => d.turmaId === turma.id && d.data === dataHoje
    );

    return !jaTemDiarioHoje;
  });

  const metricas = [
    {
      title: 'Turmas Ativas',
      value: turmasAtivas.length.toString(),
      icon: GraduationCap,
      description: `${minhasTurmas.length} no total`,
    },
    {
      title: 'Total de Alunos',
      value: totalAlunos.toString(),
      icon: Users,
      description: 'Em todas as turmas',
    },
    {
      title: 'Diários este Mês',
      value: diariosDoMes.toString(),
      icon: FileText,
      description: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
    },
    {
      title: 'Taxa de Presença',
      value: `${taxaPresenca}%`,
      icon: TrendingUp,
      description: 'Média geral',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Bem-vindo, {instrutor.nome.split(' ')[0]}!
        </h2>
        <p className="text-muted-foreground mt-1">
          Aqui está um resumo das suas turmas e atividades
        </p>
      </div>

      {/* Card de Aula Agendada para Hoje */}
      {turmaComAulaHoje && (
        <Card className="border-accent bg-accent/5">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-accent mb-1">
                    Sua aula começou!
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Você tem aula agendada para hoje: <strong>{turmaComAulaHoje.codigo}</strong> - {turmaComAulaHoje.ementa}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{turmaComAulaHoje.horario}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{turmaComAulaHoje.vagasOcupadas} alunos</span>
                    </div>
                  </div>
                  <Link href={`/instrutor/turmas/${turmaComAulaHoje.id}/diario/novo`}>
                    <Button variant="accent" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Iniciar Diário
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricas.map((metrica) => (
          <Card key={metrica.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metrica.title}</CardTitle>
              <metrica.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrica.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{metrica.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Minhas Turmas */}
      <div>
        <h3 className="text-2xl font-bold tracking-tight mb-4">Minhas Turmas</h3>
        {minhasTurmas.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Nenhuma turma alocada</p>
              <p className="text-sm text-muted-foreground">
                Entre em contato com a coordenação para receber suas turmas
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {minhasTurmas.map((turma) => {
              const ementa = ementas.find((e) => e.id === turma.ementaId);
              const turmasDiarios = diarios.filter((d) => d.turmaId === turma.id);
              return (
                <TurmaCard
                  key={turma.id}
                  turma={turma}
                  ementa={ementa}
                  diarios={turmasDiarios}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
