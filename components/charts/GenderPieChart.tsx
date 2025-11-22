'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from './BaseChart';

interface GenderPieChartProps {
  generoData: Record<string, number>;
  total: number;
}

/**
 * Gráfico de pizza mostrando distribuição de alunos por gênero
 * Métrica QUALITATIVA - mostra proporção e categorização
 */
export function GenderPieChart({ generoData, total }: GenderPieChartProps) {
  const genderColors: Record<string, string> = {
    'masculino': CHART_COLORS.primary,
    'feminino': CHART_COLORS.accent,
    'outro': CHART_COLORS.success,
    'prefiro não informar': CHART_COLORS.gray,
    'não informado': CHART_COLORS.gray,
  };

  const dados = Object.entries(generoData).map(([genero, count]) => ({
    name: genero.charAt(0).toUpperCase() + genero.slice(1),
    value: count,
    color: genderColors[genero.toLowerCase()] || CHART_COLORS.gray,
  }));

  if (dados.length === 0 || total === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-1">Sem dados de gênero</p>
          <p className="text-gray-400 text-xs">Não há informações de gênero disponíveis</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-1">{data.name}</p>
          <p className="text-sm text-gray-600">
            Quantidade: <span className="font-semibold">{data.value}</span>
          </p>
          <p className="text-sm text-gray-600">
            Percentual: <span className="font-semibold">{percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = (entry: any) => {
    const percentage = ((entry.value / total) * 100).toFixed(0);
    return `${percentage}%`;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={dados}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {dados.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
