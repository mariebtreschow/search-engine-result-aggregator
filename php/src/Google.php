<?php
namespace SearchResultsAggregator;

require __DIR__ . '../../vendor/autoload.php';

use SearchResultsAggregator\Results;
use GuzzleHttp\Client;

class Google
{
    const BASE_URL_GOOGLE = 'https://www.google.com/search';

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
        $rawResponse = $this->client->request('GET', self::BASE_URL_GOOGLE, ['query' => 'q=' . $query]);
        $content = $rawResponse->getBody()->getContents();
        $this->parseResponseFromGoogle($content);
    }

    private function parseResponseFromGoogle($responseBody)
    {
        $dom = new \DOMDocument();
        @$dom->loadHTML($responseBody);
        $h3Tags = $dom->getElementById('search')->getElementsByTagName('h3');
        // for every result extract the title and the url
        foreach ($h3Tags as $h3Tag) {
            $titel = $h3Tag->nodeValue;
            $getUrl = $h3Tag->parentNode->getElementsByTagName('cite')->item(0);
            $url = $getUrl->nodeValue;
            if (!is_null($url)) {  // if url is not null
                $this->results->createResultItem($url, $title, 'google');
            }
        }
    }
}
