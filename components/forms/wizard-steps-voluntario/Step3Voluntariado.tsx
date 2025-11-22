import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { CadastroVoluntarioFormData } from '@/lib/schemas';

interface Step3VoluntariadoProps {
  form: UseFormReturn<CadastroVoluntarioFormData>;
}

export function Step3Voluntariado({ form }: Step3VoluntariadoProps) {
  const { register, formState: { errors }, setValue, watch } = form;
  const experienciaVoluntariado = watch('experienciaVoluntariado');

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="areaInteresse">Área de Interesse *</Label>
        <Select
          value={watch('areaInteresse')}
          onValueChange={(value) => setValue('areaInteresse', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="educacao">Educação</SelectItem>
            <SelectItem value="saude">Saúde</SelectItem>
            <SelectItem value="tecnologia">Tecnologia</SelectItem>
            <SelectItem value="artes">Artes e Cultura</SelectItem>
            <SelectItem value="esportes">Esportes</SelectItem>
            <SelectItem value="administrativo">Administrativo</SelectItem>
            <SelectItem value="comunicacao">Comunicação</SelectItem>
            <SelectItem value="outra">Outra</SelectItem>
          </SelectContent>
        </Select>
        {errors.areaInteresse && (
          <p className="text-xs text-red-600 mt-1">{errors.areaInteresse.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="motivoVoluntariado">Por que você quer ser voluntário? *</Label>
        <Textarea
          id="motivoVoluntariado"
          {...register('motivoVoluntariado')}
          placeholder="Descreva sua motivação para ser voluntário..."
          rows={3}
          className="resize-none"
        />
        {errors.motivoVoluntariado && (
          <p className="text-xs text-red-600 mt-1">{errors.motivoVoluntariado.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="habilidadesExperiencia">Habilidades e Experiências *</Label>
        <Textarea
          id="habilidadesExperiencia"
          {...register('habilidadesExperiencia')}
          placeholder="Descreva suas habilidades e experiências relevantes..."
          rows={3}
          className="resize-none"
        />
        {errors.habilidadesExperiencia && (
          <p className="text-xs text-red-600 mt-1">{errors.habilidadesExperiencia.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="nivelDisponibilidade">Nível de Disponibilidade *</Label>
        <Select
          value={watch('nivelDisponibilidade')}
          onValueChange={(value) => setValue('nivelDisponibilidade', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione sua disponibilidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="algumas_horas_semana">Algumas horas por semana</SelectItem>
            <SelectItem value="meio_periodo">Meio período</SelectItem>
            <SelectItem value="periodo_integral">Período integral</SelectItem>
            <SelectItem value="fins_semana">Apenas fins de semana</SelectItem>
            <SelectItem value="eventual">Eventual/Pontual</SelectItem>
          </SelectContent>
        </Select>
        {errors.nivelDisponibilidade && (
          <p className="text-xs text-red-600 mt-1">{errors.nivelDisponibilidade.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="experienciaVoluntariado"
            checked={experienciaVoluntariado}
            onCheckedChange={(checked) => setValue('experienciaVoluntariado', checked === true)}
          />
          <Label
            htmlFor="experienciaVoluntariado"
            className="text-sm font-normal cursor-pointer"
          >
            Já teve experiência com trabalho voluntário?
          </Label>
        </div>

        {experienciaVoluntariado && (
          <div>
            <Label htmlFor="detalhesExperienciaVoluntariado">Detalhes da Experiência</Label>
            <Textarea
              id="detalhesExperienciaVoluntariado"
              {...register('detalhesExperienciaVoluntariado')}
              placeholder="Descreva suas experiências anteriores como voluntário..."
              rows={3}
              className="resize-none"
            />
            {errors.detalhesExperienciaVoluntariado && (
              <p className="text-xs text-red-600 mt-1">{errors.detalhesExperienciaVoluntariado.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
