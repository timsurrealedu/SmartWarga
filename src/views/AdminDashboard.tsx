import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import {
  Users, UserCheck, FileText, Check, X, Search, Upload, Camera, CheckCircle2, User, Plus, MessageSquare, CreditCard,
  Download, ChevronDown, ChevronUp, Newspaper, Store, Calendar, Megaphone, AlertTriangle, Tag, PhoneCall, LayoutDashboard,
  BrainCircuit, SlidersHorizontal, ArrowUpDown, ThumbsUp, Pencil, ChevronRight, Filter, Vote, Trophy, Clock, UserPlus,
  Lock, Shield, ShieldCheck, Edit3, Wallet, HeartHandshake, ArrowRight, TrendingUp, TrendingDown, Activity, Receipt,
  Bell, ZoomIn, Inbox,
} from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {
  PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts";

export function AdminDashboard({ currentTab, setTab }: { currentTab: string, setTab: (tab: string) => void }) {
  const [validationsSubTab, setValidationsSubTab] = useState<"letters" | "register" | "data">("letters");

  const navigateToValidations = (subTab: "letters" | "register" | "data") => {
    setValidationsSubTab(subTab);
    setTab("validations");
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-20 relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {currentTab === "dashboard" && <AdminOverviewTab setTab={setTab} navigateToValidations={navigateToValidations} />}
          {currentTab === "news_manage" && <AdminNewsTab />}
          {currentTab === "market_manage" && <AdminMarketTab />}
          {currentTab === "validations" && <ValidationsTab initialSubTab={validationsSubTab} />}
          {currentTab === "finance_manage" && <AdminFinanceTab />}
          {currentTab === "ai_triage" && <AITriageTab />}
          {currentTab === "election" && <ElectionTab />}
          {currentTab === "admin_profile" && <AdminProfileTab />}
        </motion.div>
      </AnimatePresence>

      <AdminChatbot />
    </div>
  );
}

const arr = (x: any): any[] => (Array.isArray(x) ? x : []);
const rpShort = (n: number) => {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)} jt`;
  if (n >= 1_000) return `Rp ${Math.round(n / 1_000)} rb`;
  return `Rp ${n.toLocaleString("id-ID")}`;
};

function AdminOverviewTab({ setTab, navigateToValidations }: { setTab: (tab: string) => void, navigateToValidations: (subTab: "letters" | "register" | "data") => void }) {
  const [d, setD] = useState({
    pendingLetters: 0, activeReports: 0, urgentReports: 0, pendingDues: 0,
    paidRate: 0, paidCount: 0, totalDues: 0, collected: 0, unpaidDues: 0,
    totalResidents: 0, monthlyIn: 0, monthlyOut: 0,
  });
  const [pendingWarga] = useState(3);
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [election, setElection] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/letters").then(r => r.json()).catch(() => []),
      fetch("/api/admin/complaints").then(r => r.json()).catch(() => []),
      fetch("/api/finance").then(r => r.json()).catch(() => ({ history: [] })),
      fetch("/api/election").then(r => r.json()).catch(() => null),
      fetch("/api/admin/residents").then(r => r.json()).catch(() => []),
      fetch("/api/donations").then(r => r.json()).catch(() => []),
    ]).then(([letters, complaints, finance, elec, residents, dons]) => {
      const currentDues = arr(residents).map((r: any) => r.dues?.[r.dues.length - 1]).filter(Boolean);
      const paidDues = currentDues.filter((x: any) => x.status === "paid");
      setD({
        pendingLetters: arr(letters).filter((l: any) => l.status === "pending").length,
        activeReports: arr(complaints).filter((c: any) => c.status !== "SELESAI").length,
        urgentReports: arr(complaints).filter((c: any) => (c.aiLabels?.urgency ?? 0) >= 8).length,
        pendingDues: currentDues.filter((x: any) => x.status === "pending").length,
        unpaidDues: currentDues.filter((x: any) => x.status === "unpaid").length,
        paidCount: paidDues.length,
        totalDues: currentDues.length,
        collected: paidDues.reduce((s: number, x: any) => s + (x.amount || 0), 0),
        paidRate: currentDues.length ? Math.round((paidDues.length / currentDues.length) * 100) : 0,
        totalResidents: arr(residents).length,
        monthlyIn: (arr(finance?.history).slice(-1)[0]?.Pemasukan ?? 0) * 1000,
        monthlyOut: (arr(finance?.history).slice(-1)[0]?.Pengeluaran ?? 0) * 1000,
      });
      setHistory(arr(finance?.history).slice(-6));
      setRecentReports(arr(complaints).slice(0, 5));
      setDonations(arr(dons));
      if (elec?.phase && elec.phase !== "inactive") setElection(elec);
      setLoading(false);
    });
  }, []);

  const today = new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const actions = [
    { key: "letters", icon: FileText, label: "Surat Menunggu", hint: "Tinjau & tanda tangani", count: d.pendingLetters, onClick: () => navigateToValidations("letters") },
    { key: "dues", icon: CreditCard, label: "Verifikasi Iuran", hint: "Cek bukti transfer", count: d.pendingDues, onClick: () => setTab("finance_manage") },
    { key: "register", icon: UserPlus, label: "Pendaftaran Baru", hint: "Validasi KTP warga", count: pendingWarga, onClick: () => navigateToValidations("register") },
    { key: "urgent", icon: AlertTriangle, label: "Laporan Mendesak", hint: "Urgensi tinggi", count: d.urgentReports, onClick: () => setTab("ai_triage") },
  ];
  const totalActions = actions.reduce((s, a) => s + a.count, 0);

  const kpis = [
    { icon: Users, label: "Kepala Keluarga", value: String(d.totalResidents), sub: "terdaftar aktif", tint: "text-primary bg-primary/10" },
    { icon: Wallet, label: "Iuran Terkumpul", value: rpShort(d.collected), sub: `${d.paidRate}% pelunasan bulan ini`, tint: "text-emerald-400 bg-emerald-400/10" },
    { icon: Activity, label: "Laporan Aktif", value: String(d.activeReports), sub: d.urgentReports > 0 ? `${d.urgentReports} perlu prioritas` : "terkendali", tint: "text-amber-400 bg-amber-400/10" },
    { icon: HeartHandshake, label: "Donasi Terkumpul", value: rpShort(donations.reduce((s, x) => s + (x.raised || 0), 0)), sub: `${donations.length} galang dana aktif`, tint: "text-accent bg-accent/10" },
  ];

  const maxBar = Math.max(1, ...history.flatMap(h => [h.Pemasukan, h.Pengeluaran]));

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-border-weak bg-gradient-to-br from-primary/15 via-surface to-surface p-6 md:p-7">
        <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-text-muted capitalize">{today}</p>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-text-main mt-1">Selamat datang, Ketua RT 04</h2>
            <p className="text-sm text-text-muted mt-1.5">
              {totalActions > 0
                ? <><span className="font-semibold text-text-main">{totalActions} hal</span> memerlukan perhatian Anda hari ini.</>
                : "Semua tugas administrasi sudah tertangani. Kerja bagus!"}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-4 py-2.5 w-fit shrink-0">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
            <p className="text-xs font-semibold text-primary">RT 04 — Aman & Kondusif</p>
          </div>
        </div>
      </div>

      {/* Election alert if active */}
      {election && (
        <div className={cn("border rounded-xl p-4 flex items-center justify-between gap-3",
          election.phase === "voting" ? "bg-blue-500/10 border-blue-500/25" : "bg-primary/10 border-primary/25"
        )}>
          <div className="flex items-center gap-3">
            <Vote size={18} className={election.phase === "voting" ? "text-blue-400" : "text-primary"} />
            <div>
              <p className="font-semibold text-sm text-text-main">
                {election.phase === "nominating" ? "Fase Nominasi Sedang Berjalan" : election.phase === "voting" ? "Pemungutan Suara Sedang Berlangsung" : "Pemilihan RT Selesai"}
              </p>
              <p className="text-xs text-text-muted">{election.candidates?.length || 0} kandidat terdaftar · {election.votes?.length || 0} suara masuk</p>
            </div>
          </div>
          <button onClick={() => setTab("election")} className="text-xs font-bold text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition cursor-pointer shrink-0">Kelola</button>
        </div>
      )}

      {/* ── Action center ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-text-main">Perlu Tindakan Anda</h3>
            {totalActions > 0 && <span className="text-[10px] font-bold bg-accent/15 text-accent px-2 py-0.5 rounded-full border border-accent/25">{totalActions}</span>}
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {actions.map(a => {
            const active = a.count > 0;
            return (
              <button
                key={a.key}
                onClick={a.onClick}
                className={cn(
                  "group relative text-left rounded-xl border p-4 transition-all cursor-pointer",
                  active ? "bg-surface border-accent/30 hover:border-accent/60 hover:bg-surface-hover" : "bg-surface border-border-weak hover:bg-surface-hover"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", active ? "bg-accent/15 text-accent" : "bg-primary/10 text-primary")}>
                    {active ? <a.icon size={17} /> : <Check size={17} />}
                  </div>
                  <span className={cn("text-2xl font-display font-bold leading-none", active ? "text-text-main" : "text-text-muted/40")}>{a.count}</span>
                </div>
                <p className="text-sm font-semibold text-text-main mt-3">{a.label}</p>
                <p className="text-[11px] text-text-muted mt-0.5 flex items-center gap-1">
                  {active ? a.hint : "Tidak ada antrean"}
                  {active && <ArrowRight size={11} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="bg-surface border border-border-weak rounded-xl p-4">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-3", k.tint)}>
              <k.icon size={16} />
            </div>
            <p className="text-xl font-display font-bold text-text-main leading-tight">{k.value}</p>
            <p className="text-xs font-medium text-text-main mt-1">{k.label}</p>
            <p className="text-[11px] text-text-muted mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Lower grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent reports */}
        <div className="lg:col-span-2 bg-surface border border-border-weak rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-main">Laporan Terbaru Warga</h3>
            <button onClick={() => setTab("ai_triage")} className="text-xs text-primary hover:underline cursor-pointer flex items-center gap-1">Lihat semua <ChevronRight size={13} /></button>
          </div>
          {loading ? (
            <div className="space-y-2">{[0, 1, 2].map(i => <div key={i} className="h-14 rounded-xl bg-surface-hover/50 animate-pulse" />)}</div>
          ) : recentReports.length === 0 ? (
            <div className="py-10 text-center">
              <CheckCircle2 size={28} className="text-primary mx-auto mb-2" />
              <p className="text-sm text-text-muted">Belum ada laporan masuk.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentReports.map(r => {
                const u = r.aiLabels?.urgency ?? 0;
                return (
                  <button key={r.id} onClick={() => setTab("ai_triage")} className="w-full text-left bg-canvas border border-border-weak rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-surface-hover hover:border-border-strong transition cursor-pointer">
                    <div className={cn("w-1.5 h-9 rounded-full shrink-0", u >= 8 ? "bg-red-500" : u >= 5 ? "bg-amber-400" : "bg-primary")} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-text-main truncate">{r.title}</p>
                        {u >= 8 && <span className="text-[9px] font-bold bg-red-500/15 text-red-400 px-1.5 py-0.5 rounded shrink-0">URGEN</span>}
                      </div>
                      <p className="text-[11px] text-text-muted truncate">{r.location} · {r.sender} · {r.date}</p>
                    </div>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border shrink-0",
                      r.status === "SELESAI" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" :
                      r.status === "PROSES" ? "bg-amber-500/15 text-amber-400 border-amber-500/30" :
                      "bg-zinc-500/15 text-zinc-400 border-zinc-500/30"
                    )}>{r.status}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column: finance + donations */}
        <div className="space-y-5">
          {/* Kas snapshot */}
          <div className="bg-surface border border-border-weak rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text-main">Arus Kas</h3>
              <button onClick={() => setTab("finance_manage")} className="text-xs text-primary hover:underline cursor-pointer flex items-center gap-1">Kelola <ChevronRight size={13} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl bg-emerald-400/10 border border-emerald-400/20 p-3">
                <div className="flex items-center gap-1.5 text-emerald-400 mb-1"><TrendingUp size={13} /><span className="text-[10px] font-semibold uppercase tracking-wide">Masuk</span></div>
                <p className="text-sm font-display font-bold text-text-main">{rpShort(d.monthlyIn)}</p>
              </div>
              <div className="rounded-xl bg-accent/10 border border-accent/20 p-3">
                <div className="flex items-center gap-1.5 text-accent mb-1"><TrendingDown size={13} /><span className="text-[10px] font-semibold uppercase tracking-wide">Keluar</span></div>
                <p className="text-sm font-display font-bold text-text-main">{rpShort(d.monthlyOut)}</p>
              </div>
            </div>
            {/* mini 6-month bars */}
            <div className="flex items-end justify-between gap-1.5 h-20 pt-2">
              {history.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end justify-center gap-0.5 h-16">
                    <div className="w-1/2 rounded-t bg-primary/70" style={{ height: `${(h.Pemasukan / maxBar) * 100}%` }} title={`Masuk: ${rpShort(h.Pemasukan * 1000)}`} />
                    <div className="w-1/2 rounded-t bg-accent/70" style={{ height: `${(h.Pengeluaran / maxBar) * 100}%` }} title={`Keluar: ${rpShort(h.Pengeluaran * 1000)}`} />
                  </div>
                  <span className="text-[9px] text-text-muted">{h.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Donations */}
          <div className="bg-surface border border-border-weak rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-text-main mb-4">Penggalangan Dana Aktif</h3>
            {donations.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-4">Tidak ada penggalangan dana.</p>
            ) : (
              <div className="space-y-4">
                {donations.map((don: any) => {
                  const pct = Math.min(100, Math.round(((don.raised || 0) / (don.target || 1)) * 100));
                  return (
                    <div key={don.id}>
                      <p className="text-xs font-semibold text-text-main truncate">{don.title}</p>
                      <div className="h-2 rounded-full bg-canvas border border-border-weak overflow-hidden mt-2">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[11px] text-text-muted">{rpShort(don.raised || 0)} <span className="opacity-60">/ {rpShort(don.target || 0)}</span></span>
                        <span className="text-[11px] font-bold text-primary">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div>
        <h3 className="text-sm font-semibold text-text-main mb-3">Aksi Cepat</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Newspaper, label: "Kelola Berita", onClick: () => setTab("news_manage") },
            { icon: Receipt, label: "Catat Kas", onClick: () => setTab("finance_manage") },
            { icon: BrainCircuit, label: "Kelola Laporan", onClick: () => setTab("ai_triage") },
            { icon: Vote, label: "Pemilihan RT", onClick: () => setTab("election") },
          ].map(q => (
            <button key={q.label} onClick={q.onClick} className="flex items-center gap-3 bg-surface border border-border-weak rounded-xl px-4 py-3.5 hover:bg-surface-hover hover:border-border-strong transition cursor-pointer text-left">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"><q.icon size={17} /></div>
              <span className="text-sm font-medium text-text-main">{q.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function LettersApprovalTab() {
  const [letters, setLetters] = useState<any[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<any | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  useEffect(() => {
    fetch('/api/admin/letters').then(r => r.json()).then(setLetters);
  }, []);

  const handleApprove = async () => {
    if (!selectedLetter || !hasSignature) return alert("Mohon tanda tangani surat terlebih dahulu.");
    const signature = canvasRef.current?.toDataURL();
    await fetch(`/api/admin/letters/${selectedLetter.id}/approve`, { 
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ signature })
    });
    setLetters(letters.map(l => l.id === selectedLetter.id ? { ...l, status: "approved", adminSignature: signature } : l));
    setSelectedLetter(null);
    setHasSignature(false);
  };
  
  const handleReject = async (id: string) => {
    await fetch(`/api/admin/letters/${id}/reject`, { method: "PUT" });
    setLetters(letters.map(l => l.id === id ? { ...l, status: "rejected" } : l));
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasSignature(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.nativeEvent.offsetX;
      clientY = e.nativeEvent.offsetY;
    }

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.nativeEvent.offsetX;
      clientY = e.nativeEvent.offsetY;
    }

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = '#2c3d2d';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);
  
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleDownloadPDF = (letter: any) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("RUKUN TETANGGA 05 / RUKUN WARGA 12", 105, 15, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Kelurahan Sukamaju, Kecamatan Cibeunying, Kota Bandung, Jawa Barat", 105, 20, { align: "center" });
    doc.line(20, 25, 190, 25);
    doc.line(20, 26, 190, 26);

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    const title = letter.type.toUpperCase();
    doc.text(title, 105, 40, { align: "center" });
    doc.setLineWidth(0.5);
    doc.line(105 - (doc.getTextWidth(title)/2), 41, 105 + (doc.getTextWidth(title)/2), 41);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Nomor: ${letter.id}/RT.05/${new Date().getFullYear()}`, 105, 46, { align: "center" });

    // Body
    doc.text("Yang bertanda tangan di bawah ini Ketua RT. 05 RW. 12 Kelurahan Sukamaju, menerangkan bahwa:", 20, 60);
    
    const data = [
      ["Nama", `: ${letter.name || "Warga"}`],
      ["NIK", ": 3273****************"],
      ["Alamat", ": Jl. Merdeka No. 45"],
      ["Keperluan", `: ${letter.keperluan}`],
    ];

    (doc as any).autoTable({
      startY: 65,
      margin: { left: 25 },
      body: data,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: { 0: { cellWidth: 40 } }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 100;
    doc.text("Demikian surat ini dibuat agar dapat dipergunakan sebagaimana mestinya.", 20, finalY + 15);

    // Signatures
    const sigY = finalY + 40;
    doc.text("Bandung, " + letter.date.split(",")[0], 140, sigY - 10);
    
    doc.text("Pemohon,", 30, sigY);
    if (letter.wargaSignature) {
      doc.addImage(letter.wargaSignature, 'PNG', 25, sigY + 5, 40, 20);
    }
    doc.text(`(${letter.name || "Warga"})`, 30, sigY + 30);

    doc.text("Ketua RT 05,", 140, sigY);
    if (letter.adminSignature) {
      doc.addImage(letter.adminSignature, 'PNG', 135, sigY + 5, 40, 20);
    }
    doc.text("(..............................)", 140, sigY + 30);

    doc.save(`${letter.type}-${letter.id}.pdf`);
  };

  return (
    <div className="space-y-6">
      {selectedLetter && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative border border-border-strong p-6 md:p-8 animate-in fade-in zoom-in duration-300 flex flex-col">
            <button 
              onClick={() => { setSelectedLetter(null); setHasSignature(false); }}
              className="absolute top-4 right-4 text-text-muted hover:text-text-main"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-display font-semibold text-text-main mb-6">Review Persetujuan Surat</h3>
            
            <div className="bg-[#e2e8e2] text-[#1B332D] p-6 rounded-xl border border-border-strong mb-6 text-sm flex flex-col gap-3 font-sans">
              <div className="text-center font-bold uppercase mb-2 text-lg border-b border-[#1B332D]/20 pb-2">
                {selectedLetter.type}
              </div>
              <div><span className="font-semibold">Nama:</span> {selectedLetter.name}</div>
              <div><span className="font-semibold">ID Surat:</span> {selectedLetter.id}</div>
              <div><span className="font-semibold">Keperluan:</span> {selectedLetter.keperluan || '-'}</div>
              <div><span className="font-semibold">Tanggal:</span> {selectedLetter.date}</div>
              <div className="mt-4">
                 <span className="font-semibold block mb-2">Tanda Tangan Pemohon:</span>
                 {selectedLetter.wargaSignature ? (
                   <img src={selectedLetter.wargaSignature} alt="Tanda Tangan Warga" className="h-[80px] w-auto border border-[#1B332D]/20 rounded bg-white/50" />
                 ) : (
                   <div className="h-[80px] w-full max-w-[200px] border border-[#1B332D]/20 border-dashed rounded flex flex-col items-center justify-center text-[#1B332D]/50 bg-white/30 text-xs italic">Tidak ada</div>
                 )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-2 flex justify-between">
                 <span>Tanda Tangan Digital Pengurus</span>
                 <button onClick={clearSignature} type="button" className="text-accent underline lowercase font-normal">Hapus Tanda Tangan</button>
              </label>
              <div className="border border-border-strong rounded-lg bg-[#e2e8e2] overflow-hidden mb-6 flex justify-center">
                <canvas 
                  ref={canvasRef}
                  width={600}
                  height={150}
                  className="w-full max-w-[600px] h-[150px] touch-none cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseOut={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-auto">
              <button 
                onClick={() => handleReject(selectedLetter.id)}
                className="flex-1 bg-surface border border-accent text-accent font-semibold py-3 rounded-lg hover:bg-accent/10 transition-colors"
              >
                Tolak
              </button>
              <button 
                onClick={handleApprove} 
                className="flex-[2] bg-primary text-text-inverse font-semibold py-3 rounded-lg hover:bg-surface-hover hover:text-text-main transition-colors"
              >
                Setujui & Tanda Tangani
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-display font-semibold text-text-main">Approval Surat Pengantar</h2>
        <p className="text-sm text-text-muted mt-1">Review dan berikan persetujuan (Digital Signature) untuk permohonan surat warga.</p>
      </div>

      <div className="bg-surface rounded-2xl border border-border-weak overflow-hidden">
        <div className="p-4 border-b border-border-weak flex gap-3 bg-surface">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Cari nama warga..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-canvas border border-border-strong rounded-lg outline-none focus:border-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-canvas border border-border-strong rounded-lg outline-none cursor-pointer"
          >
            <option value="Semua">Semua Status</option>
            <option value="pending">Menunggu Validasi</option>
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>
        <div className="divide-y divide-border-weak">
          {[...letters]
            .filter(l => {
              const matchSearch = !searchText || l.name?.toLowerCase().includes(searchText.toLowerCase());
              const matchStatus = statusFilter === "Semua" || l.status === statusFilter;
              return matchSearch && matchStatus;
            })
            .sort((a, b) => {
              // pending first, then approved/rejected
              if (a.status === "pending" && b.status !== "pending") return -1;
              if (a.status !== "pending" && b.status === "pending") return 1;
              return 0;
            })
            .map((letter) => (
              <div key={letter.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-hover transition-colors">
                <div className="flex items-start gap-4">
                  <div className={cn("p-2 rounded-lg shrink-0", letter.status === "pending" ? "bg-accent/15 text-accent" : letter.status === "approved" ? "bg-primary/15 text-primary" : "bg-red-500/10 text-red-400")}>
                    <FileText size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-text-main">{letter.name}</p>
                    <p className="text-sm text-text-muted">{letter.type}</p>
                    <p className="text-xs text-text-muted mt-1 font-mono">{letter.id} · {letter.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {letter.status === "pending" ? (
                    <button
                      onClick={() => setSelectedLetter(letter)}
                      className="flex items-center gap-1.5 bg-primary text-text-inverse hover:bg-primary/80 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                    >
                      Tinjau
                    </button>
                  ) : (
                    <>
                      {letter.status === "approved" && (
                        <button
                          onClick={() => handleDownloadPDF(letter)}
                          className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors cursor-pointer"
                          title="Download PDF"
                        >
                          <Download size={14} />
                        </button>
                      )}
                      <span className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5",
                        letter.status === "approved" ? "bg-primary/15 text-primary" : "bg-red-500/10 text-red-400"
                      )}>
                        {letter.status === "approved" ? <><Check size={13} /> Disetujui</> : <><X size={13} /> Ditolak</>}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function ValidationsTab({ initialSubTab }: { initialSubTab?: "letters" | "register" | "data" }) {
  const [subTab, setSubTab] = useState<"letters" | "register" | "data">(initialSubTab || "letters");

  useEffect(() => {
    if (initialSubTab) setSubTab(initialSubTab);
  }, [initialSubTab]);

  // Warga data section state
  const [sigUnlocked, setSigUnlocked] = useState(false);
  const [sigCanvasRef] = useState(() => React.createRef<HTMLCanvasElement>());
  const [sigDrawing, setSigDrawing] = useState(false);
  const [sigDone, setSigDone] = useState(false);
  const [residents, setResidents] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (subTab === "data") {
      fetch("/api/admin/residents").then(r => r.json()).then(setResidents).catch(() => {});
    }
  }, [subTab]);

  const startSigDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setSigDrawing(true); setSigDone(true);
    const c = sigCanvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    ctx.strokeStyle = "#4ade80"; ctx.lineWidth = 2; ctx.lineCap = "round";
    const rect = c.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).nativeEvent.offsetX;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).nativeEvent.offsetY;
    ctx.beginPath(); ctx.moveTo(x, y);
  };
  const moveSig = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!sigDrawing) return;
    const c = sigCanvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const rect = c.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).nativeEvent.offsetX;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).nativeEvent.offsetY;
    ctx.lineTo(x, y); ctx.stroke();
  };
  const endSig = () => setSigDrawing(false);
  const clearSig = () => {
    const c = sigCanvasRef.current; if (!c) return;
    c.getContext("2d")?.clearRect(0, 0, c.width, c.height);
    setSigDone(false);
  };

  // OCR section state
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);

  const simulateOCR = () => {
    setOcrScanning(true);
    setTimeout(() => {
      setOcrScanning(false);
      setOcrResult({ nik: "3273112345678900", name: "Agus Pratama", tempatLahir: "Bandung", tanggalLahir: "14-08-1985", alamat: "Jl. Merdeka No. 45", rt: "05", rw: "12", agama: "Islam", status: "Kawin" });
    }, 2500);
  };

  const handleValidate = () => {
    alert("Warga divalidasi dan disimpan ke database!");
    setOcrResult(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-semibold text-text-main">Administrasi Warga</h2>
        <p className="text-sm text-text-muted mt-1">Kelola surat warga, pendaftaran KTP/KK, dan data warga terdaftar di RT 04.</p>
      </div>

      {/* Sub-tab selector */}
      <div className="flex bg-surface rounded-xl p-1 border border-border-weak w-full sm:w-fit overflow-x-auto">
        {([["letters", "Validasi Surat"], ["register", "Pendaftaran Warga"], ["data", "Data Warga"]] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setSubTab(id)}
            className={cn("px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0", subTab === id ? "bg-primary text-text-inverse" : "text-text-muted hover:text-text-main")}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Validasi Surat ── */}
      {subTab === "letters" && <LettersApprovalTab />}

      {/* ── Pendaftaran Warga ── */}
      {subTab === "register" && (
        <PendaftaranWargaSection ocrScanning={ocrScanning} ocrResult={ocrResult} simulateOCR={simulateOCR} handleValidate={handleValidate} />
      )}

      {/* ── Data Warga (locked with digital signature) ── */}
      {subTab === "data" && (
        <div className="space-y-4">
          {!sigUnlocked ? (
            <div className="max-w-md mx-auto bg-surface border border-border-strong rounded-xl p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center shrink-0"><Shield size={20} className="text-accent" /></div>
                <div>
                  <p className="font-semibold text-text-main text-sm">Akses Data Warga Terlindungi</p>
                  <p className="text-xs text-text-muted mt-0.5">Tanda tangani di bawah untuk membuka akses edit data warga terdaftar.</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-text-muted mb-2">Tanda Tangan Pengurus RT:</p>
                <div className="border-2 border-dashed border-border-strong rounded-xl overflow-hidden bg-canvas touch-none">
                  <canvas
                    ref={sigCanvasRef}
                    width={380}
                    height={120}
                    className="w-full cursor-crosshair"
                    onMouseDown={startSigDraw}
                    onMouseMove={moveSig}
                    onMouseUp={endSig}
                    onMouseLeave={endSig}
                    onTouchStart={startSigDraw}
                    onTouchMove={moveSig}
                    onTouchEnd={endSig}
                  />
                </div>
                <div className="flex justify-end mt-1">
                  <button onClick={clearSig} className="text-xs text-text-muted hover:text-text-main cursor-pointer">Hapus tanda tangan</button>
                </div>
              </div>
              <button
                onClick={() => sigDone && setSigUnlocked(true)}
                disabled={!sigDone}
                className="w-full bg-primary text-text-inverse font-bold py-2.5 rounded-xl hover:bg-primary/90 transition cursor-pointer disabled:opacity-40"
              >
                <Lock size={14} className="inline mr-2" />Buka Akses Data Warga
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-4 py-2.5">
                <ShieldCheck size={16} className="text-primary" />
                <p className="text-xs text-primary font-semibold">Akses terbuka — terautentikasi dengan tanda tangan digital</p>
                <span className="ml-auto text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-lg border border-primary/20">
                  {residents.length} Warga Terdaftar
                </span>
                <button onClick={() => { setSigUnlocked(false); setSigDone(false); clearSig(); }} className="text-xs text-text-muted hover:text-text-main cursor-pointer">Kunci</button>
              </div>
              {residents.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-8">Memuat data warga...</p>
              ) : residents.map((res: any, idx: number) => {
                // Dummy extended profile data keyed by index
                const dummyExtra = [
                  { nik: "3273110102850001", phone: "0812-3456-7890", email: "rahardian@email.com", kk: "3273110102850000", agama: "Islam", status: "Kawin", pekerjaan: "Karyawan Swasta" },
                  { nik: "3273110203900002", phone: "0813-2345-6789", email: "dewi.s@email.com", kk: "3273110203900000", agama: "Islam", status: "Kawin", pekerjaan: "Ibu Rumah Tangga" },
                  { nik: "3273110405950003", phone: "0821-9876-5432", email: "budi.p@email.com", kk: "3273110405950000", agama: "Kristen", status: "Belum Kawin", pekerjaan: "Mahasiswa" },
                ][idx % 3];
                const isEditing = editingId === res.id;
                return (
                  <div key={res.id} className="bg-surface border border-border-weak rounded-xl overflow-hidden">
                    <div className="px-4 py-3 flex items-center gap-4">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0"><User size={16} /></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-text-main">{res.name}</p>
                        <p className="text-xs text-text-muted truncate">{res.address} · <span className="font-mono">{dummyExtra?.nik}</span></p>
                      </div>
                      <button
                        onClick={() => setEditingId(isEditing ? null : res.id)}
                        className={cn("flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0 border",
                          isEditing ? "bg-primary/10 text-primary border-primary/30" : "text-primary border-primary/30 hover:bg-primary/10")}
                      >
                        <Edit3 size={12} /> {isEditing ? "Tutup" : "Edit"}
                      </button>
                    </div>

                    {isEditing && (
                      <div className="border-t border-border-weak p-5 bg-canvas space-y-5 animate-in fade-in slide-in-from-top-1 duration-200">
                        {/* Dokumen */}
                        <div>
                          <p className="text-xs font-semibold text-text-muted mb-3">Dokumen Identitas</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="rounded-xl border border-border-weak overflow-hidden bg-surface">
                              <div className="px-3 py-2 bg-surface border-b border-border-weak flex items-center justify-between">
                                <span className="text-[11px] font-semibold text-text-muted">KTP</span>
                                <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded font-medium">Terverifikasi</span>
                              </div>
                              <div className="h-28 bg-gradient-to-br from-blue-900/30 to-blue-800/10 flex items-center justify-center relative">
                                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                  <div className="w-full h-full border-4 border-blue-400 rounded-none" />
                                </div>
                                <div className="text-center">
                                  <p className="text-[9px] font-bold text-blue-300 tracking-widest">REPUBLIK INDONESIA</p>
                                  <p className="text-[8px] text-blue-200/70 mt-0.5">KTP ELEKTRONIK</p>
                                  <p className="text-xs font-bold text-blue-100 mt-2">{res.name}</p>
                                  <p className="text-[9px] text-blue-200/80 font-mono mt-0.5">{dummyExtra?.nik}</p>
                                </div>
                              </div>
                            </div>
                            <div className="rounded-xl border border-border-weak overflow-hidden bg-surface">
                              <div className="px-3 py-2 bg-surface border-b border-border-weak flex items-center justify-between">
                                <span className="text-[11px] font-semibold text-text-muted">Kartu Keluarga</span>
                                <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded font-medium">Terverifikasi</span>
                              </div>
                              <div className="h-28 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                <div className="text-center">
                                  <p className="text-[9px] font-bold text-primary/80 tracking-widest">KARTU KELUARGA</p>
                                  <p className="text-[8px] text-text-muted mt-0.5">No. KK</p>
                                  <p className="text-[11px] font-mono text-text-main mt-1">{dummyExtra?.kk}</p>
                                  <p className="text-[9px] text-text-muted mt-1">Kepala Keluarga: {res.name}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Data diri */}
                        <div>
                          <p className="text-xs font-semibold text-text-muted mb-3">Data Diri</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                              ["Nama Lengkap", res.name],
                              ["NIK", dummyExtra?.nik],
                              ["Nomor HP / WhatsApp", dummyExtra?.phone],
                              ["Email", dummyExtra?.email],
                              ["Agama", dummyExtra?.agama],
                              ["Status Perkawinan", dummyExtra?.status],
                              ["Pekerjaan", dummyExtra?.pekerjaan],
                              ["Alamat", res.address],
                            ].map(([label, val]) => (
                              <div key={label} className={label === "Alamat" ? "sm:col-span-2" : ""}>
                                <label className="block text-[11px] font-medium text-text-muted mb-1">{label}</label>
                                <input
                                  type="text"
                                  defaultValue={val as string}
                                  className="w-full bg-surface border border-border-strong rounded-lg p-2.5 text-sm text-text-main focus:outline-none focus:border-primary"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-1">
                          <button onClick={() => setEditingId(null)} className="px-4 py-2 text-xs font-semibold text-text-muted border border-border-weak rounded-lg hover:bg-surface-hover cursor-pointer">Batal</button>
                          <button className="px-4 py-2 text-xs font-semibold bg-primary text-text-inverse rounded-lg hover:bg-primary/90 cursor-pointer">Simpan Perubahan</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Pendaftaran Warga Section ───────────────────────────────────────────────
function PendaftaranWargaSection({ ocrScanning, ocrResult, simulateOCR, handleValidate }: {
  ocrScanning: boolean; ocrResult: any; simulateOCR: () => void; handleValidate: () => void;
}) {
  const [pendingWarga, setPendingWarga] = useState([
    {
      id: "REG-001",
      nik: "3273110203900012",
      name: "Andi Kurniawan",
      phone: "0812-8877-6655",
      dob: "02-03-1990",
      address: "Jl. Melati No. 7, RT 05 / RW 12",
      submittedAt: "26 Jun 2026, 09:14",
      status: "pending" as const,
      ktpPreview: "ktp-andi",
    },
    {
      id: "REG-002",
      nik: "3273114506950047",
      name: "Rina Septiani",
      phone: "0821-4455-3322",
      dob: "05-06-1995",
      address: "Jl. Kenanga Blok C No. 14, RT 05 / RW 12",
      submittedAt: "25 Jun 2026, 14:37",
      status: "pending" as const,
      ktpPreview: "ktp-rina",
    },
    {
      id: "REG-003",
      nik: "3273111201880003",
      name: "Hendro Prabowo",
      phone: "0857-6677-8899",
      dob: "12-01-1988",
      address: "Jl. Merdeka No. 22, RT 05 / RW 12",
      submittedAt: "24 Jun 2026, 16:55",
      status: "pending" as const,
      ktpPreview: "ktp-hendro",
    },
  ]);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    setPendingWarga(prev => prev.filter(w => w.id !== id));
  };

  const handleReject = (id: string) => {
    setPendingWarga(prev => prev.filter(w => w.id !== id));
  };

  const ktpColors: Record<string, string> = {
    "ktp-andi":  "from-blue-900/40 to-indigo-900/20",
    "ktp-rina":  "from-violet-900/40 to-purple-900/20",
    "ktp-hendro":"from-teal-900/40 to-cyan-900/20",
  };

  return (
    <div className="space-y-6">
      {/* ── Pending self-registration verifications ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-text-main">Menunggu Verifikasi Ketua RT</h3>
            <p className="text-xs text-text-muted mt-0.5">Warga yang mendaftar mandiri via aplikasi — data sudah lengkap dari OCR KTP.</p>
          </div>
          {pendingWarga.length > 0 && (
            <span className="text-xs font-bold bg-accent/15 text-accent px-3 py-1 rounded-full border border-accent/20">{pendingWarga.length} Menunggu</span>
          )}
        </div>

        {pendingWarga.length === 0 ? (
          <div className="bg-surface border border-border-weak rounded-xl p-8 text-center">
            <CheckCircle2 size={32} className="text-primary mx-auto mb-2" />
            <p className="text-sm font-semibold text-text-main">Semua pendaftaran telah diverifikasi</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingWarga.map(w => {
              const isExpanded = expandedId === w.id;
              return (
                <div key={w.id} className="bg-surface border border-border-weak rounded-xl overflow-hidden">
                  <div className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0 font-bold text-sm">
                      {w.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-text-main">{w.name}</p>
                      <p className="text-xs text-text-muted font-mono">{w.nik} · {w.phone}</p>
                      <p className="text-[11px] text-text-muted mt-0.5">{w.submittedAt}</p>
                    </div>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : w.id)}
                      className="flex items-center gap-1.5 bg-primary text-text-inverse text-xs font-semibold px-4 py-2 rounded-lg hover:bg-primary/80 transition cursor-pointer shrink-0"
                    >
                      Tinjau
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-border-weak p-5 bg-canvas space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* KTP Preview */}
                        <div className="rounded-xl border border-border-weak overflow-hidden">
                          <div className="px-3 py-2 bg-surface border-b border-border-weak text-[11px] font-semibold text-text-muted flex items-center justify-between">
                            KTP Elektronik (Foto dari Aplikasi)
                            <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded font-medium">Belum Verifikasi</span>
                          </div>
                          <div className={cn("h-32 bg-gradient-to-br flex flex-col items-center justify-center gap-1 p-3", ktpColors[w.ktpPreview] || "from-blue-900/30 to-blue-800/10")}>
                            <p className="text-[9px] font-bold tracking-widest text-blue-200/90">REPUBLIK INDONESIA</p>
                            <p className="text-[8px] text-blue-200/60">KTP ELEKTRONIK</p>
                            <div className="mt-1 border border-white/10 rounded px-3 py-1.5 bg-black/20 text-center">
                              <p className="text-[10px] font-bold text-white">{w.name}</p>
                              <p className="text-[9px] font-mono text-white/80 mt-0.5">{w.nik}</p>
                              <p className="text-[8px] text-white/60 mt-0.5">{w.dob}</p>
                            </div>
                          </div>
                        </div>

                        {/* Data fields */}
                        <div className="space-y-3">
                          {[["NIK", w.nik], ["Nama Lengkap", w.name], ["Nomor HP", w.phone], ["Tanggal Lahir", w.dob], ["Alamat", w.address]].map(([label, val]) => (
                            <div key={label}>
                              <label className="block text-[11px] font-medium text-text-muted mb-0.5">{label}</label>
                              <input
                                type="text"
                                defaultValue={val}
                                className="w-full bg-surface border border-border-strong rounded-lg px-3 py-2 text-xs text-text-main focus:outline-none focus:border-primary"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-1">
                        <button
                          onClick={() => handleReject(w.id)}
                          className="flex-1 py-2.5 text-xs font-semibold text-accent border border-accent/30 rounded-xl hover:bg-accent/10 transition cursor-pointer"
                        >
                          <X size={13} className="inline mr-1" />Tolak Pendaftaran
                        </button>
                        <button
                          onClick={() => handleApprove(w.id)}
                          className="flex-[2] py-2.5 text-xs font-semibold bg-primary text-text-inverse rounded-xl hover:bg-primary/80 transition cursor-pointer"
                        >
                          <Check size={13} className="inline mr-1" />Setujui & Tambahkan ke Data Warga
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Manual walk-in KTP/KK scan ── */}
      <div>
        <div className="mb-4">
          <h3 className="font-semibold text-text-main">Daftarkan Warga Manual (Walk-in)</h3>
          <p className="text-xs text-text-muted mt-0.5">Untuk warga yang datang langsung ke kantor RT — scan KTP / KK dan AI akan mengekstrak datanya.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-surface border-2 border-dashed border-border-strong rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-surface-hover transition-colors">
            <div className="w-14 h-14 bg-primary/15 text-primary rounded-full flex items-center justify-center mb-3">
              {ocrScanning ? <Camera size={26} className="animate-pulse" /> : <Upload size={26} />}
            </div>
            <p className="font-semibold text-text-main text-sm mb-1">Unggah KTP / KK Warga</p>
            <p className="text-xs text-text-muted mb-5 max-w-[180px]">Format JPG/PNG maks 5MB. AI akan mengekstrak data otomatis.</p>
            <button
              onClick={simulateOCR}
              disabled={ocrScanning}
              className={cn("px-5 py-2.5 rounded-full font-semibold text-sm transition-colors", ocrScanning ? "bg-surface text-text-muted cursor-not-allowed" : "bg-primary text-text-inverse hover:bg-primary/80 cursor-pointer")}
            >
              {ocrScanning ? "Memindai dengan AI..." : "Pilih File Dokumen"}
            </button>
          </div>

          <div className="bg-surface p-5 rounded-xl border border-border-weak">
            <h4 className="font-semibold text-text-main text-sm mb-4 flex items-center gap-2"><User size={18} className="text-primary" />Data Hasil Ekstraksi</h4>
            {!ocrResult && !ocrScanning && (
              <div className="h-44 flex items-center justify-center text-xs text-text-muted text-center border-2 border-dashed border-border-weak rounded-xl leading-relaxed">
                Belum ada data.<br />Unggah dokumen untuk memulai scan OCR.
              </div>
            )}
            {ocrScanning && (
              <div className="h-44 flex flex-col items-center justify-center gap-3 text-xs text-text-muted border-2 border-dashed border-border-weak rounded-xl">
                <div className="w-7 h-7 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                Sedang mengekstrak data...
              </div>
            )}
            {ocrResult && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                <div className="grid grid-cols-2 gap-2">
                  {[["NIK", ocrResult.nik], ["Nama Lengkap", ocrResult.name], ["Tempat, Tgl Lahir", `${ocrResult.tempatLahir}, ${ocrResult.tanggalLahir}`], ["RT/RW", `${ocrResult.rt} / ${ocrResult.rw}`]].map(([label, val]) => (
                    <div key={label as string}>
                      <label className="block text-[11px] font-medium text-text-muted mb-0.5">{label}</label>
                      <input type="text" defaultValue={val as string} className="w-full bg-canvas border border-border-strong rounded-lg px-2.5 py-2 text-xs text-text-main focus:outline-none focus:border-primary" />
                    </div>
                  ))}
                  <div className="col-span-2">
                    <label className="block text-[11px] font-medium text-text-muted mb-0.5">Alamat</label>
                    <input type="text" defaultValue={ocrResult.alamat} className="w-full bg-canvas border border-border-strong rounded-lg px-2.5 py-2 text-xs text-text-main focus:outline-none focus:border-primary" />
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 p-2.5 rounded-lg text-xs text-primary"><CheckCircle2 size={13} />Data diekstrak 98% keyakinan. Periksa sebelum menyimpan.</div>
                <button onClick={handleValidate} className="w-full bg-primary text-text-inverse font-semibold py-2.5 rounded-lg hover:bg-primary/80 transition-colors cursor-pointer text-sm">Validasi & Simpan Warga</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminFinanceTab() {
  const [ledger, setLedger] = useState<any>({ summary: [], details: [], history: [] });
  const [residents, setResidents] = useState<any[]>([]);
  const [subSection, setSubSection] = useState<"ledgers" | "dues">("dues");
  const [selectedResidentId, setSelectedResidentId] = useState<string | null>(null);
  const transactions = ledger?.details || [];

  // Manual transaction form states
  const [showAdd, setShowAdd] = useState(false);
  const [type, setType] = useState("in");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState<string | null>(null);

  // Reminder form states
  const [customReminders, setCustomReminders] = useState<{ [key: string]: string }>({});

  // Dues verification UX states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "unpaid" | "paid">("all");
  const [receiptModal, setReceiptModal] = useState<{ image: string; resName: string; resId: string; due: any } | null>(null);

  const fetchFinanceAndResidents = () => {
    fetch('/api/finance').then(r => r.json()).then(setLedger).catch(() => {});
    fetch('/api/admin/residents').then(r => r.json()).then(setResidents).catch(() => {});
  };

  useEffect(() => {
    fetchFinanceAndResidents();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveManualTransaction = async () => {
    if (!amount || !desc) return alert("Nominal dan keterangan wajib diisi!");
    if (!image) return alert("Bukti transaksi (resi/kwitansi) wajib disertakan!");
    
    try {
      const res = await fetch("/api/admin/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, amount, desc, image })
      });
      const data = await res.json();
      if (data.success) {
        alert("Transaksi manual berhasil dicatat!");
        setShowAdd(false);
        setAmount("");
        setDesc("");
        setImage(null);
        fetchFinanceAndResidents();
      }
    } catch {
      alert("Gagal mencatat transaksi.");
    }
  };

  const handleApprovePayment = async (residentId: string, dueId: string) => {
    try {
      const res = await fetch(`/api/admin/residents/${residentId}/due/${dueId}/approve`, {
        method: "PUT"
      });
      if (res.ok) {
        alert("Pembayaran terverifikasi dan terekam di Buku Kas!");
        fetchFinanceAndResidents();
      }
    } catch {
      alert("Gagal menyetujui.");
    }
  };

  const handleRejectPayment = async (residentId: string, dueId: string) => {
    if (!confirm("Apakah Anda yakin ingin menolak resi bukti pembayaran ini?")) return;
    try {
      const res = await fetch(`/api/admin/residents/${residentId}/due/${dueId}/reject`, {
        method: "PUT"
      });
      if (res.ok) {
        alert("Bukti pembayaran ditolak. Status dikembalikan ke Belum Terbayar.");
        fetchFinanceAndResidents();
      }
    } catch {
      alert("Gagal menolak.");
    }
  };

  const handleSendReminder = async (residentId: string) => {
    const msg = customReminders[residentId] || "Pemberitahuan dari RT: Harap segera melunasi tunggakan iuran bulanan Anda.";
    try {
      const res = await fetch(`/api/admin/residents/${residentId}/reminder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg })
      });
      if (res.ok) {
        alert("Pemberitahuan resmi pengingat tagihan berhasil dikirim ke akun warga!");
        setCustomReminders({ ...customReminders, [residentId]: "" });
        fetchFinanceAndResidents();
      }
    } catch {
      alert("Gagal mengirim pengingat.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text-main">Kelola Kas & Iuran Warga</h2>
          <p className="text-sm text-text-muted mt-1">Otorisasi bukti transfer iuran warga, atur pengingat bulanan, dan catat pembukuan keuangan.</p>
        </div>

        <div className="flex bg-surface rounded-xl p-1 border border-border-weak shrink-0">
          <button 
            onClick={() => setSubSection("dues")}
            className={cn(
              "px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer",
              subSection === "dues" ? "bg-primary text-text-inverse shadow-sm" : "text-text-muted hover:text-text-main"
            )}
          >
            Verifikasi Iuran Warga
          </button>
          <button 
            onClick={() => setSubSection("ledgers")}
            className={cn(
              "px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer",
              subSection === "ledgers" ? "bg-primary text-text-inverse shadow-sm" : "text-text-muted hover:text-text-main"
            )}
          >
            Kas & Pengeluaran
          </button>
        </div>
      </div>

      {subSection === "dues" ? (
        (() => {
          // ── Derived data ──
          const pendingQueue = residents.flatMap((r: any) =>
            (r.dues || []).filter((d: any) => d.status === "pending").map((d: any) => ({ res: r, due: d }))
          );
          const currentDues = residents.map((r: any) => r.dues?.[r.dues.length - 1]).filter(Boolean);
          const paidNow = currentDues.filter((d: any) => d.status === "paid").length;
          const unpaidNow = currentDues.filter((d: any) => d.status === "unpaid").length;
          const collected = residents
            .flatMap((r: any) => r.dues || [])
            .filter((d: any) => d.status === "paid")
            .reduce((s: number, d: any) => s + (d.amount || 0), 0);

          const rank = (r: any) =>
            r.dues?.some((d: any) => d.status === "pending") ? 0 :
            r.dues?.some((d: any) => d.status === "unpaid") ? 1 : 2;

          const filtered = residents
            .filter((r: any) => !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.address.toLowerCase().includes(search.toLowerCase()))
            .filter((r: any) => {
              if (statusFilter === "all") return true;
              if (statusFilter === "pending") return r.dues?.some((d: any) => d.status === "pending");
              if (statusFilter === "unpaid") return r.dues?.some((d: any) => d.status === "unpaid");
              return r.dues?.every((d: any) => d.status === "paid");
            })
            .sort((a: any, b: any) => rank(a) - rank(b));

          const stats = [
            { icon: Receipt, label: "Perlu Verifikasi", value: pendingQueue.length, tint: "text-accent bg-accent/10", border: pendingQueue.length > 0 ? "border-accent/30" : "border-border-weak" },
            { icon: CheckCircle2, label: "Lunas Bulan Ini", value: `${paidNow}/${currentDues.length}`, tint: "text-primary bg-primary/10", border: "border-border-weak" },
            { icon: AlertTriangle, label: "Belum Bayar", value: unpaidNow, tint: "text-red-400 bg-red-500/10", border: "border-border-weak" },
            { icon: Wallet, label: "Total Terkumpul", value: rpShort(collected), tint: "text-emerald-400 bg-emerald-400/10", border: "border-border-weak" },
          ];

          return (
            <div className="space-y-5 font-sans text-text-main">
              {/* ── Stat summary ── */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {stats.map(s => (
                  <div key={s.label} className={cn("bg-surface border rounded-xl p-4", s.border)}>
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-3", s.tint)}><s.icon size={16} /></div>
                    <p className="text-xl font-display font-bold text-text-main leading-tight">{s.value}</p>
                    <p className="text-[11px] text-text-muted mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* ── Priority verification queue ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-semibold text-text-main">Antrean Verifikasi Resi</h3>
                  {pendingQueue.length > 0 && <span className="text-[10px] font-bold bg-accent/15 text-accent px-2 py-0.5 rounded-full border border-accent/25">{pendingQueue.length} menunggu</span>}
                </div>

                {pendingQueue.length === 0 ? (
                  <div className="bg-surface border border-border-weak rounded-2xl p-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3"><CheckCircle2 size={24} /></div>
                    <p className="text-sm font-semibold text-text-main">Semua bukti transfer sudah terverifikasi</p>
                    <p className="text-xs text-text-muted mt-1">Tidak ada resi yang menunggu persetujuan Anda saat ini.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pendingQueue.map(({ res, due }: any) => (
                      <div key={due.id} className="bg-surface border border-accent/30 rounded-2xl overflow-hidden">
                        <div className="p-4 flex items-start gap-3">
                          {/* Receipt thumbnail */}
                          {due.proof?.image ? (
                            <button onClick={() => setReceiptModal({ image: due.proof.image, resName: res.name, resId: res.id, due })} className="relative shrink-0 group cursor-pointer">
                              <img src={due.proof.image} alt="Resi" className="w-20 h-20 rounded-lg object-cover border border-border-weak" />
                              <span className="absolute inset-0 rounded-lg bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ZoomIn size={18} className="text-white" />
                              </span>
                            </button>
                          ) : (
                            <div className="w-20 h-20 rounded-lg bg-canvas border border-border-weak flex items-center justify-center shrink-0"><Receipt size={20} className="text-text-muted" /></div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-sm text-text-main truncate">{res.name}</p>
                            </div>
                            <p className="text-[11px] text-text-muted">{due.month}</p>
                            <div className="mt-1.5 space-y-0.5 text-[11px] text-text-main">
                              <p className="flex items-center justify-between gap-2"><span className="text-text-muted">Nominal</span><span className="font-bold">Rp {(due.proof?.amount ?? due.amount).toLocaleString("id-ID")}</span></p>
                              <p className="flex items-center justify-between gap-2"><span className="text-text-muted">Bank</span><span className="font-mono">{due.proof?.bank || "—"}</span></p>
                              <p className="flex items-center justify-between gap-2"><span className="text-text-muted">Tanggal</span><span>{due.proof?.date || "—"}</span></p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 p-3 pt-0">
                          <button onClick={() => handleApprovePayment(res.id, due.id)} className="flex-1 bg-primary text-text-inverse py-2 rounded-lg text-xs font-bold hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                            <Check size={14} /> Setujui
                          </button>
                          <button onClick={() => handleRejectPayment(res.id, due.id)} className="bg-accent/10 border border-accent/25 text-accent hover:bg-accent/20 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
                            <X size={14} /> Tolak
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Resident directory ── */}
              <div>
                <div className="flex items-center justify-between mb-3 gap-3">
                  <h3 className="text-sm font-semibold text-text-main shrink-0">Direktori Warga</h3>
                  <div className="flex gap-2 flex-1 justify-end">
                    <div className="relative flex-1 max-w-[220px]">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama / alamat..." className="w-full pl-9 pr-3 py-2 text-xs bg-surface border border-border-weak rounded-lg outline-none focus:border-primary text-text-main" />
                    </div>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="px-3 py-2 text-xs bg-surface border border-border-weak rounded-lg outline-none cursor-pointer text-text-main">
                      <option value="all">Semua Status</option>
                      <option value="pending">Perlu Verifikasi</option>
                      <option value="unpaid">Belum Bayar</option>
                      <option value="paid">Lunas</option>
                    </select>
                  </div>
                </div>

                {filtered.length === 0 ? (
                  <div className="bg-surface border border-border-weak rounded-2xl p-8 text-center">
                    <Inbox size={28} className="text-text-muted mx-auto mb-2" />
                    <p className="text-sm text-text-muted">Tidak ada warga yang cocok dengan filter.</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {filtered.map((res: any) => {
                      const hasPending = res.dues?.some((d: any) => d.status === "pending");
                      const hasUnpaid = res.dues?.some((d: any) => d.status === "unpaid");
                      const open = selectedResidentId === res.id;
                      return (
                        <div key={res.id} className={cn("bg-surface border rounded-2xl overflow-hidden transition-all", open ? "border-border-strong" : hasPending ? "border-accent/30" : "border-border-weak hover:border-border-strong")}>
                          {/* Collapsed header */}
                          <div onClick={() => setSelectedResidentId(open ? null : res.id)} className="p-4 flex items-center justify-between cursor-pointer gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0"><User size={19} /></div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-text-main text-sm truncate">{res.name}</h4>
                                  {hasPending && <span className="bg-accent text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0">Verifikasi</span>}
                                </div>
                                <p className="text-[11px] text-text-muted truncate">{res.address}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className={cn("hidden sm:inline-flex text-[10px] font-bold px-2.5 py-1 rounded-lg border",
                                hasPending ? "bg-accent/10 text-accent border-accent/25" :
                                hasUnpaid ? "bg-red-500/10 text-red-400 border-red-500/25" :
                                "bg-primary/10 text-primary border-primary/25"
                              )}>
                                {hasPending ? "Menunggu Verifikasi" : hasUnpaid ? "Ada Tunggakan" : "Lunas"}
                              </span>
                              {open ? <ChevronUp size={18} className="text-text-muted" /> : <ChevronDown size={18} className="text-text-muted" />}
                            </div>
                          </div>

                          {/* Expanded */}
                          {open && (
                            <div className="px-4 pb-5 pt-1 border-t border-border-weak bg-canvas/40 space-y-5 animate-in slide-in-from-top-2 duration-200">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                {/* Contact */}
                                <div className="space-y-2.5 p-4 bg-surface rounded-xl border border-border-weak text-xs">
                                  <h5 className="font-semibold text-text-main text-xs flex items-center gap-2"><span className="w-1.5 h-3 bg-primary rounded-full" />Kontak & Kependudukan</h5>
                                  <div><span className="text-text-muted">Kepala Keluarga</span><p className="font-semibold text-sm text-text-main">{res.name}</p></div>
                                  <div><span className="text-text-muted">Alamat</span><p className="font-semibold text-text-main">{res.address}</p></div>
                                  <div><span className="text-text-muted">Telp / WA</span><p className="font-semibold font-mono text-text-main">{res.phone}</p></div>
                                  <a href={`https://wa.me/${res.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1 font-bold pt-1"><PhoneCall size={12} /> Hubungi via WhatsApp &rarr;</a>
                                </div>

                                {/* Reminder */}
                                <div className="space-y-2.5 p-4 bg-surface rounded-xl border border-border-weak text-xs">
                                  <h5 className="font-semibold text-text-main text-xs flex items-center gap-2"><span className="w-1.5 h-3 bg-accent rounded-full" />Kirim Pengingat Iuran</h5>
                                  <p className="text-text-muted leading-relaxed">Notifikasi akan langsung muncul di dashboard warga terkait.</p>
                                  <div className="flex gap-2">
                                    <input type="text" value={customReminders[res.id] || ""} onChange={e => setCustomReminders({ ...customReminders, [res.id]: e.target.value })} placeholder="Pesan pengingat (opsional)..." className="flex-1 bg-canvas border border-border-strong rounded-lg p-2.5 text-xs text-text-main focus:outline-none focus:border-accent" />
                                    <button onClick={() => handleSendReminder(res.id)} className="bg-accent text-white px-3.5 py-2 text-xs font-bold rounded-lg hover:bg-accent/90 active:scale-[0.98] transition-all shrink-0 cursor-pointer flex items-center gap-1.5"><Bell size={13} /> Kirim</button>
                                  </div>
                                  {res.reminders && res.reminders.length > 0 && (
                                    <p className="text-[10px] text-accent font-medium flex items-start gap-1 mt-1"><Bell size={11} className="mt-0.5 shrink-0" /> Terkirim: "{res.reminders[0].message}" ({res.reminders[0].date})</p>
                                  )}
                                </div>
                              </div>

                              {/* Dues history */}
                              <div className="space-y-2.5">
                                <h5 className="font-semibold text-text-main text-xs">Riwayat Tagihan Bulanan</h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {res.dues.map((due: any) => (
                                    <div key={due.id} className="bg-surface border border-border-weak p-4 rounded-xl space-y-3">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h6 className="font-semibold text-text-main text-sm">{due.month}</h6>
                                          <p className="text-xs text-text-muted">Rp {due.amount.toLocaleString("id-ID")}</p>
                                        </div>
                                        <span className={cn("text-[9px] uppercase tracking-wide px-2 py-1 rounded font-bold",
                                          due.status === "paid" ? "bg-primary/15 text-primary" : due.status === "pending" ? "bg-accent/20 text-accent" : "bg-red-500/15 text-red-400"
                                        )}>
                                          {due.status === "paid" ? "Lunas" : due.status === "pending" ? "Menunggu" : "Belum Bayar"}
                                        </span>
                                      </div>
                                      {due.status === "pending" && due.proof && (
                                        <div className="flex items-center gap-2 pt-2 border-t border-border-weak">
                                          {due.proof.image && (
                                            <button onClick={() => setReceiptModal({ image: due.proof.image, resName: res.name, resId: res.id, due })} className="shrink-0 relative group">
                                              <img src={due.proof.image} alt="Resi" className="w-12 h-12 rounded-lg object-cover border border-border-weak" />
                                              <span className="absolute inset-0 rounded-lg bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><ZoomIn size={14} className="text-white" /></span>
                                            </button>
                                          )}
                                          <div className="flex gap-1.5 flex-1">
                                            <button onClick={() => handleApprovePayment(res.id, due.id)} className="flex-1 bg-primary text-text-inverse py-2 rounded-lg text-[11px] font-bold hover:bg-primary/90 transition flex items-center justify-center gap-1 cursor-pointer"><Check size={12} /> Setujui</button>
                                            <button onClick={() => handleRejectPayment(res.id, due.id)} className="bg-accent/10 border border-accent/25 text-accent hover:bg-accent/20 px-3 py-2 rounded-lg text-[11px] font-bold transition cursor-pointer"><X size={12} /></button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── Receipt lightbox modal ── */}
              {receiptModal && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setReceiptModal(null)}>
                  <div className="bg-surface rounded-2xl border border-border-strong max-w-lg w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between p-4 border-b border-border-weak">
                      <div>
                        <p className="font-semibold text-sm text-text-main">Bukti Transfer — {receiptModal.resName}</p>
                        <p className="text-[11px] text-text-muted">{receiptModal.due.month} · Rp {(receiptModal.due.proof?.amount ?? receiptModal.due.amount).toLocaleString("id-ID")} · {receiptModal.due.proof?.bank}</p>
                      </div>
                      <button onClick={() => setReceiptModal(null)} className="text-text-muted hover:text-text-main cursor-pointer"><X size={20} /></button>
                    </div>
                    <div className="bg-canvas max-h-[60vh] overflow-auto flex items-center justify-center p-4">
                      <img src={receiptModal.image} alt="Bukti transfer" className="max-w-full h-auto rounded-lg" />
                    </div>
                    <div className="flex gap-2 p-4 border-t border-border-weak">
                      <button onClick={() => { handleApprovePayment(receiptModal.resId, receiptModal.due.id); setReceiptModal(null); }} className="flex-1 bg-primary text-text-inverse py-2.5 rounded-lg text-xs font-bold hover:bg-primary/90 transition flex items-center justify-center gap-1.5 cursor-pointer"><Check size={14} /> Setujui & Rekam Buku Kas</button>
                      <button onClick={() => { handleRejectPayment(receiptModal.resId, receiptModal.due.id); setReceiptModal(null); }} className="bg-accent/10 border border-accent/25 text-accent hover:bg-accent/20 px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"><X size={14} /> Tolak Bukti</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()
      ) : (
        <div className="space-y-6">
          {/* Pie chart — spending breakdown */}
          {ledger.summary?.length > 0 && (() => {
            const pieData = ledger.summary.filter((s: any) => s.value > 0 && s.label !== "Saldo");
            const total = pieData.reduce((sum: number, s: any) => sum + s.value, 0);
            return (
              <div className="bg-surface border border-border-weak rounded-xl p-5">
                <h3 className="font-semibold text-text-main mb-4">Grafik Penggunaan Dana</h3>
                <div className="h-[260px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                        {pieData.map((entry: any, i: number) => (
                          <Cell key={i} fill={entry.color || ["#4ade80","#f97316","#60a5fa","#a78bfa"][i % 4]} stroke="var(--border-strong)" strokeWidth={2} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(v: number) => [`Rp ${v.toLocaleString("id-ID")}`, ""]} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 text-center pointer-events-none">
                    <p className="text-[10px] text-text-muted">Total</p>
                    <p className="text-base font-bold text-text-main">Rp {(total / 1000).toFixed(0)}k</p>
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="flex justify-between items-center bg-surface border border-border-weak p-5 rounded-xl">
            <div>
              <h3 className="font-bold text-text-main text-base">Pembukuan Transaksi Manual</h3>
              <p className="text-xs text-text-muted mt-0.5">Catat kas masuk donasi operasional non-iuran bulanan reguler.</p>
            </div>
            <button 
              onClick={() => setShowAdd(!showAdd)}
              className={cn("bg-primary text-text-inverse px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-primary/95 transition-colors cursor-pointer", showAdd && "bg-accent")}
            >
              {showAdd ? <X size={16} /> : <Plus size={16} />} {showAdd ? "Batal" : "Tambah Ledger Baru"}
            </button>
          </div>

          {showAdd && (
            <div className="bg-surface p-6 rounded-xl border border-border-weak space-y-4 animate-in fade-in slide-in-from-top-4 font-sans">
              <h3 className="font-bold text-text-main text-base mb-2">Transaksi Baru</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-2">Jenis Saldo</label>
                  <select 
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-xs text-text-main outline-none focus:border-primary font-bold animate-pulse"
                  >
                    <option value="in">Pemasukan Kas (Sumbangan Warga/Lainnya)</option>
                    <option value="out">Operasional Keluar (Pembayaran Sampah/Keamanan/Dll)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-2 font-mono">Nominal (Rp)</label>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="Contoh: 150000" 
                    className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-xs outline-none focus:border-primary text-text-main font-mono" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-2">Keterangan Catatan</label>
                <input 
                  type="text" 
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="Detail transaksi..." 
                  className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-xs outline-none focus:border-primary text-text-main font-medium" 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-2">Upload Nota Fisik / Resi Bukti Bayar</label>
                <div className="mt-1 flex justify-center px-4 py-8 border-2 border-border-strong border-dashed rounded-xl bg-canvas hover:bg-surface-hover transition-colors overflow-hidden">
                  <div className="space-y-1 text-center font-sans">
                    {!image ? (
                      <>
                        <Camera className="mx-auto h-8 w-8 text-text-muted animate-pulse mb-1" />
                        <div className="flex text-xs text-text-muted mt-2">
                          <label className="relative cursor-pointer bg-transparent rounded-md font-bold text-primary hover:text-primary/100">
                            <span>Sematkan Bukti Foto</span>
                            <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                          </label>
                        </div>
                      </>
                    ) : (
                      <div className="relative inline-block">
                        <img src={image} alt="Receipt Preview" className="h-28 w-auto rounded-lg shadow-sm border border-border-weak text-text-main" />
                        <button 
                          type="button" 
                          onClick={() => setImage(null)}
                          className="absolute -top-2 -right-2 bg-accent text-white p-1 rounded-full shadow-md"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border-weak flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setShowAdd(false)} 
                  className="px-5 py-2 text-xs text-text-muted hover:text-text-main font-medium"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSaveManualTransaction}
                  className="bg-primary text-text-inverse px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/10 cursor-pointer"
                >
                  Simpan Transaksi Kas
                </button>
              </div>
            </div>
          )}

      <div className="bg-surface rounded-2xl border border-border-weak overflow-hidden">
         <div className="divide-y divide-border-weak">
            {transactions.map(t => {
              const isIncoming = t.type === 'in' || t.id?.startsWith('INC') || t.category === 'Pemasukan';
              const amtNum = Number(t.amount) || 0;
              return (
                <div key={t.id} className="p-4 flex items-center justify-between hover:bg-surface-hover transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn("p-2 rounded-full", isIncoming ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent")}>
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-main text-sm">{t.desc}</h4>
                      <p className="text-xs text-text-muted">{t.date || "Hari ini"}</p>
                    </div>
                  </div>
                  <div className={cn("font-bold font-display", isIncoming ? "text-primary" : "text-accent")}>
                    {isIncoming ? "+" : "-"} Rp {amtNum.toLocaleString('id-ID')}
                  </div>
                </div>
              );
            })}
         </div>
      </div>
    </div>
  )}
</div>
  );
}

function AdminTicketsTab() {
  const [reports, setReports] = useState<any[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    fetch('/api/user/reports')
      .then(res => res.json())
      .then(data => {
        setReports(data.map((r: any) => ({ ...r, responses: [] })));
      });
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setReports(reports.map(r => r.id === id ? { ...r, status: newStatus } : r));
    await fetch(`/api/admin/complaints/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    }).catch(() => {});
  };

  const handleReply = async (id: string) => {
    if (!replyText.trim()) return;
    const newStatus = reports.find(r => r.id === id)?.status === "TERKIRIM" ? "PROSES" : undefined;
    setReports(reports.map(r => r.id === id ? {
      ...r,
      status: newStatus || r.status,
      responses: [...(r.responses || []), { text: replyText, date: "Baru saja" }]
    } : r));
    await fetch(`/api/admin/reports/${id}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: replyText, status: newStatus }),
    }).catch(() => {});
    setReplyText("");
    setReplyingTo(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-semibold text-text-main">Laporan Warga</h2>
        <p className="text-sm text-text-muted mt-1">Tindak lanjuti keluhan dan laporan dari warga.</p>
      </div>

      <div className="space-y-4">
        {reports.length === 0 && <p className="text-sm text-text-muted">Sedang memuat laporan...</p>}
        {reports.map(report => (
          <div key={report.id} className="bg-surface p-5 rounded-2xl shadow-sm border border-border-weak">
             <div className="flex flex-col md:flex-row justify-between gap-4">
               <img src={report.image || 'https://images.unsplash.com/photo-1572005085731-bf36450f612d?auto=format&fit=crop&q=80&w=400'} alt={report.title} referrerPolicy="no-referrer" className="w-full md:w-40 h-32 object-cover rounded-xl shrink-0 border border-border-weak" />
               <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                     <h3 className="font-semibold text-text-main">{report.title}</h3>
                     <span className={cn(
                       "text-[10px] uppercase font-bold px-2 py-0.5 rounded-md",
                       report.status === 'TERKIRIM' ? "bg-accent/20 text-accent" : 
                       report.status === 'PROSES' ? "bg-blue-500/20 text-blue-500" : "bg-primary/20 text-primary"
                     )}>
                       {report.status}
                     </span>
                  </div>
                  <p className="text-sm text-text-muted mb-2">Pelapor: {report.sender} • {report.date} • {report.location}</p>
                  {report.status !== 'SELESAI' && (
                    <p className="text-xs italic text-text-muted">Menunggu tindak lanjut pengurus...</p>
                  )}
               </div>
               
               <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => {
                        setReplyingTo(replyingTo === report.id ? null : report.id);
                        setReplyText("");
                    }}
                    className="px-3 py-1.5 bg-surface text-text-main border border-border-strong text-sm font-medium rounded-lg hover:bg-surface-hover transition-colors"
                  >
                    Tanggapi
                  </button>
                  {report.status === 'TERKIRIM' && (
                    <button 
                      onClick={() => handleUpdateStatus(report.id, 'PROSES')}
                      className="px-3 py-1.5 bg-blue-500/10 text-blue-500 text-sm font-medium rounded-lg hover:bg-blue-500/20 transition-colors"
                    >
                      Proses
                    </button>
                  )}
                  {(report.status === 'TERKIRIM' || report.status === 'PROSES') && (
                    <button 
                      onClick={() => handleUpdateStatus(report.id, 'SELESAI')}
                      className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      Selesai
                    </button>
                  )}
               </div>
             </div>

              {/* Responses Section */}
             {report.responses && report.responses.length > 0 && (
               <div className="mt-4 pt-4 border-t border-border-weak space-y-3">
                 <h4 className="text-xs font-medium text-text-muted mb-2">Tanggapan Pengurus:</h4>
                 {report.responses.map((resp, idx) => (
                    <div key={idx} className="bg-primary/20 px-3 py-2 rounded-lg inline-block w-full max-w-lg border border-primary/20">
                       <p className="text-sm font-medium text-text-main mb-1">{resp.text}</p>
                       <p className="text-[10px] text-text-muted">{resp.date}</p>
                    </div>
                 ))}
               </div>
             )}

             {/* Reply Input Box */}
             {replyingTo === report.id && (
               <div className="mt-4 pt-4 border-t border-border-strong flex gap-2">
                 <input 
                   type="text" 
                   value={replyText}
                   onChange={(e) => setReplyText(e.target.value)}
                   placeholder="Tulis tanggapan untuk warga..." 
                   className="flex-1 bg-canvas border border-border-strong rounded-lg p-2 text-sm text-text-main focus:outline-none focus:border-primary placeholder:text-text-muted"
                 />
                 <button 
                   onClick={() => handleReply(report.id)}
                   className="bg-primary text-text-inverse px-4 py-2 flex items-center justify-center rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                 >
                   Kirim
                 </button>
               </div>
             )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminNewsTab() {
  const [news, setNews] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Kegiatan RT");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [newsTab, setNewsTab] = useState<"umum" | "gotong_royong">("umum");
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchNews = () => {
    fetch('/api/news')
      .then(r => r.json())
      .then(setNews)
      .catch(() => {});
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleEditClick = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setSummary(item.summary || "");
    setContent(item.content);
    setImage(item.image || "");
    setShowAdd(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return alert("Judul dan isi berita wajib diisi!");
    
    // Simulating save logic
    try {
      if (editingId) {
        setNews(news.map(n => n.id === editingId ? { ...n, title, category, summary, content, image } : n));
        alert("Berita berhasil diperbarui!");
      } else {
        const res = await fetch("/api/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, category, summary, content, image })
        });
        if (res.ok) {
          alert("Berita baru berhasil diterbitkan!");
          fetchNews();
        }
      }
      setShowAdd(false);
      setEditingId(null);
      setTitle("");
      setSummary("");
      setContent("");
      setImage("");
    } catch {
      alert("Gagal menyimpan berita.");
    }
  };

  const filteredNews = news.filter(item => 
    newsTab === "gotong_royong" ? item.category === "Gotong Royong" : item.category !== "Gotong Royong"
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-surface border border-border-weak p-5 rounded-xl gap-4">
        <div>
          <h2 className="text-xl font-display font-semibold text-text-main">Kelola Berita & Gotong Royong</h2>
          <p className="text-xs text-text-muted mt-1">Terbitkan pengumuman, perbarui agenda kerja bakti warga, dan kabar RT/RW terbaru.</p>
        </div>
        <button
          onClick={() => {
            setShowAdd(!showAdd);
            if (!showAdd && !editingId) {
              setEditingId(null);
              setTitle("");
              setSummary("");
              setContent("");
              setImage("");
              setCategory(newsTab === "gotong_royong" ? "Gotong Royong" : "Kegiatan RT");
            }
          }}
          className={cn(
            "bg-primary text-text-inverse px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-primary/95 transition-colors cursor-pointer whitespace-nowrap",
            showAdd && "bg-accent"
          )}
        >
          {showAdd ? <X size={16} /> : <Plus size={16} />} {showAdd ? "Batal" : "Terbit Berita"}
        </button>
      </div>

      <div className="flex p-1 bg-canvas rounded-xl w-fit border border-border-weak">
        <button 
          onClick={() => setNewsTab("umum")}
          className={cn("px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer", newsTab === "umum" ? "bg-surface shadow-sm text-text-main" : "text-text-muted hover:text-text-main")}
        >
          Berita Umum
        </button>
        <button 
          onClick={() => setNewsTab("gotong_royong")}
          className={cn("px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer", newsTab === "gotong_royong" ? "bg-surface shadow-sm text-text-main" : "text-text-muted hover:text-text-main")}
        >
          Gotong Royong
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleCreate} className="bg-surface p-6 rounded-xl border border-border-weak space-y-4">
          <h3 className="font-bold text-text-main text-base">{editingId ? "Edit Berita" : "Buat Berita / Pengumuman Baru"}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-text-muted mb-2">Judul Berita</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Contoh: Kerja Bakti Bulangan Lingkungan"
                className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-xs text-text-main outline-none focus:border-primary font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-text-muted mb-2">Kategori</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-xs text-text-main outline-none focus:border-primary font-bold"
              >
                <option value="Pengumuman">Pengumuman RT</option>
                <option value="Kegiatan">Kegiatan Warga</option>
                <option value="Gotong Royong">Agenda Gotong Royong</option>
                <option value="Himbauan">Himbauan</option>
                <option value="Pembangunan">Pembangunan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-muted mb-2">Ringkasan Singkat (Summary)</label>
            <input
              type="text"
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="Satu kalimat ringkasan yang muncul di overview..."
              className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-xs text-text-main outline-none focus:border-primary font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-muted mb-2">Isi Berita Lengkap</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Tuliskan berita secara detil di sini..."
              rows={4}
              className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-xs text-text-main outline-none focus:border-primary font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-muted mb-2">URL Gambar Ilustrasi</label>
            <input
              type="text"
              value={image}
              onChange={e => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-xs text-text-main outline-none focus:border-primary font-medium"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-weak">
            <button
              type="button"
              onClick={() => {
                 setShowAdd(false);
                 setEditingId(null);
              }}
              className="px-5 py-2 text-xs text-text-muted hover:text-text-main font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-primary text-text-inverse px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/10 cursor-pointer"
            >
              {editingId ? "Simpan Perubahan" : "Terbitkan Berita"}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNews.map((item: any) => (
          <div key={item.id} className="bg-surface rounded-xl border border-border-weak overflow-hidden shadow-sm hover:border-border-strong transition-all flex flex-col justify-between">
            <div className="flex flex-col md:flex-row">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full md:w-36 h-32 md:h-auto object-cover shrink-0 text-text-main text-xs"
                />
              )}
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <span className="text-[10px] bg-primary/10 border border-primary/20 px-2 py-0.5 rounded text-primary font-bold uppercase font-sans mb-2 inline-block">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-text-main text-base line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-text-muted mt-2 line-clamp-2 leading-relaxed">{item.summary || item.content}</p>
                </div>
                <p className="text-[10px] text-text-muted font-mono mt-4">Tanggal: {item.date}</p>
              </div>
            </div>
            <div className="p-3 bg-canvas/30 border-t border-border-weak">
              <button 
                onClick={() => handleEditClick(item)}
                className="w-full py-1.5 text-xs font-medium border border-border-strong rounded-lg hover:bg-border-weak transition-colors cursor-pointer text-text-muted"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminMarketTab() {
  const [umkm, setUmkm] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [subTab, setSubTab] = useState<"umkm" | "ads">("umkm");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // UMKM form states
  const [owner, setOwner] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Makanan & Minuman");
  const [phone, setPhone] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");

  // Ads form states
  const [sponsor, setSponsor] = useState("");
  const [adTitle, setAdTitle] = useState("");
  const [adDesc, setAdDesc] = useState("");
  const [adImage, setAdImage] = useState("");
  const [cta, setCta] = useState("");

  const fetchData = () => {
    fetch('/api/umkm').then(r => r.json()).then(setUmkm).catch(() => {});
    fetch('/api/ads').then(r => r.json()).then(setAds).catch(() => {});
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditUMKM = (item: any) => {
    setEditingId(item.id);
    setOwner(item.owner);
    setName(item.name);
    setCategory(item.category);
    setPhone(item.phone || "");
    setDesc(item.desc || "");
    setImage(item.image || "");
    setShowAdd(true);
  };

  const handleEditAd = (item: any) => {
    setEditingId(item.id);
    setSponsor(item.sponsor);
    setAdTitle(item.title);
    setAdDesc(item.desc || "");
    setAdImage(item.image || "");
    setCta(item.cta || "");
    setShowAdd(true);
  };

  const resetUMKM = () => {
    setOwner("");
    setName("");
    setPhone("");
    setDesc("");
    setImage("");
    setCategory("Makanan & Minuman");
  };

  const resetAd = () => {
    setSponsor("");
    setAdTitle("");
    setAdDesc("");
    setAdImage("");
    setCta("");
  };

  const handleCreateUMKM = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !owner) return alert("Nama usaha dan pemilik wajib diisi!");
    
    try {
      if (editingId) {
        setUmkm(umkm.map(u => u.id === editingId ? { ...u, owner, name, category, phone, desc, image } : u));
        alert("UMKM berhasil diperbarui!");
      } else {
        const res = await fetch("/api/umkm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ owner, name, category, phone, desc, image })
        });
        if (res.ok) {
          alert("Pendaftaran UMKM Warga sukses dicatat!");
          fetchData();
        }
      }
      setShowAdd(false);
      setEditingId(null);
      resetUMKM();
    } catch {
      alert("Gagal menyimpan UMKM.");
    }
  };

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsor || !adTitle) return alert("Nama sponsor dan judul iklan wajib diisi!");
    
    try {
      if (editingId) {
        setAds(ads.map(a => a.id === editingId ? { ...a, sponsor, title: adTitle, desc: adDesc, image: adImage, cta } : a));
        alert("Iklan berhasil diperbarui!");
      } else {
        const res = await fetch("/api/ads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sponsor, title: adTitle, desc: adDesc, image: adImage, cta })
        });
        if (res.ok) {
          alert("Iklan sponsor berhasil diunggah dan aktif!");
          fetchData();
        }
      }
      setShowAdd(false);
      setEditingId(null);
      resetAd();
    } catch {
      alert("Gagal menyimpan iklan.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text-main">Kelola Pasar UMKM & Iklan Sponsor</h2>
          <p className="text-sm text-text-muted mt-1">Otorisasi produk lokal buatan warga serta promosikan iklan sponsor pendanaan kas RT.</p>
        </div>

        <div className="flex bg-surface rounded-xl p-1 border border-border-weak shrink-0">
          <button 
            onClick={() => { setSubTab("umkm"); setShowAdd(false); setEditingId(null); resetUMKM(); }}
            className={cn(
              "px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer",
              subTab === "umkm" ? "bg-primary text-text-inverse shadow-sm" : "text-text-muted hover:text-text-main"
            )}
          >
            Daftar UMKM Warga
          </button>
          <button 
            onClick={() => { setSubTab("ads"); setShowAdd(false); setEditingId(null); resetAd(); }}
            className={cn(
              "px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer",
              subTab === "ads" ? "bg-primary text-text-inverse shadow-sm" : "text-text-muted hover:text-text-main"
            )}
          >
            Iklan Sponsor
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center bg-surface border border-border-weak p-5 rounded-xl">
        <div>
          <h3 className="font-bold text-text-main text-base">{subTab === "umkm" ? "UMKM Lokal Warga" : "Slide Iklan Sponsor"}</h3>
          <p className="text-xs text-text-muted mt-0.5">
            {subTab === "umkm" ? "Katalog komoditas produk dagangan buatan rumah tangga warga kompleks." : "Spanduk komersial digital sponsor pengisi sela pendanaan kas rukun warga."}
          </p>
        </div>
        <button 
          onClick={() => {
            setShowAdd(!showAdd);
            if (!showAdd && !editingId) {
               setEditingId(null);
               if (subTab === "umkm") resetUMKM();
               else resetAd();
            }
          }}
          className={cn("bg-primary text-text-inverse px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-primary/95 transition-colors cursor-pointer whitespace-nowrap", showAdd && "bg-accent")}
        >
          {showAdd ? <X size={16} /> : <Plus size={16} />} {showAdd ? "Batal" : "Tambah Baru"}
        </button>
      </div>

      {showAdd && subTab === "umkm" && (
        <form onSubmit={handleCreateUMKM} className="bg-surface p-6 rounded-xl border border-border-weak space-y-4">
          <h3 className="font-bold text-text-main text-base">{editingId ? "Edit Toko / Lapak" : "Daftarkan Toko / Lapak Baru"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-text-muted mb-2 font-semibold">Nama Pemilik (Warga)</label>
              <input
                type="text"
                value={owner}
                onChange={e => setOwner(e.target.value)}
                placeholder="Contoh: Ibu Linda RT 02"
                className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-xs text-text-main outline-none focus:border-primary font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-text-muted mb-2 font-semibold">Nama Toko & Jasa</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Contoh: Katering Rasa Sayang"
                className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-xs text-text-main outline-none focus:border-primary font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-text-muted mb-2 font-semibold">Kategori Bidang</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-xs text-text-main outline-none focus:border-primary font-bold"
              >
                <option value="Makanan & Minuman">Makanan & Minuman</option>
                <option value="Jasa Rumah Tangga">Jasa Rumah Tangga</option>
                <option value="Kerajinan Tangan">Kerajinan & Seni</option>
                <option value="Kebutuhan Pokok">Sembako / Toko Kelontong</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-text-muted mb-2 font-semibold">Nomor Telepon Pemesanan</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Contoh: 0812345678"
                className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-xs text-text-main outline-none focus:border-primary font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-muted mb-2 font-semibold">Deskripsi Layanan & Produk</label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Jelaskan menu andalan atau jenis jasa penawaran khusus Anda..."
              rows={3}
              className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-xs text-text-main outline-none focus:border-primary font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-muted mb-2 font-semibold">Poster / Foto Banner Kedai (URL)</label>
            <input
              type="text"
              value={image}
              onChange={e => setImage(e.target.value)}
              placeholder="https://..."
              className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-xs text-text-main outline-none focus:border-primary font-medium"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-weak">
            <button
              type="button"
              onClick={() => {
                 setShowAdd(false);
                 setEditingId(null);
                 resetUMKM();
              }}
              className="px-5 py-2 text-xs text-text-muted hover:text-text-main font-medium cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-primary text-text-inverse px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/10 cursor-pointer"
            >
              {editingId ? "Simpan Perubahan" : "Simpan UMKM Warga"}
            </button>
          </div>
        </form>
      )}

      {showAdd && subTab === "ads" && (
        <form onSubmit={handleCreateAd} className="bg-surface p-6 rounded-xl border border-border-weak space-y-4">
          <h3 className="font-bold text-text-main text-base">{editingId ? "Edit Banner Promo" : "Pasang Banner Promo Sponsor"}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-text-muted mb-2 font-semibold">Nama Sponsor Organisasi</label>
              <input
                type="text"
                value={sponsor}
                onChange={e => setSponsor(e.target.value)}
                placeholder="Contoh: Toko Cat Megah Jaya"
                className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-xs text-text-main outline-none focus:border-primary font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-text-muted mb-2 font-semibold">Slogan / Judul Kampanye Iklan</label>
              <input
                type="text"
                value={adTitle}
                onChange={e => setAdTitle(e.target.value)}
                placeholder="Promo Spesial Cat Dinding anti air"
                className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-xs text-text-main outline-none focus:border-primary font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-muted mb-2 font-semibold">Kalimat Rinci / Keterangan Penawaran</label>
            <textarea
              value={adDesc}
              onChange={e => setAdDesc(e.target.value)}
              placeholder="Diskon 15% khusus warga perumahan, gratis ongkos kirim ke seluruh blok..."
              rows={3}
              className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-xs text-text-main outline-none focus:border-primary font-medium"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-text-muted mb-2 font-semibold">Flyer / Spanduk Visual (URL)</label>
              <input
                type="text"
                value={adImage}
                onChange={e => setAdImage(e.target.value)}
                placeholder="https://..."
                className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-xs text-text-main outline-none focus:border-primary font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-text-muted mb-2 font-semibold">Teks Tombol Aksi (CTA)</label>
              <input
                type="text"
                value={cta}
                onChange={e => setCta(e.target.value)}
                placeholder="Hubungi WA / Buka Web"
                className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-xs text-text-main outline-none focus:border-primary font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-weak">
            <button
              type="button"
              onClick={() => {
                 setShowAdd(false);
                 setEditingId(null);
                 resetAd();
              }}
              className="px-5 py-2 text-xs text-text-muted hover:text-text-main font-medium cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-primary text-text-inverse px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/10 cursor-pointer"
            >
              {editingId ? "Simpan Perubahan" : "Terbitkan Iklan"}
            </button>
          </div>
        </form>
      )}

      {subTab === "umkm" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {umkm.map((u: any) => (
            <div key={u.id} className="bg-surface border border-border-weak rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-border-strong transition-all">
              <div>
                {u.image && <img src={u.image} alt={u.name} referrerPolicy="no-referrer" className="w-full h-40 object-cover border-b border-border-weak text-text-main text-xs" />}
                <div className="p-5">
                  <span className="text-[10px] bg-accent/15 border border-accent/20 text-accent font-bold px-2 py-0.5 rounded uppercase font-sans mb-2 inline-block">
                    {u.category}
                  </span>
                  <h4 className="font-bold text-text-main text-base">{u.name}</h4>
                  <p className="text-xs text-text-muted mt-2 line-clamp-3 leading-relaxed">{u.desc}</p>
                </div>
              </div>
              <div className="p-5 bg-canvas/30 border-t border-border-weak flex flex-col gap-3">
                <div className="text-xs text-text-main font-semibold flex justify-between items-center">
                  <span>Milik: {u.owner}</span>
                  {u.phone && <span className="font-mono text-text-muted">{u.phone}</span>}
                </div>
                <button 
                  onClick={() => handleEditUMKM(u)} 
                  className="w-full py-1.5 text-xs font-medium border border-border-strong rounded-lg hover:bg-border-weak transition-colors cursor-pointer text-text-muted"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ads.map((ad: any) => (
            <div key={ad.id} className="bg-surface rounded-xl border border-border-weak overflow-hidden shadow-sm hover:border-border-strong transition-all flex flex-col justify-between">
              <div className="flex flex-col md:flex-row flex-1">
                {ad.image && <img src={ad.image} alt={ad.title} referrerPolicy="no-referrer" className="w-full md:w-48 h-40 md:h-auto object-cover shrink-0 text-text-main text-xs" />}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[10px] bg-primary/15 border border-primary/20 text-primary font-bold px-2 py-0.5 rounded uppercase font-sans mb-2 inline-block">
                      {ad.sponsor}
                    </span>
                    <h4 className="font-bold text-text-main text-base">{ad.title}</h4>
                    <p className="text-xs text-text-muted mt-2 leading-relaxed">{ad.desc}</p>
                  </div>
                  <button className="mt-4 w-full bg-primary/10 text-primary hover:bg-primary hover:text-text-inverse font-bold py-2 rounded-xl text-xs transition-all">
                    {ad.cta || "Informasi Detail"} &rarr;
                  </button>
                </div>
              </div>
              <div className="p-3 bg-canvas/30 border-t border-border-weak">
                <button 
                  onClick={() => handleEditAd(ad)} 
                  className="w-full py-1.5 text-xs font-medium border border-border-strong rounded-lg hover:bg-border-weak transition-colors cursor-pointer text-text-muted"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── AI Triage Tab ─────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  Infrastruktur: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Kebersihan:    "bg-green-500/15 text-green-400 border-green-500/30",
  Keamanan:      "bg-red-500/15 text-red-400 border-red-500/30",
  Sosial:        "bg-purple-500/15 text-purple-400 border-purple-500/30",
  Lainnya:       "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
};

function UrgencyBar({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, (value / 10) * 100));
  const color = value >= 8 ? "bg-red-500" : value >= 5 ? "bg-amber-400" : "bg-emerald-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden border border-border-weak">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className={cn("text-xs font-bold tabular-nums w-6 text-right", value >= 8 ? "text-red-400" : value >= 5 ? "text-amber-400" : "text-emerald-400")}>
        {value.toFixed(1)}
      </span>
    </div>
  );
}

function OverrideModal({ report, onSave, onClose }: { report: any; onSave: (id: string, category: string, urgency: number, tags: string[]) => void; onClose: () => void }) {
  const [category, setCategory] = useState<string>(report.aiLabels?.category ?? "Lainnya");
  const [urgency, setUrgency] = useState<number>(report.aiLabels?.urgency ?? 5);
  const [tagsInput, setTagsInput] = useState<string>((report.aiLabels?.tags ?? []).join(", "));

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-sidebar border border-border-strong rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="font-bold text-text-main mb-4 font-display">Override Label AI</h3>
        <p className="text-xs text-text-muted mb-5 font-mono">{report.id} — {report.title}</p>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Kategori</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-surface border border-border-weak rounded-lg px-3 py-2 text-sm text-text-main">
              {["Infrastruktur","Kebersihan","Keamanan","Sosial","Lainnya"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Urgensi (0–10)</label>
            <input type="range" min={0} max={10} step={0.1} value={urgency} onChange={e => setUrgency(parseFloat(e.target.value))} className="w-full accent-primary" />
            <div className="text-right text-xs text-primary font-bold mt-1">{urgency.toFixed(1)}</div>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Tags (pisah koma)</label>
            <input value={tagsInput} onChange={e => setTagsInput(e.target.value)} className="w-full bg-surface border border-border-weak rounded-lg px-3 py-2 text-sm text-text-main" />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="flex-1 py-2 border border-border-weak rounded-xl text-sm text-text-muted hover:bg-surface-hover cursor-pointer">Batal</button>
          <button
            onClick={() => { onSave(report.id, category, urgency, tagsInput.split(",").map(t => t.trim()).filter(Boolean)); onClose(); }}
            className="flex-1 py-2 bg-primary text-text-inverse rounded-xl text-sm font-bold hover:bg-primary/90 cursor-pointer"
          >
            Simpan Override
          </button>
        </div>
      </div>
    </div>
  );
}

function AITriageTab() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [filterCategory, setFilterCategory] = useState("Semua");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [overrideReport, setOverrideReport] = useState<any>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/complaints");
      if (res.ok) setReports((await res.json()).map((r: any) => ({ ...r, responses: r.responses || [] })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const handleValidate = async (id: string) => {
    await fetch(`/api/admin/complaints/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "PROSES" }),
    }).catch(() => {});
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: "PROSES" } : r));
  };

  const handleReplyAndClose = async (id: string) => {
    if (!replyText.trim()) return;
    await fetch(`/api/admin/reports/${id}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: replyText, status: "SELESAI" }),
    }).catch(() => {});
    await fetch(`/api/admin/complaints/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "SELESAI" }),
    }).catch(() => {});
    setReports(prev => prev.map(r => r.id === id ? {
      ...r,
      status: "SELESAI",
      responses: [...r.responses, { text: replyText, date: "Baru saja" }],
    } : r));
    setReplyText("");
    setExpandedId(null);
  };

  const handleConfirmAI = async (id: string) => {
    await fetch(`/api/admin/complaints/${id}/confirm`, { method: "POST" }).catch(() => {});
    setReports(prev => prev.map(r => r.id === id ? { ...r, aiLabels: { ...r.aiLabels, confirmed: true } } : r));
  };

  const handleOverride = async (id: string, category: string, urgency: number, tags: string[]) => {
    await fetch(`/api/admin/complaints/${id}/override`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, urgency, tags }),
    }).catch(() => {});
    setReports(prev => prev.map(r => r.id === id ? { ...r, category, aiLabels: { category, urgency, tags, confirmed: true } } : r));
  };

  const categories = ["Semua", "Infrastruktur", "Kebersihan", "Keamanan", "Sosial", "Lainnya"];
  const statuses = ["Semua", "TERKIRIM", "PROSES", "SELESAI"];

  const statusOrder: Record<string, number> = { "TERKIRIM": 0, "PROSES": 1, "SELESAI": 2 };

  const filtered = reports
    .filter(r => filterStatus === "Semua" || r.status === filterStatus)
    .filter(r => filterCategory === "Semua" || r.aiLabels?.category === filterCategory)
    .sort((a, b) => {
      const sa = statusOrder[a.status] ?? 3, sb = statusOrder[b.status] ?? 3;
      if (sa !== sb) return sa - sb;
      return (b.aiLabels?.urgency ?? 0) - (a.aiLabels?.urgency ?? 0);
    });

  const counts = {
    pending: reports.filter(r => r.status === "TERKIRIM").length,
    proses: reports.filter(r => r.status === "PROSES").length,
    selesai: reports.filter(r => r.status === "SELESAI").length,
  };
  const highPriority = reports.filter(r => (r.aiLabels?.urgency ?? 0) >= 8 && r.status !== "SELESAI").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-text-main">Kelola Laporan Warga</h2>
          <p className="text-sm text-text-muted mt-1">AI memberi peringkat urgensi tiap laporan agar Anda menangani yang terpenting lebih dulu.</p>
        </div>
        <button onClick={fetchReports} className="text-xs text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition cursor-pointer shrink-0">
          Refresh
        </button>
      </div>

      {/* AI priority banner */}
      {highPriority > 0 && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/25 rounded-xl p-3.5">
          <div className="w-9 h-9 rounded-lg bg-red-500/15 text-red-400 flex items-center justify-center shrink-0"><AlertTriangle size={18} /></div>
          <p className="text-xs text-text-main">
            <span className="font-bold text-red-400">{highPriority} laporan prioritas tinggi</span> (urgensi AI ≥ 8) menunggu penanganan. Laporan dengan skor tertinggi ditampilkan paling atas.
          </p>
        </div>
      )}

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface border border-zinc-500/20 rounded-xl p-4">
          <p className="text-xs text-text-muted mb-1">Masuk / Pending</p>
          <p className="text-2xl font-bold font-display text-text-main">{counts.pending}</p>
        </div>
        <div className="bg-surface border border-amber-500/20 rounded-xl p-4">
          <p className="text-xs text-amber-400 mb-1">Sedang Diproses</p>
          <p className="text-2xl font-bold font-display text-amber-400">{counts.proses}</p>
        </div>
        <div className="bg-surface border border-emerald-500/20 rounded-xl p-4">
          <p className="text-xs text-emerald-400 mb-1">Selesai</p>
          <p className="text-2xl font-bold font-display text-emerald-400">{counts.selesai}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-2">
        <div className="flex gap-2 flex-wrap">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn("px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer",
                filterStatus === s ? "bg-primary text-text-inverse border-primary" : "bg-surface border-border-weak text-text-muted hover:border-primary/50"
              )}
            >
              {s === "Semua" ? `Semua (${reports.length})` : s === "TERKIRIM" ? `Pending (${counts.pending})` : s === "PROSES" ? `Diproses (${counts.proses})` : `Selesai (${counts.selesai})`}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={12} className="text-text-muted" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={cn("px-2.5 py-1 rounded-full text-[11px] font-semibold border transition cursor-pointer",
                filterCategory === cat ? "bg-accent/20 text-accent border-accent/40" : "bg-surface border-border-weak text-text-muted hover:border-accent/40"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Report list */}
      {loading ? (
        <div className="flex items-center justify-center h-40 text-text-muted text-sm">Memuat laporan...</div>
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-text-muted text-sm">Tidak ada laporan.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(report => {
            const isExpanded = expandedId === report.id;
            const labels = report.aiLabels;
            return (
              <div key={report.id} className={cn("bg-surface border rounded-xl overflow-hidden transition-all",
                report.status === "TERKIRIM" ? "border-zinc-500/30" :
                report.status === "PROSES" ? "border-amber-500/30" : "border-emerald-500/20"
              )}>
                {/* Row */}
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer hover:bg-surface-hover transition"
                  onClick={() => { setExpandedId(isExpanded ? null : report.id); setReplyText(""); }}
                >
                  <div className={cn("w-1.5 self-stretch rounded-full shrink-0",
                    report.status === "TERKIRIM" ? "bg-zinc-500" :
                    report.status === "PROSES" ? "bg-amber-400" : "bg-emerald-500"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-text-main truncate">{report.title}</p>
                      {(labels?.urgency ?? 0) >= 8 && report.status !== "SELESAI" && (
                        <span className="shrink-0 inline-flex items-center gap-0.5 text-[9px] font-bold bg-red-500/15 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded uppercase tracking-wide"><AlertTriangle size={9} /> Prioritas</span>
                      )}
                    </div>
                    <p className="text-xs text-text-muted mt-0.5 truncate">{report.sender} · {report.location} · {report.date}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {labels && (
                      <span title="Skor urgensi AI" className={cn("hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border tabular-nums",
                        (labels.urgency ?? 0) >= 8 ? "bg-red-500/15 text-red-400 border-red-500/30" :
                        (labels.urgency ?? 0) >= 5 ? "bg-amber-500/15 text-amber-400 border-amber-500/30" :
                        "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                      )}>
                        <Activity size={10} /> {(labels.urgency ?? 0).toFixed(1)}
                      </span>
                    )}
                    {labels?.category && (
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border hidden md:inline", CATEGORY_COLORS[labels.category] ?? CATEGORY_COLORS.Lainnya)}>
                        {labels.category}
                      </span>
                    )}
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border",
                      report.status === "SELESAI" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" :
                      report.status === "PROSES"  ? "bg-amber-500/15 text-amber-400 border-amber-500/30" :
                                                    "bg-zinc-500/15 text-zinc-400 border-zinc-500/30"
                    )}>{report.status}</span>
                    <ChevronRight size={14} className={cn("text-text-muted transition-transform", isExpanded && "rotate-90")} />
                  </div>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div className="border-t border-border-weak px-4 pb-5 pt-4 space-y-4">
                    {/* Image + description */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      {report.image && (
                        <img
                          src={report.image}
                          referrerPolicy="no-referrer"
                          alt={report.title}
                          className="w-full sm:w-48 h-36 object-cover rounded-xl border border-border-weak shrink-0"
                        />
                      )}
                      <div className="flex-1 space-y-2">
                        <p className="text-xs text-text-muted">Deskripsi laporan:</p>
                        <p className="text-sm text-text-main leading-relaxed">{report.description || report.message || "Tidak ada deskripsi tambahan."}</p>
                      </div>
                    </div>

                    {/* AI triage panel */}
                    <div className="bg-canvas border border-border-weak rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <BrainCircuit size={14} className="text-primary" />
                          <span className="text-xs font-semibold text-text-main">Analisis Prioritas AI</span>
                          {labels?.confirmed
                            ? <span className="text-[9px] font-bold bg-primary/15 text-primary border border-primary/30 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><Check size={9} /> Dikonfirmasi</span>
                            : <span className="text-[9px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded-full">Belum ditinjau</span>}
                        </div>
                        {labels?.category && (
                          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", CATEGORY_COLORS[labels.category] ?? CATEGORY_COLORS.Lainnya)}>{labels.category}</span>
                        )}
                      </div>
                      {labels ? (
                        <>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-text-muted w-16 shrink-0">Urgensi</span>
                            <UrgencyBar value={labels.urgency ?? 0} />
                          </div>
                          {labels.tags?.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] text-text-muted w-16 shrink-0">Kata kunci</span>
                              {labels.tags.map((t: string) => (
                                <span key={t} className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded-full">{t}</span>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-2 pt-1 border-t border-border-weak/60">
                            {!labels.confirmed && (
                              <button onClick={() => handleConfirmAI(report.id)} className="text-[11px] font-bold text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition cursor-pointer flex items-center gap-1"><Check size={12} /> Konfirmasi Label</button>
                            )}
                            <button onClick={() => setOverrideReport(report)} className="text-[11px] font-bold text-text-muted border border-border-weak px-3 py-1.5 rounded-lg hover:bg-surface-hover hover:text-text-main transition cursor-pointer flex items-center gap-1"><SlidersHorizontal size={12} /> Sesuaikan</button>
                          </div>
                        </>
                      ) : (
                        <p className="text-[11px] text-text-muted">AI sedang mengklasifikasikan laporan ini… segarkan sebentar lagi, atau atur label secara manual.
                          <button onClick={() => setOverrideReport(report)} className="ml-1 text-primary font-semibold hover:underline cursor-pointer">Atur manual</button>
                        </p>
                      )}
                    </div>

                    {/* Workflow actions */}
                    {report.status === "TERKIRIM" && (
                      <div className="flex items-center justify-between bg-canvas border border-border-strong rounded-xl p-4">
                        <div>
                          <p className="text-sm font-semibold text-text-main">Laporan masuk — belum ditindaklanjuti</p>
                          <p className="text-xs text-text-muted mt-0.5">Klik "Validasi" untuk mulai memproses laporan ini.</p>
                        </div>
                        <button
                          onClick={() => handleValidate(report.id)}
                          className="bg-primary text-text-inverse font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-primary/90 transition cursor-pointer shrink-0"
                        >
                          Validasi →
                        </button>
                      </div>
                    )}

                    {report.status === "PROSES" && (
                      <div className="bg-canvas border border-amber-500/25 rounded-xl p-4 space-y-3">
                        <p className="text-xs font-semibold text-amber-400">Sedang diproses — tulis tanggapan lalu tandai selesai</p>
                        <textarea
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          rows={3}
                          placeholder="Tulis tanggapan resmi RT kepada warga pelapor..."
                          className="w-full bg-canvas border border-border-strong rounded-lg p-3 text-sm text-text-main placeholder:text-text-muted/50 resize-none focus:outline-none focus:border-primary"
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleReplyAndClose(report.id)}
                            disabled={!replyText.trim()}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50"
                          >
                            Kirim & Selesaikan ✓
                          </button>
                        </div>
                      </div>
                    )}

                    {report.status === "SELESAI" && (
                      <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-4">
                        <p className="text-xs font-semibold text-emerald-400 mb-2">Laporan telah diselesaikan</p>
                        {report.responses?.map((r: any, i: number) => (
                          <div key={i} className="bg-canvas border border-border-strong rounded-lg px-3 py-2 mt-2">
                            <p className="text-xs text-text-main">{r.text}</p>
                            <p className="text-[10px] text-text-muted mt-1">{r.date}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {overrideReport && (
        <OverrideModal
          report={overrideReport}
          onSave={handleOverride}
          onClose={() => setOverrideReport(null)}
        />
      )}
    </div>
  );
}

function ElectionTab() {
  const [election, setElection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentRT, setCurrentRT] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [yearsServed, setYearsServed] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchElection = async () => {
    try {
      const res = await fetch("/api/admin/election");
      if (res.ok) setElection(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchElection(); }, []);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRT || !endDate) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/election/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentRT, startDate, endDate, yearsServed }),
      });
      if (res.ok) { setElection(await res.json().then((r: any) => r.election)); }
    } finally {
      setSaving(false);
      fetchElection();
    }
  };

  const handleStartVoting = async () => {
    const res = await fetch("/api/admin/election/start-voting", { method: "POST" });
    if (res.ok) fetchElection();
    else alert((await res.json()).error);
  };

  const handleTally = async () => {
    if (!confirm("Tutup pemungutan suara dan umumkan pemenang sekarang? Tindakan ini tidak dapat dibatalkan.")) return;
    const res = await fetch("/api/admin/election/tally", { method: "POST" });
    if (res.ok) fetchElection();
    else alert((await res.json()).error);
  };

  const handleReset = async () => {
    if (!confirm("Reset seluruh data pemilihan? Tindakan ini tidak dapat dibatalkan.")) return;
    const res = await fetch("/api/admin/election/reset", { method: "POST" });
    if (res.ok) fetchElection();
  };

  if (loading) return <div className="py-20 text-center text-text-muted text-sm">Memuat data pemilihan...</div>;

  const phase = election?.phase || "inactive";
  const totalVotes = (election?.votes || []).length;
  const eligible = election?.eligibleVoters ?? 0;
  const turnoutPct = eligible > 0 ? Math.round((totalVotes / eligible) * 100) : 0;
  const candidates: any[] = election?.candidates || [];
  const sortedCands = [...candidates].sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
  const leader = sortedCands[0];

  const phases = ["inactive", "nominating", "voting", "completed"];
  const phaseIdx = phases.indexOf(phase);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-semibold text-text-main">Manajemen Pemilihan RT</h2>
        <p className="text-sm text-text-muted mt-1">Jalankan siklus pemilihan Ketua RT yang transparan — dari nominasi hingga penghitungan suara.</p>
      </div>

      {/* Phase stepper */}
      <div className="bg-surface border border-border-weak rounded-2xl p-4">
        <div className="flex items-center">
          {[
            { key: "inactive", label: "Persiapan", icon: SlidersHorizontal },
            { key: "nominating", label: "Nominasi", icon: UserPlus },
            { key: "voting", label: "Voting", icon: Vote },
            { key: "completed", label: "Selesai", icon: Trophy },
          ].map((p, i) => {
            const done = i < phaseIdx;
            const current = p.key === phase;
            return (
              <React.Fragment key={p.key}>
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <div className={cn("w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all",
                    current ? "bg-primary text-text-inverse border-primary ring-4 ring-primary/15" :
                    done ? "bg-primary/15 text-primary border-primary/40" :
                    "bg-canvas text-text-muted border-border-weak")}>
                    {done ? <Check size={15} /> : <p.icon size={15} />}
                  </div>
                  <span className={cn("text-[10px] font-semibold", current ? "text-primary" : done ? "text-text-main/70" : "text-text-muted")}>{p.label}</span>
                </div>
                {i < 3 && <div className={cn("flex-1 h-0.5 mx-1 -mt-5 rounded-full", i < phaseIdx ? "bg-primary/40" : "bg-border-weak")} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Phase: inactive → setup form */}
      {phase === "inactive" && (
        <div className="bg-surface border border-border-weak rounded-2xl p-6 space-y-5 max-w-xl">
          <div>
            <h3 className="font-semibold text-text-main mb-1">Mulai Siklus Pemilihan Baru</h3>
            <p className="text-xs text-text-muted">Isi data masa jabatan Ketua RT saat ini. Saat disimpan, fase nominasi terbuka dan semua warga otomatis menerima notifikasi.</p>
          </div>
          <form onSubmit={handleSetup} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Nama Ketua RT Saat Ini</label>
              <input value={currentRT} onChange={e => setCurrentRT(e.target.value)} placeholder="Contoh: Bpk. Suherman" required className="w-full bg-canvas border border-border-strong rounded-lg p-2.5 text-sm text-text-main focus:outline-none focus:border-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Tanggal Mulai Jabatan</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-canvas border border-border-strong rounded-lg p-2.5 text-sm text-text-main focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Tanggal Akhir Jabatan</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required className="w-full bg-canvas border border-border-strong rounded-lg p-2.5 text-sm text-text-main focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Sudah Menjabat Berapa Tahun?</label>
              <input type="number" min="0" max="30" value={yearsServed} onChange={e => setYearsServed(e.target.value)} placeholder="Contoh: 2" className="w-full bg-canvas border border-border-strong rounded-lg p-2.5 text-sm text-text-main focus:outline-none focus:border-primary" />
            </div>
            <button type="submit" disabled={saving} className="bg-primary text-text-inverse font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors text-sm cursor-pointer disabled:opacity-60 flex items-center gap-2">
              {saving ? "Menyimpan..." : <>Buka Fase Nominasi <ArrowRight size={15} /></>}
            </button>
          </form>
        </div>
      )}

      {/* Phase: nominating */}
      {phase === "nominating" && (
        <div className="space-y-4">
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-start gap-3">
            <UserPlus size={18} className="text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-text-main">Fase Nominasi Aktif</p>
              <p className="text-xs text-text-muted mt-0.5">Masa jabatan <strong>{election?.term?.currentRT}</strong> berakhir <strong>{election?.term?.endDate}</strong>. Warga mendaftar sebagai calon lewat dashboard mereka.</p>
            </div>
          </div>

          <div className="bg-surface border border-border-weak rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border-weak flex items-center justify-between gap-3">
              <h3 className="font-semibold text-text-main text-sm">Kandidat Terdaftar ({candidates.length})</h3>
              <button onClick={handleStartVoting} disabled={candidates.length < 1} className="bg-primary text-text-inverse text-xs font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0">
                Tutup Nominasi & Mulai Voting <ArrowRight size={13} />
              </button>
            </div>
            {candidates.length === 0 ? (
              <div className="p-10 text-center">
                <UserPlus size={28} className="text-text-muted mx-auto mb-2 opacity-40" />
                <p className="text-sm text-text-muted">Belum ada kandidat. Notifikasi sudah dikirim ke semua warga.</p>
                <p className="text-xs text-text-muted/70 mt-1">Minimal 1 kandidat diperlukan untuk memulai voting.</p>
              </div>
            ) : (
              <div className="divide-y divide-border-weak">
                {candidates.map((c: any, i: number) => (
                  <div key={c.id} className="p-4 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-sm shrink-0">{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-text-main text-sm">{c.name}</p>
                      {c.visiMisi ? <p className="text-xs text-text-muted mt-1 leading-relaxed">{c.visiMisi}</p> : <p className="text-xs text-text-muted/60 italic mt-1">Visi misi belum diisi</p>}
                      <p className="text-[10px] text-text-muted mt-1">Terdaftar: {c.nominatedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Phase: voting */}
      {phase === "voting" && (
        <div className="space-y-4">
          {/* Turnout stat */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface border border-border-weak rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2"><Vote size={16} /></div>
              <p className="text-2xl font-display font-bold text-text-main">{totalVotes}</p>
              <p className="text-[11px] text-text-muted">Suara Masuk</p>
            </div>
            <div className="bg-surface border border-border-weak rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2"><Users size={16} /></div>
              <p className="text-2xl font-display font-bold text-text-main">{turnoutPct}%</p>
              <p className="text-[11px] text-text-muted">Partisipasi ({totalVotes}/{eligible} KK)</p>
            </div>
            <div className="bg-surface border border-border-weak rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2"><Trophy size={16} /></div>
              <p className="text-sm font-display font-bold text-text-main truncate">{leader && leader.voteCount > 0 ? leader.name : "—"}</p>
              <p className="text-[11px] text-text-muted">Unggul Sementara</p>
            </div>
          </div>

          <div className="bg-surface border border-border-weak rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border-weak flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-text-main text-sm">Rekapitulasi Sementara</h3>
                <p className="text-[11px] text-text-muted mt-0.5">Hasil hanya terlihat oleh pengurus — warga melihatnya setelah ditutup.</p>
              </div>
              <button onClick={handleTally} className="bg-accent text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors cursor-pointer shrink-0">
                Tutup & Umumkan Pemenang
              </button>
            </div>
            <div className="divide-y divide-border-weak">
              {sortedCands.map((c: any, i: number) => {
                const pct = totalVotes > 0 ? Math.round(((c.voteCount || 0) / totalVotes) * 100) : 0;
                return (
                  <div key={c.id} className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold text-text-main text-sm flex items-center gap-2">
                        {i === 0 && c.voteCount > 0 && <Trophy size={13} className="text-amber-400" />}{c.name}
                      </p>
                      <span className="font-bold text-text-main text-sm tabular-nums">{c.voteCount || 0} suara · {pct}%</span>
                    </div>
                    <div className="w-full bg-canvas rounded-full h-2 overflow-hidden border border-border-weak">
                      <div className={cn("rounded-full h-full transition-all duration-500", i === 0 && c.voteCount > 0 ? "bg-primary" : "bg-primary/50")} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Phase: completed */}
      {phase === "completed" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-emerald-500/15 to-surface border border-emerald-500/25 rounded-2xl p-6 text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto"><Trophy size={28} /></div>
            <div>
              <p className="text-xs text-text-muted">Ketua RT Terpilih</p>
              <h3 className="text-2xl font-display font-bold text-text-main">{election.winner}</h3>
              <p className="text-xs text-text-muted mt-1">Diumumkan {election.announcedAt} · {totalVotes} suara sah · {turnoutPct}% partisipasi</p>
            </div>
          </div>

          <div className="bg-surface border border-border-weak rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border-weak">
              <h3 className="font-semibold text-text-main text-sm">Hasil Akhir Pemungutan Suara</h3>
            </div>
            <div className="divide-y divide-border-weak">
              {sortedCands.map((c: any, i: number) => {
                const pct = totalVotes > 0 ? Math.round(((c.voteCount || 0) / totalVotes) * 100) : 0;
                const won = c.name === election.winner;
                return (
                  <div key={c.id} className="p-4 flex items-center gap-4">
                    {i === 0 ? <Trophy size={18} className="text-amber-400 shrink-0" /> : <span className="w-[18px] text-center text-text-muted font-bold text-sm">{i + 1}</span>}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-text-main text-sm flex items-center gap-2">{c.name}{won && <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Terpilih</span>}</p>
                      <div className="w-full bg-canvas rounded-full h-1.5 mt-1.5 overflow-hidden">
                        <div className={cn("h-1.5 rounded-full", won ? "bg-emerald-400" : "bg-primary/60")} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <span className="font-bold text-text-main text-sm shrink-0 tabular-nums">{c.voteCount || 0} · {pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button onClick={handleReset} className="text-xs text-text-muted border border-border-weak px-4 py-2 rounded-lg hover:bg-surface-hover transition-colors cursor-pointer">
            Reset & Mulai Pemilihan Baru
          </button>
        </div>
      )}
    </div>
  );
}

function AdminChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
    { sender: "ai", text: "Halo, Ketua RT! Saya Asisten AI SmartWarga untuk Pengurus. Tanyakan apa saja — laporan warga, status keuangan kas, jadwal, atau ringkasan kondisi RT." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  }, [messages, loading, isOpen]);

  const adminPrompts = [
    { label: "📊 Saldo Kas RT", query: "Berapa saldo kas RT saat ini?" },
    { label: "📋 Laporan Aktif", query: "Berapa laporan warga yang belum selesai?" },
    { label: "📝 Surat Pending", query: "Ada berapa surat yang menunggu persetujuan?" },
    { label: "💰 Tunggakan Iuran", query: "Siapa saja warga yang belum bayar iuran?" },
    { label: "🏗️ Infrastruktur", query: "Laporan infrastruktur apa saja yang masuk minggu ini?" },
    { label: "📣 Buat Pengumuman", query: "Bantu saya membuat draft pengumuman gotong royong" },
    { label: "📈 Statistik RT", query: "Berikan ringkasan statistik kondisi RT 04" },
    { label: "🗳️ Info Pemilihan", query: "Apa status pemilihan RT saat ini?" },
  ];

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setMessages(prev => [...prev, { sender: "user", text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/user/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, role: "admin" }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: "ai", text: data.reply || data.text || "Maaf, tidak dapat memproses pertanyaan saat ini." }]);
    } catch {
      setMessages(prev => [...prev, { sender: "ai", text: "Gagal menghubungi server AI SmartWarga." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    sendMessage(text);
  };

  return (
    <div className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-4 sm:right-6 z-40 flex flex-col items-end">
      {isOpen && (
        <div className="bg-sidebar border border-border-strong rounded-3xl w-[calc(100vw-2rem)] max-w-80 md:w-96 md:max-w-none h-[480px] max-h-[70vh] shadow-2xl flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-6 duration-200">
          <div className="bg-primary text-text-inverse p-4 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-text-inverse/10 flex items-center justify-center text-base">🤖</div>
              <div>
                <h4 className="font-bold text-xs font-display">Asisten AI — Pengurus RT</h4>
                <p className="text-[9px] text-text-inverse/80 font-mono">AKTIF • Mode Pengurus</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-text-inverse/80 hover:text-text-inverse font-bold cursor-pointer">✕</button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-canvas/40">
            {messages.map((msg, i) => (
              <div key={i} className={cn("max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed", msg.sender === "user" ? "bg-primary text-text-inverse ml-auto rounded-tr-none" : "bg-surface border border-border-weak text-text-main mr-auto rounded-tl-none")}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="bg-surface border border-border-weak text-text-muted p-3 rounded-2xl rounded-tl-none mr-auto text-xs w-20 flex gap-1 justify-center animate-pulse">
                <span>●</span><span>●</span><span>●</span>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="px-3 py-2 border-t border-border-weak/40 bg-surface/80 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            {adminPrompts.map((p, i) => (
              <button key={i} type="button" onClick={() => sendMessage(p.query)} disabled={loading}
                className="text-[10px] bg-canvas hover:bg-primary/10 hover:text-primary text-text-muted font-medium border border-border-weak rounded-full px-2.5 py-1 whitespace-nowrap cursor-pointer transition-colors disabled:opacity-50">
                {p.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-border-weak bg-surface flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Tanyakan laporan, kas, warga..."
              className="flex-1 bg-canvas border border-border-strong rounded-xl px-3 py-2 text-xs text-text-main outline-none focus:border-primary"
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} className="bg-primary text-text-inverse px-3 rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-55">
              🚀
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn("w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer", isOpen ? "bg-accent text-white" : "bg-primary text-text-inverse")}
      >
        {isOpen ? <span className="font-bold text-lg">✕</span> : (
          <div className="relative">
            <BrainCircuit size={24} />
            <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full animate-pulse border border-sidebar">AI</span>
          </div>
        )}
      </button>
    </div>
  );
}

// ==========================================
// ADMIN PROFILE TAB
// ==========================================
function AdminProfileTab() {
  const [profile, setProfile] = useState({
    name: "Budi Santoso",
    jabatan: "Ketua RT 05",
    rt: "05",
    rw: "12",
    phone: "0813-9876-5432",
    email: "budi.santoso@rt05rw12.id",
    address: "Jl. Merdeka No. 01, RT 05 / RW 12",
    periode: "2023 – 2026",
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("admin-profile", JSON.stringify(profile));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  React.useEffect(() => {
    const stored = localStorage.getItem("admin-profile");
    if (stored) {
      try { setProfile(JSON.parse(stored)); } catch {}
    }
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-display font-semibold text-text-main">Profil Pengurus</h2>
        <p className="text-sm text-text-muted mt-1">Kelola kontak dan informasi pengurus RT yang ditampilkan ke warga.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Form */}
        <div className="md:col-span-2 bg-surface border border-border-weak p-6 rounded-xl space-y-6">
          <h3 className="font-bold text-base text-text-main border-b border-border-weak pb-3">Identitas Pengurus</h3>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Read-only fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-canvas border border-border-weak rounded-xl opacity-70">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-text-muted flex items-center gap-1">
                  Nama Lengkap
                  <span className="text-[10px] bg-surface border border-border-weak px-1.5 py-0.5 rounded text-text-muted font-medium ml-1">Sistem</span>
                </label>
                <div className="w-full bg-surface border border-border-weak rounded-xl p-3 text-sm text-text-main font-medium">{profile.name}</div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-text-muted flex items-center gap-1">
                  Jabatan
                  <span className="text-[10px] bg-surface border border-border-weak px-1.5 py-0.5 rounded text-text-muted font-medium ml-1">Sistem</span>
                </label>
                <div className="w-full bg-surface border border-border-weak rounded-xl p-3 text-sm text-text-main font-medium">{profile.jabatan}</div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-text-muted flex items-center gap-1">
                  RT / RW
                  <span className="text-[10px] bg-surface border border-border-weak px-1.5 py-0.5 rounded text-text-muted font-medium ml-1">Sistem</span>
                </label>
                <div className="w-full bg-surface border border-border-weak rounded-xl p-3 text-sm text-text-main font-bold">RT {profile.rt} / RW {profile.rw}</div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-text-muted flex items-center gap-1">
                  Periode Jabatan
                  <span className="text-[10px] bg-surface border border-border-weak px-1.5 py-0.5 rounded text-text-muted font-medium ml-1">Sistem</span>
                </label>
                <div className="w-full bg-surface border border-border-weak rounded-xl p-3 text-sm text-text-main font-medium">{profile.periode}</div>
              </div>
            </div>
            <p className="text-xs text-text-muted">Data jabatan dan wilayah dikelola oleh sistem. Hubungi administrator untuk perubahan.</p>

            {/* Editable fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-text-muted">Nomor WhatsApp</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="08xx-xxxx-xxxx"
                  className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-sm text-text-main outline-none focus:border-primary shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-text-muted">Email Dinas</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                  placeholder="email@rt.id"
                  className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-sm text-text-main outline-none focus:border-primary shadow-sm"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border-weak">
              {isSaved ? (
                <span className="text-xs text-primary font-bold animate-pulse flex items-center gap-1">✓ Kontak pengurus berhasil diperbarui!</span>
              ) : (
                <span className="text-xs text-text-muted">Nomor WhatsApp dan email dinas dapat diperbarui.</span>
              )}
              <button
                type="submit"
                className="bg-primary text-text-inverse font-bold py-2.5 px-6 rounded-xl text-xs hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20 cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>

        {/* Info card */}
        <div className="bg-surface border border-border-weak p-6 rounded-xl space-y-5">
          <h3 className="font-bold text-base text-text-main">Informasi Kontak</h3>
          <p className="text-xs text-text-muted">Informasi ini ditampilkan kepada warga sebagai kontak resmi RT/RW.</p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <User size={15} />
              </div>
              <div>
                <p className="text-xs text-text-muted">Ketua RT</p>
                <p className="text-sm font-semibold text-text-main">{profile.name}</p>
                <p className="text-xs text-text-muted">{profile.jabatan} · Periode {profile.periode}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <PhoneCall size={15} />
              </div>
              <div>
                <p className="text-xs text-text-muted">WhatsApp</p>
                <p className="text-sm font-semibold text-text-main">{profile.phone || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <MessageSquare size={15} />
              </div>
              <div>
                <p className="text-xs text-text-muted">Email Dinas</p>
                <p className="text-sm font-semibold text-text-main break-all">{profile.email || "—"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
