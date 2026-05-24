import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Dummy Data
  let letters = [
    { id: "SRT-01", name: "Budi Santoso", type: "Surat Pengantar Domisili", date: "Hari ini, 09:30", status: "pending", keperluan: "Bank" },
    { id: "SRT-02", name: "Siti Aminah", type: "Surat Keterangan Tidak Mampu", date: "Hari ini, 08:15", status: "pending", keperluan: "Sekolah" },
    { id: "SRT-03", name: "Ahmad Dahlan", type: "Surat Keterangan Usaha", date: "Kemarin, 14:20", status: "approved", keperluan: "Pinjaman" },
    { id: "SRT-04", name: "Joko", type: "Surat Pengantar Domisili", date: "Hari ini, 10:00", status: "rejected", keperluan: "KTP Baru" }
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
    { name: "Development (Pembangunan)", amount: 20000, desc: "Dana tabungan berkala perbaikan aspal, gerbang baru, & drainase" }
  ];

  let residentsData = [
    {
      id: "RES-01",
      name: "Bpk. Rahardian",
      address: "Jl. Merdeka No. 45, RT 05 / RW 12",
      phone: "0812-3456-7890",
      dues: [
        { id: "DUE-01", month: "Oktober 2023", amount: 150000, status: "paid", date: "05 Okt 2023", categories: defaultCategories, proof: null },
        { id: "DUE-02", month: "November 2023", amount: 150000, status: "unpaid", date: "-", categories: defaultCategories, proof: null }
      ],
      reminders: [] as any[]
    },
    {
      id: "RES-02",
      name: "Bpk. Ahmad Dahlan",
      address: "Jl. Merdeka No. 12, RT 05 / RW 12",
      phone: "0813-9876-5432",
      dues: [
        { id: "DUE-A1", month: "Oktober 2023", amount: 150000, status: "paid", date: "03 Okt 2023", categories: defaultCategories, proof: null },
        { id: "DUE-A2", month: "November 2023", amount: 150000, status: "paid", date: "08 Nov 2023", categories: defaultCategories, proof: null }
      ],
      reminders: []
    },
    {
      id: "RES-03",
      name: "Ibu Rini Saputri",
      address: "Jl. Merdeka No. 05, RT 05 / RW 12",
      phone: "0812-2233-4455",
      dues: [
        { id: "DUE-R1", month: "Oktober 2023", amount: 150000, status: "paid", date: "06 Okt 2023", categories: defaultCategories, proof: null },
        { id: "DUE-R2", month: "November 2023", amount: 150000, status: "pending", date: "Hari ini", categories: defaultCategories, proof: {
          bank: "MANDIRI",
          sender: "Ibu Rini Saputri",
          amount: 150000,
          date: "24 Mei 2026",
          image: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=400"
        } }
      ],
      reminders: []
    },
    {
      id: "RES-04",
      name: "Ibu Siti Aminah",
      address: "Jl. Dahlia Raya No. 17, RT 05 / RW 12",
      phone: "0815-5566-7788",
      dues: [
        { id: "DUE-S1", month: "Oktober 2023", amount: 150000, status: "paid", date: "04 Okt 2023", categories: defaultCategories, proof: null },
        { id: "DUE-S2", month: "November 2023", amount: 150000, status: "unpaid", date: "-", categories: defaultCategories, proof: null }
      ],
      reminders: [
        { id: "REM-1", date: "24 Mei 2026", message: "Yth. Ibu Siti Aminah, tagihan iuran November belum terlunasi. Mohon segera melakukan transfer." }
      ]
    }
  ];

  let newsData = [
    {
      id: "NEWS-1",
      title: "Jadwal Fogging Lingkungan DBD Pekan Ini",
      category: "Kesehatan",
      date: "23 Mei 2026",
      summary: "Mengantisipasi peningkatan demam berdarah dengue (DBD) di pancaroba, RT akan melakukan penyemprotan asap fogging pelindung jentik nyamuk.",
      content: "Yth. Seluruh Warga RT 05. Kami menginfokan bahwa koordinasi dengan Puskesmas telah selesai. Penyemprotan Fogging Demam Berdarah akan diadakan pada hari Sabtu pagi mulai pukul 07:00 WIB hingga selesai. Mohon menutup makanan rapat-rapat dan menjaga anak kecil tetap di dalam rumah selama proses berlangsung.",
      image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: "NEWS-2",
      title: "Kerja Bakti Akbar & Revitalisasi Gapura",
      category: "Kegiatan Sosial",
      date: "19 Mei 2026",
      summary: "Bergabung bersama dalam memperindah gapura akses utama dan membersihkan saluran air penyumbat banjir.",
      content: "Gotong royong akan difokuskan pada pembersihan selokan utama jalan Merdeka guna menghindari genangan air, serta pengecatan ulang gapura penyambutan warga agar terlihat asri dan modern. Konsumsi disediakan oleh ibu-ibu PKK.",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400"
    }
  ];

  let umkmData = [
    {
      id: "UMKM-1",
      owner: "Ibu Rini Saputri",
      name: "Catering Rini Sedap",
      category: "Makanan & Minuman",
      phone: "0812-2233-4455",
      desc: "Menyediakan nasi kotak higienis, snack box, arisan, kue basah, dan catering bulanan warga. Rasa terjamin lezat dan halal.",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=300"
    },
    {
      id: "UMKM-2",
      owner: "Pak Joko",
      name: "Bengkel Motor Berkah",
      category: "Jasa",
      phone: "0816-1212-3434",
      desc: "Servis motor, ganti oli, ban bocor, tambal ban, kelistrikan roda dua. Diskon khusus warga RT sekitar 10%.",
      image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=300"
    }
  ];

  let adsData = [
    {
      id: "AD-1",
      sponsor: "IndiHome internet super",
      title: "Pasang WiFi Rumah Warga Pintar",
      desc: "Paket khusus warga SmartWarga! Nikmati kecepatan hingga 100Mbps hanya Rp 250rb/bulan dengan pendaftaran gratis secara eksklusif.",
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=500",
      cta: "Hubungi RT untuk Formulir"
    },
    {
      id: "AD-2",
      sponsor: "Air Minum Le Minerale",
      title: "Dukungan Sosial Galon Higienis",
      desc: "Setiap pembelian 2 galon isi ulang gratis 1 botol kecil. Toko Berkah Blok B2, melayani antar jemput bebas ongkir kawasan perumahan.",
      image: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&q=80&w=500",
      cta: "Hubungi Toko Berkah"
    }
  ];

  let reportsData = [
    { id: "REP-01", title: "Lampu Jalan Mati", location: "Blok C2 No. 12", date: "2 jam yang lalu", status: "PROSES", image: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&q=80&w=200", sender: "Bpk. Rahardian", isPublic: true },
    { id: "REP-02", title: "Sampah Belum Diambil", location: "Blok A1", date: "Kemarin", status: "SELESAI", image: null, sender: "Ibu Sari", isPublic: true },
    { id: "REP-03", title: "Parkir Liar", location: "Gerbang Utama", date: "2 hari yang lalu", status: "SELESAI", image: null, sender: "Budi Santoso", isPublic: false }
  ];

  let financeDetails = [
    { id: "EXP-01", category: "Kebersihan", amount: 450000, desc: "Honor Petugas Sampah", date: "25 Okt 2023", proof: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" },
    { id: "EXP-02", category: "Keamanan", amount: 1200000, desc: "Gaji Satpam Malam (2 org)", date: "28 Okt 2023", proof: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" },
    { id: "EXP-03", category: "Infrastruktur", amount: 850000, desc: "Perbaikan Lampu Jalan Blok D", date: "30 Okt 2023", proof: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" },
    { id: "EXP-04", category: "Acara Warga", amount: 1500000, desc: "Konsumsi Kerja Bakti Lingkungan", date: "20 Okt 2023", proof: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" }
  ];

  let financeSummary = [
    { name: "Kebersihan", value: 450000, color: "#1B332D" },
    { name: "Keamanan", value: 1200000, color: "#4a5d4a" },
    { name: "Infrastruktur", value: 850000, color: "#e2e8e2" },
    { name: "Acara Warga", value: 1500000, color: "#a2b897" },
    { name: "Admin RT", value: 300000, color: "#FF8A65" },
  ];

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // User Endpoints
  app.get("/api/user/letters", (req, res) => {
    res.json(letters);
  });

  app.post("/api/user/letters", (req, res) => {
    const { type, keperluan, signature } = req.body;
    const newLetter = {
      id: `SRT-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      name: "Budi Santoso",
      type: type || "Surat Pengantar Domisili",
      date: "Baru saja",
      status: "pending",
      keperluan: keperluan || "",
      wargaSignature: signature || null,
      adminSignature: null
    };
    letters = [newLetter, ...letters];
    res.json(newLetter);
  });

  app.get("/api/finance", (req, res) => {
    res.json({ summary: financeSummary, details: financeDetails, history: financeData });
  });

  // Get logged-in user's dues (Assumed to be resident RES-01 - Bpk. Rahardian)
  app.get("/api/user/dues", (req, res) => {
    res.json(residentsData[0].dues);
  });

  // Pay an individual dues item (submitting custom form proof)
  app.post("/api/user/dues/:id/pay", (req, res) => {
    const { id } = req.params;
    const { bank, sender, amount, date, image } = req.body;
    
    // Update resident DUE-02 or selected
    residentsData = residentsData.map(resObj => {
      const updatedDues = resObj.dues.map(d => {
        if (d.id === id) {
          return {
            ...d,
            status: "pending",
            date: "Hari ini",
            proof: {
              bank: bank || "TRANSFER MANUAL",
              sender: sender || resObj.name,
              amount: Number(amount) || d.amount,
              date: date || "Hari ini",
              image: image || "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=400"
            }
          };
        }
        return d;
      });
      return { ...resObj, dues: updatedDues };
    });
    
    res.json({ success: true });
  });

  app.get("/api/user/reports", (req, res) => {
    res.json(reportsData);
  });

  app.post("/api/user/reports", (req, res) => {
    const { title, location, image, isPublic, category } = req.body;
    const newReport = {
      id: `REP-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      title: title || "Laporan Baru",
      location: location || "Lokasi tidak diketahui",
      date: "Baru saja",
      status: "TERKIRIM",
      image: image || null,
      sender: "Budi Santoso",
      isPublic: isPublic ?? true,
      category: category || "Lainnya"
    };
    reportsData = [newReport, ...reportsData];
    res.json(newReport);
  });

  // News portal API
  app.get("/api/news", (req, res) => {
    res.json(newsData);
  });

  app.post("/api/news", (req, res) => {
    const { title, category, summary, content, image } = req.body;
    const newArticle = {
      id: `NEWS-${Date.now()}`,
      title,
      category: category || "Umum",
      date: "Hari ini",
      summary: summary || "",
      content: content || "",
      image: image || "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=400"
    };
    newsData = [newArticle, ...newsData];
    res.json({ success: true, article: newArticle });
  });

  // UMKM API
  app.get("/api/umkm", (req, res) => {
    res.json(umkmData);
  });

  app.post("/api/umkm", (req, res) => {
    const { owner, name, category, phone, desc, image } = req.body;
    const newListing = {
      id: `UMKM-${Date.now()}`,
      owner: owner || "Warga",
      name,
      category: category || "Lainnya",
      phone: phone || "",
      desc: desc || "",
      image: image || "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=300"
    };
    umkmData = [newListing, ...umkmData];
    res.json({ success: true, listing: newListing });
  });

  // Sponsor/Ads API
  app.get("/api/ads", (req, res) => {
    res.json(adsData);
  });

  app.post("/api/ads", (req, res) => {
    const { sponsor, title, desc, image, cta } = req.body;
    const newAd = {
      id: `AD-${Date.now()}`,
      sponsor,
      title,
      desc,
      image: image || "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=500",
      cta: cta || "Hubungi Kami"
    };
    adsData = [newAd, ...adsData];
    res.json({ success: true, ad: newAd });
  });

  // Admin Residents database management
  app.get("/api/admin/residents", (req, res) => {
    res.json(residentsData);
  });

  // Approve a pending due and move info of transaction to cash ledger
  app.put("/api/admin/residents/:residentId/due/:dueId/approve", (req, res) => {
    const { residentId, dueId } = req.params;
    
    residentsData = residentsData.map(resObj => {
      if (resObj.id === residentId) {
        const updatedDues = resObj.dues.map(d => {
          if (d.id === dueId) {
            // Append payment record into finance ledger details
            const ledgerId = `INC-${Date.now().toString().slice(-4)}`;
            financeDetails = [
              {
                id: ledgerId,
                category: "Pemasukan",
                amount: d.amount,
                desc: `Iuran ${d.month} - ${resObj.name}`,
                date: "Hari ini",
                proof: d.proof?.image || "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=400"
              },
              ...financeDetails
            ];
            
            // Also append into chart summary
            financeSummary[4].value += d.amount; // update "Admin RT" or relative cash
            
            return { ...d, status: "paid", date: "Hari ini" };
          }
          return d;
        });
        return { ...resObj, dues: updatedDues };
      }
      return resObj;
    });
    
    res.json({ success: true });
  });

  // Reject a dues proof
  app.put("/api/admin/residents/:residentId/due/:dueId/reject", (req, res) => {
    const { residentId, dueId } = req.params;
    
    residentsData = residentsData.map(resObj => {
      if (resObj.id === residentId) {
        const updatedDues = resObj.dues.map(d => {
          if (d.id === dueId) {
            return { ...d, status: "unpaid", proof: null };
          }
          return d;
        });
        return { ...resObj, dues: updatedDues };
      }
      return resObj;
    });
    
    res.json({ success: true });
  });

  // Send / save customized dues reminders
  app.post("/api/admin/residents/:residentId/reminder", (req, res) => {
    const { residentId } = req.params;
    const { message } = req.body;
    
    residentsData = residentsData.map(resObj => {
      if (resObj.id === residentId) {
        const newRem = {
          id: `REM-${Date.now()}`,
          date: "Hari ini",
          message: message || "Harap segera lunasi tunggakan iuran Bulanan Anda."
        };
        return {
          ...resObj,
          reminders: [newRem, ...resObj.reminders]
        };
      }
      return resObj;
    });
    
    res.json({ success: true });
  });

  // Admin Endpoints
  app.get("/api/admin/letters", (req, res) => {
    res.json(letters);
  });

  app.put("/api/admin/letters/:id/approve", (req, res) => {
    const { id } = req.params;
    const { signature } = req.body;
    letters = letters.map(l => l.id === id ? { ...l, status: "approved", adminSignature: signature } : l);
    res.json({ success: true });
  });

  app.put("/api/admin/letters/:id/reject", (req, res) => {
    const { id } = req.params;
    letters = letters.map(l => l.id === id ? { ...l, status: "rejected" } : l);
    res.json({ success: true });
  });

  app.post("/api/admin/finance", (req, res) => {
    const { type, amount, desc, image } = req.body;
    if (!image) return res.status(400).json({ error: "Proof image is mandatory" });
    
    const newTransaction = {
      id: `${type === 'in' ? 'INC' : 'EXP'}-${Math.floor(Math.random() * 1000)}`,
      category: type === 'in' ? "Pemasukan" : "Operasional",
      amount: Number(amount),
      desc,
      date: "Hari ini",
      proof: image
    };
    
    if (type === 'out') {
       financeDetails = [newTransaction, ...financeDetails];
       financeSummary[0].value += Number(amount);
    } else {
       financeDetails = [newTransaction, ...financeDetails];
       financeSummary[4].value += Number(amount);
    }
    
    res.json({ success: true, transaction: newTransaction });
  });

  app.post("/api/admin/validate-user", (req, res) => {
    res.json({ success: true, message: "User validated successfully." });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
