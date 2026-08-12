import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ auth, antreanSiswa, jadwalTersedia, errors }) {
    
    // Setel bulan kalender ke jadwal pertama yang tersedia, atau bulan ini
    const initialDate = jadwalTersedia.length > 0 ? new Date(jadwalTersedia[0].tanggal) : new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
    const [selectedJadwal, setSelectedJadwal] = useState(null);

    // State Modal Pembatalan Antrean
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [customReason, setCustomReason] = useState('');

    const { data: cancelData, setData: setCancelData, post: postCancel, processing: cancelProcessing, reset: resetCancel } = useForm({
        antrean_id: antreanSiswa?.id || '',
        alasan_batal: '',
    });

    // Fungsi Navigasi Bulan
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

    // Nama-nama Hari & Bulan
    const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const namaHariSingkat = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

    // Logika Pembuatan Grid Kalender
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();

    const calendarCells = [];
    
    // Kotak kosong sebelum tanggal 1
    for (let i = 0; i < startDay; i++) {
        calendarCells.push(<div key={`empty-${i}`} className="p-2 md:p-3"></div>);
    }

    // Kotak Tanggal
    for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(year, month, i);
        const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        
        const jadwal = jadwalTersedia.find(j => j.tanggal === dateString);
        let status = 'kosong'; 
        let sisaKuota = 0;

        if (jadwal) {
            sisaKuota = jadwal.kuota_maksimal - jadwal.terisi;
            status = sisaKuota > 0 ? 'tersedia' : 'penuh';
        }

        const isSelected = selectedJadwal?.id === jadwal?.id;

        // Penentuan Warna Tailwind
        let bgColor = "bg-slate-100/60 text-slate-400 cursor-not-allowed border border-transparent"; 
        if (status === 'tersedia') {
            bgColor = isSelected 
                ? "bg-blue-600 text-white shadow-xl shadow-blue-600/30 ring-2 ring-blue-600 scale-105" 
                : "bg-blue-50 text-blue-700 hover:bg-blue-100 hover:scale-102 border border-blue-200 cursor-pointer shadow-xs";
        } else if (status === 'penuh') {
            bgColor = "bg-rose-50 text-rose-500 border border-rose-200/80 cursor-not-allowed opacity-75";
        }

        calendarCells.push(
            <button 
                type="button"
                key={i} 
                disabled={status !== 'tersedia'}
                onClick={() => status === 'tersedia' && setSelectedJadwal(jadwal)}
                className={`p-2 sm:p-3 md:p-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 aspect-square sm:aspect-auto ${bgColor}`}
            >
                <span className="font-extrabold text-base sm:text-lg md:text-xl leading-none">{i}</span>
                {status !== 'kosong' && (
                    <span className={`text-[9px] sm:text-[10px] md:text-xs font-black mt-1 px-1.5 py-0.5 rounded-full ${
                        isSelected 
                            ? 'bg-white/20 text-white' 
                            : status === 'tersedia' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-rose-100 text-rose-800'
                    }`}>
                        {status === 'tersedia' ? `${sisaKuota} Sisa` : 'Penuh'}
                    </span>
                )}
            </button>
        );
    }

    // Format Tanggal Lengkap
    const formatTanggalLengkap = (tanggalString) => {
        if (!tanggalString) return '';
        const date = new Date(tanggalString);
        return date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Pengecekan Hari Sabtu untuk Jam Operasional
    const isHariSabtu = (tanggalString) => {
        if (!tanggalString) return false;
        const date = new Date(tanggalString);
        return date.getDay() === 6; // 6 = Sabtu
    };

    // Eksekusi Submit Ambil Antrean
    const handleAmbilAntrean = () => {
        if (!selectedJadwal) return;
        router.post(route('antrean.ambil'), { jadwal_id: selectedJadwal.id });
    };

    // Pilihan Alasan Pembatalan Antrean
    const pilihanAlasan = [
        "Salah memilih tanggal kedatangan",
        "Ada keperluan mendadak di hari tersebut",
        "Berkas persyaratannya belum lengkap",
        "Ingin mengganti tanggal verifikasi lain",
        "Lainnya (Tulis alasan sendiri)"
    ];

    // Handle Pembatalan Antrean
    const handleCancelSubmit = (e) => {
        e.preventDefault();
        
        const finalReason = cancelData.alasan_batal === "Lainnya (Tulis alasan sendiri)" 
            ? customReason 
            : cancelData.alasan_batal;

        if (!finalReason) {
            alert("Silakan pilih atau isi alasan pembatalan terlebih dahulu.");
            return;
        }

        router.post(route('antrean.batal'), {
            antrean_id: antreanSiswa.id,
            alasan_batal: finalReason,
        }, {
            onSuccess: () => {
                setShowCancelModal(false);
                resetCancel();
                setCustomReason('');
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="E-Tiket Antrean - SPMB SMAN 1 Slawi" />

            <div className="py-8 bg-slate-50 min-h-[calc(100vh-65px)]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Pesan Error Global (jika ada) */}
                    {errors?.error && (
                        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-center gap-2">
                            <span>⚠️</span>
                            <span>{errors.error}</span>
                        </div>
                    )}
                    
                    {antreanSiswa ? (
                        /* ================= MODE TIKET VIRTUAL (JIKA SUDAH PUNYA TIKET) ================= */
                        <div className="space-y-6">
                            
                            {/* Header Ucapan & Status - Disesuaikan Ukuran Kotaknya dengan E-Ticket (max-w-xl) */}
                            <div className="max-w-xl mx-auto bg-gradient-to-r from-blue-900 via-blue-950 to-indigo-950 rounded-3xl p-6 text-white shadow-xl border border-blue-800/40 relative overflow-hidden">
                                <div className="absolute -top-10 -right-10 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
                                <span className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-[11px] font-extrabold uppercase tracking-widest text-blue-200 mb-2">
                                    ✅ Antrean Berhasil Terdaftar
                                </span>
                                <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">Halo, {auth.user.name}!</h2>
                                <p className="text-xs text-blue-200 mt-1 leading-relaxed">
                                    E-Tiket antrean verifikasi berkas fisik Anda telah diterbitkan. Harap hadir di lokasi sekolah sesuai jam kedatangan Anda di bawah ini.
                                </p>
                            </div>

                            {/* Kartu E-Tiket Antrean Virtual */}
                            <div className="bg-white overflow-hidden shadow-2xl rounded-3xl border border-blue-100 max-w-xl mx-auto relative">
                                
                                {/* Bagian Atas Tiket */}
                                <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-8 text-center text-white relative">
                                    <div className="absolute top-5 right-5">
                                        <span className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border backdrop-blur-md ${
                                            antreanSiswa.status === 'Selesai' 
                                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                                                : antreanSiswa.status === 'Dilayani'
                                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                                                    : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                        }`}>
                                            {antreanSiswa.status === 'Dilayani' ? '🔔 Menuju Meja Panitia' : antreanSiswa.status}
                                        </span>
                                    </div>

                                    <p className="text-[11px] text-blue-300 font-extrabold tracking-widest uppercase mb-1">
                                        E-TIKET ANTREAN VIRTUAL SPMB
                                    </p>
                                    <h3 className="text-xl font-black text-white tracking-tight">SMA NEGERI 1 SLAWI</h3>
                                    
                                    {/* Display Nomor Urut Besar */}
                                    <div className="my-6 py-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/15 shadow-inner">
                                        <p className="text-[11px] text-blue-200 font-bold uppercase tracking-wider mb-1">
                                            Nomor Urut Antrean Anda
                                        </p>
                                        <h1 className="text-6xl sm:text-7xl font-black tracking-tight text-white drop-shadow-md font-mono">
                                            {antreanSiswa.nomor_urut}
                                        </h1>
                                    </div>

                                    {/* JAM KEDATANGAN TUNGGAL */}
                                    <div className="inline-flex items-center gap-2.5 bg-emerald-500/20 border border-emerald-400/40 px-5 py-2.5 rounded-2xl backdrop-blur-md">
                                        <span className="text-lg">⏰</span>
                                        <div className="text-left">
                                            <span className="block text-[10px] font-extrabold text-emerald-300 uppercase tracking-wider">
                                                Jam Kedatangan Di Sekolah:
                                            </span>
                                            <span className="block font-black text-white text-base font-mono tracking-wide">
                                                {antreanSiswa.estimasi_jam ? (antreanSiswa.estimasi_jam.includes('WIB') ? antreanSiswa.estimasi_jam : `${antreanSiswa.estimasi_jam} WIB`) : '07:30 WIB'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Pembatas Garis Tiket Melengkung (Ticket Notch) */}
                                <div className="relative bg-slate-100 h-4 flex items-center justify-between px-4">
                                    <div className="w-5 h-5 bg-slate-50 rounded-full -ms-6 border-r border-slate-200"></div>
                                    <div className="w-full border-b-2 border-dashed border-slate-300 mx-2"></div>
                                    <div className="w-5 h-5 bg-slate-50 rounded-full -me-6 border-l border-slate-200"></div>
                                </div>

                                {/* Bagian Detail Rincian Tiket */}
                                <div className="p-6 sm:p-8 bg-white flex flex-col gap-4 text-xs sm:text-sm">
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                        <span className="text-slate-500 font-semibold">Nama Siswa</span>
                                        <span className="font-extrabold text-slate-900">{auth.user.name}</span>
                                    </div>

                                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                        <span className="text-slate-500 font-semibold">NISN Siswa</span>
                                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                                            {auth.user.nisn}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                        <span className="text-slate-500 font-semibold">Tanggal Kedatangan</span>
                                        <span className="font-extrabold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                                            📅 {formatTanggalLengkap(antreanSiswa.jadwal.tanggal)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 font-semibold">Lokasi Verifikasi</span>
                                        <span className="font-bold text-slate-900">
                                            Aula Utama SMAN 1 Slawi
                                        </span>
                                    </div>

                                    {/* Himbauan & Petunjuk Penting Verifikasi Fisik */}
                                    <div className="mt-2 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs space-y-2">
                                        <div className="flex items-center gap-2 font-black text-amber-900 border-b border-amber-200/60 pb-2">
                                            <span className="text-base">📌</span>
                                            <span>HIMBAUAN &amp; PETUNJUK KEDATANGAN:</span>
                                        </div>
                                        <ul className="space-y-2 text-[11px] text-amber-900/90 font-medium pl-1 leading-relaxed">
                                            <li className="flex items-start gap-2">
                                                <span className="font-black text-amber-700">1.</span>
                                                <span><strong>Tunjukkan Bukti E-Tiket:</strong> Saat tiba di lokasi SMAN 1 Slawi, tunjukkan E-Tiket ini kepada petugas dengan membuka akun ini secara langsung atau memperlihatkan <strong>tangkapan layar (screenshot)</strong> halaman tiket ini.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="font-black text-amber-700">2.</span>
                                                <span><strong>Pantau Status Antrean Secara Real-Time:</strong> Harap selalu memperhatikan status pada <strong>layar akun E-Tiket siswa</strong> ini serta <strong>layar monitor utama</strong> di area tunggu sekolah untuk mengetahui pemanggilan antrean (Status: <em>Menunggu</em>, <em>Dipanggil/Menuju Loket</em>, dan <em>Selesai</em>).</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="font-black text-amber-700">3.</span>
                                                <span><strong>Menuju Loket Saat Dipanggil:</strong> Ketika nomor Anda dipanggil di layar monitor atau status berubah menjadi <em>Menuju Loket Panitia</em>, segera datangi loket verifikasi yang ditentukan dengan membawa berkas persyaratan lengkap.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* OPSI PEMBATALAN ANTREAN */}
                                {antreanSiswa.status === 'Menunggu' && (
                                    <div className="p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                                        <p className="text-[11px] font-bold text-slate-500 text-center sm:text-left">
                                            Salah tanggal atau berhalangan hadir?
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setShowCancelModal(true)}
                                            className="w-full sm:w-auto px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold rounded-xl border border-rose-200 text-xs transition duration-200"
                                        >
                                            🚫 Batalkan Antrean Ini
                                        </button>
                                    </div>
                                )}

                            </div>
                        </div>

                    ) : (

                        /* ================= MODE KALENDER GRID INTERAKTIF (PILIK JADWAL) ================= */
                        <div className="space-y-6">
                            
                            {/* Header Pengenalan Pilih Jadwal */}
                            <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 border border-blue-100">
                                
                                <div className="mb-6 pb-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <span className="text-[11px] font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 uppercase tracking-wider">
                                            Kalender Antrean SPMB
                                        </span>
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
                                            Pilih Tanggal Kedatangan
                                        </h2>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Silakan tentukan jadwal verifikasi berkas fisik yang masih tersedia kuotanya.
                                        </p>
                                    </div>

                                    {/* Indikator Warna Status */}
                                    <div className="flex items-center gap-2 self-start sm:self-auto">
                                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
                                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Kuota Tersedia
                                        </span>
                                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200">
                                            <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Penuh / Libur
                                        </span>
                                    </div>
                                </div>

                                {/* Control Switcher Bulan & Tahun */}
                                <div className="flex justify-between items-center mb-6 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                                    <button 
                                        type="button"
                                        onClick={prevMonth} 
                                        className="p-2.5 rounded-xl hover:bg-white hover:shadow-xs transition text-slate-700 font-bold text-xs flex items-center gap-1"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                                        <span className="hidden sm:inline">Bulan Sebelumnya</span>
                                    </button>

                                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                                        {namaBulan[month]} {year}
                                    </h3>

                                    <button 
                                        type="button"
                                        onClick={nextMonth} 
                                        className="p-2.5 rounded-xl hover:bg-white hover:shadow-xs transition text-slate-700 font-bold text-xs flex items-center gap-1"
                                    >
                                        <span className="hidden sm:inline">Bulan Berikutnya</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                                    </button>
                                </div>

                                {/* Grid Baris Header Hari */}
                                <div className="grid grid-cols-7 gap-1.5 text-center mb-3">
                                    {namaHariSingkat.map((hari, idx) => (
                                        <div key={idx} className={`font-black text-xs tracking-wider uppercase py-1 ${idx === 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                                            {hari}
                                        </div>
                                    ))}
                                </div>

                                {/* Grid Sel Kalender Tanggal */}
                                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                                    {calendarCells}
                                </div>

                            </div>

                            {/* PANEL KONFIRMASI (Muncul di bawah saat tanggal diklik) */}
                            {selectedJadwal && (
                                <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white shadow-2xl rounded-3xl p-6 sm:p-8 border border-blue-500/30 animate-fade-in relative overflow-hidden">
                                    
                                    <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
                                        <div>
                                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-300">
                                                Konfirmasi Jadwal Kedatangan
                                            </span>
                                            <h3 className="text-xl font-black text-white">
                                                Detail Tanggal Terpilih
                                            </h3>
                                        </div>
                                        <button 
                                            onClick={() => setSelectedJadwal(null)}
                                            className="text-slate-400 hover:text-white text-xs font-bold bg-white/10 px-3 py-1.5 rounded-xl transition"
                                        >
                                            ✕ Batal
                                        </button>
                                    </div>
                                    
                                    {/* GRID INFORMASI JAM LAYANAN, JAM ISTIRAHAT & KUOTA */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                        
                                        {/* Tanggal Kedatangan */}
                                        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                                            <p className="text-[10px] text-blue-300 font-bold uppercase tracking-wider mb-1">📅 Tanggal Kedatangan</p>
                                            <p className="font-black text-white text-xs sm:text-sm">{formatTanggalLengkap(selectedJadwal.tanggal)}</p>
                                        </div>

                                        {/* Jam Layanan Sekolah (Kondisi Khusus Hari Sabtu: 07:30 - 13:00) */}
                                        <div className="bg-emerald-500/15 border border-emerald-500/30 p-4 rounded-2xl backdrop-blur-md">
                                            <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider mb-1">⏱️ Jam Layanan Sekolah</p>
                                            <p className="font-black text-emerald-400 text-sm">
                                                {isHariSabtu(selectedJadwal.tanggal) ? '07:30 - 13:00 WIB' : '07:30 - 15:30 WIB'}
                                            </p>
                                            {isHariSabtu(selectedJadwal.tanggal) && (
                                                <span className="text-[9px] font-bold text-amber-300 block mt-0.5">*Khusus Hari Sabtu</span>
                                            )}
                                        </div>

                                        {/* Jam Istirahat Panitia */}
                                        <div className="bg-amber-500/15 border border-amber-500/30 p-4 rounded-2xl backdrop-blur-md">
                                            <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider mb-1">☕ Jam Istirahat (ISOMA)</p>
                                            <p className="font-black text-amber-400 text-sm">12:00 - 13:00 WIB</p>
                                        </div>

                                        {/* Sisa Kuota Harian */}
                                        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                                            <p className="text-[10px] text-blue-300 font-bold uppercase tracking-wider mb-1">👥 Sisa Kuota Harian</p>
                                            <p className="font-black text-white text-lg sm:text-xl">
                                                {selectedJadwal.kuota_maksimal - selectedJadwal.terisi} <span className="text-xs font-normal text-slate-300">Orang</span>
                                            </p>
                                        </div>

                                    </div>

                                    <button 
                                        type="button"
                                        onClick={handleAmbilAntrean}
                                        className="w-full text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-600/40 font-black rounded-2xl text-base px-6 py-4 text-center transition transform hover:-translate-y-0.5"
                                    >
                                        🚀 Konfirmasi &amp; Ambil Nomor Antrean Sekarang
                                    </button>
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </div>

            {/* MODAL POP-UP PEMBATALAN ANTREAN */}
            {showCancelModal && antreanSiswa && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-rose-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black text-lg">
                                    ⚠️
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900">Batalkan Antrean Ini?</h3>
                                    <p className="text-xs text-slate-500">Kuota antrean tanggal ini akan otomatis dikembalikan.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCancelSubmit} className="space-y-4 pt-2">
                            <div>
                                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                                    Pilih Alasan Pembatalan Antrean:
                                </label>
                                <div className="space-y-2">
                                    {pilihanAlasan.map((alasan, idx) => (
                                        <label 
                                            key={idx} 
                                            className={`flex items-center p-3 rounded-2xl border cursor-pointer transition text-xs font-bold ${
                                                cancelData.alasan_batal === alasan 
                                                    ? 'border-blue-600 bg-blue-50/70 text-blue-900' 
                                                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="alasan_batal"
                                                value={alasan}
                                                checked={cancelData.alasan_batal === alasan}
                                                onChange={(e) => setCancelData('alasan_batal', e.target.value)}
                                                className="text-blue-600 focus:ring-blue-600 w-4 h-4 mr-3"
                                            />
                                            {alasan}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Textarea jika memilih 'Lainnya' */}
                            {cancelData.alasan_batal === "Lainnya (Tulis alasan sendiri)" && (
                                <div>
                                    <textarea
                                        rows="3"
                                        placeholder="Tuliskan alasan pembatalan Anda di sini..."
                                        value={customReason}
                                        onChange={(e) => setCustomReason(e.target.value)}
                                        className="w-full rounded-2xl border-slate-200 text-xs font-bold p-3 focus:border-blue-600 focus:ring-blue-600"
                                        required
                                    />
                                </div>
                            )}

                            <div className="pt-3 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCancelModal(false)}
                                    className="w-1/2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-2xl text-xs transition"
                                >
                                    Kembali (Tidak Batal)
                                </button>
                                <button
                                    type="submit"
                                    disabled={cancelProcessing}
                                    className="w-1/2 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-rose-600/30 transition disabled:opacity-50"
                                >
                                    {cancelProcessing ? 'Memproses...' : 'Ya, Batalkan Tiket'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}