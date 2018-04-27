import redis
import os
import json
import multiprocessing
import time
import enchant

r = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)

def valid(w, english_spelling):
  in_title = r.hget("#titleoccurences", w)
  if in_title is not None:
    return True
  count = r.hget("#occurences", w)
  if count is None:
    return False
  if int(count) > 1000:
    return True
  for i in w.split("-"):
    if i == "" or not english_spelling.check(i):
      return False
  return True

def run():
  english_spelling = enchant.Dict("en_US")
  #with open("english-dictionary", "r") as f:
  #  for l in f:
  #    english_spelling.add(l.strip())
  with open("wordset/final", "r") as f:
    with open("wordset/finalfiltered", "w") as out_f:
      start = time.time()
      for i, l in enumerate(f):
        s = l.strip()
        if valid(s, english_spelling):
          out_f.write(l.strip())
          out_f.write("\n")
        if i % 1000 == 0:
          print("{0}, elapsed {1}".format(i, time.time() - start))
          start = time.time()

if __name__ == "__main__":
  run()
