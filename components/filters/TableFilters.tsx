'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Curso } from '@/lib/types';

export interface TableFiltersState {
  cursoId: string | null;
  dataInicial: string;
  dataFinal: string;
}

interface TableFiltersProps {
  cursos: Curso[];
  onFiltersChange: (filters: TableFiltersState) => void;
}

export function TableFilters({ cursos, onFiltersChange }: TableFiltersProps) {
  const [cursoId, setCursoId] = useState<string>('');
  const [dataInicial, setDataInicial] = useState<string>('');
  const [dataFinal, setDataFinal] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  // Detectar se é mobile e definir estado inicial
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setIsOpen(!isMobile); // Aberto no desktop, fechado no mobile
  }, []);

  const handleApplyFilters = () => {
    onFiltersChange({
      cursoId: cursoId || null,
      dataInicial,
      dataFinal,
    });
  };

  const handleClearFilters = () => {
    setCursoId('');
    setDataInicial('');
    setDataFinal('');
    onFiltersChange({
      cursoId: null,
      dataInicial: '',
      dataFinal: '',
    });
  };

  const hasActiveFilters = cursoId || dataInicial || dataFinal;

  // Filtrar apenas cursos ativos
  const cursosAtivos = cursos.filter(c => c.ativo);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Filtros</h3>
            {hasActiveFilters && (
              <span className="text-xs text-muted-foreground">
                ({[cursoId, dataInicial, dataFinal].filter(Boolean).length} ativo{[cursoId, dataInicial, dataFinal].filter(Boolean).length > 1 ? 's' : ''})
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="gap-2"
          >
            {isOpen ? (
              <>
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {isOpen && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Filtro de Curso */}
          <div className="space-y-2">
            <Label htmlFor="curso-filter">Curso</Label>
            <Select value={cursoId || undefined} onValueChange={setCursoId}>
              <SelectTrigger id="curso-filter">
                <SelectValue placeholder="Todos os cursos" />
              </SelectTrigger>
              <SelectContent>
                {cursosAtivos.map((curso) => (
                  <SelectItem key={curso.id} value={curso.id}>
                    {curso.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro de Data Inicial */}
          <div className="space-y-2">
            <Label htmlFor="data-inicial-filter">Data Inicial</Label>
            <Input
              id="data-inicial-filter"
              type="date"
              value={dataInicial}
              onChange={(e) => setDataInicial(e.target.value)}
            />
          </div>

          {/* Filtro de Data Final */}
          <div className="space-y-2">
            <Label htmlFor="data-final-filter">Data Final</Label>
            <Input
              id="data-final-filter"
              type="date"
              value={dataFinal}
              onChange={(e) => setDataFinal(e.target.value)}
              min={dataInicial}
            />
          </div>

          {/* Botões de Ação */}
          <div className="space-y-2">
            <Label className="invisible">Ações</Label>
            <div className="flex gap-2">
              <Button
                onClick={handleApplyFilters}
                className="flex-1"
                size="default"
              >
                Aplicar
              </Button>
              {hasActiveFilters && (
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  size="icon"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
