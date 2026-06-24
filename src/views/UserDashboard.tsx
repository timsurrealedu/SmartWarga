import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { 
  Camera, FileCheck, CheckCircle2, AlertCircle, PhoneCall, 
  MapPin, Clock, Upload, Search, Download, Plus, MessageSquare, CreditCard,
  Home, Heart, Briefcase, HelpingHand, Truck, MoreHorizontal, ShieldAlert,
  Newspaper, Store, Calendar, Tag, AlertTriangle, Building, Megaphone, Users,
  FileText, Sparkles, ChevronRight, ChevronLeft
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export function UserDashboard({ currentTab, setTab }: { currentTab: string, setTab: (tab: string) => void }) {
  const [letters, setLetters] = useState<any[]>([]);
  const [finance, setFinance] = useState<any>({ summary: [], details: [], history: [] });
  
  useEffect(() => {
    fetch('/api/user/letters').then(r => r.json()).then(setLetters);
    fetch('/api/finance').then(r => r.json()).then(setFinance);
  }, []);

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
          {currentTab === "dashboard" && <OverviewTab letters={letters} setTab={setTab} />}
          {currentTab === "news_gotong_royong" && <NewsGotongRoyongTab />}
          {currentTab === "market" && <MarketTab />}
          {currentTab === "letters" && <LettersTab letters={letters} onLetterAdded={(l) => setLetters([l, ...letters])} />}
          {currentTab === "finance_dues" && <FinanceDuesTab data={finance} />}
          {currentTab === "reports" && <ReportingTab setTab={setTab} />}
          {currentTab === "tracking" && <TrackingTab setTab={setTab} />}
          {currentTab === "panic" && <PanicTab />}
          {currentTab === "profile" && <ProfileTab />}
        </motion.div>
      </AnimatePresence>

      {/* Floating SmartWarga AI Chatbot */}
      <AIChatbot />
    </div>
  );
}

function OverviewTab({ letters, setTab }: { letters: any[], setTab: (tab: string) => void }) {
  const activeLettersCount = letters.filter(l => l.status === "pending").length;
  const [showVideo, setShowVideo] = useState(false);
  const [profileName, setProfileName] = useState(() => {
    const stored = localStorage.getItem("user-profile");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.name || "Bpk. Rahardian";
      } catch (e) {
        return "Bpk. Rahardian";
      }
    }
    return "Bpk. Rahardian";
  });

  useEffect(() => {
    const handleUpdate = () => {
      const stored = localStorage.getItem("user-profile");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.name) {
            setProfileName(parsed.name);
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    window.addEventListener("profile-updated", handleUpdate);
    return () => window.removeEventListener("profile-updated", handleUpdate);
  }, []);

  return (
    <div className="space-y-6">
      <div className="welcome-banner rounded-3xl p-8 relative overflow-hidden shadow-lg">
        <div className="relative z-10 w-full md:w-2/3">
          <h1 className="text-3xl font-display font-bold mb-2 welcome-title">
            Selamat datang, {profileName}
          </h1>
          <p className="welcome-subtitle mb-6 max-w-lg">
            Sistem Digital SmartWarga siap membantu administrasi dan keamanan lingkungan Anda. Apa yang ingin Anda lakukan hari ini?
          </p>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setTab("letters")}
              className="bg-accent text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-red-500 transition-colors shadow-[0_10px_30px_rgba(0,0,0,0.25)] cursor-pointer">
              Buat Surat Pengantar
            </button>
            <button 
              onClick={() => setTab("finance_dues")}
              className="bg-surface/10 border border-white/20 text-white dark:text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors cursor-pointer hover:bg-surface/20">
              Bayar Iuran
            </button>
            <button 
              onClick={() => setShowVideo(true)}
              className="bg-surface/10 border border-white/20 text-white dark:text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer hover:bg-surface/20">
              <span>▶ Bantuan / Tutorial</span>
            </button>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-80 h-full opacity-10 pointer-events-none hidden md:block">
           <svg viewBox="0 0 100 100" className="w-full h-full fill-current" preserveAspectRatio="none">
             <polygon points="0,100 100,0 100,100"/>
           </svg>
        </div>
      </div>

      {showVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-canvas w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="flex items-center justify-between p-4 bg-sidebar border-b border-border-weak">
              <h3 className="font-bold text-text-main text-lg">Platform Video Edukasi warga</h3>
              <button onClick={() => setShowVideo(false)} className="text-text-muted hover:text-text-main p-1">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <div className="relative pt-[56.25%] bg-black">
              <iframe 
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                title="Video Bantuan" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
              </iframe>
            </div>
            <div className="p-4 bg-surface text-sm text-text-muted">
              Pusat Edukasi SmartWarga: Cara verifikasi, login, mengajukan surat, dan membayar QRIS.
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-text-main flex items-center justify-center mb-4">
             <FileCheck size={24} />
          </div>
          <h3 className="font-semibold font-display text-text-main">Surat Aktif</h3>
          <p className="text-3xl font-bold text-text-main mt-2">{activeLettersCount}</p>
          <span className="text-xs text-text-muted mt-1 uppercase tracking-wider">Menunggu RT</span>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-accent/20 text-accent flex items-center justify-center mb-4">
             <AlertCircle size={24} />
          </div>
          <h3 className="font-semibold font-display text-text-main">Laporan Terbuka</h3>
          <p className="text-3xl font-bold text-text-main mt-2">0</p>
          <span className="text-xs text-text-muted mt-1 uppercase tracking-wider">Aman Terselesaikan</span>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-primary text-text-inverse flex items-center justify-center mb-4">
             <CheckCircle2 size={24} />
          </div>
          <h3 className="font-semibold font-display text-text-main">Status Iuran</h3>
          <p className="text-xl font-medium text-primary mt-3 bg-primary/20 px-3 py-1 rounded-full">Lunas (Okt)</p>
        </div>
      </div>

      <div className="pt-8">
        <StorageTab />
      </div>
    </div>
  );
}

