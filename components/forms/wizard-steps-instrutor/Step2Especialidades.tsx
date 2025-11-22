'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface Step2EspecialidadesProps {
  especialidades: string[];
  onAddEspecialidade: (esp: string) => void;
  onRemoveEspecialidade: (esp: string) => void;
  error?: string;
}

export function Step2Especialidades({
  especialidades,
  onAddEspecialidade,
  onRemoveEspecialidade,
  error
}: Step2EspecialidadesProps) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim() && !especialidades.includes(input.trim())) {
      onAddEspecialidade(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-center mb-1">
        <h3 className="font-semibold text-base">Especialidades</h3>
        <p className="text-xs text-muted-foreground">Áreas de conhecimento e atuação</p>
      </div>

      <div className="space-y-2.5">
        <div className="space-y-2">
          <Label htmlFor="especialidade">
            Adicionar Especialidade <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-2">
            <Input
              id="especialidade"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ex: Desenvolvimento Web, Design UX/UI"
              className={error ? 'border-destructive flex-1' : 'flex-1'}
            />
            <Button
              type="button"
              onClick={handleAdd}
              variant="outlinePrimary"
              size="sm"
              disabled={!input.trim()}
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Pressione Enter ou clique em Adicionar para incluir uma especialidade
          </p>
        </div>

        {especialidades.length > 0 && (
          <div className="space-y-2 pt-1.5 border-t">
            <Label className="text-sm">Especialidades Adicionadas ({especialidades.length})</Label>
            <div className="flex flex-wrap gap-2">
              {especialidades.map((esp) => (
                <Badge key={esp} variant="default" className="flex items-center gap-1 px-2.5 py-1">
                  {esp}
                  <button
                    type="button"
                    onClick={() => onRemoveEspecialidade(esp)}
                    className="ml-1 hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {especialidades.length === 0 && (
          <div className="border border-dashed rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhuma especialidade adicionada ainda
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
