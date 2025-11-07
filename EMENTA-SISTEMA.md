# Sistema de Ementas - Documentação

## Visão Geral

O sistema de ementas foi implementado como uma entidade separada e independente das turmas, permitindo que múltiplas turmas utilizem a mesma ementa, e que coordenadores criem bibliotecas de ementas reutilizáveis.

## Estrutura de Dados

### Ementa
Uma ementa representa o currículo completo de um curso, contendo:

```typescript
interface Ementa {
  id: string;
  cursoId: string;
  curso: string; // Nome do curso
  titulo: string;
  descricao: string;
  cargaHorariaTotal: number;
  objetivosGerais: string[];
  competencias: string[];
  aulas: AulaEmenta[]; // Array de aulas planejadas
  materialDidatico?: string[];
  avaliacoes?: AvaliacaoEmenta[];
  prerequisitos?: string;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao?: string;
}
```

### AulaEmenta
Cada aula dentro de uma ementa:

```typescript
interface AulaEmenta {
  id: string;
  numero: number;
  titulo: string;
  tipo: 'teorica' | 'pratica' | 'avaliacao' | 'revisao';
  cargaHoraria: number; // em horas
  objetivos: string[];
  conteudo: string[];
  atividadesPraticas?: string[];
  recursos?: string[]; // materiais necessários
  observacoes?: string;
}
```

### AvaliacaoEmenta
Avaliações definidas na ementa:

```typescript
interface AvaliacaoEmenta {
  id: string;
  titulo: string;
  tipo: 'prova' | 'trabalho' | 'apresentacao' | 'projeto' | 'participacao';
  peso: number; // percentual da nota final (0-100)
  criterios?: string[];
  descricao?: string;
}
```

## Relação Ementa-Turma

### Antes
```typescript
interface Turma {
  cursoId: string;
  curso: string;
  // ... outros campos
}
```

### Depois
```typescript
interface Turma {
  cursoId: string;
  curso: string;
  ementaId: string; // ⭐ Novo campo obrigatório
  ementa: string;   // ⭐ Título da ementa
  // ... outros campos
}
```

## Fluxo de Criação de Turma

### 1. Criar Ementa (opcional)
O coordenador pode criar uma nova ementa em uma tela dedicada:

1. **Informações Gerais**
   - Selecionar curso
   - Título da ementa
   - Descrição
   - Carga horária total
   - Objetivos gerais
   - Competências a desenvolver
   - Pré-requisitos (opcional)

2. **Aulas** (array dinâmico)
   - Adicionar/remover aulas
   - Para cada aula:
     - Número sequencial
     - Título
     - Tipo (teórica, prática, avaliação, revisão)
     - Carga horária
     - Objetivos específicos
     - Conteúdo programático
     - Atividades práticas
     - Recursos necessários

3. **Avaliações** (opcional)
   - Adicionar/remover avaliações
   - Para cada avaliação:
     - Título
     - Tipo
     - Peso (% da nota final)
     - Critérios de avaliação

4. **Material Didático** (opcional)
   - Lista de materiais e recursos

### 2. Criar Turma
Ao criar uma turma, o coordenador deve:

1. **Selecionar Curso** (obrigatório)
2. **Selecionar Ementa** (obrigatório)
   - Opção A: Escolher ementa existente do curso
   - Opção B: Botão "Criar Nova Ementa" → abre modal/redireciona para tela de criação

3. Preencher demais informações da turma
4. Salvar

## Dados Mock Criados

### 3 Ementas Completas:

#### 1. Ementa Desenvolvimento Web - Turno Noite
- **Curso**: Desenvolvimento Web Full Stack
- **Carga Horária**: 120h
- **Aulas**: 5 aulas detalhadas
  - Introdução ao Desenvolvimento Web
  - HTML5 - Estrutura e Semântica
  - CSS3 - Estilização e Layout
  - JavaScript Fundamentos
  - Avaliação Módulo Front-end
