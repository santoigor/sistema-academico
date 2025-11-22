'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BaseChart, CHART_COLORS, CHART_CONFIG } from './BaseChart';

interface SatisfactionChartProps {
  satisfacaoDistribuicao: Array<{
    nivel: number;
    count: number;
    percentage: string;
  }>;
}

/**
 * Gráfico de barras mostrando distribuição de satisfação
 * Métrica QUALITATIVA - mostra distribuição de avaliações
 */
export function SatisfactionChart({ satisfacaoDistribuicao }: SatisfactionChartProps) {
  // Inverter ordem para mostrar 5 estrelas primeiro
  const dados = [...satisfacaoDistribuicao]
    .reverse()
    .map(item => ({
      nivel: `${item.nivel} ⭐`,
      respostas: item.count,
      percentual: item.percentage,
    }));

  const totalRespostas = satisfacaoDistribuicao.reduce((sum, item) => sum + item.count, 0);

  if (totalRespostas === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-1">Sem avaliações de satisfação</p>
          <p className="text-gray-400 text-xs">Não há respostas de satisfação disponíveis</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{data.nivel}</p>
          <p className="text-sm text-gray-600">
            Respostas: <span className="font-semibold">{data.respostas}</span>
          </p>
          <p className="text-sm text-gray-600">
            Percentual: <span className="font-semibold">{data.percentual}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <BaseChart height={300}>
      <BarChart data={dados} layout="vertical" margin={{ ...CHART_CONFIG.margin, left: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_CONFIG.gridStroke} />
        <XAxis
          type="number"
          stroke={CHART_CONFIG.axisStroke}
          style={{ fontSize: '12px' }}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="nivel"
          stroke={CHART_CONFIG.axisStroke}
          style={{ fontSize: '12px' }}
          width={70}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
          iconType="circle"
        />
        <Bar
          dataKey="respostas"
          fill="#EAB308"
          name="Número de Respostas"
          radius={[0, 8, 8, 0]}
        />
      </BarChart>
    </BaseChart>
  );
}
