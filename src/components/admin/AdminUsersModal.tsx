import React, { useState, useEffect } from 'react';
import { useAuth, UserProfile } from '../../context/AuthContext';
import {
  X,
  Users,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Trash2,
  Clock,
  UserCheck,
  AlertTriangle
} from 'lucide-react';

interface AdminUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminUsersModal: React.FC<AdminUsersModalProps> = ({ isOpen, onClose }) => {
  const { getRegisteredUsers, approveUser, rejectUser, deleteUser, user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    if (isOpen) {
      setUsers(getRegisteredUsers());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApprove = (id: string) => {
    approveUser(id);
    setUsers(getRegisteredUsers());
  };

  const handleReject = (id: string) => {
    rejectUser(id);
    setUsers(getRegisteredUsers());
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Deseja realmente remover o usuário "${name}"?`)) {
      deleteUser(id);
      setUsers(getRegisteredUsers());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <span>Gestão e Aprovação de Administradores</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Exclusivo Emerson
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Apenas você decide quem tem permissão para gerenciar e criar páginas no DigitalPay
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Regra de Segurança Ativa:</span>
              Quando uma nova pessoa se cadastrar na plataforma, a conta dela fica com o status <strong className="text-amber-400">"Pendente"</strong>. Ela não conseguirá ver os produtos nem o painel até que você clique no botão verde <strong>"Aprovar"</strong> abaixo.
            </div>
          </div>

          <div className="space-y-3">
            {users.map((u) => {
              const isMaster = u.role === 'super_admin' || u.email === 'emersontorres42@gmail.com';

              return (
                <div
                  key={u.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-sm shrink-0">
                      {u.name?.charAt(0).toUpperCase() || 'U'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{u.name}</span>
                        {isMaster && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                            Super Admin
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 block">{u.email}</span>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">
                        Cadastrado em: {new Date(u.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  {/* Status & Ações */}
                  <div className="flex items-center gap-2.5 self-end sm:self-auto">
                    {/* Badge de Status */}
                    {u.status === 'approved' && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Aprovado
                      </span>
                    )}

                    {u.status === 'pending' && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 animate-pulse">
                        <Clock className="w-3.5 h-3.5" />
                        Pendente
                      </span>
                    )}

                    {u.status === 'rejected' && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-950/50 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5" />
                        Bloqueado
                      </span>
                    )}

                    {/* Botões de Ação (Apenas para outros usuários, Emerson não pode ser bloqueado) */}
                    {!isMaster && (
                      <div className="flex items-center gap-1 pl-2 border-l border-slate-800">
                        {u.status !== 'approved' && (
                          <button
                            onClick={() => handleApprove(u.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Aprovar</span>
                          </button>
                        )}

                        {u.status === 'approved' && (
                          <button
                            onClick={() => handleReject(u.id)}
                            title="Bloquear Acesso"
                            className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(u.id, u.name)}
                          title="Remover Usuário"
                          className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

