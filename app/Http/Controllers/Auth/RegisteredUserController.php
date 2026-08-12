<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // 1. Validasi Input Form dengan Pesan Bahasa Indonesia Jelas
        $request->validate([
            'name' => [
                'required', 
                'string', 
                'min:3',
                'max:100',
                'regex:/^[a-zA-Z\s\.\,\'\-]+$/',
            ],
            'nisn' => [
                'required', 
                'string', 
                'size:10',               // Harus persis 10 digit angka
                'regex:/^[0-9]{10}$/',   // Hanya angka 0-9
                'unique:'.User::class,
            ],
            'password' => [
                'required', 
                'string',
                'min:8',                // Password minimal 8 karakter
                'confirmed'
            ],
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'name.min' => 'Nama lengkap minimal terdiri dari 3 karakter.',
            'name.max' => 'Nama lengkap maksimal 100 karakter.',
            'name.regex' => 'Nama lengkap hanya boleh berisi huruf, spasi, titik, koma, petik atau tanda hubung.',
            
            'nisn.required' => 'NISN wajib diisi.',
            'nisn.size' => 'NISN harus berjumlah tepat 10 digit angka (tidak boleh kurang atau lebih).',
            'nisn.regex' => 'NISN hanya boleh berisi 10 digit angka tanpa huruf atau simbol.',
            'nisn.unique' => 'NISN ini sudah terdaftar dalam sistem SPMB SMAN 1 Slawi. Silakan langsung masuk ke akun Anda.',
            
            'password.required' => 'Password wajib diisi.',
            'password.min' => 'Password minimal terdiri dari 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok dengan password di atas.',
        ]);

        // 2. Simpan Akun Siswa Baru ke Database
        $user = User::create([
            'name' => trim(ucwords(strtolower($request->name))),
            'nisn' => trim($request->nisn),
            'role' => 'siswa',
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        // Kembalikan status registered_user ke frontend untuk memicu Pop-up Modal Sukses
        return redirect()->back()->with('registered_user', [
            'name' => $user->name,
            'nisn' => $user->nisn,
        ]);
    }
}
