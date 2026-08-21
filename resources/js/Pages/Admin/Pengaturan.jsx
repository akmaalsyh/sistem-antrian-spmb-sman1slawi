import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Pengaturan({ settings }) {
    const { flash } = usePage().props;

    // Menyiapkan initial state object dari array settings yang dikirim backend
    const initialSettingsObj = {};
    settings.forEach(item => {
        initialSettingsObj[item.key] = item.value || '';
    });

    const { data, setData, post, processing } = useForm({
        settings: initialSettingsObj
    });

    const handleChange = (key, val) => {
        setData('settings', {
            ...data.settings,
            [key]: val,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.pengaturan.simpan'));
    };

    return (
        <AdminLayout>
            <Head title="Pengaturan Sistem Siswa" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                
                {/* POPUP ALERT SUKSES */}
                {flash?.status && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-black text-emerald-800 flex items-center justify-between shadow-xs">
                        <span>✅ {flash.status}</span>
                    </div>
                )}

                {/* HEADER HALAMAN */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white flex items-center justify-center text-xl font-black shadow-md">
                            ⚙️
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                                Pengaturan &amp; Konfigurasi Sistem Siswa
                            </h1>
                            <p className="text-xs text-slate-500 font-bold mt-1">
                                Sesuaikan durasi waktu estimasi antrean, jam operasional, dan petunjuk sistem tanpa mengubah kode program.
                            </p>
                        </div>
                    </div>
                </div>

                {/* FORM PENGATURAN */}
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                    
                    <div className="border-b border-slate-100 pb-4">
                        <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">
                            ⏱️ Parameter Algoritma Estimasi Antrean & Operasional
                        </h2>
                        <p className="text-xs text-slate-500 font-bold mt-0.5">
                            Pengaturan ini langsung memengaruhi perhitungan estimasi jam kedatangan di E-Tiket Siswa.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Durasi Verifikasi Per Siswa */}
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                            <label className="block text-xs font-black text-slate-900 uppercase tracking-wide">
                                Durasi Estimasi Per Siswa (Menit)
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={data.settings.durasi_menit_per_siswa || 10}
                                    onChange={(e) => handleChange('durasi_menit_per_siswa', e.target.value)}
                                    className="w-full rounded-xl border-slate-300 font-black text-slate-900 text-sm focus:border-blue-600 focus:ring-blue-600"
                                    required
                                />
                                <span className="text-xs font-black text-slate-500">Menit</span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-bold">
                                Jeda interval waktu verifikasi (Contoh: 10 menit per siswa).
                            </p>
                        </div>

                        {/* Jumlah Loket / Meja Aktif */}
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                            <label className="block text-xs font-black text-slate-900 uppercase tracking-wide">
                                Jumlah Meja / Loket Verifikasi Aktif
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={data.settings.jumlah_loket_aktif || 5}
                                    onChange={(e) => handleChange('jumlah_loket_aktif', e.target.value)}
                                    className="w-full rounded-xl border-slate-300 font-black text-slate-900 text-sm focus:border-blue-600 focus:ring-blue-600"
                                    required
                                />
                                <span className="text-xs font-black text-slate-500">Meja</span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-bold">
                                Jumlah loket parallel yang melayani pendaftar bersamaan.
                            </p>
                        </div>

                        {/* Jam Operasional Mulai */}
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                            <label className="block text-xs font-black text-slate-900 uppercase tracking-wide">
                                Jam Operasional Buka Sekolah
                            </label>
                            <input
                                type="time"
                                value={data.settings.jam_operasional_mulai || '07:30'}
                                onChange={(e) => handleChange('jam_operasional_mulai', e.target.value)}
                                className="w-full rounded-xl border-slate-300 font-black text-slate-900 text-sm focus:border-blue-600 focus:ring-blue-600"
                                required
                            />
                            <p className="text-[11px] text-slate-500 font-bold">
                                Jam dimulai pelayanan verifikasi fisik di lokasi (WIB).
                            </p>
                        </div>

                        {/* Jam Operasional Selesai */}
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                            <label className="block text-xs font-black text-slate-900 uppercase tracking-wide">
                                Jam Operasional Tutup Sekolah
                            </label>
                            <input
                                type="time"
                                value={data.settings.jam_operasional_selesai || '15:30'}
                                onChange={(e) => handleChange('jam_operasional_selesai', e.target.value)}
                                className="w-full rounded-xl border-slate-300 font-black text-slate-900 text-sm focus:border-blue-600 focus:ring-blue-600"
                                required
                            />
                            <p className="text-[11px] text-slate-500 font-bold">
                                Batas akhir pelayanan operasional harian (WIB).
                            </p>
                        </div>

                    </div>

                    <div className="border-t border-b border-slate-100 py-4 my-2">
                        <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">
                            📢 Informasi & Pesan Petunjuk Siswa
                        </h2>
                        <p className="text-xs text-slate-500 font-bold mt-0.5">
                            Teks himbauan ini akan tampil secara langsung pada E-Tiket Antrean Siswa.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                            <label className="block text-xs font-black text-slate-900 uppercase tracking-wide">
                                Pesan Himbauan / Petunjuk Kedatangan Siswa
                            </label>
                            <textarea
                                rows="3"
                                value={data.settings.pesan_himbauan_siswa || ''}
                                onChange={(e) => handleChange('pesan_himbauan_siswa', e.target.value)}
                                className="w-full rounded-xl border-slate-300 font-bold text-slate-900 text-xs focus:border-blue-600 focus:ring-blue-600 p-3"
                                placeholder="Tuliskan petunjuk kedatangan..."
                            />
                            <p className="text-[11px] text-slate-500 font-bold">
                                Kalimat pesan himbauan yang muncul di bagian bawah E-Tiket antrean siswa.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                            <label className="block text-xs font-black text-slate-900 uppercase tracking-wide">
                                Nama Resmi Sekolah / Instansi
                            </label>
                            <input
                                type="text"
                                value={data.settings.nama_sekolah || 'SMA NEGERI 1 SLAWI'}
                                onChange={(e) => handleChange('nama_sekolah', e.target.value)}
                                className="w-full rounded-xl border-slate-300 font-black text-slate-900 text-sm focus:border-blue-600 focus:ring-blue-600"
                                required
                            />
                        </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-xs shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5 disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan Pengaturan...' : '💾 Simpan Perubahan Pengaturan'}
                        </button>
                    </div>

                </form>

            </div>
        </AdminLayout>
    );
}
