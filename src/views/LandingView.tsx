import React from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, Camera, FileText, PieChart, ShieldAlert, 
  Cloud, Bell, Zap, CheckCircle2, UserPlus, LogIn, Sun, Moon 
} from "lucide-react";

interface LandingViewProps {
  onStart: () => void;
  onLogin: () => void;
  onLoginUser?: () => void;
  theme: "light" | "dark";
  setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
}

export const LandingView = ({ onStart, onLogin, onLoginUser, theme, setTheme }: LandingViewProps) => {
  return (
    <div className="min-h-screen bg-canvas text-text-main overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-20 bg-canvas/80 backdrop-blur-xl border-b border-border-weak">
        <div className="flex items-center gap-2">
          <span className="font-serif-title text-3xl md:text-4xl font-bold tracking-tight">Smart<span className="text-accent">Warga</span></span>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          {/* Theme Toggle Button */}
          <button 
            onClick={() => setTheme(prev => prev === "light" ? "dark" : "light")}
            className="p-2.5 rounded-xl bg-surface/50 border border-border-weak text-text-main hover:bg-surface hover:scale-105 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center shadow-sm"
            title={theme === "light" ? "Ganti ke Mode Gelap" : "Ganti ke Mode Terang"}
          >
            {theme === "light" ? <Moon size={18} className="text-accent" /> : <Sun size={18} className="text-accent-light" />}
          </button>

          <button 
            onClick={onLoginUser || onLogin} 
            className="text-xs md:text-sm font-medium hover:text-accent transition-colors cursor-pointer"
          >
            Masuk
          </button>
          
          <button 
            onClick={onStart}
            className="bg-accent text-white px-4 py-2 md:px-6 md:py-2.5 rounded-xl font-bold text-xs md:text-sm shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Daftar
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 md:px-12">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[60%] h-full bg-radial-gradient from-accent/10 to-transparent pointer-events-none opacity-50" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[60%] bg-radial-gradient from-primary/10 to-transparent pointer-events-none opacity-30" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-accent" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-accent">Digitalisasi RT/RW Indonesia</span>
            </div>
            <h1 className="font-serif-title text-5xl md:text-8xl font-medium leading-[0.95] mb-8">
              Lingkungan <em className="text-accent not-italic font-serif">Cerdas</em> Dimulai dari Sini
            </h1>
            <p className="text-text-muted text-base md:text-lg max-w-lg mb-10 leading-relaxed font-light">
              Platform terintegrasi untuk administrasi RT/RW yang efisien, transparan, dan responsif — dirancang untuk warga Indonesia modern yang menghargai waktu.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onStart}
                className="bg-accent text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center gap-3 shadow-xl shadow-accent/20 hover:bg-accent-light hover:-translate-y-1 transition-all cursor-pointer"
              >
                <Zap size={24} /> Mulai Sekarang
              </button>
            </div>

            <div className="mt-20 flex gap-6 md:gap-16 border-t border-border-weak pt-10">
              <div>
                <div className="font-serif-title text-3xl md:text-4xl font-medium mb-1 tracking-tight">Digitalisasi</div>
                <div className="text-[10px] md:text-xs uppercase font-bold tracking-widest text-text-muted">Pengurusan Surat</div>
              </div>
              <div>
                <div className="font-serif-title text-4xl md:text-5xl font-medium mb-1 tracking-tight">24<span className="text-accent">/7</span></div>
                <div className="text-[10px] md:text-xs uppercase font-bold tracking-widest text-text-muted">Akses Layanan</div>
              </div>
              <div>
                <div className="font-serif-title text-4xl md:text-5xl font-medium mb-1 tracking-tight">0<span className="text-accent"> Antri</span></div>
                <div className="text-[10px] md:text-xs uppercase font-bold tracking-widest text-text-muted">Proses Digital</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative z-10 bg-surface/30 backdrop-blur-sm border border-border-strong rounded-[2.5rem] p-4 p-8 shadow-2xl">
               <div className="bg-canvas border border-border-weak rounded-[1.5rem] overflow-hidden aspect-[4/5] relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10" />
                  <div className="absolute top-8 left-8 right-8">
                     <div className="h-12 w-32 bg-accent/20 rounded-lg mb-6" />
                     <div className="h-4 w-full bg-primary/20 rounded mb-3" />
                     <div className="h-4 w-3/4 bg-primary/20 rounded mb-12" />
                     <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-square bg-surface border border-border-weak rounded-2xl p-4 flex flex-col justify-between">
                           <ShieldAlert className="text-accent" />
                           <div className="h-2 w-12 bg-primary/30 rounded" />
                        </div>
                        <div className="aspect-square bg-surface border border-border-weak rounded-2xl p-4 flex flex-col justify-between">
                           <PieChart className="text-primary" />
                           <div className="h-2 w-12 bg-primary/30 rounded" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-sidebar relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-16 md:mb-24 max-w-2xl">
            <div className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4">Fitur Unggulan</div>
            <h2 className="font-serif-title text-4xl md:text-6xl font-medium leading-[1.1] mb-6">Semua yang Anda <br/> Butuhkan dalam Satu Atap</h2>
            <p className="text-text-muted text-base md:text-lg leading-relaxed font-light">
              Kami membawa inovasi yang memecahkan masalah nyata kehidupan warga dan pengurus RT/RW setiap harinya.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0.5 bg-border-weak border border-border-weak rounded-[2rem] overflow-hidden">
            <FeatureCard 
              icon={<Camera />}
              title="Smart OCR Registration"
              description="Cukup foto KTP atau KK Anda. Sistem bertenaga AI kami otomatis membaca dan mengisi formulir — zero-typing, zero hassle."
            />
            <FeatureCard 
              icon={<FileText />}
              title="Digital Letter & QR Code"
              description="Ajukan surat pengantar online. Ketua RT setujui via dashboard, surat terbit otomatis dengan QR Code sah yang terverifikasi."
            />
            <FeatureCard 
              icon={<PieChart />}
              title="Transparency Dashboard"
              description="Laporan keuangan dana sosial real-time disertai bukti foto kwitansi digital. Tidak ada lagi pertanyaan ke mana uang iuran warga."
            />
            <FeatureCard 
              icon={<ShieldAlert />}
              title="Panic Button"
              description="Satu ketuk untuk menghubungi pihak keamanan lingkungan dan broadcast notifikasi darurat ke seluruh warga di radius sekitar."
            />
            <FeatureCard 
              icon={<Cloud />}
              title="Digital Document Storage"
              description="Simpan salinan digital KK, KTP, dan dokumen penting lainnya dengan aman. Siap cetak kapan saja, tidak perlu lagi fotokopi ulang."
            />
            <FeatureCard 
              icon={<Bell />}
              title="E-Reporting & Tiketing"
              description="Laporkan masalah lingkungan seperti jalan rusak atau lampu mati secara resmi. Pantau progres penyelesaiannya secara real-time."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-40 px-6 md:px-12 text-center relative border-t border-border-weak">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block px-4 py-2 bg-accent/10 rounded-full text-accent text-[10px] font-bold uppercase tracking-widest mb-8">Ready to start?</div>
          <h2 className="font-serif-title text-5xl md:text-7xl font-medium leading-[1.1] mb-10">Wujudkan RT/RW yang Lebih Modern & <em>Terpercaya</em></h2>
          <p className="text-text-muted text-base md:text-lg mb-12 max-w-xl mx-auto font-light leading-relaxed">
            Bergabunglah dengan ribuan lingkungan yang sudah menggunakan SmartWarga untuk kehidupan bertetangga yang lebih baik.
          </p>
          <button 
            onClick={onStart}
            className="bg-accent text-white px-12 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-accent/20 hover:bg-accent-light hover:scale-105 transition-all cursor-pointer"
          >
            Daftar — Gratis
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border-weak px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-serif-title text-xl font-semibold tracking-tight">Smart<span className="text-accent">Warga</span></span>
          </div>
          <p className="text-[10px] md:text-xs text-text-muted uppercase tracking-widest font-medium">© 2026 SmartWarga. Berkontribusi untuk Indonesia Cerdas.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="group bg-canvas p-10 md:p-12 hover:bg-surface-hover transition-all duration-500">
    <div className="w-14 h-14 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-accent group-hover:text-text-main transition-all duration-500">
      {icon}
    </div>
    <h3 className="font-serif-title text-2xl font-medium mb-4 text-text-main group-hover:text-accent transition-colors duration-500">{title}</h3>
    <p className="text-text-muted text-sm leading-relaxed font-light">{description}</p>
  </div>
);
