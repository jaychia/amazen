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
  return filter(lambda w: w != "", map(lambda w: re.sub(r'[^\w\s\-]', '', w), words))

def replace_numbers(words):
  """Replace all interger occurrences in list of tokenized words with textual representation"""
  return filter(lambda w: not w.isdigit(), words)

def filter_vocab(words):
  """Remove non-vocab words from list of tokenized words"""
  return filter(lambda w: w in vocab, words)

def remove_single_word(words):
  return filter(lambda x: len(x) > 1, words)

def normalize(words):
    words = remove_non_ascii(words)
    words = to_lowercase(words)
    words = remove_punctuation(words)
    words = replace_numbers(words)
    words = dash_nots(words)
    words = remove_single_word(words)
    words = list(filter_vocab(words))
    return words

# -------------    Helpers    --------------


def break_string(s):
  s = contractions.fix(s)
  s = nltk.word_tokenize(s)
  s = normalize(s)
  return s

def run(fname):
  out_file = "tokenized/" + fname + "-tokenized"

  with open("data/" + fname, "r") as f:
    with open(out_file, "w") as out_f:
      # Timer
      start = time.time()
      print("Starting {0}.".format(fname))

      for i, l in enumerate(f):
        d = json.loads(l)
        # Break reviews
        revs = d["allReviews"]
        tokenized_reviews = []
        for rev in revs:
          tokenized_reviews.append([rev[0], break_string(rev[1])])
        d["allReviews"] = tokenized_reviews
        # Break title
        if "title" in d:
          d["title"] = break_string(d["title"])
        # Break desc
        if "description" in d:
          d["description"] = break_string(d["description"])
        out_f.write(json.dumps(d, out_f))
        out_f.write("\n")
        # Timer
        if i % 100 == 1:
          print("{2} {0} products, took {1} seconds since last print".format(i, time.time() - start, fname))
          start = time.time()

if __name__ == "__main__":
  vocab = set()
  with open("wordset/finalfiltered", "r") as f:
    for l in f:
      vocab.add(l.strip())
  ppool = multiprocessing.Pool(processes=4)
  fnames = os.listdir("data")
  ppool.map(run, fnames)

