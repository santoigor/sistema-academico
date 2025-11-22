'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BaseChart, CHART_COLORS, CHART_CONFIG } from './BaseChart';

const mockData = [
  { name: 'Jan', alunos: 12, concluidos: 8, evadidos: 2 },
  { name: 'Fev', alunos: 15, concluidos: 10, evadidos: 3 },
  { name: 'Mar', alunos: 18, concluidos: 12, evadidos: 4 },
  { name: 'Abr', alunos: 22, concluidos: 15, evadidos: 5 },
  { name: 'Mai', alunos: 25, concluidos: 18, evadidos: 4 },
  { name: 'Jun', alunos: 28, concluidos: 20, evadidos: 6 },
];

/**
 * Test component to validate Recharts installation
 * Displays a simple bar chart with mock data
 */
export function TestChart() {
  return (
    <BaseChart height={350}>
      <BarChart data={mockData} margin={CHART_CONFIG.margin}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_CONFIG.gridStroke} />
        <XAxis
          dataKey="name"
          stroke={CHART_CONFIG.axisStroke}
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke={CHART_CONFIG.axisStroke}
          style={{ fontSize: '12px' }}
        />
        <Tooltip
          contentStyle={CHART_CONFIG.tooltipStyle}
          cursor={{ fill: 'rgba(44, 82, 130, 0.1)' }}
        />
        <Legend
          wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
        />
        <Bar
          dataKey="concluidos"
          fill={CHART_COLORS.success}
          name="Concluídos"
          radius={[8, 8, 0, 0]}
        />
        <Bar
          dataKey="evadidos"
          fill={CHART_COLORS.danger}
          name="Evadidos"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </BaseChart>
  );
}
