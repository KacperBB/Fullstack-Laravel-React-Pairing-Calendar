<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date',
        'start_time',
        'end_time',
        'title',
        'color',
        'icon',
        'note',
    ];

    public function comments()
{
    return $this->hasMany(Comment::class);
}

}
