<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class PairingCode extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'code',
        'expires_at',
        'used_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used_at'    => 'datetime',
    ];

    public static function generateForUser(int $userId, int $ttlMinutes = 60): self
    {
        // generujemy prosty losowy kod, np. 8 znaków
        $code = strtoupper(Str::random(8));

        return static::create([
            'user_id'    => $userId,
            'code'       => $code,
            'expires_at' => now()->addMinutes($ttlMinutes),
        ]);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isValid(): bool
    {
        if ($this->used_at !== null) {
            return false;
        }

        if ($this->expires_at !== null && $this->expires_at->isPast()) {
            return false;
        }

        return true;
    }
}
