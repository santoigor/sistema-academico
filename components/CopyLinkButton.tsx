'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Link as LinkIcon, Check, Copy } from 'lucide-react';

interface CopyLinkButtonProps {
  linkPath: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonVariant?: 'default' | 'outline' | 'ghost' | 'outlinePrimary';
  buttonSize?: 'default' | 'sm' | 'lg';
  buttonClassName?: string;
}

export function CopyLinkButton({
  linkPath,
  title,
  description,
  buttonText = 'Gerar Link',
  buttonVariant = 'outlinePrimary',
  buttonSize = 'sm',
  buttonClassName = '',
}: CopyLinkButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState('');

  const handleGenerateLink = () => {
    if (typeof window !== 'undefined') {
      const baseUrl = window.location.origin;
      const fullLink = `${baseUrl}${linkPath}`;
      setLink(fullLink);
      setCopied(false);
    }
  };

  const handleCopyLink = async () => {
    if (link) {
      try {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (error) {
        console.error('Erro ao copiar link:', error);
      }
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      handleGenerateLink();
    } else {
      setLink('');
      setCopied(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize} className={buttonClassName}>
          <LinkIcon className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              value={link}
              readOnly
              className="font-mono text-sm"
            />
          </div>
          <Button
            type="button"
            size="sm"
            className="px-3"
            onClick={handleCopyLink}
            disabled={!link}
          >
            <span className="sr-only">Copiar</span>
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        {copied && (
          <p className="text-sm text-green-600 text-center">
            Link copiado para a área de transferência!
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Compartilhe este link para que as pessoas possam se cadastrar.
        </p>
      </DialogContent>
    </Dialog>
  );
}
