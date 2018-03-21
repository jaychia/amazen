import os
basedir = os.path.abspath(os.path.dirname(__file__))

# Different environments for the app to run in

class Config(object):
  DEBUG = False
  CSRF_ENABLED = True
  CSRF_SESSION_KEY = "secret"
  SECRET_KEY = "not_this"
  DB_NAME = os.environ['DB_NAME']
  DB_USER = os.environ['DB_USER']
  DB_PASS = os.environ['DB_PASS']
  DB_SERVICE = os.environ['DB_SERVICE']
  DB_PORT = os.environ['DB_PORT']
  SQLALCHEMY_DATABASE_URI = 'postgresql://{0}:{1}@{2}:{3}/{4}'.format(
      DB_USER, DB_PASS, DB_SERVICE, DB_PORT, DB_NAME
  )

class ProductionConfig(Config):
  DEBUG = False

class StagingConfig(Config):
  DEVELOPMENT = True
  DEBUG = True

class DevelopmentConfig(Config):
  DEVELOPMENT = True
  DEBUG = True

class TestingConfig(Config):
  TESTING = True
