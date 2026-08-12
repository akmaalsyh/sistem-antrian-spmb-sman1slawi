<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $targetRole = $this->input('target_role', 'siswa');

        // Jika login siswa, kunci NISN 10 digit angka. Jika admin/guru boleh alfanumerik.
        if ($targetRole === 'siswa') {
            return [
                'nisn' => ['required', 'string', 'size:10', 'regex:/^[0-9]{10}$/'],
                'password' => ['required', 'string'],
                'target_role' => ['nullable', 'string', 'in:siswa,admin,guru'],
            ];
        }

        return [
            'nisn' => ['required', 'string', 'max:50', 'regex:/^[a-zA-Z0-9]+$/'],
            'password' => ['required', 'string'],
            'target_role' => ['nullable', 'string', 'in:siswa,admin,guru'],
        ];
    }

    public function messages(): array
    {
        return [
            'nisn.required' => 'NISN / ID Pengguna wajib diisi.',
            'nisn.size' => 'NISN harus berjumlah tepat 10 digit angka.',
            'nisn.regex' => 'Format NISN / ID Pengguna tidak valid.',
            'password.required' => 'Password wajib diisi.',
        ];
    }

    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        if (! Auth::attempt($this->only('nisn', 'password'), $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'nisn' => 'NISN / ID Pengguna atau Password yang Anda masukkan salah.',
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'nisn' => 'Terlalu banyak percobaan masuk yang gagal. Silakan coba lagi dalam '.$seconds.' detik.',
        ]);
    }

    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->input('nisn')).'|'.$this->ip());
    }
}