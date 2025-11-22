'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/lib/data-context';
import { StudentRegistrationWizard } from '@/components/forms/StudentRegistrationWizard';
import { Card } from '@/components/ui/card';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { InteressadoFormData } from '@/lib/schemas';

export default function NovoInteressadoPage() {
  const router = useRouter();
  const { addInteressado, addAluno, cursos, turmas, updateTurma } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: InteressadoFormData, turmaId?: string) => {
    setIsSubmitting(true);
    try {
      const novoInteressado = {
        id: Date.now().toString(),
        ...data,
        status: 'novo' as const,
        dataCadastro: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString(),
      };

      addInteressado(novoInteressado);

      // Se uma turma foi selecionada, criar o aluno e vinculá-lo
      if (turmaId) {
        const alunoId = `aluno-${Date.now()}`;
        const novoAluno = {
          id: alunoId,
          nome: data.nome,
          email: data.email,
          telefone: data.telefone,
          cpf: data.cpf,
          dataNascimento: data.dataNascimento,
          genero: data.genero,
          escolaridade: data.escolaridade,
          endereco: data.endereco,
          turmaId: turmaId,
          status: 'ativo' as const,
          dataMatricula: new Date().toISOString(),
          responsavel: data.responsavelNome ? {
            nome: data.responsavelNome,
            telefone: data.telefone,
            email: data.email,
            parentesco: data.responsavelParentesco || 'Não informado',
          } : undefined,
          contatoEmergencia: {
            nome: data.contatoEmergenciaNome,
            telefone: data.contatoEmergenciaTelefone,
            parentesco: data.contatoEmergenciaParentesco,
          },
          alergias: data.alergias,
          deficiencias: data.deficiencias,
          corRaca: data.corRaca,
          etnia: data.etnia,
        };

        addAluno(novoAluno);

        // Atualizar turma incrementando vagasOcupadas
        const turma = turmas.find(t => t.id === turmaId);
        if (turma) {
          updateTurma(turmaId, {
            ...turma,
            vagasOcupadas: turma.vagasOcupadas + 1,
          });
        }
      }

      router.push('/coordenador/painel');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/coordenador/painel">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cadastrar Aluno Interessado</h1>
            <p className="text-gray-600 mt-1">
              Preencha o formulário passo a passo
            </p>
          </div>
        </div>
        <CopyLinkButton
          linkPath="/cadastro/aluno"
          title="Link de Cadastro Público"
          description="Compartilhe este link para que alunos possam se cadastrar diretamente"
          buttonText="Obter Link Público"
        />
      </div>

      {/* Form */}
      <Card className="p-6">
        <StudentRegistrationWizard
          cursos={cursos}
          turmas={turmas}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </Card>
    </div>
  );
}
