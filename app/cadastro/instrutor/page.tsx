'use client';

import { useState } from 'react';
import { useData } from '@/lib/data-context';
import { InstructorRegistrationWizard } from '@/components/forms/InstructorRegistrationWizard';
import { Card } from '@/components/ui/card';
import type { InstrutorFormData } from '@/lib/schemas';

export default function CadastroInstrutorPublico() {
  const { addInstrutor } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cadastroCompleto, setCadastroCompleto] = useState(false);

  const handleSubmit = async (data: InstrutorFormData) => {
    setIsSubmitting(true);
    try {
      // Criar o instrutor (que ja inclui os dados de usuario)
      addInstrutor({
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        status: 'ativo',
        especialidades: data.especialidades,
        biografia: data.biografia,
      });

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
            Cadastro realizado com sucesso!
          </h1>
          <p className="text-gray-600 mb-6">
            Obrigado por se cadastrar como instrutor! Em breve entraremos em contato para validar suas informacoes.
          </p>
          <p className="text-sm text-muted-foreground">
            Voce pode fechar esta pagina agora.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Cadastro de Instrutor
          </h1>
          <p className="text-lg text-gray-600">
            Junte-se a nossa equipe de instrutores
          </p>
        </div>

        {/* Form */}
        <Card className="p-6 shadow-lg">
          <InstructorRegistrationWizard
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </Card>
      </div>
    </div>
  );
}