- **Avaliações**: 3 tipos
  - Avaliação Front-end (30%)
  - Projeto Final (50%)
  - Participação (20%)

#### 2. Ementa Design UX/UI - Completo
- **Curso**: Design UX/UI
- **Carga Horária**: 80h
- **Aulas**: 3 aulas detalhadas
  - Introdução ao UX Design
  - Pesquisa com Usuários
  - Prototipagem no Figma
- **Avaliações**: 3 tipos
  - Projeto de Pesquisa (30%)
  - Protótipo Final (50%)
  - Apresentação (20%)

#### 3. Ementa Python Data Science - Intensivo
- **Curso**: Python para Data Science
- **Carga Horária**: 100h
- **Aulas**: 3 aulas detalhadas
  - Python Básico
  - Pandas - Manipulação de Dados
  - Visualização de Dados
- **Avaliações**: 3 tipos
  - Análise Exploratória (30%)
  - Projeto de Machine Learning (50%)
  - Apresentação de Resultados (20%)

## Schemas de Validação (Zod)

### ementaSchema
```typescript
const ementaSchema = z.object({
  cursoId: z.string().min(1, 'Selecione um curso'),
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  cargaHorariaTotal: z.number().min(1, 'Carga horária total é obrigatória'),
  objetivosGerais: z.array(z.string().min(1)).min(1, 'Adicione pelo menos um objetivo geral'),
  competencias: z.array(z.string().min(1)).min(1, 'Adicione pelo menos uma competência'),
  aulas: z.array(aulaEmentaSchema).min(1, 'Adicione pelo menos uma aula'),
  materialDidatico: z.array(z.string()).optional(),
  avaliacoes: z.array(avaliacaoEmentaSchema).optional(),
  prerequisitos: z.string().optional(),
});
```

### aulaEmentaSchema
```typescript
const aulaEmentaSchema = z.object({
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
```

### turmaSchema (atualizado)
```typescript
const turmaSchema = z.object({
  codigo: z.string().min(3, 'Código deve ter pelo menos 3 caracteres'),
  cursoId: z.string().min(1, 'Selecione um curso'),
  ementaId: z.string().min(1, 'Selecione uma ementa ou crie uma nova'), // ⭐ Novo
  instrutorId: z.string().min(1, 'Selecione um instrutor'),
  // ... demais campos
});
```

## Sistema de Gerenciamento de Estado

Foi criado um **DataContext** ([lib/data-context.tsx](lib/data-context.tsx)) que simula um backend completo com:

### Funcionalidades para Ementas:
```typescript
const {
  ementas,                    // Lista de ementas
  addEmenta,                  // Criar nova ementa
  updateEmenta,               // Atualizar ementa existente
  deleteEmenta,               // Remover ementa
  getEmenta,                  // Buscar ementa por ID
  getEmentasByCurso,          // Filtrar ementas por curso
} = useData();
```

### Funcionalidades para outras entidades:
- **Turmas**: addTurma, updateTurma, deleteTurma, getTurma
- **Alunos**: addAluno, updateAluno, deleteAluno, getAluno
- **Instrutores**: addInstrutor, updateInstrutor, deleteInstrutor, getInstrutor
- **Interessados**: addInteressado, updateInteressado, deleteInteressado

### Características:
- ✅ **Persistência**: Dados salvos no localStorage
- ✅ **Auto-incremento**: IDs gerados automaticamente com timestamp
- ✅ **Timestamps**: dataCriacao e dataAtualizacao automáticos
- ✅ **Validação**: Integrado com schemas Zod nos formulários
- ✅ **Estado global**: Acessível em toda aplicação via Context API

## Como Usar nos Componentes

