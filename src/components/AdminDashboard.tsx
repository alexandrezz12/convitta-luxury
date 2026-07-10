import React, { useState } from 'react';
import { 
  Heart, Settings, Users, Gift, Layout, 
  Phone, Plus, Trash2, Eye, LogOut, Check, Save,
  PieChart as PieIcon, BarChart2, Search, Download
} from 'lucide-react';
import { WeddingInvitation, GiftItem } from '../types';
import { templates } from '../data';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';

interface AdminDashboardProps {
  invitation: WeddingInvitation;
  onUpdateInvitation: (updated: WeddingInvitation) => void;
  onExitDashboard: () => void;
  onViewGuestInvite: () => void;
}

type TabType = 'overview' | 'edit-details' | 'guests' | 'gifts';

export default function AdminDashboard({
  invitation,
  onUpdateInvitation,
  onExitDashboard,
  onViewGuestInvite
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // States for Editing invitation details
  const [coupleName1, setCoupleName1] = useState(invitation.coupleName1);
  const [coupleLastName1, setCoupleLastName1] = useState(invitation.coupleLastName1 || '');
  const [coupleName2, setCoupleName2] = useState(invitation.coupleName2);
  const [coupleLastName2, setCoupleLastName2] = useState(invitation.coupleLastName2 || '');
  const [date, setDate] = useState(invitation.date);
  const [time, setTime] = useState(invitation.time);
  const [locationName, setLocationName] = useState(invitation.locationName);
  const [locationAddress, setLocationAddress] = useState(invitation.locationAddress);
  const [dressCode, setDressCode] = useState(invitation.dressCode || '');
  const [historyTitle, setHistoryTitle] = useState(invitation.historyTitle || '');
  const [historyText, setHistoryText] = useState(invitation.historyText || '');
  const [pixKey, setPixKey] = useState(invitation.pixKey);
  const [pixHolder, setPixHolder] = useState(invitation.pixHolder);
  const [selectedTemplateId, setSelectedTemplateId] = useState(invitation.templateId);

  // States for search and lists
  const [guestSearch, setGuestSearch] = useState('');
  const [guestFilter, setGuestFilter] = useState<'all' | 'attending' | 'declined'>('all');

  // Custom Gift form state
  const [newGiftName, setNewGiftName] = useState('');
  const [newGiftPrice, setNewGiftPrice] = useState('');
  const [newGiftDesc, setNewGiftDesc] = useState('');
  const [newGiftCategory, setNewGiftCategory] = useState('Lua de Mel');

  const activeTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  // Helper calculation stats
  const totalGuests = invitation.rsvps.reduce((acc, curr) => acc + 1 + (curr.totalCompanions || 0), 0);
  const confirmedAttending = invitation.rsvps
    .filter(r => r.isAttending)
    .reduce((acc, curr) => acc + 1 + (curr.totalCompanions || 0), 0);
  const declinedCount = invitation.rsvps.filter(r => !r.isAttending).length;

  const totalGiftsReceived = invitation.gifts
    .filter(g => g.bought)
    .reduce((acc, curr) => acc + curr.price, 0);

  // Chart Data preparation
  const rsvpPieData = [
    { name: 'Confirmados', value: confirmedAttending, color: '#10b981' },
    { name: 'Recusados', value: declinedCount, color: '#ef4444' }
  ];

  // Gifts by category chart
  const categoriesMap: Record<string, number> = {};
  invitation.gifts.filter(g => g.bought).forEach(g => {
    categoriesMap[g.category] = (categoriesMap[g.category] || 0) + g.price;
  });
  const giftBarData = Object.keys(categoriesMap).map(cat => ({
    name: cat,
    valor: categoriesMap[cat]
  }));

  const handleSaveChanges = () => {
    const updated: WeddingInvitation = {
      ...invitation,
      coupleName1,
      coupleLastName1,
      coupleName2,
      coupleLastName2,
      date,
      time,
      locationName,
      locationAddress,
      dressCode,
      historyTitle,
      historyText,
      pixKey,
      pixHolder,
      templateId: selectedTemplateId
    };
    onUpdateInvitation(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Add custom gift item to database simulation
  const handleAddGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGiftName || !newGiftPrice) return;

    const newGift: GiftItem = {
      id: `custom-gift-${Date.now()}`,
      name: newGiftName,
      price: parseFloat(newGiftPrice),
      description: newGiftDesc,
      category: newGiftCategory,
      imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=200&auto=format&fit=crop',
      totalContributions: 0,
      bought: false
    };

    const updated: WeddingInvitation = {
      ...invitation,
      gifts: [newGift, ...invitation.gifts]
    };
    onUpdateInvitation(updated);
    setNewGiftName('');
    setNewGiftPrice('');
    setNewGiftDesc('');
  };

  // Delete RSVP Simulation
  const handleDeleteRSVP = (id: string) => {
    const updated: WeddingInvitation = {
      ...invitation,
      rsvps: invitation.rsvps.filter(r => r.id !== id)
    };
    onUpdateInvitation(updated);
  };

  // Delete Gift simulation
  const handleDeleteGift = (id: string) => {
    const updated: WeddingInvitation = {
      ...invitation,
      gifts: invitation.gifts.filter(g => g.id !== id)
    };
    onUpdateInvitation(updated);
  };

  // Simulated Excel/CSV text copy
  const handleExportGuests = () => {
    const headers = 'Nome,Presença,WhatsApp,Acompanhantes,Restrições,Mensagem\n';
    const rows = invitation.rsvps.map(r => 
      `"${r.name}","${r.isAttending ? 'Confirmado' : 'Ausente'}","${r.contactPhone}",${r.totalCompanions || 0},"${r.foodRestriction || ''}","${r.message || ''}"`
    ).join('\n');
    
    navigator.clipboard.writeText(headers + rows);
    alert('Lista de convidados copiada para a área de transferência no formato CSV (pronta para colar no Excel)!');
  };

  // Filter guests
  const filteredGuests = invitation.rsvps.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(guestSearch.toLowerCase()) || 
                          (g.companionsNames && g.companionsNames.toLowerCase().includes(guestSearch.toLowerCase()));
    if (guestFilter === 'all') return matchesSearch;
    if (guestFilter === 'attending') return matchesSearch && g.isAttending;
    return matchesSearch && !g.isAttending;
  });

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row font-sans" id="admin-dashboard">
      
      {/* Sidebar Control Panel */}
      <aside className="w-full md:w-64 bg-stone-900 text-stone-200 p-6 flex flex-col justify-between shrink-0 border-b md:border-b-0 md:border-r border-stone-800">
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-stone-950 font-bold shadow-md">
              <Heart className="w-4.5 h-4.5 fill-stone-950" />
            </div>
            <div>
              <span className="text-sm uppercase tracking-widest font-black text-white">Convitta</span>
              <span className="block text-[9px] text-amber-400 font-bold tracking-wider uppercase">Painel de Controle</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="block text-[9px] font-bold text-stone-500 uppercase tracking-widest px-3 mb-2">GERENCIAMENTO</span>
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'overview' ? 'bg-amber-800 text-white shadow-sm' : 'hover:bg-stone-800 text-stone-400'
              }`}
            >
              <BarChart2 className="w-4 h-4" /> Visão Geral (Métricas)
            </button>
            <button
              onClick={() => setActiveTab('edit-details')}
              className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'edit-details' ? 'bg-amber-800 text-white shadow-sm' : 'hover:bg-stone-800 text-stone-400'
              }`}
            >
              <Settings className="w-4 h-4" /> Editar Informações
            </button>
            <button
              onClick={() => setActiveTab('guests')}
              className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'guests' ? 'bg-amber-800 text-white shadow-sm' : 'hover:bg-stone-800 text-stone-400'
              }`}
            >
              <Users className="w-4 h-4" /> Lista RSVP ({invitation.rsvps.length})
            </button>
            <button
              onClick={() => setActiveTab('gifts')}
              className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'gifts' ? 'bg-amber-800 text-white shadow-sm' : 'hover:bg-stone-800 text-stone-400'
              }`}
            >
              <Gift className="w-4 h-4" /> Presentes & Pix ({invitation.gifts.length})
            </button>
          </div>
        </div>

        {/* Guest View & exit triggers */}
        <div className="pt-6 border-t border-stone-800 space-y-2 mt-8 md:mt-0">
          <button
            onClick={onViewGuestInvite}
            className="w-full bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Eye className="w-4 h-4 text-amber-500" /> Ver Convite Ao Vivo
          </button>
          <button
            onClick={onExitDashboard}
            className="w-full text-stone-400 hover:text-white font-medium py-1.5 px-3 rounded text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sair do Painel
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-5xl mx-auto w-full space-y-6">
        
        {/* Top Header Banner */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-stone-200/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-wedding-serif text-stone-900">
              Casamento de {coupleName1} & {coupleName2}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1.5">
              <span>📅 {date} às {time}</span> • <span>📍 {locationName}</span>
            </p>
          </div>
          <div className="bg-emerald-50 text-emerald-800 text-xs px-3 py-1 rounded-full font-semibold border border-emerald-100 flex items-center gap-1.5 shrink-0 shadow-sm animate-pulse">
            <div className="w-2 h-2 rounded-full bg-emerald-500" /> Site Ativo e Conectado
          </div>
        </div>

        {/* SAVE CHANGES BANNER */}
        {saveSuccess && (
          <div className="bg-emerald-600 text-white p-3 rounded-xl shadow-lg flex items-center justify-between text-xs font-semibold animate-bounce">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-white" /> Suas alterações foram salvas e atualizadas com sucesso!
            </span>
          </div>
        )}

        {/* TAB 1: OVERVIEW METRICS & GRAPHICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6" id="overview-tab">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200/40 space-y-1">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Total Confirmados</span>
                <div className="text-2xl font-bold text-stone-900">{confirmedAttending}</div>
                <p className="text-[10px] text-stone-500">adultos e acompanhantes</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200/40 space-y-1">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Total Geral de Convidados</span>
                <div className="text-2xl font-bold text-stone-900">{totalGuests}</div>
                <p className="text-[10px] text-stone-500">{invitation.rsvps.length} famílias responderam</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200/40 space-y-1">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Arrecadado com Presentes</span>
                <div className="text-2xl font-bold text-emerald-600 font-mono">R$ {totalGiftsReceived.toFixed(2)}</div>
                <p className="text-[10px] text-stone-500">valores caídos direto no Pix</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200/40 space-y-1">
                <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">Modelo Escolhido</span>
                <div className="text-xs font-bold text-stone-800 truncate mt-1">{activeTemplate.nome}</div>
                <button 
                  onClick={() => setActiveTab('edit-details')}
                  className="text-[10px] text-amber-800 font-bold underline block text-left"
                >
                  Mudar design
                </button>
              </div>
            </div>

            {/* Recharts Graphical Dashboard */}
            <div className="grid md:grid-cols-12 gap-6">
              {/* RSVP Pie Chart */}
              <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-stone-200/50 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <PieIcon className="w-4 h-4 text-stone-500" /> Distribuição RSVP
                </h3>
                {invitation.rsvps.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-xs text-stone-400">
                    Nenhum convidado respondeu ainda.
                  </div>
                ) : (
                  <div className="h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={rsvpPieData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {rsvpPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-black text-stone-800 font-mono">
                        {confirmedAttending}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-stone-400">
                        Presentes
                      </span>
                    </div>
                  </div>
                )}
                {/* Legend */}
                <div className="flex justify-center gap-4 text-xs font-medium">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Confirmados ({confirmedAttending})
                  </span>
                  <span className="flex items-center gap-1.5 text-red-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Recusados ({declinedCount})
                  </span>
                </div>
              </div>

              {/* Gifts categories bar chart */}
              <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-stone-200/50 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-stone-500" /> Recebimentos por Categoria
                </h3>
                {giftBarData.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-xs text-stone-400 text-center p-4">
                    Nenhum presente Pix arrecadado ainda. Escolha ver seu convite ao vivo e simule a compra de um presente!
                  </div>
                ) : (
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={giftBarData}>
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="valor" fill="#d97706" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            {/* Mini guest list activity */}
            <div className="bg-white rounded-2xl border border-stone-200/50 p-6 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">Atividades Recentes de RSVP</h3>
                <button onClick={() => setActiveTab('guests')} className="text-xs text-amber-850 font-bold hover:underline">
                  Ver Lista Completa
                </button>
              </div>
              <div className="divide-y divide-stone-100 overflow-hidden">
                {invitation.rsvps.slice(-3).reverse().map((r) => (
                  <div key={r.id} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-stone-800">{r.name}</p>
                      <p className="text-[10px] text-stone-400">{r.rsvpDate} • {r.contactPhone}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                        r.isAttending ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                      }`}>
                        {r.isAttending ? `Confirmado (+${r.totalCompanions})` : 'Não irá'}
                      </span>
                    </div>
                  </div>
                ))}
                {invitation.rsvps.length === 0 && (
                  <p className="text-xs text-stone-400 py-4 text-center">Nenhuma resposta registrada ainda.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EDIT INFORMATION FORM */}
        {activeTab === 'edit-details' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-200/50 space-y-6" id="edit-details-tab">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Customizar Detalhes do Convite</h2>
              <p className="text-xs text-stone-500">Mude datas, endereços, textos e até o design do template instantaneamente.</p>
            </div>

            {/* Design template swapper */}
            <div className="bg-amber-50/50 border border-amber-200/50 p-4 rounded-xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
                <Layout className="w-4 h-4 text-amber-700" /> Trocar Estilo Visual (Template)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTemplateId(t.id)}
                    className={`p-2 rounded-lg border bg-white flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
                      selectedTemplateId === t.id 
                        ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-500/10' 
                        : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <img src={t.coverImage} className="w-10 h-10 object-cover rounded-md" alt="" />
                    <span className="text-[10px] font-bold text-stone-800 leading-tight block truncate w-full">{t.nome}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Couple names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-stone-500">Nome do Cônjuge 1</label>
                <input 
                  type="text" 
                  value={coupleName1} 
                  onChange={e => setCoupleName1(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white text-stone-800"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-stone-500">Sobrenome 1</label>
                <input 
                  type="text" 
                  value={coupleLastName1} 
                  onChange={e => setCoupleLastName1(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white text-stone-800"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-stone-500">Nome do Cônjuge 2</label>
                <input 
                  type="text" 
                  value={coupleName2} 
                  onChange={e => setCoupleName2(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white text-stone-800"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-stone-500">Sobrenome 2</label>
                <input 
                  type="text" 
                  value={coupleLastName2} 
                  onChange={e => setCoupleLastName2(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white text-stone-800"
                />
              </div>
            </div>

            {/* Date and Place */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-stone-500">Data do Evento</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white text-stone-800"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-stone-500">Horário</label>
                <input 
                  type="time" 
                  value={time} 
                  onChange={e => setTime(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white text-stone-800"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-stone-500">Nome do Local</label>
                <input 
                  type="text" 
                  value={locationName} 
                  onChange={e => setLocationName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white text-stone-800"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-stone-500">Traje Recomendado (Dress Code)</label>
                <input 
                  type="text" 
                  value={dressCode} 
                  onChange={e => setDressCode(e.target.value)}
                  placeholder="ex: Esporte Fino"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white text-stone-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-stone-500">Endereço Completo</label>
              <input 
                type="text" 
                value={locationAddress} 
                onChange={e => setLocationAddress(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white text-stone-800"
              />
            </div>

            {/* Couple's Story */}
            <div className="border-t border-stone-100 pt-4 space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-stone-700">Nossa História de Amor (Opcional)</h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-stone-500">Título da História</label>
                  <input 
                    type="text" 
                    value={historyTitle} 
                    onChange={e => setHistoryTitle(e.target.value)}
                    placeholder="ex: Como nos conhecemos"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white text-stone-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-stone-500">Texto da História</label>
                  <textarea 
                    value={historyText} 
                    onChange={e => setHistoryText(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white text-stone-800"
                  />
                </div>
              </div>
            </div>

            {/* Pix Integration */}
            <div className="border-t border-stone-100 pt-4 space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-stone-700">Chave Pix de Presentes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-stone-500">Chave Pix</label>
                  <input 
                    type="text" 
                    value={pixKey} 
                    onChange={e => setPixKey(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white text-stone-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-stone-500">Nome do Favorecido</label>
                  <input 
                    type="text" 
                    value={pixHolder} 
                    onChange={e => setPixHolder(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white text-stone-800"
                  />
                </div>
              </div>
            </div>

            {/* Trigger Button */}
            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button
                onClick={handleSaveChanges}
                className="bg-amber-800 hover:bg-amber-900 text-white font-bold py-3 px-8 rounded-lg text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Salvar Alterações
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: RSVP GUEST LIST */}
        {activeTab === 'guests' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-200/50 space-y-6" id="guests-tab">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-stone-900">Lista de Presença (RSVP)</h2>
                <p className="text-xs text-stone-500">Visualize as respostas enviadas e faça a gestão dos seus convidados.</p>
              </div>
              <button
                onClick={handleExportGuests}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-2 px-4 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" /> Exportar para Excel/CSV
              </button>
            </div>

            {/* Filter and Search controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input 
                  type="text"
                  placeholder="Pesquisar por nome..."
                  value={guestSearch}
                  onChange={e => setGuestSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-lg text-xs bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div className="flex gap-1">
                {(['all', 'attending', 'declined'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setGuestFilter(opt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      guestFilter === opt 
                        ? 'bg-stone-900 text-white' 
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                    }`}
                  >
                    {opt === 'all' ? 'Todos' : opt === 'attending' ? 'Confirmados' : 'Recusados'}
                  </button>
                ))}
              </div>
            </div>

            {/* Responsive Table Grid */}
            <div className="overflow-x-auto border border-stone-200 rounded-xl">
              <table className="w-full text-left text-xs divide-y divide-stone-200">
                <thead className="bg-stone-50 font-bold text-stone-700 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 text-left">Convidado</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Acomp.</th>
                    <th className="px-4 py-3 text-left">Nomes Acomp.</th>
                    <th className="px-4 py-3 text-left">Contato</th>
                    <th className="px-4 py-3 text-left">Mensagem / Observação</th>
                    <th className="px-4 py-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 bg-white">
                  {filteredGuests.map((guest) => (
                    <tr key={guest.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-4 py-3 font-bold text-stone-950">{guest.name}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                          guest.isAttending ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                        }`}>
                          {guest.isAttending ? 'Confirmou' : 'Não vai'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-bold">{guest.totalCompanions}</td>
                      <td className="px-4 py-3 text-stone-500 font-light truncate max-w-[120px]" title={guest.companionsNames}>
                        {guest.companionsNames || '−'}
                      </td>
                      <td className="px-4 py-3 text-stone-600 flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-stone-400" /> {guest.contactPhone}
                      </td>
                      <td className="px-4 py-3 text-stone-500 italic max-w-[180px] truncate" title={guest.message}>
                        {guest.foodRestriction && (
                          <span className="block text-[10px] text-amber-700 font-bold not-italic">Restrição: {guest.foodRestriction}</span>
                        )}
                        {guest.message || <span className="text-stone-300 font-light font-sans">Sem mensagem</span>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDeleteRSVP(guest.id)}
                          className="text-stone-400 hover:text-red-600 transition-colors cursor-pointer p-1 rounded hover:bg-stone-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredGuests.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-stone-400">
                        Nenhum convidado encontrado com os filtros selecionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: GIFTS LISTS & PIX HISTORY */}
        {activeTab === 'gifts' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-200/50 space-y-6" id="gifts-tab">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Lista de Presentes Pix</h2>
              <p className="text-xs text-stone-500">
                Seus convidados podem comprar esses itens simbólicos. O dinheiro cai direto na sua conta bancária Pix cadastrada.
              </p>
            </div>

            {/* Quick Summary of purchased gifts */}
            <div className="bg-stone-50 border rounded-xl p-4 grid sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-stone-400 font-semibold block">Total Arrecadado</span>
                <span className="text-2xl font-bold text-emerald-600 font-mono">R$ {totalGiftsReceived.toFixed(2)}</span>
              </div>
              <div className="space-y-1 border-l sm:border-l border-stone-200 pl-0 sm:pl-4">
                <span className="text-stone-400 font-semibold block">Itens Vendidos</span>
                <span className="text-2xl font-bold text-stone-800">
                  {invitation.gifts.filter(g => g.bought).length} de {invitation.gifts.length} disponíveis
                </span>
              </div>
            </div>

            {/* Add Custom Gift Form */}
            <form onSubmit={handleAddGift} className="border border-stone-200 rounded-xl p-4 bg-stone-50/50 space-y-3">
              <span className="text-[10px] uppercase font-bold text-stone-500 flex items-center gap-1">
                <Plus className="w-3.5 h-3.5 text-amber-800" /> Cadastrar Novo Presente Simbólico
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-5">
                  <input 
                    type="text" 
                    required
                    placeholder="Nome do presente (ex: Cota de Jantar Romântico)" 
                    value={newGiftName}
                    onChange={e => setNewGiftName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs bg-white text-stone-800"
                  />
                </div>
                <div className="sm:col-span-3">
                  <input 
                    type="number" 
                    required
                    placeholder="Valor (R$)" 
                    value={newGiftPrice}
                    onChange={e => setNewGiftPrice(e.target.value)}
                    className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs bg-white text-stone-800 font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <select
                    value={newGiftCategory}
                    onChange={e => setNewGiftCategory(e.target.value)}
                    className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs bg-white text-stone-800"
                  >
                    <option value="Lua de Mel">Lua de Mel</option>
                    <option value="Cozinha">Cozinha</option>
                    <option value="Eletrodomésticos">Eletrodomésticos</option>
                    <option value="Diversos">Diversos</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-2 rounded-lg text-xs shadow-sm cursor-pointer"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </form>

            {/* Current Gifts List */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold text-stone-400">Produtos Ativos na Lista</span>
              <div className="grid sm:grid-cols-2 gap-4">
                {invitation.gifts.map((gift) => (
                  <div key={gift.id} className="bg-white border border-stone-200/60 rounded-xl p-3 flex gap-3 items-center justify-between shadow-sm">
                    <div className="flex gap-3 items-center min-w-0">
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-stone-900 truncate">{gift.name}</p>
                        <p className="text-[10px] text-stone-400">{gift.category} • R$ {gift.price.toFixed(2)}</p>
                        
                        {gift.bought ? (
                          <span className="inline-flex mt-1 bg-emerald-50 text-emerald-800 font-bold text-[8px] uppercase px-1.5 py-0.5 rounded">
                            Ganho de: {gift.boughtBy}
                          </span>
                        ) : (
                          <span className="inline-flex mt-1 bg-amber-50 text-amber-800 font-bold text-[8px] uppercase px-1.5 py-0.5 rounded">
                            Disponível
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteGift(gift.id)}
                      className="text-stone-400 hover:text-red-600 transition-colors cursor-pointer p-1.5 rounded hover:bg-stone-50 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
