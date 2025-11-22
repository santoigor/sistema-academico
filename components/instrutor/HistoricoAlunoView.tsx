'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, AlertCircle, CheckCircle2, XCircle, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Aluno, DiarioAula, AnotacaoAluno } from '@/lib/types';
import { useState } from 'react';

interface HistoricoAlunoViewProps {
  aluno: Aluno;
  diarios: DiarioAula[];
  anotacoes: AnotacaoAluno[];
}

export function HistoricoAlunoView({ aluno, diarios, anotacoes }: HistoricoAlunoViewProps) {
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos');
  const [paginaPresenca, setPaginaPresenca] = useState(1);
  const itensPorPaginaPresenca = 10;

  // Filtrar registros de presença do aluno em todos os diários
  const registrosPresenca = diarios
    .map((diario) => {
      const presenca = diario.presencas.find((p) => p.alunoId === aluno.id);
      if (!presenca) return null;
      return {
        diario,
        presenca,
      };
    })
    .filter((r) => r !== null)
    .sort((a, b) => new Date(b!.diario.data).getTime() - new Date(a!.diario.data).getTime());

  // Calcular estatísticas
  const totalAulas = registrosPresenca.length;
  const presentes = registrosPresenca.filter((r) => r!.presenca.status === 'presente').length;
  const ausentes = registrosPresenca.filter((r) => r!.presenca.status === 'ausente').length;
  const justificados = registrosPresenca.filter((r) => r!.presenca.status === 'justificado').length;
  const abonados = registrosPresenca.filter((r) => r!.presenca.status === 'abonado').length;
  const taxaPresenca = totalAulas > 0 ? Math.round((presentes / totalAulas) * 100) : 0;

  // Paginação de presença
  const totalPaginasPresenca = Math.ceil(registrosPresenca.length / itensPorPaginaPresenca);
  const inicioPresenca = (paginaPresenca - 1) * itensPorPaginaPresenca;
  const fimPresenca = inicioPresenca + itensPorPaginaPresenca;
  const registrosPresencaPaginados = registrosPresenca.slice(inicioPresenca, fimPresenca);

  // Filtrar anotações
  const anotacoesFiltradas =
    tipoFiltro === 'todos'
      ? anotacoes
      : anotacoes.filter((a) => a.tipo === tipoFiltro);

  const statusIcons = {
    presente: <CheckCircle2 className="h-4 w-4 text-green-600" />,
    ausente: <XCircle className="h-4 w-4 text-red-600" />,
    justificado: <HelpCircle className="h-4 w-4 text-yellow-600" />,
    abonado: <AlertCircle className="h-4 w-4 text-blue-600" />,
  };

  const statusLabels = {
    presente: 'Presente',
    ausente: 'Ausente',
    justificado: 'Justificado',
    abonado: 'Abonado',
  };

  const statusColors = {
    presente: 'default',
    ausente: 'destructive',
    justificado: 'secondary',
    abonado: 'default',
  } as const;

  const tipoAnotacaoColors = {
    comportamento: 'default',
    desempenho: 'accent',
    geral: 'secondary',
    alerta: 'destructive',
  } as const;

  const tipoAnotacaoLabels = {
    comportamento: 'Comportamento',
    desempenho: 'Desempenho',
    geral: 'Geral',
    alerta: 'Alerta',
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas de Presença */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Aulas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAulas}</div>
            <p className="text-xs text-muted-foreground">Aulas registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presenças</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{presentes}</div>
            <p className="text-xs text-muted-foreground">{taxaPresenca}% de presença</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faltas</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{ausentes}</div>
            <p className="text-xs text-muted-foreground">
              {justificados} justificadas, {abonados} abonadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anotações</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{anotacoes.length}</div>
            <p className="text-xs text-muted-foreground">Registros pedagógicos</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="presenca" className="w-full">
        <TabsList>
          <TabsTrigger value="presenca">Histórico de Presença</TabsTrigger>
          <TabsTrigger value="anotacoes">
            Anotações ({anotacoes.length})
          </TabsTrigger>
        </TabsList>

        {/* Aba de Presença */}
        <TabsContent value="presenca" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Presença</CardTitle>
              <CardDescription>
                Registro de presença do aluno em todas as aulas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {registrosPresenca.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  Nenhum registro de presença encontrado
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Aula</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Justificativa</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {registrosPresencaPaginados.map((registro) => (
                          <TableRow key={registro!.diario.id}>
                            <TableCell>
                              {new Date(registro!.diario.data).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{registro!.diario.aulaTitulo}</p>
                                <p className="text-xs text-muted-foreground">
                                  Aula #{registro!.diario.numeroAula}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={statusColors[registro!.presenca.status]}>
                                <span className="flex items-center gap-1">
                                  {statusIcons[registro!.presenca.status]}
                                  {statusLabels[registro!.presenca.status]}
                                </span>
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {registro!.presenca.justificativa || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Paginação */}
                  {totalPaginasPresenca > 1 && (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Mostrando {inicioPresenca + 1} a {Math.min(fimPresenca, registrosPresenca.length)} de {registrosPresenca.length} registros
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPaginaPresenca(paginaPresenca - 1)}
                          disabled={paginaPresenca === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Anterior
                        </Button>
                        <span className="text-sm">
                          Página {paginaPresenca} de {totalPaginasPresenca}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPaginaPresenca(paginaPresenca + 1)}
                          disabled={paginaPresenca === totalPaginasPresenca}
                        >
                          Próxima
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Anotações */}
        <TabsContent value="anotacoes" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Anotações Pedagógicas</CardTitle>
                  <CardDescription>
                    Observações registradas pelos instrutores
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant={tipoFiltro === 'todos' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setTipoFiltro('todos')}
                  >
                    Todas
                  </Badge>
                  {Object.entries(tipoAnotacaoLabels).map(([tipo, label]) => (
                    <Badge
                      key={tipo}
                      variant={tipoFiltro === tipo ? tipoAnotacaoColors[tipo as keyof typeof tipoAnotacaoColors] : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setTipoFiltro(tipo)}
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {anotacoesFiltradas.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  {tipoFiltro === 'todos'
                    ? 'Nenhuma anotação registrada ainda'
                    : `Nenhuma anotação do tipo "${tipoAnotacaoLabels[tipoFiltro as keyof typeof tipoAnotacaoLabels]}"`}
                </p>
              ) : (
                <div className="space-y-4">
                  {anotacoesFiltradas.map((anotacao) => (
                    <div
                      key={anotacao.id}
                      className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={tipoAnotacaoColors[anotacao.tipo]}>
                            {tipoAnotacaoLabels[anotacao.tipo]}
                          </Badge>
                          {anotacao.privada && (
                            <Badge variant="outline">Privada</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(anotacao.data).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <h4 className="font-semibold mb-1">{anotacao.titulo}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{anotacao.conteudo}</p>
                      <p className="text-xs text-muted-foreground">
                        Por: {anotacao.instrutorNome}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
