import React, { useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function UserManagement({ gurus, siswas }) {
    const { flash, errors } = usePage().props;
    const [tabAktif, setTabAktif] = useState('guru'); // 'guru' atau 'siswa'
    const [modalGuru, setModalGuru] = useState(false);
    const [modalSiswa, setModalSiswa] = useState(false);
    const [modalResetPass, setModalResetPass] = useState(null);

    // Form Tambah Guru Baru
    const formGuru = useForm({
        name: '',
        nisn: '', // Username / NIP
        password: '',
    });

    // Form Tambah Siswa Baru
    const formSiswa = useForm({
        name: '',
        nisn: '', // NISN Siswa
        password: '',
    });

    // Form Reset Password User
    const formReset = useForm({
        password: '',
    });

    const handleSimpanGuru = (e) => {
        e.preventDefault();
        formGuru.post(route('admin.users.guru.simpan'), {
            onSuccess: () => {
                setModalGuru(false);
                formGuru.reset();
            },
        });
    };

    const handleSimpanSiswa = (e) => {
        e.preventDefault();
        formSiswa.post(route('admin.users.siswa.simpan'), {
            onSuccess: () => {
                setModalSiswa(false);
                formSiswa.reset();
            },
        });
    };

    const handleSimpanResetPassword = (e) => {
        e.preventDefault();
        formReset.put(route('admin.users.reset-password', modalResetPass.id), {
            onSuccess: () => {
                setModalResetPass(null);
                formReset.reset();
            },
        });
    };

    const [modalConfirmReset, setModalConfirmReset] = useState(null);
    const [modalConfirmDelete, setModalConfirmDelete] = useState(null);

    const handleOpenResetModal = (user) => {
        setModalConfirmReset(user);
    };

    const handleConfirmResetOpenForm = () => {
        setModalResetPass(modalConfirmReset);
        setModalConfirmReset(null);
    };

    const handleOpenDeleteModal = (user) => {
        setModalConfirmDelete(user);
    };

    const handleConfirmDeleteSubmit = () => {
        if (modalConfirmDelete) {
            router.delete(route('admin.users.hapus', modalConfirmDelete.id), {
                onSuccess: () => setModalConfirmDelete(null),
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Pengguna" />

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

                {/* HEADER USER MANAGEMENT DENGAN 2 TOMBOL AKSI */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                            Manajemen Pengguna Sistem
                        </h1>
                        <p className="text-xs font-bold text-slate-500 mt-1">
                            Kelola akun panitia/guru loket verifikasi dan pendaftaran manual akun siswa baru.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setModalGuru(true)}
                            className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl shadow-md text-xs transition flex items-center gap-2"
                        >
                            <span>+ Tambah Akun Guru / Panitia</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setModalSiswa(true)}
                            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-600/30 text-xs transition flex items-center gap-2"
                        >
                            <span>+ Tambah Akun Siswa (NISN)</span>
                        </button>
                    </div>
                </div>

                {/* TAB SELECTOR (PANITIA/GURU vs SISWA) */}
                <div className="flex border-b border-slate-200 gap-4">
                    <button
                        onClick={() => setTabAktif('guru')}
                        className={`pb-3 px-4 font-black text-sm transition border-b-2 ${
                            tabAktif === 'guru'
                                ? 'border-blue-600 text-blue-700'
                                : 'border-transparent text-slate-400 hover:text-slate-700'
                        }`}
                    >
                        Akun Panitia / Guru Loket ({gurus.length})
                    </button>

                    <button
                        onClick={() => setTabAktif('siswa')}
                        className={`pb-3 px-4 font-black text-sm transition border-b-2 ${
                            tabAktif === 'siswa'
                                ? 'border-blue-600 text-blue-700'
                                : 'border-transparent text-slate-400 hover:text-slate-700'
                        }`}
                    >
                        Akun Siswa Terdaftar ({siswas.length})
                    </button>
                </div>

                {/* TAB 1: KELOLA AKUN GURU */}
                {tabAktif === 'guru' && (
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-900 text-white text-xs font-black uppercase tracking-wider">
                                        <th className="py-4 px-6">Nama Petugas / Guru</th>
                                        <th className="py-4 px-6">Username / NIP</th>
                                        <th className="py-4 px-6 text-center">Hak Akses Role</th>
                                        <th className="py-4 px-6 text-center">Aksi Kontrol</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
                                    {gurus.length > 0 ? (
                                        gurus.map((user) => (
                                            <tr key={user.id} className="hover:bg-slate-50 transition">
                                                <td className="py-4 px-6 font-black text-slate-900 text-sm">
                                                    {user.name}
                                                </td>
                                                <td className="py-4 px-6 font-mono text-sm font-bold text-slate-800">
                                                    {user.nisn}
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                                                        VERIFIKATOR LOKET
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-center space-x-2">
                                                    <button
                                                        onClick={() => handleOpenResetModal(user)}
                                                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-xl border border-slate-300 transition"
                                                    >
                                                        Reset Password
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenDeleteModal(user)}
                                                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold rounded-xl border border-rose-200 transition"
                                                    >
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-12 text-center text-slate-400 font-bold">
                                                Belum ada akun guru / panitia. Silakan buat akun baru.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 2: KELOLA AKUN SISWA */}
                {tabAktif === 'siswa' && (
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-900 text-white text-xs font-black uppercase tracking-wider">
                                        <th className="py-4 px-6">Nama Lengkap Siswa</th>
                                        <th className="py-4 px-6">NISN Siswa</th>
                                        <th className="py-4 px-6 text-center">Tanggal Registrasi</th>
                                        <th className="py-4 px-6 text-center">Aksi Kontrol</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
                                    {siswas.length > 0 ? (
                                        siswas.map((user) => (
                                            <tr key={user.id} className="hover:bg-slate-50 transition">
                                                <td className="py-4 px-6 font-black text-slate-900 text-sm">
                                                    {user.name}
                                                </td>
                                                <td className="py-4 px-6 font-mono text-sm font-bold text-blue-800 bg-blue-50/50 inline-block my-2 px-2.5 py-0.5 rounded-lg border border-blue-100">
                                                    {user.nisn}
                                                </td>
                                                <td className="py-4 px-6 text-center text-slate-500 font-mono">
                                                    {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="py-4 px-6 text-center space-x-2">
                                                    <button
                                                        onClick={() => handleOpenResetModal(user)}
                                                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-xl border border-slate-300 transition"
                                                    >
                                                        Reset Password NISN
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenDeleteModal(user)}
                                                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold rounded-xl border border-rose-200 transition"
                                                    >
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-12 text-center text-slate-400 font-bold">
                                                Belum ada akun siswa mendaftar di sistem.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>

            {/* MODAL TAMBAH AKUN GURU */}
            {modalGuru && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <h3 className="text-lg font-black text-slate-900">
                                Tambah Akun Panitia/Guru Baru
                            </h3>
                            <button onClick={() => setModalGuru(false)} className="text-slate-400 hover:text-slate-600 font-black">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSimpanGuru} className="space-y-4 text-xs font-bold">
                            <div>
                                <label className="block text-slate-700 mb-1">Nama Lengkap Guru / Panitia</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Pak Budi Santoso, S.Pd"
                                    value={formGuru.data.name}
                                    onChange={(e) => formGuru.setData('name', e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-bold focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 mb-1">Username / NIP Login</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: guru1 / 19850101..."
                                    value={formGuru.data.nisn}
                                    onChange={(e) => formGuru.setData('nisn', e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-bold focus:ring-2 focus:ring-blue-500 font-mono"
                                />
                                {formGuru.errors.nisn && (
                                    <span className="text-rose-600 mt-1 block">{formGuru.errors.nisn}</span>
                                )}
                            </div>

                            <div>
                                <label className="block text-slate-700 mb-1">Password Akun</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="Minimal 6 karakter"
                                    value={formGuru.data.password}
                                    onChange={(e) => formGuru.setData('password', e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-bold focus:ring-2 focus:ring-blue-500 font-mono"
                                />
                            </div>

                            <div className="pt-3 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setModalGuru(false)}
                                    className="w-full py-3 bg-slate-100 text-slate-700 font-black rounded-2xl"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={formGuru.processing}
                                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl shadow-lg"
                                >
                                    Buat Akun Guru
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL TAMBAH AKUN SISWA (NISN) */}
            {modalSiswa && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <h3 className="text-lg font-black text-slate-900">
                                Tambah Akun Siswa (NISN) Baru
                            </h3>
                            <button onClick={() => setModalSiswa(false)} className="text-slate-400 hover:text-slate-600 font-black">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSimpanSiswa} className="space-y-4 text-xs font-bold">
                            <div>
                                <label className="block text-slate-700 mb-1">Nama Lengkap Siswa</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Ahmad Rizky Pratama"
                                    value={formSiswa.data.name}
                                    onChange={(e) => formSiswa.setData('name', e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-bold focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 mb-1">NISN Siswa (Login Siswa)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: 0071234567"
                                    value={formSiswa.data.nisn}
                                    onChange={(e) => formSiswa.setData('nisn', e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-bold focus:ring-2 focus:ring-blue-500 font-mono"
                                />
                                {formSiswa.errors.nisn && (
                                    <span className="text-rose-600 mt-1 block">{formSiswa.errors.nisn}</span>
                                )}
                            </div>

                            <div>
                                <label className="block text-slate-700 mb-1">Password Akun Siswa</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="Minimal 6 karakter"
                                    value={formSiswa.data.password}
                                    onChange={(e) => formSiswa.setData('password', e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-bold focus:ring-2 focus:ring-blue-500 font-mono"
                                />
                            </div>

                            <div className="pt-3 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setModalSiswa(false)}
                                    className="w-full py-3 bg-slate-100 text-slate-700 font-black rounded-2xl"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={formSiswa.processing}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-600/30"
                                >
                                    Buat Akun Siswa
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL RESET PASSWORD USER */}
            {modalResetPass && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <h3 className="text-lg font-black text-slate-900">
                                Reset Password Akun
                            </h3>
                            <button onClick={() => setModalResetPass(null)} className="text-slate-400 hover:text-slate-600 font-black">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSimpanResetPassword} className="space-y-4 text-xs font-bold">
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                                <span className="block text-slate-500 text-[10px] uppercase">Akun Pengguna:</span>
                                <span className="text-sm font-black text-slate-900">
                                    {modalResetPass.name} ({modalResetPass.nisn})
                                </span>
                            </div>

                            <div>
                                <label className="block text-slate-700 mb-1">Password Baru</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="Masukkan password baru..."
                                    value={formReset.data.password}
                                    onChange={(e) => formReset.setData('password', e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-bold focus:ring-2 focus:ring-blue-500 font-mono"
                                />
                            </div>

                            <div className="pt-3 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setModalResetPass(null)}
                                    className="w-full py-3 bg-slate-100 text-slate-700 font-black rounded-2xl"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={formReset.processing}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-600/30"
                                >
                                    Simpan Password Baru
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL POP-UP KONFIRMASI RESET PASSWORD */}
            {modalConfirmReset && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200">
                        <div>
                            <h3 className="text-base font-black text-slate-900">Konfirmasi Reset Password</h3>
                            <p className="text-xs font-bold text-slate-500 mt-1">
                                Apakah Anda benar-benar yakin ingin mereset password akun <span className="text-slate-900 font-black">{modalConfirmReset.name}</span> ({modalConfirmReset.nisn})?
                            </p>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => setModalConfirmReset(null)}
                                className="w-full py-2.5 bg-slate-100 text-slate-700 font-black rounded-xl text-xs"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmResetOpenForm}
                                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl text-xs shadow-md"
                            >
                                Ya, Lanjutkan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL POP-UP KONFIRMASI HAPUS AKUN */}
            {modalConfirmDelete && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200">
                        <div>
                            <h3 className="text-base font-black text-slate-900">Konfirmasi Hapus Akun</h3>
                            <p className="text-xs font-bold text-slate-500 mt-1">
                                Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin menghapus akun <span className="text-slate-900 font-black">{modalConfirmDelete.name}</span>?
                            </p>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => setModalConfirmDelete(null)}
                                className="w-full py-2.5 bg-slate-100 text-slate-700 font-black rounded-xl text-xs"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmDeleteSubmit}
                                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs shadow-md"
                            >
                                Ya, Hapus Akun
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
