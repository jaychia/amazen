import redis
import json
import multiprocessing
import os

def run():
  r = redis.StrictRedis(password="stoptakingdownourr3d1s")
  keylist = r.keys()
  for i, key in enumerate(keylist):
    d = r.hgetall(key)
    new_d = {k: int(v) for k, v in d.items() if int(v) > 2}
    if len(new_d) == 0:
      r.delete(key)
      r.hdel("#counts", key)
    else:
      r.hmset(key, new_d)

if __name__ == "__main__":
  run()
