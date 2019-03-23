<?php

namespace SearchResultsAggregator;

use Exception;

class Aggregator
{
    private $searchEngines = [];

    public function searchEngineForKeyword($queryString)
    {
        foreach ($this->searchEngines as $validSearchEngine) {
            // use each search enging function search to search for keyword
            $validSearchEngine->search($queryString);
        }
    }

    public function useSearchEngine($searchEngineToAdd)
    {
        $this->searchEngines[] = $searchEngineToAdd;
    }
}
