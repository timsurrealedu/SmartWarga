import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Upload, Camera, CheckCircle2, User, KeyRound, ShieldAlert } from "lucide-react";
import { Role } from "@/components/layout/Sidebar";

export function AuthView({ onLogin }: { onLogin: (role: Role) => void }) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [role, setRole] = useState<Role>("user");
  
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);

  const handleSimulateOCR = () => {
    setOcrScanning(true);
    setTimeout(() => {
      setOcrScanning(false);
      setOcrResult({
        nik: "3273112345678900",
        name: "Nama Dummy",
        alamat: "Jl. Merdeka No. 45"
      });
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "register" && role === "user" && !ocrResult) {
      alert("Warga wajib mengunggah KTP untuk verifikasi NIK!");
      return;
    }
    onLogin(role);
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border-strong rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
        
        {/* Header Tabs */}
        <div className="flex border-b border-border-weak">
          <button 
            className={cn("flex-1 py-4 text-sm font-semibold transition-colors", activeTab === "login" ? "text-primary border-b-2 border-primary bg-primary/5" : "text-text-muted hover:text-text-main")}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button 
            className={cn("flex-1 py-4 text-sm font-semibold transition-colors", activeTab === "register" ? "text-primary border-b-2 border-primary bg-primary/5" : "text-text-muted hover:text-text-main")}
            onClick={() => setActiveTab("register")}
          >
            Daftar
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif tracking-tight mb-2" style={{ letterSpacing: '-0.02em' }}>
              <span className="text-primary">Smart</span><span className="italic relative text-[#a2b897]" style={{ marginLeft: '-0.02em' }}>Warga</span>
            </h1>
            <p className="text-sm text-text-muted">
              {activeTab === "login" ? "Masuk ke dashboard lingkungan Anda" : "Mulai bergabung di lingkungan digital Anda"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div className="flex bg-canvas border border-border-weak rounded-xl p-1 mb-6">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={cn("flex-1 py-2 text-sm font-semibold rounded-lg transition-colors", role === "user" ? "bg-surface text-text-main shadow-sm" : "text-text-muted")}
              >
                Warga
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={cn("flex-1 py-2 text-sm font-semibold rounded-lg transition-colors", role === "admin" ? "bg-surface text-text-main shadow-sm" : "text-text-muted")}
              >
                Pengurus
              </button>
            </div>

            {/* General Fields */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Phone / NIK</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input 
                  type="text" 
                  placeholder={role === "user" ? "Masukkan NIK Anda" : "No. HP / Username"}
                  className="w-full bg-canvas border border-border-strong rounded-lg pl-10 pr-4 py-3 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" 
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Password</label>
              <div className="relative">
                <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-canvas border border-border-strong rounded-lg pl-10 pr-4 py-3 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" 
                  required
                />
              </div>
            </div>

            {/* Registration Additional Fields */}
            {activeTab === "register" && role === "user" && (
              <div className="bg-surface border border-border-strong rounded-xl p-4 mt-6">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-sm font-semibold text-text-main">Validasi KTP Pintar (AI OCR)</h3>
                   <span className="text-[10px] uppercase font-bold px-2 py-1 bg-primary/20 text-primary rounded-md">Wajib</span>
                </div>
                
                {!ocrResult ? (
                  <button
                    type="button"
                    onClick={handleSimulateOCR}
                    disabled={ocrScanning}
                    className={cn(
                      "w-full py-6 flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all",
                      ocrScanning ? "border-primary text-primary" : "border-border-weak text-text-muted hover:bg-surface-hover"
                    )}
                  >
                    {ocrScanning ? (
                      <>
                        <Camera className="mb-2 animate-pulse" size={24} />
                        <span className="text-sm font-medium">Memindai dengan AI...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="mb-2 opacity-50" size={24} />
                        <span className="text-sm font-medium">Klik untuk Unggah KTP</span>
                        <span className="text-xs opacity-60 mt-1">Sistem akan mengisi nama dan alamat otomatis.</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="bg-canvas border border-border-weak p-3 rounded-xl animate-in fade-in zoom-in-95">
                    <div className="flex items-center gap-2 mb-2 text-primary">
                      <CheckCircle2 size={16} /> <span className="text-xs font-semibold">Terkonfirmasi dengan Dukcapil</span>
                    </div>
                    <div className="grid grid-cols-3 gap-y-2 mt-3 text-sm">
                       <span className="text-text-muted text-[10px] uppercase font-bold tracking-widest">NIK</span>
                       <span className="col-span-2 font-mono text-text-main">{ocrResult.nik}</span>
                       <span className="text-text-muted text-[10px] uppercase font-bold tracking-widest">Nama</span>
                       <span className="col-span-2 text-text-main">{ocrResult.name}</span>
                       <span className="text-text-muted text-[10px] uppercase font-bold tracking-widest">Alamat</span>
                       <span className="col-span-2 text-text-main text-xs">{ocrResult.alamat}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Note for Admin Register */}
            {activeTab === "register" && role === "admin" && (
               <div className="bg-accent/10 border border-accent/20 text-accent p-4 rounded-xl flex items-start gap-3 mt-4">
                 <ShieldAlert size={18} className="mt-0.5 shrink-0" />
                 <p className="text-xs font-medium leading-relaxed pb-1">
                   Pendaftaran untuk pengurus RT/RW membutuhkan approval dari Super Admin wilayah sebelum berstatus aktif.
                 </p>
               </div>
            )}

            <button 
              type="submit"
              className="w-full bg-primary text-text-inverse font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-colors mt-6 shadow-[0_10px_20px_rgba(165,214,167,0.2)]"
            >
              {activeTab === "login" ? "Masuk ke Dashboard" : "Buat Akun"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
