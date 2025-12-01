'use client';

import { useState, useMemo } from 'react';
import { useData } from '@/lib/data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import {
  BarChart3,
  Users,
  MapPin,
  Award,
  TrendingUp,
  Smile,
  Target,
  Briefcase,
  GraduationCap as GraduationCapIcon,
  Star,
  Heart,
  Sparkles,
  Search,
  UserCheck,
  FileText,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import { mockMetricasQualitativas, mockHistoriasAlunos } from '@/lib/mock-data';
import { NeighborhoodChart } from '@/components/charts/NeighborhoodChart';
import { GenderPieChart } from '@/components/charts/GenderPieChart';
import { EthnicityChart } from '@/components/charts/EthnicityChart';
import { StudentStatusChart } from '@/components/charts/StudentStatusChart';
import { SatisfactionChart } from '@/components/charts/SatisfactionChart';
import { TableFilters, type TableFiltersState } from '@/components/filters/TableFilters';
import { ExportConfigModal } from '@/components/admin/ExportConfigModal';
import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MetricasPage() {
  const { alunos, interessados, turmas, instrutores, diarios, cursos, ementas } = useData();
  const [searchAutor, setSearchAutor] = useState<string>('');
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [filters, setFilters] = useState<TableFiltersState>({
    cursoId: null,
    dataInicial: '',
    dataFinal: '',
  });

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

  // Quantitative Metrics Calculations (Overview - SEM FILTROS)

  // Total de alunos
  const totalAlunos = alunos.length;
  const totalInteressados = interessados.filter((i) => i.tipo === 'aluno').length;

  // Alunos por bairro (usando dados de endereço)
  const alunosPorBairro = alunos.reduce((acc, aluno) => {
    const bairro = aluno.endereco?.bairro || 'Não informado';
    acc[bairro] = (acc[bairro] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const bairroData = Object.entries(alunosPorBairro)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10); // Top 10 bairros

  // Alunos por gênero (usando dados de interessados convertidos)
  const interessadosAlunos = interessados.filter((i) => i.tipo === 'aluno');
  const generoData = interessadosAlunos.reduce((acc, int) => {
    const genero = int.genero || 'Não informado';
    acc[genero] = (acc[genero] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Alunos por etnia/cor-raça
  const etniaData = interessadosAlunos.reduce((acc, int) => {
    const etnia = int.corRaca || 'Não informado';
    acc[etnia] = (acc[etnia] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Percentual de conclusão
  const alunosAtivos = alunos.filter((a) => a.status === 'ativo').length;
  const alunosConcluidos = alunos.filter((a) => a.status === 'concluido').length;
  const alunosEvadidos = alunos.filter((a) => a.status === 'evadido').length;
  const totalMatriculados = alunos.length;
  const percentualConclusao = totalMatriculados > 0
    ? ((alunosConcluidos / totalMatriculados) * 100).toFixed(1)
    : '0';
  const percentualEvasao = totalMatriculados > 0
    ? ((alunosEvadidos / totalMatriculados) * 100).toFixed(1)
    : '0';

  // Status das turmas
  const turmasAtivas = turmas.filter((t) => t.status === 'em_andamento').length;
  const turmasFinalizadas = turmas.filter((t) => t.status === 'finalizada').length;
  const turmasPlanejadas = turmas.filter((t) => t.status === 'planejada').length;

  // Métricas Qualitativas Calculations
  const totalRespostas = mockMetricasQualitativas.length;

  // Satisfação
  const mediaSatisfacao = totalRespostas > 0
    ? (mockMetricasQualitativas.reduce((sum, m) => sum + m.satisfacaoCurso, 0) / totalRespostas).toFixed(1)
    : '0';
  const satisfacaoDistribuicao = [1, 2, 3, 4, 5].map(nivel => ({
    nivel,
    count: mockMetricasQualitativas.filter(m => m.satisfacaoCurso === nivel).length,
    percentage: totalRespostas > 0
      ? ((mockMetricasQualitativas.filter(m => m.satisfacaoCurso === nivel).length / totalRespostas) * 100).toFixed(1)
      : '0',
  }));

  // Autoavaliação (converter de escala 1-5 para porcentagem)
  const mediaSeguranca = totalRespostas > 0
    ? ((mockMetricasQualitativas.reduce((sum, m) => sum + m.segurancaFerramentasDigitais, 0) / totalRespostas) * 20).toFixed(1)
    : '0';
  const mediaHabilidade = totalRespostas > 0
    ? ((mockMetricasQualitativas.reduce((sum, m) => sum + m.habilidadeProgramacao, 0) / totalRespostas) * 20).toFixed(1)
    : '0';

  // Empregabilidade
  const candidatandoVagas = mockMetricasQualitativas.filter(m => m.candidatandoVagas).length;
  const percentualCandidatando = totalRespostas > 0
    ? ((candidatandoVagas / totalRespostas) * 100).toFixed(1)
    : '0';

  const tiposOportunidade = mockMetricasQualitativas.reduce((acc, m) => {
    if (m.tipoOportunidade) {
      acc[m.tipoOportunidade] = (acc[m.tipoOportunidade] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Educação
  const interesseCursoTecnico = mockMetricasQualitativas.filter(m => m.interesseCursoTecnico).length;
  const interesseGraduacao = mockMetricasQualitativas.filter(m => m.interesseGraduacao).length;
  const percentualCursoTecnico = totalRespostas > 0
    ? ((interesseCursoTecnico / totalRespostas) * 100).toFixed(1)
    : '0';
  const percentualGraduacao = totalRespostas > 0
    ? ((interesseGraduacao / totalRespostas) * 100).toFixed(1)
    : '0';

  // Histórias filtradas
  const historiasAprovadas = mockHistoriasAlunos.filter(h => h.aprovada);
  const historiasDestacadas = historiasAprovadas.filter(h => h.destacada);

  // Filtrar por busca de autor
  let historiasFilteradas = historiasAprovadas;

  if (searchAutor.trim()) {
    historiasFilteradas = historiasFilteradas.filter(h =>
      h.alunoNome.toLowerCase().includes(searchAutor.toLowerCase())
    );
  }

  // Métricas dos Instrutores
  const instrutoresAtivos = instrutores.filter(i => i.status === 'ativo');

  const metricasInstrutores = instrutoresAtivos.map(instrutor => {
    const turmasDoInstrutor = turmas.filter(t => t.instrutorId === instrutor.id);
    const turmasAtivas = turmasDoInstrutor.filter(t => t.status === 'em_andamento');
    const turmasFinalizadas = turmasDoInstrutor.filter(t => t.status === 'finalizada');

    const diariosDoInstrutor = diarios.filter(d => d.instrutorId === instrutor.id);

    // Calcular total de alunos
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

    // Diários lançados no último mês
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

  // Ordenar por performance (taxa de presença + diários lançados)
  const instrutoresRanking = [...metricasInstrutores].sort((a, b) => {
    const scoreA = a.taxaPresencaMedia + (a.diariosLancados * 0.5);
    const scoreB = b.taxaPresencaMedia + (b.diariosLancados * 0.5);
    return scoreB - scoreA;
  });

  // Média geral de presença
  const mediaTaxaPresenca = metricasInstrutores.length > 0
    ? Math.round(metricasInstrutores.reduce((sum, m) => sum + m.taxaPresencaMedia, 0) / metricasInstrutores.length)
    : 0;

  // Total de diários lançados
  const totalDiarios = metricasInstrutores.reduce((sum, m) => sum + m.diariosLancados, 0);

  // ========== CÁLCULOS PARA AS TABS (COM FILTROS) ==========

  // Usar dados filtrados para todos os cálculos das tabs
  const alunosFiltrados = dadosFiltrados.alunos;
  const turmasFiltradas = dadosFiltrados.turmas;
  const interessadosFiltrados = dadosFiltrados.interessados;
  const instrutoresFiltrados = dadosFiltrados.instrutores;

  // Métricas Quantitativas Filtradas
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

  const turmasAtivasFiltradas = turmasFiltradas.filter((t) => t.status === 'em_andamento').length;
  const turmasFinalizadasFiltradas = turmasFiltradas.filter((t) => t.status === 'finalizada').length;
  const turmasPlejanadasFiltradas = turmasFiltradas.filter((t) => t.status === 'planejada').length;

  // Métricas dos Instrutores Filtradas
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

  const handleDownloadPDF = () => {
    setExportModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Métricas</h1>
          <p className="text-muted-foreground mt-1">
            Visualize indicadores quantitativos e qualitativos do programa
          </p>
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

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Alunos</p>
                <p className="text-2xl font-semibold">{totalAlunos}</p>
              </div>
              <Users className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
                <p className="text-2xl font-semibold text-green-600">{percentualConclusao}%</p>
              </div>
              <Award className="h-8 w-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Evasão</p>
                <p className="text-2xl font-semibold text-orange-600">{percentualEvasao}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Interessados</p>
                <p className="text-2xl font-semibold text-accent">{totalInteressados}</p>
              </div>
              <Users className="h-8 w-8 text-accent opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros para as Tabs */}
      <TableFilters cursos={cursos} onFiltersChange={setFilters} />

      {/* Tabs para Quantitativas, Qualitativas e Histórias */}
      <Tabs defaultValue="quantitativas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="quantitativas">Métricas Quantitativas</TabsTrigger>
          <TabsTrigger value="qualitativas">Métricas Qualitativas</TabsTrigger>
          <TabsTrigger value="instrutores">Desempenho dos Instrutores</TabsTrigger>
          <TabsTrigger value="historias">Histórias de Sucesso</TabsTrigger>
        </TabsList>

        {/* Quantitativas Tab */}
        <TabsContent value="quantitativas" className="space-y-6">
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

          {/* Gênero e Etnia lado a lado */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Alunos por Gênero */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Alunos por Gênero
                </CardTitle>
                <CardDescription>Distribuição de gênero dos alunos interessados</CardDescription>
              </CardHeader>
              <CardContent>
                <GenderPieChart generoData={generoDataFiltrado} total={interessadosAlunosFiltrados.length} />
              </CardContent>
            </Card>

            {/* Alunos por Etnia/Cor-Raça */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Alunos por Etnia/Cor-Raça
                </CardTitle>
                <CardDescription>Distribuição étnica dos alunos interessados</CardDescription>
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
                <BarChart3 className="h-5 w-5" />
                Status dos Alunos
              </CardTitle>
              <CardDescription>Percentual de conclusão e evasão</CardDescription>
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

          {/* Status das Turmas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCapIcon className="h-5 w-5" />
                Status das Turmas
              </CardTitle>
              <CardDescription>Distribuição das turmas por status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Planejadas</p>
                  <p className="text-3xl font-semibold mb-1">{turmasPlejanadasFiltradas}</p>
                  <Badge variant="outline">
                    {turmasFiltradas.length > 0 ? ((turmasPlejanadasFiltradas / turmasFiltradas.length) * 100).toFixed(1) : '0'}%
                  </Badge>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Em Andamento</p>
                  <p className="text-3xl font-semibold text-primary mb-1">{turmasAtivasFiltradas}</p>
                  <Badge variant="accent">
                    {turmasFiltradas.length > 0 ? ((turmasAtivasFiltradas / turmasFiltradas.length) * 100).toFixed(1) : '0'}%
                  </Badge>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Finalizadas</p>
                  <p className="text-3xl font-semibold text-green-600 mb-1">{turmasFinalizadasFiltradas}</p>
                  <Badge className="bg-green-600">
                    {turmasFiltradas.length > 0 ? ((turmasFinalizadasFiltradas / turmasFiltradas.length) * 100).toFixed(1) : '0'}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Qualitativas Tab */}
        <TabsContent value="qualitativas" className="space-y-6">
          {/* Satisfação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smile className="h-5 w-5" />
                Satisfação com o Curso
              </CardTitle>
              <CardDescription>
                Avaliação dos alunos sobre sua experiência ({totalRespostas} resposta{totalRespostas !== 1 ? 's' : ''})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-5xl font-bold text-primary mb-2">{mediaSatisfacao}</p>
                  <p className="text-sm text-muted-foreground">Média de satisfação (de 1 a 5)</p>
                </div>
                <Separator />
                <SatisfactionChart satisfacaoDistribuicao={satisfacaoDistribuicao} />
              </div>
            </CardContent>
          </Card>

          {/* Autoavaliação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Autoavaliação de Habilidades
              </CardTitle>
              <CardDescription>
                Segurança e habilidade em ferramentas digitais e programação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center border rounded-lg p-6">
                  <p className="text-sm text-muted-foreground mb-2">Segurança em Ferramentas Digitais</p>
                  <p className="text-5xl font-bold text-primary mb-2">{mediaSeguranca}%</p>
                  <p className="text-xs text-muted-foreground">dos alunos se sentem seguros</p>
                </div>
                <div className="text-center border rounded-lg p-6">
                  <p className="text-sm text-muted-foreground mb-2">Habilidade em Programação</p>
                  <p className="text-5xl font-bold text-accent mb-2">{mediaHabilidade}%</p>
                  <p className="text-xs text-muted-foreground">dos alunos se sentem hábeis</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Candidatura a Empregos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Candidatura a Vagas e Freelancing
              </CardTitle>
              <CardDescription>
                Percentual de participantes em processos seletivos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-5xl font-bold text-green-600 mb-2">{percentualCandidatando}%</p>
                  <p className="text-sm text-muted-foreground">
                    {candidatandoVagas} de {totalRespostas} aluno{totalRespostas !== 1 ? 's' : ''} está{candidatandoVagas !== 1 ? 'ão' : ''} se candidatando
                  </p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(tiposOportunidade).map(([tipo, count]) => {
                    const labels = {
                      emprego: 'Emprego',
                      freelancer: 'Freelancer',
                      processo_seletivo: 'Processo Seletivo',
                      nenhuma: 'Nenhuma',
                    };
                    return (
                      <div key={tipo} className="text-center border rounded-lg p-3">
                        <p className="text-2xl font-bold text-primary mb-1">{count}</p>
                        <p className="text-xs text-muted-foreground">{labels[tipo as keyof typeof labels]}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interesse em Educação Continuada */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCapIcon className="h-5 w-5" />
                Interesse em Educação Continuada
              </CardTitle>
              <CardDescription>
                Percentual interessado em cursos técnicos ou graduação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center border rounded-lg p-6">
                  <p className="text-sm text-muted-foreground mb-2">Curso Técnico</p>
                  <p className="text-5xl font-bold text-primary mb-2">{percentualCursoTecnico}%</p>
                  <p className="text-xs text-muted-foreground">{interesseCursoTecnico} de {totalRespostas} alunos</p>
                </div>
                <div className="text-center border rounded-lg p-6">
                  <p className="text-sm text-muted-foreground mb-2">Graduação</p>
                  <p className="text-5xl font-bold text-accent mb-2">{percentualGraduacao}%</p>
                  <p className="text-xs text-muted-foreground">{interesseGraduacao} de {totalRespostas} alunos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Instrutores Tab */}
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
                      {/* Posição */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">#{index + 1}</span>
                      </div>

                      {/* Info do Instrutor */}
                      <div className="flex-1">
                        <h4 className="font-semibold">{instrutor.nome}</h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <GraduationCapIcon className="h-4 w-4" />
                            {instrutor.turmasAtivas} turmas ativas
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {instrutor.totalAlunos} alunos
                          </span>
                        </div>
                      </div>

                      {/* Métricas */}
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

        {/* Histórias Tab */}
        <TabsContent value="historias" className="space-y-6">
          {/* Busca */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Histórias de Sucesso
              </CardTitle>
              <CardDescription>
                {historiasAprovadas.length} histórias compartilhadas pelos alunos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Campo de Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por autor..."
                  value={searchAutor}
                  onChange={(e) => setSearchAutor(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          {/* Histórias Destacadas */}
          {!searchAutor.trim() && historiasDestacadas.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-semibold">Histórias em Destaque</h3>
              </div>
              {historiasDestacadas.map((historia) => (
                <Card key={historia.id} className="border-2 border-yellow-500/30 bg-yellow-50/10">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-4 w-4 text-yellow-500" />
                        </div>
                        <CardTitle className="text-xl mb-2">{historia.titulo}</CardTitle>
                        <CardDescription>
                          {historia.alunoNome} • Turma {historia.turmaCodigo} • {new Date(historia.dataCompartilhamento).toLocaleDateString('pt-BR')}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="max-h-60">
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{historia.historia}</p>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Lista de Histórias */}
          <div className="space-y-4">
            {historiasFilteradas.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Heart className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Nenhuma história encontrada
                  </p>
                </CardContent>
              </Card>
            ) : (
              historiasFilteradas
                .filter(h => searchAutor.trim() || !h.destacada)
                .map((historia) => (
                  <Card key={historia.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{historia.titulo}</CardTitle>
                          <CardDescription>
                            {historia.alunoNome} • Turma {historia.turmaCodigo} • {new Date(historia.dataCompartilhamento).toLocaleDateString('pt-BR')}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="max-h-48">
                        <p className="text-sm whitespace-pre-wrap leading-relaxed text-muted-foreground">
                          {historia.historia}
                        </p>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
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
