'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Ementa,
  Turma,
  Aluno,
  Instrutor,
  Interessado,
  Curso,
} from './types';
import {
  mockEmentas as initialEmentas,
  mockTurmas as initialTurmas,
  mockAlunos as initialAlunos,
  mockInstrutores as initialInstrutores,
  mockInteressados as initialInteressados,
  mockCursos as initialCursos,
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

  // Cursos
  cursos: Curso[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Estado para cada entidade
  const [ementas, setEmentas] = useState<Ementa[]>(initialEmentas);
  const [turmas, setTurmas] = useState<Turma[]>(initialTurmas);
  const [alunos, setAlunos] = useState<Aluno[]>(initialAlunos);
  const [instrutores, setInstrutores] = useState<Instrutor[]>(initialInstrutores);
  const [interessados, setInteressados] = useState<Interessado[]>(initialInteressados);
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
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('academicData', JSON.stringify({
      ementas,
      turmas,
      alunos,
      instrutores,
      interessados,
    }));
  }, [ementas, turmas, alunos, instrutores, interessados]);

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
        cursos,
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
