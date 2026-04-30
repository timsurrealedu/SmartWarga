import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { 
  Camera, FileCheck, CheckCircle2, AlertCircle, PhoneCall, 
  MapPin, Clock, Upload, Search, Download, Plus, MessageSquare, CreditCard
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";

export function UserDashboard({ currentTab, setTab }: { currentTab: string, setTab: (tab: string) => void }) {
  const [letters, setLetters] = useState<any[]>([]);
  const [finance, setFinance] = useState<any[]>([]);
  
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
      <div className="bg-primary text-text-inverse rounded-3xl p-8 relative overflow-hidden shadow-lg">
        <div className="relative z-10 w-full md:w-2/3">
          <h1 className="text-3xl font-display font-bold mb-2 text-text-inverse">
            Selamat datang, Budi Santoso
          </h1>
          <p className="opacity-80 mb-6 max-w-lg">
            Sistem Digital SmartWarga siap membantu administrasi dan keamanan lingkungan Anda. Apa yang ingin Anda lakukan hari ini?
          </p>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setTab("letters")}
              className="bg-accent text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-accent-hover transition-colors shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
              Buat Surat Pengantar
            </button>
            <button 
              onClick={() => setTab("dues")}
              className="bg-transparent border border-white/30 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-white/10 transition-colors">
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
  const [submitting, setSubmitting] = useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

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
              <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Jenis Surat</label>
                    <select 
                      value={type} 
                      onChange={e => setType(e.target.value)}
                      className="w-full bg-canvas border border-border-strong rounded-lg p-2.5 text-sm outline-none focus:border-primary text-text-main"
                    >
                       <option>Surat Pengantar Domisili</option>
                       <option>Surat Keterangan Usaha</option>
                       <option>Surat Keterangan Tidak Mampu</option>
                    </select>
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
                   <div key={letter.id} className="flex items-center justify-between p-3 border border-border-weak rounded-xl hover:bg-surface-hover cursor-pointer transition-colors">
                     <div>
                       <p className="text-sm font-semibold text-text-main">{letter.type}</p>
                       <p className="text-xs text-text-muted mt-0.5">{letter.date} — {letter.keperluan}</p>
                     </div>
                     {letter.status === 'approved' && <span className="text-[10px] uppercase font-bold px-2 py-1 bg-primary/20 text-primary rounded-md whitespace-nowrap">Selesai / QR Valid</span>}
                     {letter.status === 'pending' && <span className="text-[10px] uppercase font-bold px-2 py-1 bg-accent/20 text-accent rounded-md whitespace-nowrap">Menunggu RT</span>}
                     {letter.status === 'rejected' && <span className="text-[10px] uppercase font-bold px-2 py-1 bg-red-900/40 text-red-400 rounded-md whitespace-nowrap">Ditolak</span>}
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

function FinanceTab({ data }: { data: any[] }) {
  // Use passed data or fallback to empty array if not loaded yet
  const chartData = data.length > 0 ? data : [
    { name: "Jan", Pemasukan: 0, Pengeluaran: 0 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-semibold text-text-main">Transparansi Dana Warga</h2>
        <p className="text-sm text-text-muted mt-1">Laporan real-time pemasukan dan pengeluaran kas RT/RW.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="bg-surface p-5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Saldo Kas Saat Ini</p>
            <p className="text-2xl font-display font-bold text-text-main">Rp 12.550.000</p>
         </div>
         <div className="bg-surface p-5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Pemasukan Bulan Ini</p>
            <p className="text-2xl font-display font-bold text-primary">+ Rp 2.400.000</p>
         </div>
         <div className="bg-surface p-5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Pengeluaran</p>
            <p className="text-2xl font-display font-bold text-accent">- Rp 850.000</p>
         </div>
         <div className="bg-surface p-5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Warga Lunas Iuran</p>
            <p className="text-2xl font-display font-bold text-text-main">85 / 120</p>
         </div>
      </div>

      <div className="bg-surface p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak h-[400px]">
        <h3 className="font-semibold text-text-main mb-6">Grafik Arus Kas 6 Bulan Terakhir</h3>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A8E6CF" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#A8E6CF" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF8A65" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#FF8A65" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs" />
            <YAxis axisLine={false} tickLine={false} className="text-xs" />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <RechartsTooltip />
            <Area type="monotone" dataKey="Pemasukan" stroke="#A8E6CF" fillOpacity={1} fill="url(#colorIn)" />
            <Area type="monotone" dataKey="Pengeluaran" stroke="#FF8A65" fillOpacity={1} fill="url(#colorOut)" />
          </AreaChart>
        </ResponsiveContainer>
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
  return (
    <div className="flex flex-col items-center justify-center text-center h-[calc(100vh-12rem)] max-h-[600px] border border-accent/20 bg-accent/5 rounded-3xl">
      <h2 className="text-3xl font-display font-bold text-text-main mb-2">Darurat Lingkungan?</h2>
      <p className="text-text-muted mb-12 max-w-md">Tekan tombol di bawah untuk langsung memberikan notifikasi ke Petugas Keamanan dan broadcast ke seluruh warga.</p>
      
      <button 
        onClick={() => setClicked(true)}
        className={cn(
          "relative w-56 h-56 rounded-full flex items-center justify-center text-white transition-all shadow-xl shadow-accent/40",
          clicked ? "bg-red-600 scale-95" : "bg-accent hover:scale-105"
        )}
      >
        {clicked && (
          <span className="absolute w-full h-full rounded-full border-4 border-red-500 animate-ping"></span>
        )}
        <div className="flex flex-col items-center justify-center space-y-2">
          {clicked ? <PhoneCall size={64} className="animate-bounce" /> : <AlertCircle size={64} />}
          <span className="font-display font-bold text-2xl uppercase tracking-widest">{clicked ? "Memanggil..." : "PANIC"}</span>
        </div>
      </button>

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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/user/reports').then(r => r.json()).then(setReports);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location) return alert("Semua kolom harus diisi!");
    setSubmitting(true);
    try {
      const res = await fetch("/api/user/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, location })
      });
      const newReport = await res.json();
      setReports([newReport, ...reports]);
      setTitle("");
      setLocation("");
      alert("Laporan berhasil dikirim!");
    } catch (e) {
      alert("Gagal mengirim laporan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-semibold text-text-main">E-Reporting</h2>
        <p className="text-sm text-text-muted mt-1">Sistem pelaporan masalah lingkungan (infrastruktur, keamanan, ketertiban).</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 border border-border-strong rounded-2xl p-6 bg-surface">
          <h3 className="font-semibold text-text-main mb-4">Buat Laporan Baru</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Pilih Kategori</label>
              <select className="w-full bg-canvas border border-border-strong rounded-lg p-2.5 text-sm outline-none focus:border-primary text-text-main">
                 <option>Infrastruktur (Lampu, Jalan)</option>
                 <option>Kebersihan (Sampah, Selokan)</option>
                 <option>Keamanan & Ketertiban</option>
                 <option>Lainnya</option>
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
            <button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-primary text-text-inverse font-semibold py-3 rounded-lg hover:bg-surface-hover transition-colors"
            >
              {submitting ? "Kirim Laporan..." : "Kirim Laporan"}
            </button>
          </form>
        </div>

        <div className="md:col-span-2 border border-border-strong rounded-2xl p-6 bg-surface">
           <h3 className="font-semibold text-text-main mb-4">Laporan Saya</h3>
           <div className="space-y-4 max-h-[500px] overflow-y-auto">
             {reports.length === 0 && <p className="text-sm text-text-muted text-center py-8">Belum ada laporan.</p>}
             {reports.map(report => (
               <div key={report.id} className="border border-border-weak p-4 rounded-xl flex gap-4 hover:border-border-strong transition-colors">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                    <MessageSquare size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                       <h4 className="font-semibold text-text-main">{report.title}</h4>
                       <span className={cn(
                          "text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md",
                          report.status === "SELESAI" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"
                       )}>{report.status}</span>
                    </div>
                    <p className="text-xs text-text-muted mb-2"><MapPin size={12} className="inline mr-1" />{report.location} • {report.date}</p>
                    {report.status === "SELESAI" && (
                       <div className="bg-canvas p-2.5 rounded-lg text-xs border border-border-strong">
                          <strong className="text-text-main">Tanggapan RT:</strong> Terima kasih, laporan sudah ditindaklanjuti dan selesai dikerjakan kemarin sore.
                       </div>
                    )}
                  </div>
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

  useEffect(() => {
    fetch('/api/user/dues').then(r => r.json()).then(setDues);
  }, []);

  const handlePay = async (id: string) => {
    await fetch(`/api/user/dues/${id}/pay`, { method: 'POST' });
    setDues(dues.map(d => d.id === id ? { ...d, status: "paid", date: "Hari ini" } : d));
    alert("Pembayaran berhasil!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-semibold text-text-main">Iuran Warga</h2>
        <p className="text-sm text-text-muted mt-1">Kelola dan bayar iuran bulanan RT/RW Anda dengan mudah.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {dues.length === 0 && <p className="text-sm text-text-muted text-center py-8">Belum ada tagihan.</p>}
          {dues.map(due => (
            <div key={due.id} className="bg-surface border border-border-weak p-6 rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                 <div className={cn(
                   "w-12 h-12 rounded-full flex items-center justify-center",
                   due.status === "paid" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"
                 )}>
                   <CreditCard size={24} />
                 </div>
                 <div>
                   <h4 className="font-semibold text-text-main">Iuran {due.month}</h4>
                   <p className="text-sm text-text-muted mt-0.5">Rp {due.amount.toLocaleString('id-ID')}</p>
                 </div>
              </div>
              <div className="text-right">
                {due.status === "paid" ? (
                  <div>
                    <span className="text-xs font-bold text-primary flex items-center gap-1 justify-end"><CheckCircle2 size={14} /> LUNAS</span>
                    <p className="text-xs text-text-muted mt-1 opacity-70">Dibayar: {due.date}</p>
                  </div>
                ) : (
                  <button 
                    onClick={() => handlePay(due.id)}
                    className="bg-primary text-text-inverse px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary/80 transition-colors shadow-sm"
                  >
                    Bayar Sekarang
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="md:col-span-1">
          <div className="bg-primary text-text-inverse rounded-2xl p-6 shadow-lg border border-border-strong md:sticky top-28">
             <h3 className="font-semibold mb-2">Total Tunggakan</h3>
             <p className="text-3xl font-display font-bold mb-6">
                Rp {dues.filter(d => d.status === "unpaid").reduce((sum, d) => sum + d.amount, 0).toLocaleString('id-ID')}
             </p>
             <p className="text-xs opacity-80 mb-6">Harap lunasi tunggakan iuran sebelum tanggal 10 setiap bulannya untuk menghindari denda keterlambatan.</p>
             
             <div className="space-y-3">
               <div className="flex justify-between items-center bg-black/10 px-4 py-3 rounded-xl">
                 <span className="text-sm">Status Bulan Ini</span>
                 {dues.find(d => d.month === "November 2023")?.status === "paid" ? (
                    <span className="text-xs font-bold text-[#A8E6CF]">LUNAS</span>
                 ) : (
                    <span className="text-xs font-bold text-accent">BELUM LUNAS</span>
                 )}
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}  
