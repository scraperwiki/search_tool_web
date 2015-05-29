#!/usr/bin/env python
# encoding: utf-8
from __future__ import (unicode_literals, division,
                        print_function, absolute_import)

from flask import request, Blueprint
from app import run_bing_search

search = Blueprint('search', __name__, static_folder='static',
                   static_url_path='/static/search')


@search.route('/')
def index():
    return search.send_static_file('search_tool_index.html')


@search.route('/search')
def do_search():
    query = ['search-tool-web', request.args.get('q')]
    run_bing_search.main(query)
    return '', 204
