'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BaseChart, CHART_COLORS, CHART_CONFIG } from './BaseChart';

interface EthnicityChartProps {
  etniaData: Record<string, number>;
  total: number;
}

/**
 * Gráfico de barras verticais mostrando distribuição de alunos por etnia/cor-raça
 * Métrica QUALITATIVA - mostra categorização e distribuição
 */
export function EthnicityChart({ etniaData, total }: EthnicityChartProps) {
  const dados = Object.entries(etniaData)
    .sort(([, a], [, b]) => b - a)
    .map(([etnia, count]) => ({
      etnia: etnia.charAt(0).toUpperCase() + etnia.slice(1),
      alunos: count,
      percentual: ((count / total) * 100).toFixed(1),
    }));

  if (dados.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-1">Sem dados de etnia</p>
          <p className="text-gray-400 text-xs">Não há informações de etnia/cor-raça disponíveis</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{data.etnia}</p>
          <p className="text-sm text-gray-600">
            Alunos: <span className="font-semibold">{data.alunos}</span>
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
      <BarChart data={dados} margin={{ ...CHART_CONFIG.margin, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_CONFIG.gridStroke} />
        <XAxis
          dataKey="etnia"
          stroke={CHART_CONFIG.axisStroke}
          style={{ fontSize: '11px' }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          stroke={CHART_CONFIG.axisStroke}
          style={{ fontSize: '12px' }}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
          iconType="circle"
        />
        <Bar
          dataKey="alunos"
          fill={CHART_COLORS.accent}
          name="Quantidade de Alunos"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </BaseChart>
  );
}
