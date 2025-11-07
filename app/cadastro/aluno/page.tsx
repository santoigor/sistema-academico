'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cadastroAlunoInteressadoSchema, type CadastroAlunoInteressadoFormData } from '@/lib/schemas';
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
import { GraduationCap, Loader2, CheckCircle } from 'lucide-react';

export default function CadastroAlunoPublicoPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CadastroAlunoInteressadoFormData>({
    resolver: zodResolver(cadastroAlunoInteressadoSchema),
    defaultValues: {
      documentos: {
        identidade: false,
        comprovanteEscolaridade: false,
        comprovanteResidencia: false,
        outro: false,
      },
      informacoesCorretas: false,
    },
  });

  const corRacaWatch = watch('corRaca');

  useEffect(() => {
    // Validate token
    if (!token) {
      console.error('Token inválido');
    }
  }, [token]);

  const onSubmit = async (data: CadastroAlunoInteressadoFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log('Dados do cadastro:', data);
      console.log('Token:', token);

      setIsSuccess(true);
    } catch (error) {
      console.error('Erro ao enviar cadastro:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-12 pb-8 text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Cadastro Enviado!</h2>
            <p className="text-muted-foreground">
              Seu cadastro foi enviado com sucesso. Entraremos em contato em breve.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-semibold mb-2">Cadastro de Aluno</h1>
          <p className="text-muted-foreground">
            Preencha todos os campos para finalizar seu cadastro
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dados Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
              <CardDescription>Informações básicas do aluno</CardDescription>
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
                      <SelectItem value="Desenvolvimento Web Full Stack">Desenvolvimento Web Full Stack</SelectItem>
                      <SelectItem value="Design UX/UI">Design UX/UI</SelectItem>
                      <SelectItem value="Python para Data Science">Python para Data Science</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.cursoInteresse && (
                    <p className="text-sm text-destructive">{errors.cursoInteresse.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
              <CardDescription>Informações de localização</CardDescription>
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

          {/* Responsável */}
          <Card>
            <CardHeader>
              <CardTitle>Responsável</CardTitle>
              <CardDescription>Se menor de idade, informar dados do responsável</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="responsavelNome">Nome do Responsável</Label>
                  <Input
                    id="responsavelNome"
                    {...register('responsavelNome')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsavelParentesco">Parentesco</Label>
                  <Input
                    id="responsavelParentesco"
                    {...register('responsavelParentesco')}
                    placeholder="Ex: Pai, Mãe, Tutor"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contato de Emergência */}
          <Card>
            <CardHeader>
              <CardTitle>Contato de Emergência</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contatoEmergenciaNome">
                    Nome <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="contatoEmergenciaNome"
                    {...register('contatoEmergenciaNome')}
                    className={errors.contatoEmergenciaNome ? 'border-destructive' : ''}
                  />
                  {errors.contatoEmergenciaNome && (
                    <p className="text-sm text-destructive">{errors.contatoEmergenciaNome.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contatoEmergenciaTelefone">
                    Telefone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="contatoEmergenciaTelefone"
                    {...register('contatoEmergenciaTelefone')}
                    placeholder="(00) 00000-0000"
                    className={errors.contatoEmergenciaTelefone ? 'border-destructive' : ''}
                  />
                  {errors.contatoEmergenciaTelefone && (
                    <p className="text-sm text-destructive">{errors.contatoEmergenciaTelefone.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contatoEmergenciaParentesco">
                    Parentesco <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="contatoEmergenciaParentesco"
                    {...register('contatoEmergenciaParentesco')}
                    placeholder="Ex: Irmão, Tio, Amigo"
                    className={errors.contatoEmergenciaParentesco ? 'border-destructive' : ''}
                  />
                  {errors.contatoEmergenciaParentesco && (
                    <p className="text-sm text-destructive">{errors.contatoEmergenciaParentesco.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cor/Raça */}
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

          {/* Informações de Saúde */}
          <Card>
            <CardHeader>
              <CardTitle>Informações de Saúde</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alergias">Alergias</Label>
                <Textarea
                  id="alergias"
                  {...register('alergias')}
                  placeholder="Descreva se possui alguma alergia"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deficiencias">Deficiências</Label>
                <Textarea
                  id="deficiencias"
                  {...register('deficiencias')}
                  placeholder="Descreva se possui alguma deficiência"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Documentos */}
          <Card>
            <CardHeader>
              <CardTitle>Documentos Entregues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="documentos.identidade"
                  onCheckedChange={(checked) => setValue('documentos.identidade', !!checked)}
                />
                <Label htmlFor="documentos.identidade" className="font-normal cursor-pointer">
                  Identidade (RG ou CNH)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="documentos.comprovanteEscolaridade"
                  onCheckedChange={(checked) => setValue('documentos.comprovanteEscolaridade', !!checked)}
                />
                <Label htmlFor="documentos.comprovanteEscolaridade" className="font-normal cursor-pointer">
                  Comprovante de Escolaridade
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="documentos.comprovanteResidencia"
                  onCheckedChange={(checked) => setValue('documentos.comprovanteResidencia', !!checked)}
                />
                <Label htmlFor="documentos.comprovanteResidencia" className="font-normal cursor-pointer">
                  Comprovante de Residência
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="documentos.outro"
                  onCheckedChange={(checked) => setValue('documentos.outro', !!checked)}
                />
                <Label htmlFor="documentos.outro" className="font-normal cursor-pointer">
                  Outro
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Confirmação */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="informacoesCorretas"
                    onCheckedChange={(checked) => setValue('informacoesCorretas', !!checked)}
                    className={errors.informacoesCorretas ? 'border-destructive' : ''}
                  />
                  <Label htmlFor="informacoesCorretas" className="font-normal cursor-pointer">
                    Certifico que as informações acima estão corretas e atualizadas <span className="text-destructive">*</span>
                  </Label>
                </div>
                {errors.informacoesCorretas && (
                  <p className="text-sm text-destructive ml-6">{errors.informacoesCorretas.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button type="submit" size="lg" disabled={isSubmitting} className="min-w-[200px]">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Finalizar Cadastro'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
