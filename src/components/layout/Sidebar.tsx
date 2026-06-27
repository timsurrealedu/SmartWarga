import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  FolderOpen,
  PieChart,
  MessageSquare,
  CreditCard,
  LayoutDashboard,
  Users,
  X,
  BookOpen,
  Newspaper,
  Store,
  Sun,
  Moon,
  User,
  FileCheck,
  BrainCircuit,
  Vote,
} from "lucide-react";

export type Role = "user" | "admin" | "docs";

interface SidebarProps {
  currentRole: Role;
  setRole: (role: Role) => void;
  currentTab: string;
  setTab: (tab: string) => void;
  onLogout: () => void;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  theme: "light" | "dark";
  setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
}

export function Sidebar({ currentRole, setRole, currentTab, setTab, onLogout, isOpen, setIsOpen, theme, setTheme }: SidebarProps) {
  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const userTabs = [
    { id: "dashboard", label: "Beranda", icon: LayoutDashboard },
    { id: "news_gotong_royong", label: "Portal Berita", icon: Newspaper },
    { id: "market", label: "Pasar & UMKM", icon: Store },
    { id: "letters", label: "Surat Pengantar", icon: FileText },
    { id: "finance_dues", label: "Keuangan & Iuran", icon: PieChart },
    { id: "reports", label: "Lapor Masalah", icon: MessageSquare },
    { id: "tracking", label: "Lacak Status", icon: FileCheck },
    { id: "election_warga", label: "Pemilihan RT/RW", icon: Vote },
    { id: "profile", label: "Profil Keluarga", icon: User },
  ];

  const adminTabs = [
    { id: "dashboard", label: "Beranda", icon: LayoutDashboard },
    { id: "news_manage", label: "Kelola Berita", icon: Newspaper },
    { id: "market_manage", label: "Kelola UMKM & Iklan", icon: Store },
    { id: "validations", label: "Administrasi Warga", icon: Users },
    { id: "finance_manage", label: "Kelola Kas & Iuran", icon: PieChart },
    { id: "ai_triage", label: "Kelola Laporan", icon: BrainCircuit },
    { id: "election", label: "Pemilihan RT", icon: Vote },
    { id: "admin_profile", label: "Profil Pengurus", icon: User },
  ];

  const tabs = currentRole === "user" ? userTabs : currentRole === "admin" ? adminTabs : [
    { id: "docs", label: "Proposal & Dokumen", icon: BookOpen }
  ];

  const [ads, setAds] = useState<any[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    fetch('/api/ads').then(r => r.json()).then(setAds);
  }, []);

  useEffect(() => {
    if (ads.length === 0) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % ads.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [ads.length]);

  return (
    <div className={cn(
      "w-64 bg-sidebar border-r border-border-weak flex flex-col h-screen fixed top-0 left-0 z-30 transition-transform duration-300 md:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="px-6 pb-4 pt-[max(1.5rem,env(safe-area-inset-top))] relative">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-serif-title font-semibold tracking-tight">
            <span className="text-text-main">Smart</span><span className="text-accent">Warga</span>
          </h1>
        </div>
        <p className="text-xs text-text-muted opacity-70 mt-1">RT/RW Digital Platform</p>



        <button
          aria-label="Tutup menu"
          className="md:hidden absolute top-4 right-2 h-11 w-11 flex items-center justify-center rounded-lg text-text-muted hover:text-text-main active:bg-surface-hover"
          onClick={() => setIsOpen?.(false)}
        >
          <X size={22} />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setTab(tab.id);
              if (setIsOpen) setIsOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
              currentTab === tab.id
                ? "bg-primary/15 text-primary font-semibold border border-primary/25 shadow-xs"
                : "text-text-main/70 hover:bg-primary/10 hover:text-text-main"
            )}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="px-4 py-3">
        {ads.length > 0 && (
          <div 
            onClick={() => {
              if (ads[carouselIndex]?.link) {
                window.open(ads[carouselIndex].link, '_blank');
              }
            }}
            className="bg-surface border border-border-weak rounded-xl p-2 relative overflow-hidden group cursor-pointer shadow-sm h-[152px] hover:border-primary/50 transition-colors"
          >
            <span className="absolute top-2 right-2 text-[8px] bg-black/50 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-widest z-20">Ad</span>
            <AnimatePresence initial={false}>
              <motion.div
                key={carouselIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-2 z-10 flex flex-col"
              >
                <img src={ads[carouselIndex]?.image} referrerPolicy="no-referrer" alt={ads[carouselIndex]?.title} className="w-full h-24 object-cover rounded-lg group-hover:scale-105 transition-transform duration-500" />
                <div className="mt-2 text-center">
                  <p className="text-xs font-bold text-text-main line-clamp-1">{ads[carouselIndex]?.title}</p>
                  <p className="text-[10px] text-text-muted">{ads[carouselIndex]?.sponsor}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border-strong space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer text-text-muted hover:bg-surface-hover border border-border-weak"
        >
          <span className="flex items-center gap-2">
            {theme === "light" ? <Sun size={18} className="text-accent" /> : <Moon size={18} className="text-primary" />}
            Mode {theme === "light" ? "Terang" : "Gelap"}
          </span>
          <span className="text-[10px] bg-surface border border-border-weak px-2 py-0.5 rounded text-text-muted uppercase font-bold">
            Ubah
          </span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer text-accent hover:bg-accent/10 border border-accent/20"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

