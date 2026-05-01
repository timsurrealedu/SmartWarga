# Digital RT-RW: Sistem Informasi Lingkungan Pintar

Digital RT-RW adalah dashboard manajemen lingkungan yang dirancang untuk memodernisasi administrasi di tingkat RT/RW. Aplikasi ini menawarkan solusi terpadu untuk pengelolaan iuran, pengajuan surat (e-reporting), dan transparansi keuangan warga secara digital.

## 🌟 Fitur Utama

-   **Otentikasi Multilevel**: Login khusus untuk Warga dan Pengurus (Admin).
-   **E-Reporting & Masukan**: Warga dapat melaporkan masalah lingkungan (lampu jalan mati, sampah, dll.) lengkap dengan unggahan foto.
-   **Transparansi Dana Warga**: Dashboard visual untuk memantau pemasukan dan pengeluaran kas RT secara real-time.
-   **Layanan E-Surat**: Pengajuan berbagai surat keterangan (Domisili, SKU, SKTM, dll.) dengan fitur tanda tangan digital dan unduh PDF otomatis.
-   **Manajemen Keuangan Admin**: Pengurus dapat mencatat transaksi kas dengan kewajiban melampirkan bukti kwitansi digital.
-   **Verifikasi NIK & Telepon**: Keamanan pendaftaran warga dengan validasi NIK (16 digit) dan nomor WhatsApp.

## 🛠️ Teknologi yang Digunakan

-   **Frontend**: React 19, Vite, TypeScript
-   **Backend**: Express.js (Node.js)
-   **Styling**: Tailwind CSS
-   **Animasi**: Framer Motion (`motion/react`)
-   **Visualisasi Data**: Recharts
-   **Dokumen**: jsPDF & jsPDF-AutoTable
-   **Ikon**: Lucide React

## 🚀 Panduan Setup Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi di mesin lokal Anda:

### 1. Prasyarat

Pastikan Anda sudah menginstal:
-   [Node.js](https://nodejs.org/) (Versi 18 atau lebih tinggi)
-   [npm](https://www.npmjs.com/) (Biasanya disertakan dalam instalasi Node.js)

### 2. Kloning Repositori (Jika berlaku) atau Unduh File
Ekstrak file proyek ke direktori pilihan Anda.

### 3. Instalasi Dependensi
Buka terminal/command prompt di direktori proyek dan jalankan:
```bash
npm install
```

### 4. Konfigurasi Variabel Lingkungan
Buat file bernama `.env` di direktori akar (root) jika diperlukan untuk API Key pihak ketiga. Anda dapat menyalin dari `.env.example` jika tersedia.

### 5. Menjalankan Aplikasi
Untuk memulai server pengembangan (development server):
```bash
npm run dev
```
Aplikasi biasanya akan berjalan di `http://localhost:3000`.

### 6. Membangun untuk Produksi
Jika Anda ingin membuat versi produksi:
```bash
npm run build
```
Hasil build akan berada di folder `dist/`.

## 📂 Struktur Proyek Singkat

-   `server.ts`: Entry point backend (Express) yang juga menangani routing Vite.
-   `src/App.tsx`: Komponen utama yang mengatur routing frontend.
-   `src/views/`: Berisi halaman utama (Dashboard Warga, Dashboard Admin, Login).
-   `src/components/`: Komponen UI yang dapat digunakan kembali.

## 📝 Catatan Khusus
-   Aplikasi ini menggunakan `tsx` untuk menjalankan file TypeScript secara langsung pada backend.
-   Pastikan port `3000` tidak sedang digunakan oleh aplikasi lain.

---
Dikembangkan dengan ❤️ untuk lingkungan yang lebih cerdas.
