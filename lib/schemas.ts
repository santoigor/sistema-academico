// Schemas de validação com Zod para formulários

import { z } from 'zod';

// Schema para Aluno
export const alunoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido (formato: 000.000.000-00)'),
  dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  endereco: z.object({
    rua: z.string().min(3, 'Rua é obrigatória'),
    numero: z.string().min(1, 'Número é obrigatório'),
    complemento: z.string().optional(),
    bairro: z.string().min(2, 'Bairro é obrigatório'),
    cidade: z.string().min(2, 'Cidade é obrigatória'),
    estado: z.string().length(2, 'Estado deve ter 2 caracteres'),
    cep: z.string().regex(/^\d{5}-\d{3}$/, 'CEP inválido (formato: 00000-000)'),
  }).optional(),
  turmaId: z.string().optional(),
  responsavel: z.object({
    nome: z.string().min(3, 'Nome do responsável é obrigatório'),
    telefone: z.string().min(10, 'Telefone do responsável é obrigatório'),
    email: z.string().email('Email do responsável inválido'),
    parentesco: z.string().min(2, 'Parentesco é obrigatório'),
  }).optional(),
  observacoes: z.string().optional(),
});

export type AlunoFormData = z.infer<typeof alunoSchema>;

// Schema para Aula da Ementa
export const aulaEmentaSchema = z.object({
  numero: z.number().min(1, 'Número da aula é obrigatório'),
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  tipo: z.enum(['teorica', 'pratica', 'avaliacao', 'revisao']),
  cargaHoraria: z.number().min(1, 'Carga horária é obrigatória'),
  objetivos: z.array(z.string().min(1)).min(1, 'Adicione pelo menos um objetivo'),
  conteudo: z.array(z.string().min(1)).min(1, 'Adicione pelo menos um tópico de conteúdo'),
  atividadesPraticas: z.array(z.string()).optional(),
  recursos: z.array(z.string()).optional(),
  observacoes: z.string().optional(),
});

export type AulaEmentaFormData = z.infer<typeof aulaEmentaSchema>;

// Schema para Avaliação da Ementa
export const avaliacaoEmentaSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  tipo: z.enum(['prova', 'trabalho', 'apresentacao', 'projeto', 'participacao']),
  peso: z.number().min(0).max(100, 'Peso deve estar entre 0 e 100'),
  criterios: z.array(z.string()).optional(),
  descricao: z.string().optional(),
});

export type AvaliacaoEmentaFormData = z.infer<typeof avaliacaoEmentaSchema>;

// Schema para Ementa
export const ementaSchema = z.object({
  cursoId: z.string().min(1, 'Selecione um curso'),
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  cargaHorariaTotal: z.number().min(1, 'Carga horária total é obrigatória'),
  objetivosGerais: z.array(z.string().min(1)).min(1, 'Adicione pelo menos um objetivo geral'),
  aulas: z.array(aulaEmentaSchema).min(1, 'Adicione pelo menos uma aula'),
  materialDidatico: z.array(z.string()).optional(),
  avaliacoes: z.array(avaliacaoEmentaSchema).optional(),
  prerequisitos: z.string().optional(),
});

export type EmentaFormData = z.infer<typeof ementaSchema>;

// Schema para Turma
export const turmaSchema = z.object({
  codigo: z.string().min(3, 'Código deve ter pelo menos 3 caracteres'),
  ementaId: z.string().min(1, 'Selecione uma ementa'),
  instrutorId: z.string().min(1, 'Selecione um instrutor'),
  dataInicio: z.string().min(1, 'Data de início é obrigatória'),
  dataFim: z.string().min(1, 'Data de fim é obrigatória'),
  horario: z.string().min(1, 'Horário é obrigatório'),
  diasSemana: z.array(z.string()).min(1, 'Selecione pelo menos um dia da semana'),
  sala: z.string().optional(),
  vagasTotal: z.number().min(1, 'Número de vagas deve ser maior que 0'),
  observacoes: z.string().optional(),
});

export type TurmaFormData = z.infer<typeof turmaSchema>;

// Schema para Instrutor
export const instrutorSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  especialidades: z.array(z.string()).min(1, 'Selecione pelo menos uma especialidade'),
  biografia: z.string().optional(),
});

export type InstrutorFormData = z.infer<typeof instrutorSchema>;

// Schema para Coordenador
export const coordenadorSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  departamento: z.string().optional(),
});

export type CoordenadorFormData = z.infer<typeof coordenadorSchema>;

// Schema para Interessado
export const interessadoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  cursoInteresse: z.string().min(1, 'Selecione um curso de interesse'),
  origem: z.string().optional(),
  observacoes: z.string().optional(),
});

export type InteressadoFormData = z.infer<typeof interessadoSchema>;

