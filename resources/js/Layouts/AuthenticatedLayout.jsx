import LogoSmansawi from '@/Components/LogoSmansawi';
import Dropdown from '@/Components/Dropdown';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleConfirmLogout = () => {
        router.post(route('logout'));
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-600 selection:text-white">
            {/* TOP NAVBAR ULTRA-ELEGAN & MINIMALIS */}
            <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        
                        {/* LOGO BRAND SMAN 1 SLAWI */}
                        <div className="flex items-center gap-4">
                            <Link href={route('siswa.etiket')} className="flex items-center gap-3 group">
                                <LogoSmansawi className="w-10 h-10 transition transform group-hover:scale-105 duration-200" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-slate-900 leading-none text-base tracking-tight group-hover:text-blue-600 transition">
                                            SMAN 1 SLAWI
                                        </span>
                                        <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            SPMB
                                        </span>
                                    </div>
                                    <span className="block text-[10px] font-bold text-slate-400 tracking-wide mt-0.5">
                                        Portal Antrean Siswa
                                    </span>
                                </div>
                            </Link>

                            <div className="hidden md:flex border-l border-slate-200 ms-4 pl-5 h-8 items-center gap-2">
                                <Link
                                    href={route('siswa.etiket')}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition ${
                                        route().current('siswa.etiket')
                                            ? 'bg-blue-600 text-white shadow-xs'
                                            : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
                                    }`}
                                >
                                    E-Tiket
                                </Link>
                                <Link
                                    href={route('siswa.cek-berkas')}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition ${
                                        route().current('siswa.cek-berkas')
                                            ? 'bg-blue-600 text-white shadow-xs'
                                            : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
                                    }`}
                                >
                                    Cek Berkas
                                </Link>
                            </div>
                        </div>

                        {/* USER PROFILE DROPDOWN ELEGANT */}
                        <div className="hidden sm:flex sm:items-center">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="flex items-center gap-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 px-3.5 py-1.5 text-xs font-bold text-slate-800 transition duration-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="text-left">
                                            <span className="block font-extrabold text-slate-900 text-xs leading-tight max-w-[150px] truncate">{user.name}</span>
                                            <span className="block text-[10px] font-mono text-slate-400">NISN: {user.nisn}</span>
                                        </div>
                                        <svg className="ms-1 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content align="right" width="56" contentClasses="py-2 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-100">
                                    <div className="px-4 py-2.5 border-b border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Sesi</p>
                                        <p className="text-xs font-extrabold text-blue-700">Calon Peserta Didik Baru</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowLogoutModal(true)}
                                        className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition flex items-center gap-2"
                                    >
                                        Keluar Sesi Akun
                                    </button>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* HAMBURGER BUTTON MOBILE */}
                        <div className="flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                                className="p-2.5 rounded-2xl bg-slate-100 text-slate-600 hover:text-slate-900 transition"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showingNavigationDropdown ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* MOBILE MENU DROPDOWN */}
                {showingNavigationDropdown && (
                    <div className="sm:hidden border-t border-slate-100 bg-white/95 backdrop-blur-lg px-4 pt-3 pb-4 space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="text-sm font-extrabold text-slate-900">{user.name}</div>
                                <div className="text-xs text-slate-500 font-mono">NISN: {user.nisn}</div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Link
                                href={route('siswa.etiket')}
                                className={`w-full block font-extrabold text-xs p-3 rounded-2xl transition ${
                                    route().current('siswa.etiket')
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                E-Tiket Antrean
                            </Link>
                            <Link
                                href={route('siswa.cek-berkas')}
                                className={`w-full block font-extrabold text-xs p-3 rounded-2xl transition ${
                                    route().current('siswa.cek-berkas')
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                Cek Berkas Persyaratan
                            </Link>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowLogoutModal(true)}
                            className="w-full text-left font-extrabold text-xs text-rose-600 bg-rose-50 p-3 rounded-2xl border border-rose-200 flex items-center justify-between"
                        >
                            <span>🚪 Keluar Sesi Akun</span>
                            <span>→</span>
                        </button>
                    </div>
                )}
            </nav>

            <main>{children}</main>

            {/* MODAL POPUP KONFIRMASI LOGOUT */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center transform animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">
                            Konfirmasi Keluar Akun
                        </h3>
                        
                        <p className="text-xs font-semibold text-slate-500 leading-relaxed mb-6">
                            Apakah Anda yakin ingin keluar dari portal sesi akun <span className="font-extrabold text-slate-800">{user.name}</span>? Anda perlu masuk kembali untuk mengakses tiket antrean.
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setShowLogoutModal(false)}
                                className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmLogout}
                                className="py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 transition transform hover:-translate-y-0.5"
                            >
                                Ya, Keluar Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
