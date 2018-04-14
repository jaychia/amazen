from . import *

class Product(Base):
  __tablename__ = 'products'

  name      = db.Column(db.String())
  price     = db.Column(db.Float())
  img_url   = db.Column(db.String())

  def __init__(self, name, price, img_url):
    """
    Initialize a product SQLAlchemy Model Object
    Requires: 
      String [name]
      Float [price]
      String [img_url]
    """
    self.name     = name
    self.price    = price
    self.img_url  = img_url

  def __repr__(self):
    return str(self.__dict__)


class ProductSchema(ModelSchema):
  class Meta:
    model = Product
