import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function CekBerkas() {
    const dokumenReq = [
        {
            nama: 'Kartu Keluarga (KK)',
            sifat: 'Asli & Fotokopi (1 Lembar)',
            desc: 'Diterbitkan paling singkat 1 (satu) tahun sebelum tanggal pendaftaran SPMB.'
        },
        {
            nama: 'Surat Keterangan Nilai Rapor',
            sifat: 'Asli',
            desc: 'Mencantumkan nilai 7 mata pelajaran pokok Semester 1 s.d. 5 yang disahkan Kepala SMP/MTs.'
        },
        {
            nama: 'Akta Kelahiran',
            sifat: 'Asli & Fotokopi (1 Lembar)',
            desc: 'Batas usia setinggi-tingginya 21 tahun pada awal tahun ajaran 2027/2028.'
        },
        {
            nama: 'Surat Keterangan Lulus (SKL)',
            sifat: 'Asli',
            desc: 'Diterbitkan resmi dari sekolah asal SMP/MTs sederajat.'
        },
        {
            nama: 'Buku Rapor SMP/MTs',
            sifat: 'Asli',
            desc: 'Buku Rapor asli fisik untuk verifikasi keabsahan nilai rapor.'
        },
        {
            nama: 'Sertifikat Hasil TKA',
            sifat: 'Asli',
            desc: 'Sertifikat Hasil Tes Kemampuan Akademik (jika dipersyaratkan).'
        },
        {
            nama: 'Sertifikat Kejuaraan / Prestasi',
            sifat: 'Asli & Fotokopi (Jika Memiliki)',
            desc: 'Kejuaraan beregu/perorangan bidang akademik maupun non-akademik (khusus pendaftar Jalur Prestasi).'
        },
    ];

    const mapelPenilaian = [
        { no: 1, nama: 'Pendidikan Agama & Budi Pekerti', icon: '📖' },
        { no: 2, nama: 'Pancasila & Kewarganegaraan (PPKn)', icon: '🇮🇩' },
        { no: 3, nama: 'Bahasa Indonesia', icon: '📝' },
        { no: 4, nama: 'Matematika', icon: '📐' },
        { no: 5, nama: 'Ilmu Pengetahuan Alam (IPA)', icon: '🔬' },
        { no: 6, nama: 'Ilmu Pengetahuan Sosial (IPS)', icon: '🌍' },
        { no: 7, nama: 'Bahasa Inggris', icon: '🗣️' },
    ];

    const jalurSeleksi = [
        { nama: 'Jalur Domisili', kuota: 'Paling sedikit 33%', color: 'border-blue-500 bg-blue-50/50 text-blue-900' },
        { nama: 'Jalur Afirmasi', kuota: 'Paling sedikit 32%', color: 'border-emerald-500 bg-emerald-50/50 text-emerald-900' },
        { nama: 'Jalur Prestasi', kuota: 'Paling sedikit 30%', color: 'border-purple-500 bg-purple-50/50 text-purple-900' },
        { nama: 'Jalur Mutasi / Anak Guru', kuota: 'Paling banyak 5%', color: 'border-amber-500 bg-amber-50/50 text-amber-900' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Cek Berkas Persyaratan - SPMB SMAN 1 Slawi" />

            <div className="py-8 bg-slate-50 min-h-[calc(100vh-65px)]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                    {/* Banner Header Halaman */}
                    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-blue-800/40 relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                            <div>
                                <span className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-[11px] font-extrabold uppercase tracking-widest text-blue-200 mb-2">
                                    📋 Panduan Resmi Berkas Fisik
                                </span>
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                                    Daftar Berkas Persyaratan Verifikasi
                                </h1>
                                <p className="text-xs sm:text-sm text-blue-200 mt-1.5 leading-relaxed max-w-2xl">
                                    Pastikan seluruh dokumen fisik di bawah ini telah siap dan dibawa saat datang ke SMAN 1 Slawi sesuai jadwal jam antrean Anda.
                                </p>
                            </div>

                            <Link
                                href={route('etiket')}
                                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-blue-950 font-extrabold text-xs shadow-lg hover:bg-blue-50 transition shrink-0"
                            >
                                <span>← Kembali ke E-Tiket</span>
                            </Link>
                        </div>
                    </div>

                    {/* Ringkasan Kuota Jalur Seleksi */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {jalurSeleksi.map((j, idx) => (
                            <div key={idx} className={`p-4 rounded-2xl border ${j.color} shadow-xs`}>
                                <span className="block text-[10px] font-black uppercase tracking-wider opacity-80">{j.kuota}</span>
                                <span className="block font-black text-sm sm:text-base mt-0.5">{j.nama}</span>
                            </div>
                        ))}
                    </div>

                    {/* Grid Utama 2 Kolom: Berkas Wajib & 7 Mapel */}
                    <div className="grid md:grid-cols-12 gap-8 items-start">
                        
                        {/* Kolom Kiri: 7 Dokumen Fisik Wajib */}
                        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-600/20">
                                    📄
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-900">Kelengkapan Dokumen Fisik</h2>
                                    <p className="text-xs text-slate-500">Wajib dibawa dalam stopmap saat verifikasi</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {dokumenReq.map((doc, idx) => (
                                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 hover:bg-blue-50/50 hover:border-blue-200 transition duration-150">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <span className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                                                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-black shrink-0">
                                                    ✓
                                                </span>
                                                {doc.nama}
                                            </span>
                                            <span className="text-[10px] font-black text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-full shrink-0">
                                                {doc.sifat}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 pl-7 leading-relaxed">{doc.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Kolom Kanan: 7 Mata Pelajaran Penilaian */}
                        <div className="md:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-600/20">
                                    📚
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-900">7 Mata Pelajaran Penilaian</h2>
                                    <p className="text-xs text-slate-500">Nilai Rapor Semester 1 s.d. 5</p>
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                {mapelPenilaian.map((m) => (
                                    <div key={m.no} className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 font-bold text-xs sm:text-sm text-slate-800 hover:bg-indigo-50/50 hover:border-indigo-200 transition duration-150">
                                        <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                                            {m.no}
                                        </span>
                                        <span className="text-base">{m.icon}</span>
                                        <span className="truncate">{m.nama}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs space-y-1">
                                <p className="font-extrabold flex items-center gap-1.5">
                                    <span>💡</span> Catatan Penting Panitia:
                                </p>
                                <p className="text-amber-800 text-[11px] leading-relaxed">
                                    Pastikan nilai pada Surat Keterangan Nilai Rapor telah sesuai dengan Buku Rapor asli agar proses validasi berjalan cepat.
                                </p>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
