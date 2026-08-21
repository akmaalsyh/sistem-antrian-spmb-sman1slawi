import React from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Laporan({ antreans, selectedTanggal, daftarTanggal }) {
    
    const handleFilterTanggal = (e) => {
        const tanggal = e.target.value;
        router.get(route('admin.laporan'), { tanggal: tanggal }, { preserveState: true });
    };

    const handleCetak = () => {
        window.print();
    };

    return (
        <AdminLayout>
            <Head title="Laporan & Rekapitulasi" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                
                {/* HEADER & FILTER LAPORAN */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                            🖨️ Laporan &amp; Rekapitulasi Data Antrean
                        </h1>
                        <p className="text-xs font-bold text-slate-500 mt-1">
                            Cetak laporan resmi verifikasi berkas fisik SPMB untuk Kepala Sekolah &amp; Panitia.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="date"
                            value={selectedTanggal}
                            onChange={handleFilterTanggal}
                            className="px-4 py-2.5 rounded-2xl border border-slate-300 font-mono font-bold text-xs focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            onClick={handleCetak}
                            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl text-xs shadow-md transition flex items-center gap-2"
                        >
                            <span>🖨️ Cetak / Print PDF</span>
                        </button>
                    </div>
                </div>

                {/* KARTU LAPORAN YANG SIAP DICETAK */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6 print:border-none print:shadow-none print:p-0">
                    
                    {/* HEADER SURAT REKAP (PRINT ONLY & PREVIEW) */}
                    <div className="text-center border-b-2 border-slate-900 pb-6 space-y-1">
                        <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight">
                            PANITIA PENDAFTARAN PESERTA DIDIK BARU (SPMB)
                        </h2>
                        <h3 className="text-lg font-black text-slate-800 tracking-wide">
                            SMA NEGERI 1 SLAWI - KABUPATEN TEGAL
                        </h3>
                        <p className="text-xs font-bold text-slate-600">
                            Jalan Prof. Mohammad Yamin, Slawi, Kabupaten Tegal, Jawa Tengah
                        </p>
                        <div className="pt-2 text-xs font-black text-blue-900 uppercase tracking-wider">
                            REKAPITULASI HASIL VERIFIKASI BERKAS FISIK - TANGGAL: {new Date(selectedTanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                    </div>

                    {/* STATISTIK RINGKAS */}
                    <div className="grid grid-cols-3 gap-4 text-center font-mono">
                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                            <span className="block text-[10px] text-slate-500 font-bold uppercase">Total Terdaftar</span>
                            <span className="text-xl font-black text-slate-900">{antreans.length} Siswa</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                            <span className="block text-[10px] text-emerald-700 font-bold uppercase">Selesai Diverifikasi</span>
                            <span className="text-xl font-black text-emerald-800">
                                {antreans.filter(a => a.status === 'Selesai').length} Siswa
                            </span>
                        </div>
                        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                            <span className="block text-[10px] text-amber-700 font-bold uppercase">Menunggu / Sedang Proses</span>
                            <span className="text-xl font-black text-amber-800">
                                {antreans.filter(a => a.status !== 'Selesai').length} Siswa
                            </span>
                        </div>
                    </div>

                    {/* TABEL REKAP ANTREAN */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse border border-slate-300">
                            <thead>
                                <tr className="bg-slate-100 text-slate-900 text-xs font-black uppercase tracking-wider border-b border-slate-300">
                                    <th className="py-3 px-4 border-r border-slate-300 text-center w-12">No</th>
                                    <th className="py-3 px-4 border-r border-slate-300 text-center">No Antrean</th>
                                    <th className="py-3 px-4 border-r border-slate-300">Nama Siswa Pendaftar</th>
                                    <th className="py-3 px-4 border-r border-slate-300">NISN</th>
                                    <th className="py-3 px-4 border-r border-slate-300 text-center">Jam Kedatangan</th>
                                    <th className="py-3 px-4 border-r border-slate-300 text-center">Loket Verifikasi</th>
                                    <th className="py-3 px-4 text-center">Status Berkas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-xs font-bold text-slate-800">
                                {antreans.length > 0 ? (
                                    antreans.map((item, index) => (
                                        <tr key={item.id}>
                                            <td className="py-3 px-4 border-r border-slate-300 text-center">{index + 1}</td>
                                            <td className="py-3 px-4 border-r border-slate-300 font-mono font-black text-center text-sm">{item.nomor_urut}</td>
                                            <td className="py-3 px-4 border-r border-slate-300 font-black">{item.user?.name}</td>
                                            <td className="py-3 px-4 border-r border-slate-300 font-mono">{item.user?.nisn}</td>
                                            <td className="py-3 px-4 border-r border-slate-300 font-mono text-center">{item.estimasi_jam || '07:30'} WIB</td>
                                            <td className="py-3 px-4 border-r border-slate-300 font-mono text-center font-black">{item.loket || '-'}</td>
                                            <td className="py-3 px-4 text-center font-black">
                                                <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase ${
                                                    item.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-8 text-center text-slate-400 font-bold">
                                            Tidak ada data antrean pendaftaran untuk tanggal terpilih.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* TANDA TANGAN KETUA PANITIA (PRINT ONLY) */}
                    <div className="pt-12 hidden print:grid grid-cols-2 text-xs font-bold text-slate-900">
                        <div></div>
                        <div className="text-center space-y-16">
                            <div>
                                Slawi, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br/>
                                Ketua Panitia SPMB SMAN 1 Slawi
                            </div>
                            <div className="font-black underline uppercase">
                                ( ___________________________ )<br/>
                                NIP. 19780512 200501 1 004
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </AdminLayout>
    );
}
