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
        if (!isset($this[$url])) {
            $resultItem->addSources($source);
            $this[$url] = $resultItem;
            return;
        } else {
            $resultItem = $this[$url];
            $resultItem->addSources($source);
        }
    }
}
