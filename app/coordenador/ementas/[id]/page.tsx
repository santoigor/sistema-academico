'use client';

import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/lib/data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
  ArrowLeft,
  Edit,
  Copy,
  Trash2,
  Clock,
  Target,
  CheckCircle2,
  FileText,
  Award,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function EmentaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getEmenta, deleteEmenta } = useData();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const ementaId = params.id as string;
  const ementa = getEmenta(ementaId);

  if (!ementa) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/coordenador/ementas">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-lg font-medium mb-2">Ementa não encontrada</h3>
              <p className="text-sm text-muted-foreground mb-4">
                A ementa solicitada não existe ou foi removida
              </p>
              <Link href="/coordenador/ementas">
                <Button variant="outlinePrimary">Ver todas as ementas</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDelete = () => {
    deleteEmenta(ementaId);
    router.push('/coordenador/ementas');
  };

  const handleDuplicate = () => {
    // TODO: Implementar funcionalidade de duplicar ementa
    alert('Funcionalidade de duplicar ementa em desenvolvimento');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/coordenador/ementas">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">{ementa.titulo}</h1>
            <p className="text-muted-foreground mt-1">{ementa.curso}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/coordenador/ementas/${ementaId}/editar`}>
            <Button variant="outlinePrimary">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
          <Button variant="outline" onClick={handleDuplicate}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicar
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      {/* Informações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Informações Gerais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Descrição */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Descrição</h3>
            <p className="text-sm">{ementa.descricao}</p>
          </div>

          <Separator />

          {/* Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Carga Horária</p>
                <p className="text-lg font-semibold">{ementa.cargaHorariaTotal}h</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aulas</p>
                <p className="text-lg font-semibold">{ementa.aulas.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avaliações</p>
                <p className="text-lg font-semibold">{ementa.avaliacoes?.length || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Objetivos</p>
                <p className="text-lg font-semibold">{ementa.objetivosGerais.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accordion com seções expansíveis */}
      <Accordion type="multiple" defaultValue={['objetivos', 'aulas', 'avaliacoes']} className="space-y-4">
        {/* Objetivos Gerais */}
        <AccordionItem value="objetivos" className="border rounded-lg bg-card">
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">Objetivos Gerais</span>
              <Badge variant="outline">{ementa.objetivosGerais.length} objetivos</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <ul className="space-y-2 mt-4">
              {ementa.objetivosGerais.map((objetivo, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{objetivo}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* Aulas */}
        <AccordionItem value="aulas" className="border rounded-lg bg-card">
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" />
              <span className="font-semibold">Aulas</span>
              <Badge variant="outline">{ementa.aulas.length} aulas</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground w-16">#</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Tema</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground w-32">Tipo</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground w-24">CH</th>
                  </tr>
                </thead>
                <tbody>
                  {ementa.aulas.map((aula) => (
                    <tr key={aula.numero} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-2 font-medium">{aula.numero}</td>
                      <td className="py-3 px-2">{aula.tema}</td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className="capitalize">
                          {aula.tipo}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-right">{aula.cargaHoraria}h</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 font-semibold">
                    <td colSpan={3} className="py-3 px-2 text-right">Total:</td>
                    <td className="py-3 px-2 text-right">{ementa.cargaHorariaTotal}h</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Avaliações */}
        {ementa.avaliacoes && ementa.avaliacoes.length > 0 && (
          <AccordionItem value="avaliacoes" className="border rounded-lg bg-card">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-600" />
                <span className="font-semibold">Avaliações</span>
                <Badge variant="outline">{ementa.avaliacoes.length} avaliações</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Título</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground w-32">Tipo</th>
                      <th className="text-right py-3 px-2 font-medium text-muted-foreground w-24">Peso</th>
                      <th className="text-right py-3 px-2 font-medium text-muted-foreground w-32">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ementa.avaliacoes.map((avaliacao, index) => (
                      <tr key={index} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 px-2">{avaliacao.titulo}</td>
                        <td className="py-3 px-2">
                          <Badge variant="outline" className="capitalize">
                            {avaliacao.tipo}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-right">{avaliacao.peso}%</td>
                        <td className="py-3 px-2 text-right">
                          {avaliacao.dataRealizacao ? new Date(avaliacao.dataRealizacao).toLocaleDateString('pt-BR') : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 font-semibold">
                      <td colSpan={2} className="py-3 px-2 text-right">Total:</td>
                      <td className="py-3 px-2 text-right">
                        {ementa.avaliacoes.reduce((sum, av) => sum + av.peso, 0)}%
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a ementa <strong>{ementa.titulo}</strong>?
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
