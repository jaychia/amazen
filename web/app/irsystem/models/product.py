from . import *
from flask import current_app

class Product(Base):
  __tablename__ = 'products'

  name = db.Column(db.String(), nullable=False)
  price = db.Column(db.Float(), nullable=False)
  img_url = db.Column(db.String(), nullable=False)
  azn_product_id = db.Column(db.String(), unique=True, nullable=False, index=True)
  seller_name = db.Column(db.String(), nullable=False)
  #average_stars = db.Column(db.Float(), nullable=False)
  #keywords = db.Column(db.String(), nullable=False)

  def __init__(self, name, price, img_url, azn_product_id, seller_name):
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
    #self.average_stars = average_stars
    #self.keywords = keywords

  def __repr__(self):
    return str(self.__dict__)

def products_with_pids(pid_list):
  products = Product.query.filter(Product.azn_product_id.in_(pid_list)).all()
  pmap = {p.id: p for p in products}
  return [pmap[id] for id in pid_list if id in pmap]

class ProductSchema(ModelSchema):
  class Meta:
    model = Product
