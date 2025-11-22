'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, AlertCircle } from 'lucide-react';
import type { InteressadoFormData } from '@/lib/schemas';

interface Step3ContextoSocialProps {
  register: UseFormRegister<InteressadoFormData>;
  errors: FieldErrors<InteressadoFormData>;
}

export function Step3ContextoSocial({ register, errors }: Step3ContextoSocialProps) {
  return (
    <div className="space-y-2">
      <div className="text-center mb-1">
        <h3 className="font-semibold text-base">Contexto Social</h3>
        <p className="text-xs text-muted-foreground">Informações de responsável e contato de emergência</p>
      </div>

      {/* Responsável */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-sm">Responsável</h4>
          <span className="text-xs text-muted-foreground">(se menor de idade)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <div className="space-y-2">
            <Label htmlFor="responsavelNome">Nome do Responsável</Label>
            <Input
              id="responsavelNome"
              {...register('responsavelNome')}
              placeholder="Nome completo"
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
              placeholder="email@exemplo.com"
            />
          </div>
        </div>
      </div>

      {/* Contato de Emergência */}
      <div className="space-y-2 pt-1.5 border-t">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <h4 className="font-semibold text-sm">Contato de Emergência</h4>
          <span className="text-xs text-destructive">(obrigatório)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          <div className="space-y-2">
            <Label htmlFor="contatoEmergenciaNome">
              Nome <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contatoEmergenciaNome"
              {...register('contatoEmergenciaNome')}
              className={errors.contatoEmergenciaNome ? 'border-destructive' : ''}
              placeholder="Nome completo"
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
    </div>
  );
}
