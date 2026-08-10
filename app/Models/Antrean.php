<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Antrean extends Model
{
    use HasFactory;

    protected $table = 'antrean';
    protected $guarded = ['id'];

    // Relasi: 1 Antrean dimiliki oleh 1 Jadwal
    public function jadwal()
    {
        return $this->belongsTo(JadwalKuota::class, 'jadwal_id');
    }

    // Relasi: 1 Antrean dimiliki oleh 1 User (Siswa)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}