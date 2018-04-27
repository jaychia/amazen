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

def convolve(r, words, pipe, windowsize=5, step=1):
  words = list(words)
  for i in range(0, len(words), step):
    w_conv = words[i-(windowsize//2):i+(windowsize//2)+1]
    for w in w_conv:
      if w != words[i]:
        pipe.hincrby(words[i], w)

def run(fname):
  with open("filtered-tokenized/" + fname, "r") as f:
    start = time.time()
    print("Starting {0}.".format(fname))
    for i, l in enumerate(f):
      revs = json.loads(l)["allReviews"]
      pipe = r.pipeline()
      for rev in revs:
        wlist = rev[1]
        convolve(r, wlist, pipe)
      pipe.execute()
      if i % 1000 == 0:
        print("{2} {0} products, refreshing bf, took {1} seconds since last print".format(i, time.time() - start, fname))
        bf = pybloom_live.BloomFilter(capacity=100000, error_rate=0.001)
        start = time.time()

if __name__ == "__main__":
  ppool = multiprocessing.Pool(processes=5)
  fnames = os.listdir("filtered-tokenized")
  ppool.map(run, fnames)

