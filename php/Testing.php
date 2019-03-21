<?php

require __DIR__ . '../../vendor/autoload.php';

$client = new \GuzzleHttp\Client();
$results = new \SearchResultsAggregator\Results();
$google = new \SearchResultsAggregator\Google($client, $results);
$yahoo = new \SearchResultsAggregator\Yahoo($client, $results);
$aggregator = new \SearchResultsAggregator\Aggregator();

try {
    $aggregator->useSearchEngine($google);
    // $aggregator->useSearchEngine($yahoo);
    $aggregator->searchEngineForKeyword('Horses');
    var_dump($results);
} catch (\Exception $e) {
    var_dump($e->getMessage());
}
