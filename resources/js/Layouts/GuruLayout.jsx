import LogoSmansawi from '@/Components/LogoSmansawi';
import Dropdown from '@/Components/Dropdown';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function GuruLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleConfirmLogout = () => {
        router.post(route('logout'));
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans selection:bg-blue-600 selection:text-white">
            {/* TOP NAVBAR VERIFIKATOR GURU */}
            <nav className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-lg">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        
                        {/* LOGO BRAND VERIFIKATOR */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <LogoSmansawi className="w-10 h-10" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-white leading-none text-base tracking-tight">
                                            SMA N 1 Slawi
                                        </span>
                                        <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            Panel Verifikator
                                        </span>
                                    </div>
                                    <span className="block text-[10px] font-semibold text-slate-400 tracking-wide mt-0.5">
                                        Sistem Penerimaan Murid Baru
                                    </span>
                                </div>
                            </div>

                            <div className="hidden md:flex border-l border-slate-800 ms-4 pl-5 h-8 items-center gap-2">
                                <Link
                                    href={route('guru.dashboard')}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition ${
                                        route().current('guru.dashboard')
                                            ? 'bg-blue-600 text-white shadow-xs'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                    }`}
                                >
                                    Kontrol Meja Antrean
                                </Link>

                                {/* TOMBOL LAYAR MONITOR UNTUK FULLSCREEN DISPLAY */}
                                <a
                                    href={route('monitor')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition"
                                >
                                    Layar Monitor (Display)
                                </a>
                            </div>
                        </div>

                        {/* DESKTOP USER MENU & JAM */}
                        <div className="hidden md:flex md:items-center md:gap-4">
                            <div className="text-right border-r border-slate-800 pr-4">
                                <span className="block text-xs font-mono font-bold text-slate-300">
                                    {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            </div>

                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-3 rounded-2xl bg-slate-800 border border-slate-700/80 px-3.5 py-2 text-xs font-extrabold text-slate-200 transition hover:bg-slate-700 focus:outline-hidden"
                                        >
                                            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-black text-xs shadow-xs">
                                                {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
                                            </div>
                                            <div className="text-left">
                                                <span className="block text-slate-100 font-extrabold leading-none text-xs">
                                                    {user?.name || 'Petugas Verifikator'}
                                                </span>
                                                <span className="block text-[10px] font-semibold text-blue-400 mt-0.5">
                                                    NIP: {user?.nisn}
                                                </span>
                                            </div>
                                            <svg className="h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content align="right" width="48">
                                        <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Peran Pengguna</p>
                                            <p className="text-xs font-black text-slate-800">Guru / Panitia Verifikasi</p>
                                        </div>
                                        <button
                                            onClick={() => setShowLogoutModal(true)}
                                            className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition flex items-center gap-2"
                                        >
                                            Keluar Sistem Guru
                                        </button>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* MOBILE HAMBURGER BUTTON */}
                        <div className="flex md:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center rounded-xl p-2 text-slate-300 hover:bg-slate-800 hover:text-white focus:outline-hidden"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* MOBILE MENU */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' md:hidden border-t border-slate-800 bg-slate-900 pb-4 pt-2'}>
                    <div className="space-y-2 px-4">
                        <Link
                            href={route('guru.dashboard')}
                            className="block rounded-xl px-3 py-2 text-xs font-extrabold bg-blue-600 text-white"
                        >
                            Kontrol Meja Antrean
                        </Link>
                        <a
                            href={route('monitor')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-xl px-3 py-2 text-xs font-extrabold bg-indigo-600 text-white"
                        >
                            Layar Monitor (Display)
                        </a>
                    </div>

                    <div className="mt-4 border-t border-slate-800 pt-4 px-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
                            </div>
                            <div>
                                <div className="text-xs font-black text-white">{user?.name}</div>
                                <div className="text-[10px] font-medium text-blue-400">NIP: {user?.nisn}</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowLogoutModal(true)}
                            className="w-full text-left rounded-xl px-3 py-2 text-xs font-extrabold text-rose-400 hover:bg-rose-950/40"
                        >
                            Keluar Sistem Guru
                        </button>
                    </div>
                </div>
            </nav>

            {/* MAIN CONTENT */}
            <main className="py-6">{children}</main>

            {/* MODAL KONFIRMASI LOGOUT */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
                    <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 text-center space-y-4">
                        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto text-xl font-black">
                            🚪
                        </div>
                        <div>
                            <h3 className="text-base font-black text-slate-900">Konfirmasi Keluar</h3>
                            <p className="text-xs text-slate-500 font-medium mt-1">
                                Apakah Anda yakin ingin keluar dari sesi petugas verifikator?
                            </p>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl text-xs transition"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmLogout}
                                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs shadow-md shadow-rose-600/20 transition"
                            >
                                Ya, Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
