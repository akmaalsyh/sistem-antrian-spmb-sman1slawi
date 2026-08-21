import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function LoginGuru({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nisn: '',
        password: '',
        target_role: 'guru',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Portal Guru & Verifikator" subtitle="TIM VERIFIKASI BERKAS SMAN 1 SLAWI">
            <Head title="Masuk Guru - Portal SPMB SMAN 1 Slawi" />

            {status && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                    {status}
                </div>
            )}

            <div className="mb-4 p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-800 text-center">
                👨‍🏫 Halaman Khusus Login Tim Verifikator (Guru)
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="nisn" value="NIP / ID Guru Verifikator" className="text-slate-700 font-extrabold text-xs uppercase tracking-wider mb-1.5" />

                    <TextInput
                        id="nisn"
                        type="text"
                        name="nisn"
                        value={data.nisn}
                        className="mt-1 block w-full rounded-2xl border-slate-200 bg-slate-50/50 shadow-xs focus:border-indigo-600 focus:bg-white focus:ring-indigo-600 py-3 px-4 text-slate-800 font-bold text-sm placeholder-slate-400 transition"
                        autoComplete="username"
                        isFocused={true}
                        placeholder="Contoh: GURU001"
                        onChange={(e) => setData('nisn', e.target.value)}
                        required
                    />

                    <InputError message={errors.nisn} className="mt-1.5 text-xs text-rose-600 font-semibold" />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <InputLabel htmlFor="password" value="Password Akun Guru" className="text-slate-700 font-extrabold text-xs uppercase tracking-wider" />
                    </div>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full rounded-2xl border-slate-200 bg-slate-50/50 shadow-xs focus:border-indigo-600 focus:bg-white focus:ring-indigo-600 py-3 px-4 text-slate-800 font-bold text-sm placeholder-slate-400 transition"
                        autoComplete="current-password"
                        placeholder="Masukkan password akun guru"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-1.5 text-xs text-rose-600 font-semibold" />
                </div>

                <div className="pt-1 flex items-center justify-between">
                    <label className="flex items-center cursor-pointer group">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded-lg border-slate-300 text-indigo-600 shadow-xs focus:ring-indigo-600 w-4 h-4"
                        />
                        <span className="ms-2 text-xs text-slate-600 font-semibold group-hover:text-indigo-700 transition">
                            Ingat sesi guru
                        </span>
                    </label>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 px-6 bg-gradient-to-r from-indigo-700 to-blue-900 hover:from-indigo-800 hover:to-blue-950 text-white font-black rounded-2xl shadow-lg shadow-indigo-900/25 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition transform hover:-translate-y-0.5 duration-200 disabled:opacity-50 text-sm"
                    >
                        {processing ? 'Otentikasi Guru...' : 'Masuk Portal Guru'}
                    </button>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-700 bg-slate-100 hover:bg-indigo-50 px-4 py-2 rounded-xl transition"
                    >
                        <span>← Kembali ke Beranda</span>
                    </Link>
                </div>

            </form>
        </AuthLayout>
    );
}
