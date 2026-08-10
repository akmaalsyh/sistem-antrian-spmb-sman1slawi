<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JadwalKuota extends Model
{
    use HasFactory;

    protected $table = 'jadwal_kuota';
    protected $guarded = ['id']; 

    public function antrean()
    {
        return $this->hasMany(Antrean::class, 'jadwal_id');
    }
}