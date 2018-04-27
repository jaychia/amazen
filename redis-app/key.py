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
from collections import defaultdict

# -------------    Helpers    --------------
global bf
r = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)

def remove_non_ascii(words):
  """Remove non-ASCII characters from list of tokenized words"""
  return map(lambda w: unicodedata.normalize('NFKD', w).encode('ascii', 'ignore').decode('utf-8', 'ignore'), words)

def to_lowercase(words):
  """Convert all characters to lowercase from list of tokenized words"""
  return map(lambda w: w.lower(), words)

def remove_punctuation(words):
  """Remove punctuation from list of tokenized words"""
  return filter(lambda w: w != "", map(lambda w: re.sub(r'[^\w\s]', '', w), words))

def replace_numbers(words):
  """Replace all interger occurrences in list of tokenized words with textual representation"""
  return filter(lambda w: not w.isdigit(), words)

def remove_stopwords(words, stopws):
  """Remove stop words from list of tokenized words"""
  return filter(lambda w: w not in stopws, words)

def passes_bloom_filter(words, bf):
  return filter(lambda w: w in bf, words)

def normalize(words, stopws, bf):
    words = remove_non_ascii(words)
    words = to_lowercase(words)
    words = remove_punctuation(words)
    words = replace_numbers(words)
    no_stopwords = list(remove_stopwords(words, stopws))
    words = [x for x in passes_bloom_filter(no_stopwords, bf)]
    [bf.add(w) for w in no_stopwords]
    return words

# -------------    Helpers    --------------


def break_rev(rev, stopws, bf):
  rev = contractions.fix(rev)
  rev = nltk.word_tokenize(rev)
  rev = normalize(rev, stopws, bf)
  return rev

def run(fname):
  stopws = stopwords.words('english')
  bf = pybloom_live.BloomFilter(capacity=100000, error_rate=0.001)
  with open("data/" + fname, "r") as f:
    start = time.time()
    print("Starting {0}.".format(fname))
    for i, l in enumerate(f):
      reviews_dict = defaultdict(int)
      scores_dict = defaultdict(float)
      count_dict = defaultdict(int)
      revs = json.loads(l)["allReviews"]
      for rev in revs:
        score = rev[0]
        wlist = break_rev(rev[1], stopws, bf)
        for w in wlist:
          count = r.hget("#counts", w)
          if count is None: continue
          if int(count) < 1000 or int(count) > 7000: continue
          reviews_dict[w] = reviews_dict[w] + 1
          scores_dict[w] = scores_dict[w] + score
          count_dict[w] = count_dict[w] + 1
      for key in reviews_dict:
        reviews_dict[key] = reviews_dict[key] / int(r.hget("#counts", key))
      results = [(x[0], x[1], (scores_dict[x[0]] / count_dict[x[0]]), count_dict[x[0]]) for x in reviews_dict.items()]
      results.sort(key=lambda x: x[1])
      if 'title' in l:
        print(json.loads(l)["title"])
        print(list(map(lambda x: x[0], results[::-1][:10])))
      if i % 100 == 0:
        print("{2} {0} products, refreshing bf, took {1} seconds since last print".format(i, time.time() - start, fname))
        bf = pybloom_live.BloomFilter(capacity=100000, error_rate=0.001)
        start = time.time()
      if i == 10: break

if __name__ == "__main__":
  fnames = os.listdir("data")
  run(fnames[0])
