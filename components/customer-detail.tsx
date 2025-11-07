"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Shield,
  User,
  Mail,
  Calendar,
  Activity,
  Search,
  UserCheck,
  UserX,
  CheckCircle,
  XCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Dados simulados do cliente
const mockCustomer = {
  id: 1,
  name: "João Silva",
  email: "joao@exemplo.com",
  status: "Active",
  balance: 15420.5,
  joinDate: "2023-03-15",
  lastActivity: "2024-01-15 14:30",
  phone: "+55 11 99999-9999",
  document: "123.456.789-00",
}

// Dados simulados de transações expandidas
const mockTransactions = [
  {
    id: 1,
    date: "2024-01-15",
    description: "Transferência recebida de Maria Santos",
    type: "credit",
    amount: 1500.0,
    status: "completed",
    reference: "TXN001",
    origin: "Maria Santos",
    destination: "João Silva",
    currency: "BRL",
  },
  {
    id: 2,
    date: "2024-01-14",
    description: "Pagamento PIX enviado",
    type: "debit",
    amount: 250.0,
    status: "completed",
    reference: "TXN002",
    origin: "João Silva",
    destination: "Loja ABC",
    currency: "BRL",
  },
  {
    id: 3,
    date: "2024-01-13",
    description: "Depósito bancário",
    type: "credit",
    amount: 5000.0,
    status: "completed",
    reference: "TXN003",
    origin: "Banco XYZ",
    destination: "João Silva",
    currency: "BRL",
  },
  {
    id: 4,
    date: "2024-01-12",
    description: "Transferência internacional",
    type: "debit",
    amount: 800.0,
    status: "pending",
    reference: "TXN004",
    origin: "João Silva",
    destination: "John Doe (USA)",
    currency: "USD",
  },
  {
    id: 5,
    date: "2024-01-11",
    description: "Recarga de cartão",
    type: "debit",
    amount: 100.0,
    status: "completed",
    reference: "TXN005",
    origin: "João Silva",
    destination: "Cartão Virtual",
    currency: "BRL",
  },
  // Mais transações para demonstrar paginação
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 6,
    date: `2024-01-${String(10 - (i % 10)).padStart(2, "0")}`,
    description: `Transação ${i + 6}`,
    type: i % 2 === 0 ? "credit" : "debit",
    amount: Math.random() * 1000,
    status: "completed",
    reference: `TXN${String(i + 6).padStart(3, "0")}`,
    origin: i % 2 === 0 ? "Origem Externa" : "João Silva",
    destination: i % 2 === 0 ? "João Silva" : "Destino Externo",
    currency: "BRL",
  })),
]

interface CustomerDetailProps {
  customerId: string
}

export default function CustomerDetail({ customerId }: CustomerDetailProps) {
  const [customer, setCustomer] = useState(mockCustomer)
  const [transactions, setTransactions] = useState(mockTransactions)
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [actionType, setActionType] = useState("")

  const itemsPerPage = 10

  // Filtrar transações
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.destination.toLowerCase().includes(searchTerm.toLowerCase())

    const transactionDate = new Date(transaction.date)
    const matchesStartDate = !startDate || transactionDate >= new Date(startDate)
    const matchesEndDate = !endDate || transactionDate <= new Date(endDate)

    return matchesSearch && matchesStartDate && matchesEndDate
  })

  // Paginação
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage)

  const handleStatusChange = (action) => {
    setActionType(action)
    setIsConfirmModalOpen(true)
  }

  const confirmStatusChange = () => {
    const newStatus = actionType === "block" ? "Blocked" : "Active"
    setCustomer({ ...customer, status: newStatus })
    setIsConfirmModalOpen(false)
    setActionType("")
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Ativo
          </Badge>
        )
      case "Blocked":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Bloqueado
          </Badge>
        )
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>
    }
  }

  const getTransactionStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Concluída</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Falhou</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Detalhes do Cliente</h1>
          <p className="text-muted-foreground">Visualize e gerencie informações do cliente</p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Admin Access</span>
        </div>
      </div>

      {/* Customer Info Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cliente</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.name}</div>
            <p className="text-xs text-muted-foreground">ID: {customer.id}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">{getStatusBadge(customer.status)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Desde {new Date(customer.joinDate).toLocaleDateString("pt-BR")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">💰</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(customer.balance)}</div>
            <p className="text-xs text-muted-foreground">Atualizado em tempo real</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Details */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>Dados cadastrais do cliente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="grid gap-4 md:grid-cols-2 flex-1">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Membro desde:</span>
                <span className="text-sm">{new Date(customer.joinDate).toLocaleDateString("pt-BR")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Última atividade:</span>
                <span className="text-sm">{customer.lastActivity}</span>
              </div>
            </div>
            <div className="ml-4">
              {customer.status === "Active" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("block")}
                  className="text-red-600 hover:text-red-700"
                >
                  <UserX className="h-4 w-4 mr-1" />
                  Bloquear
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("unblock")}
                  className="text-green-600 hover:text-green-700"
                >
                  <UserCheck className="h-4 w-4 mr-1" />
                  Desbloquear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Histórico de Transações</CardTitle>
              <CardDescription>
                Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredTransactions.length)} de{" "}
                {filteredTransactions.length} transações
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-4 items-end mt-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar transações..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Input
                type="date"
                placeholder="Data início"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-40"
              />
            </div>
            <div>
              <Input
                type="date"
                placeholder="Data fim"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-40"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setStartDate("")
                setEndDate("")
                setCurrentPage(1)
              }}
            >
              Limpar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Referência</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.date).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="font-mono text-sm">{transaction.reference}</TableCell>
                  <TableCell>
                    <Badge
                      variant={transaction.type === "credit" ? "default" : "secondary"}
                      className={
                        transaction.type === "credit" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }
                    >
                      {transaction.type === "credit" ? "Crédito" : "Débito"}
                    </Badge>
                  </TableCell>
                  <TableCell>{getTransactionStatusBadge(transaction.status)}</TableCell>
                  <TableCell className="text-right font-mono">
                    <span className={transaction.type === "credit" ? "text-green-600" : "text-red-600"}>
                      {transaction.type === "credit" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber
                    if (totalPages <= 5) {
                      pageNumber = i + 1
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i
                    } else {
                      pageNumber = currentPage - 2 + i
                    }

                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNumber)}
                          isActive={currentPage === pageNumber}
                          className="cursor-pointer"
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <AlertDialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{actionType === "block" ? "Bloquear Cliente" : "Desbloquear Cliente"}</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja {actionType === "block" ? "bloquear" : "desbloquear"} {customer.name}?
              {actionType === "block"
                ? " Isso impedirá o acesso à conta e transações."
                : " Isso restaurará o acesso à plataforma."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStatusChange}
              className={actionType === "block" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
            >
              {actionType === "block" ? "Bloquear Cliente" : "Desbloquear Cliente"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
