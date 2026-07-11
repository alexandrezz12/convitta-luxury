import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface EnvelopeCoverProps {
  coupleName1: string;
  coupleName2: string;
  dateString: string;
  onOpen: () => void;
  accentColor: string;
  bgColor: string;
  textColor: string;
  fontDisplay: string;
  templateId?: string;
}

export default function EnvelopeCover({
  coupleName1,
  coupleName2,
  dateString,
  onOpen,
  accentColor,
  bgColor,
  textColor,
  fontDisplay,
  templateId
}: EnvelopeCoverProps) {
  // Format date elegantly e.g. "21 DE NOVEMBRO DE 2026"
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length !== 3) return dateStr;
      const year = parts[0];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      
      const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      
      return `${day} de ${months[monthIndex]} de ${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  const [isOpening, setIsOpening] = useState(false);
  const [isSealLoaded, setIsSealLoaded] = useState(false);

  const handleInteractiveOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  const isDarkEnvelope = templateId === 'template-5' || templateId === 'template-7' || templateId === 'template-8';
  const envelopeBg = templateId === 'template-7' ? '#1b232d' : ((templateId === 'template-5' || templateId === 'template-8') ? '#66021f' : '#faf9f6');
  
  // Neutral dark background for closed envelope to eliminate red bleed at corners/seams
  const closedBg = (templateId === 'template-5' || templateId === 'template-8') ? '#2e2a26' : envelopeBg;
  const currentBg = isOpening ? envelopeBg : closedBg;
  
  const accentGold = '#e2cd96';

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 sm:p-8 overflow-hidden bg-stone-100"
      style={{ backgroundColor: isDarkEnvelope ? currentBg : `${bgColor}F0` }}
      id="envelope-wrapper"
    >
      {(templateId === 'template-6' || isDarkEnvelope) ? (
        <div onClick={handleInteractiveOpen} className={`fixed inset-0 z-50 overflow-hidden select-none cursor-pointer`} style={{ backgroundColor: currentBg }}>
          {/* Global Textured Background */}
          <motion.div 
            animate={isOpening ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundColor: currentBg,
              backgroundImage: isDarkEnvelope 
                ? `radial-gradient(${accentGold}14 1px, transparent 1px)` 
                : 'radial-gradient(rgba(105, 80, 50, 0.04) 1px, transparent 1px), radial-gradient(rgba(140, 115, 85, 0.03) 1px, transparent 1px)',
              backgroundSize: '24px 24px, 37px 37px'
            }}
          />

          {/* Carta Interna Simulada - Removida para fluxo direto sem sobreposição */}

          {/* Left Flap */}
          <motion.img 
            src="https://static.tildacdn.net/tild6338-3733-4431-a363-306634383864/Polygon_4.png"
            initial={{ scale: 1.05 }}
            animate={isOpening ? { x: -800, opacity: 0, scale: 1.05 } : { x: 0, opacity: 1, scale: 1.05 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute top-0 bottom-0 left-0 w-[53%] h-full object-fill pointer-events-none z-10 ${isDarkEnvelope ? 'brightness-[0.4] sepia-[.3] hue-rotate-[-35deg]' : ''}`}
            alt=""
          />

          {/* Right Flap */}
          <motion.img 
            src="https://static.tildacdn.net/tild3636-6566-4132-b665-343766326335/Polygon_3.png"
            initial={{ scale: 1.05 }}
            animate={isOpening ? { x: 800, opacity: 0, scale: 1.05 } : { x: 0, opacity: 1, scale: 1.05 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute top-0 bottom-0 right-0 w-[53%] h-full object-fill pointer-events-none z-10 ${isDarkEnvelope ? 'brightness-[0.4] sepia-[.3] hue-rotate-[-35deg]' : ''}`}
            alt=""
          />

          {/* Top Flap */}
          <motion.img 
            src="https://static.tildacdn.net/tild3762-3738-4361-b134-333538333135/Polygon_1_3.png"
            initial={{ scale: 1.05 }}
            animate={isOpening ? { y: -700, opacity: 0, scale: 1.05 } : { y: 0, opacity: 1, scale: 1.05 }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute top-0 inset-x-0 w-full h-[53%] object-fill pointer-events-none z-20 ${isDarkEnvelope ? 'brightness-[0.35] sepia-[.3] hue-rotate-[-35deg]' : ''}`}
            alt=""
          />

          {/* Bottom Flap */}
          <motion.img 
            src="https://static.tildacdn.net/tild6262-6339-4933-b833-343039643037/Polygon_2_1.png"
            initial={{ scale: 1.05 }}
            animate={isOpening ? { y: 800, opacity: 0, scale: 1.05 } : { y: 0, opacity: 1, scale: 1.05 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute bottom-0 inset-x-0 w-full h-[53%] object-fill pointer-events-none z-20 ${isDarkEnvelope ? 'brightness-[0.38] sepia-[.3] hue-rotate-[-35deg]' : ''}`}
            alt=""
          />

          {/* Typography Header on Envelope */}
          <motion.div 
            animate={isOpening ? { y: -300, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="absolute inset-x-0 top-16 sm:top-24 flex flex-col items-center justify-center text-center px-6 z-30 pointer-events-none"
          >
            <span className={`text-[10px] sm:text-xs uppercase tracking-[0.4em] font-bold mb-2 font-sans`} style={{ color: isDarkEnvelope ? accentGold : '#a8a29e' }}>CONVITE DE CASAMENTO</span>
            <h2 
              className={`${fontDisplay} tracking-widest leading-tight uppercase font-medium text-3xl sm:text-5xl`}
              style={{ color: isDarkEnvelope ? '#fffaf8' : '#1c1917' }}
            >
              {coupleName1} <span className={`italic lowercase text-2xl sm:text-4xl mx-2`} style={{ color: isDarkEnvelope ? accentGold : '#a8a29e' }}>&amp;</span> {coupleName2}
            </h2>
            <div className={`w-12 h-[1px] mt-6 mb-4`} style={{ backgroundColor: isDarkEnvelope ? `${accentGold}50` : '#d6d3d1' }} />
            <span className={`text-xs sm:text-sm tracking-[0.25em] font-medium uppercase font-sans`} style={{ color: isDarkEnvelope ? '#fffaf8' : '#78716c' }}>
              {formatDate(dateString)}
            </span>
          </motion.div>

          {/* Floating opening button */}
          <motion.div 
            animate={isOpening ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-40"
          >
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleInteractiveOpen}
              className="group flex flex-col items-center cursor-pointer p-6 focus:outline-none"
            >
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
                {!isSealLoaded && (
                  <div className="absolute inset-0 bg-stone-200/10 rounded-full animate-pulse border border-amber-500/10" />
                )}
                <img 
                  src="https://static.tildacdn.net/tild3435-3731-4464-a537-636664626563/ChatGPT_Image_Aug_3_.png"
                  alt="Abrir convite"
                  onLoad={() => setIsSealLoaded(true)}
                  className={`w-full h-full object-contain drop-shadow-[0_15px_30px_rgba(120,80,20,0.45)] transition-all duration-500 group-hover:scale-105 ${
                    isSealLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                />
              </div>
              <span 
                className={`text-xs sm:text-sm tracking-[0.25em] mt-3 font-medium uppercase transition-all group-hover:tracking-[0.3em] font-serif font-bold`}
                style={{ color: isDarkEnvelope ? accentGold : '#2c4b5c' }}
              >
                {isDarkEnvelope ? 'Click to open' : 'Clique para abrir'}
              </span>
            </motion.button>
          </motion.div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          onClick={onOpen}
          className="relative w-full max-w-xl aspect-[4/3] bg-stone-50 rounded-lg shadow-2xl border border-stone-200/50 p-1 flex flex-col justify-between overflow-hidden cursor-pointer hover:shadow-amber-900/10 transition-shadow"
          style={{ borderColor: `${accentColor}30` }}
        >
          {/* Decorative Internal Border */}
          <div 
            className="absolute inset-4 border rounded flex flex-col justify-between p-6 sm:p-8 text-center overflow-hidden"
            style={{ borderColor: `${accentColor}50` }}
          >
            {/* Decorative Corner Ornaments */}
            {templateId === 'template-6' && (
              <>
                {/* Olive Branch vectors */}
                <div className="absolute top-0 left-0 w-12 h-12 pointer-events-none opacity-20 -translate-x-1 -translate-y-1 rotate-45" style={{ color: accentColor }}>
                  <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
                    <path d="M10,80 Q30,60 50,20 T90,10 M50,20 Q60,15 70,10 Q65,22 55,27 M40,35 Q52,30 62,25 Q55,38 43,43 M30,50 Q42,48 52,43 Q45,55 33,58" />
                  </svg>
                </div>
                <div className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none opacity-20 translate-x-1 translate-y-1 -rotate-135" style={{ color: accentColor }}>
                  <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
                    <path d="M10,80 Q30,60 50,20 T90,10 M50,20 Q60,15 70,10 Q65,22 55,27 M40,35 Q52,30 62,25 Q55,38 43,43 M30,50 Q42,48 52,43 Q45,55 33,58" />
                  </svg>
                </div>
              </>
            )}

            {/* Top Corner Details */}
            <div className="flex justify-between text-[10px] uppercase tracking-[0.2em]" style={{ color: accentColor }}>
              <span>Sálve a Data</span>
              <span>R.S.V.P</span>
            </div>

            {/* Envelope Center Message */}
            <div className="my-auto flex flex-col items-center justify-center gap-4 sm:gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-[11px] sm:text-xs uppercase tracking-[0.3em] font-medium"
                style={{ color: textColor }}
              >
                Convidamos com amor para o casamento de
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className={`py-2 text-center ${fontDisplay}`}
              >
                {coupleName1} & {coupleName2}
              </motion.h1>

              <div className="w-16 h-[1px]" style={{ backgroundColor: `${accentColor}50` }} />

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-[12px] sm:text-[13px] font-medium uppercase tracking-[0.25em]"
                style={{ color: textColor }}
              >
                {formatDate(dateString)}
              </motion.p>
            </div>

            {/* Interactive Open Flap & Wax Seal Button */}
            <div className="flex flex-col items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpen}
                className="group relative flex flex-col items-center gap-1 cursor-pointer"
                id="seal-button"
              >
                {/* Simulated Wax Seal Red/Gold Circle */}
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all border border-amber-400/30 group-hover:shadow-amber-500/20 group-hover:shadow-xl"
                  style={{ 
                    background: `radial-gradient(circle, ${accentColor} 30%, #4c0519 100%)`,
                    boxShadow: `0 4px 14px ${accentColor}40`
                  }}
                >
                  <Heart className="w-6 h-6 text-stone-100 fill-stone-100/10 group-hover:scale-110 transition-transform" />
                </div>
                
                <span 
                  className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] mt-2 transition-colors group-hover:opacity-100 opacity-80"
                  style={{ color: textColor }}
                >
                  Tocar para Abrir
                </span>
              </motion.button>
            </div>
          </div>

          {/* Diagonal background shadows simulating folded envelope flaps */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-gradient-to-tr from-stone-900 via-transparent to-stone-900" />
        </motion.div>
      )}
    </div>
  );
}
