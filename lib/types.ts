// Sistema de Gestão Acadêmica - Tipos TypeScript

export type UserRole = 'admin' | 'coordenador' | 'instrutor';

export type StatusUsuario = 'ativo' | 'bloqueado' | 'inativo';

export type StatusTurma = 'planejada' | 'em_andamento' | 'finalizada' | 'cancelada';

export type StatusAluno = 'ativo' | 'inativo' | 'concluido' | 'evadido';

export type StatusInteressado = 'novo' | 'contatado' | 'matriculado' | 'desistente';

export type TipoAula = 'teorica' | 'pratica' | 'avaliacao' | 'revisao';

export type StatusPresenca = 'presente' | 'ausente' | 'abonado' | 'justificado';

// Usuários do Sistema
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  status: StatusUsuario;
  telefone?: string;
  foto?: string;
  dataCadastro: string;
  ultimoAcesso?: string;
}

export interface Coordenador extends Usuario {
  role: 'coordenador';
  departamento?: string;
}

export interface Instrutor extends Usuario {
  role: 'instrutor';
  especialidades: string[];
  biografia?: string;
  turmasAlocadas: string[]; // IDs das turmas
}

export interface Admin extends Usuario {
  role: 'admin';
  permissoes: string[];
}

// Curso
export interface Curso {
  id: string;
  nome: string;
  descricao: string;
  cargaHoraria: number;
  nivelEnsino: string;
  objetivos?: string[];
  conteudoProgramatico?: string[];
  ativo: boolean;
}

// Ementa (currículo detalhado do curso)
export interface Ementa {
  id: string;
  cursoId: string;
  curso: string; // Nome do curso
  titulo: string;
  descricao: string;
  cargaHorariaTotal: number;
  objetivosGerais: string[];
  aulas: AulaEmenta[];
  materialDidatico?: string[];
  avaliacoes?: AvaliacaoEmenta[];
  prerequisitos?: string;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao?: string;
}

// Aula dentro de uma Ementa
export interface AulaEmenta {
  id: string;
  numero: number;
  titulo: string;
  tipo: TipoAula;
  cargaHoraria: number; // em minutos ou horas
  objetivos: string[];
  conteudo: string[];
  atividadesPraticas?: string[];
  recursos?: string[]; // materiais, equipamentos necessários
  observacoes?: string;
}

// Avaliação definida na Ementa
export interface AvaliacaoEmenta {
  id: string;
  titulo: string;
  tipo: 'prova' | 'trabalho' | 'apresentacao' | 'projeto' | 'participacao';
  peso: number; // percentual da nota final
  criterios?: string[];
  descricao?: string;
}

// Turma
export interface Turma {
  id: string;
  codigo: string;
  ementaId: string; // ID da ementa associada
  ementa: string; // Título da ementa
  instrutorId: string;
  instrutor: string; // Nome do instrutor
  status: StatusTurma;
  dataInicio: string;
  dataFim: string;
  horario: string;
  diasSemana: string[];
  sala?: string;
  vagasTotal: number;
  vagasOcupadas: number;
  alunos: string[]; // IDs dos alunos
  observacoes?: string;
  dataCriacao: string;
}

// Aluno
export interface Aluno {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: string;
  endereco?: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  status: StatusAluno;
  turmaId?: string;
  turma?: string;
  dataMatricula: string;
  responsavel?: {
    nome: string;
    telefone: string;
    email: string;
    parentesco: string;
  };
  observacoes?: string;
  foto?: string;
}

// Interessado
export interface Interessado {
  id: string;
  tipo: 'voluntario' | 'aluno';
  nome: string;
  email: string;
  telefone: string;
  idade?: number;
  dataNascimento?: string;
  cpf?: string;
  genero?: string;
  escolaridade?: string;
  cursoInteresse: string; // Para alunos é curso de interesse, para voluntários é área de interesse
  endereco?: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  responsavel?: {
    nome: string;
    parentesco: string;
  };
  contatoEmergencia?: {
    nome: string;
    telefone: string;
    parentesco: string;
  };
  corRaca?: string;
  etnia?: string; // Se indigena
  alergias?: string;
  deficiencias?: string;
  informacoesCorretas?: boolean;
  documentosEntregues?: {
    identidade: boolean;
    comprovanteEscolaridade: boolean;
    comprovanteResidencia: boolean;
    outro: boolean;
  };
  // Campos específicos para voluntários
  motivoVoluntariado?: string;
  habilidadesExperiencia?: string;
  nivelDisponibilidade?: string;
  experienciaVoluntariado?: boolean;
  detalhesExperienciaVoluntariado?: string;
  deficienciaFisica?: boolean;
  deficienciaIntelectual?: boolean;
  necessidadeEspecial?: boolean;
  especificacaoDeficiencia?: string;
  status: StatusInteressado;
  dataRegistro: string;
  origem?: string; // Como encontrou o formulário
  observacoes?: string;
  dataContato?: string;
}