// Schema para Cadastro Completo de Aluno Interessado
export const cadastroAlunoInteressadoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  cpf: z.string().min(11, 'CPF inválido'),
  genero: z.string().min(1, 'Selecione o gênero'),
  escolaridade: z.string().min(1, 'Selecione a escolaridade'),
  cursoInteresse: z.string().min(1, 'Selecione o curso de interesse'),
  endereco: z.object({
    rua: z.string().min(3, 'Rua é obrigatória'),
    numero: z.string().min(1, 'Número é obrigatório'),
    complemento: z.string().optional(),
    bairro: z.string().min(2, 'Bairro é obrigatório'),
    cidade: z.string().min(2, 'Cidade é obrigatória'),
    estado: z.string().length(2, 'Use a sigla do estado (ex: SP)'),
    cep: z.string().length(8, 'CEP deve ter 8 dígitos'),
  }),
  responsavelNome: z.string().optional(),
  responsavelParentesco: z.string().optional(),
  contatoEmergenciaNome: z.string().min(3, 'Nome do contato de emergência é obrigatório'),
  contatoEmergenciaTelefone: z.string().min(10, 'Telefone do contato de emergência é obrigatório'),
  contatoEmergenciaParentesco: z.string().min(1, 'Parentesco do contato de emergência é obrigatório'),
  corRaca: z.string().min(1, 'Selecione a cor/raça'),
  etnia: z.string().optional(),
  alergias: z.string().optional(),
  deficiencias: z.string().optional(),
  informacoesCorretas: z.boolean().refine((val) => val === true, {
    message: 'Você deve certificar que as informações estão corretas',
  }),
  documentos: z.object({
    identidade: z.boolean(),
    comprovanteEscolaridade: z.boolean(),
    comprovanteResidencia: z.boolean(),
    outro: z.boolean(),
  }),
});

export type CadastroAlunoInteressadoFormData = z.infer<typeof cadastroAlunoInteressadoSchema>;

// Schema para Cadastro de Voluntário
export const cadastroVoluntarioSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  genero: z.string().min(1, 'Selecione o gênero'),
  escolaridade: z.string().min(1, 'Selecione a escolaridade'),
  areaInteresse: z.string().min(1, 'Selecione a área de interesse'),
  endereco: z.object({
    rua: z.string().min(3, 'Rua é obrigatória'),
    numero: z.string().min(1, 'Número é obrigatório'),
    complemento: z.string().optional(),
    bairro: z.string().min(2, 'Bairro é obrigatório'),
    cidade: z.string().min(2, 'Cidade é obrigatória'),
    estado: z.string().length(2, 'Use a sigla do estado (ex: SP)'),
    cep: z.string().length(8, 'CEP deve ter 8 dígitos'),
  }),
  motivoVoluntariado: z.string().min(10, 'Descreva o motivo com pelo menos 10 caracteres'),
  habilidadesExperiencia: z.string().min(10, 'Descreva suas habilidades com pelo menos 10 caracteres'),
  nivelDisponibilidade: z.string().min(1, 'Informe o nível de disponibilidade'),
  experienciaVoluntariado: z.boolean(),
  detalhesExperienciaVoluntariado: z.string().optional(),
  corRaca: z.string().min(1, 'Selecione a cor/raça'),
  etnia: z.string().optional(),
  deficienciaFisica: z.boolean(),
  deficienciaIntelectual: z.boolean(),
  necessidadeEspecial: z.boolean(),
  especificacaoDeficiencia: z.string().optional(),
  origem: z.string().min(1, 'Informe como encontrou o formulário'),
});

export type CadastroVoluntarioFormData = z.infer<typeof cadastroVoluntarioSchema>;

// Schema para Diário de Classe
export const diarioAulaSchema = z.object({
  data: z.string().min(1, 'Data é obrigatória'),
  numeroAula: z.number().min(1, 'Número da aula é obrigatório'),
  tipo: z.enum(['teorica', 'pratica', 'avaliacao', 'revisao']),
  conteudo: z.string().min(10, 'Conteúdo deve ter pelo menos 10 caracteres'),
  resumo: z.string().min(10, 'Resumo deve ter pelo menos 10 caracteres'),
  observacoes: z.string().optional(),
  presencas: z.array(z.object({
    alunoId: z.string(),
    alunoNome: z.string(),
    status: z.enum(['presente', 'ausente', 'abonado', 'justificado']),
    justificativa: z.string().optional(),
    observacao: z.string().optional(),
  })),
});

export type DiarioAulaFormData = z.infer<typeof diarioAulaSchema>;

// Schema para Anotação do Aluno
export const anotacaoAlunoSchema = z.object({
  tipo: z.enum(['comportamento', 'desempenho', 'geral', 'alerta']),
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  conteudo: z.string().min(10, 'Conteúdo deve ter pelo menos 10 caracteres'),
  privada: z.boolean().default(false),
});

export type AnotacaoAlunoFormData = z.infer<typeof anotacaoAlunoSchema>;

// Schema para Cancelamento de Aula
export const cancelamentoAulaSchema = z.object({
  data: z.string().min(1, 'Data é obrigatória'),
  motivo: z.string().min(1, 'Selecione um motivo'),
  justificativa: z.string().min(10, 'Justificativa deve ter pelo menos 10 caracteres'),
  reposicao: z.object({
    data: z.string().min(1, 'Data de reposição é obrigatória'),
    horario: z.string().min(1, 'Horário de reposição é obrigatório'),
  }).optional(),
});

export type CancelamentoAulaFormData = z.infer<typeof cancelamentoAulaSchema>;

// Schema para Login
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
