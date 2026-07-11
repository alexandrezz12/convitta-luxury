import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Check, Map, Volume2, VolumeX
} from 'lucide-react';
import { WeddingInvitation, GiftItem } from '../types';

interface Template7LayoutProps {
  invitation: WeddingInvitation;
  themeColors: any;
  fontDisplay: string;
  fontSans: string;
  weddingDateInfo: any;
  timeRemaining: { days: number; hours: number; minutes: number; seconds: number; isPast: boolean };
  rsvpSubmitted: boolean;
  handleRsvpSubmit: (e: React.FormEvent) => void;
  rsvpName: string;
  setRsvpName: (v: string) => void;
  rsvpAttending: boolean | null;
  setRsvpAttending: (v: boolean | null) => void;
  rsvpPhone: string;
  setRsvpPhone: (v: string) => void;
  rsvpCompanions: number;
  setRsvpCompanions: (v: number) => void;
  rsvpCompanionsNames: string;
  setRsvpCompanionsNames: (v: string) => void;
  rsvpFoodRestriction: string;
  setRsvpFoodRestriction: (v: string) => void;
  rsvpMessage: string;
  setRsvpMessage: (v: string) => void;
  setSelectedGiftForPix: (v: GiftItem | null) => void;
}

export default function Template7Layout({
  invitation,
  weddingDateInfo,
  timeRemaining,
  rsvpSubmitted,
  handleRsvpSubmit,
  rsvpName,
  setRsvpName,
  rsvpAttending,
  setRsvpAttending,
  rsvpPhone,
  setRsvpPhone,
  rsvpCompanions,
  setRsvpCompanions,
  rsvpCompanionsNames,
  setRsvpCompanionsNames,
  rsvpFoodRestriction,
  setRsvpFoodRestriction,
  rsvpMessage,
  setRsvpMessage,
  setSelectedGiftForPix
}: Template7LayoutProps) {

  const isBabyFeet = invitation.historyImageUrl && (
    invitation.historyImageUrl.includes('photo-1510154221590') || 
    invitation.historyImageUrl.includes('pexels-vinicius-quar') ||
    invitation.historyImageUrl.includes('noroot')
  );
  const historyImageToUse = (isBabyFeet || !invitation.historyImageUrl) 
    ? "https://i.pinimg.com/1200x/5f/b5/00/5fb50069cb7e49988b38d04552f03405.jpg" 
    : invitation.historyImageUrl;

  // Audio Control state
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Preloader & Curtain state
  const [isLoading, setIsLoading] = useState(true);
  const [curtainsOpen, setCurtainsOpen] = useState(false);

  // Drink option selected in RSVP
  const [selectedDrink, setSelectedDrink] = useState<string>('Champagne');

  useEffect(() => {
    // 2.2s preloader simulation
    const preloaderTimer = setTimeout(() => {
      setIsLoading(false);
      // Wait another 0.5s for fade-out, then trigger curtain opening
      setTimeout(() => {
        setCurtainsOpen(true);
      }, 500);
    }, 2200);

    return () => clearTimeout(preloaderTimer);
  }, []);

  useEffect(() => {
    // Attempt auto-play when curtains are opened
    if (curtainsOpen && audioRef.current) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [curtainsOpen]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const dressCodeSwatches = [
    { color: '#ebdad2', name: 'Areia Peach' },
    { color: '#cbcbcb', name: 'Cinza Soft' },
    { color: '#b3998d', name: 'Rosê Queimado' },
    { color: '#757575', name: 'Cinza Médio' },
    { color: '#343434', name: 'Preto Clássico' }
  ];

  const timelineEvents = [
    { time: '12:00', title: 'Cerimônia de Casamento', location: 'The Heerenhuys' },
    { time: '13:30', title: 'Translado dos Convidados', location: '' },
    { time: '14:00', title: 'Coquetel de Boas-vindas', location: '' },
    { time: '15:00', title: 'Primeira Dança dos Noivos', location: '' },
    { time: '15:30', title: 'Almoço Festivo', location: '' },
    { time: '17:00', title: 'Abertura da Pista & Festa', location: '' },
    { time: '21:00', title: 'Encerramento do Evento', location: '' }
  ];

  const formattedDay = weddingDateInfo ? weddingDateInfo.day : '19';
  const formattedMonth = weddingDateInfo ? weddingDateInfo.month : 'Setembro';
  const formattedYear = weddingDateInfo ? weddingDateInfo.year : '2026';

  return (
    <div className="w-full bg-[#1b232d] text-[#f9f1ed] relative overflow-hidden pb-20 font-serif">
      
      {/* 1. BACKGROUND MUSIC PLAYER */}
      <audio 
        ref={audioRef} 
        src="https://pub-4dc8201144ca418fb604349c73e8c724.r2.dev/Forever%20and%20Ever%20and%20Always%20(The%20Wedding%20Song)%20-%20Ryan%20Mack%20(1).mp3" 
        loop
        preload="metadata"
      />

      {/* 2. MAJESTIC CURTAINS & PRELOADER OVERLAY */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 bg-[#1b232d] z-[99999] flex flex-col items-center justify-center text-center"
          >
            {/* Logo Wrapper */}
            <div className="relative w-36 h-36 bg-[url('https://res.cloudinary.com/dox8yqpts/image/upload/v1755806601/logo_3_lmipaz.png')] bg-contain bg-no-repeat bg-center mb-6 animate-pulse" />
            
            {/* Loading text with Beau Rivage elegance */}
            <h2 className="text-3xl font-['Beau_Rivage',cursive] text-[#e2cd96] tracking-wider">
              Carregando o Amor...
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sliding Curtains */}
      <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
        {/* Left Gold Curtain */}
        <div 
          className={`absolute top-0 bottom-0 left-0 w-1/2 bg-cover bg-right bg-no-repeat transition-all duration-[2.5s] ease-in-out origin-top-left ${
            curtainsOpen ? '-translate-x-[140%] -rotate-12 opacity-0' : 'translate-x-0 opacity-100'
          }`}
          style={{ 
            backgroundImage: "url('https://res.cloudinary.com/dox8yqpts/image/upload/v1755806646/curtain-left-gold3_jvlppg.png')",
          }}
        />
        {/* Right Gold Curtain */}
        <div 
          className={`absolute top-0 bottom-0 right-0 w-1/2 bg-cover bg-left bg-no-repeat transition-all duration-[2.5s] ease-in-out origin-top-right ${
            curtainsOpen ? 'translate-x-[140%] rotate-12 opacity-0' : 'translate-x-0 opacity-100'
          }`}
          style={{ 
            backgroundImage: "url('https://res.cloudinary.com/dox8yqpts/image/upload/v1755806642/curtain-right-gold3_kkwnel.png')",
          }}
        />
      </div>

      {/* FLOATING AUDIO CONTROL GILDED IN ROYAL GOLD */}
      {curtainsOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleAudio}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#1b232d]/90 hover:bg-[#25323e] text-[#e2cd96] rounded-full shadow-2xl z-50 flex items-center justify-center cursor-pointer border-2 border-[#e2cd96]/50"
          title={isPlaying ? "Pausar música" : "Tocar música"}
        >
          {isPlaying ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5 opacity-80" />}
        </motion.button>
      )}

      {/* 3. HERO HERO VIDEO BACKGROUND COVER */}
      <section className="relative w-full h-[100vh] sm:h-[100vh] flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Background Ambient Video with Subtle Motion */}
        <div className="absolute inset-0 z-0 bg-[#1b232d]">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            preload="auto"
            poster="https://images.unsplash.com/photo-1518398046500-7c37c3a8c76d?q=60&w=800&auto=format&fit=crop"
            className="w-full h-full object-cover scale-105 filter brightness-50 contrast-[1.05]"
          >
            <source src="https://pub-4dc8201144ca418fb604349c73e8c724.r2.dev/Animate_still_image_subtle_motion_202605011544%20(1).mp4" type="video/mp4" />
            Seu navegador não suporta vídeos.
          </video>
          {/* Gilded dark overlay vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b232d] via-transparent to-[#1b232d]/40" />
        </div>

        {/* Floating Content */}
        <div className="relative z-10 space-y-6 px-4 max-w-2xl select-none mt-20">
          {/* Subtitle / Date */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={curtainsOpen ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1, duration: 1.2 }}
            className="text-lg sm:text-2xl font-normal tracking-[0.25em] text-[#e2cd96]"
          >
            {formattedDay}.{String(formattedMonth).substring(0,3).toUpperCase()}.{formattedYear}
          </motion.p>

          {/* Couple Main Title */}
          <motion.h1 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={curtainsOpen ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1.4, duration: 1.5 }}
            className="text-5xl sm:text-7xl md:text-8xl font-light text-[#e2cd96] leading-none tracking-wide font-serif"
            style={{ textShadow: '0 2px 20px rgba(27,35,45,0.8)' }}
          >
            {invitation.coupleName1}
            <span className="block text-2xl sm:text-3xl font-['Beau_Rivage',cursive] italic text-[#e2cd96] my-2">&amp;</span>
            {invitation.coupleName2}
          </motion.h1>

          {/* Bouncy Indicator Down */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={curtainsOpen ? { opacity: 0.8, y: [0, 8, 0] } : {}}
            transition={{ delay: 2.2, duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="pt-12 flex flex-col items-center gap-2 text-stone-300/80 cursor-pointer"
            onClick={() => {
              document.getElementById('intro-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="text-xs uppercase tracking-[0.25em] text-[#e2cd96]">Role para Baixo</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 15.86" className="w-5 h-auto" stroke="#e2cd96" fill="none" strokeWidth="1.5" strokeLinecap="round">
              <path d="M1 1C4.36 5.44 7.72 9.87 11.08 14.31C15.38 9.87 19.69 5.44 23.99 1" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* 4. INTRO CARD SECTION */}
      <section id="intro-section" className="py-24 px-4 max-w-xl mx-auto text-center relative scroll-mt-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="bg-[#f8f0ed] text-[#292f38] p-8 sm:p-12 rounded-3xl shadow-2xl relative border border-white/40 overflow-hidden"
        >
          {/* Side Leaf Decoration */}
          <img 
            src="https://static.tildacdn.net/tild3566-6531-4664-b563-343931623738/6cac4b3c-644d-4d2e-a.png" 
            className="absolute right-0 bottom-0 w-32 sm:w-44 pointer-events-none opacity-20 translate-x-4 translate-y-4"
            alt=""
          />

          <div className="space-y-6 relative z-10">
            <h3 className="text-xl sm:text-2xl tracking-[0.1em] font-medium text-stone-700">
              Queridos amigos e familiares,
            </h3>
            
            <p className="text-base sm:text-lg leading-relaxed text-[#292f38]/90 font-light">
              Neste outono, um evento muito especial e imensamente feliz vai acontecer: nosso casamento!
            </p>

            <p className="text-base sm:text-lg leading-relaxed text-[#292f38]/90 font-light">
              Não conseguimos imaginar este dia incrível sem as nossas pessoas mais próximas. Por isso, estamos imensamente animados para convidar você a se juntar a nós e celebrar este momento inesquecível.
            </p>
          </div>
        </motion.div>
      </section>

      {/* 5. GILDED COUNTDOWN TIMER */}
      <section className="py-12 px-4 text-center space-y-6 bg-gradient-to-b from-transparent to-[#161d27]">
        <h3 className="text-lg sm:text-xl font-light tracking-[0.25em] text-[#e2cd96] uppercase">
          Vamos celebrar este momento em:
        </h3>

        {timeRemaining.isPast ? (
          <p className="text-2xl font-bold uppercase tracking-widest text-[#e2cd96] py-6">
            Já Casados! 🎉💖
          </p>
        ) : (
          <div className="flex justify-center items-center gap-3 sm:gap-6 py-4">
            <div className="text-center">
              <span className="block text-4xl sm:text-6xl font-light text-[#e2cd96] font-serif">{String(timeRemaining.days).padStart(2, '0')}</span>
              <span className="block text-[10px] sm:text-xs tracking-[0.15em] text-stone-400 mt-1 uppercase">Dias</span>
            </div>
            <div className="text-3xl sm:text-5xl text-[#e2cd96] font-light -mt-6">:</div>
            <div className="text-center">
              <span className="block text-4xl sm:text-6xl font-light text-[#e2cd96] font-serif">{String(timeRemaining.hours).padStart(2, '0')}</span>
              <span className="block text-[10px] sm:text-xs tracking-[0.15em] text-stone-400 mt-1 uppercase">Horas</span>
            </div>
            <div className="text-3xl sm:text-5xl text-[#e2cd96] font-light -mt-6">:</div>
            <div className="text-center">
              <span className="block text-4xl sm:text-6xl font-light text-[#e2cd96] font-serif">{String(timeRemaining.minutes).padStart(2, '0')}</span>
              <span className="block text-[10px] sm:text-xs tracking-[0.15em] text-stone-400 mt-1 uppercase">Minutos</span>
            </div>
            <div className="text-3xl sm:text-5xl text-[#e2cd96] font-light -mt-6">:</div>
            <div className="text-center">
              <span className="block text-4xl sm:text-6xl font-light text-rose-400 font-serif">{String(timeRemaining.seconds).padStart(2, '0')}</span>
              <span className="block text-[10px] sm:text-xs tracking-[0.15em] text-rose-400 mt-1 uppercase">Segundos</span>
            </div>
          </div>
        )}
      </section>

      {/* 6. EVENT TIMELINE SECTION */}
      <section className="py-24 px-4 bg-[#161d27] relative">
        {/* Flower bouquet branch vector at top left of timeline */}
        <img 
          src="https://static.tildacdn.net/tild3036-3838-4237-b535-386464323464/New_Project_1.png" 
          className="absolute left-0 top-6 w-36 pointer-events-none opacity-15 rotate-12"
          alt=""
        />

        <div className="max-w-xl mx-auto space-y-12 relative z-10">
          <div className="text-center space-y-2">
            <span className="text-xs tracking-[0.3em] uppercase text-[#e2cd96] font-bold block">Cronograma do Evento</span>
            <h2 className="text-3xl sm:text-4xl font-medium tracking-wide">Linha do Tempo</h2>
          </div>

          <div className="bg-[#f8f0ed] text-[#292f38] p-8 sm:p-12 rounded-3xl shadow-xl space-y-8 relative overflow-hidden border border-white/40">

            <div className="space-y-6">
              {timelineEvents.map((ev, idx) => (
                <div key={idx} className="flex gap-4 items-start border-b border-stone-200/50 pb-4 last:border-0 last:pb-0">
                  <span className="text-xl sm:text-2xl font-bold font-mono text-stone-700 w-16 shrink-0 pt-0.5">
                    {ev.time}
                  </span>
                  <div className="space-y-0.5 text-left">
                    <h4 className="text-base sm:text-lg font-bold text-stone-900">{ev.title}</h4>
                    {ev.location && (
                      <p className="text-xs text-stone-500 font-light flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {ev.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. PHOTO COLLAGE & DRESS CODE */}
      <section className="py-24 px-4 max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-2">
          <span className="text-xs tracking-[0.3em] uppercase text-[#e2cd96] font-bold block">Galeria</span>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-wide">Nossos Momentos</h2>
        </div>

        {/* Elegant Masonry Collage inspired by the Tilda Layout */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 sm:col-span-8 overflow-hidden rounded-2xl shadow-lg border border-white/10 aspect-[16/10]">
            <img src={historyImageToUse} className="w-full h-full object-cover hover:scale-103 transition-transform duration-700" alt="" />
          </div>
          <div className="col-span-6 sm:col-span-4 overflow-hidden rounded-2xl shadow-lg border border-white/10 aspect-[4/5]">
            <img src="https://static.tildacdn.net/tild3031-6133-4661-b231-616463396234/65617bc1-11c3-4b8b-b.png" className="w-full h-full object-cover hover:scale-103 transition-transform duration-700" alt="" />
          </div>
          
          <div className="col-span-6 sm:col-span-4 overflow-hidden rounded-2xl shadow-lg border border-white/10 aspect-[4/5]">
            <img src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop" referrerPolicy="no-referrer" className="w-full h-full object-cover hover:scale-103 transition-transform duration-700" alt="" />
          </div>
          <div className="col-span-12 sm:col-span-8 overflow-hidden rounded-2xl shadow-lg border border-white/10 aspect-[16/10]">
            <img src="https://static.tildacdn.net/tild6331-3164-4564-b831-356536373330/c2665f5d-6a8b-4797-9.png" className="w-full h-full object-cover hover:scale-103 transition-transform duration-700" alt="" />
          </div>

          <div className="col-span-6 sm:col-span-4 overflow-hidden rounded-2xl shadow-lg border border-white/10 aspect-[4/5]">
            <img src="https://static.tildacdn.net/tild3162-3837-4030-b361-333761653061/ab54cd45-113c-443e-8.png" className="w-full h-full object-cover hover:scale-103 transition-transform duration-700" alt="" />
          </div>
          <div className="col-span-6 sm:col-span-4 overflow-hidden rounded-2xl shadow-lg border border-white/10 aspect-[4/5]">
            <img src="https://static.tildacdn.net/tild6463-3033-4634-b938-636630303166/2ec4c25d-2005-45f6-9.png" className="w-full h-full object-cover hover:scale-103 transition-transform duration-700" alt="" />
          </div>
          <div className="col-span-12 sm:col-span-4 overflow-hidden rounded-2xl shadow-lg border border-white/10 aspect-[4/5]">
            <img src="https://static.tildacdn.net/tild3635-3463-4638-b835-353962366138/56715b07-6268-471a-b.png" className="w-full h-full object-cover hover:scale-103 transition-transform duration-700" alt="" />
          </div>
        </div>

        {/* Dress Code Palette Section */}
        <div className="bg-[#161d27] border border-white/5 rounded-3xl p-8 sm:p-12 text-center space-y-6 max-w-xl mx-auto shadow-lg">
          <div className="space-y-1">
            <h4 className="text-xl font-bold text-[#e2cd96]">Dress Code</h4>
            <p className="text-xs text-slate-400 font-light max-w-md mx-auto leading-relaxed">
              Ficaríamos muito felizes se o seu visual estivesse em harmonia com as cores sugeridas para o nosso tema de casamento.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
            <div className="flex gap-3 justify-center">
              {dressCodeSwatches.map((s, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 group relative">
                  <div 
                    className="w-12 h-14 sm:w-14 sm:h-14 rounded-full border border-white/20 shadow-md group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                    style={{ backgroundColor: s.color }}
                  />
                  {/* Tooltip on hover */}
                  <span className="absolute -bottom-8 scale-0 group-hover:scale-100 transition-all text-[9px] uppercase tracking-wider bg-black/90 text-[#e2cd96] px-1.5 py-0.5 rounded font-sans shrink-0 font-bold whitespace-nowrap">
                    {s.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-stone-400 font-light italic leading-tight text-center sm:text-left">
              * Sugerimos tons suaves, pastéis e terrosos para manter a harmonia fotográfica do evento.
            </div>
          </div>
        </div>
      </section>

      {/* 8. CONFIRM YOUR ATTENDANCE (RSVP) */}
      {invitation.rsvpEnabled && (
        <section className="py-24 px-4 bg-[#161d27] relative">
          {/* Flower Vector bottom right of RSVP */}
          <img 
            src="https://static.tildacdn.net/tild6338-6334-4438-a236-383436353565/New_Project_2_1.png" 
            className="absolute right-0 bottom-6 w-36 pointer-events-none opacity-15 -rotate-12"
            alt=""
          />

          <div className="max-w-xl mx-auto space-y-10 relative z-10">
            <div className="text-center space-y-2">
              <span className="text-xs tracking-[0.3em] uppercase text-[#e2cd96] font-bold block">Confirmação de Presença</span>
              <h2 className="text-3xl sm:text-4xl font-medium tracking-wide">Você Irá?</h2>
            </div>

            <div className="bg-[#f8f0ed] text-[#292f38] rounded-3xl overflow-hidden shadow-2xl border border-white/40">
              {/* Arched Picture Header */}
              <div className="w-full h-48 sm:h-64 overflow-hidden relative">
                <img 
                  src={historyImageToUse} 
                  className="w-full h-full object-cover" 
                  alt="" 
                />
                <div className="absolute inset-0 bg-stone-900/10" />
              </div>

              {/* Form container */}
              <div className="p-8 sm:p-12 space-y-6">
                <div className="text-center space-y-2 pb-4 border-b border-stone-200/50">
                  <h3 className="text-2xl font-bold font-serif text-stone-800">Confirme sua Presença</h3>
                  <p className="text-xs text-stone-500 font-light leading-relaxed">
                    Para nos ajudar a planejar cada detalhe com amor, por favor responda até {invitation.rsvpDeadline || '30 de Outubro'}.
                  </p>
                </div>

                {rsvpSubmitted ? (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3 text-center"
                  >
                    <Check className="w-10 h-10 text-emerald-700 mx-auto font-bold" />
                    <h4 className="text-xl font-bold text-emerald-950">Muito Obrigado!</h4>
                    <p className="text-xs text-emerald-800 font-light leading-relaxed">
                      Sua confirmação foi registrada com sucesso e enviada diretamente para o coração dos noivos.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleRsvpSubmit} className="space-y-5 text-left font-serif">
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="block text-xs text-stone-600 font-medium">Qual o seu nome?</label>
                      <input 
                        type="text" 
                        required
                        value={rsvpName}
                        onChange={e => setRsvpName(e.target.value)}
                        placeholder="Seu nome completo"
                        className="w-full p-3.5 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:border-[#e2cd96] bg-white transition-colors"
                      />
                    </div>

                    {/* Attendance Radio */}
                    <div className="space-y-1.5">
                      <label className="block text-xs text-stone-600 font-medium">Você comparecerá ao evento?</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          { label: "Sim, eu irei!", val: true },
                          { label: "Infelizmente, não poderei ir :(", val: false }
                        ].map((opt, i) => (
                          <label 
                            key={i} 
                            className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 cursor-pointer transition-all ${
                              rsvpAttending === opt.val 
                                ? 'bg-[#1b232d]/10 border-[#1b232d] font-bold text-stone-900 shadow-sm' 
                                : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-600'
                            }`}
                          >
                            <input 
                              type="radio" 
                              name="attendance_radio_7"
                              checked={rsvpAttending === opt.val}
                              onChange={() => setRsvpAttending(opt.val)}
                              className="text-[#1b232d]"
                            />
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Companions and Restrictions conditional details */}
                    {rsvpAttending && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4 pt-1"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-xs text-stone-600 font-medium">Acompanhantes</label>
                            <select 
                              value={rsvpCompanions}
                              onChange={e => setRsvpCompanions(parseInt(e.target.value))}
                              className="w-full p-3.5 rounded-xl border border-stone-300 text-xs bg-white text-stone-800 focus:outline-none focus:border-[#e2cd96]"
                            >
                              <option value="0">Vou sozinho(a)</option>
                              <option value="1">1 Acompanhante</option>
                              <option value="2">2 Acompanhantes</option>
                              <option value="3">3 Acompanhantes</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-xs text-stone-600 font-medium">Restrição Alimentar</label>
                            <input 
                              type="text"
                              placeholder="ex: Vegano, sem lactose, etc."
                              value={rsvpFoodRestriction}
                              onChange={e => setRsvpFoodRestriction(e.target.value)}
                              className="w-full p-3.5 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white"
                            />
                          </div>
                        </div>

                        {rsvpCompanions > 0 && (
                          <div className="space-y-1">
                            <label className="block text-xs text-stone-600 font-medium">Nome dos acompanhantes</label>
                            <input 
                              type="text"
                              placeholder="Nome de cada acompanhante separado por vírgula"
                              value={rsvpCompanionsNames}
                              onChange={e => setRsvpCompanionsNames(e.target.value)}
                              className="w-full p-3.5 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white"
                            />
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* What would you like to drink selection */}
                    <div className="space-y-1">
                      <label className="block text-xs text-stone-600 font-medium">Qual a sua preferência de bebida?</label>
                      <select 
                        value={selectedDrink}
                        onChange={e => setSelectedDrink(e.target.value)}
                        className="w-full p-3.5 rounded-xl border border-stone-300 text-xs bg-white text-stone-800 focus:outline-none focus:border-[#e2cd96]"
                      >
                        <option value="Champagne">Champanhe / Frisante</option>
                        <option value="Vinho Branco">Vinho Branco</option>
                        <option value="Vinho Tinto">Vinho Tinto</option>
                        <option value="Cerveja">Cerveja</option>
                        <option value="Whisky">Whisky / Destilados</option>
                        <option value="Sem álcool">Não bebo álcool</option>
                      </select>
                    </div>

                    {/* WhatsApp */}
                    <div className="space-y-1">
                      <label className="block text-xs text-stone-600 font-medium">Seu WhatsApp de contato</label>
                      <input 
                        type="tel" 
                        required
                        value={rsvpPhone}
                        onChange={e => setRsvpPhone(e.target.value)}
                        placeholder="(DD) 99999-9999"
                        className="w-full p-3.5 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white focus:outline-none focus:border-[#e2cd96]"
                      />
                    </div>

                    {/* Message to Couple */}
                    <div className="space-y-1">
                      <label className="block text-xs text-stone-600 font-medium">Recadinho aos noivos (Opcional)</label>
                      <textarea 
                        rows={3}
                        value={rsvpMessage}
                        onChange={e => setRsvpMessage(e.target.value)}
                        placeholder="Deixe uma mensagem carinhosa aqui..."
                        className="w-full p-3.5 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 mt-4 rounded-full bg-[#1b232d] hover:bg-[#25323e] text-[#e2cd96] text-xs font-bold uppercase tracking-widest shadow-lg cursor-pointer transition-all hover:scale-102 flex justify-center items-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Confirmar Presença
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 9. GIFTS LIST PIX */}
      {invitation.giftsEnabled && invitation.gifts.length > 0 && (
        <section className="py-24 px-4 max-w-3xl mx-auto space-y-10 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-medium tracking-wide">Lista de Presentes Pix</h2>
            <p className="text-xs sm:text-sm text-stone-400 font-light max-w-md mx-auto leading-relaxed">
              Abençoe a jornada dos noivos com um mimo simbólico transferido com segurança via Pix direto na conta do casal!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            {invitation.gifts.map((g) => (
              <div key={g.id} className="p-5 rounded-2xl bg-[#161d27] border border-white/5 shadow-md flex justify-between items-center gap-4 hover:border-white/10 transition-colors">
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-stone-100 truncate">{g.name}</h4>
                  <span className="text-xs font-mono text-[#e2cd96] font-bold">R$ {g.price.toFixed(2)}</span>
                </div>
                {g.bought ? (
                  <span className="text-[10px] bg-stone-800 text-stone-500 px-2.5 py-1 rounded font-bold shrink-0">Comprado</span>
                ) : (
                  <button 
                    onClick={() => setSelectedGiftForPix(g)}
                    className="py-2 px-4 rounded-full bg-[#e2cd96] hover:bg-[#fffaf8] text-[#1b232d] text-[10px] font-bold uppercase tracking-wider shrink-0 cursor-pointer shadow-sm transition-colors"
                  >
                    Presentear
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 10. MAP / VENUE DETAILS */}
      <section className="py-24 px-4 bg-[#161d27] relative text-center space-y-8">
        <div className="max-w-xl mx-auto space-y-2">
          <span className="text-xs tracking-[0.3em] uppercase text-[#e2cd96] font-bold block">Localização</span>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-wide">Como Chegar</h2>
        </div>

        <div className="max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#1b232d]">
          {/* Real Maps Iframe Integration */}
          <div className="w-full aspect-[16/9] relative">
            <iframe 
              src={`https://maps.google.com/maps?q=${encodeURIComponent(invitation.locationAddress || 'Mijnsherenlaan 9, 3081 GA Rotterdam')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true}
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            />
          </div>

          <div className="p-8 space-y-4">
            <h3 className="text-2xl font-bold font-serif text-[#e2cd96]">
              {invitation.locationName || 'The Heerenhuys'}
            </h3>
            <p className="text-sm text-stone-300 font-light max-w-md mx-auto leading-relaxed">
              {invitation.locationAddress || 'Mijnsherenlaan 9, 3081 GA Rotterdam, Países Baixos'}
            </p>
            
            <div className="pt-2">
              <a 
                href={invitation.locationMapUrl || `https://maps.google.com/?q=${encodeURIComponent(invitation.locationAddress || 'The Heerenhuys')}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-3 px-8 rounded-full bg-[#e2cd96] text-[#1b232d] text-xs uppercase tracking-widest font-bold shadow-md hover:bg-[#fff] transition-all cursor-pointer hover:scale-102"
              >
                <Map className="w-4 h-4" /> Traçar Rota de GPS
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 11. CLOSING FOOTER WITH DYNAMIC GREETING & ASSETS */}
      <footer className="pt-24 pb-16 px-4 max-w-xl mx-auto text-center space-y-6">
        {/* Flower detail at bottom */}
        <img 
          src="https://static.tildacdn.net/tild3962-3461-4562-b131-373333366331/image_30.png" 
          className="w-10 h-auto mx-auto pointer-events-none opacity-45"
          alt=""
        />

        <h2 className="text-4xl sm:text-5xl font-['Beau_Rivage',cursive] text-[#e2cd96] tracking-wide">
          Esperamos ver você lá!
        </h2>
        <p className="text-2xl font-serif tracking-widest text-[#f9f1ed]/80">
          {invitation.coupleName1} &amp; {invitation.coupleName2}
        </p>

        <p className="text-[10px] tracking-widest text-slate-500 uppercase pt-12">
          © {formattedYear} {invitation.coupleName1} &amp; {invitation.coupleName2} • Feito com Amor
        </p>
      </footer>

    </div>
  );
}
