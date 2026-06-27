
# SmartWarga: Dokumentasi & Panduan Fitur Komprehensif

SmartWarga adalah platform digital terintegrasi yang dirancang khusus untuk memodernisasi tata kelola lingkungan di tingkat RT/RW. Aplikasi ini menghubungkan pengurus dan warga dalam satu ekosistem transparan, efisien, dan responsif. Berfokus pada kemudahan akses (mobile-first) dan keandalan data, SmartWarga mengubah administrasi tradisional yang lambat menjadi layanan digital instan.

---

## 🔄 Pembaruan Terbaru (Revamp)

Ringkasan perubahan besar pada iterasi terakhir:

- **Beranda Warga & Pengurus dirancang ulang** menjadi pusat aksi (banner tagihan dinamis, kartu "Perlu Tindakan", KPI, arus kas, dan pintasan cepat). Brankas Digital dipindah ke Profil.
- **Verifikasi Iuran Warga** dirombak: ringkasan statistik, **antrean verifikasi resi** prioritas, lightbox bukti transfer, serta pencarian/filter/sortir direktori warga.
- **Lapor Masalah (AI) diperbaiki total**: form tunggal yang ringkas, AI mengisi draf judul/deskripsi/kategori dari foto (bisa disunting, ditandai "Draf AI"), lokasi jujur (GPS + chip), dan **degradasi anggun** saat AI tak tersedia. Sisi pengurus: urgensi AI tampil di tiap baris + konfirmasi/override label.
- **Pemilihan RT direvamp (UI + sistem)**: memperbaiki bug satu-suara-untuk-semua, status partisipasi divalidasi server (tahan refresh), bar partisipasi/turnout langsung, dan rekap privat hingga ditutup.
- **Rencana backend** untuk migrasi dari data in-memory ke database persisten: lihat [`BACKEND_PLAN.md`](./BACKEND_PLAN.md).

---

## 🌟 Fitur Warga (User View)

### 1. Beranda Warga
Dashboard personal yang menonjolkan aksi dan status terkini.
- **Banner Tagihan Dinamis**: Status iuran bulan berjalan tampil otomatis dari data — *belum bayar* (tombol "Bayar Sekarang"), *menunggu verifikasi*, atau *lunas*.
- **Layanan Cepat**: 6 pintasan ikon (Ajukan Surat, Lapor Masalah, Bayar Iuran, Lacak Status, Pasar UMKM, Tombol Darurat).
- **Status Pengajuan Saya**: Ringkasan surat & laporan milik warga beserta status, langsung menuju Lacak Status.
- **Berita & Pengumuman**: 3 berita terbaru dengan thumbnail.
- **Banner Selamat Datang**: Tombol "Tonton Video Tutorial" dan "Buat Laporan".
- *Brankas Digital & OCR kini dipindahkan ke halaman **Profil Keluarga**.*

### 2. Surat Pengantar (E-Surat Digital)
Digitalisasi pengurusan surat pengantar yang biasanya memakan waktu berhari-hari menjadi hitungan menit.
- **Template Surat Lengkap**: Domisili, SKU, SKTM, Nikah (N1–N4), Pengantar SKCK, Izin Keramaian, dan lainnya.
- **Tanda Tangan Digital**: Warga menandatangani pengajuan langsung di canvas browser sebelum mengirim.
- **Preview PDF Real-Time**: Pratinjau dokumen langsung diperbarui saat warga mengisi formulir, menampilkan nama dari profil dan keperluan yang diketik.
- **Riwayat Pengajuan**: Tombol langsung yang menavigasi ke tab Lacak Status → sub-tab E-Surat Resmi.

