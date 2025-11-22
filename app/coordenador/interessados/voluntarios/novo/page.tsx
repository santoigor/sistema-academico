'use client';

import { useState } from 'react';
import { useData } from '@/lib/data-context';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { type CadastroVoluntarioFormData } from '@/lib/schemas';
import { Card } from '@/components/ui/card';
import { VolunteerRegistrationWizard } from '@/components/forms/VolunteerRegistrationWizard';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { ArrowLeft } from 'lucide-react';

export default function NovoVoluntarioPage() {
  const { addInteressado } = useData();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cadastrarComoInstrutor = searchParams.get('cadastrarComoInstrutor') === 'true';

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

      const voluntarioId = `interessado-${Date.now()}`;
      const voluntarioData = {
        id: voluntarioId,
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

      // Se deve cadastrar como instrutor, redireciona para página de cadastro de instrutor
      if (cadastrarComoInstrutor) {
        router.push(`/coordenador/instrutores/novo?voluntarioId=${voluntarioId}`);
      } else {
        router.push('/coordenador/interessados/voluntarios');
      }
    } catch (error) {
      console.error('Erro ao cadastrar voluntário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/coordenador/interessados/voluntarios">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {cadastrarComoInstrutor ? 'Cadastrar Instrutor' : 'Cadastrar Voluntário'}
            </h1>
            <p className="text-gray-600 mt-1">
              Preencha o formulário passo a passo
            </p>
          </div>
        </div>
        <CopyLinkButton
          linkPath="/cadastro/voluntario"
          title="Link de Cadastro Público"
          description="Compartilhe este link para que voluntários possam se cadastrar diretamente"
          buttonText="Obter Link Público"
        />
      </div>

      {/* Form */}
      <Card className="p-6">
        <VolunteerRegistrationWizard
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </Card>
    </div>
  );
}
