import { Head, Link } from '@inertiajs/react';
import LogoSmansawi from '@/Components/LogoSmansawi';
import { useEffect } from 'react';

export default function Welcome({ auth }) {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    } else {
                        // Hapus class agar animasi dapat dipicu kembali saat dikunjungi ulang/dilihat lagi
                        entry.target.classList.remove('is-visible');
                    }
                });
            },
            { threshold: 0.15 }
        );

        const elements = document.querySelectorAll('.reveal-on-scroll');
        elements.forEach((el) => observer.observe(el));

        return () => {
            elements.forEach((el) => observer.unobserve(el));
        };
    }, []);

    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            // Re-trigger animasi pada bagian target saat diklik
            const revealChilds = targetElement.querySelectorAll('.reveal-on-scroll');
            targetElement.classList.remove('is-visible');
            revealChilds.forEach((child) => child.classList.remove('is-visible'));

            targetElement.scrollIntoView({ behavior: 'smooth' });

            setTimeout(() => {
                targetElement.classList.add('is-visible');
                revealChilds.forEach((child) => child.classList.add('is-visible'));
            }, 300);
        }
    };

    const linimasa = [
        { tahap: '1', tanggal: '18 Mei 2027', agenda: 'Pengumuman SPMB', desc: 'Pengumuman resmi juknis & syarat SPMB SMAN 1 Slawi TA 2027/2028.' },
        { tahap: '2', tanggal: '3–12 Juni 2027', agenda: 'Pengajuan Akun', desc: 'Pembuatan & pengajuan akun calon murid baru secara online.' },
        { tahap: '3', tanggal: '4–13 Juni 2027', agenda: 'Verifikasi & Aktivasi Akun', desc: 'Verifikasi berkas fisik dan aktivasi akun pendaftaran.' },
        { tahap: '4', tanggal: '14 Juni 2027', agenda: 'Sinkronisasi Data', desc: 'Validasi dan penguncian data pendaftar secara otomatis.' },
        { tahap: '5', tanggal: '15–18 Juni 2027', agenda: 'Pendaftaran & Pilih Sekolah', desc: 'Pemilihan jalur & pilihan sekolah SMA tujuan pendaftaran.' },
        { tahap: '6', tanggal: '19–20 Juni 2027', agenda: 'Evaluasi & Masa Tenang', desc: 'Pemeringkatan jurnal seleksi dan penutupan perubahan.' },
        { tahap: '7', tanggal: '21 Juni 2027', agenda: 'Pengumuman Hasil Utama', desc: 'Pengumuman resmi calon siswa yang lolos seleksi utama.' },
        { tahap: '8', tanggal: '22–25 Juni 2027', agenda: 'Daftar Ulang Utama', desc: 'Registrasi ulang berkas fisik bagi peserta kelulusan utama.' },
        { tahap: '9', tanggal: '26 Juni 2027', agenda: 'Pengumuman Cadangan', desc: 'Pengumuman kuota tersisa dan daftar peserta cadangan.' },
        { tahap: '10', tanggal: '29–30 Juni 2027', agenda: 'Daftar Ulang Cadangan', desc: 'Daftar ulang bagi peserta didik status cadangan.' },
        { tahap: '11', tanggal: '15 Juli 2027', agenda: 'Awal TA 2027/2028', desc: 'Hari pertama masuk sekolah dan pembukaan MPLS.' },
    ];

    const jalurSeleksi = [
        {
            nama: '1. Jalur Domisili',
            kuota: 'Paling sedikit 33%',
            desc: 'Berdasarkan jarak domisili tempat tinggal terdekat dengan lokasi SMAN 1 Slawi.',
            badgeBg: 'bg-blue-600'
        },
        {
            nama: '2. Jalur Afirmasi',
            kuota: 'Paling sedikit 32%',
            desc: 'Peruntukan khusus bagi: Penyandang Disabilitas (maks. 2%), Keluarga Ekonomi Tidak Mampu, Anak Panti (maks. 3%), dan ATS / Anak Putus Sekolah (maks. 2%).',
            badgeBg: 'bg-emerald-600'
        },
        {
            nama: '3. Jalur Prestasi',
            kuota: 'Paling sedikit 30%',
            desc: 'Penilaian berdasarkan akumulasi Prestasi Akademik, Prestasi Non-Akademik, serta Keaktifan Pengurus / Ketua Organisasi.',
            badgeBg: 'bg-purple-600'
        },
        {
            nama: '4. Jalur Mutasi',
            kuota: 'Paling banyak 5%',
            desc: 'Perpindahan tugas orang tua/wali dari luar daerah, termasuk di dalamnya khusus untuk anak guru.',
            badgeBg: 'bg-amber-600'
        },
    ];

    const dokumenReq = [
        'Kartu Keluarga (Asli + Fotokopi)',
        'Surat Keterangan Rapor Semester 1–5 (Asli)',
        'Akta Kelahiran (Asli + Fotokopi)',
        'Surat Keterangan Lulus (Asli)',
        'Buku Rapor (Asli)',
        'Sertifikat Hasil TKA (Asli)',
        'Sertifikat Prestasi (jika memiliki)',
    ];

    const mapelPenilaian = [
        'Pendidikan Agama & Budi Pekerti',
        'PPKn',
        'Bahasa Indonesia',
        'Matematika',
        'IPA',
        'IPS',
        'Bahasa Inggris',
    ];

    const narahubung = [
        { nama: 'Lulus Wijayanto, S.Pd', telp: '0815-7517-5363' },
        { nama: 'Rusmawati, S.Pd', telp: '0856-4088-2285' },
        { nama: 'Afgriz Prasetiyawati, S.Pd', telp: '0812-2503-0765' },
        { nama: 'Dyah Ayu Triana, S.Si', telp: '0852-2634-7402' },
    ];

    return (
        <>
            <Head title="Portal Resmi SPMB 2027/2028 - SMAN 1 Slawi" />

            <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white scroll-smooth">
                
                {/* Header Navbar Biru Modern Interaktif */}
                <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-20">
                            
                            {/* Logo Asli SMAN 1 Slawi */}
                            <a href="#" className="flex items-center gap-3.5 group shrink-0">
                                <div className="transition transform group-hover:scale-105 duration-200">
                                    <LogoSmansawi className="w-12 h-12" />
                                </div>
                                <div>
                                    <h1 className="font-black text-slate-900 text-lg sm:text-xl tracking-tight leading-tight group-hover:text-blue-700 transition">
                                        SMA NEGERI 1 SLAWI
                                    </h1>
                                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">PORTAL RESMI SPMB 2027/2028</p>
                                </div>
                            </a>

                            {/* Navigasi Tengah (Navigasi Beranda Tanpa Ikon) */}
                            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 text-xs font-extrabold text-slate-600">
                                <a
                                    href="#alur-pendaftaran"
                                    onClick={(e) => handleNavClick(e, 'alur-pendaftaran')}
                                    className="px-4 py-2 rounded-xl hover:text-blue-700 hover:bg-white hover:shadow-xs transition duration-200"
                                >
                                    Alur Pendaftaran
                                </a>
                                <a
                                    href="#jalur-seleksi"
                                    onClick={(e) => handleNavClick(e, 'jalur-seleksi')}
                                    className="px-4 py-2 rounded-xl hover:text-blue-700 hover:bg-white hover:shadow-xs transition duration-200"
                                >
                                    Jalur Seleksi
                                </a>
                                <a
                                    href="#persyaratan-berkas"
                                    onClick={(e) => handleNavClick(e, 'persyaratan-berkas')}
                                    className="px-4 py-2 rounded-xl hover:text-blue-700 hover:bg-white hover:shadow-xs transition duration-200"
                                >
                                    Persyaratan Berkas
                                </a>
                                <a
                                    href="#kontak-informasi"
                                    onClick={(e) => handleNavClick(e, 'kontak-informasi')}
                                    className="px-4 py-2 rounded-xl hover:text-blue-700 hover:bg-white hover:shadow-xs transition duration-200"
                                >
                                    Kontak &amp; Info
                                </a>
                            </nav>

                            {/* Tombol Header Interaktif */}
                            <div className="flex items-center gap-3 shrink-0">
                                {auth?.user ? (
                                    <Link
                                        href={route('etiket')}
                                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition duration-200"
                                    >
                                        Buka E-Tiket Anda →
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="px-5 py-2.5 rounded-xl text-slate-700 hover:text-blue-700 hover:bg-blue-50 font-bold text-sm transition duration-200 border border-slate-200 hover:border-blue-300"
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold text-sm shadow-md shadow-blue-700/25 hover:shadow-lg hover:shadow-blue-700/40 transition transform hover:-translate-y-0.5 duration-200"
                                        >
                                            Daftar
                                        </Link>
                                    </>
                                )}
                            </div>

                        </div>
                    </div>
                </header>

                {/* Hero Section Biru Modern Gradasi Interaktif */}
                <section className="relative py-16 sm:py-24 bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 text-white overflow-hidden shadow-xl">
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] animate-pulse" />
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="max-w-3xl mx-auto text-center space-y-6 reveal-on-scroll">
                            
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-blue-100 text-xs font-bold uppercase tracking-wider animate-bounce">
                                <span>✨ Penerimaan Murid Baru Tahun Ajaran 2027 / 2028</span>
                            </div>

                            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                                Sistem Penerimaan Murid Baru (SPMB) <br />
                                <span className="text-sky-300 drop-shadow">SMA Negeri 1 Slawi</span>
                            </h2>

                            <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                                SMAN 1 Slawi resmi membuka pendaftaran secara daring melalui platform SPMB Jateng dengan mengedepankan prinsip transparan, akuntabel, dan bebas dari praktik titip maupun intervensi (No Titip, No Jastip).
                            </p>

                            <div className="pt-1">
                                <span className="inline-block bg-white/10 text-sky-200 text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-xl backdrop-blur-md border border-white/20 tracking-widest uppercase hover:bg-white/20 transition cursor-default">
                                    Berkarakter, Berprestasi, Unggul, Terdepan!
                                </span>
                            </div>

                            {/* Tombol Hero */}
                            <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
                                {auth?.user ? (
                                    <Link
                                        href={route('etiket')}
                                        className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-blue-900 hover:bg-blue-50 font-black text-base shadow-xl shadow-blue-950/30 transition transform hover:-translate-y-1 hover:scale-105 duration-200"
                                    >
                                        Buka E-Tiket Anda →
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('register')}
                                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-blue-900 hover:bg-blue-50 font-black text-base shadow-xl shadow-blue-950/30 transition transform hover:-translate-y-1 hover:scale-105 duration-200"
                                        >
                                            Daftar Akun NISN
                                        </Link>
                                        <Link
                                            href={route('login')}
                                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-950/50 hover:bg-blue-950/70 text-white font-bold text-base border border-white/20 backdrop-blur-md transition transform hover:-translate-y-1 duration-200"
                                        >
                                            Masuk Ke Akun Siswa
                                        </Link>
                                    </>
                                )}
                            </div>

                        </div>
                    </div>
                </section>

                {/* ALUR LINIMASA: ELEMEN PANAH PHYSICAL DI SELA-SELA KOTAK + PANAH BEBAWAH BESAR NONGKRONG RAPI */}
                <section id="alur-pendaftaran" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16 reveal-on-scroll">
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                            ALUR PELAKSANAAN DENGAN PANAH ALUR PRESISI
                        </span>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight mt-3">Alur Pendaftaran SPMB Online</h3>
                        <p className="text-sm text-slate-500 mt-2">Urutan langkah demi langkah yang terhubung presisi antar tahapan.</p>
                    </div>

                    <div className="space-y-4">
                        
                        {/* BARIS 1: Kotak 1 -> Kotak 2 -> Kotak 3 */}
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 reveal-on-scroll reveal-delay-100">
                            
                            {/* Kotak 1 */}
                            <div className="flex-1 w-full p-6 rounded-3xl bg-white border-2 border-blue-100 shadow-sm hover:shadow-xl hover:border-blue-500 transition transform hover:-translate-y-1 duration-300 group flex flex-col justify-between min-h-[190px]">
                                <div>
                                    <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-black text-base flex items-center justify-center mb-3 shadow-md shadow-blue-600/30 group-hover:scale-110 transition">
                                        1
                                    </div>
                                    <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full block w-fit mb-2">
                                        📅 18 Mei 2027
                                    </span>
                                    <h4 className="font-black text-slate-900 text-lg mb-1">Pengumuman SPMB</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">{linimasa[0].desc}</p>
                                </div>
                            </div>

                            {/* ELEMEN PANAH KANAN 1 -> 2 (Fisik di sela-sela antar kotak) */}
                            <div className="hidden lg:flex items-center justify-center shrink-0 px-2 text-blue-600">
                                <svg className="w-8 h-8 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                                </svg>
                            </div>

                            {/* Kotak 2 */}
                            <div className="flex-1 w-full p-6 rounded-3xl bg-white border-2 border-blue-100 shadow-sm hover:shadow-xl hover:border-blue-500 transition transform hover:-translate-y-1 duration-300 group flex flex-col justify-between min-h-[190px]">
                                <div>
                                    <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-black text-base flex items-center justify-center mb-3 shadow-md shadow-blue-600/30 group-hover:scale-110 transition">
                                        2
                                    </div>
                                    <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full block w-fit mb-2">
                                        📅 3–12 Juni 2027
                                    </span>
                                    <h4 className="font-black text-slate-900 text-lg mb-1">Pengajuan Akun</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">{linimasa[1].desc}</p>
                                </div>
                            </div>

                            {/* ELEMEN PANAH KANAN 2 -> 3 (Fisik di sela-sela antar kotak) */}
                            <div className="hidden lg:flex items-center justify-center shrink-0 px-2 text-blue-600">
                                <svg className="w-8 h-8 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                                </svg>
                            </div>

                            {/* Kotak 3 */}
                            <div className="flex-1 w-full p-6 rounded-3xl bg-white border-2 border-blue-100 shadow-sm hover:shadow-xl hover:border-blue-500 transition transform hover:-translate-y-1 duration-300 group flex flex-col justify-between min-h-[190px]">
                                <div>
                                    <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-black text-base flex items-center justify-center mb-3 shadow-md shadow-blue-600/30 group-hover:scale-110 transition">
                                        3
                                    </div>
                                    <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full block w-fit mb-2">
                                        📅 4–13 Juni 2027
                                    </span>
                                    <h4 className="font-black text-slate-900 text-lg mb-1">Verifikasi Berkas</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">{linimasa[2].desc}</p>
                                </div>
                            </div>

                        </div>

                        {/* PANAH BELOK KEBAWAH BESAR DARI KOTAK 3 KE KOTAK 4 */}
                        <div className="hidden lg:flex justify-end pr-28 py-2">
                            <div className="flex flex-col items-center text-blue-600">
                                <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
                                <svg className="w-10 h-10 text-blue-600 animate-bounce -mt-2 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8z" />
                                </svg>
                            </div>
                        </div>

                        {/* BARIS 2: Kotak 6 <- Kotak 5 <- Kotak 4 */}
                        <div className="flex flex-col lg:flex-row-reverse items-center justify-between gap-3 reveal-on-scroll reveal-delay-200">
                            
                            {/* Kotak 4 */}
                            <div className="flex-1 w-full p-6 rounded-3xl bg-white border-2 border-blue-100 shadow-sm hover:shadow-xl hover:border-blue-500 transition transform hover:-translate-y-1 duration-300 group flex flex-col justify-between min-h-[190px]">
                                <div>
                                    <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-black text-base flex items-center justify-center mb-3 shadow-md shadow-blue-600/30 group-hover:scale-110 transition">
                                        4
                                    </div>
                                    <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full block w-fit mb-2">
                                        📅 14 Juni 2027
                                    </span>
                                    <h4 className="font-black text-slate-900 text-lg mb-1">Sinkronisasi Data</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">{linimasa[3].desc}</p>
                                </div>
                            </div>

                            {/* ELEMEN PANAH KIRI 4 <- 5 (Fisik di sela-sela antar kotak) */}
                            <div className="hidden lg:flex items-center justify-center shrink-0 px-2 text-blue-600">
                                <svg className="w-8 h-8 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 20l1.41-1.41L7.83 13H20v-2H7.83l5.58-5.59L12 4l-8 8z" />
                                </svg>
                            </div>

                            {/* Kotak 5 */}
                            <div className="flex-1 w-full p-6 rounded-3xl bg-white border-2 border-blue-100 shadow-sm hover:shadow-xl hover:border-blue-500 transition transform hover:-translate-y-1 duration-300 group flex flex-col justify-between min-h-[190px]">
                                <div>
                                    <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-black text-base flex items-center justify-center mb-3 shadow-md shadow-blue-600/30 group-hover:scale-110 transition">
                                        5
                                    </div>
                                    <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full block w-fit mb-2">
                                        📅 15–18 Juni 2027
                                    </span>
                                    <h4 className="font-black text-slate-900 text-lg mb-1">Pendaftaran Online</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">{linimasa[4].desc}</p>
                                </div>
                            </div>

                            {/* ELEMEN PANAH KIRI 5 <- 6 (Fisik di sela-sela antar kotak) */}
                            <div className="hidden lg:flex items-center justify-center shrink-0 px-2 text-blue-600">
                                <svg className="w-8 h-8 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 20l1.41-1.41L7.83 13H20v-2H7.83l5.58-5.59L12 4l-8 8z" />
                                </svg>
                            </div>

                            {/* Kotak 6 */}
                            <div className="flex-1 w-full p-6 rounded-3xl bg-white border-2 border-blue-100 shadow-sm hover:shadow-xl hover:border-blue-500 transition transform hover:-translate-y-1 duration-300 group flex flex-col justify-between min-h-[190px]">
                                <div>
                                    <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-black text-base flex items-center justify-center mb-3 shadow-md shadow-blue-600/30 group-hover:scale-110 transition">
                                        6
                                    </div>
                                    <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full block w-fit mb-2">
                                        📅 19–20 Juni 2027
                                    </span>
                                    <h4 className="font-black text-slate-900 text-lg mb-1">Evaluasi & Masa Tenang</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">{linimasa[5].desc}</p>
                                </div>
                            </div>

                        </div>

                        {/* PANAH BELOK KEBAWAH BESAR DARI KOTAK 6 KE KOTAK 7 */}
                        <div className="hidden lg:flex justify-start pl-28 py-2">
                            <div className="flex flex-col items-center text-blue-600">
                                <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
                                <svg className="w-10 h-10 text-blue-600 animate-bounce -mt-2 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8z" />
                                </svg>
                            </div>
                        </div>

                        {/* BARIS 3: Kotak 7 -> Kotak 8 -> Kotak 9 */}
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 reveal-on-scroll reveal-delay-300">
                            
                            {/* Kotak 7 */}
                            <div className="flex-1 w-full p-6 rounded-3xl bg-white border-2 border-blue-100 shadow-sm hover:shadow-xl hover:border-blue-500 transition transform hover:-translate-y-1 duration-300 group flex flex-col justify-between min-h-[190px]">
                                <div>
                                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black text-base flex items-center justify-center mb-3 shadow-md shadow-emerald-600/30 group-hover:scale-110 transition">
                                        7
                                    </div>
                                    <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full block w-fit mb-2">
                                        📅 21 Juni 2027
                                    </span>
                                    <h4 className="font-black text-slate-900 text-lg mb-1">Pengumuman Utama</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">{linimasa[6].desc}</p>
                                </div>
                            </div>

                            {/* ELEMEN PANAH KANAN 7 -> 8 (Fisik di sela-sela antar kotak) */}
                            <div className="hidden lg:flex items-center justify-center shrink-0 px-2 text-blue-600">
                                <svg className="w-8 h-8 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                                </svg>
                            </div>

                            {/* Kotak 8 */}
                            <div className="flex-1 w-full p-6 rounded-3xl bg-white border-2 border-blue-100 shadow-sm hover:shadow-xl hover:border-blue-500 transition transform hover:-translate-y-1 duration-300 group flex flex-col justify-between min-h-[190px]">
                                <div>
                                    <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-black text-base flex items-center justify-center mb-3 shadow-md shadow-blue-600/30 group-hover:scale-110 transition">
                                        8
                                    </div>
                                    <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full block w-fit mb-2">
                                        📅 22–25 Juni 2027
                                    </span>
                                    <h4 className="font-black text-slate-900 text-lg mb-1">Daftar Ulang Utama</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">{linimasa[7].desc}</p>
                                </div>
                            </div>

                            {/* ELEMEN PANAH KANAN 8 -> 9 (Fisik di sela-sela antar kotak) */}
                            <div className="hidden lg:flex items-center justify-center shrink-0 px-2 text-blue-600">
                                <svg className="w-8 h-8 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                                </svg>
                            </div>

                            {/* Kotak 9 */}
                            <div className="flex-1 w-full p-6 rounded-3xl bg-white border-2 border-blue-100 shadow-sm hover:shadow-xl hover:border-blue-500 transition transform hover:-translate-y-1 duration-300 group flex flex-col justify-between min-h-[190px]">
                                <div>
                                    <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white font-black text-base flex items-center justify-center mb-3 shadow-md shadow-amber-500/30 group-hover:scale-110 transition">
                                        9
                                    </div>
                                    <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full block w-fit mb-2">
                                        📅 26 Juni 2027
                                    </span>
                                    <h4 className="font-black text-slate-900 text-lg mb-1">Pengumuman Cadangan</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">{linimasa[8].desc}</p>
                                </div>
                            </div>

                        </div>

                        {/* PANAH BELOK KEBAWAH BESAR DARI KOTAK 9 KE KOTAK 10 */}
                        <div className="hidden lg:flex justify-end pr-28 py-2">
                            <div className="flex flex-col items-center text-blue-600">
                                <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
                                <svg className="w-10 h-10 text-blue-600 animate-bounce -mt-2 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8z" />
                                </svg>
                            </div>
                        </div>

                        {/* BARIS 4: Kotak 11 <- Kotak 10 (PERSIS FLEX-1 DENGAN ELEMEN PANAH DI SELA-SELA MURNI & BESAR KOTAK 100% SAMA) */}
                        <div className="flex flex-col lg:flex-row-reverse items-center justify-between gap-3 reveal-on-scroll reveal-delay-400">
                            
                            {/* Kotak 10 (BERADA TEPAT DIBAWAH KOTAK 9) */}
                            <div className="flex-1 w-full p-6 rounded-3xl bg-white border-2 border-blue-100 shadow-sm hover:shadow-xl hover:border-blue-500 transition transform hover:-translate-y-1 duration-300 group flex flex-col justify-between min-h-[190px]">
                                <div>
                                    <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-black text-base flex items-center justify-center mb-3 shadow-md shadow-blue-600/30 group-hover:scale-110 transition">
                                        10
                                    </div>
                                    <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full block w-fit mb-2">
                                        📅 29–30 Juni 2027
                                    </span>
                                    <h4 className="font-black text-slate-900 text-lg mb-1">Daftar Ulang Cadangan</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">{linimasa[9].desc}</p>
                                </div>
                            </div>

                            {/* ELEMEN PANAH KIRI 10 <- 11 (Fisik di sela-sela antar kotak) */}
                            <div className="hidden lg:flex items-center justify-center shrink-0 px-2 text-blue-600">
                                <svg className="w-8 h-8 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 20l1.41-1.41L7.83 13H20v-2H7.83l5.58-5.59L12 4l-8 8z" />
                                </svg>
                            </div>

                            {/* Kotak 11 (Awal TA 2027/2028 - BERADA DI TENGAH BARIS 4, UKURAN FLEX-1 SAMA 100% PERSIS KOTAK LAIN) */}
                            <div className="flex-1 w-full p-6 rounded-3xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white border-2 border-blue-600 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 duration-300 group flex flex-col justify-between min-h-[190px]">
                                <div>
                                    <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-black text-base flex items-center justify-center mb-3 shadow-md shadow-amber-400/30 group-hover:scale-110 transition">
                                        11
                                    </div>
                                    <span className="text-[11px] font-extrabold text-amber-300 bg-white/10 px-2.5 py-1 rounded-full block w-fit mb-2 border border-white/20">
                                        🎉 15 Juli 2027
                                    </span>
                                    <h4 className="font-black text-white text-lg mb-1">Awal Tahun Ajaran Baru</h4>
                                    <p className="text-xs text-blue-100 leading-relaxed">{linimasa[10].desc}</p>
                                </div>
                            </div>

                            {/* Spacer Kosong Flex-1 Ditambah Dummy Arrow Spacer Agar Pembagian Ukuran Lebar Flex-1 Kotak 10 & 11 100% Persis Dengan Kotak Baris 1-3 */}
                            <div className="hidden lg:flex items-center justify-center shrink-0 px-2 opacity-0 pointer-events-none">
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 20l1.41-1.41L7.83 13H20v-2H7.83l5.58-5.59L12 4l-8 8z" />
                                </svg>
                            </div>
                            <div className="flex-1 hidden lg:block"></div>

                        </div>

                    </div>
                </section>

                {/* Jalur Seleksi Interaktif */}
                <section id="jalur-seleksi" className="py-16 bg-blue-50/60 border-y border-blue-100">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 reveal-on-scroll">
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-white px-3 py-1 rounded-full border border-blue-200">
                                KUOTA PENERIMAAN
                            </span>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight mt-3">Jalur Seleksi SPMB</h3>
                            <p className="text-sm text-slate-500 mt-2">Empat jalur penerimaan calon siswa baru SMAN 1 Slawi.</p>
                        </div>

                        <div className="flex flex-col gap-4">
                            {jalurSeleksi.map((j, idx) => (
                                <div 
                                    key={idx} 
                                    className={`p-6 rounded-3xl bg-white border border-blue-100 shadow-sm hover:shadow-xl hover:border-blue-300 transition transform hover:-translate-y-1 duration-200 cursor-pointer group reveal-on-scroll reveal-delay-${(idx + 1) * 100}`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                        <h4 className="font-extrabold text-slate-900 text-lg group-hover:text-blue-700 transition">{j.nama}</h4>
                                        <span className={`text-xs font-extrabold text-white ${j.badgeBg} px-3.5 py-1.5 rounded-full shadow-xs w-fit`}>
                                            {j.kuota}
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{j.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Persyaratan Dokumen & 7 Mapel Penilaian Vertikal */}
                <section id="persyaratan-berkas" className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12 reveal-on-scroll">
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                            DOKUMEN &amp; KETENTUAN
                        </span>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight mt-3">Persyaratan Berkas Pendaftaran</h3>
                        <p className="text-sm text-slate-500 mt-2">Daftar dokumen wajib dan 7 mata pelajaran kelayakan nilai rapor calon peserta didik.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        
                        {/* Box 1: Persyaratan Dokumen */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-lg transition duration-200 reveal-on-scroll">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-600/20">
                                    📄
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-900">Persyaratan Dokumen</h4>
                                    <p className="text-xs text-slate-500">Wajib dipersiapkan oleh calon peserta</p>
                                </div>
                            </div>
                            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                                {dokumenReq.map((doc, idx) => (
                                    <li key={idx} className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 font-semibold hover:bg-blue-50 hover:border-blue-200 transition duration-150">
                                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                                        <span>{doc}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 7 Mata Pelajaran Penilaian Vertikal (1 s.d 7) */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-lg transition duration-200 reveal-on-scroll reveal-delay-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-2xl bg-blue-800 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-800/20">
                                    📚
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-900">7 Mata Pelajaran Penilaian</h4>
                                    <p className="text-xs text-slate-500">Nilai Rapor Semester 1–5 (Nomor 1 s.d 7)</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-3 text-xs sm:text-sm text-slate-700">
                                {mapelPenilaian.map((m, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 font-semibold hover:bg-blue-50 hover:border-blue-200 transition duration-150">
                                        <span className="w-7 h-7 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                                            {idx + 1}
                                        </span>
                                        <span>{m}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </section>

                {/* Informasi Pendaftaran Online & Narahubung Interaktif */}
                <section id="kontak-informasi" className="py-16 bg-gradient-to-br from-blue-900 to-blue-950 text-white">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 reveal-on-scroll">
                        <div className="grid md:grid-cols-12 gap-8">
                            
                            {/* Pendaftaran & Link Resmi */}
                            <div className="md:col-span-6 space-y-4">
                                <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">AKSES RESMI PENDAFTARAN</span>
                                <h4 className="text-2xl font-black text-white">Informasi Pendaftaran Online</h4>
                                <p className="text-xs text-blue-100 leading-relaxed">
                                    Seluruh proses pendaftaran dilakukan secara daring. Calon peserta didik dan orang tua/wali dapat mengakses informasi lengkap melalui tautan berikut:
                                </p>
                                <div className="pt-2 space-y-3">
                                    <a 
                                        href="https://linktr.ee/SPMB25_SMANSAWI" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-3 bg-white text-blue-950 hover:bg-blue-50 font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 duration-200"
                                    >
                                        <span>🔗 Linktree SPMB SMANSAWI</span>
                                        <span>&rarr;</span>
                                    </a>
                                    <div>
                                        <a 
                                            href="https://chat.whatsapp.com/HzexyMQc1w4GxjHj1H2weH" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-3 bg-blue-800/80 hover:bg-blue-800 text-blue-200 font-bold text-xs px-5 py-3 rounded-2xl border border-blue-700 transition transform hover:scale-105 duration-200"
                                        >
                                            <span>💬 Grup WhatsApp Alternatif SPMB</span>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Narahubung Panitia */}
                            <div className="md:col-span-6 bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/15">
                                <h4 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                                    <span>📞 Narahubung Panitia SPMB</span>
                                </h4>
                                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                                    {narahubung.map((n, idx) => (
                                        <div key={idx} className="bg-blue-950/60 p-3.5 rounded-xl border border-white/10 hover:border-sky-400 transition duration-150">
                                            <p className="font-bold text-white">{n.nama}</p>
                                            <p className="text-sky-300 font-extrabold mt-0.5">{n.telp}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Section Media Sosial & Alamat Sekolah */}
                <section className="py-12 bg-slate-900 text-white border-b border-slate-800">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                        
                        <div className="text-center md:text-left border-b border-slate-800 pb-6">
                            <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">Kanal Media Sosial & Informasi Alamat Resmi SMAN 1 Slawi</h4>
                            <p className="text-sm text-slate-300 mt-1.5 flex items-center gap-2 justify-center md:justify-start">
                                <span>📍 Jl. Kh Wahid Hasyim No.1, Kalijembangan, Pakembaran, Kec. Slawi, Kabupaten Tegal, Jawa Tengah 52415</span>
                            </p>
                        </div>

                        {/* Grid Sosmed */}
                        <div className="grid sm:grid-cols-3 gap-4">
                            
                            {/* Website */}
                            <a 
                                href="https://sman1slawi.sch.id" 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex items-center gap-4 p-5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition transform hover:-translate-y-1 group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shrink-0 group-hover:scale-110 transition">
                                    🌐
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-blue-300 uppercase tracking-wider">Website Resmi</p>
                                    <p className="text-base font-extrabold text-white">sman1slawi.sch.id</p>
                                </div>
                            </a>

                            {/* Instagram */}
                            <a 
                                href="https://instagram.com/smansawi_official" 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex items-center gap-4 p-5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition transform hover:-translate-y-1 group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-pink-600 text-white flex items-center justify-center font-black text-xl shrink-0 group-hover:scale-110 transition">
                                    📸
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-pink-300 uppercase tracking-wider">Instagram Resmi</p>
                                    <p className="text-base font-extrabold text-white">@smansawi_official</p>
                                </div>
                            </a>

                            {/* YouTube */}
                            <a 
                                href="https://www.youtube.com/@sman1slawi" 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex items-center gap-4 p-5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition transform hover:-translate-y-1 group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-xl shrink-0 group-hover:scale-110 transition">
                                    ▶️
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-red-300 uppercase tracking-wider">YouTube Resmi</p>
                                    <p className="text-base font-extrabold text-white">SMAN 1 SLAWI</p>
                                </div>
                            </a>

                        </div>

                    </div>
                </section>

                {/* Footer Copyright */}
                <footer className="bg-slate-950 text-slate-400 py-10 text-center text-xs">
                    <div className="max-w-5xl mx-auto px-4 space-y-4">
                        <div className="flex items-center justify-center gap-2.5">
                            <LogoSmansawi className="w-8 h-8 inline" />
                            <span className="font-bold text-slate-200 text-sm">SMA Negeri 1 Slawi</span>
                        </div>
                        
                        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
                            Sistem Antrean & Informasi SPMB SMAN 1 Slawi ini merupakan hasil karya pengabdian masyarakat dari <br />
                            <strong className="text-sky-400 font-bold">Kelompok KKN Sahabat Sekolah Jawa Tengah 001 Universitas Muhammadiyah Yogyakarta Periode Genap 2025/2026</strong>.
                        </p>
                        
                        <div className="pt-3 border-t border-slate-900 text-slate-400 text-xs sm:text-sm font-semibold">
                            &copy; 2026 SMAN 1 Slawi &bull; Panitia SPMB dan KKN Sahabat Sekolah Jateng 001 UMY. All Rights Reserved.
                        </div>
                    </div>
                </footer>

            </div>
        </>
    );
}
