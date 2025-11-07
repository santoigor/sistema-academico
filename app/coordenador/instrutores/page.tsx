'use client';

import { useState } from 'react';
import { useData } from '@/lib/data-context';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  UserPlus,
  Plus,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Users,
  GraduationCap,
} from 'lucide-react';
import type { StatusUsuario } from '@/lib/types';

const ITEMS_PER_PAGE = 10;

export default function InstrutoresPage() {
  const { instrutores, turmas } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusUsuario | 'all'>('all');
  const [especialidadeFilter, setEspecialidadeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique especialidades for filter
  const especialidades = Array.from(
    new Set(instrutores.flatMap((i) => i.especialidades))
  ).sort();

  // Filter instrutores
  const filteredInstrutores = instrutores.filter((instrutor) => {
    const matchesSearch =
      instrutor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instrutor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (instrutor.telefone && instrutor.telefone.includes(searchTerm));

    const matchesStatus = statusFilter === 'all' || instrutor.status === statusFilter;

    const matchesEspecialidade =
      especialidadeFilter === 'all' ||
      instrutor.especialidades.includes(especialidadeFilter);

    return matchesSearch && matchesStatus && matchesEspecialidade;
  });

  // Pagination
  const totalPages = Math.ceil(filteredInstrutores.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedInstrutores = filteredInstrutores.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: StatusUsuario | 'all') => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleEspecialidadeFilterChange = (value: string) => {
    setEspecialidadeFilter(value);
    setCurrentPage(1);
  };

  // Status colors and labels
  const statusColors = {
    ativo: 'success',
    inativo: 'default',
    bloqueado: 'destructive',
  } as const;

  const statusLabels = {
    ativo: 'Ativo',
    inativo: 'Inativo',
    bloqueado: 'Bloqueado',
  };

  // Get number of turmas for an instrutor
  const getTurmasCount = (instrutorId: string) => {
    return turmas.filter((t) => t.instrutorId === instrutorId).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Instrutores</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os instrutores cadastrados
          </p>
        </div>
        <Link href="/coordenador/interessados/voluntarios/novo?cadastrarComoInstrutor=true">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Instrutor
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
          <CardDescription>Busque e filtre instrutores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(value) => handleStatusFilterChange(value as StatusUsuario | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="bloqueado">Bloqueado</SelectItem>
              </SelectContent>
            </Select>

            {/* Especialidade Filter */}
            <Select value={especialidadeFilter} onValueChange={handleEspecialidadeFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Especialidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as especialidades</SelectItem>
                {especialidades.map((esp) => (
                  <SelectItem key={esp} value={esp}>
                    {esp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-semibold">{filteredInstrutores.length}</p>
              </div>
              <UserPlus className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ativos</p>
                <p className="text-2xl font-semibold text-green-600">
                  {filteredInstrutores.filter((i) => i.status === 'ativo').length}
                </p>
              </div>
              <UserPlus className="h-8 w-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Com Turmas</p>
                <p className="text-2xl font-semibold text-primary">
                  {filteredInstrutores.filter((i) => i.turmasAlocadas.length > 0).length}
                </p>
              </div>
              <GraduationCap className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Especialidades</p>
                <p className="text-2xl font-semibold text-accent">
                  {especialidades.length}
                </p>
              </div>
              <Users className="h-8 w-8 text-accent opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {filteredInstrutores.length === 0 ? (
            <div className="py-12 text-center">
              <UserPlus className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum instrutor encontrado</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' || especialidadeFilter !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece cadastrando o primeiro instrutor'}
              </p>
              {!searchTerm && statusFilter === 'all' && especialidadeFilter === 'all' && (
                <Link href="/coordenador/interessados/voluntarios/novo?cadastrarComoInstrutor=true">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar Primeiro Instrutor
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Turmas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedInstrutores.map((instrutor) => (
                    <TableRow key={instrutor.id}>
                      <TableCell className="font-medium">{instrutor.nome}</TableCell>
                      <TableCell>{instrutor.email}</TableCell>
                      <TableCell>
                        <span className="font-medium">{getTurmasCount(instrutor.id)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusColors[instrutor.status]}>
                          {statusLabels[instrutor.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/coordenador/instrutores/${instrutor.id}`}>
                          <Button variant="ghost" size="icon" title="Ver Detalhes">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {startIndex + 1} a {Math.min(endIndex, filteredInstrutores.length)} de {filteredInstrutores.length} instrutores
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Anterior
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="min-w-[2.5rem]"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Próxima
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
