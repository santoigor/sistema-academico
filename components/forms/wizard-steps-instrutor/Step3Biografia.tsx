'use client';

import { UseFormRegister } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { InstrutorFormData } from '@/lib/schemas';

interface Step3BiografiaProps {
  register: UseFormRegister<InstrutorFormData>;
}

export function Step3Biografia({ register }: Step3BiografiaProps) {
  return (
    <div className="space-y-2">
      <div className="text-center mb-1">
        <h3 className="font-semibold text-base">Biografia Profissional</h3>
        <p className="text-xs text-muted-foreground">Experiência e qualificações (opcional)</p>
      </div>

      <div className="space-y-2.5">
        <div className="space-y-2">
          <Label htmlFor="biografia">Biografia</Label>
          <Textarea
            id="biografia"
            {...register('biografia')}
            placeholder="Descreva a experiência profissional, formação acadêmica, certificações e principais realizações do instrutor..."
            rows={8}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Esta informação ajuda a apresentar o instrutor para os alunos e coordenadores.
          </p>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-2.5">
          <h4 className="font-semibold text-sm mb-1.5">Sugestões do que incluir:</h4>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>Formação acadêmica e certificações relevantes</li>
            <li>Experiência profissional na área de atuação</li>
            <li>Projetos ou iniciativas de destaque</li>
            <li>Metodologias e abordagens de ensino</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
