<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SwapiService
{
    private const SWAPI_BASE_URL = 'https://swapi.tech/api';

    public function search(string $type, string $query): array
    {
        $queryParam = $type === 'films' ? 'title' : 'name';
        $url = self::SWAPI_BASE_URL . '/' . $type;
        $params = [$queryParam => $query];

        Log::info('Calling SWAPI', [
            'url' => $url,
            'params' => $params
        ]);

        $response = Http::get($url, $params);

        Log::info('SWAPI response received', [
            'status' => $response->status(),
            'body' => $response->json()
        ]);

        $data = $response->json();
        
        // Transform the response to match our frontend's expected format
        $results = [];
        if (isset($data['result']) && is_array($data['result'])) {
            foreach ($data['result'] as $item) {
                $results[] = [
                    'name' => $type === 'films' ? $item['properties']['title'] : $item['properties']['name'],
                    'uid' => $item['uid']
                ];
            }
        }

        return ['result' => $results];
    }

    public function getPerson(string $id): array
    {
        $data = $this->getResource('people', $id);
        
        // Get all films
        $filmsResponse = Http::get(self::SWAPI_BASE_URL . '/films');
        $filmsData = $filmsResponse->json();
        
        if (isset($filmsData['result']) && is_array($filmsData['result'])) {
            $films = [];
            foreach ($filmsData['result'] as $film) {
                $films[] = [
                    'uid' => $film['uid'],
                    'title' => $film['properties']['title']
                ];
            }
            
            // Add films to the person data
            if (isset($data['result']['properties'])) {
                $data['result']['properties']['films'] = $films;
            }
        }
        
        return $data;
    }

    public function getMovie(string $id): array
    {
        $data = $this->getResource('films', $id);
        
        // Get all people
        $peopleResponse = Http::get(self::SWAPI_BASE_URL . '/people');
        $peopleData = $peopleResponse->json();
        
        if (isset($peopleData['results']) && is_array($peopleData['results'])) {
            $characters = [];
            foreach ($peopleData['results'] as $person) {
                $characters[] = [
                    'uid' => $person['uid'],
                    'name' => $person['name']
                ];
            }
            
            // Add characters to the movie data
            if (isset($data['result']['properties'])) {
                $data['result']['properties']['characters'] = $characters;
            }
        }
        
        return $data;
    }

    private function getResource(string $type, string $id): array
    {
        $url = self::SWAPI_BASE_URL . '/' . $type . '/' . $id;
        
        Log::info('Fetching SWAPI resource', [
            'type' => $type,
            'id' => $id,
            'url' => $url
        ]);

        $response = Http::get($url);
        $data = $response->json();

        Log::info('SWAPI resource response received', [
            'status' => $response->status(),
            'body' => $data
        ]);

        return $data;
    }
} 