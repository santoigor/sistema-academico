'use client';

import { useState } from 'react';
import { useData } from '@/lib/data-context';
import { VolunteerRegistrationWizard } from '@/components/forms/VolunteerRegistrationWizard';
import { Card } from '@/components/ui/card';
import type { CadastroVoluntarioFormData } from '@/lib/schemas';

export default function CadastroVoluntarioPublico() {
  const { addInteressado } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cadastroCompleto, setCadastroCompleto] = useState(false);

  const handleSubmit = async (data: CadastroVoluntarioFormData) => {
    setIsSubmitting(true);
    try {
      // Calculate age from date of birth
      const birthDate = new Date(data.dataNascimento);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      const voluntarioData = {
        id: `interessado-${Date.now()}`,
        tipo: 'voluntario' as const,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        idade: age,
        dataNascimento: data.dataNascimento,
        genero: data.genero,
        escolaridade: data.escolaridade,
        cursoInteresse: data.areaInteresse,
        endereco: data.endereco,
        motivoVoluntariado: data.motivoVoluntariado,
        habilidadesExperiencia: data.habilidadesExperiencia,
        nivelDisponibilidade: data.nivelDisponibilidade,
        experienciaVoluntariado: data.experienciaVoluntariado,
        detalhesExperienciaVoluntariado: data.detalhesExperienciaVoluntariado,
        corRaca: data.corRaca,
        etnia: data.etnia,
        deficienciaFisica: data.deficienciaFisica,
        deficienciaIntelectual: data.deficienciaIntelectual,
        necessidadeEspecial: data.necessidadeEspecial,
        especificacaoDeficiencia: data.especificacaoDeficiencia,
        origem: data.origem,
        status: 'novo' as const,
        dataRegistro: new Date().toISOString().split('T')[0],
      };

      addInteressado(voluntarioData);
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
            Obrigado por se cadastrar como voluntário! Em breve entraremos em contato para validar suas informações.
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Cadastro de Voluntário
          </h1>
          <p className="text-lg text-gray-600">
            Junte-se à nossa equipe de voluntários
          </p>
        </div>

        {/* Form */}
        <Card className="p-6 shadow-lg">
          <VolunteerRegistrationWizard
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </Card>
      </div>
    </div>
  );
}
