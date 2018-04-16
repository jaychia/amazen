import os
from flask_script import Manager, Command
from flask_migrate import Migrate, MigrateCommand
from app import app, db
from app.irsystem.models.product import new_products
from collections import namedtuple
import json

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
      desc=p_json.get('desc'),
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


if __name__ == "__main__":
  manager.run()
