import { Link } from '@inertiajs/react';
import LogoSmansawi from '@/Components/LogoSmansawi';

export default function AuthLayout({ children, title = "Sistem Antrean SPMB", subtitle = "Portal Resmi Sistem Penerimaan Murid Baru" }) {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 px-4 py-8 sm:px-6 lg:px-8 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
            
            {/* Ambient Background Decorative Elements */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-900/15 rounded-full blur-3xl pointer-events-none" />

            {/* Header Brand dengan Logo Asli SMAN 1 Slawi */}
            <div className="w-full max-w-md text-center mb-8 z-10">
                <Link href="/" className="inline-flex flex-col items-center group">
                    <div className="transition transform group-hover:scale-105 duration-300 drop-shadow-md">
                        <LogoSmansawi className="w-16 h-16" />
                    </div>
                    
                    <h1 className="mt-4 text-2xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-blue-700 transition">
                        SMA NEGERI 1 SLAWI
                    </h1>
                    <p className="text-xs font-extrabold text-blue-600 uppercase tracking-widest mt-1">
                        {subtitle}
                    </p>
                </Link>
            </div>

            {/* Main Card Container Minimalis & Elegan */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-blue-100 p-8 sm:p-10 z-10 relative">
                <div className="mb-6 text-center">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">{title}</h2>
                    <p className="text-xs text-slate-500 mt-1">Silakan isi formulir di bawah ini dengan data valid</p>
                </div>
                {children}
            </div>

            {/* Footer Copy Attribution */}
            <div className="mt-8 text-center text-xs text-slate-400 font-semibold z-10">
                &copy; {new Date().getFullYear()} SMAN 1 Slawi &bull; Panitia SPMB &amp; KKN Sahabat Sekolah Jateng 001 UMY
            </div>
        </div>
    );
}
