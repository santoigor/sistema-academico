import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CadastroVoluntarioFormData } from '@/lib/schemas';

interface Step2EnderecoProps {
  form: UseFormReturn<CadastroVoluntarioFormData>;
}

export function Step2Endereco({ form }: Step2EnderecoProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label htmlFor="cep">CEP *</Label>
          <Input
            id="cep"
            {...register('endereco.cep')}
            placeholder="00000-000"
          />
          {errors.endereco?.cep && (
            <p className="text-xs text-red-600 mt-1">{errors.endereco.cep.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <Label htmlFor="rua">Rua *</Label>
          <Input
            id="rua"
            {...register('endereco.rua')}
            placeholder="Nome da rua"
          />
          {errors.endereco?.rua && (
            <p className="text-xs text-red-600 mt-1">{errors.endereco.rua.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label htmlFor="numero">Número *</Label>
          <Input
            id="numero"
            {...register('endereco.numero')}
            placeholder="123"
          />
          {errors.endereco?.numero && (
            <p className="text-xs text-red-600 mt-1">{errors.endereco.numero.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <Label htmlFor="complemento">Complemento</Label>
          <Input
            id="complemento"
            {...register('endereco.complemento')}
            placeholder="Apto, bloco, etc."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="bairro">Bairro *</Label>
          <Input
            id="bairro"
            {...register('endereco.bairro')}
            placeholder="Nome do bairro"
          />
          {errors.endereco?.bairro && (
            <p className="text-xs text-red-600 mt-1">{errors.endereco.bairro.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="cidade">Cidade *</Label>
          <Input
            id="cidade"
            {...register('endereco.cidade')}
            placeholder="Nome da cidade"
          />
          {errors.endereco?.cidade && (
            <p className="text-xs text-red-600 mt-1">{errors.endereco.cidade.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="estado">Estado *</Label>
        <Input
          id="estado"
          {...register('endereco.estado')}
          placeholder="UF"
          maxLength={2}
        />
        {errors.endereco?.estado && (
          <p className="text-xs text-red-600 mt-1">{errors.endereco.estado.message}</p>
        )}
      </div>
    </div>
  );
}
