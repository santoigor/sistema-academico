"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, UserIcon, BookOpenIcon, MoreVerticalIcon, PlusIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TurmaForm } from "@/components/turma-form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Turma {
  id: string
  nome: string
  instrutor: string
  dataInicio: string
  dataFim: string
  totalAulas: number
  aulasRealizadas: number
  mediaNotas: number
  mediaPresenca: number
  alunosInscritos: number
  status: "ativa" | "concluida" | "em-breve"
}

interface TurmasListProps {
  turmas: Turma[]
  onViewDetails: (turmaId: string) => void
  onAddTurma: (data: any) => void
}

export function TurmasList({ turmas, onViewDetails, onAddTurma }: TurmasListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativa":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ativa</Badge>
      case "concluida":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Concluída</Badge>
      case "em-breve":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Em Breve</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const calcularProgresso = (turma: Turma) => {
    return Math.round((turma.aulasRealizadas / turma.totalAulas) * 100)
  }

  const handleSubmit = (data: any) => {
    onAddTurma(data)
    setIsModalOpen(false)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Turmas Cadastradas</CardTitle>
              <CardDescription>{turmas.length} turma(s) no sistema</CardDescription>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Nova Turma
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {turmas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <BookOpenIcon className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma turma cadastrada</h3>
              <p className="text-sm text-gray-500">Clique em "Nova Turma" para cadastrar sua primeira turma.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Turma</TableHead>
                  <TableHead>Instrutor</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Alunos</TableHead>
                  <TableHead>Presença</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {turmas.map((turma) => (
                  <TableRow key={turma.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{turma.nome}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <CalendarIcon className="h-3 w-3" />
                          <span>
                            {new Date(turma.dataInicio).toLocaleDateString("pt-BR")} -{" "}
                            {new Date(turma.dataFim).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{turma.instrutor}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${calcularProgresso(turma)}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{calcularProgresso(turma)}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {turma.aulasRealizadas}/{turma.totalAulas} aulas
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{turma.alunosInscritos || 0}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{turma.mediaPresenca.toFixed(0)}%</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVerticalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewDetails(turma.id)}>Ver Detalhes</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] max-h-[95vh] p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Cadastrar Nova Turma</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <TurmaForm onSubmit={handleSubmit} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
