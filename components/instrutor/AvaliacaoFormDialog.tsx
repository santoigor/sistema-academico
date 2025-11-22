'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { avaliacaoRealizadaSchema, type AvaliacaoRealizadaFormData } from '@/lib/schemas';
import { Calendar } from 'lucide-react';

interface AvaliacaoFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AvaliacaoRealizadaFormData) => void;
}

export function AvaliacaoFormDialog({
  open,
  onOpenChange,
  onSubmit,
}: AvaliacaoFormDialogProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<AvaliacaoRealizadaFormData>({
    resolver: zodResolver(avaliacaoRealizadaSchema),
    defaultValues: {
      titulo: '',
      tipo: 'prova',
      dataRealizacao: new Date().toISOString().split('T')[0],
      peso: 0,
      descricao: '',
    },
  });

  const tipoWatch = watch('tipo');

  const handleFormSubmit = async (data: AvaliacaoRealizadaFormData) => {
    setLoading(true);
    try {
      await onSubmit(data);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Lançar Nova Avaliação
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da avaliação que será aplicada à turma
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="titulo">
              Título <span className="text-destructive">*</span>
            </Label>
            <Input
              id="titulo"
              placeholder="Ex: Prova Bimestral, Trabalho em Grupo..."
              {...register('titulo')}
            />
            {errors.titulo && (
              <p className="text-sm text-destructive">{errors.titulo.message}</p>
            )}
          </div>

          {/* Tipo e Data - Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tipo */}
            <div className="space-y-2">
              <Label htmlFor="tipo">
                Tipo <span className="text-destructive">*</span>
              </Label>
              <Select
                value={tipoWatch}
                onValueChange={(value) => setValue('tipo', value as any)}
              >
                <SelectTrigger id="tipo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prova">Prova</SelectItem>
                  <SelectItem value="trabalho">Trabalho</SelectItem>
                  <SelectItem value="apresentacao">Apresentação</SelectItem>
                  <SelectItem value="projeto">Projeto</SelectItem>
                  <SelectItem value="participacao">Participação</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo && (
                <p className="text-sm text-destructive">{errors.tipo.message}</p>
              )}
            </div>

            {/* Data de Realização */}
            <div className="space-y-2">
              <Label htmlFor="dataRealizacao">
                Data de Realização <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dataRealizacao"
                type="date"
                {...register('dataRealizacao')}
              />
              {errors.dataRealizacao && (
                <p className="text-sm text-destructive">{errors.dataRealizacao.message}</p>
              )}
            </div>
          </div>

          {/* Peso */}
          <div className="space-y-2">
            <Label htmlFor="peso">
              Peso (% da Nota Final) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="peso"
              type="number"
              min="0"
              max="100"
              placeholder="Ex: 30"
              {...register('peso', { valueAsNumber: true })}
            />
            {errors.peso && (
              <p className="text-sm text-destructive">{errors.peso.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Percentual que esta avaliação representa na média final (0-100)
            </p>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição (Opcional)</Label>
            <Textarea
              id="descricao"
              placeholder="Instruções, critérios de avaliação, observações..."
              rows={4}
              {...register('descricao')}
            />
            {errors.descricao && (
              <p className="text-sm text-destructive">{errors.descricao.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Lançar Avaliação'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
