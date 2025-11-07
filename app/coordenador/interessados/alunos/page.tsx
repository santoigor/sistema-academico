'use client';

import { useState } from 'react';
import { useData } from '@/lib/data-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cadastroAlunoInteressadoSchema, type CadastroAlunoInteressadoFormData } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  UserCircle,
  Plus,
  Search,
  Mail,
  Phone,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Link as LinkIcon,
  Check,
} from 'lucide-react';
import type { Interessado, StatusInteressado } from '@/lib/types';

const ITEMS_PER_PAGE = 10;

export default function AlunosInteressadosPage() {
  const { interessados, addInteressado, cursos } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusInteressado | 'all'>('all');
  const [escolaridadeFilter, setEscolaridadeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCadastroDialog, setShowCadastroDialog] = useState(false);
  const [selectedInteressado, setSelectedInteressado] = useState<Interessado | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cadastroLink, setCadastroLink] = useState<string>('');
  const [linkCopied, setLinkCopied] = useState(false);

  // Filter only student interessados
  const alunosInteressados = interessados.filter((i) => i.tipo === 'aluno');

  // Apply filters
  const filteredAlunos = alunosInteressados.filter((aluno) => {
    const matchesSearch =
      aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.cursoInteresse.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || aluno.status === statusFilter;
    const matchesEscolaridade = escolaridadeFilter === 'all' || aluno.escolaridade === escolaridadeFilter;
    return matchesSearch && matchesStatus && matchesEscolaridade;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAlunos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedAlunos = filteredAlunos.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: StatusInteressado | 'all') => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleEscolaridadeFilterChange = (value: string) => {
    setEscolaridadeFilter(value);
    setCurrentPage(1);
  };

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CadastroAlunoInteressadoFormData>({
    resolver: zodResolver(cadastroAlunoInteressadoSchema),
    defaultValues: {
      documentos: {
        identidade: false,
        comprovanteEscolaridade: false,
        comprovanteResidencia: false,
        outro: false,
      },
      informacoesCorretas: false,
    },
  });

  const corRacaWatch = watch('corRaca');

  const handleOpenCadastro = (interessado?: Interessado) => {
    if (interessado) {
      setSelectedInteressado(interessado);
      // Populate form with interessado data
      reset({
        nome: interessado.nome,
        email: interessado.email,
        telefone: interessado.telefone,
        dataNascimento: interessado.dataNascimento || '',
        cpf: interessado.cpf || '',
        genero: interessado.genero || '',
        escolaridade: interessado.escolaridade || '',
        cursoInteresse: interessado.cursoInteresse,
        endereco: interessado.endereco || {
          rua: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: '',
          cep: '',
        },
        responsavelNome: interessado.responsavel?.nome || '',
        responsavelParentesco: interessado.responsavel?.parentesco || '',
        contatoEmergenciaNome: interessado.contatoEmergencia?.nome || '',
        contatoEmergenciaTelefone: interessado.contatoEmergencia?.telefone || '',
        contatoEmergenciaParentesco: interessado.contatoEmergencia?.parentesco || '',
        corRaca: interessado.corRaca || '',
        etnia: interessado.etnia || '',
        alergias: interessado.alergias || '',
        deficiencias: interessado.deficiencias || '',
        informacoesCorretas: interessado.informacoesCorretas || false,
        documentos: interessado.documentosEntregues || {
          identidade: false,
          comprovanteEscolaridade: false,
          comprovanteResidencia: false,
          outro: false,
        },
      });
    } else {
      setSelectedInteressado(null);
      reset({
        documentos: {
          identidade: false,
          comprovanteEscolaridade: false,
          comprovanteResidencia: false,
          outro: false,
        },
        informacoesCorretas: false,
      });
    }
    setShowCadastroDialog(true);
  };

  const handleGenerateLink = () => {
    // Generate a unique token for the registration link
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
      // Calculate age from date of birth
      const birthDate = new Date(data.dataNascimento);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      const interessadoData: Omit<Interessado, 'id'> = {
        tipo: 'aluno',
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        idade: age,
        dataNascimento: data.dataNascimento,
        cpf: data.cpf,
        genero: data.genero,
        escolaridade: data.escolaridade,
        cursoInteresse: data.cursoInteresse,
        endereco: data.endereco,
        responsavel: data.responsavelNome ? {
          nome: data.responsavelNome,
          parentesco: data.responsavelParentesco || '',
        } : undefined,
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
    } catch (error) {
      console.error('Erro ao cadastrar aluno interessado:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status colors
  const statusColors = {
    novo: 'default',
    contatado: 'accent',
    matriculado: 'success',
    desistente: 'destructive',
  } as const;

  const statusLabels = {
    novo: 'Novo',
    contatado: 'Contatado',
    matriculado: 'Matriculado',
    desistente: 'Desistente',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Alunos Interessados</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os alunos interessados em cursos
          </p>
        </div>
        <Button onClick={() => handleOpenCadastro()}>
          <Plus className="h-4 w-4 mr-2" />
          Cadastrar Aluno
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
          <CardDescription>Busque e filtre alunos interessados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou curso..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(value) => handleStatusFilterChange(value as StatusInteressado | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="novo">Novo</SelectItem>
                <SelectItem value="contatado">Contatado</SelectItem>
                <SelectItem value="matriculado">Matriculado</SelectItem>
                <SelectItem value="desistente">Desistente</SelectItem>
              </SelectContent>
            </Select>

            {/* Escolaridade Filter */}
            <Select value={escolaridadeFilter} onValueChange={handleEscolaridadeFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Escolaridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as escolaridades</SelectItem>
                <SelectItem value="fundamental_incompleto">Fundamental Incompleto</SelectItem>
                <SelectItem value="fundamental_completo">Fundamental Completo</SelectItem>
                <SelectItem value="medio_incompleto">Médio Incompleto</SelectItem>
                <SelectItem value="medio_completo">Médio Completo</SelectItem>
                <SelectItem value="superior_incompleto">Superior Incompleto</SelectItem>
                <SelectItem value="superior_completo">Superior Completo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-semibold">{filteredAlunos.length}</p>
              </div>
              <UserCircle className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Novos</p>
                <p className="text-2xl font-semibold text-primary">
                  {filteredAlunos.filter((a) => a.status === 'novo').length}
                </p>
              </div>
              <UserCircle className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Contatados</p>
                <p className="text-2xl font-semibold text-accent">
                  {filteredAlunos.filter((a) => a.status === 'contatado').length}
                </p>
              </div>
              <Phone className="h-8 w-8 text-accent opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Matriculados</p>
                <p className="text-2xl font-semibold text-green-600">
                  {filteredAlunos.filter((a) => a.status === 'matriculado').length}
                </p>
              </div>
              <GraduationCap className="h-8 w-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alunos List */}
      <div className="space-y-4">
        {filteredAlunos.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <UserCircle className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum aluno interessado encontrado</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== 'all' || escolaridadeFilter !== 'all'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece cadastrando o primeiro aluno interessado'}
                </p>
                {!searchTerm && statusFilter === 'all' && escolaridadeFilter === 'all' && (
                  <Button onClick={() => handleOpenCadastro()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar Primeiro Aluno
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {paginatedAlunos.map((aluno) => (
              <Card key={aluno.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <UserCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{aluno.nome}</h3>
                          <Badge variant={statusColors[aluno.status]}>
                            {statusLabels[aluno.status]}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span className="truncate">{aluno.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{aluno.telefone}</span>
                          </div>
                          {aluno.idade && (
                            <div className="flex items-center gap-2">
                              <UserCircle className="h-4 w-4" />
                              <span>{aluno.idade} anos</span>
                            </div>
                          )}
                          {aluno.escolaridade && (
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4" />
                              <span className="capitalize">{aluno.escolaridade.replace(/_/g, ' ')}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 col-span-2">
                            <GraduationCap className="h-4 w-4" />
                            <span className="font-medium">Curso de interesse: {aluno.cursoInteresse}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenCadastro(aluno)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Mostrando {startIndex + 1} a {Math.min(endIndex, filteredAlunos.length)} de {filteredAlunos.length} alunos
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="min-w-[2.5rem]"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Cadastro Dialog */}
      <Dialog open={showCadastroDialog} onOpenChange={setShowCadastroDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedInteressado ? 'Detalhes do Aluno Interessado' : 'Cadastrar Aluno Interessado'}
            </DialogTitle>
            <DialogDescription>
              Preencha todos os campos obrigatórios para cadastrar o aluno
            </DialogDescription>
          </DialogHeader>

          {/* Link de Cadastro */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            {/* Responsável (opcional) */}
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
              </div>
            </div>

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

            {/* Cor/Raça */}
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
                {corRacaWatch === 'indigena' && (
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

            {/* Informações de Saúde */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Informações de Saúde</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="alergias">Alergias</Label>
                  <Textarea
                    id="alergias"
                    {...register('alergias')}
                    placeholder="Descreva se possui alguma alergia"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deficiencias">Deficiências</Label>
                  <Textarea
                    id="deficiencias"
                    {...register('deficiencias')}
                    placeholder="Descreva se possui alguma deficiência"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Documentos Entregues */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Documentos Entregues</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="documentos.identidade"
                    onCheckedChange={(checked) => setValue('documentos.identidade', !!checked)}
                  />
                  <Label htmlFor="documentos.identidade" className="font-normal cursor-pointer">
                    Identidade (RG ou CNH)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="documentos.comprovanteEscolaridade"
                    onCheckedChange={(checked) => setValue('documentos.comprovanteEscolaridade', !!checked)}
                  />
                  <Label htmlFor="documentos.comprovanteEscolaridade" className="font-normal cursor-pointer">
                    Comprovante de Escolaridade
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="documentos.comprovanteResidencia"
                    onCheckedChange={(checked) => setValue('documentos.comprovanteResidencia', !!checked)}
                  />
                  <Label htmlFor="documentos.comprovanteResidencia" className="font-normal cursor-pointer">
                    Comprovante de Residência
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="documentos.outro"
                    onCheckedChange={(checked) => setValue('documentos.outro', !!checked)}
                  />
                  <Label htmlFor="documentos.outro" className="font-normal cursor-pointer">
                    Outro
                  </Label>
                </div>
              </div>
            </div>

            {/* Confirmação */}
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="informacoesCorretas"
                  onCheckedChange={(checked) => setValue('informacoesCorretas', !!checked)}
                  className={errors.informacoesCorretas ? 'border-destructive' : ''}
                />
                <Label htmlFor="informacoesCorretas" className="font-normal cursor-pointer">
                  Certifico que as informações acima estão corretas e atualizadas <span className="text-destructive">*</span>
                </Label>
              </div>
              {errors.informacoesCorretas && (
                <p className="text-sm text-destructive ml-6">{errors.informacoesCorretas.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCadastroDialog(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Cadastro'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
