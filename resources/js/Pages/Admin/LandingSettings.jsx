import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function LandingSettings({ landingSettings }) {
    const { flash } = usePage().props;

    const defaultTabs = [
        { id: 'hero', label: '1. Banner Hero Utama', icon: '🚀', deletable: false },
        { id: 'linimasa', label: '2. Alur Linimasa (Timeline)', icon: '📅', deletable: false },
        { id: 'jalur', label: '3. Jalur Seleksi & Kuota', icon: '🎯', deletable: false },
        { id: 'berkas', label: '4. Syarat Berkas & Mapel', icon: '📄', deletable: false },
        { id: 'kontak', label: '5. Link & Narahubung', icon: '📞', deletable: false },
        { id: 'sosmed', label: '6. Alamat & Media Sosial', icon: '🌐', deletable: false },
    ];

    const { data, setData, post, processing } = useForm({
        site_title: landingSettings?.site_title || 'Portal Resmi SPMB',
        header_subtitle: landingSettings?.header_subtitle || 'PORTAL RESMI SPMB',
        hero_badge: landingSettings?.hero_badge || '',
        hero_title: landingSettings?.hero_title || '',
        hero_subtitle: landingSettings?.hero_subtitle || '',
        hero_desc: landingSettings?.hero_desc || '',
        hero_slogan: landingSettings?.hero_slogan || '',

        linimasa: landingSettings?.linimasa || [],
        jalurSeleksi: landingSettings?.jalurSeleksi || [],
        dokumenReq: landingSettings?.dokumenReq || [],
        mapelPenilaian: landingSettings?.mapelPenilaian || [],

        linktree_url: landingSettings?.linktree_url || '',
        wa_group_url: landingSettings?.wa_group_url || '',
        narahubung: landingSettings?.narahubung || [],

        alamat: landingSettings?.alamat || '',
        website_url: landingSettings?.website_url || '',
        instagram_url: landingSettings?.instagram_url || '',
        youtube_url: landingSettings?.youtube_url || '',
        footer_desc: (landingSettings?.footer_desc && landingSettings.footer_desc !== 'Portal Resmi Sistem Penerimaan Murid Baru (SPMB) SMA Negeri 1 Slawi.') ? landingSettings.footer_desc : 'Sistem Antrean & Informasi SPMB SMAN 1 Slawi ini merupakan hasil karya pengabdian masyarakat dari Kelompok KKN Sahabat Sekolah Jawa Tengah 001 Universitas Muhammadiyah Yogyakarta Periode Genap 2025/2026.',
        footer_copyright: (landingSettings?.footer_copyright && landingSettings.footer_copyright !== '© 2026 SMAN 1 Slawi. Seluruh Hak Cipta Dilindungi.') ? landingSettings.footer_copyright : '© 2026 SMAN 1 Slawi • Panitia SPMB dan KKN Sahabat Sekolah Jateng 001 UMY. All Rights Reserved.',

        tabs: landingSettings?.tabs || defaultTabs,
    });

    const [activeTab, setActiveTab] = useState('hero');

    const moveTabUp = (idx) => {
        if (idx <= 0) return;
        const updated = [...data.tabs];
        const temp = updated[idx];
        updated[idx] = updated[idx - 1];
        updated[idx - 1] = temp;
        setData('tabs', updated);
    };

    const moveTabDown = (idx) => {
        if (idx >= data.tabs.length - 1) return;
        const updated = [...data.tabs];
        const temp = updated[idx];
        updated[idx] = updated[idx + 1];
        updated[idx + 1] = temp;
        setData('tabs', updated);
    };

    // State Toast Notification
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // State Modal Konfirmasi Popup
    const [modalConfirm, setModalConfirm] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'Ya, Lanjutkan',
        confirmColor: 'bg-rose-600 hover:bg-rose-700',
        onConfirm: null,
    });

    const openConfirmModal = ({ title, message, confirmText = 'Ya, Hapus Sekarang', confirmColor = 'bg-rose-600 hover:bg-rose-700', onConfirm }) => {
        setModalConfirm({
            isOpen: true,
            title,
            message,
            confirmText,
            confirmColor,
            onConfirm,
        });
    };

    const closeConfirmModal = () => {
        setModalConfirm(prev => ({ ...prev, isOpen: false }));
    };

    // State Modal Edit / Tambah Tab
    const [modalTab, setModalTab] = useState({
        isOpen: false,
        isEdit: false,
        tabId: '',
        label: '',
        icon: '📌',
    });

    const openAddTabModal = () => {
        setModalTab({
            isOpen: true,
            isEdit: false,
            tabId: '',
            label: '',
            icon: '📌',
        });
    };

    const openEditTabModal = (tab) => {
        setModalTab({
            isOpen: true,
            isEdit: true,
            tabId: tab.id,
            label: tab.label,
            icon: tab.icon || '📌',
        });
    };

    const closeTabModal = () => {
        setModalTab({ isOpen: false, isEdit: false, tabId: '', label: '', icon: '📌' });
    };

    const handleSaveTab = (e) => {
        e.preventDefault();
        if (!modalTab.label.trim()) return;

        if (modalTab.isEdit) {
            const updated = data.tabs.map(t => t.id === modalTab.tabId ? { ...t, label: modalTab.label, icon: modalTab.icon } : t);
            setData('tabs', updated);
            showToast(`Judul Tab "${modalTab.label}" berhasil diperbarui!`);
        } else {
            const newId = `custom_${Date.now()}`;
            const newTab = { 
                id: newId, 
                label: modalTab.label, 
                icon: modalTab.icon, 
                deletable: true,
                subtitle: 'INFORMASI BAGIAN TAMBAHAN',
                title: modalTab.label,
                content: 'Silakan ketikkan detail informasi pengumuman atau petunjuk tambahan yang ingin ditampilkan untuk calon murid pendaftar di bagian ini.',
            };
            setData('tabs', [...data.tabs, newTab]);
            setActiveTab(newId);
            showToast(`Tab Baru "${modalTab.label}" berhasil ditambahkan! Silakan atur isinya.`);
        }
        closeTabModal();
    };

    const handleCustomTabChange = (tabId, field, value) => {
        const updated = data.tabs.map(t => {
            if (t.id === tabId) {
                return { ...t, [field]: value };
            }
            return t;
        });
        setData('tabs', updated);
    };

    const handleDeleteTab = (tab) => {
        openConfirmModal({
            title: `Hapus Tab "${tab.label}"?`,
            message: `Apakah Anda yakin ingin menghapus tab ini? Data dalam tab kustom ini akan dibersihkan.`,
            confirmText: 'Ya, Hapus Tab Ini',
            confirmColor: 'bg-rose-600 hover:bg-rose-700',
            onConfirm: () => {
                const updated = data.tabs.filter(t => t.id !== tab.id);
                setData('tabs', updated);
                setActiveTab(updated[0]?.id || 'hero');
                closeConfirmModal();
                showToast(`Tab "${tab.label}" berhasil dihapus.`);
            }
        });
    };

    // Helper Submit Form
    const handleSubmit = (e) => {
        e.preventDefault();
        openConfirmModal({
            title: 'Konfirmasi Simpan Perubahan',
            message: 'Apakah Anda yakin ingin menyimpan seluruh konfigurasi halaman utama ini ke database?',
            confirmText: 'Ya, Simpan Perubahan',
            confirmColor: 'bg-blue-600 hover:bg-blue-700',
            onConfirm: () => {
                closeConfirmModal();
                post(route('admin.landing.simpan'), {
                    onSuccess: () => showToast('✨ Seluruh Perubahan Halaman Utama Berhasil Disimpan!')
                });
            }
        });
    };

    // --- HELPER LINIMASA ---
    const handleLinimasaChange = (index, field, value) => {
        const updated = [...data.linimasa];
        updated[index][field] = value;
        setData('linimasa', updated);
    };

    const addLinimasaItem = () => {
        const nextTahap = String(data.linimasa.length + 1);
        setData('linimasa', [
            ...data.linimasa,
            { tahap: nextTahap, tanggal: '', agenda: '', desc: '' }
        ]);
        showToast('Tahap linimasa baru ditambahkan. Silakan isi tanggal & nama agenda.');
    };

    const removeLinimasaItem = (index) => {
        const item = data.linimasa[index];
        const namaAgenda = item.agenda || `Tahap ${item.tahap || index + 1}`;
        openConfirmModal({
            title: `Hapus Tahap Linimasa?`,
            message: `Apakah Anda yakin ingin menghapus "${namaAgenda}" dari urutan alur linimasa?`,
            confirmText: 'Ya, Hapus Tahap Ini',
            onConfirm: () => {
                const updated = data.linimasa.filter((_, i) => i !== index);
                const reindexed = updated.map((t, idx) => ({ ...t, tahap: String(idx + 1) }));
                setData('linimasa', reindexed);
                closeConfirmModal();
                showToast(`Tahap "${namaAgenda}" berhasil dihapus.`);
            }
        });
    };

    // --- HELPER JALUR SELEKSI ---
    const handleJalurChange = (index, field, value) => {
        const updated = [...data.jalurSeleksi];
        updated[index][field] = value;
        setData('jalurSeleksi', updated);
    };

    const addJalurItem = () => {
        const nextNum = data.jalurSeleksi.length + 1;
        setData('jalurSeleksi', [
            ...data.jalurSeleksi,
            { nama: `${nextNum}. Jalur Baru`, kuota: 'Paling sedikit 10%', desc: '', badgeBg: 'bg-blue-600' }
        ]);
        showToast('Jalur seleksi baru ditambahkan.');
    };

    const removeJalurItem = (index) => {
        const j = data.jalurSeleksi[index];
        openConfirmModal({
            title: `Hapus Jalur Seleksi?`,
            message: `Apakah Anda yakin ingin menghapus "${j.nama || 'Jalur'}" dari daftar jalur penerimaan?`,
            confirmText: 'Ya, Hapus Jalur',
            onConfirm: () => {
                setData('jalurSeleksi', data.jalurSeleksi.filter((_, i) => i !== index));
                closeConfirmModal();
                showToast(`Jalur seleksi berhasil dihapus.`);
            }
        });
    };

    // --- HELPER DOKUMEN ---
    const handleDokumenChange = (index, value) => {
        const updated = [...data.dokumenReq];
        updated[index] = value;
        setData('dokumenReq', updated);
    };

    const addDokumenItem = () => {
        setData('dokumenReq', [...data.dokumenReq, '']);
        showToast('Baris dokumen persyaratan baru ditambahkan.');
    };

    const removeDokumenItem = (index) => {
        const name = data.dokumenReq[index] || `Dokumen #${index + 1}`;
        openConfirmModal({
            title: `Hapus Syarat Dokumen?`,
            message: `Apakah Anda yakin ingin menghapus "${name}"?`,
            confirmText: 'Ya, Hapus Dokumen',
            onConfirm: () => {
                setData('dokumenReq', data.dokumenReq.filter((_, i) => i !== index));
                closeConfirmModal();
                showToast(`Dokumen berhasil dihapus.`);
            }
        });
    };

    // --- HELPER MAPEL ---
    const handleMapelChange = (index, value) => {
        const updated = [...data.mapelPenilaian];
        updated[index] = value;
        setData('mapelPenilaian', updated);
    };

    const addMapelItem = () => {
        setData('mapelPenilaian', [...data.mapelPenilaian, '']);
        showToast('Mata pelajaran penilaian baru ditambahkan.');
    };

    const removeMapelItem = (index) => {
        const name = data.mapelPenilaian[index] || `Mapel #${index + 1}`;
        openConfirmModal({
            title: `Hapus Mata Pelajaran?`,
            message: `Apakah Anda yakin ingin menghapus "${name}" dari 7 mapel penilaian?`,
            confirmText: 'Ya, Hapus Mapel',
            onConfirm: () => {
                setData('mapelPenilaian', data.mapelPenilaian.filter((_, i) => i !== index));
                closeConfirmModal();
                showToast(`Mata pelajaran berhasil dihapus.`);
            }
        });
    };

    // --- HELPER NARAHUBUNG ---
    const handleNarahubungChange = (index, field, value) => {
        const updated = [...data.narahubung];
        updated[index][field] = value;
        setData('narahubung', updated);
    };

    const addNarahubungItem = () => {
        setData('narahubung', [...data.narahubung, { nama: '', telp: '' }]);
        showToast('Kontak narahubung baru ditambahkan.');
    };

    const removeNarahubungItem = (index) => {
        const n = data.narahubung[index];
        openConfirmModal({
            title: `Hapus Narahubung?`,
            message: `Apakah Anda yakin ingin menghapus kontak "${n.nama || 'Guru'}"?`,
            confirmText: 'Ya, Hapus Kontak',
            onConfirm: () => {
                setData('narahubung', data.narahubung.filter((_, i) => i !== index));
                closeConfirmModal();
                showToast(`Kontak narahubung berhasil dihapus.`);
            }
        });
    };

    return (
        <AdminLayout>
            <Head title="Kelola Halaman Utama (Landing Page)" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-12">
                
                {/* TOAST NOTIFICATION POPUP */}
                {toastMessage && (
                    <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-extrabold flex items-center gap-3 animate-bounce">
                        <span>💬</span>
                        <span>{toastMessage}</span>
                    </div>
                )}

                {/* POPUP ALERT FLASH STATUS */}
                {flash?.status && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-black text-emerald-800 flex items-center justify-between shadow-xs">
                        <span>✅ {flash.status}</span>
                    </div>
                )}

                {/* HEADER HALAMAN */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-black shadow-md shadow-blue-600/30">
                            🎨
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                                Kelola Tampilan &amp; Konten Halaman Utama
                            </h1>
                            <p className="text-xs text-slate-500 font-bold mt-1">
                                Konfigurasi teks, linimasa, jalur seleksi, syarat berkas, dan narahubung di halaman depan publik.
                            </p>
                        </div>
                    </div>

                    <a
                        href={route('beranda')}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center gap-2 self-start md:self-auto transition"
                    >
                        <span>Pratinjau Halaman Depan</span>
                        <span>↗</span>
                    </a>
                </div>

                {/* NAVIGATION TABS WITH CRUD CONTROLS */}
                <div className="bg-white p-3 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-slate-100">
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                            Daftar Tab Konten (Bisa Di-edit / Ditambah)
                        </span>
                        <button
                            type="button"
                            onClick={openAddTabModal}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-xs transition flex items-center gap-1.5"
                        >
                            <span>+</span>
                            <span>Tambah Tab Baru</span>
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                        {data.tabs.map((tab, idx) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <div
                                    key={tab.id}
                                    className={`inline-flex items-center rounded-2xl p-1 transition ${
                                        isActive
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                                            : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className="px-3 py-1.5 text-xs font-black flex items-center gap-2"
                                    >
                                        <span>{tab.icon || '📌'}</span>
                                        <span>{tab.label}</span>
                                    </button>

                                    {/* CONTROLS REORDER, EDIT & HAPUS TAB */}
                                    <div className="flex items-center gap-1 pr-1 pl-1 border-l border-white/20">
                                        <button
                                            type="button"
                                            onClick={() => moveTabUp(idx)}
                                            disabled={idx === 0}
                                            title="Geser Tab Ke Kiri / Atas"
                                            className={`p-1 rounded-lg text-xs disabled:opacity-30 ${isActive ? 'text-white hover:bg-blue-700' : 'text-slate-500 hover:bg-slate-200'}`}
                                        >
                                            ⬅️
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => moveTabDown(idx)}
                                            disabled={idx === data.tabs.length - 1}
                                            title="Geser Tab Ke Kanan / Bawah"
                                            className={`p-1 rounded-lg text-xs disabled:opacity-30 ${isActive ? 'text-white hover:bg-blue-700' : 'text-slate-500 hover:bg-slate-200'}`}
                                        >
                                            ➡️
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => openEditTabModal(tab)}
                                            title="Edit Judul Tab & Ikon"
                                            className={`p-1 rounded-lg text-xs ${isActive ? 'text-blue-100 hover:bg-blue-700' : 'text-slate-500 hover:bg-slate-200'}`}
                                        >
                                            ✏️
                                        </button>
                                        {tab.deletable && (
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteTab(tab)}
                                                title="Hapus Tab Kustom Ini"
                                                className={`p-1 rounded-lg text-xs ${isActive ? 'text-rose-200 hover:bg-rose-700' : 'text-rose-600 hover:bg-rose-100'}`}
                                            >
                                                🗑️
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* FORM UTAMA */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* TAB HERO */}
                    {activeTab === 'hero' && (
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                            <div className="border-b border-slate-100 pb-4">
                                <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">
                                    🚀 Banner Hero &amp; Identitas Website Header
                                </h2>
                                <p className="text-xs text-slate-500 font-bold mt-0.5">
                                    Pengaturan judul tab browser, teks header logo, dan sambutan banner utama.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                                            🏷️ Judul Tab Browser Web (Site Title Tag)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.site_title}
                                            onChange={(e) => setData('site_title', e.target.value)}
                                            className="w-full rounded-xl border-slate-300 font-bold text-xs p-3 focus:border-blue-600 focus:ring-blue-600"
                                            placeholder="Portal Resmi SPMB"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                                            📌 Teks Subtitle Logo Header Navigation
                                        </label>
                                        <input
                                            type="text"
                                            value={data.header_subtitle}
                                            onChange={(e) => setData('header_subtitle', e.target.value)}
                                            className="w-full rounded-xl border-slate-300 font-bold text-xs p-3 focus:border-blue-600 focus:ring-blue-600"
                                            placeholder="PORTAL RESMI SPMB"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                                        Badge Teks Atas Hero
                                    </label>
                                    <input
                                        type="text"
                                        value={data.hero_badge}
                                        onChange={(e) => setData('hero_badge', e.target.value)}
                                        className="w-full rounded-xl border-slate-300 font-bold text-xs p-3 focus:border-blue-600 focus:ring-blue-600"
                                        placeholder="Contoh: ✨ Penerimaan Murid Baru SMAN 1 Slawi"
                                        required
                                    />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                                            Judul Utama (Baris 1)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.hero_title}
                                            onChange={(e) => setData('hero_title', e.target.value)}
                                            className="w-full rounded-xl border-slate-300 font-bold text-xs p-3 focus:border-blue-600 focus:ring-blue-600"
                                            placeholder="Sistem Penerimaan Murid Baru (SPMB)"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                                            Subjudul Nama Sekolah (Baris 2)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.hero_subtitle}
                                            onChange={(e) => setData('hero_subtitle', e.target.value)}
                                            className="w-full rounded-xl border-slate-300 font-bold text-xs p-3 focus:border-blue-600 focus:ring-blue-600"
                                            placeholder="SMA Negeri 1 Slawi"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                                        Deskripsi Singkat SPMB
                                    </label>
                                    <textarea
                                        rows="3"
                                        value={data.hero_desc}
                                        onChange={(e) => setData('hero_desc', e.target.value)}
                                        className="w-full rounded-xl border-slate-300 font-medium text-xs p-3 focus:border-blue-600 focus:ring-blue-600"
                                        placeholder="Tulis deskripsi singkat..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                                        Slogan Sekolah (Tagline)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.hero_slogan}
                                        onChange={(e) => setData('hero_slogan', e.target.value)}
                                        className="w-full rounded-xl border-slate-300 font-bold text-xs p-3 focus:border-blue-600 focus:ring-blue-600"
                                        placeholder="Berkarakter, Berprestasi, Unggul, Terdepan!"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB LINIMASA (TIMELINE) */}
                    {activeTab === 'linimasa' && (
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                                <div>
                                    <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">
                                        📅 Tahapan Linimasa Pelaksanaan SPMB
                                    </h2>
                                    <p className="text-xs text-slate-500 font-bold mt-0.5">
                                        Mengatur nomor urut, tanggal pelaksanaan, nama kegiatan, dan deskripsi penjelasan.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addLinimasaItem}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-sm self-start"
                                >
                                    + Tambah Tahap Linimasa Baru
                                </button>
                            </div>

                            <div className="space-y-4">
                                {data.linimasa.map((item, idx) => (
                                    <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 relative space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                                                    Tahap #{item.tahap || (idx + 1)}
                                                </span>
                                                <input
                                                    type="text"
                                                    value={item.tahap || String(idx + 1)}
                                                    onChange={(e) => handleLinimasaChange(idx, 'tahap', e.target.value)}
                                                    className="w-16 rounded-lg border-slate-300 font-black text-xs px-2 py-0.5 text-center"
                                                    title="Ubah Angka Tahap"
                                                />
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => removeLinimasaItem(idx)}
                                                className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-3 py-1 rounded-lg border border-rose-200 transition"
                                            >
                                                🗑️ Hapus Tahap
                                            </button>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                                                    📅 Tanggal Pelaksanaan
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.tanggal}
                                                    onChange={(e) => handleLinimasaChange(idx, 'tanggal', e.target.value)}
                                                    className="w-full rounded-xl border-slate-300 font-bold text-xs p-2.5 focus:border-blue-600 focus:ring-blue-600"
                                                    placeholder="Contoh: 3–12 Juni 2027"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                                                    🏷️ Nama Agenda / Kegiatan
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.agenda}
                                                    onChange={(e) => handleLinimasaChange(idx, 'agenda', e.target.value)}
                                                    className="w-full rounded-xl border-slate-300 font-bold text-xs p-2.5 focus:border-blue-600 focus:ring-blue-600"
                                                    placeholder="Contoh: Pengajuan Akun"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                                                📝 Keterangan / Penjelasan Detail
                                            </label>
                                            <textarea
                                                rows="2"
                                                value={item.desc}
                                                onChange={(e) => handleLinimasaChange(idx, 'desc', e.target.value)}
                                                className="w-full rounded-xl border-slate-300 font-medium text-xs p-2.5 focus:border-blue-600 focus:ring-blue-600"
                                                placeholder="Contoh: Pembuatan & pengajuan akun calon murid baru secara online."
                                                required
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB JALUR SELEKSI */}
                    {activeTab === 'jalur' && (
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                                <div>
                                    <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">
                                        🎯 Ketentuan Jalur Seleksi &amp; Kuota
                                    </h2>
                                    <p className="text-xs text-slate-500 font-bold mt-0.5">
                                        Rincian nama jalur penerimaan, persentase kuota, dan syaratnya.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addJalurItem}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-sm self-start"
                                >
                                    + Tambah Jalur Seleksi
                                </button>
                            </div>

                            <div className="space-y-4">
                                {data.jalurSeleksi.map((j, idx) => (
                                    <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black text-slate-800">
                                                Jalur #{idx + 1}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removeJalurItem(idx)}
                                                className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-3 py-1 rounded-lg border border-rose-200 transition"
                                            >
                                                🗑️ Hapus Jalur
                                            </button>
                                        </div>

                                        <div className="grid sm:grid-cols-3 gap-3">
                                            <div className="sm:col-span-2">
                                                <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                                                    Nama Jalur
                                                </label>
                                                <input
                                                    type="text"
                                                    value={j.nama}
                                                    onChange={(e) => handleJalurChange(idx, 'nama', e.target.value)}
                                                    className="w-full rounded-xl border-slate-300 font-bold text-xs p-2.5"
                                                    placeholder="1. Jalur Domisili"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                                                    Label Kuota (%)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={j.kuota}
                                                    onChange={(e) => handleJalurChange(idx, 'kuota', e.target.value)}
                                                    className="w-full rounded-xl border-slate-300 font-bold text-xs p-2.5"
                                                    placeholder="Paling sedikit 33%"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                                                Deskripsi Ketentuan Jalur
                                            </label>
                                            <textarea
                                                rows="2"
                                                value={j.desc}
                                                onChange={(e) => handleJalurChange(idx, 'desc', e.target.value)}
                                                className="w-full rounded-xl border-slate-300 font-medium text-xs p-2.5"
                                                placeholder="Berdasarkan jarak domisili tempat tinggal..."
                                                required
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB BERKAS & MAPEL */}
                    {activeTab === 'berkas' && (
                        <div className="grid md:grid-cols-2 gap-6">
                            
                            {/* DOKUMEN REQ */}
                            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <div>
                                        <h3 className="text-sm font-black text-slate-900 uppercase">📄 Persyaratan Dokumen</h3>
                                        <p className="text-[11px] text-slate-500 font-bold">Daftar dokumen fisik wajib</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addDokumenItem}
                                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl"
                                    >
                                        + Tambah
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {data.dokumenReq.map((doc, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <span className="text-xs font-black text-slate-400 w-5">{idx + 1}.</span>
                                            <input
                                                type="text"
                                                value={doc}
                                                onChange={(e) => handleDokumenChange(idx, e.target.value)}
                                                className="flex-1 rounded-xl border-slate-300 font-semibold text-xs p-2"
                                                placeholder="Nama dokumen..."
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeDokumenItem(idx)}
                                                className="text-xs text-rose-600 font-bold px-2 hover:bg-rose-50 rounded-lg py-1 border border-rose-200"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* MAPEL PENILAIAN */}
                            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <div>
                                        <h3 className="text-sm font-black text-slate-900 uppercase">📚 7 Mapel Penilaian</h3>
                                        <p className="text-[11px] text-slate-500 font-bold">Mata pelajaran nilai rapor</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addMapelItem}
                                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl"
                                    >
                                        + Tambah
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {data.mapelPenilaian.map((m, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <span className="text-xs font-black text-slate-400 w-5">{idx + 1}.</span>
                                            <input
                                                type="text"
                                                value={m}
                                                onChange={(e) => handleMapelChange(idx, e.target.value)}
                                                className="flex-1 rounded-xl border-slate-300 font-semibold text-xs p-2"
                                                placeholder="Nama mata pelajaran..."
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeMapelItem(idx)}
                                                className="text-xs text-rose-600 font-bold px-2 hover:bg-rose-50 rounded-lg py-1 border border-rose-200"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    )}

                    {/* TAB KONTAK & NARAHUBUNG */}
                    {activeTab === 'kontak' && (
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                            
                            <div className="border-b border-slate-100 pb-4">
                                <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">
                                    📞 Link Tautan Resmi &amp; Narahubung Panitia
                                </h2>
                                <p className="text-xs text-slate-500 font-bold mt-0.5">
                                    Tautan pendaftaran online external &amp; kontak panitia yang dapat dihubungi.
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                                        Linktree / Tautan Pengumuman Resmi
                                    </label>
                                    <input
                                        type="url"
                                        value={data.linktree_url}
                                        onChange={(e) => setData('linktree_url', e.target.value)}
                                        className="w-full rounded-xl border-slate-300 font-bold text-xs p-3 focus:border-blue-600 focus:ring-blue-600"
                                        placeholder="https://linktr.ee/SPMB25_SMANSAWI"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                                        Link Group WhatsApp Alternatif
                                    </label>
                                    <input
                                        type="url"
                                        value={data.wa_group_url}
                                        onChange={(e) => setData('wa_group_url', e.target.value)}
                                        className="w-full rounded-xl border-slate-300 font-bold text-xs p-3 focus:border-blue-600 focus:ring-blue-600"
                                        placeholder="https://chat.whatsapp.com/..."
                                    />
                                </div>
                            </div>

                            {/* NARAHUBUNG */}
                            <div className="pt-4 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-black text-slate-900 uppercase">
                                        👨‍🏫 Daftar Narahubung Panitia SPMB
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={addNarahubungItem}
                                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl"
                                    >
                                        + Tambah Narahubung
                                    </button>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-3">
                                    {data.narahubung.map((n, idx) => (
                                        <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2 relative">
                                            <button
                                                type="button"
                                                onClick={() => removeNarahubungItem(idx)}
                                                className="absolute top-3 right-3 text-xs text-rose-600 font-bold hover:bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200"
                                            >
                                                🗑️ Hapus
                                            </button>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-600 uppercase">Nama Guru / Panitia</label>
                                                <input
                                                    type="text"
                                                    value={n.nama}
                                                    onChange={(e) => handleNarahubungChange(idx, 'nama', e.target.value)}
                                                    className="w-full rounded-xl border-slate-300 font-bold text-xs p-2"
                                                    placeholder="Nama Guru, S.Pd"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-600 uppercase">Nomor HP / WhatsApp</label>
                                                <input
                                                    type="text"
                                                    value={n.telp}
                                                    onChange={(e) => handleNarahubungChange(idx, 'telp', e.target.value)}
                                                    className="w-full rounded-xl border-slate-300 font-bold text-xs p-2"
                                                    placeholder="0812-xxxx-xxxx"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    )}

                    {/* TAB SOSMED & ALAMAT */}
                    {activeTab === 'sosmed' && (
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                            
                            <div className="border-b border-slate-100 pb-4">
                                <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">
                                    🌐 Alamat Sekolah &amp; Media Sosial Resmi
                                </h2>
                                <p className="text-xs text-slate-500 font-bold mt-0.5">
                                    Informasi lokasi fisik instansi dan akun media sosial resmi SMAN 1 Slawi.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                                        Alamat Lengkap Sekolah
                                    </label>
                                    <textarea
                                        rows="2"
                                        value={data.alamat}
                                        onChange={(e) => setData('alamat', e.target.value)}
                                        className="w-full rounded-xl border-slate-300 font-semibold text-xs p-3 focus:border-blue-600 focus:ring-blue-600"
                                        placeholder="Jl. Kh Wahid Hasyim No.1..."
                                        required
                                    />
                                </div>

                                <div className="grid sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                                            Website Resmi (URL)
                                        </label>
                                        <input
                                            type="url"
                                            value={data.website_url}
                                            onChange={(e) => setData('website_url', e.target.value)}
                                            className="w-full rounded-xl border-slate-300 font-bold text-xs p-3 focus:border-blue-600 focus:ring-blue-600"
                                            placeholder="https://sman1slawi.sch.id"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                                            Instagram Resmi (URL)
                                        </label>
                                        <input
                                            type="url"
                                            value={data.instagram_url}
                                            onChange={(e) => setData('instagram_url', e.target.value)}
                                            className="w-full rounded-xl border-slate-300 font-bold text-xs p-3 focus:border-blue-600 focus:ring-blue-600"
                                            placeholder="https://instagram.com/smansawi_official"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                                            YouTube Resmi (URL)
                                        </label>
                                        <input
                                            type="url"
                                            value={data.youtube_url}
                                            onChange={(e) => setData('youtube_url', e.target.value)}
                                            className="w-full rounded-xl border-slate-300 font-bold text-xs p-3 focus:border-blue-600 focus:ring-blue-600"
                                            placeholder="https://www.youtube.com/@sman1slawi"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 space-y-4">
                                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                                        🔻 Teks Footer Halaman Depan
                                    </h3>

                                    <div>
                                        <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                                            Deskripsi Singkat Footer
                                        </label>
                                        <textarea
                                            rows="2"
                                            value={data.footer_desc}
                                            onChange={(e) => setData('footer_desc', e.target.value)}
                                            className="w-full rounded-xl border-slate-300 font-medium text-xs p-3 focus:border-blue-600 focus:ring-blue-600"
                                            placeholder="Portal Resmi Sistem Penerimaan Murid Baru (SPMB) SMA Negeri 1 Slawi."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                                            Teks Hak Cipta / Copyright Footer
                                        </label>
                                        <input
                                            type="text"
                                            value={data.footer_copyright}
                                            onChange={(e) => setData('footer_copyright', e.target.value)}
                                            className="w-full rounded-xl border-slate-300 font-bold text-xs p-3 focus:border-blue-600 focus:ring-blue-600"
                                            placeholder="© 2026 SMAN 1 Slawi. Seluruh Hak Cipta Dilindungi."
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* TAB KUSTOM BEBAS */}
                    {!['hero', 'linimasa', 'jalur', 'berkas', 'kontak', 'sosmed'].includes(activeTab) && (() => {
                        const currentCustomTab = data.tabs.find(t => t.id === activeTab);
                        if (!currentCustomTab) return null;
                        return (
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                                <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">
                                            📌 Edit Isi Tab Kustom: {currentCustomTab.label}
                                        </h2>
                                        <p className="text-xs text-slate-500 font-bold mt-0.5">
                                            Atur judul bagian, subjudul, dan pesan/informasi detail yang tampil di halaman utama.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteTab(currentCustomTab)}
                                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl transition shadow-xs"
                                    >
                                        🗑️ Hapus Tab Ini
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                                            Subjudul / Badge (Teks Kecil Atas)
                                        </label>
                                        <input
                                            type="text"
                                            value={currentCustomTab.subtitle || ''}
                                            onChange={(e) => handleCustomTabChange(currentCustomTab.id, 'subtitle', e.target.value)}
                                            className="w-full rounded-xl border-slate-300 font-bold text-xs p-3 focus:border-blue-600 focus:ring-blue-600"
                                            placeholder="Contoh: INFORMASI KHUSUS PENDAFTARAN"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                                            Judul Utama Bagian Ini (Heading)
                                        </label>
                                        <input
                                            type="text"
                                            value={currentCustomTab.title || currentCustomTab.label}
                                            onChange={(e) => handleCustomTabChange(currentCustomTab.id, 'title', e.target.value)}
                                            className="w-full rounded-xl border-slate-300 font-bold text-xs p-3 focus:border-blue-600 focus:ring-blue-600"
                                            placeholder="Contoh: Pengumuman Jadwal Uji Coba & Tata Tertib"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black text-slate-800 uppercase mb-1">
                                            Isi Konten / Deskripsi Informasi Lengkap
                                        </label>
                                        <textarea
                                            rows="6"
                                            value={currentCustomTab.content || ''}
                                            onChange={(e) => handleCustomTabChange(currentCustomTab.id, 'content', e.target.value)}
                                            className="w-full rounded-xl border-slate-300 font-medium text-xs p-3 focus:border-blue-600 focus:ring-blue-600 leading-relaxed"
                                            placeholder="Tuliskan isi informasi detail yang ingin Anda tampilkan kepada calon pendaftar..."
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {/* SUBMIT BUTTON */}
                    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between sticky bottom-4 z-30">
                        <span className="text-xs font-extrabold text-slate-500">
                            Pastikan seluruh data sudah diperiksa sebelum disimpan.
                        </span>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-black rounded-2xl text-xs shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5 disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : '💾 Simpan Perubahan Halaman Utama'}
                        </button>
                    </div>

                </form>

            </div>

            {/* MODAL POP-UP KONFIRMASI INTERAKTIF */}
            {modalConfirm.isOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200">
                        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl font-black mx-auto">
                            ⚠️
                        </div>
                        <div>
                            <h3 className="text-base font-black text-slate-900">{modalConfirm.title}</h3>
                            <p className="text-xs font-bold text-slate-500 mt-1 leading-relaxed">
                                {modalConfirm.message}
                            </p>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button
                                type="button"
                                onClick={closeConfirmModal}
                                className="w-full py-2.5 bg-slate-100 text-slate-700 font-black rounded-xl text-xs hover:bg-slate-200 transition"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (modalConfirm.onConfirm) modalConfirm.onConfirm();
                                }}
                                className={`w-full py-2.5 text-white font-black rounded-xl text-xs shadow-md transition ${modalConfirm.confirmColor}`}
                            >
                                {modalConfirm.confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL POP-UP EDIT / TAMBAH TAB */}
            {modalTab.isOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <form onSubmit={handleSaveTab} className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
                        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-900">
                                {modalTab.isEdit ? '✏️ Edit Judul Tab' : '✨ Tambah Tab Baru'}
                            </h3>
                            <button type="button" onClick={closeTabModal} className="text-xs text-slate-400 font-bold">✕</button>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">
                                    Emoji / Ikon Tab
                                </label>
                                <input
                                    type="text"
                                    value={modalTab.icon}
                                    onChange={(e) => setModalTab({ ...modalTab, icon: e.target.value })}
                                    className="w-full rounded-xl border-slate-300 font-bold text-sm p-2 text-center"
                                    placeholder="Contoh: 📌"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">
                                    Judul Tab / Bagian
                                </label>
                                <input
                                    type="text"
                                    value={modalTab.label}
                                    onChange={(e) => setModalTab({ ...modalTab, label: e.target.value })}
                                    className="w-full rounded-xl border-slate-300 font-bold text-xs p-2.5"
                                    placeholder="Contoh: 7. Pengumuman Darurat"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                type="button"
                                onClick={closeTabModal}
                                className="w-full py-2 bg-slate-100 text-slate-700 font-black rounded-xl text-xs"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs shadow-md"
                            >
                                Simpan Tab
                            </button>
                        </div>
                    </form>
                </div>
            )}

        </AdminLayout>
    );
}
