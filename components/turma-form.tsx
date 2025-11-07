"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircleIcon, TrashIcon, BookOpenIcon, UserIcon, CalendarIcon, LinkIcon, ListIcon } from "lucide-react"

interface Aula {
  id: string
  tema: string
  dataPrevista: string
}

interface TurmaFormProps {
  onSubmit: (data: any) => void
}

export function TurmaForm({ onSubmit }: TurmaFormProps) {
  const [formData, setFormData] = useState({
    nome: "",
    instrutor: "",
    dataInicio: "",
    dataFim: "",
    linkFeedback: "",
  })

  const [aulas, setAulas] = useState<Aula[]>([{ id: "1", tema: "", dataPrevista: "" }])

  const [errors, setErrors] = useState({
    nome: "",
    instrutor: "",
    dataInicio: "",
    dataFim: "",
    linkFeedback: "",
  })

  const addAula = () => {
    setAulas([...aulas, { id: Date.now().toString(), tema: "", dataPrevista: "" }])
  }

  const removeAula = (id: string) => {
    if (aulas.length > 1) {
      setAulas(aulas.filter((aula) => aula.id !== id))
    }
  }

  const updateAula = (id: string, field: "tema" | "dataPrevista", value: string) => {
    setAulas(aulas.map((aula) => (aula.id === id ? { ...aula, [field]: value } : aula)))
  }

  const validateForm = () => {
    const newErrors = {
      nome: "",
      instrutor: "",
      dataInicio: "",
      dataFim: "",
      linkFeedback: "",
    }

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome da turma é obrigatório"
    }

    if (!formData.instrutor.trim()) {
      newErrors.instrutor = "Instrutor é obrigatório"
    }

    if (!formData.dataInicio) {
      newErrors.dataInicio = "Data de início é obrigatória"
    }

    if (!formData.dataFim) {
      newErrors.dataFim = "Data de fim é obrigatória"
    }

    if (formData.dataInicio && formData.dataFim && formData.dataInicio > formData.dataFim) {
      newErrors.dataFim = "Data de fim deve ser posterior à data de início"
    }

    if (!formData.linkFeedback.trim()) {
      newErrors.linkFeedback = "Link do formulário de feedback é obrigatório"
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== "")
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const aulasValidas = aulas.filter((aula) => aula.tema.trim() && aula.dataPrevista)

      if (aulasValidas.length === 0) {
        alert("Adicione pelo menos uma aula com tema e data")
        return
      }

      onSubmit({
        ...formData,
        aulas: aulasValidas,
      })

      // Reset form
      setFormData({
        nome: "",
        instrutor: "",
        dataInicio: "",
        dataFim: "",
        linkFeedback: "",
      })
      setAulas([{ id: "1", tema: "", dataPrevista: "" }])
    }
  }

  return (
    <div className="grid grid-cols-2 h-full">
      {/* Coluna 1: Informações da Turma */}
      <div className="border-r">
        <ScrollArea className="h-[calc(95vh-120px)]">
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <BookOpenIcon className="h-5 w-5" />
                <span>Informações da Turma</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="flex items-center gap-2">
                    <BookOpenIcon className="h-4 w-4" />
                    Nome da Turma *
                  </Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Turma A - React Avançado"
                    value={formData.nome}
                    onChange={(e) => {
                      setFormData({ ...formData, nome: e.target.value })
                      if (errors.nome) setErrors({ ...errors, nome: "" })
                    }}
                    className={errors.nome ? "border-red-500" : ""}
                  />
                  {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instrutor" className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    Instrutor Responsável *
                  </Label>
                  <Input
                    id="instrutor"
                    placeholder="Nome do instrutor"
                    value={formData.instrutor}
                    onChange={(e) => {
                      setFormData({ ...formData, instrutor: e.target.value })
                      if (errors.instrutor) setErrors({ ...errors, instrutor: "" })
                    }}
                    className={errors.instrutor ? "border-red-500" : ""}
                  />
                  {errors.instrutor && <p className="text-sm text-red-500">{errors.instrutor}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataInicio" className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Data de Início *
                    </Label>
                    <Input
                      id="dataInicio"
                      type="date"
                      value={formData.dataInicio}
                      onChange={(e) => {
                        setFormData({ ...formData, dataInicio: e.target.value })
                        if (errors.dataInicio) setErrors({ ...errors, dataInicio: "" })
                      }}
                      className={errors.dataInicio ? "border-red-500" : ""}
                    />
                    {errors.dataInicio && <p className="text-sm text-red-500">{errors.dataInicio}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataFim" className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Data de Fim *
                    </Label>
                    <Input
                      id="dataFim"
                      type="date"
                      value={formData.dataFim}
                      onChange={(e) => {
                        setFormData({ ...formData, dataFim: e.target.value })
                        if (errors.dataFim) setErrors({ ...errors, dataFim: "" })
                      }}
                      className={errors.dataFim ? "border-red-500" : ""}
                    />
                    {errors.dataFim && <p className="text-sm text-red-500">{errors.dataFim}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkFeedback" className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Link do Formulário de Feedback (Google Forms) *
                  </Label>
                  <Input
                    id="linkFeedback"
                    type="url"
                    placeholder="https://forms.google.com/..."
                    value={formData.linkFeedback}
                    onChange={(e) => {
                      setFormData({ ...formData, linkFeedback: e.target.value })
                      if (errors.linkFeedback) setErrors({ ...errors, linkFeedback: "" })
                    }}
                    className={errors.linkFeedback ? "border-red-500" : ""}
                  />
                  {errors.linkFeedback && <p className="text-sm text-red-500">{errors.linkFeedback}</p>}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Coluna 2: Cadastro de Ementa */}
      <div className="flex flex-col">
        <ScrollArea className="h-[calc(95vh-120px)]">
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <ListIcon className="h-5 w-5" />
                  <span>Ementa do Curso</span>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addAula}>
                  <PlusCircleIcon className="h-4 w-4 mr-2" />
                  Adicionar Aula
                </Button>
              </div>

              <div className="space-y-3">
                {aulas.map((aula, index) => (
                  <div key={aula.id} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Aula {index + 1}</span>
                      {aulas.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAula(aula.id)}
                          className="h-8 w-8 p-0"
                        >
                          <TrashIcon className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor={`tema-${aula.id}`} className="flex items-center gap-2">
                          <BookOpenIcon className="h-4 w-4" />
                          Tema da Aula
                        </Label>
                        <Input
                          id={`tema-${aula.id}`}
                          placeholder="Ex: Introdução ao React Hooks"
                          value={aula.tema}
                          onChange={(e) => updateAula(aula.id, "tema", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`data-${aula.id}`} className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          Data Prevista
                        </Label>
                        <Input
                          id={`data-${aula.id}`}
                          type="date"
                          value={aula.dataPrevista}
                          onChange={(e) => updateAula(aula.id, "dataPrevista", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Botões de ação fixos no rodapé */}
        <div className="border-t p-6">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => {
                setFormData({
                  nome: "",
                  instrutor: "",
                  dataInicio: "",
                  dataFim: "",
                  linkFeedback: "",
                })
                setAulas([{ id: "1", tema: "", dataPrevista: "" }])
                setErrors({
                  nome: "",
                  instrutor: "",
                  dataInicio: "",
                  dataFim: "",
                  linkFeedback: "",
                })
              }}
            >
              Limpar
            </Button>
            <Button type="button" className="flex-1" onClick={handleSubmit}>
              Cadastrar Turma
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
