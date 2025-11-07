"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Copy, Check } from "lucide-react"

// Schema base
const baseSchema = z.object({
  pais: z.string().min(1, "País é obrigatório"),
  apelido: z.string().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  zipcode: z.string().min(1, "CEP é obrigatório"),
  state: z.string().min(1, "Estado é obrigatório"),
  address: z.string().min(1, "Endereço é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  country: z.string().min(1, "País é obrigatório"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().min(1, "Telefone é obrigatório"),
  motivo_id: z.string().min(1, "Motivo é obrigatório"),
  motivo_text: z.string().min(1, "Descrição do motivo é obrigatória"),
})

// Schema para Brasil
const brasilSchema = baseSchema
  .extend({
    number: z.string().min(1, "Número é obrigatório"),
    payment_method: z.enum(["pix", "bank"], {
      required_error: "Método de pagamento é obrigatório",
    }),
    // Campos PIX (condicionais)
    pix_key: z.string().optional(),
    pix_key_type: z.enum(["cpf", "cnpj", "email", "phone", "random"]).optional(),
    cpf_cnpj: z.string().optional(),
    // Campos Banco (condicionais)
    account: z.string().optional(),
    bank_name: z.string().optional(),
    bank_branch: z.string().optional(),
    bank_country: z.string().optional(),
    bank_zipcode: z.string().optional(),
    bank_state: z.string().optional(),
    bank_city: z.string().optional(),
    bank_street: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.payment_method === "pix") {
        return data.pix_key && data.pix_key_type && data.cpf_cnpj
      }
      if (data.payment_method === "bank") {
        return (
          data.account &&
          data.bank_name &&
          data.bank_branch &&
          data.bank_country &&
          data.bank_zipcode &&
          data.bank_state &&
          data.bank_city &&
          data.bank_street
        )
      }
      return true
    },
    {
      message: "Preencha todos os campos obrigatórios do método de pagamento selecionado",
      path: ["payment_method"],
    },
  )

// Schema para Estados Unidos
const usaSchema = baseSchema.extend({
  payment_method: z.enum(["wire", "ach"], {
    required_error: "Método de pagamento é obrigatório",
  }),
  account: z.string().min(1, "Conta é obrigatória"),
  bank_name: z.string().min(1, "Nome do banco é obrigatório"),
  bank_branch: z.string().min(1, "Agência é obrigatória"),
  bank_country: z.string().min(1, "País do banco é obrigatório"),
  bank_zipcode: z.string().min(1, "CEP do banco é obrigatório"),
  bank_state: z.string().min(1, "Estado do banco é obrigatório"),
  bank_city: z.string().min(1, "Cidade do banco é obrigatória"),
  bank_street: z.string().min(1, "Endereço do banco é obrigatório"),
})

type FormData = z.infer<typeof brasilSchema> | z.infer<typeof usaSchema>

interface PaymentFormProps {
  onSubmit: (data: FormData) => void
}

const motivos = [
  { id: "1", label: "Transferência pessoal" },
  { id: "2", label: "Pagamento de serviços" },
  { id: "3", label: "Investimento" },
  { id: "4", label: "Outros" },
]

