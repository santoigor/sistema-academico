'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, BookOpen, FileEdit } from 'lucide-react';
import Link from 'next/link';
import type { Turma, Ementa, DiarioAula } from '@/lib/types';

interface TurmaCardProps {
  turma: Turma;
  ementa: Ementa | undefined;
  diarios: DiarioAula[];
}

export function TurmaCard({ turma, ementa, diarios }: TurmaCardProps) {
  const totalAulas = ementa?.aulas.length || 0;
  const aulasMinistradas = diarios.length;
  const progresso = totalAulas > 0 ? Math.round((aulasMinistradas / totalAulas) * 100) : 0;

  const statusColors = {
    planejada: 'default',
    em_andamento: 'accent',
    finalizada: 'success',
    cancelada: 'destructive',
  } as const;

  const statusLabels = {
    planejada: 'Planejada',
    em_andamento: 'Em Andamento',
    finalizada: 'Finalizada',
    cancelada: 'Cancelada',
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{turma.codigo}</CardTitle>
            <CardDescription className="mt-1">{turma.ementa}</CardDescription>
          </div>
          <Badge variant={statusColors[turma.status]}>
            {statusLabels[turma.status]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {new Date(turma.dataInicio).toLocaleDateString('pt-BR')} -{' '}
            {new Date(turma.dataFim).toLocaleDateString('pt-BR')}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            {turma.horario} - {turma.diasSemana.join(', ')}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            {turma.vagasOcupadas}/{turma.vagasTotal} alunos
          </span>
        </div>

        {ementa && (
          <div className="pt-2">
            <div className="flex items-center justify-between text-sm mb-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>Progresso das Aulas</span>
              </div>
              <span className="font-semibold text-primary">
                {aulasMinistradas}/{totalAulas}
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${progresso}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {progresso}% concluído
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Link href={`/instrutor/turmas/${turma.id}/diario/novo`} className="flex-1">
          <Button variant="default" className="w-full" size="sm">
            <FileEdit className="mr-2 h-4 w-4" />
            Lançar Diário
          </Button>
        </Link>
        <Link href={`/instrutor/turmas/${turma.id}`}>
          <Button variant="outlinePrimary" size="sm">
            Ver Detalhes
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
