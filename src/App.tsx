import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ViewState, WeddingInvitation, Template, GiftItem, RSVPResponse } from './types';
import { defaultInvitation, initialGiftList } from './data';
import LandingPage from './components/LandingPage';
import OnboardingForm from './components/OnboardingForm';
import AdminDashboard from './components/AdminDashboard';
import InvitationView from './components/InvitationView';
import CheckoutModal from './components/CheckoutModal';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import { 
  saveInvitationToDb, 
  getInvitationById, 
  getInvitationBySlugOrId, 
  getInvitationsByEmail 
} from './lib/firebase';
import { Heart, Loader2, Mail, Shield, AlertCircle, X } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [clientEmail, setClientEmail] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Login Modal state
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginEmailInput, setLoginEmailInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Custom user wedding invitation state
  const [invitation, setInvitation] = useState<WeddingInvitation>(defaultInvitation);

  // 1. Startup: Check for c or convite URL parameters to load a guest invitation
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('c') || urlParams.get('convite');
        
        if (slug) {
          const loaded = await getInvitationBySlugOrId(slug);
          if (loaded) {
            setInvitation(loaded);
            setIsPreviewMode(false);
            setView('invite');
          } else {
            setLoadingError('Desculpe, o convite solicitado não foi localizado.');
          }
        } else {
          // Check for active session in LocalStorage or cached wedding invitation
          const saved = localStorage.getItem('convitta_invitation');
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (parsed && parsed.id) {
                // Fetch fresh copy from database so changes/RSVPs sync immediately
                if (!parsed.id.startsWith('demo') && parsed.id !== 'invite-demo-id') {
                  const fresh = await getInvitationById(parsed.id);
                  if (fresh) {
                    setInvitation(fresh);
                    setClientEmail(fresh.clientEmail);
                  } else {
                    setInvitation(parsed);
                  }
                } else {
                  setInvitation(parsed);
                }
              }
            } catch (e) {
              console.error('Erro ao decodificar rascunho salvo', e);
            }
          }
        }
      } catch (err) {
        console.error('Erro na inicialização da aplicação', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Sync to database and local storage
  const saveInvitationToStorage = async (updated: WeddingInvitation) => {
    setInvitation(updated);
    
    // Cache local copy
    if (!isPreviewMode) {
      localStorage.setItem('convitta_invitation', JSON.stringify(updated));
    }
    
    // Save to Firestore under real-world conditions
    const isRealWedding = !isPreviewMode && updated.id && !updated.id.startsWith('demo') && updated.id !== 'invite-demo-id';
    if (isRealWedding) {
      try {
        await saveInvitationToDb(updated);
        console.log('Convite atualizado com sucesso no Firestore.');
      } catch (e) {
        console.error('Erro ao sincronizar com o Firestore', e);
      }
    }
  };

  // 2. Landing: Template selection triggered
  const handleSelectTemplateToBuy = (template: Template) => {
    setSelectedTemplate(template);
    setCheckoutOpen(true);
  };

  // 3. Landing: Live Demo Dashboard trigger
  const handleOpenDashboardDemo = () => {
    const demoWedding: WeddingInvitation = {
      ...defaultInvitation,
      clientEmail: 'demo@convitta.com.br',
      id: 'demo-' + Math.random().toString(36).substr(2, 5)
    };
    setInvitation(demoWedding);
    setClientEmail('demo@convitta.com.br');
    setIsPreviewMode(false);
    setView('dashboard');
  };

  // 4. Landing: Trigger Template Preview mode
  const handlePreviewTemplate = (template: Template) => {
    const previewDraft: WeddingInvitation = {
      ...defaultInvitation,
      coupleName1: 'Vinícius',
      coupleName2: 'Beatriz',
      coupleLastName1: 'Moraes',
      coupleLastName2: 'Siqueira',
      templateId: template.id,
      rsvps: [
        {
          id: 'prev-r1',
          name: 'Amigo Teste',
          isAttending: true,
          totalCompanions: 1,
          contactPhone: '(11) 98888-8888',
          rsvpDate: '2026-06-23',
          message: 'Esta é uma mensagem demonstrativa!'
        }
      ],
      gifts: initialGiftList
    };
    setInvitation(previewDraft);
    setIsPreviewMode(true);
    setView('invite');
  };

  // 5. Invitation View: Exit preview mode back to landing catalog
  const handleExitPreview = () => {
    setIsPreviewMode(false);
    const saved = localStorage.getItem('convitta_invitation');
    if (saved) {
      try {
        setInvitation(JSON.parse(saved));
      } catch (e) {
        setInvitation(defaultInvitation);
      }
    } else {
      setInvitation(defaultInvitation);
    }
    setView('landing');
  };

  // 6. Invitation View: Buy directly from preview mode
  const handleBuyFromPreview = (template: Template) => {
    setIsPreviewMode(false);
    setSelectedTemplate(template);
    setView('landing');
    setCheckoutOpen(true);
  };

  // 7. Checkout: Proceed to Onboarding after WhatsApp details entered
  const handlePaymentSuccess = (email: string) => {
    setClientEmail(email);
    setCheckoutOpen(false);
    setView('onboarding');
  };

  // 8. Onboarding: Create a completely new invitation and save to Firestore
  const handleOnboardingComplete = async (partialData: Partial<WeddingInvitation>) => {
    const uuid = 'invite-' + Math.random().toString(36).substr(2, 9);
    
    // Formulate a slug and random suffix to guarantee uniqueness and prevent conflicts
    const rawSlug = `${partialData.coupleName1}-e-${partialData.coupleName2}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^a-z0-9-]/g, '-')     // replace non-alphanumeric with -
      .replace(/-+/g, '-')             // collapse multiple dashes
      .replace(/^-+|-+$/g, '');        // trim leading/trailing dashes
    
    const finalSlug = `${rawSlug}-${Math.random().toString(36).substr(2, 4)}`;

    const freshInvitation: WeddingInvitation = {
      ...defaultInvitation,
      ...partialData,
      id: uuid,
      slug: finalSlug,
      templateId: selectedTemplate?.id || 'template-5',
      isPaid: false, // Starts as draft/pending approval, Alexandre activates on WhatsApp
      gifts: initialGiftList,
      rsvps: [] // Starts clean
    };

    await saveInvitationToStorage(freshInvitation);
    setView('dashboard');
  };

  // 9. Dashboard edits
  const handleUpdateInvitation = (updated: WeddingInvitation) => {
    saveInvitationToStorage(updated);
  };

  // 10. Guest RSVP submissions
  const handleUpdateRSVP = (newRsvps: RSVPResponse[]) => {
    const updated = { ...invitation, rsvps: newRsvps };
    saveInvitationToStorage(updated);
  };

  // 11. Guest Gift purchases
  const handleUpdateGifts = (newGifts: GiftItem[]) => {
    const updated = { ...invitation, gifts: newGifts };
    saveInvitationToStorage(updated);
  };

  // 12. Acessar Meu Painel: Database Login action
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmailInput) return;

    setIsLoggingIn(true);
    setLoginError(null);

    const typedEmail = loginEmailInput.trim().toLowerCase();

    try {
      // Secret Admin Key or Email triggers the master Super Admin panel
      const isAdmin = typedEmail === 'alexandrealvesszz12@gmail.com' || typedEmail === 'admin@convitta.com.br' || typedEmail === 'admin';
      
      if (isAdmin) {
        setLoginModalOpen(false);
        setView('super-admin');
        setIsLoggingIn(false);
        return;
      }

      // Query database for client invitations
      const matches = await getInvitationsByEmail(typedEmail);
      if (matches && matches.length > 0) {
        // Load the most recent one
        const matchedInvitation = matches[0];
        setInvitation(matchedInvitation);
        setClientEmail(matchedInvitation.clientEmail);
        setIsPreviewMode(false);
        setLoginModalOpen(false);
        
        // Save local session
        localStorage.setItem('convitta_invitation', JSON.stringify(matchedInvitation));
        setView('dashboard');
      } else {
        setLoginError('Nenhum convite ativo encontrado para este e-mail. Se você acabou de encomendar pelo WhatsApp, por favor aguarde alguns minutos pela nossa ativação manual.');
      }
    } catch (e) {
      console.error(e);
      setLoginError('Ocorreu um erro ao conectar com o banco de dados. Tente novamente mais tarde.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 13. Super Admin action: Edit one specific client's invitation
  const handleSelectInvitationForEdit = (targetInvitation: WeddingInvitation) => {
    setInvitation(targetInvitation);
    setClientEmail(targetInvitation.clientEmail);
    setIsPreviewMode(false);
    setView('dashboard');
  };

  // Global loading states for database fetching on startup
  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-6 text-stone-200">
        <div className="space-y-6 text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-700 to-amber-900 flex items-center justify-center text-white mx-auto shadow-2xl animate-pulse border border-amber-600/30">
            <Heart className="w-8 h-8 fill-white animate-bounce" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-wedding-serif font-semibold tracking-wider text-white">Carregando Convitta</h2>
            <p className="text-xs text-stone-400">Preparando ambiente seguro e carregando dados do banco de dados...</p>
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-amber-500 mx-auto" />
        </div>
      </div>
    );
  }

  // Guest invitation loading error (Not Found page)
  if (loadingError) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="bg-white max-w-md w-full p-8 rounded-2xl border border-stone-200 shadow-xl text-center space-y-6">
          <div className="w-14 h-14 bg-amber-50 text-amber-800 rounded-full flex items-center justify-center mx-auto border border-amber-200">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold font-wedding-serif text-stone-900">Convite Não Encontrado</h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              O link que você acessou pode estar incorreto, expirado ou aguardando ativação rápida pelo administrador do painel via WhatsApp.
            </p>
          </div>
          <button 
            onClick={() => {
              setLoadingError(null);
              // Clean query param
              window.history.pushState({}, '', window.location.pathname);
              setView('landing');
            }}
            className="w-full py-3 bg-stone-900 hover:bg-stone-850 text-white rounded-xl text-xs font-bold shadow transition-all cursor-pointer"
          >
            Ir para a Página Inicial
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-stone-50 select-none">
      
      {/* Route Switcher with smooth page animations */}
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <LandingPage 
              onSelectTemplate={handleSelectTemplateToBuy} 
              onOpenDashboardDemo={handleOpenDashboardDemo}
              onPreviewTemplate={handlePreviewTemplate}
              onOpenLogin={() => {
                setLoginError(null);
                setLoginEmailInput('');
                setLoginModalOpen(true);
              }}
            />
          </motion.div>
        )}

        {view === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <OnboardingForm 
              onComplete={handleOnboardingComplete}
              clientEmail={clientEmail}
            />
          </motion.div>
        )}

        {view === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <AdminDashboard 
              invitation={invitation}
              onUpdateInvitation={handleUpdateInvitation}
              onExitDashboard={() => {
                // If they logged in as super-admin and were editing, go back to super-admin
                const isSuperAdminEmail = clientEmail === 'alexandrealvesszz12@gmail.com' || clientEmail === 'admin@convitta.com.br';
                if (isSuperAdminEmail) {
                  setView('super-admin');
                } else {
                  setView('landing');
                }
              }}
              onViewGuestInvite={() => {
                setIsPreviewMode(false);
                setView('invite');
              }}
            />
          </motion.div>
        )}

        {view === 'invite' && (
          <motion.div
            key="invite"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <InvitationView 
              invitation={invitation}
              onBackToDashboard={
                isPreviewMode 
                  ? handleExitPreview 
                  : () => setView('dashboard')
              }
              onUpdateRSVP={handleUpdateRSVP}
              onUpdateGifts={handleUpdateGifts}
              isPreviewMode={isPreviewMode}
              onBuyTemplate={handleBuyFromPreview}
            />
          </motion.div>
        )}

        {view === 'super-admin' && (
          <motion.div
            key="super-admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <SuperAdminDashboard 
              onExit={() => setView('landing')}
              onSelectInvitationForEdit={handleSelectInvitationForEdit}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulated Checkout Modal */}
      <CheckoutModal 
        template={selectedTemplate}
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Login / Acessar Meu Painel Modal */}
      <AnimatePresence>
        {loginModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLoginModalOpen(false)}
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-8 border border-stone-100 z-10 space-y-6"
              id="login-modal"
            >
              <button 
                onClick={() => setLoginModalOpen(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer rounded-full p-1 bg-stone-100 hover:bg-stone-200"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-2">
                <div className="w-11 h-11 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-800">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-wedding-serif font-bold text-stone-900">Acessar Meu Painel</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Insira o seu e-mail de cadastro para gerenciar o seu convite, ver os presentes ganhos e a lista de convidados confirmados.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-600">
                    E-mail de Cadastro
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      required
                      placeholder="ex: noivos@gmail.com"
                      value={loginEmailInput}
                      onChange={e => setLoginEmailInput(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-600 transition-all text-stone-850"
                    />
                  </div>
                </div>

                {loginError && (
                  <div className="bg-amber-50 border border-amber-200/50 text-amber-900 rounded-xl p-3 text-[11px] leading-relaxed flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-stone-900 hover:bg-stone-850 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-stone-800/80 disabled:cursor-wait"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-stone-400" />
                      Conectando...
                    </>
                  ) : (
                    <>
                      Acessar Painel de Controle
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 border-t border-stone-100 text-center">
                <p className="text-[10px] text-stone-400 leading-relaxed">
                  💡 Se você acabou de pagar no WhatsApp, use o e-mail preenchido no checkout. O painel estará liberado como Rascunho até nossa confirmação manual.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
