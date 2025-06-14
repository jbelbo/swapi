<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SearchStatistic;
use App\Services\SwapiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SwapiController extends Controller
{
    private SwapiService $swapiService;

    public function __construct(SwapiService $swapiService)
    {
        $this->swapiService = $swapiService;
    }

    public function search(Request $request): JsonResponse
    {
        Log::info('Incoming search request', [
            'headers' => $request->headers->all(),
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'origin' => $request->header('Origin'),
        ]);

        $request->validate([
            'type' => 'required|in:people,films',
            'query' => 'required|string|min:2'
        ]);

        $type = $request->input('type');
        $query = $request->input('query');
        $startTime = microtime(true);

        // Log the incoming request
        Log::info('Search request received', [
            'type' => $type,
            'query' => $query
        ]);

        $response = $this->swapiService->search($type, $query);

        $endTime = microtime(true);
        $duration = $endTime - $startTime;

        // Record statistics
        $this->recordStatistics($query, $type, $duration);

        return response()->json($response)
            ->header('Access-Control-Allow-Origin', 'http://localhost:3000')
            ->header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Requested-With, Origin')
            ->header('Access-Control-Allow-Credentials', 'true');
    }

    public function show(string $type, string $id): JsonResponse
    {
        if ($type === 'people') {
            $response = $this->swapiService->getPerson($id);
        } else {
            $response = $this->swapiService->getMovie($id);
        }
        
        return response()->json($response)
            ->header('Access-Control-Allow-Origin', 'http://localhost:3000')
            ->header('Access-Control-Allow-Methods', 'GET, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Requested-With, Origin')
            ->header('Access-Control-Allow-Credentials', 'true');
    }

    private function recordStatistics(string $query, string $type, float $duration): void
    {
        $hourOfDay = (int) now()->format('G');

        $stat = SearchStatistic::firstOrNew([
            'query' => $query,
            'type' => $type,
            'hour_of_day' => $hourOfDay
        ]);

        if ($stat->exists) {
            $totalTime = $stat->average_time * $stat->count;
            $stat->count++;
            $stat->average_time = ($totalTime + $duration) / $stat->count;
        } else {
            $stat->count = 1;
            $stat->average_time = $duration;
        }

        $stat->save();
    }
}
