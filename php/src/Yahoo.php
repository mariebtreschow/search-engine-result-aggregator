<?php
namespace SearchResultsAggregator;

require __DIR__ . '../../vendor/autoload.php';

use SearchResultsAggregator\ResultsList;
use GuzzleHttp\Client;

class Yahoo
{
    const BASE_URL_YAHOO = 'https://search.yahoo.com/search';

    private $client = null;
    private $results = null;

    // Constructor injection is passing the dependency into the new object's constructor
    public function __construct(Client $client, Results $results)
    {
        $this->client = $client;
        $this->results = $results;
    }

    public function search(string $query)
    {
        $rawResponse = $this->client->request('GET', self::BASE_URL_YAHOO, ['query' => 'q=' . $query]);
        $content = $rawResponse->getBody()->getContents();
        $this->parseResponseFromYahoo($content);
    }

    private function parseResponseFromYahoo($responseBody)
    {
        $dom = new \DOMDocument();
        @$dom->loadHTML($responseBody);
        $h3Tags = $dom->getElementById('result')->getElementsByTagName('h3');
        // for every result extract the title and the url
        foreach ($h3Tags as $h3Tag) {
            $titel = $h3Tag->nodeValue;
            $aTag = $h3Tag->getElementsByTagName('a')->item(0);
            $url = $aTag->attributes->getNamedItem('href')->value; // not working
            if (!is_null($url)) {  // if url is not null
                $this->results->createResultItem($url, $title, 'yahoo');
            }
        }
    }
}
