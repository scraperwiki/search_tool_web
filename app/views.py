#!/usr/bin/env python
# encoding: utf-8
from __future__ import (unicode_literals, division,
                        print_function, absolute_import)

from flask import request
from app import app


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/search')
def search():
    # query = request.args.get('q')
    return '', 204
