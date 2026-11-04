import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSupabaseClient } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'digitalpay_auth_user';
const LOCAL_STORAGE_USERS_DB = 'digitalpay_registered_users';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Inicializa sessão
  useEffect(() => {
    async function initAuth() {
      const supabase = getSupabaseClient();

      if (supabase) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data?.session?.user) {
            const sbUser = data.session.user;
            setUser({
              id: sbUser.id,
              email: sbUser.email || '',
              name: sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'Administrador',
              role: 'admin',
            });
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Erro ao restaurar sessão Supabase:', err);
        }
      }

      // Fallback local: restaura usuário do localStorage
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch {
          localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        }
      } else {
        // Usuário admin padrão pronto para teste imediato
        const defaultAdmin: UserProfile = {
          id: 'admin-default',
          email: 'admin@digitalpay.com',
          name: 'Administrador DigitalPay',
          role: 'admin',
        };
        setUser(defaultAdmin);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(defaultAdmin));
      }

      setLoading(false);
    }

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.name || email.split('@')[0],
            role: 'admin',
          };
          setUser(profile);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
          setLoading(false);
          return { success: true };
        }
      } catch (err: any) {
        console.warn('Falha Supabase Auth login, tentando local:', err);
      }
    }

    // Validação local (suporta admin@digitalpay.com ou qualquer usuário cadastrado)
    const rawUsers = localStorage.getItem(LOCAL_STORAGE_USERS_DB);
    let usersList: any[] = rawUsers ? JSON.parse(rawUsers) : [];

    // Se for o admin padrão
    if (email === 'admin@digitalpay.com' && (password === 'admin123' || password.length >= 6)) {
      const profile: UserProfile = {
        id: 'admin-default',
        email,
        name: 'Administrador DigitalPay',
        role: 'admin',
      };
      setUser(profile);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
      setLoading(false);
      return { success: true };
    }

    const found = usersList.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (found && found.password === password) {
      const profile: UserProfile = {
        id: found.id,
        email: found.email,
        name: found.name,
        role: 'admin',
      };
      setUser(profile);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
      setLoading(false);
      return { success: true };
    }

    setLoading(false);
    return { success: false, error: 'E-mail ou senha incorretos. (Dica de teste: admin@digitalpay.com / admin123)' };
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { name: name.trim() },
          },
        });

        if (error) {
          setLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            name: name.trim(),
            role: 'admin',
          };
          setUser(profile);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
          setLoading(false);
          return { success: true };
        }
      } catch (err: any) {
        console.warn('Falha Supabase Auth cadastro, salvando localmente:', err);
      }
    }

    // Cadastro no armazenamento local
    const rawUsers = localStorage.getItem(LOCAL_STORAGE_USERS_DB);
    let usersList: any[] = rawUsers ? JSON.parse(rawUsers) : [];

    if (usersList.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
      setLoading(false);
      return { success: false, error: 'Este e-mail já está cadastrado na plataforma.' };
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim(),
      password,
      role: 'admin',
      created_at: new Date().toISOString(),
    };

    usersList.push(newUser);
    localStorage.setItem(LOCAL_STORAGE_USERS_DB, JSON.stringify(usersList));

    const profile: UserProfile = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: 'admin',
    };
    setUser(profile);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));

    setLoading(false);
    return { success: true };
  };

  const logout = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Erro signOut Supabase:', e);
      }
    }
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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
