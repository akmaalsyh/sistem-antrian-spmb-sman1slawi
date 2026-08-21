<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AntreanController; 
use App\Http\Controllers\GuruController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Landing Page Publik
Route::get('/', [AntreanController::class, 'index'])->name('beranda');

// Display Screen Monitor Publik (Dapat dibuka tanpa/dengan login)
Route::get('/display', [GuruController::class, 'monitor'])->name('monitor');
Route::get('/api/monitor-data', [GuruController::class, 'monitorData'])->name('api.monitor-data');

// RUTE KHUSUS ROLE SISWA (Prefix /siswa)
Route::middleware(['auth', 'role:siswa'])->prefix('siswa')->group(function () {
    Route::get('/dashboard', [AntreanController::class, 'dashboard'])->name('siswa.dashboard');
    Route::get('/etiket', [AntreanController::class, 'dashboard'])->name('siswa.etiket');
    Route::get('/cek-berkas', [AntreanController::class, 'cekBerkas'])->name('siswa.cek-berkas');
    Route::post('/etiket/ambil-antrean', [AntreanController::class, 'ambilAntrean'])->name('antrean.ambil');
    Route::post('/etiket/batal-antrean', [AntreanController::class, 'batalAntrean'])->name('antrean.batal');
});

// RUTE KHUSUS ROLE GURU / VERIFIKATOR LOKET
Route::middleware(['auth', 'role:guru'])->prefix('guru')->group(function () {
    Route::get('/dashboard', [GuruController::class, 'dashboard'])->name('guru.dashboard');
    Route::post('/pilihan-loket', [GuruController::class, 'pilihLoket'])->name('guru.pilih-loket');
    Route::post('/panggil', [GuruController::class, 'panggil'])->name('guru.panggil');
    Route::post('/panggil-ulang', [GuruController::class, 'panggilUlang'])->name('guru.panggil-ulang');
    Route::post('/selesai', [GuruController::class, 'selesai'])->name('guru.selesai');
});

// RUTE KHUSUS ROLE ADMIN
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/jadwal', [AdminController::class, 'kelolaJadwal'])->name('admin.jadwal');
    Route::post('/jadwal', [AdminController::class, 'simpanJadwal'])->name('admin.jadwal.simpan');
    Route::put('/jadwal/{id}', [AdminController::class, 'updateJadwal'])->name('admin.jadwal.update');
    Route::delete('/jadwal/{id}', [AdminController::class, 'hapusJadwal'])->name('admin.jadwal.hapus');

    Route::get('/users', [AdminController::class, 'kelolaUser'])->name('admin.users');
    Route::post('/users/guru', [AdminController::class, 'simpanGuru'])->name('admin.users.guru.simpan');
    Route::post('/users/siswa', [AdminController::class, 'simpanSiswa'])->name('admin.users.siswa.simpan');
    Route::put('/users/{id}/reset-password', [AdminController::class, 'resetPassword'])->name('admin.users.reset-password');
    Route::delete('/users/{id}', [AdminController::class, 'hapusUser'])->name('admin.users.hapus');

    Route::get('/laporan', [AdminController::class, 'laporan'])->name('admin.laporan');
    
    Route::get('/pengaturan', [AdminController::class, 'kelolaPengaturan'])->name('admin.pengaturan');
    Route::post('/pengaturan', [AdminController::class, 'simpanPengaturan'])->name('admin.pengaturan.simpan');

    Route::get('/landing-page', [AdminController::class, 'kelolaLanding'])->name('admin.landing');
    Route::post('/landing-page', [AdminController::class, 'simpanLanding'])->name('admin.landing.simpan');
});

// RUTE PROFILE UMUM
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