### 3. Lapor Masalah (E-Reporting berbasis AI)
Form pelaporan tunggal yang ringkas — AI membantu menyusun draf, bukan menghambat.
- **Draf AI dari Foto**: Unggah foto, AI mengisi draf **Judul, Deskripsi, dan Kategori** (ditandai "✨ Draf AI" dan tetap bisa disunting). Satu state loading jujur — tanpa animasi "scanning" palsu berlama-lama.
- **Degradasi Anggun**: Tanpa API key / saat AI gagal, form otomatis beralih ke pengisian manual — tidak ada error atau judul generik.
- **Lokasi Jujur**: Input alamat + tombol **GPS** (geolocation asli) + chip lokasi cepat. Tidak ada lokasi acak yang dikarang AI.
- **Kategori & Publikasi**: Pilih kategori (saran AI tersorot) dan toggle publikasi ke feed warga.
- **Laporan Warga Lain**: Feed transparan laporan publik warga lain beserta statusnya.

### 4. Lacak Status
Pantau real-time seluruh pengajuan dalam satu halaman.
- **Dua Sub-tab**: Aduan Lingkungan dan E-Surat Resmi — navigasi otomatis dari tombol di halaman Surat Pengantar langsung membuka sub-tab E-Surat.
- **Timeline Progres**: Visualisasi alur status (Terkirim → Proses → Selesai) dengan estimasi waktu penyelesaian.

### 5. Keuangan & Iuran
Transparansi kas RT yang dapat diakses warga kapan saja.
- **Grafik Donat**: Visualisasi alokasi dana RT (Keamanan, Kebersihan, Sosial, dll.) dengan total di tengah.
- **Riwayat Iuran Pribadi**: Status lunas/tunggak per bulan beserta bukti pembayaran.
- **Pembayaran QRIS**: Simulasi pembayaran iuran digital dengan nominal dinamis.
- **Donasi Gotong Royong**: Fitur donasi sukarela untuk kegiatan lingkungan.

### 6. Portal Berita & Gotong Royong
Pusat informasi dan kegiatan komunitas RT.
- **Pengumuman RT**: Berita, agenda, dan pengumuman resmi dari pengurus.
- **Jadwal Gotong Royong**: Kalender kegiatan warga dengan RSVP dan reminder.

### 7. Pasar & UMKM
Direktori usaha lokal warga RT.
- **Listing Produk/Jasa**: Tampilan kartu UMKM dengan foto, deskripsi, dan tombol WhatsApp langsung.
- **Iklan Berbayar**: Sponsor lokal tampil sebagai karousel di sidebar.
- **Daftar UMKM Baru**: Warga dapat mendaftarkan usahanya langsung dari aplikasi.

### 8. Pemilihan RT
Proses pemilihan transparan — **satu warga, satu suara** (divalidasi server).
- **Hero Fase + Partisipasi**: Status fase (Nominasi/Voting/Selesai), batas masa jabatan, dan **bar partisipasi langsung** saat voting (suara masuk / total KK).
- **Status Partisipasi dari Server**: Sudah memilih/mendaftar dideteksi dari server lewat satu request — **tahan refresh**, tidak hilang saat halaman dimuat ulang.
- **Identitas dari Profil**: Nama calon diambil otomatis dari profil (tak perlu ketik ulang).
- **Fase Nominasi**: Lihat kandidat (avatar + visi misi), daftarkan diri; entri milik sendiri ditandai.
- **Fase Voting**: Kartu kandidat — pilih lalu konfirmasi; setelah memilih tampil "Anda memilih X".
- **Fase Selesai**: Pemenang + **hasil akhir dengan persentase perolehan suara** dan total partisipasi.

### 9. Profil Keluarga
Manajemen data kontak pribadi warga.
- **Data Terlindungi**: Nama, alamat, RT, dan RW bersifat read-only (diatur RT) — tidak bisa diubah sembarangan.
- **Kontak Editable**: Hanya nomor WhatsApp dan email yang bisa diperbarui mandiri.
- **Anggota Keluarga**: Tambah/hapus anggota keluarga dalam satu kartu keluarga.
- **Brankas Digital & Smart OCR**: Penyimpanan dokumen KTP/KK dengan ekstraksi data OCR (dipindahkan ke sini dari Beranda).

