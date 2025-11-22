'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { InstrutorFormData } from '@/lib/schemas';

interface Step1DadosPessoaisInstrutorProps {
  register: UseFormRegister<InstrutorFormData>;
  errors: FieldErrors<InstrutorFormData>;
}

export function Step1DadosPessoaisInstrutor({ register, errors }: Step1DadosPessoaisInstrutorProps) {
  return (
    <div className="space-y-2">
      <div className="text-center mb-1">
        <h3 className="font-semibold text-base">Dados Pessoais</h3>
        <p className="text-xs text-muted-foreground">Informações básicas do instrutor</p>
      </div>

      <div className="space-y-2.5">
        <div className="space-y-2">
          <Label htmlFor="nome">
            Nome Completo <span className="text-destructive">*</span>
          </Label>
          <Input
            id="nome"
            {...register('nome')}
            className={errors.nome ? 'border-destructive' : ''}
            placeholder="Digite o nome completo"
          />
          {errors.nome && (
            <p className="text-sm text-destructive">{errors.nome.message}</p>
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
            placeholder="email@exemplo.com"
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
            className={errors.telefone ? 'border-destructive' : ''}
            placeholder="(00) 00000-0000"
          />
          {errors.telefone && (
            <p className="text-sm text-destructive">{errors.telefone.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
