'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/lib/data-context';
import { InstructorRegistrationWizard } from '@/components/forms/InstructorRegistrationWizard';
import { Card } from '@/components/ui/card';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { InstrutorFormData } from '@/lib/schemas';

export default function NovoInstrutorPage() {
  const router = useRouter();
  const { addUsuario, addInstrutor } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: InstrutorFormData) => {
    setIsSubmitting(true);
    try {
      // Criar o usuário
      const novoUsuario = {
        id: Date.now().toString(),
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        role: 'instrutor' as const,
        status: 'ativo' as const,
        dataCadastro: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString(),
      };

      addUsuario(novoUsuario);

      // Criar o instrutor com dados adicionais
      const novoInstrutor = {
        id: `inst-${Date.now()}`,
        usuarioId: novoUsuario.id,
        especialidades: data.especialidades,
        biografia: data.biografia,
        dataCriacao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString(),
      };

      addInstrutor(novoInstrutor);
      router.push('/admin/instrutores');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/instrutores">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Novo Instrutor</h1>
            <p className="text-gray-600 mt-1">
              Cadastre um novo instrutor no sistema
            </p>
          </div>
        </div>
        <CopyLinkButton
          linkPath="/cadastro/instrutor"
          title="Link de Cadastro Público"
          description="Compartilhe este link para que instrutores possam se cadastrar diretamente"
          buttonText="Obter Link Público"
        />
      </div>

      {/* Form */}
      <Card className="p-6">
        <InstructorRegistrationWizard
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </Card>
    </div>
  );
}
