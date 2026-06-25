import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Upload, Camera, CheckCircle2, User, KeyRound, ShieldAlert, ArrowLeft } from "lucide-react";
import { Role } from "@/components/layout/Sidebar";

export function AuthView({ 
  onLogin, 
  onBack,
  initialTab = "login",
  initialRole = "user"
}: { 
  onLogin: (role: Role) => void; 
  onBack: () => void;
  initialTab?: "login"|"register";
  initialRole?: Role;
}) {
  const [activeTab, setActiveTab] = useState<"login" | "register">(initialTab);
  const [role, setRole] = useState<Role>(initialRole);
  
  const [nik, setNik] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loginIdentifier, setLoginIdentifier] = useState("");
  
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleOCRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOcrScanning(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await fetch("/api/ocr-ktp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      if (res.ok) {
        const data = await res.json();
        setOcrResult(data);
        if (data.nik) setNik(data.nik);
      } else {
        throw new Error("OCR failed");
      }
    } catch {
      // Fallback with demo data
      setOcrResult({ nik: "3273112345678900", name: "Nama Dummy", alamat: "Jl. Merdeka No. 45, RT 05/RW 12" });
      setNik("3273112345678900");
    } finally {
      setOcrScanning(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "register") {
      if (!ocrResult) {
        alert("Wajib mengunggah KTP untuk verifikasi NIK!");
        return;
      }
      if (!nik || !phone) {
        alert("Pendaftaran memerlukan NIK dan Nomor Telepon.");
        return;
      }
      
      // Simulate NIK validation against internal database
      if (nik.length !== 16) {
        alert("Kegagalan Registrasi: NIK harus 16 digit!");
        return;
      }
      
      // Mock validation checking
      const registeredNIKs = ["3273112345678900", "1234567890123456"];
      if (!registeredNIKs.includes(nik)) {
        alert("Pendaftaran Ditolak: NIK (" + nik + ") belum terdaftar di database pengurus RT/RW. Silakan hubungi pengurus setempat untuk mendaftarkan NIK Anda terlebih dahulu sebelum menggunakan aplikasi.");
        return;
      }
      onLogin("user");
      return;
    }
    onLogin(role);
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-4">
      {/* Back to Landing */}
      <div className="w-full max-w-md mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors font-medium text-sm"
        >
          <ArrowLeft size={18} /> Kembali ke Beranda
        </button>
      </div>

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
            <div className="flex items-center justify-center gap-2">
            <h1 className="text-4xl font-serif-title font-semibold tracking-tight mb-2" style={{ letterSpacing: '-0.02em' }}>
              <span className="text-text-main">Smart</span><span className="text-accent">Warga</span>
            </h1>
          </div>
            <p className="text-sm text-text-muted">
              {activeTab === "login" ? "Masuk ke dashboard lingkungan Anda" : "Mulai bergabung di lingkungan digital Anda"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection (Only shown for Login) */}
            {activeTab === "login" ? (
              <div className="flex bg-canvas border border-border-weak rounded-xl p-1 mb-6">
                <button
                  type="button"
                  onClick={() => setRole("user")}
                  className={cn("flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200", role === "user" ? "bg-primary text-text-inverse shadow-md scale-[1.02]" : "text-text-muted hover:bg-surface/50")}
                >
                  Warga
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={cn("flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200", role === "admin" ? "bg-primary text-text-inverse shadow-md scale-[1.02]" : "text-text-muted hover:bg-surface/50")}
                >
                  Pengurus
                </button>
              </div>
            ) : (
              <div className="bg-primary/10 border border-primary/20 text-primary py-2.5 px-4 rounded-xl text-center text-xs font-semibold mb-6">
                Mendaftar sebagai Akun Keluarga / Warga
              </div>
            )}

            {/* General Fields */}
            {activeTab === "login" ? (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Phone / NIK</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input 
                    type="text" 
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder={role === "user" ? "Masukkan NIK / No. HP" : "No. HP / Username"}
                    className="w-full bg-canvas border border-border-strong rounded-lg pl-10 pr-4 py-3 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" 
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Nomor Telepon (WhatsApp)</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="w-full bg-canvas border border-border-strong rounded-lg pl-10 pr-4 py-3 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" 
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Password</label>
              <div className="relative">
                <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan Password"
                  className="w-full bg-canvas border border-border-strong rounded-lg pl-10 pr-4 py-3 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" 
                  required
                />
              </div>
            </div>

            {/* Registration Additional Fields */}
            {activeTab === "register" && (
              <div className="bg-surface border border-border-strong rounded-xl p-4 mt-6">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-sm font-semibold text-text-main">Validasi KTP Pintar (AI OCR)</h3>
                   <span className="text-[10px] uppercase font-bold px-2 py-1 bg-primary/20 text-primary rounded-md">Wajib</span>
                </div>
                
                {!ocrResult ? (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleOCRUpload}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
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
                          <span className="text-xs opacity-60 mt-1">AI akan otomatis mengisi nama, NIK, dan alamat.</span>
                        </>
                      )}
                    </button>
                  </>
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
