<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shot extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'topspin_min',
        'topspin_max',
        'backspin_min',
        'backspin_max',
    ];

    public function sequences()
    {
        return $this->belongsToMany(Sequence::class, 'sequence_shot')
                    ->withPivot('order')
                    ->withTimestamps();
    }
}
