import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';

interface ScratchToRevealDateProps {
  day: string | number;
  month: string;
  year: string | number;
  invitedMessage?: string;
}

export default function ScratchToRevealDate({
  day = '14',
  month = 'September',
  year = '2025',
  invitedMessage = "You're invited!"
}: ScratchToRevealDateProps) {
  const [allRevealed, setAllRevealed] = useState(false);
  const doneRef = useRef({ day: false, month: false, year: false });

  const cvsDayRef = useRef<HTMLCanvasElement | null>(null);
  const cvsMonthRef = useRef<HTMLCanvasElement | null>(null);
  const cvsYearRef = useRef<HTMLCanvasElement | null>(null);

  const paintChampagne = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const base = ctx.createLinearGradient(0, 0, w, h);
    base.addColorStop(0, '#dce8ee');
    base.addColorStop(0.25, '#d2dfe6');
    base.addColorStop(0.55, '#c8d7df');
    base.addColorStop(0.8, '#d0dde5');
    base.addColorStop(1, '#c4d3dc');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);

    const hl = ctx.createRadialGradient(w * 0.28, h * 0.24, 0, w * 0.28, h * 0.24, w * 0.65);
    hl.addColorStop(0, 'rgba(240,248,252,0.65)');
    hl.addColorStop(0.45, 'rgba(230,242,248,0.22)');
    hl.addColorStop(1, 'rgba(230,242,248,0)');
    ctx.fillStyle = hl;
    ctx.fillRect(0, 0, w, h);

    ctx.globalAlpha = 0.10;
    for (let i = -h; i < w + h; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h * 0.75, h);
      ctx.strokeStyle = '#eef4f8';
      ctx.lineWidth = 9;
      ctx.stroke();
    }

    ctx.globalAlpha = 0.05;
    for (let i = -h + 10; i < w + h; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h * 0.75, h);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    [
      [w * 0.14, h * 0.18], [w * 0.5, h * 0.1], [w * 0.84, h * 0.22],
      [w * 0.22, h * 0.78], [w * 0.72, h * 0.82], [w * 0.88, h * 0.58],
      [w * 0.08, h * 0.52], [w * 0.62, h * 0.42], [w * 0.38, h * 0.62]
    ].forEach(([dx, dy]) => {
      const rg = ctx.createRadialGradient(dx, dy, 0, dx, dy, 6);
      rg.addColorStop(0, 'rgba(220,238,248,0.95)');
      rg.addColorStop(0.5, 'rgba(180,210,228,0.45)');
      rg.addColorStop(1, 'rgba(180,210,228,0)');
      ctx.fillStyle = rg;
      ctx.globalAlpha = 0.30;
      ctx.beginPath();
      ctx.arc(dx, dy, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'rgba(220,238,248,0.45)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0.75, 0.75, w - 1.5, h - 1.5);
  };

  const setupTile = (canvas: HTMLCanvasElement, key: 'day' | 'month' | 'year') => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const resize = () => {
      const r = parent.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      canvas.width = Math.round(r.width);
      canvas.height = Math.round(r.height);
      if (!doneRef.current[key]) {
        paintChampagne(ctx, canvas.width, canvas.height);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    let isDown = false;

    const getXY = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
      };
    };

    const finishPanel = () => {
      if (doneRef.current[key]) return;
      doneRef.current[key] = true;

      let a = 1;
      const fade = setInterval(() => {
        a -= 0.08;
        if (a <= 0) {
          clearInterval(fade);
          canvas.style.display = 'none';
          
          if (doneRef.current.day && doneRef.current.month && doneRef.current.year) {
            setAllRevealed(true);
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#c8aa78', '#dfc48e', '#ede5cc', '#f5ede0', '#1a1916', '#b89050']
            });
          }
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.globalAlpha = Math.max(0, a);
          paintChampagne(ctx, canvas.width, canvas.height);
          ctx.globalAlpha = 1;
        }
      }, 25);
    };

    const checkDone = () => {
      if (Math.random() > 0.15) return;
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let vis = 0, tot = 0;
      for (let i = 3; i < d.length; i += 16) {
        tot++;
        if (d[i] > 10) vis++;
      }
      if (tot > 0 && (tot - vis) / tot > 0.38) {
        finishPanel();
      }
    };

    const scratchAt = (x: number, y: number) => {
      if (doneRef.current[key]) return;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 38, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,1)';
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      checkDone();
    };

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      const pos = getXY(e.clientX, e.clientY);
      scratchAt(pos.x, pos.y);
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      const pos = getXY(e.clientX, e.clientY);
      scratchAt(pos.x, pos.y);
    };
    const onMouseUp = () => { isDown = false; };

    const onTouchStart = (e: TouchEvent) => {
      if (doneRef.current[key]) return;
      isDown = true;
      const t = e.touches[0];
      const pos = getXY(t.clientX, t.clientY);
      scratchAt(pos.x, pos.y);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDown || doneRef.current[key]) return;
      const t = e.touches[0];
      const pos = getXY(t.clientX, t.clientY);
      scratchAt(pos.x, pos.y);
    };
    const onTouchEnd = () => { isDown = false; };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchend', onTouchEnd);
    };
  };

  useEffect(() => {
    const cleanups: (() => void)[] = [];
    const t1 = setTimeout(() => {
      if (cvsDayRef.current) cleanups.push(setupTile(cvsDayRef.current, 'day') || (() => {}));
      if (cvsMonthRef.current) cleanups.push(setupTile(cvsMonthRef.current, 'month') || (() => {}));
      if (cvsYearRef.current) cleanups.push(setupTile(cvsYearRef.current, 'year') || (() => {}));
    }, 150);

    return () => {
      clearTimeout(t1);
      cleanups.forEach(c => c());
    };
  }, [day, month, year]);

  return (
    <div className="w-full py-6 flex flex-col items-center select-none font-['Rufina',serif]">
      <div className="w-full max-w-[460px] flex flex-col items-center">
        
        {/* 3 TILES CONTAINER */}
        <div className="flex gap-2 sm:gap-3 w-full pb-6">
          
          {/* DAY */}
          <div className="flex-1 flex flex-col items-center gap-3">
            <div className="relative w-[90%] aspect-[1/1.15] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(180,145,85,0.18)] border border-stone-200/60 bg-white flex items-center justify-center">
              <span className="font-['Rufina',serif] text-3xl sm:text-4xl text-[#3a3a3a] font-normal pointer-events-none">{day}</span>
              <canvas ref={cvsDayRef} className="absolute inset-0 w-full h-full block cursor-pointer touch-none z-10 rounded-xl" />
            </div>
            <span className="text-[10px] sm:text-xs tracking-[0.35em] text-[#7a9aaa] uppercase font-['Rufina',serif]">Dia</span>
          </div>

          {/* MONTH */}
          <div className="flex-1 flex flex-col items-center gap-3">
            <div className="relative w-[90%] aspect-[1/1.15] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(180,145,85,0.18)] border border-stone-200/60 bg-white flex items-center justify-center px-1 text-center">
              <span className="font-['Rufina',serif] text-lg sm:text-2xl text-[#3a3a3a] font-normal pointer-events-none truncate">{month}</span>
              <canvas ref={cvsMonthRef} className="absolute inset-0 w-full h-full block cursor-pointer touch-none z-10 rounded-xl" />
            </div>
            <span className="text-[10px] sm:text-xs tracking-[0.35em] text-[#7a9aaa] uppercase font-['Rufina',serif]">Mês</span>
          </div>

          {/* YEAR */}
          <div className="flex-1 flex flex-col items-center gap-3">
            <div className="relative w-[90%] aspect-[1/1.15] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(180,145,85,0.18)] border border-stone-200/60 bg-white flex items-center justify-center">
              <span className="font-['Rufina',serif] text-3xl sm:text-4xl text-[#3a3a3a] font-normal pointer-events-none">{year}</span>
              <canvas ref={cvsYearRef} className="absolute inset-0 w-full h-full block cursor-pointer touch-none z-10 rounded-xl" />
            </div>
            <span className="text-[10px] sm:text-xs tracking-[0.35em] text-[#7a9aaa] uppercase font-['Rufina',serif]">Ano</span>
          </div>

        </div>

        {/* REVEALED MESSAGE */}
        <div className={`transition-all duration-1000 transform ${allRevealed ? 'opacity-100 translate-y-0 scale-105' : 'opacity-0 translate-y-4'}`}>
          <p className="font-['Imperial_Script',cursive] text-4xl sm:text-5xl text-[#3a3a3a] font-normal text-center">
            {invitedMessage}
          </p>
        </div>

      </div>
    </div>
  );
}
