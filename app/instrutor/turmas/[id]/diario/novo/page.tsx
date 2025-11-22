'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useData } from '@/lib/data-context';
import { DiarioAulaForm } from '@/components/forms/DiarioAulaForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { DiarioAulaFormData } from '@/lib/schemas';
import type { Instrutor } from '@/lib/types';

export default function NovoDiarioPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { turmas, ementas, alunos, diarios, addDiario } = useData();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const turmaId = params.id as string;
  const aulaIdParam = searchParams.get('aulaId');

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

  const ementa = ementas.find((e) => e.id === turma.ementaId);

  if (!ementa) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg font-medium">Ementa não encontrada</p>
        <p className="text-sm text-muted-foreground mb-4">
          Esta turma não possui uma ementa associada
        </p>
        <Button onClick={() => router.push(`/instrutor/turmas/${turma.id}`)}>
          Voltar para Detalhes da Turma
        </Button>
      </div>
    );
  }

  const alunosTurma = alunos.filter((a) => turma.alunos.includes(a.id));
  const diariosTurma = diarios.filter((d) => d.turmaId === turma.id);

  const handleSubmit = async (data: DiarioAulaFormData) => {
    setIsSubmitting(true);

    try {
      // Encontrar a aula selecionada
      const aulaSelected = ementa.aulas.find((a) => a.id === data.aulaEmentaId);

      if (!aulaSelected) {
        toast({
          title: 'Erro',
          description: 'Aula selecionada não encontrada na ementa',
          variant: 'destructive',
        });
        return;
      }

      // Criar novo diário
      addDiario({
        turmaId: turma.id,
        instrutorId: instrutor.id,
        aulaEmentaId: data.aulaEmentaId,
        aulaTitulo: aulaSelected.titulo,
        data: data.data,
        numeroAula: data.numeroAula,
        tipo: data.tipo,
        conteudo: data.conteudo,
        resumo: data.resumo,
        observacoes: data.observacoes,
        presencas: data.presencas,
      });

      toast({
        title: 'Diário salvo com sucesso!',
        description: `Diário da aula "${aulaSelected.titulo}" foi registrado.`,
      });

      // Redirecionar para lista de diários
      router.push(`/instrutor/turmas/${turma.id}/diario`);
    } catch (error) {
      toast({
        title: 'Erro ao salvar diário',
        description: 'Ocorreu um erro ao salvar o diário. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <div>
          <h2 className="text-3xl font-bold tracking-tight">Lançar Novo Diário</h2>
          <p className="text-muted-foreground mt-1">
            {turma.codigo} - {turma.ementa}
          </p>
        </div>
      </div>

      {/* Formulário */}
      <DiarioAulaForm
        aulas={ementa.aulas}
        alunos={alunosTurma}
        diarios={diariosTurma}
        initialData={aulaIdParam ? { aulaEmentaId: aulaIdParam } : undefined}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Salvar Diário"
      />
    </div>
  );
}
