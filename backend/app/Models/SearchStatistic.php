<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SearchStatistic extends Model
{
    use HasFactory;

    public const CACHE_KEY = 'search_statistics';

    protected $fillable = [
        'query',
        'type',
        'count',
        'average_time',
        'hour_of_day'
    ];

    protected $casts = [
        'count' => 'integer',
        'average_time' => 'float',
        'hour_of_day' => 'integer'
    ];
}
