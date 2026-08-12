<?php

use App\Http\Controllers\AntreanController; 
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [AntreanController::class, 'index'])->name('beranda');

Route::middleware('auth')->group(function () {
    Route::get('/etiket', [AntreanController::class, 'dashboard'])->name('etiket');
    Route::get('/cek-berkas', [AntreanController::class, 'cekBerkas'])->name('cek-berkas');
    Route::post('/etiket/ambil-antrean', [AntreanController::class, 'ambilAntrean'])->name('antrean.ambil');
    Route::post('/etiket/batal-antrean', [AntreanController::class, 'batalAntrean'])->name('antrean.batal');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
