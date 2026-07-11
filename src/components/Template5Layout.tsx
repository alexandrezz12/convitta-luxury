import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Check, Map, X, Pause, Play
} from 'lucide-react';
import { WeddingInvitation, GiftItem } from '../types';

interface Template5LayoutProps {
  invitation: WeddingInvitation;
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
  setSelectedGiftForPix: (v: GiftItem | null) => void;
}

const createSeededRandom = (seed: number) => {
  return function() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
};

const getTornPath = (type: 'top' | 'bottom', seed: number = 42) => {
  const rng = createSeededRandom(seed);
  const N = 350; // Ultra high precision detailed deckled fiber count
  const width = 1200;
  const points: string[] = [];
  
  // Center the baseline at y = 60 to allow deep valleys and high peaks without clipping
  const yBase = 60;
  
  for (let i = 0; i <= N; i++) {
    const x = (i / N) * width;
    const t = x / width;
    
    // Create multiple frequencies of organic waves to form the beautiful hand-torn uneven shape
    // A slow macro wave to establish the peaks and valleys
    const waveMacro = Math.sin(t * Math.PI * 2.8 + seed * 1.5) * 16.0;
    
    // A medium wave to add natural secondary curves
    const waveMedium = Math.cos(t * Math.PI * 6.2 - seed) * 7.0;
    
    // A micro wave for subtle rolling hills
    const waveMicro = Math.sin(t * 26 + seed) * 1.8;
    
    // Realistic detailed hand-torn paper fiber texture
    const jaggedPrimary = (rng() - 0.5) * 4.5;
    const jaggedFine = (rng() - 0.5) * 1.2;
    
    // Combine them
    const y = yBase + waveMacro + waveMedium + waveMicro + jaggedPrimary + jaggedFine;
    
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  
  if (type === 'top') {
    return `M 0,0 L ${points.join(' L ')} L 1200,0 Z`;
  } else {
    return `M 0,120 L ${points.join(' L ')} L 1200,120 Z`;
  }
};

const topTornPath = getTornPath('top', 101);
const bottomTornPath = getTornPath('bottom', 202);

export default function Template5Layout({
  invitation,
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
  setSelectedGiftForPix
}: Template5LayoutProps) {

  const isBabyFeet = invitation.historyImageUrl && (
    invitation.historyImageUrl.includes('photo-1510154221590') || 
    invitation.historyImageUrl.includes('pexels-vinicius-quar') ||
    invitation.historyImageUrl.includes('noroot')
  );
  const historyImageToUse = (isBabyFeet || !invitation.historyImageUrl) 
    ? "https://i.pinimg.com/1200x/ed/11/e8/ed11e804fae8edbeefff1389cc18ead7.jpg" 
    : invitation.historyImageUrl;

  const formatName = (name: string) => {
    return name || "";
  };

  // Dynamic Date Formatting Helper for RSVP Deadline
  const formatRsvpDeadline = (dateStr: string) => {
    if (!dateStr) return '30 de Outubro';
    try {
      const parts = dateStr.split('-');
      if (parts.length !== 3) return dateStr;
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      return `${day} de ${months[monthIndex]}`;
    } catch (e) {
      return dateStr;
    }
  };

  // Audio Control state (Alex Warren - Ordinary)
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
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

  // Official Tilda Schedule Timeline for Template 5
  const timelineEvents = [
    { time: '16:00', title: 'Cerimônia' },
    { time: '17:00', title: 'Coquetel' },
    { time: '19:00', title: 'Jantar', isRose: true },
    { time: '20:00', title: 'Festa' }
  ];

  const [showRsvpModal, setShowRsvpModal] = useState(false);

  // Scroll ref for the timeline section
  const timelineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"]
  });

  const flowerTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Custom Torn Paper dividers to mask background transitions beautifully with a gorgeous curved opening effect
  const TornPaperDividerTop = () => (
    <div className="absolute top-0 inset-x-0 h-14 sm:h-20 w-full overflow-hidden leading-[0] z-20 pointer-events-none select-none">
      <svg 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none" 
        className="relative block w-full h-full text-[#66021f] fill-current"
      >
        <path d={topTornPath} />
      </svg>
    </div>
  );

  const TornPaperDividerBottom = () => (
    <div className="absolute bottom-0 inset-x-0 h-14 sm:h-20 w-full overflow-hidden leading-[0] z-20 pointer-events-none select-none">
      <svg 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none" 
        className="relative block w-full h-full text-[#66021f] fill-current"
      >
        <path d={bottomTornPath} />
      </svg>
    </div>
  );

  return (
    <div className="w-full bg-[#66021f] text-[#fffaf8] font-['Ovo','Cormorant_Garamond',serif] relative overflow-hidden pb-20 select-none">
      
      {/* BACKGROUND MUSIC PLAYER (ALEX WARREN - ORDINARY) */}
      <audio 
        ref={audioRef} 
        src="https://pub-4dc8201144ca418fb604349c73e8c724.r2.dev/Alex%20Warren%20-%20Ordinary%20Lyrics.mp3" 
        loop
        preload="metadata"
      />
 
      {/* FLOATING CIRCULAR AUDIO CONTROL (Elegant glassmorphism style matching reference) */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleAudio}
        className="fixed bottom-6 right-6 w-12 h-12 bg-black/40 backdrop-blur-md text-[#fffaf8] rounded-full shadow-2xl z-50 flex items-center justify-center cursor-pointer border border-[#fffaf8]/20"
        title={isPlaying ? "Pausar música" : "Tocar música"}
      >
        {isPlaying ? <Pause className="w-5 h-5 text-[#dfc48e] fill-[#dfc48e]" /> : <Play className="w-5 h-5 text-white fill-white ml-0.5" />}
      </motion.button>

      {/* 1. HERO SECTION - CLEAN, LUXURIOUS & PERFECTLY BALANCED */}
      <section className="relative w-full h-[100dvh] min-h-[620px] flex flex-col items-center justify-start pt-12 pb-20 px-4 overflow-visible bg-[#66021f] select-none">
        
        {/* Full-bleed Background Video Container (overflow-hidden to prevent spilling) */}
        <div className="absolute inset-0 w-full h-full z-0 bg-[#66021f] overflow-hidden">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            preload="auto"
            poster="https://images.unsplash.com/photo-1519225495810-7517c296517a?q=60&w=800&auto=format&fit=crop"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.75] contrast-[1.05]"
          >
            <source src="https://pub-4dc8201144ca418fb604349c73e8c724.r2.dev/IMG_6230%20(1).MP4" type="video/mp4" />
          </video>
          {/* Smooth uniform burgundy tint overlay to keep a single, cohesive red tone without dark gradients */}
          <div className="absolute inset-0 bg-[#66021f]/75 pointer-events-none z-10" />
        </div>

        {/* Subtle decorative glowing background light to emphasize the center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(223,196,142,0.08)_0%,transparent_70%)] pointer-events-none z-10" />

        {/* Top Header - "Wedding Day" & Date */}
        <div className="relative z-30 text-center space-y-3 pointer-events-none mt-2 sm:mt-4">
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-imperial text-[#dfc48e] font-light normal-case tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
          >
            Dia do Casamento
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-xs sm:text-sm tracking-[0.3em] text-[#fffaf8] font-sans uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          >
            {(() => {
              if (!invitation.date) return "05.07.26";
              const parts = invitation.date.split('-');
              if (parts.length === 3) {
                return `${parts[2]}.${parts[1]}.${parts[0].slice(2)}`;
              }
              return new Date(invitation.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '.');
            })()}
          </motion.p>
        </div>

        {/* Middle Block - Stacked Couple Names written directly on the background (No Container Box!) */}
        <div className="relative z-30 text-center pointer-events-none mt-[10dvh] sm:mt-[12dvh] w-full max-w-sm px-4">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9 }}
            className="flex flex-col items-center justify-center font-imperial text-[#fffaf8] leading-[0.75] select-none"
          >
            <span className="text-6xl sm:text-7xl md:text-8xl font-normal drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] text-center">
              {formatName(invitation.coupleName1)}
            </span>
            <span className="text-4xl sm:text-5xl text-[#dfc48e] my-3 select-none italic font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              &amp;
            </span>
            <span className="text-6xl sm:text-7xl md:text-8xl font-normal drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] text-center">
              {formatName(invitation.coupleName2)}
            </span>
          </motion.h1>
        </div>

        {/* Bottom Block - Wide Rose Bed aligned perfectly with the page bottom to mask the boundary transition */}
        <div className="absolute bottom-[-32px] inset-x-0 h-32 overflow-visible pointer-events-none z-20 w-full max-w-lg mx-auto">
          
          {/* BACKGROUND LAYER OF FLOWERS (z-10) - Higher positioned to fill gaps and look ultra-lush */}
          {/* Back Left-Center Red Rose */}
          <motion.img 
            src="https://static.tildacdn.net/tild3138-3862-4931-a264-313932393437/4ruby.png"
            animate={{ y: [0, -1, 0] }}
            transition={{ duration: 4.9, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className="absolute bottom-[10px] left-[14%] w-[32%] max-w-[125px] object-contain z-10 brightness-[0.85]"
            alt=""
          />
          {/* Back Center Dark Red Rose */}
          <motion.img 
            src="https://static.tildacdn.net/tild3064-6534-4135-b730-353630663233/6druby.png"
            animate={{ y: [0, -1.5, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
            className="absolute bottom-[12px] left-[32%] w-[34%] max-w-[135px] object-contain z-10 brightness-[0.8]"
            alt=""
          />
          {/* Back Center White Rose */}
          <motion.img 
            src="https://static.tildacdn.net/tild6637-6363-4432-b364-633830313533/noroot.png"
            animate={{ y: [0, -1.2, 0] }}
            transition={{ duration: 5.1, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="absolute bottom-[14px] right-[32%] w-[34%] max-w-[135px] object-contain z-10 brightness-[0.85]"
            alt=""
          />
          {/* Back Right-Center Red Rose */}
          <motion.img 
            src="https://static.tildacdn.net/tild3063-6162-4734-b966-356139343638/2ruby.png"
            animate={{ y: [0, -1, 0] }}
            transition={{ duration: 4.7, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="absolute bottom-[10px] right-[14%] w-[32%] max-w-[125px] object-contain z-10 brightness-[0.8]"
            alt=""
          />

          {/* FOREGROUND/MIDGROUND LAYER OF FLOWERS (z-20 & z-30) */}
          {/* 7. Red Rose Far-Left */}
          <motion.img 
            src="https://static.tildacdn.net/tild3565-3335-4966-b062-366237626361/8ruby.png"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-8px] left-[-4%] w-[34%] max-w-[145px] object-contain z-20"
            alt=""
          />
          {/* 5. Dark Red Rose Left */}
          <motion.img 
            src="https://static.tildacdn.net/tild3064-6534-4135-b730-353630663233/6druby.png"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="absolute bottom-[-12px] left-[6%] w-[34%] max-w-[145px] object-contain z-30"
            alt=""
          />
          {/* 6. Gold/Yellow Rose Left-Center */}
          <motion.img 
            src="https://static.tildacdn.net/tild3533-3266-4863-b762-326134376538/7uruby.png"
            animate={{ y: [0, 1, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
            className="absolute bottom-[-8px] left-[20%] w-[30%] max-w-[125px] object-contain z-20"
            alt=""
          />
          {/* NEW Mid-Left Red Rose to bridge gaps */}
          <motion.img 
            src="https://static.tildacdn.net/tild3138-3862-4931-a264-313932393437/4ruby.png"
            animate={{ y: [0, -1.2, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className="absolute bottom-[-10px] left-[35%] -translate-x-1/2 w-[32%] max-w-[135px] object-contain z-20"
            alt=""
          />
          {/* 4. Red Rose Center */}
          <motion.img 
            src="https://static.tildacdn.net/tild3138-3862-4931-a264-313932393437/4ruby.png"
            animate={{ y: [0, 1.5, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-8px] left-[50%] -translate-x-1/2 w-[34%] max-w-[145px] object-contain z-30"
            alt=""
          />
          {/* NEW Mid-Right White Rose to bridge gaps */}
          <motion.img 
            src="https://static.tildacdn.net/tild6637-6363-4432-b364-633830313533/noroot.png"
            animate={{ y: [0, -1.2, 0] }}
            transition={{ duration: 5.1, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-[-10px] right-[35%] translate-x-1/2 w-[32%] max-w-[135px] object-contain z-20"
            alt=""
          />
          {/* 2. White Rose Center-Right */}
          <motion.img 
            src="https://static.tildacdn.net/tild6637-6363-4432-b364-633830313533/noroot.png"
            animate={{ y: [0, 1.5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-[-8px] right-[20%] w-[34%] max-w-[145px] object-contain z-20"
            alt=""
          />
          {/* 3. Red Rose Right-Bottom */}
          <motion.img 
            src="https://static.tildacdn.net/tild3063-6162-4734-b966-356139343638/2ruby.png"
            animate={{ y: [0, -1.5, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[-12px] right-[6%] w-[32%] max-w-[135px] object-contain z-30"
            alt=""
          />
          {/* 1. Large Red Rose Far-Right */}
          <motion.img 
            src="https://static.tildacdn.net/tild3166-6235-4730-b332-636366333436/1ruby.png"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-8px] right-[-6%] w-[44%] max-w-[185px] object-contain z-20"
            alt=""
          />
        </div>

      </section>

      {/* 2. WELCOME LETTER (QUERIDOS AMIGOS E FAMILIARES) */}
      <section className="py-16 px-6 text-center max-w-2xl mx-auto space-y-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-5xl font-normal text-[#dfc48e]"
        >
          Queridos Amigos e Familiares,
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg sm:text-2xl leading-relaxed text-[#fffaf8]/90 font-light"
        >
          {invitation.welcomeMessage || 'Enquanto nos preparamos para dizer o nosso "sim", sentimos uma profunda gratidão por todas as pessoas incríveis que fazem parte de nossas vidas.\n\nO carinho e apoio de vocês significam tudo para nós, e seria uma honra imensa tê-los ao nosso lado neste dia tão especial em que daremos início à nossa vida juntos.'}
        </motion.p>
      </section>

      {/* 3. COUNTDOWN SECTION (A CELEBRAÇÃO COMEÇA EM) */}
      <section className="py-28 sm:py-32 px-6 bg-[#fffaf8] text-[#3a3a3a] relative">
        <TornPaperDividerTop />
        <div className="max-w-xl mx-auto text-center space-y-10 py-6">
          <h2 className="text-3xl sm:text-5xl font-normal tracking-wide text-[#66021f]">
            A Celebração Começa Em
          </h2>

          {/* TIMER BLOCKS */}
          <div className="flex justify-center items-center gap-2 sm:gap-6">
            
            <div className="flex flex-col items-center min-w-[65px] sm:min-w-[85px]">
              <span className="text-4xl sm:text-6xl font-bold text-[#3a3a3a] font-mono">
                {String(timeRemaining.days).padStart(2, '0')}
              </span>
              <span className="text-sm sm:text-lg text-stone-500 uppercase tracking-widest mt-1">Dias</span>
            </div>

            <span className="text-3xl sm:text-5xl font-light text-[#66021f] -mt-6">:</span>

            <div className="flex flex-col items-center min-w-[65px] sm:min-w-[85px]">
              <span className="text-4xl sm:text-6xl font-bold text-[#3a3a3a] font-mono">
                {String(timeRemaining.hours).padStart(2, '0')}
              </span>
              <span className="text-sm sm:text-lg text-stone-500 uppercase tracking-widest mt-1">Horas</span>
            </div>

            <span className="text-3xl sm:text-5xl font-light text-[#66021f] -mt-6">:</span>

            <div className="flex flex-col items-center min-w-[65px] sm:min-w-[85px]">
              <span className="text-4xl sm:text-6xl font-bold text-[#3a3a3a] font-mono">
                {String(timeRemaining.minutes).padStart(2, '0')}
              </span>
              <span className="text-sm sm:text-lg text-stone-500 uppercase tracking-widest mt-1">Minutos</span>
            </div>

            <span className="text-3xl sm:text-5xl font-light text-[#66021f] -mt-6">:</span>

            <div className="flex flex-col items-center min-w-[65px] sm:min-w-[85px]">
              <span className="text-4xl sm:text-6xl font-bold text-[#3a3a3a] font-mono">
                {String(timeRemaining.seconds).padStart(2, '0')}
              </span>
              <span className="text-sm sm:text-lg text-stone-500 uppercase tracking-widest mt-1">Segundos</span>
            </div>

          </div>
        </div>
        <TornPaperDividerBottom />
      </section>

      {/* 4. SCHEDULE OF EVENTS (VERTICAL TIMELINE WITH DIAMOND BULLETS) */}
      <section className="py-24 px-6 max-w-2xl mx-auto space-y-16">
        <h2 className="text-4xl sm:text-6xl font-normal text-center text-[#dfc48e] tracking-wide">
          Programação do Casamento
        </h2>

        <div ref={timelineRef} className="relative space-y-12 before:absolute before:left-1/2 before:-translate-x-1/2 before:top-4 before:bottom-4 before:w-[2px] before:bg-[#fffaf8]/40">
          
          {/* Static Track for sliding flower */}
          <div className="absolute left-1/2 -translate-x-1/2 w-0 top-[24px] sm:top-[28px] bottom-[24px] sm:bottom-[28px] z-20 pointer-events-none">
            {/* Sliding rose flower along timeline on scroll */}
            <motion.div 
              style={{ top: flowerTop }} 
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 z-20"
            >
              <motion.img 
                animate={{
                  rotate: [0, 15, -15, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                src="https://static.tildacdn.net/tild6637-6363-4432-b364-633830313533/noroot.png" 
                className="w-full h-full object-contain"
                alt=""
              />
            </motion.div>
          </div>

          {timelineEvents.map((ev, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="relative flex items-center justify-between w-full"
              >
                {/* Center bullet point - white diamond */}
                <div className="timeline-diamond absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rotate-45 border-2 border-[#66021f] shadow-md z-10" />

                {/* Time Block */}
                <div className={`w-[45%] ${isLeft ? 'text-right pr-6 sm:pr-10' : 'order-2 text-left pl-6 sm:pl-10'}`}>
                  <span className="text-2xl sm:text-4xl font-bold tracking-wider text-[#dfc48e] font-mono">
                    {ev.time}
                  </span>
                </div>

                {/* Title Block */}
                <div className={`w-[45%] ${isLeft ? 'order-2 text-left pl-6 sm:pl-10' : 'text-right pr-6 sm:pr-10'}`}>
                  <h4 className="text-xl sm:text-3xl font-medium text-[#fffaf8]">
                    {ev.title}
                  </h4>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 5. LOCATION (CHATEAU DE PAON) */}
      <section className="py-28 sm:py-32 px-6 bg-[#fffaf8] text-[#3a3a3a] relative text-center space-y-8">
        <TornPaperDividerTop />
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-normal text-[#66021f] tracking-wide">
            Localização
          </h2>

          <div className="w-full max-w-md mx-auto aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#66021f]/20">
            <img 
              src="https://static.tildacdn.net/tild6161-3933-4132-b732-303939666537/image-gen_1-Photoroo.png" 
              alt={invitation.locationName}
              className="w-full h-full object-cover" 
            />
          </div>

          <div className="space-y-2 pt-4">
            <h3 className="text-2xl sm:text-4xl font-bold text-[#66021f]">
              {invitation.locationName || 'Chateau de Paon'}
            </h3>
            <p className="text-base sm:text-lg text-stone-600 font-light max-w-md mx-auto">
              {invitation.locationAddress || 'Endereço: Petit Chemin de Saint-Gilles 13200 Arles, França'}
            </p>
          </div>

          <a 
            href={invitation.locationMapUrl || `https://maps.google.com/?q=${encodeURIComponent(invitation.locationAddress || 'Chateau de Paon')}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 py-3.5 px-8 rounded-full bg-[#66021f] text-[#fffaf8] text-xs uppercase tracking-widest font-bold shadow-lg hover:bg-black transition-all cursor-pointer hover:scale-105 mt-4"
          >
            <Map className="w-4 h-4 text-[#dfc48e]" /> Abrir no Google Maps
          </a>
        </div>
        <TornPaperDividerBottom />
      </section>

      {/* 6. DRESS CODE WITH CLASSIC ATTIRE ILLUSTRATIONS */}
      <section className="py-20 px-6 max-w-3xl mx-auto text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-6xl font-normal text-[#dfc48e]">
            Traje
          </h2>
          <p className="text-lg sm:text-2xl text-[#fffaf8]/90 font-light max-w-xl mx-auto">
            {invitation.dressCode || 'Convidamos você a se vestir de forma elegante, refletindo o estilo e o espírito deste dia tão especial.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 items-center pt-6">
          
          {/* Gentlemen Block */}
          <div className="bg-[#66021f]/60 p-8 rounded-3xl border border-[#fffaf8]/20 shadow-xl space-y-6 flex flex-col items-center">
            <img 
              src="https://static.tildacdn.net/tild3433-3734-4762-a164-666138626132/Group_170.png" 
              alt="Traje masculino" 
              className="h-48 sm:h-56 object-contain drop-shadow-md hover:rotate-2 transition-transform"
            />
            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-[#dfc48e]">Homens</h4>
              <p className="text-sm sm:text-base text-[#fffaf8]/80 font-light">
                Terno completo ou traje esporte fino com sapatos clássicos.
              </p>
            </div>
          </div>

          {/* Ladies Block */}
          <div className="bg-[#66021f]/60 p-8 rounded-3xl border border-[#fffaf8]/20 shadow-xl space-y-6 flex flex-col items-center">
            <img 
              src="https://static.tildacdn.net/tild3732-6333-4264-b465-666237366336/Group_169.png" 
              alt="Traje feminino" 
              className="h-48 sm:h-56 object-contain drop-shadow-md hover:-rotate-2 transition-transform"
            />
            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-[#dfc48e]">Mulheres</h4>
              <p className="text-sm sm:text-base text-[#fffaf8]/80 font-light">
                Vestidos elegantes (longo ou midi) de sua preferência.
              </p>
            </div>
          </div>

        </div>

        {/* Color Palette Option */}
        <div className="pt-10 space-y-4 max-w-md mx-auto">
          <h4 className="text-xl sm:text-2xl font-normal text-[#dfc48e] tracking-wider uppercase">Paleta de Cores</h4>
          <p className="text-sm sm:text-base text-[#fffaf8]/80 font-light">
            Para inspirar o seu traje, sugerimos algumas cores de nossa paleta:
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            {[
              { color: "#66021f", name: "Bordô" },
              { color: "#800f2f", name: "Marsala" },
              { color: "#b5838d", name: "Rosê" },
              { color: "#ffcad4", name: "Blush" },
              { color: "#dfc48e", name: "Ouro" },
              { color: "#fffaf8", name: "Marfim" },
            ].map((palette, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <motion.div 
                  whileHover={{ scale: 1.15 }}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#fffaf8]/30 shadow-lg cursor-pointer"
                  style={{ backgroundColor: palette.color }}
                  title={palette.name}
                />
                <span className="text-[10px] tracking-wider uppercase text-[#fffaf8]/60 font-light font-sans">{palette.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. DETAILS & GIFTS (PIX) */}
      <section className="py-28 sm:py-32 px-6 bg-[#fffaf8] text-[#3a3a3a] relative">
        <TornPaperDividerTop />
        <div className="max-w-3xl mx-auto space-y-10 text-center py-6">
          <h2 className="text-4xl sm:text-5xl font-normal text-[#66021f]">Lista de Presentes</h2>
          <p className="text-base sm:text-lg text-stone-600 font-light leading-relaxed max-w-2xl mx-auto">
            Sua presença é o nosso maior presente. No entanto, se você deseja nos homenagear com um presente, uma contribuição para o nosso futuro será sinceramente apreciada.
          </p>

          {invitation.giftsEnabled && invitation.gifts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left pt-6">
              {invitation.gifts.map((g) => (
                <div key={g.id} className="p-5 rounded-2xl bg-white text-[#3a3a3a] border border-stone-200/40 shadow-md flex justify-between items-center gap-4 hover:shadow-lg transition-all hover:scale-[1.01]">
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-stone-800 truncate">{g.name}</h4>
                    <span className="text-xs font-mono text-[#66021f] font-bold">R$ {g.price.toFixed(2)}</span>
                  </div>
                  {g.bought ? (
                    <span className="text-[10px] bg-stone-100 text-stone-500 px-2.5 py-1 rounded font-bold shrink-0">Comprado</span>
                  ) : (
                    <button 
                      onClick={() => setSelectedGiftForPix(g)}
                      className="py-2 px-4 rounded-full bg-[#66021f] hover:bg-black text-[#fffaf8] text-[10px] font-bold uppercase tracking-wider shrink-0 cursor-pointer shadow-sm hover:scale-105 transition-all"
                    >
                      Presentear
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {!invitation.rsvpEnabled && <TornPaperDividerBottom />}
      </section>

      {/* 8. CONFIRM YOUR ATTENDANCE (RSVP) */}
      {invitation.rsvpEnabled && (
        <section className="pb-28 sm:pb-32 pt-10 sm:pt-14 px-6 bg-[#fffaf8] text-[#3a3a3a] relative text-center">
          <div className="max-w-xl mx-auto space-y-8 pb-10">
            <div className="space-y-3">
              <h2 className="text-4xl sm:text-6xl font-normal text-[#66021f]">
                Confirmar Presença
              </h2>
              <p className="text-base sm:text-lg text-stone-600 font-light leading-relaxed max-w-md mx-auto">
                Para nos ajudar a preparar uma celebração inesquecível, por favor, confirme sua presença até {formatRsvpDeadline(invitation.rsvpDeadline)}.
              </p>
            </div>

            {rsvpSubmitted ? (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-8 rounded-3xl bg-white border border-stone-200/60 shadow-md space-y-3 text-center"
              >
                <Check className="w-10 h-10 text-[#66021f] mx-auto font-bold" />
                <h4 className="text-2xl font-bold text-[#66021f]">Muito Obrigado!</h4>
                <p className="text-sm text-stone-600 font-light">
                  Sua confirmação foi enviada e recebida com muito carinho.
                </p>
              </motion.div>
            ) : (
              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowRsvpModal(true)}
                  className="relative overflow-hidden py-4 px-12 sm:px-16 rounded-full bg-[#66021f] hover:bg-black text-[#fffaf8] text-lg sm:text-xl font-bold shadow-lg cursor-pointer transition-all tracking-widest uppercase hover:scale-105"
                >
                  <span className="relative z-10">Confirmar Presença</span>
                  
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-30deg] pointer-events-none" />
                </motion.button>
              </div>
            )}
          </div>
          <TornPaperDividerBottom />
        </section>
      )}

      {/* CLOSING FOOTER WITH COUPLE IMAGE */}
      <footer className="pt-16 px-6 max-w-xl mx-auto text-center space-y-8">
        <h3 className="text-4xl sm:text-5xl font-['Beau_Rivage',cursive] text-[#dfc48e]">
          Esperamos você lá!
        </h3>
        <p className="text-3xl font-serif text-[#fffaf8]">
          {invitation.coupleName1} &amp; {invitation.coupleName2}
        </p>

        <div className="w-full aspect-[3/4] max-w-md mx-auto rounded-t-[200px] rounded-b-3xl overflow-hidden shadow-2xl border-4 border-[#fffaf8]/20">
          <img 
            src={historyImageToUse} 
            alt="Noivos" 
            className="w-full h-full object-cover"
          />
        </div>
      </footer>

      {/* RSVP MODAL TAILORED FOR TEMPLATE 5 */}
      <AnimatePresence>
        {showRsvpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#fffaf8] text-[#3a3a3a] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#66021f] flex flex-col font-serif max-h-[90vh]"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowRsvpModal(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#66021f] text-white flex items-center justify-center cursor-pointer hover:scale-110 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 overflow-y-auto space-y-6 text-center">
                <div className="space-y-1">
                  <h3 className="text-3xl font-bold text-[#66021f]">Confirmar Presença</h3>
                  <p className="text-xs text-stone-500 font-light">Por favor, confirme sua presença até {formatRsvpDeadline(invitation.rsvpDeadline)}</p>
                </div>

                <form 
                  onSubmit={(e) => {
                    handleRsvpSubmit(e);
                    setShowRsvpModal(false);
                  }}
                  className="space-y-4 text-left font-sans"
                >
                  <div className="space-y-1">
                    <label className="block text-xs text-stone-700 font-bold uppercase tracking-wider">Seu nome</label>
                    <input 
                      type="text" 
                      required
                      value={rsvpName}
                      onChange={e => setRsvpName(e.target.value)}
                      placeholder="Nome completo"
                      className="w-full p-3 rounded-xl border border-stone-300 text-sm text-stone-800 focus:outline-none focus:border-[#66021f]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs text-stone-700 font-bold uppercase tracking-wider">Você irá comparecer?</label>
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {[
                        { label: "Sim, vou comemorar com vocês!", val: true },
                        { label: "Infelizmente, não poderei ir :(", val: false }
                      ].map((opt, i) => (
                        <label key={i} className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-center gap-3 cursor-pointer transition-all ${rsvpAttending === opt.val ? 'bg-[#66021f] border-[#66021f] font-bold text-white shadow-md' : 'bg-white border-stone-200 hover:bg-stone-100 text-stone-700'}`}>
                          <input 
                            type="radio" 
                            name="attending_radio_t5"
                            checked={rsvpAttending === opt.val}
                            onChange={() => setRsvpAttending(opt.val)}
                            className="text-[#66021f]"
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {rsvpAttending && (
                    <div className="space-y-3 pt-2">
                      <div className="space-y-1">
                        <label className="block text-xs text-stone-700 font-bold uppercase tracking-wider">Total acompanhantes</label>
                        <select 
                          value={rsvpCompanions}
                          onChange={e => setRsvpCompanions(parseInt(e.target.value))}
                          className="w-full p-3 rounded-xl border border-stone-300 text-sm bg-white text-stone-800"
                        >
                          <option value="0">0 Acompanhantes (Só eu)</option>
                          <option value="1">1 Acompanhante</option>
                          <option value="2">2 Acompanhantes</option>
                          <option value="3">3 Acompanhantes</option>
                        </select>
                      </div>

                      {rsvpCompanions > 0 && (
                        <div className="space-y-1">
                          <label className="block text-xs text-stone-700 font-bold uppercase tracking-wider">Nomes dos acompanhantes</label>
                          <input 
                            type="text"
                            placeholder="Nome de cada acompanhante"
                            value={rsvpCompanionsNames}
                            onChange={e => setRsvpCompanionsNames(e.target.value)}
                            className="w-full p-3 rounded-xl border border-stone-300 text-sm text-stone-800"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-xs text-stone-700 font-bold uppercase tracking-wider">WhatsApp / Telefone para contato</label>
                    <input 
                      type="tel"
                      required
                      placeholder="(DD) 99999-9999"
                      value={rsvpPhone}
                      onChange={e => setRsvpPhone(e.target.value)}
                      className="w-full p-3 rounded-xl border border-stone-300 text-sm text-stone-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs text-stone-700 font-bold uppercase tracking-wider">Restrição alimentar ou alergia?</label>
                    <input 
                      type="text"
                      placeholder="ex: Vegetariano, Alergia a frutos do mar"
                      value={rsvpFoodRestriction}
                      onChange={e => setRsvpFoodRestriction(e.target.value)}
                      className="w-full p-3 rounded-xl border border-stone-300 text-sm text-stone-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 mt-4 rounded-full bg-[#66021f] hover:bg-black text-white text-sm uppercase tracking-widest font-bold shadow-xl cursor-pointer transition-all hover:scale-102"
                  >
                    Confirmar Presença
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