export function PaymentForm({ onSubmit }: PaymentFormProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [copiedField, setCopiedField] = useState<string>("")

  const getSchema = () => {
    if (selectedCountry === "Brasil") return brasilSchema
    if (selectedCountry === "Estados Unidos") return usaSchema
    return baseSchema
  }

  const form = useForm<FormData>({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      pais: "",
      apelido: "",
      name: "",
      zipcode: "",
      state: "",
      address: "",
      city: "",
      country: "",
      email: "",
      phone: "",
      motivo_id: "",
      motivo_text: "",
    },
  })

  const handleSubmit = (data: FormData) => {
    onSubmit(data)
    form.reset()
    setSelectedCountry("")
    setPaymentMethod("")
  }

  const bankInfo = {
    memo: "X0DLV5U8FB",
    name: null,
    bank_details: {
      account_number: "111222333",
      routing_number: "021000021",
      routing_number_type: "ABA",
    },
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(""), 2000)
    } catch (err) {
      console.error("Falha ao copiar: ", err)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Formulário de Pagamento</CardTitle>
        <CardDescription>Preencha os dados para processar o pagamento</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pais">País *</Label>
              <Select
                value={selectedCountry}
                onValueChange={(value) => {
                  setSelectedCountry(value)
                  form.setValue("pais", value)
                  form.setValue("country", value)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o país" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Brasil">Brasil</SelectItem>
                  <SelectItem value="Estados Unidos">Estados Unidos</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.pais && (
                <p className="text-sm text-red-500">{form.formState.errors.pais.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="apelido">Apelido</Label>
              <Input id="apelido" {...form.register("apelido")} placeholder="Apelido (opcional)" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input id="name" {...form.register("name")} placeholder="Nome completo" />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input id="phone" {...form.register("phone")} placeholder="Telefone" />
              {form.formState.errors.phone && (
                <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} placeholder="Email (opcional)" />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipcode">CEP *</Label>
                <Input id="zipcode" {...form.register("zipcode")} placeholder="CEP" />
                {form.formState.errors.zipcode && (
                  <p className="text-sm text-red-500">{form.formState.errors.zipcode.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado *</Label>
                <Input id="state" {...form.register("state")} placeholder="Estado" />
                {form.formState.errors.state && (
                  <p className="text-sm text-red-500">{form.formState.errors.state.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Cidade *</Label>
                <Input id="city" {...form.register("city")} placeholder="Cidade" />
                {form.formState.errors.city && (
                  <p className="text-sm text-red-500">{form.formState.errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço *</Label>
                <Input id="address" {...form.register("address")} placeholder="Endereço" />
                {form.formState.errors.address && (
                  <p className="text-sm text-red-500">{form.formState.errors.address.message}</p>
                )}
              </div>

              {/* Campo número apenas para Brasil */}
              {selectedCountry === "Brasil" && (
                <div className="space-y-2">
                  <Label htmlFor="number">Número *</Label>
                  <Input id="number" {...form.register("number")} placeholder="Número" />
                  {form.formState.errors.number && (
                    <p className="text-sm text-red-500">{form.formState.errors.number.message}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Motivo */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Motivo da Transação</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="motivo_id">Motivo *</Label>
                <Select onValueChange={(value) => form.setValue("motivo_id", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {motivos.map((motivo) => (
                      <SelectItem key={motivo.id} value={motivo.id}>
                        {motivo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.motivo_id && (
                  <p className="text-sm text-red-500">{form.formState.errors.motivo_id.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivo_text">Descrição do Motivo *</Label>
              <Textarea
                id="motivo_text"
                {...form.register("motivo_text")}
                placeholder="Descreva o motivo da transação"
                rows={3}
              />
              {form.formState.errors.motivo_text && (
                <p className="text-sm text-red-500">{form.formState.errors.motivo_text.message}</p>
              )}
            </div>
          </div>

          {/* Método de Pagamento - Brasil */}
          {selectedCountry === "Brasil" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Método de Pagamento</h3>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => {
                  setPaymentMethod(value)
                  form.setValue("payment_method", value as "pix" | "bank")
                }}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pix" id="pix" />
                  <Label htmlFor="pix">PIX</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank">Conta Bancária</Label>
                </div>
              </RadioGroup>

              {/* Campos PIX */}
              {paymentMethod === "pix" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="pix_key_type">Tipo da Chave PIX *</Label>
                    <Select onValueChange={(value) => form.setValue("pix_key_type", value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo da chave" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cpf">CPF</SelectItem>
                        <SelectItem value="cnpj">CNPJ</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Telefone</SelectItem>
                        <SelectItem value="random">Chave Aleatória</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pix_key">Chave PIX *</Label>
                    <Input id="pix_key" {...form.register("pix_key")} placeholder="Chave PIX" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpf_cnpj">CPF/CNPJ *</Label>
                    <Input id="cpf_cnpj" {...form.register("cpf_cnpj")} placeholder="CPF ou CNPJ" />
                  </div>
                </div>
              )}

              {/* Campos Conta Bancária */}
              {paymentMethod === "bank" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="account">Conta *</Label>
                    <Input id="account" {...form.register("account")} placeholder="Número da conta" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bank_name">Nome do Banco *</Label>
                    <Input id="bank_name" {...form.register("bank_name")} placeholder="Nome do banco" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bank_branch">Agência *</Label>
                    <Input id="bank_branch" {...form.register("bank_branch")} placeholder="Agência" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bank_country">País do Banco *</Label>
                    <Input id="bank_country" {...form.register("bank_country")} placeholder="País do banco" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bank_zipcode">CEP do Banco *</Label>
                    <Input id="bank_zipcode" {...form.register("bank_zipcode")} placeholder="CEP do banco" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bank_state">Estado do Banco *</Label>
                    <Input id="bank_state" {...form.register("bank_state")} placeholder="Estado do banco" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bank_city">Cidade do Banco *</Label>
                    <Input id="bank_city" {...form.register("bank_city")} placeholder="Cidade do banco" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bank_street">Endereço do Banco *</Label>
                    <Input id="bank_street" {...form.register("bank_street")} placeholder="Endereço do banco" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Conta Bancária - Estados Unidos */}
          {selectedCountry === "Estados Unidos" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Método de Pagamento</h3>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => {
                  setPaymentMethod(value)
                  form.setValue("payment_method", value as "wire" | "ach")
                }}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wire" id="wire" />
                  <Label htmlFor="wire">Wire Transfer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ach" id="ach" />
                  <Label htmlFor="ach">ACH Transfer</Label>
                </div>
              </RadioGroup>

              {(paymentMethod === "wire" || paymentMethod === "ach") && (
                <div className="space-y-4">
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Informações Bancárias para Transferência</CardTitle>
                      <CardDescription>
                        Use as informações abaixo para realizar a transferência{" "}
                        {paymentMethod === "wire" ? "Wire" : "ACH"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Número da Conta</Label>
                          <div className="flex items-center gap-2 p-2 bg-white border rounded-md">
                            <span className="font-mono text-sm flex-1">{bankInfo.bank_details.account_number}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(bankInfo.bank_details.account_number, "account")}
                              className="h-6 w-6 p-0"
                            >
                              {copiedField === "account" ? (
                                <Check className="h-3 w-3 text-green-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Routing Number</Label>
                          <div className="flex items-center gap-2 p-2 bg-white border rounded-md">
                            <span className="font-mono text-sm flex-1">{bankInfo.bank_details.routing_number}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(bankInfo.bank_details.routing_number, "routing")}
                              className="h-6 w-6 p-0"
                            >
                              {copiedField === "routing" ? (
                                <Check className="h-3 w-3 text-green-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Routing Number Type</Label>
                          <div className="p-2 bg-white border rounded-md">
                            <span className="text-sm">{bankInfo.bank_details.routing_number_type}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Memo/Referência</Label>
                          <div className="flex items-center gap-2 p-2 bg-white border rounded-md">
                            <span className="font-mono text-sm flex-1">{bankInfo.memo}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(bankInfo.memo, "memo")}
                              className="h-6 w-6 p-0"
                            >
                              {copiedField === "memo" ? (
                                <Check className="h-3 w-3 text-green-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                          <strong>Importante:</strong> Certifique-se de incluir o memo/referência{" "}
                          <strong>{bankInfo.memo}</strong> na sua transferência para que possamos identificar o
                          pagamento corretamente.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <h3 className="text-lg font-semibold">Informações Bancárias do Remetente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="account">Conta *</Label>
                  <Input id="account" {...form.register("account")} placeholder="Número da conta" />
                  {form.formState.errors.account && (
                    <p className="text-sm text-red-500">{form.formState.errors.account.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank_name">Nome do Banco *</Label>
                  <Input id="bank_name" {...form.register("bank_name")} placeholder="Nome do banco" />
                  {form.formState.errors.bank_name && (
                    <p className="text-sm text-red-500">{form.formState.errors.bank_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank_branch">Agência *</Label>
                  <Input id="bank_branch" {...form.register("bank_branch")} placeholder="Agência" />
                  {form.formState.errors.bank_branch && (
                    <p className="text-sm text-red-500">{form.formState.errors.bank_branch.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank_country">País do Banco *</Label>
                  <Input id="bank_country" {...form.register("bank_country")} placeholder="País do banco" />
                  {form.formState.errors.bank_country && (
                    <p className="text-sm text-red-500">{form.formState.errors.bank_country.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank_zipcode">CEP do Banco *</Label>
                  <Input id="bank_zipcode" {...form.register("bank_zipcode")} placeholder="CEP do banco" />
                  {form.formState.errors.bank_zipcode && (
                    <p className="text-sm text-red-500">{form.formState.errors.bank_zipcode.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank_state">Estado do Banco *</Label>
                  <Input id="bank_state" {...form.register("bank_state")} placeholder="Estado do banco" />
                  {form.formState.errors.bank_state && (
                    <p className="text-sm text-red-500">{form.formState.errors.bank_state.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank_city">Cidade do Banco *</Label>
                  <Input id="bank_city" {...form.register("bank_city")} placeholder="Cidade do banco" />
                  {form.formState.errors.bank_city && (
                    <p className="text-sm text-red-500">{form.formState.errors.bank_city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank_street">Endereço do Banco *</Label>
                  <Input id="bank_street" {...form.register("bank_street")} placeholder="Endereço do banco" />
                  {form.formState.errors.bank_street && (
                    <p className="text-sm text-red-500">{form.formState.errors.bank_street.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={!selectedCountry}>
            Enviar Formulário
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
