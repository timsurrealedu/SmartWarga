import React, { useState, useRef, useEffect } from "react";
import { Bell, UserCircle, AlertTriangle, Menu } from "lucide-react";
import { Role } from "./Sidebar";

interface HeaderProps {
  currentRole: Role;
  toggleSidebar?: () => void;
  onProfileClick?: () => void;
}

export function Header({ currentRole, toggleSidebar, onProfileClick }: HeaderProps) {
  const [showPanicModal, setShowPanicModal] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdIntervalRef = React.useRef<any>(null);

  // Dynamic user profile sync
  const [profile, setProfile] = useState(() => {
    const stored = localStorage.getItem("user-profile");
    return stored ? JSON.parse(stored) : {
      name: "Rahardian Pratama",
      address: "Jl. Merdeka No. 45",
      rt: "05",
      rw: "12",
      phone: "0812-3456-7890",
      familyMembers: ["Siti Rahayu (Istri)", "Agus (Anak)", "Rani (Anak)"]
    };
  });

  React.useEffect(() => {
    const handleUpdate = () => {
      const stored = localStorage.getItem("user-profile");
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    };
    window.addEventListener("profile-updated", handleUpdate);
    return () => window.removeEventListener("profile-updated", handleUpdate);
  }, []);

  // Notifications State and Syncing
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target as Node)) {
        setShowNotifDropdown(false);
      }
    };
    if (showNotifDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifDropdown]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error("Failed to fetch notifications:", e);
    }
  };

  React.useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClearNotifications = async () => {
    try {
      await fetch("/api/notifications/clear", { method: "POST" });
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

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

        // Register urgent panic notification on server
        fetch("/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "DARURAT PANIC BUTTON",
            message: `DARURAT! ${profile.name} (RT ${profile.rt} / RW ${profile.rw}) mengaktifkan Tombol Panik! Butuh pertolongan segera!`,
            category: "panic"
          })
        }).then(() => fetchNotifications());
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
      <header className="py-2 md:py-5 bg-canvas flex flex-row items-center justify-between px-3 md:px-8 sticky top-0 z-10 border-b border-border-weak gap-2">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <button className="md:hidden p-1.5 -ml-1 text-text-main shrink-0" onClick={toggleSidebar}>
            <Menu size={22} />
          </button>
          <h1 className="text-base md:text-3xl font-display font-bold text-text-main truncate">
            {currentRole === "user" ? "Dashboard Warga" : currentRole === "admin" ? "Dashboard Pengurus" : "Dokumentasi"}
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-5 shrink-0">
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
              className="bg-red-600 hover:bg-red-700 text-white border-none rounded-xl py-1.5 px-2.5 md:py-3 md:px-5 font-bold uppercase tracking-wide cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(220,38,38,0.4)] transition-all text-xs select-none touch-none"
            >
              <AlertTriangle size={15} fill="currentColor" className="shrink-0" />
              <span className="hidden sm:inline">{isHolding ? `HOLD: ${3 - Math.floor((holdProgress / 100) * 3)}s` : "PANIC (TAHAN 3S)"}</span>
              <span className="sm:hidden">{isHolding ? `${3 - Math.floor((holdProgress / 100) * 3)}s` : "PANIC"}</span>
            </button>
            {isHolding && (
              <span className="text-[10px] text-red-500 font-mono mt-1 font-bold animate-pulse">
                Jangan lepas! Mengirim dalam {3 - Math.floor((holdProgress / 100) * 3)}s...
              </span>
            )}
          </div>

          <div className="relative" ref={notifDropdownRef}>
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="p-2.5 rounded-xl bg-canvas hover:bg-surface-hover border border-border-strong text-text-muted hover:text-text-main relative transition-all cursor-pointer"
            >
              <Bell size={20} />
              {notifications.some(n => !n.isRead) && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent rounded-full ring-2 ring-canvas animate-pulse" />
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-[#0c1614] [.light_&]:bg-white border border-border-strong rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b border-border-weak flex justify-between items-center bg-[#0c1614] [.light_&]:bg-white">
                  <h4 className="font-semibold text-sm text-text-main">Pemberitahuan</h4>
                  <button 
                    onClick={handleClearNotifications}
                    className="text-xs text-primary hover:underline font-semibold cursor-pointer"
                  >
                    Tandai Semua Dibaca
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-border-weak">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-text-muted text-center py-6">Tidak ada pemberitahuan baru.</p>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`p-4 hover:bg-primary/5 transition-colors ${!n.isRead ? 'bg-primary/10 [.light_&]:bg-primary/5' : 'bg-[#0c1614] [.light_&]:bg-white'}`}>
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded ${
                            n.category === 'panic' ? 'bg-red-500/20 text-red-500 font-extrabold animate-pulse' :
                            n.category === 'finance' ? 'bg-blue-500/20 text-blue-500' :
                            n.category === 'donation' ? 'bg-green-500/20 text-green-500' : 'bg-accent/20 text-accent'
                          }`}>
                            {n.category}
                          </span>
                          <span className="text-[10px] text-text-muted font-mono">{n.date}</span>
                        </div>
                        <h5 className="font-semibold text-xs text-text-main mb-0.5">{n.title}</h5>
                        <p className="text-[11px] text-text-muted leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onProfileClick}
            className="flex items-center gap-2 md:gap-3 pl-2 md:pl-5 border-l border-border-strong hover:opacity-80 transition-all text-left bg-transparent cursor-pointer"
            id="header-profile-btn"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-text-main">
                {currentRole === "user" ? profile.name : "Ketua RT 04"}
              </p>
              <p className="text-xs text-text-muted">
                {currentRole === "user" ? `Warga RT ${profile.rt} / RW ${profile.rw}` : "Pengurus"}
              </p>
            </div>
            <UserCircle size={32} className="text-primary" />
          </button>
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
