
# SmartWarga: Dokumentasi & Panduan Fitur Komprehensif

SmartWarga adalah platform digital terintegrasi yang dirancang khusus untuk memodernisasi tata kelola lingkungan di tingkat RT/RW. Aplikasi ini menghubungkan pengurus dan warga dalam satu ekosistem transparan, efisien, dan responsif. Berfokus pada kemudahan akses (mobile-first) dan keandalan data, SmartWarga mengubah administrasi tradisional yang lambat menjadi layanan digital instan.

---

## 🌟 Detail Fitur Unggulan

### 1. Landing Page Modern & Informatif
Halaman awal yang dirancang dengan estetika bento-grid untuk memberikan kesan profesional dan terpercaya sejak pertama kali diakses.
-   **Value Proposition**: Menampilkan manfaat utama digitalisasi bagi lingkungan secara visual.
-   **Statistik Real-time**: Widget yang menunjukkan kecepatan layanan (misal: "10 menit untuk pengurusan surat").
-   **Akses Cepat**: Tombol navigasi yang membedakan alur pendaftaran warga baru dan login admin pengurus.

### 2. Smart Registration dengan Teknologi OCR
Mengurangi human error dan mempercepat proses pendaftaran warga melalui otomatisasi.
-   **Ekstraksi Data Otomatis**: Warga hanya perlu mengunggah foto KTP atau KK. Sistem akan memindai teks dan mengisi formulir (Nama, NIK, Alamat) secara otomatis.
-   **Verifikasi NIK**: Validasi format NIK 16 digit untuk memastikan keaslian data kependudukan.
-   **Status Menunggu**: Sistem secara otomatis menempatkan pendaftar baru dalam daftar tunggu untuk diverifikasi oleh Ketua RT.

### 3. E-Reporting & Tiketing Lingkungan (Pengaduan Warga) Berbasis AI
Solusi digital interaktif untuk mengirim pengaduan lingkungan yang didukung asisten kecerdasan buatan.
-   **Kategorisasi Laporan**: Pilihan kategori seperti Infrastruktur (lampu jalan, lubang), Kebersihan (sampah menumpuk), dan Keamanan (parkir liar).
-   **Alur Privasi Ganda**:
    -   **Laporan Saya**: Ruang bagi warga untuk membuat laporan baru dan memantau progresnya secara eksklusif.
    -   **Laporan Publik**: Daftar laporan yang telah dipublikasikan agar warga lain tidak melaporkan masalah yang sama dan dapat memantau transparansi penanganan masalah lingkungan.
-   **AI Photo Analysis**: Warga dapat mengunggah foto permasalahan, lalu sistem AI akan melakukan analisis foto secara cerdas untuk memindai jenis kerusakan, memperkirakan lokasi koordinat, mengidentifikasi tingkat urgensi, serta merumuskan deskripsi laporan otomatis.
-   **Interactive Multi-Step Stepper**: Proses pelaporan dipandu dengan stepper interaktif 5-langkah yang memvisualisasikan progress analisis gambar, penentuan kategori, konfirmasi lokasi, hingga sinkronisasi data ke server RT secara dramatis dan interaktif.
-   **Tracking Status**: Perubahan status laporan secara real-time (Pending → Diproses → Selesai) yang diupdate oleh admin.

### 4. Sistem Layanan E-Surat Digital
Digitalisasi pengurusan surat pengantar yang biasanya memakan waktu berhari-hari menjadi hitungan menit.
-   **Menu Template Sesuai Kebutuhan**: Pilihan jenis surat mulai dari Domisili, SKU (Surat Keterangan Usaha), SKTM (Surat Keterangan Tidak Mampu), hingga Akta Kelahiran/Kematian.
-   **PDF Auto-Generation**: Setelah admin memberikan persetujuan, sistem secara otomatis menghasilkan file PDF resmi dengan tata letak surat standar pemerintahan.
-   **Keamanan QR Code**: Setiap surat yang terbit dilengkapi dengan kode unik untuk verifikasi keaslian tanpa perlu tanda tangan basah yang repetitif.

### 5. Transparansi Kas RT & Keuangan Terintegrasi
Membasmi ketidakpercayaan warga dengan pelaporan keuangan yang jujur dan dapat diverifikasi.
-   **Dashboard Visual Keuangan**: Grafik batang dan donat yang membedakan alokasi iuran (Keamanan, Kebersihan, Sosial).
-   **Audit Digital**: Setiap transaksi pengeluaran wajib disertai unggahan foto bukti kwitansi atau nota belanja.
-   **Laporan Bulanan Instan**: Warga dapat melihat ringkasan pemasukan total, pengeluaran total, dan saldo kas terakhir kapan saja tanpa menunggu rapat warga.

