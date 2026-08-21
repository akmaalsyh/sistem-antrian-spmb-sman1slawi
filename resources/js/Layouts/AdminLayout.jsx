import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const currentRoute = route().current();
    const [modalConfirmLogout, setModalConfirmLogout] = useState(false);
    const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Disesuaikan persis urutannya sesuai permintaan user (tanpa ikon):
    // 1. Dashboard
    // 2. Kelola Halaman Utama
    // 3. Kelola Jadwal & Kuota
    // 4. Pengaturan Sistem Siswa
    // 5. Manajemen Pengguna
    // 6. Laporan dan Rekapitulasi
    const navigation = [
        { name: 'Dashboard Admin', href: route('admin.dashboard'), active: currentRoute === 'admin.dashboard' },
        { name: 'Kelola Halaman Utama', href: route('admin.landing'), active: currentRoute === 'admin.landing' },
        { name: 'Kelola Jadwal & Kuota', href: route('admin.jadwal'), active: currentRoute === 'admin.jadwal' },
        { name: 'Pengaturan Sistem Siswa', href: route('admin.pengaturan'), active: currentRoute === 'admin.pengaturan' },
        { name: 'Manajemen Pengguna', href: route('admin.users'), active: currentRoute === 'admin.users' },
        { name: 'Laporan & Rekapitulasi', href: route('admin.laporan'), active: currentRoute === 'admin.laporan' },
    ];

    const handleConfirmLogout = () => {
        router.post(route('logout'));
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-800">

            {/* HEADER MOBILE (HAMBURGER + BRANDING) */}
            <div className="md:hidden bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-50 shadow-md">
                <div className="flex items-center gap-3">
                    <ApplicationLogo className="w-8 h-8" />
                    <div>
                        <h1 className="text-sm font-black tracking-tight text-white leading-none">
                            SMAN 1 SLAWI
                        </h1>
                        <span className="text-[9px] font-bold text-amber-400 tracking-wider uppercase">
                            Admin Panel
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setModalConfirmLogout(true)}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-sm transition"
                    >
                        Keluar
                    </button>
                    <button
                        onClick={() => setSidebarOpenMobile(!sidebarOpenMobile)}
                        className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white transition"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {sidebarOpenMobile ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* OVERLAY MOBILE SIDEBAR */}
            {sidebarOpenMobile && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden"
                    onClick={() => setSidebarOpenMobile(false)}
                />
            )}

            {/* SIDEBAR CONTAINER (DESKTOP + MOBILE DRAWER) */}
            <aside className={`
                fixed md:sticky top-0 z-40 h-screen bg-slate-900 text-white border-r border-slate-800 flex flex-col justify-between shrink-0 shadow-2xl transition-all duration-300 ease-in-out
                ${isCollapsed ? 'md:w-20' : 'md:w-72'}
                ${sidebarOpenMobile ? 'w-72 translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                
                {/* BRANDING TOP SIDEBAR & MINIMIZE TOGGLE BUTTON */}
                <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <ApplicationLogo className="w-10 h-10 drop-shadow-md shrink-0" />
                        {!isCollapsed && (
                            <div className="truncate transition-opacity duration-200">
                                <h1 className="text-base font-black tracking-tight text-white leading-tight truncate">
                                    SMAN 1 SLAWI
                                </h1>
                                <span className="text-[10px] font-bold text-amber-400 tracking-wider uppercase block mt-0.5 truncate">
                                    Panel Administrator
                                </span>
                            </div>
                        )}
                    </div>

                    {/* TOMBOL MINIMIZE / COLLAPSE SIDEBAR */}
                    <button
                        type="button"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        title={isCollapsed ? "Perluas Sidebar" : "Kecilkan / Minimize Sidebar"}
                        className="hidden md:flex items-center justify-center w-8 h-8 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition duration-200 shrink-0 ml-1 border border-slate-700"
                    >
                        {isCollapsed ? '❯' : '❮'}
                    </button>
                </div>

                {/* NAVIGATION MENU LIST */}
                <div className="flex-1 px-3 py-6 overflow-y-auto space-y-1.5 custom-scrollbar">
                    {!isCollapsed && (
                        <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400 truncate">
                            Menu Utama Sistem
                        </div>
                    )}

                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            title={isCollapsed ? item.name : undefined}
                            onClick={() => setSidebarOpenMobile(false)}
                            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-4'} py-3 rounded-2xl text-xs font-black transition duration-200 ${
                                item.active
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {isCollapsed ? (
                                    <span className="font-black text-sm">{item.name.charAt(0)}</span>
                                ) : (
                                    <span className="truncate">{item.name}</span>
                                )}
                            </div>
                            {!isCollapsed && item.active && (
                                <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />
                            )}
                        </Link>
                    ))}

                    <div className="pt-6">
                        {!isCollapsed && (
                            <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
                                Pintasan Display
                            </div>
                        )}

                        <Link
                            href={route('monitor')}
                            target="_blank"
                            title="Monitor Display Antrean"
                            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-4'} py-3 rounded-2xl text-xs font-black bg-amber-400/10 text-amber-300 border border-amber-400/30 hover:bg-amber-400/20 transition`}
                        >
                            <div className="flex items-center gap-2">
                                {!isCollapsed ? <span className="truncate">Monitor Display</span> : <span className="font-black text-sm">M</span>}
                            </div>
                            {!isCollapsed && <span>↗</span>}
                        </Link>
                    </div>
                </div>

                {/* BOTTOM USER PROFILE & LOGOUT BUTTON */}
                <div className="p-3 border-t border-slate-800/80 bg-slate-950/50 space-y-2">
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 p-2.5'} rounded-2xl bg-slate-800/60 border border-slate-700/60`}>
                        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-md">
                            {auth.user.name ? auth.user.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        {!isCollapsed && (
                            <div className="truncate">
                                <span className="block text-xs font-black text-white truncate">
                                    {auth.user.name}
                                </span>
                                <span className="block text-[9px] font-bold text-slate-400 uppercase">
                                    Admin
                                </span>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setModalConfirmLogout(true)}
                        title="Keluar Akun Admin"
                        className={`w-full py-2.5 ${isCollapsed ? 'px-2' : 'px-4'} rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 transition text-xs font-extrabold text-center block`}
                    >
                        {isCollapsed ? '🚪' : 'Keluar Akun Admin'}
                    </button>
                </div>

            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0">
                
                {/* TOP HEADER BAR DESKTOP WITH LOGOUT BUTTON */}
                <header className="hidden md:flex items-center justify-between bg-white border-b border-slate-200 px-8 py-4 shadow-xs sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="mr-2 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1.5 transition"
                        >
                            <span>{isCollapsed ? '▶ Perluas Menu' : '◀ Minimize Menu'}</span>
                        </button>
                        <span className="text-xs font-bold text-slate-400">SMAN 1 SLAWI</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-xs font-black text-blue-700 uppercase tracking-wider">
                            {navigation.find(n => n.active)?.name || 'Dashboard Admin'}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-slate-50 border border-slate-200">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-extrabold text-slate-800">{auth.user.name}</span>
                            <span className="text-[10px] bg-blue-100 text-blue-800 font-black px-2 py-0.5 rounded-lg uppercase">
                                Admin
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => setModalConfirmLogout(true)}
                            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md shadow-rose-600/20 transition duration-200"
                        >
                            Keluar Sesi Akun
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>

                {/* FOOTER ADMIN */}
                <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs font-bold text-slate-500">
                    Panel Kontrol SPMB &copy; {new Date().getFullYear()} SMAN 1 Slawi - All Rights Reserved
                </footer>
            </div>

            {/* MODAL POP-UP KONFIRMASI LOGOUT */}
            {modalConfirmLogout && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200">
                        <div>
                            <h3 className="text-base font-black text-slate-900">Konfirmasi Keluar System</h3>
                            <p className="text-xs font-bold text-slate-500 mt-1">
                                Apakah Anda yakin ingin keluar dari Panel Kontrol Administrator SMAN 1 Slawi?
                            </p>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => setModalConfirmLogout(false)}
                                className="w-full py-2.5 bg-slate-100 text-slate-700 font-black rounded-xl text-xs"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmLogout}
                                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs shadow-md"
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
