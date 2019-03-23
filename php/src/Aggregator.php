<?php

namespace SearchResultsAggregator;

use Exception;

class Aggregator
{
    private $searchEngines = [];

    public function searchEnginesForKeyword($queryString)
    {
        foreach ($this->searchEngines as $validSearchEngine) {
            $validSearchEngine->search($queryString);
        }
    }

    public function useSearchEngine($searchEngineToAdd)
    {
        $this->searchEngines[] = $searchEngineToAdd;
    }
}
