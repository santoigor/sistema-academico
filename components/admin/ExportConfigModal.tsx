'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Curso } from '@/lib/types';
import { FileDown, X } from 'lucide-react';

// Schema de validação para o formulário de exportação
const exportConfigSchema = z.object({
  cursoId: z.string().optional(),
  dataInicial: z.string().optional(),
  dataFinal: z.string().optional(),
  // Métricas de Projetos
  totalAlunos: z.boolean().default(true),
  taxaConclusao: z.boolean().default(true),
  taxaEvasao: z.boolean().default(true),
  horasMinstradas: z.boolean().default(true),
  distribuicaoTurmas: z.boolean().default(true),
  distribuicaoAlunos: z.boolean().default(true),
  equipe: z.boolean().default(true),
  cursosOferecidos: z.boolean().default(true),
  retencaoEvasao: z.boolean().default(true),
  // Métricas de Alunos
  alunosPorBairro: z.boolean().default(false),
  alunosPorGenero: z.boolean().default(false),
  alunosPorEtnia: z.boolean().default(false),
  statusAlunos: z.boolean().default(false),
  // Desempenho de Instrutores
  instrutoresAtivos: z.boolean().default(false),
  turmasEmAndamento: z.boolean().default(false),
});

export type ExportConfigFormData = z.infer<typeof exportConfigSchema>;

interface ExportConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cursos: Curso[];
}

