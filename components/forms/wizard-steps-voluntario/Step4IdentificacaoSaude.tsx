import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { CadastroVoluntarioFormData } from '@/lib/schemas';

interface Step4IdentificacaoSaudeProps {
  form: UseFormReturn<CadastroVoluntarioFormData>;
}

export function Step4IdentificacaoSaude({ form }: Step4IdentificacaoSaudeProps) {
  const { register, formState: { errors }, setValue, watch } = form;
  const deficienciaFisica = watch('deficienciaFisica');
  const deficienciaIntelectual = watch('deficienciaIntelectual');
  const necessidadeEspecial = watch('necessidadeEspecial');
  const temDeficiencia = deficienciaFisica || deficienciaIntelectual || necessidadeEspecial;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Identificação Étnico-Racial</h3>

        <div>
          <Label htmlFor="corRaca">Cor/Raça *</Label>
          <Select
            value={watch('corRaca')}
            onValueChange={(value) => setValue('corRaca', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="branca">Branca</SelectItem>
              <SelectItem value="preta">Preta</SelectItem>
              <SelectItem value="parda">Parda</SelectItem>
              <SelectItem value="amarela">Amarela</SelectItem>
              <SelectItem value="indigena">Indígena</SelectItem>
              <SelectItem value="prefiro_nao_declarar">Prefiro não declarar</SelectItem>
            </SelectContent>
          </Select>
          {errors.corRaca && (
            <p className="text-xs text-red-600 mt-1">{errors.corRaca.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="etnia">Etnia (opcional)</Label>
          <Input
            id="etnia"
            {...register('etnia')}
            placeholder="Ex: Guarani, Iorubá, etc."
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Informações de Saúde</h3>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="deficienciaFisica"
              checked={deficienciaFisica}
              onCheckedChange={(checked) => setValue('deficienciaFisica', checked === true)}
            />
            <Label
              htmlFor="deficienciaFisica"
              className="text-sm font-normal cursor-pointer"
            >
              Deficiência Física
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="deficienciaIntelectual"
              checked={deficienciaIntelectual}
              onCheckedChange={(checked) => setValue('deficienciaIntelectual', checked === true)}
            />
            <Label
              htmlFor="deficienciaIntelectual"
              className="text-sm font-normal cursor-pointer"
            >
              Deficiência Intelectual
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="necessidadeEspecial"
              checked={necessidadeEspecial}
              onCheckedChange={(checked) => setValue('necessidadeEspecial', checked === true)}
            />
            <Label
              htmlFor="necessidadeEspecial"
              className="text-sm font-normal cursor-pointer"
            >
              Necessidade Especial
            </Label>
          </div>
        </div>

        {temDeficiencia && (
          <div>
            <Label htmlFor="especificacaoDeficiencia">Especificação da Deficiência/Necessidade</Label>
            <Textarea
              id="especificacaoDeficiencia"
              {...register('especificacaoDeficiencia')}
              placeholder="Descreva sua deficiência ou necessidade especial..."
              rows={3}
              className="resize-none"
            />
            {errors.especificacaoDeficiencia && (
              <p className="text-xs text-red-600 mt-1">{errors.especificacaoDeficiencia.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
