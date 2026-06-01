import React, { useState } from "react";
import { Bell, UserCircle, AlertTriangle, Menu } from "lucide-react";
import { Role } from "./Sidebar";

interface HeaderProps {
  currentRole: Role;
  toggleSidebar?: () => void;
}

export function Header({ currentRole, toggleSidebar }: HeaderProps) {
  const [showPanicModal, setShowPanicModal] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdIntervalRef = React.useRef<any>(null);

  const startHolding = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (showPanicModal) return;
    setIsHolding(true);
    setHoldProgress(0);
    const startTime = Date.now();
    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / 3000) * 100, 100);
      setHoldProgress(progress);
      if (progress >= 100) {
        setShowPanicModal(true);
        setIsHolding(false);
        setHoldProgress(0);
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
      }
    }, 30);
  };

  const stopHolding = () => {
    setIsHolding(false);
    setHoldProgress(0);
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  React.useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  return (
    <>
      <header className="py-4 md:py-6 bg-canvas flex flex-col md:flex-row md:items-center justify-between px-4 md:px-8 sticky top-0 z-10 border-b border-border-weak md:border-none">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <button className="md:hidden p-2 -ml-2 text-text-main" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          <h1 className="text-xl md:text-3xl font-display font-bold text-text-main">
            {currentRole === "user" ? "Dashboard Warga" : currentRole === "admin" ? "Dashboard Pengurus" : "Architecture Documentation"}
          </h1>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 mt-2 md:mt-0 w-full md:w-auto flex-wrap">
          <div className="flex flex-col items-end">
            <button 
              onMouseDown={startHolding}
              onMouseUp={stopHolding}
              onMouseLeave={stopHolding}
              onTouchStart={startHolding}
              onTouchEnd={stopHolding}
              style={{
                background: isHolding 
                  ? `linear-gradient(to right, #b91c1c ${holdProgress}%, #ef4444 ${holdProgress}%)`
                  : undefined
              }}
              className="bg-red-600 hover:bg-red-700 text-white border-none rounded-xl py-2 px-4 md:py-3 md:px-5 font-bold uppercase tracking-wide cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(220,38,38,0.4)] transition-all hover:scale-102 text-xs md:text-sm select-none touch-none"
            >
              <AlertTriangle size={18} fill="currentColor" className="md:w-5 md:h-5" />
              <span>{isHolding ? `HOLD: ${3 - Math.floor((holdProgress / 100) * 3)}s` : "PANIC (TAHAN 3S)"}</span>
            </button>
            {isHolding && (
              <span className="text-[10px] text-red-500 font-mono mt-1 font-bold animate-pulse">
                Jangan lepas! Mengirim dalam {3 - Math.floor((holdProgress / 100) * 3)}s...
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-border-strong">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-text-main">
                {currentRole === "user" ? "Bpk. Rahardian" : "Ketua RT 04"}
              </p>
              <p className="text-xs text-text-muted">
                {currentRole === "user" ? "Warga RT 05 / RW 12" : "Pengurus"}
              </p>
            </div>
            <UserCircle size={32} className="text-text-muted" />
          </div>
        </div>
      </header>

      {showPanicModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div 
            className="rounded-2xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl relative animate-in fade-in zoom-in duration-300 border border-border-strong"
            style={{ backgroundColor: 'var(--canvas)' }}
          >
            <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
               <AlertTriangle size={40} className="text-accent animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-text-main mb-2 tracking-tight">DARURAT!</h2>
            <p className="text-sm text-text-muted mb-8 leading-relaxed">
              Memanggil bantuan darurat...<br/><br/>
              Koordinat lokasi dan notifikasi telah disebar ke petugas keamanan RT/RW dan warga sekitar.
            </p>
            <button 
              onClick={() => setShowPanicModal(false)}
              className="bg-primary text-text-inverse w-full py-3 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-primary/90 transition-colors"
            >
              Tutup / Batalkan
            </button>
          </div>
        </div>
      )}
    </>
  );
}
