import React, { useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function KelolaJadwal({ jadwals }) {
    const { flash, errors } = usePage().props;
    const [modalTambah, setModalTambah] = useState(false);
    const [editItem, setEditItem] = useState(null);

    // Form Tambah Jadwal Baru
    const formTambah = useForm({
        tanggal: '',
        kuota_maksimal: 100,
        status_buka: true,
    });

    // Form Edit Jadwal
    const formEdit = useForm({
        kuota_maksimal: 100,
        status_buka: true,
    });

    const handleSimpanTambah = (e) => {
        e.preventDefault();
        formTambah.post(route('admin.jadwal.simpan'), {
            onSuccess: () => {
                setModalTambah(false);
                formTambah.reset();
            },
        });
    };

    const handleOpenEdit = (item) => {
        setEditItem(item);
        formEdit.setData({
            kuota_maksimal: item.kuota_maksimal,
            status_buka: Boolean(item.status_buka),
        });
    };

    const handleSimpanEdit = (e) => {
        e.preventDefault();
        formEdit.put(route('admin.jadwal.update', editItem.id), {
            onSuccess: () => {
                setEditItem(null);
            },
        });
    };

    const handleHapus = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus jadwal kuota tanggal ini?')) {
            router.delete(route('admin.jadwal.hapus', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Kelola Jadwal & Kuota" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                
                {/* POPUP ALERT SUKSES ATAU ERROR */}
                {flash?.status && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-black text-emerald-800 flex items-center justify-between shadow-xs">
                        <span>✅ {flash.status}</span>
                    </div>
                )}
                {errors?.error && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-black text-rose-800 flex items-center justify-between shadow-xs">
                        <span>⚠️ {errors.error}</span>
                    </div>
                )}

                {/* HEADER KELOLA JADWAL */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                            📅 Kelola Kuota &amp; Jadwal Harian
                        </h1>
                        <p className="text-xs font-bold text-slate-500 mt-1">
                            Atur batas kuota harian dan buka/tutup tanggal pendaftaran untuk siswa.
                        </p>
                    </div>

                    <button
                        onClick={() => setModalTambah(true)}
                        className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-600/30 text-xs transition flex items-center justify-center gap-2"
                    >
                        <span>➕</span>
                        <span>Tambah Tanggal Kuota Baru</span>
                    </button>
                </div>

                {/* TABEL JADWAL KUOTA */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900 text-white text-xs font-black uppercase tracking-wider">
                                    <th className="py-4 px-6">Tanggal Kedatangan</th>
                                    <th className="py-4 px-6 text-center">Kuota Maksimal</th>
                                    <th className="py-4 px-6 text-center">Pendaftar Terisi</th>
                                    <th className="py-4 px-6 text-center">Sisa Kuota</th>
                                    <th className="py-4 px-6 text-center">Status Pendaftaran</th>
                                    <th className="py-4 px-6 text-center">Aksi Kontrol</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
                                {jadwals.length > 0 ? (
                                    jadwals.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition">
                                            <td className="py-4 px-6 font-black text-slate-900 text-sm">
                                                {new Date(item.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                            </td>
                                            <td className="py-4 px-6 text-center font-mono text-sm font-black text-slate-900">
                                                {item.kuota_maksimal} Siswa
                                            </td>
                                            <td className="py-4 px-6 text-center font-mono text-sm font-black text-blue-700">
                                                {item.antrean_count || 0} Siswa
                                            </td>
                                            <td className="py-4 px-6 text-center font-mono text-sm font-black text-amber-700">
                                                {item.sisa_kuota !== undefined && item.sisa_kuota !== null 
                                                    ? item.sisa_kuota 
                                                    : (item.kuota_maksimal - (item.antrean_count || 0))} Siswa
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                    item.status_buka ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                                                }`}>
                                                    {item.status_buka ? '🟢 DIBUKA' : '🔴 DITUTUP'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center space-x-2">
                                                <button
                                                    onClick={() => handleOpenEdit(item)}
                                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-xl border border-slate-300 transition"
                                                >
                                                    ✏️ Edit Kuota
                                                </button>
                                                <button
                                                    onClick={() => handleHapus(item.id)}
                                                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold rounded-xl border border-rose-200 transition"
                                                >
                                                    🗑️ Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-slate-400 font-bold">
                                            Belum ada tanggal kuota yang dibuat. Silakan tambahkan tanggal baru.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* MODAL TAMBAH TANGGAL KUOTA */}
            {modalTambah && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <h3 className="text-lg font-black text-slate-900">
                                ➕ Buka Tanggal Kuota Baru
                            </h3>
                            <button onClick={() => setModalTambah(false)} className="text-slate-400 hover:text-slate-600 font-black">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSimpanTambah} className="space-y-4 text-xs font-bold">
                            <div>
                                <label className="block text-slate-700 mb-1">Tanggal Kedatangan SPMB</label>
                                <input
                                    type="date"
                                    required
                                    value={formTambah.data.tanggal}
                                    onChange={(e) => formTambah.setData('tanggal', e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-bold focus:ring-2 focus:ring-blue-500"
                                />
                                {formTambah.errors.tanggal && (
                                    <span className="text-rose-600 mt-1 block">{formTambah.errors.tanggal}</span>
                                )}
                            </div>

                            <div>
                                <label className="block text-slate-700 mb-1">Kapasitas Kuota Maksimal (Orang)</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={formTambah.data.kuota_maksimal}
                                    onChange={(e) => formTambah.setData('kuota_maksimal', e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-bold focus:ring-2 focus:ring-blue-500 font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 mb-1">Status Akses Pendaftaran</label>
                                <select
                                    value={formTambah.data.status_buka ? '1' : '0'}
                                    onChange={(e) => formTambah.setData('status_buka', e.target.value === '1')}
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-bold focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="1">🟢 Buka (Siswa Boleh Mendaftar)</option>
                                    <option value="0">🔴 Tutup (Hari Libur / Kuota Ditutup)</option>
                                </select>
                            </div>

                            <div className="pt-3 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setModalTambah(false)}
                                    className="w-full py-3 bg-slate-100 text-slate-700 font-black rounded-2xl"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={formTambah.processing}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-600/30"
                                >
                                    Simpan Jadwal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL EDIT TANGGAL KUOTA */}
            {editItem && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <h3 className="text-lg font-black text-slate-900">
                                ✏️ Edit Kuota &amp; Status
                            </h3>
                            <button onClick={() => setEditItem(null)} className="text-slate-400 hover:text-slate-600 font-black">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSimpanEdit} className="space-y-4 text-xs font-bold">
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                                <span className="block text-slate-500 text-[10px] uppercase">Tanggal Terpilih:</span>
                                <span className="text-sm font-black text-slate-900 font-mono">
                                    {editItem.tanggal}
                                </span>
                            </div>

                            <div>
                                <label className="block text-slate-700 mb-1">Kapasitas Kuota Maksimal (Orang)</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={formEdit.data.kuota_maksimal}
                                    onChange={(e) => formEdit.setData('kuota_maksimal', e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-bold focus:ring-2 focus:ring-blue-500 font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 mb-1">Status Akses Pendaftaran</label>
                                <select
                                    value={formEdit.data.status_buka ? '1' : '0'}
                                    onChange={(e) => formEdit.setData('status_buka', e.target.value === '1')}
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-bold focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="1">🟢 Buka (Siswa Boleh Mendaftar)</option>
                                    <option value="0">🔴 Tutup (Hari Libur / Kuota Ditutup)</option>
                                </select>
                            </div>

                            <div className="pt-3 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditItem(null)}
                                    className="w-full py-3 bg-slate-100 text-slate-700 font-black rounded-2xl"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={formEdit.processing}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-600/30"
                                >
                                    Perbarui Kuota
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
