"use client"

import { useState, useEffect } from "react"
import {
  Eye,
  EyeOff,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Bell,
  LogOut,
  Filter,
  Download,
  Calendar,
  Settings,
  Shield,
  Building2,
  Wallet,
  CheckCircle,
  XCircle,
  Clock,
  X,
  Search,
} from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { WalletForm } from "@/components/wallet-form"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import AdminDashboard from "@/components/admin-dashboard"
import { TurmasList } from "@/components/turmas-list"
import { TurmaDetail } from "@/components/turma-detail"

// Dados simulados
const currencies = [
  { code: "BRL", name: "Real Brasileiro", flag: "🇧🇷", balance: 15420.5 },
  { code: "USD", name: "Dólar Americano", flag: "🇺🇸", balance: 2850.3 },
  { code: "USDT", name: "Tether USD", flag: "₮", balance: 1950.75 },
  { code: "USDC", name: "USD Coin", flag: "🔵", balance: 850.2 },
]

const transactions = [
  {
    id: 1,
    type: "received",
    description: "Transferência recebida",
    amount: 1500.0,
    currency: "BRL",
    date: "2024-01-15",
    time: "14:30",
    from: "Maria Santos",
    status: "Concluída",
    reference: "TXN001234567",
  },
  {
    id: 2,
    type: "sent",
    description: "Pagamento enviado",
    amount: 250.0,
    currency: "USD",
    date: "2024-01-14",
    time: "09:15",
    to: "Amazon Inc",
    status: "Concluída",
    reference: "TXN001234566",
  },
  {
    id: 3,
    type: "conversion",
    description: "Conversão de moeda",
    amount: 800.0,
    currency: "USDT",
    date: "2024-01-13",
    time: "16:45",
    from: "USD",
    to: "USDT",
    status: "Concluída",
    reference: "TXN001234565",
  },
  {
    id: 4,
    type: "received",
    description: "Depósito",
    amount: 5000.0,
    currency: "BRL",
    date: "2024-01-12",
    time: "11:20",
    from: "Salário",
    status: "Concluída",
    reference: "TXN001234564",
  },
  {
    id: 5,
    type: "sent",
    description: "Transferência PIX",
    amount: 150.0,
    currency: "BRL",
    date: "2024-01-11",
    time: "18:30",
    to: "João Santos",
    status: "Pendente",
    reference: "TXN001234563",
  },
  {
    id: 6,
    type: "received",
    description: "Recarga de conta",
    amount: 1000.0,
    currency: "USD",
    date: "2024-01-10",
    time: "10:15",
    from: "Cartão de crédito",
    status: "Concluída",
    reference: "TXN001234562",
  },
]

