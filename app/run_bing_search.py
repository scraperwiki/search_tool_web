#!/usr/bin/env python
# encoding: utf-8
from __future__ import print_function
from __future__ import unicode_literals

from collections import OrderedDict
import json
import os
import sys

import bing
import datetime
import scraperwiki


def get_bing_api_key_from_env():
    """ Return Bing API key from environment variable. """
    try:
        return os.environ['BING_API_KEY']
    except KeyError as e:
        print("Get an API key and export it as BING_API_KEY first.")
        raise


def get_query_terms(argv):
    """ Return list of query terms from args or JSON list in allSettings.json.

    In the web UI, terms are comma separated on entry; on the command line,
    space separated - quote them if you want spaces."""
    if argv is None:
        argv = sys.argv
    arg = argv[1:]
    if len(arg) > 0:
        query_terms = arg
    else:
        with open(os.path.expanduser("~/allSettings.json")) as settings:
            query_terms = json.load(settings)['search-terms']
    return [term.strip() for term in query_terms]


def run_search(query_terms, bing_api_key):
    """ Take list of query terms, do Bing search for each, save to db. """
    rows = []
    for query_term in query_terms:
        api = bing.Api(bing_api_key)
        for result_number, result in enumerate(api.query(query_term)):
            row = OrderedDict([
                ('search_term', query_term),
                ('result_number', result_number + 1),
                ('url', result['Url']),
                ('title', result['Title']),
                ('description', result['Description']),
                ('datetime', datetime.datetime.now()),
            ])
            rows.append(row)
    scraperwiki.sqlite.save(['search_term', 'result_number'], rows)


def main(argv=None):
    """ Run Bing search for terms entered via command line or JSON. """
    bing_api_key = get_bing_api_key_from_env()
    query_terms = get_query_terms(argv)
    run_search(query_terms, bing_api_key)


if __name__ == '__main__':
    # TODO remove this hack; needed as execution stops on platform
    # due to warning. Microsoft certificate doesn't provide subjectAltName.
    # See https://github.com/shazow/urllib3/issues/497
    import requests.packages.urllib3
    requests.packages.urllib3.disable_warnings()
    main()
