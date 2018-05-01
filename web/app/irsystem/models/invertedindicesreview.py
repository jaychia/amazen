from . import *
from ast import literal_eval

class Invertedindicesreview(Base):
  __tablename__ = 'invertedindicesreviews'

  term = db.Column(db.String(), nullable=False, index=True)
  scorelist = db.Column(db.String(), nullable=False)

  def __init__(self, term, scorelist):
    """
    Initialize a review SQLAlchemy Model Object
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

def scorelists_with_terms_for_review(term_list):
  invertedindicesreviews = Invertedindicesreview.query.filter(Invertedindicesreview.term.in_(term_list)).all()
  return {r.term: literal_eval(r.scorelist) for r in invertedindicesreviews}

def new_invertedindicesreview(tuplist):
  """
  Creates new invertedindicesreview in database
  """
  db.session.bulk_save_objects(list(
      map(lambda x: Invertedindicesreview(x[0], x[1]), tuplist)))
  db.session.commit()

def delete_invertedindicesreview():
  db.session.query(Invertedindicesreview).delete()
  db.session.commit()

class InvertedindicesreviewSchema(ModelSchema):
  class Meta:
    model = Invertedindicesreview
