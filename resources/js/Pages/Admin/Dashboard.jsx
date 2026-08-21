import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminDashboard({ selectedTanggal, statistik, jadwalHariIni, antreanTerakhir }) {
    
    const handleTanggalChange = (e) => {
        const tgl = e.target.value;
        router.get(route('admin.dashboard'), { tanggal: tgl }, { preserveState: true });
    };

    return (
        <AdminLayout>
            <Head title="Dashboard Admin" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                
                {/* HEADER DASHBOARD DENGAN SIMULASI DATEPICKER */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-900 text-white flex items-center justify-center text-2xl font-black shadow-md">
                            ⚡
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                                Pusat Kontrol SPMB SMAN 1 Slawi
                            </h1>
                            <p className="text-xs font-bold text-slate-500 mt-0.5">
                                Pantau operasional kuota, verifikasi berkas panitia, dan statistik pendaftaran secara real-time.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        {/* PEMILIH TANGGAL SIMULASI */}
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-2xl border border-slate-300">
                            <span className="text-xs font-black text-slate-700">Tanggal:</span>
                            <input
                                type="date"
                                value={selectedTanggal}
                                onChange={handleTanggalChange}
                                className="px-3 py-1 bg-white rounded-xl border border-slate-300 text-xs font-mono font-black focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* MATRIX CARDS STATISTIK */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    
                    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Total Siswa Terdaftar
                        </span>
                        <div className="text-3xl font-black text-slate-900 font-mono">
                            {statistik.totalSiswa}
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 mt-1 block">
                            Akun siswa aktif di sistem
                        </span>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Antrean Hari Ini
                        </span>
                        <div className="text-3xl font-black text-blue-700 font-mono">
                            {statistik.totalAntreanHariIni}
                        </div>
                        <span className="text-[10px] font-bold text-blue-600 mt-1 block">
                            Pendaftar terdaftar hari ini
                        </span>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Status Dilayani
                        </span>
                        <div className="text-3xl font-black text-amber-600 font-mono">
                            {statistik.antreanDilayaniHariIni}
                        </div>
                        <span className="text-[10px] font-bold text-amber-600 mt-1 block">
                            Sedang diverifikasi di loket
                        </span>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Selesai Diverifikasi
                        </span>
                        <div className="text-3xl font-black text-emerald-600 font-mono">
                            {statistik.antreanSelesaiHariIni}
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 mt-1 block">
                            Berkas selesai diperiksa
                        </span>
                    </div>

                </div>

                {/* INFORMASI JADWAL KUOTA HARI INI & RIWAYAT PANGGILAN */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* KIRI (5 COLS): STATUS KUOTA HARI INI */}
                    <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h2 className="text-base font-black text-slate-900">
                                📅 Quota Status Hari Ini
                            </h2>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                jadwalHariIni?.status_buka ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                                {jadwalHariIni?.status_buka ? 'Pendaftaran Buka' : 'Tutup / Libur'}
                            </span>
                        </div>

                        {jadwalHariIni ? (
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                                    <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                                        <span>Kuota Maksimal:</span>
                                        <span className="font-mono text-sm font-black text-slate-900">{jadwalHariIni.kuota_maksimal} Orang</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                                        <span>Sisa Kuota:</span>
                                        <span className="font-mono text-sm font-black text-blue-700">{jadwalHariIni.sisa_kuota} Orang</span>
                                    </div>
                                </div>

                                <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                                    <div 
                                        className="bg-blue-600 h-3.5 rounded-full transition-all duration-500" 
                                        style={{ width: `${Math.min(100, (statistik.totalAntreanHariIni / (jadwalHariIni.kuota_maksimal || 1)) * 100)}%` }} 
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="py-8 text-center text-xs font-bold text-slate-400">
                                Tidak ada jadwal kuota yang dibuka untuk hari ini.
                            </div>
                        )}
                    </div>

                    {/* KANAN (7 COLS): RIWAYAT ANTREAN LOKET TERAKHIR */}
                    <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h2 className="text-base font-black text-slate-900">
                                🕒 Aktivitas Loket Terakhir
                            </h2>
                            <span className="text-xs font-bold text-blue-600">
                                Realtime Sync
                            </span>
                        </div>

                        <div className="space-y-3">
                            {antreanTerakhir.length > 0 ? (
                                antreanTerakhir.map((item) => (
                                    <div key={item.id} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
                                        <div>
                                            <span className="font-mono text-lg font-black text-slate-900 block leading-tight">
                                                {item.nomor_urut}
                                            </span>
                                            <span className="text-xs font-extrabold text-slate-700 block mt-0.5">
                                                {item.user?.name} (NISN: {item.user?.nisn})
                                            </span>
                                        </div>
                                        <div className="text-right flex items-center gap-2">
                                            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-xl text-xs font-black font-mono">
                                                {item.loket || 'Meja 1'}
                                            </span>
                                            <span className={`px-3 py-1 rounded-xl text-xs font-black ${
                                                item.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center text-xs font-bold text-slate-400">
                                    Belum ada aktivitas pemanggilan antrean hari ini.
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </AdminLayout>
    );
}
