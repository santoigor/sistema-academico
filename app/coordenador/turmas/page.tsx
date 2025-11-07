'use client';

import { useState } from 'react';
import { useData } from '@/lib/data-context';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  GraduationCap,
  Plus,
  Search,
  Calendar,
  Users,
  Edit,
  Trash2,
  Eye,
  XCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import type { Turma, StatusTurma } from '@/lib/types';

const ITEMS_PER_PAGE = 10;

export default function TurmasPage() {
  const { turmas, deleteTurma, updateTurma } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusTurma | 'all'>('all');
  const [turmaToDelete, setTurmaToDelete] = useState<Turma | null>(null);
  const [turmaToFinalize, setTurmaToFinalize] = useState<Turma | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter turmas
  const filteredTurmas = turmas.filter((turma) => {
    const matchesSearch =
      turma.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      turma.ementa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      turma.instrutor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || turma.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTurmas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTurmas = filteredTurmas.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: StatusTurma | 'all') => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // Status colors
  const statusColors = {
    planejada: 'default',
    em_andamento: 'accent',
    finalizada: 'success',
    cancelada: 'destructive',
  } as const;

  const statusLabels = {
    planejada: 'Planejada',
    em_andamento: 'Em Andamento',
    finalizada: 'Finalizada',
    cancelada: 'Cancelada',
  };

  const handleDelete = () => {
    if (turmaToDelete) {
      deleteTurma(turmaToDelete.id);
      setTurmaToDelete(null);
    }
  };

  const handleFinalize = () => {
    if (turmaToFinalize) {
      updateTurma(turmaToFinalize.id, { status: 'finalizada' });
      setTurmaToFinalize(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Gestão de Turmas</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todas as turmas cadastradas no sistema
          </p>
        </div>
        <Link href="/coordenador/turmas/nova">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Turma
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
          <CardDescription>Busque e filtre turmas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código, ementa ou instrutor..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(value) => handleStatusFilterChange(value as StatusTurma | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="planejada">Planejada</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="finalizada">Finalizada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-semibold">{filteredTurmas.length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Em Andamento</p>
                <p className="text-2xl font-semibold text-accent">
                  {filteredTurmas.filter((t) => t.status === 'em_andamento').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-accent opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Planejadas</p>
                <p className="text-2xl font-semibold text-primary">
                  {filteredTurmas.filter((t) => t.status === 'planejada').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Turmas List */}
      <div className="space-y-4">
        {filteredTurmas.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma turma encontrada</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece cadastrando sua primeira turma'}
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Link href="/coordenador/turmas/nova">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Cadastrar Primeira Turma
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
          {paginatedTurmas.map((turma) => (
            <Card key={turma.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header with Title, Status and Actions */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{turma.codigo}</h3>
                          <Badge variant={statusColors[turma.status]}>
                            {statusLabels[turma.status]}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{turma.ementa}</p>
                      </div>
                    </div>

                    {/* Actions - Horizontal */}
                    <div className="flex items-center gap-1">
                      <Link href={`/coordenador/turmas/${turma.id}`}>
                        <Button variant="ghost" size="icon" title="Detalhes">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      {turma.status !== 'finalizada' && turma.status !== 'cancelada' && (
                        <>
                          <Link href={`/coordenador/turmas/${turma.id}/editar`}>
                            <Button variant="ghost" size="icon" title="Editar">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          {turma.status === 'em_andamento' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setTurmaToFinalize(turma)}
                              className="text-green-600 hover:text-green-600 hover:bg-green-50"
                              title="Finalizar"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTurmaToDelete(turma)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>
                        {turma.vagasOcupadas}/{turma.vagasTotal} alunos
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {turma.dataInicio} a {turma.dataFim}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                      <span>{turma.instrutor}</span>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Horário: {turma.horario}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredTurmas.length)} de {filteredTurmas.length} turmas
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
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!turmaToDelete} onOpenChange={() => setTurmaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a turma <strong>{turmaToDelete?.codigo}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Finalize Confirmation Dialog */}
      <AlertDialog open={!!turmaToFinalize} onOpenChange={() => setTurmaToFinalize(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finalizar Turma</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja finalizar a turma <strong>{turmaToFinalize?.codigo}</strong>?
              Após finalizada, a turma não poderá mais ser editada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinalize} className="bg-green-600 hover:bg-green-700">
              Finalizar Turma
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
