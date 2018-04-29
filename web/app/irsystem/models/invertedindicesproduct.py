from . import *
from flask import current_app
from ast import literal_eval

class Invertedindicesproduct(Base):
  __tablename__ = 'invertedindicesproducts'

  term = db.Column(db.String(), nullable=False, index=True)
  scorelist = db.Column(db.String(), nullable=False)

  #keywords = db.Column(db.String(), nullable=True)
  #keywordscores = db.Column(db.String(), nullable=True)

  def __init__(self, term, scorelist):
    """
    Initialize a invertedindicesproduct SQLAlchemy Model Object
    Requires: 
      String [name]
      Float [price]
      String [img_url]
    """
    self.term = term
    self.scorelist = scorelist
    #self.keywords = keywords
    #self.keywordscores = keywordscores

  def __repr__(self):
    return str(self.__dict__)

def scorelists_with_terms_for_product(term_list):
  invertedindicesproducts = Invertedindicesproduct.query.filter(Invertedindicesproduct.term.in_(term_list)).all()
  return {p.term: literal_eval(p.scorelist) for p in invertedindicesproducts}

def new_invertedindicesproduct(tuplist):
  """
  Creates new product in database
  tuplist must be list of named tuples
  InvertedindicesproductTuple(name, price, img_url, azn_product_id, seller_name)
  """
  db.session.bulk_save_objects(list(
      map(lambda x: Invertedindicesproduct(x[0], x[1]), tuplist)))
  db.session.commit()

def delete_invertedindicesproduct():
  db.session.query(Invertedindicesproduct).delete()
  db.session.commit()

class InvertedindicesproductSchema(ModelSchema):
  class Meta:
    model = Invertedindicesproduct
