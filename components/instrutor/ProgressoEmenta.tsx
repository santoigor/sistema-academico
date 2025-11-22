'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import type { Ementa, DiarioAula, AulaEmenta } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ProgressoEmentaProps {
  ementa: Ementa;
  turmaId: string;
  diarios: DiarioAula[];
}

export function ProgressoEmenta({ ementa, turmaId, diarios }: ProgressoEmentaProps) {
  const [aulaAtualExpandida, setAulaAtualExpandida] = useState(false);
  const [proximaAula1Expandida, setProximaAula1Expandida] = useState(false);
  const [proximaAula2Expandida, setProximaAula2Expandida] = useState(false);

  // Criar um mapa de aulas ministradas por aulaEmentaId
  const aulasMinistradas = new Map<string, DiarioAula[]>();

  diarios.forEach((diario) => {
    const existing = aulasMinistradas.get(diario.aulaEmentaId) || [];
    aulasMinistradas.set(diario.aulaEmentaId, [...existing, diario]);
  });

  const totalAulas = ementa.aulas.length;
  const aulasCompletas = aulasMinistradas.size;
  const progresso = totalAulas > 0 ? Math.round((aulasCompletas / totalAulas) * 100) : 0;

  // Encontrar aula atual (última ministrada) e próximas 2 aulas
  const aulasOrdenadas = [...ementa.aulas].sort((a, b) => a.numero - b.numero);
  let aulaAtual: AulaEmenta | null = null;
  const proximasAulas: AulaEmenta[] = [];

  // Encontrar última aula ministrada
  for (let i = aulasOrdenadas.length - 1; i >= 0; i--) {
    if (aulasMinistradas.has(aulasOrdenadas[i].id)) {
      aulaAtual = aulasOrdenadas[i];
      break;
    }
  }

  // Encontrar próximas 2 aulas não ministradas
  for (const aula of aulasOrdenadas) {
    if (!aulasMinistradas.has(aula.id)) {
      proximasAulas.push(aula);
      if (proximasAulas.length === 2) break;
    }
  }

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

  const AulaCard = ({
    aula,
    label,
    isExpanded,
    toggleExpanded,
  }: {
    aula: AulaEmenta;
    label: string;
    isExpanded: boolean;
    toggleExpanded: () => void;
  }) => (
    <div className="border rounded-lg overflow-hidden">
      <div
        onClick={toggleExpanded}
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-accent/50 transition-colors"
      >
        <div className="flex-1">
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm">
              Aula {aula.numero}: {aula.titulo}
            </p>
            <Badge variant={tipoColors[aula.tipo]} className="text-xs">
              {tipoLabels[aula.tipo]}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{aula.cargaHoraria}h</p>
        </div>
        <Button variant="ghost" size="sm" className="ml-2">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="border-t p-4 bg-accent/5 space-y-3">
          <div>
            <p className="text-sm font-medium mb-2">Objetivos:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {aula.objetivos.map((obj, idx) => (
                <li key={idx}>{obj}</li>
              ))}
            </ul>
          </div>

          {aula.conteudo.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Conteúdo Programático:</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {aula.conteudo.map((cont, idx) => (
                  <li key={idx}>{cont}</li>
                ))}
              </ul>
            </div>
          )}

          {aula.atividadesPraticas && aula.atividadesPraticas.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Atividades Práticas:</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {aula.atividadesPraticas.map((ativ, idx) => (
                  <li key={idx}>{ativ}</li>
                ))}
              </ul>
            </div>
          )}

          {aula.recursos && aula.recursos.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Recursos Necessários:</p>
              <p className="text-sm text-muted-foreground">{aula.recursos.join(', ')}</p>
            </div>
          )}

          {aula.observacoes && (
            <div>
              <p className="text-sm font-medium mb-2">Observações:</p>
              <p className="text-sm text-muted-foreground">{aula.observacoes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Progresso da Ementa</CardTitle>
            <CardDescription>{ementa.titulo}</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                Ver Ementa Completa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{ementa.titulo}</DialogTitle>
                <DialogDescription>{ementa.descricao}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div>
                  <p className="text-sm font-medium mb-2">Objetivos Gerais:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {ementa.objetivosGerais.map((obj, idx) => (
                      <li key={idx}>{obj}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Aulas ({ementa.aulas.length}):</p>
                  <div className="space-y-2">
                    {aulasOrdenadas.map((aula) => {
                      const foiMinistrada = aulasMinistradas.has(aula.id);
                      return (
                        <div
                          key={aula.id}
                          className="flex items-center gap-2 p-2 border rounded text-sm"
                        >
                          <CheckCircle2
                            className={`h-4 w-4 ${
                              foiMinistrada ? 'text-primary' : 'text-muted-foreground'
                            }`}
                          />
                          <span className="flex-1">
                            Aula {aula.numero}: {aula.titulo}
                          </span>
                          <Badge variant={tipoColors[aula.tipo]}>
                            {tipoLabels[aula.tipo]}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {ementa.materialDidatico && ementa.materialDidatico.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Material Didático:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {ementa.materialDidatico.map((mat, idx) => (
                        <li key={idx}>{mat}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {ementa.avaliacoes && ementa.avaliacoes.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Avaliações:</p>
                    <div className="space-y-2">
                      {ementa.avaliacoes.map((av) => (
                        <div key={av.id} className="p-2 border rounded text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{av.titulo}</span>
                            <Badge variant="secondary">{av.peso}%</Badge>
                          </div>
                          {av.descricao && (
                            <p className="text-xs text-muted-foreground">{av.descricao}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Aulas Ministradas</span>
            <span className="font-semibold text-primary">
              {aulasCompletas}/{totalAulas}
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full transition-all"
              style={{ width: `${progresso}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{progresso}% concluído</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {aulaAtual && (
          <AulaCard
            aula={aulaAtual}
            label="Aula Atual (Última Ministrada)"
            isExpanded={aulaAtualExpandida}
            toggleExpanded={() => setAulaAtualExpandida(!aulaAtualExpandida)}
          />
        )}

        {proximasAulas.length > 0 && (
          <AulaCard
            aula={proximasAulas[0]}
            label="Próxima Aula"
            isExpanded={proximaAula1Expandida}
            toggleExpanded={() => setProximaAula1Expandida(!proximaAula1Expandida)}
          />
        )}

        {proximasAulas.length > 1 && (
          <AulaCard
            aula={proximasAulas[1]}
            label="Próxima Aula (2)"
            isExpanded={proximaAula2Expandida}
            toggleExpanded={() => setProximaAula2Expandida(!proximaAula2Expandida)}
          />
        )}

        {!aulaAtual && proximasAulas.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma aula disponível na ementa
          </p>
        )}
      </CardContent>
    </Card>
  );
}
