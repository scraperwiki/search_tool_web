#!/usr/bin/env python
# encoding: utf-8
from __future__ import (unicode_literals, division,
                        print_function, absolute_import)
from app import app


@app.route('/')
def index():
    return app.send_static_file('index.html')
