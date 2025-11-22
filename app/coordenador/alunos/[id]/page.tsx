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
  MapPin,
  Calendar,
  User,
  AlertCircle,
  UserMinus,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import type { Aluno } from '@/lib/types';

export default function AlunoDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { alunos, updateAluno, turmas } = useData();
  const router = useRouter();
  const [showRemoveTurmaDialog, setShowRemoveTurmaDialog] = useState(false);

  const aluno = alunos.find((a) => a.id === resolvedParams.id);

  if (!aluno) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Aluno não encontrado</h2>
        <p className="text-muted-foreground mb-4">
          O aluno que você está procurando não existe ou foi removido.
        </p>
        <Link href="/coordenador/alunos">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Alunos
          </Button>
        </Link>
      </div>
    );
  }

  const turma = turmas.find((t) => t.id === aluno.turmaId);

  const handleRemoverDaTurma = () => {
    updateAluno(aluno.id, {
      ...aluno,
      turmaId: undefined,
      turma: undefined,
      status: 'inativo',
    });
    setShowRemoveTurmaDialog(false);
  };

  const statusColors = {
    ativo: 'success',
    inativo: 'default',
    concluido: 'accent',
    evadido: 'destructive',
  } as const;

  const statusLabels = {
    ativo: 'Ativo',
    inativo: 'Inativo',
    concluido: 'Concluído',
    evadido: 'Evadido',
  };

  // Mock data - presença e anotações (deve vir do backend em produção)
  const mockPresenca = [
    { aula: 1, data: '2024-03-04', status: 'presente' },
    { aula: 2, data: '2024-03-06', status: 'presente' },
    { aula: 3, data: '2024-03-11', status: 'ausente' },
    { aula: 4, data: '2024-03-13', status: 'presente' },
    { aula: 5, data: '2024-03-18', status: 'justificado' },
  ];

  const mockAnotacoesAula = [
    {
      id: '1',
      instrutor: 'Prof. Carlos Silva',
      data: '2024-03-06',
      aula: 2,
      observacao: 'Aluno demonstrou excelente compreensão dos conceitos de HTML.',
    },
    {
      id: '2',
      instrutor: 'Prof. Carlos Silva',
      data: '2024-03-13',
      aula: 4,
      observacao: 'Participou ativamente das atividades práticas de CSS.',
    },
  ];

  const mockAnotacoesGerais = [
    {
      id: '1',
      tipo: 'desempenho',
      titulo: 'Bom desempenho em JavaScript',
      data: '2024-03-15',
      autor: 'Coordenação',
      conteudo: 'Aluno mostra facilidade com lógica de programação.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/coordenador/alunos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">{aluno.nome}</h1>
            <p className="text-muted-foreground mt-1">Detalhes do aluno</p>
          </div>
        </div>
        <Badge variant={statusColors[aluno.status]} className="text-sm px-3 py-1">
          {statusLabels[aluno.status]}
        </Badge>
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
                  <p className="font-medium">{aluno.nome}</p>
                </div>
                {aluno.cpf && (
                  <div>
                    <p className="text-sm text-muted-foreground">CPF</p>
                    <p className="font-medium">{aluno.cpf}</p>
                  </div>
                )}
                {aluno.dataNascimento && (
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                    <p className="font-medium">
                      {new Date(aluno.dataNascimento + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Data de Matrícula</p>
                  <p className="font-medium">
                    {new Date(aluno.dataMatricula + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações de Contato */}
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
                  <p className="font-medium">{aluno.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{aluno.telefone}</p>
                </div>
              </div>

              {aluno.responsavel && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-semibold mb-2">Responsável</p>
                    <div className="space-y-2 pl-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Nome</p>
                        <p className="font-medium">{aluno.responsavel.nome}</p>
                      </div>
                      {aluno.responsavel.parentesco && (
                        <div>
                          <p className="text-sm text-muted-foreground">Parentesco</p>
                          <p className="font-medium capitalize">{aluno.responsavel.parentesco}</p>
                        </div>
                      )}
                      {aluno.responsavel.telefone && (
                        <div>
                          <p className="text-sm text-muted-foreground">Telefone</p>
                          <p className="font-medium">{aluno.responsavel.telefone}</p>
                        </div>
                      )}
                      {aluno.responsavel.email && (
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{aluno.responsavel.email}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Turma */}
          {aluno.turmaId && turma && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Turma
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Código da Turma</p>
                    <p className="font-semibold text-lg">{turma.codigo}</p>
                    <p className="text-sm text-muted-foreground mt-1">{turma.ementa}</p>

                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground mb-1">Frequência</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{
                              width: `${(mockPresenca.filter(p => p.status === 'presente').length / mockPresenca.length) * 100}%`
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-green-600">
                          {Math.round((mockPresenca.filter(p => p.status === 'presente').length / mockPresenca.length) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowRemoveTurmaDialog(true)}
                  >
                    <UserMinus className="h-4 w-4 mr-2" />
                    Remover da Turma
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Anotações de Aula */}
          {mockAnotacoesAula.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Anotações de Aula
                </CardTitle>
                <CardDescription>Observações feitas pelos instrutores durante as aulas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnotacoesAula.map((anotacao) => (
                    <div key={anotacao.id} className="border-l-4 border-primary pl-4 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium">Aula {anotacao.aula}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(anotacao.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{anotacao.instrutor}</p>
                      <p className="text-sm">{anotacao.observacao}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Anotações Gerais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Anotações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockAnotacoesGerais.length > 0 ? (
                <div className="space-y-4">
                  {mockAnotacoesGerais.map((anotacao) => (
                    <div key={anotacao.id} className="space-y-2">
                      <div className="flex items-start justify-between">
                        <p className="font-medium text-sm">{anotacao.titulo}</p>
                        <Badge variant="outline" className="text-xs">
                          {anotacao.tipo}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(anotacao.data + 'T00:00:00').toLocaleDateString('pt-BR')} - {anotacao.autor}
                      </p>
                      <p className="text-sm">{anotacao.conteudo}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma anotação geral registrada</p>
              )}
            </CardContent>
          </Card>

          {/* Informações de Emergência */}
          {(aluno.contatoEmergencia || aluno.alergias || aluno.deficiencias) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Informações de Emergência
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aluno.contatoEmergencia && (
                  <div>
                    <p className="text-sm font-semibold mb-2">Contato de Emergência</p>
                    <div className="space-y-2 pl-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Nome</p>
                        <p className="font-medium">{aluno.contatoEmergencia.nome}</p>
                      </div>
                      {aluno.contatoEmergencia.telefone && (
                        <div>
                          <p className="text-sm text-muted-foreground">Telefone</p>
                          <p className="font-medium">{aluno.contatoEmergencia.telefone}</p>
                        </div>
                      )}
                      {aluno.contatoEmergencia.parentesco && (
                        <div>
                          <p className="text-sm text-muted-foreground">Parentesco</p>
                          <p className="font-medium capitalize">{aluno.contatoEmergencia.parentesco}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {(aluno.alergias || aluno.deficiencias) && (
                  <>
                    {aluno.contatoEmergencia && <Separator />}
                    <div>
                      <p className="text-sm font-semibold mb-2">Informações de Saúde</p>
                      <div className="space-y-2 pl-4">
                        {aluno.alergias && (
                          <div>
                            <p className="text-sm text-muted-foreground">Alergias</p>
                            <p className="font-medium">{aluno.alergias}</p>
                          </div>
                        )}
                        {aluno.deficiencias && (
                          <div>
                            <p className="text-sm text-muted-foreground">Deficiências</p>
                            <p className="font-medium">{aluno.deficiencias}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Observações */}
          {aluno.observacoes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{aluno.observacoes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Remove from Turma Dialog */}
      <AlertDialog open={showRemoveTurmaDialog} onOpenChange={setShowRemoveTurmaDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover aluno da turma?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover <strong>{aluno.nome}</strong> da turma{' '}
              <strong>{turma?.codigo}</strong>? O aluno será marcado como inativo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoverDaTurma} className="bg-destructive hover:bg-destructive/90">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
