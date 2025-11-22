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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cancelamentoAulaSchema, type CancelamentoAulaFormData } from '@/lib/schemas';
import { AlertTriangle, Calendar, Clock } from 'lucide-react';
import type { AulaEmenta } from '@/lib/types';

interface CancelamentoAulaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CancelamentoAulaFormData) => void;
  aula: AulaEmenta | null;
}

const MOTIVOS_CANCELAMENTO = [
  'Feriado',
  'Instrutor indisponível',
  'Problemas técnicos',
  'Falta de quórum',
  'Evento institucional',
  'Outros',
];

export function CancelamentoAulaDialog({
  open,
  onOpenChange,
  onSubmit,
  aula,
}: CancelamentoAulaDialogProps) {
  const [loading, setLoading] = useState(false);
  const [comReposicao, setComReposicao] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CancelamentoAulaFormData>({
    resolver: zodResolver(cancelamentoAulaSchema),
    defaultValues: {
      data: new Date().toISOString().split('T')[0],
      motivo: '',
      justificativa: '',
    },
  });

  const motivoWatch = watch('motivo');

  const handleFormSubmit = async (data: CancelamentoAulaFormData) => {
    setLoading(true);
    try {
      await onSubmit(data);
      reset();
      setComReposicao(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao cancelar aula:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setComReposicao(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Cancelar Aula
          </DialogTitle>
          <DialogDescription>
            {aula && `Aula ${aula.numero}: ${aula.titulo}`}
          </DialogDescription>
        </DialogHeader>

        <Alert variant="destructive" className="border-destructive/50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Atenção: O cancelamento de aula será registrado no histórico da turma e
            os alunos serão notificados (funcionalidade simulada).
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Data do Cancelamento */}
          <div className="space-y-2">
            <Label htmlFor="data">
              Data da Aula Cancelada <span className="text-destructive">*</span>
            </Label>
            <Input
              id="data"
              type="date"
              {...register('data')}
            />
            {errors.data && (
              <p className="text-sm text-destructive">{errors.data.message}</p>
            )}
          </div>

          {/* Motivo */}
          <div className="space-y-2">
            <Label htmlFor="motivo">
              Motivo <span className="text-destructive">*</span>
            </Label>
            <Select
              value={motivoWatch}
              onValueChange={(value) => setValue('motivo', value)}
            >
              <SelectTrigger id="motivo">
                <SelectValue placeholder="Selecione o motivo" />
              </SelectTrigger>
              <SelectContent>
                {MOTIVOS_CANCELAMENTO.map((motivo) => (
                  <SelectItem key={motivo} value={motivo}>
                    {motivo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.motivo && (
              <p className="text-sm text-destructive">{errors.motivo.message}</p>
            )}
          </div>

          {/* Justificativa */}
          <div className="space-y-2">
            <Label htmlFor="justificativa">
              Justificativa Detalhada <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="justificativa"
              placeholder="Descreva os detalhes do cancelamento..."
              rows={4}
              {...register('justificativa')}
            />
            {errors.justificativa && (
              <p className="text-sm text-destructive">{errors.justificativa.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Esta informação será registrada no histórico da turma
            </p>
          </div>

          {/* Checkbox para Reposição */}
          <div className="flex items-start space-x-3 rounded-lg border p-4">
            <Checkbox
              id="comReposicao"
              checked={comReposicao}
              onCheckedChange={(checked) => setComReposicao(!!checked)}
            />
            <div className="space-y-1 leading-none">
              <Label
                htmlFor="comReposicao"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Agendar reposição desta aula
              </Label>
              <p className="text-sm text-muted-foreground">
                Marque se deseja agendar uma data de reposição agora
              </p>
            </div>
          </div>

          {/* Campos de Reposição (condicional) */}
          {comReposicao && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Dados da Reposição
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reposicaoData">
                    Data da Reposição <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="reposicaoData"
                    type="date"
                    {...register('reposicao.data')}
                  />
                  {errors.reposicao?.data && (
                    <p className="text-sm text-destructive">
                      {errors.reposicao.data.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reposicaoHorario">
                    Horário <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="reposicaoHorario"
                    type="time"
                    {...register('reposicao.horario')}
                  />
                  {errors.reposicao?.horario && (
                    <p className="text-sm text-destructive">
                      {errors.reposicao.horario.message}
                    </p>
                  )}
                </div>
              </div>

              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  A reposição será registrada e os alunos serão notificados
                  automaticamente.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Confirmar Cancelamento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
