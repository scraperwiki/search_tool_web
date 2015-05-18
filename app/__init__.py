#!/usr/bin/env python
# encoding: utf-8
from flask import Flask

app = Flask(__name__, static_folder='static')
from app import views
