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
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  changePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  pendingCount: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_SESSION_KEY = 'digitalpay_current_session';
const LOCAL_STORAGE_USERS_DB = 'digitalpay_users_database';

// Super Admin inicial configurado
const MASTER_ADMIN: UserProfile = {
  id: 'e0000000-0000-0000-0000-000000000001',
  email: 'emersontorres42@gmail.com',
  name: 'Emerson Torres',
  role: 'super_admin',
  status: 'approved',
  password: '112212',
  created_at: new Date().toISOString(),
};

function getLocalUsers(): UserProfile[] {
  const raw = localStorage.getItem(LOCAL_STORAGE_USERS_DB);
  if (!raw) {
    const initialList = [MASTER_ADMIN];
    localStorage.setItem(LOCAL_STORAGE_USERS_DB, JSON.stringify(initialList));
    return initialList;
  }
  try {
    const list: UserProfile[] = JSON.parse(raw);
    if (!list.some(u => u.email.toLowerCase() === MASTER_ADMIN.email.toLowerCase())) {
      list.unshift(MASTER_ADMIN);
      localStorage.setItem(LOCAL_STORAGE_USERS_DB, JSON.stringify(list));
    }
    return list;
  } catch {
    return [MASTER_ADMIN];
  }
}

function saveLocalUsers(users: UserProfile[]) {
  localStorage.setItem(LOCAL_STORAGE_USERS_DB, JSON.stringify(users));
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);

  // Carrega e sincroniza usuários (Supabase + Local)
  const syncUsers = async () => {
    const supabase = getSupabaseClient();
    let users = getLocalUsers();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          users = data as UserProfile[];
          // Garante que o Emerson esteja sempre com a role super_admin
          if (!users.some(u => u.email.toLowerCase() === MASTER_ADMIN.email.toLowerCase())) {
            users.unshift(MASTER_ADMIN);
          }
          saveLocalUsers(users);
        }
      } catch (err) {
        console.warn('Erro ao sincronizar admin_users do Supabase:', err);
      }
    }

    setAllUsers(users);
    return users;
  };

  useEffect(() => {
    async function initAuth() {
      const users = await syncUsers();

      const savedSession = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
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
        setUser(null);
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

    // 1. Super Admin Emerson (sempre garantido)
    if (cleanEmail === MASTER_ADMIN.email.toLowerCase() && cleanPassword === MASTER_ADMIN.password) {
      setUser(MASTER_ADMIN);
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(MASTER_ADMIN));
      setLoading(false);
      return { success: true };
    }

    // 2. Consulta no Supabase ou Local
    const supabase = getSupabaseClient();
    let found: UserProfile | undefined;

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (!error && data) {
          found = data as UserProfile;
        }
      } catch (e) {
        console.warn('Falha ao consultar admin_users no Supabase:', e);
      }
    }

    if (!found) {
      const users = getLocalUsers();
      found = users.find(u => u.email.toLowerCase() === cleanEmail);
    }

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
        error: '⏳ Sua conta foi criada e está aguardando aprovação do administrador principal (Emerson). Tente novamente assim que seu acesso for liberado.',
      };
    }

    if (found.status === 'rejected') {
      setLoading(false);
      return {
        success: false,
        error: '⛔ Acesso negado ou revogado pelo administrador.',
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

    const users = getLocalUsers();
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
      status: 'pending', // Fica pendente aguardando Emerson aprovar!
      created_at: new Date().toISOString(),
    };

    // Salva no Supabase se disponível
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase.from('admin_users').insert(newUser);
        if (error) {
          console.error('Erro ao salvar usuário no Supabase:', error.message);
        }
      } catch (err) {
        console.warn('Falha ao inserir em admin_users no Supabase:', err);
      }
    }

    // Atualiza localmente
    const updated = [newUser, ...users];
    saveLocalUsers(updated);
    setAllUsers(updated);

    setLoading(false);
    return {
      success: true,
      message: '✅ Cadastro realizado com sucesso! Como medida de segurança, o seu acesso precisa ser aprovado pelo administrador Emerson.',
    };
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
  };

  // Funções exclusivas do Super Admin (Emerson)
  const getRegisteredUsers = () => {
    syncUsers();
    return allUsers.length > 0 ? allUsers : getLocalUsers();
  };

  const approveUser = async (userId: string) => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('admin_users').update({ status: 'approved' }).eq('id', userId);
      } catch (e) {
        console.warn('Erro ao aprovar no Supabase:', e);
      }
    }

    const list = getLocalUsers().map(u => (u.id === userId ? { ...u, status: 'approved' as UserStatus } : u));
    saveLocalUsers(list);
    setAllUsers(list);
  };

  const rejectUser = async (userId: string) => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('admin_users').update({ status: 'rejected' }).eq('id', userId);
      } catch (e) {
        console.warn('Erro ao rejeitar no Supabase:', e);
      }
    }

    const list = getLocalUsers().map(u => (u.id === userId ? { ...u, status: 'rejected' as UserStatus } : u));
    saveLocalUsers(list);
    setAllUsers(list);
  };

  const deleteUser = async (userId: string) => {
    if (userId === MASTER_ADMIN.id) return;

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('admin_users').delete().eq('id', userId);
      } catch (e) {
        console.warn('Erro ao deletar no Supabase:', e);
      }
    }

    const list = getLocalUsers().filter(u => u.id !== userId && u.email !== MASTER_ADMIN.email);
    saveLocalUsers(list);
    setAllUsers(list);
  };

  const changePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Usuário não autenticado.' };
    const clean = newPassword.trim();
    if (clean.length < 6) {
      return { success: false, error: 'A nova senha deve ter no mínimo 6 caracteres.' };
    }

    const updatedUser = { ...user, password: clean };

    // 1. Atualiza no localStorage
    const users = getLocalUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (idx >= 0) {
      users[idx] = updatedUser;
    } else {
      users.push(updatedUser);
    }
    saveLocalUsers(users);
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);

    // 2. Atualiza no Supabase se configurado
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from('admin_users')
          .update({ password: clean, updated_at: new Date().toISOString() })
          .eq('email', user.email);
      } catch (e) {
        console.warn('Erro ao atualizar senha no Supabase:', e);
      }
    }

    return { success: true };
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
        changePassword,
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
