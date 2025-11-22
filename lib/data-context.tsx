'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Ementa,
  Turma,
  Aluno,
  Instrutor,
  Interessado,
  Curso,
  DiarioAula,
  AnotacaoAluno,
  Usuario,
  AvaliacaoRealizada,
} from './types';
import {
  mockEmentas as initialEmentas,
  mockTurmas as initialTurmas,
  mockAlunos as initialAlunos,
  mockInstrutores as initialInstrutores,
  mockInteressados as initialInteressados,
  mockCursos as initialCursos,
  mockDiarios as initialDiarios,
  mockUsuarios as initialUsuarios,
} from './mock-data';

interface DataContextType {
  // Ementas
  ementas: Ementa[];
  addEmenta: (ementa: Omit<Ementa, 'id' | 'dataCriacao'>) => Ementa;
  updateEmenta: (id: string, ementa: Partial<Ementa>) => void;
  deleteEmenta: (id: string) => void;
  getEmenta: (id: string) => Ementa | undefined;
  getEmentasByCurso: (cursoId: string) => Ementa[];

  // Turmas
  turmas: Turma[];
  addTurma: (turma: Omit<Turma, 'id' | 'dataCriacao' | 'vagasOcupadas' | 'alunos'>) => Turma;
  updateTurma: (id: string, turma: Partial<Turma>) => void;
  deleteTurma: (id: string) => void;
  getTurma: (id: string) => Turma | undefined;

  // Alunos
  alunos: Aluno[];
  addAluno: (aluno: Omit<Aluno, 'id' | 'dataMatricula'>) => Aluno;
  updateAluno: (id: string, aluno: Partial<Aluno>) => void;
  deleteAluno: (id: string) => void;
  getAluno: (id: string) => Aluno | undefined;

  // Instrutores
  instrutores: Instrutor[];
  addInstrutor: (instrutor: Omit<Instrutor, 'id' | 'dataCadastro' | 'turmasAlocadas' | 'role'>) => Instrutor;
  updateInstrutor: (id: string, instrutor: Partial<Instrutor>) => void;
  deleteInstrutor: (id: string) => void;
  getInstrutor: (id: string) => Instrutor | undefined;

  // Interessados
  interessados: Interessado[];
  addInteressado: (interessado: Omit<Interessado, 'id' | 'dataRegistro'>) => Interessado;
  updateInteressado: (id: string, interessado: Partial<Interessado>) => void;
  deleteInteressado: (id: string) => void;

  // Diários
  diarios: DiarioAula[];
  addDiario: (diario: Omit<DiarioAula, 'id' | 'dataCriacao'>) => DiarioAula;
  updateDiario: (id: string, diario: Partial<DiarioAula>) => void;
  deleteDiario: (id: string) => void;
  getDiario: (id: string) => DiarioAula | undefined;
  getDiariosByTurma: (turmaId: string) => DiarioAula[];
  getDiariosByInstrutor: (instrutorId: string) => DiarioAula[];

  // Anotações
  anotacoes: AnotacaoAluno[];
  addAnotacao: (anotacao: Omit<AnotacaoAluno, 'id' | 'data'>) => AnotacaoAluno;
  updateAnotacao: (id: string, anotacao: Partial<AnotacaoAluno>) => void;
  deleteAnotacao: (id: string) => void;
  getAnotacoesByAluno: (alunoId: string) => AnotacaoAluno[];
  getAnotacoesByInstrutor: (instrutorId: string) => AnotacaoAluno[];

  // Avaliações Realizadas
  avaliacoes: AvaliacaoRealizada[];
  addAvaliacao: (avaliacao: Omit<AvaliacaoRealizada, 'id' | 'dataCriacao' | 'resultados'>) => AvaliacaoRealizada;
  updateAvaliacao: (id: string, avaliacao: Partial<AvaliacaoRealizada>) => void;
  deleteAvaliacao: (id: string) => void;
  getAvaliacao: (id: string) => AvaliacaoRealizada | undefined;
  getAvaliacoesByTurma: (turmaId: string) => AvaliacaoRealizada[];

  // Cursos
  cursos: Curso[];

