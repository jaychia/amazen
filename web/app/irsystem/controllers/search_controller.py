from . import *
from app.irsystem.models.helpers import *
from app.irsystem.models.helpers import NumpyEncoder as NumpyEncoder
from app.irsystem.models.product import products_with_pids
from flask import jsonify
from flask import current_app

project_name = "Amazen"
net_id = "Joo Ho Yeo (jy396) | Amritansh Kwatra (ak2244) | Alex Yoo (ay244) | Jay Chia (jc2375) | Charles Bai (cb674)"

###################################################################################################
# Placeholder functions
##################################################################################################
def classify_query(q):
	return "electronics"

def get_top_products(q,descs,cats,k2,k3):
	return top_k_pids(q, descs, cats, k2, k3)

def filter_category_by_query(q, cat):
	return ["1234", "123", "12"]

def rank_pids_with_desc(descs, pid):
	return ["1234", "123", "12"]

def pack_pid_json(pids):
	products = products_with_pids(pids)
	return [{'product_id': p.azn_product_id,
			'ratings': 5.0, #TODO: Update
			'keywords': ['Hello', 'Goodbye'], #TODO: Update
			'keywordscores': [4.0, 2.0], #TODO: Update
			'price': p.price,
			'name': p.name,
			'seller_name': p.seller_name} for p in products]

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
	if not (descriptors is None):
		descriptors = descriptors.split(",")
		descriptors = [x.lower().strip() for x in descriptors]
		sorted_pids = rank_pids_with_desc(descriptors, pids)
	else:
		sorted_pids = pids
	d = pack_pid_json(sorted_pids)
	return jsonify(d)
