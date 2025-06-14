<?php

use App\Http\Controllers\Api\StatisticsController;
use App\Http\Controllers\Api\SwapiController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // SWAPI endpoints
    Route::post('search', [SwapiController::class, 'search']);
    Route::get('{type}/{id}', [SwapiController::class, 'show'])
        ->where('type', 'people|films');

    // Statistics endpoint
    Route::get('statistics', [StatisticsController::class, 'index']);
}); 