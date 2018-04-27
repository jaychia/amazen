import redis
import os
import json
import multiprocessing
import time

r = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)

def run(fname):
  with open("tokenized/" + fname, "r") as f:
    pipe = r.pipeline()
    start = time.time()
    for i, l in enumerate(f):
      d = json.loads(l)
      for w in d.get("title", []):
        pipe.hincrby("#occurences", w)
        pipe.hincrby("#titleoccurences", w)
      for w in d.get("description", []):
        pipe.hincrby("#occurences", w)
      for rev in d.get("allReviews", []):
        for w in rev[1]:
          pipe.hincrby("#occurences", w)
      if i % 1000 == 0:
        print("{0} - {1}, elapsed {2}".format(fname, i, time.time() - start))
        start = time.time()
        pipe.execute()

if __name__ == "__main__":
  p = multiprocessing.Pool(processes=5)
  fnames = os.listdir("tokenized")
  p.map(run, fnames)
  occur = r.hgetall("#occurences")
  l = [(key, occur[key]) for key in occur]
  l.sort(key=lambda x: x[1])
  with open("prunelist.txt", "w") as f:
    for x in l:
      f.write(x[0])
      f.write(",")
      f.write(str(x[1]))
      f.write("\n")

