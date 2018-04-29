# Gevent needed for sockets
from gevent import monkey
monkey.patch_all()

# Imports
import os
import redis
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
import logging

# Configure app
socketio = SocketIO()
app = Flask(__name__)
app.config.from_object(os.environ["APP_SETTINGS"])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

# DB
db = SQLAlchemy(app)
rdb_00 = redis.StrictRedis(host="redis", port=6379,
                           db=0)
rdb_01 = redis.StrictRedis(host="redis", port=6379,
                           db=1)
rdb_15 = redis.StrictRedis(host="redis", port=6379,
                           db=15)

# Import + Register Blueprints
from app.accounts import accounts as accounts
app.register_blueprint(accounts)
from app.irsystem import irsystem as irsystem
app.register_blueprint(irsystem)

# Initialize app w/SocketIO
socketio.init_app(app)

# HTTP error handling
@app.errorhandler(404)
def not_found(error):
  return render_template("404.html"), 404