### Exemplo: Criar Ementa
```typescript
'use client';

import { useData } from '@/lib/data-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ementaSchema, type EmentaFormData } from '@/lib/schemas';

export function EmentaForm() {
  const { addEmenta, cursos } = useData();

  const form = useForm<EmentaFormData>({
    resolver: zodResolver(ementaSchema),
    defaultValues: {
      aulas: [],
      objetivosGerais: [],
      competencias: [],
    }
  });

  const onSubmit = (data: EmentaFormData) => {
    const curso = cursos.find(c => c.id === data.cursoId);

    const novaEmenta = addEmenta({
      ...data,
      curso: curso?.nome || '',
      ativo: true,
    });

    console.log('Ementa criada:', novaEmenta);
    // Redirecionar ou mostrar sucesso
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Campos do formulário */}
    </form>
  );
}
```

### Exemplo: Selecionar Ementa na Criação de Turma
```typescript
'use client';

import { useData } from '@/lib/data-context';
import { useState } from 'react';

export function TurmaForm() {
  const { ementas, getEmentasByCurso, addTurma } = useData();
  const [cursoSelecionado, setCursoSelecionado] = useState('');

  const ementasDisponiveis = cursoSelecionado
    ? getEmentasByCurso(cursoSelecionado)
    : [];

  const handleCursoChange = (cursoId: string) => {
    setCursoSelecionado(cursoId);
    // Resetar ementa selecionada
  };

  return (
    <form>
      <select onChange={(e) => handleCursoChange(e.target.value)}>
        {/* Cursos */}
      </select>

      <select name="ementaId">
        {ementasDisponiveis.map(ementa => (
          <option key={ementa.id} value={ementa.id}>
            {ementa.titulo}
          </option>
        ))}
      </select>

      <button type="button" onClick={() => {/* Abrir modal criar ementa */}}>
        + Criar Nova Ementa
      </button>
    </form>
  );
}
```

## Benefícios da Arquitetura

### ✅ Reutilização
- Múltiplas turmas podem usar a mesma ementa
- Não precisa recriar conteúdo programático a cada turma

### ✅ Manutenção
- Atualizar ementa afeta todas as turmas futuras que a utilizarem
- Histórico preservado (ementas antigas continuam vinculadas a turmas antigas)

### ✅ Organização
- Biblioteca de ementas por curso
- Fácil comparar diferentes abordagens do mesmo curso

### ✅ Flexibilidade
- Coordenador pode criar variações de ementas (intensiva, noturna, etc.)
- Ementa pode evoluir sem afetar turmas já criadas

## Arquivos Criados/Modificados

### Criados:
- ✅ [lib/data-context.tsx](lib/data-context.tsx) - Context para gerenciamento de dados
- ✅ [EMENTA-SISTEMA.md](EMENTA-SISTEMA.md) - Esta documentação

### Modificados:
- ✅ [lib/types.ts](lib/types.ts) - Adicionados tipos Ementa, AulaEmenta, AvaliacaoEmenta; Turma atualizada
- ✅ [lib/schemas.ts](lib/schemas.ts) - Adicionados schemas ementaSchema, aulaEmentaSchema, avaliacaoEmentaSchema; turmaSchema atualizado
- ✅ [lib/mock-data.ts](lib/mock-data.ts) - Adicionados mockEmentas (3 ementas completas); mockTurmas atualizado
- ✅ [app/layout.tsx](app/layout.tsx) - Adicionado DataProvider envolvendo aplicação

## Próximos Passos

1. **Criar Telas de Ementas**
   - `/coordenador/ementas` - Lista de ementas
   - `/coordenador/ementas/nova` - Formulário de criação
   - `/coordenador/ementas/[id]` - Visualização/edição

2. **Criar Formulário de Ementa**
   - Componente com react-hook-form + Zod
   - Campos dinâmicos para aulas (adicionar/remover)
   - Campos dinâmicos para avaliações
   - Validação em tempo real

3. **Integrar na Criação de Turma**
   - Select de ementas filtrado por curso
   - Botão "Criar Nova Ementa" com modal ou redirecionamento
   - Pré-visualização da ementa selecionada

4. **Visualização de Ementa**
   - Card com informações resumidas
   - Lista de aulas expandível
   - Gráfico de distribuição de carga horária
   - Timeline de avaliações
