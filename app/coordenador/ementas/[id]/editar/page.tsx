'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useData } from '@/lib/data-context';
import { ementaSchema, type EmentaFormData } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Loader2, Plus, Trash2, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function EditarEmentaPage() {
  const params = useParams();
  const router = useRouter();
  const { getEmenta, updateEmenta, cursos } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const ementaId = params.id as string;
  const ementa = getEmenta(ementaId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<EmentaFormData>({
    resolver: zodResolver(ementaSchema),
    defaultValues: {
      cursoId: '',
      objetivosGerais: ['Objetivo geral da ementa'],
      descricao: '',
      aulas: [],
      materialDidatico: [],
      avaliacoes: [],
    },
  });

  // Field arrays
  const { fields: aulasFields, append: appendAula, remove: removeAula } = useFieldArray({
    control,
    name: 'aulas',
  });

  // Load ementa data
  useEffect(() => {
    if (ementa) {
      reset({
        cursoId: ementa.cursoId,
        titulo: ementa.titulo,
        descricao: ementa.descricao,
        cargaHorariaTotal: ementa.cargaHorariaTotal,
        objetivosGerais: ementa.objetivosGerais,
        aulas: ementa.aulas.map(aula => ({
          numero: aula.numero,
          titulo: aula.titulo,
          tipo: aula.tipo,
          cargaHoraria: aula.cargaHoraria,
          objetivos: aula.objetivos,
          conteudo: aula.conteudo,
          atividadesPraticas: aula.atividadesPraticas || [],
          recursos: aula.recursos || [],
          observacoes: aula.observacoes || '',
        })),
        materialDidatico: ementa.materialDidatico || [],
        avaliacoes: ementa.avaliacoes || [],
        prerequisitos: ementa.prerequisitos,
      });
      setIsLoading(false);
    }
  }, [ementa, reset]);

  if (!ementa) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/coordenador/ementas">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-lg font-medium mb-2">Ementa não encontrada</h3>
              <p className="text-sm text-muted-foreground mb-4">
                A ementa solicitada não existe ou foi removida
              </p>
              <Link href="/coordenador/ementas">
                <Button variant="outlinePrimary">Ver todas as ementas</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onSubmit = async (data: EmentaFormData) => {
    setIsSubmitting(true);
    try {
      const curso = cursos.find((c) => c.id === data.cursoId);
      if (!curso) {
        throw new Error('Curso não encontrado');
      }

      updateEmenta(ementaId, {
        ...ementa,
        cursoId: data.cursoId,
        curso: curso.nome,
        titulo: data.titulo,
        descricao: data.descricao,
        cargaHorariaTotal: data.cargaHorariaTotal,
        objetivosGerais: data.objetivosGerais,
        aulas: data.aulas.map((aula, index) => ({
          id: ementa.aulas[index]?.id || `aula-${Date.now()}-${index}`,
          numero: aula.numero,
          titulo: aula.titulo,
          tipo: aula.tipo,
          cargaHoraria: aula.cargaHoraria,
          objetivos: aula.objetivos,
          conteudo: aula.conteudo,
          atividadesPraticas: aula.atividadesPraticas,
          recursos: aula.recursos,
          observacoes: aula.observacoes,
        })),
        materialDidatico: data.materialDidatico,
        avaliacoes: data.avaliacoes,
        prerequisitos: data.prerequisitos,
      });

      router.push(`/coordenador/ementas/${ementaId}`);
    } catch (error) {
      console.error('Erro ao atualizar ementa:', error);
      alert('Erro ao atualizar ementa. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAula = () => {
    appendAula({
      numero: aulasFields.length + 1,
      titulo: '',
      tipo: 'teorica',
      cargaHoraria: 2,
      objetivos: ['Objetivo da aula'],
      conteudo: ['Conteúdo da aula'],
      atividadesPraticas: [],
      recursos: [],
      observacoes: '',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/coordenador/ementas/${ementaId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Editar Ementa</h1>
          <p className="text-muted-foreground mt-1">
            {ementa.titulo}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>Dados principais da ementa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Hidden curso field */}
                <input type="hidden" {...register('cursoId')} />

                {/* Título */}
                <div className="space-y-2">
                  <Label htmlFor="titulo">
                    Nome da Ementa <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="titulo"
                    placeholder="Ex: Desenvolvimento Web Fullstack"
                    {...register('titulo')}
                    className={errors.titulo ? 'border-destructive' : ''}
                  />
                  {errors.titulo && (
                    <p className="text-sm text-destructive">{errors.titulo.message}</p>
                  )}
                </div>

                {/* Descrição */}
                <div className="space-y-2">
                  <Label htmlFor="descricao">
                    Descrição <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descreva os objetivos e conteúdo da ementa..."
                    rows={4}
                    {...register('descricao')}
                    className={errors.descricao ? 'border-destructive' : ''}
                  />
                  {errors.descricao && (
                    <p className="text-sm text-destructive">{errors.descricao.message}</p>
                  )}
                </div>

                {/* Carga Horária Total */}
                <div className="space-y-2">
                  <Label htmlFor="cargaHorariaTotal">
                    Carga Horária Total (horas) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="cargaHorariaTotal"
                    type="number"
                    placeholder="120"
                    {...register('cargaHorariaTotal', { valueAsNumber: true })}
                    className={errors.cargaHorariaTotal ? 'border-destructive' : ''}
                  />
                  {errors.cargaHorariaTotal && (
                    <p className="text-sm text-destructive">{errors.cargaHorariaTotal.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Aulas */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Aulas</CardTitle>
                    <CardDescription>
                      {aulasFields.length} aula(s) cadastrada(s)
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outlinePrimary"
                    size="sm"
                    onClick={handleAddAula}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Aula
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {aulasFields.map((field, aulaIndex) => (
                  <Card key={field.id} className="border-2">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">Aula {aulaIndex + 1}</CardTitle>
                        </div>
                        {aulasFields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAula(aulaIndex)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Número da Aula (hidden) */}
                      <input type="hidden" {...register(`aulas.${aulaIndex}.numero`)} value={aulaIndex + 1} />
                      {/* Hidden required fields */}
                      <input type="hidden" {...register(`aulas.${aulaIndex}.objetivos.0`)} value="Objetivo da aula" />
                      <input type="hidden" {...register(`aulas.${aulaIndex}.conteudo.0`)} value="Conteúdo da aula" />

                      {/* Título da Aula */}
                      <div className="space-y-2">
                        <Label htmlFor={`aulas.${aulaIndex}.titulo`}>
                          Nome da Aula <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`aulas.${aulaIndex}.titulo`}
                          placeholder="Ex: Introdução ao HTML"
                          {...register(`aulas.${aulaIndex}.titulo`)}
                          className={errors.aulas?.[aulaIndex]?.titulo ? 'border-destructive' : ''}
                        />
                        {errors.aulas?.[aulaIndex]?.titulo && (
                          <p className="text-sm text-destructive">
                            {errors.aulas[aulaIndex].titulo?.message}
                          </p>
                        )}
                      </div>

                      {/* Carga Horária */}
                      <div className="space-y-2">
                        <Label htmlFor={`aulas.${aulaIndex}.cargaHoraria`}>
                          Carga Horária (horas) <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`aulas.${aulaIndex}.cargaHoraria`}
                          type="number"
                          step="0.5"
                          placeholder="2"
                          {...register(`aulas.${aulaIndex}.cargaHoraria`, { valueAsNumber: true })}
                          className={errors.aulas?.[aulaIndex]?.cargaHoraria ? 'border-destructive' : ''}
                        />
                      </div>

                      {/* Descrição da Aula */}
                      <div className="space-y-2">
                        <Label htmlFor={`aulas.${aulaIndex}.observacoes`}>
                          Descrição
                        </Label>
                        <Textarea
                          id={`aulas.${aulaIndex}.observacoes`}
                          placeholder="Descreva o conteúdo desta aula..."
                          rows={3}
                          {...register(`aulas.${aulaIndex}.observacoes`)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
                <Link href={`/coordenador/ementas/${ementaId}`}>
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
                <p>• Todas as alterações substituem os dados anteriores</p>
                <p>• Remover uma aula não pode ser desfeito</p>
                <p>• Certifique-se de revisar antes de salvar</p>
                <p>• Você pode adicionar ou remover aulas</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
