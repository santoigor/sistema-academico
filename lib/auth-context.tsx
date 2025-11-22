'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Usuario, AuthContextType } from './types';
import { mockUsuarios } from './mock-data';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um usuário salvo no localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, senha: string) => {
    // Mock login - em produção, fazer chamada à API
    const foundUser = mockUsuarios.find((u) => u.email === email);

    if (!foundUser) {
      throw new Error('Usuário não encontrado');
    }

    if (foundUser.status === 'bloqueado') {
      throw new Error('Usuário bloqueado');
    }

    // Mock: aceitar qualquer senha para demonstração
    // Em produção: validar senha hash

    setUser(foundUser);
    localStorage.setItem('currentUser', JSON.stringify(foundUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    // TODO: If logout becomes async, use await or callback pattern
  };

  if (isLoading) {
    return null; // ou um loading spinner
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
