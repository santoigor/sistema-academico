'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/lib/data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AvaliacaoFormDialog } from '@/components/instrutor/AvaliacaoFormDialog';
import { CancelamentoAulaDialog } from '@/components/coordenador/CancelamentoAulaDialog';
import {
  ArrowLeft,
  Edit,
  Calendar,
  Clock,
  Users,
  BookOpen,
  Trash2,
  CheckCircle,
  XCircle,
  Plus,
  Ban,
  CalendarClock,
  UserMinus,
  GraduationCap as GraduationCapIcon,
  ClipboardCheck,
} from 'lucide-react';
import Link from 'next/link';
import type { AulaEmenta, AulaCancelada } from '@/lib/types';
import type { AvaliacaoRealizadaFormData } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';

export default function TurmaDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getTurma, deleteTurma, updateTurma, getEmenta, alunos, instrutores, addAvaliacao } = useData();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showFinalizeDialog, setShowFinalizeDialog] = useState(false);
  const [showAddAvaliacaoDialog, setShowAddAvaliacaoDialog] = useState(false);
  const [avaliacaoDialogOpen, setAvaliacaoDialogOpen] = useState(false);
  const [selectedAula, setSelectedAula] = useState<AulaEmenta | null>(null);
  const [showCancelAulaDialog, setShowCancelAulaDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [updateSubsequent, setUpdateSubsequent] = useState(false);
  const [showUnlinkInstrutorDialog, setShowUnlinkInstrutorDialog] = useState(false);
  const { toast } = useToast();

  const turma = getTurma(resolvedParams.id);
  const ementa = turma ? getEmenta(turma.ementaId) : null;
  const alunosDaTurma = alunos.filter((a) => a.turmaId === resolvedParams.id);
  const instrutor = turma ? instrutores.find((i) => i.id === turma.instrutorId) : null;

  if (!turma) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/coordenador/turmas">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-semibold">Turma não encontrada</h1>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-muted-foreground">
                A turma solicitada não foi encontrada.
              </p>
              <Link href="/coordenador/turmas">
                <Button className="mt-4">Voltar para Turmas</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const handleDelete = () => {
    deleteTurma(turma.id);
    router.push('/coordenador/turmas');
  };

  const handleFinalize = () => {
    updateTurma(turma.id, { status: 'finalizada' });
    setShowFinalizeDialog(false);
  };

  const handleUnlinkInstrutor = () => {
    updateTurma(turma.id, {
      instrutorId: '',
      instrutor: 'Não alocado'
    });
    setShowUnlinkInstrutorDialog(false);
  };

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

  const handleCancelamentoAula = (data: any) => {
    if (!selectedAula) return;

    try {
      const novoCancelamento: AulaCancelada = {
        id: `cancelamento-${Date.now()}`,
        turmaId: turma.id,
        data: data.data,
        motivo: data.motivo,
        justificativa: data.justificativa,
        reposicao: data.reposicao,
        canceladoPor: 'coordenador', // TODO: Usar ID do usuário logado
        dataCancelamento: new Date().toISOString(),
      };

      const aulasCanceladas = turma.aulasCanceladas || [];
      updateTurma(turma.id, {
        aulasCanceladas: [...aulasCanceladas, novoCancelamento],
      });

      toast({
        title: 'Aula cancelada com sucesso!',
        description: `A aula "${selectedAula.titulo}" foi cancelada. ${data.reposicao ? 'Reposição agendada para ' + new Date(data.reposicao.data).toLocaleDateString('pt-BR') : ''}`,
      });

      setSelectedAula(null);
    } catch (error) {
      toast({
        title: 'Erro ao cancelar aula',
        description: 'Ocorreu um erro ao tentar cancelar a aula. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const canEdit = turma.status !== 'finalizada' && turma.status !== 'cancelada';
  const canFinalize = turma.status === 'em_andamento';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/coordenador/turmas">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold text-foreground">{turma.codigo}</h1>
              <Badge variant={statusColors[turma.status]}>
                {statusLabels[turma.status]}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">{turma.ementa}</p>
          </div>
        </div>
        {canEdit && (
          <div className="flex gap-2">
            <Link href={`/coordenador/turmas/${turma.id}/editar`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </Link>
            {canFinalize && (
              <Button
                variant="accent"
                onClick={() => setShowFinalizeDialog(true)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Finalizar Turma
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Código</p>
                  <p className="font-medium">{turma.codigo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ementa</p>
                  <p className="font-medium">{turma.ementa}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Instrutor</p>
                  <p className="font-medium">{turma.instrutor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ementa</p>
                  <p className="font-medium">{turma.ementa}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Info */}
          <Card>
            <CardHeader>
              <CardTitle>Agenda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Período</p>
                    <p className="font-medium">
                      {turma.dataInicio} a {turma.dataFim}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Horário</p>
                    <p className="font-medium">{turma.horario}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dias da Semana</p>
                    <p className="font-medium">{turma.diasSemana.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Alunos</p>
                    <p className="font-medium">
                      {turma.vagasOcupadas} / {turma.vagasTotal}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ementa Details */}
          {ementa && (
            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Ementa</CardTitle>
                <CardDescription>{ementa.titulo}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Descrição</p>
                  <p className="text-sm text-muted-foreground">{ementa.descricao}</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Objetivos Gerais</p>
                  <ul className="list-disc list-inside space-y-1">
                    {ementa.objetivosGerais.map((obj, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de Aulas */}
          {ementa && (
            <Card>
              <CardHeader>
                <CardTitle>Aulas da Ementa</CardTitle>
                <CardDescription>
                  {ementa.aulas.length} aulas planejadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {ementa.aulas.map((aula) => (
                    <div
                      key={aula.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">
                            Aula {aula.numero}: {aula.titulo}
                          </p>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {aula.tipo}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Carga horária: {aula.cargaHoraria}h
                        </p>
                        {aula.objetivos.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {aula.objetivos.length} objetivos
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAula(aula);
                            setShowRescheduleDialog(true);
                          }}
                          title="Alterar Data"
                        >
                          <CalendarClock className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAula(aula);
                            setShowCancelAulaDialog(true);
                          }}
                          className="text-destructive hover:text-destructive"
                          title="Cancelar Aula"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instrutores */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Instrutor</CardTitle>
                  <CardDescription>
                    Instrutor alocado para esta turma
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!instrutor || !turma.instrutorId ? (
                <div className="text-center py-8 text-muted-foreground">
                  <GraduationCapIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum instrutor alocado</p>
                </div>
              ) : (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{instrutor.nome}</p>
                        <Badge
                          variant={
                            instrutor.status === 'ativo'
                              ? 'success'
                              : instrutor.status === 'inativo'
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {instrutor.status === 'ativo' ? 'Ativo' : instrutor.status === 'inativo' ? 'Inativo' : 'Bloqueado'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{instrutor.email}</p>
                      {instrutor.telefone && (
                        <p className="text-sm text-muted-foreground">{instrutor.telefone}</p>
                      )}
                    </div>
                    {canEdit && (
                      <div className="flex gap-2">
                        <Link href={`/coordenador/instrutores/${instrutor.id}`}>
                          <Button variant="ghost" size="sm">
                            Ver Detalhes
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setShowUnlinkInstrutorDialog(true)}
                        >
                          <UserMinus className="h-4 w-4 mr-2" />
                          Desvincular
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alunos Matriculados */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Alunos Matriculados</CardTitle>
                  <CardDescription>
                    {alunosDaTurma.length} alunos nesta turma
                  </CardDescription>
                </div>
                <Link href="/coordenador/alunos">
                  <Button variant="outlinePrimary" size="sm">
                    Gerenciar Alunos
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {alunosDaTurma.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Nenhum aluno matriculado ainda</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alunosDaTurma.map((aluno) => (
                      <TableRow key={aluno.id}>
                        <TableCell className="font-medium">{aluno.nome}</TableCell>
                        <TableCell className="text-muted-foreground">{aluno.email}</TableCell>
                        <TableCell className="text-muted-foreground">{aluno.cpf}</TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={
                              aluno.status === 'ativo'
                                ? 'accent'
                                : aluno.status === 'concluido'
                                ? 'success'
                                : 'destructive'
                            }
                          >
                            {aluno.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Estatísticas Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Ocupação</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent"
                      style={{
                        width: `${turma.vagasTotal > 0 ? (turma.vagasOcupadas / turma.vagasTotal) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {turma.vagasTotal > 0 ? Math.round((turma.vagasOcupadas / turma.vagasTotal) * 100) : 0}%
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Vagas Restantes</p>
                <p className="text-2xl font-semibold">
                  {turma.vagasTotal - turma.vagasOcupadas}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Total de Vagas</p>
                <p className="text-2xl font-semibold">
                  {turma.vagasTotal}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {canEdit && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={`/coordenador/turmas/${turma.id}/editar`}>
                  <Button variant="outlinePrimary" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Turma
                  </Button>
                </Link>
                <Button
                  variant="accent"
                  className="w-full"
                  onClick={() => setAvaliacaoDialogOpen(true)}
                >
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  Lançar Avaliação
                </Button>
                {canFinalize && (
                  <Button
                    variant="accent"
                    className="w-full"
                    onClick={() => setShowFinalizeDialog(true)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Finalizar Turma
                  </Button>
                )}
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Turma
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Informações do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">ID da Turma</p>
                <p className="font-mono text-xs">{turma.id}</p>
              </div>
              {turma.dataCriacao && (
                <div>
                  <p className="text-xs text-muted-foreground">Criado em</p>
                  <p className="text-xs">{turma.dataCriacao}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a turma <strong>{turma.codigo}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Finalize Dialog */}
      <AlertDialog open={showFinalizeDialog} onOpenChange={setShowFinalizeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finalizar Turma</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja finalizar a turma <strong>{turma.codigo}</strong>?
              Após finalizada, a turma não poderá mais ser editada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFinalize}
              className="bg-green-600 hover:bg-green-700"
            >
              Finalizar Turma
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Adicionar Avaliação */}
      <Dialog open={showAddAvaliacaoDialog} onOpenChange={setShowAddAvaliacaoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Avaliação</DialogTitle>
            <DialogDescription>
              Adicione uma nova avaliação para esta turma
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Funcionalidade de adicionar avaliação será implementada em breve.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAvaliacaoDialog(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Cancelar Aula */}
      <CancelamentoAulaDialog
        open={showCancelAulaDialog}
        onOpenChange={setShowCancelAulaDialog}
        onSubmit={handleCancelamentoAula}
        aula={selectedAula}
      />

      {/* Dialog Reagendar Aula */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Data da Aula</DialogTitle>
            <DialogDescription>
              {selectedAula && `Aula ${selectedAula.numero}: ${selectedAula.titulo}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newDate">Nova Data</Label>
              <Input
                id="newDate"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="updateSubsequent"
                checked={updateSubsequent}
                onCheckedChange={(checked) => setUpdateSubsequent(!!checked)}
              />
              <Label
                htmlFor="updateSubsequent"
                className="text-sm font-normal cursor-pointer"
              >
                Atualizar também as datas das aulas subsequentes
              </Label>
            </div>
            {updateSubsequent && selectedAula && ementa && (
              <p className="text-sm text-muted-foreground">
                {ementa.aulas.length - selectedAula.numero} aulas subsequentes serão reagendadas
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRescheduleDialog(false);
                setSelectedAula(null);
                setNewDate('');
                setUpdateSubsequent(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                // TODO: Implementar lógica de reagendamento
                setShowRescheduleDialog(false);
                setSelectedAula(null);
                setNewDate('');
                setUpdateSubsequent(false);
              }}
            >
              Confirmar Alteração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unlink Instrutor Dialog */}
      <AlertDialog open={showUnlinkInstrutorDialog} onOpenChange={setShowUnlinkInstrutorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desvincular Instrutor</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja desvincular <strong>{instrutor?.nome}</strong> desta turma?
              <br />
              A turma ficará sem instrutor alocado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnlinkInstrutor}
              className="bg-destructive hover:bg-destructive/90"
            >
              Desvincular
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog para Lançar Avaliação */}
      <AvaliacaoFormDialog
        open={avaliacaoDialogOpen}
        onOpenChange={setAvaliacaoDialogOpen}
        onSubmit={handleLancarAvaliacao}
      />
    </div>
  );
}
