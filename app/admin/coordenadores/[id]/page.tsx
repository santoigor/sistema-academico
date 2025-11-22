'use client';

import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/lib/data-context';
import { CoordenadorForm } from '@/components/forms/coordenador-form';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { CoordenadorFormData } from '@/lib/schemas';
import type { Coordenador } from '@/lib/types';

export default function EditarCoordenadorPage() {
  const params = useParams();
  const router = useRouter();
  const { usuarios, updateUsuario } = useData();

  const coordenador = usuarios.find(
    u => u.id === params.id && u.role === 'coordenador'
  ) as Coordenador | undefined;

  if (!coordenador) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Coordenador não encontrado</p>
        <Link href="/admin/coordenadores">
          <button className="text-blue-600 hover:underline mt-4">
            Voltar para lista
          </button>
        </Link>
      </div>
    );
  }

  const handleSubmit = (data: CoordenadorFormData) => {
    updateUsuario(coordenador.id, {
      ...coordenador,
      ...data,
      dataAtualizacao: new Date().toISOString(),
    });
    router.push('/admin/coordenadores');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/coordenadores">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Coordenador</h1>
          <p className="text-gray-600 mt-1">
            Atualize as informações do coordenador
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <CoordenadorForm
          defaultValues={coordenador}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  );
}
