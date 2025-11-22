'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { diarioAulaSchema, type DiarioAulaFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AulaEmentaSelector } from '@/components/instrutor/AulaEmentaSelector';
import { useState } from 'react';
import type { Aluno, AulaEmenta, DiarioAula, StatusPresenca } from '@/lib/types';

interface DiarioAulaFormProps {
  aulas: AulaEmenta[];
  alunos: Aluno[];
  diarios: DiarioAula[];
  initialData?: Partial<DiarioAulaFormData>;
  onSubmit: (data: DiarioAulaFormData) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function DiarioAulaForm({
  aulas,
  alunos,
  diarios,
  initialData,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Salvar Diário',
}: DiarioAulaFormProps) {
  const [selectedAulaId, setSelectedAulaId] = useState(
    initialData?.aulaEmentaId || ''
  );

  const selectedAula = aulas.find((a) => a.id === selectedAulaId);

  // Calcular próximo número de aula
  const proximoNumero = diarios.length + 1;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DiarioAulaFormData>({
    resolver: zodResolver(diarioAulaSchema),
    defaultValues: {
      aulaEmentaId: initialData?.aulaEmentaId || '',
      aulaTitulo: initialData?.aulaTitulo || '',
      data: initialData?.data || new Date().toISOString().split('T')[0],
      numeroAula: initialData?.numeroAula || proximoNumero,
      tipo: initialData?.tipo || 'teorica',
      conteudo: initialData?.conteudo || '',
      resumo: initialData?.resumo || '',
      observacoes: initialData?.observacoes || '',
      presencas: initialData?.presencas || alunos.map((aluno) => ({
        alunoId: aluno.id,
        alunoNome: aluno.nome,
        status: 'presente' as StatusPresenca,
        justificativa: '',
        observacao: '',
      })),
    },
  });

  const presencas = watch('presencas');
  const tipo = watch('tipo');

  // Atualizar form quando aula é selecionada
  const handleSelectAula = (aulaId: string) => {
    setSelectedAulaId(aulaId);
    const aula = aulas.find((a) => a.id === aulaId);
    if (aula) {
      setValue('aulaEmentaId', aula.id);
      setValue('aulaTitulo', aula.titulo);
      setValue('tipo', aula.tipo);
    }
  };

  const updatePresenca = (
    alunoId: string,
    field: keyof (typeof presencas)[0],
    value: string
  ) => {
    const updatedPresencas = presencas.map((p) =>
      p.alunoId === alunoId ? { ...p, [field]: value } : p
    );
    setValue('presencas', updatedPresencas);
  };

  const estatisticas = {
    presentes: presencas.filter((p) => p.status === 'presente').length,
    ausentes: presencas.filter((p) => p.status === 'ausente').length,
    justificados: presencas.filter((p) => p.status === 'justificado').length,
    abonados: presencas.filter((p) => p.status === 'abonado').length,
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Seletor de Aula da Ementa */}
      <AulaEmentaSelector
        aulas={aulas}
        diarios={diarios}
        selectedAulaId={selectedAulaId}
        onSelectAula={handleSelectAula}
      />
      {errors.aulaEmentaId && (
        <p className="text-sm text-destructive">{errors.aulaEmentaId.message}</p>
      )}

      {selectedAula && (
        <>
          {/* Informações do Diário */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Diário</CardTitle>
              <CardDescription>Preencha os detalhes da aula ministrada</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="data">Data da Aula *</Label>
                  <Input
                    id="data"
                    type="date"
                    {...register('data')}
                    className={errors.data ? 'border-destructive' : ''}
                  />
                  {errors.data && (
                    <p className="text-sm text-destructive mt-1">{errors.data.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="numeroAula">Número Sequencial *</Label>
                  <Input
                    id="numeroAula"
                    type="number"
                    {...register('numeroAula', { valueAsNumber: true })}
                    className={errors.numeroAula ? 'border-destructive' : ''}
                  />
                  {errors.numeroAula && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.numeroAula.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="tipo">Tipo de Aula *</Label>
                  <Select
                    value={tipo}
                    onValueChange={(value) =>
                      setValue('tipo', value as 'teorica' | 'pratica' | 'avaliacao' | 'revisao')
                    }
                  >
                    <SelectTrigger className={errors.tipo ? 'border-destructive' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teorica">Teórica</SelectItem>
                      <SelectItem value="pratica">Prática</SelectItem>
                      <SelectItem value="avaliacao">Avaliação</SelectItem>
                      <SelectItem value="revisao">Revisão</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tipo && (
                    <p className="text-sm text-destructive mt-1">{errors.tipo.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="conteudo">Conteúdo Abordado *</Label>
                <Textarea
                  id="conteudo"
                  placeholder="Descreva o que foi abordado na aula..."
                  {...register('conteudo')}
                  className={errors.conteudo ? 'border-destructive' : ''}
                  rows={3}
                />
                {errors.conteudo && (
                  <p className="text-sm text-destructive mt-1">{errors.conteudo.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="resumo">Resumo da Aula *</Label>
                <Textarea
                  id="resumo"
                  placeholder="Faça um resumo geral da aula..."
                  {...register('resumo')}
                  className={errors.resumo ? 'border-destructive' : ''}
                  rows={3}
                />
                {errors.resumo && (
                  <p className="text-sm text-destructive mt-1">{errors.resumo.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="observacoes">Observações (Opcional)</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Observações adicionais..."
                  {...register('observacoes')}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Registro de Presença */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Registro de Presença</CardTitle>
                  <CardDescription>
                    Marque a presença de todos os alunos
                  </CardDescription>
                </div>
                <div className="flex gap-2 text-sm mt-auto">
                  <p className="text-green-600 font-medium">
                    Presentes: {estatisticas.presentes}
                  </p>
                  <p className="text-red-600">Ausentes: {estatisticas.ausentes}</p>
                  <p className="text-yellow-600">Justificados: {estatisticas.justificados}</p>
                  <p className="text-blue-600">Abonados: {estatisticas.abonados}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Aluno</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Justificativa/Observação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {presencas.map((presenca, index) => (
                      <TableRow key={presenca.alunoId}>
                        <TableCell className="font-medium">{presenca.alunoNome}</TableCell>
                        <TableCell>
                          <RadioGroup
                            value={presenca.status}
                            onValueChange={(value) =>
                              updatePresenca(presenca.alunoId, 'status', value)
                            }
                            className="flex gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="presente"
                                id={`presente-${index}`}
                              />
                              <Label htmlFor={`presente-${index}`} className="cursor-pointer">
                                Presente
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="ausente"
                                id={`ausente-${index}`}
                              />
                              <Label htmlFor={`ausente-${index}`} className="cursor-pointer">
                                Ausente
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="justificado"
                                id={`justificado-${index}`}
                              />
                              <Label htmlFor={`justificado-${index}`} className="cursor-pointer">
                                Justificado
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="abonado"
                                id={`abonado-${index}`}
                              />
                              <Label htmlFor={`abonado-${index}`} className="cursor-pointer">
                                Abonado
                              </Label>
                            </div>
                          </RadioGroup>
                        </TableCell>
                        <TableCell>
                          {(presenca.status === 'justificado' || presenca.status === 'abonado') && (
                            <Input
                              placeholder="Motivo..."
                              value={presenca.justificativa || ''}
                              onChange={(e) =>
                                updatePresenca(
                                  presenca.alunoId,
                                  'justificativa',
                                  e.target.value
                                )
                              }
                              className="w-full"
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedAulaId}>
              {isSubmitting ? 'Salvando...' : submitLabel}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