function LettersTab({ letters, onLetterAdded }: { letters: any[], onLetterAdded: (l: any) => void }) {
  const [profileName, setProfileName] = useState(() => {
    const stored = localStorage.getItem("user-profile");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.name || "Bpk. Rahardian";
      } catch (e) {
        return "Bpk. Rahardian";
      }
    }
    return "Bpk. Rahardian";
  });

  useEffect(() => {
    const handleUpdate = () => {
      const stored = localStorage.getItem("user-profile");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setProfileName(parsed.name || "Bpk. Rahardian");
        } catch (e) {}
      }
    };
    window.addEventListener("profile-updated", handleUpdate);
    return () => window.removeEventListener("profile-updated", handleUpdate);
  }, []);

  const [type, setType] = useState("Surat Pengantar Domisili");
  const [keperluan, setKeperluan] = useState("");
  const [showOtherOptions, setShowOtherOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const mainLetterTypes = [
    { id: "Surat Pengantar Domisili", label: "Domisili", icon: <MapPin size={24} />, color: "bg-blue-50 text-blue-600 border-blue-100" },
    { id: "Surat Keterangan Usaha", label: "Usaha (SKU)", icon: <Briefcase size={24} />, color: "bg-orange-50 text-orange-600 border-orange-100" },
    { id: "Surat Keterangan Tidak Mampu (SKTM)", label: "SKTM", icon: <HelpingHand size={24} />, color: "bg-green-50 text-green-600 border-green-100" },
    { id: "Surat Pengantar Nikah (N1-N4)", label: "P. Nikah", icon: <Heart size={24} />, color: "bg-rose-50 text-rose-600 border-rose-100" },
    { id: "Surat Keterangan Pindah Domisili", label: "Pindah", icon: <Truck size={24} />, color: "bg-purple-50 text-purple-600 border-purple-100" },
    { id: "Lainnya", label: "Lainnya", icon: <MoreHorizontal size={24} />, color: "bg-gray-50 text-gray-600 border-gray-100" },
  ];

  const otherLetterTypes = [
    "Surat Keterangan Kelahiran",
    "Surat Keterangan Kematian",
    "Surat Pengantar SKCK",
    "Surat Keterangan Penghasilan",
    "Surat Keterangan Belum Menikah",
  ];

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const handleTypeSelect = (selectedId: string) => {
    if (selectedId === "Lainnya") {
      setShowOtherOptions(true);
      setType(otherLetterTypes[0]);
    } else {
      setShowOtherOptions(false);
      setType(selectedId);
    }
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

  const handleSubmit = async () => {
    if (!keperluan.trim()) return alert("Keperluan harus diisi!");
    if (!hasSignature) return alert("Mohon berikan tanda tangan digital Anda!");
    setSubmitting(true);
    try {
      const res = await fetch("/api/user/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, keperluan, signature: canvasRef.current?.toDataURL(), name: profileName })
      });
      const newLetter = await res.json();
      onLetterAdded(newLetter);
      setKeperluan("");
      clearSignature();
      alert("Surat berhasil diajukan berserta tanda tangan digital!");
    } catch (e) {
      alert("Gagal mengajukan surat.");
    } finally {
      setSubmitting(false);
    }
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
      ["Nama", `: ${letter.name || profileName}`],
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
    doc.text(`(${letter.name || profileName})`, 30, sigY + 30);

    doc.text("Ketua RT 05,", 140, sigY);
    if (letter.adminSignature) {
      doc.addImage(letter.adminSignature, 'PNG', 135, sigY + 5, 40, 20);
    } else {
      doc.setFontSize(8);
      doc.setTextColor(200, 0, 0);
      doc.text("BELUM DITANDA TANGANI", 135, sigY + 15);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
    }
    doc.text("(..............................)", 140, sigY + 30);

    doc.save(`${letter.type}-${letter.id}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text-main">E-Surat & QR Code</h2>
          <p className="text-sm text-text-muted mt-1">Buat surat pengantar RT/RW secara mandiri tanpa antri.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
         {/* Form Request */}
         <div className="space-y-6">
            <div className="bg-surface p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak">
              <h3 className="font-semibold text-text-main border-b border-border-weak pb-4 mb-4">Form Pengajuan</h3>
              <div className="space-y-6">
                 <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Pilih Jenis Surat</label>
                    <div className="grid grid-cols-3 gap-3">
                       {mainLetterTypes.map((item) => (
                         <button
                           key={item.id}
                           type="button"
                           onClick={() => handleTypeSelect(item.id)}
                           className={cn(
                             "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-2",
                             (type === item.id || (item.id === "Lainnya" && showOtherOptions))
                               ? "border-primary bg-primary/5 shadow-sm scale-[1.02]" 
                               : "border-transparent bg-canvas hover:border-border-strong"
                           )}
                         >
                           <div className={cn("w-12 h-12 rounded-full flex items-center justify-center border", item.color)}>
                              {item.icon}
                           </div>
                           <span className={cn("text-[10px] font-bold uppercase text-center leading-tight transition-colors", (type === item.id || (item.id === "Lainnya" && showOtherOptions)) ? "text-primary" : "text-text-muted")}>
                              {item.label}
                           </span>
                         </button>
                       ))}
                    </div>

                    {showOtherOptions && (
                      <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                        <label className="block text-[10px] font-bold uppercase text-text-muted mb-2 tracking-widest">Surat Lainnya</label>
                        <select 
                          value={type} 
                          onChange={e => setType(e.target.value)}
                          className="w-full bg-canvas border-2 border-primary/30 rounded-lg p-2.5 text-sm outline-none focus:border-primary text-text-main"
                        >
                           {otherLetterTypes.map(ot => (
                             <option style={{ background: 'var(--canvas)', color: 'var(--text-main)' }} key={ot} value={ot}>{ot}</option>
                           ))}
                        </select>
                      </div>
                    )}
                 </div>
                 
                 <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Keperluan</label>
                    <textarea 
                      rows={3} 
                      value={keperluan}
                      onChange={e => setKeperluan(e.target.value)}
                      className="w-full bg-canvas border border-border-strong rounded-lg p-2.5 text-sm outline-none focus:border-primary text-text-main" 
                      placeholder="Tuliskan tujuan pembuatan surat..."></textarea>
                 </div>
                 
                 <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2 flex justify-between">
                       <span>Tanda Tangan Digital Warga</span>
                       <button onClick={clearSignature} type="button" className="text-accent underline lowercase font-normal">Hapus Tanda Tangan</button>
                    </label>
                    <div className="border border-border-strong rounded-lg bg-[#e2e8e2] overflow-hidden">
                      <canvas 
                        ref={canvasRef}
                        width={400}
                        height={120}
                        className="w-full h-[120px] touch-none cursor-crosshair"
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

                 <button 
                   onClick={handleSubmit} 
                   disabled={submitting}
                   className="w-full bg-primary text-text-inverse font-semibold py-3 rounded-lg hover:bg-surface-hover hover:text-text-main transition-colors">
                    {submitting ? "Memproses..." : "Ajukan dengan Tanda Tangan Digital"}
                 </button>
              </div>
           </div>
           
           {/* History */}
           <div className="bg-surface p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak">
              <h3 className="font-semibold text-text-main border-b border-border-weak pb-4 mb-4">Riwayat Pengajuan</h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                 {letters.length === 0 && <p className="text-sm text-text-muted text-center py-4">Belum ada riwayat pengajuan.</p>}
                 {letters.map(letter => (
                   <div key={letter.id} className="flex flex-col p-4 border border-border-weak rounded-xl hover:bg-surface-hover transition-colors overflow-hidden relative">
                     {/* Timeline Lead Time Visualization */}
                     <div className="flex items-center justify-between">
                       <div className="flex-1">
                         <p className="text-sm font-semibold text-text-main">{letter.type}</p>
                         <p className="text-xs text-text-muted mt-0.5">{letter.date} — {letter.keperluan}</p>
                       </div>
                       <div className="flex items-center gap-2">
                          {letter.status === 'approved' && (
                            <button 
                              onClick={() => handleDownloadPDF(letter)}
                              className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                              title="Download PDF"
                            >
                              <Download size={14} />
                            </button>
                          )}
                          {letter.status === 'approved' && <span className="text-[10px] uppercase font-bold px-2 py-1 bg-primary/20 text-primary rounded-md whitespace-nowrap">Selesai / QR Valid</span>}
                          {letter.status === 'pending' && <span className="text-[10px] uppercase font-bold px-2 py-1 bg-accent/20 text-accent rounded-md whitespace-nowrap">Menunggu RT</span>}
                          {letter.status === 'rejected' && <span className="text-[10px] uppercase font-bold px-2 py-1 bg-red-900/40 text-red-400 rounded-md whitespace-nowrap">Ditolak</span>}
                       </div>
                     </div>
                     <div className="mt-4 pt-3 border-t border-border-weak flex justify-between items-center text-xs text-text-muted">
                        <div className="flex gap-2">
                          <span>Status Lead Time:</span>
                          {letter.status === 'approved' ? (
                            <span className="font-mono text-primary font-bold">1 Hari Kerja (Selesai pada {letter.date})</span>
                          ) : letter.status === 'pending' ? (
                            <span className="font-mono text-accent font-bold animate-pulse">Sedang ditinjau Pengurus RT (Estimasi Maksimal: 2 Hari Kerja)</span>
                          ) : (
                            <span className="font-mono text-red-400 font-bold">Ditolak - Pengecekan Sistem (0 Hari)</span>
                          )}
                        </div>
                     </div>
                   </div>
                 ))}
              </div>
           </div>
         </div>

         {/* Preview Area */}
         <div className="bg-[#fdfbf7] text-[#333] p-8 rounded-sm shadow-[0_5px_15px_rgba(0,0,0,0.1)] font-serif h-fit md:sticky top-28 overflow-x-auto">
           <div className="text-center border-b-2 border-[#333] pb-4 mb-6">
             <h3 className="font-bold text-lg uppercase tracking-wider">Rukun Tetangga 05 / Rukun Warga 12</h3>
             <p className="text-sm">Kelurahan Sukamaju, Kecamatan Cibeunying</p>
             <p className="text-xs">Kota Bandung, Jawa Barat</p>
           </div>
           <div className="text-center mb-6">
             <h4 className="font-bold underline uppercase">{type}</h4>
             <p className="text-sm">Nomor: ... / RT.05 / {new Date().getFullYear()}</p>
           </div>
           <div className="space-y-4 text-sm leading-relaxed mb-8">
             <p>Yang bertanda tangan di bawah ini Ketua RT. 05 RW. 12 Kelurahan Sukamaju, menerangkan dengan sebenarnya bahwa:</p>
             <table className="w-full">
               <tbody>
                 <tr><td className="w-32 py-1">Nama</td><td>: Bpk. Rahardian</td></tr>
                 <tr><td className="w-32 py-1">NIK</td><td>: 3273****************</td></tr>
                 <tr><td className="w-32 py-1">Alamat</td><td>: Jl. Merdeka No. 45</td></tr>
               </tbody>
             </table>
             <p>Adalah benar warga yang berdomisili di wilayah RT. 05 / RW. 12. Surat pengantar ini dibuat untuk keperluan:</p>
             <p className="font-semibold px-4 py-2 border border-dashed border-[#ccc] bg-black/5">
                {keperluan || "(Tulis Tujuan di form untuk merubah preview ini)"}
             </p>
             <p>Demikian surat ini dibuat agar dapat dipergunakan sebagaimana mestinya.</p>
           </div>
           
           <div className="flex justify-between mt-12 text-sm text-center">
             <div>
               <p className="mb-16">Pemohon,</p>
               <div className="font-signature text-2xl text-blue-800 opacity-80 -rotate-3 mb-1">~ Rahardian ~</div>
               <p className="underline font-bold">Bpk. Rahardian</p>
             </div>
             <div>
               <p className="mb-20">Ketua RT 05,</p>
               <p className="text-xs text-red-600 border border-red-600 rounded p-1 mb-2 inline-block">Menunggu TTD Digital</p>
               <p className="underline font-bold">Ketua RT 05</p>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
}

function FinanceDuesTab({ data }: { data: any }) {
  const [subTab, setSubTab] = useState<"finance" | "dues" | "donation">("finance");
  const chartData = data.summary || [];
  const details = data.details || [];
  const totalExpense = chartData.reduce((sum: number, item: any) => sum + item.value, 0);

  const [dues, setDues] = useState<any[]>([]);
  const [activeReminder, setActiveReminder] = useState<any>(null);
  const [selectedDue, setSelectedDue] = useState<any>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  
  // Payment Form States
  const [bankName, setBankName] = useState("QRIS");
  const [senderName, setSenderName] = useState("");
  const [transferDate, setTransferDate] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [submittingPayment, setSubmittingPayment] = useState(false);

  useEffect(() => {
    fetch('/api/user/dues')
      .then(r => r.json())
      .then(data => {
        setDues(data);
      });
    
    // Check if we have reminders in the system
    fetch('/api/admin/residents')
      .then(r => r.json())
      .then(resList => {
        const userRes = resList.find((r: any) => r.id === "RES-01");
        if (userRes && userRes.reminders && userRes.reminders.length > 0) {
          setActiveReminder(userRes.reminders[0]);
        }
      })
      .catch(() => {});
  }, []);

  const openPaymentForm = (due: any) => {
    setSelectedDue(due);
    setTransferAmount(due.amount.toString());
    setTransferDate(new Date().toISOString().split('T')[0]);
    setShowPayModal(true);
  };

  const handleProofImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelPayment = () => {
    setShowPayModal(false);
    setSelectedDue(null);
    setProofImage(null);
    setSenderName("");
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName) return alert("Pilih bank pengirim!");
    if (!senderName) return alert("Isi nama pengirim!");
    if (!transferDate) return alert("Pilih tanggal transfer!");
    if (!transferAmount) return alert("Nominal tidak valid!");
    
    setSubmittingPayment(true);
    setTimeout(() => {
      setSubmittingPayment(false);
      setShowPayModal(false);
      setSelectedDue(null);
      setProofImage(null);
      
      fetch('/api/user/dues').then(r => r.json()).then(setDues);
      alert("Pembayaran berhasil disubmit dan menunggu validasi Bendahara/Admin!");
    }, 1500);
  };

  const allPaid = dues.every(d => d.status === "paid");

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text-main">Keuangan & Iuran</h2>
          <p className="text-sm text-text-muted mt-1">Laporan transparansi kas warga dan pembayaran iuran bulanan.</p>
        </div>
      </div>

      <div className="flex border-b border-border-weak">
        <button 
          onClick={() => setSubTab("finance")}
          className={cn(
            "py-3 px-6 text-sm font-semibold border-b-2 transition-colors cursor-pointer",
            subTab === "finance" ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text-main"
          )}
        >
          Transparansi Kas 
        </button>
        <button 
          onClick={() => setSubTab("dues")}
          className={cn(
            "py-3 px-6 text-sm font-semibold border-b-2 transition-colors cursor-pointer",
            subTab === "dues" ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text-main"
          )}
        >
          Iuran Warga
        </button>
        <button 
          onClick={() => setSubTab("donation")}
          className={cn(
            "py-3 px-6 text-sm font-semibold border-b-2 transition-colors cursor-pointer",
            subTab === "donation" ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text-main"
          )}
        >
          Donasi & Bantuan Sosial
        </button>
      </div>

      {subTab === "finance" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="bg-surface p-5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Saldo Kas Saat Ini</p>
                <p className="text-2xl font-display font-bold text-text-main">Rp 12.550.000</p>
             </div>
             <div className="bg-surface p-5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak text-primary">
                <p className="text-xs font-semibold uppercase tracking-wider mb-1">Total Pemasukan (Okt)</p>
                <p className="text-2xl font-display font-bold">+ Rp 2.400.000</p>
             </div>
             <div className="bg-surface p-5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak text-accent">
                <p className="text-xs font-semibold uppercase tracking-wider mb-1">Total Pengeluaran (Okt)</p>
                <p className="text-2xl font-display font-bold">- Rp {totalExpense.toLocaleString('id-ID')}</p>
             </div>
             <div className="bg-surface p-5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Warga Terdaftar</p>
                <p className="text-2xl font-display font-bold text-text-main">120 KK</p>
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
             <div className="bg-surface p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak">
                <h3 className="font-semibold text-text-main mb-4">Grafik Penggunaan Dana</h3>
                <div className="h-[300px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--border-strong)" strokeWidth={2} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value: number) => {
                          const percent = ((value / totalExpense) * 100).toFixed(1);
                          return [`${percent}%`, "Persentase"];
                        }}
                      />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 text-center pointer-events-none">
                     <p className="text-[10px] uppercase font-bold text-text-muted">Total Pengeluaran</p>
                     <p className="text-lg font-bold text-text-main">Rp {(totalExpense/1000).toFixed(0)}k</p>
                  </div>
                </div>
             </div>

             <div className="bg-surface p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak">
                <h3 className="font-semibold text-text-main mb-4">Rincian Pengeluaran Bulanan</h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                   {chartData.map((item: any, idx: number) => (
                     <div key={idx} className="flex items-center justify-between p-3 border border-border-weak rounded-xl">
                        <div className="flex items-center gap-3">
                           <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                           <span className="text-sm font-medium text-text-main">{item.name}</span>
                        </div>
                        <span className="text-sm font-bold text-text-main">Rp {item.value.toLocaleString('id-ID')}</span>
                     </div>
                   ))}
                   <div className="pt-4 border-t border-border-strong flex justify-between items-center">
                      <span className="font-bold text-text-main uppercase text-xs">Total Dana Operasional</span>
                      <span className="font-bold text-accent">Rp {totalExpense.toLocaleString('id-ID')}</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-surface p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak">
             <h3 className="font-semibold text-text-main mb-6">Bukti Pengeluaran (Kwitansi Digital)</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {details.map((item: any) => (
                   <div key={item.id} className="border border-border-weak rounded-xl overflow-hidden hover:border-primary transition-all group">
                      <div className="relative h-32 overflow-hidden bg-canvas">
                         <img src={item.proof} alt="Proof" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                         <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-[10px] font-bold rounded uppercase">Kwitansi Valid</div>
                      </div>
                      <div className="p-4">
                         <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-sm text-text-main">{item.desc}</h4>
                            <span className="text-[10px] font-bold text-accent">-{item.amount/1000}k</span>
                         </div>
                         <p className="text-[10px] text-text-muted uppercase tracking-wider">{item.category} • {item.date}</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>
      )}

      {subTab === "dues" && (
        <div className="space-y-6">
          {activeReminder && (
            <div className="bg-accent/10 border border-accent/20 p-5 rounded-2xl flex gap-4 items-start shadow-sm mt-4">
              <div className="bg-white/20 p-2 rounded-full text-accent shrink-0">
                <AlertCircle size={24} />
              </div>
              <div className="space-y-1 pt-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-accent">Notifikasi dari Admin RT: {activeReminder.title}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-accent text-white px-2 py-0.5 rounded-full">{activeReminder.date}</span>
                </div>
                <p className="text-sm text-text-main/80 pt-1 leading-relaxed">Pesan: "{activeReminder.message}"</p>
                <div className="pt-3">
                   <button className="bg-surface border border-border-strong px-4 py-2 text-xs font-bold rounded-lg hover:bg-surface-hover text-text-main shadow-sm" onClick={() => setActiveReminder(null)}>Tutup Pemberitahuan</button>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {dues.map((due: any) => (
              <div key={due.id} className="bg-surface p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak relative overflow-hidden group hover:border-primary/50 transition-colors">
                {due.status === "paid" && (
                  <div className="absolute top-0 right-0 bg-primary text-text-inverse px-4 py-1.5 rounded-bl-2xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <CheckCircle2 size={12} /> Lunas
                  </div>
                )}
                {due.status === "unpaid" && (
                  <div className="absolute top-0 right-0 bg-accent text-text-inverse px-4 py-1.5 rounded-bl-2xl text-[10px] font-bold uppercase tracking-wider shadow-sm animate-pulse">
                    Jatuh Tempo
                  </div>
                )}
                
                <p className="text-[#fb923c] font-black uppercase text-[10px] tracking-widest bg-accent-light/10 w-fit px-2 py-0.5 rounded">Tagihan Iuran</p>
                <h3 className="text-xl font-display font-bold text-text-main mt-2 border-b border-border-weak pb-4">
                  Bulan {due.month} {due.year}
                </h3>
                
                <div className="py-4 space-y-2 text-sm text-text-muted">
                  <p className="flex justify-between items-center bg-canvas p-2 rounded border border-border-weak"><span>Kode Tagihan:</span> <span className="font-mono text-text-main font-bold">INV-{due.month.substring(0,3).toUpperCase()}{due.year}</span></p>
                  
                  {due.categories && due.categories.length > 0 && (
                    <div className="bg-canvas border border-border-weak rounded p-3 mt-2 space-y-2">
                      <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider border-b border-border-weak pb-1">Rincian Iuran</p>
                      <div className="space-y-1">
                        {due.categories.map((cat: any, i: number) => (
                          <div key={i} className="flex justify-between items-center text-xs">
                            <span>{cat.name}</span>
                            <span className="font-mono font-bold">Rp {cat.amount.toLocaleString('id-ID')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="flex justify-between items-center text-lg mt-3 text-text-main border-t border-border-weak pt-3"><span className="font-semibold text-sm">Total Tagihan:</span> <span className="font-bold font-display">Rp {due.amount.toLocaleString('id-ID')}</span></p>
                </div>
                
                {due.status === "unpaid" ? (
                  <button 
                    onClick={() => openPaymentForm(due)}
                    className="w-full bg-accent text-text-inverse py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 mt-2 hover:bg-accent/90 shadow-lg shadow-accent/20 cursor-pointer"
                  >
                    <CreditCard size={18} /> Bayar Tagihan
                  </button>
                ) : (
                  <button disabled className="w-full bg-canvas text-primary font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 mt-2 border border-primary/20 opacity-80">
                    <CheckCircle2 size={18} /> Tagihan Selesai
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="bg-primary/10 border border-primary/20 p-5 text-sm rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between text-text-main shadow-sm">
            <div className="flex gap-4 items-center">
               <div className="bg-primary p-2 rounded-full text-white">
                  <ShieldAlert size={20} />
               </div>
               <div>
                 <p className="font-bold underline decoration-primary underline-offset-4">Tata Cara Pembayaran</p>
                 <p className="text-text-muted mt-1 text-xs">Simpan bukti transfer dan unggah pada menu pembayaran. Proses validasi oleh RT/Bendahara memakan waktu maks. 1x24 jam kerja.</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {subTab === "donation" && <DonationSection />}

      {showPayModal && selectedDue && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-sidebar border border-border-weak rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-200">
            <button 
              onClick={handleCancelPayment}
              className="absolute top-6 right-6 text-text-muted hover:text-text-main"
            >
              <Plus size={24} className="rotate-45" />
            </button>
            <h3 className="text-xl font-bold text-text-main mb-1 font-display">Bayar Iuran {selectedDue.month} {selectedDue.year}</h3>
            <p className="text-xs text-text-muted font-mono bg-canvas inline-block px-2 py-1 rounded border border-border-weak mt-1">INV-{selectedDue.month.substring(0,3).toUpperCase()}{selectedDue.year}</p>
            
            <form onSubmit={handleSubmitPayment} className="mt-6 space-y-4">
               <div>
                  <label className="block text-xs font-bold uppercase text-text-muted tracking-wide mb-2">Informasi Rekening Tujuan</label>
                  <div className="bg-canvas border border-border-strong rounded-xl p-4 flex flex-col gap-3">
                     <div>
                       <p className="text-xs text-text-muted font-bold">Bank BCA</p>
                       <p className="text-lg font-mono font-bold text-text-main bg-primary/10 py-1 px-2 rounded w-fit">832-123-4567</p>
                       <p className="text-xs text-text-main font-semibold mt-1">a.n Bendahara RT 05 - Budi Santoso</p>
                     </div>
                     <div className="border-t border-border-weak pt-3">
                       <p className="text-xs text-text-muted font-bold">Bank Mandiri</p>
                       <p className="text-lg font-mono font-bold text-text-main bg-primary/10 py-1 px-2 rounded w-fit">130-00-1234567-8</p>
                       <p className="text-xs text-text-main font-semibold mt-1">a.n Kas RT 05 / SmartWarga</p>
                     </div>
                  </div>
               </div>

               <div>
                  <label className="block text-xs font-bold uppercase text-text-muted tracking-wide mb-2">Pilih Metode Pembayaran Anda</label>
                  <select 
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                    style={{ background: 'var(--canvas)', color: 'var(--text-main)' }}
                    className="w-full border border-border-strong rounded-xl p-3 text-sm outline-none focus:border-primary cursor-pointer font-semibold shadow-sm"
                  >
                    <option style={{ background: 'var(--canvas)', color: 'var(--text-main)' }} value="QRIS">QRIS Auto-Scan (Semua Bank & E-Wallet)</option>
                    <option style={{ background: 'var(--canvas)', color: 'var(--text-main)' }} value="BCA">Transfer Rekening BCA</option>
                    <option style={{ background: 'var(--canvas)', color: 'var(--text-main)' }} value="MANDIRI">Transfer Rekening MANDIRI</option>
                  </select>
               </div>

               {bankName === "QRIS" && (
                 <div className="bg-canvas border border-border-strong rounded-xl p-6 flex flex-col items-center justify-center text-center">
                    <p className="text-xs font-bold text-text-muted mb-4 uppercase tracking-widest">Pindai QR Dibawah Ini</p>
                    <img src="https://images.unsplash.com/photo-1613994344079-c5bda29c4263?auto=format&fit=crop&q=80&w=200&h=200" alt="QRIS" className="w-40 h-40 object-cover rounded-lg border-4 border-white shadow-lg mb-4" />
                    <p className="text-sm font-bold text-text-main">MANDIRI - RT 05 SMARTWARGA</p>
                    <p className="text-xs text-text-muted font-mono mt-1">NMID: ID203912039103901</p>
                 </div>
               )}

               {bankName !== "QRIS" && (
                 <div>
                    <label className="block text-xs font-bold uppercase text-text-muted tracking-wide mb-2">Nama Pengirim (A.N. Rekening Anda)</label>
                    <input 
                      type="text"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={senderName}
                      onChange={e => setSenderName(e.target.value)}
                      className="w-full bg-surface border border-border-strong rounded-xl p-3 text-sm text-text-main outline-none focus:border-primary shadow-sm"
                    />
                 </div>
               )}

               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold uppercase text-text-muted tracking-wide mb-2">Tgl Transfer</label>
                    <input 
                      type="date"
                      required
                      value={transferDate}
                      onChange={e => setTransferDate(e.target.value)}
                      className="w-full bg-surface border border-border-strong rounded-xl p-3 text-sm text-text-main outline-none focus:border-primary shadow-sm"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold uppercase text-text-muted tracking-wide mb-2">Nominal transfer (Rp)</label>
                    <input 
                      type="number"
                      required
                      readOnly
                      value={transferAmount}
                      className="w-full bg-surface border border-border-strong rounded-xl p-3 text-sm text-text-main outline-none focus:border-primary font-mono shadow-sm opacity-80"
                    />
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-bold uppercase text-text-muted tracking-wide mb-2">Unggah Resi / Bukti Transfer</label>
                 <div className="w-full bg-surface border-2 border-dashed border-border-strong rounded-xl p-4 text-center hover:bg-surface-hover transition-colors cursor-pointer relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleProofImageChange}
                      required
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {proofImage ? (
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle2 className="text-primary" />
                        <span className="text-xs text-text-main font-bold">Bukti Tembahan (Berhasil)</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-text-muted">
                        <Upload size={20} />
                        <span className="text-xs font-bold">Tap untuk pilih foto/gambar.</span>
                      </div>
                    )}
                 </div>
               </div>

               <div className="pt-4 flex gap-3">
                 <button 
                  type="button"
                  onClick={handleCancelPayment}
                  className="w-full border border-border-strong py-2.5 rounded-xl font-bold text-text-main hover:bg-surface-hover transition-colors shadow-sm"
                 >
                   Batal
                 </button>
                 <button 
                  type="submit"
                  disabled={submittingPayment}
                  className="w-full bg-primary py-2.5 rounded-xl font-bold text-text-inverse shadow-primary/20 shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                 >
                   {submittingPayment ? "Mengunggah..." : "Kirim Resi"}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StorageTab() {
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);

  const simulateOCR = () => {
    setOcrScanning(true);
    // Simulate network delay for OCR
    setTimeout(() => {
      setOcrScanning(false);
      setOcrResult({
        nik: "3273112345678900",
        name: "Budi Santoso",
        alamat: "Jl. Merdeka No. 45, RT 04 RW 02",
        agama: "Islam",
        status: "Kawin"
      });
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-semibold text-text-main">Brankas Digital & Smart OCR</h2>
        <p className="text-sm text-text-muted mt-1">Simpan ID Card Anda dengan aman. Sistem OCR otomatis membaca data.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
           <div className="bg-surface border-2 border-dashed border-border-strong rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-colors hover:bg-surface-hover">
              <div className="w-16 h-16 bg-primary/20 text-text-main rounded-full flex items-center justify-center mb-4">
                 {ocrScanning ? <Camera size={28} className="animate-pulse" /> : <Upload size={28} />}
              </div>
              <p className="font-semibold text-text-main mb-1">Unggah KTP / KK</p>
              <p className="text-xs text-text-muted mb-6 max-w-[200px]">Format JPG/PNG maks 5MB. AI akan mengekstrak teks otomatis.</p>
              <button 
                onClick={simulateOCR} 
                disabled={ocrScanning}
                className={cn("px-6 py-2.5 rounded-full font-medium text-sm transition-colors", ocrScanning ? "bg-black/10 text-black/50" : "bg-primary text-white hover:bg-surface")}
              >
                {ocrScanning ? "Memindai dengan AI..." : "Pilih File Dokumen"}
              </button>
           </div>
           
           {ocrResult && (
             <div className="bg-surface border border-primary p-5 rounded-xl animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center gap-2 mb-3 text-text-main pb-2 border-b border-border-strong">
                   <CheckCircle2 size={18} className="text-primary" />
                   <span className="font-semibold text-sm">Ekstraksi OCR Berhasil</span>
                </div>
                <div className="space-y-2 text-sm">
                   <div className="grid grid-cols-3 gap-2"><span className="text-text-muted uppercase tracking-widest text-[10px] font-bold">NIK</span><span className="col-span-2 font-mono font-medium text-text-main">{ocrResult.nik}</span></div>
                   <div className="grid grid-cols-3 gap-2"><span className="text-text-muted uppercase tracking-widest text-[10px] font-bold">Nama</span><span className="col-span-2 font-medium text-text-main">{ocrResult.name}</span></div>
                   <div className="grid grid-cols-3 gap-2"><span className="text-text-muted uppercase tracking-widest text-[10px] font-bold">Alamat</span><span className="col-span-2 text-text-main text-xs">{ocrResult.alamat}</span></div>
                </div>
             </div>
           )}
        </div>

        <div className="bg-surface p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak">
          <h3 className="font-semibold text-text-main mb-4">Dokumen Tersimpan</h3>
          <div className="space-y-3">
             <div className="flex items-center justify-between p-3 border border-border-weak rounded-xl bg-canvas">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-primary/20 text-text-main rounded-lg flex items-center justify-center">
                     <FileCheck size={20} />
                   </div>
                   <div>
                     <p className="text-sm font-semibold text-text-main">Scan KTP Budi.jpg</p>
                     <p className="text-[10px] text-text-muted mt-0.5">Diverifikasi 12 Okt, 2.4MB</p>
                   </div>
                </div>
                <button className="text-text-muted hover:text-text-main"><Download size={18} /></button>
             </div>
             <div className="flex items-center justify-between p-3 border border-border-weak rounded-xl bg-canvas">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-primary/20 text-text-main rounded-lg flex items-center justify-center">
                     <FileCheck size={20} />
                   </div>
                   <div>
                     <p className="text-sm font-semibold text-text-main">Kartu Keluarga.pdf</p>
                     <p className="text-[10px] text-text-muted mt-0.5">Diverifikasi 10 Okt, 1.1MB</p>
                   </div>
                </div>
                <button className="text-text-muted hover:text-text-main"><Download size={18} /></button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PanicTab() {
  const [clicked, setClicked] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdIntervalRef = React.useRef<any>(null);

  const startHolding = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (clicked) return;
    setIsHolding(true);
    setHoldProgress(0);
    const startTime = Date.now();
    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / 3000) * 100, 100);
      setHoldProgress(progress);
      if (progress >= 100) {
        setClicked(true);
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
    <div className="flex flex-col items-center justify-center text-center h-[calc(100vh-12rem)] max-h-[600px] border border-accent/20 bg-accent/5 rounded-3xl p-6 animate-in fade-in duration-300">
      <h2 className="text-3xl font-display font-bold text-text-main mb-2">Darurat Lingkungan?</h2>
      <p className="text-text-muted mb-12 max-w-md">Tahan tombol merah di bawah selama 3 detik untuk mengaktifkan sirine pos satpam dan mengirim broadcast darurat.</p>
      
      <div className="relative">
        <button 
          onMouseDown={startHolding}
          onMouseUp={stopHolding}
          onMouseLeave={stopHolding}
          onTouchStart={startHolding}
          onTouchEnd={stopHolding}
          disabled={clicked}
          style={{
            background: isHolding
              ? `linear-gradient(135deg, #b91c1c ${holdProgress}%, #ef4444 ${holdProgress}%)`
              : undefined
          }}
          className={cn(
            "relative w-56 h-56 rounded-full flex items-center justify-center text-white transition-all shadow-xl shadow-red-600/30 select-none touch-none cursor-pointer",
            clicked ? "bg-red-700 scale-95 cursor-default" : "bg-red-600 hover:scale-105 active:scale-95"
          )}
        >
          {clicked && (
             <span className="absolute w-full h-full rounded-full border-4 border-red-500 animate-ping"></span>
          )}
          {isHolding && (
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
              <circle
                cx="50%"
                cy="50%"
                r="46%"
                fill="none"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="6"
              />
              <circle
                cx="50%"
                cy="50%"
                r="46%"
                fill="none"
                stroke="white"
                strokeWidth="6"
                strokeDasharray="100 100"
                strokeDashoffset={100 - holdProgress}
                pathLength="100"
                className="transition-all duration-75"
              />
            </svg>
          )}
          <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
            {clicked ? <PhoneCall size={64} className="animate-bounce" /> : <AlertCircle size={64} className={isHolding ? "animate-pulse" : ""} />}
            <span className="font-display font-bold text-2.5xl uppercase tracking-widest leading-none">
              {clicked ? "Terkirim!" : isHolding ? `${3 - Math.floor((holdProgress / 100) * 3)}s` : "PANIC"}
            </span>
            {!clicked && (
              <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
                {isHolding ? "Jangan Lepas" : "Tahan 3 Detik"}
              </span>
            )}
          </div>
        </button>
      </div>

      {clicked && (
        <div className="mt-8 space-y-2 border-t border-border-weak pt-8 w-full max-w-lg">
          <div className="px-6 py-3 bg-red-600/20 border border-red-500 text-red-500 font-semibold rounded-full text-sm flex items-center justify-center gap-2 animate-in fade-in zoom-in shadow-xl shadow-red-500/20">
             <AlertTriangle size={18} /> Sirine Pos Satpam Telah Diaktifkan Ke Poskamling RW 12!
          </div>
          <div className="px-6 py-3 bg-accent/20 border border-accent/50 text-accent font-semibold rounded-full text-sm flex items-center justify-center gap-2 animate-in fade-in zoom-in shadow-sm">
             <MapPin size={18} /> Lokasi akurat (Jl. Merdeka No. 45) terkirim via Push Notifikasi WhatsApp Pengurus.
          </div>
          <div className="px-6 py-3 bg-primary/20 border border-primary/50 text-primary font-semibold rounded-full text-sm flex items-center justify-center gap-2 animate-in fade-in zoom-in shadow-sm">
             <Camera size={18} /> Sistem mengaktifkan koneksi ke CCTV terdekat (CCTV-04 Blok B).
          </div>
          <button 
            onClick={() => setClicked(false)} 
            className="mt-6 inline-block text-xs font-bold text-text-muted hover:text-text-main hover:underline transition-colors cursor-pointer"
          >
            Mematikan Tanda Bahaya (Reset)
          </button>
        </div>
      )}
    </div>
  );
}

