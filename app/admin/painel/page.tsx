'use client';

import { useState, useMemo } from 'react';
import { useData } from '@/lib/data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RetentionChart } from '@/components/charts/RetentionChart';
import { NeighborhoodChart } from '@/components/charts/NeighborhoodChart';
import { GenderPieChart } from '@/components/charts/GenderPieChart';
import { EthnicityChart } from '@/components/charts/EthnicityChart';
import { StudentStatusChart } from '@/components/charts/StudentStatusChart';
import { TableFilters, type TableFiltersState } from '@/components/filters/TableFilters';
import { ExportConfigModal } from '@/components/admin/ExportConfigModal';
import {
  Users,
  GraduationCap,
  UserPlus,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Clock,
  Award,
  BarChart3,
  FileDown,
  MapPin,
  UserCheck,
  FileText,
  Calendar,
  CheckCircle,
} from 'lucide-react';

export default function AdminPainelImpacto() {
  const { usuarios, turmas, alunos, instrutores, cursos, interessados, diarios, ementas } = useData();
  const [filters, setFilters] = useState<TableFiltersState>({
    cursoId: null,
    dataInicial: '',
    dataFinal: '',
  });
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Aplicar filtros aos dados das Tabs (não afeta Overview)
  const dadosFiltrados = useMemo(() => {
    let turmasFiltradas = turmas;
    let alunosFiltrados = alunos;
    let interessadosFiltrados = interessados;
    let instrutoresFiltrados = instrutores;

    // Filtrar por curso
    if (filters.cursoId) {
      // Encontrar ementas do curso selecionado
      const ementasIds = ementas
        .filter(e => e.cursoId === filters.cursoId)
        .map(e => e.id);

      // Filtrar turmas que usam essas ementas
      turmasFiltradas = turmas.filter(t => ementasIds.includes(t.ementaId));
      const turmaIds = turmasFiltradas.map(t => t.id);

      // Filtrar alunos dessas turmas
      alunosFiltrados = alunos.filter(a => a.turmaId && turmaIds.includes(a.turmaId));

      // Filtrar interessados que querem esse curso
      interessadosFiltrados = interessados.filter(i =>
        i.cursoInteresse === filters.cursoId
      );

      // Filtrar instrutores que lecionam nessas turmas
      const instrutorIds = turmasFiltradas.map(t => t.instrutorId);
      instrutoresFiltrados = instrutores.filter(i => instrutorIds.includes(i.id));
    }

    // Filtrar por período (data inicial)
    if (filters.dataInicial) {
      turmasFiltradas = turmasFiltradas.filter(t =>
        t.dataInicio >= filters.dataInicial
      );
      const turmaIds = turmasFiltradas.map(t => t.id);
      alunosFiltrados = alunosFiltrados.filter(a =>
        a.turmaId && turmaIds.includes(a.turmaId)
      );

      // Atualizar instrutores baseado nas turmas filtradas por data
      const instrutorIds = turmasFiltradas.map(t => t.instrutorId);
      instrutoresFiltrados = instrutoresFiltrados.filter(i => instrutorIds.includes(i.id));
    }

    // Filtrar por período (data final)
    if (filters.dataFinal) {
      turmasFiltradas = turmasFiltradas.filter(t =>
        t.dataInicio <= filters.dataFinal
      );
      const turmaIds = turmasFiltradas.map(t => t.id);
      alunosFiltrados = alunosFiltrados.filter(a =>
        a.turmaId && turmaIds.includes(a.turmaId)
      );

      // Atualizar instrutores baseado nas turmas filtradas por data
      const instrutorIds = turmasFiltradas.map(t => t.instrutorId);
      instrutoresFiltrados = instrutoresFiltrados.filter(i => instrutorIds.includes(i.id));
    }

    return {
      turmas: turmasFiltradas,
      alunos: alunosFiltrados,
      interessados: interessadosFiltrados,
      instrutores: instrutoresFiltrados,
    };
  }, [filters, turmas, alunos, interessados, ementas, instrutores]);

  // Métricas de Usuários
  const coordenadores = usuarios.filter(u => u.role === 'coordenador');
  const coordenadoresAtivos = coordenadores.filter(c => c.status === 'ativo').length;

  const instrutoresUsuarios = usuarios.filter(u => u.role === 'instrutor');
  const instrutoresAtivos = instrutoresUsuarios.filter(i => i.status === 'ativo').length;

  // Métricas de Turmas
  const turmasAtivas = turmas.filter(t => t.status === 'em_andamento').length;
  const turmasPlanejadas = turmas.filter(t => t.status === 'planejada').length;
  const turmasFinalizadas = turmas.filter(t => t.status === 'finalizada').length;
  const turmasCanceladas = turmas.filter(t => t.status === 'cancelada').length;

  // Métricas de Alunos
  const totalAlunos = alunos.length;
  const alunosAtivos = alunos.filter(a => a.status === 'ativo').length;
  const alunosConcluidos = alunos.filter(a => a.status === 'concluido').length;
  const alunosEvadidos = alunos.filter(a => a.status === 'evadido').length;

  // Taxas e Percentuais
  const taxaConclusao = totalAlunos > 0 ? ((alunosConcluidos / totalAlunos) * 100).toFixed(1) : '0';
  const taxaEvasao = totalAlunos > 0 ? ((alunosEvadidos / totalAlunos) * 100).toFixed(1) : '0';

  // Horas Ministradas (exemplo simplificado - assumir 2h por turma ativa)
  const horasMinstradas = turmasAtivas * 2 * 12; // 2h/semana * 12 semanas estimadas

  const kpiCards = [
    {
      title: 'Total de Alunos',
      value: totalAlunos,
      subtitle: `${alunosAtivos} ativos`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+12% vs mês anterior',
      trendUp: true,
    },
    {
      title: 'Taxa de Conclusão',
      value: `${taxaConclusao}%`,
      subtitle: `${alunosConcluidos} concluídos`,
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '+5% vs mês anterior',
      trendUp: true,
    },
    {
      title: 'Taxa de Evasão',
      value: `${taxaEvasao}%`,
      subtitle: `${alunosEvadidos} evadidos`,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      trend: '-3% vs mês anterior',
      trendUp: true,
    },
    {
      title: 'Horas Ministradas',
      value: horasMinstradas,
      subtitle: 'Estimativa total',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: 'Últimos 3 meses',
      trendUp: null,
    },
  ];

  const turmasMetrics = [
    { label: 'Em Andamento', count: turmasAtivas, variant: 'default' as const, color: 'text-blue-600' },
    { label: 'Planejadas', count: turmasPlanejadas, variant: 'default' as const, color: 'text-gray-600' },
    { label: 'Finalizadas', count: turmasFinalizadas, variant: 'success' as const, color: 'text-green-600' },
    { label: 'Canceladas', count: turmasCanceladas, variant: 'destructive' as const, color: 'text-red-600' },
  ];

  const alunosMetrics = [
    { label: 'Ativos', count: alunosAtivos, variant: 'default' as const, color: 'text-blue-600' },
    { label: 'Concluídos', count: alunosConcluidos, variant: 'success' as const, color: 'text-green-600' },
    { label: 'Evadidos', count: alunosEvadidos, variant: 'destructive' as const, color: 'text-red-600' },
    { label: 'Inativos', count: alunos.filter(a => a.status === 'inativo').length, variant: 'default' as const, color: 'text-gray-600' },
  ];

  const handleDownloadPDF = () => {
    setExportModalOpen(true);
  };

  // ===== Métricas Detalhadas de Alunos =====
  const interessadosAlunos = interessados.filter((i) => i.tipo === 'aluno');

  // Alunos por bairro
  const alunosPorBairro = alunos.reduce((acc, aluno) => {
    const bairro = aluno.endereco?.bairro || 'Não informado';
    acc[bairro] = (acc[bairro] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const bairroData = Object.entries(alunosPorBairro)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  // Alunos por gênero
  const generoData = interessadosAlunos.reduce((acc, int) => {
    const genero = int.genero || 'Não informado';
    acc[genero] = (acc[genero] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Alunos por etnia
  const etniaData = interessadosAlunos.reduce((acc, int) => {
    const etnia = int.corRaca || 'Não informado';
    acc[etnia] = (acc[etnia] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // ===== Métricas de Instrutores =====
  const instrutoresAtivosCompleto = instrutores.filter(i => i.status === 'ativo');

  const metricasInstrutores = instrutoresAtivosCompleto.map(instrutor => {
    const turmasDoInstrutor = turmas.filter(t => t.instrutorId === instrutor.id);
    const turmasAtivas = turmasDoInstrutor.filter(t => t.status === 'em_andamento');
    const turmasFinalizadas = turmasDoInstrutor.filter(t => t.status === 'finalizada');

    const diariosDoInstrutor = diarios.filter(d => d.instrutorId === instrutor.id);

    const totalAlunos = turmasDoInstrutor.reduce((sum, t) => sum + t.vagasOcupadas, 0);

    // Calcular taxa de presença média
    let totalPresencas = 0;
    let totalRegistros = 0;

    diariosDoInstrutor.forEach(diario => {
      diario.presencas.forEach(presenca => {
        totalRegistros++;
        if (presenca.status === 'presente') {
          totalPresencas++;
        }
      });
    });

    const taxaPresencaMedia = totalRegistros > 0
      ? Math.round((totalPresencas / totalRegistros) * 100)
      : 0;

    const mesAtual = new Date().toISOString().slice(0, 7);
    const diariosUltimoMes = diariosDoInstrutor.filter(d => d.data.startsWith(mesAtual)).length;

    return {
      id: instrutor.id,
      nome: instrutor.nome,
      turmasAtivas: turmasAtivas.length,
      turmasFinalizadas: turmasFinalizadas.length,
      totalTurmas: turmasDoInstrutor.length,
      totalAlunos,
      diariosLancados: diariosDoInstrutor.length,
      diariosUltimoMes,
      taxaPresencaMedia,
      especialidades: instrutor.especialidades,
    };
  });

  const instrutoresRanking = [...metricasInstrutores].sort((a, b) => {
    const scoreA = a.taxaPresencaMedia + (a.diariosLancados * 0.5);
    const scoreB = b.taxaPresencaMedia + (b.diariosLancados * 0.5);
    return scoreB - scoreA;
  });

  const mediaTaxaPresenca = metricasInstrutores.length > 0
    ? Math.round(metricasInstrutores.reduce((sum, m) => sum + m.taxaPresencaMedia, 0) / metricasInstrutores.length)
    : 0;

  const totalDiarios = metricasInstrutores.reduce((sum, m) => sum + m.diariosLancados, 0);

  // ===== DADOS FILTRADOS PARA AS TABS =====
  const alunosFiltrados = dadosFiltrados.alunos;
  const turmasFiltradas = dadosFiltrados.turmas;
  const interessadosFiltrados = dadosFiltrados.interessados;
  const instrutoresFiltrados = dadosFiltrados.instrutores;

  // Métricas de Alunos Filtradas
  const alunosPorBairroFiltrado = alunosFiltrados.reduce((acc, aluno) => {
    const bairro = aluno.endereco?.bairro || 'Não informado';
    acc[bairro] = (acc[bairro] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const bairroDataFiltrado = Object.entries(alunosPorBairroFiltrado)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const interessadosAlunosFiltrados = interessadosFiltrados.filter((i) => i.tipo === 'aluno');
  const generoDataFiltrado = interessadosAlunosFiltrados.reduce((acc, int) => {
    const genero = int.genero || 'Não informado';
    acc[genero] = (acc[genero] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const etniaDataFiltrado = interessadosAlunosFiltrados.reduce((acc, int) => {
    const etnia = int.corRaca || 'Não informado';
    acc[etnia] = (acc[etnia] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const alunosAtivosFiltrados = alunosFiltrados.filter((a) => a.status === 'ativo').length;
  const alunosConcluidosFiltrados = alunosFiltrados.filter((a) => a.status === 'concluido').length;
  const alunosEvadidosFiltrados = alunosFiltrados.filter((a) => a.status === 'evadido').length;
  const totalMatriculadosFiltrados = alunosFiltrados.length;

  // Métricas de Instrutores Filtradas
  const instrutoresAtivosFiltrados = instrutoresFiltrados.filter(i => i.status === 'ativo');

  const metricasInstrutoresFiltrados = instrutoresAtivosFiltrados.map(instrutor => {
    const turmasDoInstrutor = turmasFiltradas.filter(t => t.instrutorId === instrutor.id);
    const turmasAtivas = turmasDoInstrutor.filter(t => t.status === 'em_andamento');
    const turmasFinalizadas = turmasDoInstrutor.filter(t => t.status === 'finalizada');

    const diariosDoInstrutor = diarios.filter(d => {
      const turmaIds = turmasDoInstrutor.map(t => t.id);
      return d.instrutorId === instrutor.id && turmaIds.includes(d.turmaId);
    });

    const totalAlunos = turmasDoInstrutor.reduce((sum, t) => sum + t.vagasOcupadas, 0);

    let totalPresencas = 0;
    let totalRegistros = 0;

    diariosDoInstrutor.forEach(diario => {
      diario.presencas.forEach(presenca => {
        totalRegistros++;
        if (presenca.status === 'presente') {
          totalPresencas++;
        }
      });
    });

    const taxaPresencaMedia = totalRegistros > 0
      ? Math.round((totalPresencas / totalRegistros) * 100)
      : 0;

    const mesAtual = new Date().toISOString().slice(0, 7);
    const diariosUltimoMes = diariosDoInstrutor.filter(d => d.data.startsWith(mesAtual)).length;

    return {
      id: instrutor.id,
      nome: instrutor.nome,
      turmasAtivas: turmasAtivas.length,
      turmasFinalizadas: turmasFinalizadas.length,
      totalTurmas: turmasDoInstrutor.length,
      totalAlunos,
      diariosLancados: diariosDoInstrutor.length,
      diariosUltimoMes,
      taxaPresencaMedia,
      especialidades: instrutor.especialidades,
    };
  });

  const instrutoresRankingFiltrado = [...metricasInstrutoresFiltrados].sort((a, b) => {
    const scoreA = a.taxaPresencaMedia + (a.diariosLancados * 0.5);
    const scoreB = b.taxaPresencaMedia + (b.diariosLancados * 0.5);
    return scoreB - scoreA;
  });

  const mediaTaxaPresencaFiltrada = metricasInstrutoresFiltrados.length > 0
    ? Math.round(metricasInstrutoresFiltrados.reduce((sum, m) => sum + m.taxaPresencaMedia, 0) / metricasInstrutoresFiltrados.length)
    : 0;

  const totalDiariosFiltrados = metricasInstrutoresFiltrados.reduce((sum, m) => sum + m.diariosLancados, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Painel de Impacto</h1>
          <p className="text-gray-600 mt-1">Visão geral das métricas e indicadores da organização</p>
        </div>
        <Button
          onClick={handleDownloadPDF}
          variant="default"
          size="default"
          className="gap-2"
        >
          <FileDown className="w-4 h-4" />
          Baixar PDF para Investidor
        </Button>
      </div>

      {/* Filtros para as Tabs */}
      <TableFilters cursos={cursos} onFiltersChange={setFilters} />

      {/* Tabs Principais */}
      <Tabs defaultValue="projeto" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projeto">Métricas do Projeto</TabsTrigger>
          <TabsTrigger value="alunos">Métricas de Alunos</TabsTrigger>
          <TabsTrigger value="instrutores">Desempenho dos Instrutores</TabsTrigger>
        </TabsList>

        {/* Tab: Métricas do Projeto */}
        <TabsContent value="projeto" className="space-y-6">
          {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {kpi.title}
                </CardTitle>
                <div className={`${kpi.bgColor} p-2 rounded-lg`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                <p className="text-xs text-gray-500 mt-1">{kpi.subtitle}</p>
                {kpi.trend && (
                  <div className="flex items-center mt-2">
                    {kpi.trendUp !== null && (
                      kpi.trendUp ? (
                        <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
                      )
                    )}
                    <span className={`text-xs ${kpi.trendUp === null ? 'text-gray-500' : kpi.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.trend}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Grid de Métricas Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição de Turmas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              Distribuição de Turmas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{turmas.length}</span>
                <span className="text-sm text-gray-500">Total de turmas</span>
              </div>
              <div className="space-y-3">
                {turmasMetrics.map(metric => (
                  <div key={metric.label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{metric.label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${metric.color}`}>{metric.count}</span>
                      <Badge variant={metric.variant}>{metric.count}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Distribuição de Alunos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Distribuição de Alunos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{totalAlunos}</span>
                <span className="text-sm text-gray-500">Total de alunos</span>
              </div>
              <div className="space-y-3">
                {alunosMetrics.map(metric => (
                  <div key={metric.label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{metric.label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${metric.color}`}>{metric.count}</span>
                      <Badge variant={metric.variant}>{metric.count}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Equipe */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              Equipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded">
                    <UserPlus className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Coordenadores</p>
                    <p className="text-xs text-gray-500">{coordenadoresAtivos} ativos</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-blue-600">{coordenadores.length}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Instrutores</p>
                    <p className="text-xs text-gray-500">{instrutoresAtivos} ativos</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-purple-600">{instrutoresUsuarios.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cursos Oferecidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Cursos Oferecidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-gray-900">{cursos.length}</span>
                <span className="text-sm text-gray-500">Cursos disponíveis</span>
              </div>
              {cursos.map(curso => (
                <div key={curso.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{curso.nome}</span>
                  <Badge variant="default">{curso.nivelEnsino}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Retenção vs Evasão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Retenção vs Evasão (Últimos 6 Meses)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RetentionChart alunos={alunos} />
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>Legenda:</strong> Este gráfico mostra a evolução dos alunos por mês de cadastro.
              Barras verdes representam alunos que concluíram os cursos, barras azuis mostram alunos
              ainda ativos, e barras vermelhas indicam alunos que evadiram.
            </p>
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        {/* Tab: Métricas de Alunos */}
        <TabsContent value="alunos" className="space-y-6">
          {/* Alunos por Bairro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Alunos por Bairro
              </CardTitle>
              <CardDescription>Distribuição geográfica dos alunos (Top 10)</CardDescription>
            </CardHeader>
            <CardContent>
              <NeighborhoodChart bairroData={bairroDataFiltrado} totalAlunos={alunosFiltrados.length} />
            </CardContent>
          </Card>

          {/* Gênero e Etnia */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Alunos por Gênero
                </CardTitle>
                <CardDescription>Distribuição por identidade de gênero</CardDescription>
              </CardHeader>
              <CardContent>
                <GenderPieChart generoData={generoDataFiltrado} total={interessadosAlunosFiltrados.length} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Alunos por Etnia
                </CardTitle>
                <CardDescription>Distribuição por cor/raça autodeclarada</CardDescription>
              </CardHeader>
              <CardContent>
                <EthnicityChart etniaData={etniaDataFiltrado} total={interessadosAlunosFiltrados.length} />
              </CardContent>
            </Card>
          </div>

          {/* Status dos Alunos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Status dos Alunos
              </CardTitle>
              <CardDescription>Distribuição por situação atual</CardDescription>
            </CardHeader>
            <CardContent>
              <StudentStatusChart
                alunosAtivos={alunosAtivosFiltrados}
                alunosConcluidos={alunosConcluidosFiltrados}
                alunosEvadidos={alunosEvadidosFiltrados}
                totalMatriculados={totalMatriculadosFiltrados}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Desempenho dos Instrutores */}
        <TabsContent value="instrutores" className="space-y-6">
          {/* KPIs dos Instrutores */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Instrutores Ativos</p>
                    <p className="text-2xl font-bold">{instrutoresAtivosFiltrados.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserCheck className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total de Diários</p>
                    <p className="text-2xl font-bold">{totalDiariosFiltrados}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Taxa Média de Presença</p>
                    <p className="text-2xl font-bold">{mediaTaxaPresencaFiltrada}%</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Turmas em Andamento</p>
                    <p className="text-2xl font-bold">{metricasInstrutoresFiltrados.reduce((sum, m) => sum + m.turmasAtivas, 0)}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ranking de Instrutores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Ranking de Desempenho
              </CardTitle>
              <CardDescription>
                Instrutores ordenados por taxa de presença e diários lançados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {instrutoresRankingFiltrado.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum instrutor ativo no momento
                  </div>
                ) : (
                  instrutoresRankingFiltrado.map((instrutor, index) => (
                    <div
                      key={instrutor.id}
                      className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">#{index + 1}</span>
                      </div>

                      <div className="flex-1">
                        <h4 className="font-semibold">{instrutor.nome}</h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            {instrutor.turmasAtivas} turmas ativas
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {instrutor.totalAlunos} alunos
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-6 text-center">
                        <div>
                          <p className="text-2xl font-bold text-success">{instrutor.taxaPresencaMedia}%</p>
                          <p className="text-xs text-muted-foreground">Presença</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-accent">{instrutor.diariosLancados}</p>
                          <p className="text-xs text-muted-foreground">Diários</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-primary">{instrutor.diariosUltimoMes}</p>
                          <p className="text-xs text-muted-foreground">Este mês</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Detalhamento por Instrutor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Detalhamento por Instrutor
              </CardTitle>
              <CardDescription>
                Estatísticas completas de cada instrutor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium">Instrutor</th>
                      <th className="text-center py-3 px-2 font-medium">Turmas Ativas</th>
                      <th className="text-center py-3 px-2 font-medium">Turmas Finalizadas</th>
                      <th className="text-center py-3 px-2 font-medium">Total Alunos</th>
                      <th className="text-center py-3 px-2 font-medium">Taxa Presença</th>
                      <th className="text-center py-3 px-2 font-medium">Diários</th>
                      <th className="text-left py-3 px-2 font-medium">Especialidades</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metricasInstrutoresFiltrados.map((instrutor) => (
                      <tr key={instrutor.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2 font-medium">{instrutor.nome}</td>
                        <td className="py-3 px-2 text-center">
                          <Badge variant="default">{instrutor.turmasAtivas}</Badge>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <Badge variant="outline">{instrutor.turmasFinalizadas}</Badge>
                        </td>
                        <td className="py-3 px-2 text-center">{instrutor.totalAlunos}</td>
                        <td className="py-3 px-2 text-center">
                          <span className={`font-semibold ${
                            instrutor.taxaPresencaMedia >= 80 ? 'text-success' :
                            instrutor.taxaPresencaMedia >= 60 ? 'text-warning' :
                            'text-destructive'
                          }`}>
                            {instrutor.taxaPresencaMedia}%
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">{instrutor.diariosLancados}</td>
                        <td className="py-3 px-2">
                          <div className="flex flex-wrap gap-1">
                            {instrutor.especialidades.slice(0, 2).map((esp, idx) => (
                              <Badge key={idx} variant="outlinePrimary" className="text-xs">
                                {esp}
                              </Badge>
                            ))}
                            {instrutor.especialidades.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{instrutor.especialidades.length - 2}
                              </Badge>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Configuração de Exportação */}
      <ExportConfigModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        cursos={cursos}
      />
    </div>
  );
}
