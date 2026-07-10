import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MapPin, Info, Check, Send, 
  Volume2, VolumeX, Music, Gift, QrCode, Sparkles, AlertCircle 
} from 'lucide-react';
import { WeddingInvitation, RSVPResponse, GiftItem, Template } from '../types';
import { templates } from '../data';
import EnvelopeCover from './EnvelopeCover';
import Template5Layout from './Template5Layout';
import Template6Layout from './Template6Layout';
import Template7Layout from './Template7Layout';
import Template8Layout from './Template8Layout';
import confetti from 'canvas-confetti';

interface InvitationViewProps {
  invitation: WeddingInvitation;
  onBackToDashboard?: () => void;
  onUpdateRSVP: (newRsvps: RSVPResponse[]) => void;
  onUpdateGifts: (newGifts: GiftItem[]) => void;
  isPreviewMode?: boolean;
  onBuyTemplate?: (template: Template) => void;
}

export default function InvitationView({
  invitation,
  onBackToDashboard,
  onUpdateRSVP,
  onUpdateGifts,
  isPreviewMode = false,
  onBuyTemplate
}: InvitationViewProps) {
  const [isOpened, setIsOpened] = useState(invitation.templateId === 'template-8' ? true : false);
  const [soundOn, setSoundOn] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  // Sync isOpened when templateId changes
  useEffect(() => {
    setIsOpened(invitation.templateId === 'template-8' ? true : false);
  }, [invitation.templateId]);

  // RSVP Form States
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpAttending, setRsvpAttending] = useState<boolean | null>(null);
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [rsvpCompanions, setRsvpCompanions] = useState(0);
  const [rsvpCompanionsNames, setRsvpCompanionsNames] = useState('');
  const [rsvpFoodRestriction, setRsvpFoodRestriction] = useState('');
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Active Gift Pix selection state
  const [selectedGiftForPix, setSelectedGiftForPix] = useState<GiftItem | null>(null);
  const [contributorName, setContributorName] = useState('');
  const [isSimulatingGiftPayment, setIsSimulatingGiftPayment] = useState(false);
  const [copiedGiftPix, setCopiedGiftPix] = useState(false);

  const template = templates.find(t => t.id === invitation.templateId) || templates[0];
  const { themeColors, fontDisplay, fontSans } = template;

  // Sound play simulation (no actual audio files to prevent load crashes, but a visual/indicator experience)
  const toggleSound = () => {
    setSoundOn(!soundOn);
  };

  // Countdown timer calculation
  useEffect(() => {
    if (!invitation.date) return;
    
    const calculateTime = () => {
      const targetDate = new Date(`${invitation.date}T${invitation.time || '18:00'}:00`);
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      
      setTimeRemaining({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [invitation.date, invitation.time]);

  // Form submit handler for RSVP
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rsvpAttending === null) {
      alert('Por favor, informe se você irá comparecer ou não.');
      return;
    }

    const newRsvp: RSVPResponse = {
      id: `rsvp-${Date.now()}`,
      name: rsvpName,
      isAttending: rsvpAttending,
      totalCompanions: rsvpAttending ? rsvpCompanions : 0,
      companionsNames: rsvpAttending ? rsvpCompanionsNames : '',
      contactPhone: rsvpPhone,
      rsvpDate: new Date().toISOString().split('T')[0],
      foodRestriction: rsvpFoodRestriction || undefined,
      message: rsvpMessage || undefined
    };

    // Append to list of RSVPs
    onUpdateRSVP([...invitation.rsvps, newRsvp]);

    // Celebratory effects
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.8 }
    });

    setRsvpSubmitted(true);
  };

  // Gift Pix payment simulation handler
  const handleGiftPixSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributorName) {
      alert('Por favor, digite o seu nome para os noivos saberem quem enviou.');
      return;
    }
    if (!selectedGiftForPix) return;

    setIsSimulatingGiftPayment(true);

    // Simulate instant bank validation
    setTimeout(() => {
      setIsSimulatingGiftPayment(false);

      // Update the active gift list with item marked as bought
      const updatedGifts = invitation.gifts.map(g => {
        if (g.id === selectedGiftForPix.id) {
          return {
            ...g,
            bought: true,
            boughtBy: contributorName,
            totalContributions: g.totalContributions + g.price
          };
        }
        return g;
      });

      onUpdateGifts(updatedGifts);

      // Success confetti
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.5 }
      });

      setSelectedGiftForPix(null);
      setContributorName('');
      alert(`Obrigado! Sua transferência simbólica de presente no valor de R$ ${selectedGiftForPix.price.toFixed(2)} foi confirmada e creditada para os noivos!`);
    }, 1800);
  };

  // Helpers for formatting date elegantly
  const formatWeddingDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
      const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      
      return {
        dayName: daysOfWeek[d.getDay()],
        day: d.getDate(),
        month: months[d.getMonth()],
        year: d.getFullYear()
      };
    } catch (e) {
      return null;
    }
  };

  const weddingDateInfo = formatWeddingDate(invitation.date);

  return (
    <>
      {/* 1. Template Preview Quick Header if in Preview Mode */}
      {isPreviewMode && (
        <div className="fixed top-0 inset-x-0 z-50 bg-stone-900/95 backdrop-blur-md text-white py-3 px-6 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs border-b border-stone-800 shadow-md">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-stone-950 font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">PRÉVIA</span>
            <span className="font-medium text-stone-200">
              Você está testando o template <strong className="text-amber-400">{template.nome}</strong> (R$ {template.price.toFixed(2)})
            </span>
          </div>
          <div className="flex gap-2 items-center">
            {onBackToDashboard && (
              <button 
                onClick={onBackToDashboard}
                className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold px-4 py-1.5 rounded-full transition-colors cursor-pointer text-[11px]"
              >
                Voltar para o Catálogo
              </button>
            )}
            {onBuyTemplate && (
              <button 
                onClick={() => onBuyTemplate(template)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-1.5 rounded-full transition-all cursor-pointer text-[11px] shadow-sm flex items-center gap-1.5 hover:scale-102"
              >
                <Heart className="w-3.5 h-3.5 text-white fill-white" /> Selecionar e Comprar
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. Admin Quick bar if opened from Couple Admin dashboard (but not in preview) */}
      {!isPreviewMode && onBackToDashboard && (
        <div className="fixed top-0 inset-x-0 z-40 bg-stone-900/90 backdrop-blur-sm text-white py-2 px-6 flex justify-between items-center text-xs border-b border-stone-800 shadow-sm">
          <span className="font-medium text-stone-300">Modo de Visualização do Convidado</span>
          <button 
            onClick={onBackToDashboard}
            className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-3 py-1 rounded transition-colors cursor-pointer"
          >
            Voltar para o Painel
          </button>
        </div>
      )}

      {/* 3. Render Envelope view or Invitation view */}
      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="envelope"
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(4px)' }}
            transition={{ duration: 0.8 }}
          >
            <EnvelopeCover 
              coupleName1={invitation.coupleName1}
              coupleName2={invitation.coupleName2}
              dateString={invitation.date}
              onOpen={() => {
                setIsOpened(true);
                // Trigger simulated soft audio indicator
                setSoundOn(true);
              }}
              accentColor={themeColors.primary}
              bgColor={themeColors.bg}
              textColor={themeColors.text}
              fontDisplay={fontDisplay}
              templateId={invitation.templateId}
            />
          </motion.div>
        ) : (
          <motion.div
            key="invitation-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className={`min-h-screen ${fontSans} selection:bg-amber-100 flex flex-col justify-between`}
            style={{ backgroundColor: themeColors.bg, color: themeColors.text }}
            id="invitation-main-content"
          >
            
            {/* Music control vinyl style widget */}
            {invitation.templateId !== 'template-5' && invitation.templateId !== 'template-6' && invitation.templateId !== 'template-7' && invitation.templateId !== 'template-8' && (
              <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
                <AnimatePresence>
                  {soundOn && (
                    <motion.div 
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 15 }}
                      className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md border border-stone-200/50 flex items-center gap-1.5"
                      style={{ color: themeColors.primary }}
                    >
                      <Music className="w-3 h-3 animate-bounce" /> Piano Romântico (Simulado)
                    </motion.div>
                  )}
                </AnimatePresence>
                <button 
                  onClick={toggleSound}
                  className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 border bg-white border-stone-200"
                  style={{ color: themeColors.primary }}
                >
                  {soundOn ? (
                    <Volume2 className="w-5 h-5 animate-pulse" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-stone-400" />
                  )}
                </button>
              </div>
            )}

            {/* MAIN CONTAINER */}
            {invitation.templateId === 'template-5' ? (
              <Template5Layout
                invitation={invitation}
                weddingDateInfo={weddingDateInfo}
                timeRemaining={timeRemaining}
                rsvpSubmitted={rsvpSubmitted}
                handleRsvpSubmit={handleRsvpSubmit}
                rsvpName={rsvpName}
                setRsvpName={setRsvpName}
                rsvpAttending={rsvpAttending}
                setRsvpAttending={setRsvpAttending}
                rsvpPhone={rsvpPhone}
                setRsvpPhone={setRsvpPhone}
                rsvpCompanions={rsvpCompanions}
                setRsvpCompanions={setRsvpCompanions}
                rsvpCompanionsNames={rsvpCompanionsNames}
                setRsvpCompanionsNames={setRsvpCompanionsNames}
                rsvpFoodRestriction={rsvpFoodRestriction}
                setRsvpFoodRestriction={setRsvpFoodRestriction}
                setSelectedGiftForPix={setSelectedGiftForPix}
              />
            ) : invitation.templateId === 'template-6' ? (
              <Template6Layout
                invitation={invitation}
                themeColors={themeColors}
                fontDisplay={fontDisplay}
                fontSans={fontSans}
                weddingDateInfo={weddingDateInfo}
                timeRemaining={timeRemaining}
                rsvpSubmitted={rsvpSubmitted}
                handleRsvpSubmit={handleRsvpSubmit}
                rsvpName={rsvpName}
                setRsvpName={setRsvpName}
                rsvpAttending={rsvpAttending}
                setRsvpAttending={setRsvpAttending}
                rsvpPhone={rsvpPhone}
                setRsvpPhone={setRsvpPhone}
                rsvpCompanions={rsvpCompanions}
                setRsvpCompanions={setRsvpCompanions}
                rsvpCompanionsNames={rsvpCompanionsNames}
                setRsvpCompanionsNames={setRsvpCompanionsNames}
                rsvpFoodRestriction={rsvpFoodRestriction}
                setRsvpFoodRestriction={setRsvpFoodRestriction}
                rsvpMessage={rsvpMessage}
                setRsvpMessage={setRsvpMessage}
                setSelectedGiftForPix={setSelectedGiftForPix}
              />
            ) : invitation.templateId === 'template-7' ? (
              <Template7Layout
                invitation={invitation}
                themeColors={themeColors}
                fontDisplay={fontDisplay}
                fontSans={fontSans}
                weddingDateInfo={weddingDateInfo}
                timeRemaining={timeRemaining}
                rsvpSubmitted={rsvpSubmitted}
                handleRsvpSubmit={handleRsvpSubmit}
                rsvpName={rsvpName}
                setRsvpName={setRsvpName}
                rsvpAttending={rsvpAttending}
                setRsvpAttending={setRsvpAttending}
                rsvpPhone={rsvpPhone}
                setRsvpPhone={setRsvpPhone}
                rsvpCompanions={rsvpCompanions}
                setRsvpCompanions={setRsvpCompanions}
                rsvpCompanionsNames={rsvpCompanionsNames}
                setRsvpCompanionsNames={setRsvpCompanionsNames}
                rsvpFoodRestriction={rsvpFoodRestriction}
                setRsvpFoodRestriction={setRsvpFoodRestriction}
                rsvpMessage={rsvpMessage}
                setRsvpMessage={setRsvpMessage}
                setSelectedGiftForPix={setSelectedGiftForPix}
              />
            ) : invitation.templateId === 'template-8' ? (
              <Template8Layout
                invitation={invitation}
                themeColors={themeColors}
                fontDisplay={fontDisplay}
                fontSans={fontSans}
                timeRemaining={timeRemaining}
                rsvpSubmitted={rsvpSubmitted}
                handleRsvpSubmit={handleRsvpSubmit}
                rsvpName={rsvpName}
                setRsvpName={setRsvpName}
                rsvpAttending={rsvpAttending}
                setRsvpAttending={setRsvpAttending}
                rsvpPhone={rsvpPhone}
                setRsvpPhone={setRsvpPhone}
                rsvpCompanions={rsvpCompanions}
                setRsvpCompanions={setRsvpCompanions}
                rsvpCompanionsNames={rsvpCompanionsNames}
                setRsvpCompanionsNames={setRsvpCompanionsNames}
                rsvpFoodRestriction={rsvpFoodRestriction}
                setRsvpFoodRestriction={setRsvpFoodRestriction}
                rsvpMessage={rsvpMessage}
                setRsvpMessage={setRsvpMessage}
                setSelectedGiftForPix={setSelectedGiftForPix}
              />
            ) : (
              <div className="w-full max-w-2xl mx-auto px-6 py-16 sm:py-24 space-y-20">
              
              {/* HEADER / INTRO */}
              <header className="text-center space-y-6">
                <div className="w-10 h-10 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: `${themeColors.primary}15` }}>
                  <Heart className="w-5 h-5 fill-current" style={{ color: themeColors.primary }} />
                </div>
                
                <div className="space-y-2">
                  <span className="text-[11px] uppercase tracking-[0.3em] font-medium block" style={{ color: themeColors.muted }}>
                    Com a bênção de Deus e de nossos pais
                  </span>
                  
                  {/* Families/Parents header text */}
                  <div className="grid grid-cols-2 gap-4 text-[10px] uppercase tracking-wider text-stone-500 max-w-sm mx-auto pt-2">
                    <div>
                      <p className="font-bold">Pais da Noiva</p>
                      <p className="font-light">Carlos &amp; Maria Vasconcellos</p>
                    </div>
                    <div>
                      <p className="font-bold">Pais do Noivo</p>
                      <p className="font-light">Roberto &amp; Alice Almeida</p>
                    </div>
                  </div>
                </div>

                <div className="py-6 space-y-4">
                  <h1 className={`${fontDisplay}`} style={{ color: themeColors.accent }}>
                    {invitation.coupleName1}
                  </h1>
                  <p className="text-sm font-wedding-cursive italic" style={{ color: themeColors.muted }}>&amp;</p>
                  <h1 className={`${fontDisplay}`} style={{ color: themeColors.accent }}>
                    {invitation.coupleName2}
                  </h1>
                </div>

                <p className="text-xs sm:text-sm font-light italic max-w-md mx-auto leading-relaxed" style={{ color: themeColors.text }}>
                  "{invitation.welcomeMessage || 'Convidamos para celebrar nosso amor.'}"
                </p>
              </header>

              {/* DATE BLOCK */}
              <section className="text-center space-y-4 pt-4 border-t border-b py-8" style={{ borderColor: `${themeColors.primary}20` }}>
                {weddingDateInfo ? (
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.25em] font-bold" style={{ color: themeColors.primary }}>
                      {weddingDateInfo.dayName}
                    </p>
                    <div className="flex items-center justify-center gap-6">
                      <div className="w-16 h-[1px]" style={{ backgroundColor: `${themeColors.primary}40` }} />
                      <div className="text-center">
                        <span className="block text-4xl font-bold font-wedding-serif">{weddingDateInfo.day}</span>
                        <span className="block text-xs uppercase tracking-widest font-semibold">{weddingDateInfo.month}</span>
                      </div>
                      <div className="w-16 h-[1px]" style={{ backgroundColor: `${themeColors.primary}40` }} />
                    </div>
                    <p className="text-xs uppercase tracking-[0.2em] font-medium" style={{ color: themeColors.muted }}>
                      {weddingDateInfo.year} às {invitation.time} Horas
                    </p>
                  </div>
                ) : (
                  <p className="text-sm font-bold">{invitation.date} às {invitation.time}</p>
                )}
              </section>

              {/* COUNTDOWN TIMER */}
              <section className="text-center space-y-4">
                <span className="text-[10px] uppercase tracking-wider font-bold block" style={{ color: themeColors.muted }}>
                  Faltam apenas
                </span>
                
                {timeRemaining.isPast ? (
                  <p className="text-xl font-bold uppercase tracking-widest font-wedding-serif text-amber-700">
                    Já Casados! 💖
                  </p>
                ) : (
                  <div className="flex justify-center gap-3 sm:gap-4 font-mono">
                    <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-stone-200/40 w-14 sm:w-16">
                      <span className="block text-lg sm:text-2xl font-bold" style={{ color: themeColors.primary }}>{timeRemaining.days}</span>
                      <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-stone-400 font-sans font-semibold">Dias</span>
                    </div>
                    <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-stone-200/40 w-14 sm:w-16">
                      <span className="block text-lg sm:text-2xl font-bold" style={{ color: themeColors.primary }}>{timeRemaining.hours}</span>
                      <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-stone-400 font-sans font-semibold">Horas</span>
                    </div>
                    <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-stone-200/40 w-14 sm:w-16">
                      <span className="block text-lg sm:text-2xl font-bold" style={{ color: themeColors.primary }}>{timeRemaining.minutes}</span>
                      <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-stone-400 font-sans font-semibold">Min</span>
                    </div>
                    <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-stone-200/40 w-14 sm:w-16">
                      <span className="block text-lg sm:text-2xl font-bold text-rose-500">{timeRemaining.seconds}</span>
                      <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-stone-400 font-sans font-semibold animate-pulse">Seg</span>
                    </div>
                  </div>
                )}
              </section>

              {/* STORY SECTION */}
              {invitation.historyText && (
                <section className="space-y-6 text-center">
                  <h3 className="text-lg font-wedding-serif font-bold uppercase tracking-widest" style={{ color: themeColors.primary }}>
                    {invitation.historyTitle || 'Nossa História'}
                  </h3>
                  
                  {invitation.historyImageUrl && (
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-stone-200 shadow-md">
                      <img 
                        src={invitation.historyImageUrl} 
                        alt="Nossa História" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/20 to-transparent" />
                    </div>
                  )}
                  
                  <p className="text-xs sm:text-sm font-light leading-relaxed max-w-lg mx-auto text-stone-600">
                    {invitation.historyText}
                  </p>
                </section>
              )}

              {/* LOCAL / ADDRESS MAP */}
              <section className="text-center space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/40 shadow-sm">
                <MapPin className="w-7 h-7 mx-auto" style={{ color: themeColors.primary }} />
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold block text-stone-400">Local da Cerimônia & Festa</span>
                  <h4 className="text-lg font-bold font-wedding-serif">{invitation.locationName}</h4>
                  <p className="text-xs text-stone-500 leading-relaxed font-light max-w-sm mx-auto">
                    {invitation.locationAddress}
                  </p>
                </div>

                {invitation.dressCode && (
                  <div className="bg-stone-50 p-5 rounded-2xl text-left border border-stone-200/40 max-w-md mx-auto space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 shrink-0 text-amber-700" /> Dica de Vestimenta (Dress Code)
                    </span>
                    <p className="text-xs text-stone-600 leading-relaxed font-light">
                      {invitation.dressCode}
                    </p>
                    
                    {/* Visual Color Palette recommendation if Template 6 or general romantic template */}
                    {invitation.templateId === 'template-6' && (
                      <div className="pt-2 border-t border-stone-200/50 space-y-2">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-stone-400 block">
                          Paleta sugerida para convidados:
                        </span>
                        <div className="flex gap-2.5 items-center">
                          <div className="w-6 h-6 rounded-full shadow-inner border border-stone-200" style={{ backgroundColor: '#ebd9ca' }} title="Nude / Areia" />
                          <div className="w-6 h-6 rounded-full shadow-inner border border-stone-200" style={{ backgroundColor: '#cca7a2' }} title="Rosa Chá" />
                          <div className="w-6 h-6 rounded-full shadow-inner border border-stone-200" style={{ backgroundColor: '#e2be9b' }} title="Pêssego" />
                          <div className="w-6 h-6 rounded-full shadow-inner border border-stone-200" style={{ backgroundColor: '#a5b39e' }} title="Sage / Oliva" />
                          <div className="w-6 h-6 rounded-full shadow-inner border border-stone-200" style={{ backgroundColor: '#dfccca' }} title="Rosê Muted" />
                          <span className="text-[10px] text-stone-400 font-light italic">Tons pastéis e suaves</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-2">
                  <a 
                    href={invitation.locationMapUrl || `https://maps.google.com/?q=${encodeURIComponent(invitation.locationAddress)}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white py-2.5 px-6 rounded-full shadow-md transition-all hover:shadow-lg cursor-pointer hover:scale-101"
                    style={{ backgroundColor: themeColors.accent }}
                  >
                    <MapPin className="w-3.5 h-3.5" /> Abrir no Google Maps
                  </a>
                </div>
              </section>

              {/* RSVP SUBMISSION FORM */}
              {invitation.rsvpEnabled && (
                <section className="bg-white/80 backdrop-blur-md rounded-2xl border border-stone-200/60 p-6 sm:p-8 space-y-6 shadow-md" id="rsvp-guest-section">
                  <div className="text-center space-y-1.5">
                    <h3 className="text-lg font-wedding-serif font-bold uppercase tracking-widest" style={{ color: themeColors.primary }}>
                      Confirmação de Presença (R.S.V.P)
                    </h3>
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                      Favor confirmar até {invitation.rsvpDeadline}
                    </p>
                  </div>

                  {rsvpSubmitted ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center p-6 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3"
                    >
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800 mx-auto">
                        <Check className="w-5 h-5 font-bold" />
                      </div>
                      <p className="text-sm font-bold text-emerald-950">Presença Registrada com Sucesso!</p>
                      <p className="text-xs text-emerald-800 font-light leading-tight">
                        Seu nome foi enviado para a lista dos noivos. Muito obrigado por fazer parte deste dia tão especial!
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleRsvpSubmit} className="space-y-4 text-left">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-500 mb-1">Seu Nome Completo</label>
                        <input 
                          type="text" 
                          required
                          value={rsvpName}
                          onChange={e => setRsvpName(e.target.value)}
                          placeholder="Digite seu nome completo"
                          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs bg-white text-stone-800 focus:outline-none focus:ring-1"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setRsvpAttending(true)}
                          className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer flex justify-center items-center gap-1 ${
                            rsvpAttending === true 
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm font-black' 
                              : 'border-stone-200 bg-white text-stone-600'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Sim, comparecerei!
                        </button>
                        <button
                          type="button"
                          onClick={() => setRsvpAttending(false)}
                          className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer flex justify-center items-center gap-1 ${
                            rsvpAttending === false 
                              ? 'border-red-600 bg-red-50 text-red-950 shadow-sm font-black' 
                              : 'border-stone-200 bg-white text-stone-600'
                          }`}
                        >
                          ❌ Infelizmente não poderei ir
                        </button>
                      </div>

                      {rsvpAttending && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-500 mb-1">Total Acompanhantes</label>
                              <select 
                                value={rsvpCompanions}
                                onChange={e => setRsvpCompanions(parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs bg-white text-stone-800"
                              >
                                <option value="0">0 (Vou sozinho)</option>
                                <option value="1">1 Acompanhante</option>
                                <option value="2">2 Acompanhantes</option>
                                <option value="3">3 Acompanhantes</option>
                                <option value="4">4 Acompanhantes</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-500 mb-1">Restrição Alimentar? (Opcional)</label>
                              <input 
                                type="text"
                                placeholder="ex: Vegetariano, Vegano, etc."
                                value={rsvpFoodRestriction}
                                onChange={e => setRsvpFoodRestriction(e.target.value)}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs bg-white text-stone-800"
                              />
                            </div>
                          </div>

                          {rsvpCompanions > 0 && (
                            <div>
                              <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-500 mb-1">Nomes dos Acompanhantes</label>
                              <input 
                                type="text"
                                placeholder="Nome completo dos seus acompanhantes"
                                value={rsvpCompanionsNames}
                                onChange={e => setRsvpCompanionsNames(e.target.value)}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs bg-white text-stone-800"
                              />
                            </div>
                          )}
                        </motion.div>
                      )}

                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-500 mb-1">WhatsApp para Contato</label>
                          <input 
                            type="tel" 
                            required
                            placeholder="(DD) 99999-9999"
                            value={rsvpPhone}
                            onChange={e => setRsvpPhone(e.target.value)}
                            className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs bg-white text-stone-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-500 mb-1">Mensagem aos Noivos (Opcional)</label>
                          <textarea 
                            rows={3}
                            placeholder="Deixe uma linda mensagem para nós!"
                            value={rsvpMessage}
                            onChange={e => setRsvpMessage(e.target.value)}
                            className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs bg-white text-stone-800"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 text-xs font-bold text-white shadow-md rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        style={{ backgroundColor: themeColors.primary }}
                      >
                        <Send className="w-3.5 h-3.5" /> Enviar Confirmação de RSVP
                      </button>
                    </form>
                  )}
                </section>
              )}

              {/* LISTA DE PRESENTES VIA PIX */}
              {invitation.giftsEnabled && (
                <section className="space-y-6" id="gifts-list-section">
                  <div className="text-center space-y-1.5">
                    <h3 className="text-lg font-wedding-serif font-bold uppercase tracking-widest" style={{ color: themeColors.primary }}>
                      Lista de Presentes Simbólicos
                    </h3>
                    <p className="text-xs text-stone-500 font-light max-w-sm mx-auto leading-relaxed">
                      Se desejar nos presentear, escolha um item abaixo. O valor equivalente em dinheiro será transferido direto para a nossa conta via Pix!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {invitation.gifts.map((gift) => (
                      <div 
                        key={gift.id} 
                        className="bg-white rounded-2xl border border-stone-200/50 p-4 flex flex-col justify-between space-y-4 shadow-sm group hover:shadow-md transition-shadow"
                      >
                        <div className="flex gap-3">
                          <div className="space-y-1 text-left min-w-0">
                            <span className="text-[8px] font-bold uppercase tracking-widest text-amber-800 block">{gift.category}</span>
                            <h4 className="font-bold text-xs text-stone-900 truncate" title={gift.name}>{gift.name}</h4>
                            <p className="text-[10px] text-stone-400 leading-tight line-clamp-2 font-light" title={gift.description}>
                              {gift.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                          <span className="text-xs font-bold font-mono text-stone-900">R$ {gift.price.toFixed(2)}</span>
                          
                          {gift.bought ? (
                            <span className="bg-emerald-50 text-emerald-800 font-bold text-[9px] uppercase px-2.5 py-1 rounded border border-emerald-100 flex items-center gap-1 shrink-0">
                              <Check className="w-3 h-3 text-emerald-600" /> Presenteado por {gift.boughtBy}
                            </span>
                          ) : (
                            <button
                              onClick={() => setSelectedGiftForPix(gift)}
                              className="text-white text-[10px] font-bold py-1.5 px-3 rounded-full shadow-sm cursor-pointer transition-transform hover:scale-102 flex items-center gap-1 shrink-0"
                              style={{ backgroundColor: themeColors.accent }}
                            >
                              <Gift className="w-3 h-3" /> Presentear
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>
            )}

            {/* FOOTER */}
            <footer className="w-full text-center py-10 text-[10px] border-t uppercase tracking-[0.2em] font-medium" style={{ borderColor: `${themeColors.primary}10`, color: themeColors.muted }}>
              <Heart className="w-4 h-4 mx-auto mb-2 text-rose-400 fill-rose-400" />
              Esperamos vocês para celebrar conosco!
            </footer>

            {/* PIX GIFT TRANSFER MODAL */}
            <AnimatePresence>
              {selectedGiftForPix && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedGiftForPix(null)}
                    className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full space-y-4 z-10 border text-stone-800 text-left border-stone-100"
                  >
                    <div className="flex justify-between items-start border-b border-stone-100 pb-2">
                      <div>
                        <span className="text-[9px] font-bold uppercase text-amber-800">Presente via Pix</span>
                        <h3 className="font-bold text-sm text-stone-900 truncate">{selectedGiftForPix.name}</h3>
                      </div>
                      <span className="text-sm font-bold font-mono text-stone-900 shrink-0">R$ {selectedGiftForPix.price.toFixed(2)}</span>
                    </div>

                    <form onSubmit={handleGiftPixSubmit} className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-500 mb-1">Seu Nome (Para o cartão de agradecimento)</label>
                        <input 
                          type="text" 
                          required
                          value={contributorName}
                          onChange={e => setContributorName(e.target.value)}
                          placeholder="ex: Dr. Carlos &amp; Família"
                          className="w-full px-2.5 py-1.5 border border-stone-200 rounded text-xs bg-white text-stone-800"
                        />
                      </div>

                      {/* simulated Pix data representation */}
                      <div className="bg-stone-50 border rounded-xl p-3 flex gap-3 items-center">
                        <div className="bg-white p-1 rounded border shrink-0">
                          <div className="w-16 h-16 bg-stone-900 text-white flex items-center justify-center relative rounded overflow-hidden">
                            <QrCode className="w-10 h-10" />
                          </div>
                        </div>
                        <div className="space-y-1 text-left min-w-0 flex-1">
                          <p className="text-[9px] font-bold text-amber-800 uppercase tracking-widest">Titular da Conta</p>
                          <p className="text-[10px] font-bold text-stone-800 truncate leading-tight">{invitation.pixHolder}</p>
                          <p className="text-[9px] text-stone-500 leading-tight">Chave: <span className="font-mono font-bold text-stone-700">{invitation.pixKey}</span></p>
                          
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(invitation.pixKey);
                              setCopiedGiftPix(true);
                              setTimeout(() => setCopiedGiftPix(false), 2000);
                            }}
                            className="text-[9px] font-bold text-amber-850 flex items-center gap-1 underline cursor-pointer"
                          >
                            {copiedGiftPix ? 'Chave Copiada!' : 'Copiar Chave Pix'}
                          </button>
                        </div>
                      </div>

                      <div className="bg-amber-50 p-2.5 rounded text-[10px] text-amber-850 flex items-start gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                        <p className="leading-tight">
                          Isso gerará uma simulação bancária de Pix. O dinheiro será simulado na carteira dos noivos!
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedGiftForPix(null)}
                          className="flex-1 py-2 text-xs font-bold text-stone-500 bg-stone-100 hover:bg-stone-200 rounded transition-colors cursor-pointer text-center"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={isSimulatingGiftPayment}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded text-xs flex justify-center items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          {isSimulatingGiftPayment ? (
                            <span className="flex items-center gap-1 text-[10px]">Confirmando...</span>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" /> Confirmar Pix
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
