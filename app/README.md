# Bing Search Tool

## What it does

Retrieves the first 50 search results made via the Bing Search API for
user-specified search terms.

## Installation

1. Clone this repository somewhere (`/home/tool` on a ScraperWiki box to
   get the web UI working).
2. Make a virtualenv and `pip install 
   -r requirements.txt`. (You should be
   able to use the `--user` option instead of a virtualenv if you
   prefer.)
3. Get a Bing API key (see [here](https://github.com/scraperwiki/bing-python/blob/master/README.md)).
4. Add `export BING_API_KEY='<YOUR_API_KEY>'` to `~/.bash_profile` and
   optionally reload `~/.bash_profile` in the current terminal: do
   `. ~/.bash_profile` if you want to use the tool immediately.

If using this locally rather than via ScraperWiki's web UI, you can
just clone anywhere, and just run directly.
 
## Usage

Either run directly using:

```text
python run_bing_search.py <search term 1> <search term 2> ...
```

or visit the "Code your own tool" page in your box and enter
comma-separated search terms there.

Data is stored in `swdata` in `scraperwiki.sqlite`.
