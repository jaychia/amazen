from . import *
from flask import current_app
from ast import literal_eval

class Cooccurenceterm(Base):
  __tablename__ = 'cooccurenceterms'

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

def scorelists_with_terms_for_cooccurenceterm(term_list):
  queried_cooccurenceterms = Cooccurenceterm.query.filter(Cooccurenceterm.term.in_(term_list)).all()
  # current_app.logger.info(queried_cooccurenceterms)
  return {p.term: literal_eval(p.scorelist) for p in queried_cooccurenceterms}

def new_cooccurenceterm(tuplist):
  """
  Creates new product in database
  tuplist must be list of named tuples
  InvertedindicesproductTuple(name, price, img_url, azn_product_id, seller_name)
  """
  db.session.bulk_save_objects(list(
      map(lambda x: Cooccurenceterm(x[0], x[1]), tuplist)))
  db.session.commit()

def delete_cooccurenceterm():
  db.session.query(Cooccurenceterm).delete()
  db.session.commit()

class CooccurencetermSchema(ModelSchema):
  class Meta:
    model = Cooccurenceterm
