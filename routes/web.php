<?php

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

// RUTE KHUSUS ROLE SISWA
Route::middleware(['auth', 'role:siswa'])->group(function () {
    Route::get('/etiket', [AntreanController::class, 'dashboard'])->name('etiket');
    Route::get('/cek-berkas', [AntreanController::class, 'cekBerkas'])->name('cek-berkas');
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
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');
});

// RUTE PROFILE UMUM
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