export default function Dashboard() {
  const [showBalance, setShowBalance] = useState(true)
  const [selectedCurrency, setSelectedCurrency] = useState("BRL")
  const [activePage, setActivePage] = useState("dashboard")
  const [filterType, setFilterType] = useState("all")
  const [filterCurrency, setFilterCurrency] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [searchTerm, setSearchTerm] = useState("") // Adicionado estado para termo de pesquisa

  const [userData, setUserData] = useState({
    nome: "João Silva",
    email: "joao@exemplo.com",
    telefone: "(11) 99999-9999",
    cpf: "123.456.789-00",
    endereco: "Rua das Flores, 123",
    cidade: "São Paulo",
    cep: "01234-567",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Estados para Wallet Whitelist
  const [wallets, setWallets] = useState([])
  const [isAddWalletModalOpen, setIsAddWalletModalOpen] = useState(false)
  const [showWalletSuccess, setShowWalletSuccess] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const exchangeRates = {
    BRL: { USD: 0.2, USDT: 0.18, USDC: 0.16 },
    USD: { BRL: 5.0, USDT: 0.92, USDC: 0.79 },
    USDT: { BRL: 5.45, USD: 1.09, USDC: 0.86 },
    USDC: { BRL: 6.3, USD: 1.26, USDT: 1.16 },
  }

  const convertToSelectedCurrency = (amount: number, fromCurrency: string) => {
    if (fromCurrency === selectedCurrency) return amount
    return amount * (exchangeRates[fromCurrency]?.[selectedCurrency] || 1)
  }

  const totalBalance = currencies.reduce((sum, currency) => {
    return sum + convertToSelectedCurrency(currency.balance, currency.code)
  }, 0)

  // Filtrar transações
  const filteredTransactions = transactions.filter((transaction) => {
    if (filterType !== "all" && transaction.type !== filterType) return false
    if (filterCurrency !== "all" && transaction.currency !== filterCurrency) return false
    if (dateFrom && transaction.date < dateFrom) return false
    if (dateTo && transaction.date > dateTo) return false

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        transaction.description.toLowerCase().includes(searchLower) ||
        transaction.reference.toLowerCase().includes(searchLower) ||
        (transaction.from && transaction.from.toLowerCase().includes(searchLower)) ||
        (transaction.to && transaction.to.toLowerCase().includes(searchLower)) ||
        transaction.currency.toLowerCase().includes(searchLower) ||
        transaction.status.toLowerCase().includes(searchLower)
      )
    }

    return true
  })

  const validatePasswordForm = () => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Senha atual é obrigatória"
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "Nova senha é obrigatória"
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Nova senha deve ter pelo menos 8 caracteres"
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Confirmação de senha é obrigatória"
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Senhas não coincidem"
    }

    setPasswordErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== "")
  }

  const handleAddWallet = (formData: { name: string; currency: string; network: string }) => {
    const newWallet = {
      id: Date.now(),
      name: formData.name,
      currency: formData.currency,
      network: formData.network,
      status: "pendente", // pendente, ativa, recusada
      dateAdded: new Date().toLocaleDateString("pt-BR"),
      address: `0x${Math.random().toString(16).substr(2, 40)}`, // Endereço simulado
    }

    setWallets([...wallets, newWallet])
    setShowWalletSuccess(true)

    // Fechar notificação automaticamente após 20 segundos
    setTimeout(() => {
      setShowWalletSuccess(false)
    }, 20000)
  }

  const handlePaymentSubmit = (formData: any) => {
    console.log("Dados do formulário de pagamento:", formData)
    // Aqui você processaria os dados do formulário
    alert("Formulário enviado com sucesso!")
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "ativa":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Ativa
          </Badge>
        )
      case "recusada":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Recusada
          </Badge>
        )
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        )
    }
  }

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [filterType, filterCurrency, dateFrom, dateTo, searchTerm]) // Adicionado searchTerm às dependências

  const renderDashboard = () => (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      {/* Seção do Total da Conta */}
      <Card className="md:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total da Conta</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setShowBalance(!showBalance)} className="h-8 w-8 p-0">
            {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span>{currency.flag}</span>
                        <span>{currency.code}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-2xl font-bold">
              {showBalance ? (
                <>
                  {currencies.find((c) => c.code === selectedCurrency)?.flag}{" "}
                  {totalBalance.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </>
              ) : (
                "••••••"
              )}
            </div>
            <p className="text-xs text-muted-foreground">Saldo total convertido em {selectedCurrency}</p>
          </div>
        </CardContent>
      </Card>

      {/* Seção de Saldos por Moeda */}
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldos por Moeda</CardTitle>
          <Button size="sm" className="h-8 gap-1">
            <Plus className="h-3 w-3" />
            Solicitar Moeda
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {currencies.map((currency) => (
              <div key={currency.code} className="flex flex-col p-3 rounded-lg border bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm opacity-60">{currency.flag}</span>
                  <div className="text-left">
                    <p className="font-bold text-sm">{currency.code}</p>
                    <p className="text-xs text-muted-foreground">{currency.name}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg text-primary">
                    {showBalance
                      ? currency.balance.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : "••••••"}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">{currency.code}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderExtrato = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Pesquisar Transações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Pesquisar por descrição, referência, origem, destino..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                // Função de pesquisa já é executada automaticamente pelo onChange
                console.log("Pesquisando por:", searchTerm)
              }}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Tipo de transação</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="received">Recebidas</SelectItem>
                  <SelectItem value="sent">Enviadas</SelectItem>
                  <SelectItem value="conversion">Conversões</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Moeda</Label>
              <Select value={filterCurrency} onValueChange={setFilterCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="BRL">🇧🇷 BRL</SelectItem>
                  <SelectItem value="USD">🇺🇸 USD</SelectItem>
                  <SelectItem value="USDT">₮ USDT</SelectItem>
                  <SelectItem value="USDC">🔵 USDC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Data inicial</Label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Data final</Label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setFilterType("all")
                setFilterCurrency("all")
                setDateFrom("")
                setDateTo("")
                setSearchTerm("") // Limpar também o termo de pesquisa
              }}
            >
              Limpar filtros
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Exportar PDF
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Calendar className="h-4 w-4" />
              Relatório mensal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de transações detalhada */}
      <Card>
        <CardHeader>
          <CardTitle>Extrato Detalhado</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transação(ões) encontrada(s) • Página {currentPage} de {totalPages} •
            Mostrando {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} de{" "}
            {filteredTransactions.length}
            {searchTerm && <span className="text-blue-600"> • Pesquisando por: "{searchTerm}"</span>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paginatedTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border bg-white">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    {transaction.type === "received" ? (
                      <ArrowDownLeft className="h-5 w-5 text-green-600" />
                    ) : transaction.type === "sent" ? (
                      <ArrowUpRight className="h-5 w-5 text-red-600" />
                    ) : (
                      <ArrowLeftRight className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.date} às {transaction.time}
                      {transaction.from && transaction.type === "received" && <span> • de {transaction.from}</span>}
                      {transaction.to && transaction.type === "sent" && <span> • para {transaction.to}</span>}
                      {transaction.type === "conversion" && (
                        <span>
                          {" "}
                          • {transaction.from} → {transaction.to}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">Ref: {transaction.reference}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p
                    className={`font-medium text-lg ${
                      transaction.type === "received"
                        ? "text-green-600"
                        : transaction.type === "sent"
                          ? "text-red-600"
                          : "text-blue-600"
                    }`}
                  >
                    {transaction.type === "received" ? "+" : transaction.type === "sent" ? "-" : ""}
                    {transaction.amount.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    {transaction.currency}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={transaction.status === "Concluída" ? "default" : "secondary"}
                      className={`text-xs ${
                        transaction.status === "Concluída"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {transaction.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {transaction.type === "received"
                        ? "Recebida"
                        : transaction.type === "sent"
                          ? "Enviada"
                          : "Conversão"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {/* Primeira página */}
                  {currentPage > 3 && (
                    <>
                      <PaginationItem>
                        <PaginationLink onClick={() => handlePageChange(1)} className="cursor-pointer">
                          1
                        </PaginationLink>
                      </PaginationItem>
                      {currentPage > 4 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                    </>
                  )}

                  {/* Páginas ao redor da atual */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                    if (pageNumber > totalPages) return null

                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => handlePageChange(pageNumber)}
                          isActive={currentPage === pageNumber}
                          className="cursor-pointer"
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  {/* Última página */}
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink onClick={() => handlePageChange(totalPages)} className="cursor-pointer">
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const renderConfiguracoes = () => (
    <div className="space-y-6">
      {/* Dados do Perfil */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Dados do Perfil
              </CardTitle>
              <CardDescription>Gerencie suas informações pessoais</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setIsEditingProfile(!isEditingProfile)}>
              {isEditingProfile ? "Cancelar" : "Editar"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                value={userData.nome}
                onChange={(e) => setUserData({ ...userData, nome: e.target.value })}
                disabled={!isEditingProfile}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                disabled={!isEditingProfile}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={userData.telefone}
                onChange={(e) => setUserData({ ...userData, telefone: e.target.value })}
                disabled={!isEditingProfile}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" value={userData.cpf} disabled className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={userData.endereco}
                onChange={(e) => setUserData({ ...userData, endereco: e.target.value })}
                disabled={!isEditingProfile}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={userData.cidade}
                onChange={(e) => setUserData({ ...userData, cidade: e.target.value })}
                disabled={!isEditingProfile}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                value={userData.cep}
                onChange={(e) => setUserData({ ...userData, cep: e.target.value })}
                disabled={!isEditingProfile}
              />
            </div>
          </div>
          {isEditingProfile && (
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  // Aqui você salvaria os dados
                  setIsEditingProfile(false)
                  alert("Dados atualizados com sucesso!")
                }}
                className="flex-1"
              >
                Salvar Alterações
              </Button>
              <Button variant="outline" onClick={() => setIsEditingProfile(false)} className="flex-1">
                Cancelar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alteração de Senha */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Segurança
          </CardTitle>
          <CardDescription>Altere sua senha de acesso</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha atual</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  if (passwordErrors.currentPassword) {
                    setPasswordErrors({ ...passwordErrors, currentPassword: "" })
                  }
                }}
                className={passwordErrors.currentPassword ? "border-red-500" : ""}
              />
              {passwordErrors.currentPassword && (
                <p className="text-sm text-red-500">{passwordErrors.currentPassword}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova senha</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                  if (passwordErrors.newPassword) {
                    setPasswordErrors({ ...passwordErrors, newPassword: "" })
                  }
                }}
                className={passwordErrors.newPassword ? "border-red-500" : ""}
              />
              {passwordErrors.newPassword && <p className="text-sm text-red-500">{passwordErrors.newPassword}</p>}
              <p className="text-xs text-muted-foreground">A senha deve ter pelo menos 8 caracteres</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar nova senha</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  if (passwordErrors.confirmPassword) {
                    setPasswordErrors({ ...passwordErrors, confirmPassword: "" })
                  }
                }}
                className={passwordErrors.confirmPassword ? "border-red-500" : ""}
              />
              {passwordErrors.confirmPassword && (
                <p className="text-sm text-red-500">{passwordErrors.confirmPassword}</p>
              )}
            </div>
            <Button
              onClick={() => {
                if (validatePasswordForm()) {
                  // Aqui você processaria a alteração de senha
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  })
                  alert("Senha alterada com sucesso!")
                }
              }}
              className="w-full"
            >
              Alterar Senha
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informações da Conta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informações da Conta
          </CardTitle>
          <CardDescription>Detalhes da sua conta BancoMulti</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Número da conta</Label>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="font-mono text-sm">12345-6</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Agência</Label>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="font-mono text-sm">0001</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tipo de conta</Label>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm">Conta Pro</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status da conta</Label>
              <div className="p-3 bg-gray-50 rounded-md">
                <Badge className="bg-green-100 text-green-800">Ativa</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Data de abertura</Label>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm">15/03/2023</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Último acesso</Label>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm">Hoje às 14:30</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferências */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Preferências
          </CardTitle>
          <CardDescription>Configure suas preferências de uso</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações por email</p>
                <p className="text-sm text-muted-foreground">Receba notificações sobre transações</p>
              </div>
              <Button variant="outline" size="sm">
                Ativado
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações push</p>
                <p className="text-sm text-muted-foreground">Notificações no navegador</p>
              </div>
              <Button variant="outline" size="sm">
                Desativado
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Autenticação em duas etapas</p>
                <p className="text-sm text-muted-foreground">Segurança adicional para sua conta</p>
              </div>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderWalletWhitelist = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Lista de Wallets */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Wallet Whitelist
            </CardTitle>
            <CardDescription>Gerencie suas carteiras autorizadas para transações</CardDescription>
          </CardHeader>
          <CardContent>
            {wallets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Wallet className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Wallet found</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Você ainda não possui nenhuma wallet cadastrada na whitelist.
                </p>
                <p className="text-sm text-gray-500">Use o painel ao lado para adicionar sua primeira wallet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {wallets.map((wallet) => (
                  <div key={wallet.id} className="flex items-center justify-between p-4 rounded-lg border bg-white">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Wallet className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">{wallet.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {wallet.currency} • {wallet.network}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">{wallet.address}</p>
                        <p className="text-xs text-muted-foreground">Adicionada em {wallet.dateAdded}</p>
                      </div>
                    </div>
                    <div className="text-right">{getStatusBadge(wallet.status)}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Painel para Adicionar Wallet */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Adicionar Wallet
            </CardTitle>
            <CardDescription>Cadastre uma nova wallet na whitelist</CardDescription>
          </CardHeader>
          <CardContent>
            <WalletForm
              onSubmit={handleAddWallet}
              isOpen={isAddWalletModalOpen}
              onOpenChange={setIsAddWalletModalOpen}
            />
          </CardContent>
        </Card>
      </div>

      {/* Notificação de Sucesso */}
      <Dialog open={showWalletSuccess} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-600">Wallet Adicionada!</h3>
                <p className="text-sm text-gray-600">Sua wallet foi cadastrada com sucesso na whitelist.</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowWalletSuccess(false)} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm">
                <strong>Nome:</strong> Wallet adicionada
              </p>
              <p className="text-sm">
                <strong>Moeda:</strong> USDC
              </p>
              <p className="text-sm">
                <strong>Rede:</strong> TRON
              </p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Status:</strong> Sua wallet está pendente de aprovação. Você será notificado quando ela for
                ativada.
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => {
                setShowWalletSuccess(false)
                setIsAddWalletModalOpen(false)
              }}
            >
              Voltar à lista
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                setShowWalletSuccess(false)
                setIsAddWalletModalOpen(false)
              }}
            >
              Adicionar outra
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )

  const [turmas, setTurmas] = useState([
    {
      id: "1",
      nome: "Turma A - React Avançado",
      instrutor: "Prof. Carlos Silva",
      dataInicio: "2024-02-01",
      dataFim: "2024-05-30",
      linkFeedback: "https://forms.google.com/feedback-react",
      totalAulas: 20,
      aulasRealizadas: 12,
      mediaNotas: 8.5,
      mediaPresenca: 85,
      alunosInscritos: 0, // Adicionado campo alunosInscritos
      status: "ativa" as const,
      aulas: [
        {
          id: "a1",
          numero: 1,
          tema: "Introdução ao React Hooks",
          dataPrevista: "2024-02-01",
          status: "realizada" as const,
        },
        { id: "a2", numero: 2, tema: "useState e useEffect", dataPrevista: "2024-02-08", status: "realizada" as const },
        { id: "a3", numero: 3, tema: "Context API", dataPrevista: "2024-02-15", status: "pendente" as const },
      ],
    },
  ])
  const [selectedTurmaId, setSelectedTurmaId] = useState<string | null>(null)
  const [showTurmaDetail, setShowTurmaDetail] = useState(false)

  const handleAddTurma = (formData: any) => {
    const newTurma = {
      id: Date.now().toString(),
      nome: formData.nome,
      instrutor: formData.instrutor,
      dataInicio: formData.dataInicio,
      dataFim: formData.dataFim,
      linkFeedback: formData.linkFeedback,
      totalAulas: formData.aulas.length,
      aulasRealizadas: 0,
      mediaNotas: 0,
      mediaPresenca: 0,
      alunosInscritos: 0, // Adicionado campo alunosInscritos
      status: "em-breve" as const,
      aulas: formData.aulas.map((aula: any, index: number) => ({
        id: `aula-${Date.now()}-${index}`,
        numero: index + 1,
        tema: aula.tema,
        dataPrevista: aula.dataPrevista,
        status: "pendente" as const,
      })),
    }

    setTurmas([...turmas, newTurma])
    alert("Turma cadastrada com sucesso!")
  }

  const handleViewTurmaDetails = (turmaId: string) => {
    setSelectedTurmaId(turmaId)
    setShowTurmaDetail(true)
  }

  const handleBackToList = () => {
    setShowTurmaDetail(false)
    setSelectedTurmaId(null)
  }

  const handleCancelarAula = (aulaId: string, justificativa: string) => {
    setTurmas(
      turmas.map((turma) => {
        if (turma.id === selectedTurmaId) {
          return {
            ...turma,
            aulas: turma.aulas.map((aula) =>
              aula.id === aulaId
                ? { ...aula, status: "cancelada" as const, justificativaCancelamento: justificativa }
                : aula,
            ),
          }
        }
        return turma
      }),
    )
    alert("Aula cancelada com sucesso!")
  }

  const renderTurmas = () => {
    if (showTurmaDetail && selectedTurmaId) {
      const turma = turmas.find((t) => t.id === selectedTurmaId)
      if (turma) {
        return <TurmaDetail turma={turma} onBack={handleBackToList} onCancelarAula={handleCancelarAula} />
      }
    }

    return (
      <div className="space-y-6">
        <TurmasList turmas={turmas} onViewDetails={handleViewTurmaDetails} onAddTurma={handleAddTurma} />
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar activePage={activePage} setActivePage={setActivePage} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="ml-4">
            <span className="text-sm text-muted-foreground">Olá, João Silva</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-6">
          {activePage === "dashboard" && (
            <>
              {renderDashboard()}
              {/* Histórico de Transações */}
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Transações</CardTitle>
                  <CardDescription>Suas transações mais recentes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.slice(0, 4).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                            {transaction.type === "received" ? (
                              <ArrowDownLeft className="h-4 w-4 text-green-600" />
                            ) : transaction.type === "sent" ? (
                              <ArrowUpRight className="h-4 w-4 text-red-600" />
                            ) : (
                              <ArrowLeftRight className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {transaction.date} às {transaction.time}
                              {transaction.from && transaction.type === "received" && (
                                <span> • de {transaction.from}</span>
                              )}
                              {transaction.to && transaction.type === "sent" && <span> • para {transaction.to}</span>}
                              {transaction.type === "conversion" && (
                                <span>
                                  {" "}
                                  • {transaction.from} → {transaction.to}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-medium ${
                              transaction.type === "received"
                                ? "text-green-600"
                                : transaction.type === "sent"
                                  ? "text-red-600"
                                  : "text-blue-600"
                            }`}
                          >
                            {transaction.type === "received" ? "+" : transaction.type === "sent" ? "-" : ""}
                            {transaction.amount.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            {transaction.currency}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {transaction.type === "received"
                              ? "Recebida"
                              : transaction.type === "sent"
                                ? "Enviada"
                                : "Conversão"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activePage === "extrato" && renderExtrato()}
          {activePage === "configuracoes" && renderConfiguracoes()}
          {activePage === "wallet-whitelist" && renderWalletWhitelist()}
          {activePage === "admin" && <AdminDashboard />}
          {activePage === "turmas" && renderTurmas()}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
