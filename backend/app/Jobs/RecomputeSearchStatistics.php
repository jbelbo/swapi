<?php

namespace App\Jobs;

use App\Models\SearchStatistic;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class RecomputeSearchStatistics implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Recompute averages for each query/type/hour combination
        DB::transaction(function () {
            $stats = SearchStatistic::all()->groupBy(function ($stat) {
                return $stat->query . '|' . $stat->type . '|' . $stat->hour_of_day;
            });

            foreach ($stats as $group) {
                $first = $group->first();
                $totalCount = $group->sum('count');
                $weightedTime = $group->reduce(function ($carry, $stat) {
                    return $carry + ($stat->average_time * $stat->count);
                }, 0);

                SearchStatistic::where([
                    'query' => $first->query,
                    'type' => $first->type,
                    'hour_of_day' => $first->hour_of_day
                ])->update([
                    'count' => $totalCount,
                    'average_time' => $weightedTime / $totalCount
                ]);
            }
        });

        // Clear the statistics cache to force recomputation
        Cache::forget(SearchStatistic::CACHE_KEY);
    }
}
