import redis
import sys
from collections import defaultdict

# -------------    Helpers    --------------
r = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)

def get_cooc(positive_s, negative_s, neutral_s, count_penalty, model_penalty, count_thresh):
  final_scores = defaultdict(float)
  seen_set = set(neutral_s) | set(positive_s) | set(negative_s)
  for i, s in enumerate(positive_s):
    sdict = r.hgetall(s)
    for key in sdict:
      if key in seen_set: continue
      count = r.hget("#counts", key)
      if count is not None and int(count) > count_thresh:
        tfidf_score =  (int(sdict[key])) / (int(count) ** (count_penalty))
        if not key.isalpha():
          tfidf_score = tfidf_score / model_penalty
        final_scores[key] = final_scores[key] + ((i+1) * tfidf_score)
  for i, s in enumerate(negative_s):
    sdict = r.hgetall(s)
    for key in sdict:
      if key in seen_set: continue
      count = r.hget("#counts", key)
      if count is not None and int(count) > count_thresh:
        tfidf_score = (int(sdict[key])) / (int(count) ** (count_penalty))
        if not key.isalpha():
          tfidf_score = tfidf_score / model_penalty
        final_scores[key] = final_scores[key] - ((i+1) * tfidf_score)
  final = list(final_scores.items())
  final.sort(key=lambda x: x[1])
  return list(map(lambda x: x[0], final[::-1][:10]))

