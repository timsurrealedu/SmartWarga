import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { "User-Agent": "aistudio-build" } },
});

export function createApp() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));

  // ── Dummy Data ──────────────────────────────────────────────────────────────

  let letters: any[] = [
    { id: "SRT-01", name: "Budi Santoso", type: "Surat Pengantar Domisili", date: "Hari ini, 09:30", status: "pending", keperluan: "Pembukaan Rekening Bank" },
    { id: "SRT-02", name: "Siti Aminah", type: "Surat Keterangan Tidak Mampu (SKTM)", date: "Hari ini, 08:15", status: "pending", keperluan: "Keringanan SPP Sekolah" },
    { id: "SRT-03", name: "Ahmad Dahlan", type: "Surat Keterangan Usaha", date: "Kemarin, 14:20", status: "approved", keperluan: "Pengajuan Pinjaman KUR" },
    { id: "SRT-04", name: "Joko", type: "Surat Pengantar Domisili", date: "Kemarin, 10:00", status: "rejected", keperluan: "Perpanjangan KTP" },
    { id: "SRT-05", name: "Ibu Dewi Lestari", type: "Surat Keterangan Usaha", date: "2 hari yang lalu, 11:45", status: "approved", keperluan: "Pengajuan Kredit Usaha Rakyat" },
    { id: "SRT-06", name: "Bpk. Firmansyah", type: "Surat Pengantar Nikah (N1-N4)", date: "3 hari yang lalu, 09:00", status: "approved", keperluan: "Persyaratan Nikah di KUA" },
    { id: "SRT-07", name: "Kak Rizky Pratama", type: "Surat Keterangan Belum Menikah", date: "3 hari yang lalu, 15:30", status: "pending", keperluan: "Syarat Beasiswa S2" },
  ];

  let financeData = [
    { name: "Jan", Pemasukan: 4000, Pengeluaran: 2400 },
    { name: "Feb", Pemasukan: 3000, Pengeluaran: 1398 },
    { name: "Mar", Pemasukan: 2000, Pengeluaran: 9800 },
    { name: "Apr", Pemasukan: 2780, Pengeluaran: 3908 },
    { name: "Mei", Pemasukan: 1890, Pengeluaran: 4800 },
    { name: "Jun", Pemasukan: 2390, Pengeluaran: 3800 },
    { name: "Jul", Pemasukan: 3490, Pengeluaran: 4300 },
  ];

  const defaultCategories = [
    { name: "Kebersihan", amount: 30000, desc: "Pembersihan got, bak sampah jalan, operasional mobil truk" },
    { name: "Keamanan", amount: 50000, desc: "Gaji 2 petugas jaga siang/malam, CCTV keamanan, pos ronda" },
    { name: "Uang Kas", amount: 20000, desc: "Kas sosial kemasyarakatan, kedukaan, hajatan warga" },
    { name: "Arisan", amount: 30000, desc: "Arisan gotong-royong bulanan Ibu-ibu PKK" },
    { name: "Development (Pembangunan)", amount: 20000, desc: "Dana tabungan berkala perbaikan aspal, gerbang baru, & drainase" },
  ];

  let residentsData: any[] = [
    {
      id: "RES-01", name: "Bpk. Rahardian", address: "Jl. Merdeka No. 45, RT 05 / RW 12", phone: "0812-3456-7890",
      dues: [
        { id: "DUE-01", month: "Oktober 2023", amount: 150000, status: "paid", date: "05 Okt 2023", categories: defaultCategories, proof: null },
        { id: "DUE-02", month: "November 2023", amount: 150000, status: "unpaid", date: "-", categories: defaultCategories, proof: null },
      ],
      reminders: [],
    },
    {
      id: "RES-02", name: "Bpk. Ahmad Dahlan", address: "Jl. Merdeka No. 12, RT 05 / RW 12", phone: "0813-9876-5432",
      dues: [
        { id: "DUE-A1", month: "Oktober 2023", amount: 150000, status: "paid", date: "03 Okt 2023", categories: defaultCategories, proof: null },
        { id: "DUE-A2", month: "November 2023", amount: 150000, status: "paid", date: "08 Nov 2023", categories: defaultCategories, proof: null },
      ],
      reminders: [],
    },
    {
      id: "RES-03", name: "Ibu Rini Saputri", address: "Jl. Merdeka No. 05, RT 05 / RW 12", phone: "0812-2233-4455",
      dues: [
        { id: "DUE-R1", month: "Oktober 2023", amount: 150000, status: "paid", date: "06 Okt 2023", categories: defaultCategories, proof: null },
        { id: "DUE-R2", month: "November 2023", amount: 150000, status: "pending", date: "Hari ini", categories: defaultCategories, proof: { bank: "MANDIRI", sender: "Ibu Rini Saputri", amount: 150000, date: "24 Mei 2026", image: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=400" } },
      ],
      reminders: [],
    },
    {
      id: "RES-04", name: "Ibu Siti Aminah", address: "Jl. Dahlia Raya No. 17, RT 05 / RW 12", phone: "0815-5566-7788",
      dues: [
        { id: "DUE-S1", month: "Oktober 2023", amount: 150000, status: "paid", date: "04 Okt 2023", categories: defaultCategories, proof: null },
        { id: "DUE-S2", month: "November 2023", amount: 150000, status: "unpaid", date: "-", categories: defaultCategories, proof: null },
      ],
      reminders: [{ id: "REM-1", date: "24 Mei 2026", message: "Yth. Ibu Siti Aminah, tagihan iuran November belum terlunasi. Mohon segera melakukan transfer." }],
    },
    {
      id: "RES-05", name: "Bpk. Firmansyah", address: "Jl. Kenanga No. 33, RT 05 / RW 12", phone: "0857-9900-1122",
      dues: [
        { id: "DUE-FI1", month: "Oktober 2023", amount: 150000, status: "paid", date: "07 Okt 2023", categories: defaultCategories, proof: null },
        { id: "DUE-FI2", month: "November 2023", amount: 150000, status: "paid", date: "03 Nov 2023", categories: defaultCategories, proof: null },
      ],
      reminders: [],
    },
    {
      id: "RES-06", name: "Ibu Dewi Lestari", address: "Jl. Melati No. 8, RT 05 / RW 12", phone: "0819-4444-5555",
      dues: [
        { id: "DUE-DL1", month: "Oktober 2023", amount: 150000, status: "paid", date: "05 Okt 2023", categories: defaultCategories, proof: null },
        { id: "DUE-DL2", month: "November 2023", amount: 150000, status: "pending", date: "Hari ini", categories: defaultCategories, proof: { bank: "BCA", sender: "Ibu Dewi Lestari", amount: 150000, date: "24 Mei 2026", image: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=400" } },
      ],
      reminders: [],
    },
  ];

  let newsData = [
    { id: "NEWS-1", title: "Jadwal Fogging Lingkungan DBD Pekan Ini", category: "Kesehatan", date: "23 Mei 2026", summary: "Mengantisipasi peningkatan demam berdarah dengue (DBD) di pancaroba, RT akan melakukan penyemprotan asap fogging pelindung jentik nyamuk.", content: "Yth. Seluruh Warga RT 05. Kami menginfokan bahwa koordinasi dengan Puskesmas telah selesai. Penyemprotan Fogging Demam Berdarah akan diadakan pada hari Sabtu pagi mulai pukul 07:00 WIB hingga selesai. Mohon menutup makanan rapat-rapat dan menjaga anak kecil tetap di dalam rumah selama proses berlangsung.", image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=600" },
    { id: "NEWS-2", title: "Kerja Bakti Akbar & Revitalisasi Gapura", category: "Gotong Royong", date: "19 Mei 2026", summary: "Bergabung bersama dalam memperindah gapura akses utama dan membersihkan saluran air penyumbat banjir.", content: "Gotong royong akan difokuskan pada pembersihan selokan utama jalan Merdeka guna menghindari genangan air, serta pengecatan ulang gapura penyambutan warga agar terlihat asri dan modern. Konsumsi disediakan oleh ibu-ibu PKK.", image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=600" },
    { id: "NEWS-3", title: "Pemasangan CCTV Baru Blok D & E Selesai", category: "Keamanan", date: "12 Mei 2026", summary: "4 unit kamera CCTV 2MP night-vision berhasil dipasang di titik strategis Blok D dan E. Sistem terhubung ke dashboard monitoring admin SmartWarga.", content: "RT 05 bekerjasama dengan PT. Sekuritas Prima berhasil memasang 4 unit CCTV night-vision di Gang Melati, persimpangan Blok D-E, area parkir, dan depan lapangan. Rekaman dapat dipantau pengurus via dashboard admin SmartWarga secara real-time.", image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=600" },
    { id: "NEWS-4", title: "Pembukaan Pendaftaran UMKM Digital RT 05", category: "Ekonomi", date: "8 Mei 2026", summary: "Program digitalisasi UMKM warga RT 05 resmi dibuka. Daftarkan usaha Anda di portal Pasar & UMKM untuk jangkauan promosi lebih luas.", content: "Dalam rangka mendukung pemulihan ekonomi warga, RT 05 membuka program pendaftaran UMKM digital. Usaha yang terdaftar akan tampil di portal SmartWarga dan mendapat bantuan promosi digital dari pengurus RT. Pendaftaran gratis dan tanpa biaya apapun.", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600" },
    { id: "NEWS-5", title: "Hasil Rapat Bulanan: Komponen Iuran Pembangunan Disesuaikan", category: "Administrasi", date: "5 Mei 2026", summary: "Rapat warga menyepakati kenaikan komponen iuran Pembangunan dari Rp 15.000 menjadi Rp 20.000 mulai bulan ini.", content: "Rapat warga yang dihadiri 87 KK (dari total 120 KK) menyepakati peningkatan komponen tabungan pembangunan sebesar Rp 5.000/bulan guna mengakselerasi proyek perbaikan jalan internal RT yang telah tertunda.", image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=600" },
  ];

  let umkmData = [
    { id: "UMKM-1", owner: "Ibu Rini Saputri", name: "Catering Rini Sedap", category: "Makanan & Minuman", phone: "0812-2233-4455", desc: "Menyediakan nasi kotak higienis, snack box, arisan, kue basah, dan catering bulanan warga. Rasa terjamin lezat dan halal.", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=300" },
    { id: "UMKM-2", owner: "Pak Joko", name: "Bengkel Motor Berkah", category: "Jasa", phone: "0816-1212-3434", desc: "Servis motor, ganti oli, ban bocor, tambal ban, kelistrikan roda dua. Diskon khusus warga RT sekitar 10%.", image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=400" },
    { id: "UMKM-3", owner: "Ibu Dewi Lestari", name: "Konveksi & Jahit Kilat Dewi", category: "Fashion & Kerajinan", phone: "0819-4444-5555", desc: "Jahit baju, rok sekolah, baju koko, seragam RT/kantor, dan bordir nama. Pengerjaan kilat 1-3 hari. Diskon 15% untuk seragam RT.", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=300" },
    { id: "UMKM-4", owner: "Bpk. Deden Suherman", name: "Warung Sembako Pak Deden", category: "Sembako & Grocery", phone: "0817-6677-8899", desc: "Lengkap: beras, minyak goreng, gas elpiji, sayuran segar harian. Buka 06:00–21:00. Layanan antar ke rumah minimal belanja Rp 50.000.", image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&q=80&w=300" },
    { id: "UMKM-5", owner: "Kak Rizky Pratama", name: "Les Privat & Bimbel Rizky", category: "Pendidikan", phone: "0823-1122-3344", desc: "Bimbingan belajar SD–SMA: Matematika, IPA, Bahasa Inggris, dan persiapan UTBK. Jadwal fleksibel, biaya terjangkau khusus warga RT.", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=300" },
  ];

  let adsData = [
    { id: "AD-1", sponsor: "Minecraft Official", title: "Minecraft Realms RT 04", desc: "Dapatkan diskon berlangganan Minecraft Realms khusus untuk warga RT yang suka main bareng.", image: "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&q=80&w=500", cta: "Main Sekarang", link: "https://www.minecraft.net" },
    { id: "AD-2", sponsor: "DC Comics", title: "Streaming DC Universe", desc: "Nobar akhir pekan makin seru bareng warga dengan langganan VIP film-film dari DC Universe.", image: "https://images.unsplash.com/photo-1611604548018-d56bbd85d681?auto=format&fit=crop&q=80&w=500", cta: "Berlangganan", link: "https://www.dc.com" },
  ];

  let reportsData: any[] = [
    { id: "REP-01", title: "Lampu Jalan Mati", location: "Blok C2 No. 12", date: "2 jam yang lalu", status: "PROSES", image: "https://images.unsplash.com/photo-1509021436665-8f37df706533?auto=format&fit=crop&q=80&w=400", sender: "Bpk. Rahardian", isPublic: true, category: "Infrastruktur", aiLabels: { category: "Infrastruktur", urgency: 7.5, tags: ["lampu jalan", "fasilitas umum", "blok C"], confirmed: false } },
    { id: "REP-02", title: "Sampah Belum Diambil", location: "Blok A1", date: "Kemarin", status: "SELESAI", image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400", sender: "Ibu Sari", isPublic: true, category: "Kebersihan", aiLabels: { category: "Kebersihan", urgency: 5.0, tags: ["sampah", "blok A", "pengangkutan"], confirmed: true } },
    { id: "REP-03", title: "Parkir Liar Motor Tidak Dikenal", location: "Gerbang Utama", date: "2 hari yang lalu", status: "SELESAI", image: "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&q=80&w=400", sender: "Bpk. Rahardian", isPublic: false, category: "Keamanan", aiLabels: { category: "Keamanan", urgency: 6.2, tags: ["parkir liar", "gerbang", "ketertiban"], confirmed: false } },
    { id: "REP-04", title: "Got Tersumbat Sampah Plastik", location: "Gang Melati Blok A2", date: "Kemarin, 13:00", status: "PROSES", image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400", sender: "Ibu Siti Aminah", isPublic: true, category: "Kebersihan", aiLabels: { category: "Kebersihan", urgency: 8.1, tags: ["got", "banjir", "sampah plastik", "prioritas"], confirmed: false } },
    { id: "REP-05", title: "Pagar Fasilitas Umum Rusak", location: "Area Lapangan Blok D", date: "3 hari yang lalu", status: "TERKIRIM", image: "https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?auto=format&fit=crop&q=80&w=400", sender: "Bpk. Firmansyah", isPublic: true, category: "Infrastruktur", aiLabels: { category: "Infrastruktur", urgency: 4.3, tags: ["pagar rusak", "lapangan", "keselamatan"], confirmed: false } },
    { id: "REP-06", title: "Pohon Tumbang Tutup Jalan", location: "Jl. Kenanga depan No. 28", date: "4 hari yang lalu", status: "SELESAI", image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=400", sender: "Ibu Dewi Lestari", isPublic: true, category: "Infrastruktur", aiLabels: { category: "Infrastruktur", urgency: 9.2, tags: ["pohon tumbang", "jalan terblokir", "darurat"], confirmed: true } },
  ];

  let financeDetails: any[] = [
    { id: "EXP-01", category: "Kebersihan", amount: 450000, desc: "Honor Petugas Sampah", date: "25 Okt 2023", proof: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" },
    { id: "EXP-02", category: "Keamanan", amount: 1200000, desc: "Gaji Satpam Malam (2 org)", date: "28 Okt 2023", proof: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" },
    { id: "EXP-03", category: "Infrastruktur", amount: 850000, desc: "Perbaikan Lampu Jalan Blok D", date: "30 Okt 2023", proof: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" },
    { id: "EXP-04", category: "Acara Warga", amount: 1500000, desc: "Konsumsi Kerja Bakti Lingkungan", date: "20 Okt 2023", proof: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" },
  ];

  let financeSummary = [
    { name: "Kebersihan", value: 450000, color: "#1B332D" },
    { name: "Keamanan", value: 1200000, color: "#4a5d4a" },
    { name: "Infrastruktur", value: 850000, color: "#e2e8e2" },
    { name: "Acara Warga", value: 1500000, color: "#a2b897" },
    { name: "Admin RT", value: 300000, color: "#FF8A65" },
  ];

  let volunteersData = [
    { id: "VOL-01", eventId: 1, name: "Ibu Siti (Istri)", relation: "Istri", registeredAt: "24 Mei 2026" },
    { id: "VOL-02", eventId: 1, name: "Agus (Anak)", relation: "Anak", registeredAt: "24 Mei 2026" },
    { id: "VOL-03", eventId: 2, name: "Bpk. Rahardian", relation: "Kepala Keluarga", registeredAt: "23 Mei 2026" },
  ];

  let donationsData: any[] = [
    {
      id: "DON-01", title: "Donasi Musibah Banjir Subang", desc: "Mari ringankan beban saudara kita di Subang yang terdampak banjir bandang. Bantuan berupa uang, sembako, pakaian layak pakai akan disalurkan langsung.", target: 5000000, raised: 3200000,
      image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=400",
      donors: [
        { name: "Bpk. Rahardian", amount: 100000, date: "Hari ini" },
        { name: "Ibu Rini Saputri", amount: 200000, date: "Kemarin" },
        { name: "Bpk. Ahmad Dahlan", amount: 150000, date: "2 hari yang lalu" },
      ],
    },
    {
      id: "DON-02", title: "Pembangunan Pos Ronda Blok D", desc: "Menambah satu pos ronda baru untuk meningkatkan jangkauan patroli malam satpam RT 05. Estimasi kebutuhan biaya semen, kayu, atap, dan cat.", target: 4000000, raised: 1500000,
      image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=400",
      donors: [
        { name: "Ibu Siti Aminah", amount: 500000, date: "3 hari yang lalu" },
        { name: "Budi Santoso", amount: 200000, date: "4 hari yang lalu" },
      ],
    },
  ];

  let notificationsData: any[] = [
    { id: "NOT-01", title: "Tagihan Iuran November", message: "Tagihan iuran bulanan November 2023 sebesar Rp 150.000 belum lunas. Segera lakukan pembayaran.", category: "finance", date: "Baru saja", isRead: false },
    { id: "NOT-02", title: "Gotong Royong Akhir Pekan", message: "Kerja bakti akbar bersih selokan akan diadakan Minggu ini. Daftarkan relawan keluarga Anda sekarang!", category: "event", date: "2 jam yang lalu", isRead: false },
    { id: "NOT-03", title: "Administrasi Surat Jadi", message: "Surat Keterangan Usaha (#SRT-03) Anda telah disetujui Ketua RT. Silakan unduh PDF di menu E-Surat.", category: "letter", date: "Kemarin", isRead: false },
  ];

  // ── API Routes ───────────────────────────────────────────────────────────────

  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

  app.get("/api/user/letters", (_req, res) => res.json(letters));

  app.post("/api/user/letters", (req, res) => {
    const { type, keperluan, signature, name } = req.body;
    const newLetter = {
      id: `SRT-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
      name: name || "Bpk. Rahardian",
      type: type || "Surat Pengantar Domisili",
      date: "Baru saja",
      status: "pending",
      keperluan: keperluan || "",
      wargaSignature: signature || null,
      adminSignature: null,
    };
    letters = [newLetter, ...letters];
    res.json(newLetter);
  });

  app.get("/api/finance", (_req, res) =>
    res.json({ summary: financeSummary, details: financeDetails, history: financeData })
  );

  app.get("/api/user/dues", (_req, res) => res.json(residentsData[0].dues));

  app.post("/api/user/dues/:id/pay", (req, res) => {
    const { id } = req.params;
    const { bank, sender, amount, date, image } = req.body;
    residentsData = residentsData.map((resObj: any) => ({
      ...resObj,
      dues: resObj.dues.map((d: any) =>
        d.id === id
          ? { ...d, status: "pending", date: "Hari ini", proof: { bank: bank || "TRANSFER MANUAL", sender: sender || resObj.name, amount: Number(amount) || d.amount, date: date || "Hari ini", image: image || "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=400" } }
          : d
      ),
    }));
    res.json({ success: true });
  });

  app.get("/api/user/reports", (_req, res) => res.json(reportsData));

  app.post("/api/user/reports", async (req, res) => {
    const { title, location, image, isPublic, category, description } = req.body;
    const newReport: any = {
      id: `REP-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
      title: title || "Laporan Baru",
      location: location || "Lokasi tidak diketahui",
      description: description || "",
      date: "Baru saja",
      status: "TERKIRIM",
      image: image || null,
      sender: "Budi Santoso",
      isPublic: isPublic ?? true,
      category: category || "Lainnya",
      aiLabels: null,
    };
    reportsData = [newReport, ...reportsData];
    res.json(newReport);

    // Async NLP classification (non-blocking)
    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `Klasifikasikan laporan warga berikut:\nJudul: ${newReport.title}\nLokasi: ${newReport.location}\nDeskripsi: ${newReport.description || "(tidak ada)"}\n\nTentukan category (salah satu dari: Infrastruktur, Kebersihan, Keamanan, Sosial, Lainnya), urgency (angka 0-10 menunjukkan tingkat urgensi, 10 paling mendesak), dan tags (3-5 kata kunci relevan). Balas HANYA dalam format JSON.`;
        const result = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                urgency: { type: Type.NUMBER },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["category", "urgency", "tags"],
            },
          },
        });
        const labels = JSON.parse(result.text || "{}");
        const idx = reportsData.findIndex((r: any) => r.id === newReport.id);
        if (idx !== -1) {
          reportsData[idx].aiLabels = { ...labels, confirmed: false };
        }
      } catch (e) {
        console.error("NLP classification error:", e);
      }
    } else {
      // Fallback classification without Gemini
      const cats: Record<string, string[]> = {
        Infrastruktur: ["lampu", "jalan", "pagar", "pohon", "air", "listrik", "got"],
        Kebersihan: ["sampah", "kotor", "bersih", "got", "limbah"],
        Keamanan: ["parkir", "maling", "pencuri", "aman", "bahaya", "liar"],
        Sosial: ["berisik", "keributan", "warga"],
      };
      let detected = "Lainnya";
      const lc = (newReport.title + " " + (newReport.description || "")).toLowerCase();
      for (const [cat, kws] of Object.entries(cats)) {
        if (kws.some((k) => lc.includes(k))) { detected = cat; break; }
      }
      const urgencyMap: Record<string, number> = { Infrastruktur: 7.0, Kebersihan: 5.5, Keamanan: 8.0, Sosial: 4.0, Lainnya: 3.5 };
      const idx = reportsData.findIndex((r: any) => r.id === newReport.id);
      if (idx !== -1) {
        reportsData[idx].aiLabels = { category: detected, urgency: urgencyMap[detected] ?? 5.0, tags: [detected.toLowerCase(), "laporan baru"], confirmed: false };
      }
    }
  });

  app.get("/api/admin/complaints", (_req, res) => {
    const sorted = [...reportsData].sort((a, b) => (b.aiLabels?.urgency ?? 0) - (a.aiLabels?.urgency ?? 0));
    res.json(sorted);
  });

  app.post("/api/admin/complaints/:id/confirm", (req, res) => {
    const { id } = req.params;
    const idx = reportsData.findIndex((r: any) => r.id === id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    reportsData[idx].aiLabels = { ...reportsData[idx].aiLabels, confirmed: true };
    res.json(reportsData[idx]);
  });

  app.post("/api/admin/complaints/:id/override", (req, res) => {
    const { id } = req.params;
    const { category, urgency, tags } = req.body;
    const idx = reportsData.findIndex((r: any) => r.id === id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    reportsData[idx].aiLabels = { category, urgency, tags, confirmed: true };
    reportsData[idx].category = category;
    res.json(reportsData[idx]);
  });

  app.post("/api/admin/complaints/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const idx = reportsData.findIndex((r: any) => r.id === id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    reportsData[idx].status = status;
    res.json(reportsData[idx]);
  });

  // ── AI OCR for KTP/KK ─────────────────────────────────────────────────────────

  app.post("/api/ocr-ktp", async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) return res.status(400).json({ error: "Image is required" });
      const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
      if (!match) return res.status(400).json({ error: "Invalid image base64 format" });

      if (!process.env.GEMINI_API_KEY) {
        return res.json({ nik: "3273112345678900", name: "Nama Dummy", alamat: "Jl. Merdeka No. 45, RT 05/RW 12" });
      }

      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          { inlineData: { mimeType: match[1], data: match[2] } },
          { text: "Ekstrak data dari KTP atau Kartu Keluarga ini. Kembalikan NIK (16 digit), nama lengkap, dan alamat. Jika gambar bukan KTP/KK atau data tidak terbaca, isi dengan string kosong. Format: JSON murni sesuai schema." },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              nik: { type: Type.STRING },
              name: { type: Type.STRING },
              alamat: { type: Type.STRING },
            },
            required: ["nik", "name", "alamat"],
          },
        },
      });
      res.json(JSON.parse((result.text || "{}").trim()));
    } catch (error: any) {
      console.error("OCR KTP error:", error);
      res.status(500).json({ error: error.message || "Failed to process image" });
    }
  });

  app.get("/api/news", (_req, res) => res.json(newsData));

  app.post("/api/news", (req, res) => {
    const { title, category, summary, content, image } = req.body;
    const newArticle = { id: `NEWS-${Date.now()}`, title, category: category || "Umum", date: "Hari ini", summary: summary || "", content: content || "", image: image || "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=400" };
    newsData = [newArticle, ...newsData];
    res.json({ success: true, article: newArticle });
  });

  app.get("/api/umkm", (_req, res) => res.json(umkmData));

  app.post("/api/umkm", (req, res) => {
    const { owner, name, category, phone, desc, image } = req.body;
    const newListing = { id: `UMKM-${Date.now()}`, owner: owner || "Warga", name, category: category || "Lainnya", phone: phone || "", desc: desc || "", image: image || "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=300" };
    umkmData = [newListing, ...umkmData];
    res.json({ success: true, listing: newListing });
  });

  app.get("/api/ads", (_req, res) => res.json(adsData));

  app.post("/api/ads", (req, res) => {
    const { sponsor, title, desc, image, cta, link } = req.body;
    const newAd = { id: `AD-${Date.now()}`, sponsor, title, desc, image: image || "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=500", cta: cta || "Hubungi Kami", link: link || "#" };
    adsData = [newAd, ...adsData];
    res.json({ success: true, ad: newAd });
  });

  app.get("/api/admin/residents", (_req, res) => res.json(residentsData));

  app.put("/api/admin/residents/:residentId/due/:dueId/approve", (req, res) => {
    const { residentId, dueId } = req.params;
    residentsData = residentsData.map((resObj: any) => {
      if (resObj.id !== residentId) return resObj;
      return {
        ...resObj,
        dues: resObj.dues.map((d: any) => {
          if (d.id !== dueId) return d;
          financeDetails = [{ id: `INC-${Date.now().toString().slice(-4)}`, category: "Pemasukan", amount: d.amount, desc: `Iuran ${d.month} - ${resObj.name}`, date: "Hari ini", proof: d.proof?.image || "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=400" }, ...financeDetails];
          financeSummary[4].value += d.amount;
          return { ...d, status: "paid", date: "Hari ini" };
        }),
      };
    });
    res.json({ success: true });
  });

  app.put("/api/admin/residents/:residentId/due/:dueId/reject", (req, res) => {
    const { residentId, dueId } = req.params;
    residentsData = residentsData.map((resObj: any) =>
      resObj.id === residentId
        ? { ...resObj, dues: resObj.dues.map((d: any) => d.id === dueId ? { ...d, status: "unpaid", proof: null } : d) }
        : resObj
    );
    res.json({ success: true });
  });

  app.post("/api/admin/residents/:residentId/reminder", (req, res) => {
    const { residentId } = req.params;
    const { message } = req.body;
    residentsData = residentsData.map((resObj: any) =>
      resObj.id === residentId
        ? { ...resObj, reminders: [{ id: `REM-${Date.now()}`, date: "Hari ini", message: message || "Harap segera lunasi tunggakan iuran Bulanan Anda." }, ...resObj.reminders] }
        : resObj
    );
    res.json({ success: true });
  });

  app.get("/api/admin/letters", (_req, res) => res.json(letters));

  app.put("/api/admin/letters/:id/approve", (req, res) => {
    const { id } = req.params;
    const { signature } = req.body;
    letters = letters.map((l: any) => l.id === id ? { ...l, status: "approved", adminSignature: signature } : l);
    res.json({ success: true });
  });

  app.put("/api/admin/letters/:id/reject", (req, res) => {
    const { id } = req.params;
    letters = letters.map((l: any) => l.id === id ? { ...l, status: "rejected" } : l);
    res.json({ success: true });
  });

  app.post("/api/admin/finance", (req, res) => {
    const { type, amount, desc, image } = req.body;
    if (!image) return res.status(400).json({ error: "Proof image is mandatory" });
    const newTransaction = { id: `${type === "in" ? "INC" : "EXP"}-${Math.floor(Math.random() * 1000)}`, category: type === "in" ? "Pemasukan" : "Operasional", amount: Number(amount), desc, date: "Hari ini", proof: image };
    financeDetails = [newTransaction, ...financeDetails];
    if (type === "out") financeSummary[0].value += Number(amount);
    else financeSummary[4].value += Number(amount);
    res.json({ success: true, transaction: newTransaction });
  });

  app.post("/api/admin/validate-user", (_req, res) =>
    res.json({ success: true, message: "User validated successfully." })
  );

  app.get("/api/volunteers", (_req, res) => res.json(volunteersData));

  app.post("/api/volunteers", (req, res) => {
    const { eventId, name, relation } = req.body;
    const newVolunteer = { id: `VOL-${Date.now()}`, eventId: Number(eventId), name, relation: relation || "Keluarga", registeredAt: "Hari ini" };
    volunteersData = [newVolunteer, ...volunteersData];
    res.json(newVolunteer);
  });

  app.get("/api/donations", (_req, res) => res.json(donationsData));

  app.post("/api/donations/:id/pay", (req, res) => {
    const { id } = req.params;
    const { donorName, amount } = req.body;
    const donorAmount = Number(amount);
    donationsData = donationsData.map((don: any) =>
      don.id === id
        ? { ...don, raised: don.raised + donorAmount, donors: [{ name: donorName || "Warga Anonim", amount: donorAmount, date: "Hari ini" }, ...don.donors] }
        : don
    );
    const targetDon = donationsData.find((d: any) => d.id === id);
    notificationsData = [{ id: `NOT-${Date.now()}`, title: "Donasi Diterima", message: `Terima kasih, donasi Rp ${donorAmount.toLocaleString("id-ID")} untuk '${targetDon?.title || "Kegiatan Sosial"}' berhasil dikonfirmasi!`, category: "donation", date: "Baru saja", isRead: false }, ...notificationsData];
    res.json({ success: true, donations: donationsData });
  });

  app.get("/api/notifications", (_req, res) => res.json(notificationsData));

  app.post("/api/notifications", (req, res) => {
    const { title, message, category } = req.body;
    const newNotif = { id: `NOT-${Date.now()}`, title: title || "Pemberitahuan", message: message || "", category: category || "general", date: "Baru saja", isRead: false };
    notificationsData = [newNotif, ...notificationsData];
    res.json(newNotif);
  });

  app.post("/api/notifications/clear", (_req, res) => {
    notificationsData = notificationsData.map((n: any) => ({ ...n, isRead: true }));
    res.json({ success: true });
  });

  // ── AI Chatbot ────────────────────────────────────────────────────────────────

  const handleChatbotRequest = async (req: express.Request, res: express.Response) => {
    try {
      const { message, messages } = req.body;
      let userQuery = "";
      let history: any[] = [];

      if (message) {
        userQuery = message;
        history = [{ role: "user", text: message }];
      } else if (messages && Array.isArray(messages)) {
        history = messages;
        const lastMsg = messages[messages.length - 1];
        userQuery = lastMsg ? lastMsg.text : "";
      } else {
        return res.status(400).json({ error: "Either 'message' or 'messages' array is required" });
      }

      const queryLower = userQuery.toLowerCase();

      const getDemoReply = (query: string): string | null => {
        if (query.includes("saldo") || query.includes("uang kas") || query.includes("keuangan"))
          return "📊 **Status Keuangan Kas RT 05 saat ini sangat sehat!**\n\n* **Total Saldo Aktif**: Rp 4.340.000\n* **Rincian Pengeluaran Bulan Ini**:\n  - 🧹 Kebersihan: Rp 450.000 (Honor Petugas Sampah)\n  - 🛡️ Keamanan: Rp 1.200.000 (Gaji Satpam Malam)\n  - 🏗️ Infrastruktur: Rp 850.000 (Perbaikan Lampu Jalan Blok D)\n  - 👥 Acara Warga: Rp 1.500.000 (Konsumsi Kerja Bakti Lingkungan)\n\nSemua bukti kwitansi transaksi tercatat transparan dan dapat Anda lihat langsung di menu **Iuran & Kas**.";
        if (query.includes("iuran") || query.includes("bayar") || query.includes("tagihan"))
          return "💳 **Aturan & Nominal Iuran Bulanan Warga RT 05**:\n\nSetiap Kepala Keluarga (KK) wajib membayar iuran bulanan sebesar **Rp 150.000**, dengan alokasi:\n* 🧹 Kebersihan Lingkungan: Rp 30.000\n* 🛡️ Keamanan & Satpam: Rp 50.000\n* 📁 Kas Sosial RT: Rp 20.000\n* 🌸 Kas Arisan Ibu-ibu PKK: Rp 30.000\n* 🏗️ Tabungan Pembangunan Fisik: Rp 20.000\n\nPembayaran dapat dilakukan secara aman dan praktis melalui menu **Iuran & Kas** menggunakan Transfer VA Bank atau QRIS.";
        if (query.includes("surat") || query.includes("pengantar") || query.includes("domisili") || query.includes("nik") || query.includes("keterangan"))
          return "📄 **Panduan Pembuatan E-Surat Resmi RT 05**:\n\nAnda dapat mengurus surat pengantar tanpa harus bertatap muka langsung:\n1. Buka tab **E-Surat** di sidebar kiri.\n2. Klik tombol **Buat Surat Pengantar**.\n3. Pilih tipe surat (Domisili, Surat Keterangan Usaha, atau Surat Keterangan Tidak Mampu).\n4. Isi keperluan, bubuhkan tanda tangan digital Anda, lalu kirim.\n5. Ketua RT akan memproses secara real-time. Setelah disetujui, surat akan diterbitkan otomatis lengkap dengan **QR Code Sah** yang bisa Anda unduh langsung sebagai PDF!";
        if (query.includes("lapor") || query.includes("aduan") || query.includes("jalan") || query.includes("lampu") || query.includes("parkir") || query.includes("e-reporting") || query.includes("ereporting"))
          return "🚨 **Panduan Sistem E-Reporting (Aduan Warga)**:\n\nJika melihat kerusakan fasilitas umum, silakan melapor lewat menu **E-Reporting**:\n1. Buka menu **E-Reporting**.\n2. Unggah foto keluhan (misal: jalan berlubang, lampu padam, atau tumpukan sampah).\n3. **AI Vision** kami akan otomatis menganalisis foto, menentukan judul, kategori, dan mencocokkan titik koordinat lokasi.\n4. Pilih status laporan: **Publik** (bisa dibaca warga lain) atau **Rahasia** (hanya dibaca Pengurus RT).\n5. Kirim laporan dan pantau progresnya secara langsung di tab **Lacak Status**.";
        if (query.includes("profil") || query.includes("keluarga") || query.includes("rahardian") || query.includes("budi") || query.includes("istri") || query.includes("anak"))
          return "👥 **Data Profil Keluarga Anda (Database RT 05)**:\n\n* **Kepala Keluarga**: Bpk. Rahardian\n* **Alamat Terdaftar**: Jl. Merdeka No. 45, RT 05 / RW 12\n* **No. Telepon**: 0812-3456-7890\n* **Anggota Keluarga Tercatat**:\n  - Ibu Siti (Istri)\n  - Agus (Anak)\n  - Rani (Anak)\n\n*Catatan*: Untuk penambahan/perubahan anggota keluarga, silakan bawa berkas Kartu Keluarga fisik ke Ketua RT.";
        if (query.includes("kerja bakti") || query.includes("gotong royong") || query.includes("agenda") || query.includes("kegiatan") || query.includes("gapura"))
          return "🧹 **Agenda Gotong Royong RT 05 Terdekat**:\n\n* **Nama Kegiatan**: Kerja Bakti Akbar & Revitalisasi Gapura\n* **Waktu**: Minggu ini, Pukul 07:00 WIB s/d selesai\n* **Lokasi**: Area Pintu Masuk Gapura RT 05\n* **Fokus Kerja**: Pembersihan selokan utama Jl. Merdeka, pengecatan ulang gapura, dan penataan taman sosial.\n\n*Ayo bergabung!* Silakan daftarkan anggota keluarga Anda sebagai relawan melalui menu **Portal Berita & Gotong Royong**.";
        if (query.includes("umkm") || query.includes("toko") || query.includes("pasar") || query.includes("warung") || query.includes("jual") || query.includes("usaha warga") || query.includes("beli"))
          return "🏪 **Direktori UMKM Warga RT 05 (5 Usaha Terdaftar)**:\n\n* 🍱 **Catering Rini Sedap** (Ibu Rini) — Nasi kotak, snack box, kue basah. 📞 0812-2233-4455\n* 🔧 **Bengkel Motor Berkah** (Pak Joko) — Servis motor & ganti oli, diskon 10% warga RT. 📞 0816-1212-3434\n* 👗 **Konveksi & Jahit Kilat Dewi** (Ibu Dewi) — Baju, seragam, bordir. Selesai 1-3 hari. 📞 0819-4444-5555\n* 🛒 **Warung Sembako Pak Deden** — Sembako lengkap, buka 06:00-21:00, antar ke rumah. 📞 0817-6677-8899\n* 📚 **Bimbel Rizky** (Kak Rizky) — Les privat SD-SMA, Math/IPA/B.Inggris/UTBK. 📞 0823-1122-3344\n\nLihat detail lengkap & daftarkan usaha Anda di menu **Pasar & UMKM** (gratis!).";
        if (query.includes("berita") || query.includes("pengumuman") || query.includes("info") || query.includes("kabar") || query.includes("warta") || query.includes("cctv") || query.includes("fogging") || query.includes("dbd"))
          return "📰 **Berita & Pengumuman Terkini RT 05**:\n\n1. 🦟 **Fogging DBD** (23 Mei) — Penyemprotan nyamuk Sabtu pagi 07:00 WIB. Tutup makanan, anak tetap di rumah.\n2. 🧹 **Kerja Bakti Akbar** (19 Mei) — Revitalisasi gapura & bersih selokan. Konsumsi dari PKK.\n3. 📷 **CCTV Baru Blok D & E** (12 Mei) — 4 unit terpasang, terhubung ke monitoring admin RT.\n4. 🏪 **UMKM Digital Dibuka** (8 Mei) — Daftarkan usaha warga Anda, gratis dan mudah.\n5. 📋 **Penyesuaian Iuran Pembangunan** (5 Mei) — Komponen pembangunan naik Rp 5.000/bulan mulai Juni.\n\nBaca artikel lengkap di menu **Portal Berita**.";
        if (query.includes("donasi") || query.includes("bantuan") || query.includes("sosial") || query.includes("banjir") || query.includes("sedekah") || query.includes("zakat"))
          return "❤️ **Program Donasi & Bantuan Sosial RT 05**:\n\n**Donasi Aktif Saat Ini:**\n* 🌊 **Donasi Musibah Banjir Subang** — Terkumpul Rp 3.200.000 dari target Rp 5.000.000 *(64%)*. Ayo tambah donasi!\n* 🏠 **Pembangunan Pos Ronda Blok D** — Terkumpul Rp 1.500.000 dari target Rp 4.000.000 *(37%)*.\n\n**Cara Berdonasi:**\n1. Buka menu **Keuangan & Iuran** → tab **Donasi & Bantuan Sosial**.\n2. Pilih program, masukkan nama dan nominal Anda.\n3. Konfirmasi — bukti donasi tercatat otomatis.\n\n*Semua donasi disalurkan transparan dan dilaporkan di laporan keuangan RT.*";
        if (query.includes("darurat") || query.includes("bahaya") || query.includes("tolong") || query.includes("maling") || query.includes("pencuri") || query.includes("kebakaran") || query.includes("panic") || query.includes("sos"))
          return "🚨 **Panduan Tombol Darurat (Panic Button) SmartWarga**:\n\nUntuk situasi darurat nyata (pencurian, kebakaran, ancaman fisik):\n1. Buka menu **Darurat** di sidebar.\n2. **Tahan tombol PANIC selama 3 detik** penuh.\n3. Sistem otomatis:\n   - 📡 Sirine pos satpam RW 12 aktif\n   - 📱 Push notifikasi WhatsApp ke seluruh pengurus RT\n   - 📷 CCTV terdekat (CCTV-04 Blok B) aktif\n   - 📍 Lokasi GPS akurat Anda terkirim ke pengurus\n\n⚠️ *Hanya gunakan untuk situasi darurat nyata. Penyalahgunaan dikenai sanksi peraturan RT.*";
        if (query.includes("daftar") || query.includes("pendaftaran") || query.includes("warga baru") || query.includes("pindah") || query.includes("registrasi") || query.includes("ktp") || query.includes("kk") || query.includes("ocr"))
          return "📝 **Panduan Pendaftaran Warga Baru RT 05**:\n\n1. Klik **Daftar** di halaman utama SmartWarga.\n2. Pilih **Scan KTP / Kartu Keluarga** — AI OCR kami otomatis membaca NIK, nama, dan alamat.\n3. Periksa dan lengkapi data yang belum terisi.\n4. Submit → status menjadi **Menunggu Verifikasi Ketua RT** (1-2 hari kerja).\n\n**Syarat Warga Baru:**\n* KTP/KK dengan alamat RT 05 / RW 12\n* Jika pindahan luar kota, sertakan **Surat Keterangan Pindah** dari RT asal\n\n💡 Dokumen yang diunggah tersimpan aman di **Brankas Digital** SmartWarga.";
        if (query.includes("sampah") || query.includes("truk sampah") || query.includes("jadwal sampah") || query.includes("kebersihan lingkungan") || query.includes("petugas kebersihan"))
          return "🗑️ **Jadwal Kebersihan Lingkungan RT 05**:\n\n* 🚛 **Pengambilan Sampah Rumah Tangga**: Setiap **Senin & Kamis** pagi (06:00-08:00 WIB). Pastikan sampah sudah di depan pagar sebelum jam tersebut.\n* 🧹 **Kerja Bakti Rutin**: Setiap Minggu ke-3 per bulan. Jadwal terbaru lihat di Portal Berita.\n* 🦟 **Fogging DBD**: Insidental, sesuai koordinasi Puskesmas. Pengumuman via grup WhatsApp RT & Portal Berita.\n* 🌿 **Pemangkasan Taman Sosial**: Minggu ke-1 per bulan oleh petugas RT.\n\nBiaya petugas kebersihan dari iuran komponen Kebersihan (Rp 30.000/KK/bulan).";
        return null;
      };

      const demoReply = getDemoReply(queryLower);
      if (!process.env.GEMINI_API_KEY || demoReply !== null) {
        const reply = demoReply || "Halo! Saya adalah WargaAI, asisten pintar RT 05. Silakan tanyakan seputar:\n\n1. 📊 **Cek Saldo Kas RT** — transparansi keuangan\n2. 💳 **Iuran Bulanan** — nominal dan cara bayar\n3. 📄 **E-Surat** — cara pengajuan surat pengantar\n4. 🚨 **E-Reporting** — cara melapor masalah lingkungan\n5. 👥 **Profil Keluarga** — data KK Bpk. Rahardian\n6. 🧹 **Kerja Bakti** & jadwal gotong royong\n7. 🏪 **UMKM Warga** — direktori toko & usaha RT\n8. 📰 **Berita RT** — pengumuman & info terkini\n9. ❤️ **Donasi** — program bantuan sosial aktif\n10. 🚨 **Tombol Darurat** — panduan panic button\n11. 📝 **Warga Baru** — cara pendaftaran & OCR KTP\n12. 🗑️ **Jadwal Sampah** — jadwal kebersihan lingkungan\n\nKetik pertanyaan Anda!";
        return res.json({ text: reply, reply });
      }

      const dbContext = {
        news: newsData.map((n: any) => ({ title: n.title, category: n.category, summary: n.summary })),
        umkm: umkmData.map((u: any) => ({ name: u.name, owner: u.owner, category: u.category, desc: u.desc })),
        events: [
          { id: 1, title: "Kerja Bakti Bersih Selokan", date: "Minggu, 12 Nov 2026", location: "Sepanjang RT 05", participants: volunteersData.filter((v: any) => v.eventId === 1).length + 15 },
          { id: 2, title: "Persiapan Panggung 17-an", date: "Minggu, 14 Agu 2026", location: "Lapangan Serbaguna RW 12", participants: volunteersData.filter((v: any) => v.eventId === 2).length + 25 },
        ],
        volunteers: volunteersData,
        donations: donationsData.map((d: any) => ({ title: d.title, raised: d.raised, target: d.target })),
        activeLettersPending: letters.filter((l: any) => l.status === "pending").length,
        residentsCount: residentsData.length,
        iuranRules: "Iuran wajib bulanan warga RT 05 sebesar Rp 150.000 (Kebersihan Rp 30k, Keamanan Rp 50k, Kas Rp 20k, Arisan Rp 30k, Pembangunan Rp 20k). Batas jam malam kunjungan luar di RT adalah pukul 22:00 WIB. Pengambilan sampah dijadwalkan setiap hari Senin dan Kamis pagi.",
      };

      const systemInstruction = `Anda adalah 'WargaAI', asisten chatbot pintar warga RT 05 / RW 12 Kelurahan Sukamaju, Bandung.
Tugas Anda adalah mempermudah warga mendapatkan informasi secara cepat seputar administrasi, kas, pengumuman, donasi, umkm, gotong royong, dan panduan penggunaan web SmartWarga.

Berikut adalah DATA RILL LINGKUNGAN RT SAAT INI (bersumber dari database internal):
${JSON.stringify(dbContext)}

Aturan Komunikasi:
1. Jawablah warga dengan nada ramah, santun, hangat, dan profesional khas budaya bertetangga di Indonesia.
2. Selalu bersandar pada data rill di atas untuk menjawab informasi spesifik (seperti jumlah saldo donasi, acara kerja bakti, iuran, maupun toko warga).
3. Batasi jawaban Anda agar padat, fokus, dan informatif. Gunakan Bullet Points (*) jika memberikan daftar informasi agar mudah dibaca di mobile.`;

      const formattedContents = history.map((msg: any) => ({
        role: msg.role === "assistant" || msg.sender === "ai" ? "model" : "user",
        parts: [{ text: msg.text || msg.message }],
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: { systemInstruction, temperature: 0.7 },
      });

      const replyText = response.text || "Maaf, asisten pintar sedang sibuk. Silakan coba sesaat lagi.";
      res.json({ text: replyText, reply: replyText });
    } catch (error: any) {
      console.error("Chatbot API error:", error);
      const fallbackReply = "Maaf, sistem AI sedang mengalami penyesuaian. Silakan tanyakan hal-hal administratif seputar RT 05, iuran kas, status surat, profil keluarga Bpk. Rahardian, atau kegiatan kerja bakti.";
      res.json({ text: fallbackReply, reply: fallbackReply });
    }
  };

  app.post("/api/chatbot", handleChatbotRequest);
  app.post("/api/user/chatbot", handleChatbotRequest);

  // ── AI Image Analysis ─────────────────────────────────────────────────────────

  app.post("/api/user/reports/analyze-ai", async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) return res.status(400).json({ error: "Image is required" });
      const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
      if (!match) return res.status(400).json({ error: "Invalid image base64 format" });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          { inlineData: { mimeType: match[1], data: match[2] } },
          { text: `Analisis foto keluhan warga ini dengan seksama. Tentukan judul keluhan yang singkat, jelas, dan informatif (misal: 'Jalanan Berlubang', 'Sampah Menumpuk di Got', 'Lampu Jalan Padam'). Kategorikan keluhan tersebut ke dalam salah satu dari empat kategori berikut saja: 'Infrastruktur', 'Kebersihan', 'Keamanan', atau 'Lainnya'. Berikan deskripsi singkat hasil analisis gambar tersebut mengenai apa kerusakannya dan potensi dampaknya secara formal. Format output harus berupa JSON murni sesuai schema.` },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, category: { type: Type.STRING }, description: { type: Type.STRING } }, required: ["title", "category", "description"] },
        },
      });

      res.json(JSON.parse((response.text || "{}").trim()));
    } catch (error: any) {
      console.error("AI Report Analysis error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze image" });
    }
  });

  return app;
}
