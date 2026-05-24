import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { 
  Camera, FileCheck, CheckCircle2, AlertCircle, PhoneCall, 
  MapPin, Clock, Upload, Search, Download, Plus, MessageSquare, CreditCard,
  Home, Heart, Briefcase, HelpingHand, Truck, MoreHorizontal, ShieldAlert,
  Newspaper, Store, Calendar, Tag, AlertTriangle, Building, Megaphone
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
          {currentTab === "news" && <NewsTab />}
          {currentTab === "market" && <MarketTab />}
          {currentTab === "letters" && <LettersTab letters={letters} onLetterAdded={(l) => setLetters([l, ...letters])} />}
          {currentTab === "finance" && <FinanceTab data={finance} />}
          {currentTab === "reports" && <ReportingTab />}
          {currentTab === "dues" && <DuesTab />}
          {currentTab === "storage" && <StorageTab />}
          {currentTab === "panic" && <PanicTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function OverviewTab({ letters, setTab }: { letters: any[], setTab: (tab: string) => void }) {
  const activeLettersCount = letters.filter(l => l.status === "pending").length;

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
              className="bg-accent text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-accent-hover transition-colors shadow-[0_10px_30px_rgba(0,0,0,0.25)] cursor-pointer">
              Buat Surat Pengantar
            </button>
            <button 
              onClick={() => setTab("dues")}
              className="welcome-btn-second bg-transparent border px-5 py-2.5 rounded-full text-sm font-semibold transition-colors cursor-pointer">
              Bayar Iuran
            </button>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-80 h-full opacity-10 pointer-events-none hidden md:block">
           <svg viewBox="0 0 100 100" className="w-full h-full fill-current" preserveAspectRatio="none">
             <polygon points="0,100 100,0 100,100"/>
           </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-text-main flex items-center justify-center mb-4">
             <FileCheck size={24} />
          </div>
          <h3 className="font-semibold font-display text-text-main">Surat Aktif</h3>
          <p className="text-3xl font-light text-text-main mt-2">{activeLettersCount}</p>
          <span className="text-xs text-text-muted mt-1 uppercase tracking-wider">Menunggu RT</span>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-accent/20 text-accent flex items-center justify-center mb-4">
             <AlertCircle size={24} />
          </div>
          <h3 className="font-semibold font-display text-text-main">Laporan Terbuka</h3>
          <p className="text-3xl font-light text-text-main mt-2">0</p>
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
                             <option key={ot} value={ot}>{ot}</option>
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
                   <div key={letter.id} className="flex items-center justify-between p-3 border border-border-weak rounded-xl hover:bg-surface-hover transition-colors">
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

function FinanceTab({ data }: { data: any }) {
  const chartData = data.summary || [];
  const details = data.details || [];
  const totalExpense = chartData.reduce((sum: number, item: any) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text-main">Transparansi Dana Warga</h2>
          <p className="text-sm text-text-muted mt-1">Laporan real-time pemasukan dan pengeluaran kas RT/RW.</p>
        </div>
      </div>

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
                      <Cell key={`cell-${index}`} fill={entry.color} />
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
  const holdTimer = React.useRef<any>(null);
  const HOLD_DURATION = 1500; // 1.5 seconds

  const handleStartHold = () => {
    if (clicked) return;
    const startTime = Date.now();
    holdTimer.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setHoldProgress(progress);
      if (progress >= 100) {
        setClicked(true);
        if (holdTimer.current) clearInterval(holdTimer.current);
      }
    }, 16);
  };

  const handleStopHold = () => {
    if (holdTimer.current) {
      clearInterval(holdTimer.current);
      holdTimer.current = null;
    }
    if (!clicked) {
      setHoldProgress(0);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center h-[calc(100vh-12rem)] max-h-[600px] border border-accent/20 bg-accent/5 rounded-3xl p-6">
      <h2 className="text-3xl font-display font-bold text-text-main mb-2">Darurat Lingkungan?</h2>
      <p className="text-text-muted mb-12 max-w-md">Tahan tombol di bawah selama 1.5 detik untuk langsung memberikan notifikasi ke Petugas Keamanan dan broadcast ke seluruh warga.</p>
      
      <div className="relative">
        {/* Progress ring/border */}
        {!clicked && holdProgress > 0 && (
          <svg className="absolute -top-4 -left-4 w-[calc(100%+32px)] h-[calc(100%+32px)] -rotate-90 pointer-events-none">
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-accent/20"
            />
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray="100 100"
              strokeDashoffset={100 - holdProgress}
              className="text-accent transition-all duration-75"
              pathLength="100"
            />
          </svg>
        )}

        <button 
          onMouseDown={handleStartHold}
          onMouseUp={handleStopHold}
          onMouseLeave={handleStopHold}
          onTouchStart={handleStartHold}
          onTouchEnd={handleStopHold}
          className={cn(
            "relative w-56 h-56 rounded-full flex items-center justify-center text-white transition-all shadow-xl shadow-red-600/30 select-none touch-none",
            clicked ? "bg-red-700 scale-95" : "bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95"
          )}
        >
          {clicked && (
            <span className="absolute w-full h-full rounded-full border-4 border-red-500 animate-ping"></span>
          )}
          <div className="flex flex-col items-center justify-center space-y-2">
            {clicked ? <PhoneCall size={64} className="animate-bounce" /> : <AlertCircle size={64} />}
            <span className="font-display font-bold text-2xl uppercase tracking-widest">
              {clicked ? "Memanggil..." : holdProgress > 0 ? "Menahan..." : "TAHAN PANIC"}
            </span>
          </div>
        </button>
      </div>

      {clicked && (
        <div className="mt-8 px-6 py-3 bg-accent/20 text-accent font-semibold rounded-full text-sm flex items-center gap-2 animate-in fade-in zoom-in">
           <MapPin size={18} /> Lokasi terkirim (Jl. Merdeka No. 45)
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
    fetch('/api/user/reports').then(r => r.json()).then(setReports);
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

  const filteredReports = viewMode === "mine" 
    ? reports.filter(r => r.sender === "Budi Santoso")
    : reports.filter(r => r.isPublic);

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
                  className="w-full bg-canvas border border-border-strong rounded-lg p-2.5 text-sm outline-none focus:border-primary text-text-main"
                >
                   <option value="Infrastruktur">Infrastruktur (Lampu, Jalan)</option>
                   <option value="Kebersihan">Kebersihan (Sampah, Selokan)</option>
                   <option value="Keamanan">Keamanan & Ketertiban</option>
                   <option value="Lainnya">Lainnya</option>
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
                      <img src={report.image} alt="Report attachment" className="h-40 w-auto rounded-lg shadow-sm border border-border-weak" />
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

function DuesTab() {
  const [dues, setDues] = useState<any[]>([]);
  const [activeReminder, setActiveReminder] = useState<any>(null);
  const [selectedDue, setSelectedDue] = useState<any>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  
  // Payment Form States
  const [bankName, setBankName] = useState("BCA");
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
    
    // Check if we have reminders in the system (we will pull residents index RES-01 or residents reminders)
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

  const submitPaymentProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDue) return;
    if (!senderName) return alert("Mohon nama pengirim transfer diisi!");

    setSubmittingPayment(true);
    try {
      const res = await fetch(`/api/user/dues/${selectedDue.id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bank: bankName,
          sender: senderName,
          amount: Number(transferAmount),
          date: transferDate,
          image: proofImage
        })
      });
      if (res.ok) {
        // Reload dues
        const updatedRes = await fetch('/api/user/dues');
        const updatedDues = await updatedRes.json();
        setDues(updatedDues);
        alert("Bukti pembayaran telah berhasil dikirim! Menunggu konfirmasi verifikasi dari Pengurus RT.");
        setShowPayModal(false);
        setProofImage(null);
        setSenderName("");
      } else {
        alert("Gagal mengirimkan pembayaran.");
      }
    } catch {
      alert("Terjadi masalah jaringan.");
    } finally {
      setSubmittingPayment(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-display font-semibold text-text-main">Iuran Warga</h2>
        <p className="text-sm text-text-muted mt-1">Kelola, verifikasi, dan bayar iuran swadaya warga secara transparan.</p>
      </div>

      {activeReminder && (
        <div className="bg-accent/15 border-l-4 border-accent p-4 rounded-r-2xl flex items-start gap-3 shadow-sm animate-pulse">
          <AlertTriangle className="text-accent shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-bold text-accent text-sm uppercase tracking-wider">Pengingat Tagihan Pengurus RT</h4>
            <p className="text-xs text-text-main mt-0.5 leading-relaxed font-mono">{activeReminder.message}</p>
            <span className="text-[10px] text-text-muted mt-1 block">Dikirimkan tanggal: {activeReminder.date}</span>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {dues.length === 0 && <p className="text-sm text-text-muted text-center py-8">Belum ada tagihan iuran.</p>}
          {dues.map(due => (
            <div key={due.id} className="bg-surface border border-border-weak p-6 rounded-2xl space-y-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-inner",
                    due.status === "paid" ? "bg-primary/20 text-primary" : due.status === "pending" ? "bg-accent/20 text-accent animate-pulse" : "bg-red-500/20 text-red-400"
                  )}>
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-main text-lg">Tagihan Iuran {due.month}</h4>
                    <p className="text-sm text-text-muted">Total: Rp {due.amount.toLocaleString('id-ID')}</p>
                  </div>
                </div>

                <div className="text-right">
                  {due.status === "paid" ? (
                    <div className="bg-primary/10 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">LUNAS</span>
                    </div>
                  ) : due.status === "pending" ? (
                    <div className="bg-accent/10 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-accent animate-ping"></span>
                      <span className="text-xs font-bold text-accent uppercase tracking-wider">PENDING VERIFIKASI</span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => openPaymentForm(due)}
                      className="bg-primary text-text-inverse px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all hover:scale-[1.03] shadow-md shadow-primary/10"
                    >
                      Bayar & Upload Bukti
                    </button>
                  )}
                  {due.status === "paid" && (
                    <p className="text-[10px] text-text-muted mt-1 opacity-70">Verifikasi tanggal: {due.date}</p>
                  )}
                </div>
              </div>

              {/* Transparansi: Itemized breakdown showing transparent uses of collected money */}
              <div className="border-t border-border-weak pt-4 bg-canvas/30 p-4 rounded-xl space-y-2">
                <h5 className="text-xs uppercase tracking-wider font-bold text-text-muted flex items-center justify-between">
                  <span>Rincian Penggunaan Iuran Bulanan</span>
                  <span className="text-primary normal-case font-medium font-mono">Transparansi 100%</span>
                </h5>
                <div className="divide-y divide-border-weak/50">
                  {due.categories?.map((cat: any, i: number) => (
                    <div key={i} className="py-2 flex justify-between items-start text-xs text-text-main">
                      <div className="max-w-[80%]">
                        <span className="font-semibold">{cat.name}</span>
                        <p className="text-[10px] text-text-muted leading-relaxed">{cat.desc}</p>
                      </div>
                      <span className="font-mono text-primary font-semibold shrink-0">Rp {cat.amount.toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Summary Card */}
        <div className="md:col-span-1">
          <div className="bg-surface rounded-3xl p-6 border border-border-weak space-y-6 md:sticky top-28">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted">Ringkasan Keuangan Anda</h3>
              <p className="text-xs text-text-muted mt-0.5">Pantau status kewajiban iuran lingkungan Anda.</p>
            </div>

            <div className="p-4 bg-canvas/50 border border-border-weak rounded-2xl flex flex-col justify-between">
              <span className="text-xs text-text-muted">Total Belum Terbayar</span>
              <p className="text-3xl font-display font-black text-accent mt-2 font-mono">
                Rp {dues.filter(d => d.status === "unpaid").reduce((sum, d) => sum + d.amount, 0).toLocaleString('id-ID')}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted">Bulan Ini (November)</span>
                {dues.find(d => d.month === "November 2023")?.status === "paid" ? (
                  <span className="text-xs font-bold text-primary">LUNAS</span>
                ) : dues.find(d => d.month === "November 2023")?.status === "pending" ? (
                  <span className="text-xs font-bold text-accent">MENUNGGU VERIFIKASI</span>
                ) : (
                  <span className="text-xs font-bold text-red-400">TUNGGAKAN</span>
                )}
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted">Bulan Lalu (Oktober)</span>
                <span className="text-xs font-bold text-primary font-mono">LUNAS</span>
              </div>
            </div>

            <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 text-xs text-text-muted leading-relaxed space-y-2">
              <p className="font-semibold text-text-main">📌 Informasi Metode Pembayaran:</p>
              <p>Pembayaran dapat dilakukan melalui transfer bank ke rekening warga:</p>
              <div className="bg-canvas p-2.5 rounded-lg font-mono text-text-main border border-border-weak space-y-1">
                <p>Bank: <strong>MANDIRI</strong></p>
                <p>Rekening: <strong>123-0005-4321-00</strong></p>
                <p>Atas Nama: <strong>Kas RT 05 RW 12</strong></p>
              </div>
              <p>Gunakan opsi upload bukti transfer di samping setelah melakukan pembayaran.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Khusus Bukti Pembayaran Modal Popup */}
      {showPayModal && selectedDue && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-sidebar rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative border border-border-weak overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-text-main mb-2 font-display">Kirim Bukti Pembayaran</h3>
            <p className="text-xs text-text-muted mb-6 leading-relaxed">
              Silakan lengkapi konfirmasi pembayaran di bawah ini agar Pengurus RT dapat memverifikasi transaksi iuran Anda.
            </p>

            <form onSubmit={submitPaymentProof} className="space-y-4">
              <div className="p-3.5 bg-canvas rounded-xl text-xs space-y-1 border border-border-weak mb-2">
                <p className="text-text-muted font-semibold">Mengonfirmasi Iuran:</p>
                <p className="text-text-main text-sm font-bold">Tagihan {selectedDue.month}</p>
                <p className="text-primary font-mono font-bold text-base">Total Tagihan: Rp {selectedDue.amount.toLocaleString('id-ID')}</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-text-muted mb-2 tracking-wide">Bank Tujuan Transfer</label>
                <select 
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-sm text-text-main outline-none focus:border-primary font-bold"
                >
                  <option value="MANDIRI">MANDIRI (RT 05 Account)</option>
                  <option value="BCA">BCA (Operasional)</option>
                  <option value="BRI">BRI (Bantuan Sosial)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-text-muted mb-2 tracking-wide">Nama Pemilik Rekening Pengirim</label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={senderName}
                  onChange={e => setSenderName(e.target.value)}
                  className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-sm text-text-main outline-none focus:border-primary font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-text-muted mb-2 tracking-wide font-mono">Tanggal Layanan</label>
                  <input 
                    type="date"
                    required
                    value={transferDate}
                    onChange={e => setTransferDate(e.target.value)}
                    className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-sm text-text-main outline-none focus:border-primary font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-text-muted mb-2 tracking-wide font-mono">Jumlah Transfer (Rp)</label>
                  <input 
                    type="number"
                    required
                    value={transferAmount}
                    onChange={e => setTransferAmount(e.target.value)}
                    className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-sm text-text-main outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-text-muted mb-2 tracking-wide">Bukti Foto / Capture Resi Transfer</label>
                <div className="mt-1 flex justify-center px-4 py-8 border-2 border-border-strong border-dashed rounded-xl bg-canvas hover:bg-surface-hover transition-colors text-center cursor-pointer">
                  <div className="space-y-1 text-center">
                    {!proofImage ? (
                      <>
                        <Upload className="mx-auto h-8 w-8 text-primary animate-bounce mt-1" />
                        <div className="flex text-xs text-text-muted mt-2 justify-center">
                          <label className="relative cursor-pointer bg-transparent rounded-md font-bold text-primary hover:text-primary/80 focus-within:outline-none">
                            <span>Sematkan File Resi</span>
                            <input type="file" className="sr-only" accept="image/*" onChange={handleProofImageChange} />
                          </label>
                        </div>
                        <p className="text-[10px] text-text-muted mt-1 leading-relaxed">PNG, JPG, Screen Capture Bank App up to 5MB</p>
                      </>
                    ) : (
                      <div className="relative inline-block">
                        <img src={proofImage} alt="Receipt Preview" className="h-28 w-auto rounded-lg shadow-sm" />
                        <button 
                          type="button" 
                          onClick={() => setProofImage(null)}
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
                  onClick={handleCancelPayment}
                  className="px-5 py-2.5 rounded-xl text-sm text-text-muted hover:text-text-main font-semibold"
                >
                  Gagal / Batalkan
                </button>
                <button 
                  type="submit"
                  disabled={submittingPayment}
                  className="bg-primary text-text-inverse px-7 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {submittingPayment ? "Mengirimkan..." : "Kirim Bukti Pembayaran"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function NewsTab() {
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(setArticles)
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-display font-semibold text-text-main">Portal Berita RT 05</h2>
        <p className="text-sm text-text-muted mt-1">Dapatkan pengumuman dan liputan penting terpercaya seputar lingkungan pemukiman.</p>
      </div>

      {articles.length > 0 && (
        <div className="bg-surface border border-border-weak rounded-3xl overflow-hidden shadow-lg grid md:grid-cols-2 items-center">
          <img 
            src={articles[0].image} 
            alt={articles[0].title}
            className="w-full h-64 md:h-full object-cover"
          />
          <div className="p-6 md:p-8 space-y-4">
            <span className="bg-primary/20 text-primary font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              {articles[0].category}
            </span>
            <h3 className="text-2xl font-bold text-text-main line-clamp-2 leading-tight">
              {articles[0].title}
            </h3>
            <p className="text-sm text-text-muted leading-relaxed font-sans line-clamp-3">
              {articles[0].summary}
            </p>
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-text-muted font-mono">{articles[0].date} • Oleh: Pengurus RT</span>
              <button 
                onClick={() => setSelectedArticle(articles[0])}
                className="text-primary font-bold text-xs flex items-center gap-1 hover:underline cursor-pointer"
              >
                Baca Lengkap &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-6 pt-4">
        {articles.slice(1).map(art => (
          <div key={art.id} className="bg-surface border border-border-weak rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div>
              <img 
                src={art.image} 
                alt={art.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-5 space-y-2">
                <span className="text-[10px] bg-primary/10 text-primary font-bold tracking-wider rounded px-2 py-0.5 uppercase">
                  {art.category}
                </span>
                <h4 className="font-bold text-text-main text-base line-clamp-2">
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
                className="text-primary font-bold hover:underline"
              >
                Selengkapnya
              </button>
            </div>
          </div>
        ))}
      </div>

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
  const [subTab, setSubTab] = useState<"umkm" | "promo">("umkm");
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

  const fetchUMKM = () => {
    fetch('/api/umkm').then(r => r.json()).then(setListings);
    fetch('/api/ads').then(r => r.json()).then(setAds);
  };

  useEffect(() => {
    fetchUMKM();
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

      <div className="flex border-b border-border-weak">
        <button 
          onClick={() => setSubTab("umkm")}
          className={cn(
            "py-3 px-6 text-sm font-semibold border-b-2 transition-colors cursor-pointer",
            subTab === "umkm" ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text-main"
          )}
        >
          Direktori UMKM Lingkungan
        </button>
        <button 
          onClick={() => setSubTab("promo")}
          className={cn(
            "py-3 px-6 text-sm font-semibold border-b-2 transition-colors cursor-pointer",
            subTab === "promo" ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text-main"
          )}
        >
          Sponsor, Promosi & Iklan
        </button>
      </div>

      {subTab === "umkm" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.length === 0 && <p className="text-sm text-text-muted text-center py-8 col-span-full">Belum ada UMKM terdaftar.</p>}
          {listings.map(umkm => (
            <div key={umkm.id} className="bg-surface border border-border-weak rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
              <div>
                <img 
                  src={umkm.image} 
                  alt={umkm.name} 
                  className="w-full h-44 object-cover"
                />
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
      ) : (
        <div className="space-y-6">
          {/* Main big sponsor banner ad */}
          <div className="bg-gradient-to-r from-accent/25 to-primary/10 border-2 border-accent/20 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row gap-6 items-center justify-between shadow-md relative overflow-hidden">
            <span className="absolute -top-1 right-2 bg-accent text-white uppercase text-[8px] font-bold tracking-widest px-2.5 py-1 rounded-b">SPONSORED PLACEMENT</span>
            <div className="space-y-4 max-w-lg">
              <span className="text-xs font-bold uppercase tracking-widest bg-accent-light text-text-inverse px-3 py-1 rounded-full">{ads[0]?.sponsor || "OFFERING"}</span>
              <h3 className="text-2xl font-black font-display text-text-main leading-tight">{ads[0]?.title || "Pasang IndiHome Free Pendaftaran"}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{ads[0]?.desc || "Nikmati kecepatan 50Mbps gratis pemasangan baru se-kawasan SmartWarga selama bulan ini."}</p>
              <button 
                onClick={() => alert(`Silakan hubungi admin lingkungan RT untuk promo: ${ads[0]?.sponsor}`)}
                className="bg-accent text-white font-bold py-2.5 px-6 rounded-xl text-xs hover:scale-105 transition-all shadow-md shadow-accent/20"
              >
                {ads[0]?.cta || "Ambil Penawaran"}
              </button>
            </div>
            {ads[0]?.image && (
              <img 
                src={ads[0].image} 
                alt="Sponsor Ad" 
                className="w-full md:w-64 h-40 object-cover rounded-2xl shadow-sm border border-border-weak"
              />
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {ads.slice(1).map(ad => (
              <div key={ad.id} className="bg-surface border border-border-weak rounded-2xl p-5 flex gap-4 items-center shadow-sm relative">
                <span className="absolute top-2 right-2 text-[8px] font-bold tracking-widest text-[#fb923c] uppercase bg-accent-light/10 px-2 py-0.5 rounded">Ad</span>
                <img 
                  src={ad.image} 
                  alt={ad.title} 
                  className="w-24 h-24 object-cover rounded-xl shrink-0"
                />
                <div className="space-y-1">
                  <span className="text-[10px] text-[#fb923c] font-black uppercase font-mono tracking-wide">{ad.sponsor}</span>
                  <h4 className="font-bold text-sm text-text-main leading-snug">{ad.title}</h4>
                  <p className="text-xs text-text-muted line-clamp-2">{ad.desc}</p>
                  <button 
                    onClick={() => alert(`Membuka sponsorship penawaran: ${ad.sponsor}`)}
                    className="text-primary font-bold text-xs hover:underline decoration-primary pt-1 inline-block"
                  >
                    {ad.cta} &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                    className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-sm text-text-main outline-none focus:border-primary font-bold"
                  >
                    <option value="Makanan & Minuman">Makanan & Minuman</option>
                    <option value="Kebutuhan Pokok">Kebutuhan Pokok / Sembako</option>
                    <option value="Jasa">Jasa Pelayanan</option>
                    <option value="Kerajinan">Kerajinan / Atribut</option>
                    <option value="Kesehatan">Kesehatan & Kecantikan</option>
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
