'use client';

import { useState, useEffect } from 'react';
import { useData } from '@/lib/data-context';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cadastroVoluntarioSchema, type CadastroVoluntarioFormData } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function NovoVoluntarioPage() {
  const { addInteressado } = useData();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cadastrarComoInstrutor = searchParams.get('cadastrarComoInstrutor') === 'true';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CadastroVoluntarioFormData>({
    resolver: zodResolver(cadastroVoluntarioSchema),
    defaultValues: {
      experienciaVoluntariado: false,
      deficienciaFisica: false,
      deficienciaIntelectual: false,
      necessidadeEspecial: false,
    },
  });

  const corRacaWatch = watch('corRaca');
  const experienciaWatch = watch('experienciaVoluntariado');
  const deficienciaFisicaWatch = watch('deficienciaFisica');
  const deficienciaIntelectualWatch = watch('deficienciaIntelectual');
  const necessidadeEspecialWatch = watch('necessidadeEspecial');

  const hasDeficiencia = deficienciaFisicaWatch || deficienciaIntelectualWatch || necessidadeEspecialWatch;

  const onSubmit = async (data: CadastroVoluntarioFormData) => {
    setIsSubmitting(true);
    try {
      // Calculate age from date of birth
      const birthDate = new Date(data.dataNascimento);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      const voluntarioId = `interessado-${Date.now()}`;
      const voluntarioData = {
        id: voluntarioId,
        tipo: 'voluntario' as const,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        idade: age,
        dataNascimento: data.dataNascimento,
        genero: data.genero,
        escolaridade: data.escolaridade,
        cursoInteresse: data.areaInteresse,
        endereco: data.endereco,
        motivoVoluntariado: data.motivoVoluntariado,
        habilidadesExperiencia: data.habilidadesExperiencia,
        nivelDisponibilidade: data.nivelDisponibilidade,
        experienciaVoluntariado: data.experienciaVoluntariado,
        detalhesExperienciaVoluntariado: data.detalhesExperienciaVoluntariado,
        corRaca: data.corRaca,
        etnia: data.etnia,
        deficienciaFisica: data.deficienciaFisica,
        deficienciaIntelectual: data.deficienciaIntelectual,
        necessidadeEspecial: data.necessidadeEspecial,
        especificacaoDeficiencia: data.especificacaoDeficiencia,
        origem: data.origem,
        status: 'novo' as const,
        dataRegistro: new Date().toISOString().split('T')[0],
      };

      addInteressado(voluntarioData);

      // Se deve cadastrar como instrutor, redireciona para página de cadastro de instrutor
      if (cadastrarComoInstrutor) {
        router.push(`/coordenador/instrutores/novo?voluntarioId=${voluntarioId}`);
      } else {
        router.push('/coordenador/interessados/voluntarios');
      }
    } catch (error) {
      console.error('Erro ao cadastrar voluntário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/coordenador/interessados/voluntarios">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            {cadastrarComoInstrutor ? 'Cadastrar Novo Instrutor' : 'Cadastrar Voluntário'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {cadastrarComoInstrutor
              ? 'Preencha os dados do voluntário que será cadastrado como instrutor'
              : 'Preencha os dados do novo voluntário'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
            <CardDescription>Informações básicas do voluntário</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">
                  Nome Completo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nome"
                  {...register('nome')}
                  className={errors.nome ? 'border-destructive' : ''}
                />
                {errors.nome && (
                  <p className="text-sm text-destructive">{errors.nome.message}</p>
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
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="endereco.cep">
                  CEP <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="endereco.cep"
                  {...register('endereco.cep')}
                  placeholder="00000000"
                  maxLength={8}
                  className={errors.endereco?.cep ? 'border-destructive' : ''}
                />
                {errors.endereco?.cep && (
                  <p className="text-sm text-destructive">{errors.endereco.cep.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco.rua">
                  Rua <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="endereco.rua"
                  {...register('endereco.rua')}
                  className={errors.endereco?.rua ? 'border-destructive' : ''}
                />
                {errors.endereco?.rua && (
                  <p className="text-sm text-destructive">{errors.endereco.rua.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco.numero">
                  Número <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="endereco.numero"
                  {...register('endereco.numero')}
                  className={errors.endereco?.numero ? 'border-destructive' : ''}
                />
                {errors.endereco?.numero && (
                  <p className="text-sm text-destructive">{errors.endereco.numero.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco.complemento">Complemento</Label>
                <Input
                  id="endereco.complemento"
                  {...register('endereco.complemento')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco.bairro">
                  Bairro <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="endereco.bairro"
                  {...register('endereco.bairro')}
                  className={errors.endereco?.bairro ? 'border-destructive' : ''}
                />
                {errors.endereco?.bairro && (
                  <p className="text-sm text-destructive">{errors.endereco.bairro.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco.cidade">
                  Cidade <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="endereco.cidade"
                  {...register('endereco.cidade')}
                  className={errors.endereco?.cidade ? 'border-destructive' : ''}
                />
                {errors.endereco?.cidade && (
                  <p className="text-sm text-destructive">{errors.endereco.cidade.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco.estado">
                  Estado <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="endereco.estado"
                  {...register('endereco.estado')}
                  placeholder="SP"
                  maxLength={2}
                  className={errors.endereco?.estado ? 'border-destructive' : ''}
                />
                {errors.endereco?.estado && (
                  <p className="text-sm text-destructive">{errors.endereco.estado.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voluntariado */}
        <Card>
          <CardHeader>
            <CardTitle>Informações de Voluntariado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="areaInteresse">
                Área de Interesse <span className="text-destructive">*</span>
              </Label>
              <Select onValueChange={(value) => setValue('areaInteresse', value)}>
                <SelectTrigger className={errors.areaInteresse ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Educação">Educação</SelectItem>
                  <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Administração">Administração</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
              {errors.areaInteresse && (
                <p className="text-sm text-destructive">{errors.areaInteresse.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="motivoVoluntariado">
                Motivo de Voluntariado <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="motivoVoluntariado"
                {...register('motivoVoluntariado')}
                placeholder="Descreva o motivo pelo qual deseja ser voluntário"
                rows={3}
                className={errors.motivoVoluntariado ? 'border-destructive' : ''}
              />
              {errors.motivoVoluntariado && (
                <p className="text-sm text-destructive">{errors.motivoVoluntariado.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="habilidadesExperiencia">
                Habilidades e Experiência Relevantes <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="habilidadesExperiencia"
                {...register('habilidadesExperiencia')}
                placeholder="Descreva suas habilidades e experiências que podem contribuir"
                rows={3}
                className={errors.habilidadesExperiencia ? 'border-destructive' : ''}
              />
              {errors.habilidadesExperiencia && (
                <p className="text-sm text-destructive">{errors.habilidadesExperiencia.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nivelDisponibilidade">
                Nível de Disponibilidade <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nivelDisponibilidade"
                {...register('nivelDisponibilidade')}
                placeholder="Ex: 4 horas por semana, Finais de semana, etc."
                className={errors.nivelDisponibilidade ? 'border-destructive' : ''}
              />
              {errors.nivelDisponibilidade && (
                <p className="text-sm text-destructive">{errors.nivelDisponibilidade.message}</p>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="experienciaVoluntariado"
                  onCheckedChange={(checked) => setValue('experienciaVoluntariado', !!checked)}
                />
                <Label htmlFor="experienciaVoluntariado" className="font-normal cursor-pointer">
                  Já teve experiência de voluntariado antes?
                </Label>
              </div>
              {experienciaWatch && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="detalhesExperienciaVoluntariado">Como foi a experiência?</Label>
                  <Textarea
                    id="detalhesExperienciaVoluntariado"
                    {...register('detalhesExperienciaVoluntariado')}
                    placeholder="Descreva sua experiência anterior"
                    rows={3}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Identificação Étnico-Racial */}
        <Card>
          <CardHeader>
            <CardTitle>Identificação Étnico-Racial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="corRaca">
                  Cor ou Raça <span className="text-destructive">*</span>
                </Label>
                <Select onValueChange={(value) => setValue('corRaca', value)}>
                  <SelectTrigger className={errors.corRaca ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="branca">Branca</SelectItem>
                    <SelectItem value="preta">Preta</SelectItem>
                    <SelectItem value="parda">Parda</SelectItem>
                    <SelectItem value="amarela">Amarela</SelectItem>
                    <SelectItem value="indigena">Indígena</SelectItem>
                  </SelectContent>
                </Select>
                {errors.corRaca && (
                  <p className="text-sm text-destructive">{errors.corRaca.message}</p>
                )}
              </div>
              {corRacaWatch === 'indigena' && (
                <div className="space-y-2">
                  <Label htmlFor="etnia">Etnia</Label>
                  <Input
                    id="etnia"
                    {...register('etnia')}
                    placeholder="Especifique a etnia"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Deficiências */}
        <Card>
          <CardHeader>
            <CardTitle>Deficiências e Necessidades Especiais</CardTitle>
            <CardDescription>Informe se possui alguma deficiência ou necessidade especial</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="deficienciaFisica"
                  onCheckedChange={(checked) => setValue('deficienciaFisica', !!checked)}
                />
                <Label htmlFor="deficienciaFisica" className="font-normal cursor-pointer">
                  Deficiência Física
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="deficienciaIntelectual"
                  onCheckedChange={(checked) => setValue('deficienciaIntelectual', !!checked)}
                />
                <Label htmlFor="deficienciaIntelectual" className="font-normal cursor-pointer">
                  Deficiência Intelectual
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="necessidadeEspecial"
                  onCheckedChange={(checked) => setValue('necessidadeEspecial', !!checked)}
                />
                <Label htmlFor="necessidadeEspecial" className="font-normal cursor-pointer">
                  Necessidade Especial
                </Label>
              </div>
              {hasDeficiencia && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="especificacaoDeficiencia">Especificar deficiência</Label>
                  <Textarea
                    id="especificacaoDeficiencia"
                    {...register('especificacaoDeficiencia')}
                    placeholder="Descreva a deficiência ou necessidade especial"
                    rows={3}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Origem */}
        <Card>
          <CardHeader>
            <CardTitle>Origem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="origem">
                Como encontrou o formulário de inscrição? <span className="text-destructive">*</span>
              </Label>
              <Select onValueChange={(value) => setValue('origem', value)}>
                <SelectTrigger className={errors.origem ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Site">Site</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="Google">Google</SelectItem>
                  <SelectItem value="Indicação">Indicação</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
              {errors.origem && (
                <p className="text-sm text-destructive">{errors.origem.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/coordenador/interessados/voluntarios">
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Cadastrando...
              </>
            ) : cadastrarComoInstrutor ? (
              'Cadastrar e Continuar para Instrutor'
            ) : (
              'Cadastrar Voluntário'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
