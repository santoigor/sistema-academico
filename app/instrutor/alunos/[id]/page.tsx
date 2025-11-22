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
import { ArrowLeft, User, Mail, Phone, Calendar, MapPin, FileText, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { AnotacaoAlunoFormData } from '@/lib/schemas';
import type { Instrutor } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AlunoPerfilPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { alunos, turmas, diarios, anotacoes, addAnotacao, getAnotacoesByAluno } = useData();
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" className="mb-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-semibold text-primary">
                {aluno.nome.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{aluno.nome}</h2>
              <p className="text-muted-foreground mt-1">
                {turmaDoAluno?.codigo} - {turmaDoAluno?.ementa}
              </p>
            </div>
          </div>
          <Badge variant={statusColors[aluno.status]}>{aluno.status}</Badge>
        </div>
      </div>

      {/* Informações do Aluno */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Aluno</CardTitle>
          <CardDescription>Dados pessoais e contato</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="contato" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="contato">Contato</TabsTrigger>
              <TabsTrigger value="emergencia">Informações de Emergência</TabsTrigger>
            </TabsList>

            <TabsContent value="contato" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{aluno.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Telefone</p>
                    <p className="text-sm text-muted-foreground">{aluno.telefone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">CPF</p>
                    <p className="text-sm text-muted-foreground">{aluno.cpf}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Data de Nascimento</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(aluno.dataNascimento).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                {aluno.endereco && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Endereço</p>
                      <p className="text-sm text-muted-foreground">
                        {aluno.endereco.rua}, {aluno.endereco.numero}
                        {aluno.endereco.complemento && ` - ${aluno.endereco.complemento}`}
                        <br />
                        {aluno.endereco.bairro} - {aluno.endereco.cidade}/{aluno.endereco.estado}
                        <br />
                        CEP: {aluno.endereco.cep}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {aluno.responsavel && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-2">Responsável</p>
                    <div className="grid gap-2 md:grid-cols-2 pl-4">
                      <p className="text-sm text-muted-foreground">
                        <strong>Nome:</strong> {aluno.responsavel.nome}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Parentesco:</strong> {aluno.responsavel.parentesco}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Telefone:</strong> {aluno.responsavel.telefone}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Email:</strong> {aluno.responsavel.email}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {aluno.observacoes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-1">Observações</p>
                    <p className="text-sm text-muted-foreground">{aluno.observacoes}</p>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="emergencia" className="space-y-4 mt-4">
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

              {!aluno.contatoEmergencia && !aluno.alergias && !aluno.deficiencias && (
                <p className="text-sm text-muted-foreground">Nenhuma informação de emergência registrada.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Botão para Nova Anotação */}
      {!showForm && (
        <div className="flex justify-end">
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
  );
}
