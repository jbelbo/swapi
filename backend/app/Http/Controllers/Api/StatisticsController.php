<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SearchStatistic;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class StatisticsController extends Controller
{
    public function index(): JsonResponse
    {
        // Get statistics from cache or compute them
        $statistics = Cache::remember('search_statistics', 300, function () {
            $totalSearches = SearchStatistic::sum('count');
            
            $topQueries = SearchStatistic::select(
                'query',
                'type',
                DB::raw('SUM(count) as total_count'),
                DB::raw('AVG(average_time) as avg_response_time'),
                DB::raw('(SUM(count) * 100.0 / ' . ($totalSearches ?: 1) . ') as percentage')
            )
            ->groupBy('query', 'type')
            ->orderByDesc('total_count')
            ->limit(5)
            ->get();

            $popularHours = SearchStatistic::select(
                'hour_of_day',
                DB::raw('SUM(count) as total_searches')
            )
            ->groupBy('hour_of_day')
            ->orderByDesc('total_searches')
            ->get();

            $averageResponseTime = SearchStatistic::avg('average_time');

            return [
                'top_queries' => $topQueries,
                'popular_hours' => $popularHours,
                'total_searches' => $totalSearches,
                'average_response_time' => $averageResponseTime,
                'last_computed_at' => now()->toIso8601String()
            ];
        });

        return response()->json($statistics);
    }
}
