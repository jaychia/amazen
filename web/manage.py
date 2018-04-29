import os
from flask_script import Manager, Command
from flask_migrate import Migrate, MigrateCommand
from app import app, db

from app.irsystem.models.product import new_products, update_product_keywords, update_product_desc
from app.irsystem.models.invertedindicesproduct import new_invertedindicesproduct
from app.irsystem.models.invertedindicesreview import new_invertedindicesreview
from app.irsystem.models.cooccurenceterm import new_cooccurenceterm, delete_cooccurenceterm

from collections import namedtuple
import json
import pickle

# Migrations
migrate = Migrate(app, db)
manager = Manager(app)
manager.add_command("db", MigrateCommand)

# Initial loading of data
ProductTuple = namedtuple("ProductTuple", 'name price img_url azn_product_id seller_name desc average_stars num_ratings')
def p_json_to_tup(p_json):
  review_length = len(p_json['allReviews'])
  if review_length == 0:
    return None
  if 'title' not in p_json or 'price' not in p_json or 'imUrl' not in p_json or 'asin' not in p_json:
    return None

  avg_stars = 0
  for score, _ in p_json['allReviews']:
    avg_stars += score
  avg_stars /= review_length

  return ProductTuple(
    name=p_json['title'],
    price=p_json['price'],
    img_url=p_json['imUrl'],
    azn_product_id=p_json['asin'],
    seller_name=p_json.get('brand'),
    desc=p_json.get('description'),
    average_stars=avg_stars,
    num_ratings=review_length
  )
    

@manager.command
def loadproducts(json_location):
  assert(os.path.isfile(json_location))
  tuplist = []
  with open(json_location, 'r') as f:
    for line in f:
      p_json = json.loads(line)
      p = p_json_to_tup(p_json)
      if p is not None:
        tuplist.append(p)
      if len(tuplist) > 50000:
        new_products(tuplist)
        del tuplist[:]
  new_products(tuplist)

@manager.command
def update_desc(json_location):
  assert(os.path.isfile(json_location))
  tuplist = []
  with open(json_location, 'r') as f:
    for line in f:
      p_json = json.loads(line)
      p = p_json_to_tup(p_json)
      if p is not None:
        tuplist.append(p)
      if len(tuplist) > 50000:
        update_product_desc(tuplist)
        del tuplist[:]
  update_product_desc(tuplist)

# Loading of keywords and keywordscores
# @manager.command
# def loadkeywords(keywords_location):
#   assert(os.path.isfile(keywords_location))
#   tuplist = []
#   with open(keywords_location, 'r') as f:
#     d = pickle.load(f)
#     for k, v in d.items():
#       update_product_keywords(k, v)

@manager.command
def loadkeywords(keywords_location):
  assert(os.path.isfile(keywords_location))
  with open(keywords_location, 'r') as f:
    for line in f:
      k_json = json.loads(line)
      asin = k_json['asin']
      keywords = [l[0] for l in k_json['keywords']]
      dlist = lambda d: [d[str(i)] for i in range(1,6)]
      keywords_scores_dist = [dlist(d) for d in [l[1] for l in k_json['keywords']]]
      keywords_scores = [l[2] for l in k_json['keywords']]
      keywords_sents = [l[3] for l in k_json['keywords']]
      update_product_keywords(asin, keywords, keywords_scores, keywords_scores_dist, keywords_sents)

@manager.command
def loadinvertedindicesproduct(json_location):
  assert(os.path.isfile(json_location))

  with open(json_location, 'r') as f:
    tuplist = []
    for line in f:
      p_json = json.loads(line)
      tuplist.append((p_json['term'], p_json['scorelist']))
      if len(tuplist) > 50000:
        new_invertedindicesproduct(tuplist)
        del tuplist[:]
    new_invertedindicesproduct(tuplist)

@manager.command
def loadinvertedindicesreview(json_location):
  assert(os.path.isfile(json_location))

  with open(json_location, 'r') as f:
    tuplist = []
    for line in f:
      p_json = json.loads(line)
      tuplist.append((p_json['term'], p_json['scorelist']))
      if len(tuplist) > 50000:
        new_invertedindicesreview(tuplist)
        del tuplist[:]
    new_invertedindicesreview(tuplist)

@manager.command
def loaddatalist(func, json_folder_location):
  files = [f for f in os.listdir(json_folder_location) if os.path.isfile(
      os.path.join(json_folder_location, f))]
  for fname in files:
    loadinvertedindicesreview(json_folder_location + '/' + fname)
  
@manager.command
def loadcooccurenceterm(json_location):
  assert(os.path.isfile(json_location))

  with open(json_location, 'r') as f:
    tuplist = []
    for line in f:
      p_json = json.loads(line)
      tuplist.append((p_json['term'], str(p_json['termlist'])))
      if len(tuplist) > 50000:
        new_cooccurenceterm(tuplist)
        del tuplist[:]
    new_cooccurenceterm(tuplist)

@manager.command
def loadcooccurencetermlist(json_folder_location):
  files = [f for f in os.listdir(json_folder_location) if os.path.isfile(
      os.path.join(json_folder_location, f))]
  print(len(files))
  for fname in files:
    loadcooccurenceterm(json_folder_location + '/' + fname)

@manager.command
def deletecooccurenceterm():
  delete_cooccurenceterm()

if __name__ == "__main__":
  manager.run()

