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

  def __init__(self, name, price, img_url, azn_product_id, seller_name, desc, average_stars, num_ratings, keywords=None, keywordscores=None):
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

  def __repr__(self):
    return str(self.__dict__)

def products_with_pids(pid_list):
  products = Product.query.filter(Product.azn_product_id.in_(pid_list)).all()
  pmap = {p.azn_product_id: p for p in products}
  return [pmap[id] for id in pid_list if id in pmap]

def new_products(tuplist):
  """
  Creates new product in database
  tuplist must be list of named tuples
  ProductTuple(name, price, img_url, azn_product_id, seller_name)
  """
  for tup in tuplist:
    p = Product(tup.name, tup.price, tup.img_url, tup.azn_product_id, tup.seller_name, tup.desc, tup.average_stars, tup.num_ratings)
    if db.session.query(Product.azn_product_id).filter_by(azn_product_id=tup.azn_product_id).scalar() is None:
      db.session.add(p)
      db.session.commit()

def update_product_keywords(azn_pid, keywords):
  """
  Updates the keywords for a given azn_pid
  keywords are [('key', score)...]
  """
  p = Product.query.filter_by(azn_product_id=azn_pid).first()
  if p is not None:
    p.keywords = ",".join([k for k, _ in keywords])
    p.keywordscores = ",".join([str(s) for _, s in keywords])
    db.session.commit()


def update_product_desc(tuplist):
  for tup in tuplist:
    p = Product.query.filter_by(azn_product_id=tup.azn_product_id).first()
    p.desc = tup.desc
    db.session.commit()

class ProductSchema(ModelSchema):
  class Meta:
    model = Product
