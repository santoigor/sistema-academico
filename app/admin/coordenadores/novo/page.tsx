'use client';

import { useRouter } from 'next/navigation';
import { useData } from '@/lib/data-context';
import { CoordenadorForm } from '@/components/forms/coordenador-form';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { CoordenadorFormData } from '@/lib/schemas';

export default function NovoCoordenadorPage() {
  const router = useRouter();
  const { addUsuario } = useData();

  const handleSubmit = (data: CoordenadorFormData) => {
    const novoCoordenador = {
      id: Date.now().toString(),
      ...data,
      role: 'coordenador' as const,
      status: 'ativo' as const,
      dataCadastro: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
    };

    addUsuario(novoCoordenador);
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
          <h1 className="text-3xl font-bold text-gray-900">Novo Coordenador</h1>
          <p className="text-gray-600 mt-1">
            Cadastre um novo coordenador no sistema
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <CoordenadorForm onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}
