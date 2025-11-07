'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { mockMetricasQualitativas, mockHistoriasAlunos } from '@/lib/mock-data';

export default function MetricasPage() {
  const { alunos, interessados, turmas } = useData();
  const [searchAutor, setSearchAutor] = useState<string>('');

  // Quantitative Metrics Calculations

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Métricas</h1>
        <p className="text-muted-foreground mt-1">
          Visualize indicadores quantitativos e qualitativos do programa
        </p>
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

      {/* Tabs para Quantitativas, Qualitativas e Histórias */}
      <Tabs defaultValue="quantitativas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="quantitativas">Métricas Quantitativas</TabsTrigger>
          <TabsTrigger value="qualitativas">Métricas Qualitativas</TabsTrigger>
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
              <div className="space-y-3">
                {bairroData.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhum dado de bairro disponível
                  </p>
                ) : (
                  bairroData.map(([bairro, count]) => {
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
                  })
                )}
              </div>
            </CardContent>
          </Card>

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
              <div className="space-y-4">
                {Object.keys(generoData).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhum dado de gênero disponível
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(generoData).map(([genero, count]) => {
                      const percentage = interessadosAlunos.length > 0
                        ? ((count / interessadosAlunos.length) * 100).toFixed(1)
                        : '0';
                      return (
                        <div key={genero} className="border rounded-lg p-4 text-center">
                          <p className="text-sm text-muted-foreground mb-2 capitalize">{genero}</p>
                          <p className="text-5xl font-bold text-primary mb-3">{percentage}%</p>
                          <p className="text-sm text-muted-foreground">{count} aluno{count !== 1 ? 's' : ''}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
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
              <div className="space-y-3">
                {Object.keys(etniaData).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhum dado de etnia disponível
                  </p>
                ) : (
                  Object.entries(etniaData)
                    .sort(([, a], [, b]) => b - a)
                    .map(([etnia, count]) => {
                      const percentage = interessadosAlunos.length > 0
                        ? ((count / interessadosAlunos.length) * 100).toFixed(1)
                        : '0';
                      return (
                        <div key={etnia} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium capitalize">{etnia}</span>
                            <span className="text-muted-foreground">
                              {count} aluno{count !== 1 ? 's' : ''} ({percentage}%)
                            </span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-accent transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </CardContent>
          </Card>

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Ativos</p>
                  <p className="text-3xl font-semibold text-blue-600 mb-1">{alunosAtivos}</p>
                  <Badge variant="default">
                    {totalMatriculados > 0 ? ((alunosAtivos / totalMatriculados) * 100).toFixed(1) : '0'}%
                  </Badge>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Concluídos</p>
                  <p className="text-3xl font-semibold text-green-600 mb-1">{alunosConcluidos}</p>
                  <Badge className="bg-green-600">{percentualConclusao}%</Badge>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Evadidos</p>
                  <p className="text-3xl font-semibold text-orange-600 mb-1">{alunosEvadidos}</p>
                  <Badge className="bg-orange-600">{percentualEvasao}%</Badge>
                </div>
              </div>
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
                  <p className="text-3xl font-semibold mb-1">{turmasPlanejadas}</p>
                  <Badge variant="outline">
                    {turmas.length > 0 ? ((turmasPlanejadas / turmas.length) * 100).toFixed(1) : '0'}%
                  </Badge>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Em Andamento</p>
                  <p className="text-3xl font-semibold text-primary mb-1">{turmasAtivas}</p>
                  <Badge variant="accent">
                    {turmas.length > 0 ? ((turmasAtivas / turmas.length) * 100).toFixed(1) : '0'}%
                  </Badge>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Finalizadas</p>
                  <p className="text-3xl font-semibold text-green-600 mb-1">{turmasFinalizadas}</p>
                  <Badge className="bg-green-600">
                    {turmas.length > 0 ? ((turmasFinalizadas / turmas.length) * 100).toFixed(1) : '0'}%
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
                <div className="space-y-3">
                  {satisfacaoDistribuicao.reverse().map(({ nivel, count, percentage }) => (
                    <div key={nivel} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{nivel} estrela{nivel !== 1 ? 's' : ''}</span>
                          {'⭐'.repeat(nivel)}
                        </div>
                        <span className="text-muted-foreground">
                          {count} resposta{count !== 1 ? 's' : ''} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
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
    </div>
  );
}
