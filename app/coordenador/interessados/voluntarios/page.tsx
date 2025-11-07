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
  Heart,
  Plus,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { Interessado, StatusInteressado } from '@/lib/types';

const ITEMS_PER_PAGE = 10;

export default function VoluntariosPage() {
  const { interessados } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusInteressado | 'all'>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter only volunteers
  const voluntarios = interessados.filter((i) => i.tipo === 'voluntario');

  // Apply filters
  const filteredVoluntarios = voluntarios.filter((voluntario) => {
    const matchesSearch =
      voluntario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voluntario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voluntario.telefone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || voluntario.status === statusFilter;
    const matchesArea = areaFilter === 'all' || voluntario.cursoInteresse === areaFilter;
    return matchesSearch && matchesStatus && matchesArea;
  });

  // Pagination
  const totalPages = Math.ceil(filteredVoluntarios.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedVoluntarios = filteredVoluntarios.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: StatusInteressado | 'all') => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleAreaFilterChange = (value: string) => {
    setAreaFilter(value);
    setCurrentPage(1);
  };

  // Status colors
  const statusColors = {
    novo: 'default',
    contatado: 'accent',
    matriculado: 'success',
    desistente: 'destructive',
  } as const;

  const statusLabels = {
    novo: 'Novo',
    contatado: 'Contatado',
    matriculado: 'Ativo',
    desistente: 'Inativo',
  };

  // Get unique areas for filter
  const areas = Array.from(new Set(voluntarios.map((v) => v.cursoInteresse)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Voluntários</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os voluntários interessados
          </p>
        </div>
        <Link href="/coordenador/interessados/voluntarios/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar Voluntário
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
          <CardDescription>Busque e filtre voluntários</CardDescription>
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
            <Select value={statusFilter} onValueChange={(value) => handleStatusFilterChange(value as StatusInteressado | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="novo">Novo</SelectItem>
                <SelectItem value="contatado">Contatado</SelectItem>
                <SelectItem value="matriculado">Ativo</SelectItem>
                <SelectItem value="desistente">Inativo</SelectItem>
              </SelectContent>
            </Select>

            {/* Area Filter */}
            <Select value={areaFilter} onValueChange={handleAreaFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Área de Interesse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as áreas</SelectItem>
                {areas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
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
                <p className="text-2xl font-semibold">{filteredVoluntarios.length}</p>
              </div>
              <Heart className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Novos</p>
                <p className="text-2xl font-semibold text-primary">
                  {filteredVoluntarios.filter((v) => v.status === 'novo').length}
                </p>
              </div>
              <Heart className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Contatados</p>
                <p className="text-2xl font-semibold text-accent">
                  {filteredVoluntarios.filter((v) => v.status === 'contatado').length}
                </p>
              </div>
              <Heart className="h-8 w-8 text-accent opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ativos</p>
                <p className="text-2xl font-semibold text-green-600">
                  {filteredVoluntarios.filter((v) => v.status === 'matriculado').length}
                </p>
              </div>
              <Heart className="h-8 w-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {filteredVoluntarios.length === 0 ? (
            <div className="py-12 text-center">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum voluntário encontrado</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' || areaFilter !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece cadastrando o primeiro voluntário'}
              </p>
              {!searchTerm && statusFilter === 'all' && areaFilter === 'all' && (
                <Link href="/coordenador/interessados/voluntarios/novo">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar Primeiro Voluntário
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
                    <TableHead>Telefone</TableHead>
                    <TableHead>Área de Interesse</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedVoluntarios.map((voluntario) => (
                    <TableRow key={voluntario.id}>
                      <TableCell className="font-medium">{voluntario.nome}</TableCell>
                      <TableCell>{voluntario.email}</TableCell>
                      <TableCell>{voluntario.telefone}</TableCell>
                      <TableCell>{voluntario.cursoInteresse}</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[voluntario.status]}>
                          {statusLabels[voluntario.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/coordenador/interessados/voluntarios/${voluntario.id}`}>
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
                    Mostrando {startIndex + 1} a {Math.min(endIndex, filteredVoluntarios.length)} de {filteredVoluntarios.length} voluntários
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
