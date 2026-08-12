<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserRoleSeeder extends Seeder
{
    public function run(): void
    {
        // Admin SPMB
        User::updateOrCreate(
            ['nisn' => 'ADMIN001'],
            [
                'name' => 'Administrator SPMB',
                'role' => 'admin',
                'password' => Hash::make('admin123'),
            ]
        );

        // Guru / Verifikator
        User::updateOrCreate(
            ['nisn' => 'GURU001'],
            [
                'name' => 'Tim Verifikator SPMB (Guru)',
                'role' => 'guru',
                'password' => Hash::make('guru123'),
            ]
        );
    }
}
