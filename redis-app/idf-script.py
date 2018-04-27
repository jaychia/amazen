import redis
import json
import nltk
import re, unicodedata
from nltk import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
import contractions
import time
import pybloom_live
import multiprocessing
import os

# -------------    Helpers    --------------
r = redis.StrictRedis(host='localhost', port=6379, db=0)

def run():
  counts = {}
  for key in r.scan_iter("*"):
    counts[key] = r.hlen(key)
  r.hmset("#counts", counts)

if __name__ == "__main__":
  run()

