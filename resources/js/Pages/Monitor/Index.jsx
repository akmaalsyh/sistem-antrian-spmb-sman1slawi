import LogoSmansawi from '@/Components/LogoSmansawi';
import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function Monitor({ antreanAktif: initialAntreanAktif, riwayatPanggilan: initialRiwayat, statistik: initialStatistik }) {
    const [antreanAktif, setAntreanAktif] = useState(initialAntreanAktif);
    const [riwayatPanggilan, setRiwayatPanggilan] = useState(initialRiwayat || []);
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [audioActivated, setAudioActivated] = useState(false);

    const prevAntreanRef = useRef(null);

    // Aktifkan Suara Audio & Fullscreen dari interaksi pertama pengguna pada layar
    useEffect(() => {
        const handleUserActivation = () => {
            setAudioActivated(true);
            
            // Tes audio ringan saat pertama kali di-klik pengguna untuk membuka izin browser
            if ('speechSynthesis' in window) {
                window.speechSynthesis.resume();
            }

            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            }
        };

        window.addEventListener('click', handleUserActivation);
        window.addEventListener('keydown', handleUserActivation);

        return () => {
            window.removeEventListener('click', handleUserActivation);
            window.removeEventListener('keydown', handleUserActivation);
        };
    }, []);

    // Update real-time clock
    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
            setCurrentDate(now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
        };
        updateClock();
        const timer = setInterval(updateClock, 1000);
        return () => clearInterval(timer);
    }, []);

    // Polling data realtime antrean setiap 3 detik
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(route('api.monitor-data'));
                if (res.ok) {
                    const data = await res.json();
                    
                    // Cek jika ada panggilan antrean baru atau panggil ulang
                    if (data.antreanAktif) {
                        const newTime = data.antreanAktif.updated_at_timestamp || data.antreanAktif.updated_at;
                        const prevTime = prevAntreanRef.current?.updated_at_timestamp || prevAntreanRef.current?.updated_at;
                        
                        const isNewCall = !prevAntreanRef.current || 
                                          prevAntreanRef.current.id !== data.antreanAktif.id || 
                                          String(prevTime) !== String(newTime);

                        if (isNewCall) {
                            playVoiceAnnouncement(data.antreanAktif.nomor_urut, data.antreanAktif.user?.name, data.antreanAktif.loket || 'Meja 1');
                        }
                    }

                    prevAntreanRef.current = data.antreanAktif;
                    setAntreanAktif(data.antreanAktif);
                    setRiwayatPanggilan(data.riwayatPanggilan || []);
                }
            } catch (err) {
                console.error("Error polling monitor data:", err);
            }
        };

        const interval = setInterval(fetchData, 1000);
        return () => clearInterval(interval);
    }, []);

    // Enable Web Speech API activation secara global saat pertama kali ada interaksi di window
    useEffect(() => {
        const unlockAudio = () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.resume();
                // Trick: trigger dummy utterance silently on first click to permanently bypass browser autoplay policy
                if (!audioActivated) {
                    const dummyUtterance = new SpeechSynthesisUtterance('');
                    dummyUtterance.volume = 0;
                    window.speechSynthesis.speak(dummyUtterance);
                }
                setAudioActivated(true);
            }
        };

        window.addEventListener('click', unlockAudio);
        window.addEventListener('keydown', unlockAudio);

        return () => {
            window.removeEventListener('click', unlockAudio);
            window.removeEventListener('keydown', unlockAudio);
        };
    }, [audioActivated]);

    // Suara Panggilan Web Speech API (Suara Wanita Indonesia Jelas & Profesional)
    const playVoiceAnnouncement = (nomorUrut, namaSiswa, mejaname) => {
        if (!('speechSynthesis' in window)) return;

        window.speechSynthesis.cancel(); // Stop suara sebelumnya jika ada
        window.speechSynthesis.resume(); // Resume jika dalam keadaan paused

        const formattedNomor = nomorUrut ? nomorUrut.split('').join(' ') : '';
        const nama = namaSiswa ? `, atas nama ${namaSiswa}` : '';
        const textToSpeak = `Panggilan, nomor antrean ${formattedNomor}${nama}, silakan menuju ${mejaname}.`;

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'id-ID';
        utterance.rate = 0.95; // Kecepatan normal tegas & tidak terlalu lambat/lemah
        utterance.pitch = 1.1;  // Pitch natural wanita professional

        // Prioritaskan vokal Bahasa Indonesia yang jernih dan natural
        const voices = window.speechSynthesis.getVoices();
        const indoVoice = voices.find(v => 
            v.lang.replace('_', '-').toLowerCase().includes('id') && 
            (v.name.toLowerCase().includes('google') || 
             v.name.toLowerCase().includes('natural') || 
             v.name.toLowerCase().includes('gadis') || 
             v.name.toLowerCase().includes('wita') || 
             v.name.toLowerCase().includes('indonesia'))
        ) || voices.find(v => v.lang.replace('_', '-').toLowerCase().includes('id'));

        if (indoVoice) {
            utterance.voice = indoVoice;
        }

        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col justify-between select-none overflow-hidden relative">
            <Head title="Display Monitor Layar Antrean - SMAN 1 Slawi" />

            {/* BACKGROUND GRADIENT DEKORATIF ELEGAN */}
            <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-blue-600/15 rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-indigo-600/15 rounded-full blur-[160px] pointer-events-none" />

            {/* TOP BAR BRAND & JAM/TANGGAL TERPISAH */}
            <header className="px-8 py-5 flex items-center justify-between z-10 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl">
                <div className="flex items-center gap-6">
                    <LogoSmansawi className="w-16 h-16 drop-shadow-lg" />
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-none">
                            SMA N 1 SLAWI
                        </h1>
                        <span className="text-xs sm:text-sm font-extrabold text-blue-400 tracking-widest mt-1 block uppercase">
                            Sistem Penerimaan Murid Baru
                        </span>
                    </div>
                </div>

                {/* TANGGAL & WAKTU TERPISAH KOTAKNYA SAMA UKURAN DAN FONT */}
                <div className="flex items-center gap-3">
                    <div className="bg-slate-900/90 border border-blue-500/30 px-6 py-3.5 rounded-3xl shadow-2xl backdrop-blur-2xl flex items-center h-[72px]">
                        <span className="text-xl sm:text-2xl font-mono font-black text-blue-200 tracking-wide">
                            {currentDate}
                        </span>
                    </div>
                    <div className="bg-slate-900/90 border border-blue-500/30 px-7 py-3.5 rounded-3xl shadow-2xl backdrop-blur-2xl flex items-center h-[72px]">
                        <span className="text-2xl sm:text-3xl font-mono font-black text-amber-400 tracking-wider drop-shadow-md">
                            {currentTime}
                        </span>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT DISPLAY MONITOR */}
            <main className="flex-1 px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch z-10">

                {/* KIRI (8 COLS): DISPLAY UTAMA PANGGILAN */}
                <div className="lg:col-span-8 flex flex-col justify-center items-center">
                    {antreanAktif ? (
                        <div className="w-full h-full bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-blue-950/95 border-2 border-blue-500/40 rounded-3xl p-8 shadow-2xl flex flex-col justify-between items-center text-center relative overflow-hidden backdrop-blur-2xl">
                            <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

                            {/* KOTAK BADGE PANGGILAN ANTREAN DI ATAS NOMOR ANTREAN */}
                            <div className="w-full flex justify-center pt-2">
                                <span className="inline-flex items-center px-8 py-3 rounded-2xl bg-amber-400 text-amber-950 font-black text-base sm:text-lg uppercase tracking-wider shadow-2xl animate-pulse border border-amber-300">
                                    PANGGILAN ANTREAN
                                </span>
                            </div>

                            <div className="my-auto py-2 space-y-2">
                                <span className="block text-xl sm:text-2xl font-black text-blue-300 uppercase tracking-widest">
                                    NOMOR ANTREAN
                                </span>
                                <h1 className="text-9xl sm:text-[175px] font-black text-white tracking-tight font-mono drop-shadow-[0_20px_50px_rgba(59,130,246,0.3)] leading-none my-1">
                                    {antreanAktif.nomor_urut}
                                </h1>
                            </div>

                            <div className="w-full pt-8 border-t border-slate-700/80 bg-slate-950/80 rounded-3xl p-8 border border-white/10 shadow-2xl">
                                <span className="block text-base sm:text-xl font-black text-slate-300 uppercase tracking-widest mb-2">
                                    SILAKAN MENUJU KE:
                                </span>
                                <div className="text-5xl sm:text-7xl font-black text-amber-400 font-mono tracking-tight drop-shadow-lg">
                                    {antreanAktif.loket || 'MEJA 1'}
                                </div>
                                <h3 className="text-2xl sm:text-4xl font-black text-white mt-3 tracking-wide">
                                    {antreanAktif.user?.name}
                                </h3>
                            </div>
                        </div>
                    ) : (
                        /* TAMPILAN MENUNGGU PANGGILAN */
                        <div className="w-full h-full bg-slate-900/70 border-2 border-slate-800 rounded-3xl p-12 shadow-2xl flex flex-col justify-center items-center text-center backdrop-blur-xl">
                            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight">
                                Menunggu Panggilan...
                            </h1>
                            <p className="text-xl sm:text-2xl font-bold text-slate-400 max-w-xl mt-4 leading-relaxed">
                                Petugas verifikator sedang bersiap. Harap perhatikan layar monitor saat nomor Anda dipanggil.
                            </p>
                        </div>
                    )}
                </div>

                {/* KANAN (4 COLS): RIWAYAT PANGGILAN TERAKHIR */}
                <div className="lg:col-span-4 bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-7 shadow-2xl backdrop-blur-2xl flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4 mb-5">
                            <h3 className="text-base font-black text-blue-400 uppercase tracking-widest">
                                PANGGILAN TERAKHIR
                            </h3>
                            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                        </div>

                        {/* CUSTOM SCROLLBAR TANPA WARNA ABU/PUTIH */}
                        <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-2 pl-0.5 pt-1.5 pb-1.5 custom-scrollbar">
                            {riwayatPanggilan.length > 0 ? (
                                riwayatPanggilan.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                                            index === 0
                                                ? 'bg-blue-600/25 border-blue-500/60 text-white shadow-xl ring-1 ring-blue-400/40'
                                                : 'bg-slate-800/60 border-slate-700/60 text-slate-200'
                                        }`}
                                    >
                                        <div className="flex-1 min-w-0 pr-2">
                                            <span className="text-2xl sm:text-3xl font-black font-mono block leading-tight text-white drop-shadow-sm">
                                                {item.nomor_urut}
                                            </span>
                                            <span className="text-xs sm:text-sm font-extrabold text-slate-300 block truncate mt-0.5">
                                                {item.user?.name}
                                            </span>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <span className="px-3.5 py-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded-xl text-xs sm:text-sm font-black font-mono shadow-md inline-block">
                                                {item.loket || 'Meja 1'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-28 text-center text-slate-500 text-sm font-bold uppercase tracking-wider">
                                    Belum ada riwayat panggilan
                                </div>
                            )}
                        </div>
                    </div>

                    {/* HIMBAUAN BAWAH */}
                    <div className="mt-6 pt-5 border-t-2 border-slate-800 text-center">
                        <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-black tracking-wide shadow-sm">
                            Siapkan E-Tiket &amp; berkas fisik persyaratan sebelum menuju loket verifikasi
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
