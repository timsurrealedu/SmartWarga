import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, UserCheck, FileText, Check, X, Search, Upload, Camera, CheckCircle2, User, Plus, MessageSquare, CreditCard,
  Download, ChevronDown, ChevronUp
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
          {currentTab === "validations" && <ValidationsTab />}
          {currentTab === "finance_manage" && <AdminFinanceTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function AdminOverviewTab({ setTab }: { setTab: (tab: string) => void }) {
  const [isLettersOpen, setIsLettersOpen] = useState(true);
  const [isTicketsOpen, setIsTicketsOpen] = useState(true);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface text-text-main p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] md:col-span-2 relative overflow-hidden">
           <h2 className="text-2xl font-display font-semibold mb-1">Dashboard Pengurus</h2>
           <p className="text-sm opacity-80 mb-6">Ringkasan aktivitas warga RT 04 hari ini.</p>
           <div className="flex gap-4">
              <div className="bg-surface px-4 py-3 rounded-xl">
                 <p className="text-xs uppercase tracking-wider opacity-70">Total Warga</p>
                 <p className="text-2xl font-display font-bold">142 KK</p>
              </div>
              <div className="bg-surface px-4 py-3 rounded-xl">
                 <p className="text-xs uppercase tracking-wider opacity-70">Aman/Kondusif</p>
                 <p className="text-2xl font-display font-bold text-primary">Yes</p>
              </div>
           </div>
           <div className="flex gap-4 mt-6">
              <button 
                onClick={() => setIsLettersOpen(!isLettersOpen)} 
                className="bg-primary text-text-inverse px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                {isLettersOpen ? "Tutup Surat" : "Cek Surat"}
                {isLettersOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <button 
                onClick={() => setIsTicketsOpen(!isTicketsOpen)} 
                className="bg-surface text-text-main border border-border-strong px-4 py-2 rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors flex items-center gap-2"
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
                   <h3 className="font-semibold text-text-main">{letter.name}</h3>
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
  const [transactions, setTransactions] = useState([
    { id: "1", type: "in", amount: 150000, desc: "Iuran Bulanan - Bpk. Ahmad Blok B2", date: "15 Okt 2023" },
    { id: "2", type: "out", amount: 450000, desc: "Pembayaran Sampah & Keamanan", date: "10 Okt 2023" },
    { id: "3", type: "in", amount: 150000, desc: "Iuran Bulanan - Ibu Rini Blok A1", date: "05 Okt 2023" },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [type, setType] = useState("in");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState<string | null>(null);

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

  const handleSave = async () => {
    if (!amount || !desc) return alert("Nominal dan keterangan wajib diisi!");
    if (!image) return alert("Bukti transaksi (kwitansi/foto) wajib diunggah!");
    
    try {
      const res = await fetch("/api/admin/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, amount, desc, image })
      });
      const data = await res.json();
      if (data.success) {
        alert("Transaksi disimpan!");
        setShowAdd(false);
        setAmount("");
        setDesc("");
        setImage(null);
      } else {
        alert(data.error || "Gagal menyimpan transaksi");
      }
    } catch (e) {
      alert("Terjadi kesalahan sistem");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text-main">Kelola Kas & Iuran</h2>
          <p className="text-sm text-text-muted mt-1">Pencatatan uang masuk (iuran) dan keluar (operasional).</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className={cn("bg-primary text-text-inverse px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors", showAdd && "bg-accent hover:bg-accent/80")}
        >
          {showAdd ? <X size={18} /> : <Plus size={18} />} {showAdd ? "Batal" : "Tambah Transaksi"}
        </button>
      </div>

      {showAdd && (
        <div className="bg-surface p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak animate-in fade-in slide-in-from-top-4">
          <h3 className="font-semibold text-text-main mb-4">Transaksi Baru</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-text-muted mb-2">Jenis</label>
                  <select 
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="w-full bg-canvas border border-border-strong rounded-lg p-2.5 text-sm outline-none focus:border-primary text-text-main"
                  >
                    <option value="in">Pemasukan (Iuran/Donasi)</option>
                    <option value="out">Pengeluaran (Operasional)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-text-muted mb-2">Nominal (Rp)</label>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="Contoh: 150000" 
                    className="w-full bg-canvas border border-border-strong rounded-lg p-2.5 text-sm outline-none focus:border-primary text-text-main" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-text-muted mb-2">Keterangan</label>
                <input 
                  type="text" 
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="Detail transaksi..." 
                  className="w-full bg-canvas border border-border-strong rounded-lg p-2.5 text-sm outline-none focus:border-primary text-text-main" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold uppercase text-text-muted mb-2">Bukti Transaksi (Kwitansi/Foto)</label>
              <div className="mt-1 flex justify-center px-4 py-8 border-2 border-border-strong border-dashed rounded-lg bg-canvas hover:bg-surface-hover transition-colors overflow-hidden">
                <div className="space-y-1 text-center">
                  {!image ? (
                    <>
                      <Camera className="mx-auto h-10 w-10 text-text-muted" />
                      <div className="flex text-xs text-text-muted mt-2">
                        <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none">
                          <span>Unggah bukti</span>
                          <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                        </label>
                      </div>
                    </>
                  ) : (
                    <div className="relative inline-block">
                      <img src={image} alt="Receipt Preview" className="h-28 w-auto rounded-lg shadow-sm" />
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
              <p className="text-[10px] text-accent mt-2 font-semibold">* Wajib diunggah bukti fisik/digital</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border-weak">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm text-text-muted hover:text-text-main">Batal</button>
            <button 
              onClick={handleSave}
              className="bg-primary text-text-inverse px-8 py-2 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Simpan Transaksi
            </button>
          </div>
        </div>
      )}

      <div className="bg-surface rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak overflow-hidden">
         <div className="divide-y divide-border-weak">
            {transactions.map(t => (
              <div key={t.id} className="p-4 flex items-center justify-between hover:bg-surface-hover transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn("p-2 rounded-full", t.type === 'in' ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent")}>
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-main text-sm">{t.desc}</h4>
                    <p className="text-xs text-text-muted">{t.date}</p>
                  </div>
                </div>
                <div className={cn("font-bold font-display", t.type === 'in' ? "text-primary" : "text-accent")}>
                  {t.type === 'in' ? "+" : "-"} Rp {t.amount.toLocaleString('id-ID')}
                </div>
              </div>
            ))}
         </div>
      </div>
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
