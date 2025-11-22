'use client';

import { useAuth } from '@/lib/auth-context';
import { useData } from '@/lib/data-context';
import { TurmaCard } from '@/components/instrutor/TurmaCard';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap } from 'lucide-react';
import type { Instrutor } from '@/lib/types';

export default function InstrutorTurmasPage() {
  const { user } = useAuth();
  const { turmas, ementas, diarios } = useData();

  if (!user || user.role !== 'instrutor') {
    return null;
  }

  const instrutor = user as Instrutor;

  // Verificar se o instrutor tem turmas alocadas
  if (!instrutor.turmasAlocadas || instrutor.turmasAlocadas.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Minhas Turmas</h2>
          <p className="text-muted-foreground mt-1">
            Gerencie e acompanhe todas as suas turmas
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
    instrutor.turmasAlocadas?.includes(t.id)
  );

  const turmasPlanejadas = minhasTurmas.filter((t) => t.status === 'planejada');
  const turmasEmAndamento = minhasTurmas.filter((t) => t.status === 'em_andamento');
  const turmasFinalizadas = minhasTurmas.filter((t) => t.status === 'finalizada');

  const renderTurmas = (turmasList: typeof minhasTurmas) => {
    if (turmasList.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Nenhuma turma encontrada</p>
            <p className="text-sm text-muted-foreground">
              Não há turmas neste status no momento
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {turmasList.map((turma) => {
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
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Minhas Turmas</h2>
        <p className="text-muted-foreground mt-1">
          Gerencie e acompanhe todas as suas turmas
        </p>
      </div>

      <Tabs defaultValue="todas" className="w-full">
        <TabsList>
          <TabsTrigger value="todas">
            Todas ({minhasTurmas.length})
          </TabsTrigger>
          <TabsTrigger value="planejadas">
            Planejadas ({turmasPlanejadas.length})
          </TabsTrigger>
          <TabsTrigger value="andamento">
            Em Andamento ({turmasEmAndamento.length})
          </TabsTrigger>
          <TabsTrigger value="finalizadas">
            Finalizadas ({turmasFinalizadas.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todas" className="mt-6">
          {renderTurmas(minhasTurmas)}
        </TabsContent>

        <TabsContent value="planejadas" className="mt-6">
          {renderTurmas(turmasPlanejadas)}
        </TabsContent>

        <TabsContent value="andamento" className="mt-6">
          {renderTurmas(turmasEmAndamento)}
        </TabsContent>

        <TabsContent value="finalizadas" className="mt-6">
          {renderTurmas(turmasFinalizadas)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
