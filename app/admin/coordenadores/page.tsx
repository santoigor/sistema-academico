'use client';

import { useState } from 'react';
import { useData } from '@/lib/data-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Shield,
  Search,
  Plus,
  Edit,
  Lock,
  Unlock,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import type { Coordenador, StatusUsuario } from '@/lib/types';
import { BlockDialog, DeleteDialog } from '@/components/admin/ConfirmDialog';

export default function CoordenadoresPage() {
  const { usuarios, updateUsuario, deleteUsuario } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusUsuario | 'todos'>('todos');
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCoordenador, setSelectedCoordenador] = useState<Coordenador | null>(null);

  const coordenadores = usuarios.filter(u => u.role === 'coordenador') as Coordenador[];

  const filteredCoordenadores = coordenadores.filter(coord => {
    const matchesSearch = coord.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coord.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coord.cpf.includes(searchTerm);
    const matchesStatus = statusFilter === 'todos' || coord.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenBlockDialog = (coord: Coordenador) => {
    setSelectedCoordenador(coord);
    setBlockDialogOpen(true);
  };

  const handleOpenDeleteDialog = (coord: Coordenador) => {
    setSelectedCoordenador(coord);
    setDeleteDialogOpen(true);
  };

  const handleConfirmBlock = () => {
    if (!selectedCoordenador) return;
    const newStatus: StatusUsuario = selectedCoordenador.status === 'bloqueado' ? 'ativo' : 'bloqueado';
    updateUsuario(selectedCoordenador.id, { ...selectedCoordenador, status: newStatus });
    setSelectedCoordenador(null);
  };

  const handleConfirmDelete = () => {
    if (!selectedCoordenador) return;
    deleteUsuario(selectedCoordenador.id);
    setSelectedCoordenador(null);
  };

  const getStatusBadge = (status: StatusUsuario) => {
    const variants = {
      ativo: 'success' as const,
      bloqueado: 'destructive' as const,
      inativo: 'default' as const,
    };
    const labels = {
      ativo: 'Ativo',
      bloqueado: 'Bloqueado',
      inativo: 'Inativo',
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coordenadores</h1>
          <p className="text-gray-600 mt-1">
            Gerencie os coordenadores do sistema
          </p>
        </div>
        <Link href="/admin/coordenadores/novo">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Coordenador
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {coordenadores.length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ativos</p>
              <p className="text-2xl font-bold text-green-600">
                {coordenadores.filter(c => c.status === 'ativo').length}
              </p>
            </div>
            <Unlock className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bloqueados</p>
              <p className="text-2xl font-bold text-red-600">
                {coordenadores.filter(c => c.status === 'bloqueado').length}
              </p>
            </div>
            <Lock className="w-8 h-8 text-red-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inativos</p>
              <p className="text-2xl font-bold text-gray-600">
                {coordenadores.filter(c => c.status === 'inativo').length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-gray-400" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, email ou CPF..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusUsuario | 'todos')}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="ativo">Ativos</SelectItem>
              <SelectItem value="bloqueado">Bloqueados</SelectItem>
              <SelectItem value="inativo">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coordenador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Cadastro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCoordenadores.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Nenhum coordenador encontrado
                  </td>
                </tr>
              ) : (
                filteredCoordenadores.map((coord) => (
                  <tr key={coord.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {coord.nome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {coord.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {coord.cpf}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {coord.telefone}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(coord.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(coord.dataCadastro).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link href={`/admin/coordenadores/${coord.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenBlockDialog(coord)}
                      >
                        {coord.status === 'bloqueado' ? (
                          <Unlock className="w-4 h-4 text-green-600" />
                        ) : (
                          <Lock className="w-4 h-4 text-yellow-600" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDeleteDialog(coord)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Dialogs de confirmação */}
      {selectedCoordenador && (
        <>
          <BlockDialog
            open={blockDialogOpen}
            onOpenChange={setBlockDialogOpen}
            onConfirm={handleConfirmBlock}
            isBlocked={selectedCoordenador.status === 'bloqueado'}
            userName={selectedCoordenador.nome}
            userType="coordenador"
          />
          <DeleteDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleConfirmDelete}
            userName={selectedCoordenador.nome}
            userType="coordenador"
          />
        </>
      )}
    </div>
  );
}
