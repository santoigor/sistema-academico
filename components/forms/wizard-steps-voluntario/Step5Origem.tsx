import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CadastroVoluntarioFormData } from '@/lib/schemas';

interface Step5OrigemProps {
  form: UseFormReturn<CadastroVoluntarioFormData>;
}

export function Step5Origem({ form }: Step5OrigemProps) {
  const { formState: { errors }, setValue, watch } = form;

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="origem">Como você encontrou este formulário? *</Label>
        <Select
          value={watch('origem')}
          onValueChange={(value) => setValue('origem', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma opção" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="redes_sociais">Redes Sociais</SelectItem>
            <SelectItem value="indicacao">Indicação de amigo/conhecido</SelectItem>
            <SelectItem value="site">Site da instituição</SelectItem>
            <SelectItem value="evento">Evento ou palestra</SelectItem>
            <SelectItem value="escola">Escola ou universidade</SelectItem>
            <SelectItem value="busca_google">Busca no Google</SelectItem>
            <SelectItem value="outro">Outro</SelectItem>
          </SelectContent>
        </Select>
        {errors.origem && (
          <p className="text-xs text-red-600 mt-1">{errors.origem.message}</p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <p className="text-sm text-gray-700">
          <strong>Próximo passo:</strong> Revise todas as informações preenchidas e clique em &quot;Finalizar Cadastro&quot; para concluir sua inscrição como voluntário.
        </p>
      </div>
    </div>
  );
}