### 10. AI Chatbot Warga
Asisten virtual yang mengambang di pojok kanan bawah.
- **Database-Aware**: Terhubung ke data RT untuk menjawab pertanyaan soal saldo kas, status iuran, jadwal gotong royong, dan lainnya secara real-time.
- **Quick Prompts**: Tombol shortcut pertanyaan umum (Cek Saldo, Status Iuran, Jadwal RT, dll.).
- **Rich Text Formatting**: Jawaban AI dirender dengan bold, bullet list, dan paragraf terstruktur.

---

## 🛠️ Fitur Pengurus (Admin View)

### 1. Beranda Pengurus
Pusat komando yang menonjolkan apa yang butuh tindakan.
- **Perlu Tindakan Anda**: 4 kartu aksi dengan jumlah *live* (Surat Menunggu, Verifikasi Iuran, Pendaftaran Baru, Laporan Mendesak) — kartu tanpa antrean berubah jadi status "selesai".
- **KPI Lingkungan**: Kepala Keluarga, Iuran Terkumpul (+ % pelunasan), Laporan Aktif, Donasi Terkumpul.
- **Laporan Terbaru**: Daftar dengan indikator urgensi & tag "URGEN".
- **Arus Kas + Penggalangan Dana**: Mini-bar 6 bulan pemasukan/pengeluaran dan progress donasi aktif.
- **Aksi Cepat**: Pintasan Kelola Berita, Catat Kas, Kelola Laporan, Pemilihan RT.
- **Alert Pemilihan**: Banner status pemilihan aktif dengan tombol kelola langsung.

### 2. Administrasi Warga (3 Sub-tab)

#### Validasi Surat
- **Sorting Otomatis**: Surat pending selalu muncul di atas; yang sudah disetujui/ditolak tenggelam ke bawah.
- **Filter & Pencarian**: Filter status (Menunggu/Disetujui/Ditolak) dan pencarian nama berfungsi secara real-time.
- **Tombol Tunggal "Tinjau"**: Tidak ada tombol tolak di list — hanya "Tinjau" yang membuka modal review berisi detail surat, tanda tangan warga, canvas tanda tangan digital pengurus, serta tombol Tolak dan Setujui & Tanda Tangani.

#### Pendaftaran Warga
- **Antrian Self-Registration**: Daftar warga yang mendaftar mandiri via aplikasi (dengan OCR KTP) menunggu verifikasi ketua RT — tampil dengan NIK, nama, nomor HP, waktu pengiriman, dan preview kartu KTP simulasi.
- **Tinjau Inline**: Klik "Tinjau" membuka panel expand berisi data lengkap yang bisa diedit, preview KTP, serta tombol Tolak / Setujui & Tambahkan.
- **Pendaftaran Manual (Walk-in)**: Fitur scan KTP/KK untuk warga yang datang langsung ke kantor RT, dengan AI OCR yang sama.

#### Data Warga
- **Keamanan Digital Signature**: Akses terkunci dengan canvas tanda tangan pengurus — hanya bisa dibuka setelah pengurus membubuhkan tanda tangan digital.
- **Total Warga**: Jumlah warga terdaftar tampil di header saat akses dibuka.
- **Edit Panel Inline**: Klik "Edit" membuka panel expand berisi preview kartu KTP dan Kartu Keluarga, serta form editable untuk semua data warga (NIK, nama, HP, email, agama, status perkawinan, pekerjaan, alamat).

