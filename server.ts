import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Google GenAI with recommended telemetry headers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" })); // Support base64 image uploads for AI reporting

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
      image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "NEWS-2",
      title: "Kerja Bakti Akbar & Revitalisasi Gapura",
      category: "Gotong Royong",
      date: "19 Mei 2026",
      summary: "Bergabung bersama dalam memperindah gapura akses utama dan membersihkan saluran air penyumbat banjir.",
      content: "Gotong royong akan difokuskan pada pembersihan selokan utama jalan Merdeka guna menghindari genangan air, serta pengecatan ulang gapura penyambutan warga agar terlihat asri dan modern. Konsumsi disediakan oleh ibu-ibu PKK.",
      image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=600"
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
      image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=400"
    }
  ];

  let adsData = [
    {
      id: "AD-1",
      sponsor: "Minecraft Official",
      title: "Minecraft Realms RT 04",
      desc: "Dapatkan diskon berlangganan Minecraft Realms khusus untuk warga RT yang suka main bareng.",
      image: "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&q=80&w=500",
      cta: "Main Sekarang",
      link: "https://www.minecraft.net"
    },
    {
      id: "AD-2",
      sponsor: "DC Comics",
      title: "Streaming DC Universe",
      desc: "Nobar akhir pekan makin seru bareng warga dengan langganan VIP film-film dari DC Universe.",
      image: "https://images.unsplash.com/photo-1611604548018-d56bbd85d681?auto=format&fit=crop&q=80&w=500",
      cta: "Berlangganan",
      link: "https://www.dc.com"
    }
  ];

  let reportsData = [
    { id: "REP-01", title: "Lampu Jalan Mati", location: "Blok C2 No. 12", date: "2 jam yang lalu", status: "PROSES", image: "https://images.unsplash.com/photo-1509021436665-8f37df706533?auto=format&fit=crop&q=80&w=400", sender: "Bpk. Rahardian", isPublic: true },
    { id: "REP-02", title: "Sampah Belum Diambil", location: "Blok A1", date: "Kemarin", status: "SELESAI", image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400", sender: "Ibu Sari", isPublic: true },
    { id: "REP-03", title: "Parkir Liar", location: "Gerbang Utama", date: "2 hari yang lalu", status: "SELESAI", image: "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&q=80&w=400", sender: "Bpk. Rahardian", isPublic: false }
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
    const { type, keperluan, signature, name } = req.body;
    const newLetter = {
      id: `SRT-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      name: name || "Bpk. Rahardian",
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
    const { sponsor, title, desc, image, cta, link } = req.body;
    const newAd = {
      id: `AD-${Date.now()}`,
      sponsor,
      title,
      desc,
      image: image || "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=500",
      cta: cta || "Hubungi Kami",
      link: link || "#"
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

  // Volunteers Database and Endpoints
  let volunteersData = [
    { id: "VOL-01", eventId: 1, name: "Ibu Siti (Istri)", relation: "Istri", registeredAt: "24 Mei 2026" },
    { id: "VOL-02", eventId: 1, name: "Agus (Anak)", relation: "Anak", registeredAt: "24 Mei 2026" },
    { id: "VOL-03", eventId: 2, name: "Bpk. Rahardian", relation: "Kepala Keluarga", registeredAt: "23 Mei 2026" }
  ];

  app.get("/api/volunteers", (req, res) => {
    res.json(volunteersData);
  });

  app.post("/api/volunteers", (req, res) => {
    const { eventId, name, relation } = req.body;
    const newVolunteer = {
      id: `VOL-${Date.now()}`,
      eventId: Number(eventId),
      name,
      relation: relation || "Keluarga",
      registeredAt: "Hari ini"
    };
    volunteersData = [newVolunteer, ...volunteersData];
    res.json(newVolunteer);
  });

  // Social Donations Database and Endpoints
  let donationsData = [
    {
      id: "DON-01",
      title: "Donasi Musibah Banjir Subang",
      desc: "Mari ringankan beban saudara kita di Subang yang terdampak banjir bandang. Bantuan berupa uang, sembako, pakaian layak pakai akan disalurkan langsung.",
      target: 5000000,
      raised: 3200000,
      image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=400",
      donors: [
        { name: "Bpk. Rahardian", amount: 100000, date: "Hari ini" },
        { name: "Ibu Rini Saputri", amount: 200000, date: "Kemarin" },
        { name: "Bpk. Ahmad Dahlan", amount: 150000, date: "2 hari yang lalu" }
      ]
    },
    {
      id: "DON-02",
      title: "Pembangunan Pos Ronda Blok D",
      desc: "Menambah satu pos ronda baru untuk meningkatkan jangkauan patroli malam satpam RT 05. Estimasi kebutuhan biaya semen, kayu, atap, dan cat.",
      target: 4000000,
      raised: 1500000,
      image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=400",
      donors: [
        { name: "Ibu Siti Aminah", amount: 500000, date: "3 hari yang lalu" },
        { name: "Budi Santoso", amount: 200000, date: "4 hari yang lalu" }
      ]
    }
  ];

  app.get("/api/donations", (req, res) => {
    res.json(donationsData);
  });

  app.post("/api/donations/:id/pay", (req, res) => {
    const { id } = req.params;
    const { donorName, amount } = req.body;
    const donorAmount = Number(amount);

    donationsData = donationsData.map(don => {
      if (don.id === id) {
        return {
          ...don,
          raised: don.raised + donorAmount,
          donors: [
            { name: donorName || "Warga Anonim", amount: donorAmount, date: "Hari ini" },
            ...don.donors
          ]
        };
      }
      return don;
    });

    // Automatically trigger notification about donation success
    const targetDon = donationsData.find(d => d.id === id);
    notificationsData = [
      {
        id: `NOT-${Date.now()}`,
        title: "Donasi Diterima",
        message: `Terima kasih, donasi Rp ${donorAmount.toLocaleString('id-ID')} untuk '${targetDon?.title || 'Kegiatan Sosial'}' berhasil dikonfirmasi!`,
        category: "donation",
        date: "Baru saja",
        isRead: false
      },
      ...notificationsData
    ];

    res.json({ success: true, donations: donationsData });
  });

  // Notifications Database and Endpoints
  let notificationsData = [
    { id: "NOT-01", title: "Tagihan Iuran November", message: "Tagihan iuran bulanan November 2023 sebesar Rp 150.000 belum lunas. Segera lakukan pembayaran.", category: "finance", date: "Baru saja", isRead: false },
    { id: "NOT-02", title: "Gotong Royong Akhir Pekan", message: "Kerja bakti akbar bersih selokan akan diadakan Minggu ini. Daftarkan relawan keluarga Anda sekarang!", category: "event", date: "2 jam yang lalu", isRead: false },
    { id: "NOT-03", title: "Administrasi Surat Jadi", message: "Surat Keterangan Usaha (#SRT-03) Anda telah disetujui Ketua RT. Silakan unduh PDF di menu E-Surat.", category: "letter", date: "Kemarin", isRead: false }
  ];

  app.get("/api/notifications", (req, res) => {
    res.json(notificationsData);
  });

  app.post("/api/notifications", (req, res) => {
    const { title, message, category } = req.body;
    const newNotif = {
      id: `NOT-${Date.now()}`,
      title: title || "Pemberitahuan",
      message: message || "",
      category: category || "general",
      date: "Baru saja",
      isRead: false
    };
    notificationsData = [newNotif, ...notificationsData];
    res.json(newNotif);
  });

  app.post("/api/notifications/clear", (req, res) => {
    notificationsData = notificationsData.map(n => ({ ...n, isRead: true }));
    res.json({ success: true });
  });

  // AI Chatbot with Neighborhood Context Database Reading & Demo Fallback Mode
  const handleChatbotRequest = async (req: express.Request, res: express.Response) => {
    try {
      // Handle both message and messages structures
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
      
      // Highly contextual template answers for Demo/Fallback or when GEMINI_API_KEY is missing
      const getDemoReply = (query: string): string | null => {
        if (query.includes("saldo") || query.includes("uang kas") || query.includes("keuangan")) {
          return "📊 **Status Keuangan Kas RT 05 saat ini sangat sehat!**\n\n* **Total Saldo Aktif**: Rp 4.340.000\n* **Rincian Pengeluaran Bulan Ini**:\n  - 🧹 Kebersihan: Rp 450.000 (Honor Petugas Sampah)\n  - 🛡️ Keamanan: Rp 1.200.000 (Gaji Satpam Malam)\n  - 🏗️ Infrastruktur: Rp 850.000 (Perbaikan Lampu Jalan Blok D)\n  - 👥 Acara Warga: Rp 1.500.000 (Konsumsi Kerja Bakti Lingkungan)\n\nSemua bukti kwitansi transaksi tercatat transparan dan dapat Anda lihat langsung di menu **Iuran & Kas**.";
        }
        if (query.includes("iuran") || query.includes("bayar") || query.includes("tagihan")) {
          return "💳 **Aturan & Nominal Iuran Bulanan Warga RT 05**:\n\nSetiap Kepala Keluarga (KK) wajib membayar iuran bulanan sebesar **Rp 150.000**, dengan alokasi:\n* 🧹 Kebersihan Lingkungan: Rp 30.000\n* 🛡️ Keamanan & Satpam: Rp 50.000\n* 📁 Kas Sosial RT: Rp 20.000\n* 🌸 Kas Arisan Ibu-ibu PKK: Rp 30.000\n* 🏗️ Tabungan Pembangunan Fisik: Rp 20.000\n\nPembayaran dapat dilakukan secara aman dan praktis melalui menu **Iuran & Kas** menggunakan Transfer VA Bank atau QRIS.";
        }
        if (query.includes("surat") || query.includes("pengantar") || query.includes("domisili") || query.includes("nik") || query.includes("keterangan")) {
          return "📄 **Panduan Pembuatan E-Surat Resmi RT 05**:\n\nAnda dapat mengurus surat pengantar tanpa harus bertatap muka langsung:\n1. Buka tab **E-Surat** di sidebar kiri.\n2. Klik tombol **Buat Surat Pengantar**.\n3. Pilih tipe surat (Domisili, Surat Keterangan Usaha, atau Surat Keterangan Tidak Mampu).\n4. Isi keperluan, bubuhkan tanda tangan digital Anda, lalu kirim.\n5. Ketua RT akan memproses secara real-time. Setelah disetujui, surat akan diterbitkan otomatis lengkap dengan **QR Code Sah** yang bisa Anda unduh langsung sebagai PDF!";
        }
        if (query.includes("lapor") || query.includes("aduan") || query.includes("jalan") || query.includes("lampu") || query.includes("sampah") || query.includes("parkir") || query.includes("e-reporting") || query.includes("ereporting")) {
          return "🚨 **Panduan Sistem E-Reporting (Aduan Warga)**:\n\nJika melihat kerusakan fasilitas umum, silakan melapor lewat menu **E-Reporting**:\n1. Buka menu **E-Reporting**.\n2. Unggah foto keluhan (misal: jalan berlubang, lampu padam, atau tumpukan sampah).\n3. **AI Vision** kami akan otomatis menganalisis foto, menentukan judul, kategori, dan mencocokkan titik koordinat lokasi.\n4. Pilih status laporan: **Publik** (bisa dibaca warga lain) atau **Rahasia** (hanya dibaca Pengurus RT).\n5. Kirim laporan dan pantau progresnya secara langsung di tab **Lacak Status**.";
        }
        if (query.includes("profil") || query.includes("keluarga") || query.includes("rahardian") || query.includes("budi") || query.includes("istri") || query.includes("anak")) {
          return "👥 **Data Profil Keluarga Anda (Database RT 05)**:\n\n* **Kepala Keluarga**: Bpk. Rahardian\n* **Alamat Terdaftar**: Jl. Merdeka No. 45, RT 05 / RW 12\n* **No. Telepon**: 0812-3456-7890\n* **Anggota Keluarga Tercatat**:\n  - Ibu Siti (Istri)\n  - Agus (Anak)\n  - Rani (Anak)\n\n*Catatan*: Sinkronisasi data keluarga terpusat secara resmi dengan kependudukan. Untuk penambahan/perubahan anggota keluarga, silakan bawa berkas Kartu Keluarga fisik ke Ketua RT.";
        }
        if (query.includes("kerja bakti") || query.includes("gotong royong") || query.includes("agenda") || query.includes("kegiatan") || query.includes("gapura")) {
          return "🧹 **Agenda Gotong Royong RT 05 Terdekat**:\n\n* **Nama Kegiatan**: Kerja Bakti Akbar & Revitalisasi Gapura\n* **Waktu**: Minggu ini, Pukul 07:00 WIB s/d selesai\n* **Lokasi**: Area Pintu Masuk Gapura RT 05\n* **Fokus Kerja**: Pembersihan saluran air dari sumbatan sampah, pengecatan ulang gapura utama, dan merapikan taman sosial.\n\n*Ayo bergabung!* Silakan daftarkan anggota keluarga Anda sebagai relawan melalui menu **Portal Berita & Gotong Royong**.";
        }
        return null;
      };

      // Check if we should use demo fallback (either requested, or API key is not present)
      const demoReply = getDemoReply(queryLower);
      if (!process.env.GEMINI_API_KEY || demoReply !== null) {
        // If there is a direct keyword match, prioritize the clean demo reply!
        const reply = demoReply || "Halo! Saya adalah WargaAI, asisten pintar RT 05. Untuk kemudahan demo, silakan coba tanyakan seputar topik berikut:\n\n1. 📊 **Cek Saldo Kas RT** / Keuangan\n2. 📄 Info Cara Mengajukan **E-Surat**\n3. 🚨 Cara Membuat Laporan **E-Reporting**\n4. 👥 **Profil Keluarga** Bpk. Rahardian\n5. 🧹 Jadwal **Kerja Bakti** & Gotong Royong\n6. 💳 Aturan dan Nominal **Iuran Bulanan**\n\nSilakan ketik pertanyaan Anda seputar topik di atas!";
        return res.json({ text: reply, reply: reply });
      }

      // Compile current contextual DB state
      const dbContext = {
        news: newsData.map(n => ({ title: n.title, category: n.category, summary: n.summary })),
        umkm: umkmData.map(u => ({ name: u.name, owner: u.owner, category: u.category, desc: u.desc })),
        events: [
          { id: 1, title: "Kerja Bakti Bersih Selokan", date: "Minggu, 12 Nov 2026", location: "Sepanjang RT 05", participants: volunteersData.filter(v => v.eventId === 1).length + 15 },
          { id: 2, title: "Persiapan Panggung 17-an", date: "Minggu, 14 Agu 2026", location: "Lapangan Serbaguna RW 12", participants: volunteersData.filter(v => v.eventId === 2).length + 25 },
        ],
        volunteers: volunteersData,
        donations: donationsData.map(d => ({ title: d.title, raised: d.raised, target: d.target })),
        activeLettersPending: letters.filter(l => l.status === "pending").length,
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

      const formattedContents = history.map(msg => ({
        role: msg.role === "assistant" || msg.sender === "ai" ? "model" : "user",
        parts: [{ text: msg.text || msg.message }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const replyText = response.text || "Maaf, asisten pintar sedang sibuk. Silakan coba sesaat lagi.";
      res.json({ text: replyText, reply: replyText });
    } catch (error: any) {
      console.error("Chatbot API error:", error);
      // Fallback response instead of failing
      const fallbackReply = "Maaf, sistem AI sedang mengalami penyesuaian. Silakan tanyakan hal-hal administratif seputar RT 05, iuran kas, status surat, profil keluarga Bpk. Rahardian, atau kegiatan kerja bakti.";
      res.json({ text: fallbackReply, reply: fallbackReply });
    }
  };

  app.post("/api/chatbot", handleChatbotRequest);
  app.post("/api/user/chatbot", handleChatbotRequest);

  // AI Automatic Image Reporting Analysis
  app.post("/api/user/reports/analyze-ai", async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({ error: "Image is required" });
      }

      const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
      if (!match) {
        return res.status(400).json({ error: "Invalid image base64 format" });
      }
      const mimeType = match[1];
      const base64Data = match[2];

      const imagePart = {
        inlineData: {
          mimeType,
          data: base64Data,
        }
      };

      const promptPart = {
        text: `Analisis foto keluhan warga ini dengan seksama. 
Tentukan judul keluhan yang singkat, jelas, dan informatif (misal: 'Jalanan Berlubang', 'Sampah Menumpuk di Got', 'Lampu Jalan Padam').
Kategorikan keluhan tersebut ke dalam salah satu dari empat kategori berikut saja: 'Infrastruktur', 'Kebersihan', 'Keamanan', atau 'Lainnya'.
Berikan deskripsi singkat hasil analisis gambar tersebut mengenai apa kerusakannya dan potensi dampaknya secara formal.
Format output harus berupa JSON murni sesuai schema.`
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [imagePart, promptPart],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["title", "category", "description"]
          }
        }
      });

      const jsonStr = response.text || "{}";
      res.json(JSON.parse(jsonStr.trim()));
    } catch (error: any) {
      console.error("AI Report Analysis error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze image" });
    }
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