### 6. Dashboard Admin & Manajemen Kepengurusan
Pusat kendali bagi Ketua RT atau RW untuk mengatur seluruh gerak-gerik administrasi.
-   **Antrean Verifikasi Warga**: List warga baru yang masuk melalui sistem OCR untuk disetujui atau ditolak berdasarkan validitas domisili.
-   **Manajemen Persetujuan Surat**: Admin menerima notifikasi setiap ada permohonan surat baru dan dapat memprosesnya dengan satu klik.
-   **Monitoring Darurat (Panic Button)**: Panel khusus yang siaga menerima sinyal bahaya jika ada warga yang menekan tombol darurat, lengkap dengan lokasi dan identitas pelapor.

### 7. Cloud Document Storage (Dokumen Digital)
Brankas digital bagi warga untuk menyimpan dokumen penting agar selalu tersedia saat dibutuhkan.
-   **Repository KTP/KK**: Menghilangkan kebutuhan untuk sering mencari fotokopi dokumen saat pengurusan administrasi mendadak.
-   **Akses Cepat**: Fitur klik-untuk-unduh yang memungkinkan warga mencetak dokumen mereka langsung dari dashboard.

### 8. Floating Database-Aware SmartWarga AI Chatbot (Asisten Cerdas Warga)
Fitur asisten virtual interaktif yang mengambang di pojok kanan bawah, siap membantu warga 24/7 dengan data dinamis lingkungan RT.
-   **Database-Aware Context**: Chatbot terintegrasi langsung dengan database internal RT (seperti saldo kas, histori iuran, rincian pengeluaran, status dokumen, dll.) untuk memberikan jawaban yang akurat, real-time, dan kontekstual.
-   **Premium Formatting Engine**: Balasan dari AI diformat secara indah dengan dukungan render bold text (`**teks**`), bulleted lists, numbered lists, dan spasi paragraf yang dinamis untuk memudahkan pembacaan warga.
-   **Smart Auto-Scroll**: Kolom percakapan dilengkapi dengan fitur *auto-scroll* otomatis ke pesan paling baru setiap kali AI sedang mengetik atau memberikan respons baru demi pengalaman berkirim pesan yang mulus.
-   **Demo Quick Prompts**: Tersedia tombol shortcut pertanyaan cepat (misal: "Cek Saldo Kas RT", "Rincian Iuran Bulanan", dll.) untuk mempercepat interaksi warga dengan AI.

---

## 🛠️ Teknologi & Framework (Tech Stack)

Aplikasi ini dibangun menggunakan teknologi modern untuk memastikan performa yang cepat dan pengalaman pengguna yang mulus:

