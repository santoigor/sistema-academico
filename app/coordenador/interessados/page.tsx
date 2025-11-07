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
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  Trash2,
  UserPlus,
  TrendingUp,
} from 'lucide-react';
import type { Interessado } from '@/lib/types';

export default function InteressadosPage() {
  const { interessados, deleteInteressado, cursos } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [cursoFilter, setCursoFilter] = useState<string>('all');
  const [interessadoToDelete, setInteressadoToDelete] = useState<Interessado | null>(null);

  // Filter interessados
  const filteredInteressados = interessados.filter((interessado) => {
    const matchesSearch =
      interessado.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interessado.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interessado.telefone.includes(searchTerm);
    const matchesCurso = cursoFilter === 'all' || interessado.cursoInteresse === cursoFilter;
    return matchesSearch && matchesCurso;
  });

  // Sort by date (most recent first)
  const sortedInteressados = [...filteredInteressados].sort(
    (a, b) => new Date(b.dataContato).getTime() - new Date(a.dataContato).getTime()
  );

  const handleDelete = () => {
    if (interessadoToDelete) {
      deleteInteressado(interessadoToDelete.id);
      setInteressadoToDelete(null);
    }
  };

  // Calculate statistics
  const interessadosThisMonth = interessados.filter((i) => {
    const contactDate = new Date(i.dataContato);
    const now = new Date();
    return (
      contactDate.getMonth() === now.getMonth() &&
      contactDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const interessadosByCurso = cursos.map((curso) => ({
    curso: curso.nome,
    count: interessados.filter((i) => i.cursoInteresse === curso.nome).length,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Interessados</h1>
        <p className="text-muted-foreground mt-1">
          Visualize e gerencie os leads que demonstraram interesse nos cursos
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
          <CardDescription>Busque e filtre interessados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Curso Filter */}
            <Select value={cursoFilter} onValueChange={setCursoFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Curso de Interesse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os cursos</SelectItem>
                {cursos.map((curso) => (
                  <SelectItem key={curso.id} value={curso.nome}>
                    {curso.nome}
                  </SelectItem>
                ))}
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
                <p className="text-sm text-muted-foreground">Total de Interessados</p>
                <p className="text-2xl font-semibold">{filteredInteressados.length}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Novos este Mês</p>
                <p className="text-2xl font-semibold text-accent">{interessadosThisMonth}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-accent opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Curso Mais Popular</p>
                <p className="text-sm font-medium">
                  {interessadosByCurso.sort((a, b) => b.count - a.count)[0]?.curso || 'N/A'}
                </p>
              </div>
              <UserPlus className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interessados List */}
      <div className="space-y-4">
        {sortedInteressados.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Users className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum interessado encontrado</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || cursoFilter !== 'all'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Nenhum interessado cadastrado no momento'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          sortedInteressados.map((interessado) => (
            <Card key={interessado.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-semibold text-accent">
                          {interessado.nome.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{interessado.nome}</h3>
                          <Badge variant="outlinePrimary">{interessado.cursoInteresse}</Badge>
                        </div>
                        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <a href={`mailto:${interessado.email}`} className="hover:text-primary">
                              {interessado.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${interessado.telefone}`} className="hover:text-primary">
                              {interessado.telefone}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Data de Contato</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{interessado.dataContato}</p>
                        </div>
                      </div>
                      {interessado.mensagem && (
                        <div className="md:col-span-2">
                          <p className="text-muted-foreground">Mensagem</p>
                          <p className="font-medium text-sm mt-1 p-3 bg-muted/50 rounded-md">
                            {interessado.mensagem}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="default" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Enviar Email
                      </Button>
                      <Button variant="outlinePrimary" size="sm">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Cadastrar como Aluno
                      </Button>
                    </div>
                  </div>

                  {/* Delete Action */}
                  <div className="ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setInteressadoToDelete(interessado)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!interessadoToDelete} onOpenChange={() => setInteressadoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o interessado <strong>{interessadoToDelete?.nome}</strong>?
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
    </div>
  );
}
