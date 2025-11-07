"use client"

import type * as React from "react"
import {
  Home,
  Send,
  Download,
  Shield,
  Settings,
  CreditCardIcon,
  Building2,
  Users,
  GraduationCap,
  RefreshCw,
} from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { QrCode, Banknote, Smartphone, ArrowLeft, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const exchangeRates = {
  BRL: { USD: 0.2, USDT: 0.18, USDC: 0.16 },
  USD: { BRL: 5.0, USDT: 0.92, USDC: 0.79 },
  USDT: { BRL: 5.45, USD: 1.09, USDC: 0.86 },
  USDC: { BRL: 6.3, USD: 1.26, USDT: 1.16 },
}

const navigation = [
  {
    title: "Inicio",
    url: "#",
    icon: Home,
    isActive: true,
  },
  {
    title: "Turmas",
    url: "#",
    icon: GraduationCap,
  },
  {
    title: "Enviar",
    url: "#",
    icon: Send,
  },
  {
    title: "Extrato",
    url: "#",
    icon: CreditCardIcon,
  },
  {
    title: "Wallet Whitelist",
    url: "#",
    icon: Shield,
  },
  {
    title: "Conversor",
    url: "#",
    icon: RefreshCw,
  },
  {
    title: "Admin Dashboard",
    url: "#",
    icon: Users,
  },
  {
    title: "Configurações",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar({
  activePage,
  setActivePage,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  activePage?: string
  setActivePage?: (page: string) => void
}) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false)
  const [rechargeStep, setRechargeStep] = useState(1)
  const [selectedMethod, setSelectedMethod] = useState("")
  const [rechargeAmount, setRechargeAmount] = useState("")
  const [selectedCurrency, setSelectedCurrency] = useState("USD")
  const [paymentCode, setPaymentCode] = useState("")
  const [codeCopied, setCodeCopied] = useState(false)
  const [selectedSubMethod, setSelectedSubMethod] = useState("")

  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [errors, setErrors] = useState({
    recipient: "",
    amount: "",
    description: "",
  })
  const [paymentData, setPaymentData] = useState({
    recipient: "",
    amount: "",
    currency: "BRL",
    description: "",
    purpose: "",
  })

  const [showSuccessNotification, setShowSuccessNotification] = useState(false)

  const [isConverterModalOpen, setIsConverterModalOpen] = useState(false)
  const [converterData, setConverterData] = useState({
    fromCurrency: "USD",
    toCurrency: "BRL",
    amount: "",
    convertedAmount: 0,
  })

  const validatePaymentForm = () => {
    const newErrors = {
      recipient: "",
      amount: "",
      description: "",
    }

    if (!paymentData.recipient.trim()) {
      newErrors.recipient = "Destinatário é obrigatório"
    } else if (!paymentData.recipient.includes("@") && !paymentData.recipient.match(/^[a-zA-Z\s]+$/)) {
      newErrors.recipient = "Digite um email válido ou nome completo"
    }

    if (!paymentData.amount || Number.parseFloat(paymentData.amount) <= 0) {
      newErrors.amount = "Valor deve ser maior que zero"
    } else if (Number.parseFloat(paymentData.amount) > 10000) {
      newErrors.amount = "Valor máximo é R$ 10.000,00"
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== "")
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-border/40">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">BancoMulti</span>
            <span className="truncate text-xs text-muted-foreground">Pro</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-md">
            <Shield className="h-3 w-3 text-primary" />
            <span className="text-xs font-medium text-primary">Admin</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.title === "Inicio" ? (
                    <SidebarMenuButton
                      isActive={activePage === "dashboard"}
                      tooltip={item.title}
                      className="hover:bg-primary/10 hover:text-primary transition-colors"
                      onClick={() => setActivePage("dashboard")}
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  ) : item.title === "Turmas" ? (
                    <SidebarMenuButton
                      isActive={activePage === "turmas"}
                      tooltip={item.title}
                      className="hover:bg-primary/10 hover:text-primary transition-colors"
                      onClick={() => setActivePage("turmas")}
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  ) : item.title === "Recarregar / Receber" ? (
                    <Dialog
                      open={isRechargeModalOpen}
                      onOpenChange={(open) => {
                        setIsRechargeModalOpen(open)
                        if (!open) {
                          setRechargeStep(1)
                          setSelectedMethod("")
                          setRechargeAmount("")
                          setPaymentCode("")
                          setCodeCopied(false)
                          setSelectedSubMethod("")
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <SidebarMenuButton
                          isActive={item.isActive}
                          tooltip={item.title}
                          className="hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            {rechargeStep > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setRechargeStep(rechargeStep - 1)}
                                className="p-1 h-auto"
                              >
                                <ArrowLeft className="size-4" />
                              </Button>
                            )}
                            <Download className="size-5 text-primary" />
                            Recarregar Conta
                          </DialogTitle>
                          <DialogDescription>
                            {rechargeStep === 1 && "Escolha o método de depósito"}
                            {rechargeStep === 1.5 && "Escolha o tipo de transferência bancária"}
                            {rechargeStep === 2 && "Defina o valor do depósito"}
                            {rechargeStep === 3 && "Realize o pagamento"}
                          </DialogDescription>
                        </DialogHeader>

                        {/* Etapa 1: Escolher método */}
                        {rechargeStep === 1 && (
                          <div className="space-y-4 py-4">
                            <div className="space-y-3">
                              <div
                                onClick={() => setSelectedMethod("pix")}
                                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                                  selectedMethod === "pix"
                                    ? "border-primary bg-primary/5"
                                    : "border-gray-200 hover:border-primary/50"
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    selectedMethod === "pix" ? "border-primary" : "border-gray-300"
                                  }`}
                                >
                                  {selectedMethod === "pix" && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                                </div>
                                <div className="flex items-center gap-3">
                                  <Smartphone className="size-6 text-primary" />
                                  <div>
                                    <p className="font-medium">PIX</p>
                                    <p className="text-sm text-gray-500">Transferência instantânea</p>
                                  </div>
                                </div>
                              </div>

                              <div
                                onClick={() => {
                                  setSelectedMethod("wire")
                                  setRechargeStep(1.5) // Nova etapa para escolher submétodo
                                }}
                                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                                  selectedMethod === "wire"
                                    ? "border-primary bg-primary/5"
                                    : "border-gray-200 hover:border-primary/50"
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    selectedMethod === "wire" ? "border-primary" : "border-gray-300"
                                  }`}
                                >
                                  {selectedMethod === "wire" && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                                </div>
                                <div className="flex items-center gap-3">
                                  <Building2 className="size-6 text-primary" />
                                  <div>
                                    <p className="font-medium">ACH / Fedwire / SWIFT</p>
                                    <p className="text-sm text-gray-500">Transferência bancária internacional</p>
                                  </div>
                                </div>
                              </div>

                              <div
                                onClick={() => setSelectedMethod("crypto")}
                                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                                  selectedMethod === "crypto"
                                    ? "border-primary bg-primary/5"
                                    : "border-gray-200 hover:border-primary/50"
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    selectedMethod === "crypto" ? "border-primary" : "border-gray-300"
                                  }`}
                                >
                                  {selectedMethod === "crypto" && (
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  <Banknote className="size-6 text-primary" />
                                  <div>
                                    <p className="font-medium">USDT / USDC</p>
                                    <p className="text-sm text-gray-500">Stablecoins</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Button onClick={() => setRechargeStep(2)} disabled={!selectedMethod} className="w-full">
                              Continuar
                            </Button>
                          </div>
                        )}

                        {/* Etapa 1.5: Escolher submétodo para wire */}
                        {rechargeStep === 1.5 && (
                          <div className="space-y-4 py-4">
                            <div className="space-y-3">
                              <div
                                onClick={() => setSelectedSubMethod("ach")}
                                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                                  selectedSubMethod === "ach"
                                    ? "border-primary bg-primary/5"
                                    : "border-gray-200 hover:border-primary/50"
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    selectedSubMethod === "ach" ? "border-primary" : "border-gray-300"
                                  }`}
                                >
                                  {selectedSubMethod === "ach" && (
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">ACH</p>
                                  <p className="text-sm text-gray-500">Automated Clearing House</p>
                                </div>
                              </div>

                              <div
                                onClick={() => setSelectedSubMethod("fedwire")}
                                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                                  selectedSubMethod === "fedwire"
                                    ? "border-primary bg-primary/5"
                                    : "border-gray-200 hover:border-primary/50"
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    selectedSubMethod === "fedwire" ? "border-primary" : "border-gray-300"
                                  }`}
                                >
                                  {selectedSubMethod === "fedwire" && (
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">Fedwire</p>
                                  <p className="text-sm text-gray-500">Federal Reserve Wire Network</p>
                                </div>
                              </div>

                              <div
                                onClick={() => setSelectedSubMethod("swift")}
                                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                                  selectedSubMethod === "swift"
                                    ? "border-primary bg-primary/5"
                                    : "border-gray-200 hover:border-primary/50"
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    selectedSubMethod === "swift" ? "border-primary" : "border-gray-300"
                                  }`}
                                >
                                  {selectedSubMethod === "swift" && (
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">SWIFT</p>
                                  <p className="text-sm text-gray-500">
                                    Society for Worldwide Interbank Financial Telecommunication
                                  </p>
                                </div>
                              </div>
                            </div>
                            <Button onClick={() => setRechargeStep(2)} disabled={!selectedSubMethod} className="w-full">
                              Continuar
                            </Button>
                          </div>
                        )}

                        {/* Etapa 2: Definir valor */}
                        {rechargeStep === 2 && (
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="recharge-amount">Valor do depósito</Label>
                              <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 text-gray-500">
                                  <span className="text-sm opacity-70">🇺🇸</span>
                                  <span className="text-sm font-medium opacity-70">USD</span>
                                </div>
                                <Input
                                  id="recharge-amount"
                                  type="number"
                                  placeholder="0,00"
                                  value={rechargeAmount}
                                  onChange={(e) => setRechargeAmount(e.target.value)}
                                  className="w-full text-lg pl-20"
                                />
                              </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm text-gray-600">Método selecionado:</p>
                              <p className="font-medium capitalize">
                                {selectedMethod === "wire" ? selectedSubMethod.toUpperCase() : selectedMethod}
                              </p>
                            </div>
                            <Button
                              onClick={() => {
                                // Gerar código de pagamento simulado
                                const code = `${selectedMethod.toUpperCase()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`
                                setPaymentCode(code)
                                setRechargeStep(3)
                              }}
                              disabled={!rechargeAmount}
                              className="w-full"
                            >
                              Gerar Código de Pagamento
                            </Button>
                          </div>
                        )}

                        {/* Etapa 3: Código de pagamento */}
                        {rechargeStep === 3 && (
                          <div className="space-y-4 py-4">
                            <div className="text-center space-y-2">
                              <p className="text-sm text-gray-600">Valor a depositar:</p>
                              <p className="text-2xl font-bold text-primary">USD {rechargeAmount}</p>
                            </div>

                            <div className="space-y-3">
                              <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <QrCode className="size-24 mx-auto mb-2 text-gray-400" />
                                <p className="text-xs text-gray-500">QR Code para pagamento</p>
                              </div>

                              <div className="space-y-2">
                                <Label>Código de pagamento:</Label>
                                <div className="flex gap-2">
                                  <Input value={paymentCode} readOnly className="font-mono text-sm" />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      navigator.clipboard.writeText(paymentCode)
                                      setCodeCopied(true)
                                      setTimeout(() => setCodeCopied(false), 2000)
                                    }}
                                  >
                                    {codeCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
                                  </Button>
                                </div>
                              </div>
                            </div>

                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-sm text-blue-800">
                                <strong>Instruções:</strong> Use este código para realizar o pagamento via{" "}
                                {selectedMethod}. O valor será creditado em sua conta em até 5 minutos.
                              </p>
                            </div>

                            <Button onClick={() => setIsRechargeModalOpen(false)} className="w-full">
                              Finalizar
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  ) : item.title === "Enviar" ? (
                    <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
                      <DialogTrigger asChild>
                        <SidebarMenuButton
                          isActive={item.isActive}
                          tooltip={item.title}
                          className="hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Send className="size-5 text-primary" />
                            Enviar Pagamento
                          </DialogTitle>
                          <DialogDescription>Preencha os dados para realizar um pagamento</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="amount">Valor do envio</Label>
                            <Input
                              id="amount"
                              type="number"
                              placeholder="0,00"
                              className={`w-full ${errors.amount ? "border-red-500" : ""}`}
                              value={paymentData.amount}
                              onChange={(e) => {
                                setPaymentData({ ...paymentData, amount: e.target.value })
                                if (errors.amount) setErrors({ ...errors, amount: "" })
                              }}
                            />
                            {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
                            <p className="text-xs text-muted-foreground">
                              O destinatário receberá uma notificação para a contagem de expirar a cotação
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="recipient">Destinatário</Label>
                            <Input
                              id="recipient"
                              placeholder="Digite o email ou nome do destinatário"
                              className={`w-full ${errors.recipient ? "border-red-500" : ""}`}
                              value={paymentData.recipient}
                              onChange={(e) => {
                                setPaymentData({ ...paymentData, recipient: e.target.value })
                                if (errors.recipient) setErrors({ ...errors, recipient: "" })
                              }}
                            />
                            {errors.recipient && <p className="text-sm text-red-500">{errors.recipient}</p>}
                            <a href="#" className="text-xs text-primary hover:underline">
                              Cadastrar novo destinatário
                            </a>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="purpose">Finalidade do pagamento</Label>
                            <Select
                              value={paymentData.purpose || ""}
                              onValueChange={(value) => setPaymentData({ ...paymentData, purpose: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a finalidade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pagar-contas">Pagar contas</SelectItem>
                                <SelectItem value="transferencia-pessoal">Transferência pessoal</SelectItem>
                                <SelectItem value="pagamento-servicos">Pagamento de serviços</SelectItem>
                                <SelectItem value="investimento">Investimento</SelectItem>
                                <SelectItem value="compras">Compras</SelectItem>
                                <SelectItem value="outros">Outros</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="documents">Documentos de apoio</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                              <input
                                type="file"
                                id="documents"
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                className="hidden"
                                onChange={(e) => {
                                  // Handle file upload logic here
                                  console.log("Files selected:", e.target.files)
                                }}
                              />
                              <label htmlFor="documents" className="cursor-pointer">
                                <div className="space-y-2">
                                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg
                                      className="w-6 h-6 text-gray-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Clique para fazer upload</p>
                                    <p className="text-xs text-gray-400">PDF, JPG, PNG, DOC até 10MB</p>
                                  </div>
                                </div>
                              </label>
                            </div>
                          </div>

                          <div className="flex gap-3 pt-4">
                            <Button
                              variant="outline"
                              className="flex-1 bg-transparent"
                              onClick={() => {
                                setIsPaymentModalOpen(false)
                                setPaymentData({
                                  recipient: "",
                                  amount: "",
                                  currency: "BRL",
                                  description: "",
                                  purpose: "",
                                })
                                setErrors({ recipient: "", amount: "", description: "" })
                              }}
                            >
                              Cancelar
                            </Button>
                            <Button
                              className="flex-1"
                              onClick={() => {
                                if (validatePaymentForm()) {
                                  setIsPaymentModalOpen(false)
                                  setShowSuccessNotification(true)
                                  // Show success notification for 3 seconds before showing the detailed modal
                                  setTimeout(() => {
                                    setShowSuccessNotification(false)
                                    setPaymentSuccess(true)
                                  }, 3000)
                                }
                              }}
                            >
                              <Send className="size-4 mr-2" />
                              Enviar Pagamento
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : item.title === "Extrato" ? (
                    <SidebarMenuButton
                      isActive={activePage === "extrato"}
                      tooltip={item.title}
                      className="hover:bg-primary/10 hover:text-primary transition-colors"
                      onClick={() => setActivePage("extrato")}
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  ) : item.title === "Wallet Whitelist" ? (
                    <SidebarMenuButton
                      isActive={activePage === "wallet-whitelist"}
                      tooltip={item.title}
                      className="hover:bg-primary/10 hover:text-primary transition-colors"
                      onClick={() => setActivePage("wallet-whitelist")}
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  ) : item.title === "Conversor" ? (
                    <Dialog open={isConverterModalOpen} onOpenChange={setIsConverterModalOpen}>
                      <DialogTrigger asChild>
                        <SidebarMenuButton
                          isActive={item.isActive}
                          tooltip={item.title}
                          className="hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <RefreshCw className="size-5 text-primary" />
                            Conversor de Moedas
                          </DialogTitle>
                          <DialogDescription>Converta entre diferentes moedas disponíveis</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="from-currency">De</Label>
                            <Select
                              value={converterData.fromCurrency}
                              onValueChange={(value) => {
                                setConverterData({ ...converterData, fromCurrency: value })
                                // Recalculate when currency changes
                                if (converterData.amount) {
                                  const rate = exchangeRates[value]?.[converterData.toCurrency] || 1
                                  setConverterData((prev) => ({
                                    ...prev,
                                    convertedAmount: Number.parseFloat(prev.amount) * rate,
                                  }))
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="BRL">🇧🇷 Real Brasileiro</SelectItem>
                                <SelectItem value="USD">🇺🇸 Dólar Americano</SelectItem>
                                <SelectItem value="USDT">₮ Tether USD</SelectItem>
                                <SelectItem value="USDC">🔵 USD Coin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="amount">Valor</Label>
                            <Input
                              id="amount"
                              type="number"
                              placeholder="0,00"
                              value={converterData.amount}
                              onChange={(e) => {
                                const amount = e.target.value
                                setConverterData({ ...converterData, amount })
                                if (amount) {
                                  const rate =
                                    exchangeRates[converterData.fromCurrency]?.[converterData.toCurrency] || 1
                                  setConverterData((prev) => ({
                                    ...prev,
                                    convertedAmount: Number.parseFloat(amount) * rate,
                                  }))
                                } else {
                                  setConverterData((prev) => ({ ...prev, convertedAmount: 0 }))
                                }
                              }}
                              className="w-full text-lg"
                            />
                          </div>

                          <div className="flex items-center justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setConverterData({
                                  ...converterData,
                                  fromCurrency: converterData.toCurrency,
                                  toCurrency: converterData.fromCurrency,
                                  convertedAmount: converterData.amount
                                    ? Number.parseFloat(converterData.amount) /
                                      (exchangeRates[converterData.fromCurrency]?.[converterData.toCurrency] || 1)
                                    : 0,
                                })
                              }}
                              className="rounded-full p-2"
                            >
                              <RefreshCw className="size-4" />
                            </Button>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="to-currency">Para</Label>
                            <Select
                              value={converterData.toCurrency}
                              onValueChange={(value) => {
                                setConverterData({ ...converterData, toCurrency: value })
                                // Recalculate when currency changes
                                if (converterData.amount) {
                                  const rate = exchangeRates[converterData.fromCurrency]?.[value] || 1
                                  setConverterData((prev) => ({
                                    ...prev,
                                    convertedAmount: Number.parseFloat(prev.amount) * rate,
                                  }))
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="BRL">🇧🇷 Real Brasileiro</SelectItem>
                                <SelectItem value="USD">🇺🇸 Dólar Americano</SelectItem>
                                <SelectItem value="USDT">₮ Tether USD</SelectItem>
                                <SelectItem value="USDC">🔵 USD Coin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-center">
                              <p className="text-sm text-gray-600 mb-1">Valor convertido:</p>
                              <p className="text-2xl font-bold text-primary">
                                {converterData.convertedAmount.toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}{" "}
                                {converterData.toCurrency}
                              </p>
                            </div>
                          </div>

                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Taxa de câmbio:</strong> 1 {converterData.fromCurrency} ={" "}
                              {(exchangeRates[converterData.fromCurrency]?.[converterData.toCurrency] || 1).toFixed(4)}{" "}
                              {converterData.toCurrency}
                            </p>
                          </div>

                          <div className="flex gap-3 pt-4">
                            <Button
                              variant="outline"
                              className="flex-1 bg-transparent"
                              onClick={() => {
                                setIsConverterModalOpen(false)
                                setConverterData({
                                  fromCurrency: "USD",
                                  toCurrency: "BRL",
                                  amount: "",
                                  convertedAmount: 0,
                                })
                              }}
                            >
                              Fechar
                            </Button>
                            <Button
                              className="flex-1"
                              onClick={() => {
                                // Here you could implement actual conversion/exchange functionality
                                alert(
                                  `Conversão de ${converterData.amount} ${converterData.fromCurrency} para ${converterData.convertedAmount.toFixed(2)} ${converterData.toCurrency}`,
                                )
                              }}
                              disabled={!converterData.amount}
                            >
                              <RefreshCw className="size-4 mr-2" />
                              Converter
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : item.title === "Admin Dashboard" ? (
                    <SidebarMenuButton
                      isActive={activePage === "admin"}
                      tooltip={item.title}
                      className="hover:bg-primary/10 hover:text-primary transition-colors"
                      onClick={() => setActivePage("admin")}
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  ) : item.title === "Configurações" ? (
                    <SidebarMenuButton
                      isActive={activePage === "configuracoes"}
                      tooltip={item.title}
                      className="hover:bg-primary/10 hover:text-primary transition-colors"
                      onClick={() => setActivePage("configuracoes")}
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      isActive={item.isActive}
                      tooltip={item.title}
                      className="hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <a href={item.url} className="flex items-center gap-2">
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Notificação de Sucesso Imediata */}
      <Dialog open={showSuccessNotification} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-sm">
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="size-8 text-green-600" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-green-600">Pagamento Enviado!</h3>
              <p className="text-sm text-gray-600">
                Seu pagamento de {paymentData.amount} {paymentData.currency} foi processado com sucesso.
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div className="bg-green-600 h-1 rounded-full animate-pulse" style={{ width: "100%" }}></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SidebarRail />
    </Sidebar>
  )
}
