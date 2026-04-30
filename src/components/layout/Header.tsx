import React, { useState } from "react";
import { Bell, UserCircle, AlertTriangle, Menu } from "lucide-react";
import { Role } from "./Sidebar";

interface HeaderProps {
  currentRole: Role;
  toggleSidebar?: () => void;
}

export function Header({ currentRole, toggleSidebar }: HeaderProps) {
  const [showPanicModal, setShowPanicModal] = useState(false);

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

        <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 mt-2 md:mt-0 w-full md:w-auto">
          <button 
            onClick={() => setShowPanicModal(true)}
            className="bg-accent text-white border-none rounded-xl py-2 px-4 md:py-3 md:px-5 font-bold uppercase tracking-wide cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,138,101,0.3)] transition-transform hover:scale-105 text-xs md:text-sm"
          >
            <AlertTriangle size={18} fill="currentColor" className="md:w-5 md:h-5" />
            <span>PANIC</span>
          </button>
          <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-border-strong">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-text-main">
                {currentRole === "user" ? "Bpk. Rahardian" : "Ketua RT 04"}
              </p>
              <p className="text-xs text-text-muted">
                {currentRole === "user" ? "Warga RT 05 / RW 12" : "Administrator"}
              </p>
            </div>
            <UserCircle size={32} className="text-text-muted" />
          </div>
        </div>
      </header>

      {showPanicModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div 
            className="bg-surface rounded-2xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl relative animate-in fade-in zoom-in duration-300"
            style={{ backgroundColor: '#0b110b' }}
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
