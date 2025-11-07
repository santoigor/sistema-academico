'use client';

import { use } from 'react';
import { useData } from '@/lib/data-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Heart,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  UserPlus,
} from 'lucide-react';
import type { Interessado } from '@/lib/types';

export default function VoluntarioDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { interessados } = useData();
  const router = useRouter();

  const voluntario = interessados.find((i) => i.id === resolvedParams.id && i.tipo === 'voluntario');

  if (!voluntario) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Voluntário não encontrado</h2>
        <p className="text-muted-foreground mb-4">
          O voluntário que você está procurando não existe ou foi removido.
        </p>
        <Link href="/coordenador/interessados/voluntarios">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Voluntários
          </Button>
        </Link>
      </div>
    );
  }

  const statusColors = {
    novo: 'default',
    contatado: 'accent',
    matriculado: 'success',
    desistente: 'destructive',
  } as const;

  const statusLabels = {
    novo: 'Novo',
    contatado: 'Contatado',
    matriculado: 'Ativo',
    desistente: 'Inativo',
  };

  const handleCadastrarInstrutor = () => {
    router.push(`/coordenador/instrutores/novo?voluntarioId=${voluntario.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/coordenador/interessados/voluntarios">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">{voluntario.nome}</h1>
            <p className="text-muted-foreground mt-1">Detalhes do voluntário</p>
          </div>
        </div>
        <Badge variant={statusColors[voluntario.status]} className="text-sm px-3 py-1">
          {statusLabels[voluntario.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dados Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Dados Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome Completo</p>
                  <p className="font-medium">{voluntario.nome}</p>
                </div>
                {voluntario.idade && (
                  <div>
                    <p className="text-sm text-muted-foreground">Idade</p>
                    <p className="font-medium">{voluntario.idade} anos</p>
                  </div>
                )}
                {voluntario.dataNascimento && (
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                    <p className="font-medium">
                      {new Date(voluntario.dataNascimento + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
                {voluntario.genero && (
                  <div>
                    <p className="text-sm text-muted-foreground">Gênero</p>
                    <p className="font-medium capitalize">{voluntario.genero.replace('_', ' ')}</p>
                  </div>
                )}
                {voluntario.escolaridade && (
                  <div>
                    <p className="text-sm text-muted-foreground">Escolaridade</p>
                    <p className="font-medium capitalize">{voluntario.escolaridade.replace(/_/g, ' ')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Informações de Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{voluntario.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{voluntario.telefone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          {voluntario.endereco && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Endereço
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">
                  {voluntario.endereco.rua}, {voluntario.endereco.numero}
                  {voluntario.endereco.complemento && ` - ${voluntario.endereco.complemento}`}
                </p>
                <p className="text-muted-foreground">
                  {voluntario.endereco.bairro}, {voluntario.endereco.cidade} - {voluntario.endereco.estado}
                </p>
                <p className="text-muted-foreground">CEP: {voluntario.endereco.cep}</p>
              </CardContent>
            </Card>
          )}

          {/* Informações de Voluntariado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Informações de Voluntariado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Área de Interesse</p>
                <p className="font-medium">{voluntario.cursoInteresse}</p>
              </div>
              {voluntario.motivoVoluntariado && (
                <div>
                  <p className="text-sm text-muted-foreground">Motivo de Voluntariado</p>
                  <p className="font-medium whitespace-pre-wrap">{voluntario.motivoVoluntariado}</p>
                </div>
              )}
              {voluntario.habilidadesExperiencia && (
                <div>
                  <p className="text-sm text-muted-foreground">Habilidades e Experiência Relevantes</p>
                  <p className="font-medium whitespace-pre-wrap">{voluntario.habilidadesExperiencia}</p>
                </div>
              )}
              {voluntario.nivelDisponibilidade && (
                <div>
                  <p className="text-sm text-muted-foreground">Nível de Disponibilidade</p>
                  <p className="font-medium">{voluntario.nivelDisponibilidade}</p>
                </div>
              )}
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Já teve experiência de voluntariado antes?</p>
                <div className="flex items-center gap-2">
                  {voluntario.experienciaVoluntariado ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Sim</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Não</span>
                    </>
                  )}
                </div>
              </div>
              {voluntario.experienciaVoluntariado && voluntario.detalhesExperienciaVoluntariado && (
                <div>
                  <p className="text-sm text-muted-foreground">Como foi a experiência?</p>
                  <p className="font-medium whitespace-pre-wrap">{voluntario.detalhesExperienciaVoluntariado}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Identificação Étnico-Racial */}
          {voluntario.corRaca && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Identificação Étnico-Racial
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cor ou Raça</p>
                  <p className="font-medium capitalize">{voluntario.corRaca}</p>
                </div>
                {voluntario.corRaca === 'indigena' && voluntario.etnia && (
                  <div>
                    <p className="text-sm text-muted-foreground">Etnia</p>
                    <p className="font-medium">{voluntario.etnia}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Deficiências e Necessidades Especiais */}
          {(voluntario.deficienciaFisica || voluntario.deficienciaIntelectual || voluntario.necessidadeEspecial || voluntario.especificacaoDeficiencia) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Deficiências e Necessidades Especiais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  {voluntario.deficienciaFisica ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">Deficiência Física</span>
                </div>
                <div className="flex items-center gap-2">
                  {voluntario.deficienciaIntelectual ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">Deficiência Intelectual</span>
                </div>
                <div className="flex items-center gap-2">
                  {voluntario.necessidadeEspecial ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">Necessidade Especial</span>
                </div>
                {voluntario.especificacaoDeficiencia && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Especificação</p>
                      <p className="font-medium whitespace-pre-wrap">{voluntario.especificacaoDeficiencia}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Data de Registro</p>
                <p className="font-medium">
                  {new Date(voluntario.dataRegistro + 'T00:00:00').toLocaleDateString('pt-BR')}
                </p>
              </div>
              {voluntario.dataContato && (
                <div>
                  <p className="text-sm text-muted-foreground">Data do Contato</p>
                  <p className="font-medium">
                    {new Date(voluntario.dataContato + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
              {voluntario.origem && (
                <div>
                  <p className="text-sm text-muted-foreground">Como Encontrou</p>
                  <p className="font-medium">{voluntario.origem}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Observações */}
          {voluntario.observacoes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{voluntario.observacoes}</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={handleCadastrarInstrutor}>
                <UserPlus className="h-4 w-4 mr-2" />
                Cadastrar como Instrutor
              </Button>
              <Button className="w-full" variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Enviar Email
              </Button>
              <Button className="w-full" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Fazer Chamada
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
