'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useData } from '@/lib/data-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DiarioAulaList } from '@/components/instrutor/DiarioAulaList';
import { ArrowLeft, FileEdit, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import type { Instrutor } from '@/lib/types';

export default function DiarioListPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { turmas, diarios, deleteDiario } = useData();
  const { toast } = useToast();

  const turmaId = params.id as string;

  if (!user || user.role !== 'instrutor') {
    return null;
  }

  const instrutor = user as Instrutor;
  const turma = turmas.find((t) => t.id === turmaId);

  // Verificar permissão
  if (!turma || !instrutor.turmasAlocadas.includes(turma.id)) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg font-medium">Turma não encontrada</p>
        <p className="text-sm text-muted-foreground mb-4">
          Você não tem permissão para acessar esta turma
        </p>
        <Button onClick={() => router.push('/instrutor/turmas')}>
          Voltar para Minhas Turmas
        </Button>
      </div>
    );
  }

  const diariosTurma = diarios.filter((d) => d.turmaId === turma.id);

  const handleDelete = (diarioId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este diário?')) {
      deleteDiario(diarioId);
      toast({
        title: 'Diário excluído',
        description: 'O diário foi removido com sucesso.',
      });
    }
  };

  // Calcular estatísticas
  const totalAulas = diariosTurma.length;
  let totalPresencas = 0;
  let totalRegistros = 0;

  diariosTurma.forEach((diario) => {
    diario.presencas.forEach((presenca) => {
      totalRegistros++;
      if (presenca.status === 'presente') {
        totalPresencas++;
      }
    });
  });

  const taxaPresencaMedia = totalRegistros > 0 ? Math.round((totalPresencas / totalRegistros) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => router.push(`/instrutor/turmas/${turma.id}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Diários de Aula</h2>
            <p className="text-muted-foreground mt-1">
              {turma.codigo} - {turma.ementa}
            </p>
          </div>
          <Link href={`/instrutor/turmas/${turma.id}/diario/novo`}>
            <Button variant="default">
              <FileEdit className="mr-2 h-4 w-4" />
              Lançar Novo Diário
            </Button>
          </Link>
        </div>
      </div>

      {/* Estatísticas */}
      {diariosTurma.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aulas Ministradas</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAulas}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total de diários lançados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Presença Média</CardTitle>
              <FileEdit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taxaPresencaMedia}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalPresencas} presenças de {totalRegistros} registros
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lista de Diários */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Diários</CardTitle>
          <CardDescription>
            {diariosTurma.length > 0
              ? 'Todos os diários lançados para esta turma'
              : 'Nenhum diário lançado ainda'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DiarioAulaList
            diarios={diariosTurma}
            turmaId={turma.id}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}
