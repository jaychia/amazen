from . import *
from app.irsystem.models.helpers import *
from app.irsystem.models.helpers import NumpyEncoder as NumpyEncoder
from app.irsystem.models.product import products_with_pids
from app.irsystem.models.invertedindicesproduct import scorelists_with_terms_for_product
from app.irsystem.models.invertedindicesreview import scorelists_with_terms_for_review
from app.irsystem.models.cooccurenceterm import scorelists_with_terms_for_cooccurenceterm

from flask import jsonify
from flask import current_app
from app.irsystem.irhelpers.getpidhelper import *
import random
from datetime import datetime

project_name = "Amazen"
net_id = "Joo Ho Yeo (jy396) | Amritansh Kwatra (ak2244) | Alex Yoo (ay244) | Jay Chia (jc2375) | Charles Bai (cb674)"

###################################################################################################
# Placeholder functions
##################################################################################################
def classify_query(q):
	return "electronics"

def get_top_products(q,descs,k2=100,k3=10):
	inverted_index_product = scorelists_with_terms_for_product(to_tokens_set(q))
	inverted_index_review = scorelists_with_terms_for_review(to_tokens_set(to_q_desc(q,descs)))

	return get_top_k_pids(inverted_index_product, inverted_index_review)

def filter_category_by_query(q, cat):
	return ["1234", "123", "12"]

def get_suggested_words(q_strings, k=5):
	q = " ".join(q_strings.split(","))

	current_app.logger.info(q)

	current_app.logger.info(to_tokens_set(q))

	cooccured_term_scorelist_dict = scorelists_with_terms_for_cooccurenceterm(list(to_tokens_set(q)))

	current_app.logger.info(cooccured_term_scorelist_dict)

	cooccured_terms_stemmed = get_cooccurred_terms(cooccured_term_scorelist_dict)

	current_app.logger.info(cooccured_terms_stemmed)

	l = ["strong", "cheap", "quality", "good", "durable", "fast", "cost-effecient", "new", "trendy", "affordable", "environmental", "safe", "reliable"]

	ran_perm = np.random.permutation(len(l))[:k]
	stock_desc = [l[int(i)] for i in ran_perm]

	if len(cooccured_terms_stemmed) <= k:
		cooccured_terms_stemmed =  cooccured_terms_stemmed + stock_desc

	return cooccured_terms_stemmed[:k]

def pack_pid_json(pids):
	products = products_with_pids(pids)
	convertkeyword = lambda x: 0. if x == "nan" else float(x)

	def convert_keywordscorelist(p):
		kwscorelisttmp = [int(x) for x in p.keywordscoredist.replace("[", "").replace("]", "").split(",")]
		kwscorelist = []
		for i in range(len(kwscorelisttmp) / 5):
			kwscorelist.append(kwscorelisttmp[i*5 : (i+1)*5])
		return kwscorelist
	return [{
	'productTitle': p.name,
	'price': p.price,
	'seller': p.seller_name if p.seller_name is not None else "",
	'desc': p.desc if p.desc is not None else "",
	'keywords': [] if p.keywords is None else p.keywords.split(","),
	'keywordscores': [] if p.keywordscores is None else [convertkeyword(x) for x in p.keywordscores.split(",")],
	'keywordscorelist': [] if p.keywordscoredist is None else convert_keywordscorelist(p),
	'rating': p.average_stars,
	'numRatings': p.num_ratings,
	'imgUrl': p.img_url,
	'asin': p.azn_product_id
	} for p in products]

##################################################################################################
# Views
##################################################################################################

@irsystem.route('/', methods=['GET'])
def search():
	query = request.args.get('search')
	if not query:
		data = []
		output_message = ''
	else:
		output_message = "Your search: " + query
		data = range(5)
	return render_template('search.html', name=project_name, netid=net_id, output_message=output_message, data=data)

@irsystem.route('search_page', methods=['GET'])
def search_page():
	initial_query = request.args.get('query')
	initial_descriptors = request.args.get('descriptors', [])
	if initial_query is None:
		return render_template('search.html')
	return render_template('search_results.html', query=initial_query, descriptors=initial_descriptors)

@irsystem.route('search', methods=['GET'])
def product_search():
	query = request.args.get('query')
	descriptors = request.args.get('descriptors', [])
	if not query:
		d = {
			'status': 400,
			'error_message': 'empty query provided'
		}
		return jsonify(d)

	category = classify_query(query.strip().lower())
	pids = filter_category_by_query(query, category)

	descs = descriptors.split(",")
	descs = [x.lower().strip() for x in descs]

	sorted_pids = get_top_products(query,descs)

	d = pack_pid_json(sorted_pids)
	return jsonify(data=d)

@irsystem.route('suggestions', methods=['GET'])
def suggested_words():
	query = request.args.get('query')
	current_app.logger.info(query)
	d = get_suggested_words(query)
	return jsonify(data=d)
