import { Head, Link } from '@inertiajs/react';
import LogoSmansawi from '@/Components/LogoSmansawi';
import { useEffect, useState } from 'react';

export default function Welcome({ auth, landingSettings }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    const defaultTabs = [
        { id: 'hero', label: '1. Banner Hero Utama', icon: '🚀', deletable: false },
        { id: 'linimasa', label: '2. Alur Linimasa (Timeline)', icon: '📅', deletable: false },
        { id: 'jalur', label: '3. Jalur Seleksi & Kuota', icon: '🎯', deletable: false },
        { id: 'berkas', label: '4. Syarat Berkas & Mapel', icon: '📄', deletable: false },
        { id: 'kontak', label: '5. Link & Narahubung', icon: '📞', deletable: false },
        { id: 'sosmed', label: '6. Alamat & Media Sosial', icon: '🌐', deletable: false },
    ];

    const activeTabs = (landingSettings?.tabs && landingSettings.tabs.length > 0)
        ? landingSettings.tabs
        : defaultTabs;

    const getTabTargetId = (tabId) => {
        switch (tabId) {
            case 'hero': return 'hero';
            case 'linimasa': return 'alur-pendaftaran';
            case 'jalur': return 'jalur-seleksi';
            case 'berkas': return 'persyaratan-berkas';
            case 'kontak': return 'kontak-informasi';
            case 'sosmed': return 'sosmed-alamat';
            default: return tabId;
        }
    };

    const getTabNavLabel = (tab) => {
        if (tab.id === 'hero') return 'Beranda';
        if (tab.id === 'linimasa') return 'Alur Pendaftaran';
        if (tab.id === 'jalur') return 'Jalur Seleksi';
        if (tab.id === 'berkas') return 'Persyaratan Berkas';
        if (tab.id === 'kontak') return 'Kontak & Info';
        if (tab.id === 'sosmed') return 'Alamat & Sosmed';
        return tab.label ? tab.label.replace(/^\d+\.\s*/, '') : 'Tab';
    };

    const linimasa = landingSettings?.linimasa || [
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

    const jalurSeleksi = landingSettings?.jalurSeleksi || [
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

    const dokumenReq = landingSettings?.dokumenReq || [
        'Kartu Keluarga (Asli + Fotokopi)',
        'Surat Keterangan Rapor Semester 1–5 (Asli)',
        'Akta Kelahiran (Asli + Fotokopi)',
        'Surat Keterangan Lulus (Asli)',
        'Buku Rapor (Asli)',
        'Sertifikat Hasil TKA (Asli)',
        'Sertifikat Prestasi (jika memiliki)',
    ];

    const mapelPenilaian = landingSettings?.mapelPenilaian || [
        'Pendidikan Agama & Budi Pekerti',
        'PPKn',
        'Bahasa Indonesia',
        'Matematika',
        'IPA',
        'IPS',
        'Bahasa Inggris',
    ];

    const narahubung = landingSettings?.narahubung || [
        { nama: 'Lulus Wijayanto, S.Pd', telp: '0815-7517-5363' },
        { nama: 'Rusmawati, S.Pd', telp: '0856-4088-2285' },
        { nama: 'Afgriz Prasetiyawati, S.Pd', telp: '0812-2503-0765' },
        { nama: 'Dyah Ayu Triana, S.Si', telp: '0852-2634-7402' },
    ];

    return (
        <>
            <Head title={landingSettings?.site_title || "Portal Resmi SPMB - SMAN 1 Slawi"} />

            <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white scroll-smooth">
                
                {/* Header Navbar Biru Modern Interaktif */}
                <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
                            
                            {/* Logo Asli SMAN 1 Slawi (Sisi Kiri) */}
                            <div className="min-w-0 flex items-center">
                                <a href="#" className="flex items-center gap-2.5 sm:gap-3.5 group shrink-0">
                                    <div className="transition transform group-hover:scale-105 duration-200">
                                        <LogoSmansawi className="w-9 h-9 sm:w-12 sm:h-12" />
                                    </div>
                                    <div>
                                        <h1 className="font-black text-slate-900 text-sm sm:text-xl tracking-tight leading-tight group-hover:text-blue-700 transition">
                                            SMA NEGERI 1 SLAWI
                                        </h1>
                                        <p className="text-[10px] sm:text-xs text-blue-600 font-bold uppercase tracking-wider">
                                            {landingSettings?.header_subtitle || 'PORTAL RESMI SPMB'}
                                        </p>
                                    </div>
                                </a>
                            </div>

                            {/* Navigasi Tengah — Desktop Only */}
                            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 text-xs font-extrabold text-slate-600 shrink-0">
                                {activeTabs.filter(t => t.id !== 'hero').map((t) => {
                                    const targetId = getTabTargetId(t.id);
                                    const navLabel = getTabNavLabel(t);
                                    return (
                                        <a
                                            key={t.id}
                                            href={`#${targetId}`}
                                            onClick={(e) => handleNavClick(e, targetId)}
                                            className="px-3.5 py-2 rounded-xl hover:bg-white hover:shadow-xs text-slate-700 hover:text-blue-700 font-bold transition duration-200"
                                        >
                                            {navLabel}
                                        </a>
                                    );
                                })}
                            </nav>

                            {/* Tombol Header Interaktif (Sisi Kanan) + Hamburger Mobile */}
                            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                                {/* Auth Buttons — Hidden on very small, visible sm+ */}
                                <div className="hidden sm:flex items-center gap-3">
                                    {auth?.user ? (
                                        auth.user.role === 'admin' ? (
                                            <Link
                                                href={route('admin.dashboard')}
                                                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition duration-200"
                                            >
                                                Dashboard Admin →
                                            </Link>
                                        ) : auth.user.role === 'guru' ? (
                                            <Link
                                                href={route('guru.dashboard')}
                                                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition duration-200"
                                            >
                                                Dashboard Guru →
                                            </Link>
                                        ) : (
                                            <Link
                                                href={route('siswa.etiket')}
                                                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition duration-200"
                                            >
                                                Buka E-Tiket →
                                            </Link>
                                        )
                                    ) : (
                                        <>
                                            <Link
                                                href={route('login')}
                                                className="px-4 py-2.5 rounded-xl text-slate-700 hover:text-blue-700 hover:bg-blue-50 font-bold text-sm transition duration-200 border border-slate-200 hover:border-blue-300"
                                            >
                                                Masuk
                                            </Link>
                                            <Link
                                                href={route('register')}
                                                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold text-sm shadow-md shadow-blue-700/25 hover:shadow-lg hover:shadow-blue-700/40 transition transform hover:-translate-y-0.5 duration-200"
                                            >
                                                Daftar
                                            </Link>
                                        </>
                                    )}
                                </div>

                                {/* Hamburger Button — Visible on mobile (< lg) */}
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 transition duration-200"
                                    aria-label="Toggle menu"
                                >
                                    {mobileMenuOpen ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* Mobile Slide-Down Navigation Panel */}
                    <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                        mobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                        <div className="px-4 pt-2 pb-5 border-t border-slate-200/80 bg-white/95 backdrop-blur-xl space-y-2">
                            {/* Mobile Nav Links */}
                            <div className="flex flex-col gap-1">
                                {activeTabs.filter(t => t.id !== 'hero').map((t) => {
                                    const targetId = getTabTargetId(t.id);
                                    const navLabel = getTabNavLabel(t);
                                    return (
                                        <a
                                            key={t.id}
                                            href={`#${targetId}`}
                                            onClick={(e) => { handleNavClick(e, targetId); setMobileMenuOpen(false); }}
                                            className="px-4 py-3 rounded-xl text-sm font-bold text-slate-700 hover:text-blue-700 hover:bg-blue-50/80 transition duration-200"
                                        >
                                            {navLabel}
                                        </a>
                                    );
                                })}
                            </div>

                            {/* Mobile Auth Buttons */}
                            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                                {auth?.user ? (
                                    auth.user.role === 'admin' ? (
                                        <Link href={route('admin.dashboard')} className="w-full text-center px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition">
                                            Dashboard Admin →
                                        </Link>
                                    ) : auth.user.role === 'guru' ? (
                                        <Link href={route('guru.dashboard')} className="w-full text-center px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition">
                                            Dashboard Guru →
                                        </Link>
                                    ) : (
                                        <Link href={route('siswa.etiket')} className="w-full text-center px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition">
                                            Buka E-Tiket Anda →
                                        </Link>
                                    )
                                ) : (
                                    <>
                                        <Link href={route('login')} className="w-full text-center px-5 py-3 rounded-xl text-slate-700 font-bold text-sm border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition">
                                            Masuk
                                        </Link>
                                        <Link href={route('register')} className="w-full text-center px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold text-sm shadow-md transition">
                                            Daftar
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* MAIN CONTENT SECTIONS: DYNAMICALLY RENDERED IN ADMIN CONFIG TAB ORDER */}
                {activeTabs.map((tab, index) => {
                    const isBlue = index % 2 === 0;

                    // 1. HERO SECTION
                    if (tab.id === 'hero') {
                        return (
                            <section key="hero" id="hero" className={isBlue 
                                ? "relative py-16 sm:py-24 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white overflow-hidden shadow-xl"
                                : "relative py-16 sm:py-24 bg-gradient-to-br from-white via-slate-50 to-blue-50/50 text-slate-800 overflow-hidden shadow-sm border-b border-slate-200"
                            }>
                                <div className={`absolute inset-0 opacity-15 [background-size:24px_24px] animate-pulse ${isBlue ? 'bg-[radial-gradient(#fff_1px,transparent_1px)]' : 'bg-[radial-gradient(#0284c7_1px,transparent_1px)]'}`} />
                                
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                                    <div className="max-w-3xl mx-auto text-center space-y-6 reveal-on-scroll">
                                        
                                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider animate-bounce ${
                                            isBlue 
                                                ? "bg-white/15 border border-white/20 text-blue-100" 
                                                : "bg-blue-50 border border-blue-100 text-blue-700"
                                        }`}>
                                            <span>{landingSettings?.hero_badge || '✨ Penerimaan Murid Baru'}</span>
                                        </div>
 
                                        <h2 className={`text-3xl sm:text-5xl font-black tracking-tight leading-tight ${isBlue ? 'text-white' : 'text-slate-900'}`}>
                                            {landingSettings?.hero_title || 'Sistem Penerimaan Murid Baru (SPMB)'} <br />
                                            <span className={isBlue ? "text-sky-300 drop-shadow" : "text-blue-750 drop-shadow-xs"}>
                                                {landingSettings?.hero_subtitle || 'SMA Negeri 1 Slawi'}
                                            </span>
                                        </h2>
 
                                        <p className={`text-sm sm:text-base leading-relaxed max-w-2xl mx-auto ${
                                            isBlue ? "text-blue-105" : "text-slate-650"
                                        }`}>
                                            {landingSettings?.hero_desc || 'SMAN 1 Slawi resmi membuka pendaftaran secara daring melalui platform SPMB Jateng dengan mengedepankan prinsip transparan, akuntabel, dan bebas dari praktik titip maupun intervensi (No Titip, No Jastip).'}
                                        </p>
 
                                        <div className="pt-1">
                                            <span className={`inline-block text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-xl border tracking-widest uppercase transition cursor-default ${
                                                isBlue 
                                                    ? "bg-white/10 text-sky-200 border-white/20 hover:bg-white/20" 
                                                    : "bg-blue-50 text-blue-850 border-blue-200 hover:bg-blue-100/50"
                                            }`}>
                                                {landingSettings?.hero_slogan || 'Berkarakter, Berprestasi, Unggul, Terdepan!'}
                                            </span>
                                        </div>
 
                                        {/* Tombol Hero */}
                                        <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
                                            {auth?.user ? (
                                                auth.user.role === 'admin' ? (
                                                    <Link
                                                        href={route('admin.dashboard')}
                                                        className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-base shadow-xl transition transform hover:-translate-y-1 hover:scale-105 duration-200 ${
                                                            isBlue 
                                                                ? "bg-white text-blue-900 hover:bg-blue-50 shadow-blue-950/30" 
                                                                : "bg-blue-600 text-white hover:bg-blue-750 shadow-blue-600/20"
                                                        }`}
                                                    >
                                                        Dashboard Admin →
                                                    </Link>
                                                ) : auth.user.role === 'guru' ? (
                                                    <Link
                                                        href={route('guru.dashboard')}
                                                        className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-base shadow-xl transition transform hover:-translate-y-1 hover:scale-105 duration-200 ${
                                                            isBlue 
                                                                ? "bg-white text-blue-900 hover:bg-blue-50 shadow-blue-950/30" 
                                                                : "bg-blue-600 text-white hover:bg-blue-750 shadow-blue-600/20"
                                                        }`}
                                                    >
                                                        Dashboard Guru →
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        href={route('siswa.etiket')}
                                                        className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-base shadow-xl transition transform hover:-translate-y-1 hover:scale-105 duration-200 ${
                                                            isBlue 
                                                                ? "bg-white text-blue-900 hover:bg-blue-50 shadow-blue-950/30" 
                                                                : "bg-blue-600 text-white hover:bg-blue-750 shadow-blue-600/20"
                                                        }`}
                                                    >
                                                        Buka E-Tiket Anda →
                                                    </Link>
                                                )
                                            ) : (
                                                <>
                                                    <Link
                                                        href={route('register')}
                                                        className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-base shadow-xl transition transform hover:-translate-y-1 hover:scale-105 duration-200 ${
                                                            isBlue 
                                                                ? "bg-white text-blue-900 hover:bg-blue-50 shadow-blue-950/30" 
                                                                : "bg-blue-600 text-white hover:bg-blue-750 shadow-blue-600/20"
                                                        }`}
                                                    >
                                                        Daftar Akun NISN
                                                    </Link>
                                                    <Link
                                                        href={route('login')}
                                                        className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base border backdrop-blur-md transition transform hover:-translate-y-1 duration-200 ${
                                                            isBlue 
                                                                ? "bg-blue-950/50 text-white border-white/20 hover:bg-blue-950/70" 
                                                                : "bg-slate-100 text-slate-800 border-slate-250 hover:bg-slate-200"
                                                        }`}
                                                    >
                                                        Masuk Ke Akun Siswa
                                                    </Link>
                                                </>
                                            )}
                                        </div>
 
                                    </div>
                                </div>
                            </section>
                        );
                    }

                    // 2. ALUR LINIMASA SECTION
                    if (tab.id === 'linimasa') {
                        return (
                            <section key="linimasa" id="alur-pendaftaran" className={`py-20 border-t ${
                                isBlue ? 'bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white border-blue-900/50' : 'bg-white text-slate-800 border-slate-200'
                            }`}>
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="text-center max-w-2xl mx-auto mb-16 reveal-on-scroll">
                                        <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                                            isBlue ? 'text-blue-300 bg-blue-950/60 border-blue-900/50' : 'text-blue-600 bg-blue-50 border-blue-200'
                                        }`}>
                                            ALUR PELAKSANAAN
                                        </span>
                                        <h3 className={`text-3xl font-black tracking-tight mt-3 ${isBlue ? 'text-white' : 'text-slate-900'}`}>
                                            Alur Pendaftaran SPMB Online
                                        </h3>
                                        <p className={`text-sm mt-2 ${isBlue ? 'text-slate-400' : 'text-slate-500'}`}>
                                            Urutan langkah demi langkah proses pendaftaran calon siswa baru.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal-on-scroll">
                                        {linimasa.map((item, idx) => (
                                            <div 
                                                key={idx} 
                                                className={`p-6 rounded-3xl border-2 transition transform hover:-translate-y-1 duration-300 group flex flex-col justify-between min-h-[190px] ${
                                                    isBlue 
                                                        ? 'bg-white/10 backdrop-blur-md border-white/15 text-white hover:border-white/30 shadow-md' 
                                                        : 'bg-white border-blue-100 text-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500'
                                                }`}
                                            >
                                                <div>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className={`w-10 h-10 rounded-2xl font-black text-base flex items-center justify-center shadow-md group-hover:scale-110 transition ${
                                                            isBlue ? 'bg-blue-600 text-white shadow-blue-900/30' : 'bg-blue-600 text-white shadow-blue-600/30'
                                                        }`}>
                                                            {item.tahap || (idx + 1)}
                                                        </div>
                                                        <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${
                                                            isBlue ? 'text-blue-300 bg-blue-950/80 border-blue-900/40' : 'text-blue-700 bg-blue-50 border-blue-200'
                                                        }`}>
                                                            📅 {item.tanggal}
                                                        </span>
                                                    </div>
                                                    <h4 className={`font-black text-lg mb-1 ${isBlue ? 'text-white' : 'text-slate-900'}`}>{item.agenda}</h4>
                                                    <p className={`text-xs leading-relaxed ${isBlue ? 'text-slate-300' : 'text-slate-650'}`}>{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        );
                    }

                    // 3. JALUR SELEKSI SECTION
                    if (tab.id === 'jalur') {
                        return (
                            <section key="jalur" id="jalur-seleksi" className={`py-16 border-t ${
                                isBlue ? 'bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white border-blue-900/50' : 'bg-blue-50/60 text-slate-800 border-blue-100'
                            }`}>
                                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 reveal-on-scroll">
                                    <div className="text-center max-w-2xl mx-auto mb-12">
                                        <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                                            isBlue ? 'text-blue-300 bg-blue-950/60 border-blue-900/50' : 'text-blue-600 bg-white border-blue-200'
                                        }`}>
                                            KUOTA PENERIMAAN
                                        </span>
                                        <h3 className={`text-3xl font-black tracking-tight mt-3 ${isBlue ? 'text-white' : 'text-slate-900'}`}>
                                            Jalur Seleksi SPMB
                                        </h3>
                                        <p className={`text-sm mt-2 ${isBlue ? 'text-slate-400' : 'text-slate-500'}`}>
                                            Empat jalur penerimaan calon siswa baru SMAN 1 Slawi.
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        {jalurSeleksi.map((j, idx) => (
                                            <div 
                                                key={idx} 
                                                className={`p-6 rounded-3xl border transition transform hover:-translate-y-1 duration-205 cursor-pointer group reveal-on-scroll reveal-delay-${(idx + 1) * 100} ${
                                                    isBlue 
                                                        ? 'bg-white/10 backdrop-blur-md border-white/15 text-white hover:border-white/30 shadow-md' 
                                                        : 'bg-white border-blue-100 text-slate-800 shadow-sm hover:shadow-xl hover:border-blue-300'
                                                }`}
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                                    <h4 className={`font-extrabold text-lg group-hover:text-blue-500 transition ${isBlue ? 'text-white' : 'text-slate-900'}`}>
                                                        {j.nama}
                                                    </h4>
                                                    <span className={`text-xs font-extrabold text-white ${j.badgeBg || 'bg-blue-600'} px-3.5 py-1.5 rounded-full shadow-xs w-fit`}>
                                                        {j.kuota}
                                                    </span>
                                                </div>
                                                <p className={`text-xs sm:text-sm leading-relaxed ${isBlue ? 'text-slate-350' : 'text-slate-600'}`}>
                                                    {j.desc}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        );
                    }

                    // 4. PERSYARATAN BERKAS SECTION
                    if (tab.id === 'berkas') {
                        return (
                            <section key="berkas" id="persyaratan-berkas" className={`py-16 border-t ${
                                isBlue ? 'bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white border-blue-900/50' : 'bg-white text-slate-800 border-slate-200'
                            }`}>
                                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="text-center max-w-2xl mx-auto mb-12 reveal-on-scroll">
                                        <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                                            isBlue ? 'text-blue-300 bg-blue-950/60 border-blue-900/50' : 'text-blue-600 bg-blue-50 border-blue-200'
                                        }`}>
                                            DOKUMEN &amp; KETENTUAN
                                        </span>
                                        <h3 className={`text-3xl font-black tracking-tight mt-3 ${isBlue ? 'text-white' : 'text-slate-900'}`}>
                                            Persyaratan Berkas Pendaftaran
                                        </h3>
                                        <p className={`text-sm mt-2 ${isBlue ? 'text-slate-400' : 'text-slate-500'}`}>
                                            Daftar dokumen wajib dan 7 mata pelajaran kelayakan nilai rapor calon peserta didik.
                                        </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8 items-start">
                                        
                                        {/* Box 1: Persyaratan Dokumen */}
                                        <div className={`p-8 rounded-3xl border transition duration-200 reveal-on-scroll ${
                                            isBlue ? 'bg-white/10 backdrop-blur-md border-white/15 text-white shadow-md' : 'bg-white border-slate-200/90 shadow-sm hover:shadow-lg text-slate-800'
                                        }`}>
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-600/20">
                                                    📄
                                                </div>
                                                <div>
                                                    <h4 className={`text-xl font-black ${isBlue ? 'text-white' : 'text-slate-900'}`}>Persyaratan Dokumen</h4>
                                                    <p className={`text-xs ${isBlue ? 'text-slate-400' : 'text-slate-500'}`}>Wajib dipersiapkan oleh calon peserta</p>
                                                </div>
                                            </div>
                                            <ul className="space-y-3 text-xs sm:text-sm">
                                                {dokumenReq.map((doc, idx) => (
                                                    <li key={idx} className={`flex items-center gap-3 p-3.5 rounded-2xl border font-semibold transition duration-150 ${
                                                        isBlue 
                                                            ? 'bg-white/5 border-white/10 text-slate-100 hover:bg-white/10' 
                                                            : 'bg-slate-50 border-slate-200/60 text-slate-700 hover:bg-blue-50 hover:border-blue-200'
                                                    }`}>
                                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                                            isBlue ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                                                        }`}>✓</span>
                                                        <span>{doc}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* 7 Mata Pelajaran Penilaian Vertikal */}
                                        <div className={`p-8 rounded-3xl border transition duration-200 reveal-on-scroll reveal-delay-200 ${
                                            isBlue ? 'bg-white/10 backdrop-blur-md border-white/15 text-white shadow-md' : 'bg-white border-slate-200/90 shadow-sm hover:shadow-lg text-slate-800'
                                        }`}>
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-2xl bg-blue-800 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-800/20">
                                                    📚
                                                </div>
                                                <div>
                                                    <h4 className={`text-xl font-black ${isBlue ? 'text-white' : 'text-slate-900'}`}>7 Mata Pelajaran Penilaian</h4>
                                                    <p className={`text-xs ${isBlue ? 'text-slate-400' : 'text-slate-500'}`}>Nilai Rapor Semester 1–5 (Nomor 1 s.d 7)</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col gap-3 text-xs sm:text-sm">
                                                {mapelPenilaian.map((m, idx) => (
                                                    <div key={idx} className={`flex items-center gap-3 p-3.5 rounded-2xl border font-semibold transition duration-150 ${
                                                        isBlue 
                                                            ? 'bg-white/5 border-white/10 text-slate-100 hover:bg-white/10' 
                                                            : 'bg-slate-55 border-slate-200/60 text-slate-700 hover:bg-blue-50 hover:border-blue-200'
                                                    }`}>
                                                        <span className="w-7 h-7 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                                                            {idx + 1}
                                                        </span>
                                                        <span>{m}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </section>
                        );
                    }

                    // 5. KONTAK & INFORMASI SECTION
                    if (tab.id === 'kontak') {
                        return (
                            <section key="kontak" id="kontak-informasi" className={`py-16 border-t ${
                                isBlue 
                                    ? 'bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white border-blue-900' 
                                    : 'bg-slate-55 text-slate-950 border-slate-200'
                            }`}>
                                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 reveal-on-scroll">
                                    <div className="grid md:grid-cols-12 gap-8">
                                        
                                        {/* Pendaftaran & Link Resmi */}
                                        <div className="md:col-span-6 space-y-4">
                                            <span className={`text-xs font-bold uppercase tracking-widest ${isBlue ? 'text-blue-300' : 'text-blue-600'}`}>
                                                AKSES RESMI PENDAFTARAN
                                            </span>
                                            <h4 className={`text-2xl font-black ${isBlue ? 'text-white' : 'text-slate-900'}`}>
                                                Informasi Pendaftaran Online
                                            </h4>
                                            <p className={`text-xs leading-relaxed ${isBlue ? 'text-blue-150' : 'text-slate-600'}`}>
                                                Seluruh proses pendaftaran dilakukan secara daring. Calon peserta didik dan orang tua/wali dapat mengakses informasi lengkap melalui tautan berikut:
                                            </p>
                                            <div className="pt-2 space-y-3">
                                                {landingSettings?.linktree_url && (
                                                    <a 
                                                        href={landingSettings.linktree_url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className={`inline-flex items-center gap-3 font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 duration-200 ${
                                                            isBlue 
                                                                ? 'bg-white text-blue-950 hover:bg-blue-50 shadow-blue-950/20' 
                                                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20'
                                                        }`}
                                                    >
                                                        <span>🔗 Linktree SPMB SMANSAWI</span>
                                                        <span>&rarr;</span>
                                                    </a>
                                                )}
                                                {landingSettings?.wa_group_url && (
                                                    <div>
                                                        <a 
                                                            href={landingSettings.wa_group_url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className={`inline-flex items-center gap-3 font-bold text-xs px-5 py-3 rounded-2xl border transition transform hover:scale-105 duration-200 ${
                                                                isBlue 
                                                                    ? 'bg-blue-800/80 hover:bg-blue-850 text-blue-200 border-blue-750' 
                                                                    : 'bg-blue-55 hover:bg-blue-100/70 text-blue-700 border-blue-200'
                                                            }`}
                                                        >
                                                            <span>💬 Grup WhatsApp Alternatif SPMB</span>
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Narahubung Panitia */}
                                        <div className={`md:col-span-6 p-6 sm:p-8 rounded-3xl border ${
                                            isBlue ? 'bg-white/10 backdrop-blur-md border-white/15' : 'bg-white border-slate-200 shadow-sm'
                                        }`}>
                                            <h4 className={`text-lg font-black mb-4 flex items-center gap-2 ${isBlue ? 'text-white' : 'text-slate-950'}`}>
                                                <span>📞 Narahubung Panitia SPMB</span>
                                            </h4>
                                            <div className="grid sm:grid-cols-2 gap-3 text-xs">
                                                {narahubung.map((n, idx) => (
                                                    <div key={idx} className={`p-3.5 rounded-xl border transition duration-150 ${
                                                        isBlue 
                                                            ? 'bg-blue-950/60 border-white/10 hover:border-sky-400' 
                                                            : 'bg-white border-slate-200 hover:border-blue-500 shadow-xs'
                                                    }`}>
                                                        <p className={`font-bold ${isBlue ? 'text-white' : 'text-slate-900'}`}>{n.nama}</p>
                                                        <p className={`font-extrabold mt-0.5 ${isBlue ? 'text-sky-305' : 'text-blue-600'}`}>{n.telp}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </section>
                        );
                    }

                    // 6. SOSMED & ALAMAT SECTION
                    if (tab.id === 'sosmed') {
                        return (
                            <section key="sosmed" id="sosmed-alamat" className={`py-12 border-t ${
                                isBlue ? 'bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white border-blue-900/50' : 'bg-white text-slate-800 border-slate-200'
                            }`}>
                                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 reveal-on-scroll">
                                    
                                    <div className={`text-center md:text-left border-b pb-6 reveal-on-scroll ${isBlue ? 'border-white/10' : 'border-slate-200'}`}>
                                        <h4 className={`text-xl sm:text-2xl font-black tracking-tight ${isBlue ? 'text-white' : 'text-slate-900'}`}>
                                            Kanal Media Sosial &amp; Informasi Alamat Resmi SMAN 1 Slawi
                                        </h4>
                                        <p className={`text-sm mt-1.5 flex items-center gap-2 justify-center md:justify-start ${isBlue ? 'text-slate-350' : 'text-slate-650'}`}>
                                            <span>📍 {landingSettings?.alamat || 'Jl. Kh Wahid Hasyim No.1, Kalijembangan, Pakembaran, Kec. Slawi, Kabupaten Tegal, Jawa Tengah 52415'}</span>
                                        </p>
                                    </div>

                                    {/* Grid Sosmed */}
                                    <div className="grid sm:grid-cols-3 gap-4 reveal-on-scroll">
                                        
                                        {/* Website */}
                                        <a 
                                            href={landingSettings?.website_url || "https://sman1slawi.sch.id"} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className={`flex items-center gap-4 p-5 rounded-2xl border transition transform hover:-translate-y-1 group reveal-on-scroll ${
                                                isBlue ? 'bg-white/10 backdrop-blur-md border-white/15 hover:border-white/30' : 'bg-slate-50 hover:bg-blue-50 border-slate-200 hover:border-blue-300'
                                            }`}
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shrink-0 group-hover:scale-110 transition">
                                                🌐
                                            </div>
                                            <div>
                                                <p className={`text-xs font-bold uppercase tracking-wider ${isBlue ? 'text-blue-300' : 'text-blue-650'}`}>Website Resmi</p>
                                                <p className={`text-base font-extrabold ${isBlue ? 'text-white' : 'text-slate-900'}`}>sman1slawi.sch.id</p>
                                            </div>
                                        </a>

                                        {/* Instagram */}
                                        <a 
                                            href={landingSettings?.instagram_url || "https://instagram.com/smansawi_official"} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className={`flex items-center gap-4 p-5 rounded-2xl border transition transform hover:-translate-y-1 group reveal-on-scroll reveal-delay-100 ${
                                                isBlue ? 'bg-white/10 backdrop-blur-md border-white/15 hover:border-white/30' : 'bg-slate-50 hover:bg-blue-50 border-slate-200 hover:border-blue-300'
                                            }`}
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-pink-600 text-white flex items-center justify-center font-black text-xl shrink-0 group-hover:scale-110 transition">
                                                📸
                                            </div>
                                            <div>
                                                <p className={`text-xs font-bold uppercase tracking-wider ${isBlue ? 'text-pink-300' : 'text-pink-600'}`}>Instagram Resmi</p>
                                                <p className={`text-base font-extrabold ${isBlue ? 'text-white' : 'text-slate-900'}`}>@smansawi_official</p>
                                            </div>
                                        </a>

                                        {/* YouTube */}
                                        <a 
                                            href={landingSettings?.youtube_url || "https://www.youtube.com/@sman1slawi"} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className={`flex items-center gap-4 p-5 rounded-2xl border transition transform hover:-translate-y-1 group reveal-on-scroll reveal-delay-200 ${
                                                isBlue ? 'bg-white/10 backdrop-blur-md border-white/15 hover:border-white/30' : 'bg-slate-50 hover:bg-blue-50 border-slate-200 hover:border-blue-300'
                                            }`}
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-xl shrink-0 group-hover:scale-110 transition">
                                                ▶️
                                            </div>
                                            <div>
                                                <p className={`text-xs font-bold uppercase tracking-wider ${isBlue ? 'text-red-305' : 'text-red-650'}`}>YouTube Resmi</p>
                                                <p className={`text-base font-extrabold ${isBlue ? 'text-white' : 'text-slate-900'}`}>SMAN 1 SLAWI</p>
                                            </div>
                                        </a>

                                    </div>

                                </div>
                            </section>
                        );
                    }

                    // 7. CUSTOM TAB SECTION (DYNAMICALY RENDERED FOR ANY CREATED TAB)
                    return (
                        <section key={tab.id} id={tab.id} className={`py-16 border-t ${
                            isBlue ? 'bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white border-blue-900/50' : 'bg-white text-slate-800 border-slate-200'
                        }`}>
                            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 reveal-on-scroll">
                                <div className={`p-8 sm:p-10 rounded-3xl border space-y-4 ${
                                    isBlue ? 'bg-white/10 backdrop-blur-md border-white/15 text-white shadow-xl' : 'bg-slate-50 border-slate-200 text-slate-900 shadow-md'
                                }`}>
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{tab.icon || '📌'}</span>
                                        <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                                            isBlue ? 'text-amber-400 bg-amber-400/10 border-amber-400/30' : 'text-blue-600 bg-blue-50 border-blue-200'
                                        }`}>
                                            {tab.subtitle || tab.label}
                                        </span>
                                    </div>
                                    <h3 className={`text-2xl sm:text-3xl font-black tracking-tight ${isBlue ? 'text-white' : 'text-slate-900'}`}>
                                        {tab.title || tab.label}
                                    </h3>
                                    <p className={`text-sm leading-relaxed whitespace-pre-line font-medium ${isBlue ? 'text-slate-350' : 'text-slate-650'}`}>
                                        {tab.content || 'Informasi belum diisi oleh administrator.'}
                                    </p>
                                </div>
                            </div>
                        </section>
                    );
                })}

                {/* Footer Copyright */}
                <footer className="bg-slate-950 text-slate-400 py-10 text-center text-xs">
                    <div className="max-w-5xl mx-auto px-4 space-y-4">
                        <div className="flex items-center justify-center gap-2.5">
                            <LogoSmansawi className="w-8 h-8 inline" />
                            <span className="font-bold text-slate-200 text-sm">SMA Negeri 1 Slawi</span>
                        </div>
                        
                        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
                            {landingSettings?.footer_desc && landingSettings.footer_desc.includes("Kelompok KKN") ? (
                                <>
                                    Sistem Antrean &amp; Informasi SPMB SMAN 1 Slawi ini merupakan hasil karya pengabdian masyarakat dari <br />
                                    <span className="font-extrabold bg-gradient-to-r from-blue-400 via-sky-300 to-sky-400 bg-clip-text text-transparent">
                                        Kelompok KKN Sahabat Sekolah Jawa Tengah 001 Universitas Muhammadiyah Yogyakarta Periode Genap 2025/2026
                                    </span>
                                </>
                            ) : (
                                landingSettings?.footer_desc || (
                                    <>
                                        Sistem Antrean &amp; Informasi SPMB SMAN 1 Slawi ini merupakan hasil karya pengabdian masyarakat dari <br />
                                        <span className="font-extrabold bg-gradient-to-r from-blue-400 via-sky-300 to-sky-400 bg-clip-text text-transparent">
                                            Kelompok KKN Sahabat Sekolah Jawa Tengah 001 Universitas Muhammadiyah Yogyakarta Periode Genap 2025/2026
                                        </span>
                                    </>
                                )
                            )}
                        </p>
                        
                        <div className="pt-3 border-t border-slate-900 text-slate-400 text-xs sm:text-sm font-semibold">
                            {landingSettings?.footer_copyright || '© 2026 SMAN 1 Slawi • Panitia SPMB dan KKN Sahabat Sekolah Jateng 001 UMY. All Rights Reserved.'}
                        </div>
                    </div>
                </footer>

            </div>
        </>
    );
}
