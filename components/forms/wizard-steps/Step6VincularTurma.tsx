'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap, Users, Calendar, Info } from 'lucide-react';
import type { Turma } from '@/lib/types';

interface Step6VincularTurmaProps {
  turmas: Turma[];
  turmaId?: string;
  onTurmaChange: (turmaId: string | undefined) => void;
  ementaNome?: string;
}

export function Step6VincularTurma({
  turmas,
  turmaId,
  onTurmaChange,
  ementaNome,
}: Step6VincularTurmaProps) {
  // Filtrar apenas turmas disponíveis (planejadas ou em andamento com vagas)
  const turmasDisponiveis = turmas.filter(
    (t) =>
      (t.status === 'planejada' || t.status === 'em_andamento') &&
      t.vagasOcupadas < t.vagasTotal
  );

  const turmaSelected = turmas.find((t) => t.id === turmaId);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Vincular à Turma (Opcional)</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Vincule o aluno diretamente a uma turma disponível ou deixe-o como interessado
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Se você não vincular o aluno agora, ele ficará como "interessado" na lista geral
          e poderá ser vinculado a uma turma posteriormente.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="turma">Selecionar Turma</Label>
          <Select
            value={turmaId || 'nenhuma'}
            onValueChange={(value) =>
              onTurmaChange(value === 'nenhuma' ? undefined : value)
            }
          >
            <SelectTrigger id="turma">
              <SelectValue placeholder="Nenhuma turma (deixar como interessado)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nenhuma">
                Nenhuma turma (deixar como interessado)
              </SelectItem>
              {turmasDisponiveis.map((turma) => {
                const vagasRestantes = turma.vagasTotal - turma.vagasOcupadas;
                return (
                  <SelectItem key={turma.id} value={turma.id}>
                    {turma.codigo} - {turma.ementa} ({vagasRestantes} vagas)
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Informações da Turma Selecionada */}
        {turmaSelected && (
          <div className="border rounded-lg p-4 bg-accent/5 space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              Detalhes da Turma
            </h4>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Código:</span>
                <span className="font-medium">{turmaSelected.codigo}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ementa:</span>
                <span className="font-medium">{turmaSelected.ementa}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge
                  variant={
                    turmaSelected.status === 'em_andamento'
                      ? 'default'
                      : 'outline'
                  }
                >
                  {turmaSelected.status === 'em_andamento'
                    ? 'Em Andamento'
                    : 'Planejada'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  Vagas:
                </span>
                <span className="font-medium">
                  {turmaSelected.vagasOcupadas} / {turmaSelected.vagasTotal}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Período:
                </span>
                <span className="font-medium text-xs">
                  {new Date(turmaSelected.dataInicio).toLocaleDateString(
                    'pt-BR'
                  )}{' '}
                  -{' '}
                  {new Date(turmaSelected.dataFim).toLocaleDateString('pt-BR')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Horário:</span>
                <span className="font-medium">{turmaSelected.horario}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Dias:</span>
                <span className="font-medium text-xs">
                  {turmaSelected.diasSemana.join(', ')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Turmas Disponíveis */}
        {!turmaSelected && turmasDisponiveis.length > 0 && (
          <div className="border rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground">
              Turmas Disponíveis ({turmasDisponiveis.length})
            </h4>
            <div className="space-y-2">
              {turmasDisponiveis.slice(0, 3).map((turma) => {
                const vagasRestantes = turma.vagasTotal - turma.vagasOcupadas;
                return (
                  <div
                    key={turma.id}
                    className="flex items-center justify-between p-2 bg-muted/30 rounded text-xs"
                  >
                    <div>
                      <p className="font-medium">{turma.codigo}</p>
                      <p className="text-muted-foreground">{turma.ementa}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {vagasRestantes} vagas
                    </Badge>
                  </div>
                );
              })}
              {turmasDisponiveis.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  + {turmasDisponiveis.length - 3} turmas
                </p>
              )}
            </div>
          </div>
        )}

        {turmasDisponiveis.length === 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Não há turmas disponíveis no momento. O aluno será cadastrado como
              interessado.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