// Diário de Classe
export interface DiarioAula {
  id: string;
  turmaId: string;
  instrutorId: string;
  data: string;
  numeroAula: number;
  tipo: TipoAula;
  conteudo: string;
  resumo: string;
  observacoes?: string;
  presencas: RegistroPresenca[];
  dataCriacao: string;
  dataAtualizacao?: string;
}

export interface RegistroPresenca {
  alunoId: string;
  alunoNome: string;
  status: StatusPresenca;
  justificativa?: string;
  observacao?: string;
}

// Anotação do Aluno (pelo instrutor)
export interface AnotacaoAluno {
  id: string;
  alunoId: string;
  instrutorId: string;
  instrutorNome: string;
  turmaId: string;
  data: string;
  tipo: 'comportamento' | 'desempenho' | 'geral' | 'alerta';
  titulo: string;
  conteudo: string;
  privada: boolean; // Se true, apenas coordenadores e o instrutor podem ver
}

// Aula Cancelada
export interface AulaCancelada {
  id: string;
  turmaId: string;
  data: string;
  motivo: string;
  justificativa: string;
  reposicao?: {
    data: string;
    horario: string;
  };
  canceladoPor: string;
  dataCancelamento: string;
}

// Métricas e Estatísticas
export interface MetricasTurma {
  turmaId: string;
  totalAlunos: number;
  aulasRealizadas: number;
  aulasPlanejadas: number;
  taxaFrequencia: number;
  mediaPresenca: number;
  alunosAtivos: number;
  alunosEvadidos: number;
}

export interface MetricasGerais {
  totalTurmas: number;
  turmasAtivas: number;
  totalAlunos: number;
  alunosAtivos: number;
  totalInstrutores: number;
  instrutoresAtivos: number;
  totalInteressados: number;
  interessadosNovos: number;
  taxaConversao: number;
  taxaEvasao: number;
}

export interface MetricasInstrutor {
  instrutorId: string;
  turmasAtivas: number;
  totalAlunos: number;
  aulasMinistradas: number;
  mediaFrequencia: number;
  avaliacaoMedia?: number;
}

// Métricas Qualitativas
export interface MetricaQualitativa {
  id: string;
  alunoId: string;
  alunoNome: string;
  turmaId: string;
  turmaCodigo: string;
  dataResposta: string;
  // Satisfação
  satisfacaoCurso: 1 | 2 | 3 | 4 | 5; // 1 = Muito insatisfeito, 5 = Muito satisfeito
  // Autoavaliação
  segurancaFerramentasDigitais: 1 | 2 | 3 | 4 | 5; // 1 = Nenhuma segurança, 5 = Muito seguro
  habilidadeProgramacao: 1 | 2 | 3 | 4 | 5;
  // Empregabilidade
  candidatandoVagas: boolean;
  tipoOportunidade?: 'emprego' | 'freelancer' | 'processo_seletivo' | 'nenhuma';
  // Interesse em educação
  interesseCursoTecnico: boolean;
  interesseGraduacao: boolean;
  areaInteresse?: string;
}

// História de Aluno
export interface HistoriaAluno {
  id: string;
  alunoId: string;
  alunoNome: string;
  turmaId: string;
  turmaCodigo: string;
  titulo: string;
  historia: string;
  categoria: 'superacao' | 'conquista' | 'transformacao' | 'inspiracao' | 'outro';
  dataCompartilhamento: string;
  destacada: boolean;
  aprovada: boolean;
}

// Relatório
export interface Relatorio {
  id: string;
  tipo: 'mensal' | 'turma' | 'instrutor' | 'geral';
  titulo: string;
  periodo: {
    inicio: string;
    fim: string;
  };
  geradoPor: string;
  dataGeracao: string;
  dados: any; // Dados específicos do relatório
}

// Contexto de Autenticação
export interface AuthContextType {
  user: Usuario | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
