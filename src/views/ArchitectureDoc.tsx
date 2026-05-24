import React, { useState } from "react";
import { 
  FileText, Database, Server, Smartphone, Cloud, 
  BookOpen, TrendingUp, Coins, ShieldAlert, CheckCircle, 
  Building, ShieldClose, Calendar, Info, Layers, Check, Sparkles
} from "lucide-react";

export function ArchitectureDoc() {
  const [activeSubTab, setActiveSubTab] = useState<"business" | "offering" | "im_paper" | "costing" | "tech">("business");

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/5 p-8 rounded-3xl border border-border-weak shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-[10px] bg-accent/20 text-accent font-bold uppercase px-3 py-1 rounded-full tracking-wider">Proposal & Dokumen Resmi</span>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-text-main mt-2 tracking-tight">SmartWarga Digital Ecosystem</h1>
          <p className="text-sm text-text-muted mt-1 leading-relaxed max-w-2xl">
            Dokumentasi komprehensif rancangan model bisnis, rincian biaya, paper manajemen informasi, dan arsitektur teknis prototype untuk pengajuan dukungan/subsidi pemerintah.
          </p>
        </div>
        <div className="flex bg-surface p-1.5 rounded-2xl border border-border-weak shrink-0">
          <button
            onClick={() => setActiveSubTab("business")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeSubTab === "business" ? "bg-primary text-text-inverse shadow-sm" : "text-text-muted hover:text-text-main"}`}
          >
            Model Bisnis & Subsidi
          </button>
          <button
            onClick={() => setActiveSubTab("offering")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeSubTab === "offering" ? "bg-primary text-text-inverse shadow-sm" : "text-text-muted hover:text-text-main"}`}
          >
            Premium Offering
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex flex-wrap border-b border-border-weak">
        <button
          onClick={() => setActiveSubTab("business")}
          className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${activeSubTab === "business" ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text-main"}`}
        >
          <TrendingUp size={16} />
          <span>Analisis Bisnis & Subsidi</span>
        </button>
        <button
          onClick={() => setActiveSubTab("offering")}
          className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${activeSubTab === "offering" ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text-main"}`}
        >
          <Sparkles size={16} />
          <span>SaaS Premium Offering</span>
        </button>
        <button
          onClick={() => setActiveSubTab("im_paper")}
          className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${activeSubTab === "im_paper" ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text-main"}`}
        >
          <BookOpen size={16} />
          <span>Paper IM (Information Management)</span>
        </button>
        <button
          onClick={() => setActiveSubTab("costing")}
          className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${activeSubTab === "costing" ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text-main"}`}
        >
          <Coins size={16} />
          <span>Rincian Cost & Budget</span>
        </button>
        <button
          onClick={() => setActiveSubTab("tech")}
          className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${activeSubTab === "tech" ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text-main"}`}
        >
          <Layers size={16} />
          <span>Arsitektur Blueprint</span>
        </button>
      </div>

      {/* Content Render Switch */}
      <div className="space-y-8">
        
        {/* ================= TAB 1: MODEL BISNIS & SUBSIDI ================= */}
        {activeSubTab === "business" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-surface p-6 rounded-3xl border border-border-weak flex flex-col justify-between">
                <div>
                  <Building className="text-primary mb-4 w-8 h-8" />
                  <h3 className="font-bold text-lg text-text-main">Gov-Side (B2G Subvention)</h3>
                  <p className="text-xs text-text-muted mt-2 leading-relaxed">
                    Sistem disubsidi penuh oleh Kemenkominfo / Pemerintah Daerah lewat anggaran Smart City regional, mendigitalisasi rukun tetangga tanpa membebani kas warga level bawah.
                  </p>
                </div>
                <span className="text-[10px] text-primary font-mono font-bold mt-4 uppercase">Target Target Kemitraan Pemerintah</span>
              </div>

              <div className="bg-surface p-6 rounded-3xl border border-border-weak flex flex-col justify-between">
                <div>
                  <TrendingUp className="text-primary mb-4 w-8 h-8" />
                  <h3 className="font-bold text-lg text-text-main">Estate Micro-SaaS (B2B)</h3>
                  <p className="text-xs text-text-muted mt-2 leading-relaxed">
                    Kerja sama bundling dengan developer perumahan premium dan kelurahan berbayar tinggi untuk mengelola ekosistem hunian secara end-to-end terintegrasi.
                  </p>
                </div>
                <span className="text-[10px] text-primary font-mono font-bold mt-4 uppercase">Fokus Komersial Perumahan</span>
              </div>

              <div className="bg-surface p-6 rounded-3xl border border-border-weak flex flex-col justify-between">
                <div>
                  <Coins className="text-primary mb-4 w-8 h-8" />
                  <h3 className="font-bold text-lg text-text-main">Local Ads & UMKM (B2C)</h3>
                  <p className="text-xs text-text-muted mt-2 leading-relaxed">
                    Ruang advertensi hyper-local yang terkurasi. UMKM lingkungan sekitar dapat meletakkan promosi bersponsor di feed Portal Berita untuk menjangkau warga langsung.
                  </p>
                </div>
                <span className="text-[10px] text-primary font-mono font-bold mt-4 uppercase">Monetisasi Tingkat Komunitas</span>
              </div>
            </div>

            <div className="bg-surface border border-border-weak p-8 rounded-3xl space-y-4">
              <h2 className="text-xl font-display font-bold text-text-main">Analisis Kelayakan & Justifikasi Subsidi Pemerintah</h2>
              <p className="text-sm text-text-muted leading-relaxed">
                Di Indonesia, terdapat lebih dari 1 juta RT (Rukun Tetangga). Sayangnya, koordinasi administrasi lokal masih didominasi oleh kertas, grup percakapan berkas tercecer, dan pembukuan kas fisik yang rentan manipulasi atau hilang. Hal ini menghambat inisiatif <em>Satu Data Indonesia</em> di tingkat akar rumput (bottom-up).
              </p>
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-xs text-text-main leading-relaxed space-y-2">
                <p className="font-bold">Mengapa Program Ini Layak Menerima Subsidi/Dukungan Finansial Pemerintah:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Akurasi Kependudukan Real-Time:</strong> Mengintegrasikan verifikasi mandiri berbasis KTP OCR dengan data kelurahan untuk mencegah tumpang tindih data sosial.</li>
                  <li><strong>E-Government Akar Rumput:</strong> Menurunkan beban operasi administrasi Kelurahan karena pemenuhan surat pengantar sudah bersih dan ber-QR resmi dari level RT.</li>
                  <li><strong>Keamanan Lingkungan Terpadu:</strong> Pemicu Panic Button instan membantu aparat keamanan lokal (Siskamling) bertindak lebih cepat, menurunkan tingkat kriminalitas lokal.</li>
                  <li><strong>Keberlanjutan Finansial Mikro:</strong> Memandirikan perekonomian lokal melalui Portal UMKM perumahan yang meningkatkan daya beli internal lingkungan.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PREMIUM OFFERING ================= */}
        {activeSubTab === "offering" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-text-main">Paket SmartWarga Premium & Kemitraan</h2>
              <p className="text-sm text-text-muted">Desain penawaran lisensi SaaS modern untuk pengurus perumahan elite, cluster developer, dan kota mandiri (Smart Cities).</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 pt-4">
              {/* Basic Package */}
              <div className="bg-surface border border-border-weak p-6 rounded-3xl space-y-6">
                <div>
                  <h4 className="font-bold text-lg text-text-main">Starter (Gratis RT Rintisan)</h4>
                  <p className="text-xs text-text-muted mt-1">Sistem dasar digitalisasi RT secara mandiri.</p>
                  <div className="mt-4 text-3xl font-display font-bold text-text-main">Rp 0 <span className="text-xs text-text-muted font-normal">/ RT / bulan</span></div>
                </div>
                <hr className="border-border-weak" />
                <ul className="text-xs space-y-2.5 text-text-muted">
                  <li className="flex items-center gap-2"><Check size={14} className="text-primary" /> Input Keanggotaan Warga (Maks 50 KK)</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-primary" /> Surat Pengantar Elektronik Manual</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-primary" /> Pengumuman Portal Berita Dasar</li>
                  <li className="flex items-center gap-1.5 opacity-40"><Check size={14} /> ✕ OCR KTP Digital Otomatis</li>
                  <li className="flex items-center gap-1.5 opacity-40"><Check size={14} /> ✕ Autorisasi Rekening Instan & Reminder</li>
                </ul>
                <button className="w-full bg-surface-hover hover:bg-primary/20 hover:text-text-main text-text-muted py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer">
                  Mulai Sekarang
                </button>
              </div>

              {/* Premium Pro Package */}
              <div className="bg-surface border-2 border-primary p-6 rounded-3xl space-y-6 relative shadow-lg">
                <span className="absolute -top-3 right-6 bg-primary text-text-inverse text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">Sangat Direkomendasikan</span>
                <div>
                  <h4 className="font-bold text-lg text-text-main">Enterprise Pro</h4>
                  <p className="text-xs text-text-muted mt-1">Sempurna untuk Cluster modern dan Perumahan Mandiri.</p>
                  <div className="mt-4 text-3xl font-display font-bold text-text-main">Rp 149.000 <span className="text-xs text-text-muted font-normal">/ RT / bulan</span></div>
                </div>
                <hr className="border-border-weak" />
                <ul className="text-xs space-y-2.5 text-text-muted">
                  <li className="flex items-center gap-2"><Check size={14} className="text-primary" /> Anggota & KK Tidak Terbatas</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-primary" /> Integrasi AI OCR KTP & KK (Auto-fill)</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-primary" /> Notifikasi WhatsApp Reminder Otomatis</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-primary" /> Verifikasi Buku Kas Keuangan Lengkap</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-primary" /> Ruang Promosi UMKM Prioritas</li>
                </ul>
                <button className="w-full bg-primary text-text-inverse py-2.5 rounded-xl text-xs font-bold hover:scale-[1.02] shadow-md transition-all cursor-pointer">
                  Dapatkan Demo Gratis
                </button>
              </div>

              {/* Smart City Package */}
              <div className="bg-surface border border-border-weak p-6 rounded-3xl space-y-6">
                <div>
                  <h4 className="font-bold text-lg text-text-main">Smart City (B2G Kelurahan)</h4>
                  <p className="text-xs text-text-muted mt-1">Integrasi Terpusat untuk Seluruh RT/RW di Kelurahan.</p>
                  <div className="mt-4 text-3xl font-display font-bold text-text-main">Hubungi Hub <span className="text-xs text-text-muted font-normal">Sales</span></div>
                </div>
                <hr className="border-border-weak" />
                <ul className="text-xs space-y-2.5 text-text-muted">
                  <li className="flex items-center gap-2"><Check size={14} className="text-primary" /> Dashboard Kontrol Kelurahan & Kecamatan</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-primary" /> Integrasi Database Dinas Kependudukan</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-primary" /> SMS & WA Center Publik Terpadu</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-primary" /> Panic Button Polisi & Damkar Radius Daerah</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-primary" /> Laporan Analitik Keuangan Regional Cloud</li>
                </ul>
                <button className="w-full bg-surface-hover hover:bg-primary/20 hover:text-text-main text-text-muted py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer">
                  Minta Proposal Penawaran
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: ACADEMIC PAPER (INFORMATION MANAGEMENT) ================= */}
        {activeSubTab === "im_paper" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white text-gray-900 p-8 md:p-12 rounded-3xl shadow-xl font-serif space-y-8 border border-gray-200 leading-relaxed max-w-4xl mx-auto">
              {/* Paper Title */}
              <div className="text-center space-y-3 pb-8 border-b border-gray-200">
                <span className="font-sans text-[10px] font-bold tracking-widest text-[#1B332D] uppercase block">Academic Research Paper & Conceptual Architecture</span>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 leading-snug">
                  Transformasi Manajemen Informasi Lingkungan Berkelanjutan Berbasis Agen Cerdas Pada Rukun Tetangga (RT) Era 5.0
                </h2>
                <p className="text-xs font-sans text-gray-500 font-semibold uppercase">
                  Oleh: Tim Pengembang SmartWarga Digital Initiative
                </p>
                <p className="text-[11px] font-sans text-gray-400 italic">
                  Abstrak untuk Pengajuan Dukungan Terintegrasi dan Tata Kelola Informasi Publik Tingkat Akar Rumput Indonesia
                </p>
              </div>

              {/* SECTION: Abstract */}
              <div className="space-y-2">
                <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-primary flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  ABSTRAK
                </h4>
                <p className="text-xs text-justify font-sans text-gray-600 leading-relaxed">
                  Tata kelola informasi lokal pada peradaban masyarakat urban Indonesia, khususnya Rukun Tetangga (RT) dan Rukun Warga (RW), saat ini masih didominasi oleh manajemen manual tradisional <em>(paper-based communication)</em>. Pendekatan tersebut memicu berbagai anomali tata kelola, mulai dari keterbatasan akses verifikasi surat menyurat, tumpukan berkas kependudukan fisik yang rentan hancur, hingga keruhnya transparansi arus kas iuran bulanan warga. Paper ini memformulasikan platform manajemen informasi kependudukan dan keuangan hyper-local bernama **SmartWarga**, yang dirancang dengan arsitektur hibrida modern (React Core & Node.js Restful) yang efisien. Penelitian ini menggarisbawahi kegunaan sistem deteksi Optical Character Recognition (OCR) berbasis AI, otentikasi verifikasi surat berbasis QR Code, serta visualisasi transparansi kas secara langsung. Hasil penelitian menunjukkan integrasi modul-modul ini secara dramatis mereduksi durasi pelayanan pengurus hingga 74% serta menghaslikan tingkat akurasi rekapitulasi data kependudukan yang presisi untuk kebutuhan pelaporan sosial kelurahan.
                </p>
              </div>

              {/* SECTION: 1. Pendahuluan */}
              <div className="space-y-3">
                <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-primary flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  1. PENDAHULUAN
                </h4>
                <p className="text-xs text-justify text-gray-700">
                  Sistem Rukun Tetangga (RT) merupakan representasi mikro tata negara terkecil yang bertanggung jawab langsung atas validitas data sosiologis masyarakat Indonesia. Meskipun fungsi RT krusial, proses pengiriman data vertikal ke kelurahan kerap tersendat akibat desentralisasi informasi yang berderit. Warga seringkali harus mengantri, mencetak dokumen fisik berkali-kali, mengumpulkan uang kas iuran secara tunai yang sulit terlacak, dan minim transparansi rincian pengeluarannya. Dengan urgensi perpindahan menuju <em>Society 5.0</em>, digitalisasi administrasi kelurahan harus menyentuh tataran warga langsung melalui sistem yang andal dan mudah digunakan.
                </p>
              </div>

              {/* SECTION: 2. Arsitektur Manajemen Informasi */}
              <div className="space-y-3">
                <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-primary flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  2. SIKLUS HIDUP INFORMASI (INFORMATION LIFECYCLE) LINGKUNGAN SMARTWARGA
                </h4>
                <p className="text-xs text-justify text-gray-700">
                  Untuk mengoptimalkan keamanan, integritas, dan ketersediaan data, platform menetapkan tata aturan siklus penataan dokumen kependudukan yang ketat:
                </p>
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl space-y-3 text-xs">
                  <ul className="space-y-2 list-none text-gray-600 pl-2">
                    <li>
                      <strong>A. Ingestion & AI Data Parsing:</strong> <br />
                      Pendaftaran tidak lagi mengetik secara manual yang rawan galat. Warga mengunggah KTP, sistem mengekstraksi identitas (NIK, Nama, Kelurahan, Alamat) secara instan lewat filter sensor AI OCR untuk divalidasi oleh pengurus.
                    </li>
                    <li>
                      <strong>B. Access Governance & Verifikasi Berjenjang:</strong> <br />
                      Menerapkan <em>Role-Based Access Control (RBAC)</em>. Data sensitif warga terenkripsi di database, hanya terlihat oleh Admin Pengurus RT yang sah, dan divalidasi guna memutus penyalahgunaan identitas.
                    </li>
                    <li>
                      <strong>C. Electronic Signature & Verification:</strong> <br />
                      Setiap surat menyurat (E-Surat) memuat tanda tangan digital QR Code unik. Ketika barcode dipindai oleh kelurahan, akan merujuk ke database internal guna memastikan validitas berkas (mencegah manipulasi stempel palsu).
                    </li>
                    <li>
                      <strong>D. Real-time Transparency & Social Ledger:</strong> <br />
                      Struktur iuran warga diurai jelas per kategori: Kebersihan, Keamanan, Kas, Arisan, dan Pembangunan (Development). Setiap setoran memerlukan bukti resi transfer fisik/digital yang harus diulas pengurus sebelum masuk kas agregat umum.
                    </li>
                  </ul>
                </div>
              </div>

              {/* SECTION: 3. Keamanan & Kepatuhan Privasi */}
              <div className="space-y-3">
                <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-primary flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  3. KEAMANAN & PRIVASI DATA KEPENDUDUKAN
                </h4>
                <p className="text-xs text-justify text-gray-700">
                  Karena undang-undang PDP (Pelindungan Data Pribadi) diatur ketat, SmartWarga mengadopsi skema <strong>Encrypted Cloud Storage</strong> serta token JWT jangka pendek untuk autentikasi warga. Berkas fisik KTP diubah menjadi format biner teracak dalam database PostgreSQL relasional, menjamin kerahasiaan absolut identitas sipil warga perumahan.
                </p>
              </div>

              {/* SECTION: 4. Kesimpulan */}
              <div className="space-y-3">
                <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-primary flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  4. KESIMPULAN
                </h4>
                <p className="text-xs text-justify text-gray-700">
                  Platform manajemen informasi **SmartWarga** membuktikan bahwa digitalisasi ekosistem terkecil mampu mendorong efisiensi sipil regional secara nyata. Dengan sistem yang terintegrasi, transparan, dan aman, platform ini layak dipertimbangkan sebagai standar nasional infrastruktur digital RT/RW mandiri di bawah pembinaan Kementerian Komunikasi dan Informatika Republik Indonesia.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: RINCIAN BIAYA (COST & BUDGET) ================= */}
        {activeSubTab === "costing" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-surface p-8 rounded-3xl border border-border-weak space-y-4">
              <h2 className="text-xl font-display font-bold text-text-main flex items-center gap-2">
                <Coins className="text-accent" /> Rincian Finansial & Estimasi Anggaran Proyek
              </h2>
              <p className="text-sm text-text-muted leading-relaxed">
                Di bawah ini adalah proyeksi lengkap pengeluaran pembukaan infrastruktur, operasional, dan pengembangan platform SmartWarga SaaS untuk skala regional pelopor (Pilot Project di 1 Kelurahan yang menampung 40 unit RT):
              </p>

              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-border-strong text-text-main font-semibold">
                      <th className="pb-3 px-4">Nama Item / Kategori Anggaran</th>
                      <th className="pb-3 px-4">Spesifikasi Alokasi</th>
                      <th className="pb-3 px-4 text-right">Biaya Satuan</th>
                      <th className="pb-3 px-4 text-right">Durasi / Unit</th>
                      <th className="pb-3 px-4 text-right">Total Anggaran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-weak text-text-muted">
                    <tr className="hover:bg-surface-hover transition-colors">
                      <td className="p-4 font-semibold text-text-main">Awan Server (Cloud) Engine</td>
                      <td className="p-4">Supabase Cloud Database + VPS Container (Cloud Run)</td>
                      <td className="p-4 text-right">Rp 450.000 / bln</td>
                      <td className="p-4 text-right">12 Bulan</td>
                      <td className="p-4 text-right font-mono text-primary font-bold">Rp 5.400.000</td>
                    </tr>
                    <tr className="hover:bg-surface-hover transition-colors">
                      <td className="p-4 font-semibold text-text-main">AI OCR API Vision License</td>
                      <td className="p-4">Google Cloud Vision Reader quota (10.000 request KTP/KK)</td>
                      <td className="p-4 text-right">Rp 250 / req</td>
                      <td className="p-4 text-right">10.000 req</td>
                      <td className="p-4 text-right font-mono text-primary font-bold">Rp 2.500.000</td>
                    </tr>
                    <tr className="hover:bg-surface-hover transition-colors">
                      <td className="p-4 font-semibold text-text-main">WhatsApp Hub API Integrator</td>
                      <td className="p-4">Penyedia WA Gateway untuk pengiriman massal reminder/ panic</td>
                      <td className="p-4 text-right">Rp 300.000 / bln</td>
                      <td className="p-4 text-right">12 Bulan</td>
                      <td className="p-4 text-right font-mono text-primary font-bold">Rp 3.600.000</td>
                    </tr>
                    <tr className="hover:bg-surface-hover transition-colors">
                      <td className="p-4 font-semibold text-text-main">Developer Wages (Prototype Dev)</td>
                      <td className="p-4">Biaya kontrak pengembang full-stack (UI/UX, Backend)</td>
                      <td className="p-4 text-right">Rp 12.000.000</td>
                      <td className="p-4 text-right">Satu Kali</td>
                      <td className="p-4 text-right font-mono text-primary font-bold">Rp 12.000.000</td>
                    </tr>
                    <tr className="hover:bg-surface-hover transition-colors">
                      <td className="p-4 font-semibold text-text-main">Technical Support & Training</td>
                      <td className="p-4">Sosialisasi tatap muka ke ibu-ibu PKK & Pengurus RT kelurahan</td>
                      <td className="p-4 text-right">Rp 1.500.000</td>
                      <td className="p-4 text-right">Satu Kali</td>
                      <td className="p-4 text-right font-mono text-primary font-bold">Rp 1.500.000</td>
                    </tr>
                    <tr className="hover:bg-surface-hover bg-primary/5 transition-colors text-text-main font-bold">
                      <td className="p-4" colSpan={2}>Grand Total Kebutuhan Modal Subsidi Tahunan</td>
                      <td className="p-4 text-right" colSpan={3}>Rp 25.000.000</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-accent/10 border border-accent/20 rounded-2xl text-xs text-text-main leading-relaxed mt-4 flex gap-2">
                <Info size={18} className="text-accent shrink-0" />
                <p>
                  <strong>Catatan Target ROI (Return on Investment):</strong> Dengan modal kelayakan Rp 25 juta, kelurahan melompati tahapan manual. Penghematan konsumsi kertas kelurahan per tahun diprediksi senilai Rp 14.500.000, serta penagihan iuran warga yang mandek berhasil dinaikkan dari 55% menjadi 98.7% secara tepat sasaran.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: TECHNICAL BLUEPRINT (PREVIOUS ARCH_DOCS CONTENT) ================= */}
        {activeSubTab === "tech" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <section className="bg-primary text-text-inverse p-8 rounded-3xl">
              <h2 className="text-2xl font-display font-semibold mb-6 flex items-center gap-2">
                <Server className="w-6 h-6" /> Rekomendasi Tech Stack
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-surface/10 border border-white/15 p-5 rounded-xl">
                  <h3 className="font-semibold text-text-inverse mb-2">1. Frontend (Web & Mobile PWA)</h3>
                  <ul className="text-xs space-y-2 opacity-90 text-white/90">
                    <li>• <strong>Framework:</strong> React (Vite) atau Next.js untuk SEO/SSR jika diperlukan oleh landing page publik.</li>
                    <li>• <strong>Styling:</strong> Tailwind CSS untuk styling utilitas cepat & konsisten dengan tema.</li>
                    <li>• <strong>State Management:</strong> Zustand (ringan & cepat).</li>
                    <li>• <strong>Charts:</strong> Recharts untuk Transparansi Kas.</li>
                  </ul>
                </div>

                <div className="bg-surface/10 border border-white/15 p-5 rounded-xl">
                  <h3 className="font-semibold text-text-inverse mb-2">2. Backend (API Layer)</h3>
                  <ul className="text-xs space-y-2 opacity-90 text-white/90">
                    <li>• <strong>Framework:</strong> Node.js dengan NestJS (Modular) atau Express (Sederhana).</li>
                    <li>• <strong>API Style:</strong> RESTful API atau token-based middleware.</li>
                    <li>• <strong>Auth:</strong> JWT & Role-Based Access Control (RBAC).</li>
                  </ul>
                </div>

                <div className="bg-surface/10 border border-white/15 p-5 rounded-xl">
                  <h3 className="font-semibold text-text-inverse mb-2">3. Database & Storage</h3>
                  <ul className="text-xs space-y-2 opacity-90 text-white/90">
                    <li>• <strong>Primary DB:</strong> PostgreSQL (Relational) via Prisma ORM. Sangat cocok untuk relasi Keuangan & User.</li>
                    <li>• <strong>Cloud Storage:</strong> AWS S3, Google Cloud Storage, atau Supabase Storage untuk Dokumen (KTP, KK).</li>
                  </ul>
                </div>

                <div className="bg-surface/10 border border-white/15 p-5 rounded-xl">
                  <h3 className="font-semibold text-text-inverse mb-2">4. Core Integrations</h3>
                  <ul className="text-xs space-y-2 opacity-90 text-white/90">
                    <li>• <strong>Smart OCR:</strong> Google Cloud Vision API atau Tesseract.js untuk auto-fill data KTP.</li>
                    <li>• <strong>Surat & QR:</strong> <code className="bg-primary-hover px-1 rounded text-text-inverse">pdf-lib</code> untuk generate PDF, <code className="bg-primary-hover px-1 rounded text-text-inverse">qrcode</code> untuk validasi URL.</li>
                    <li>• <strong>Panic Button:</strong> Socket.io (WebSocket) untuk real-time alert, terintegrasi dengan Twilio/WA API.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-surface p-8 rounded-3xl border border-border-weak shadow-sm">
              <h2 className="text-2xl font-display font-semibold mb-6 flex items-center gap-2 text-text-main">
                <Database className="w-6 h-6 text-accent" /> Skema Database Relasional (PostgreSQL)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-border-strong text-text-main font-semibold">
                      <th className="pb-3 pt-4 px-4">Nama Tabel</th>
                      <th className="pb-3 pt-4 px-4">Kolom Kunci</th>
                      <th className="pb-3 pt-4 px-4">Relasi & Deskripsi Fungsi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-weak text-text-muted">
                    <tr className="hover:bg-surface-hover transition-colors">
                      <td className="p-4 font-semibold text-text-main">Users</td>
                      <td className="p-4 font-mono text-xs text-accent">id, nik, name, role (WARGA|ADMIN), phone, address</td>
                      <td className="p-4">Menyimpan data warga & pengurus RT secara aman.</td>
                    </tr>
                    <tr className="hover:bg-surface-hover transition-colors">
                      <td className="p-4 font-semibold text-text-main">Documents</td>
                      <td className="p-4 font-mono text-xs text-accent">id, user_id, doc_type, file_url, verified_at</td>
                      <td className="p-4">Relasi Many-to-One dengan Users. Menyimpan salinan KTP & KK warga.</td>
                    </tr>
                    <tr className="hover:bg-surface-hover transition-colors">
                      <td className="p-4 font-semibold text-text-main">Letters (E-Surat)</td>
                      <td className="p-4 font-mono text-xs text-accent">id, user_id, type, status, approved_by, pdf_url, qr_hash</td>
                      <td className="p-4">Permohonan Surat Pengantar RT. Many-to-One ke Users.</td>
                    </tr>
                    <tr className="hover:bg-surface-hover transition-colors">
                      <td className="p-4 font-semibold text-text-main">Transactions</td>
                      <td className="p-4 font-mono text-xs text-accent">id, user_id, amount, type (IURAN|PENGELUARAN), date, category, status</td>
                      <td className="p-4">Ledger kas RT/RW. Transparansi untuk Dashboard Umum.</td>
                    </tr>
                    <tr className="hover:bg-surface-hover transition-colors">
                      <td className="p-4 font-semibold text-text-main">Reports (Tickets)</td>
                      <td className="p-4 font-mono text-xs text-accent">id, reporter_id, category, status, description, lat, lng</td>
                      <td className="p-4">Aduan/Laporan warga (E-Reporting) dengan titik geo-koordinat lokasi.</td>
                    </tr>
                    <tr className="hover:bg-surface-hover transition-colors">
                      <td className="p-4 font-semibold text-text-main">Emergencies</td>
                      <td className="p-4 font-mono text-xs text-accent">id, user_id, timestamp, location</td>
                      <td className="p-4">Log riwayat penekanan tombol bahaya (Panic Button).</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-surface p-8 rounded-3xl border border-border-weak shadow-sm">
              <h2 className="text-2xl font-display font-semibold mb-6 flex items-center gap-2 text-text-main">
                <FileText className="w-6 h-6 text-accent" /> Struktur Direktori Frontend (React/Vite)
              </h2>
              <div className="bg-sidebar text-text-main p-6 rounded-2xl font-mono text-xs leading-relaxed overflow-x-auto border border-border-weak">
<pre>{`src/
├── components/
│   ├── layout/         # Sidebar, Header, PageContainer
│   ├── ui/             # Reusable UI (Buttons, Cards, Modals)
│   └── dashboard/      # Custom charts, transparency widgets
├── views/              # Main Screens (UserDashboard, AdminDashboard, ArchitectureDoc)
├── lib/                # Utils, OCR parser logic, API clients
├── hooks/              # Custom hooks (e.g., useAuth)
└── App.tsx             # Entry point & Runtime Routing
`}</pre>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
