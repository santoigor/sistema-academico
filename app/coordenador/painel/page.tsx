'use client';

import { useState } from 'react';
import { useData } from '@/lib/data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  GraduationCap,
  Users,
  UserPlus,
  TrendingUp,
  Calendar,
  FileText,
  Plus,
  Loader2,
  Link as LinkIcon,
  Check,
} from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cadastroAlunoInteressadoSchema, type CadastroAlunoInteressadoFormData } from '@/lib/schemas';
import type { Interessado } from '@/lib/types';

export default function CoordenadorPainel() {
  const { turmas, alunos, instrutores, interessados, cursos, addInteressado } = useData();
  const [showCadastroDialog, setShowCadastroDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cadastroLink, setCadastroLink] = useState<string>('');
  const [linkCopied, setLinkCopied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CadastroAlunoInteressadoFormData>({
    resolver: zodResolver(cadastroAlunoInteressadoSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      dataNascimento: '',
      cpf: '',
      genero: '',
      escolaridade: '',
      cursoInteresse: '',
      endereco: {
        cep: '',
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
      },
      responsavelNome: '',
      responsavelParentesco: '',
      responsavelTelefone: '',
      responsavelEmail: '',
      contatoEmergenciaNome: '',
      contatoEmergenciaTelefone: '',
      contatoEmergenciaParentesco: '',
      alergias: '',
      deficiencias: '',
      corRaca: '',
      etnia: '',
      documentos: {
        identidade: false,
        comprovanteEscolaridade: false,
        comprovanteResidencia: false,
        outro: false,
      },
      informacoesCorretas: false,
    },
  });

  const handleGenerateLink = () => {
    const token = btoa(Date.now().toString() + Math.random().toString());
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const link = `${baseUrl}/cadastro/aluno?token=${token}`;
    setCadastroLink(link);
  };

  const handleCopyLink = async () => {
    if (cadastroLink) {
      try {
        await navigator.clipboard.writeText(cadastroLink);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 3000);
      } catch (error) {
        console.error('Erro ao copiar link:', error);
      }
    }
  };

  const onSubmit = async (data: CadastroAlunoInteressadoFormData) => {
    setIsSubmitting(true);
    try {
      const birthDate = new Date(data.dataNascimento);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      const interessadoData: Interessado = {
        id: `interessado-${Date.now()}`,
        tipo: 'aluno',
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        dataNascimento: data.dataNascimento,
        idade: age,
        cpf: data.cpf,
        genero: data.genero,
        escolaridade: data.escolaridade,
        cursoInteresse: data.cursoInteresse,
        endereco: data.endereco,
        responsavel: {
          nome: data.responsavelNome,
          parentesco: data.responsavelParentesco,
          telefone: data.responsavelTelefone,
          email: data.responsavelEmail,
        },
        contatoEmergencia: {
          nome: data.contatoEmergenciaNome,
          telefone: data.contatoEmergenciaTelefone,
          parentesco: data.contatoEmergenciaParentesco,
        },
        corRaca: data.corRaca,
        etnia: data.etnia,
        alergias: data.alergias,
        deficiencias: data.deficiencias,
        informacoesCorretas: data.informacoesCorretas,
        documentosEntregues: data.documentos,
        status: 'novo',
        dataRegistro: new Date().toISOString().split('T')[0],
      };

      addInteressado(interessadoData);
      setShowCadastroDialog(false);
      reset();
      setCadastroLink('');
      setLinkCopied(false);
    } catch (error) {
      console.error('Erro ao cadastrar aluno interessado:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate metrics
  const turmasAtivas = turmas.filter(t => t.status === 'em_andamento').length;
  const turmasPlanejadas = turmas.filter(t => t.status === 'planejada').length;
  const turmasFinalizadas = turmas.filter(t => t.status === 'finalizada').length;

  const alunosAtivos = alunos.filter(a => a.status === 'ativo').length;
  const alunosConcluidos = alunos.filter(a => a.status === 'concluido').length;
  const alunosEvadidos = alunos.filter(a => a.status === 'evadido').length;

  const instrutoresAtivos = instrutores.filter(i => i.status === 'ativo').length;
  const totalInteressados = interessados.length;

  // Recent turmas
  const turmasRecentes = turmas
    .sort((a, b) => new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime())
    .slice(0, 5);

  // Status colors
  const statusColors = {
    planejada: 'default',
    em_andamento: 'accent',
    finalizada: 'success',
    cancelada: 'destructive',
  } as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Painel do Coordenador</h1>
        <p className="text-muted-foreground mt-1">Visão geral das atividades acadêmicas</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/coordenador/turmas/nova">
          <Card className="cursor-pointer hover:border-primary transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-sm font-medium">Nova Turma</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Cadastrar nova turma</p>
            </CardContent>
          </Card>
        </Link>

        <Card
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => setShowCadastroDialog(true)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-sm font-medium">Novo Aluno</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Cadastrar novo aluno</p>
          </CardContent>
        </Card>

        <Link href="/coordenador/interessados/voluntarios/novo?cadastrarComoInstrutor=true">
          <Card className="cursor-pointer hover:border-primary transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-sm font-medium">Novo Instrutor</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Cadastrar novo instrutor</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/coordenador/relatorios">
          <Card className="cursor-pointer hover:border-primary transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <CardTitle className="text-sm font-medium">Relatórios</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Gerar relatórios PDF</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Turmas Metric */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Turmas</CardDescription>
            <CardTitle className="text-3xl font-semibold">{turmas.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Em andamento</span>
                <span className="font-medium text-accent">{turmasAtivas}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Planejadas</span>
                <span className="font-medium">{turmasPlanejadas}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Finalizadas</span>
                <span className="font-medium text-green-600">{turmasFinalizadas}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alunos Metric */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Alunos</CardDescription>
            <CardTitle className="text-3xl font-semibold">{alunos.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ativos</span>
                <span className="font-medium text-accent">{alunosAtivos}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Concluídos</span>
                <span className="font-medium text-green-600">{alunosConcluidos}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Evadidos</span>
                <span className="font-medium text-red-600">{alunosEvadidos}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instrutores Metric */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Instrutores</CardDescription>
            <CardTitle className="text-3xl font-semibold">{instrutores.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ativos</span>
                <span className="font-medium text-accent">{instrutoresAtivos}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Especialidades</span>
                <span className="font-medium">{cursos.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interessados Metric */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Interessados</CardDescription>
            <CardTitle className="text-3xl font-semibold">{totalInteressados}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-muted-foreground">Novos contatos</span>
              </div>
              <Link href="/coordenador/interessados">
                <Button variant="ghostPrimary" size="sm" className="w-full mt-2">
                  Ver lista completa
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Turmas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Turmas Recentes</CardTitle>
              <CardDescription>Últimas turmas cadastradas</CardDescription>
            </div>
            <Link href="/coordenador/turmas">
              <Button variant="ghost" size="sm">
                Ver todas
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {turmasRecentes.map((turma) => (
              <div
                key={turma.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{turma.codigo}</p>
                    <Badge variant={statusColors[turma.status]} className="text-xs">
                      {turma.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{turma.ementa}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {turma.dataInicio}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {turma.vagasOcupadas}/{turma.vagasTotal}
                    </span>
                  </div>
                </div>
                <Link href={`/coordenador/turmas/${turma.id}`}>
                  <Button variant="ghost" size="sm">
                    Detalhes
                  </Button>
                </Link>
              </div>
            ))}
            {turmasRecentes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <GraduationCap className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhuma turma cadastrada</p>
                <Link href="/coordenador/turmas/nova">
                  <Button variant="outlinePrimary" size="sm" className="mt-3">
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar primeira turma
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cadastro Dialog */}
      <Dialog open={showCadastroDialog} onOpenChange={setShowCadastroDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Cadastrar Aluno Interessado</DialogTitle>
            <DialogDescription>
              Preencha todos os campos obrigatórios para cadastrar o aluno
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
            {/* Link de Cadastro */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm">Link de Cadastro</h4>
                  <p className="text-xs text-muted-foreground">Gere um link para o aluno finalizar o cadastro</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateLink}
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Gerar Link
                </Button>
              </div>

              {cadastroLink && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      value={cadastroLink}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={handleCopyLink}
                      className="min-w-[100px]"
                    >
                      {linkCopied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <LinkIcon className="h-4 w-4 mr-2" />
                          Copiar
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Envie este link para o aluno preencher os dados de cadastro
                  </p>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} id="cadastro-form" className="space-y-6">
              {/* Dados Pessoais */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Dados Pessoais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">
                      Nome Completo <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="nome"
                      {...register('nome')}
                      className={errors.nome ? 'border-destructive' : ''}
                    />
                    {errors.nome && (
                      <p className="text-sm text-destructive">{errors.nome.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">
                      CPF <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="cpf"
                      {...register('cpf')}
                      placeholder="00000000000"
                      maxLength={11}
                      className={errors.cpf ? 'border-destructive' : ''}
                    />
                    {errors.cpf && (
                      <p className="text-sm text-destructive">{errors.cpf.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">
                      Telefone <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="telefone"
                      {...register('telefone')}
                      placeholder="(00) 00000-0000"
                      className={errors.telefone ? 'border-destructive' : ''}
                    />
                    {errors.telefone && (
                      <p className="text-sm text-destructive">{errors.telefone.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataNascimento">
                      Data de Nascimento <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="dataNascimento"
                      type="date"
                      {...register('dataNascimento')}
                      className={errors.dataNascimento ? 'border-destructive' : ''}
                    />
                    {errors.dataNascimento && (
                      <p className="text-sm text-destructive">{errors.dataNascimento.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="genero">
                      Gênero <span className="text-destructive">*</span>
                    </Label>
                    <Select onValueChange={(value) => setValue('genero', value)}>
                      <SelectTrigger className={errors.genero ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                        <SelectItem value="prefiro_nao_informar">Prefiro não informar</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.genero && (
                      <p className="text-sm text-destructive">{errors.genero.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="escolaridade">
                      Escolaridade <span className="text-destructive">*</span>
                    </Label>
                    <Select onValueChange={(value) => setValue('escolaridade', value)}>
                      <SelectTrigger className={errors.escolaridade ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fundamental_incompleto">Fundamental Incompleto</SelectItem>
                        <SelectItem value="fundamental_completo">Fundamental Completo</SelectItem>
                        <SelectItem value="medio_incompleto">Médio Incompleto</SelectItem>
                        <SelectItem value="medio_completo">Médio Completo</SelectItem>
                        <SelectItem value="superior_incompleto">Superior Incompleto</SelectItem>
                        <SelectItem value="superior_completo">Superior Completo</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.escolaridade && (
                      <p className="text-sm text-destructive">{errors.escolaridade.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cursoInteresse">
                      Curso de Interesse <span className="text-destructive">*</span>
                    </Label>
                    <Select onValueChange={(value) => setValue('cursoInteresse', value)}>
                      <SelectTrigger className={errors.cursoInteresse ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {cursos.map((curso) => (
                          <SelectItem key={curso.id} value={curso.nome}>
                            {curso.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.cursoInteresse && (
                      <p className="text-sm text-destructive">{errors.cursoInteresse.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Endereço */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Endereço</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="endereco.cep">
                      CEP <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="endereco.cep"
                      {...register('endereco.cep')}
                      placeholder="00000000"
                      maxLength={8}
                      className={errors.endereco?.cep ? 'border-destructive' : ''}
                    />
                    {errors.endereco?.cep && (
                      <p className="text-sm text-destructive">{errors.endereco.cep.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endereco.rua">
                      Rua <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="endereco.rua"
                      {...register('endereco.rua')}
                      className={errors.endereco?.rua ? 'border-destructive' : ''}
                    />
                    {errors.endereco?.rua && (
                      <p className="text-sm text-destructive">{errors.endereco.rua.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endereco.numero">
                      Número <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="endereco.numero"
                      {...register('endereco.numero')}
                      className={errors.endereco?.numero ? 'border-destructive' : ''}
                    />
                    {errors.endereco?.numero && (
                      <p className="text-sm text-destructive">{errors.endereco.numero.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endereco.complemento">Complemento</Label>
                    <Input
                      id="endereco.complemento"
                      {...register('endereco.complemento')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endereco.bairro">
                      Bairro <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="endereco.bairro"
                      {...register('endereco.bairro')}
                      className={errors.endereco?.bairro ? 'border-destructive' : ''}
                    />
                    {errors.endereco?.bairro && (
                      <p className="text-sm text-destructive">{errors.endereco.bairro.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endereco.cidade">
                      Cidade <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="endereco.cidade"
                      {...register('endereco.cidade')}
                      className={errors.endereco?.cidade ? 'border-destructive' : ''}
                    />
                    {errors.endereco?.cidade && (
                      <p className="text-sm text-destructive">{errors.endereco.cidade.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endereco.estado">
                      Estado <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="endereco.estado"
                      {...register('endereco.estado')}
                      placeholder="SP"
                      maxLength={2}
                      className={errors.endereco?.estado ? 'border-destructive' : ''}
                    />
                    {errors.endereco?.estado && (
                      <p className="text-sm text-destructive">{errors.endereco.estado.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Responsável */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Responsável (se menor de idade)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="responsavelNome">Nome do Responsável</Label>
                    <Input
                      id="responsavelNome"
                      {...register('responsavelNome')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsavelParentesco">Parentesco</Label>
                    <Input
                      id="responsavelParentesco"
                      {...register('responsavelParentesco')}
                      placeholder="Ex: Pai, Mãe, Tutor"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsavelTelefone">Telefone</Label>
                    <Input
                      id="responsavelTelefone"
                      {...register('responsavelTelefone')}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsavelEmail">Email</Label>
                    <Input
                      id="responsavelEmail"
                      type="email"
                      {...register('responsavelEmail')}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contato de Emergência */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Contato de Emergência</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contatoEmergenciaNome">
                      Nome <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contatoEmergenciaNome"
                      {...register('contatoEmergenciaNome')}
                      className={errors.contatoEmergenciaNome ? 'border-destructive' : ''}
                    />
                    {errors.contatoEmergenciaNome && (
                      <p className="text-sm text-destructive">{errors.contatoEmergenciaNome.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contatoEmergenciaTelefone">
                      Telefone <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contatoEmergenciaTelefone"
                      {...register('contatoEmergenciaTelefone')}
                      placeholder="(00) 00000-0000"
                      className={errors.contatoEmergenciaTelefone ? 'border-destructive' : ''}
                    />
                    {errors.contatoEmergenciaTelefone && (
                      <p className="text-sm text-destructive">{errors.contatoEmergenciaTelefone.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contatoEmergenciaParentesco">
                      Parentesco <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contatoEmergenciaParentesco"
                      {...register('contatoEmergenciaParentesco')}
                      placeholder="Ex: Irmão, Tio, Amigo"
                      className={errors.contatoEmergenciaParentesco ? 'border-destructive' : ''}
                    />
                    {errors.contatoEmergenciaParentesco && (
                      <p className="text-sm text-destructive">{errors.contatoEmergenciaParentesco.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Informações de Saúde */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Informações de Saúde</h3>
                <div className="space-y-2">
                  <Label htmlFor="alergias">Alergias</Label>
                  <Textarea
                    id="alergias"
                    {...register('alergias')}
                    placeholder="Descreva se possui alguma alergia"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deficiencias">Deficiências ou Necessidades Especiais</Label>
                  <Textarea
                    id="deficiencias"
                    {...register('deficiencias')}
                    placeholder="Descreva se possui alguma deficiência ou necessidade especial"
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              {/* Identificação Étnico-Racial */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Identificação Étnico-Racial</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="corRaca">
                      Cor ou Raça <span className="text-destructive">*</span>
                    </Label>
                    <Select onValueChange={(value) => setValue('corRaca', value)}>
                      <SelectTrigger className={errors.corRaca ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="branca">Branca</SelectItem>
                        <SelectItem value="preta">Preta</SelectItem>
                        <SelectItem value="parda">Parda</SelectItem>
                        <SelectItem value="amarela">Amarela</SelectItem>
                        <SelectItem value="indigena">Indígena</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.corRaca && (
                      <p className="text-sm text-destructive">{errors.corRaca.message}</p>
                    )}
                  </div>
                  {watch('corRaca') === 'indigena' && (
                    <div className="space-y-2">
                      <Label htmlFor="etnia">Etnia</Label>
                      <Input
                        id="etnia"
                        {...register('etnia')}
                        placeholder="Especifique a etnia"
                      />
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Documentos Entregues */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Documentos Entregues</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="documentos.identidade"
                      checked={watch('documentos.identidade')}
                      onCheckedChange={(checked) => setValue('documentos.identidade', !!checked)}
                    />
                    <Label htmlFor="documentos.identidade" className="font-normal cursor-pointer">
                      Identidade (RG ou CNH)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="documentos.comprovanteEscolaridade"
                      checked={watch('documentos.comprovanteEscolaridade')}
                      onCheckedChange={(checked) => setValue('documentos.comprovanteEscolaridade', !!checked)}
                    />
                    <Label htmlFor="documentos.comprovanteEscolaridade" className="font-normal cursor-pointer">
                      Comprovante de Escolaridade
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="documentos.comprovanteResidencia"
                      checked={watch('documentos.comprovanteResidencia')}
                      onCheckedChange={(checked) => setValue('documentos.comprovanteResidencia', !!checked)}
                    />
                    <Label htmlFor="documentos.comprovanteResidencia" className="font-normal cursor-pointer">
                      Comprovante de Residência
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="documentos.outro"
                      checked={watch('documentos.outro')}
                      onCheckedChange={(checked) => setValue('documentos.outro', !!checked)}
                    />
                    <Label htmlFor="documentos.outro" className="font-normal cursor-pointer">
                      Outro
                    </Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Confirmação */}
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="informacoesCorretas"
                    checked={watch('informacoesCorretas')}
                    onCheckedChange={(checked) => setValue('informacoesCorretas', !!checked)}
                    className={errors.informacoesCorretas ? 'border-destructive' : ''}
                  />
                  <Label htmlFor="informacoesCorretas" className="font-normal cursor-pointer leading-tight">
                    Certifico que as informações acima estão corretas e atualizadas{' '}
                    <span className="text-destructive">*</span>
                  </Label>
                </div>
                {errors.informacoesCorretas && (
                  <p className="text-sm text-destructive pl-6">{errors.informacoesCorretas.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCadastroDialog(false);
                    reset();
                    setCadastroLink('');
                    setLinkCopied(false);
                  }}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Cadastrando...
                    </>
                  ) : (
                    'Cadastrar Aluno'
                  )}
                </Button>
              </div>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
