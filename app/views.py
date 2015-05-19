#!/usr/bin/env python
# encoding: utf-8
from __future__ import (unicode_literals, division,
                        print_function, absolute_import)

from flask import request
from app import app
from app import run_bing_search


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/search')
def search():
    query = ['search-tool-web', request.args.get('q')]
    run_bing_search.main(query)
    return '', 204
