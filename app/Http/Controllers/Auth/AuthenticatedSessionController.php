<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\ValidationException;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view for Siswa (Default /login)
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'roleTarget' => 'siswa',
        ]);
    }

    /**
     * Display the login view for Admin (URL /admin/login)
     */
    public function createAdmin(): Response
    {
        return Inertia::render('Auth/LoginAdmin', [
            'status' => session('status'),
            'roleTarget' => 'admin',
        ]);
    }

    /**
     * Display the login view for Guru (URL /guru/login)
     */
    public function createGuru(): Response
    {
        return Inertia::render('Auth/LoginGuru', [
            'status' => session('status'),
            'roleTarget' => 'guru',
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $user = Auth::user();
        $targetRole = $request->input('target_role', 'siswa');

        // Validasi Role Matched
        if ($targetRole === 'admin' && $user->role !== 'admin') {
            Auth::logout();
            throw ValidationException::withMessages([
                'nisn' => 'Akun Anda bukan merupakan akun Admin SPMB.',
            ]);
        }

        if ($targetRole === 'guru' && $user->role !== 'guru') {
            Auth::logout();
            throw ValidationException::withMessages([
                'nisn' => 'Akun Anda bukan merupakan akun Guru / Verifikator.',
            ]);
        }

        if ($targetRole === 'siswa' && $user->role !== 'siswa') {
            // Jika admin/guru coba login via portal siswa, alihkan ke tempatnya
            if ($user->role === 'admin') {
                return redirect()->route('admin.login')->with('status', 'Silakan login melalui portal khusus Admin.');
            }
            if ($user->role === 'guru') {
                return redirect()->route('guru.login')->with('status', 'Silakan login melalui portal khusus Guru.');
            }
        }

        $request->session()->regenerate();

        if ($user->role === 'admin') {
            return redirect()->intended(route('admin.dashboard', absolute: false));
        } elseif ($user->role === 'guru') {
            return redirect()->intended(route('guru.dashboard', absolute: false));
        }

        return redirect()->intended(route('etiket', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
