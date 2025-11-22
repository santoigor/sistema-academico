'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { BaseChart, CHART_COLORS, CHART_CONFIG } from './BaseChart';

interface StudentStatusChartProps {
  alunosAtivos: number;
  alunosConcluidos: number;
  alunosEvadidos: number;
  totalMatriculados: number;
}

/**
 * Gráfico de barras mostrando status dos alunos
 * Métrica QUANTITATIVA - mostra volume por categoria de status
 */
export function StudentStatusChart({
  alunosAtivos,
  alunosConcluidos,
  alunosEvadidos,
  totalMatriculados,
}: StudentStatusChartProps) {
  const dados = [
    {
      status: 'Ativos',
      quantidade: alunosAtivos,
      percentual: totalMatriculados > 0 ? ((alunosAtivos / totalMatriculados) * 100).toFixed(1) : '0',
      color: CHART_COLORS.primary,
    },
    {
      status: 'Concluídos',
      quantidade: alunosConcluidos,
      percentual: totalMatriculados > 0 ? ((alunosConcluidos / totalMatriculados) * 100).toFixed(1) : '0',
      color: CHART_COLORS.success,
    },
    {
      status: 'Evadidos',
      quantidade: alunosEvadidos,
      percentual: totalMatriculados > 0 ? ((alunosEvadidos / totalMatriculados) * 100).toFixed(1) : '0',
      color: CHART_COLORS.warning,
    },
  ];

  if (totalMatriculados === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-1">Sem dados de status</p>
          <p className="text-gray-400 text-xs">Não há alunos matriculados</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{data.status}</p>
          <p className="text-sm text-gray-600">
            Quantidade: <span className="font-semibold">{data.quantidade}</span>
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
      <BarChart data={dados} margin={CHART_CONFIG.margin}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_CONFIG.gridStroke} />
        <XAxis
          dataKey="status"
          stroke={CHART_CONFIG.axisStroke}
          style={{ fontSize: '12px', fontWeight: 500 }}
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
          dataKey="quantidade"
          name="Quantidade de Alunos"
          radius={[8, 8, 0, 0]}
        >
          {dados.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </BaseChart>
  );
}
