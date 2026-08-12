import GuruLayout from '@/Layouts/GuruLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Dashboard({
    selectedTanggal,
    selectedLoket,
    daftarTanggalTersedia = [],
    jadwalHariIni,
    daftarAntrean,
    antreanAktif,
    antreanBerikutnya,
    statistik,
    petugas,
}) {
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');

    const handleGantiTanggal = (e) => {
        const tgl = e.target.value;
        router.get(route('guru.dashboard'), { tanggal: tgl, loket: selectedLoket || '' }, { preserveState: true });
    };

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
            setCurrentDate(now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
        };
        updateClock();
        const timer = setInterval(updateClock, 1000);
        return () => clearInterval(timer);
    }, []);

    // Polling Real-time data antrean setiap 4 detik tanpa mereset UI
    useEffect(() => {
        const pollInterval = setInterval(() => {
            router.reload({ only: ['daftarAntrean', 'antreanAktif', 'antreanBerikutnya', 'statistik'] });
        }, 4000);
        return () => clearInterval(pollInterval);
    }, []);

    const daftarLoketOptions = [
        'Meja 1',
        'Meja 2',
        'Meja 3',
        'Meja 4',
        'Meja 5',
    ];

    const handlePilihLoket = (loketName) => {
        router.post(route('guru.pilih-loket'), { loket: loketName || '' });
    };

    const handlePanggilBerikutnya = () => {
        if (!antreanBerikutnya || !selectedLoket) return;
        router.post(route('guru.panggil'), {
            antrean_id: antreanBerikutnya.id,
            loket: selectedLoket,
        });
    };

    const handlePanggilSpesifik = (antreanId) => {
        if (!selectedLoket) return;
        router.post(route('guru.panggil'), {
            antrean_id: antreanId,
            loket: selectedLoket,
        });
    };

    const handlePanggilUlang = (targetAntreanId = null) => {
        const idToCall = targetAntreanId || antreanAktif?.id;
        if (!idToCall) return;
        router.post(route('guru.panggil-ulang'), {
            antrean_id: idToCall,
        });
    };

    const handleSelesai = () => {
        if (!antreanAktif) return;
        router.post(route('guru.selesai'), {
            antrean_id: antreanAktif.id,
        });
    };

    return (
        <GuruLayout>
            <Head title="Dashboard Guru - SPMB SMAN 1 Slawi" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                {/* HEADER UTAMA: LOGO / JUDUL + JAM REALTIME + TOMBOL RESET/GANTI MEJA */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-black text-xl shadow-md">
                            🏫
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-black text-slate-900 tracking-tight">SMA N 1 Slawi</h1>
                                <span className="bg-slate-100 text-slate-600 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-slate-200">
                                    Sistem Penerimaan Murid Baru
                                </span>
                            </div>
                            <p className="text-xs font-semibold text-slate-500 mt-0.5">
                                Panel Eksekutor Verifikasi Berkas Fisik &amp; Pemanggilan Loket
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* PILIH TANGGAL ANTREAN (UNTUK UJI COBA ATAU HARI TERTENTU) */}
                        <div className="bg-slate-100/80 px-3.5 py-2 rounded-2xl border border-slate-200 flex items-center gap-2 shadow-xs">
                            <span className="text-sm">📅</span>
                            <div>
                                <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Pilih Tanggal Antrean</span>
                                <select
                                    value={selectedTanggal || ''}
                                    onChange={handleGantiTanggal}
                                    className="bg-white text-xs font-black text-slate-900 border border-slate-300 rounded-xl px-2.5 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-xs"
                                >
                                    {daftarTanggalTersedia.length > 0 ? (
                                        daftarTanggalTersedia.map((item) => (
                                            <option key={item.id} value={item.tanggal} className="font-bold text-slate-900">
                                                {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </option>
                                        ))
                                    ) : (
                                        <option value={selectedTanggal} className="font-bold text-slate-900">{selectedTanggal}</option>
                                    )}
                                </select>
                            </div>
                        </div>

                        {/* WAKTU REALTIME */}
                        <div className="text-right bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/80">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Waktu Sistem</span>
                            <span className="text-xs font-black text-slate-800 font-mono">
                                🕒 {currentDate} <strong className="text-blue-700 ml-1">{currentTime}</strong>
                            </span>
                        </div>

                        {/* TOMBOL GANTI MEJA */}
                        {selectedLoket && (
                            <button
                                onClick={() => handlePilihLoket('')}
                                className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition flex items-center gap-1.5 border border-slate-200"
                            >
                                <span>🔄</span>
                                <span>Ganti Meja ({selectedLoket})</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* MODAL / TAMPILAN PILIH MEJA PERTAMA KALI */}
                {!selectedLoket ? (
                    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-blue-800 text-center space-y-6 max-w-3xl mx-auto my-8 relative overflow-hidden">
                        <div className="w-16 h-16 bg-blue-600/30 text-blue-300 rounded-3xl border border-blue-500/40 flex items-center justify-center mx-auto text-3xl font-black">
                            🖥️
                        </div>

                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-white">Silakan Pilih Meja Loket Anda</h2>
                            <p className="text-xs text-blue-200 font-medium max-w-md mx-auto mt-1 leading-relaxed">
                                Sebelum memulai pelayanan antrean siswa, tentukan meja/loket verifikasi tempat Anda bertugas hari ini.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4">
                            {daftarLoketOptions.map((loket) => (
                                <button
                                    key={loket}
                                    onClick={() => handlePilihLoket(loket)}
                                    className="py-4 px-3 rounded-2xl bg-white/10 hover:bg-blue-600 text-white font-black text-sm border border-white/15 hover:border-blue-400 shadow-md transition transform hover:-translate-y-1 active:translate-y-0"
                                >
                                    {loket}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* JIKA MEJA SUDAH DIPILIH: TAMPILKAN RINGKASAN & KONTROL MEJA */
                    <div className="space-y-6 animate-fade-in">

                        {/* 4 CARDS RINGKASAN STATISTIK (SEPERTI FOTO 1) */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            
                            {/* TOTAL ANTRIAN */}
                            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center font-black text-xl">
                                    👤
                                </div>
                                <div>
                                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Antrian</span>
                                    <span className="text-2xl font-black text-slate-900 font-mono">{statistik.total}</span>
                                </div>
                            </div>

                            {/* MENUNGGU */}
                            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xl">
                                    ⏳
                                </div>
                                <div>
                                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Menunggu</span>
                                    <span className="text-2xl font-black text-amber-700 font-mono">{statistik.menunggu}</span>
                                </div>
                            </div>

                            {/* DILAYANI */}
                            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl">
                                    🕒
                                </div>
                                <div>
                                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dilayani</span>
                                    <span className="text-2xl font-black text-blue-700 font-mono">{statistik.dilayani}</span>
                                </div>
                            </div>

                            {/* SELESAI */}
                            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xl">
                                    ✅
                                </div>
                                <div>
                                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Selesai</span>
                                    <span className="text-2xl font-black text-emerald-700 font-mono">{statistik.selesai}</span>
                                </div>
                            </div>

                        </div>

                        {/* UTAMA GRID SPLIT (FOTO 1: KONTROL MEJA X & DAFTAR ANTRIAN) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                            {/* PANEL KIRI (5 COLS): KONTROL MEJA X */}
                            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
                                
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                    <h2 className="text-base font-black text-slate-900 tracking-tight">
                                        Kontrol {selectedLoket}
                                    </h2>
                                </div>

                                {/* BOX STATUS SEDANG DILAYANI */}
                                <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-6 text-center space-y-2">
                                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        SEDANG DILAYANI
                                    </span>
                                    <div className="text-5xl font-black text-blue-900 tracking-tight font-mono py-1">
                                        {antreanAktif ? antreanAktif.nomor_urut : '---'}
                                    </div>
                                    {antreanAktif && (
                                        <p className="text-xs font-extrabold text-slate-700">
                                            {antreanAktif.user?.name} (NISN: {antreanAktif.user?.nisn})
                                        </p>
                                    )}
                                </div>

                                {/* TOMBOL PANGGIL BERIKUTNYA (UTAMA BIRU BESAR SEPERTI FOTO 1) */}
                                <div>
                                    <button
                                        type="button"
                                        disabled={!antreanBerikutnya}
                                        onClick={handlePanggilBerikutnya}
                                        className="w-full py-4 bg-blue-900 hover:bg-blue-950 disabled:bg-slate-300 text-white font-black rounded-2xl shadow-lg shadow-blue-900/20 text-base transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                                    >
                                        <span>›</span>
                                        <span>Panggil Berikutnya {antreanBerikutnya ? `(${antreanBerikutnya.nomor_urut})` : ''}</span>
                                    </button>
                                </div>

                                {/* DUA TOMBOL SEJAJAR: PANGGIL ULANG & SELESAI */}
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <button
                                        type="button"
                                        disabled={!antreanAktif}
                                        onClick={() => handlePanggilUlang(antreanAktif?.id)}
                                        className="py-3 px-4 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-700 font-extrabold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                                    >
                                        <span>🔊</span>
                                        <span>Panggil Ulang</span>
                                    </button>

                                    <button
                                        type="button"
                                        disabled={!antreanAktif}
                                        onClick={handleSelesai}
                                        className="py-3 px-4 rounded-2xl bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 font-extrabold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                                    >
                                        <span>✅</span>
                                        <span>Selesai</span>
                                    </button>
                                </div>

                            </div>

                            {/* PANEL KANAN (7 COLS): DAFTAR ANTRIAN */}
                            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                    <h2 className="text-base font-black text-slate-900 tracking-tight">
                                        Daftar Antrian
                                    </h2>
                                    <span className="text-xs font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl">
                                        📅 {selectedTanggal ? new Date(selectedTanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Hari Ini'}
                                    </span>
                                </div>

                                <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
                                    {daftarAntrean.length > 0 ? (
                                        daftarAntrean.map((item) => (
                                            <div
                                                key={item.id}
                                                className={`py-3.5 px-3 flex items-center justify-between transition rounded-2xl ${
                                                    item.status === 'Dilayani'
                                                        ? 'bg-blue-50/80 border-l-4 border-blue-600'
                                                        : item.status === 'Selesai'
                                                        ? 'opacity-60 bg-slate-50/50'
                                                        : 'hover:bg-slate-50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl font-mono font-black text-xs flex items-center justify-center ${
                                                        item.status === 'Dilayani'
                                                            ? 'bg-blue-900 text-white'
                                                            : item.status === 'Selesai'
                                                            ? 'bg-slate-200 text-slate-600'
                                                            : 'bg-slate-100 text-slate-800'
                                                    }`}>
                                                        {item.nomor_urut}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                                                            {item.user?.name || 'Siswa SPMB'}
                                                        </h4>
                                                        <p className="text-[11px] font-semibold text-slate-400">
                                                            NISN: {item.user?.nisn} | Estimasi: {item.estimasi_jam} WIB
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                        item.status === 'Dilayani'
                                                            ? 'bg-blue-100 text-blue-800 border border-blue-300 animate-pulse'
                                                            : item.status === 'Menunggu'
                                                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                                            : item.status === 'Selesai'
                                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                                            : 'bg-rose-100 text-rose-700'
                                                    }`}>
                                                        {item.status === 'Dilayani' && item.loket ? `📢 ${item.loket}` : item.status}
                                                    </span>

                                                    {/* TOMBOL PANGGIL SPESIFIK: HANYA TAMPIL UNTUK ANTREAN MENUNGGU */}
                                                    {item.status === 'Menunggu' && (
                                                        <button
                                                            onClick={() => handlePanggilSpesifik(item.id)}
                                                            className="px-3 py-1.5 rounded-xl text-xs font-black transition shadow-xs flex items-center gap-1 active:scale-95 border bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                                                            title={`Panggil antrean ${item.nomor_urut}`}
                                                        >
                                                            <span>📢</span>
                                                            <span>Panggil</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-16 text-center text-slate-400 text-xs font-bold">
                                            Belum ada antrian hari ini
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                    </div>
                )}

            </div>
        </GuruLayout>
    );
}
