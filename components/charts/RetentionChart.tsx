'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BaseChart, CHART_COLORS, CHART_CONFIG } from './BaseChart';
import type { Aluno } from '@/lib/types';

interface RetentionChartProps {
  alunos: Aluno[];
}

interface MonthlyData {
  mes: string;
  concluidos: number;
  evadidos: number;
  ativos: number;
}

/**
 * Gráfico de barras empilhadas mostrando Retenção vs Evasão
 * Agrupa alunos por mês de cadastro e status final
 */
export function RetentionChart({ alunos }: RetentionChartProps) {
  // Calcular dados dos últimos 6 meses
  const calcularDadosMensais = (): MonthlyData[] => {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const dadosMensais: MonthlyData[] = [];

    // Usar data fixa de 2024-11-20 para consistência com os dados mock
    const dataReferencia = new Date('2024-11-20');

    // Gerar últimos 6 meses a partir da data de referência
    for (let i = 5; i >= 0; i--) {
      const data = new Date(dataReferencia.getFullYear(), dataReferencia.getMonth() - i, 1);
      const mesNome = meses[data.getMonth()];

      // Filtrar alunos cadastrados neste mês
      const alunosMes = alunos.filter(aluno => {
        if (!aluno.dataMatricula) return false;
        const dataMatricula = new Date(aluno.dataMatricula);
        return dataMatricula.getMonth() === data.getMonth() &&
               dataMatricula.getFullYear() === data.getFullYear();
      });

      // Contar por status
      const concluidos = alunosMes.filter(a => a.status === 'concluido').length;
      const evadidos = alunosMes.filter(a => a.status === 'evadido').length;
      const ativos = alunosMes.filter(a => a.status === 'ativo').length;

      dadosMensais.push({
        mes: mesNome,
        concluidos,
        evadidos,
        ativos,
      });
    }

    return dadosMensais;
  };

  const dados = calcularDadosMensais();

  // Tooltip customizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-semibold">{entry.value}</span>
            </p>
          ))}
          <p className="text-sm text-gray-600 mt-1 pt-1 border-t">
            Total: <span className="font-semibold">{total}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <BaseChart height={350}>
      <BarChart data={dados} margin={CHART_CONFIG.margin}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_CONFIG.gridStroke} />
        <XAxis
          dataKey="mes"
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
          wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
          iconType="circle"
        />
        <Bar
          dataKey="concluidos"
          stackId="a"
          fill={CHART_COLORS.success}
          name="Concluídos"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="ativos"
          stackId="a"
          fill={CHART_COLORS.primary}
          name="Ativos"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="evadidos"
          stackId="a"
          fill={CHART_COLORS.danger}
          name="Evadidos"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </BaseChart>
  );
}
