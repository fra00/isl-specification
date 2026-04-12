import React, { useState, useEffect, useCallback, useRef } from "react";

export default function DungeonHeroInfoPanel({
  currentHero = null,
  currentHeroStats = null,
  movementPoints = null,
}) {
  const panelRef = useRef(null);
  const getDefaultPosition = useCallback(() => {
    if (typeof window === "undefined") {
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

  const clampPosition = useCallback((rawPosition) => {
    if (typeof window === "undefined") {
      return rawPosition;
    }

    const panelWidth = panelRef.current?.offsetWidth || 310;
    const panelHeight = panelRef.current?.offsetHeight || 420;
    const viewportPadding = 12;

    const maxX = Math.max(
      viewportPadding,
      window.innerWidth - panelWidth - viewportPadding,
    );
    const maxY = Math.max(
      viewportPadding,
      window.innerHeight - panelHeight - viewportPadding,
    );

    return {
      x: Math.min(Math.max(rawPosition.x, viewportPadding), maxX),
      y: Math.min(Math.max(rawPosition.y, viewportPadding), maxY),
    };
  }, []);

  const updatePosition = useCallback(
    (newPosition) => {
      const nextPosition = clampPosition(newPosition);
      positionRef.current = nextPosition;
      setPosition(nextPosition);
    },
    [clampPosition],
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dungeonHeroInfoPanelPosition");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed &&
          typeof parsed.x === "number" &&
          typeof parsed.y === "number"
        ) {
          updatePosition(parsed);
          return;
        }
      }
    } catch (e) {
      console.warn(
        "Failed to parse dungeonHeroInfoPanelPosition from localStorage",
        e,
      );
    }

    updatePosition(getDefaultPosition());
  }, [getDefaultPosition, updatePosition]);

  useEffect(() => {
    const handleResize = () => {
      updatePosition(positionRef.current);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [updatePosition]);

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
        "dungeonHeroInfoPanelPosition",
        JSON.stringify(positionRef.current),
      );
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, updatePosition]);

  if (!currentHero) {
    return null;
  }

  const activeEffects = currentHero?.activeStatus || [];
  const statCards = [
    {
      label: "Oro",
      value: currentHero?.gold ?? 0,
      valueClassName: "text-amber-300",
    },
    {
      label: "Corpo",
      value: currentHero?.currentBody ?? 0,
      valueClassName: "text-red-300",
    },
    {
      label: "Mente",
      value: currentHero?.currentMind ?? 0,
      valueClassName: "text-sky-300",
    },
    {
      label: "Attacco",
      value: currentHeroStats?.attacco ?? currentHero?.hero?.attacco ?? 0,
      valueClassName: "text-stone-100",
    },
    {
      label: "Difesa",
      value: currentHeroStats?.difesa ?? currentHero?.hero?.difesa ?? 0,
      valueClassName: "text-stone-100",
      colSpanClassName: "col-span-2",
    },
  ];

  return (
    <div
      ref={panelRef}
      className="fixed w-[290px] md:w-[310px] bg-stone-900/95 text-stone-200 border border-amber-900/60 rounded-xl shadow-[0_18px_40px_rgba(0,0,0,0.65)] backdrop-blur-sm z-50 overflow-hidden font-serif"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <div className="absolute top-2 left-2 h-3 w-3 border-l border-t border-amber-600/45 pointer-events-none" />
      <div className="absolute top-2 right-2 h-3 w-3 border-r border-t border-amber-600/45 pointer-events-none" />
      <div className="absolute bottom-2 left-2 h-3 w-3 border-l border-b border-amber-600/45 pointer-events-none" />
      <div className="absolute bottom-2 right-2 h-3 w-3 border-r border-b border-amber-600/45 pointer-events-none" />

      <div
        className={`relative bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 px-4 py-3 border-b border-amber-900/50 select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        onMouseDown={handleMouseDown}
      >
        <div className="text-[10px] uppercase tracking-[0.28em] text-amber-700">
          HeroQuest
        </div>
        <div className="text-center text-lg font-bold uppercase tracking-[0.14em] text-amber-500 drop-shadow-sm">
          Scheda Eroe
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-700/40 to-transparent" />
          <div className="text-[9px] uppercase tracking-[0.28em] text-stone-500">
            Cronaca del Campione
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-700/40 to-transparent" />
        </div>
      </div>

      <div className="relative p-3 md:p-4 flex flex-col gap-3 bg-[linear-gradient(180deg,_rgba(28,25,23,0.18),_rgba(12,10,9,0.05))]">
        <div className="rounded-[20px] border border-amber-900/35 bg-[linear-gradient(180deg,_rgba(12,10,9,0.82),_rgba(28,25,23,0.62))] p-3 shadow-inner">
          <div className="flex items-center gap-3 border-b border-amber-900/30 pb-3 mb-3">
            <div className="relative w-20 h-20 rounded-[18px] border border-amber-800/45 bg-gradient-to-b from-stone-900 to-stone-950 flex items-end justify-center overflow-hidden p-1.5 shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_12px_24px_rgba(0,0,0,0.24)]">
              <div className="absolute inset-[5px] rounded-[12px] border border-stone-700/50 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.14),_transparent_55%)] pointer-events-none" />
              {currentHero?.hero?.portrait ? (
                <img
                  src={`img/eroi/${currentHero.hero.portrait}`}
                  alt={currentHero?.hero?.classe || "Hero"}
                  className="w-full h-full object-contain object-bottom"
                />
              ) : (
                <span className="text-[10px] uppercase tracking-[0.18em] text-stone-600">
                  N/A
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-[0.24em] text-stone-500">
                Campione Attivo
              </div>
              <div className="text-lg font-bold text-amber-400 leading-tight break-words">
                {currentHero?.hero?.classe || "Sconosciuto"}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-amber-700/40 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-200">
                  Movimento {movementPoints ?? "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            {statCards.map((statCard) => (
              <div
                key={statCard.label}
                className={`rounded-xl border border-stone-800 bg-gradient-to-b from-stone-900/95 to-stone-950/90 px-2.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_18px_rgba(0,0,0,0.14)] ${statCard.colSpanClassName || ""}`}
              >
                <div className="text-[10px] uppercase tracking-[0.18em] text-stone-500">
                  {statCard.label}
                </div>
                <div className={`mt-1 font-bold ${statCard.valueClassName}`}>
                  {statCard.value}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col mt-3 pt-2 border-t border-amber-900/25">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-700/35 to-transparent" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500">
                Effetti Attivi
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-700/35 to-transparent" />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {activeEffects.length > 0 ? (
                activeEffects.map((activeEffect) => (
                  <span
                    key={activeEffect}
                    className="inline-flex items-center rounded-full border border-violet-500/35 bg-violet-500/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-200"
                  >
                    {activeEffect}
                  </span>
                ))
              ) : (
                <span className="inline-flex items-center rounded-full border border-stone-700/60 bg-stone-800/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-300">
                  Nessuno
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
