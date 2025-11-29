'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useData } from '@/lib/data-context';
import { turmaSchema, type TurmaFormData } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const DIAS_SEMANA = [
  { value: 'segunda', label: 'Segunda' },
  { value: 'terca', label: 'Terça' },
  { value: 'quarta', label: 'Quarta' },
  { value: 'quinta', label: 'Quinta' },
  { value: 'sexta', label: 'Sexta' },
  { value: 'sabado', label: 'Sábado' },
  { value: 'domingo', label: 'Domingo' },
];

export default function EditarTurmaPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getTurma, updateTurma, ementas, instrutores } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const turma = getTurma(resolvedParams.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TurmaFormData>({
    resolver: zodResolver(turmaSchema),
    defaultValues: turma ? {
      codigo: turma.codigo,
      ementaId: turma.ementaId,
      instrutorId: turma.instrutorId,
      dataInicio: turma.dataInicio,
      dataFim: turma.dataFim,
      horario: turma.horario,
      diasSemana: turma.diasSemana,
      sala: turma.sala || '',
      vagasTotal: turma.vagasTotal,
      observacoes: turma.observacoes || '',
    } : undefined,
  });

  const instrutorIdWatch = watch('instrutorId');
  const ementaIdWatch = watch('ementaId');
  const diasSemanaWatch = watch('diasSemana');

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

  // Check if turma can be edited
  const canEdit = turma.status !== 'finalizada' && turma.status !== 'cancelada';

  if (!canEdit) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/coordenador/turmas/${turma.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-semibold">Editar Turma</h1>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Esta turma não pode ser editada porque está {turma.status === 'finalizada' ? 'finalizada' : 'cancelada'}.
              </p>
              <Link href={`/coordenador/turmas/${turma.id}`}>
                <Button>Voltar para Detalhes da Turma</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const ementasDisponiveis = ementas.filter((e) => e.ativo);

  const onSubmit = async (data: TurmaFormData) => {
    setIsSubmitting(true);
    try {
      const instrutor = instrutores.find((i) => i.id === data.instrutorId);
      const ementa = ementasDisponiveis.find((e) => e.id === data.ementaId);

      if (!instrutor || !ementa) {
        throw new Error('Dados inválidos');
      }

      updateTurma(turma.id, {
        codigo: data.codigo,
        ementaId: data.ementaId,
        ementa: ementa.titulo,
        instrutorId: data.instrutorId,
        instrutor: instrutor.nome,
        dataInicio: data.dataInicio,
        dataFim: data.dataFim,
        horario: data.horario,
        diasSemana: data.diasSemana,
        sala: data.sala,
        vagasTotal: data.vagasTotal,
        observacoes: data.observacoes,
      });

      router.push(`/coordenador/turmas/${turma.id}`);
    } catch (error) {
      console.error('Erro ao atualizar turma:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiaChange = (dia: string, checked: boolean) => {
    const current = diasSemanaWatch || [];
    const updated = checked
      ? [...current, dia]
      : current.filter((d) => d !== dia);
    setValue('diasSemana', updated);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/coordenador/turmas/${turma.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold text-foreground">Editar Turma</h1>
            <Badge variant={statusColors[turma.status]}>
              {statusLabels[turma.status]}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            {turma.codigo} - {turma.ementa}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>Dados principais da turma</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Código */}
                <div className="space-y-2">
                  <Label htmlFor="codigo">
                    Código da Turma <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="codigo"
                    placeholder="Ex: WEB-2025-01"
                    {...register('codigo')}
                    className={errors.codigo ? 'border-destructive' : ''}
                  />
                  {errors.codigo && (
                    <p className="text-sm text-destructive">{errors.codigo.message}</p>
                  )}
                </div>

                {/* Ementa */}
                <div className="space-y-2">
                  <Label htmlFor="ementaId">
                    Ementa <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={ementaIdWatch}
                    onValueChange={(value) => setValue('ementaId', value)}
                  >
                    <SelectTrigger className={errors.ementaId ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Selecione uma ementa" />
                    </SelectTrigger>
                    <SelectContent>
                      {ementasDisponiveis.map((ementa) => (
                        <SelectItem key={ementa.id} value={ementa.id}>
                          {ementa.titulo} - {ementa.curso} ({ementa.cargaHorariaTotal}h)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.ementaId && (
                    <p className="text-sm text-destructive">{errors.ementaId.message}</p>
                  )}
                </div>

                {/* Instrutor */}
                <div className="space-y-2">
                  <Label htmlFor="instrutorId">
                    Instrutor <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={instrutorIdWatch}
                    onValueChange={(value) => setValue('instrutorId', value)}
                  >
                    <SelectTrigger className={errors.instrutorId ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Selecione um instrutor" />
                    </SelectTrigger>
                    <SelectContent>
                      {instrutores
                        .filter((i) => i.status === 'ativo')
                        .map((instrutor) => (
                          <SelectItem key={instrutor.id} value={instrutor.id}>
                            {instrutor.nome} - {instrutor.especialidades.join(', ')}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.instrutorId && (
                    <p className="text-sm text-destructive">{errors.instrutorId.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Agenda</CardTitle>
                <CardDescription>Datas e horários da turma</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Data Início */}
                  <div className="space-y-2">
                    <Label htmlFor="dataInicio">
                      Data de Início <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="dataInicio"
                      type="date"
                      {...register('dataInicio')}
                      className={errors.dataInicio ? 'border-destructive' : ''}
                    />
                    {errors.dataInicio && (
                      <p className="text-sm text-destructive">{errors.dataInicio.message}</p>
                    )}
                  </div>

                  {/* Data Fim */}
                  <div className="space-y-2">
                    <Label htmlFor="dataFim">
                      Data de Término <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="dataFim"
                      type="date"
                      {...register('dataFim')}
                      className={errors.dataFim ? 'border-destructive' : ''}
                    />
                    {errors.dataFim && (
                      <p className="text-sm text-destructive">{errors.dataFim.message}</p>
                    )}
                  </div>
                </div>

                {/* Horário */}
                <div className="space-y-2">
                  <Label htmlFor="horario">
                    Horário <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="horario"
                    placeholder="Ex: 19:00 - 22:00"
                    {...register('horario')}
                    className={errors.horario ? 'border-destructive' : ''}
                  />
                  {errors.horario && (
                    <p className="text-sm text-destructive">{errors.horario.message}</p>
                  )}
                </div>

                {/* Dias da Semana */}
                <div className="space-y-2">
                  <Label>
                    Dias da Semana <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {DIAS_SEMANA.map((dia) => (
                      <div key={dia.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={dia.value}
                          checked={diasSemanaWatch?.includes(dia.value)}
                          onCheckedChange={(checked) => handleDiaChange(dia.value, !!checked)}
                        />
                        <Label
                          htmlFor={dia.value}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {dia.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.diasSemana && (
                    <p className="text-sm text-destructive">{errors.diasSemana.message}</p>
                  )}
                </div>

                {/* Sala */}
                <div className="space-y-2">
                  <Label htmlFor="sala">Sala</Label>
                  <Input
                    id="sala"
                    placeholder="Ex: Sala 101"
                    {...register('sala')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Capacity */}
            <Card>
              <CardHeader>
                <CardTitle>Capacidade</CardTitle>
                <CardDescription>Número de vagas para a turma</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vagasTotal">
                    Total de Vagas <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="vagasTotal"
                    type="number"
                    placeholder="30"
                    {...register('vagasTotal', { valueAsNumber: true })}
                    className={errors.vagasTotal ? 'border-destructive' : ''}
                  />
                  {errors.vagasTotal && (
                    <p className="text-sm text-destructive">{errors.vagasTotal.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Vagas ocupadas atualmente: {turma.vagasOcupadas}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Observações */}
            <Card>
              <CardHeader>
                <CardTitle>Observações</CardTitle>
                <CardDescription>Informações adicionais sobre a turma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <textarea
                    id="observacoes"
                    {...register('observacoes')}
                    className="w-full min-h-[100px] px-3 py-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Adicione observações sobre a turma..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
                <Link href={`/coordenador/turmas/${turma.id}`}>
                  <Button type="button" variant="outline" className="w-full">
                    Cancelar
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Current Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Informações Atuais</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant={statusColors[turma.status]} className="mt-1">
                    {statusLabels[turma.status]}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Vagas Ocupadas</p>
                  <p className="font-medium">{turma.vagasOcupadas} / {turma.vagasTotal}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Alunos Matriculados</p>
                  <p className="font-medium">{turma.alunos?.length || 0}</p>
                </div>
                {turma.dataCriacao && (
                  <div>
                    <p className="text-xs text-muted-foreground">Criado em</p>
                    <p className="text-xs">{turma.dataCriacao}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Dicas</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Alterar a ementa afetará o conteúdo programático</p>
                <p>• Não é possível reduzir vagas abaixo do número de alunos matriculados</p>
                <p>• Mudanças nas datas podem afetar o calendário de aulas</p>
                <p>• Turmas finalizadas ou canceladas não podem ser editadas</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
