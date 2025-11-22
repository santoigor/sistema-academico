'use client';

import { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, CheckCircle2 } from 'lucide-react';
import type { InteressadoFormData } from '@/lib/schemas';

interface Step5DocumentosProps {
  register: UseFormRegister<InteressadoFormData>;
  setValue: UseFormSetValue<InteressadoFormData>;
  watch: UseFormWatch<InteressadoFormData>;
}

export function Step5Documentos({ register, setValue, watch }: Step5DocumentosProps) {
  return (
    <div className="space-y-2">
      <div className="text-center mb-1">
        <h3 className="font-semibold text-base">Quase lá!</h3>
        <p className="text-xs text-muted-foreground">Documentos e informações finais</p>
      </div>

      {/* Documentos Entregues */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <h4 className="font-semibold text-sm">Documentos Entregues</h4>
          <span className="text-xs text-muted-foreground">(marque os que você já possui)</span>
        </div>
        <div className="space-y-2 pl-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="documentos.identidade"
              checked={watch('documentos.identidade')}
              onCheckedChange={(checked) => setValue('documentos.identidade', !!checked)}
            />
            <Label htmlFor="documentos.identidade" className="font-normal cursor-pointer flex-1 text-sm">
              Identidade (RG ou CNH)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="documentos.comprovanteEscolaridade"
              checked={watch('documentos.comprovanteEscolaridade')}
              onCheckedChange={(checked) => setValue('documentos.comprovanteEscolaridade', !!checked)}
            />
            <Label htmlFor="documentos.comprovanteEscolaridade" className="font-normal cursor-pointer flex-1 text-sm">
              Comprovante de Escolaridade
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="documentos.comprovanteResidencia"
              checked={watch('documentos.comprovanteResidencia')}
              onCheckedChange={(checked) => setValue('documentos.comprovanteResidencia', !!checked)}
            />
            <Label htmlFor="documentos.comprovanteResidencia" className="font-normal cursor-pointer flex-1 text-sm">
              Comprovante de Residência
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="documentos.outro"
              checked={watch('documentos.outro')}
              onCheckedChange={(checked) => setValue('documentos.outro', !!checked)}
            />
            <Label htmlFor="documentos.outro" className="font-normal cursor-pointer flex-1 text-sm">
              Outro
            </Label>
          </div>
        </div>

        {watch('documentos.outro') && (
          <div className="space-y-1.5 mt-2">
            <Label htmlFor="documentos.outroDescricao" className="text-sm">Especifique</Label>
            <Input
              id="documentos.outroDescricao"
              {...register('documentos.outroDescricao')}
              placeholder="Descreva o documento"
              className="h-9"
            />
          </div>
        )}
      </div>

      {/* Observações */}
      <div className="space-y-1.5 pt-1.5 border-t">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          {...register('observacoes')}
          placeholder="Informações adicionais que gostaria de compartilhar (opcional)"
          rows={2}
        />
      </div>

      {/* Confirmação */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-2.5">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="informacoesCorretas"
            checked={watch('informacoesCorretas')}
            onCheckedChange={(checked) => setValue('informacoesCorretas', !!checked)}
            className="mt-0.5"
          />
          <Label htmlFor="informacoesCorretas" className="font-normal cursor-pointer text-xs leading-tight">
            Declaro que todas as informações fornecidas são verdadeiras e estou ciente de que
            informações falsas podem resultar no cancelamento da matrícula.
          </Label>
        </div>
      </div>
    </div>
  );
}
