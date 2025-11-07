"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, UserIcon, ArrowLeftIcon, LinkIcon, XCircleIcon, CheckCircleIcon, ClockIcon } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Aula {
  id: string
  numero: number
  tema: string
  dataPrevista: string
  status: "realizada" | "cancelada" | "pendente"
  justificativaCancelamento?: string
}

interface TurmaDetailProps {
  turma: {
    id: string
    nome: string
    instrutor: string
    dataInicio: string
    dataFim: string
    linkFeedback: string
    aulas: Aula[]
    mediaNotas: number
    mediaPresenca: number
    status: string
  }
  onBack: () => void
  onCancelarAula: (aulaId: string, justificativa: string) => void
}

export function TurmaDetail({ turma, onBack, onCancelarAula }: TurmaDetailProps) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [selectedAulaId, setSelectedAulaId] = useState<string | null>(null)
  const [justificativa, setJustificativa] = useState("")
  const [justificativaError, setJustificativaError] = useState("")

  const calcularProgresso = () => {
    const aulasRealizadas = turma.aulas.filter((aula) => aula.status === "realizada").length
    return Math.round((aulasRealizadas / turma.aulas.length) * 100)
  }

  const handleCancelarAula = (aulaId: string) => {
    setSelectedAulaId(aulaId)
    setIsCancelModalOpen(true)
    setJustificativa("")
    setJustificativaError("")
  }

  const confirmarCancelamento = () => {
    if (!justificativa.trim()) {
      setJustificativaError("Justificativa é obrigatória")
      return
    }

    if (selectedAulaId) {
      onCancelarAula(selectedAulaId, justificativa)
      setIsCancelModalOpen(false)
      setSelectedAulaId(null)
      setJustificativa("")
    }
  }

  const getStatusAulaBadge = (status: string) => {
    switch (status) {
      case "realizada":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Realizada
          </Badge>
        )
      case "cancelada":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircleIcon className="h-3 w-3 mr-1" />
            Cancelada
          </Badge>
        )
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <ClockIcon className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header com botão voltar */}
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeftIcon className="h-4 w-4" />
        Voltar para lista de turmas
      </Button>

      {/* Informações da Turma */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{turma.nome}</CardTitle>
              <CardDescription className="mt-2">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <UserIcon className="h-4 w-4" />
                    <span>{turma.instrutor}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                      {new Date(turma.dataInicio).toLocaleDateString("pt-BR")} -{" "}
                      {new Date(turma.dataFim).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              </CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">{turma.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Progresso das Aulas</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">{calcularProgresso()}%</span>
                  <span className="text-sm text-muted-foreground">
                    {turma.aulas.filter((a) => a.status === "realizada").length}/{turma.aulas.length} aulas
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${calcularProgresso()}%` }} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Média de Notas</p>
              <p className="text-2xl font-bold">{turma.mediaNotas.toFixed(1)}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Média de Presença</p>
              <p className="text-2xl font-bold">{turma.mediaPresenca.toFixed(0)}%</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Formulário de Feedback</p>
              <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                <a href={turma.linkFeedback} target="_blank" rel="noopener noreferrer">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Abrir Formulário
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ementa - Lista de Aulas */}
      <Card>
        <CardHeader>
          <CardTitle>Ementa do Curso</CardTitle>
          <CardDescription>Lista completa de aulas com temas e datas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {turma.aulas.map((aula) => (
              <div key={aula.id} className="flex items-center justify-between p-4 rounded-lg border bg-white">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-primary">Aula {aula.numero}</span>
                    {getStatusAulaBadge(aula.status)}
                  </div>
                  <p className="font-medium">{aula.tema}</p>
                  <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                    <CalendarIcon className="h-3 w-3" />
                    <span>Data prevista: {new Date(aula.dataPrevista).toLocaleDateString("pt-BR")}</span>
                  </div>
                  {aula.status === "cancelada" && aula.justificativaCancelamento && (
                    <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                      <p className="text-xs text-red-800">
                        <strong>Justificativa:</strong> {aula.justificativaCancelamento}
                      </p>
                    </div>
                  )}
                </div>
                {aula.status === "pendente" && (
                  <Button variant="outline" size="sm" onClick={() => handleCancelarAula(aula.id)} className="ml-4">
                    <XCircleIcon className="h-4 w-4 mr-2" />
                    Cancelar Aula
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Cancelamento */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Aula</DialogTitle>
            <DialogDescription>
              Informe a justificativa para o cancelamento desta aula. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="justificativa">Justificativa *</Label>
              <Textarea
                id="justificativa"
                placeholder="Descreva o motivo do cancelamento..."
                value={justificativa}
                onChange={(e) => {
                  setJustificativa(e.target.value)
                  if (justificativaError) setJustificativaError("")
                }}
                className={justificativaError ? "border-red-500" : ""}
                rows={4}
              />
              {justificativaError && <p className="text-sm text-red-500">{justificativaError}</p>}
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsCancelModalOpen(false)}>
              Voltar
            </Button>
            <Button variant="destructive" className="flex-1" onClick={confirmarCancelamento}>
              Confirmar Cancelamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
