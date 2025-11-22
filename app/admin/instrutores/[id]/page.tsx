'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/lib/data-context';
import { InstructorRegistrationWizard } from '@/components/forms/InstructorRegistrationWizard';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { InstrutorFormData } from '@/lib/schemas';
import type { Instrutor } from '@/lib/types';

export default function EditarInstrutorPage() {
  const params = useParams();
  const router = useRouter();
  const { usuarios, instrutores, updateUsuario, updateInstrutor } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const usuario = usuarios.find(
    u => u.id === params.id && u.role === 'instrutor'
  ) as Instrutor | undefined;

  const instrutorData = instrutores.find(i => i.usuarioId === params.id);

  if (!usuario || !instrutorData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Instrutor não encontrado</p>
        <Link href="/admin/instrutores">
          <button className="text-blue-600 hover:underline mt-4">
            Voltar para lista
          </button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (data: InstrutorFormData) => {
    setIsSubmitting(true);
    try {
      // Atualizar usuário
      updateUsuario(usuario.id, {
        ...usuario,
        nome: data.nome,
        email: data.email,
        cpf: usuario.cpf,
        telefone: data.telefone,
        dataAtualizacao: new Date().toISOString(),
      });

      // Atualizar instrutor
      updateInstrutor(instrutorData.id, {
        ...instrutorData,
        especialidades: data.especialidades,
        biografia: data.biografia,
        dataAtualizacao: new Date().toISOString(),
      });

      router.push('/admin/instrutores');
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultValues: InstrutorFormData = {
    nome: usuario.nome,
    email: usuario.email,
    telefone: usuario.telefone,
    especialidades: instrutorData.especialidades,
    biografia: instrutorData.biografia || '',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/instrutores">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Instrutor</h1>
          <p className="text-gray-600 mt-1">
            Atualize as informações do instrutor
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <InstructorRegistrationWizard
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </Card>
    </div>
  );
}
