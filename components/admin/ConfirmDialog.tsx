'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Lock, Unlock, Trash2, LucideIcon } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  alertMessage?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'warning' | 'default';
  icon?: LucideIcon;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  alertMessage,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  icon: Icon,
  loading = false,
}: ConfirmDialogProps) {
  const getIconColor = () => {
    switch (variant) {
      case 'destructive':
        return 'text-destructive';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-blue-600';
    }
  };

  const getButtonVariant = () => {
    switch (variant) {
      case 'destructive':
        return 'destructive' as const;
      case 'warning':
        return 'default' as const;
      default:
        return 'default' as const;
    }
  };

  const getAlertVariant = () => {
    switch (variant) {
      case 'destructive':
        return 'destructive' as const;
      default:
        return 'default' as const;
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {Icon && <Icon className={`h-5 w-5 ${getIconColor()}`} />}
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {alertMessage && (
          <Alert variant={getAlertVariant()} className={variant === 'destructive' ? 'border-destructive/50' : ''}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={getButtonVariant()}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Processando...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Dialog específico para bloquear/desbloquear
interface BlockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isBlocked: boolean;
  userName: string;
  userType: 'coordenador' | 'instrutor';
}

export function BlockDialog({
  open,
  onOpenChange,
  onConfirm,
  isBlocked,
  userName,
  userType,
}: BlockDialogProps) {
  const action = isBlocked ? 'desbloquear' : 'bloquear';
  const actionCapitalized = isBlocked ? 'Desbloquear' : 'Bloquear';
  const userTypeLabel = userType === 'coordenador' ? 'coordenador' : 'instrutor';

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      title={`${actionCapitalized} ${userTypeLabel}`}
      description={`Tem certeza que deseja ${action} ${userName}?`}
      alertMessage={
        isBlocked
          ? `Ao desbloquear, ${userName} terá acesso novamente ao sistema.`
          : `Ao bloquear, ${userName} não poderá mais acessar o sistema até ser desbloqueado.`
      }
      confirmText={actionCapitalized}
      variant={isBlocked ? 'default' : 'warning'}
      icon={isBlocked ? Unlock : Lock}
    />
  );
}

// Dialog específico para excluir
interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  userName: string;
  userType: 'coordenador' | 'instrutor';
}

export function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  userName,
  userType,
}: DeleteDialogProps) {
  const userTypeLabel = userType === 'coordenador' ? 'coordenador' : 'instrutor';
  const userTypeArticle = userType === 'coordenador' ? 'este' : 'este';

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      title={`Excluir ${userTypeLabel}`}
      description={`Tem certeza que deseja excluir ${userName}?`}
      alertMessage={`Esta ação não pode ser desfeita. Todos os dados de ${userName} serão permanentemente removidos do sistema.`}
      confirmText="Excluir"
      variant="destructive"
      icon={Trash2}
    />
  );
}
