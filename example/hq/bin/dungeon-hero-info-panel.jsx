import React, { useState, useEffect, useCallback, useRef } from 'react';

export default function DungeonHeroInfoPanel({
  currentHero = null,
  currentHeroStats = null,
  movementPoints = null,
}) {
  const getDefaultPosition = useCallback(() => {
    if (typeof window === 'undefined') {
      return { x: 980, y: 80 };
    }

    return {
      x: Math.max(window.innerWidth - 326, 20),
      y: 80,
    };
  }, []);

  const [position, setPosition] = useState(() => getDefaultPosition());
  const [isDragging, setIsDragging] = useState(false);

  const positionRef = useRef(position);
  const offsetRef = useRef({ x: 0, y: 0 });

  const updatePosition = useCallback((newPosition) => {
    positionRef.current = newPosition;
    setPosition(newPosition);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dungeonHeroInfoPanelPosition');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          updatePosition(parsed);
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to parse dungeonHeroInfoPanelPosition from localStorage', e);
    }

    updatePosition(getDefaultPosition());
  }, [getDefaultPosition, updatePosition]);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    offsetRef.current = {
      x: e.clientX - positionRef.current.x,
      y: e.clientY - positionRef.current.y,
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      updatePosition({
        x: e.clientX - offsetRef.current.x,
        y: e.clientY - offsetRef.current.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      localStorage.setItem(
        'dungeonHeroInfoPanelPosition',
        JSON.stringify(positionRef.current),
      );
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, updatePosition]);

  if (!currentHero) {
    return null;
  }

  const activeEffects = currentHero?.activeStatus?.length > 0
    ? currentHero.activeStatus.join(', ')
    : 'Nessuno';

  return (
    <div
      className="fixed w-[290px] md:w-[310px] bg-stone-900/95 text-stone-200 border border-amber-900/60 rounded-xl shadow-[0_18px_40px_rgba(0,0,0,0.65)] backdrop-blur-sm z-50 overflow-hidden font-serif"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <div
        className={`bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 px-4 py-3 border-b border-amber-900/50 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
      >
        <div className="text-[10px] uppercase tracking-[0.28em] text-amber-700">HeroQuest</div>
        <div className="text-center text-lg font-bold uppercase tracking-[0.14em] text-amber-500 drop-shadow-sm">
          Scheda Eroe
        </div>
      </div>

      <div className="p-3 md:p-4 flex flex-col gap-3">
        <div className="rounded-lg border border-amber-900/35 bg-stone-950/70 p-3 shadow-inner">
          <div className="flex items-center gap-3 border-b border-amber-900/30 pb-3 mb-3">
            <div className="w-16 h-16 rounded-lg border border-stone-800 bg-stone-900/90 flex items-end justify-center overflow-hidden p-1 shrink-0">
              {currentHero?.hero?.portrait ? (
                <img
                  src={`img/eroi/${currentHero.hero.portrait}`}
                  alt={currentHero?.hero?.classe || 'Hero'}
                  className="w-full h-full object-contain object-bottom"
                />
              ) : (
                <span className="text-[10px] uppercase tracking-[0.18em] text-stone-600">N/A</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-[0.24em] text-stone-500">Eroe Attivo</div>
              <div className="text-lg font-bold text-amber-400 leading-tight break-words">
                {currentHero?.hero?.classe || 'Sconosciuto'}
              </div>
              <div className="text-xs text-stone-500 mt-1 uppercase tracking-[0.16em]">
                Movimento: <span className="text-stone-200 font-semibold">{movementPoints ?? '-'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded border border-stone-800 bg-stone-900/90 px-2 py-1.5">
              <div className="text-[10px] uppercase tracking-[0.18em] text-stone-500">Oro</div>
              <div className="font-bold text-amber-300">{currentHero?.gold ?? 0}</div>
            </div>
            <div className="rounded border border-stone-800 bg-stone-900/90 px-2 py-1.5">
              <div className="text-[10px] uppercase tracking-[0.18em] text-stone-500">Corpo</div>
              <div className="font-bold text-red-300">{currentHero?.currentBody ?? 0}</div>
            </div>
            <div className="rounded border border-stone-800 bg-stone-900/90 px-2 py-1.5">
              <div className="text-[10px] uppercase tracking-[0.18em] text-stone-500">Mente</div>
              <div className="font-bold text-sky-300">{currentHero?.currentMind ?? 0}</div>
            </div>
            <div className="rounded border border-stone-800 bg-stone-900/90 px-2 py-1.5">
              <div className="text-[10px] uppercase tracking-[0.18em] text-stone-500">Attacco</div>
              <div className="font-bold text-stone-100">{currentHeroStats?.attacco ?? currentHero?.hero?.attacco ?? 0}</div>
            </div>
            <div className="rounded border border-stone-800 bg-stone-900/90 px-2 py-1.5 col-span-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] uppercase tracking-[0.18em] text-stone-500">Difesa</span>
                <span className="font-bold text-stone-100">{currentHeroStats?.difesa ?? currentHero?.hero?.difesa ?? 0}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col mt-3 pt-2 border-t border-amber-900/25">
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500">Effetti Attivi</span>
            <span className="font-semibold text-xs text-violet-300 mt-1 break-words">{activeEffects}</span>
          </div>
        </div>
      </div>
    </div>
  );
}