export function ExportConfigModal({ open, onOpenChange, cursos }: ExportConfigModalProps) {
  const [cursoId, setCursoId] = useState<string>('');
  const [dataInicial, setDataInicial] = useState<string>('');
  const [dataFinal, setDataFinal] = useState<string>('');

  const form = useForm<ExportConfigFormData>({
    resolver: zodResolver(exportConfigSchema),
    defaultValues: {
      totalAlunos: true,
      taxaConclusao: true,
      taxaEvasao: true,
      horasMinstradas: true,
      distribuicaoTurmas: true,
      distribuicaoAlunos: true,
      equipe: true,
      cursosOferecidos: true,
      retencaoEvasao: true,
      alunosPorBairro: false,
      alunosPorGenero: false,
      alunosPorEtnia: false,
      statusAlunos: false,
      instrutoresAtivos: false,
      turmasEmAndamento: false,
    },
  });

  const onSubmit = (data: ExportConfigFormData) => {
    // Combinar filtros e opções selecionadas
    const exportConfig = {
      filtros: {
        cursoId: cursoId || null,
        dataInicial,
        dataFinal,
      },
      opcoes: {
        metricasProjetos: {
          totalAlunos: data.totalAlunos,
          taxaConclusao: data.taxaConclusao,
          taxaEvasao: data.taxaEvasao,
          horasMinstradas: data.horasMinstradas,
          distribuicaoTurmas: data.distribuicaoTurmas,
          distribuicaoAlunos: data.distribuicaoAlunos,
          equipe: data.equipe,
          cursosOferecidos: data.cursosOferecidos,
          retencaoEvasao: data.retencaoEvasao,
        },
        metricasAlunos: {
          alunosPorBairro: data.alunosPorBairro,
          alunosPorGenero: data.alunosPorGenero,
          alunosPorEtnia: data.alunosPorEtnia,
          statusAlunos: data.statusAlunos,
        },
        desempenhoInstrutores: {
          instrutoresAtivos: data.instrutoresAtivos,
          turmasEmAndamento: data.turmasEmAndamento,
        },
      },
    };

    console.log('Configuração de Exportação:', exportConfig);
    console.log('---');
    console.log('Curso selecionado:', cursos.find(c => c.id === cursoId)?.nome || 'Todos os cursos');
    console.log('Período:', dataInicial && dataFinal ? `${dataInicial} até ${dataFinal}` : 'Todos os períodos');
    console.log('---');
    console.log('Opções selecionadas:');
    console.log('Métricas de Projetos:', Object.entries(exportConfig.opcoes.metricasProjetos).filter(([, v]) => v).map(([k]) => k));
    console.log('Métricas de Alunos:', Object.entries(exportConfig.opcoes.metricasAlunos).filter(([, v]) => v).map(([k]) => k));
    console.log('Desempenho de Instrutores:', Object.entries(exportConfig.opcoes.desempenhoInstrutores).filter(([, v]) => v).map(([k]) => k));

    // Fechar modal após submissão
    onOpenChange(false);
  };

  const handleClearFilters = () => {
    setCursoId('');
    setDataInicial('');
    setDataFinal('');
  };

  const handleSelectAll = () => {
    const allTrue = {
      totalAlunos: true,
      taxaConclusao: true,
      taxaEvasao: true,
      horasMinstradas: true,
      distribuicaoTurmas: true,
      distribuicaoAlunos: true,
      equipe: true,
      cursosOferecidos: true,
      retencaoEvasao: true,
      alunosPorBairro: true,
      alunosPorGenero: true,
      alunosPorEtnia: true,
      statusAlunos: true,
      instrutoresAtivos: true,
      turmasEmAndamento: true,
    };
    form.reset(allTrue);
  };

  const handleDeselectAll = () => {
    const allFalse = {
      totalAlunos: false,
      taxaConclusao: false,
      taxaEvasao: false,
      horasMinstradas: false,
      distribuicaoTurmas: false,
      distribuicaoAlunos: false,
      equipe: false,
      cursosOferecidos: false,
      retencaoEvasao: false,
      alunosPorBairro: false,
      alunosPorGenero: false,
      alunosPorEtnia: false,
      statusAlunos: false,
      instrutoresAtivos: false,
      turmasEmAndamento: false,
    };
    form.reset(allFalse);
  };

  const cursosAtivos = cursos.filter(c => c.ativo);
  const hasActiveFilters = cursoId || dataInicial || dataFinal;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="w-5 h-5 text-blue-600" />
            Configurar Exportação de Relatório para Investidor
          </DialogTitle>
          <DialogDescription>
            Selecione os filtros e as métricas que deseja incluir no relatório PDF
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Filtros */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-sm text-gray-900">Filtros</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro de Curso */}
              <div className="space-y-2">
                <Label htmlFor="curso-export">Curso</Label>
                <Select value={cursoId || undefined} onValueChange={setCursoId}>
                  <SelectTrigger id="curso-export">
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

              {/* Data Inicial */}
              <div className="space-y-2">
                <Label htmlFor="data-inicial-export">Data Inicial</Label>
                <Input
                  id="data-inicial-export"
                  type="date"
                  value={dataInicial}
                  onChange={(e) => setDataInicial(e.target.value)}
                />
              </div>

              {/* Data Final */}
              <div className="space-y-2">
                <Label htmlFor="data-final-export">Data Final</Label>
                <Input
                  id="data-final-export"
                  type="date"
                  value={dataFinal}
                  onChange={(e) => setDataFinal(e.target.value)}
                  min={dataInicial}
                />
              </div>
            </div>

            {hasActiveFilters && (
              <Button
                type="button"
                onClick={handleClearFilters}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Limpar Filtros
              </Button>
            )}
          </div>

          {/* Opções de Relatório */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-gray-900">Opções de Relatório</h3>
              <div className="flex gap-2">
                <Button type="button" onClick={handleSelectAll} variant="outline" size="sm">
                  Selecionar Todos
                </Button>
                <Button type="button" onClick={handleDeselectAll} variant="outline" size="sm">
                  Desmarcar Todos
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Grupo 1: Métricas de Projetos */}
              <div className="space-y-3 p-4 border rounded-lg bg-white">
                <h4 className="font-medium text-sm text-blue-600">Métricas de Projetos</h4>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="totalAlunos"
                      checked={form.watch('totalAlunos')}
                      onCheckedChange={(checked) => form.setValue('totalAlunos', checked as boolean)}
                    />
                    <label htmlFor="totalAlunos" className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Total de Alunos
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="taxaConclusao"
                      checked={form.watch('taxaConclusao')}
                      onCheckedChange={(checked) => form.setValue('taxaConclusao', checked as boolean)}
                    />
                    <label htmlFor="taxaConclusao" className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Taxa de Conclusão
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="taxaEvasao"
                      checked={form.watch('taxaEvasao')}
                      onCheckedChange={(checked) => form.setValue('taxaEvasao', checked as boolean)}
                    />
                    <label htmlFor="taxaEvasao" className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Taxa de Evasão
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="horasMinstradas"
                      checked={form.watch('horasMinstradas')}
                      onCheckedChange={(checked) => form.setValue('horasMinstradas', checked as boolean)}
                    />
                    <label htmlFor="horasMinstradas" className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Horas Ministradas
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="distribuicaoTurmas"
                      checked={form.watch('distribuicaoTurmas')}
                      onCheckedChange={(checked) => form.setValue('distribuicaoTurmas', checked as boolean)}
                    />
                    <label htmlFor="distribuicaoTurmas" className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Distribuição de Turmas
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="distribuicaoAlunos"
                      checked={form.watch('distribuicaoAlunos')}
                      onCheckedChange={(checked) => form.setValue('distribuicaoAlunos', checked as boolean)}
                    />
                    <label htmlFor="distribuicaoAlunos" className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Distribuição de Alunos
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="equipe"
                      checked={form.watch('equipe')}
                      onCheckedChange={(checked) => form.setValue('equipe', checked as boolean)}
                    />
                    <label htmlFor="equipe" className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Equipe
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cursosOferecidos"
                      checked={form.watch('cursosOferecidos')}
                      onCheckedChange={(checked) => form.setValue('cursosOferecidos', checked as boolean)}
                    />
                    <label htmlFor="cursosOferecidos" className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Cursos Oferecidos
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="retencaoEvasao"
                      checked={form.watch('retencaoEvasao')}
                      onCheckedChange={(checked) => form.setValue('retencaoEvasao', checked as boolean)}
                    />
                    <label htmlFor="retencaoEvasao" className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Retenção vs Evasão
                    </label>
                  </div>
                </div>
              </div>

              {/* Grupo 2: Métricas de Alunos */}
              <div className="space-y-3 p-4 border rounded-lg bg-white">
                <h4 className="font-medium text-sm text-orange-600">Métricas de Alunos</h4>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="alunosPorBairro"
                      checked={form.watch('alunosPorBairro')}
                      onCheckedChange={(checked) => form.setValue('alunosPorBairro', checked as boolean)}
                    />
                    <label htmlFor="alunosPorBairro" className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Alunos por Bairro
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="alunosPorGenero"
                      checked={form.watch('alunosPorGenero')}
                      onCheckedChange={(checked) => form.setValue('alunosPorGenero', checked as boolean)}
                    />
                    <label htmlFor="alunosPorGenero" className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Alunos por Gênero
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="alunosPorEtnia"
                      checked={form.watch('alunosPorEtnia')}
                      onCheckedChange={(checked) => form.setValue('alunosPorEtnia', checked as boolean)}
                    />
                    <label htmlFor="alunosPorEtnia" className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Alunos por Etnia
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="statusAlunos"
                      checked={form.watch('statusAlunos')}
                      onCheckedChange={(checked) => form.setValue('statusAlunos', checked as boolean)}
                    />
                    <label htmlFor="statusAlunos" className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Status dos Alunos
                    </label>
                  </div>
                </div>
              </div>

              {/* Grupo 3: Desempenho de Instrutores */}
              <div className="space-y-3 p-4 border rounded-lg bg-white">
                <h4 className="font-medium text-sm text-purple-600">Desempenho de Instrutores</h4>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="instrutoresAtivos"
                      checked={form.watch('instrutoresAtivos')}
                      onCheckedChange={(checked) => form.setValue('instrutoresAtivos', checked as boolean)}
                    />
                    <label htmlFor="instrutoresAtivos" className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Instrutores Ativos
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="turmasEmAndamento"
                      checked={form.watch('turmasEmAndamento')}
                      onCheckedChange={(checked) => form.setValue('turmasEmAndamento', checked as boolean)}
                    />
                    <label htmlFor="turmasEmAndamento" className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Turmas em Andamento
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="gap-2">
              <FileDown className="w-4 h-4" />
              Gerar Relatório
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
