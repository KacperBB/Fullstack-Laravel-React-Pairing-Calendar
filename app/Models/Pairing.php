<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pairing extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_a_id',
        'user_b_id',
    ];

    public function userA()
    {
        return $this->belongsTo(User::class, 'user_a_id');
    }

    public function userB()
    {
        return $this->belongsTo(User::class, 'user_b_id');
    }

    // helper: czy dwaj userzy są sparowani?
    public static function arePaired(int $userId1, int $userId2): bool
    {
        [$a, $b] = $userId1 < $userId2
            ? [$userId1, $userId2]
            : [$userId2, $userId1];

        return static::where('user_a_id', $a)
            ->where('user_b_id', $b)
            ->exists();
    }

    // lista partnerów dla usera
    public static function partnersFor(int $userId)
    {
        return static::where('user_a_id', $userId)
            ->orWhere('user_b_id', $userId)
            ->get();
    }
}
