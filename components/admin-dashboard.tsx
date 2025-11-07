"use client"

import { useState } from "react"
import {
  Shield,
  Users,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  FileText,
  UserCheck,
  UserX,
  MoreHorizontal,
  Eye,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Dados simulados de clientes
const mockCustomers = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@exemplo.com",
    status: "Active",
    balance: 15420.5,
    joinDate: "2023-03-15",
    lastActivity: "2024-01-15 14:30",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@exemplo.com",
    status: "Active",
    balance: 8750.25,
    joinDate: "2023-05-20",
    lastActivity: "2024-01-14 16:45",
  },
  {
    id: 3,
    name: "Pedro Costa",
    email: "pedro@exemplo.com",
    status: "Blocked",
    balance: 2340.8,
    joinDate: "2023-07-10",
    lastActivity: "2024-01-10 09:20",
  },
  {
    id: 4,
    name: "Ana Oliveira",
    email: "ana@exemplo.com",
    status: "Active",
    balance: 12890.75,
    joinDate: "2023-08-05",
    lastActivity: "2024-01-15 11:15",
  },
  {
    id: 5,
    name: "Carlos Ferreira",
    email: "carlos@exemplo.com",
    status: "Blocked",
    balance: 450.3,
    joinDate: "2023-09-12",
    lastActivity: "2024-01-08 13:40",
  },
]

// Dados simulados de transações por cliente
const mockTransactions = {
  1: [
    {
      id: 1,
      date: "2024-01-15",
      description: "Transferência recebida",
      type: "credit",
      amount: 1500.0,
    },
    {
      id: 2,
      date: "2024-01-14",
      description: "Pagamento enviado",
      type: "debit",
      amount: 250.0,
    },
    {
      id: 3,
      date: "2024-01-13",
      description: "Depósito",
      type: "credit",
      amount: 5000.0,
    },
  ],
  2: [
    {
      id: 4,
      date: "2024-01-14",
      description: "Transferência PIX",
      type: "debit",
      amount: 300.0,
    },
    {
      id: 5,
      date: "2024-01-13",
      description: "Recarga de conta",
      type: "credit",
      amount: 1000.0,
    },
  ],
  3: [
    {
      id: 6,
      date: "2024-01-10",
      description: "Saque",
      type: "debit",
      amount: 500.0,
    },
  ],
  4: [
    {
      id: 7,
      date: "2024-01-15",
      description: "Transferência internacional",
      type: "credit",
      amount: 2500.0,
    },
    {
      id: 8,
      date: "2024-01-14",
      description: "Pagamento de conta",
      type: "debit",
      amount: 180.5,
    },
  ],
  5: [
    {
      id: 9,
      date: "2024-01-08",
      description: "Transferência",
      type: "debit",
      amount: 100.0,
    },
  ],
}

export default function AdminDashboard() {
  const [customers, setCustomers] = useState(mockCustomers)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [actionType, setActionType] = useState("")

  // Filtrar clientes baseado no termo de pesquisa
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      case "Blocked":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Blocked
          </Badge>
        )
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  const handleViewCustomer = (customer) => {
    // Simular navegação para página do cliente
    window.location.href = `/admin/customer/${customer.id}`
  }

  const handleViewStatement = (customer) => {
    setSelectedCustomer(customer)
    setIsStatementModalOpen(true)
  }

  const handleStatusChange = (customer, action) => {
    setSelectedCustomer(customer)
    setActionType(action)
    setIsConfirmModalOpen(true)
  }

  const confirmStatusChange = () => {
    if (selectedCustomer && actionType) {
      const newStatus = actionType === "block" ? "Blocked" : "Active"
      setCustomers(
        customers.map((customer) =>
          customer.id === selectedCustomer.id ? { ...customer, status: newStatus } : customer,
        ),
      )
      setIsConfirmModalOpen(false)
      setSelectedCustomer(null)
      setActionType("")
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Gerencie clientes e monitore atividades da plataforma</p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Admin Access</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.filter((c) => c.status === "Active").length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((customers.filter((c) => c.status === "Active").length / customers.length) * 100)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Customers</CardTitle>
            <Ban className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.filter((c) => c.status === "Blocked").length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((customers.filter((c) => c.status === "Blocked").length / customers.length) * 100)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">💰</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(customers.reduce((sum, customer) => sum + customer.balance, 0))}
            </div>
            <p className="text-xs text-muted-foreground">Across all customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>View and manage customer accounts</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{getStatusBadge(customer.status)}</TableCell>
                  <TableCell className="font-mono">{formatCurrency(customer.balance)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewCustomer(customer)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Cliente
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewStatement(customer)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Ver Extrato
                        </DropdownMenuItem>
                        {customer.status === "Active" ? (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(customer, "block")}
                            className="text-red-600"
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Bloquear Cliente
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(customer, "unblock")}
                            className="text-green-600"
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Desbloquear Cliente
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Statement Modal */}
      <Dialog open={isStatementModalOpen} onOpenChange={setIsStatementModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Transaction History - {selectedCustomer?.name}
            </DialogTitle>
            <DialogDescription>
              Current Balance: {selectedCustomer && formatCurrency(selectedCustomer.balance)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedCustomer && mockTransactions[selectedCustomer.id] ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTransactions[selectedCustomer.id].map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <Badge
                          variant={transaction.type === "credit" ? "default" : "secondary"}
                          className={
                            transaction.type === "credit" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }
                        >
                          {transaction.type === "credit" ? "Credit" : "Debit"}
                        </Badge>
                      </TableCell>
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
            ) : (
              <div className="text-center py-8 text-muted-foreground">No transactions found for this customer.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <AlertDialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{actionType === "block" ? "Block Customer" : "Unblock Customer"}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {actionType} {selectedCustomer?.name}?
              {actionType === "block"
                ? " This will prevent them from accessing their account and making transactions."
                : " This will restore their access to the platform."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStatusChange}
              className={actionType === "block" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
            >
              {actionType === "block" ? "Block Customer" : "Unblock Customer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