function ReportingTab({ setTab }: { setTab: (tab: string) => void }) {
  const [reports, setReports] = useState<any[]>([]);
  const [subTab, setSubTab] = useState<"create" | "public">("create");
  
  // Wizard States
  const [step, setStep] = useState(1);
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Infrastruktur");
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  
  const [submitting, setSubmitting] = useState(false);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [analyzingLocation, setAnalyzingLocation] = useState(false);
  const [analyzingCategory, setAnalyzingCategory] = useState(false);
  const [aiStatus, setAiStatus] = useState("Menunggu unggahan foto...");

  useEffect(() => {
    fetch('/api/user/reports').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setReports(data);
      else setReports([]);
    }).catch(() => setReports([]));
  }, []);

  const triggerAIAnalysis = async (imgData: string) => {
    setAnalyzingImage(true);
    setAiStatus("Membaca data biner gambar...");
    
    const statuses = [
      "Mengaktifkan modul Computer Vision RT-AI...",
      "Membaca koordinat piksel & anomali kontras...",
      "Mengidentifikasi objek kerusakan atau sampah...",
      "Mencocokkan titik kerusakan dengan zonasi RT 05...",
      "Mengklasifikasikan kategori (Kebersihan / Infrastruktur / Keamanan)...",
      "Merumuskan usulan draf judul dan perbaikan otomatis...",
      "Menyelesaikan draf analisis foto..."
    ];
    
    let statusIdx = 0;
    const interval = setInterval(() => {
      if (statusIdx < statuses.length) {
        setAiStatus(statuses[statusIdx]);
        statusIdx++;
      }
    }, 700);

    try {
      const res = await fetch("/api/user/reports/analyze-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imgData })
      });
      
      const locationsRT05 = [
        "Jl. Merdeka RT 05 / RW 12 (Dekat Pos Ronda Utama)",
        "Jl. Kenanga Blok C No. 14, RT 05 / RW 12",
        "Jl. Melati RT 05 / RW 12 (Samping Lapangan Olahraga)",
        "Area Fasilitas Umum Blok D No. 22, RT 05 / RW 12"
      ];
      const randomLoc = locationsRT05[Math.floor(Math.random() * locationsRT05.length)];

      if (res.ok) {
        const data = await res.json();
        if (data.title) setTitle(data.title);
        
        if (data.category) {
          const catLower = data.category.toLowerCase();
          if (catLower.includes("infrastruktur")) setCategory("Infrastruktur");
          else if (catLower.includes("bersih") || catLower.includes("sampah") || catLower.includes("kebersihan")) setCategory("Kebersihan");
          else if (catLower.includes("aman") || catLower.includes("tertib") || catLower.includes("keamanan")) setCategory("Keamanan");
          else setCategory("Lainnya");
        }

        // Delay the transition so the user sees step 1 completion, then go to step 2 with location loader
        setTimeout(() => {
          clearInterval(interval);
          setAnalyzingImage(false);
          setStep(2);
          setAnalyzingLocation(true);

          // Simulate AI location tracking
          setTimeout(() => {
            setLocation(randomLoc);
            setAnalyzingLocation(false);
          }, 3500);
        }, 5200);

      } else {
        // Fallback standard values on failure
        setTitle("Laporan Temuan Masalah Lingkungan");
        setCategory("Infrastruktur");
        
        setTimeout(() => {
          clearInterval(interval);
          setAnalyzingImage(false);
          setStep(2);
          setAnalyzingLocation(true);
          setTimeout(() => {
            setLocation(randomLoc);
            setAnalyzingLocation(false);
          }, 3500);
        }, 5200);
      }
    } catch (e) {
      console.error("AI photo analysis error:", e);
      setTitle("Laporan Temuan Masalah Lingkungan");
      setCategory("Infrastruktur");
      const locationsRT05 = [
        "Jl. Merdeka RT 05 / RW 12 (Dekat Pos Ronda Utama)",
        "Jl. Kenanga Blok C No. 14, RT 05 / RW 12",
        "Jl. Melati RT 05 / RW 12 (Samping Lapangan Olahraga)",
        "Area Fasilitas Umum Blok D No. 22, RT 05 / RW 12"
      ];
      const randomLoc = locationsRT05[Math.floor(Math.random() * locationsRT05.length)];
      
      setTimeout(() => {
        clearInterval(interval);
        setAnalyzingImage(false);
        setStep(2);
        setAnalyzingLocation(true);
        setTimeout(() => {
          setLocation(randomLoc);
          setAnalyzingLocation(false);
        }, 3500);
      }, 5200);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Str = reader.result as string;
        setImage(base64Str);
        // Automatically trigger AI automated image analysis!
        triggerAIAnalysis(base64Str);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Str = reader.result as string;
        setImage(base64Str);
        triggerAIAnalysis(base64Str);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReport = async () => {
    if (!title) {
      alert("Masukkan judul laporan!");
      return;
    }
    if (!location) {
      alert("Tentukan lokasi laporan!");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/user/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, location, image, isPublic, category })
      });
      if (res.ok) {
        const newReport = await res.json();
        setReports([newReport, ...reports]);
        
        // Trigger standard notification for reporting
        await fetch("/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Laporan Baru Diterima",
            message: `Laporan Anda '${title}' berhasil dikirim ke Pengurus wilayah.`,
            category: "letter"
          })
        });

        setStep(5); // Go to success step!
      } else {
        alert("Gagal mengirim laporan.");
      }
    } catch (e) {
      console.error(e);
      alert("Gagal mengirim laporan.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetWizard = () => {
    setImage(null);
    setLocation("");
    setCategory("Infrastruktur");
    setTitle("");
    setIsPublic(true);
    setStep(1);
  };

  const filteredPublicReports = Array.isArray(reports) ? reports.filter(r => r.isPublic) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border-weak pb-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text-main">E-Reporting</h2>
          <p className="text-sm text-text-muted mt-1">Lapor masalah lingkungan & pantau aduan warga secara transparan.</p>
        </div>
        
        <div className="flex bg-surface rounded-xl p-1 border border-border-weak">
          <button 
            onClick={() => setSubTab("create")}
            className={cn(
              "px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5", 
              subTab === "create" ? "bg-primary text-text-inverse shadow-sm" : "text-text-muted hover:text-text-main"
            )}
          >
            <Plus size={14} /> Lapor Masalah
          </button>
          <button 
            onClick={() => setSubTab("public")}
            className={cn(
              "px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5", 
              subTab === "public" ? "bg-primary text-text-inverse shadow-sm" : "text-text-muted hover:text-text-main"
            )}
          >
            <Users size={14} /> Laporan Warga Lain
          </button>
        </div>
      </div>

      {subTab === "create" ? (
        <div className="max-w-3xl mx-auto space-y-8 py-4">
          
          {/* STEP INDICATORS HEADER MATCHING SCREENSHOT */}
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold font-display text-text-main self-start mb-6">Lapor Masalah</h3>
            
            {/* Steps Row */}
            <div className="relative w-full flex items-start justify-between px-4 sm:px-12 mb-8">
              
              {/* Connecting line background with high-fidelity animated progress */}
              <div className="absolute left-[2.25rem] right-[2.25rem] sm:left-[4.25rem] sm:right-[4.25rem] top-5 h-[4px] bg-[#1a3832] [.light_&]:bg-primary/25 rounded-full z-0 overflow-hidden">
                <motion.div 
                  className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((step - 1) / 4) * 100}%` }}
                  transition={{ type: "spring", stiffness: 60, damping: 13 }}
                />
              </div>

              {[
                { number: 1, label: "Foto" },
                { number: 2, label: "Lokasi" },
                { number: 3, label: "Kategori" },
                { number: 4, label: "Tinjau" },
                { number: 5, label: "Selesai" }
              ].map((s) => {
                const isActive = step === s.number;
                const isCompleted = step > s.number;
                return (
                  <div key={s.number} className="flex flex-col items-center flex-1 relative z-10">
                    <button
                      type="button"
                      disabled={s.number > step && s.number !== 5}
                      onClick={() => s.number < step && setStep(s.number)}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 relative z-10",
                        isActive 
                          ? "bg-primary text-text-inverse ring-4 ring-primary/20 scale-110 shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" 
                          : isCompleted 
                            ? "bg-[#0a1311] [.light_&]:bg-[#f4f6f5] text-primary border-2 border-primary cursor-pointer" 
                            : "bg-[#0a1311] [.light_&]:bg-[#f4f6f5] border border-border-strong/50 text-text-muted cursor-not-allowed"
                      )}
                    >
                      {isCompleted && s.number !== 5 ? "✓" : s.number}
                    </button>
                    <span 
                      className={cn(
                        "text-[11px] font-semibold mt-2 transition-all",
                        isActive ? "text-primary font-bold" : isCompleted ? "text-text-main/80" : "text-text-muted"
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MAIN WIZARD CONTAINER CARD */}
          <div className="bg-[#0c1614] [.light_&]:bg-[#f2fbf7] border border-border-strong/30 [.light_&]:border-primary/25 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden text-text-main">
            
            {/* Subtle mesh background effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full filter blur-3xl pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 relative z-10"
              >
                {/* STEP 1: UPLOAD FOTO */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-text-main font-display">Unggah Foto Masalah</h4>
                      <p className="text-xs text-text-muted/80 mt-1 leading-relaxed">
                        Ambil foto yang jelas. AI kami akan menganalisis, mengusulkan kategori, lokasi, rincian otomatis, dan langsung membawa Anda ke tahap peninjauan.
                      </p>
                    </div>

                    {/* Drag & Drop Area */}
                    <div 
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className="border-2 border-primary/20 border-dashed rounded-2xl bg-canvas/30 hover:bg-canvas/50 transition-all p-8 flex flex-col items-center justify-center text-center cursor-pointer relative group min-h-[220px]"
                    >
                      <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        id="reporting-photo-input"
                      />

                      {analyzingImage ? (
                        <div className="space-y-6 py-6 px-4 w-full flex flex-col items-center justify-center animate-in fade-in duration-300">
                          {/* Outer scanning visualizer box */}
                          <div className="relative w-44 h-28 border border-primary/30 rounded-xl bg-primary/5 overflow-hidden flex items-center justify-center">
                            
                            {/* Tech Corner Brackets */}
                            <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-primary" />
                            <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-primary" />
                            <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-primary" />
                            <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-primary" />
                            
                            {/* Sci-Fi Grid Overlay */}
                            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#4ade80_1px,transparent_1px),linear-gradient(to_bottom,#4ade80_1px,transparent_1px)] bg-[size:10px_10px]" />
                            
                            {/* Moving Laser Scanning Line */}
                            <motion.div 
                              className="absolute left-0 right-0 h-0.5 bg-primary/70 shadow-[0_0_8px_#4ade80] z-10"
                              animate={{ top: ["5%", "95%", "5%"] }}
                              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                            />
                            
                            {/* Futuristic pulse icon */}
                            <div className="relative z-0 text-primary animate-pulse text-xs font-mono font-bold tracking-widest bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-md">
                              AI SCANNING
                            </div>
                          </div>

                          {/* Dynamic status feedback */}
                          <div className="text-center space-y-1.5 max-w-xs">
                            <p className="text-sm text-primary font-bold tracking-wide animate-pulse">Menganalisis Keluhan Anda...</p>
                            <p className="text-[11px] text-text-muted font-mono h-4 overflow-hidden text-ellipsis whitespace-nowrap">
                              {aiStatus}
                            </p>
                          </div>
                        </div>
                      ) : image ? (
                        <div className="space-y-4">
                          <div className="relative inline-block border border-border-strong rounded-xl overflow-hidden shadow-lg">
                            <img src={image} alt="Upload Preview" className="max-h-48 w-auto rounded-xl" />
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setImage(null);
                              }}
                              className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors shadow-md cursor-pointer"
                              id="btn-remove-report-photo"
                            >
                              ✕
                            </button>
                          </div>
                          <p className="text-xs text-primary font-bold">✓ Foto berhasil diunggah dan dianalisis AI</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto border border-primary/25 group-hover:scale-105 transition-transform duration-300">
                            <Camera size={26} />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-text-main">Ketuk atau seret untuk ambil / unggah foto</p>
                            <p className="text-xs text-text-muted mt-1">JPG / PNG • maks 10 MB</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* AI Ready Badge */}
                    <div className="bg-[#142320] [.light_&]:bg-[#e6f5f0] border border-primary/20 rounded-xl p-3 flex items-center gap-3 text-xs text-text-muted/90">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Sparkles size={16} />
                      </div>
                      <p>Proses pelaporan kini sepenuhnya otomatis dengan kecerdasan buatan (AI) RT.</p>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full bg-primary text-text-inverse py-3.5 rounded-xl text-xs font-bold tracking-wider hover:brightness-105 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-primary/15 cursor-pointer"
                      id="btn-next-to-location"
                    >
                      Lanjut ke Lokasi <ChevronRight size={14} />
                    </button>
                  </div>
                )}

                {/* STEP 2: LOKASI MASALAH */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-text-main font-display">Tentukan Lokasi Masalah</h4>
                      <p className="text-xs text-text-muted/80 mt-1 leading-relaxed">
                        Tentukan lokasi tempat masalah ditemukan agar petugas dapat langsung menuju ke sana.
                      </p>
                    </div>

                    {analyzingLocation ? (
                      <div className="h-64 rounded-2xl border border-primary/30 bg-[#142320]/40 [.light_&]:bg-[#e6f5f0]/40 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden animate-in fade-in duration-300">
                        {/* Moving Laser Scanning Line */}
                        <motion.div 
                          className="absolute left-0 right-0 h-0.5 bg-primary/70 shadow-[0_0_8px_#4ade80] z-10"
                          animate={{ top: ["5%", "95%", "5%"] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        />
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center animate-bounce mb-3 border border-primary/30">
                          <MapPin size={24} />
                        </div>
                        <p className="text-sm font-bold text-primary animate-pulse">RT-AI sedang memindai koordinat lokasi...</p>
                        <p className="text-xs text-text-muted mt-1 max-w-xs font-mono">Mencocokkan metadata geospasial gambar dengan klaster RT 05 / RW 12</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">Detail Lokasi / Alamat</label>
                          <input 
                            type="text" 
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            placeholder="Contoh: Jl. Merdeka No. 12 (dekat pos satpam RT 05)"
                            className="w-full bg-[#142320] [.light_&]:bg-[#e6f5f0]/50 border border-border-strong/20 rounded-xl p-3 text-sm text-text-main outline-none focus:border-primary transition-all"
                            id="input-report-location"
                          />
                        </div>

                        {/* Interactive CSS Mock Map */}
                        <div className="relative h-44 rounded-2xl overflow-hidden border border-border-strong/20 bg-[#142320]/40 [.light_&]:bg-[#e6f5f0]/40 flex items-center justify-center">
                          {/* Map Grid Pattern */}
                          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
                          
                          <div className="relative text-center p-4 space-y-2 z-10">
                            <div className="w-10 h-10 bg-accent/20 text-accent border border-accent/40 rounded-full flex items-center justify-center mx-auto animate-bounce">
                              <MapPin size={20} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-text-main">Peta Wilayah Terintegrasi RT 05</p>
                              <p className="text-[10px] text-text-muted">{location || "Masukkan lokasi di atas untuk memperbarui koordinat"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 bg-transparent border border-border-strong text-text-muted py-3.5 rounded-xl text-xs font-bold hover:text-text-main transition-colors cursor-pointer flex items-center justify-center gap-1"
                        id="btn-back-to-photo"
                      >
                        <ChevronLeft size={14} /> Kembali
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!location.trim()) {
                            alert("Masukkan detail lokasi terlebih dahulu!");
                            return;
                          }
                          setStep(3);
                          setAnalyzingCategory(true);
                          setTimeout(() => {
                            setAnalyzingCategory(false);
                          }, 3200);
                        }}
                        className="flex-1 bg-primary text-text-inverse py-3.5 rounded-xl text-xs font-bold tracking-wider hover:brightness-105 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-primary/15 cursor-pointer"
                        id="btn-next-to-category"
                      >
                        Lanjut ke Kategori <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: PILIH KATEGORI */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-text-main font-display">Pilih Kategori Masalah</h4>
                      <p className="text-xs text-text-muted/80 mt-1 leading-relaxed">
                        Pilih kategori masalah yang paling sesuai. AI kami menyarankan kategori berdasarkan analisis foto jika tersedia.
                      </p>
                    </div>

                    {analyzingCategory ? (
                      <div className="h-64 rounded-2xl border border-primary/30 bg-[#142320]/40 [.light_&]:bg-[#e6f5f0]/40 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden animate-in fade-in duration-300">
                        {/* Moving Laser Scanning Line */}
                        <motion.div 
                          className="absolute left-0 right-0 h-0.5 bg-primary/70 shadow-[0_0_8px_#4ade80] z-10"
                          animate={{ top: ["5%", "95%", "5%"] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        />
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center animate-pulse mb-3 border border-primary/30">
                          <Sparkles size={24} />
                        </div>
                        <p className="text-sm font-bold text-primary animate-pulse">RT-AI sedang menganalisis objek pengaduan...</p>
                        <p className="text-xs text-text-muted mt-1 max-w-xs font-mono">Mengidentifikasi klaster klasifikasi masalah lingkungan (Kebersihan / Infrastruktur / Keamanan)</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { id: "Infrastruktur", label: "Infrastruktur (Lampu, Jalan)", desc: "Jalan rusak, lampu padam, fasilitas umum rusak", emoji: "🚧" },
                          { id: "Kebersihan", label: "Kebersihan (Sampah, Selokan)", desc: "Sampah menumpuk, selokan tersumbat, bau menyengat", emoji: "🧹" },
                          { id: "Keamanan", label: "Keamanan & Ketertiban", desc: "Kriminalitas, keributan, parkir liar, kecurigaan", emoji: "👮" },
                          { id: "Lainnya", label: "Lainnya", desc: "Masalah umum lainnya di sekitar lingkungan", emoji: "📋" }
                        ].map((cat) => {
                          const isSelected = category === cat.id;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setCategory(cat.id)}
                              className={cn(
                                "p-4 rounded-2xl border text-left transition-all flex flex-col gap-2 relative cursor-pointer",
                                isSelected 
                                  ? "bg-primary/20 border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.15)] text-text-main" 
                                  : "bg-[#142320]/40 [.light_&]:bg-[#e6f5f0]/40 border-border-strong text-text-muted hover:border-primary/40 hover:text-text-main"
                              )}
                              id={`category-btn-${cat.id}`}
                            >
                              <span className="text-2xl">{cat.emoji}</span>
                              <div>
                                <h5 className="font-bold text-xs text-text-main leading-tight">{cat.label}</h5>
                                <p className="text-[10px] text-text-muted mt-1 leading-relaxed">{cat.desc}</p>
                              </div>
                              {isSelected && (
                                <span className="absolute top-3 right-3 text-primary text-xs font-bold">
                                  ✓ Terpilih
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex-1 bg-transparent border border-border-strong text-text-muted py-3.5 rounded-xl text-xs font-bold hover:text-text-main transition-colors cursor-pointer flex items-center justify-center gap-1"
                        id="btn-back-to-location"
                      >
                        <ChevronLeft size={14} /> Kembali
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(4)}
                        className="flex-1 bg-primary text-text-inverse py-3.5 rounded-xl text-xs font-bold tracking-wider hover:brightness-105 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-primary/15 cursor-pointer"
                        id="btn-next-to-review"
                      >
                        Lanjut ke Tinjau <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: TINJAU LAPORAN */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-text-main font-display">Tinjau Laporan Anda</h4>
                      <p className="text-xs text-text-muted/80 mt-1 leading-relaxed">
                        Periksa kembali detail laporan Anda sebelum dikirim ke petugas RT/RW.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Review details Card */}
                      <div className="bg-[#142320] [.light_&]:bg-[#e6f5f0] border border-border-strong/20 rounded-2xl p-4 space-y-4">
                        
                        {/* Upper row: Photo & Category */}
                        <div className="flex gap-4">
                          {image ? (
                            <img src={image} alt="Report Photo" className="w-16 h-16 object-cover rounded-xl border border-border-strong/30 shrink-0" />
                          ) : (
                            <div className="w-16 h-16 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center text-primary shrink-0">
                              <Camera size={20} />
                            </div>
                          )}
                          <div>
                            <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 font-bold px-2 py-0.5 rounded uppercase">
                              {category}
                            </span>
                            <p className="text-xs font-semibold text-text-muted mt-1.5 flex items-center gap-1">
                              <MapPin size={12} className="text-accent" /> {location}
                            </p>
                          </div>
                        </div>

                        {/* Title input field */}
                        <div className="space-y-1.5 border-t border-border-weak/20 pt-3">
                          <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">Judul Laporan</label>
                          <input 
                            type="text" 
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Misal: Lampu jalan mati di depan blok D nomor 12"
                            className="w-full bg-canvas/40 border border-border-strong/20 rounded-xl p-3 text-xs text-text-main outline-none focus:border-primary"
                            required
                            id="input-report-title"
                          />
                        </div>

                        {/* Public Visibility Toggle */}
                        <div className="flex items-center justify-between border-t border-border-weak/20 pt-3">
                          <div>
                            <h5 className="text-xs font-bold text-text-main">Publikasikan Laporan</h5>
                            <p className="text-[10px] text-text-muted mt-0.5">Warga lain dapat melihat keluhan ini di feed sosial RT.</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={isPublic} 
                              onChange={e => setIsPublic(e.target.checked)} 
                              id="toggle-report-public"
                            />
                            <div className="w-10 h-5 bg-canvas/60 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/30 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-border-strong after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="flex-1 bg-transparent border border-border-strong text-text-muted py-3.5 rounded-xl text-xs font-bold hover:text-text-main transition-colors cursor-pointer flex items-center justify-center gap-1"
                        id="btn-back-to-category-from-review"
                      >
                        <ChevronLeft size={14} /> Kembali
                      </button>
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={handleSubmitReport}
                        className="flex-1 bg-primary text-text-inverse py-3.5 rounded-xl text-xs font-bold tracking-wider hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-primary/15 cursor-pointer"
                        id="btn-submit-report"
                      >
                        {submitting ? (
                          <>
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                            Kirim Laporan...
                          </>
                        ) : (
                          <>
                            Kirim Laporan <ChevronRight size={14} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 5: SELESAI */}
                {step === 5 && (
                  <div className="text-center py-6 space-y-6">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 border border-emerald-500/35 rounded-full flex items-center justify-center mx-auto text-3xl shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-bounce">
                      ✓
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-xl font-bold text-text-main font-display">Laporan Berhasil Terkirim!</h4>
                      <p className="text-xs text-text-muted/80 max-w-md mx-auto leading-relaxed">
                        Terima kasih atas kepedulian Anda terhadap lingkungan. Laporan Anda '{title}' telah berhasil disimpan dan diteruskan ke Pengurus RT/RW untuk verifikasi lapangan.
                      </p>
                    </div>

                    <div className="bg-[#142320] [.light_&]:bg-[#e6f5f0] border border-border-strong/20 rounded-xl p-4 max-w-sm mx-auto text-[11px] text-text-muted text-left flex gap-2">
                      <span>ℹ️</span>
                      <span>Laporan Anda telah tercatat dengan pengaman ID otomatis. Pantau terus progresnya secara real-time pada tab Lacak Status di sidebar.</span>
                    </div>

                    <div className="flex gap-3 max-w-sm mx-auto">
                      <button
                        type="button"
                        onClick={resetWizard}
                        className="flex-1 bg-transparent border border-border-strong text-text-muted py-3 rounded-xl text-xs font-bold hover:text-text-main transition-colors cursor-pointer"
                        id="btn-create-new-report"
                      >
                        Buat Laporan Baru
                      </button>
                      <button
                        type="button"
                        onClick={() => setTab("tracking")}
                        className="flex-1 bg-primary text-text-inverse py-3 rounded-xl text-xs font-bold hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-primary/20"
                        id="btn-go-to-tracking"
                      >
                        Lacak Laporan
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      ) : (
        /* PUBLIC REPORTS TAB ("Laporan Warga Lain") */
        <div className="border border-border-strong rounded-3xl p-6 bg-surface shadow-md">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-text-main text-lg font-display">Laporan Publik Warga</h3>
              <p className="text-xs text-text-muted mt-0.5">Daftar laporan warga lain yang berstatus publik demi transparansi sosial.</p>
            </div>
            <span className="text-[10px] bg-primary/10 text-primary border border-primary/25 font-bold px-2.5 py-1 rounded-md uppercase font-mono">
              {filteredPublicReports.length} Aduan Aktif
            </span>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {filteredPublicReports.length === 0 && (
              <p className="text-sm text-text-muted text-center py-12 italic bg-canvas/20 rounded-2xl border border-dashed border-border-weak">
                Belum ada laporan publik dari warga lain saat ini.
              </p>
            )}
            {filteredPublicReports.map(report => (
              <div key={report.id} className="border border-border-weak p-5 rounded-2xl flex flex-col gap-4 hover:border-border-strong transition-all bg-canvas/30">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 border border-primary/15">
                    <MessageSquare size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <h4 className="font-semibold text-text-main text-sm md:text-base">{report.title}</h4>
                      <span className={cn(
                        "text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md shrink-0",
                        report.status === "SELESAI" ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/25" : 
                        report.status === "PROSES" ? "bg-blue-500/15 text-blue-500 border border-blue-500/25" : "bg-accent/15 text-accent border border-accent/25"
                      )}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                      <span className="font-bold text-primary">{report.sender}</span>
                      <span className="text-text-muted/40">•</span>
                      <span className="flex items-center gap-0.5"><MapPin size={12} className="text-text-muted" />{report.location}</span>
                      <span className="text-text-muted/40">•</span>
                      <span className="flex items-center gap-0.5"><Clock size={12} className="text-text-muted" />{report.date}</span>
                    </p>
                  </div>
                </div>

                {report.image && (
                  <div className="md:ml-16">
                    <img src={report.image} alt="Report attachment" referrerPolicy="no-referrer" className="h-44 w-auto rounded-xl shadow-sm border border-border-weak hover:scale-[1.01] transition-transform duration-300" />
                  </div>
                )}

                {report.status === "SELESAI" && (
                  <div className="md:ml-16 bg-emerald-500/5 p-4 rounded-xl text-xs border border-emerald-500/15 text-text-main shadow-inner">
                    <strong className="text-emerald-500 block mb-1 uppercase tracking-wider text-[10px] font-bold">Tanggapan Resmi RT:</strong> 
                    <p className="leading-relaxed text-text-main/90">Terima kasih, laporan sudah ditindaklanjuti dan selesai dikerjakan kemarin sore bersama tim lingkungan swadaya RT 05.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


// ==========================================
// FEATURE 10: DEDICATED LACAK STATUS & RIWAYAT TAB
// ==========================================
function TrackingTab({ setTab }: { setTab: (tab: string) => void }) {
  const [reports, setReports] = useState<any[]>([]);
  const [letters, setLetters] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [selectedLetter, setSelectedLetter] = useState<any>(null);
  const [activeType, setActiveType] = useState<"aduan" | "e-surat">("aduan");
  const [loading, setLoading] = useState(true);

  const [profileName, setProfileName] = useState(() => {
    const stored = localStorage.getItem("user-profile");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.name || "Bpk. Rahardian";
      } catch (e) {
        return "Bpk. Rahardian";
      }
    }
    return "Bpk. Rahardian";
  });

  useEffect(() => {
    const handleUpdate = () => {
      const stored = localStorage.getItem("user-profile");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.name) {
            setProfileName(parsed.name);
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    window.addEventListener("profile-updated", handleUpdate);
    return () => window.removeEventListener("profile-updated", handleUpdate);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch Reports
      const resReports = await fetch('/api/user/reports');
      if (resReports.ok) {
        const data = await resReports.json();
        setReports(data || []);
        const myReports = data.filter((r: any) => r.sender === "Budi Santoso" || r.sender === "Bpk. Rahardian" || r.sender === profileName);
        if (myReports.length > 0) {
          setSelectedReport(myReports[0]);
        }
      }

      // Fetch Letters
      const resLetters = await fetch('/api/user/letters');
      if (resLetters.ok) {
        const data = await resLetters.json();
        const myLetters = data.filter((l: any) => l.name === "Budi Santoso" || l.name === "Bpk. Rahardian" || l.name === profileName);
        setLetters(myLetters || []);
        if (myLetters.length > 0) {
          setSelectedLetter(myLetters[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [profileName]);

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
      ["Nama", `: ${letter.name || profileName}`],
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
    doc.text("Bandung, " + (letter.date ? letter.date.split(",")[0] : "Hari ini"), 140, sigY - 10);
    
    doc.text("Pemohon,", 30, sigY);
    if (letter.wargaSignature) {
      doc.addImage(letter.wargaSignature, 'PNG', 25, sigY + 5, 40, 20);
    }
    doc.text(`(${letter.name || profileName})`, 30, sigY + 30);

    doc.text("Ketua RT 05,", 140, sigY);
    if (letter.adminSignature) {
      doc.addImage(letter.adminSignature, 'PNG', 135, sigY + 5, 40, 20);
    } else {
      doc.setFontSize(8);
      doc.setTextColor(200, 0, 0);
      doc.text("BELUM DITANDA TANGANI", 135, sigY + 15);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
    }
    doc.text("(..............................)", 140, sigY + 30);

    doc.save(`${letter.type}-${letter.id}.pdf`);
  };

  const myReports = Array.isArray(reports) ? reports.filter(r => r.sender === "Budi Santoso" || r.sender === "Bpk. Rahardian" || r.sender === profileName) : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text-main">Lacak Status & Riwayat</h2>
          <p className="text-sm text-text-muted mt-1">Pantau progres laporan aduan dan pengajuan E-Surat Anda secara real-time.</p>
        </div>

        {/* TABS SELECTOR - GREEN SCHEME */}
        <div className="flex bg-surface rounded-xl p-1 border border-border-weak self-start md:self-auto">
          <button
            onClick={() => setActiveType("aduan")}
            className={cn(
              "px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5",
              activeType === "aduan" ? "bg-primary text-text-inverse shadow-sm" : "text-text-muted hover:text-text-main"
            )}
          >
            🚨 Aduan Lingkungan ({myReports.length})
          </button>
          <button
            onClick={() => setActiveType("e-surat")}
            className={cn(
              "px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5",
              activeType === "e-surat" ? "bg-primary text-text-inverse shadow-sm" : "text-text-muted hover:text-text-main"
            )}
          >
            📄 E-Surat Resmi ({letters.length})
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: ACTIVE TIMELINE DETAIL (GREEN SCHEME) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0c1614] [.light_&]:bg-[#f2fbf8] border border-border-strong/30 [.light_&]:border-primary/25 rounded-3xl p-6 md:p-8 space-y-8 shadow-xl relative overflow-hidden text-text-main">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
            
            <div className="border-b border-border-weak pb-4 flex justify-between items-center flex-wrap gap-3">
              <div>
                <h3 className="text-lg font-bold text-text-main font-display">
                  {activeType === "aduan" ? "Timeline Progres Aduan" : "Timeline Progres E-Surat"}
                </h3>
                <p className="text-xs text-text-muted mt-0.5">Setiap langkah tercatat permanen di blockchain RT demi akuntabilitas.</p>
              </div>
              <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 font-bold tracking-wider rounded-lg px-3 py-1 uppercase font-mono animate-pulse">
                Blockchain Secured
              </span>
            </div>

            {activeType === "aduan" ? (
              selectedReport ? (
                <div className="space-y-6">
                  {/* Active Tracking Header */}
                  <div className="border border-border-strong/20 [.light_&]:border-primary/15 p-5 rounded-2xl bg-[#142320]/60 [.light_&]:bg-[#e6f5f0]/60">
                    <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-text-main leading-tight">{selectedReport.title}</h4>
                        <p className="text-[11px] font-mono text-text-muted mt-1">ID: #{selectedReport.id || "CC-8842"} · Kategori: {selectedReport.category}</p>
                      </div>
                      <span className={cn(
                        "text-xs font-bold px-3 py-1 rounded-full border",
                        selectedReport.status === "SELESAI" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        selectedReport.status === "PROSES" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                      )}>
                        {selectedReport.status === "SELESAI" ? "Selesai" : selectedReport.status === "PROSES" ? "Sedang Dikerjakan" : "Menunggu Verifikasi"}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted flex items-center gap-1">
                      <MapPin size={12} className="text-accent" /> {selectedReport.location}
                    </p>
                  </div>

                  {/* Steps Timeline */}
                  <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border-strong/30">
                    
                    {/* Step 1: Laporan Diterima */}
                    <div className="relative">
                      <div className="absolute -left-[20px] top-1 w-4.5 h-4.5 bg-primary rounded-full flex items-center justify-center text-text-inverse border-2 border-[#0c1614] [.light_&]:border-[#f2fbf8] shadow-sm text-[10px] font-bold">
                        ✓
                      </div>
                      <div className="pl-4">
                        <h5 className="font-semibold text-xs text-text-main">Laporan Berhasil Diterima Pengurus</h5>
                        <p className="text-[10px] text-text-muted mt-0.5">{selectedReport.date || "Baru saja"}</p>
                        <p className="text-[9px] text-text-muted/60 font-mono bg-canvas/40 px-2 py-0.5 rounded w-fit mt-1">0x7a2f...b91c · Block #{Math.floor(Math.random() * 50000) + 2400000}</p>
                      </div>
                    </div>

                    {/* Step 2: Diverifikasi */}
                    <div className="relative">
                      <div className={cn(
                        "absolute -left-[20px] top-1 w-4.5 h-4.5 rounded-full flex items-center justify-center text-text-inverse border-2 border-[#0c1614] [.light_&]:border-[#f2fbf8] shadow-sm text-[10px] font-bold",
                        selectedReport.status === "PROSES" || selectedReport.status === "SELESAI" ? "bg-primary" : "bg-border-strong/40"
                      )}>
                        {selectedReport.status === "PROSES" || selectedReport.status === "SELESAI" ? "✓" : ""}
                      </div>
                      <div className="pl-4">
                        <h5 className={cn("font-semibold text-xs", selectedReport.status === "PROSES" || selectedReport.status === "SELESAI" ? "text-text-main" : "text-text-muted")}>
                          Diverifikasi AI & Ketua RT
                        </h5>
                        <p className="text-[10px] text-text-muted mt-0.5">
                          {selectedReport.status === "PROSES" || selectedReport.status === "SELESAI" ? "Tervalidasi" : "Sedang antre verifikasi berkas"}
                        </p>
                      </div>
                    </div>

                    {/* Step 3: Pengerjaan */}
                    <div className="relative">
                      <div className={cn(
                        "absolute -left-[20px] top-1 w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-[#0c1614] [.light_&]:border-[#f2fbf8] shadow-sm",
                        selectedReport.status === "SELESAI" ? "bg-primary text-text-inverse text-[10px] font-bold flex items-center justify-center" :
                        selectedReport.status === "PROSES" ? "bg-blue-500 ring-4 ring-blue-500/20 animate-pulse" : "bg-border-strong/40"
                      )}>
                        {selectedReport.status === "SELESAI" ? "✓" : ""}
                      </div>
                      <div className="pl-4">
                        <div className="flex justify-between items-start">
                          <h5 className={cn("font-semibold text-xs", selectedReport.status === "PROSES" || selectedReport.status === "SELESAI" ? "text-text-main" : "text-text-muted")}>
                            Tindakan Lapangan / Perbaikan
                          </h5>
                          {selectedReport.status === "PROSES" && (
                            <span className="text-[9px] uppercase font-bold px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">Sedang Berlangsung</span>
                          )}
                        </div>
                        <p className="text-[10px] text-text-muted mt-0.5">
                          {selectedReport.status === "SELESAI" ? "Petugas sudah ke lokasi & menyelesaikan masalah" :
                           selectedReport.status === "PROSES" ? "Tim lapangan dikerahkan ke lokasi keluhan" : "Menunggu penugasan tim"}
                        </p>
                      </div>
                    </div>

                    {/* Step 4: Selesai */}
                    <div className="relative">
                      <div className={cn(
                        "absolute -left-[20px] top-1 w-4.5 h-4.5 rounded-full border-2 border-[#0c1614] [.light_&]:border-[#f2fbf8] flex items-center justify-center",
                        selectedReport.status === "SELESAI" ? "bg-emerald-500 text-text-inverse text-[10px] font-bold shadow-lg shadow-emerald-500/10" : "bg-border-strong/40"
                      )}>
                        {selectedReport.status === "SELESAI" ? "✓" : ""}
                      </div>
                      <div className="pl-4">
                        <h5 className={cn("font-semibold text-xs", selectedReport.status === "SELESAI" ? "text-text-main" : "text-text-muted")}>
                          Selesai Dikerjakan & Ditutup
                        </h5>
                        <p className="text-[10px] text-text-muted mt-0.5">
                          {selectedReport.status === "SELESAI" ? "Pekerjaan tuntas. Terima kasih atas aduan Anda!" : "Menunggu penyelesaian perbaikan"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* RT Official Response if Selesai */}
                  {selectedReport.status === "SELESAI" && (
                    <div className="bg-[#142320]/60 [.light_&]:bg-[#e6f5f0]/60 border border-border-strong/20 [.light_&]:border-primary/15 rounded-2xl p-4 text-xs">
                      <strong className="text-emerald-400 block mb-1 uppercase tracking-wider text-[10px]">Tanggapan RT:</strong>
                      <p className="text-text-muted leading-relaxed">Terima kasih banyak Bpk/Ibu, petugas lapangan RT 05 sudah mengonfirmasi perbaikan di lokasi dan saat ini kondisi sudah kembali normal.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <div className="text-3xl">📋</div>
                  <h4 className="font-bold text-text-main text-sm">Belum Ada Timeline Laporan</h4>
                  <p className="text-xs text-text-muted max-w-sm mx-auto">
                    Silakan pilih salah satu laporan dari riwayat aduan Anda di kolom sebelah kanan untuk melihat status pelacakan detailnya.
                  </p>
                  <button
                    onClick={() => setTab("reports")}
                    className="bg-primary text-text-inverse font-bold text-xs px-4 py-2 rounded-xl hover:scale-105 transition-all mt-2 cursor-pointer"
                  >
                    Buat Laporan Baru
                  </button>
                </div>
              )
            ) : (
              selectedLetter ? (
                <div className="space-y-6">
                  {/* Active Tracking Header */}
                  <div className="border border-border-strong/20 [.light_&]:border-primary/15 p-5 rounded-2xl bg-[#142320]/60 [.light_&]:bg-[#e6f5f0]/60">
                    <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-text-main leading-tight">{selectedLetter.type}</h4>
                        <p className="text-[11px] font-mono text-text-muted mt-1">ID: {selectedLetter.id} · Keperluan: {selectedLetter.keperluan}</p>
                      </div>
                      <span className={cn(
                        "text-xs font-bold px-3 py-1 rounded-full border",
                        selectedLetter.status === "approved" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        selectedLetter.status === "rejected" ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      )}>
                        {selectedLetter.status === "approved" ? "Disetujui" : selectedLetter.status === "rejected" ? "Ditolak" : "Verifikasi Admin"}
                      </span>
                    </div>
                    <p className="text-[10px] text-text-muted font-mono bg-canvas/40 px-2 py-0.5 rounded w-fit mt-1">0x3b1c...e84a · Block #{Math.floor(Math.random() * 50000) + 2450000}</p>
                  </div>

                  {/* Steps Timeline */}
                  <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border-strong/30">
                    
                    {/* Step 1: Pengajuan Masuk */}
                    <div className="relative">
                      <div className="absolute -left-[20px] top-1 w-4.5 h-4.5 bg-primary rounded-full flex items-center justify-center text-text-inverse border-2 border-[#0c1614] [.light_&]:border-[#f2fbf8] shadow-sm text-[10px] font-bold">
                        ✓
                      </div>
                      <div className="pl-4">
                        <h5 className="font-semibold text-xs text-text-main">Pengajuan Pengantar E-Surat Terkirim</h5>
                        <p className="text-[10px] text-text-muted mt-0.5">{selectedLetter.date || "Baru saja"}</p>
                      </div>
                    </div>

                    {/* Step 2: Verifikasi Sekretaris RT */}
                    <div className="relative">
                      <div className={cn(
                        "absolute -left-[20px] top-1 w-4.5 h-4.5 rounded-full flex items-center justify-center text-text-inverse border-2 border-[#0c1614] [.light_&]:border-[#f2fbf8] shadow-sm text-[10px] font-bold",
                        selectedLetter.status === "approved" || selectedLetter.status === "rejected" ? "bg-primary" : "bg-blue-500 ring-4 ring-blue-500/20 animate-pulse"
                      )}>
                        {selectedLetter.status === "approved" || selectedLetter.status === "rejected" ? "✓" : "••"}
                      </div>
                      <div className="pl-4">
                        <h5 className={cn("font-semibold text-xs", selectedLetter.status === "approved" || selectedLetter.status === "rejected" ? "text-text-main" : "text-text-muted")}>
                          Verifikasi Dokumen & TTD Pemohon
                        </h5>
                        <p className="text-[10px] text-text-muted mt-0.5">
                          {selectedLetter.status === "approved" ? "Kelengkapan berkas tervalidasi" : 
                           selectedLetter.status === "rejected" ? "Verifikasi gagal / ditolak" : "Sekretaris sedang memvalidasi tanda tangan & NIK"}
                        </p>
                      </div>
                    </div>

                    {/* Step 3: Tanda Tangan Ketua RT */}
                    <div className="relative">
                      <div className={cn(
                        "absolute -left-[20px] top-1 w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-[#0c1614] [.light_&]:border-[#f2fbf8] shadow-sm",
                        selectedLetter.status === "approved" ? "bg-primary text-text-inverse text-[10px] font-bold" :
                        selectedLetter.status === "rejected" ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-border-strong/40"
                      )}>
                        {selectedLetter.status === "approved" ? "✓" : selectedLetter.status === "rejected" ? "✕" : ""}
                      </div>
                      <div className="pl-4">
                        <h5 className={cn("font-semibold text-xs", selectedLetter.status === "approved" ? "text-text-main" : "text-text-muted")}>
                          Penandatanganan Digital Ketua RT
                        </h5>
                        <p className="text-[10px] text-text-muted mt-0.5">
                          {selectedLetter.status === "approved" ? "Sertifikat digital ketua RT berhasil dibubuhkan" :
                           selectedLetter.status === "rejected" ? "Pengajuan ditolak" : "Menunggu konfirmasi verifikasi OTP Ketua RT"}
                        </p>
                      </div>
                    </div>

                    {/* Step 4: Selesai */}
                    <div className="relative">
                      <div className={cn(
                        "absolute -left-[20px] top-1 w-4.5 h-4.5 rounded-full border-2 border-[#0c1614] [.light_&]:border-[#f2fbf8] flex items-center justify-center",
                        selectedLetter.status === "approved" ? "bg-emerald-500 text-text-inverse text-[10px] font-bold shadow-lg shadow-emerald-500/10" :
                        selectedLetter.status === "rejected" ? "bg-red-500 text-text-inverse text-[10px] font-bold" : "bg-border-strong/40"
                      )}>
                        {selectedLetter.status === "approved" ? "✓" : selectedLetter.status === "rejected" ? "✕" : ""}
                      </div>
                      <div className="pl-4">
                        <h5 className={cn("font-semibold text-xs", selectedLetter.status === "approved" ? "text-text-main" : "text-text-muted")}>
                          {selectedLetter.status === "rejected" ? "Pengajuan Dibatalkan / Ditolak" : "Surat Resmi Terbit"}
                        </h5>
                        <p className="text-[10px] text-text-muted mt-0.5">
                          {selectedLetter.status === "approved" ? "File PDF legal terbit & siap diunduh" :
                           selectedLetter.status === "rejected" ? "Silakan perbaiki isian berkas Anda" : "Surat siap dikompilasi"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* RT Official Response / Download Button if Selesai */}
                  {selectedLetter.status === "approved" && (
                    <div className="bg-[#142320]/60 [.light_&]:bg-[#e6f5f0]/60 border border-border-strong/20 [.light_&]:border-primary/15 rounded-2xl p-4 text-xs space-y-3">
                      <div>
                        <strong className="text-emerald-400 block mb-1 uppercase tracking-wider text-[10px]">Tanggapan RT:</strong>
                        <p className="text-text-muted leading-relaxed">Surat pengantar digital Anda telah terbit dan ditandatangani secara resmi. Silakan unduh dokumen di bawah ini.</p>
                      </div>
                      <button
                        onClick={() => handleDownloadPDF(selectedLetter)}
                        className="w-full sm:w-auto bg-primary text-text-inverse font-bold text-xs px-4 py-2.5 rounded-xl hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <Download size={14} /> Unduh Surat Resmi (PDF)
                      </button>
                    </div>
                  )}

                  {selectedLetter.status === "rejected" && (
                    <div className="bg-red-500/5 border border-red-500/15 rounded-2xl p-4 text-xs">
                      <strong className="text-red-400 block mb-1 uppercase tracking-wider text-[10px]">Alasan Penolakan RT:</strong>
                      <p className="text-text-muted leading-relaxed">Detail keperluan kurang lengkap atau tidak sesuai format administrasi. Silakan ajukan ulang dengan keperluan yang lebih jelas.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <div className="text-3xl">📋</div>
                  <h4 className="font-bold text-text-main text-sm">Belum Ada Pengajuan Surat</h4>
                  <p className="text-xs text-text-muted max-w-sm mx-auto">
                    Silakan ajukan surat pengantar baru pada menu E-Surat untuk melacak progres detailnya di sini.
                  </p>
                  <button
                    onClick={() => setTab("letters")}
                    className="bg-primary text-text-inverse font-bold text-xs px-4 py-2 rounded-xl hover:scale-105 transition-all mt-2 cursor-pointer"
                  >
                    Ajukan Surat Baru
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: HISTORY LIST (ADUAN VS E-SURAT) */}
        <div className="space-y-6">
          <div className="bg-surface border border-border-weak rounded-3xl p-6 shadow-sm space-y-4">
            
            {/* Header and counter details */}
            <div>
              <h3 className="font-bold text-text-main text-base font-display">
                {activeType === "aduan" ? "Riwayat Aduan Saya" : "Riwayat E-Surat Saya"}
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                {activeType === "aduan" ? "Daftar laporan yang pernah Anda sampaikan." : "Daftar surat pengantar yang pernah Anda ajukan."}
              </p>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {loading ? (
                <div className="flex justify-center py-8">
                  <span className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
              ) : activeType === "aduan" ? (
                myReports.length === 0 ? (
                  <div className="text-center py-8 space-y-2">
                    <p className="text-xs text-text-muted italic">Belum ada riwayat laporan.</p>
                  </div>
                ) : (
                  myReports.map((r) => {
                    const isSelected = selectedReport && selectedReport.id === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => setSelectedReport(r)}
                        className={cn(
                          "w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2",
                          isSelected 
                            ? "bg-primary/10 border-primary/40 shadow-sm"
                            : "bg-canvas/30 border-border-weak hover:border-border-strong"
                        )}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-xs text-text-main line-clamp-1 leading-snug">{r.title}</h4>
                          <span className={cn(
                            "text-[9px] font-bold px-2 py-0.5 rounded uppercase shrink-0",
                            r.status === "SELESAI" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                            r.status === "PROSES" ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" : "bg-accent/10 text-accent border border-accent/20"
                          )}>
                            {r.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-text-muted">
                          <span className="truncate max-w-[120px]">📍 {r.location}</span>
                          <span>⏱️ {r.date}</span>
                        </div>
                      </button>
                    );
                  })
                )
              ) : (
                letters.length === 0 ? (
                  <div className="text-center py-8 space-y-2">
                    <p className="text-xs text-text-muted italic">Belum ada pengajuan surat.</p>
                  </div>
                ) : (
                  letters.map((l) => {
                    const isSelected = selectedLetter && selectedLetter.id === l.id;
                    return (
                      <button
                        key={l.id}
                        onClick={() => setSelectedLetter(l)}
                        className={cn(
                          "w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2",
                          isSelected 
                            ? "bg-primary/10 border-primary/40 shadow-sm"
                            : "bg-canvas/30 border-border-weak hover:border-border-strong"
                        )}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-xs text-text-main line-clamp-1 leading-snug">{l.type}</h4>
                          <span className={cn(
                            "text-[9px] font-bold px-2 py-0.5 rounded uppercase shrink-0",
                            l.status === "approved" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                            l.status === "rejected" ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          )}>
                            {l.status === "approved" ? "SELESAI" : l.status === "rejected" ? "DITOLAK" : "PENDING"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-text-muted">
                          <span className="truncate max-w-[120px]">📋 {l.keperluan}</span>
                          <span>⏱️ {l.date}</span>
                        </div>
                      </button>
                    );
                  })
                )
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function NewsGotongRoyongTab() {
  const [subTab, setSubTab] = useState<"news" | "gotong_royong">("news");
  
  const newsData = [
    { 
      id: 1, 
      category: "KESEHATAN", 
      title: "Jadwal Fogging Lingkungan DBD Pekan Ini", 
      desc: "Mengantisipasi peningkatan demam berdarah dengue (DBD) di pancaroba, RT akan melakukan penyemprotan asap fogging pelindung jentik...", 
      date: "23 Mei 2026", 
      image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=600" 
    },
    { 
      id: 2, 
      category: "KEGIATAN SOSIAL", 
      title: "Kerja Bakti Akbar & Revitalisasi Gapura", 
      desc: "Bergabung bersama dalam memperindah gapura akses utama dan membersihkan saluran air penyumbat banjir.", 
      date: "19 Mei 2026", 
      image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=600" 
    }
  ];
  
  const [articles, setArticles] = useState<any[]>(newsData);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const gotongData = [
    { id: 1, title: "Kerja Bakti Bersih Selokan", date: "Minggu, 12 Nov 2026", time: "07:00 - Selesai", location: "Sepanjang RT 05", participants: 15, joined: true },
    { id: 2, title: "Persiapan Panggung 17-an", date: "Minggu, 14 Agu 2026", time: "08:00 - Selesai", location: "Lapangan Serbaguna RW 12", participants: 25, joined: false },
    { id: 3, title: "Penyemprotan Disinfektan", date: "Sabtu, 21 Nov 2026", time: "09:00 - 12:00", location: "Fasilitas Umum & Musholla", participants: 8, joined: false },
  ];
  const [events, setEvents] = useState(gotongData);

  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [familyMembers, setFamilyMembers] = useState<string[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<string[]>([]);
  const [newFamilyMember, setNewFamilyMember] = useState("");

  const fetchVolunteers = async () => {
    try {
      const res = await fetch("/api/volunteers");
      if (res.ok) {
        const data = await res.json();
        setVolunteers(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchVolunteers();
    const stored = localStorage.getItem("user-profile");
    if (stored) {
      const parsed = JSON.parse(stored);
      setFamilyMembers(parsed.familyMembers || []);
    } else {
      setFamilyMembers(["Ibu Siti (Istri)", "Agus (Anak)", "Rani (Anak)"]);
    }
  }, []);

  const handleOpenVolunteerForm = (event: any) => {
    setSelectedEvent(event);
    setSelectedFamily([]);
    setShowVolunteerModal(true);
  };

  const handleRegisterVolunteers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      // Register each selected family member
      for (const name of selectedFamily) {
        let relation = "Keluarga";
        if (name.includes("Istri")) relation = "Istri";
        else if (name.includes("Anak")) relation = "Anak";
        
        await fetch("/api/volunteers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId: selectedEvent.id,
            name,
            relation
          })
        });
      }

      // Also trigger a notification
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Relawan Terdaftar",
          message: `${selectedFamily.length} anggota keluarga Anda berhasil didaftarkan sebagai relawan untuk '${selectedEvent.title}'!`,
          category: "event"
        })
      });

      alert("Pendaftaran relawan berhasil disimpan!");
      setShowVolunteerModal(false);
      fetchVolunteers();
      
      // Update participants count locally
      setEvents(events.map(ev => {
        if (ev.id === selectedEvent.id) {
          return { ...ev, joined: true, participants: ev.participants + selectedFamily.length };
        }
        return ev;
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddFamilyMemberOnFly = () => {
    if (!newFamilyMember.trim()) return;
    const updatedMembers = [...familyMembers, newFamilyMember.trim()];
    setFamilyMembers(updatedMembers);
    
    // Persist back to profile
    const stored = localStorage.getItem("user-profile");
    const profile = stored ? JSON.parse(stored) : {
      name: "Bpk. Rahardian",
      address: "Jl. Merdeka No. 45",
      rt: "05",
      rw: "12",
      phone: "0812-3456-7890"
    };
    profile.familyMembers = updatedMembers;
    localStorage.setItem("user-profile", JSON.stringify(profile));
    window.dispatchEvent(new Event("profile-updated"));

    // Pre-check the added member
    setSelectedFamily([...selectedFamily, newFamilyMember.trim()]);
    setNewFamilyMember("");
  };

  const toggleJoin = (id: number) => {
    setEvents(events.map(ev => {
      if (ev.id === id) {
        return { ...ev, joined: !ev.joined, participants: ev.joined ? ev.participants - 1 : ev.participants + 1 };
      }
      return ev;
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-display font-semibold text-text-main">Portal Berita & Gotong Royong</h2>
        <p className="text-sm text-text-muted mt-1">Dapatkan pengumuman penting lingkungan dan daftar kegiatan swadaya.</p>
      </div>

      <div className="flex border-b border-border-weak">
        <button 
          onClick={() => setSubTab("news")}
          className={cn(
            "py-3 px-6 text-sm font-semibold border-b-2 transition-colors cursor-pointer",
            subTab === "news" ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text-main"
          )}
        >
          Portal Berita RT 05
        </button>
        <button 
          onClick={() => setSubTab("gotong_royong")}
          className={cn(
            "py-3 px-6 text-sm font-semibold border-b-2 transition-colors cursor-pointer",
            subTab === "gotong_royong" ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text-main"
          )}
        >
          Kegiatan Gotong Royong
        </button>
      </div>

      {subTab === "news" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {articles.map(art => (
            <div key={art.id} className="bg-surface border border-border-weak rounded-2xl overflow-hidden shadow-md flex flex-col justify-between hover:border-primary/30 transition-all duration-300">
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-canvas">
                  <img 
                    src={art.image} 
                    alt={art.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <span className="text-[10px] bg-primary/10 text-primary font-bold tracking-wider rounded px-2.5 py-1 uppercase">
                    {art.category}
                  </span>
                  <h4 className="font-bold text-text-main text-base line-clamp-2 pt-1">
                    {art.title}
                  </h4>
                  <p className="text-xs text-text-muted line-clamp-3 leading-relaxed">
                    {art.summary || art.desc}
                  </p>
                </div>
              </div>
              <div className="p-5 border-t border-border-weak/50 flex justify-between items-center text-xs text-text-muted">
                <span>{art.date}</span>
                <button 
                  onClick={() => setSelectedArticle(art)}
                  className="text-primary font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  Selengkapnya &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {events.map(ev => (
            <div key={ev.id} className="bg-surface border border-border-weak p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-primary/30 transition-all">
              <div>
                <div className="bg-primary/10 text-primary w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
                  Panggilan Terbuka
                </div>
                <h3 className="font-bold text-lg text-text-main leading-tight mb-2">{ev.title}</h3>
                <div className="space-y-1.5 mb-4 text-xs text-text-muted">
                  <p className="flex items-center gap-2"><MapPin size={14} className="text-accent" /> {ev.location}</p>
                  <p className="flex items-center gap-2">⏱️ {ev.date} — {ev.time}</p>
                  <p className="flex items-center gap-2"><Users size={14} className="text-primary" /> {ev.participants} Warga Berpartisipasi</p>
                </div>

                {/* Show family members registered for this event */}
                <div className="mt-4 pt-3 border-t border-border-weak/50">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">Relawan Keluarga Terdaftar:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {volunteers.filter(v => v.eventId === ev.id).length === 0 ? (
                      <span className="text-[11px] text-text-muted italic">Belum ada relawan terdaftar dari keluarga Anda</span>
                    ) : (
                      volunteers.filter(v => v.eventId === ev.id).map((v, i) => (
                        <span key={i} className="text-[10px] bg-primary/15 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full font-medium">
                          {v.name} ({v.relation})
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2.5 mt-5">
                <button 
                  onClick={() => handleOpenVolunteerForm(ev)}
                  className="flex-1 bg-primary text-text-inverse py-2.5 rounded-xl text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary/95 transition-all cursor-pointer"
                >
                  Daftarkan Relawan
                </button>
                {ev.joined && (
                  <button 
                    onClick={() => toggleJoin(ev.id)}
                    className="px-3 bg-canvas border border-border-strong rounded-xl text-xs text-text-muted hover:text-accent hover:bg-surface-hover transition-all cursor-pointer"
                    title="Batal Ikut Serta"
                  >
                    Batal
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Volunteer Registration Form Modal */}
      {showVolunteerModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border-strong rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowVolunteerModal(false)}
              className="absolute top-6 right-6 text-text-muted hover:text-text-main font-bold text-lg cursor-pointer animate-pulse"
            >
              ✕
            </button>
            
            <form onSubmit={handleRegisterVolunteers} className="space-y-4">
              <div>
                <span className="text-[10px] bg-primary/20 text-primary font-bold px-2 py-1 rounded-md uppercase">Formulir Relawan</span>
                <h3 className="text-xl font-bold text-text-main mt-2 leading-tight">{selectedEvent.title}</h3>
                <p className="text-xs text-text-muted mt-1">Gunakan formulir keluarga terpadu ini untuk mendaftarkan anggota keluarga Anda yang ikut serta.</p>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Pilih Anggota Keluarga yang Ikut:</label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-border-weak p-3 rounded-xl bg-canvas/30">
                  {familyMembers.map((name, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id={`member-${idx}`}
                        checked={selectedFamily.includes(name)}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedFamily([...selectedFamily, name]);
                          } else {
                            setSelectedFamily(selectedFamily.filter(f => f !== name));
                          }
                        }}
                        className="accent-primary w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor={`member-${idx}`} className="text-xs text-text-main font-medium cursor-pointer">
                        {name}
                      </label>
                    </div>
                  ))}
                  {familyMembers.length === 0 && (
                    <p className="text-xs text-text-muted italic">Belum ada anggota keluarga terdaftar.</p>
                  )}
                </div>

                <div className="border-t border-border-weak pt-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">Tambahkan Anggota Keluarga Baru:</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Contoh: Ibu Siti (Istri)" 
                      value={newFamilyMember}
                      onChange={e => setNewFamilyMember(e.target.value)}
                      className="flex-1 bg-canvas border border-border-strong rounded-lg px-3 py-1.5 text-xs text-text-main focus:border-primary outline-none"
                    />
                    <button 
                      type="button"
                      onClick={handleAddFamilyMemberOnFly}
                      className="bg-primary text-text-inverse font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-primary/95 transition-colors cursor-pointer"
                    >
                      Tambah
                    </button>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={selectedFamily.length === 0}
                className="w-full bg-primary text-text-inverse font-bold py-3 rounded-lg hover:bg-primary/95 transition-all text-xs mt-4 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Konfirmasi Pendaftaran ({selectedFamily.length} Relawan)
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedArticle && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-sidebar border border-border-weak rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl relative overflow-y-auto max-h-[85vh] animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setSelectedArticle(null)}
              className="absolute top-6 right-6 text-text-muted hover:text-text-main"
            >
              <Plus size={24} className="rotate-45" />
            </button>
            <span className="text-xs bg-primary/20 text-primary font-bold tracking-wide rounded-md px-2.5 py-1 uppercase">{selectedArticle.category}</span>
            <h3 className="text-2xl font-bold text-text-main mt-4 mb-2 font-display">{selectedArticle.title}</h3>
            <p className="text-xs text-text-muted font-mono mb-4">{selectedArticle.date} • Ditulis oleh: Kepala Humas RT 05</p>
            <img 
              src={selectedArticle.image} 
              alt={selectedArticle.title} 
              referrerPolicy="no-referrer"
              className="w-full h-64 object-cover rounded-2xl mb-6 shadow-sm border border-border-weak"
            />
            <div className="text-sm text-text-main leading-relaxed whitespace-pre-line space-y-4">
              <p className="font-semibold">{selectedArticle.summary}</p>
              <p>{selectedArticle.content || "Isi berita penting lingkungan perumahan warga sekitar. Selalu jaga ketertiban, keindahan, kelestarian dan kebersihan lingkungan kita bersama untuk keseriusan lingkungan yang murni dan sehat."}</p>
            </div>
            <div className="mt-8 pt-4 border-t border-border-weak flex justify-end">
              <button 
                onClick={() => setSelectedArticle(null)}
                className="bg-primary text-text-inverse px-6 py-2.5 rounded-xl text-sm font-bold"
              >
                Selesai Membaca
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MarketTab() {
  const [listings, setListings] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form States for user UMKM registration
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("Bpk. Rahardian");
  const [category, setCategory] = useState("Makanan & Minuman");
  const [phone, setPhone] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const fetchUMKM = () => {
    fetch('/api/umkm').then(r => r.json()).then(setListings);
    fetch('/api/ads').then(r => r.json()).then(setAds);
  };

  useEffect(() => {
    fetchUMKM();
  }, []);

  useEffect(() => {
    if (ads.length === 0) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % ads.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [ads.length]);

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

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !desc) return alert("Mohon lengkapi Nama Usaha, Kontak WA, dan Deskripsi!");
    setSubmitting(true);
    
    try {
      const res = await fetch('/api/umkm', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, name, category, phone, desc, image })
      });
      if (res.ok) {
        alert("Pendaftaran UMKM berhasil! Usaha Anda kini terbit di portal pasar Warga.");
        setShowAddModal(false);
        setName("");
        setPhone("");
        setDesc("");
        setImage(null);
        fetchUMKM();
      }
    } catch {
      alert("Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text-main">Pasar Warga & UMKM Mandiri</h2>
          <p className="text-sm text-text-muted mt-1">Ekosistem ekonomi lokal, periklanan, dan promosi komersial kawasan hunian.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-text-inverse px-5 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/95 transition-all self-start md:self-auto h-11 shadow-md shadow-primary/10"
        >
          <Plus size={18} /> Daftarkan UMKM Saya
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {listings.length === 0 && <p className="text-sm text-text-muted text-center py-8 col-span-full">Belum ada UMKM terdaftar.</p>}
        {listings.map(umkm => (
          <div key={umkm.id} className="bg-surface border border-border-weak rounded-2xl overflow-hidden shadow-md flex flex-col justify-between hover:border-primary/50 hover:shadow-lg transition-all duration-300 group cursor-pointer">
            <div>
              <div className="overflow-hidden">
                <img 
                  src={umkm.image} 
                  alt={umkm.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] bg-primary/15 text-primary text-xs font-bold tracking-wider px-2 py-0.5 rounded uppercase">
                    {umkm.category}
                  </span>
                  <span className="text-[10px] text-text-muted font-medium font-mono">Residen: {umkm.owner}</span>
                </div>
                <h4 className="font-bold text-text-main text-lg">{umkm.name}</h4>
                <p className="text-xs text-text-muted leading-relaxed line-clamp-3">{umkm.desc}</p>
              </div>
            </div>
            <div className="p-5 border-t border-border-weak/50">
              <a 
                href={`https://wa.me/${umkm.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#25D366] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#20ba59] transition-colors"
              >
                <PhoneCall size={14} fill="currentColor" /> Hubungi Toko Warga ({umkm.phone})
              </a>
            </div>
          </div>
        ))}
      </div>
      {/* Pendaftaran UMKM Popup Form */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-sidebar border border-border-weak rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative overflow-y-auto max-h-[85vh] animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 text-text-muted hover:text-text-main"
            >
              <Plus size={24} className="rotate-45" />
            </button>
            <h3 className="text-xl font-bold text-text-main mb-2 font-display">Daftarkan Toko UMKM Baru</h3>
            <p className="text-xs text-text-muted mb-6 leading-relaxed">
              Mulai perkenalkan usaha lokal Anda demi mempermudah warga lain mencari kuliner, sembako, servis, maupun jasa terdekat.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-text-muted mb-2 tracking-wide">Nama Toko / UMKM</label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: Catering Rini Sedap"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-sm text-text-main outline-none focus:border-primary font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-text-muted mb-2 tracking-wide">Kategori</label>
                  <select 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    style={{ background: 'var(--canvas)', color: 'var(--text-main)' }}
                    className="w-full border border-border-strong rounded-xl p-3 text-sm outline-none focus:border-primary font-bold"
                  >
                    <option style={{ background: 'var(--canvas)', color: 'var(--text-main)' }} value="Makanan & Minuman">Makanan & Minuman</option>
                    <option style={{ background: 'var(--canvas)', color: 'var(--text-main)' }} value="Kebutuhan Pokok">Kebutuhan Pokok / Sembako</option>
                    <option style={{ background: 'var(--canvas)', color: 'var(--text-main)' }} value="Jasa">Jasa Pelayanan</option>
                    <option style={{ background: 'var(--canvas)', color: 'var(--text-main)' }} value="Kerajinan">Kerajinan / Atribut</option>
                    <option style={{ background: 'var(--canvas)', color: 'var(--text-main)' }} value="Kesehatan">Kesehatan & Kecantikan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-text-muted mb-2 tracking-wide">Nomor WhatsApp</label>
                  <input 
                    type="text"
                    required
                    placeholder="Contoh: 0812-2233-4455"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-sm text-text-main outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-text-muted mb-2 tracking-wide">Deskripsi Usaha / Promo</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Masukkan rincian apa saja produk yang ditawarkan, diskon khusus warga perumahan..."
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-sm text-text-main outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-text-muted mb-2 tracking-wide">Sediakan Gambar / Cover Banner Toko</label>
                <div className="mt-1 flex justify-center px-4 py-6 border-2 border-border-strong border-dashed rounded-xl bg-canvas hover:bg-surface-hover transition-colors text-center cursor-pointer">
                  <div className="space-y-1 text-center">
                    {!image ? (
                      <>
                        <Upload className="mx-auto h-7 w-7 text-primary" />
                        <div className="flex text-xs text-text-muted mt-2 justify-center">
                          <label className="relative cursor-pointer bg-transparent rounded-md font-bold text-primary hover:text-primary/80">
                            <span>Upload Banner Toko</span>
                            <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                          </label>
                        </div>
                      </>
                    ) : (
                      <div className="relative inline-block">
                        <img src={image} alt="UMKM Preview" className="h-24 w-auto rounded-lg shadow-sm" />
                        <button 
                          type="button" 
                          onClick={() => setImage(null)}
                          className="absolute -top-2 -right-2 bg-accent text-white p-1 rounded-full shadow-md"
                        >
                          <Plus size={12} className="rotate-45" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border-weak mt-6">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl text-sm text-text-muted hover:text-text-main font-semibold"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="bg-primary text-text-inverse px-7 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {submitting ? "Mendaftarkan..." : "Daftarkan Usaha"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


// ==========================================
// FEATURE 9: DONASI & BANTUAN SOSIAL SECTION
// ==========================================
function DonationSection() {
  interface Campaign {
    id: string;
    title: string;
    desc: string;
    target: number;
    raised: number;
    category: string;
    image: string;
    donors: number;
  }

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "DON-1",
      title: "Bantuan Korban Banjir Bandang",
      desc: "Mari ringankan beban saudara kita yang tertimpa musibah banjir bandang di desa tetangga. Bantuan akan disalurkan berupa sembako dan obat-obatan.",
      target: 15000000,
      raised: 8450000,
      category: "Bencana Alam",
      image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=500",
      donors: 34
    },
    {
      id: "DON-2",
      title: "Santunan Warga Sakit - Pak Slamet",
      desc: "Pak Slamet (Blok F) sedang dirawat karena stroke dan membutuhkan bantuan biaya pengobatan di luar tanggungan BPJS.",
      target: 5000000,
      raised: 4200000,
      category: "Santunan Warga",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=500",
      donors: 19
    },
    {
      id: "DON-3",
      title: "Beasiswa Anak Yatim RW 12",
      desc: "Program tahunan pemberian perlengkapan sekolah dan biaya SPP bagi 15 anak yatim piatu berprestasi di lingkungan RW kita.",
      target: 10000000,
      raised: 3500000,
      category: "Pendidikan",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=500",
      donors: 12
    }
  ]);

  const [payAmount, setPayAmount] = useState<number>(50000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCampaign) return;

    const amount = customAmount ? parseInt(customAmount) : payAmount;
    if (isNaN(amount) || amount <= 0) {
      alert("Masukkan nominal donasi yang valid.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/donations/${activeCampaign.id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount })
      });

      if (res.ok) {
        // Increment locally
        setCampaigns(campaigns.map(c => {
          if (c.id === activeCampaign.id) {
            return {
              ...c,
              raised: c.raised + amount,
              donors: c.donors + 1
            };
          }
          return c;
        }));

        // Send a notification about the donation success
        await fetch("/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Donasi Berhasil",
            message: `Terima kasih! Donasi sebesar Rp ${amount.toLocaleString('id-ID')} untuk '${activeCampaign.title}' telah berhasil diterima.`,
            category: "dues"
          })
        });

        alert("Donasi Anda berhasil diproses. Terima kasih atas kedermawanan Anda!");
        setActiveCampaign(null);
        setCustomAmount("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pt-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-3xl border border-primary/20 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <HelpingHand size={18} /> Gotong Royong Finansial
          </div>
          <h3 className="text-xl font-bold text-text-main font-display">SmartWarga Donasi Sosial</h3>
          <p className="text-sm text-text-muted max-w-xl">
            Salurkan bantuan finansial Anda secara langsung, transparan, dan aman untuk membantu warga sekitar yang membutuhkan bantuan atau penanganan bencana darurat.
          </p>
        </div>
        <div className="bg-surface border border-border-strong rounded-2xl p-4 text-center shadow-sm shrink-0">
          <p className="text-xs text-text-muted uppercase font-bold tracking-wider">Total Donasi Tersalurkan</p>
          <p className="text-2xl font-bold text-primary font-display mt-1">Rp 16.150.000</p>
          <p className="text-[10px] text-text-muted mt-0.5">Dari 65 Donatur Warga RT 05</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map(c => {
          const percent = Math.min(100, Math.round((c.raised / c.target) * 100));
          return (
            <div key={c.id} className="bg-surface border border-border-weak rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-primary/40 transition-all duration-300 group">
              <div>
                <div className="h-44 overflow-hidden relative bg-canvas">
                  <img src={c.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <span className="absolute top-3 left-3 bg-black/70 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md">
                    {c.category}
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <h4 className="font-bold text-text-main text-base leading-tight">{c.title}</h4>
                  <p className="text-xs text-text-muted line-clamp-3 leading-relaxed">{c.desc}</p>
                  
                  {/* Progress bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[11px] font-semibold text-text-muted">
                      <span>Terkumpul: <strong>{percent}%</strong></span>
                      <span>Target: Rp {c.target.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="w-full bg-canvas rounded-full h-2 overflow-hidden border border-border-weak">
                      <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                    </div>
                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="font-bold text-primary">Rp {c.raised.toLocaleString('id-ID')}</span>
                      <span className="text-[10px] bg-canvas px-2 py-0.5 rounded border border-border-weak text-text-muted font-medium flex items-center gap-1">
                        👥 {c.donors} Warga
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-border-weak/50">
                <button 
                  onClick={() => {
                    setActiveCampaign(c);
                    setPayAmount(50000);
                  }}
                  className="w-full bg-primary text-text-inverse py-2.5 rounded-xl text-xs font-bold shadow-md shadow-primary/10 hover:bg-primary/95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <HelpingHand size={14} /> Donasi Sekarang
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Donation Action Modal */}
      {activeCampaign && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border-strong rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setActiveCampaign(null)}
              className="absolute top-6 right-6 text-text-muted hover:text-text-main font-bold text-lg cursor-pointer"
            >
              ✕
            </button>
            <form onSubmit={handleDonate} className="space-y-5">
              <div>
                <span className="text-[10px] bg-primary/20 text-primary font-bold px-2 py-1 rounded-md uppercase">Salurkan Kebaikan</span>
                <h3 className="text-lg font-bold text-text-main mt-2 leading-tight">{activeCampaign.title}</h3>
                <p className="text-xs text-text-muted mt-1">Donasi Anda sepenuhnya disalurkan 100% tanpa potongan apa pun.</p>
              </div>

              {/* Fast payment amounts */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">Pilih Nominal Donasi:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[20000, 50000, 100000, 200000, 500000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setPayAmount(amt);
                        setCustomAmount("");
                      }}
                      className={cn(
                        "py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer",
                        payAmount === amt && !customAmount
                          ? "bg-primary border-primary text-text-inverse shadow-md shadow-primary/20"
                          : "bg-canvas border-border-strong text-text-muted hover:border-primary/50 hover:text-text-main"
                      )}
                    >
                      Rp {amt.toLocaleString('id-ID')}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCustomAmount("150000")}
                    className={cn(
                      "py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer",
                      customAmount
                        ? "bg-primary border-primary text-text-inverse"
                        : "bg-canvas border-border-strong text-text-muted hover:border-primary/50 hover:text-text-main"
                    )}
                  >
                    Nominal Lain
                  </button>
                </div>
              </div>

              {customAmount !== null && (
                <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">Nominal Kustom (Rp):</label>
                  <input
                    type="number"
                    placeholder="Masukkan nominal donasi kustom Anda"
                    value={customAmount}
                    onChange={e => setCustomAmount(e.target.value)}
                    className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-sm text-text-main font-mono outline-none focus:border-primary shadow-inner"
                    min="1000"
                    required
                  />
                </div>
              )}

              <div className="bg-canvas border border-border-weak rounded-xl p-3 text-xs text-text-muted leading-relaxed flex gap-2">
                <span>ℹ️</span>
                <span>Metode pembayaran menggunakan pemotongan saldo virtual RT/Simulasi Transfer Bank Instan untuk keperluan pengujian.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-text-inverse font-bold py-3.5 rounded-xl hover:bg-primary/95 transition-all text-xs shadow-lg shadow-primary/25 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? "Memproses Donasi..." : `Konfirmasi Donasi Rp ${(customAmount ? parseInt(customAmount) : payAmount).toLocaleString('id-ID')}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


// ==========================================
// FEATURE 2 & 5: PROFIL KELUARGA TAB (MENU PROFILE & RT/RW SELECTOR)
// ==========================================
function ProfileTab() {
  const [profile, setProfile] = useState({
    name: "Bpk. Rahardian",
    address: "Jl. Merdeka No. 45",
    rt: "05",
    rw: "12",
    phone: "0812-3456-7890",
    familyMembers: ["Ibu Siti (Istri)", "Agus (Anak)", "Rani (Anak)"]
  });

  const [newMember, setNewMember] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user-profile");
    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("user-profile", JSON.stringify(profile));
    setIsSaved(true);
    
    // Broadcast updates to Header.tsx or Sidebar.tsx dynamically
    window.dispatchEvent(new Event("profile-updated"));

    // Also trigger notification
    fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Profil Diperbarui",
        message: "Data identitas Kepala Keluarga dan RT/RW berhasil disimpan dan disinkronisasi.",
        category: "dues"
      })
    });

    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAddMember = () => {
    if (!newMember.trim()) return;
    const updated = {
      ...profile,
      familyMembers: [...profile.familyMembers, newMember.trim()]
    };
    setProfile(updated);
    localStorage.setItem("user-profile", JSON.stringify(updated));
    window.dispatchEvent(new Event("profile-updated"));
    setNewMember("");
  };

  const handleRemoveMember = (idx: number) => {
    const updatedMembers = profile.familyMembers.filter((_, i) => i !== idx);
    const updated = {
      ...profile,
      familyMembers: updatedMembers
    };
    setProfile(updated);
    localStorage.setItem("user-profile", JSON.stringify(updated));
    window.dispatchEvent(new Event("profile-updated"));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-display font-semibold text-text-main">Profil Keluarga & Wilayah</h2>
        <p className="text-sm text-text-muted mt-1">Kelola data kepala keluarga, struktur RT/RW, dan rekam anggota keluarga.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Form */}
        <div className="md:col-span-2 bg-surface border border-border-weak p-6 rounded-3xl shadow-sm space-y-6">
          <h3 className="font-bold text-base text-text-main border-b border-border-weak pb-3">Identitas Kepala Keluarga</h3>
          
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">Nama Lengkap KK</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-sm text-text-main outline-none focus:border-primary shadow-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">Nomor Telepon</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-sm text-text-main outline-none focus:border-primary shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">Alamat Rumah (Blok/No.)</label>
              <input
                type="text"
                value={profile.address}
                onChange={e => setProfile({ ...profile, address: e.target.value })}
                className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-sm text-text-main outline-none focus:border-primary shadow-sm"
                required
              />
            </div>

            {/* FEATURE 5: RT / RW SELECTORS */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-canvas border border-border-weak rounded-2xl">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-primary">Pilih RT (Rukun Tetangga)</label>
                <select
                  value={profile.rt}
                  onChange={e => setProfile({ ...profile, rt: e.target.value })}
                  className="w-full bg-surface border border-border-strong rounded-xl p-3 text-sm text-text-main font-bold outline-none focus:border-primary cursor-pointer shadow-sm"
                >
                  <option value="01">RT 01 - Kebersihan Asri</option>
                  <option value="02">RT 02 - Harapan Warga</option>
                  <option value="03">RT 03 - Gotong Swadaya</option>
                  <option value="04">RT 04 - Mandiri Jaya</option>
                  <option value="05">RT 05 - Harmoni Lestari</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-primary">Pilih RW (Rukun Warga)</label>
                <select
                  value={profile.rw}
                  onChange={e => setProfile({ ...profile, rw: e.target.value })}
                  className="w-full bg-surface border border-border-strong rounded-xl p-3 text-sm text-text-main font-bold outline-none focus:border-primary cursor-pointer shadow-sm"
                >
                  <option value="10">RW 10 - Kompleks Merdeka</option>
                  <option value="11">RW 11 - Graha Permata</option>
                  <option value="12">RW 12 - Alam Sentosa</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border-weak">
              {isSaved ? (
                <span className="text-xs text-primary font-bold animate-pulse flex items-center gap-1">
                  ✓ Profil Keluarga Berhasil Disinkronkan!
                </span>
              ) : (
                <span className="text-xs text-text-muted">Perubahan disinkronkan ke seluruh menu aplikasi.</span>
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

        {/* Family Member Records */}
        <div className="bg-surface border border-border-weak p-6 rounded-3xl shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-base text-text-main">Anggota Keluarga</h3>
            <p className="text-xs text-text-muted mt-0.5">Daftar keluarga terpadu terdaftar di bawah KK Anda (RT 05).</p>
          </div>

          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
            {profile.familyMembers.length === 0 && (
              <p className="text-xs text-text-muted italic text-center py-4">Belum ada anggota keluarga terdaftar.</p>
            )}
            {profile.familyMembers.map((name, idx) => (
              <div key={idx} className="flex justify-between items-center bg-[#142320]/40 [.light_&]:bg-primary/5 p-3.5 rounded-xl border border-border-weak hover:border-primary/20 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs text-text-main font-semibold">{name}</span>
                </div>
                <span className="text-[10px] text-text-muted font-mono uppercase bg-primary/10 px-2 py-0.5 rounded">Terverifikasi</span>
              </div>
            ))}
          </div>

          <div className="border-t border-border-weak pt-4 p-3 bg-primary/5 rounded-2xl border border-primary/10 text-[11px] text-text-muted leading-relaxed">
            <span className="font-bold text-primary block mb-1">Pemberitahuan Sistem:</span>
            Sesuai regulasi administrasi RT 05, data anggota keluarga disinkronkan secara terpusat dengan database kependudukan. Penambahan atau pengurangan anggota keluarga wajib melalui verifikasi manual Ketua RT dengan membawa berkas Kartu Keluarga fisik.
          </div>
        </div>
      </div>
    </div>
  );
}


// ==========================================
// FEATURE 4: FLOATING DATABASE-AWARE SMARTWARGA AI CHATBOT
// ==========================================
// Helper to render formatted AI chatbot messages nicely (bolding, lists, and line-breaks)
function renderBoldText(text: string, isUserMessage: boolean = false) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong 
          key={i} 
          className={cn(
            "font-bold", 
            isUserMessage ? "text-text-inverse" : "text-primary dark:text-primary-light"
          )}
        >
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function renderFormattedMessage(text: string, isUserMessage: boolean = false) {
  if (!text) return null;
  const lines = text.split("\n");
  
  return (
    <div className="space-y-1 whitespace-pre-wrap break-words">
      {lines.map((line, idx) => {
        if (line.trim() === "") {
          return <div key={idx} className="h-1" />;
        }
        
        // Bullet list item
        const bulletMatch = line.match(/^(\s*)([*\-])\s+(.*)$/);
        if (bulletMatch) {
          const indent = bulletMatch[1].length;
          const content = bulletMatch[3];
          return (
            <div 
              key={idx} 
              className={cn(
                "flex items-start gap-1.5", 
                indent > 0 ? "pl-4 text-[11px] text-text-muted" : "pl-1"
              )}
            >
              <span className={cn("mt-1 select-none text-[10px]", isUserMessage ? "text-text-inverse" : "text-primary")}>•</span>
              <span className="flex-1">{renderBoldText(content, isUserMessage)}</span>
            </div>
          );
        }

        // Numbered list item
        const numberMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
        if (numberMatch) {
          const indent = numberMatch[1].length;
          const num = numberMatch[2];
          const content = numberMatch[3];
          return (
            <div 
              key={idx} 
              className={cn(
                "flex items-start gap-1.5", 
                indent > 0 ? "pl-4 text-[11px] text-text-muted" : "pl-1"
              )}
            >
              <span className={cn("font-bold select-none text-[11px] mt-0.5", isUserMessage ? "text-text-inverse" : "text-primary")}>{num}.</span>
              <span className="flex-1">{renderBoldText(content, isUserMessage)}</span>
            </div>
          );
        }
        
        return (
          <p key={idx} className="leading-relaxed">
            {renderBoldText(line, isUserMessage)}
          </p>
        );
      })}
    </div>
  );
}

function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    {
      sender: "ai",
      text: "Halo! Saya adalah Asisten AI SmartWarga RT 05. Ada yang bisa saya bantu seputar informasi lingkungan, iuran kas, status surat, atau laporan warga saat ini?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    }
  }, [messages, loading, isOpen]);

  const demoPrompts = [
    { label: "📊 Saldo Kas", query: "Cek Saldo Kas RT" },
    { label: "💳 Rincian Iuran", query: "Rincian Iuran Bulanan" },
    { label: "📄 Cara E-Surat", query: "Cara Mengajukan E-Surat" },
    { label: "🚨 Cara Melapor", query: "Cara Membuat Laporan" },
    { label: "👥 Profil Keluarga", query: "Data Profil Keluarga" },
    { label: "🧹 Kerja Bakti", query: "Jadwal Kerja Bakti" }
  ];

  const sendMessage = async (userText: string) => {
    if (!userText.trim() || loading) return;

    setMessages(prev => [...prev, { sender: "user", text: userText }]);
    setLoading(true);

    try {
      const res = await fetch("/api/user/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { sender: "ai", text: data.reply || data.text }]);
      } else {
        setMessages(prev => [...prev, { sender: "ai", text: "Maaf, sistem AI SmartWarga sedang mengalami kendala jaringan. Silakan coba kembali." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: "ai", text: "Maaf, gagal menghubungi server AI SmartWarga." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    await sendMessage(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Chat Panel */}
      {isOpen && (
        <div className="bg-sidebar border border-border-strong rounded-3xl w-80 md:w-96 h-[480px] shadow-2xl flex flex-col justify-between mb-4 overflow-hidden animate-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="bg-primary text-text-inverse p-4 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-text-inverse/10 flex items-center justify-center font-bold text-xs">
                🤖
              </div>
              <div>
                <h4 className="font-bold text-xs font-display">Asisten AI SmartWarga</h4>
                <p className="text-[9px] text-text-inverse/80 font-mono">AKTIF • Terhubung ke Database RT</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-text-inverse/80 hover:text-text-inverse font-bold text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-canvas/40 scrollbar-thin">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={cn(
                  "max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed animate-in fade-in slide-in-from-bottom-2",
                  msg.sender === "user" 
                    ? "bg-primary text-text-inverse ml-auto rounded-tr-none shadow-md shadow-primary/10" 
                    : "bg-surface border border-border-weak text-text-main mr-auto rounded-tl-none shadow-sm"
                )}
              >
                {renderFormattedMessage(msg.text, msg.sender === "user")}
              </div>
            ))}
            
            {loading && (
              <div className="bg-surface border border-border-weak text-text-muted p-3 rounded-2xl rounded-tl-none mr-auto text-xs w-20 flex gap-1 justify-center animate-pulse">
                <span>●</span><span>●</span><span>●</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Chips - Horizontal Scroll */}
          <div className="px-3 py-2 border-t border-border-weak/40 bg-surface/80 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            {demoPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendMessage(p.query)}
                disabled={loading}
                className="text-[10px] bg-canvas hover:bg-primary/10 hover:text-primary text-text-muted font-medium border border-border-weak rounded-full px-2.5 py-1 whitespace-nowrap cursor-pointer transition-colors disabled:opacity-50"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input form */}
          <form onSubmit={handleSend} className="p-3 border-t border-border-weak bg-surface flex gap-2">
            <input
              type="text"
              placeholder="Tanyakan status iuran, laporan..."
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 bg-canvas border border-border-strong rounded-xl px-3 py-2 text-xs text-text-main outline-none focus:border-primary shadow-inner"
              disabled={loading}
              required
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-primary text-text-inverse px-3 rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-55"
            >
              🚀
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer",
          isOpen ? "bg-accent text-white" : "bg-primary text-text-inverse"
        )}
        title="Tanya AI SmartWarga"
      >
        {isOpen ? (
          <span className="font-bold text-lg">✕</span>
        ) : (
          <div className="relative">
            <MessageSquare size={26} />
            <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full animate-pulse border border-sidebar">
              AI
            </span>
          </div>
        )}
      </button>
    </div>
  );
}


