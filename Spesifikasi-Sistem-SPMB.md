# SPESIFIKASI SISTEM: Aplikasi Kios Antrean SPMB SMAN 1 Slawi

## 1. Gambaran Umum Sistem
Sistem ini adalah aplikasi berbasis web yang memfasilitasi pengambilan nomor antrean secara *online* untuk proses verifikasi berkas Pendaftaran Peserta Didik Baru (PPDB/SPMB) di SMAN 1 Slawi. Sistem ini dirancang untuk mencegah penumpukan pendaftar di sekolah dengan menerapkan pembatasan kuota harian.

## 2. Panduan UI/UX & Desain Antarmuka
Sistem tidak menggunakan tampilan bawaan (*default template*) dari *framework*. Seluruh antarmuka dirancang secara kustom dengan prinsip:
*   **Mobile-First Design:** Tampilan dijamin rapi, proporsional, dan *user-friendly* saat dibuka melalui HP (smartphone) oleh wali murid, dan otomatis melebar secara responsif saat dibuka di laptop/PC oleh panitia.
*   **Tema Warna:** Menggunakan identitas warna yang profesional. Kombinasi Biru Dongker (*Navy*), Biru Terang, Putih bersih untuk *background card*, dan Abu-abu terang untuk latar belakang utama aplikasi.
*   **Komponen Modern:** Menggunakan sudut melengkung (*rounded-2xl*), efek bayangan halus (*soft shadow*), dan transisi *hover* pada tombol agar terasa interaktif layaknya aplikasi *mobile* modern.

---

## 3. Pembagian Hak Akses (Role) & Alur Pengguna

Aplikasi ini memiliki 3 jenis pengguna dengan alur dan hak akses yang berbeda-beda:

### A. Role: Siswa / Wali Murid (Pengguna Publik)
Fokus utama pada kepraktisan dan kemudahan akses.
*   **Alur Autentikasi:**
    *   Pendaftaran (Register) dan Masuk (Login) **murni menggunakan NISN** (Nomor Induk Siswa Nasional).
    *   Tidak ada fitur verifikasi email agar proses pendaftaran cepat.
    *   Tombol Login/Register tersedia langsung di halaman utama.
*   **Menu & Fitur yang Tersedia:**
    *   **Landing Page (Kios Informasi):** Halaman depan yang bisa diakses tanpa *login*. Menampilkan informasi sekolah dan sisa kuota verifikasi berkas untuk beberapa hari ke depan secara *real-time*.
    *   **Dashboard Siswa (Mode Pilih Jadwal):** Jika siswa baru mendaftar dan belum punya antrean, layar akan menampilkan **Kalender Grid Interaktif** berukuran besar.
        *   Siswa bisa mengganti bulan/tahun.
        *   Tanggal yang kuotanya penuh berwarna merah dan tidak bisa diklik.
        *   Tanggal yang tersedia berwarna biru/hijau.
        *   Saat tanggal diklik, akan muncul *pop-up* atau panel detail di bawahnya yang berisi konfirmasi sisa kuota dan tombol "Ambil Antrean".
    *   **Dashboard Siswa (Mode Tiket Virtual):** Jika siswa sudah berhasil mengambil jadwal, kalender akan disembunyikan. Layar berubah menjadi tampilan **E-Tiket (Kartu Antrean Virtual)** yang menampilkan:
        *   Nomor Urut Antrean (Contoh: A-045).
        *   Hari & Tanggal Kedatangan.
        *   Status saat ini (Menunggu / Menuju Loket 2 / Selesai).
        *   *Catatan:* Siswa hanya bisa memiliki 1 tiket aktif dan tidak bisa melakukan pendaftaran ganda.

### B. Role: Panitia / Petugas Loket (Eksekutor)
Fokus pada kecepatan pemrosesan pendaftar di lapangan.
*   **Alur Autentikasi:**
    *   Tidak menggunakan tombol *login* di halaman depan untuk menghindari kebingungan siswa.
    *   Panitia masuk melalui URL tersembunyi (Contoh: `sman1slawi.sch.id/panitia/login`).
    *   Login menggunakan *Username* atau NIP yang sudah dibuatkan oleh Admin.
*   **Menu & Fitur yang Tersedia:**
    *   **Dashboard Loket (Antarmuka Kasir):** Tampilan layar dirancang optimal untuk laptop/tablet dengan model *Split-Screen*.
        *   *Panel Kiri:* Daftar urutan nama siswa dan nomor antrean yang mendaftar pada hari tersebut.
        *   *Panel Kanan (Kontrol Aksi):* Tombol besar untuk **"Panggil Antrean Selanjutnya"**.
    *   **Alur Eksekusi:** Saat panitia menekan tombol panggil, status E-Tiket di HP siswa akan otomatis berubah dari "Menunggu" menjadi "Menuju Meja Panitia". Setelah berkas selesai dicek, panitia menekan tombol **"Selesai diverifikasi"**.

### C. Role: Administrator (Super User)
Fokus pada pengelolaan data master dan laporan kegiatan.
*   **Alur Autentikasi:**
    *   Masuk melalui URL rahasia (Contoh: `sman1slawi.sch.id/admin/login`).
*   **Menu & Fitur yang Tersedia:**
    *   **Dashboard Statistik:** Menampilkan grafik batang/garis jumlah pendaftar per hari, total kuota tersisa bulan ini, dan total siswa terdaftar.
    *   **Manajemen Jadwal & Kuota:** 
        *   Admin dapat membuka/menutup tanggal tertentu di kalender (misal: menutup hari Minggu atau hari libur nasional).
        *   Menentukan kapasitas kuota maksimal per hari (misal: hari Senin 150 orang, Jumat 100 orang).
    *   **Manajemen Pengguna (User):**
        *   Melihat daftar seluruh siswa yang sudah mendaftar sistem.
        *   Fitur "Reset Password" jika ada wali murid yang melapor lupa *password* akun NISN-nya.
        *   Menambah atau menghapus akun untuk Panitia Loket.
    *   **Laporan (Report):** Fitur untuk mengekspor data rekapan antrean harian ke dalam format *Excel* atau *PDF* sebagai bukti pelaporan SPMB ke kepala sekolah.