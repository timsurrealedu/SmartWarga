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

### 3. E-Reporting & Tiketing Lingkungan (Pengaduan Warga)
Solusi digital untuk menggantikan laporan lisan yang sering terlupakan atau tidak terdokumentasi.
-   **Kategorisasi Laporan**: Pilihan kategori seperti Infrastruktur (lampu jalan, lubang), Kebersihan (sampah menumpuk), dan Keamanan (parkir liar).
-   **Alur Privasi Ganda**:
    -   **Laporan Saya**: Ruang bagi warga untuk membuat laporan baru dan memantau progresnya secara eksklusif.
    -   **Laporan Publik**: Daftar laporan yang telah dipublikasikan agar warga lain tidak melaporkan masalah yang sama dan dapat memantau transparansi penanganan masalah lingkungan.
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
