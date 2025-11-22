'use client';

interface NeighborhoodChartProps {
  bairroData: [string, number][];
  totalAlunos: number;
}

/**
 * Visualização de linhas horizontais mostrando distribuição de alunos por bairro
 * Métrica QUANTITATIVA - mostra volume por localização
 */
export function NeighborhoodChart({ bairroData, totalAlunos }: NeighborhoodChartProps) {
  if (bairroData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-1">Sem dados de localização</p>
          <p className="text-gray-400 text-xs">Não há informações de bairro disponíveis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bairroData.map(([bairro, count]) => {
        const percentage = ((count / totalAlunos) * 100).toFixed(1);
        return (
          <div key={bairro} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{bairro}</span>
              <span className="text-muted-foreground">
                {count} aluno{count !== 1 ? 's' : ''} ({percentage}%)
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
