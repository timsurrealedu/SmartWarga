import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, UserCheck, FileText, Check, X, Search, Upload, Camera, CheckCircle2, User, Plus, MessageSquare, CreditCard,
  Download, ChevronDown, ChevronUp, Newspaper, Store, Calendar, Megaphone, AlertTriangle, Tag, PhoneCall
} from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export function AdminDashboard({ currentTab, setTab }: { currentTab: string, setTab: (tab: string) => void }) {
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
          {currentTab === "dashboard" && <AdminOverviewTab setTab={setTab} />}
          {currentTab === "news_manage" && <AdminNewsTab />}
          {currentTab === "market_manage" && <AdminMarketTab />}
          {currentTab === "validations" && <ValidationsTab />}
          {currentTab === "finance_manage" && <AdminFinanceTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function AdminOverviewTab({ setTab }: { setTab: (tab: string) => void }) {
  const [isLettersOpen, setIsLettersOpen] = useState(true);
  const [isTicketsOpen, setIsTicketsOpen] = useState(false);

  const toggleLetters = () => {
    setIsLettersOpen(!isLettersOpen);
    if (!isLettersOpen) setIsTicketsOpen(false);
  };

  const toggleTickets = () => {
    setIsTicketsOpen(!isTicketsOpen);
    if (!isTicketsOpen) setIsLettersOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface text-text-main p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] md:col-span-2 relative overflow-hidden">
           <h2 className="text-2xl font-display font-semibold mb-1">Dashboard Pengurus</h2>
           <p className="text-sm text-text-muted mb-6">Ringkasan aktivitas warga RT 04 hari ini.</p>
           <div className="flex gap-4">
              <div className="bg-canvas border border-border-weak px-4 py-3 rounded-xl flex-1 md:flex-initial min-w-[124px]">
                 <p className="text-xs uppercase tracking-wider text-text-muted font-medium">Total Warga</p>
                 <p className="text-2xl font-display font-bold text-text-main">142 KK</p>
              </div>
              <div className="bg-canvas border border-border-weak px-4 py-3 rounded-xl flex-1 md:flex-initial min-w-[124px]">
                 <p className="text-xs uppercase tracking-wider text-text-muted font-medium">Aman/Kondusif</p>
                 <p className="text-2xl font-display font-bold text-emerald-800 dark:text-primary">Yes</p>
              </div>
           </div>
           <div className="flex gap-4 mt-6">
              <button 
                onClick={toggleLetters} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  isLettersOpen 
                    ? "bg-primary text-text-inverse hover:bg-primary/90" 
                    : "bg-surface text-text-main border border-border-strong hover:bg-surface-hover"
                }`}
              >
                {isLettersOpen ? "Tutup Surat" : "Cek Surat"}
                {isLettersOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <button 
                onClick={toggleTickets} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  isTicketsOpen 
                    ? "bg-primary text-text-inverse hover:bg-primary/90" 
                    : "bg-surface text-text-main border border-border-strong hover:bg-surface-hover"
                }`}
              >
                {isTicketsOpen ? "Tutup Laporan" : "Lihat Laporan"}
                {isTicketsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak flex flex-col items-center justify-center text-center">
            <UserCheck size={32} className="text-accent mb-2" />
            <p className="text-3xl font-display font-semibold text-text-main">5</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mt-1">Surat Menunggu</p>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak flex flex-col items-center justify-center text-center">
            <Users size={32} className="text-text-muted mb-2" />
            <p className="text-3xl font-display font-semibold text-text-main">2</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mt-1">Validasi Warga Baru</p>
        </div>
      </div>
      
      {/* Collapsible Sections */}
      <AnimatePresence>
        {isLettersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border-weak pt-6">
              <LettersApprovalTab />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isTicketsOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border-weak pt-6">
              <AdminTicketsTab />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LettersApprovalTab() {
  const [letters, setLetters] = useState<any[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<any | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

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
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2 flex justify-between">
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

      <div className="bg-surface rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak overflow-hidden">
        <div className="p-4 border-b border-border-weak flex gap-4 bg-surface">
           <div className="relative flex-1">
             <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
             <input type="text" placeholder="Cari nama warga..." className="w-full pl-10 pr-4 py-2 text-sm bg-surface border border-border-strong rounded-lg outline-none focus:border-primary" />
           </div>
           <select className="px-4 py-2 text-sm bg-surface border border-border-strong rounded-lg outline-none">
             <option>Semua Status</option>
             <option>Menunggu Validasi</option>
             <option>Selesai</option>
           </select>
        </div>
        <div className="divide-y divide-black/5">
           {letters.map((letter) => (
             <div key={letter.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-hover transition-colors">
               <div className="flex items-start gap-4">
                 <div className={cn("p-2 rounded-lg", letter.status === "pending" ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary")}>
                    <FileText size={24} />
                 </div>
                 <div>
                   <h3 className="flex items-center gap-2 font-semibold text-text-main">
                     {letter.name}
                     {letter.status === "pending" && (
                        <span className="text-[10px] bg-red-400/20 text-red-500 px-2 py-0.5 rounded uppercase font-bold tracking-wider animate-pulse border border-red-400">
                          Overdue (Lebih dari 2 Hari)
                        </span>
                     )}
                   </h3>
                   <p className="text-sm text-text-muted">{letter.type}</p>
                   <p className="text-xs text-text-muted mt-1 uppercase tracking-wider font-semibold">{letter.id} — {letter.date}</p>
                 </div>
               </div>
                              {letter.status === "pending" ? (
                 <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={() => handleReject(letter.id)}
                      className="flex items-center gap-1 bg-accent/20 text-accent hover:bg-accent/40 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                    >
                       <X size={16} /> Tolak
                    </button>
                    <button 
                      onClick={() => setSelectedLetter(letter)}
                      className="flex items-center gap-1 bg-primary text-text-inverse hover:bg-primary/80 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                    >
                       Tinjau Surat
                    </button>
                 </div>
               ) : (
                 <div className="flex items-center gap-2 shrink-0">
                    {letter.status === "approved" && (
                      <button 
                        onClick={() => handleDownloadPDF(letter)}
                        className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                        title="Download PDF"
                      >
                        <Download size={14} />
                      </button>
                    )}
                    <div className={cn(
                      "px-4 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider shrink-0 flex items-center gap-2",
                      letter.status === "approved" ? "bg-primary/20 text-primary" : "bg-red-900/40 text-red-400"
                    )}>
                       {letter.status === "approved" ? <><Check size={16} /> Disetujui</> : <><X size={16} /> Ditolak</>}
                    </div>
                 </div>
               )}
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

function ValidationsTab() {
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);

  const simulateOCR = () => {
    setOcrScanning(true);
    // Simulate network delay for OCR
    setTimeout(() => {
      setOcrScanning(false);
      setOcrResult({
        nik: "3273112345678900",
        name: "Agus Pratama",
        tempatLahir: "Bandung",
        tanggalLahir: "14-08-1985",
        alamat: "Jl. Merdeka No. 45",
        rt: "05",
        rw: "12",
        agama: "Islam",
        status: "Kawin"
      });
    }, 2500);
  };

  const handleValidate = () => {
    alert("Warga divalidasi dan disimpan ke database!");
    setOcrResult(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-semibold text-text-main">Validasi Warga Baru (OCR)</h2>
        <p className="text-sm text-text-muted mt-1">Unggah KTP/KK untuk mempercepat pengisian data warga baru secara otomatis.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
           <div className="bg-surface border-2 border-dashed border-border-strong rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-colors hover:bg-surface-hover">
              <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4">
                 {ocrScanning ? <Camera size={28} className="animate-pulse" /> : <Upload size={28} />}
              </div>
              <p className="font-semibold text-text-main mb-1">Unggah KTP / KK Warga</p>
              <p className="text-xs text-text-muted mb-6 max-w-[200px]">Format JPG/PNG maks 5MB. AI akan mengekstrak data otomatis.</p>
              <button 
                onClick={simulateOCR} 
                disabled={ocrScanning}
                className={cn("px-6 py-2.5 rounded-full font-medium text-sm transition-colors border border-border-strong", ocrScanning ? "bg-surface text-text-muted" : "bg-primary text-text-inverse hover:bg-primary/80")}
              >
                {ocrScanning ? "Memindai dengan AI..." : "Pilih File Dokumen"}
              </button>
           </div>
        </div>

        <div className="bg-surface p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak">
          <h3 className="font-semibold text-text-main mb-4 flex items-center gap-2">
            <User size={20} className="text-primary" /> Data Hasil Ekstraksi
          </h3>
          
          {!ocrResult && !ocrScanning && (
            <div className="h-48 flex items-center justify-center text-sm text-text-muted text-center border-2 border-dashed border-border-weak rounded-xl">
              Belum ada data.<br/>Silakan unggah dokumen untuk memulai scan OCR.
            </div>
          )}

          {ocrScanning && (
            <div className="h-48 flex flex-col items-center justify-center gap-3 text-sm text-text-muted border-2 border-dashed border-border-weak rounded-xl">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              Sedang mengekstrak data...
            </div>
          )}

          {ocrResult && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-text-muted mb-1 tracking-wider">NIK</label>
                  <input type="text" defaultValue={ocrResult.nik} className="w-full bg-canvas border border-border-strong rounded-lg p-2 text-sm text-text-main focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-text-muted mb-1 tracking-wider">Nama Lengkap</label>
                  <input type="text" defaultValue={ocrResult.name} className="w-full bg-canvas border border-border-strong rounded-lg p-2 text-sm text-text-main focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-text-muted mb-1 tracking-wider">Tempat, Tgl Lahir</label>
                  <input type="text" defaultValue={`${ocrResult.tempatLahir}, ${ocrResult.tanggalLahir}`} className="w-full bg-canvas border border-border-strong rounded-lg p-2 text-sm text-text-main focus:outline-none focus:border-primary" />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-[10px] uppercase font-bold text-text-muted mb-1 tracking-wider">RT</label>
                    <input type="text" defaultValue={ocrResult.rt} className="w-full bg-canvas border border-border-strong rounded-lg p-2 text-sm text-text-main focus:outline-none focus:border-primary" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] uppercase font-bold text-text-muted mb-1 tracking-wider">RW</label>
                    <input type="text" defaultValue={ocrResult.rw} className="w-full bg-canvas border border-border-strong rounded-lg p-2 text-sm text-text-main focus:outline-none focus:border-primary" />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-text-muted mb-1 tracking-wider">Alamat</label>
                  <input type="text" defaultValue={ocrResult.alamat} className="w-full bg-canvas border border-border-strong rounded-lg p-2 text-sm text-text-main focus:outline-none focus:border-primary" />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 bg-primary/10 p-3 rounded-lg text-sm text-primary">
                <CheckCircle2 size={16} /> <span>Data telah diekstrak dengan keyakinan 98%. Periksa kembali sebelum menyimpan.</span>
              </div>

              <button 
                onClick={handleValidate}
                className="w-full bg-primary text-text-inverse font-semibold py-2.5 rounded-lg hover:bg-primary/80 transition-colors mt-2"
              >
                Validasi & Simpan Warga
              </button>
            </div>
          )}
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
        <div className="space-y-4 font-sans text-text-main">
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center gap-2 text-xs text-text-main leading-relaxed">
            <Megaphone size={20} className="text-primary shrink-0" />
            <p>
              Gunakan panel di bawah ini untuk melihat detail data dari masing-masing Kepala Keluarga (KK). Anda dapat menyetujui, menolak bukti transfer, serta mengirimkan <strong>fitur pengingat saldo tunda</strong> yang seketika mendarat di dasbor halaman warga yang bersangkutan.
            </p>
          </div>

          <div className="grid gap-4">
            {residents.map((res: any) => {
              const hasPending = res.dues.some((d: any) => d.status === "pending");
              return (
                <div 
                  key={res.id} 
                  className={cn(
                    "bg-surface border rounded-3xl overflow-hidden transition-all shadow-sm",
                    hasPending ? "border-accent/40 bg-accent/5" : "border-border-weak hover:border-border-strong"
                  )}
                >
                  {/* Collapsed view banner */}
                  <div 
                    onClick={() => setSelectedResidentId(selectedResidentId === res.id ? null : res.id)}
                    className="p-5 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-text-main text-base">{res.name}</h4>
                          <span className="text-[10px] bg-canvas border border-border-weak px-2.5 py-0.5 rounded text-text-muted font-mono">{res.id}</span>
                          {hasPending && (
                            <span className="bg-accent text-white hover:bg-accent-hover text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-bounce">
                              Butuh Verifikasi Resi
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-muted mt-0.5">{res.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <span className="text-[10px] text-text-muted block uppercase tracking-wider">Status Pembayaran</span>
                        <div className="flex gap-1.5 mt-1">
                          {res.dues.map((d: any, i: number) => (
                            <span 
                              key={i} 
                              className={cn(
                                "text-[9px] font-bold px-2 py-0.5 rounded",
                                d.status === "paid" ? "bg-primary/20 text-primary" : d.status === "pending" ? "bg-accent/20 text-accent animate-pulse" : "bg-red-500/20 text-red-500"
                              )}
                            >
                              {d.month.split(' ')[0]} : {d.status.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                      {selectedResidentId === res.id ? <ChevronUp size={20} className="text-text-muted" /> : <ChevronDown size={20} className="text-text-muted" />}
                    </div>
                  </div>

                  {/* Expanded detail section (Dashboard Pengurus warga detail) */}
                  {selectedResidentId === res.id && (
                    <div className="px-5 pb-6 pt-2 border-t border-border-weak bg-canvas/40 space-y-6 animate-in slide-in-from-top-2 duration-200">
                      <div className="grid md:grid-cols-2 gap-6 pt-4">
                        {/* Resident basic info */}
                        <div className="space-y-3 p-4 bg-surface rounded-2xl border border-border-weak/80 text-xs text-text-main">
                          <h5 className="font-bold text-text-main text-sm uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-3 bg-primary rounded-full"></span>
                            Kontak & Kependudukan
                          </h5>
                          <p><strong className="text-text-muted">Nama Kepala Keluarga:</strong> <br /><span className="text-sm font-semibold">{res.name}</span></p>
                          <p><strong className="text-text-muted">Alamat Blok Hunian:</strong> <br /><span className="text-sm font-semibold">{res.address}</span></p>
                          <p><strong className="text-text-muted">Nomor Telp/WA Kendala:</strong> <br /><span className="text-sm font-semibold font-mono">{res.phone}</span></p>
                          <a 
                            href={`https://wa.me/${res.phone.replace(/[^0-9]/g, '')}`} 
                            target="_blank"
                            rel="noreferrer"
                            className="bg-transparent text-primary hover:underline text-xs flex items-center gap-1 font-bold pt-1"
                          >
                            <PhoneCall size={12} /> Hubungi Lewat WhatsApp &rarr;
                          </a>
                        </div>

                        {/* Custom reminder setter */}
                        <div className="space-y-3 p-4 bg-surface rounded-2xl border border-border-weak/80 text-xs text-text-main">
                          <h5 className="font-bold text-text-main text-sm uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-3 bg-accent rounded-full"></span>
                            Atur & Kirim Pengingat Saldo Bulanan (Reminder)
                          </h5>
                          <p className="text-text-muted leading-relaxed">
                            Kirimkan notifikasi tertulis yang mendesak warga melunasi tunggakan iuran bulanan dari akun dashboard mereka.
                          </p>
                          <div className="flex gap-2">
                            <input 
                              type="text"
                              value={customReminders[res.id] || ""}
                              onChange={e => setCustomReminders({ ...customReminders, [res.id]: e.target.value })}
                              placeholder="Ketik pengingat (contoh: November belum terlunasi...)"
                              className="flex-1 bg-canvas border border-border-strong rounded-xl p-2.5 text-xs text-text-main focus:outline-none focus:border-accent"
                            />
                            <button
                              onClick={() => handleSendReminder(res.id)}
                              className="bg-accent text-white px-4 py-2 text-xs font-bold rounded-xl hover:bg-accent-hover active:scale-[0.98] transition-all shrink-0 cursor-pointer"
                            >
                              Kirim Notif
                            </button>
                          </div>
                          {res.reminders && res.reminders.length > 0 && (
                            <p className="text-[10px] text-accent font-semibold flex items-center gap-1 mt-1 font-mono">
                              🔔 Pengingat Aktif: "{res.reminders[0].message}" ({res.reminders[0].date})
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Itemized Dues ledger and check forms */}
                      <div className="space-y-3">
                        <h5 className="font-bold text-text-main text-xs uppercase tracking-wider">Histori Tagihan Bulanan & Kelengkapan Resi</h5>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {res.dues.map((due: any) => (
                            <div key={due.id} className="bg-surface border border-border-weak p-4 rounded-2xl flex flex-col justify-between space-y-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h6 className="font-semibold text-text-main text-sm">Tagihan {due.month}</h6>
                                  <p className="text-xs text-text-muted font-bold">Total: Rp {due.amount.toLocaleString('id-ID')}</p>
                                </div>
                                <span className={cn(
                                  "text-[9px] uppercase font-mono tracking-widest px-2.5 py-1 rounded-md font-bold",
                                  due.status === "paid" ? "bg-primary/20 text-primary" : due.status === "pending" ? "bg-accent/25 text-accent animate-pulse" : "bg-red-500/20 text-red-500"
                                )}>
                                  {due.status === "paid" ? "Lunas" : due.status === "pending" ? "Menunggu Verifikasi" : "Belum Terbayar"}
                                </span>
                              </div>

                              {/* Verifying section for pending resi proof */}
                              {due.status === "pending" && due.proof && (
                                <div className="p-3 bg-accent/5 rounded-xl border border-accent/20 text-xs space-y-2">
                                  <p className="font-bold text-accent uppercase text-[9px] tracking-wide">Detail Transfer Warga:</p>
                                  <ul className="space-y-1 text-text-main text-[11px] font-mono leading-relaxed">
                                    <li>Bank: {due.proof.bank}</li>
                                    <li>Pengirim: {due.proof.sender}</li>
                                    <li>Nominal Transfer: Rp {due.proof.amount.toLocaleString('id-ID')}</li>
                                    <li>Tanggal Input: {due.proof.date}</li>
                                  </ul>
                                  {due.proof.image && (
                                    <div className="pt-2">
                                      <p className="text-[9px] text-text-muted mb-1 font-bold">Bukti Resi Transfer:</p>
                                      <a href={due.proof.image} target="_blank" rel="noreferrer" className="inline-block relative group">
                                        <img 
                                          src={due.proof.image} 
                                          alt="Warga Receipt" 
                                          className="h-28 w-auto rounded-lg shadow-sm border border-border-weak hover:opacity-95 transition-opacity cursor-pointer text-text-main" 
                                        />
                                        <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded uppercase opacity-0 group-hover:opacity-100 transition-opacity">buka tab baru</span>
                                      </a>
                                    </div>
                                  )}
                                  
                                  <div className="flex gap-2 pt-2 border-t border-border-weak/50">
                                    <button
                                      onClick={() => handleApprovePayment(res.id, due.id)}
                                      className="flex-1 bg-primary text-text-inverse py-2 rounded-lg text-xs font-bold hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-primary/10 cursor-pointer"
                                    >
                                      <Check size={14} /> Setujui & Rekam Buku Kas
                                    </button>
                                    <button
                                      onClick={() => handleRejectPayment(res.id, due.id)}
                                      className="bg-accent/10 border border-accent/25 text-accent hover:bg-accent/20 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
                                    >
                                      <X size={14} /> Tolak Bukti
                                    </button>
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
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-surface border border-border-weak p-5 rounded-3xl">
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
            <div className="bg-surface p-6 rounded-3xl border border-border-weak space-y-4 shadow-xl animate-in fade-in slide-in-from-top-4 font-sans">
              <h3 className="font-bold text-text-main text-base mb-2">Transaksi Baru</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-text-muted mb-2 tracking-wide">Jenis Saldo</label>
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
                  <label className="block text-xs font-bold uppercase text-text-muted mb-2 tracking-wide font-mono">Nominal (Rp)</label>
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
                <label className="block text-xs font-bold uppercase text-text-muted mb-2 tracking-wide">Keterangan Catatan</label>
                <input 
                  type="text" 
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="Detail transaksi..." 
                  className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-xs outline-none focus:border-primary text-text-main font-medium" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-text-muted mb-2 tracking-wide">Upload Nota Fisik / Resi Bukti Bayar</label>
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

      <div className="bg-surface rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak overflow-hidden">
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
  const [reports, setReports] = useState([
    { id: "1", title: "Lampu Jalan Padam di Blok D", location: "Blok D2", sender: "Bpk. Rahardian", date: "Hari ini, 08:30", status: "pending", responses: [] as {text: string, date: string}[] },
    { id: "2", title: "Selokan mampet dekat pos satpam", location: "Pos Utama", sender: "Ibu Sari", date: "Kemarin, 15:45", status: "progress", responses: [{text: "Sedang dikoordinasikan dengan petugas kebersihan desa", date: "Hari ini, 10:00"}] },
    { id: "3", title: "Orang mencurigakan mondar-mandir", location: "Blok A ujung", sender: "Anonim", date: "10 Okt", status: "resolved", responses: [] },
  ]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setReports(reports.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const handleReply = (id: string) => {
    if (!replyText.trim()) return;
    setReports(reports.map(r => r.id === id ? {
      ...r,
      responses: [...(r.responses || []), { text: replyText, date: "Baru saja" }]
    } : r));
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
        {reports.map(report => (
          <div key={report.id} className="bg-surface p-5 rounded-2xl shadow-sm border border-border-weak">
             <div className="flex flex-col md:flex-row justify-between gap-4">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <h3 className="font-semibold text-text-main">{report.title}</h3>
                     <span className={cn(
                       "text-[10px] uppercase font-bold px-2 py-0.5 rounded-md",
                       report.status === 'pending' ? "bg-accent/20 text-accent" : 
                       report.status === 'progress' ? "bg-blue-500/20 text-blue-500" : "bg-primary/20 text-primary"
                     )}>
                       {report.status}
                     </span>
                  </div>
                  <p className="text-sm text-text-muted mb-2">Pelapor: {report.sender} • {report.date} • {report.location}</p>
                  {report.status !== 'resolved' && (
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
                  {report.status === 'pending' && (
                    <button 
                      onClick={() => handleUpdateStatus(report.id, 'progress')}
                      className="px-3 py-1.5 bg-blue-500/10 text-blue-500 text-sm font-medium rounded-lg hover:bg-blue-500/20 transition-colors"
                    >
                      Proses
                    </button>
                  )}
                  {(report.status === 'pending' || report.status === 'progress') && (
                    <button 
                      onClick={() => handleUpdateStatus(report.id, 'resolved')}
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
                 <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Tanggapan Pengurus:</h4>
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

  const fetchNews = () => {
    fetch('/api/news')
      .then(r => r.json())
      .then(setNews)
      .catch(() => {});
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return alert("Judul dan isi berita wajib diisi!");
    
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, summary, content, image })
      });
      if (res.ok) {
        alert("Berita baru berhasil diterbitkan!");
        setShowAdd(false);
        setTitle("");
        setSummary("");
        setContent("");
        setImage("");
        fetchNews();
      }
    } catch {
      alert("Gagal menerbitkan berita.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center bg-surface border border-border-weak p-5 rounded-3xl">
        <div>
          <h2 className="text-xl font-display font-semibold text-text-main">Kelola Berita & Informasi</h2>
          <p className="text-xs text-text-muted mt-1">Terbitkan pengumuman, agenda kegiatan warga, dan kabar RT/RW terbaru.</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className={cn(
            "bg-primary text-text-inverse px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-primary/95 transition-colors cursor-pointer",
            showAdd && "bg-accent"
          )}
        >
          {showAdd ? <X size={16} /> : <Plus size={16} />} {showAdd ? "Batal" : "Terbit Berita"}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleCreate} className="bg-surface p-6 rounded-3xl border border-border-weak space-y-4 shadow-xl">
          <h3 className="font-bold text-text-main text-base">Buat Berita / Pengumuman Baru</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-text-muted mb-2 font-semibold">Judul Berita</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Contoh: Kerja Bakti Bulangan Lingkungan"
                className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-xs text-text-main outline-none focus:border-primary font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-text-muted mb-2 font-semibold">Kategori</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-xs text-text-main outline-none focus:border-primary font-bold"
              >
                <option value="Pengumuman">Pengumuman RT</option>
                <option value="Kegiatan">Kegiatan Warga</option>
                <option value="Himbauan">Himbauan</option>
                <option value="Pembangunan">Pembangunan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-muted mb-2 font-semibold">Ringkasan Singkat (Summary)</label>
            <input
              type="text"
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="Satu kalimat ringkasan yang muncul di overview..."
              className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-xs text-text-main outline-none focus:border-primary font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-muted mb-2 font-semibold">Isi Berita Lengkap</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Tuliskan berita secara detil di sini..."
              rows={4}
              className="w-full bg-canvas border border-border-strong rounded-xl p-3 text-xs text-text-main outline-none focus:border-primary font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-muted mb-2 font-semibold">URL Gambar Ilustrasi</label>
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
              onClick={() => setShowAdd(false)}
              className="px-5 py-2 text-xs text-text-muted hover:text-text-main font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-primary text-text-inverse px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/10 cursor-pointer"
            >
              Terbitkan Berita
            </button>
          </div>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {news.map((item: any) => (
          <div key={item.id} className="bg-surface rounded-3xl border border-border-weak overflow-hidden flex flex-col md:flex-row shadow-sm hover:border-border-strong transition-all">
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

  const handleCreateUMKM = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !owner) return alert("Nama usaha dan pemilik wajib diisi!");
    
    try {
      const res = await fetch("/api/umkm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, name, category, phone, desc, image })
      });
      if (res.ok) {
        alert("Pendaftaran UMKM Warga sukses dicatat!");
        setShowAdd(false);
        setOwner("");
        setName("");
        setPhone("");
        setDesc("");
        setImage("");
        fetchData();
      }
    } catch {
      alert("Gagal menambahkan UMKM.");
    }
  };

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsor || !adTitle) return alert("Nama sponsor dan judul iklan wajib diisi!");
    
    try {
      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sponsor, title: adTitle, desc: adDesc, image: adImage, cta })
      });
      if (res.ok) {
        alert("Iklan sponsor berhasil diunggah dan aktif!");
        setShowAdd(false);
        setSponsor("");
        setAdTitle("");
        setAdDesc("");
        setAdImage("");
        setCta("");
        fetchData();
      }
    } catch {
      alert("Gagal mengunggah iklan.");
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
            onClick={() => { setSubTab("umkm"); setShowAdd(false); }}
            className={cn(
              "px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer",
              subTab === "umkm" ? "bg-primary text-text-inverse shadow-sm" : "text-text-muted hover:text-text-main"
            )}
          >
            Daftar UMKM Warga
          </button>
          <button 
            onClick={() => { setSubTab("ads"); setShowAdd(false); }}
            className={cn(
              "px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer",
              subTab === "ads" ? "bg-primary text-text-inverse shadow-sm" : "text-text-muted hover:text-text-main"
            )}
          >
            Iklan Sponsor
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center bg-surface border border-border-weak p-5 rounded-3xl">
        <div>
          <h3 className="font-bold text-text-main text-base">{subTab === "umkm" ? "UMKM Lokal Warga" : "Slide Iklan Sponsor"}</h3>
          <p className="text-xs text-text-muted mt-0.5">
            {subTab === "umkm" ? "Katalog komoditas produk dagangan buatan rumah tangga warga kompleks." : "Spanduk komersial digital sponsor pengisi sela pendanaan kas rukun warga."}
          </p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className={cn("bg-primary text-text-inverse px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-primary/95 transition-colors cursor-pointer", showAdd && "bg-accent")}
        >
          {showAdd ? <X size={16} /> : <Plus size={16} />} {showAdd ? "Batal" : "Tambah Baru"}
        </button>
      </div>

      {showAdd && subTab === "umkm" && (
        <form onSubmit={handleCreateUMKM} className="bg-surface p-6 rounded-3xl border border-border-weak space-y-4 shadow-xl">
          <h3 className="font-bold text-text-main text-base">Daftarkan Toko / Lapak Baru</h3>
          <div className="grid md:grid-cols-2 gap-4">
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

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-text-muted mb-2 font-semibold font-semibold font-semibold font-semibold font-semibold font-semibold">Kategori Bidang</label>
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
              onClick={() => setShowAdd(false)}
              className="px-5 py-2 text-xs text-text-muted hover:text-text-main font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-primary text-text-inverse px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/10 cursor-pointer"
            >
              Simpan UMKM Warga
            </button>
          </div>
        </form>
      )}

      {showAdd && subTab === "ads" && (
        <form onSubmit={handleCreateAd} className="bg-surface p-6 rounded-3xl border border-border-weak space-y-4 shadow-xl">
          <h3 className="font-bold text-text-main text-base">Pasang Banner Promo Sponsor</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
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

          <div className="grid md:grid-cols-2 gap-4">
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
              onClick={() => setShowAdd(false)}
              className="px-5 py-2 text-xs text-text-muted hover:text-text-main font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-primary text-text-inverse px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/10 cursor-pointer"
            >
              Terbitkan Iklan
            </button>
          </div>
        </form>
      )}

      {subTab === "umkm" ? (
        <div className="grid md:grid-cols-3 gap-6">
          {umkm.map((u: any) => (
            <div key={u.id} className="bg-surface border border-border-weak rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-border-strong transition-all">
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
              <div className="p-5 bg-canvas/30 border-t border-border-weak text-xs text-text-main font-semibold flex justify-between items-center">
                <span>Milik: {u.owner}</span>
                {u.phone && <span className="font-mono text-text-muted">{u.phone}</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {ads.map((ad: any) => (
            <div key={ad.id} className="bg-surface rounded-3xl border border-border-weak overflow-hidden shadow-sm hover:border-border-strong transition-all flex flex-col md:flex-row">
              {ad.image && <img src={ad.image} alt={ad.title} referrerPolicy="no-referrer" className="w-full md:w-48 h-40 md:h-auto object-cover shrink-0 text-text-main text-xs" />}
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <span className="text-[10px] bg-primary/15 border border-primary/20 text-primary font-bold px-2 py-0.5 rounded uppercase font-sans mb-2 inline-block">
                    {ad.sponsor}
                  </span>
                  <h4 className="font-bold text-text-main text-base">{ad.title}</h4>
                  <p className="text-xs text-text-muted mt-2 leading-relaxed">{ad.desc}</p>
                </div>
                <button className="mt-4 w-full bg-primary/10 text-primary hover:bg-primary hover:text-text-inverse font-bold py-2 rounded-xl text-xs transition-all cursor-pointer">
                  {ad.cta || "Informasi Detail"} &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
