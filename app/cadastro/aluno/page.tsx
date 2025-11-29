'use client';

import { useState } from 'react';
import { useData } from '@/lib/data-context';
import { StudentRegistrationWizard } from '@/components/forms/StudentRegistrationWizard';
import { Card } from '@/components/ui/card';
import type { CadastroAlunoInteressadoFormData } from '@/lib/schemas';
import type { Interessado } from '@/lib/types';

export default function CadastroAlunoPublico() {
  const { addInteressado, cursos } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cadastroCompleto, setCadastroCompleto] = useState(false);

  const handleSubmit = async (data: CadastroAlunoInteressadoFormData, turmaId?: string) => {
    setIsSubmitting(true);
    // turmaId não é usado na versão pública do formulário
    try {
      const birthDate = new Date(data.dataNascimento);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      const interessadoData: Interessado = {
        id: `interessado-${Date.now()}`,
        tipo: 'aluno',
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        dataNascimento: data.dataNascimento,
        idade: age,
        cpf: data.cpf,
        genero: data.genero,
        escolaridade: data.escolaridade,
        cursoInteresse: data.cursoInteresse,
        endereco: data.endereco,
        responsavel: data.responsavelNome ? {
          nome: data.responsavelNome,
          parentesco: data.responsavelParentesco || '',
          telefone: data.responsavelTelefone,
          email: data.responsavelEmail,
        } : undefined,
        contatoEmergencia: {
          nome: data.contatoEmergenciaNome,
          telefone: data.contatoEmergenciaTelefone,
          parentesco: data.contatoEmergenciaParentesco,
        },
        corRaca: data.corRaca,
        etnia: data.etnia,
        alergias: data.alergias,
        deficiencias: data.deficiencias,
        informacoesCorretas: data.informacoesCorretas,
        documentosEntregues: data.documentos,
        observacoes: data.observacoes,
        status: 'novo',
        dataRegistro: new Date().toISOString().split('T')[0],
      };

      addInteressado(interessadoData);
      setCadastroCompleto(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cadastroCompleto) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full p-8 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 mb-4">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Cadastro recebido com sucesso!
          </h1>
          <p className="text-gray-600 mb-6">
            Por favor, aguarde nosso contato via WhatsApp para os próximos passos.
          </p>
          <p className="text-sm text-muted-foreground">
            Você pode fechar esta página agora.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Cadastro de Aluno
          </h1>
          <p className="text-lg text-gray-600">
            Preencha o formulário abaixo para se inscrever em nossos cursos
          </p>
        </div>

        {/* Form */}
        <Card className="p-6 shadow-lg">
          <StudentRegistrationWizard
            cursos={cursos}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isExternal={true}
          />
        </Card>
      </div>
    </div>
  );
}
