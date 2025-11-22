import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CadastroVoluntarioFormData } from '@/lib/schemas';

interface Step1DadosPessoaisProps {
  form: UseFormReturn<CadastroVoluntarioFormData>;
}

export function Step1DadosPessoais({ form }: Step1DadosPessoaisProps) {
  const { register, formState: { errors }, setValue, watch } = form;

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="nome">Nome Completo *</Label>
        <Input
          id="nome"
          {...register('nome')}
          placeholder="Digite seu nome completo"
        />
        {errors.nome && (
          <p className="text-xs text-red-600 mt-1">{errors.nome.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="seu@email.com"
          />
          {errors.email && (
            <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="telefone">Telefone *</Label>
          <Input
            id="telefone"
            {...register('telefone')}
            placeholder="(00) 00000-0000"
          />
          {errors.telefone && (
            <p className="text-xs text-red-600 mt-1">{errors.telefone.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
          <Input
            id="dataNascimento"
            type="date"
            {...register('dataNascimento')}
          />
          {errors.dataNascimento && (
            <p className="text-xs text-red-600 mt-1">{errors.dataNascimento.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="genero">Gênero *</Label>
          <Select
            value={watch('genero')}
            onValueChange={(value) => setValue('genero', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="masculino">Masculino</SelectItem>
              <SelectItem value="feminino">Feminino</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
              <SelectItem value="prefiro_nao_dizer">Prefiro não dizer</SelectItem>
            </SelectContent>
          </Select>
          {errors.genero && (
            <p className="text-xs text-red-600 mt-1">{errors.genero.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="escolaridade">Escolaridade *</Label>
        <Select
          value={watch('escolaridade')}
          onValueChange={(value) => setValue('escolaridade', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione sua escolaridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fundamental_incompleto">Fundamental Incompleto</SelectItem>
            <SelectItem value="fundamental_completo">Fundamental Completo</SelectItem>
            <SelectItem value="medio_incompleto">Médio Incompleto</SelectItem>
            <SelectItem value="medio_completo">Médio Completo</SelectItem>
            <SelectItem value="superior_incompleto">Superior Incompleto</SelectItem>
            <SelectItem value="superior_completo">Superior Completo</SelectItem>
            <SelectItem value="pos_graduacao">Pós-graduação</SelectItem>
          </SelectContent>
        </Select>
        {errors.escolaridade && (
          <p className="text-xs text-red-600 mt-1">{errors.escolaridade.message}</p>
        )}
      </div>
    </div>
  );
}
