'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { coordenadorSchema, type CoordenadorFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface CoordenadorFormProps {
  defaultValues?: Partial<CoordenadorFormData>;
  onSubmit: (data: CoordenadorFormData) => void;
}

export function CoordenadorForm({ defaultValues, onSubmit }: CoordenadorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CoordenadorFormData>({
    resolver: zodResolver(coordenadorSchema),
    defaultValues: defaultValues || {
      nome: '',
      email: '',
      cpf: '',
      telefone: '',
    },
  });

  const handleFormSubmit = async (data: CoordenadorFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Nome */}
      <div className="space-y-2">
        <Label htmlFor="nome">
          Nome Completo <span className="text-destructive">*</span>
        </Label>
        <Input
          id="nome"
          placeholder="Ex: João da Silva"
          {...register('nome')}
          className={errors.nome ? 'border-destructive' : ''}
        />
        {errors.nome && (
          <p className="text-sm text-destructive">{errors.nome.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Ex: joao@escola.com"
          {...register('email')}
          className={errors.email ? 'border-destructive' : ''}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* CPF */}
      <div className="space-y-2">
        <Label htmlFor="cpf">
          CPF <span className="text-destructive">*</span>
        </Label>
        <Input
          id="cpf"
          placeholder="Ex: 123.456.789-00"
          {...register('cpf')}
          className={errors.cpf ? 'border-destructive' : ''}
        />
        {errors.cpf && (
          <p className="text-sm text-destructive">{errors.cpf.message}</p>
        )}
      </div>

      {/* Telefone */}
      <div className="space-y-2">
        <Label htmlFor="telefone">
          Telefone <span className="text-destructive">*</span>
        </Label>
        <Input
          id="telefone"
          placeholder="Ex: (11) 98765-4321"
          {...register('telefone')}
          className={errors.telefone ? 'border-destructive' : ''}
        />
        {errors.telefone && (
          <p className="text-sm text-destructive">{errors.telefone.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar Coordenador
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
