<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        if (! $user || $user->role !== $role) {
            if (! $user) {
                if ($role === 'admin') {
                    return redirect()->route('admin.login');
                } elseif ($role === 'guru') {
                    return redirect()->route('guru.login');
                }
                return redirect()->route('login');
            }

            // Jika user punya role berbeda, alihkan ke tempat yang sesuai
            if ($user->role === 'admin') {
                return redirect()->route('admin.dashboard');
            } elseif ($user->role === 'guru') {
                return redirect()->route('guru.dashboard');
            } else {
                return redirect()->route('siswa.etiket');
            }
        }

        return $next($request);
    }
}
