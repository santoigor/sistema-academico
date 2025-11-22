'use client';

import { useState } from 'react';
import { useData } from '@/lib/data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Download,
  Calendar,
  Award,
  FileCheck,
  Loader2,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function RelatoriosPage() {
  const { turmas, alunos, instrutores, ementas } = useData();
  const [selectedTurma, setSelectedTurma] = useState<string>('');
  const [selectedAluno, setSelectedAluno] = useState<string>('');
  const [mesAno, setMesAno] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock data para diários de aula (normalmente viria do banco de dados)
  const mockDiariosAula = [
    {
      id: '1',
      turmaId: '1',
      aulaNumero: 1,
      tema: 'Introdução ao HTML',
      resumo: 'Apresentação dos conceitos básicos de HTML, estrutura de documentos e principais tags.',
      data: '2024-08-05',
      cargaHoraria: 4,
      totalParticipantes: 10,
      presencas: 9,
    },
    {
      id: '2',
      turmaId: '1',
      aulaNumero: 2,
      tema: 'CSS Fundamentals',
      resumo: 'Estudo de seletores CSS, box model e posicionamento de elementos.',
      data: '2024-08-12',
      cargaHoraria: 4,
      totalParticipantes: 10,
      presencas: 10,
    },
    {
      id: '3',
      turmaId: '1',
      aulaNumero: 3,
      tema: 'JavaScript Básico',
      resumo: 'Variáveis, tipos de dados, operadores e estruturas de controle.',
      data: '2024-08-19',
      cargaHoraria: 4,
      totalParticipantes: 10,
      presencas: 8,
    },
    {
      id: '4',
      turmaId: '1',
      aulaNumero: 4,
      tema: 'DOM Manipulation',
      resumo: 'Manipulação do DOM, seleção de elementos e eventos.',
      data: '2024-08-26',
      cargaHoraria: 4,
      totalParticipantes: 10,
      presencas: 9,
    },
  ];

  const getDiaDaSemana = (data: string) => {
    const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const date = new Date(data + 'T00:00:00');
    return dias[date.getDay()];
  };

  const gerarRelatorioMensal = async () => {
    if (!selectedTurma || !mesAno) return;

    setIsGenerating(true);

    try {
      const turma = turmas.find(t => t.id === selectedTurma);
      if (!turma) return;

      const instrutor = instrutores.find(i => i.id === turma.instrutorId);
      const ementa = ementas.find(e => e.id === turma.ementaId);
      const alunosDaTurma = alunos.filter(a => a.turmaId === turma.id);

      // Filtrar diários por mês/ano
      const [ano, mes] = mesAno.split('-');
      const diariosDoMes = mockDiariosAula.filter(d => {
        if (d.turmaId !== turma.id) return false;
        const diaData = d.data.split('-');
        return diaData[0] === ano && diaData[1] === mes;
      });

      const doc = new jsPDF();
      let yPosition = 20;

      // Cabeçalho
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('RELATÓRIO MENSAL DE TURMA', 105, yPosition, { align: 'center' });
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const mesNome = new Date(mesAno + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      doc.text(mesNome.toUpperCase(), 105, yPosition, { align: 'center' });
      yPosition += 15;

      // Informações da Turma
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('INFORMAÇÕES DA TURMA', 14, yPosition);
      yPosition += 7;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Instrutor: ${instrutor?.nome || 'Não alocado'}`, 14, yPosition);
      yPosition += 5;
      doc.text(`Curso: ${ementa?.titulo || 'Não informado'}`, 14, yPosition);
      yPosition += 5;
      doc.text(`Turma: ${turma.codigo}`, 14, yPosition);
      yPosition += 5;
      doc.text(`Período: ${new Date(turma.dataInicio + 'T00:00:00').toLocaleDateString('pt-BR')} a ${new Date(turma.dataFim + 'T00:00:00').toLocaleDateString('pt-BR')}`, 14, yPosition);
      yPosition += 10;

      // Aulas do Mês
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('AULAS MINISTRADAS', 14, yPosition);
      yPosition += 5;

      if (diariosDoMes.length === 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('Nenhuma aula registrada neste período.', 14, yPosition);
        yPosition += 10;
      } else {
        const aulasData = diariosDoMes.map(d => [
          d.aulaNumero.toString(),
          d.tema,
          d.resumo.substring(0, 80) + (d.resumo.length > 80 ? '...' : ''),
          d.totalParticipantes.toString(),
          `${Math.round((d.presencas / d.totalParticipantes) * 100)}%`,
          `${d.cargaHoraria}h`,
          new Date(d.data + 'T00:00:00').toLocaleDateString('pt-BR'),
          getDiaDaSemana(d.data),
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['Nº', 'Tema', 'Resumo', 'Total', 'Presença', 'CH', 'Data', 'Dia']],
          body: aulasData,
          theme: 'grid',
          headStyles: { fillColor: [44, 82, 130], fontSize: 8 },
          bodyStyles: { fontSize: 8 },
          columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 30 },
            2: { cellWidth: 60 },
            3: { cellWidth: 15 },
            4: { cellWidth: 20 },
            5: { cellWidth: 12 },
            6: { cellWidth: 22 },
            7: { cellWidth: 25 },
          },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 10;
      }

      // Nova página para lista de alunos
      doc.addPage();
      yPosition = 20;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('LISTA DE ALUNOS', 14, yPosition);
      yPosition += 5;

      if (alunosDaTurma.length === 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('Nenhum aluno matriculado nesta turma.', 14, yPosition);
      } else {
        const alunosData = alunosDaTurma.map(a => {
          const dataNascimento = a.dataNascimento
            ? new Date(a.dataNascimento + 'T00:00:00').toLocaleDateString('pt-BR')
            : 'Não informado';

          const idade = a.dataNascimento
            ? new Date().getFullYear() - new Date(a.dataNascimento).getFullYear()
            : '-';

          return [
            a.nome,
            dataNascimento,
            idade.toString(),
            new Date(a.dataMatricula + 'T00:00:00').toLocaleDateString('pt-BR'),
          ];
        });

        autoTable(doc, {
          startY: yPosition,
          head: [['Nome', 'Data Nascimento', 'Idade', 'Data Matrícula']],
          body: alunosData,
          theme: 'grid',
          headStyles: { fillColor: [44, 82, 130] },
          columnStyles: {
            0: { cellWidth: 80 },
            1: { cellWidth: 40 },
            2: { cellWidth: 25 },
            3: { cellWidth: 40 },
          },
        });
      }

      // Rodapé
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(
          `Página ${i} de ${totalPages}`,
          105,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
        doc.text(
          `Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
          105,
          doc.internal.pageSize.height - 6,
          { align: 'center' }
        );
      }

      doc.save(`relatorio-mensal-${turma.codigo}-${mesAno}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório. Verifique o console para mais detalhes.');
    } finally {
      setIsGenerating(false);
    }
  };

  const gerarDeclaracaoConclusao = async () => {
    if (!selectedAluno) return;

    setIsGenerating(true);

    try {
      const aluno = alunos.find(a => a.id === selectedAluno);
      if (!aluno) return;

      const turma = turmas.find(t => t.id === aluno.turmaId);
      const ementa = turma ? ementas.find(e => e.id === turma.ementaId) : null;

      const doc = new jsPDF();

      // Borda decorativa
      doc.setLineWidth(2);
      doc.rect(10, 10, 190, 277);
      doc.setLineWidth(0.5);
      doc.rect(12, 12, 186, 273);

      let yPosition = 40;

      // Título
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('DECLARAÇÃO DE CONCLUSÃO', 105, yPosition, { align: 'center' });
      yPosition += 20;

      // Corpo do texto
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');

      const texto1 = `Declaramos para os devidos fins que ${aluno.nome}, portador(a) do CPF`;
      doc.text(texto1, 105, yPosition, { align: 'center' });
      yPosition += 7;

      doc.text(`${aluno.cpf || 'não informado'}, concluiu com êxito o curso de`, 105, yPosition, { align: 'center' });
      yPosition += 7;

      doc.setFont('helvetica', 'bold');
      doc.text(`${ementa?.titulo || 'Não informado'}`, 105, yPosition, { align: 'center' });
      yPosition += 7;

      doc.setFont('helvetica', 'normal');
      if (turma) {
        doc.text(
          `realizado no período de ${new Date(turma.dataInicio + 'T00:00:00').toLocaleDateString('pt-BR')} a ${new Date(turma.dataFim + 'T00:00:00').toLocaleDateString('pt-BR')},`,
          105,
          yPosition,
          { align: 'center' }
        );
        yPosition += 7;

        doc.text(`com carga horária total de ${ementa?.cargaHorariaTotal || 0} horas.`, 105, yPosition, { align: 'center' });
      }
      yPosition += 25;

      // Data de emissão
      doc.text(
        `São Paulo, ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`,
        105,
        yPosition,
        { align: 'center' }
      );
      yPosition += 40;

      // Linha de assinatura
      doc.line(60, yPosition, 150, yPosition);
      yPosition += 7;
      doc.setFontSize(10);
      doc.text('Coordenação Acadêmica', 105, yPosition, { align: 'center' });

      doc.save(`declaracao-conclusao-${aluno.nome.replace(/\s+/g, '-')}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar declaração:', error);
      alert('Erro ao gerar declaração. Verifique o console para mais detalhes.');
    } finally {
      setIsGenerating(false);
    }
  };

  const gerarDeclaracaoMatricula = async () => {
    if (!selectedAluno) return;

    setIsGenerating(true);

    try {
      const aluno = alunos.find(a => a.id === selectedAluno);
      if (!aluno) return;

      const turma = turmas.find(t => t.id === aluno.turmaId);
      const ementa = turma ? ementas.find(e => e.id === turma.ementaId) : null;

      const doc = new jsPDF();

      // Borda decorativa
      doc.setLineWidth(2);
      doc.rect(10, 10, 190, 277);
      doc.setLineWidth(0.5);
      doc.rect(12, 12, 186, 273);

      let yPosition = 40;

      // Título
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('DECLARAÇÃO DE MATRÍCULA', 105, yPosition, { align: 'center' });
      yPosition += 20;

      // Corpo do texto
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');

      const texto1 = `Declaramos para os devidos fins que ${aluno.nome}, portador(a) do CPF`;
      doc.text(texto1, 105, yPosition, { align: 'center' });
      yPosition += 7;

      doc.text(`${aluno.cpf || 'não informado'}, encontra-se regularmente matriculado(a) no curso de`, 105, yPosition, { align: 'center' });
      yPosition += 7;

      doc.setFont('helvetica', 'bold');
      doc.text(`${ementa?.titulo || 'Não informado'}`, 105, yPosition, { align: 'center' });
      yPosition += 7;

      doc.setFont('helvetica', 'normal');
      if (turma) {
        doc.text(`Turma: ${turma.codigo}`, 105, yPosition, { align: 'center' });
        yPosition += 7;

        doc.text(
          `Período: ${new Date(turma.dataInicio + 'T00:00:00').toLocaleDateString('pt-BR')} a ${new Date(turma.dataFim + 'T00:00:00').toLocaleDateString('pt-BR')}`,
          105,
          yPosition,
          { align: 'center' }
        );
        yPosition += 7;

        doc.text(`Carga horária: ${ementa?.cargaHorariaTotal || 0} horas`, 105, yPosition, { align: 'center' });
        yPosition += 7;
      }

      doc.text(`Data de matrícula: ${new Date(aluno.dataMatricula + 'T00:00:00').toLocaleDateString('pt-BR')}`, 105, yPosition, { align: 'center' });
      yPosition += 7;

      doc.text(`Status: ${aluno.status === 'ativo' ? 'Ativo' : aluno.status}`, 105, yPosition, { align: 'center' });
      yPosition += 25;

      // Data de emissão
      doc.text(
        `São Paulo, ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`,
        105,
        yPosition,
        { align: 'center' }
      );
      yPosition += 40;

      // Linha de assinatura
      doc.line(60, yPosition, 150, yPosition);
      yPosition += 7;
      doc.setFontSize(10);
      doc.text('Coordenação Acadêmica', 105, yPosition, { align: 'center' });

      doc.save(`declaracao-matricula-${aluno.nome.replace(/\s+/g, '-')}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar declaração:', error);
      alert('Erro ao gerar declaração. Verifique o console para mais detalhes.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Relatórios</h1>
        <p className="text-muted-foreground mt-1">
          Gere relatórios mensais e declarações em PDF
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Relatório Mensal */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Relatório Mensal de Turma</CardTitle>
                <CardDescription>
                  Relatório completo com diários de aula e lista de alunos
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="turma-relatorio">Turma</Label>
              <Select value={selectedTurma} onValueChange={setSelectedTurma}>
                <SelectTrigger id="turma-relatorio">
                  <SelectValue placeholder="Selecione uma turma" />
                </SelectTrigger>
                <SelectContent>
                  {turmas.map((turma) => {
                    const ementa = ementas.find(e => e.id === turma.ementaId);
                    return (
                      <SelectItem key={turma.id} value={turma.id}>
                        {turma.codigo} - {ementa?.titulo || 'Curso não definido'}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mes-ano">Mês/Ano</Label>
              <input
                id="mes-ano"
                type="month"
                value={mesAno}
                onChange={(e) => setMesAno(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <Separator />

            <Button
              onClick={gerarRelatorioMensal}
              disabled={!selectedTurma || !mesAno || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Gerar Relatório PDF
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Declarações */}
        <div className="space-y-6">
          {/* Declaração de Conclusão */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-green-600/10 flex items-center justify-center">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle>Declaração de Conclusão</CardTitle>
                  <CardDescription>
                    Certificado de conclusão de curso
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aluno-conclusao">Aluno</Label>
                <Select value={selectedAluno} onValueChange={setSelectedAluno}>
                  <SelectTrigger id="aluno-conclusao">
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                  <SelectContent>
                    {alunos
                      .filter((a) => a.status === 'concluido')
                      .map((aluno) => (
                        <SelectItem key={aluno.id} value={aluno.id}>
                          {aluno.nome} - {aluno.turma}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={gerarDeclaracaoConclusao}
                disabled={!selectedAluno || isGenerating}
                className="w-full"
                variant="default"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Declaração
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Declaração de Matrícula */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <FileCheck className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <CardTitle>Declaração de Matrícula</CardTitle>
                  <CardDescription>
                    Comprovante de matrícula ativa
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aluno-matricula">Aluno</Label>
                <Select value={selectedAluno} onValueChange={setSelectedAluno}>
                  <SelectTrigger id="aluno-matricula">
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                  <SelectContent>
                    {alunos
                      .filter((a) => a.status === 'ativo')
                      .map((aluno) => (
                        <SelectItem key={aluno.id} value={aluno.id}>
                          {aluno.nome} - {aluno.turma}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={gerarDeclaracaoMatricula}
                disabled={!selectedAluno || isGenerating}
                className="w-full"
                variant="default"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Declaração
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Informações */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4" />
            Informações sobre os Relatórios
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Relatório Mensal:</strong> Contém todas as aulas ministradas no período selecionado,
            com informações sobre tema, resumo, presença e carga horária, além da lista completa de alunos.
          </p>
          <p>
            <strong>Declaração de Conclusão:</strong> Disponível apenas para alunos com status "Concluído".
          </p>
          <p>
            <strong>Declaração de Matrícula:</strong> Disponível para alunos com status "Ativo".
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
