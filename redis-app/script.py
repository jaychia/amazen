import redis
import json
import time
import multiprocessing
import os
from collections import defaultdict

# -------------    Helpers    --------------
r = redis.StrictRedis(host='localhost', port=6379, db=0)

def convolve(r, words, pipedict, windowsize=5, step=3):
  words = list(words)
  for i in range(0, len(words), step):
    w_conv = words[i-(windowsize//2):i+(windowsize//2)+1]
    for w in w_conv:
      if w != words[i]:
        pipedict[words[i]][w] += 1

def run(fname):
  with open("filtered-tokenized/" + fname, "r") as f:
    start = time.time()
    print("Starting {0}.".format(fname))
    pipedict = defaultdict(lambda: defaultdict(int))
    for i, l in enumerate(f):
      revs = json.loads(l)["allReviews"]
      for rev in revs:
        wlist = rev[1]
        convolve(r, wlist, pipedict)
      if i % 1000 == 0:
        pipe = r.pipeline()
        for word in pipedict:
          for correlated_word in pipedict[word]:
            pipe.hincrby(word, correlated_word, amount=pipedict[word][correlated_word])
        pipe.execute()
        pipedict.clear()
        print("{2} {0} products, refreshing bf, took {1} seconds since last print".format(i, time.time() - start, fname))
        start = time.time()

if __name__ == "__main__":
  ppool = multiprocessing.Pool(processes=4)
  fnames = os.listdir("filtered-tokenized")
  ppool.map(run, fnames)

