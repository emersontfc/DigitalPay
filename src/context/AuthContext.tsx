import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSupabaseClient } from '../lib/supabase';

export type UserRole = 'super_admin' | 'admin';
export type UserStatus = 'approved' | 'pending' | 'rejected';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  password?: string;
  created_at: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  logout: () => Promise<void>;
  
  // Gestão de Aprovações (para Emerson / Super Admin)
  getRegisteredUsers: () => UserProfile[];
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  deleteUser: (userId: string) => void;
  pendingCount: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_SESSION_KEY = 'digitalpay_current_session';
const LOCAL_STORAGE_USERS_DB = 'digitalpay_users_database';

// Super Admin inicial configurado
const MASTER_ADMIN: UserProfile = {
  id: 'master-emerson-001',
  email: 'emersontorres42@gmail.com',
  name: 'Emerson Torres',
  role: 'super_admin',
  status: 'approved',
  password: '112212',
  created_at: new Date().toISOString(),
};

function getStoredUsers(): UserProfile[] {
  const raw = localStorage.getItem(LOCAL_STORAGE_USERS_DB);
  if (!raw) {
    const initialList = [MASTER_ADMIN];
    localStorage.setItem(LOCAL_STORAGE_USERS_DB, JSON.stringify(initialList));
    return initialList;
  }
  try {
    const list: UserProfile[] = JSON.parse(raw);
    // Garante que o Emerson esteja sempre na lista com status aprovado
    if (!list.some(u => u.email.toLowerCase() === MASTER_ADMIN.email.toLowerCase())) {
      list.unshift(MASTER_ADMIN);
      localStorage.setItem(LOCAL_STORAGE_USERS_DB, JSON.stringify(list));
    }
    return list;
  } catch {
    return [MASTER_ADMIN];
  }
}

function saveStoredUsers(users: UserProfile[]) {
  localStorage.setItem(LOCAL_STORAGE_USERS_DB, JSON.stringify(users));
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);

  // Inicializa sessão
  useEffect(() => {
    function initAuth() {
      const users = getStoredUsers();
      setAllUsers(users);

      const savedSession = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          // Valida se o usuário ainda existe e está aprovado
          const current = users.find(u => u.id === parsed.id || u.email.toLowerCase() === parsed.email.toLowerCase());
          if (current && (current.status === 'approved' || current.role === 'super_admin')) {
            setUser(current);
          } else {
            localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
            setUser(null);
          }
        } catch {
          localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
          setUser(null);
        }
      } else {
        setUser(null); // Deslogado por padrão para proteger as rotas
      }

      setLoading(false);
    }

    initAuth();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; message?: string }> => {
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Verificação do Super Admin (Emerson)
    if (cleanEmail === MASTER_ADMIN.email.toLowerCase() && cleanPassword === MASTER_ADMIN.password) {
      setUser(MASTER_ADMIN);
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(MASTER_ADMIN));
      setLoading(false);
      return { success: true };
    }

    // 2. Verificação de outros usuários cadastrados
    const users = getStoredUsers();
    const found = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      setLoading(false);
      return { success: false, error: 'E-mail não cadastrado na plataforma.' };
    }

    if (found.password !== cleanPassword) {
      setLoading(false);
      return { success: false, error: 'Senha incorreta. Verifique suas credenciais.' };
    }

    // 3. Verificação de status de aprovação
    if (found.status === 'pending') {
      setLoading(false);
      return {
        success: false,
        error: '⏳ Sua conta foi criada e está aguardando aprovação do administrador principal (Emerson). Você terá acesso assim que for aprovado.',
      };
    }

    if (found.status === 'rejected') {
      setLoading(false);
      return {
        success: false,
        error: '⛔ Acesso revogado ou recusado pelo administrador da plataforma.',
      };
    }

    // Aprovado
    setUser(found);
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(found));
    setLoading(false);
    return { success: true };
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; message?: string }> => {
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPassword = password.trim();

    if (cleanEmail === MASTER_ADMIN.email.toLowerCase()) {
      setLoading(false);
      return { success: false, error: 'Este e-mail pertence ao administrador principal.' };
    }

    const users = getStoredUsers();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      setLoading(false);
      return { success: false, error: 'Este e-mail já está cadastrado no sistema.' };
    }

    const newUser: UserProfile = {
      id: crypto.randomUUID(),
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      role: 'admin',
      status: 'pending', // Fica pendente aguardando aprovação de Emerson!
      created_at: new Date().toISOString(),
    };

    const updated = [...users, newUser];
    saveStoredUsers(updated);
    setAllUsers(updated);

    setLoading(false);
    return {
      success: true,
      message: '✅ Conta criada com sucesso! Como medida de segurança, o acesso precisa ser aprovado pelo Emerson. Tente fazer login assim que for liberado.',
    };
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
  };

  // Funções exclusivas do Super Admin (Emerson)
  const getRegisteredUsers = () => {
    const list = getStoredUsers();
    setAllUsers(list);
    return list;
  };

  const approveUser = (userId: string) => {
    const list = getStoredUsers().map(u => (u.id === userId ? { ...u, status: 'approved' as UserStatus } : u));
    saveStoredUsers(list);
    setAllUsers(list);
  };

  const rejectUser = (userId: string) => {
    const list = getStoredUsers().map(u => (u.id === userId ? { ...u, status: 'rejected' as UserStatus } : u));
    saveStoredUsers(list);
    setAllUsers(list);
  };

  const deleteUser = (userId: string) => {
    // Não permite deletar o master admin
    const list = getStoredUsers().filter(u => u.id !== userId && u.email !== MASTER_ADMIN.email);
    saveStoredUsers(list);
    setAllUsers(list);
  };

  const pendingCount = allUsers.filter(u => u.status === 'pending').length;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        getRegisteredUsers,
        approveUser,
        rejectUser,
        deleteUser,
        pendingCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
