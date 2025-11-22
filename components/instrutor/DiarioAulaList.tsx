'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { DiarioAula } from '@/lib/types';

interface DiarioAulaListProps {
  diarios: DiarioAula[];
  turmaId: string;
  onDelete?: (diarioId: string) => void;
}

export function DiarioAulaList({ diarios, turmaId, onDelete }: DiarioAulaListProps) {
  const tipoLabels = {
    teorica: 'Teórica',
    pratica: 'Prática',
    avaliacao: 'Avaliação',
    revisao: 'Revisão',
  };

  const tipoColors = {
    teorica: 'default',
    pratica: 'accent',
    avaliacao: 'destructive',
    revisao: 'secondary',
  } as const;

  if (diarios.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-medium">Nenhum diário lançado</p>
        <p className="text-sm text-muted-foreground">
          Lance o primeiro diário para começar
        </p>
      </div>
    );
  }

  // Ordenar por data (mais recente primeiro)
  const diariosOrdenados = [...diarios].sort((a, b) =>
    new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Nº</TableHead>
            <TableHead>Aula</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-center">Presença</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {diariosOrdenados.map((diario) => {
            const presentes = diario.presencas.filter((p) => p.status === 'presente').length;
            const total = diario.presencas.length;
            const taxaPresenca = total > 0 ? Math.round((presentes / total) * 100) : 0;

            return (
              <TableRow key={diario.id}>
                <TableCell className="font-medium">
                  {new Date(diario.data).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>{diario.numeroAula}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{diario.aulaTitulo}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {diario.resumo}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={tipoColors[diario.tipo]}>
                    {tipoLabels[diario.tipo]}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div>
                    <p className="font-medium">
                      {presentes}/{total}
                    </p>
                    <p className="text-xs text-muted-foreground">{taxaPresenca}%</p>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/instrutor/turmas/${turmaId}/diario/${diario.id}`}>
                      <Button variant="ghost" size="icon" title="Ver/Editar">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(diario.id)}
                        title="Excluir"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