-   **Frontend**: [React 19](https://react.dev/) - Library JavaScript untuk membangun antarmuka pengguna.
-   **Bundler & Build Tool**: [Vite](https://vitejs.dev/) - Tooling frontend generasi berikutnya yang sangat cepat.
-   **Bahasa Pemrograman**: [TypeScript](https://www.typescriptlang.org/) - Memberikan keamanan tipe data untuk mengurangi bug.
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) - Framework CSS utility-first untuk desain responsif yang cepat.
-   **Ikonografi**: [Lucide React](https://lucide.dev/) - Set ikon vektor yang bersih dan konsisten.
-   **Animasi**: [Motion](https://motion.dev/) - Digunakan untuk transisi halus dan feedback visual.
-   **Backend (Minimal)**: [Express](https://expressjs.com/) - Digunakan untuk melayani aset statis dan API sederhana.
-   **Inteligensi**: [Google Gemini AI (@google/genai)](https://ai.google.dev/) - Digunakan untuk teknologi Smart OCR pada pendaftaran KTP.

---

## 🚀 Menjalankan di Lokal (Local Setup)

Ikuti langkah-langkah terperinci di bawah ini untuk mengunduh, mengonfigurasi, dan menjalankan aplikasi SmartWarga pada mesin lokal Anda:

### 📋 Prasyarat Sistem
Sebelum memulai, pastikan perangkat lokal Anda telah terpasang perangkat lunak pendukung berikut:
- **Node.js** (Sangat disarankan Versi 18 LTS ke atas atau v20+)
- **NPM** (Bawaan dari rilis instalasi Node.js)
- **Git** (Opsional, untuk melakukan klon repositori)

---

### 💻 Langkah-langkah Panduan Instalasi

#### 1. Persiapan Direktori Proyek
Unduh source-code atau lakukan kloning dari repositori Anda, kemudian masuk ke dalam direktori kerja:
```bash
# Clone menggunakan git
git clone <URL_REPOSITORI_ANDA> smartwarga
cd smartwarga

# Atau jika berbentuk arsip zip, ekstrak lalu masuk ke folder:
cd smartwarga
```

#### 2. Pemasangan Dependensi (Dependency Installation)
Pasang semua paket library pihak ketiga yang terdaftar pada `package.json` secara otomatis melalui package manager:
```bash
npm install
```

#### 3. Konfigurasi Environment Variables (.env)
Aplikasi ini memanfaatkan API eksternal (Google Gemini) untuk fitur cerdas auto-fill KTP (OCR). Konfigurasikan variabel lingkungan Anda dengan membuat berkas `.env` dari blueprint contoh:
```bash
cp .env.example .env
```
Buka berkas `.env` baru tersebut, lalu isi nilai kredensial Anda:
```env
# Port aplikasi server lokal dijalankan
PORT=3000

# Kunci API Google Gemini (Diperoleh dari Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key_here
```

#### 4. Menjalankan Kode dalam Mode Pengembangan (Development Mode)
Jalankan dev server lokal terintegrasi (Express backend & Vite HMR frontend) dengan perintah berikut:
```bash
npm run dev
```

#### 5. Akses Hasil Running Proyek
Buka peramban web (Chrome/Firefox/Edge) lalu kendali diarahkan ke:
- URL Lokal: **`http://localhost:3000`**

---

## 💾 Panduan Konfigurasi Backend & Database (Production Integration)

Secara bawaan (*default*), aplikasi memuat data interaktif (Surat, Finansial, Riwayat Iuran, Laporan, UMKM) menggunakan **in-memory data store** (variabel array JavaScript global) di dalam berkas server utama `server.ts`. 

Saat server dimatikan atau direstart pada komputer lokal, modifikasi data baru akan dikembalikan ke keadaan semula (*volatile*). Untuk implementasi produksi nyata, Anda dapat mengintegrasikan database menggunakan rekomendasi arsitektur berikut:

### Opsi A: Integrasi Database Relasional (PostgreSQL / SQLite via Prisma ORM)
Pilihan terbaik demi menjaga integritas data keuangan iuran, relasi kependudukan warga, serta penanganan berkas pengajuan surat resmi.

1. **Pasang Prisma ORM pada Proyek:**
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   ```
2. **Definisikan Skema Model di `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "sqlite" // atau "postgresql"
     url      = env("DATABASE_URL")
   }

   generator client {
     provider = "prisma-client-js"
   }

   model Resident {
     id        String   @id @default(uuid())
     name      String
     address   String
     phone     String
     dues      Due[]
   }

   model Due {
     id         String   @id @default(uuid())
     month      String
     amount     Float
     status     String   // "paid", "unpaid", "pending"
     residentId String
     resident   Resident @relation(fields: [residentId], references: [id])
   }
   ```
3. **Migrasi Database:**
   ```bash
   npx prisma migrate dev --name init
   ```
4. **Hubungkan di `server.ts`:**
   Impor Prisma Client ke berkas `server.ts` Anda dan gantikan variabel in-memory dengan query DB nyata:
   ```typescript
   import { PrismaClient } from "@prisma/client";
   const prisma = new PrismaClient();

   // Ganti rute GET /api/admin/residents:
   app.get("/api/admin/residents", async (req, res) => {
     const residents = await prisma.resident.findMany({
       include: { dues: true }
     });
     res.json(residents);
   });
   ```

---

### Opsi B: Integrasi Firebase (Firestore & Authentication)
Sangat cocok untuk tim pengembang yang menginginkan infrastruktur serverless nir-kelola dengan sinkronisasi basis data real-time.

1. **Pasang Firebase SDK:**
   ```bash
   npm install firebase-admin
   ```
2. **Inisialisasi Firebase Admin di `server.ts`:**
   ```typescript
   import admin from "firebase-admin";
   
   // Siapkan akun layanan (Service Account) Firebase dari Konsol Google Cloud/Firebase
   const serviceAccount = require("./firebase-service-account.json");

   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount)
   });

   const db = admin.firestore();
   ```
3. **Ubah Query Collection:**
   Gunakan fungsi Firestore SDK untuk mengambil dan mengubah status iuran serta laporan e-reporting warga secara cloud:
   ```typescript
   // Contoh rute GET /api/user/letters
   app.get("/api/user/letters", async (req, res) => {
     const snapshot = await db.collection("letters").orderBy("date", "desc").get();
     const letters = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
     res.json(letters);
   });
   ```

---

---

## 🎨 Filosofi Desain & User Experience

Aplikasi ini dibangun dengan prinsip **"Trust through Clarity"** (Kepercayaan melalui Kejelasan):
-   **High Contrast UI**: Skema warna yang diperbarui dengan kontras tinggi (Latar belakang gelap pekat dengan teks putih murni dan aksen oranye/hijau neon) memastikan teks mudah dibaca oleh warga dari berbagai kelompok usia.
-   **Micro-Animations**: Menggunakan `framer-motion` untuk memberikan umpan balik visual saat tombol ditekan atau saat berpindah tab.
-   **Responsive Layout**: Dashboard yang menyesuaikan diri dengan sempurna baik diakses melalui smartphone (saat warga sedang di luar) maupun melalui laptop/tablet (saat pengurus sedang bekerja di meja).

---

## 🔒 Keamanan & Integritas Data

-   **Role-Based Access Control (RBAC)**: Pemisahan akses yang ketat antara Warga dan Admin RT untuk mencegah kebocoran data sensitif.
-   **Validasi Server-Side**: Semua input (terutama keuangan) divalidasi di sisi server untuk mencegah manipulasi data.
-   **Enkripsi Sederhana**: Data sensitif dilindungi melalui alur otentikasi yang aman.

---
*SmartWarga — Mewujudkan masa depan lingkungan yang lebih terorganisir.*
