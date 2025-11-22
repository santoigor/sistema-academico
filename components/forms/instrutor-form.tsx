'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { instrutorSchema, type InstrutorFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Loader2, X } from 'lucide-react';
import { useState } from 'react';

interface InstrutorFormProps {
  defaultValues?: Partial<InstrutorFormData>;
  onSubmit: (data: InstrutorFormData) => void;
}

export function InstrutorForm({ defaultValues, onSubmit }: InstrutorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [especialidadeInput, setEspecialidadeInput] = useState('');
  const [especialidades, setEspecialidades] = useState<string[]>(
    defaultValues?.especialidades || []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InstrutorFormData>({
    resolver: zodResolver(instrutorSchema),
    defaultValues: defaultValues || {
      nome: '',
      email: '',
      cpf: '',
      telefone: '',
      especialidades: [],
    },
  });

  const handleFormSubmit = async (data: InstrutorFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        especialidades,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addEspecialidade = () => {
    if (especialidadeInput.trim() && !especialidades.includes(especialidadeInput.trim())) {
      setEspecialidades([...especialidades, especialidadeInput.trim()]);
      setEspecialidadeInput('');
    }
  };

  const removeEspecialidade = (esp: string) => {
    setEspecialidades(especialidades.filter(e => e !== esp));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEspecialidade();
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
          placeholder="Ex: Maria Santos"
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
          placeholder="Ex: maria@escola.com"
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

      {/* Especialidades */}
      <div className="space-y-2">
        <Label htmlFor="especialidade">
          Especialidades <span className="text-destructive">*</span>
        </Label>
        <div className="flex gap-2">
          <Input
            id="especialidade"
            placeholder="Ex: Desenvolvimento Web"
            value={especialidadeInput}
            onChange={(e) => setEspecialidadeInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button type="button" onClick={addEspecialidade} variant="outlinePrimary">
            Adicionar
          </Button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isSubmitting || especialidades.length === 0}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar Instrutor
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
