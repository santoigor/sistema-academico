'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useData } from '@/lib/data-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { HistoricoAlunoView } from '@/components/instrutor/HistoricoAlunoView';
import { AnotacaoAlunoForm } from '@/components/forms/AnotacaoAlunoForm';
import { ArrowLeft, User, Mail, Phone, Calendar, FileText, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { AnotacaoAlunoFormData } from '@/lib/schemas';
import type { Instrutor } from '@/lib/types';

export default function AlunoPerfilPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { alunos, turmas, diarios, addAnotacao, getAnotacoesByAluno } = useData();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const alunoId = params.id as string;

  if (!user || user.role !== 'instrutor') {
    return null;
  }

  const instrutor = user as Instrutor;
  const aluno = alunos.find((a) => a.id === alunoId);

  if (!aluno) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg font-medium">Aluno não encontrado</p>
        <p className="text-sm text-muted-foreground mb-4">
          Este aluno não existe no sistema
        </p>
        <Button onClick={() => router.back()}>Voltar</Button>
      </div>
    );
  }

  // Verificar se o instrutor tem acesso a este aluno (está em uma turma do instrutor)
  const turmaDoAluno = turmas.find((t) => t.id === aluno.turmaId);
  const hasAccess = turmaDoAluno && instrutor.turmasAlocadas.includes(turmaDoAluno.id);

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg font-medium">Acesso negado</p>
        <p className="text-sm text-muted-foreground mb-4">
          Você não tem permissão para acessar este aluno
        </p>
        <Button onClick={() => router.push('/instrutor/turmas')}>
          Voltar para Minhas Turmas
        </Button>
      </div>
    );
  }

  // Filtrar diários onde o instrutor é o responsável
  const diariosDoInstrutor = diarios.filter(
    (d) => d.instrutorId === instrutor.id && d.turmaId === aluno.turmaId
  );

  const anotacoesDoAluno = getAnotacoesByAluno(aluno.id);

  const handleSubmitAnotacao = async (data: AnotacaoAlunoFormData) => {
    setIsSubmitting(true);

    try {
      addAnotacao({
        alunoId: aluno.id,
        instrutorId: instrutor.id,
        instrutorNome: instrutor.nome,
        turmaId: aluno.turmaId || '',
        tipo: data.tipo,
        titulo: data.titulo,
        conteudo: data.conteudo,
        privada: data.privada,
      });

      toast({
        title: 'Anotação salva com sucesso!',
        description: `Anotação sobre ${aluno.nome} foi registrada.`,
      });

      setShowForm(false);
    } catch (error) {
      toast({
        title: 'Erro ao salvar anotação',
        description: 'Ocorreu um erro ao salvar a anotação. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusColors = {
    ativo: 'default',
    inativo: 'secondary',
    concluido: 'default',
    evadido: 'destructive',
  } as const;

  const statusLabels = {
    ativo: 'Ativo',
    inativo: 'Inativo',
    concluido: 'Concluído',
    evadido: 'Evadido',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">{aluno.nome}</h1>
            <p className="text-muted-foreground mt-1">Perfil do aluno</p>
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
          {aluno.turmaId && turmaDoAluno && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Turma
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Código da Turma</p>
                  <p className="font-semibold text-lg">{turmaDoAluno.codigo}</p>
                  <p className="text-sm text-muted-foreground mt-1">{turmaDoAluno.ementa}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
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

      {/* Seção de Anotações e Histórico - Full Width */}
      <div className="space-y-6">
        {/* Botão para Nova Anotação */}
        {!showForm && (
          <div className="flex justify-start">
            <Button onClick={() => setShowForm(true)}>
              <FileText className="mr-2 h-4 w-4" />
              Nova Anotação
            </Button>
          </div>
        )}

        {/* Formulário de Nova Anotação */}
        {showForm && (
          <AnotacaoAlunoForm
            onSubmit={handleSubmitAnotacao}
            isSubmitting={isSubmitting}
            submitLabel="Salvar Anotação"
          />
        )}

        {/* Histórico do Aluno */}
        <HistoricoAlunoView
          aluno={aluno}
          diarios={diariosDoInstrutor}
          anotacoes={anotacoesDoAluno}
        />
      </div>
    </div>
  );
}
