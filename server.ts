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

  let duesData = [
    { id: "DUE-01", month: "Oktober 2023", amount: 150000, status: "paid", date: "05 Okt 2023" },
    { id: "DUE-02", month: "November 2023", amount: 150000, status: "unpaid", date: "-" }
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

  app.get("/api/user/dues", (req, res) => {
    res.json(duesData);
  });

  app.post("/api/user/dues/:id/pay", (req, res) => {
    const { id } = req.params;
    duesData = duesData.map(d => d.id === id ? { ...d, status: "paid", date: "Hari ini" } : d);
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
       // Simply update first item in summary for demo
       financeSummary[0].value += Number(amount);
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
