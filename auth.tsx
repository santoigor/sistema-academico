"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, User, ArrowLeft, Eye, EyeOff } from "lucide-react"

interface AuthProps {
  onLogin: () => void
}

export default function Auth({ onLogin }: AuthProps) {
  const [currentView, setCurrentView] = useState<
    "login" | "register" | "register-type" | "register-pf" | "register-pj"
  >("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Estados para login
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  // Estados para cadastro PF
  const [registerPFData, setRegisterPFData] = useState({
    name: "",
    cpf: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // Estados para cadastro PJ
  const [registerPJData, setRegisterPJData] = useState({
    companyName: "",
    cnpj: "",
    corporateEmail: "",
    password: "",
    confirmPassword: "",
  })

  // Estados para erros
  const [loginErrors, setLoginErrors] = useState({
    email: "",
    password: "",
  })

  const [registerPFErrors, setRegisterPFErrors] = useState({
    name: "",
    cpf: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [registerPJErrors, setRegisterPJErrors] = useState({
    companyName: "",
    cnpj: "",
    corporateEmail: "",
    password: "",
    confirmPassword: "",
  })

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateCPF = (cpf: string) => {
    // Validação básica de CPF (apenas formato)
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
    return cpfRegex.test(cpf)
  }

  const validateCNPJ = (cnpj: string) => {
    // Validação básica de CNPJ (apenas formato)
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
    return cnpjRegex.test(cnpj)
  }

  const validateLogin = () => {
    const newErrors = {
      email: "",
      password: "",
    }

    if (!loginData.email) {
      newErrors.email = "Email é obrigatório"
    } else if (!validateEmail(loginData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!loginData.password) {
      newErrors.password = "Senha é obrigatória"
    }

    setLoginErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== "")
  }

  const validateRegisterPF = () => {
    const newErrors = {
      name: "",
      cpf: "",
      email: "",
      password: "",
      confirmPassword: "",
    }

    if (!registerPFData.name.trim()) {
      newErrors.name = "Nome completo é obrigatório"
    }

    if (!registerPFData.cpf) {
      newErrors.cpf = "CPF é obrigatório"
    } else if (!validateCPF(registerPFData.cpf)) {
      newErrors.cpf = "CPF inválido (formato: 000.000.000-00)"
    }

    if (!registerPFData.email) {
      newErrors.email = "Email é obrigatório"
    } else if (!validateEmail(registerPFData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!registerPFData.password) {
      newErrors.password = "Senha é obrigatória"
    } else if (registerPFData.password.length < 8) {
      newErrors.password = "Senha deve ter pelo menos 8 caracteres"
    }

    if (!registerPFData.confirmPassword) {
      newErrors.confirmPassword = "Confirmação de senha é obrigatória"
    } else if (registerPFData.password !== registerPFData.confirmPassword) {
      newErrors.confirmPassword = "Senhas não coincidem"
    }

    setRegisterPFErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== "")
  }

  const validateRegisterPJ = () => {
    const newErrors = {
      companyName: "",
      cnpj: "",
      corporateEmail: "",
      password: "",
      confirmPassword: "",
    }

    if (!registerPJData.companyName.trim()) {
      newErrors.companyName = "Nome da empresa é obrigatório"
    }

    if (!registerPJData.cnpj) {
      newErrors.cnpj = "CNPJ é obrigatório"
    } else if (!validateCNPJ(registerPJData.cnpj)) {
      newErrors.cnpj = "CNPJ inválido (formato: 00.000.000/0000-00)"
    }

    if (!registerPJData.corporateEmail) {
      newErrors.corporateEmail = "Email corporativo é obrigatório"
    } else if (!validateEmail(registerPJData.corporateEmail)) {
      newErrors.corporateEmail = "Email inválido"
    }

    if (!registerPJData.password) {
      newErrors.password = "Senha é obrigatória"
    } else if (registerPJData.password.length < 8) {
      newErrors.password = "Senha deve ter pelo menos 8 caracteres"
    }

    if (!registerPJData.confirmPassword) {
      newErrors.confirmPassword = "Confirmação de senha é obrigatória"
    } else if (registerPJData.password !== registerPJData.confirmPassword) {
      newErrors.confirmPassword = "Senhas não coincidem"
    }

    setRegisterPJErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== "")
  }

  const handleLogin = () => {
    if (validateLogin()) {
      // Simular login bem-sucedido
      onLogin()
    }
  }

  const handleRegisterPF = () => {
    if (validateRegisterPF()) {
      // Simular cadastro bem-sucedido
      alert("Conta criada com sucesso! Faça login para continuar.")
      setCurrentView("login")
      setRegisterPFData({
        name: "",
        cpf: "",
        email: "",
        password: "",
        confirmPassword: "",
      })
    }
  }

  const handleRegisterPJ = () => {
    if (validateRegisterPJ()) {
      // Simular cadastro bem-sucedido
      alert("Conta empresarial criada com sucesso! Faça login para continuar.")
      setCurrentView("login")
      setRegisterPJData({
        companyName: "",
        cnpj: "",
        corporateEmail: "",
        password: "",
        confirmPassword: "",
      })
    }
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Login */}
        {currentView === "login" && (
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex aspect-square size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Building2 className="size-6" />
                </div>
              </div>
              <CardTitle className="text-2xl">BancoMulti</CardTitle>
              <CardDescription>Faça login em sua conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={loginData.email}
                  onChange={(e) => {
                    setLoginData({ ...loginData, email: e.target.value })
                    if (loginErrors.email) setLoginErrors({ ...loginErrors, email: "" })
                  }}
                  className={loginErrors.email ? "border-red-500" : ""}
                />
                {loginErrors.email && <p className="text-sm text-red-500">{loginErrors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={loginData.password}
                    onChange={(e) => {
                      setLoginData({ ...loginData, password: e.target.value })
                      if (loginErrors.password) setLoginErrors({ ...loginErrors, password: "" })
                    }}
                    className={`pr-10 ${loginErrors.password ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {loginErrors.password && <p className="text-sm text-red-500">{loginErrors.password}</p>}
              </div>

              <Button onClick={handleLogin} className="w-full">
                Entrar
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Não tem uma conta?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-normal"
                    onClick={() => setCurrentView("register-type")}
                  >
                    Criar conta
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Escolha do tipo de cadastro */}
        {currentView === "register-type" && (
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex aspect-square size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Building2 className="size-6" />
                </div>
              </div>
              <CardTitle className="text-2xl">Criar Conta</CardTitle>
              <CardDescription>Escolha o tipo de conta que deseja criar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                onClick={() => setCurrentView("register-pf")}
                className="flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors hover:border-primary/50 hover:bg-primary/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Pessoa Física</h3>
                  <p className="text-sm text-muted-foreground">Conta individual para uso pessoal com CPF</p>
                </div>
              </div>

              <div
                onClick={() => setCurrentView("register-pj")}
                className="flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors hover:border-primary/50 hover:bg-primary/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Pessoa Jurídica</h3>
                  <p className="text-sm text-muted-foreground">Conta empresarial para negócios com CNPJ</p>
                </div>
              </div>

              <div className="text-center">
                <Button variant="link" className="p-0 h-auto font-normal" onClick={() => setCurrentView("login")}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Voltar ao login
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cadastro Pessoa Física */}
        {currentView === "register-pf" && (
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Pessoa Física</CardTitle>
              <CardDescription>Preencha seus dados pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  value={registerPFData.name}
                  onChange={(e) => {
                    setRegisterPFData({ ...registerPFData, name: e.target.value })
                    if (registerPFErrors.name) setRegisterPFErrors({ ...registerPFErrors, name: "" })
                  }}
                  className={registerPFErrors.name ? "border-red-500" : ""}
                />
                {registerPFErrors.name && <p className="text-sm text-red-500">{registerPFErrors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={registerPFData.cpf}
                  onChange={(e) => {
                    const formatted = formatCPF(e.target.value)
                    if (formatted.length <= 14) {
                      setRegisterPFData({ ...registerPFData, cpf: formatted })
                      if (registerPFErrors.cpf) setRegisterPFErrors({ ...registerPFErrors, cpf: "" })
                    }
                  }}
                  className={registerPFErrors.cpf ? "border-red-500" : ""}
                />
                {registerPFErrors.cpf && <p className="text-sm text-red-500">{registerPFErrors.cpf}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-pf">Email</Label>
                <Input
                  id="email-pf"
                  type="email"
                  placeholder="seu@email.com"
                  value={registerPFData.email}
                  onChange={(e) => {
                    setRegisterPFData({ ...registerPFData, email: e.target.value })
                    if (registerPFErrors.email) setRegisterPFErrors({ ...registerPFErrors, email: "" })
                  }}
                  className={registerPFErrors.email ? "border-red-500" : ""}
                />
                {registerPFErrors.email && <p className="text-sm text-red-500">{registerPFErrors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-pf">Senha</Label>
                <div className="relative">
                  <Input
                    id="password-pf"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={registerPFData.password}
                    onChange={(e) => {
                      setRegisterPFData({ ...registerPFData, password: e.target.value })
                      if (registerPFErrors.password) setRegisterPFErrors({ ...registerPFErrors, password: "" })
                    }}
                    className={`pr-10 ${registerPFErrors.password ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {registerPFErrors.password && <p className="text-sm text-red-500">{registerPFErrors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password-pf">Confirmar senha</Label>
                <div className="relative">
                  <Input
                    id="confirm-password-pf"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme sua senha"
                    value={registerPFData.confirmPassword}
                    onChange={(e) => {
                      setRegisterPFData({ ...registerPFData, confirmPassword: e.target.value })
                      if (registerPFErrors.confirmPassword)
                        setRegisterPFErrors({ ...registerPFErrors, confirmPassword: "" })
                    }}
                    className={`pr-10 ${registerPFErrors.confirmPassword ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {registerPFErrors.confirmPassword && (
                  <p className="text-sm text-red-500">{registerPFErrors.confirmPassword}</p>
                )}
              </div>

              <Button onClick={handleRegisterPF} className="w-full">
                Criar Conta
              </Button>

              <div className="text-center">
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal"
                  onClick={() => setCurrentView("register-type")}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cadastro Pessoa Jurídica */}
        {currentView === "register-pj" && (
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Pessoa Jurídica</CardTitle>
              <CardDescription>Preencha os dados da sua empresa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nome da Empresa</Label>
                <Input
                  id="company-name"
                  placeholder="Razão social da empresa"
                  value={registerPJData.companyName}
                  onChange={(e) => {
                    setRegisterPJData({ ...registerPJData, companyName: e.target.value })
                    if (registerPJErrors.companyName) setRegisterPJErrors({ ...registerPJErrors, companyName: "" })
                  }}
                  className={registerPJErrors.companyName ? "border-red-500" : ""}
                />
                {registerPJErrors.companyName && <p className="text-sm text-red-500">{registerPJErrors.companyName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  placeholder="00.000.000/0000-00"
                  value={registerPJData.cnpj}
                  onChange={(e) => {
                    const formatted = formatCNPJ(e.target.value)
                    if (formatted.length <= 18) {
                      setRegisterPJData({ ...registerPJData, cnpj: formatted })
                      if (registerPJErrors.cnpj) setRegisterPJErrors({ ...registerPJErrors, cnpj: "" })
                    }
                  }}
                  className={registerPJErrors.cnpj ? "border-red-500" : ""}
                />
                {registerPJErrors.cnpj && <p className="text-sm text-red-500">{registerPJErrors.cnpj}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="corporate-email">Email Corporativo</Label>
                <Input
                  id="corporate-email"
                  type="email"
                  placeholder="contato@empresa.com"
                  value={registerPJData.corporateEmail}
                  onChange={(e) => {
                    setRegisterPJData({ ...registerPJData, corporateEmail: e.target.value })
                    if (registerPJErrors.corporateEmail)
                      setRegisterPJErrors({ ...registerPJErrors, corporateEmail: "" })
                  }}
                  className={registerPJErrors.corporateEmail ? "border-red-500" : ""}
                />
                {registerPJErrors.corporateEmail && (
                  <p className="text-sm text-red-500">{registerPJErrors.corporateEmail}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-pj">Senha</Label>
                <div className="relative">
                  <Input
                    id="password-pj"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={registerPJData.password}
                    onChange={(e) => {
                      setRegisterPJData({ ...registerPJData, password: e.target.value })
                      if (registerPJErrors.password) setRegisterPJErrors({ ...registerPJErrors, password: "" })
                    }}
                    className={`pr-10 ${registerPJErrors.password ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {registerPJErrors.password && <p className="text-sm text-red-500">{registerPJErrors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password-pj">Confirmar Senha</Label>
                <div className="relative">
                  <Input
                    id="confirm-password-pj"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme sua senha"
                    value={registerPJData.confirmPassword}
                    onChange={(e) => {
                      setRegisterPJData({ ...registerPJData, confirmPassword: e.target.value })
                      if (registerPJErrors.confirmPassword)
                        setRegisterPJErrors({ ...registerPJErrors, confirmPassword: "" })
                    }}
                    className={`pr-10 ${registerPJErrors.confirmPassword ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {registerPJErrors.confirmPassword && (
                  <p className="text-sm text-red-500">{registerPJErrors.confirmPassword}</p>
                )}
              </div>

              <Button onClick={handleRegisterPJ} className="w-full">
                Criar Conta Empresarial
              </Button>

              <div className="text-center">
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal"
                  onClick={() => setCurrentView("register-type")}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
