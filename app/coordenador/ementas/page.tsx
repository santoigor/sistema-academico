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
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import type { Ementa } from '@/lib/types';

const ITEMS_PER_PAGE = 10;

export default function EmentasPage() {
  const { ementas, deleteEmenta, cursos } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [cursoFilter, setCursoFilter] = useState<string>('all');
  const [ementaToDelete, setEmentaToDelete] = useState<Ementa | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter ementas
  const filteredEmentas = ementas.filter((ementa) => {
    const matchesSearch =
      ementa.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ementa.curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ementa.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCurso = cursoFilter === 'all' || ementa.cursoId === cursoFilter;
    return matchesSearch && matchesCurso && ementa.ativo;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEmentas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedEmentas = filteredEmentas.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCursoFilterChange = (value: string) => {
    setCursoFilter(value);
    setCurrentPage(1);
  };

  const handleDelete = () => {
    if (ementaToDelete) {
      deleteEmenta(ementaToDelete.id);
      setEmentaToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Gestão de Ementas</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os currículos e conteúdos programáticos dos cursos
          </p>
        </div>
        <Link href="/coordenador/ementas/nova">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Ementa
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
          <CardDescription>Busque e filtre ementas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, curso ou descrição..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Curso Filter */}
            <Select value={cursoFilter} onValueChange={handleCursoFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Curso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os cursos</SelectItem>
                {cursos.map((curso) => (
                  <SelectItem key={curso.id} value={curso.id}>
                    {curso.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Ementas List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredEmentas.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma ementa encontrada</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm || cursoFilter !== 'all'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece cadastrando sua primeira ementa'}
                </p>
                {!searchTerm && cursoFilter === 'all' && (
                  <Link href="/coordenador/ementas/nova">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Cadastrar Primeira Ementa
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
          {paginatedEmentas.map((ementa) => (
            <Card key={ementa.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{ementa.titulo}</h3>
                          <Badge variant="outlinePrimary">{ementa.curso}</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {ementa.descricao}
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Carga Horária</p>
                        <p className="font-medium">{ementa.cargaHorariaTotal}h</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Aulas</p>
                        <p className="font-medium">{ementa.aulas.length} aulas</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avaliações</p>
                        <p className="font-medium">
                          {ementa.avaliacoes?.length || 0} avaliações
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Objetivos</p>
                        <p className="font-medium">{ementa.objetivosGerais.length} objetivos</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    <Link href={`/coordenador/ementas/${ementa.id}`}>
                      <Button variant="ghost" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                    </Link>
                    <Link href={`/coordenador/ementas/${ementa.id}/editar`}>
                      <Button variant="ghost" size="sm" className="w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEmentaToDelete(ementa)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredEmentas.length)} de {filteredEmentas.length} ementas
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
      <AlertDialog open={!!ementaToDelete} onOpenChange={() => setEmentaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a ementa <strong>{ementaToDelete?.titulo}</strong>?
              Esta ação não pode ser desfeita e pode afetar turmas que utilizam esta ementa.
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
    </div>
  );
}