  // Usuarios
  usuarios: Usuario[];
  addUsuario: (usuario: Usuario) => Usuario;
  updateUsuario: (id: string, usuario: Partial<Usuario>) => void;
  deleteUsuario: (id: string) => void;
  getUsuario: (id: string) => Usuario | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Estado para cada entidade
  const [ementas, setEmentas] = useState<Ementa[]>(initialEmentas);
  const [turmas, setTurmas] = useState<Turma[]>(initialTurmas);
  const [alunos, setAlunos] = useState<Aluno[]>(initialAlunos);
  const [instrutores, setInstrutores] = useState<Instrutor[]>(initialInstrutores);
  const [interessados, setInteressados] = useState<Interessado[]>(initialInteressados);
  const [diarios, setDiarios] = useState<DiarioAula[]>(initialDiarios);
  const [anotacoes, setAnotacoes] = useState<AnotacaoAluno[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoRealizada[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>(initialUsuarios);
  const [cursos] = useState<Curso[]>(initialCursos);

  // Persistir dados no localStorage
  useEffect(() => {
    const saved = localStorage.getItem('academicData');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.ementas) setEmentas(data.ementas);
      if (data.turmas) setTurmas(data.turmas);
      if (data.alunos) setAlunos(data.alunos);
      if (data.instrutores) setInstrutores(data.instrutores);
      if (data.interessados) setInteressados(data.interessados);
      if (data.diarios) setDiarios(data.diarios);
      if (data.anotacoes) setAnotacoes(data.anotacoes);
      if (data.avaliacoes) setAvaliacoes(data.avaliacoes);
      if (data.usuarios) setUsuarios(data.usuarios);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('academicData', JSON.stringify({
      ementas,
      turmas,
      alunos,
      instrutores,
      interessados,
      diarios,
      anotacoes,
      avaliacoes,
      usuarios,
    }));
  }, [ementas, turmas, alunos, instrutores, interessados, diarios, anotacoes, avaliacoes, usuarios]);

  // Funções de CRUD para Ementas
  const addEmenta = (ementaData: Omit<Ementa, 'id' | 'dataCriacao'>): Ementa => {
    const novaEmenta: Ementa = {
      ...ementaData,
      id: String(Date.now()),
      dataCriacao: new Date().toISOString().split('T')[0],
    };
    setEmentas(prev => [...prev, novaEmenta]);
    return novaEmenta;
  };

  const updateEmenta = (id: string, ementaData: Partial<Ementa>) => {
    setEmentas(prev => prev.map(e =>
      e.id === id ? { ...e, ...ementaData, dataAtualizacao: new Date().toISOString().split('T')[0] } : e
    ));
  };

  const deleteEmenta = (id: string) => {
    setEmentas(prev => prev.filter(e => e.id !== id));
  };

  const getEmenta = (id: string) => {
    return ementas.find(e => e.id === id);
  };

  const getEmentasByCurso = (cursoId: string) => {
    return ementas.filter(e => e.cursoId === cursoId && e.ativo);
  };

  // Funções de CRUD para Turmas
  const addTurma = (turmaData: Omit<Turma, 'id' | 'dataCriacao' | 'vagasOcupadas' | 'alunos'>): Turma => {
    const novaTurma: Turma = {
      ...turmaData,
      id: String(Date.now()),
      vagasOcupadas: 0,
      alunos: [],
      dataCriacao: new Date().toISOString().split('T')[0],
    };
    setTurmas(prev => [...prev, novaTurma]);
    return novaTurma;
  };

  const updateTurma = (id: string, turmaData: Partial<Turma>) => {
    setTurmas(prev => prev.map(t => t.id === id ? { ...t, ...turmaData } : t));
  };

  const deleteTurma = (id: string) => {
    setTurmas(prev => prev.filter(t => t.id !== id));
  };

  const getTurma = (id: string) => {
    return turmas.find(t => t.id === id);
  };

  // Funções de CRUD para Alunos
  const addAluno = (alunoData: Omit<Aluno, 'id' | 'dataMatricula'>): Aluno => {
    const novoAluno: Aluno = {
      ...alunoData,
      id: String(Date.now()),
      dataMatricula: new Date().toISOString().split('T')[0],
    };
    setAlunos(prev => [...prev, novoAluno]);
    return novoAluno;
  };

  const updateAluno = (id: string, alunoData: Partial<Aluno>) => {
    setAlunos(prev => prev.map(a => a.id === id ? { ...a, ...alunoData } : a));
  };

  const deleteAluno = (id: string) => {
    setAlunos(prev => prev.filter(a => a.id !== id));
  };

  const getAluno = (id: string) => {
    return alunos.find(a => a.id === id);
  };

  // Funções de CRUD para Instrutores
  const addInstrutor = (instrutorData: Omit<Instrutor, 'id' | 'dataCadastro' | 'turmasAlocadas' | 'role'>): Instrutor => {
    const novoInstrutor: Instrutor = {
      ...instrutorData,
      id: String(Date.now()),
      role: 'instrutor',
      turmasAlocadas: [],
      dataCadastro: new Date().toISOString().split('T')[0],
    };
    setInstrutores(prev => [...prev, novoInstrutor]);
    return novoInstrutor;
  };

  const updateInstrutor = (id: string, instrutorData: Partial<Instrutor>) => {
    setInstrutores(prev => prev.map(i => i.id === id ? { ...i, ...instrutorData } : i));
  };

  const deleteInstrutor = (id: string) => {
    setInstrutores(prev => prev.filter(i => i.id !== id));
  };

  const getInstrutor = (id: string) => {
    return instrutores.find(i => i.id === id);
  };

  // Funções de CRUD para Interessados
  const addInteressado = (interessadoData: Omit<Interessado, 'id' | 'dataRegistro'>): Interessado => {
    const novoInteressado: Interessado = {
      ...interessadoData,
      id: String(Date.now()),
      dataRegistro: new Date().toISOString().split('T')[0],
    };
    setInteressados(prev => [...prev, novoInteressado]);
    return novoInteressado;
  };

  const updateInteressado = (id: string, interessadoData: Partial<Interessado>) => {
    setInteressados(prev => prev.map(i => i.id === id ? { ...i, ...interessadoData } : i));
  };

  const deleteInteressado = (id: string) => {
    setInteressados(prev => prev.filter(i => i.id !== id));
  };

  // Funções de CRUD para Diários
  const addDiario = (diarioData: Omit<DiarioAula, 'id' | 'dataCriacao'>): DiarioAula => {
    const novoDiario: DiarioAula = {
      ...diarioData,
      id: String(Date.now()),
      dataCriacao: new Date().toISOString().split('T')[0],
    };
    setDiarios(prev => [...prev, novoDiario]);
    return novoDiario;
  };

  const updateDiario = (id: string, diarioData: Partial<DiarioAula>) => {
    setDiarios(prev => prev.map(d =>
      d.id === id ? { ...d, ...diarioData, dataAtualizacao: new Date().toISOString().split('T')[0] } : d
    ));
  };

  const deleteDiario = (id: string) => {
    setDiarios(prev => prev.filter(d => d.id !== id));
  };

  const getDiario = (id: string) => {
    return diarios.find(d => d.id === id);
  };

  const getDiariosByTurma = (turmaId: string) => {
    return diarios.filter(d => d.turmaId === turmaId).sort((a, b) =>
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  };

  const getDiariosByInstrutor = (instrutorId: string) => {
    return diarios.filter(d => d.instrutorId === instrutorId).sort((a, b) =>
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  };

  // Funções de CRUD para Anotações
  const addAnotacao = (anotacaoData: Omit<AnotacaoAluno, 'id' | 'data'>): AnotacaoAluno => {
    const novaAnotacao: AnotacaoAluno = {
      ...anotacaoData,
      id: String(Date.now()),
      data: new Date().toISOString().split('T')[0],
    };
    setAnotacoes(prev => [...prev, novaAnotacao]);
    return novaAnotacao;
  };

  const updateAnotacao = (id: string, anotacaoData: Partial<AnotacaoAluno>) => {
    setAnotacoes(prev => prev.map(a =>
      a.id === id ? { ...a, ...anotacaoData } : a
    ));
  };

  const deleteAnotacao = (id: string) => {
    setAnotacoes(prev => prev.filter(a => a.id !== id));
  };

  const getAnotacoesByAluno = (alunoId: string) => {
    return anotacoes.filter(a => a.alunoId === alunoId).sort((a, b) =>
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  };

  const getAnotacoesByInstrutor = (instrutorId: string) => {
    return anotacoes.filter(a => a.instrutorId === instrutorId).sort((a, b) =>
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  };

  // Funções de CRUD para Avaliações Realizadas
  const addAvaliacao = (avaliacaoData: Omit<AvaliacaoRealizada, 'id' | 'dataCriacao' | 'resultados'>): AvaliacaoRealizada => {
    const turma = turmas.find(t => t.id === avaliacaoData.turmaId);

    // Inicializar resultados com todos os alunos da turma
    const resultadosIniciais = turma?.alunos.map(alunoId => {
      const aluno = alunos.find(a => a.id === alunoId);
      return {
        alunoId,
        nota: undefined,
        observacoes: '',
        dataAvaliacao: undefined,
      };
    }) || [];

    const novaAvaliacao: AvaliacaoRealizada = {
      ...avaliacaoData,
      id: String(Date.now()),
      resultados: resultadosIniciais,
      dataCriacao: new Date().toISOString(),
    };

    setAvaliacoes(prev => [...prev, novaAvaliacao]);

    // Adicionar ID da avaliação ao array de avaliações da turma
    setTurmas(prev => prev.map(t =>
      t.id === avaliacaoData.turmaId
        ? { ...t, avaliacoes: [...(t.avaliacoes || []), novaAvaliacao.id] }
        : t
    ));

    return novaAvaliacao;
  };

  const updateAvaliacao = (id: string, avaliacaoData: Partial<AvaliacaoRealizada>) => {
    setAvaliacoes(prev => prev.map(a =>
      a.id === id
        ? { ...a, ...avaliacaoData, dataAtualizacao: new Date().toISOString() }
        : a
    ));
  };

  const deleteAvaliacao = (id: string) => {
    const avaliacao = avaliacoes.find(a => a.id === id);
    if (avaliacao) {
      // Remover ID da avaliação do array de avaliações da turma
      setTurmas(prev => prev.map(t =>
        t.id === avaliacao.turmaId
          ? { ...t, avaliacoes: (t.avaliacoes || []).filter(aId => aId !== id) }
          : t
      ));
    }
    setAvaliacoes(prev => prev.filter(a => a.id !== id));
  };

  const getAvaliacao = (id: string) => {
    return avaliacoes.find(a => a.id === id);
  };

  const getAvaliacoesByTurma = (turmaId: string) => {
    return avaliacoes.filter(a => a.turmaId === turmaId).sort((a, b) =>
      new Date(b.dataRealizacao).getTime() - new Date(a.dataRealizacao).getTime()
    );
  };

  // Funções de CRUD para Usuarios
  const addUsuario = (usuario: Usuario): Usuario => {
    setUsuarios(prev => [...prev, usuario]);
    return usuario;
  };

  const updateUsuario = (id: string, usuarioData: Partial<Usuario>) => {
    setUsuarios(prev => prev.map(u =>
      u.id === id ? { ...u, ...usuarioData, dataAtualizacao: new Date().toISOString() } : u
    ));
  };

  const deleteUsuario = (id: string) => {
    setUsuarios(prev => prev.filter(u => u.id !== id));
  };

  const getUsuario = (id: string) => {
    return usuarios.find(u => u.id === id);
  };

  return (
    <DataContext.Provider
      value={{
        ementas,
        addEmenta,
        updateEmenta,
        deleteEmenta,
        getEmenta,
        getEmentasByCurso,
        turmas,
        addTurma,
        updateTurma,
        deleteTurma,
        getTurma,
        alunos,
        addAluno,
        updateAluno,
        deleteAluno,
        getAluno,
        instrutores,
        addInstrutor,
        updateInstrutor,
        deleteInstrutor,
        getInstrutor,
        interessados,
        addInteressado,
        updateInteressado,
        deleteInteressado,
        diarios,
        addDiario,
        updateDiario,
        deleteDiario,
        getDiario,
        getDiariosByTurma,
        getDiariosByInstrutor,
        anotacoes,
        addAnotacao,
        updateAnotacao,
        deleteAnotacao,
        getAnotacoesByAluno,
        getAnotacoesByInstrutor,
        avaliacoes,
        addAvaliacao,
        updateAvaliacao,
        deleteAvaliacao,
        getAvaliacao,
        getAvaliacoesByTurma,
        cursos,
        usuarios,
        addUsuario,
        updateUsuario,
        deleteUsuario,
        getUsuario,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