### 3. Kelola Laporan (Triage AI)
Manajemen pengaduan warga di mana AI berperan sebagai **mesin prioritas**, bukan label pasif.
- **Urgensi di Tiap Baris**: Skor urgensi AI tampil langsung pada setiap baris + tag "Prioritas" untuk urgensi ≥ 8; banner peringatan menampilkan jumlah laporan prioritas tinggi.
- **Panel Analisis AI**: Kategori, bar urgensi, kata kunci, dan status *Dikonfirmasi/Belum ditinjau* — dengan tombol **Konfirmasi Label** dan **Sesuaikan** (override kategori/urgensi/tag, human-in-the-loop).
- **Filter Ganda & Sorting**: Filter status + kategori; otomatis urut berdasarkan urgensi AI (tertinggi di atas).
- **Alur Kerja**: TERKIRIM → "Validasi" → PROSES → tulis balasan & "Kirim & Selesaikan" → SELESAI (arsip).
- **Foto Laporan**: Gambar lampiran warga tampil di kartu yang diperluas.

### 4. Kelola Berita
Publikasi pengumuman dan berita lingkungan RT.
- Buat, edit, dan hapus berita/pengumuman yang tampil di Portal Berita warga.

### 5. Kelola UMKM & Iklan
Manajemen direktori usaha dan slot iklan berbayar.
- Verifikasi listing UMKM baru dari warga.
- Kelola iklan sponsor yang tampil di sidebar carousel.

### 6. Kelola Kas & Iuran
Verifikasi iuran dirancang ulang agar tugas utama langsung di depan mata.
- **Ringkasan Statistik**: Perlu Verifikasi, Lunas Bulan Ini, Belum Bayar, dan Total Terkumpul.
- **Antrean Verifikasi Resi**: Semua bukti transfer *pending* dari seluruh KK tampil di atas sebagai kartu aksi — thumbnail resi + tombol **Setujui/Tolak inline**, tanpa perlu membuka tiap warga satu per satu.
- **Lightbox Bukti Transfer**: Klik resi untuk pratinjau besar di dalam aplikasi (tanpa buka tab baru), lengkap dengan detail transfer + tombol "Setujui & Rekam Buku Kas" / "Tolak".
- **Direktori Warga**: Pencarian + filter status (Perlu Verifikasi / Belum Bayar / Lunas), otomatis menaikkan yang butuh verifikasi ke atas; kartu *expand* berisi kontak, WhatsApp, pengingat, dan riwayat tagihan.
- **Kas & Pengeluaran**: Grafik donat alokasi dana + pencatatan transaksi manual dengan bukti foto.

### 7. Pemilihan RT (Kelola)
Panel manajemen pemilihan dari sisi pengurus.
- **Stepper Fase**: Visualisasi alur Persiapan → Nominasi → Voting → Selesai.
- **Statistik Partisipasi**: Saat voting tampil Suara Masuk, **% Partisipasi** (vs total KK), dan kandidat **Unggul Sementara**.
- **Rekap Langsung (privat)**: Perolehan suara hanya terlihat pengurus hingga ditutup — mencegah efek *bandwagon*.
- **Alur**: Setup masa jabatan → buka nominasi → mulai voting → "Tutup & Umumkan" (dengan konfirmasi) → reset siklus.

### 8. Profil Pengurus
Halaman profil khusus pengurus RT.
- **Data Terlindungi**: Nama, jabatan, RT/RW, dan periode bersifat read-only (diatur sistem).
- **Kontak Editable**: Nomor WhatsApp dan email dinas bisa diperbarui mandiri.
- **Info Card**: Ringkasan kontak yang ditampilkan ke warga sebagai informasi resmi RT.

### 9. AI Chatbot Pengurus
Versi admin dari asisten virtual dengan konteks pengurus.
- Prompt khusus admin: saldo kas, laporan aktif, surat pending, tunggakan iuran, statistik RT, info pemilihan, dan draft pengumuman.

---

## 🛠️ Teknologi & Framework (Tech Stack)

