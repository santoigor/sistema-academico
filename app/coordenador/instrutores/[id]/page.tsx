'use client';

import { use, useState } from 'react';
import { useData } from '@/lib/data-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  User,
  AlertCircle,
  GraduationCap,
  BookOpen,
  FileText,
  Edit,
  Trash2,
} from 'lucide-react';
import type { Instrutor } from '@/lib/types';

export default function InstrutorDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { instrutores, turmas, deleteInstrutor } = useData();
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const instrutor = instrutores.find((i) => i.id === resolvedParams.id);

  if (!instrutor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Instrutor não encontrado</h2>
        <p className="text-muted-foreground mb-4">
          O instrutor que você está procurando não existe ou foi removido.
        </p>
        <Link href="/coordenador/instrutores">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Instrutores
          </Button>
        </Link>
      </div>
    );
  }

  const turmasInstrutor = turmas.filter((t) => t.instrutorId === instrutor.id);

  const statusColors = {
    ativo: 'success',
    inativo: 'default',
    bloqueado: 'destructive',
  } as const;

  const statusLabels = {
    ativo: 'Ativo',
    inativo: 'Inativo',
    bloqueado: 'Bloqueado',
  };

  const statusTurmaColors = {
    planejada: 'default',
    em_andamento: 'accent',
    finalizada: 'success',
    cancelada: 'destructive',
  } as const;

  const statusTurmaLabels = {
    planejada: 'Planejada',
    em_andamento: 'Em Andamento',
    finalizada: 'Finalizada',
    cancelada: 'Cancelada',
  };

  const handleDelete = () => {
    deleteInstrutor(instrutor.id);
    router.push('/coordenador/instrutores');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/coordenador/instrutores">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">{instrutor.nome}</h1>
            <p className="text-muted-foreground mt-1">Detalhes do instrutor</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={statusColors[instrutor.status]} className="text-sm px-3 py-1">
            {statusLabels[instrutor.status]}
          </Badge>
          <Link href={`/coordenador/instrutores/${instrutor.id}/editar`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome Completo</p>
                  <p className="font-medium">{instrutor.nome}</p>
                </div>
                {instrutor.cpf && (
                  <div>
                    <p className="text-sm text-muted-foreground">CPF</p>
                    <p className="font-medium">{instrutor.cpf}</p>
                  </div>
                )}
                {instrutor.dataNascimento && (
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                    <p className="font-medium">
                      {new Date(instrutor.dataNascimento + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Data de Cadastro</p>
                  <p className="font-medium">
                    {new Date(instrutor.dataCadastro + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Informações de Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{instrutor.email}</p>
                </div>
              </div>
              {instrutor.telefone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium">{instrutor.telefone}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Turmas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Turmas
              </CardTitle>
              <CardDescription>
                {turmasInstrutor.length === 0
                  ? 'Nenhuma turma alocada'
                  : `${turmasInstrutor.length} turma(s) alocada(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {turmasInstrutor.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Este instrutor ainda não está alocado em nenhuma turma
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {turmasInstrutor.map((turma) => (
                    <Link
                      key={turma.id}
                      href={`/coordenador/turmas/${turma.id}`}
                      className="block"
                    >
                      <div className="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold">{turma.codigo}</p>
                              <Badge variant={statusTurmaColors[turma.status]} className="text-xs">
                                {statusTurmaLabels[turma.status]}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{turma.ementa}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {new Date(turma.dataInicio + 'T00:00:00').toLocaleDateString('pt-BR')}
                                  {' → '}
                                  {new Date(turma.dataFim + 'T00:00:00').toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Estatísticas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total de Turmas</p>
                <p className="text-2xl font-semibold">{turmasInstrutor.length}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Turmas Ativas</p>
                <p className="text-2xl font-semibold text-primary">
                  {turmasInstrutor.filter((t) => t.status === 'em_andamento').length}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Turmas Finalizadas</p>
                <p className="text-2xl font-semibold text-green-600">
                  {turmasInstrutor.filter((t) => t.status === 'finalizada').length}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          {instrutor.observacoes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{instrutor.observacoes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir instrutor?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{instrutor.nome}</strong>? Esta ação não pode ser desfeita.
              {turmasInstrutor.length > 0 && (
                <span className="block mt-2 text-destructive">
                  Atenção: Este instrutor está alocado em {turmasInstrutor.length} turma(s).
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
