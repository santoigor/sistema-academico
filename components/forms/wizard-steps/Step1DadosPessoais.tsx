'use client';

import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { InteressadoFormData } from '@/lib/schemas';
import type { Curso } from '@/lib/types';

interface Step1DadosPessoaisProps {
  register: UseFormRegister<InteressadoFormData>;
  errors: FieldErrors<InteressadoFormData>;
  setValue: UseFormSetValue<InteressadoFormData>;
  cursos: Curso[];
}

export function Step1DadosPessoais({ register, errors, setValue, cursos }: Step1DadosPessoaisProps) {
  return (
    <div className="space-y-2">
      <div className="text-center mb-1">
        <h3 className="font-semibold text-base">Quem é você?</h3>
        <p className="text-xs text-muted-foreground">Vamos começar com seus dados pessoais</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <div className="space-y-2">
          <Label htmlFor="nome">
            Nome Completo <span className="text-destructive">*</span>
          </Label>
          <Input
            id="nome"
            {...register('nome')}
            className={errors.nome ? 'border-destructive' : ''}
            placeholder="Digite seu nome completo"
          />
          {errors.nome && (
            <p className="text-sm text-destructive">{errors.nome.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">
            CPF <span className="text-destructive">*</span>
          </Label>
          <Input
            id="cpf"
            {...register('cpf')}
            placeholder="00000000000"
            maxLength={11}
            className={errors.cpf ? 'border-destructive' : ''}
          />
          {errors.cpf && (
            <p className="text-sm text-destructive">{errors.cpf.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            className={errors.email ? 'border-destructive' : ''}
            placeholder="seu@email.com"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefone">
            Telefone <span className="text-destructive">*</span>
          </Label>
          <Input
            id="telefone"
            {...register('telefone')}
            placeholder="(00) 00000-0000"
            className={errors.telefone ? 'border-destructive' : ''}
          />
          {errors.telefone && (
            <p className="text-sm text-destructive">{errors.telefone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataNascimento">
            Data de Nascimento <span className="text-destructive">*</span>
          </Label>
          <Input
            id="dataNascimento"
            type="date"
            {...register('dataNascimento')}
            className={errors.dataNascimento ? 'border-destructive' : ''}
          />
          {errors.dataNascimento && (
            <p className="text-sm text-destructive">{errors.dataNascimento.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="genero">
            Gênero <span className="text-destructive">*</span>
          </Label>
          <Select onValueChange={(value) => setValue('genero', value)}>
            <SelectTrigger className={errors.genero ? 'border-destructive' : ''}>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="masculino">Masculino</SelectItem>
              <SelectItem value="feminino">Feminino</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
              <SelectItem value="prefiro_nao_informar">Prefiro não informar</SelectItem>
            </SelectContent>
          </Select>
          {errors.genero && (
            <p className="text-sm text-destructive">{errors.genero.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="escolaridade">
            Escolaridade <span className="text-destructive">*</span>
          </Label>
          <Select onValueChange={(value) => setValue('escolaridade', value)}>
            <SelectTrigger className={errors.escolaridade ? 'border-destructive' : ''}>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fundamental_incompleto">Fundamental Incompleto</SelectItem>
              <SelectItem value="fundamental_completo">Fundamental Completo</SelectItem>
              <SelectItem value="medio_incompleto">Médio Incompleto</SelectItem>
              <SelectItem value="medio_completo">Médio Completo</SelectItem>
              <SelectItem value="superior_incompleto">Superior Incompleto</SelectItem>
              <SelectItem value="superior_completo">Superior Completo</SelectItem>
            </SelectContent>
          </Select>
          {errors.escolaridade && (
            <p className="text-sm text-destructive">{errors.escolaridade.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cursoInteresse">
            Curso de Interesse <span className="text-destructive">*</span>
          </Label>
          <Select onValueChange={(value) => setValue('cursoInteresse', value)}>
            <SelectTrigger className={errors.cursoInteresse ? 'border-destructive' : ''}>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {cursos.map((curso) => (
                <SelectItem key={curso.id} value={curso.nome}>
                  {curso.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.cursoInteresse && (
            <p className="text-sm text-destructive">{errors.cursoInteresse.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
