import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ auth, antreanSiswa, jadwalTersedia }) {
    
    // State untuk menyimpan ID jadwal yang dipilih dari dropdown
    const [selectedJadwalId, setSelectedJadwalId] = useState('');

    // Fungsi mengubah format '2027-06-01' menjadi 'Selasa, 1 Juni 2027'
    const formatTanggal = (tanggalString) => {
        const date = new Date(tanggalString);
        return date.toLocaleDateString('id-ID', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });
    };

    // Fungsi saat tombol Ambil Antrean diklik
    const handleAmbilAntrean = (e) => {
        e.preventDefault();
        if (!selectedJadwalId) return;

        const jadwalDipilih = jadwalTersedia.find(j => j.id == selectedJadwalId);
        
        if (confirm(`Yakin ingin mengambil antrean untuk ${formatTanggal(jadwalDipilih.tanggal)}?`)) {
            router.post('/dashboard/ambil-antrean', { jadwal_id: selectedJadwalId });
        }
    };

    // Variabel untuk menampilkan kotak info (hijau/merah) di bawah dropdown
    const selectedJadwal = jadwalTersedia.find(j => j.id == selectedJadwalId);
    const sisaKuota = selectedJadwal ? selectedJadwal.kuota_maksimal - selectedJadwal.terisi : 0;
    const isPenuh = sisaKuota <= 0;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Antrean SPMB</h2>}
        >
            <Head title="Dashboard Siswa" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {antreanSiswa ? (
                        /* TAMPILAN TIKET VIRTUAL (Jika sudah punya antrean) */
                        <div className="bg-white overflow-hidden shadow-xl sm:rounded-2xl border border-gray-100 max-w-2xl mx-auto">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center text-white">
                                <h3 className="text-sm font-semibold tracking-widest uppercase mb-1">Tiket Verifikasi Berkas</h3>
                                <p className="text-gray-200 text-sm">SMAN 1 Slawi</p>
                                
                                <div className="mt-6 mb-4">
                                    <p className="text-sm text-blue-100 mb-1">Nomor Antrean Anda</p>
                                    <h1 className="text-6xl font-extrabold tracking-tight">
                                        {antreanSiswa.nomor_urut}
                                    </h1>
                                </div>
                                
                                <span className="inline-flex items-center rounded-full bg-blue-800 px-3 py-1 text-sm font-medium text-blue-100 ring-1 ring-inset ring-blue-500/50">
                                    Status: {antreanSiswa.status}
                                </span>
                            </div>
                            
                            <div className="p-6 bg-gray-50 flex flex-col gap-4">
                                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                                    <span className="text-gray-500 text-sm">Nama Lengkap</span>
                                    <span className="font-bold text-gray-800">{auth.user.name}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                                    <span className="text-gray-500 text-sm">Jadwal Kedatangan</span>
                                    <span className="font-bold text-blue-700">{formatTanggal(antreanSiswa.jadwal.tanggal)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-sm">Dilayani di Meja</span>
                                    <span className="font-bold text-gray-800">
                                        {antreanSiswa.dilayani_oleh_meja ? `Meja ${antreanSiswa.dilayani_oleh_meja}` : 'Menunggu Arahan'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* TAMPILAN FORM DROPDOWN (Jika belum punya antrean) */
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 max-w-3xl mx-auto">
                            <div className="mb-6 border-b pb-4">
                                <h3 className="text-xl font-bold text-gray-800">Pilih Jadwal Kedatangan</h3>
                                <p className="text-gray-500 mt-1 text-sm">Silakan pilih tanggal untuk melakukan verifikasi berkas.</p>
                            </div>

                            <form onSubmit={handleAmbilAntrean}>
                                <div className="mb-5">
                                    <label htmlFor="jadwal" className="block mb-2 text-sm font-medium text-gray-900">
                                        Tanggal Tersedia
                                    </label>
                                    <select 
                                        id="jadwal" 
                                        value={selectedJadwalId}
                                        onChange={(e) => setSelectedJadwalId(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                        required
                                    >
                                        <option value="" disabled>-- Klik untuk memilih tanggal --</option>
                                        
                                        {jadwalTersedia.map((item) => {
                                            const sisa = item.kuota_maksimal - item.terisi;
                                            const isFull = sisa <= 0;
                                            
                                            return (
                                                <option key={item.id} value={item.id} disabled={isFull}>
                                                    {formatTanggal(item.tanggal)} {isFull ? '(KUOTA PENUH)' : `- Tersedia`}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                {/* Kotak Preview Info Kuota (Otomatis muncul jika ada tanggal yang dipilih) */}
                                {selectedJadwal && (
                                    <div className={`p-4 mb-6 text-sm rounded-lg border ${isPenuh ? 'bg-red-50 text-red-800 border-red-200' : 'bg-green-50 text-green-800 border-green-200'}`}>
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold">Status Kuota:</span>
                                            <span className="font-extrabold text-base">
                                                {isPenuh ? 'HABIS' : `Sisa ${sisaKuota} Orang`}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    disabled={!selectedJadwalId || isPenuh}
                                    className="w-full text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 font-medium rounded-lg text-sm px-5 py-3 text-center transition"
                                >
                                    Ambil Antrean
                                </button>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}