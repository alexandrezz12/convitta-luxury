import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  X, Pause, Play, MapPin, Heart 
} from 'lucide-react';
import { WeddingInvitation, GiftItem } from '../types';

interface Template8LayoutProps {
  invitation: WeddingInvitation;
  themeColors: any;
  fontDisplay: string;
  fontSans: string;
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

export default function Template8Layout({
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
  rsvpMessage,
  setRsvpMessage,
  setSelectedGiftForPix
}: Template8LayoutProps) {

  const isBabyFeet = invitation.historyImageUrl && (
    invitation.historyImageUrl.includes('photo-1510154221590') || 
    invitation.historyImageUrl.includes('pexels-vinicius-quar') ||
    invitation.historyImageUrl.includes('noroot')
  );
  const historyImageToUse = (isBabyFeet || !invitation.historyImageUrl) 
    ? "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop" 
    : invitation.historyImageUrl;

  const [envelopeState, setEnvelopeState] = useState<'closed' | 'playing-video' | 'revealed'>('closed');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [isLoopVideoReady, setIsLoopVideoReady] = useState(false);
  const [isIntroImgLoaded, setIsIntroImgLoaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Trigger video playback when state transitions to 'playing-video'
  useEffect(() => {
    let safetyTimeout: any;
    let renderTimeout: any;

    if (envelopeState === 'playing-video') {
      // Safety backup: automatically end sequence if the video is stuck, fails to load or play
      safetyTimeout = setTimeout(() => {
        endSequence();
      }, 5000);

      const playVideo = async () => {
        if (videoRef.current) {
          try {
            await videoRef.current.play();
          } catch (error) {
            console.log("Auto-playing video failed or blocked, bypassing cinematic intro", error);
            endSequence();
          }
        } else {
          // Fallback if video element didn't mount yet or isn't available
          endSequence();
        }
      };

      // Small delay to ensure the DOM element is fully mounted and ready
      renderTimeout = setTimeout(playVideo, 100);
    }

    return () => {
      if (safetyTimeout) clearTimeout(safetyTimeout);
      if (renderTimeout) clearTimeout(renderTimeout);
    };
  }, [envelopeState]);

  const startVideo = () => {
    setEnvelopeState('playing-video');
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const endSequence = () => {
    setEnvelopeState('revealed');
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleLocalRsvpSubmit = (e: React.FormEvent) => {
    handleRsvpSubmit(e);
    setShowRsvpModal(false);
  };

  const getWeddingDayFormatted = () => {
    if (!invitation.date) return '27.09.26';
    const parts = invitation.date.split('-');
    if (parts.length === 3) {
      return `${parts[2]}.${parts[1]}.${parts[0].slice(2)}`;
    }
    return '27.09.26';
  };

  return (
    <div className="min-h-screen bg-[#f9f0e0] text-[#6c513f] font-sans antialiased relative overflow-x-hidden">
      {/* Dynamic Font Styling Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        .font-serif-cinzel { font-family: 'Cinzel', Georgia, serif; }
        .font-sans-inter { font-family: 'Inter', system-ui, sans-serif; }
      ` }} />

      {/* BACKGROUND AUDIO PLAYER */}
      <audio id="weiAudio" ref={audioRef} loop preload="metadata">
        <source src="https://dl.dropboxusercontent.com/scl/fi/624cq0yavef0mu5vutfbt/Einaudi_-Divenire.mp3?rlkey=nvwxrr2atluxt5nk7vx5ixl1q&st=s3ixe1n2" type="audio/mp3" />
      </audio>

      {/* ENVELOPE / INVITE INTRO COVER */}
      <AnimatePresence>
        {envelopeState !== 'revealed' && (
          <div
            id="weiOverlay"
            onClick={startVideo}
            className="fixed inset-0 z-[99999] bg-[#f9f0e0] flex flex-col items-center justify-center cursor-pointer select-none transition-opacity duration-[1400ms]"
            style={{
              opacity: envelopeState === 'closed' ? 1 : 0,
              pointerEvents: envelopeState === 'closed' ? 'auto' : 'none',
            }}
          >
            <div className="relative max-w-2xl w-full px-4 flex flex-col items-center text-center">
              <div className="relative w-full flex items-center justify-center mb-8">
                {!isIntroImgLoaded && (
                  <div className="absolute inset-0 bg-[#fbf5e8] animate-pulse flex items-center justify-center border border-[#a67d2b]/10 rounded-2xl min-h-[320px]">
                    <div className="text-[#a67d2b]/40 text-xs font-serif-cinzel tracking-widest animate-pulse">Carregando Selo Real...</div>
                  </div>
                )}
                <img
                  id="weiImg"
                  src="https://pub-96ce671efbac4dbfbc89b044c631a913.r2.dev/ChatGPT%20Image%20Jun%2023%2C%202026%2C%2004_40_29%20PM.png"
                  alt="Abra o seu convite"
                  onLoad={() => setIsIntroImgLoaded(true)}
                  className={`w-full max-h-[65vh] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.18)] transition-all duration-700 ease-out ${
                    isIntroImgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                  draggable="false"
                />
              </div>
              <div className="flex flex-col items-center gap-3 animate-bounce">
                <div className="w-4 h-4 border-r-2 border-t-2 border-[#a67d2b]/70 transform rotate-135"></div>
                <span className="font-serif-cinzel text-sm sm:text-base tracking-[0.3em] uppercase text-[#a67d2b] font-bold">Toque para abrir</span>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* INTRODUCTORY CINEMATIC SWANS VIDEO (REVEALS ON TAP) - ALWAYS IN DOM FOR SILENT BACKGROUND PRELOADING */}
      <div 
        onClick={endSequence}
        className={`fixed inset-0 z-[99998] bg-[#f9f0e0] flex items-center justify-center cursor-pointer transition-all duration-700 ${
          envelopeState === 'playing-video' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        title="Clique em qualquer lugar para pular"
      >
        <video
          id="weiVideo"
          ref={videoRef}
          src="https://pub-96ce671efbac4dbfbc89b044c631a913.r2.dev/1782224012851.mp4"
          muted
          playsInline
          preload="auto"
          className="w-full h-full max-w-lg object-contain"
          onTimeUpdate={() => {
            const video = videoRef.current;
            if (video && video.duration && video.currentTime >= video.duration - 0.8) {
              endSequence();
            }
          }}
          onEnded={endSequence}
        ></video>
        <div className="absolute top-6 right-6 bg-[#5a0f1b] hover:bg-[#7d1729] text-white text-xs px-4 py-2 rounded-full font-sans transition-all shadow-md flex items-center gap-1.5 z-50">
          <span>Pular Introdução</span>
          <span className="text-[10px] text-[#e2cd96]">➔</span>
        </div>
      </div>

      {/* FLOATING MUSIC PLAYER CONTROLS */}
      {envelopeState === 'revealed' && (
        <button 
          onClick={toggleAudio}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#5a0f1b] hover:bg-[#7d1729] text-white rounded-full flex justify-center items-center z-[9999] shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-[#e2cd96]" />
          ) : (
            <Play className="w-6 h-6 text-[#e2cd96] ml-0.5" />
          )}
        </button>
      )}

      {/* MAIN INVITATION BODY */}
      {envelopeState === 'revealed' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-12 flex flex-col items-center relative z-10"
        >
          
          {/* HEADER SECTION (SWANS LOOP VIDEO & COUPLE NAMES) */}
          <div className="w-full flex flex-col items-center text-center relative mb-16">
            
            {/* Swans Arch Background Loop */}
            <div className="w-72 h-[450px] relative rounded-t-full overflow-hidden shadow-2xl border-4 border-[#a67d2b]/20 mb-10 bg-[#fcf9f2]">
              {/* Fallback & Loading Background Image (Guaranteed to show, beautiful romantic Swans painting) */}
              <img 
                src="https://images.unsplash.com/photo-1601758124277-f00d6d4335b4?q=60&w=450&auto=format&fit=crop" 
                alt="Lago de Cisnes" 
                referrerPolicy="no-referrer"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 z-0 ${
                  isLoopVideoReady ? 'opacity-40' : 'opacity-100'
                }`}
              />

              <video 
                src="https://pub-4dc8201144ca418fb604349c73e8c724.r2.dev/Swans2.mov"
                autoPlay 
                muted 
                loop 
                playsInline 
                preload="auto"
                poster="https://images.unsplash.com/photo-1601758124277-f00d6d4335b4?q=60&w=450&auto=format&fit=crop"
                onPlay={() => setIsLoopVideoReady(true)}
                onLoadedData={() => setIsLoopVideoReady(true)}
                onLoadedMetadata={() => setIsLoopVideoReady(true)}
                className="w-full h-full object-cover absolute inset-0 z-10 transition-opacity duration-1000"
                style={{
                  opacity: isLoopVideoReady ? 1 : 0,
                  visibility: isLoopVideoReady ? 'visible' : 'hidden'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#fcf9f2]/40 pointer-events-none z-20"></div>
              
              {/* Soft Golden/Warm Ambient Inner Glow */}
              <div className="absolute inset-0 bg-[#a67d2b]/5 pointer-events-none z-20 mix-blend-overlay"></div>
            </div>

            {/* Ceremony Type Label */}
            <span className="font-serif-cinzel text-xs tracking-[0.25em] uppercase text-[#a67d2b] mb-2 font-medium">Dia do Casamento</span>
            
            {/* Wedding Date text */}
            <div className="font-serif-cinzel text-lg tracking-[0.1em] text-[#a67d2b] font-bold mb-8">
              {getWeddingDayFormatted()}
            </div>

            {/* Decorative Side Leaves (Flanking the couple names responsively) */}
            <div className="absolute top-[480px] left-0 pointer-events-none opacity-40 max-w-[80px] hidden sm:block">
              <img src="https://static.tildacdn.net/tild6639-3363-4136-a234-356639363561/noroot.png" alt="" className="w-full" />
            </div>
            <div className="absolute top-[480px] right-0 pointer-events-none opacity-40 max-w-[80px] hidden sm:block">
              <img src="https://static.tildacdn.net/tild3764-3461-4436-a562-636534643333/noroot.png" alt="" className="w-full" />
            </div>

            {/* Groom & Bride Names */}
            <h1 className="font-serif-cinzel text-4xl sm:text-6xl text-[#a67d2b] leading-tight font-light tracking-wide mb-8">
              <span className="block mb-2">{invitation.coupleName1}</span>
              <span className="font-serif-cinzel text-2xl sm:text-3xl text-[#a67d2b]/60 my-2 block">&amp;</span>
              <span className="block">{invitation.coupleName2}</span>
            </h1>

            {/* Decorative Gold Dividers */}
            <div className="max-w-[120px] mx-auto mb-8 opacity-70">
              <img src="https://static.tildacdn.net/tild3438-6238-4236-b537-366632636138/noroot.png" alt="" className="w-full" />
            </div>

            {/* Sacred citation */}
            <div className="max-w-md px-4 mb-8">
              <p className="font-serif-cinzel italic text-base sm:text-lg text-[#a67d2b]/90 leading-relaxed">
                "Duas Almas, Um Destino, Uma Vida Inteira Escrita por Deus"
              </p>
            </div>

            {/* Welcome Message */}
            <p className="font-sans-inter text-[#6c513f] text-sm sm:text-base leading-relaxed max-w-lg px-4 opacity-90">
              Queridos amigos e familiares, juntem-se a nós para uma noite repleta de amor, sorrisos e memórias inesquecíveis ao iniciarmos o nosso para sempre.
            </p>

            {/* Scroll Indicator */}
            <div className="mt-12 flex flex-col items-center gap-1.5 opacity-60">
              <span className="font-serif-cinzel text-[10px] tracking-widest uppercase">Role para baixo</span>
              <div className="w-3 h-3 border-r border-b border-[#6c513f] transform rotate-45 animate-bounce"></div>
            </div>

          </div>

          {/* BLOCK 2: COUNTDOWN TIMER DISPLAY */}
          <div className="w-full max-w-lg bg-white/40 backdrop-blur-sm rounded-3xl border border-[#a67d2b]/15 p-6 sm:p-8 text-center shadow-sm mb-16 relative">
            <h3 className="font-serif-cinzel text-xs tracking-[0.3em] uppercase text-[#a67d2b] font-semibold mb-6">A Celebração Começa Em</h3>
            
            <div className="flex justify-center items-center gap-3 sm:gap-6">
              <div className="flex flex-col items-center">
                <span className="font-serif-cinzel text-3xl sm:text-4xl font-bold text-[#a67d2b]">{timeRemaining.days}</span>
                <span className="font-serif-cinzel text-[10px] uppercase tracking-wider text-[#6c513f]/80 mt-1">Dias</span>
              </div>
              <span className="text-[#a67d2b] font-light text-2xl mb-4">:</span>
              <div className="flex flex-col items-center">
                <span className="font-serif-cinzel text-3xl sm:text-4xl font-bold text-[#a67d2b]">{String(timeRemaining.hours).padStart(2, '0')}</span>
                <span className="font-serif-cinzel text-[10px] uppercase tracking-wider text-[#6c513f]/80 mt-1">Horas</span>
              </div>
              <span className="text-[#a67d2b] font-light text-2xl mb-4">:</span>
              <div className="flex flex-col items-center">
                <span className="font-serif-cinzel text-3xl sm:text-4xl font-bold text-[#a67d2b]">{String(timeRemaining.minutes).padStart(2, '0')}</span>
                <span className="font-serif-cinzel text-[10px] uppercase tracking-wider text-[#6c513f]/80 mt-1">Minutos</span>
              </div>
              <span className="text-[#a67d2b] font-light text-2xl mb-4">:</span>
              <div className="flex flex-col items-center">
                <span className="font-serif-cinzel text-3xl sm:text-4xl font-bold text-[#a67d2b]">{String(timeRemaining.seconds).padStart(2, '0')}</span>
                <span className="font-serif-cinzel text-[10px] uppercase tracking-wider text-[#6c513f]/80 mt-1">Segundos</span>
              </div>
            </div>
          </div>

          {/* BLOCK 3: SCHEDULE OF EVENTS / TIMELINE */}
          <div className="w-full bg-white/60 backdrop-blur-sm rounded-3xl border border-[#a67d2b]/15 p-6 sm:p-10 shadow-md mb-16">
            <div className="flex flex-col items-center mb-8">
              <span className="font-serif-cinzel text-xs tracking-[0.3em] uppercase text-[#a67d2b] font-semibold mb-2">Linha do Tempo</span>
              <h2 className="font-serif-cinzel text-2xl sm:text-3xl text-[#a67d2b] font-light">Cronograma do Evento</h2>
              <div className="w-16 h-[1px] bg-[#a67d2b]/40 mt-3" />
            </div>

            <div className="relative border-l border-[#a67d2b]/30 ml-4 sm:ml-8 space-y-10 py-2">
              {[
                { time: '17:00', title: 'Chegada dos Convidados', desc: 'Boas-vindas ao nosso jardim sagrado' },
                { time: '18:00', title: 'Cerimônia de Casamento', desc: 'O momento da nossa união abençoada' },
                { time: '19:00', title: 'Coquetel de Boas-Vindas', desc: 'Bebidas refrescantes e petiscos no jardim' },
                { time: '20:00', title: 'Jantar Especial', desc: 'Banquete gastronômico celebrando nosso amor' },
                { time: '21:00', title: 'Festa & Dança', desc: 'Celebração com música, dança e alegria' }
              ].map((item, idx) => (
                <div key={idx} className="relative pl-8 group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-[#a67d2b] border border-white group-hover:scale-125 transition-transform" />
                  
                  <span className="font-serif-cinzel text-sm sm:text-base text-[#a67d2b] font-semibold block">{item.time}</span>
                  <h4 className="font-serif-cinzel text-base text-[#6c513f] font-medium mt-1">{item.title}</h4>
                  <p className="font-sans-inter text-xs sm:text-sm text-[#6c513f]/70 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* BLOCK 4 & 5: LOCATION CARD DETAILS & MAP */}
          <div className="w-full bg-white/60 backdrop-blur-sm rounded-3xl border border-[#a67d2b]/15 p-6 sm:p-10 shadow-md mb-16 flex flex-col items-center text-center">
            <MapPin className="w-8 h-8 text-[#a67d2b] mb-4" />
            <span className="font-serif-cinzel text-xs tracking-[0.3em] uppercase text-[#a67d2b] font-semibold mb-2">Onde Será</span>
            <h2 className="font-serif-cinzel text-2xl sm:text-3xl text-[#a67d2b] font-light mb-6">Localização do Evento</h2>
            
            <div className="max-w-md mb-8">
              <h3 className="font-serif-cinzel text-lg text-[#6c513f] font-semibold mb-2">
                {invitation.locationName || 'Espaço Província di Toscana'}
              </h3>
              <p className="font-sans-inter text-sm text-[#6c513f]/80 leading-relaxed">
                {invitation.locationAddress || 'Alameda das Rosas, 2150 - Pampulha, Belo Horizonte - MG'}
              </p>
            </div>

            {/* Google Maps safe embed iframe */}
            <div className="w-full h-80 rounded-2xl overflow-hidden shadow-inner border border-stone-200">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(invitation.locationAddress || 'Espaço Província di Toscana')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                title="Google Maps"
              ></iframe>
            </div>
          </div>

          {/* BLOCK 6: GUIDELINES, DRESS CODE & GIFT PREFERENCE */}
          <div className="w-full bg-white/60 backdrop-blur-sm rounded-3xl border border-[#a67d2b]/15 p-6 sm:p-10 shadow-md mb-16 text-center">
            <span className="font-serif-cinzel text-xs tracking-[0.3em] uppercase text-[#a67d2b] font-semibold mb-2">Lista de Presentes</span>
            <h2 className="font-serif-cinzel text-2xl sm:text-3xl text-[#a67d2b] font-light mb-4">Sugestão de Presentes</h2>
            <div className="w-16 h-[1px] bg-[#a67d2b]/40 mx-auto mt-2 mb-6" />

            <p className="font-sans-inter text-sm sm:text-base text-[#6c513f]/80 leading-relaxed max-w-md mx-auto mb-10">
              Sua presença é o nosso maior presente! Se desejar nos presentear de forma especial, preparamos uma lista de cotas fictícias convertidas em Pix para nos ajudar em nossa lua de mel.
            </p>

            {/* Pix Gift Registry grid rendering dynamically */}
            {invitation.giftsEnabled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {invitation.gifts.map((g) => (
                  <div key={g.id} className="bg-[#fffaf8] border border-[#a67d2b]/10 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-all">
                    <div>
                      <h4 className="font-serif-cinzel text-sm sm:text-base text-[#6c513f] font-semibold">{g.name}</h4>
                      <p className="font-sans-inter text-[#a67d2b] font-semibold mt-1">R$ {g.price.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedGiftForPix(g)}
                      className="w-full bg-[#a67d2b] hover:bg-[#8e6822] text-white font-serif-cinzel text-xs tracking-wider uppercase py-2 rounded-lg mt-4 transition-colors"
                    >
                      Presentear com Pix
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BLOCK 7: CONFIRM ATTENDANCE BLOCK */}
          <div className="w-full bg-white/60 backdrop-blur-sm rounded-3xl border border-[#a67d2b]/15 p-8 sm:p-12 shadow-lg mb-16 text-center flex flex-col items-center">
            <span className="font-serif-cinzel text-xs tracking-[0.3em] uppercase text-[#a67d2b] font-semibold mb-2">Presença</span>
            <h2 className="font-serif-cinzel text-2xl sm:text-3xl text-[#a67d2b] font-light mb-4">Confirmar Presença</h2>
            <div className="w-16 h-[1px] bg-[#a67d2b]/40 mt-2 mb-6" />

            <p className="font-sans-inter text-sm text-[#6c513f]/80 leading-relaxed max-w-md mb-8">
              Para nos ajudar a planejar esta noite abençoada, por favor confirme sua presença antes do dia <strong className="text-[#a67d2b]">{invitation.rsvpDeadline || '09 de Agosto'}</strong>.
            </p>

            {/* Interactive Wax Seal RSVP button */}
            <div 
              onClick={() => setShowRsvpModal(true)}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="w-24 h-24 relative flex items-center justify-center transform group-hover:scale-110 active:scale-95 transition-transform duration-300">
                <img 
                  src="https://static.tildacdn.net/tild6638-6565-4665-a361-653962303137/wax_seal_1.png" 
                  alt="Confirmar Presença" 
                  className="w-full h-full object-contain filter drop-shadow-md animate-pulse"
                />
                <Heart className="absolute w-7 h-7 text-white fill-white/20 animate-pulse" />
              </div>
              <span className="font-serif-cinzel text-xs tracking-widest uppercase text-[#a67d2b] font-bold mt-4 group-hover:text-[#8e6822] transition-colors">
                {rsvpSubmitted ? '✓ Presença Respondida' : 'Aperte para Confirmar'}
              </span>
            </div>
          </div>

          {/* BLOCK 8: THANK YOU ENDING BANNER & LOVE STORY */}
          <div className="w-full bg-white/60 backdrop-blur-sm rounded-3xl border border-[#a67d2b]/15 p-6 sm:p-10 shadow-md text-center">
            <span className="font-serif-cinzel text-xs tracking-[0.3em] uppercase text-[#a67d2b] font-semibold mb-2">Nossa História</span>
            <h2 className="font-serif-cinzel text-2xl sm:text-3xl text-[#a67d2b] font-light mb-6">Como Tudo Começou</h2>

            <div className="mb-8 rounded-2xl overflow-hidden max-w-md mx-auto border-4 border-white shadow-md relative">
              <img 
                src={historyImageToUse} 
                alt="Nossa História" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#6c513f]/30 to-transparent"></div>
            </div>

            <p className="font-serif-cinzel italic text-base text-[#6c513f]/90 leading-relaxed max-w-lg mx-auto">
              "{invitation.historyText || 'Parece que foi ontem que nos conhecemos. Nossa jornada juntos tem sido repleta de risos, aprendizados e, acima de tudo, um amor profundo. Mal podemos esperar para iniciar este novo capítulo de nossas vidas diante de Deus e de vocês.'}"
            </p>

            <div className="mt-12 mb-6">
              <h4 className="font-serif-cinzel text-xl text-[#a67d2b] tracking-wider">Esperamos você!</h4>
              <p className="font-serif-cinzel text-xs tracking-[0.2em] text-[#6c513f]/60 uppercase mt-2">{invitation.coupleName1} &amp; {invitation.coupleName2}</p>
            </div>
          </div>

        </motion.div>
      )}

      {/* RSVP POPUP DIALOG FORM Popup Modal (Clean, modern, and perfectly styled) */}
      <AnimatePresence>
        {showRsvpModal && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRsvpModal(false)}
              className="absolute inset-0 bg-[#5a0f1b]/50 backdrop-blur-sm"
            />

            {/* Modal Body container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="bg-[#fffaf8] border-2 border-[#a67d2b]/30 rounded-3xl w-full max-w-lg p-6 sm:p-8 relative shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              {/* Close button */}
              <button 
                onClick={() => setShowRsvpModal(false)}
                className="absolute top-4 right-4 text-[#6c513f] hover:text-red-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-6">
                <span className="font-serif-cinzel text-[10px] tracking-widest text-[#a67d2b] uppercase font-bold">R.S.V.P</span>
                <h3 className="font-serif-cinzel text-xl sm:text-2xl text-[#5a0f1b] mt-1">Confirmar Presença</h3>
                <div className="w-12 h-[1px] bg-[#a67d2b]/40 mx-auto mt-2" />
                <p className="font-sans-inter text-[11px] text-[#6c513f]/70 mt-3 leading-relaxed">
                  Por favor, responda até <strong className="text-[#a67d2b]">{invitation.rsvpDeadline || '09 de Agosto'}</strong> para nos auxiliar nos preparativos.
                </p>
              </div>

              {/* RSVP Form */}
              <form onSubmit={handleLocalRsvpSubmit} className="space-y-4 text-left font-sans-inter text-xs sm:text-sm">
                <div>
                  <label className="block font-serif-cinzel text-xs tracking-wider uppercase text-[#6c513f] font-semibold mb-1">Seu Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={rsvpName}
                    onChange={e => setRsvpName(e.target.value)}
                    className="w-full bg-white border border-stone-200 focus:border-[#a67d2b] focus:ring-1 focus:ring-[#a67d2b] outline-none p-3 rounded-xl transition-all font-sans text-[#6c513f]"
                    placeholder="Ex: João da Silva"
                  />
                </div>

                <div>
                  <label className="block font-serif-cinzel text-xs tracking-wider uppercase text-[#6c513f] font-semibold mb-2">Você irá comparecer?</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { val: true, label: 'Sim, com certeza!' },
                      { val: false, label: 'Não poderei ir' }
                    ].map((opt) => (
                      <label 
                        key={opt.val ? 'yes' : 'no'} 
                        className={`p-3 rounded-xl border flex items-center justify-center text-center cursor-pointer transition-all ${
                          rsvpAttending === opt.val 
                            ? 'bg-[#5a0f1b] border-[#5a0f1b] font-bold text-white shadow-md' 
                            : 'bg-white border-stone-200 hover:bg-stone-50 text-[#6c513f]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="attending"
                          required
                          checked={rsvpAttending === opt.val}
                          onChange={() => setRsvpAttending(opt.val)}
                          className="sr-only"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {rsvpAttending && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block font-serif-cinzel text-xs tracking-wider uppercase text-[#6c513f] font-semibold mb-1">Quantidade de acompanhantes (Sem contar você)</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={rsvpCompanions}
                        onChange={e => setRsvpCompanions(parseInt(e.target.value) || 0)}
                        className="w-full bg-white border border-stone-200 focus:border-[#a67d2b] focus:ring-1 focus:ring-[#a67d2b] outline-none p-3 rounded-xl transition-all text-[#6c513f]"
                      />
                    </div>

                    {rsvpCompanions > 0 && (
                      <div>
                        <label className="block font-serif-cinzel text-xs tracking-wider uppercase text-[#6c513f] font-semibold mb-1">Nome dos Acompanhantes</label>
                        <textarea
                          rows={2}
                          value={rsvpCompanionsNames}
                          onChange={e => setRsvpCompanionsNames(e.target.value)}
                          className="w-full bg-white border border-stone-200 focus:border-[#a67d2b] focus:ring-1 focus:ring-[#a67d2b] outline-none p-3 rounded-xl transition-all text-[#6c513f]"
                          placeholder="Digite os nomes separados por vírgula"
                        />
                      </div>
                    )}
                  </motion.div>
                )}

                <div>
                  <label className="block font-serif-cinzel text-xs tracking-wider uppercase text-[#6c513f] font-semibold mb-1">Telefone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={rsvpPhone}
                    onChange={e => setRsvpPhone(e.target.value)}
                    className="w-full bg-white border border-stone-200 focus:border-[#a67d2b] focus:ring-1 focus:ring-[#a67d2b] outline-none p-3 rounded-xl transition-all text-[#6c513f]"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div>
                  <label className="block font-serif-cinzel text-xs tracking-wider uppercase text-[#6c513f] font-semibold mb-1">Restrição Alimentar ou Alergia (Opcional)</label>
                  <input
                    type="text"
                    value={rsvpFoodRestriction}
                    onChange={e => setRsvpFoodRestriction(e.target.value)}
                    className="w-full bg-white border border-stone-200 focus:border-[#a67d2b] focus:ring-1 focus:ring-[#a67d2b] outline-none p-3 rounded-xl transition-all text-[#6c513f]"
                    placeholder="Ex: Vegano, intolerância a glúten"
                  />
                </div>

                <div>
                  <label className="block font-serif-cinzel text-xs tracking-wider uppercase text-[#6c513f] font-semibold mb-1">Mensagem para os noivos (Opcional)</label>
                  <textarea
                    rows={3}
                    value={rsvpMessage}
                    onChange={e => setRsvpMessage(e.target.value)}
                    className="w-full bg-white border border-stone-200 focus:border-[#a67d2b] focus:ring-1 focus:ring-[#a67d2b] outline-none p-3 rounded-xl transition-all text-[#6c513f]"
                    placeholder="Escreva seus votos ou carinho para nós!"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#5a0f1b] hover:bg-[#7d1729] text-white font-serif-cinzel tracking-wider uppercase py-4 rounded-xl text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all mt-6"
                >
                  Enviar Confirmação
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
