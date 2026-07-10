import { useEffect, useState } from 'react';
import { 
  getAllInvitationsFromDb, 
  saveInvitationToDb,
  db
} from '../lib/firebase';
import { 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { WeddingInvitation } from '../types';
import { 
  Heart, Users, Shield, ArrowLeft, Search, 
  Check, X, Eye, Trash2, Edit2, RefreshCw, Smartphone
} from 'lucide-react';
import { templates } from '../data';

interface SuperAdminDashboardProps {
  onExit: () => void;
  onSelectInvitationForEdit: (invitation: WeddingInvitation) => void;
}

export default function SuperAdminDashboard({ onExit, onSelectInvitationForEdit }: SuperAdminDashboardProps) {
  const [invitations, setInvitations] = useState<WeddingInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending'>('all');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Load all invitations from Firestore on mount
  const loadInvitations = async () => {
    setIsLoading(true);
    try {
      const data = await getAllInvitationsFromDb();
      setInvitations(data);
    } catch (e) {
      console.error('Erro ao buscar convites do banco', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInvitations();
  }, []);

  const handleToggleActive = async (invite: WeddingInvitation) => {
    const updated = { ...invite, isPaid: !invite.isPaid };
    try {
      await saveInvitationToDb(updated);
      setInvitations(prev => prev.map(item => item.id === invite.id ? updated : item));
      showSuccess(`Status do convite de ${invite.coupleName1} & ${invite.coupleName2} alterado com sucesso!`);
    } catch (e) {
      console.error(e);
      alert('Erro ao atualizar status');
    }
  };

  const handleDeleteInvite = async (id: string, name: string) => {
    if (!window.confirm(`Tem certeza que deseja EXCLUIR permanentemente o convite de ${name}? Esta ação não pode ser desfeita.`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'invitations', id));
      setInvitations(prev => prev.filter(item => item.id !== id));
      showSuccess(`Convite de ${name} excluído permanentemente.`);
    } catch (e) {
      console.error(e);
      alert('Erro ao excluir convite');
    }
  };

  const showSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // Filters logic
  const filtered = invitations.filter(invite => {
    const searchString = `${invite.coupleName1} ${invite.coupleName2} ${invite.clientEmail} ${invite.slug}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'active') return matchesSearch && invite.isPaid;
    if (statusFilter === 'pending') return matchesSearch && !invite.isPaid;
    return matchesSearch;
  });

  const totalCount = invitations.length;
  const activeCount = invitations.filter(i => i.isPaid).length;
  const pendingCount = invitations.filter(i => !i.isPaid).length;

  return (
    <div className="min-h-screen bg-stone-900 text-stone-200 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <button 
              onClick={onExit}
              className="p-2 hover:bg-stone-800 rounded-full transition-colors border border-stone-800 cursor-pointer text-stone-400 hover:text-white"
              title="Voltar para a Landing Page"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-500 fill-amber-500/10" />
                <span className="text-xs font-mono uppercase tracking-widest text-amber-500">Painel Geral de Controle</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-wedding-serif">Administração Convitta</h1>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={loadInvitations}
              className="px-4 py-2 border border-stone-800 hover:bg-stone-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer text-stone-300"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-500' : ''}`} /> Atualizar Dados
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {actionSuccess && (
          <div className="bg-emerald-900/40 border border-emerald-500/30 text-emerald-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fadeIn shadow-lg">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Total de Clientes</p>
              <h3 className="text-3xl font-mono font-bold text-white mt-1">{isLoading ? '...' : totalCount}</h3>
            </div>
            <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 text-stone-400">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Ativos (Pagos)</p>
              <h3 className="text-3xl font-mono font-bold text-emerald-400 mt-1">{isLoading ? '...' : activeCount}</h3>
            </div>
            <div className="p-3 bg-emerald-950/40 border border-emerald-900/40 rounded-xl text-emerald-400">
              <Check className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Aguardando WhatsApp</p>
              <h3 className="text-3xl font-mono font-bold text-amber-400 mt-1">{isLoading ? '...' : pendingCount}</h3>
            </div>
            <div className="p-3 bg-amber-950/40 border border-amber-900/40 rounded-xl text-amber-400">
              <X className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filters and Search toolbar */}
        <div className="bg-stone-950 rounded-2xl border border-stone-800 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input 
              type="text"
              placeholder="Buscar por casal, e-mail do cliente ou slug..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
            />
          </div>

          <div className="flex gap-1.5 w-full md:w-auto">
            {(['all', 'active', 'pending'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === f 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                {f === 'all' ? 'Todos' : f === 'active' ? 'Ativos' : 'Aguardando'}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="bg-stone-950 rounded-2xl border border-stone-800 overflow-hidden shadow-xl">
          {isLoading ? (
            <div className="p-12 text-center text-stone-500 space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-amber-500 mx-auto" />
              <p className="text-sm">Carregando convites da nuvem...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-stone-500">
              <p className="text-sm">Nenhum convite encontrado na busca ou filtros.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-800 bg-stone-900/50 text-[11px] uppercase tracking-wider font-bold text-stone-400">
                    <th className="px-6 py-4">Noivos / Casal</th>
                    <th className="px-6 py-4">Contato (E-mail / WhatsApp)</th>
                    <th className="px-6 py-4">Modelo Escolhido</th>
                    <th className="px-6 py-4">Link do Convidado</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 text-sm">
                  {filtered.map(invite => {
                    const templateName = templates.find(t => t.id === invite.templateId)?.nome || invite.templateId;
                    const guestLink = `${window.location.origin}${window.location.pathname}?c=${invite.slug}`;
                    
                    return (
                      <tr key={invite.id} className="hover:bg-stone-900/30 transition-colors">
                        {/* Casal */}
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500/10 shrink-0" />
                            {invite.coupleName1} & {invite.coupleName2}
                          </div>
                          <div className="text-[11px] text-stone-500 mt-0.5 font-mono">
                            ID: {invite.id}
                          </div>
                        </td>

                        {/* Contato */}
                        <td className="px-6 py-4">
                          <div className="text-stone-300 font-mono text-xs">{invite.clientEmail}</div>
                          {invite.pixKey && (
                            <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                              <Smartphone className="w-3 h-3" /> Pix Key: {invite.pixKey}
                            </div>
                          )}
                        </td>

                        {/* Modelo */}
                        <td className="px-6 py-4 text-xs font-semibold text-amber-500/90">
                          {templateName}
                        </td>

                        {/* Guest Link */}
                        <td className="px-6 py-4 font-mono text-xs">
                          <a 
                            href={guestLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sky-400 hover:underline inline-flex items-center gap-1 break-all"
                          >
                            ?c={invite.slug} <Eye className="w-3 h-3 shrink-0" />
                          </a>
                        </td>

                        {/* Status (Paid / Pending) */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleActive(invite)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase cursor-pointer transition-colors ${
                              invite.isPaid 
                                ? 'bg-emerald-950 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/50' 
                                : 'bg-amber-950 border border-amber-500/30 text-amber-400 hover:bg-amber-900/50'
                            }`}
                            title="Clique para alternar o status de ativação"
                          >
                            {invite.isPaid ? '● Ativo (Pago)' : '○ Pendente (Draft)'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onSelectInvitationForEdit(invite)}
                              className="p-1.5 bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                              title="Editar este convite no painel de controle"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteInvite(invite.id, `${invite.coupleName1} & ${invite.coupleName2}`)}
                              className="p-1.5 bg-stone-900 border border-stone-800 hover:bg-red-950/50 text-stone-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                              title="Excluir convite permanentemente"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer info */}
        <p className="text-[11px] text-stone-600 text-center">
          🔒 Acesso administrativo restrito • Convitta de Alexandre Alves
        </p>
      </div>
    </div>
  );
}
