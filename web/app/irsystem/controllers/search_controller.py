from . import *
from app.irsystem.models.helpers import *
from app.irsystem.models.autocorrecthelper import autocorrect_query
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
from autocorrect import spell

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
	inverted_index_product, inverted_index_product_neg = scorelists_with_terms_for_product(to_tokens_set(q), to_tokens_set(" ".join(descs_neg)))
	if len(descs_pos) > 0:
		# not counting query for now. else should be to_q_desc(q, descs_pos)
		inverted_index_review_pos = scorelists_with_terms_for_review(to_tokens_set(to_q_desc("",descs_pos)))
	else:
		inverted_index_review_pos = scorelists_with_terms_for_review(to_tokens_set(to_q_desc(q,descs_pos)))
	# negative descriptors will be penalized
	inverted_index_review_neg = scorelists_with_terms_for_review(to_tokens_set(" ".join(descs_neg)))
	return get_top_k_pids(inverted_index_product, inverted_index_product_neg, inverted_index_review_pos, inverted_index_review_neg)

def filter_category_by_query(q, cat):
	return ["1234", "123", "12"]

# should be called when no products are returned
def autocorrect_product_query(q):
	autocorrect_query_list = autocorrect_query(q)
	suggested_query= "No results for \"" + q + "\" "
	if len(autocorrect_query_list) == 0:
		suggested_query += "No suggested queries. Please try again."
	elif " ".join(autocorrect_query_list) != q:
		suggested_query +=  "Did you mean to type \"" + " ".join(autocorrect_query_list) + "\"?"
	else:
		suggested_query += "Your query may be too specific. Try removing some words or moving them to descriptors!"

	return suggested_query

def find_overlap_between_pos_and_neg(desc_pos,desc_neg,decs_pos_neg_set):
	stemmer = SnowballStemmer("english")
	overlapping_term_list = list()
	for prestemtoken in to_tokens_set_no_stem(to_q_desc("",desc_pos)):
		if stemmer.stem(prestemtoken) in decs_pos_neg_set:
			overlapping_term_list.append(prestemtoken)

	error_message = "\"" + "\", \"".join(overlapping_term_list) + "\" was in both positive and negative descriptors. Please try again."
	return error_message

def pack_pid_json(pids_and_info, query, descs_pos):
	pid_term_reviewnum_dict = dict()

	if len(pids_and_info) >0 and isinstance(pids_and_info[0], tuple):
		pids = [info_tup[0] for info_tup in pids_and_info]
		for pid_info in pids_and_info:
			pid_term_reviewnum_dict[pid_info[0]] = pid_info[1]
	else:
		pids = pids_and_info

	stemmer = SnowballStemmer("english")
	reverse_stem_dict = dict()

	# depending on whether there are positive queries or not
	if len(descs_pos) > 0:
		q_d_string = to_q_desc("",descs_pos)
	else:
		q_d_string = to_q_desc(query, descs_pos)

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

	def get_descriptors_review_num(term_reviewnum_dict):
		descriptors_review_num_list = list()
		for stemmed_term in term_reviewnum_dict:
			if stemmed_term in reverse_stem_dict:
				descriptors_review_num_list.append(term_reviewnum_dict[stemmed_term])
		return descriptors_review_num_list

	p_json_list = [{
	'productTitle': p.name,
	'price': p.price,
	'seller': p.seller_name if p.seller_name is not None else "",
	'desc': p.desc if p.desc is not None else "",
	'keywords': [] if p.keywords is None else p.keywords.split(","),
	'keywordscores': [] if p.keywordscores is None else [convertkeyword(x) for x in p.keywordscores.split(",")],
	'keywordscorelist': [] if p.keywordscoredist is None else convert_keywordscorelist(p),
    'keywordssents':[] if p.keywordssents is None else p.keywordssents.split("||"),
	'descriptors': [] if p.azn_product_id not in pid_term_reviewnum_dict else get_descriptors(pid_term_reviewnum_dict[p.azn_product_id]),
	'descriptors_review_num': [] if p.azn_product_id not in pid_term_reviewnum_dict else get_descriptors_review_num(pid_term_reviewnum_dict[p.azn_product_id]),
	'rating': p.average_stars,
	'numRatings': p.num_ratings,
	'imgUrl': p.img_url,
	'asin': p.azn_product_id
	} for p in products]

	return p_json_list

##################################################################################################
# Views
##################################################################################################

@irsystem.route('/', methods=['GET'])
def search():
	return render_template('search.html')

@irsystem.route('search_page', methods=['GET'])
def search_page():
	initial_query = request.args.get('query')
	positive = request.args.get('positive', [])
	negative = request.args.get('negative', [])
	if initial_query is None:
		return render_template('search.html')
	return render_template('search_results.html', query=initial_query, positive=positive, negative=negative)

@irsystem.route('search', methods=['GET'])
def product_search():
	query = request.args.get('query')
	descriptors_pos = request.args.get('positive', "")
	descriptors_neg = request.args.get('negative', "")

	if not query:
		return jsonify(data=[], suggestions="Please enter a product query.")

	desc_pos = descriptors_pos.split(",") if descriptors_pos != "" else []
	desc_pos = [x.lower().strip() for x in desc_pos]

	desc_neg = descriptors_neg.split(",") if descriptors_neg != "" else []
	desc_neg = [x.lower().strip() for x in desc_neg]

	decs_pos_neg_set = to_tokens_set(to_q_desc("",desc_pos)).intersection(to_tokens_set(to_q_desc("",desc_neg)))
	# if there is a word in both positive and negative descriptor
	if len(decs_pos_neg_set) > 0:
		current_app.logger.info(find_overlap_between_pos_and_neg(desc_pos,desc_neg,decs_pos_neg_set))
		return jsonify(data=[], suggestions=find_overlap_between_pos_and_neg(desc_pos,desc_neg,decs_pos_neg_set))

	# ir ranking
	sorted_pids_and_info = get_top_products(query, desc_pos, desc_neg)

	if len(sorted_pids_and_info) == 0:
		current_app.logger.info(find_overlap_between_pos_and_neg(desc_pos,desc_neg,decs_pos_neg_set))
		return jsonify(data=[], suggestions=autocorrect_product_query(query))

	# only wanna show positive descriptors in results
	d = pack_pid_json(sorted_pids_and_info, query, desc_pos)

	if len(d) == 0:
		return jsonify(data=[], suggestions=autocorrect_product_query(query))

	return jsonify(data=d, suggestions="")

@irsystem.route('suggestions', methods=['GET'])
def suggested_words():
	query = request.args.get('query').split() if request.args.get('query') != "" else []
	positive = request.args.get('positive').split(
		',') if request.args.get('positive') != "" else []
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
	d, isReplaceInt = amrit_suggestions(query)
	return jsonify(data=d, replace = isReplaceInt, querystring=query)
