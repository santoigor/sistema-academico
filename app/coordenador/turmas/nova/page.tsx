'use client';

import { useState } from 'react';
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
import { ArrowLeft, Save, Loader2, Calendar, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useEffect, useMemo } from 'react';

const DIAS_SEMANA = [
  { value: 'segunda', label: 'Segunda' },
  { value: 'terca', label: 'Terça' },
  { value: 'quarta', label: 'Quarta' },
  { value: 'quinta', label: 'Quinta' },
  { value: 'sexta', label: 'Sexta' },
  { value: 'sabado', label: 'Sábado' },
  { value: 'domingo', label: 'Domingo' },
];

const DIAS_SEMANA_MAP: Record<string, number> = {
  'domingo': 0,
  'segunda': 1,
  'terca': 2,
  'quarta': 3,
  'quinta': 4,
  'sexta': 5,
  'sabado': 6,
};

export default function NovaTurmaPage() {
  const router = useRouter();
  const { addTurma, ementas, instrutores } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aulasDatas, setAulasDatas] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TurmaFormData>({
    resolver: zodResolver(turmaSchema),
    defaultValues: {
      diasSemana: [],
      vagasTotal: 30,
    },
  });

  const instrutorIdWatch = watch('instrutorId');
  const ementaIdWatch = watch('ementaId');
  const diasSemanaWatch = watch('diasSemana');
  const dataInicioWatch = watch('dataInicio');
  const dataFimWatch = watch('dataFim');

  // Get only active ementas
  const ementasDisponiveis = ementas.filter((e) => e.ativo);

  // Get selected ementa
  const ementaSelecionada = useMemo(() => {
    return ementasDisponiveis.find((e) => e.id === ementaIdWatch);
  }, [ementaIdWatch, ementasDisponiveis]);

  // Function to calculate class dates automatically
  const calcularDatasAulas = useMemo(() => {
    if (!dataInicioWatch || !dataFimWatch || !diasSemanaWatch || diasSemanaWatch.length === 0 || !ementaSelecionada) {
      return [];
    }

    const inicio = new Date(dataInicioWatch + 'T00:00:00');
    const fim = new Date(dataFimWatch + 'T00:00:00');
    const diasSemanaNumeros = diasSemanaWatch.map(dia => DIAS_SEMANA_MAP[dia]).sort((a, b) => a - b);

    const datas: string[] = [];
    const currentDate = new Date(inicio);

    // Generate dates for all classes
    while (currentDate <= fim && datas.length < ementaSelecionada.aulas.length) {
      const diaSemana = currentDate.getDay();

      if (diasSemanaNumeros.includes(diaSemana)) {
        datas.push(currentDate.toISOString().split('T')[0]);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return datas;
  }, [dataInicioWatch, dataFimWatch, diasSemanaWatch, ementaSelecionada]);

  // Auto-fill dates when parameters change
  useEffect(() => {
    if (ementaSelecionada && calcularDatasAulas.length > 0) {
      const novasDatas: Record<string, string> = {};
      ementaSelecionada.aulas.forEach((aula, index) => {
        if (calcularDatasAulas[index]) {
          novasDatas[aula.id] = calcularDatasAulas[index];
        }
      });
      setAulasDatas(novasDatas);
    }
  }, [calcularDatasAulas, ementaSelecionada]);

  const onSubmit = async (data: TurmaFormData) => {
    setIsSubmitting(true);
    try {
      // Find selected entities
      const instrutor = instrutores.find((i) => i.id === data.instrutorId);
      const ementa = ementasDisponiveis.find((e) => e.id === data.ementaId);

      if (!instrutor || !ementa) {
        throw new Error('Dados inválidos');
      }

      // Create turma
      addTurma({
        codigo: data.codigo,
        ementaId: data.ementaId,
        ementa: ementa.titulo,
        instrutorId: data.instrutorId,
        instrutor: instrutor.nome,
        status: 'planejada',
        dataInicio: data.dataInicio,
        dataFim: data.dataFim,
        horario: data.horario,
        diasSemana: data.diasSemana,
        sala: data.sala,
        vagasTotal: data.vagasTotal,
        vagasOcupadas: 0,
        alunos: [],
        observacoes: data.observacoes,
        dataCriacao: new Date().toISOString().split('T')[0],
      });

      // Redirect to turmas list
      router.push('/coordenador/turmas');
    } catch (error) {
      console.error('Erro ao criar turma:', error);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/coordenador/turmas">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Nova Turma</h1>
          <p className="text-muted-foreground mt-1">
            Preencha os dados para cadastrar uma nova turma
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
                  <div className="flex gap-2">
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
                    <Link href="/coordenador/ementas/nova">
                      <Button type="button" variant="outlinePrimary">
                        Nova Ementa
                      </Button>
                    </Link>
                  </div>
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
                </div>
              </CardContent>
            </Card>

            {/* Agendamento de Aulas */}
            {ementaSelecionada && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Agendamento de Aulas</CardTitle>
                      <CardDescription>
                        {ementaSelecionada.aulas.length} aulas - Defina as datas específicas
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {Object.keys(aulasDatas).length} / {ementaSelecionada.aulas.length} agendadas
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {!dataInicioWatch || !dataFimWatch || !diasSemanaWatch || diasSemanaWatch.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        Preencha as datas de início e fim e selecione os dias da semana para agendar as aulas
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {ementaSelecionada.aulas.map((aula, index) => (
                        <div
                          key={aula.id}
                          className="flex items-start gap-3 p-4 border rounded-lg bg-muted/20"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <BookOpen className="h-4 w-4 text-primary" />
                              <p className="font-medium text-sm">
                                Aula {aula.numero}: {aula.titulo}
                              </p>
                              <Badge variant="secondary" className="text-xs capitalize">
                                {aula.tipo}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Carga horária: {aula.cargaHoraria}h
                            </p>
                          </div>
                          <div className="w-40">
                            <Input
                              type="date"
                              value={aulasDatas[aula.id] || ''}
                              onChange={(e) => {
                                setAulasDatas({
                                  ...aulasDatas,
                                  [aula.id]: e.target.value,
                                });
                              }}
                              min={dataInicioWatch}
                              max={dataFimWatch}
                              className="text-sm"
                            />
                          </div>
                        </div>
                      ))}
                      {calcularDatasAulas.length < ementaSelecionada.aulas.length && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            <strong>Atenção:</strong> O período selecionado ({dataInicioWatch} a {dataFimWatch})
                            nos dias da semana escolhidos não é suficiente para agendar todas as {ementaSelecionada.aulas.length} aulas.
                            Apenas {calcularDatasAulas.length} aulas foram agendadas automaticamente.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
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
                      Salvar Turma
                    </>
                  )}
                </Button>
                <Link href="/coordenador/turmas">
                  <Button type="button" variant="outline" className="w-full">
                    Cancelar
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Dicas</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• O código da turma deve ser único</p>
                <p>• Selecione uma ementa que define o conteúdo do curso</p>
                <p>• Selecione pelo menos um dia da semana</p>
                <p>• As datas das aulas são calculadas automaticamente</p>
                <p>• Você pode ajustar manualmente a data de cada aula</p>
                <p>• A turma será criada com status "Planejada"</p>
              </CardContent>
            </Card>

            {/* Info sobre agendamento */}
            {ementaSelecionada && calcularDatasAulas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Informações do Agendamento</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Total de Aulas</p>
                    <p className="font-medium text-foreground">{ementaSelecionada.aulas.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Datas Disponíveis</p>
                    <p className="font-medium text-foreground">{calcularDatasAulas.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Carga Horária Total</p>
                    <p className="font-medium text-foreground">{ementaSelecionada.cargaHorariaTotal}h</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
