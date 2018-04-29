from . import *
from app.irsystem.models.helpers import *
from app.irsystem.models.get_suggestions import get_suggestions
from app.irsystem.models.helpers import NumpyEncoder as NumpyEncoder
from app.irsystem.models.product import products_with_pids
from app.irsystem.models.invertedindicesproduct import scorelists_with_terms_for_product
from app.irsystem.models.invertedindicesreview import scorelists_with_terms_for_review
from app.irsystem.models.cooccurenceterm import scorelists_with_terms_for_cooccurenceterm

from flask import jsonify
from flask import current_app
from app.irsystem.irhelpers.getpidhelper import *
from app.irsystem.models.cooc import get_cooc
import random
from datetime import datetime
import nltk
from nltk.stem.snowball import SnowballStemmer

project_name = "Amazen"
net_id = "Joo Ho Yeo (jy396) | Amritansh Kwatra (ak2244) | Alex Yoo (ay244) | Jay Chia (jc2375) | Charles Bai (cb674)"

###################################################################################################
# Placeholder functions
##################################################################################################
def amrit_suggestions(query):
	return get_suggestions(query)

def classify_query(q):
	return "electronics"

def get_top_products(q,descs_pos, descs_neg):
	inverted_index_product = scorelists_with_terms_for_product(to_tokens_set(q))
	inverted_index_review_pos = scorelists_with_terms_for_review(to_tokens_set(to_q_desc(q,descs_pos)))
	# negative descriptors will be penalized
	inverted_index_review_neg = scorelists_with_terms_for_review(to_tokens_set(" ".join(descs_neg)))
	return get_top_k_pids(inverted_index_product, inverted_index_review_pos, inverted_index_review_neg)

def filter_category_by_query(q, cat):
	return ["1234", "123", "12"]

def pack_pid_json(pids_and_info, q_d_string):
	pids = [info_tup[0] for info_tup in pids_and_info]

	pid_term_reviewnum_dict = dict()
	if len(pids) > 0 and len(pids[0]) > 1:
		for pid_info in pids_and_info:
			pid_term_reviewnum_dict[pid_info[0]] = pid_info[1]

	stemmer = SnowballStemmer("english")
	reverse_stem_dict = dict()
	for before_stem_word in to_tokens_set_no_stem(q_d_string):
		after_stem_word = stemmer.stem(before_stem_word)
		reverse_stem_dict[after_stem_word] = before_stem_word

	products = products_with_pids(pids)

	convertkeyword = lambda x: 0. if x == "nan" else float(x)

	def convert_keywordscorelist(p):
		kwscorelisttmp = [int(x) for x in p.keywordscoredist.replace("[", "").replace("]", "").split(",")]
		kwscorelist = []
		for i in range(len(kwscorelisttmp) / 5):
			kwscorelist.append(kwscorelisttmp[i*5 : (i+1)*5])
		return kwscorelist

	def get_descriptors(term_reviewnum_dict):
		before_stemmed_descs_list = list()
		for stemmed_term in term_reviewnum_dict:
			if stemmed_term in reverse_stem_dict:
				before_stemmed_descs_list.append(reverse_stem_dict[stemmed_term])

		return before_stemmed_descs_list

	def get_descitptors_review_num(term_reviewnum_dict):
		descitptors_review_num_list = list()
		for stemmed_term in term_reviewnum_dict:
			if stemmed_term in reverse_stem_dict:
				descitptors_review_num_list.append(term_reviewnum_dict[stemmed_term])

		return descitptors_review_num_list

	return [{
	'productTitle': p.name,
	'price': p.price,
	'seller': p.seller_name if p.seller_name is not None else "",
	'desc': p.desc if p.desc is not None else "",
	'keywords': [] if p.keywords is None else p.keywords.split(","),
	'keywordscores': [] if p.keywordscores is None else [convertkeyword(x) for x in p.keywordscores.split(",")],
	'keywordscorelist': [] if p.keywordscoredist is None else convert_keywordscorelist(p),
	'descriptors': [] if p.azn_product_id not in pid_term_reviewnum_dict else get_descriptors(pid_term_reviewnum_dict[p.azn_product_id]),
	'descitptors_review_num': [] if p.azn_product_id not in pid_term_reviewnum_dict else get_descitptors_review_num(pid_term_reviewnum_dict[p.azn_product_id]),
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

	#jooho: dummy code
	descriptors_pos= []
	descriptors_neg= []

	if not query:
		d = {
			'status': 400,
			'error_message': 'empty query provided'
		}
		return jsonify(d)

	category = classify_query(query.strip().lower())
	pids = filter_category_by_query(query, category)

	decs_pos = descriptors_pos.split(",")
	decs_pos = [x.lower().strip() for x in decs_pos]

	decs_neg = descriptors_neg.split(",")
	decs_neg = [x.lower().strip() for x in decs_neg]
	# descs = descriptors.split(",")
	# descs = [x.lower().strip() for x in descs]

	# ir ranking
	sorted_pids_and_info = get_top_products(query,decs_pos, decs_neg)

	# only wanna show positive descriptors in results
	d = pack_pid_json(sorted_pids_and_info, to_q_desc(query,decs_pos))
	return jsonify(data=d)

@irsystem.route('suggestions', methods=['GET'])
def suggested_words():
	query = request.args.get('query').split() if request.args.get('query') != "" else []
	positive = request.args.get('positive').split(
		',')if request.args.get('positive') != "" else []
	negative = request.args.get('negative').split(
		',') if request.args.get('negative') != "" else []
	neutral = request.args.get('neutral').split(
		',') if request.args.get('neutral') != "" else []
	d = get_cooc(query + positive, negative, neutral, 1.5, 1.5, 1000)
	return jsonify(data=d)

@irsystem.route('query_suggestions', methods=['GET'])
def suggested_query():
	query = request.args.get('query')
	if query is None:
		return None
	d = amrit_suggestions(query)
	return jsonify(data=d, querystring=query)
