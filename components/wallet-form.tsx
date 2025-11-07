"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Wallet } from "lucide-react"

const walletSchema = z.object({
  name: z.string().min(1, "Nome da wallet é obrigatório"),
  currency: z.string().min(1, "Selecione uma moeda"),
  network: z.string().min(1, "Selecione uma rede"),
})

type WalletFormData = z.infer<typeof walletSchema>

interface WalletFormProps {
  onSubmit: (data: WalletFormData) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function WalletForm({ onSubmit, isOpen, onOpenChange }: WalletFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<WalletFormData>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      name: "",
      currency: "",
      network: "",
    },
  })

  const currency = watch("currency")
  const network = watch("network")

  const onFormSubmit = (data: WalletFormData) => {
    onSubmit(data)
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Adicionar Wallet à Whitelist
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da wallet que deseja adicionar à lista de carteiras autorizadas
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="wallet-name">Nome da Wallet</Label>
            <Input
              id="wallet-name"
              placeholder="Ex: Minha Wallet Principal"
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="select-currency">Select Currency</Label>
            <Select value={currency} onValueChange={(value) => setValue("currency", value)}>
              <SelectTrigger className={errors.currency ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecione uma moeda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USDC">🔵 USDC</SelectItem>
                <SelectItem value="USDT">₮ USDT</SelectItem>
              </SelectContent>
            </Select>
            {errors.currency && <p className="text-sm text-red-500">{errors.currency.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="select-network">Select Network</Label>
            <Select value={network} onValueChange={(value) => setValue("network", value)}>
              <SelectTrigger className={errors.network ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecione uma rede" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TRON">🔴 TRON</SelectItem>
                <SelectItem value="ETH">⚡ Ethereum</SelectItem>
              </SelectContent>
            </Select>
            {errors.network && <p className="text-sm text-red-500">{errors.network.message}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Adicionar Wallet
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
