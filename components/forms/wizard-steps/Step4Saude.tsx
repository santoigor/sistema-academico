'use client';

import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart } from 'lucide-react';
import type { InteressadoFormData } from '@/lib/schemas';

interface Step4SaudeProps {
  register: UseFormRegister<InteressadoFormData>;
  errors: FieldErrors<InteressadoFormData>;
  setValue: UseFormSetValue<InteressadoFormData>;
  watch: UseFormWatch<InteressadoFormData>;
}

export function Step4Saude({ register, errors, setValue, watch }: Step4SaudeProps) {
  return (
    <div className="space-y-2">
      <div className="text-center mb-1">
        <h3 className="font-semibold text-base">Informações de Saúde</h3>
        <p className="text-xs text-muted-foreground">Ajude-nos a cuidar melhor de você</p>
      </div>

      {/* Informações de Saúde */}
      <div className="space-y-2">
        <div className="space-y-2">
          <Label htmlFor="alergias">Alergias</Label>
          <Textarea
            id="alergias"
            {...register('alergias')}
            placeholder="Descreva se possui alguma alergia (opcional)"
            rows={2}
          />
          <p className="text-xs text-muted-foreground">
            Ex: Alergia a medicamentos, alimentos, pólen, etc.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="deficiencias">Deficiências ou Necessidades Especiais</Label>
          <Textarea
            id="deficiencias"
            {...register('deficiencias')}
            placeholder="Descreva se possui alguma deficiência ou necessidade especial (opcional)"
            rows={2}
          />
          <p className="text-xs text-muted-foreground">
            Ex: Deficiência visual, auditiva, mobilidade reduzida, autismo, etc.
          </p>
        </div>
      </div>

      {/* Identificação Étnico-Racial */}
      <div className="space-y-2 pt-1.5 border-t">
        <h4 className="font-semibold text-sm">Identificação Étnico-Racial</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <div className="space-y-2">
            <Label htmlFor="corRaca">
              Cor ou Raça <span className="text-destructive">*</span>
            </Label>
            <Select onValueChange={(value) => setValue('corRaca', value)}>
              <SelectTrigger className={errors.corRaca ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="branca">Branca</SelectItem>
                <SelectItem value="preta">Preta</SelectItem>
                <SelectItem value="parda">Parda</SelectItem>
                <SelectItem value="amarela">Amarela</SelectItem>
                <SelectItem value="indigena">Indígena</SelectItem>
              </SelectContent>
            </Select>
            {errors.corRaca && (
              <p className="text-sm text-destructive">{errors.corRaca.message}</p>
            )}
          </div>
          {watch('corRaca') === 'indigena' && (
            <div className="space-y-2">
              <Label htmlFor="etnia">Etnia</Label>
              <Input
                id="etnia"
                {...register('etnia')}
                placeholder="Especifique a etnia"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
