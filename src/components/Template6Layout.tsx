import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Check, Map, Volume2, VolumeX, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { WeddingInvitation, GiftItem } from '../types';
import ScratchToRevealDate from './ScratchToRevealDate';

interface Template6LayoutProps {
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

export default function Template6Layout({
  invitation,
  weddingDateInfo,
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
  setSelectedGiftForPix
}: Template6LayoutProps) {

  const isBabyFeet = invitation.historyImageUrl && (
    invitation.historyImageUrl.includes('photo-1510154221590') || 
    invitation.historyImageUrl.includes('pexels-vinicius-quar') ||
    invitation.historyImageUrl.includes('noroot')
  );
  const historyImageToUse = (isBabyFeet || !invitation.historyImageUrl) 
    ? "https://i.pinimg.com/1200x/72/ce/bc/72cebc1ca32f726bc680b8900278d6fb.jpg" 
    : invitation.historyImageUrl;

  // Audio Control state
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Attempt auto-play when invitation opens
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

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

  // Exact 5 color swatches from user's Tilda HTML
  const dressCodeSwatches = [
    { color: '#7ebbfa', name: 'Azul Celeste' },
    { color: '#afcff1', name: 'Azul Suave' },
    { color: '#f2cac9', name: 'Rosa Rosé' },
    { color: '#f5d9b1', name: 'Pêssego Areia' },
    { color: '#faf1db', name: 'Marfim Cream' }
  ];

  // Official Tilda Schedule Timeline
  const timelineEvents = [
    { time: '16:30', title: 'Abertura dos Portões' },
    { time: '17:00', title: 'Cerimônia' },
    { time: '18:00', title: 'Coquetel e Boas-Vindas' },
    { time: '20:00', title: 'Jantar Especial' },
    { time: '21:00', title: 'Festa e Open Bar' },
    { time: '23:00', title: 'Encerramento' }
  ];

  // Official Tilda Gallery Carousel Images
  const galleryImages = [
    "https://static.tildacdn.net/tild3636-6361-4930-b032-303334643635/fe849b681b9cfddb0d3b.png",
    "https://static.tildacdn.net/tild6534-6461-4737-a535-383131303433/929df5d91510928224dc.png",
    "https://static.tildacdn.net/tild6336-3439-4466-b332-383265633833/0b221d34a7bea5af08ac.jpg",
    "https://static.tildacdn.net/tild3164-3730-4539-b833-356663306534/fe9b100e056d201daaa0.jpg",
    "https://static.tildacdn.net/tild3765-6165-4631-a432-383936306336/1be83ec7c312b2e66a71.jpg",
    "https://static.tildacdn.net/tild3739-3133-4436-b536-313739653132/cbd7efbf41ddb54271af.jpg",
    "https://static.tildacdn.net/tild6562-3130-4965-b235-376232326561/61a01dd884f0c3b00bd5.jpg",
    "https://static.tildacdn.net/tild3336-6363-4363-b462-306330343939/fd70c331309855caacec.jpg",
    "https://static.tildacdn.net/tild3238-3063-4861-a134-626434323464/3f985b99d3bfbb52bbf7.jpg",
    "https://static.tildacdn.net/tild3436-3931-4635-a665-333365626134/feb970b653de72df570f.jpg"
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [showRsvpModal, setShowRsvpModal] = useState(false);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  return (
    <div className="w-full bg-[#fffdfb] text-[#3a3a3a] font-['Rufina',serif] relative overflow-hidden pb-16">
      
      {/* BACKGROUND MUSIC PLAYER (RYAN MACK) */}
      <audio 
        ref={audioRef} 
        src="https://pub-4dc8201144ca418fb604349c73e8c724.r2.dev/Forever%20and%20Ever%20and%20Always%20(The%20Wedding%20Song)%20-%20Ryan%20Mack%20(1).mp3" 
        loop
        preload="metadata"
      />

      {/* FLOATING CIRCULAR AUDIO CONTROL (#64A0BD) */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleAudio}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#64A0BD] text-white rounded-full shadow-2xl z-50 flex items-center justify-center cursor-pointer border-2 border-white/40"
        title={isPlaying ? "Pausar música" : "Tocar música"}
      >
        {isPlaying ? <Volume2 className="w-6 h-6 animate-pulse" /> : <VolumeX className="w-6 h-6 opacity-80" />}
      </motion.button>

      {/* 1. HERO SECTION WITH ITALIAN VILLA VIDEO BACKGROUND */}
      <section className="relative w-full min-h-[680px] sm:min-h-[820px] flex flex-col items-center justify-center overflow-hidden">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.92] contrast-[0.98]"
        >
          <source src="https://pub-4dc8201144ca418fb604349c73e8c724.r2.dev/Italian_villa_terrace_202604231419%20(1).MP4" type="video/mp4" />
        </video>

        {/* Soft Warm Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fffdfb]/60 via-transparent to-[#fffdfb]" />

        {/* Hero Typographical Text */}
        <div className="relative z-10 text-center px-6 space-y-4 max-w-xl mx-auto mt-auto sm:my-auto pb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl sm:text-6xl font-['Beau_Rivage',cursive] text-[#2c4b5c] font-normal drop-shadow-sm"
          >
            {invitation.coupleName1} &amp; {invitation.coupleName2}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-sm sm:text-lg uppercase tracking-[0.35em] text-[#3a3a3a] font-light"
          >
            vão se casar!
          </motion.p>
        </div>
      </section>

      {/* 2. INTERACTIVE SCRATCH TO REVEAL DATE */}
      <section className="py-16 px-6 max-w-xl mx-auto text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-medium tracking-wide">A Data</h2>
          <p className="text-xs sm:text-sm tracking-[0.3em] text-[#7a9aaa] uppercase font-light">
            ✦ Raspe para revelar a data ✦
          </p>
        </div>

        <ScratchToRevealDate 
          day={weddingDateInfo ? weddingDateInfo.day : '14'}
          month={weddingDateInfo ? weddingDateInfo.month : 'Setembro'}
          year={weddingDateInfo ? weddingDateInfo.year : '2025'}
          invitedMessage="Você foi convidado!"
        />
      </section>

      {/* 3. WELCOME LETTER (DEAR FRIENDS AND FAMILY) */}
      <section className="py-16 px-6 bg-[#fffdfb]">
        <div className="max-w-2xl mx-auto relative bg-[#fffdfb] rounded-3xl p-8 sm:p-14 border border-stone-200/50 shadow-[0_10px_40px_rgba(42,38,38,0.06)] overflow-hidden">
          
          {/* Subtle Old Envelope Watermark Background */}
          <div className="absolute right-0 top-0 w-64 h-64 pointer-events-none opacity-[0.06] translate-x-12 -translate-y-12">
            <img src="https://static.tildacdn.net/tild3132-3666-4637-a562-616361623963/Old_Open_Envelope_PN.png" alt="" className="w-full h-full object-contain" />
          </div>

          <div className="relative z-10 space-y-8 text-center sm:text-left">
            <div className="space-y-3">
              <h3 className="text-3xl sm:text-4xl font-['Beau_Rivage',cursive] text-[#2c4b5c]">
                Queridos amigos e familiares,
              </h3>
              <p className="text-base sm:text-lg leading-relaxed text-[#4a4a4a] font-light">
                {invitation.welcomeMessage || 'Com muita alegria e gratidão em nossos corações, convidamos você para celebrar nosso amor. Sua presença e apoio significam o mundo para nós, e seria uma honra tê-lo conosco ao iniciarmos nossa nova jornada juntos.'}
              </p>
            </div>

            <div className="pt-4 flex justify-center sm:justify-start">
              <img src="https://static.tildacdn.net/tild6439-3462-4163-b432-363239323565/Group_63_2.png" alt="" className="h-12 w-auto opacity-70" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. OFFICIAL SCHEDULE OF EVENTS (TIMELINE) */}
      <section className="py-20 px-6 max-w-xl mx-auto space-y-12">
        <h2 className="text-3xl sm:text-4xl font-medium text-center tracking-wide">Cronograma do Evento</h2>

        <div className="relative pl-8 sm:pl-12 space-y-10 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-[2px] before:bg-[#64a0bd]/60">
          {timelineEvents.map((ev, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-6 bg-white/80 p-5 rounded-2xl border border-stone-200/40 shadow-xs"
            >
              {/* Rotated Diamond Bullet Point */}
              <div className="absolute -left-[30px] sm:-left-[38px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#64a0bd] rotate-45 border-2 border-[#fffdfb] shadow-xs" />

              <span className="text-xl sm:text-2xl font-bold tracking-wider text-[#2c4b5c] font-mono shrink-0">
                {ev.time}
              </span>
              <span className="text-base sm:text-lg text-[#3a3a3a] font-normal sm:text-right">
                {ev.title}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. WEDDING VENUE BLOCK */}
      <section className="py-16 px-6 max-w-2xl mx-auto text-center space-y-8">
        <h2 className="text-3xl sm:text-4xl font-medium tracking-wide">Local do Casamento</h2>

        <div className="rounded-[30px] overflow-hidden shadow-xl border border-stone-200/60 bg-white">
          <div className="w-full aspect-[4/3] sm:aspect-[16/9] relative">
            <img 
              src="https://static.tildacdn.net/tild3361-3537-4334-b532-323531306235/8cdb6addd9fcedfeb54b.jpg" 
              alt={invitation.locationName}
              className="w-full h-full object-cover" 
            />
          </div>

          <div className="p-8 sm:p-10 space-y-4 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#afcff1]/30 flex items-center justify-center text-[#2c4b5c]">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-medium text-[#3a3a3a]">
              {invitation.locationName || 'Espaço Província di Toscana'}
            </h3>
            <p className="text-sm sm:text-base text-[#4a4a4a] font-light max-w-md">
              {invitation.locationAddress || 'Belo Horizonte, MG'}
            </p>

            <a 
              href={invitation.locationMapUrl || `https://maps.google.com/?q=${encodeURIComponent(invitation.locationAddress || 'Espaço Província di Toscana')}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 py-3 px-8 rounded-full bg-[#2c4b5c] text-white text-xs uppercase tracking-widest font-bold shadow-md hover:bg-black transition-all cursor-pointer hover:scale-102"
            >
              <Map className="w-4 h-4" /> Abrir no Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* 6. DRESS CODE & COLOURS */}
      <section className="py-16 px-6 max-w-2xl mx-auto text-center space-y-8 bg-[#faf9f5] rounded-3xl border border-stone-200/40 my-10">
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-medium tracking-wide">Código de Vestimenta (Dress Code)</h2>
          <p className="text-sm sm:text-base text-[#4a4a4a] font-light max-w-md mx-auto">
            {invitation.dressCode || 'Ficaríamos muito felizes se o seu traje estivesse em harmonia com as cores da nossa paleta de casamento.'}
          </p>
        </div>

        <div className="space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#7a9aaa] block font-bold">Cores Sugeridas:</span>
          
          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            {dressCodeSwatches.map((s, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5 group cursor-pointer">
                <div 
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#f2e9df] shadow-md group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-[9px] uppercase tracking-wider text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity font-sans font-bold">
                  {s.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm sm:text-base text-[#4a4a4a] font-light max-w-lg mx-auto leading-relaxed text-left sm:text-center space-y-4 pt-4 border-t border-stone-200/50">
          <p>
            <strong>Mulheres:</strong> Vestidos elegantes e fluidos em tons pastel ou suaves. Recomendamos calçados confortáveis para aproveitar a celebração.
          </p>
          <p>
            <strong>Homens:</strong> Terno completo, costume ou esporte fino em tons clássicos (cinza, azul, bege ou marrom) conforme preferir.
          </p>
        </div>
      </section>

      {/* 7. OFFICIAL PHOTO CAROUSEL SLIDER */}
      <section className="py-16 max-w-4xl mx-auto px-6 space-y-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-medium tracking-wide">Nossos Momentos de Romance</h2>

        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-stone-100 aspect-[4/3] sm:aspect-[16/9]">
          <AnimatePresence mode="wait">
            <motion.img 
              key={currentSlide}
              src={galleryImages[currentSlide]}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-cover select-none"
              alt=""
            />
          </AnimatePresence>

          {/* Carousel Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 hover:bg-white text-stone-800 shadow-lg flex items-center justify-center cursor-pointer transition-all hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 hover:bg-white text-stone-800 shadow-lg flex items-center justify-center cursor-pointer transition-all hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
            {galleryImages.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentSlide(dotIdx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${currentSlide === dotIdx ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 8. CONFIRM YOUR ATTENDANCE (RSVP) */}
      {invitation.rsvpEnabled && (
        <section className="py-20 px-6 max-w-xl mx-auto text-center space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-medium tracking-tight">Confirmar Presença</h2>
            <p className="text-sm sm:text-base text-[#4a4a4a] font-light max-w-md mx-auto leading-relaxed">
              Para nos ajudar a planejar todos os detalhes da nossa celebração, por favor confirme sua presença até 30 de Outubro.
            </p>
          </div>

          {rsvpSubmitted ? (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-8 rounded-3xl bg-[#9bc9e1]/20 border border-[#9bc9e1] space-y-3 text-center"
            >
              <Check className="w-8 h-8 text-[#2c4b5c] mx-auto font-bold" />
              <h4 className="text-xl font-bold text-[#2c4b5c]">Muito Obrigado!</h4>
              <p className="text-xs sm:text-sm text-stone-600 font-light">
                Sua confirmação de presença foi enviada com muito amor.
              </p>
            </motion.div>
          ) : (
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowRsvpModal(true)}
                className="relative overflow-hidden py-4 px-10 sm:px-14 rounded-[30px] bg-[#9bc9e1] hover:bg-[#7aaec9] text-white text-lg sm:text-xl font-normal shadow-[0_8px_25px_rgba(155,201,225,0.45)] cursor-pointer transition-all tracking-widest font-serif"
              >
                <span className="relative z-10">Confirmar Presença</span>
                
                {/* Tilda Shimmer Flash Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-30deg] pointer-events-none" />
              </motion.button>
            </div>
          )}
        </section>
      )}

      {/* 9. GIFTS SECTION (PIX) */}
      {invitation.giftsEnabled && invitation.gifts.length > 0 && (
        <section className="py-16 px-6 max-w-3xl mx-auto space-y-10 text-center border-t border-stone-200/60">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-medium tracking-wide">Lista de Presentes Pix</h2>
            <p className="text-xs sm:text-sm text-stone-500 font-light">
              Escolha um mimo simbólico para abençoar a lua de mel dos noivos via Pix instantáneo!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            {invitation.gifts.map((g) => (
              <div key={g.id} className="p-5 rounded-2xl bg-white border border-stone-200/60 shadow-xs flex justify-between items-center gap-4">
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-stone-800 truncate">{g.name}</h4>
                  <span className="text-xs font-mono text-[#2c4b5c] font-bold">R$ {g.price.toFixed(2)}</span>
                </div>
                {g.bought ? (
                  <span className="text-[10px] bg-stone-100 text-stone-500 px-2.5 py-1 rounded font-bold shrink-0">Comprado</span>
                ) : (
                  <button 
                    onClick={() => setSelectedGiftForPix(g)}
                    className="py-2 px-4 rounded-full bg-[#2c4b5c] hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider shrink-0 cursor-pointer shadow-sm"
                  >
                    Presentear
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 10. CLOSING FOOTER WITH ELEGANT COUPLE PHOTO */}
      <footer className="pt-20 px-6 max-w-xl mx-auto text-center space-y-8">
        <h2 className="text-3xl sm:text-4xl font-['Beau_Rivage',cursive] text-[#2c4b5c]">
          Esperamos você lá!
        </h2>
        <p className="text-2xl font-serif text-[#3a3a3a]">
          {invitation.coupleName1} &amp; {invitation.coupleName2}
        </p>

        <div className="w-full aspect-[4/5] rounded-[30px] overflow-hidden shadow-2xl border border-stone-200">
          <img 
            src={historyImageToUse} 
            alt="Casal" 
            className="w-full h-full object-cover"
          />
        </div>
      </footer>

      {/* RSVP POPUP MODAL (IDENTICAL TO TILDA DIALOG) */}
      <AnimatePresence>
        {showRsvpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col font-serif max-h-[90vh]"
            >
              {/* Close X Button */}
              <button 
                onClick={() => setShowRsvpModal(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black text-white flex items-center justify-center cursor-pointer transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full h-48 sm:h-60 relative shrink-0">
                <img 
                  src={historyImageToUse} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-center text-[#3a3a3a]">
                <div className="space-y-1">
                  <h3 className="text-2xl sm:text-3xl font-bold font-['Georgia',serif]">Confirmar Sua Presença</h3>
                  <p className="text-xs text-stone-500 font-light">Por favor, confirme até 30 de Outubro</p>
                </div>

                <form 
                  onSubmit={(e) => {
                    handleRsvpSubmit(e);
                    setShowRsvpModal(false);
                  }}
                  className="space-y-4 text-left font-['Georgia',serif]"
                >
                  <div className="space-y-1">
                    <label className="block text-xs text-stone-600 font-medium">Seu nome</label>
                    <input 
                      type="text" 
                      required
                      value={rsvpName}
                      onChange={e => setRsvpName(e.target.value)}
                      placeholder="Nome completo"
                      className="w-full p-3 rounded-lg border border-stone-300 text-xs text-stone-800 focus:outline-none focus:border-[#9bc9e1]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs text-stone-600 font-medium">Você irá comparecer?</label>
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {[
                        { label: "Sim, eu irei!", val: true },
                        { label: "Infelizmente, não poderei comparecer :(", val: false }
                      ].map((opt, i) => (
                        <label key={i} className={`p-3 rounded-lg border text-xs flex items-center gap-2 cursor-pointer transition-all ${rsvpAttending === opt.val ? 'bg-[#9bc9e1]/20 border-[#9bc9e1] font-bold text-[#2c4b5c]' : 'bg-white border-stone-200 hover:bg-stone-50'}`}>
                          <input 
                            type="radio" 
                            name="attending_radio"
                            checked={rsvpAttending === opt.val}
                            onChange={() => setRsvpAttending(opt.val)}
                            className="text-[#9bc9e1]"
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {rsvpAttending && (
                    <div className="space-y-3 pt-2">
                      <div className="space-y-1">
                        <label className="block text-xs text-stone-600 font-medium">Total acompanhantes</label>
                        <select 
                          value={rsvpCompanions}
                          onChange={e => setRsvpCompanions(parseInt(e.target.value))}
                          className="w-full p-3 rounded-lg border border-stone-300 text-xs bg-white text-stone-800"
                        >
                          <option value="0">0 Acompanhantes (Só eu)</option>
                          <option value="1">1 Acompanhante</option>
                          <option value="2">2 Acompanhantes</option>
                          <option value="3">3 Acompanhantes</option>
                        </select>
                      </div>

                      {rsvpCompanions > 0 && (
                        <div className="space-y-1">
                          <label className="block text-xs text-stone-600 font-medium">Nomes dos acompanhantes</label>
                          <input 
                            type="text"
                            placeholder="Nome de cada acompanhante"
                            value={rsvpCompanionsNames}
                            onChange={e => setRsvpCompanionsNames(e.target.value)}
                            className="w-full p-3 rounded-lg border border-stone-300 text-xs text-stone-800"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-xs text-stone-600 font-medium">WhatsApp / Telefone para contato</label>
                    <input 
                      type="tel"
                      required
                      placeholder="(DD) 99999-9999"
                      value={rsvpPhone}
                      onChange={e => setRsvpPhone(e.target.value)}
                      className="w-full p-3 rounded-lg border border-stone-300 text-xs text-stone-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs text-stone-600 font-medium">Possui alguma restrição alimentar ou intolerância?</label>
                    <input 
                      type="text"
                      placeholder="ex: Vegetariano, Sem glúten"
                      value={rsvpFoodRestriction}
                      onChange={e => setRsvpFoodRestriction(e.target.value)}
                      className="w-full p-3 rounded-lg border border-stone-300 text-xs text-stone-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 mt-2 rounded-[20px] bg-[#9bc9e1] hover:bg-[#7aaec9] text-white text-sm uppercase tracking-widest font-bold shadow-md cursor-pointer transition-all"
                  >
                    Enviar Confirmação
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
