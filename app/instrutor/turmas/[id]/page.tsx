'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useData } from '@/lib/data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProgressoEmenta } from '@/components/instrutor/ProgressoEmenta';
import { AvaliacaoFormDialog } from '@/components/instrutor/AvaliacaoFormDialog';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  FileEdit,
  List,
  ChevronLeft,
  ChevronRight,
  Search,
  ClipboardCheck,
} from 'lucide-react';
import Link from 'next/link';
import type { Instrutor } from '@/lib/types';
import type { AvaliacaoRealizadaFormData } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';

export default function TurmaDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { turmas, ementas, alunos, diarios, instrutores, addAvaliacao, getAvaliacoesByTurma } = useData();
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [avaliacaoDialogOpen, setAvaliacaoDialogOpen] = useState(false);
  const itensPorPagina = 10;
  const { toast } = useToast();

  const turmaId = params.id as string;

  if (!user || user.role !== 'instrutor') {
    return null;
  }

  const instrutor = user as Instrutor;
  const turma = turmas.find((t) => t.id === turmaId);

  // Verificar se o instrutor tem acesso a esta turma
  if (!turma || !instrutor.turmasAlocadas.includes(turma.id)) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg font-medium">Turma não encontrada</p>
        <p className="text-sm text-muted-foreground mb-4">
          Você não tem permissão para acessar esta turma
        </p>
        <Button onClick={() => router.push('/instrutor/turmas')}>
          Voltar para Minhas Turmas
        </Button>
      </div>
    );
  }

  const ementa = ementas.find((e) => e.id === turma.ementaId);
  const alunosTurma = alunos.filter((a) => turma.alunos.includes(a.id));
  const diariosTurma = diarios.filter((d) => d.turmaId === turma.id);
  const instrutorTurma = instrutores.find((i) => i.id === turma.instrutorId);
  const avaliacoesTurma = getAvaliacoesByTurma(turma.id);

  // Handler para lançar nova avaliação
  const handleLancarAvaliacao = (data: AvaliacaoRealizadaFormData) => {
    try {
      addAvaliacao({
        ...data,
        turmaId: turma.id,
      });
      toast({
        title: 'Avaliação lançada com sucesso!',
        description: `A avaliação "${data.titulo}" foi criada para a turma ${turma.codigo}`,
      });
    } catch (error) {
      toast({
        title: 'Erro ao lançar avaliação',
        description: 'Ocorreu um erro ao tentar criar a avaliação. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  // Calcular estatísticas dos alunos
  const calcularEstatisticasAluno = (alunoId: string) => {
    // Contar faltas
    let faltas = 0;
    let presencas = 0;

    diariosTurma.forEach((diario) => {
      const presencaAluno = diario.presencas.find((p) => p.alunoId === alunoId);
      if (presencaAluno) {
        if (presencaAluno.status === 'ausente') {
          faltas++;
        } else if (presencaAluno.status === 'presente') {
          presencas++;
        }
      }
    });

    // Calcular média (simulada - em um sistema real viria das avaliações)
    // Por enquanto, vamos simular baseado na frequência
    const totalAulas = diariosTurma.length;
    const percentualPresenca = totalAulas > 0 ? (presencas / totalAulas) * 100 : 0;

    // Média simulada: base de 7.0 + bônus por presença
    const mediaSimulada = totalAulas > 0
      ? Math.min(10, 7.0 + (percentualPresenca / 100) * 3).toFixed(1)
      : '-';

    return {
      faltas,
      media: mediaSimulada,
    };
  };

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

  // Filtrar alunos por pesquisa
  const alunosFiltrados = alunosTurma.filter((aluno) =>
    aluno.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
    aluno.email.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  // Paginação
  const totalPaginas = Math.ceil(alunosFiltrados.length / itensPorPagina);
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;
  const alunosPaginados = alunosFiltrados.slice(indiceInicial, indiceFinal);

  const irParaPagina = (pagina: number) => {
    setPaginaAtual(pagina);
  };

  // Reset página ao pesquisar
  const handlePesquisa = (termo: string) => {
    setTermoPesquisa(termo);
    setPaginaAtual(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => router.push('/instrutor/turmas')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{turma.codigo}</h2>
            <p className="text-muted-foreground mt-1">{turma.ementa}</p>
          </div>
          <Badge variant={statusColors[turma.status]}>{statusLabels[turma.status]}</Badge>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Link href={`/instrutor/turmas/${turma.id}/diario/novo`}>
          <Button variant="default">
            <FileEdit className="mr-2 h-4 w-4" />
            Lançar Novo Diário
          </Button>
        </Link>
        <Button variant="accent" onClick={() => setAvaliacaoDialogOpen(true)}>
          <ClipboardCheck className="mr-2 h-4 w-4" />
          Lançar Avaliação
        </Button>
        <Link href={`/instrutor/turmas/${turma.id}/diario`}>
          <Button variant="outlinePrimary">
            <List className="mr-2 h-4 w-4" />
            Ver Diários
          </Button>
        </Link>
      </div>

      {/* Informações da Turma */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Turma</CardTitle>
          <CardDescription>Detalhes e configurações</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-around space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Período</p>
              <p className="text-sm text-muted-foreground">
                {new Date(turma.dataInicio).toLocaleDateString('pt-BR')} até{' '}
                {new Date(turma.dataFim).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Horário</p>
              <p className="text-sm text-muted-foreground">
                {turma.horario} - {turma.diasSemana.join(', ')}
              </p>
            </div>
          </div>

          {turma.sala && (
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Sala</p>
                <p className="text-sm text-muted-foreground">{turma.sala}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Vagas</p>
              <p className="text-sm text-muted-foreground">
                {turma.vagasOcupadas} de {turma.vagasTotal} ocupadas
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Instrutor</p>
              <p className="text-sm text-muted-foreground">
                {instrutorTurma?.nome || turma.instrutor}
              </p>
            </div>
          </div>

          {turma.observacoes && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-1">Observações</p>
                <p className="text-sm text-muted-foreground">{turma.observacoes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Progresso da Ementa */}
      {ementa && (
        <ProgressoEmenta ementa={ementa} turmaId={turma.id} diarios={diariosTurma} />
      )}

      {/* Alunos Matriculados */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Alunos Matriculados</CardTitle>
              <CardDescription>
                {alunosFiltrados.length} de {alunosTurma.length} aluno(s)
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Pesquisar por nome ou email..."
                value={termoPesquisa}
                onChange={(e) => handlePesquisa(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {alunosTurma.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum aluno matriculado ainda
            </p>
          ) : alunosFiltrados.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum aluno encontrado com o termo "{termoPesquisa}"
            </p>
          ) : (
            <>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50%]">Nome</TableHead>
                      <TableHead className="text-center">Faltas</TableHead>
                      <TableHead className="text-center">Média</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alunosPaginados.map((aluno) => {
                      const stats = calcularEstatisticasAluno(aluno.id);
                      return (
                        <TableRow key={aluno.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="text-xs font-semibold text-primary">
                                  {aluno.nome.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">{aluno.nome}</p>
                                <p className="text-xs text-muted-foreground">{aluno.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`font-medium ${
                                stats.faltas > 3 ? 'text-destructive' : 'text-muted-foreground'
                              }`}
                            >
                              {stats.faltas}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`font-medium ${
                                stats.media === '-'
                                  ? 'text-muted-foreground'
                                  : parseFloat(stats.media) >= 7
                                  ? 'text-green-600'
                                  : parseFloat(stats.media) >= 5
                                  ? 'text-yellow-600'
                                  : 'text-destructive'
                              }`}
                            >
                              {stats.media}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={
                                aluno.status === 'ativo'
                                  ? 'default'
                                  : aluno.status === 'evadido'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {aluno.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href={`/instrutor/alunos/${aluno.id}`}>
                              <Button variant="ghost" size="sm">
                                Ver Detalhes
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação */}
              {totalPaginas > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {indiceInicial + 1} a {Math.min(indiceFinal, alunosFiltrados.length)} de{' '}
                    {alunosFiltrados.length} aluno(s)
                    {termoPesquisa && ` (filtrados de ${alunosTurma.length} total)`}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => irParaPagina(paginaAtual - 1)}
                      disabled={paginaAtual === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                        <Button
                          key={pagina}
                          variant={paginaAtual === pagina ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => irParaPagina(pagina)}
                          className="w-8"
                        >
                          {pagina}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => irParaPagina(paginaAtual + 1)}
                      disabled={paginaAtual === totalPaginas}
                    >
                      Próxima
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog para Lançar Avaliação */}
      <AvaliacaoFormDialog
        open={avaliacaoDialogOpen}
        onOpenChange={setAvaliacaoDialogOpen}
        onSubmit={handleLancarAvaliacao}
      />
    </div>
  );
}
