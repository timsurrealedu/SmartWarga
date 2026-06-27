
# SmartWarga: Dokumentasi & Panduan Fitur Komprehensif

SmartWarga adalah platform digital terintegrasi yang dirancang khusus untuk memodernisasi tata kelola lingkungan di tingkat RT/RW. Aplikasi ini menghubungkan pengurus dan warga dalam satu ekosistem transparan, efisien, dan responsif. Berfokus pada kemudahan akses (mobile-first) dan keandalan data, SmartWarga mengubah administrasi tradisional yang lambat menjadi layanan digital instan.

---

## 🌟 Fitur Warga (User View)

### 1. Beranda Warga
Dashboard utama yang menyajikan ringkasan kondisi terkini secara personal.
- **Widget Statistik Interaktif**: Tiga kartu klik — Surat Pengantar (jumlah menunggu persetujuan), Berita RT (redirect ke portal berita), dan Status Iuran (redirect ke halaman keuangan).
- **Banner Selamat Datang**: Tombol cepat "Tonton Video Tutorial" dan "Buat Laporan" untuk aksi paling umum.
- **Penyimpanan Dokumen Digital**: Akses cepat ke brankas KTP/KK digital.

### 2. Surat Pengantar (E-Surat Digital)
Digitalisasi pengurusan surat pengantar yang biasanya memakan waktu berhari-hari menjadi hitungan menit.
- **Template Surat Lengkap**: Domisili, SKU, SKTM, Nikah (N1–N4), Pengantar SKCK, Izin Keramaian, dan lainnya.
- **Tanda Tangan Digital**: Warga menandatangani pengajuan langsung di canvas browser sebelum mengirim.
- **Preview PDF Real-Time**: Pratinjau dokumen langsung diperbarui saat warga mengisi formulir, menampilkan nama dari profil dan keperluan yang diketik.
- **Riwayat Pengajuan**: Tombol langsung yang menavigasi ke tab Lacak Status → sub-tab E-Surat Resmi.

### 3. Lapor Masalah (E-Reporting)
Sistem pelaporan lingkungan berbasis AI untuk warga.
- **Kategorisasi**: Infrastruktur, Kebersihan, Keamanan, Sosial, dan Lainnya.
- **AI Photo Analysis**: Unggah foto masalah, AI menganalisis jenis kerusakan, urgensi, dan lokasi secara otomatis.
- **Stepper Interaktif**: Proses pelaporan 5 langkah dengan visualisasi analisis AI secara dramatis.
- **Laporan Publik & Pribadi**: Pantau laporan sendiri atau lihat transparansi laporan warga lain.

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

### 8. Pemilihan RT/RW
Tab khusus untuk proses pemilihan ketua RT secara demokratis.
- **Fase Nominasi** (aktif): Warga dapat melihat kandidat yang sudah mendaftar beserta foto avatar dan visi misi, serta mendaftarkan diri sebagai calon.
- **Fase Pemungutan Suara** (aktif): Kartu kandidat dengan foto, nama, dan visi misi — klik untuk memilih, konfirmasi dengan satu tombol. Form pendaftaran di-grey-out otomatis saat fase ini.
- **Fase Selesai**: Banner pemenang dengan nama ketua RT terpilih.
- **Fase Tidak Aktif**: Placeholder informatif, semua elemen interaksi di-grey-out.

### 9. Profil Keluarga
Manajemen data kontak pribadi warga.
- **Data Terlindungi**: Nama, alamat, RT, dan RW bersifat read-only (diatur RT) — tidak bisa diubah sembarangan.
- **Kontak Editable**: Hanya nomor WhatsApp dan email yang bisa diperbarui mandiri.
- **Anggota Keluarga**: Tambah/hapus anggota keluarga dalam satu kartu keluarga.

### 10. AI Chatbot Warga
Asisten virtual yang mengambang di pojok kanan bawah.
- **Database-Aware**: Terhubung ke data RT untuk menjawab pertanyaan soal saldo kas, status iuran, jadwal gotong royong, dan lainnya secara real-time.
- **Quick Prompts**: Tombol shortcut pertanyaan umum (Cek Saldo, Status Iuran, Jadwal RT, dll.).
- **Rich Text Formatting**: Jawaban AI dirender dengan bold, bullet list, dan paragraf terstruktur.

---

## 🛠️ Fitur Pengurus (Admin View)

### 1. Beranda Pengurus
Pusat kendali ringkas untuk pengurus RT.
- **3 Metrik Aksi**: Surat Menunggu (redirect ke Validasi Surat), Laporan Aktif (redirect ke Kelola Laporan), Pendaftaran Baru (redirect ke Pendaftaran Warga) — semua langsung ke sub-tab yang tepat.
- **Alert Pemilihan**: Banner status pemilihan aktif dengan tombol kelola langsung.
- **Laporan Terbaru**: 4 laporan warga paling baru dengan indikator urgensi warna-warni.
- **Klik Avatar Profil**: Klik nama/foto di pojok kanan atas header langsung redirect ke halaman Profil Pengurus.

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

### 3. Kelola Laporan
Manajemen pengaduan warga dengan triage berbasis AI.
- **Filter Ganda**: Filter status (TERKIRIM / PROSES / SELESAI) dan filter kategori (Infrastruktur, Kebersihan, Keamanan, Sosial, Lainnya) berjalan bersamaan.
- **Sorting Cerdas**: Laporan TERKIRIM dan PROSES selalu di atas, SELESAI di bawah; dalam tiap grup diurutkan berdasarkan skor urgensi AI dari tinggi ke rendah.
- **Alur Kerja Bertahap**:
  - **TERKIRIM**: Pengurus melihat foto warga, deskripsi, label AI, lalu klik "Validasi" → status berubah ke PROSES.
  - **PROSES**: Pengurus menulis balasan, klik "Kirim & Selesaikan" → status berubah ke SELESAI.
  - **SELESAI**: Hanya tampil sebagai arsip read-only.
- **Foto Laporan Warga**: Gambar yang dilampirkan warga ditampilkan langsung di kartu laporan yang diperluas.

### 4. Kelola Berita
Publikasi pengumuman dan berita lingkungan RT.
- Buat, edit, dan hapus berita/pengumuman yang tampil di Portal Berita warga.

### 5. Kelola UMKM & Iklan
Manajemen direktori usaha dan slot iklan berbayar.
- Verifikasi listing UMKM baru dari warga.
- Kelola iklan sponsor yang tampil di sidebar carousel.

### 6. Kelola Kas & Iuran
Manajemen keuangan RT yang transparan.
- **Grafik Donat**: Visualisasi penggunaan dana yang sama seperti yang dilihat warga.
- **Tambah Transaksi Manual**: Input pemasukan/pengeluaran dengan bukti foto kwitansi.
- **Manajemen Iuran Warga**: Tandai status lunas/tunggak per warga per bulan, kirim reminder.

### 7. Pemilihan RT (Kelola)
Panel manajemen pemilihan dari sisi pengurus.
- **Setup Periode**: Atur masa jabatan pengurus saat ini dan buka fase nominasi.
- **Mulai Voting**: Transisi fase dari nominasi ke pemungutan suara.
- **Hitung Suara & Umumkan**: Tally otomatis, tampilkan pemenang ke seluruh warga.
- **Reset**: Mulai ulang seluruh siklus pemilihan.

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
- **Backend**: [Express](https://expressjs.com/) — Melayani aset statis dan REST API sederhana (in-memory).
- **AI/OCR**: [Google Gemini AI (@google/genai)](https://ai.google.dev/) — Ekstraksi data KTP/KK otomatis via structured output.

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
