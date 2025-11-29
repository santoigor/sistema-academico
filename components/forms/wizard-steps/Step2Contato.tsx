'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import type { CadastroAlunoInteressadoFormData } from '@/lib/schemas';

interface Step2ContatoProps {
  register: UseFormRegister<CadastroAlunoInteressadoFormData>;
  errors: FieldErrors<CadastroAlunoInteressadoFormData>;
}

export function Step2Contato({ register, errors }: Step2ContatoProps) {
  return (
    <div className="space-y-2">
      <div className="text-center mb-1">
        <h3 className="font-semibold text-base">Onde você mora?</h3>
        <p className="text-xs text-muted-foreground">Precisamos do seu endereço completo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <div className="space-y-2">
          <Label htmlFor="endereco.cep">
            CEP <span className="text-destructive">*</span>
          </Label>
          <Input
            id="endereco.cep"
            {...register('endereco.cep')}
            placeholder="00000000"
            maxLength={8}
            className={errors.endereco?.cep ? 'border-destructive' : ''}
          />
          {errors.endereco?.cep && (
            <p className="text-sm text-destructive">{errors.endereco.cep.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endereco.rua">
            Rua <span className="text-destructive">*</span>
          </Label>
          <Input
            id="endereco.rua"
            {...register('endereco.rua')}
            className={errors.endereco?.rua ? 'border-destructive' : ''}
            placeholder="Nome da rua"
          />
          {errors.endereco?.rua && (
            <p className="text-sm text-destructive">{errors.endereco.rua.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endereco.numero">
            Número <span className="text-destructive">*</span>
          </Label>
          <Input
            id="endereco.numero"
            {...register('endereco.numero')}
            className={errors.endereco?.numero ? 'border-destructive' : ''}
            placeholder="123"
          />
          {errors.endereco?.numero && (
            <p className="text-sm text-destructive">{errors.endereco.numero.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endereco.complemento">Complemento</Label>
          <Input
            id="endereco.complemento"
            {...register('endereco.complemento')}
            placeholder="Apto, Bloco, etc. (opcional)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endereco.bairro">
            Bairro <span className="text-destructive">*</span>
          </Label>
          <Input
            id="endereco.bairro"
            {...register('endereco.bairro')}
            className={errors.endereco?.bairro ? 'border-destructive' : ''}
            placeholder="Nome do bairro"
          />
          {errors.endereco?.bairro && (
            <p className="text-sm text-destructive">{errors.endereco.bairro.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endereco.cidade">
            Cidade <span className="text-destructive">*</span>
          </Label>
          <Input
            id="endereco.cidade"
            {...register('endereco.cidade')}
            className={errors.endereco?.cidade ? 'border-destructive' : ''}
            placeholder="Nome da cidade"
          />
          {errors.endereco?.cidade && (
            <p className="text-sm text-destructive">{errors.endereco.cidade.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endereco.estado">
            Estado <span className="text-destructive">*</span>
          </Label>
          <Input
            id="endereco.estado"
            {...register('endereco.estado')}
            placeholder="SP"
            maxLength={2}
            className={errors.endereco?.estado ? 'border-destructive' : ''}
          />
          {errors.endereco?.estado && (
            <p className="text-sm text-destructive">{errors.endereco.estado.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
