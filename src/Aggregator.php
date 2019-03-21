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
        foreach ($this->searchEngines as $existingEngine) {
            if ($existingEngine == $searchEngineToAdd) { // check if already added
                throw new Exception('You already added this search engine');
            }
        }
        // add search enging
        $this->searchEngines[] = $searchEngineToAdd;
    }
}
