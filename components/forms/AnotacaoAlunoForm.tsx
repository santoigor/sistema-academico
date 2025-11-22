'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { anotacaoAlunoSchema, type AnotacaoAlunoFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AnotacaoAlunoFormProps {
  onSubmit: (data: AnotacaoAlunoFormData) => void;
  isSubmitting?: boolean;
  initialData?: Partial<AnotacaoAlunoFormData>;
  submitLabel?: string;
}

export function AnotacaoAlunoForm({
  onSubmit,
  isSubmitting = false,
  initialData,
  submitLabel = 'Salvar Anotação',
}: AnotacaoAlunoFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AnotacaoAlunoFormData>({
    resolver: zodResolver(anotacaoAlunoSchema),
    defaultValues: {
      tipo: initialData?.tipo || 'geral',
      titulo: initialData?.titulo || '',
      conteudo: initialData?.conteudo || '',
      privada: initialData?.privada || false,
    },
  });

  const tipo = watch('tipo');
  const privada = watch('privada');

  const tipoOptions = [
    { value: 'comportamento', label: 'Comportamento', description: 'Observações sobre atitude e conduta' },
    { value: 'desempenho', label: 'Desempenho', description: 'Notas sobre performance acadêmica' },
    { value: 'geral', label: 'Geral', description: 'Observações gerais' },
    { value: 'alerta', label: 'Alerta', description: 'Situações que requerem atenção' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nova Anotação Pedagógica</CardTitle>
          <CardDescription>
            Registre observações sobre o aluno que ajudem no acompanhamento pedagógico
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tipo de Anotação */}
          <div>
            <Label htmlFor="tipo">Tipo de Anotação *</Label>
            <Select
              value={tipo}
              onValueChange={(value) =>
                setValue('tipo', value as 'comportamento' | 'desempenho' | 'geral' | 'alerta')
              }
            >
              <SelectTrigger className={errors.tipo ? 'border-destructive' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tipoOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <p className="font-medium">{option.label}</p>
                      <p className="text-xs text-white">{option.description}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tipo && (
              <p className="text-sm text-destructive mt-1">{errors.tipo.message}</p>
            )}
          </div>

          {/* Título */}
          <div>
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              placeholder="Ex: Participação ativa nas discussões"
              {...register('titulo')}
              className={errors.titulo ? 'border-destructive' : ''}
            />
            {errors.titulo && (
              <p className="text-sm text-destructive mt-1">{errors.titulo.message}</p>
            )}
          </div>

          {/* Conteúdo */}
          <div>
            <Label htmlFor="conteudo">Observação *</Label>
            <Textarea
              id="conteudo"
              placeholder="Descreva a observação em detalhes..."
              {...register('conteudo')}
              className={errors.conteudo ? 'border-destructive' : ''}
              rows={5}
            />
            {errors.conteudo && (
              <p className="text-sm text-destructive mt-1">{errors.conteudo.message}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Seja específico e objetivo. Esta informação será útil para o acompanhamento do aluno.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Botões */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
