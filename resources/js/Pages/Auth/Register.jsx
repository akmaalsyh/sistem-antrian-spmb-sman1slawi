import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Register() {
    const { flash } = usePage().props;
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [registeredData, setRegisteredData] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        nisn: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        if (flash?.registered_user) {
            setRegisteredData(flash.registered_user);
            setShowSuccessModal(true);
            reset();
        }
    }, [flash]);

    // Handle Input NISN Khusus Angka & Maksimal 10 Digit
    const handleNisnChange = (e) => {
        const value = e.target.value;
        // Hanya ambil karakter angka
        const numericValue = value.replace(/\D/g, '');
        // Batasi maksimal 10 digit angka
        if (numericValue.length <= 10) {
            setData('nisn', numericValue);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        const currentName = data.name;
        const currentNisn = data.nisn;

        post(route('register'), {
            onSuccess: (page) => {
                const registeredUser = page.props.flash?.registered_user || { name: currentName, nisn: currentNisn };
                setRegisteredData(registeredUser);
                setShowSuccessModal(true);
                reset('password', 'password_confirmation');
            },
        });
    };

    return (
        <AuthLayout title="Daftar Akun Siswa Baru" subtitle="PORTAL RESMI SPMB 2027/2028">
            <Head title="Pendaftaran Akun - Portal SPMB SMAN 1 Slawi" />

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap Siswa" className="text-slate-700 font-extrabold text-xs uppercase tracking-wider mb-1.5" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full rounded-2xl border-slate-200 bg-slate-50/50 shadow-xs focus:border-blue-600 focus:bg-white focus:ring-blue-600 py-3 px-4 text-slate-800 font-bold text-sm placeholder-slate-400 transition"
                        autoComplete="name"
                        isFocused={true}
                        placeholder="Contoh: Ahmad Subagja"
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-1.5 text-xs text-rose-600 font-semibold" />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <InputLabel htmlFor="nisn" value="NISN (10 Digit Angka)" className="text-slate-700 font-extrabold text-xs uppercase tracking-wider" />
                        <span className={`text-[11px] font-bold ${data.nisn.length === 10 ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {data.nisn.length}/10 Digit
                        </span>
                    </div>

                    <TextInput
                        id="nisn"
                        type="text"
                        name="nisn"
                        value={data.nisn}
                        maxLength={10}
                        inputMode="numeric"
                        className="mt-1 block w-full rounded-2xl border-slate-200 bg-slate-50/50 shadow-xs focus:border-blue-600 focus:bg-white focus:ring-blue-600 py-3 px-4 text-slate-800 font-bold text-sm placeholder-slate-400 tracking-wider transition"
                        autoComplete="username"
                        placeholder="Masukkan 10 digit NISN"
                        onChange={handleNisnChange}
                        required
                    />

                    <InputError message={errors.nisn} className="mt-1.5 text-xs text-rose-600 font-semibold" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password Akun (Min 8 Karakter)" className="text-slate-700 font-extrabold text-xs uppercase tracking-wider mb-1.5" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full rounded-2xl border-slate-200 bg-slate-50/50 shadow-xs focus:border-blue-600 focus:bg-white focus:ring-blue-600 py-3 px-4 text-slate-800 font-bold text-sm placeholder-slate-400 transition"
                        autoComplete="new-password"
                        placeholder="Buat password pendaftaran"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-1.5 text-xs text-rose-600 font-semibold" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi Password"
                        className="text-slate-700 font-extrabold text-xs uppercase tracking-wider mb-1.5"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full rounded-2xl border-slate-200 bg-slate-50/50 shadow-xs focus:border-blue-600 focus:bg-white focus:ring-blue-600 py-3 px-4 text-slate-800 font-bold text-sm placeholder-slate-400 transition"
                        autoComplete="new-password"
                        placeholder="Ulangi password di atas"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-1.5 text-xs text-rose-600 font-semibold"
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-black rounded-2xl shadow-lg shadow-blue-700/25 hover:shadow-xl hover:shadow-blue-700/40 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition transform hover:-translate-y-0.5 duration-200 disabled:opacity-50 text-sm"
                    >
                        {processing ? 'Mendaftarkan Akun...' : 'Daftar Akun Baru'}
                    </button>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 text-center space-y-3">
                    <p className="text-xs text-slate-500 font-medium">
                        Sudah memiliki akun pendaftaran?{' '}
                        <Link
                            href={route('login')}
                            className="font-bold text-blue-700 hover:text-blue-900 underline underline-offset-4 transition"
                        >
                            Masuk Ke Akun
                        </Link>
                    </p>

                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 px-4 py-2 rounded-xl transition"
                        >
                            <span>← Kembali ke Beranda</span>
                        </Link>
                    </div>
                </div>
            </form>

            {/* POP-UP MODAL SUKSES PENDAFTARAN SISWA BARU */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-blue-100 transform scale-100 transition-all duration-300 relative overflow-hidden">
                        
                        {/* Hiasan Ambient Biru Sukses */}
                        <div className="absolute -top-16 -right-16 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                        {/* Icon Sukses Beranimasi */}
                        <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-100 mb-5 shadow-inner">
                            <svg className="w-10 h-10 text-emerald-600 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        {/* Judul & Kalimat Selamat */}
                        <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block mb-2">
                            🎉 AKUN TELAH TERDAFTAR
                        </span>

                        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-1">
                            Akun Telah Terdaftar!
                        </h3>
                        
                        <p className="text-sm font-extrabold text-blue-700">
                            {registeredData?.name}
                        </p>

                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                            Pendaftaran akun SPMB dengan NISN <strong className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded font-mono">{registeredData?.nisn}</strong> telah berhasil diproses.
                        </p>

                        <div className="my-5 p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 text-left space-y-1 text-xs">
                            <p className="font-bold text-blue-900">📌 Langkah Selanjutnya:</p>
                            <p className="text-slate-600 text-[11px]">Silakan klik tombol <strong>"Masuk Akun"</strong> di bawah untuk login dan memilih tanggal kedatangan antrean verifikasi berkas.</p>
                        </div>

                        {/* Tombol Menuju Masuk Akun */}
                        <div className="pt-2">
                            <Link
                                href={route('login')}
                                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-extrabold rounded-2xl shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50 transition transform hover:-translate-y-0.5 duration-200 text-sm"
                            >
                                <span>🚀 Masuk Akun</span>
                                <span>&rarr;</span>
                            </Link>
                        </div>

                    </div>
                </div>
            )}
        </AuthLayout>
    );
}
