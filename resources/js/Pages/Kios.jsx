import { Head, Link } from '@inertiajs/react';

export default function Kios({ jadwal }) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-10 px-4">
            <Head title="Kios Antrean SPMB" />

            <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                {/* Header Kios */}
                <div className="text-center mb-8 border-b pb-6">
                    <h1 className="text-3xl font-extrabold text-blue-900">Sistem Antrean SPMB</h1>
                    <p className="text-gray-500 mt-1">SMA Negeri 1 Slawi</p>
                </div>

                {/* Tombol Navigasi */}
                <div className="mb-6 flex justify-between items-center bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">Silakan pilih tanggal untuk verifikasi berkas</p>
                    <div>
                        <Link href={route('login')} className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium transition mr-2">
                            Log in
                        </Link>
                        <Link href={route('register')} className="text-sm text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 px-4 py-2 rounded-md font-medium transition">
                            Daftar Akun
                        </Link>
                    </div>
                </div>

                {/* Kalender / Daftar Tanggal */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {jadwal.map((item) => {
                        const sisaKuota = item.kuota_maksimal - item.terisi;
                        const isPenuh = sisaKuota <= 0;

                        return (
                            <div 
                                key={item.id} 
                                className={`border-2 p-4 rounded-xl text-center transition ${
                                    isPenuh 
                                    ? 'bg-red-50 border-red-200 cursor-not-allowed opacity-60' 
                                    : 'bg-white border-gray-200 hover:border-blue-500 hover:shadow-md cursor-pointer'
                                }`}
                            >
                                <p className={`font-bold text-lg ${isPenuh ? 'text-red-700' : 'text-gray-800'}`}>
                                    {item.tanggal}
                                </p>
                                <div className={`mt-2 text-xs font-semibold inline-block px-2 py-1 rounded-full ${
                                    isPenuh ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'
                                }`}>
                                    Sisa Kuota: {sisaKuota}
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}