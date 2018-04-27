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
from functools import reduce

# -------------    Helpers    --------------
global bf

def remove_non_ascii(words):
  """Remove non-ASCII characters from list of tokenized words"""
  return map(lambda w: unicodedata.normalize('NFKD', w).encode('ascii', 'ignore').decode('utf-8', 'ignore'), words)

def dash_nots(words):
  """Adds a dash after all nots"""
  return reduce((lambda l, x: l[:-1]+([l[-1]+"-"+x]) if len(l) > 0 and l[-1] == "not" else l + [x]), words, [])

def to_lowercase(words):
  """Convert all characters to lowercase from list of tokenized words"""
  return map(lambda w: w.lower(), words)

def remove_punctuation(words):
  """Remove punctuation from list of tokenized words"""
  return filter(lambda w: w != "" and w != "-", map(lambda w: re.sub(r'[^\w\s\-]', '', w), words))

def replace_numbers(words):
  """Replace all interger occurrences in list of tokenized words with textual representation"""
  return filter(lambda w: not w.isdigit(), words)

def remove_stopwords(words, stopws):
  """Remove stop words from list of tokenized words"""
  return filter(lambda w: w not in stopws, words)

def passes_bloom_filter(words, bf):
  return filter(lambda w: w in bf, words)

def remove_single_word(words):
  return filter(lambda x: len(x) > 1, words)

def normalize(words, stopws, bf):
    words = remove_non_ascii(words)
    words = to_lowercase(words)
    words = remove_punctuation(words)
    words = replace_numbers(words)
    words = dash_nots(words)
    words = remove_single_word(words)
    no_stopwords = list(remove_stopwords(words, stopws))
    words = [x for x in passes_bloom_filter(no_stopwords, bf)]
    [bf.add(w) for w in no_stopwords]
    return words

# -------------    Helpers    --------------


def break_string(s, stopws, bf):
  s = contractions.fix(s)
  s = nltk.word_tokenize(s)
  s = normalize(s, stopws, bf)
  return s

def run(fname):
  out_file = "wordset/" + fname + "-wordset"
  stopws = set(stopwords.words('english'))
  bf = pybloom_live.BloomFilter(capacity=1000000, error_rate=0.001)

  with open("data/" + fname, "r") as f:
    with open(out_file, "w") as out_f:
      # Timer
      start = time.time()
      print("Starting {0}.".format(fname))
      tokenized_words = set()
      for i, l in enumerate(f):
        d = json.loads(l)
        # Break reviews
        revs = d["allReviews"]
        for rev in revs:
          for w in break_string(rev[1], stopws, bf):
            tokenized_words.add(w)
        # Break title
        if "title" in d:
          for w in break_string(d["title"], stopws, bf):
            tokenized_words.add(w)
        # Break desc
        if "description" in d:
          for w in break_string(d["description"], stopws, bf):
            tokenized_words.add(w)
        # Timer
        if (i+1) % 100 == 3:
          bf = pybloom_live.BloomFilter(capacity=1000000, error_rate=0.001)
          print("{2} {0} products, refreshing bf, took {1} seconds since last print".format(i, time.time() - start, fname))
          start = time.time()
      for w in tokenized_words:
        out_f.write(w)
        out_f.write("\n")

if __name__ == "__main__":
  ppool = multiprocessing.Pool(processes=4)
  fnames = os.listdir("data")
  ppool.map(run, fnames)
  finalset = set()
  fnames = os.listdir("wordset/")
  for fname in fnames:
    with open("wordset/" + fname, 'r') as f:
      for l in f:
        finalset.add(l.strip())
  with open("wordset/final", "w") as f:
    for w in finalset:
      f.write(w)
      f.write("\n")
