import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { 
  Camera, FileCheck, CheckCircle2, AlertCircle, PhoneCall, 
  MapPin, Clock, Upload, Search, Download, Plus, MessageSquare, CreditCard,
  Home, Heart, Briefcase, HelpingHand, Truck, MoreHorizontal, ShieldAlert,
  Newspaper, Store, Calendar, Tag, AlertTriangle, Building, Megaphone, Users
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
    <div className="w-full max-w-6xl mx-auto pb-20">
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
          {currentTab === "reports" && <ReportingTab />}
          {currentTab === "panic" && <PanicTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function OverviewTab({ letters, setTab }: { letters: any[], setTab: (tab: string) => void }) {
  const activeLettersCount = letters.filter(l => l.status === "pending").length;
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="space-y-6">
      <div className="welcome-banner rounded-3xl p-8 relative overflow-hidden shadow-lg">
        <div className="relative z-10 w-full md:w-2/3">
          <h1 className="text-3xl font-display font-bold mb-2 welcome-title">
            Selamat datang, Budi Santoso
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
        body: JSON.stringify({ type, keperluan, signature: canvasRef.current?.toDataURL() })
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
      ["Nama", `: ${letter.name || "Budi Santoso"}`],
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
    doc.text(`(${letter.name || "Budi Santoso"})`, 30, sigY + 30);

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
  const [subTab, setSubTab] = useState<"finance" | "dues">("finance");
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

function ReportingTab() {
  const [reports, setReports] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Infrastruktur");
  const [isPublic, setIsPublic] = useState(true);
  
  const reportCategories = [
    { id: "Infrastruktur", label: "Lampu/Jalan", icon: <MapPin size={20} />, color: "bg-blue-50 text-blue-600 border-blue-100" },
    { id: "Kebersihan", label: "Sampah", icon: <Plus size={20} />, color: "bg-green-50 text-green-600 border-green-100" },
    { id: "Keamanan", label: "Keamanan", icon: <ShieldAlert size={20} />, color: "bg-red-50 text-red-600 border-red-100" },
  ];
  const [image, setImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<"mine" | "public">("mine");

  useEffect(() => {
    fetch('/api/user/reports').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setReports(data);
      else setReports([]);
    }).catch(() => setReports([]));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location) return alert("Semua kolom harus diisi!");
    setSubmitting(true);
    try {
      const res = await fetch("/api/user/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, location, image, isPublic, category })
      });
      const newReport = await res.json();
      setReports([newReport, ...reports]);
      setTitle("");
      setLocation("");
      setImage(null);
      alert("Laporan berhasil dikirim!");
    } catch (e) {
      alert("Gagal mengirim laporan.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReports = Array.isArray(reports) ? (viewMode === "mine" 
    ? reports.filter(r => r.sender === "Budi Santoso")
    : reports.filter(r => r.isPublic)) : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text-main">E-Reporting</h2>
          <p className="text-sm text-text-muted mt-1">Sistem pelaporan masalah lingkungan (infrastruktur, keamanan, ketertiban).</p>
        </div>
        <div className="flex bg-surface rounded-lg p-1 border border-border-weak">
          <button 
            onClick={() => setViewMode("mine")}
            className={cn("px-4 py-1.5 text-xs font-semibold rounded-md transition-all", viewMode === "mine" ? "bg-primary text-text-inverse shadow-sm" : "text-text-muted hover:text-text-main")}
          >
            Laporan Saya
          </button>
          <button 
            onClick={() => setViewMode("public")}
            className={cn("px-4 py-1.5 text-xs font-semibold rounded-md transition-all", viewMode === "public" ? "bg-primary text-text-inverse shadow-sm" : "text-text-muted hover:text-text-main")}
          >
            Laporan Warga
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {viewMode === "mine" && (
          <div className="md:col-span-1 border border-border-strong rounded-2xl p-6 bg-surface h-fit overflow-hidden">
            <h3 className="font-semibold text-text-main mb-4">Buat Laporan Baru</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Pilih Kategori</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  style={{ background: 'var(--canvas)', color: 'var(--text-main)' }}
                  className="w-full border border-border-strong rounded-lg p-2.5 text-sm outline-none focus:border-primary"
                >
                   <option style={{ background: 'var(--canvas)', color: 'var(--text-main)' }} value="Infrastruktur">Infrastruktur (Lampu, Jalan)</option>
                   <option style={{ background: 'var(--canvas)', color: 'var(--text-main)' }} value="Kebersihan">Kebersihan (Sampah, Selokan)</option>
                   <option style={{ background: 'var(--canvas)', color: 'var(--text-main)' }} value="Keamanan">Keamanan & Ketertiban</option>
                   <option style={{ background: 'var(--canvas)', color: 'var(--text-main)' }} value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Judul Laporan</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Misal: Lampu Jalan Padam di Blok D"
                  className="w-full bg-canvas border border-border-strong rounded-lg p-2.5 text-sm outline-none focus:border-primary text-text-main" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Lokasi Detail</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Jalan, Blok, atau patokan terdekat"
                  className="w-full bg-canvas border border-border-strong rounded-lg p-2.5 text-sm outline-none focus:border-primary text-text-main" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Foto Pendukung (Opsional)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border-strong border-dashed rounded-lg bg-canvas hover:bg-surface-hover transition-colors">
                  <div className="space-y-1 text-center">
                    {!image ? (
                      <>
                        <Camera className="mx-auto h-12 w-12 text-text-muted" />
                        <div className="flex text-sm text-text-muted">
                          <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none">
                            <span>Unggah foto</span>
                            <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                          </label>
                          <p className="pl-1">atau tarik seret</p>
                        </div>
                        <p className="text-xs text-text-muted">PNG, JPG, GIF up to 5MB</p>
                      </>
                    ) : (
                      <div className="relative inline-block">
                        <img src={image} alt="Preview" className="h-32 w-auto rounded-lg shadow-sm" />
                        <button 
                          type="button" 
                          onClick={() => setImage(null)}
                          className="absolute -top-2 -right-2 bg-accent text-white p-1 rounded-full shadow-md"
                        >
                          <Plus size={14} className="rotate-45" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 py-2">
                 <input 
                   type="checkbox" 
                   id="public_report" 
                   checked={isPublic} 
                   onChange={e => setIsPublic(e.target.checked)}
                   className="accent-primary"
                 />
                 <label htmlFor="public_report" className="text-xs text-text-muted font-medium cursor-pointer">Publikasikan laporan agar warga lain dapat melihat</label>
              </div>
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-primary text-text-inverse font-semibold py-3 rounded-lg hover:bg-surface-hover transition-colors"
              >
                {submitting ? "Kirim Laporan..." : "Kirim Laporan"}
              </button>
            </form>
          </div>
        )}

        <div className={cn(
          "border border-border-strong rounded-2xl p-6 bg-surface",
          viewMode === "mine" ? "md:col-span-2" : "md:col-span-3"
        )}>
           <h3 className="font-semibold text-text-main mb-4">{viewMode === "mine" ? "Laporan Saya" : "Laporan Publik Warga"}</h3>
           <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
             {filteredReports.length === 0 && <p className="text-sm text-text-muted text-center py-8">Belum ada laporan.</p>}
             {filteredReports.map(report => (
               <div key={report.id} className="border border-border-weak p-4 rounded-xl flex flex-col gap-4 hover:border-border-strong transition-colors bg-canvas/30">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                      <MessageSquare size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                         <h4 className="font-semibold text-text-main">{report.title}</h4>
                         <span className={cn(
                            "text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md",
                            report.status === "SELESAI" ? "bg-primary/20 text-primary" : 
                            report.status === "PROSES" ? "bg-blue-500/20 text-blue-500" : "bg-accent/20 text-accent"
                         )}>{report.status}</span>
                      </div>
                      <p className="text-xs text-text-muted mb-2">
                        {viewMode === "public" && <span className="font-semibold text-primary mr-2">{report.sender}</span>}
                        <MapPin size={12} className="inline mr-1" />{report.location} • {report.date}
                      </p>
                    </div>
                  </div>
                  {report.image && (
                    <div className="ml-16">
                      <img src={report.image} alt="Report attachment" referrerPolicy="no-referrer" className="h-40 w-auto rounded-lg shadow-sm border border-border-weak" />
                    </div>
                  )}
                  {report.status === "SELESAI" && (
                     <div className="ml-16 bg-primary/20 p-2.5 rounded-lg text-xs border border-primary/20 text-text-main shadow-sm animate-in fade-in slide-in-from-left-2 transition-all">
                        <strong className="text-primary block mb-1 uppercase tracking-widest text-[9px]">Tanggapan RT:</strong> 
                        <p className="leading-relaxed">Terima kasih, laporan sudah ditindaklanjuti dan selesai dikerjakan kemarin sore bersama tim lingkungan.</p>
                     </div>
                  )}
               </div>
             ))}
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
      image: "https://images.unsplash.com/photo-1592861115865-c8bc0cb43c74?auto=format&fit=crop&q=80&w=600" 
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

  const toggleJoin = (id: number) => {
    setEvents(events.map(ev => {
      if (ev.id === id) {
        return { ...ev, joined: !ev.joined, participants: ev.joined ? ev.participants - 1 : ev.participants + 1 };
      }
      return ev;
    }));
  };

  useEffect(() => {
    // using static newsData
  }, []);

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
                    {art.summary}
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
              </div>
              
              <button 
                onClick={() => toggleJoin(ev.id)}
                className={cn(
                  "w-full py-2.5 rounded-xl text-sm font-bold transition-all mt-4 cursor-pointer",
                  ev.joined 
                    ? "bg-canvas border border-border-strong text-text-main hover:bg-surface-hover hover:text-accent" 
                    : "bg-primary text-text-inverse hover:bg-primary/90 shadow-md shadow-primary/20"
                )}
              >
                {ev.joined ? "Batal Ikut Serta" : "Yuk, Ikut Serta!"}
              </button>
            </div>
          ))}
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


