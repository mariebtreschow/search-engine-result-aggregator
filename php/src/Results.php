<?php
namespace SearchResultsAggregator;

use SearchResultsAggregator\ResultItem;

class Results extends \ArrayIterator
{
    public function createResultItem($url, $title, $source): void
    {
        $resultItem = new ResultItem();
        $resultItem->url($url);
        $resultItem->title($title);

        $url = $resultItem->getUrl();
        // check intances of result item
        // TODO: logic for not having duplicates

    }
}
