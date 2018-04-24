from . import *
from flask import current_app

class Product(Base):
  __tablename__ = 'products'

  name = db.Column(db.String(), nullable=False)
  price = db.Column(db.Float(), nullable=False)
  img_url = db.Column(db.String(), nullable=False)
  azn_product_id = db.Column(db.String(), unique=True, nullable=False, index=True)
  seller_name = db.Column(db.String(), nullable=True)
  desc = db.Column(db.Text(), nullable=True)
  average_stars = db.Column(db.Float(), nullable=False)
  num_ratings = db.Column(db.Integer, nullable=False)
  keywords = db.Column(db.String(), nullable=True)
  keywordscores = db.Column(db.String(), nullable=True)
  keywordscoredist = db.Column(db.String(), nullable=True)

  def __init__(self, name, price, img_url, azn_product_id, seller_name, desc, average_stars, num_ratings, keywords=None, keywordscores=None, keywordscoredist=None):
    """
    Initialize a product SQLAlchemy Model Object
    Requires: 
      String [name]
      Float [price]
      String [img_url]
    """
    self.name = name
    self.price = price
    self.img_url = img_url
    self.azn_product_id = azn_product_id
    self.seller_name = seller_name
    self.desc = desc
    self.average_stars = average_stars
    self.num_ratings = num_ratings
    self.keywords = keywords
    self.keywordscores = keywordscores
    self.keywordscoredist = keywordscoredist

  def __repr__(self):
    return str(self.__dict__)

def keywords_with_pids(pid_list):
  products = Product.query.filter(Product.azn_product_id.in_(pid_list)).all()
  pmap = {p.azn_product_id: p.keywords for p in products}

  return [pmap[id] for id in pid_list if id in pmap][:k]


def products_with_pids(pid_list, k=10):

  products = Product.query.filter(Product.azn_product_id.in_(pid_list)).all()
  pmap = {p.azn_product_id: p for p in products}

  current_app.logger.info(len(pmap))

  return [pmap[id] for id in pid_list if id in pmap][:k]

def new_products(tuplist):
  """
  Creates new product in database
  tuplist must be list of named tuples
  ProductTuple(name, price, img_url, azn_product_id, seller_name)
  """
  db.session.bulk_save_objects(list(map(lambda tup: Product(tup.name, tup.price, tup.img_url, tup.azn_product_id,
                          tup.seller_name, tup.desc, tup.average_stars, tup.num_ratings),
      tuplist)))
  db.session.commit()

# def update_product_keywords(azn_pid, keywords):
#   """
#   Updates the keywords for a given azn_pid
#   keywords are [('key', score)...]
#   """
#   p = Product.query.filter_by(azn_product_id=azn_pid).first()
#   if p is not None:
#     p.keywords = ",".join([k for k, _ in keywords])
#     p.keywordscores = ",".join([str(s) for _, s in keywords])
#     db.session.commit()


def update_product_keywords(asin, keywords, keywords_scores, keywords_scores_dist):
  p = Product.query.filter_by(azn_product_id=asin).first()
  if p is not None:
    p.keywords = ",".join(keywords)
    p.keywordscores = ",".join(list(map(lambda x: str(x), keywords_scores)))
    keyworddistlist = []
    for l in keywords_scores_dist:
      s = "["
      for i in range(len(l)):
        s = s + str(l[i])
        if i != len(l) - 1:
          s = s + ","
      s = s + "]"
      keyworddistlist.append(s)
    p.keywordscoredist = ",".join(keyworddistlist)
    db.session.commit()
    


def update_product_desc(tuplist):
  for tup in tuplist:
    p = Product.query.filter_by(azn_product_id=tup.azn_product_id).first()
    p.desc = tup.desc
    db.session.commit()

class ProductSchema(ModelSchema):
  class Meta:
    model = Product
