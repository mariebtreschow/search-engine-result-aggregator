<?php
namespace SearchResultsAggregator;

class ResultItem
{
    private $url;
    private $title;
    private $sources;

    static $instances=array();

    public function url($url): void
    {
        $this->url = $url;
    }

    public function title($title): void
    {
        $this->title = $title;
    }

    public function addSources($source): void
    {
        foreach ($this->sources as $value) {
            if ($value == $source) {
                return;
            }
        }
        $this->sources[] = $source;
    }

    public function getUrl(): string
    {
        return $this->url;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getSoruces(): array
    {
        return $this->sources;
    }

    public function __toString() {

        return (string) $this->url;
    }

    public function __construct() {
        ResultItem::$instances[] = $this;
    }

}
