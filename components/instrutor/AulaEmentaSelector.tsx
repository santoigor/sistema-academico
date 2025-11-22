'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { CheckCircle2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AulaEmenta, DiarioAula } from '@/lib/types';
import { useEffect } from 'react';

interface AulaEmentaSelectorProps {
  aulas: AulaEmenta[];
  diarios: DiarioAula[];
  selectedAulaId: string;
  onSelectAula: (aulaId: string) => void;
}

export function AulaEmentaSelector({
  aulas,
  diarios,
  selectedAulaId,
  onSelectAula,
}: AulaEmentaSelectorProps) {
  // Criar mapa de aulas ministradas
  const aulasMinistradas = new Map<string, DiarioAula[]>();

  diarios.forEach((diario) => {
    const existing = aulasMinistradas.get(diario.aulaEmentaId) || [];
    aulasMinistradas.set(diario.aulaEmentaId, [...existing, diario]);
  });

  // Pré-selecionar primeira aula não dada
  useEffect(() => {
    if (!selectedAulaId && aulas.length > 0) {
      const primeiraAulaNaoDada = aulas.find((aula) => {
        const diariosAula = aulasMinistradas.get(aula.id) || [];
        return diariosAula.length === 0;
      });

      if (primeiraAulaNaoDada) {
        onSelectAula(primeiraAulaNaoDada.id);
      } else {
        // Se todas já foram dadas, seleciona a primeira
        onSelectAula(aulas[0].id);
      }
    }
  }, [aulas, selectedAulaId, onSelectAula, aulasMinistradas]);

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

  const aulaSelected = aulas.find((a) => a.id === selectedAulaId);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="aula-select" className="text-base font-semibold">
          Aula da Ementa *
        </Label>
        <p className="text-sm text-muted-foreground mt-1">
          Selecione qual aula você ministrou nesta data
        </p>
      </div>

      <Select value={selectedAulaId} onValueChange={onSelectAula}>
        <SelectTrigger id="aula-select" className="w-full">
          <SelectValue placeholder="Selecione uma aula..." />
        </SelectTrigger>
        <SelectContent>
          {aulas.map((aula) => {
            const diariosAula = aulasMinistradas.get(aula.id) || [];
            const foiMinistrada = diariosAula.length > 0;

            return (
              <SelectItem key={aula.id} value={aula.id}>
                <div className="flex items-center gap-2">
                  <span>
                    Aula {aula.numero}: {aula.titulo}
                  </span>
                  {foiMinistrada && (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  )}
                  <Badge variant={tipoColors[aula.tipo]} className="ml-2">
                    {tipoLabels[aula.tipo]}
                  </Badge>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {aulaSelected && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-semibold flex items-center gap-2">
                  Aula {aulaSelected.numero}: {aulaSelected.titulo}
                  {(() => {
                    const diariosAula = aulasMinistradas.get(aulaSelected.id) || [];
                    return diariosAula.length > 0 && (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    );
                  })()}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {aulaSelected.cargaHoraria}h de carga horária
                </p>
              </div>
              <Badge variant={tipoColors[aulaSelected.tipo]}>
                {tipoLabels[aulaSelected.tipo]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {(() => {
              const diariosAula = aulasMinistradas.get(aulaSelected.id) || [];
              return diariosAula.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  ✓ Esta aula já foi ministrada {diariosAula.length}x (última: {new Date(diariosAula[diariosAula.length - 1].data).toLocaleDateString('pt-BR')})
                </p>
              );
            })()}

            <div>
              <p className="text-sm font-medium mb-2">Objetivos:</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {aulaSelected.objetivos.map((obj, idx) => (
                  <li key={idx}>{obj}</li>
                ))}
              </ul>
            </div>

            {aulaSelected.conteudo.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Conteúdo Programático:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {aulaSelected.conteudo.map((cont, idx) => (
                    <li key={idx}>{cont}</li>
                  ))}
                </ul>
              </div>
            )}

            {aulaSelected.recursos && aulaSelected.recursos.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Recursos Necessários:</p>
                <p className="text-sm text-muted-foreground">
                  {aulaSelected.recursos.join(', ')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