- **Frontend**: [React 19](https://react.dev/) — Library JavaScript untuk antarmuka pengguna.
- **Bundler**: [Vite](https://vitejs.dev/) — Build tool generasi berikutnya yang sangat cepat.
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/) — Keamanan tipe data untuk mengurangi bug.
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) — Utility-first CSS dengan design system custom via `@theme`.
- **Animasi**: [Motion (Framer Motion)](https://motion.dev/) — Transisi halus dan feedback visual.
- **Grafik**: [Recharts](https://recharts.org/) — Area chart, Bar chart, dan Donut/Pie chart.
- **PDF**: [jsPDF](https://github.com/parallax/jsPDF) + [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable) — Generasi PDF surat pengantar di sisi klien.
- **Ikonografi**: [Lucide React](https://lucide.dev/) — Set ikon vektor bersih dan konsisten.
- **Backend**: [Express](https://expressjs.com/) — Melayani aset statis dan REST API sederhana (data **in-memory**, reset saat restart). Rencana migrasi ke database persisten ada di [`BACKEND_PLAN.md`](./BACKEND_PLAN.md).
- **AI/OCR**: [Google Gemini AI (@google/genai)](https://ai.google.dev/) — OCR KTP/KK, analisis foto laporan, klasifikasi urgensi, dan chatbot via structured output. Seluruh fitur AI **degradasi anggun** (fallback) bila `GEMINI_API_KEY` tidak diisi.

---

## 🚀 Menjalankan di Lokal (Local Setup)

### Prasyarat
- **Node.js** v18 LTS atau lebih baru
- **NPM** (bawaan Node.js)

### Langkah Instalasi

```bash
# 1. Clone repositori
git clone <URL_REPOSITORI> smartwarga
cd smartwarga

# 2. Install dependensi
npm install

# 3. Konfigurasi environment
cp .env.example .env
# Edit .env dan isi GEMINI_API_KEY dari Google AI Studio

# 4. Jalankan dev server (Express + Vite HMR, port 3000)
npm run dev
```

Buka **`http://localhost:3000`** di browser.

### Akun Demo
- **Warga**: Login sebagai warga dari halaman landing.
- **Pengurus RT**: Login sebagai admin dari halaman landing (switch role di sidebar).

---

## 💾 Integrasi Database (Production)

Secara default, seluruh data tersimpan **in-memory** di `server.ts` — reset saat server restart. Untuk produksi:

### PostgreSQL / SQLite via Prisma ORM
```bash
npm install prisma @prisma/client
npx prisma init
# Definisikan schema, lalu:
npx prisma migrate dev --name init
```

### Firebase Firestore
```bash
npm install firebase-admin
# Inisialisasi Admin SDK dengan service account dari Google Cloud Console
```

---

## 🔒 Keamanan & Akses

- **Role-Based Access Control (RBAC)**: Pemisahan ketat antara warga (`user`) dan pengurus (`admin`) — tidak ada rute yang bisa diakses lintas peran.
- **Digital Signature Gate**: Akses Data Warga di sisi pengurus wajib melewati verifikasi tanda tangan digital canvas sebelum data sensitif tampil.
- **Read-Only Fields**: RT, RW, nama, dan alamat warga tidak bisa diubah sendiri — hanya pengurus yang berwenang mengubah via Data Warga.
- **Validasi Server-Side**: Semua input keuangan dan pengajuan surat divalidasi di sisi Express sebelum disimpan.

---

## 🎨 Desain & UX

- **Mobile-First**: Layout responsif yang dioptimalkan untuk smartphone karena mayoritas warga mengakses lewat HP.
- **Dark/Light Mode**: Dapat diubah via sidebar — menggunakan class `.light` pada `<html>` dengan CSS custom properties.
- **Design System**: Token warna semantik (`--color-canvas`, `--color-primary`, `--color-accent`, dll.) didefinisikan di `src/index.css` via `@theme`. Selalu gunakan `bg-canvas`, `text-primary`, dst. — bukan warna Tailwind mentah.
- **Tipografi**: Plus Jakarta Sans (display/heading) + Inter (body/UI).

---

*SmartWarga — Mewujudkan masa depan lingkungan yang lebih terorganisir, transparan, dan demokratis.*
