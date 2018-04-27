import json
import nltk
import re, unicodedata
from nltk import word_tokenize, sent_tokenize
import contractions
import time
import multiprocessing
import os
from functools import reduce

# -------------    Helpers    --------------
global vocab

def filter_wordlist(wlist):
  return list(filter((lambda w: w in vocab), wlist))

def run(fname):
  out_file = "filtered-tokenized/" + fname

  with open("tokenized/" + fname, "r") as f:
    with open(out_file, "w") as out_f:
      # Timer
      start = time.time()
      print("Starting {0}.".format(fname))

      for i, l in enumerate(f):
        d = json.loads(l.strip())
        # Break reviews
        new_reviews = [(wlist[0], filter_wordlist(wlist[1])) for wlist in d["allReviews"]]
        d['allReviews'] = new_reviews
        if "description" in d:
          d["description"] = filter_wordlist(d["description"])
        out_f.write(json.dumps(d, out_f))
        out_f.write("\n")
        # Timer
        if i % 1000 == 1:
          print("{2} {0} products, took {1} seconds since last print".format(i, time.time() - start, fname))
          start = time.time()

if __name__ == "__main__":
  vocab = set()
  with open("wordset/finalfiltered", "r") as f:
    for l in f:
      vocab.add(l.strip())
  ppool = multiprocessing.Pool(processes=5)
  fnames = os.listdir("tokenized")
  ppool.map(run, fnames)

