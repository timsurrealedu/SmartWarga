import { cn } from "@/lib/utils";
import {
  FileText,
  FolderOpen,
  PieChart,
  MessageSquare,
  CreditCard,
  LayoutDashboard,
  Users,
  X,
  BookOpen
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
}

export function Sidebar({ currentRole, setRole, currentTab, setTab, onLogout, isOpen, setIsOpen }: SidebarProps) {
  const userTabs = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "letters", label: "E-Surat & QR", icon: FileText },
    { id: "finance", label: "Transparansi Kas", icon: PieChart },
    { id: "reports", label: "E-Reporting", icon: MessageSquare },
    { id: "dues", label: "Iuran Warga", icon: CreditCard },
    { id: "storage", label: "Brankas Digital", icon: FolderOpen },
  ];

  const adminTabs = [
    { id: "dashboard", label: "Admin Overview", icon: LayoutDashboard },
    { id: "validations", label: "Validasi Warga", icon: Users },
    { id: "finance_manage", label: "Kelola Kas & Iuran", icon: PieChart },
  ];

  const tabs = currentRole === "user" ? userTabs : currentRole === "admin" ? adminTabs : [];

  return (
    <div className={cn(
      "w-64 bg-sidebar border-r border-border-weak flex flex-col h-screen fixed top-0 left-0 z-30 transition-transform duration-300 md:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="p-6 relative">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-serif-title font-semibold tracking-tight">
            <span className="text-text-main">Smart</span><span className="text-accent">Warga</span>
          </h1>
        </div>
        <p className="text-xs text-text-muted opacity-70 mt-1">RT/RW Digital Platform</p>
        <button 
          className="md:hidden absolute top-6 right-4 text-text-muted hover:text-text-main"
          onClick={() => setIsOpen?.(false)}
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setTab(tab.id);
              if (setIsOpen) setIsOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
              currentTab === tab.id
                ? "bg-surface text-text-main"
                : "text-text-main/70 hover:bg-primary/20 hover:text-text-main"
            )}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
        {currentRole === 'docs' && (
           <button
           className={cn(
             "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer bg-surface text-text-main"
           )}
         >
           <BookOpen size={18} />
           Architecture Docs
         </button>
        )}
      </nav>

      <div className="p-4 border-t border-border-strong">
        <div className="space-y-2">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center px-3 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer text-accent hover:bg-accent/10 border border-accent/20"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

